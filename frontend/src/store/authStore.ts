import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';
import type { Role } from '../rbac/permissions';

const API = 'http://localhost:8000/api/v1';

interface Profile {
  id: string;
  full_name: string;
  role: Role;
  fayda_id: string | null;
  phone: string | null;
  region: string | null;
  woreda: string | null;
  facility_id: string | null;
  gender: string | null;
  date_of_birth: string | null;
  avatar_url: string | null;
}

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
  loadProfile: (userId: string) => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  profile: null,
  loading: true,

  initialize: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      set({ user: session.user, session });
      await get().loadProfile(session.user.id);
    }
    set({ loading: false });

    supabase.auth.onAuthStateChange(async (_event, session) => {
      set({ user: session?.user ?? null, session });
      if (session?.user) await get().loadProfile(session.user.id);
      else set({ profile: null });
    });
  },

  loadProfile: async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('id, full_name, role, fayda_id, phone, region, woreda, facility_id, gender, date_of_birth, avatar_url')
      .eq('id', userId)
      .single();
    if (data) set({ profile: data as Profile });
  },

  signIn: async (email: string, password: string) => {
    const identifier = email.trim();
    const isEmail = identifier.includes('@');

    // --- DEMO BYPASS ---
    if (identifier.includes('cloudheal.et') && password === 'Demo@2024') {
      const prefix = identifier.split('@')[0].toLowerCase();
      let role = 'clinic';
      let name = 'Dr. Demo';
      if (prefix === 'moh')   { role = 'moh';     name = 'MoH Analyst'; }
      if (prefix === 'ngo')   { role = 'ngo';     name = 'NGO Analyst'; }
      if (prefix === 'almaz') { role = 'patient'; name = 'Almaz T.'; }

      set({
        user: { id: 'demo-id', email: identifier } as any,
        session: { access_token: 'demo-token' } as any,
        profile: {
          id: 'demo-id',
          full_name: name,
          role: role as any,
          fayda_id: 'ET000000',
          facility_id: 'fac-1',
          region: 'Addis Ababa',
          woreda: 'Bole'
        } as any,
      });
      return null;
    }
    // -------------------

    // Pure email login — go direct to Supabase (faster, no backend needed)
    if (isEmail) {
      const { error } = await supabase.auth.signInWithPassword({ email: identifier, password });
      return error ? error.message : null;
    }

    // Fayda ID (ET + digits) or phone — hit the backend which resolves to email
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });
      const data = await res.json();
      if (!res.ok) return data.detail ?? 'Login failed';

      // Backend returned tokens — hydrate Supabase session so the rest of the
      // app (RLS, realtime) works normally
      const { error } = await supabase.auth.setSession({
        access_token:  data.access_token,
        refresh_token: data.refresh_token,
      });
      return error ? error.message : null;
    } catch {
      return 'Backend unavailable — please use your email address to log in.';
    }
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null, profile: null });
  },
}));
