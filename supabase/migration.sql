-- ═══════════════════════════════════════════════════════════════════════════
-- CLOUDHEAL — Full Supabase Migration v2
-- Run in: Supabase Dashboard → SQL Editor → New Query → RUN
-- ═══════════════════════════════════════════════════════════════════════════

-- ── 1. Extensions ──────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm";

-- ── 2. Enums ────────────────────────────────────────────────────────────────
do $$ begin
  create type user_role as enum (
    'patient','clinician','clinic','facility_admin','moh_analyst','moh','ngo_analyst','ngo','super_admin'
  );
exception when duplicate_object then null; end $$;

do $$ begin alter type user_role add value if not exists 'clinic';
exception when others then null; end $$;

do $$ begin alter type user_role add value if not exists 'moh';
exception when others then null; end $$;

do $$ begin alter type user_role add value if not exists 'ngo';
exception when others then null; end $$;

do $$ begin
  create type risk_level as enum ('low','medium','high','critical');
exception when duplicate_object then null; end $$;

do $$ begin
  create type appointment_status as enum (
    'scheduled','confirmed','attended','missed','cancelled'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type notification_channel as enum ('sms','ussd','push','email');
exception when duplicate_object then null; end $$;

-- ── 3. Facilities ───────────────────────────────────────────────────────────
create table if not exists public.facilities (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  type          text not null check (type in ('hospital','clinic','health_center','health_post')),
  region        text not null,
  zone          text,
  woreda        text,
  latitude      double precision,
  longitude     double precision,
  is_online     boolean not null default true,
  fhir_endpoint text,
  phone         text,
  created_at    timestamptz not null default now()
);

-- ── 4. Profiles ─────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  fayda_id      text unique,
  phone         text unique,
  full_name     text not null,
  date_of_birth date,
  gender        text check (gender in ('male','female','other')),
  role          user_role not null default 'patient',
  is_active     boolean not null default true,
  facility_id   uuid references public.facilities(id),
  region        text,
  woreda        text,
  avatar_url    text,
  preferred_lang text not null default 'en' check (preferred_lang in ('en','am','om','ti')),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ── 5. Appointments ─────────────────────────────────────────────────────────
create table if not exists public.appointments (
  id               uuid primary key default gen_random_uuid(),
  patient_id       uuid not null references public.profiles(id) on delete cascade,
  facility_id      uuid not null references public.facilities(id),
  clinician_id     uuid references public.profiles(id),
  scheduled_at     timestamptz not null,
  status           appointment_status not null default 'scheduled',
  notes            text,
  appointment_type text not null,
  ai_scheduled     boolean not null default false,
  ussd_notified    boolean not null default false,
  sms_sent_at      timestamptz,
  created_at       timestamptz not null default now()
);

-- ── 6. Wellness Scores ──────────────────────────────────────────────────────
create table if not exists public.wellness_scores (
  id           uuid primary key default gen_random_uuid(),
  patient_id   uuid not null references public.profiles(id) on delete cascade,
  score        double precision not null check (score between 0 and 100),
  risk_level   risk_level not null,
  risk_factors jsonb,
  ai_notes     text,
  computed_at  timestamptz not null default now()
);

-- ── 7. USSD Sessions ────────────────────────────────────────────────────────
create table if not exists public.ussd_sessions (
  id           uuid primary key default gen_random_uuid(),
  session_id   text not null unique,
  phone        text not null,
  patient_id   uuid references public.profiles(id),
  lang         text not null default 'en',
  input        text,
  response     text,
  duration_sec integer,
  created_at   timestamptz not null default now()
);

-- ── 8. Disease Alerts ───────────────────────────────────────────────────────
create table if not exists public.disease_alerts (
  id           uuid primary key default gen_random_uuid(),
  region       text not null,
  zone         text,
  disease      text not null,
  severity     text not null check (severity in ('watch','warning','critical')),
  case_count   integer not null default 0,
  trend_pct    double precision default 0,
  latitude     double precision,
  longitude    double precision,
  alert_date   date not null default current_date,
  resolved     boolean not null default false,
  created_at   timestamptz not null default now()
);

-- ── 9. FHIR Resources (MongoDB-style JSON storage) ─────────────────────────
create table if not exists public.fhir_resources (
  id            uuid primary key default gen_random_uuid(),
  patient_id    uuid not null references public.profiles(id) on delete cascade,
  resource_type text not null,
  resource_id   text not null,
  payload       jsonb not null,
  source_facility uuid references public.facilities(id),
  synced_at     timestamptz not null default now(),
  unique(patient_id, resource_type, resource_id)
);

-- ── 10. Notification Log ────────────────────────────────────────────────────
create table if not exists public.notifications (
  id           uuid primary key default gen_random_uuid(),
  patient_id   uuid not null references public.profiles(id) on delete cascade,
  channel      notification_channel not null,
  message      text not null,
  sent         boolean not null default false,
  sent_at      timestamptz,
  created_at   timestamptz not null default now()
);

-- ── 11. Indexes ──────────────────────────────────────────────────────────────
create index if not exists idx_profiles_fayda       on public.profiles(fayda_id);
create index if not exists idx_profiles_role        on public.profiles(role);
create index if not exists idx_profiles_region      on public.profiles(region);
create index if not exists idx_appt_patient         on public.appointments(patient_id);
create index if not exists idx_appt_scheduled       on public.appointments(scheduled_at);
create index if not exists idx_wellness_patient     on public.wellness_scores(patient_id);
create index if not exists idx_alerts_region        on public.disease_alerts(region);
create index if not exists idx_alerts_severity      on public.disease_alerts(severity);
create index if not exists idx_fhir_patient         on public.fhir_resources(patient_id);
create index if not exists idx_fhir_type            on public.fhir_resources(resource_type);
create index if not exists idx_notif_patient        on public.notifications(patient_id);
create index if not exists idx_ussd_phone           on public.ussd_sessions(phone);

-- ── 12. Row Level Security ───────────────────────────────────────────────────
alter table public.profiles         enable row level security;
alter table public.appointments     enable row level security;
alter table public.wellness_scores  enable row level security;
alter table public.facilities       enable row level security;
alter table public.disease_alerts   enable row level security;
alter table public.ussd_sessions    enable row level security;
alter table public.fhir_resources   enable row level security;
alter table public.notifications    enable row level security;

-- Drop existing policies before recreating (idempotent)
drop policy if exists "Users read own profile"             on public.profiles;
drop policy if exists "Users update own profile"           on public.profiles;
drop policy if exists "Service role full access on profiles" on public.profiles;
drop policy if exists "Patients see own appointments"      on public.appointments;
drop policy if exists "Service role full access on appointments" on public.appointments;
drop policy if exists "Patients see own wellness"          on public.wellness_scores;
drop policy if exists "Service role full access on wellness" on public.wellness_scores;
drop policy if exists "Facilities publicly readable"       on public.facilities;
drop policy if exists "Disease alerts publicly readable"   on public.disease_alerts;
drop policy if exists "Patients see own FHIR"              on public.fhir_resources;
drop policy if exists "Service role full access on fhir"   on public.fhir_resources;
drop policy if exists "Patients see own notifications"     on public.notifications;

create policy "Users read own profile"
  on public.profiles for select using (auth.uid() = id);
create policy "Users update own profile"
  on public.profiles for update using (auth.uid() = id);
create policy "Service role full access on profiles"
  on public.profiles for all using (auth.role() = 'service_role');

create policy "Patients see own appointments"
  on public.appointments for select using (auth.uid() = patient_id);
create policy "Service role full access on appointments"
  on public.appointments for all using (auth.role() = 'service_role');

create policy "Patients see own wellness"
  on public.wellness_scores for select using (auth.uid() = patient_id);
create policy "Service role full access on wellness"
  on public.wellness_scores for all using (auth.role() = 'service_role');

create policy "Facilities publicly readable"
  on public.facilities for select using (true);

create policy "Disease alerts publicly readable"
  on public.disease_alerts for select using (true);

create policy "Patients see own FHIR"
  on public.fhir_resources for select using (auth.uid() = patient_id);
create policy "Service role full access on fhir"
  on public.fhir_resources for all using (auth.role() = 'service_role');

create policy "Patients see own notifications"
  on public.notifications for select using (auth.uid() = patient_id);

-- ── 13. Triggers ────────────────────────────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', 'Unknown'),
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'patient')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

