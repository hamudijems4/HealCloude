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
      else set({ profile: null, loading: false });
    });
  },

  loadProfile: async (userId: string) => {
    // Retry up to 3 times — session propagation can be async
    for (let i = 0; i < 3; i++) {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, role, fayda_id, phone, region, woreda, facility_id, gender, date_of_birth, avatar_url')
        .eq('id', userId)
        .single();
      if (data) { set({ profile: data as Profile }); return; }
      if (error?.code === 'PGRST116') break; // row not found — no point retrying
      await new Promise(r => setTimeout(r, 400));
    }
  },

  signIn: async (email: string, password: string) => {
    const identifier = email.trim();
    const isEmail = identifier.includes('@');

    if (isEmail) {
      const { data, error } = await supabase.auth.signInWithPassword({ email: identifier, password });
      if (error) return error.message;
      // Store session immediately so loadProfile has auth context
      if (data.session) set({ session: data.session, user: data.user });
      return null;
    }

    try {
      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });
      const data = await res.json();
      if (!res.ok) return data.detail ?? 'Login failed';

      const { data: sessionData, error } = await supabase.auth.setSession({
        access_token:  data.access_token,
        refresh_token: data.refresh_token,
      });
      if (error) return error.message;
      if (sessionData.session) set({ session: sessionData.session, user: sessionData.user });
      return null;
    } catch {
      return 'Backend unavailable — please use your email address to log in.';
    }
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null, profile: null });
  },
}));
