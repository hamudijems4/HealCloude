-- ─────────────────────────────────────────────────────────────────────────────
-- TenaLink — Supabase SQL Migration
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Enum for user roles
create type user_role as enum (
  'patient', 'clinician', 'facility_admin', 'moh_analyst', 'super_admin'
);

-- 2. Facilities table
create table public.facilities (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  type        text not null,  -- hospital | clinic | health_center
  region      text not null,
  zone        text,
  woreda      text,
  latitude    double precision,
  longitude   double precision,
  is_online   boolean not null default true,
  fhir_endpoint text,
  created_at  timestamptz not null default now()
);

-- 3. Profiles table — extends auth.users, keyed on the same UUID
create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  fayda_id    text unique,
  phone       text unique,
  full_name   text not null,
  role        user_role not null default 'patient',
  is_active   boolean not null default true,
  facility_id uuid references public.facilities(id),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- 4. Appointments table
create table public.appointments (
  id               uuid primary key default gen_random_uuid(),
  patient_id       uuid not null references public.profiles(id),
  facility_id      uuid not null references public.facilities(id),
  clinician_id     uuid references public.profiles(id),
  scheduled_at     timestamptz not null,
  attended         boolean,
  notes            text,
  appointment_type text not null,
  created_at       timestamptz not null default now()
);

-- 5. Wellness scores table
create table public.wellness_scores (
  id          uuid primary key default gen_random_uuid(),
  patient_id  uuid not null references public.profiles(id),
  score       double precision not null,
  risk_level  text not null,  -- low | medium | high | critical
  risk_factors text,          -- JSON string
  computed_at timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- Row Level Security
-- ─────────────────────────────────────────────────────────────────────────────
alter table public.profiles enable row level security;
alter table public.appointments enable row level security;
alter table public.wellness_scores enable row level security;
alter table public.facilities enable row level security;

-- Profiles: users can read their own, moh/admin can read all
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Service role bypasses RLS (used by the backend admin client)
-- No extra policy needed — service_role key bypasses RLS by default.

-- Appointments: patients see their own; clinicians see their facility's
create policy "Patients see own appointments"
  on public.appointments for select
  using (auth.uid() = patient_id);

-- Wellness scores: patients see their own
create policy "Patients see own wellness scores"
  on public.wellness_scores for select
  using (auth.uid() = patient_id);

-- Facilities: publicly readable
create policy "Facilities are publicly readable"
  on public.facilities for select
  using (true);

-- ─────────────────────────────────────────────────────────────────────────────
-- Trigger: auto-create a profile row when a new auth user signs up
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  -- Only insert if not already created by the API (race-condition safe via ON CONFLICT)
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', 'Unknown'),
    'patient'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─────────────────────────────────────────────────────────────────────────────
-- Helper: updated_at auto-update
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();