-- ── 17. Seed: Facilities ────────────────────────────────────────────────────
insert into public.facilities (name, type, region, zone, woreda, latitude, longitude)
values
  ('Black Lion Specialized Hospital',  'hospital',      'Addis Ababa', 'Addis Ababa', 'Gulele',    9.0302, 38.7468),
  ('St. Paul Hospital',                'hospital',      'Addis Ababa', 'Addis Ababa', 'Gulele',    9.0411, 38.7578),
  ('Tikur Anbessa Hospital',           'hospital',      'Addis Ababa', 'Addis Ababa', 'Kirkos',    9.0227, 38.7526),
  ('Adwa Health Center',               'health_center', 'Tigray',      'Central',     'Adwa',     14.1690, 38.8960),
  ('Mekelle General Hospital',         'hospital',      'Tigray',      'Central',     'Mekelle',  13.4970, 39.4770),
  ('Hawassa University Hospital',      'hospital',      'Sidama',      'Hawassa',     'Hawassa',   7.0550, 38.4770),
  ('Gondar University Hospital',       'hospital',      'Amhara',      'North Gondar','Gondar',   12.6080, 37.4610),
  ('Jimma University Hospital',        'hospital',      'Oromia',      'Jimma',       'Jimma',     7.6750, 36.8340),
  ('Nekemte Referral Hospital',        'hospital',      'Oromia',      'East Wollega','Nekemte',   9.0880, 36.5490),
  ('Assosa General Hospital',          'hospital',      'Benishangul', 'Assosa',      'Assosa',   10.0650, 34.5350),
  ('Gambella Regional Hospital',       'hospital',      'Gambella',    'Gambella',    'Gambella',  8.2520, 34.5890),
  ('Dire Dawa Referral Hospital',      'hospital',      'Dire Dawa',   'Dire Dawa',   'Dire Dawa', 9.5930, 41.8620),
  ('Harar Regional Hospital',          'hospital',      'Harari',      'Harari',      'Harar',     9.3120, 42.1180),
  ('Jijiga General Hospital',          'hospital',      'Somali',      'Erer',        'Jijiga',    9.3500, 42.7900),
  ('Semera Regional Hospital',         'hospital',      'Afar',        'Zone 1',      'Semera',   11.7930, 41.0110),
  ('Arba Minch General Hospital',      'hospital',      'SNNPR',       'Gamo',        'Arba Minch',6.0380, 37.5500)
on conflict do nothing;

-- ── 15. Patch existing tables (safe to re-run) ────────────────────────────
alter table public.profiles         add column if not exists preferred_lang text not null default 'en' check (preferred_lang in ('en','am','om','ti'));
alter table public.appointments     add column if not exists sms_sent_at timestamptz;
alter table public.ussd_sessions    add column if not exists lang         text not null default 'en';
alter table public.ussd_sessions    add column if not exists duration_sec integer;
alter table public.disease_alerts   add column if not exists trend_pct    double precision default 0;
alter table public.disease_alerts   add column if not exists latitude     double precision;
alter table public.disease_alerts   add column if not exists longitude    double precision;

-- ── 16. Demo profiles ───────────────────────────────────────────────────────
-- Create users in: Dashboard → Authentication → Users
-- Emails: moh@cloudheal.et, clinic@cloudheal.et, ngo@cloudheal.et, almaz@cloudheal.et
-- Password: Demo@2024, then run:

-- MoH Analyst
update public.profiles set
  full_name = 'Tigist Haile', role = 'moh',
  fayda_id = 'ET0000000001', phone = '+251911000001',
  gender = 'female', region = 'Addis Ababa'
where id = (select id from auth.users where email = 'moh@cloudheal.et');

-- Clinic
update public.profiles set
  full_name = 'Dr. Kebede Alemu', role = 'clinic',
  fayda_id = 'ET0000000002', phone = '+251911000002',
  gender = 'male', region = 'Addis Ababa',
  facility_id = (select id from public.facilities where name = 'Black Lion Specialized Hospital' limit 1)
where id = (select id from auth.users where email = 'clinic@cloudheal.et');

-- NGO Analyst
update public.profiles set
  full_name = 'Sara Johnson', role = 'ngo',
  fayda_id = 'ET0000000003', phone = '+251911000003',
  gender = 'female', region = 'Addis Ababa'
where id = (select id from auth.users where email = 'ngo@cloudheal.et');

-- Patient
update public.profiles set
  full_name = 'Almaz Tesfaye', role = 'patient',
  fayda_id = 'ET8823710293', phone = '+251922334455',
  gender = 'female', date_of_birth = '1996-03-15',
  region = 'Tigray', woreda = 'Adwa'
where id = (select id from auth.users where email = 'almaz@cloudheal.et');

-- ── 18. Seed: Wellness scores ───────────────────────────────────────────────
insert into public.wellness_scores (patient_id, score, risk_level, risk_factors, ai_notes)
select p.id, 62.5, 'medium',
  '{"missed_followups":2,"low_iron":true,"gestational_age_weeks":32}'::jsonb,
  'Patient is 32 weeks pregnant. Missed 2 prenatal follow-ups. Low iron (Hgb 9.8). Recommend immediate scheduling.'
from public.profiles p where p.fayda_id = 'ET8823710293'
on conflict do nothing;

-- ── 19. Seed: Appointments ──────────────────────────────────────────────────
insert into public.appointments (patient_id, facility_id, scheduled_at, status, appointment_type, ai_scheduled, ussd_notified)
select
  p.id,
  f.id,
  (now() + interval '10 days')::timestamptz,
  'confirmed',
  'Prenatal Check',
  true,
  true
from public.profiles p, public.facilities f
where p.fayda_id = 'ET8823710293'
  and f.name = 'Adwa Health Center'
on conflict do nothing;

-- ── 20. Seed: Disease alerts ────────────────────────────────────────────────
-- Add new columns if table already existed from a previous run
alter table public.disease_alerts add column if not exists trend_pct  double precision default 0;
alter table public.disease_alerts add column if not exists latitude   double precision;
alter table public.disease_alerts add column if not exists longitude  double precision;

insert into public.disease_alerts (region, zone, disease, severity, case_count, trend_pct, latitude, longitude, alert_date)
values
  ('Oromia',     'East Hararghe', 'Acute Watery Diarrhea', 'critical', 342, 18.0,  9.30, 42.12, current_date - 1),
  ('Amhara',     'South Gondar',  'Malaria',               'critical', 289, 12.0, 11.90, 37.85, current_date - 3),
  ('Tigray',     'Southern',      'Malnutrition',          'critical', 267,  9.0, 13.07, 39.48, current_date - 4),
  ('Somali',     'Fafan',         'Malnutrition',          'critical', 310, 22.0,  9.55, 44.07, current_date - 2),
  ('Gambella',   'Nuer',          'Malaria',               'warning',  198, 15.0,  8.25, 34.59, current_date - 1),
  ('Afar',       'Zone 2',        'Measles',               'warning',   87,  7.0, 12.50, 41.50, current_date - 7),
  ('SNNPR',      'Wolayita',      'Tuberculosis',          'warning',  134,  4.0,  6.85, 37.75, current_date - 14),
  ('Benishangul','Metekel',       'Malaria',               'watch',     76,  3.0, 10.75, 35.55, current_date - 5)
on conflict do nothing;

-- ── 21. Seed: USSD sessions ─────────────────────────────────────────────────
insert into public.ussd_sessions (session_id, phone, lang, input, response, duration_sec)
values
  ('SESS001', '+251922334455', 'am', '1 → 1', 'Confirmed appointment',    72),
  ('SESS002', '+251944556677', 'en', '3',      'Wellness score viewed',    28),
  ('SESS003', '+251911223344', 'en', '2 → 3', 'All appointments listed',  45),
  ('SESS004', '+251933445566', 'en', '4',      'Emergency info accessed',  18),
  ('SESS005', '+251977001122', 'am', '5 → 2', 'Language → Amharic',       12)
on conflict do nothing;

-- ── 22. Seed: Notifications ─────────────────────────────────────────────────
insert into public.notifications (patient_id, channel, message, sent, sent_at)
select p.id, 'sms',
  'CloudHeal: ቀጠሮዎ በ15 ሰኔ 2025 9:00 ጠ.ቀ. ነው - አድዋ ጤና ጣቢያ። Reply 1 to confirm.',
  true, now() - interval '2 hours'
from public.profiles p where p.fayda_id = 'ET8823710293'
on conflict do nothing;
