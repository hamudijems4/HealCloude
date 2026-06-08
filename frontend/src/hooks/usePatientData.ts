import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';

interface WellnessScore {
  score: number;
  risk_level: string;
  risk_factors: Record<string, unknown> | null;
  ai_notes: string | null;
  computed_at: string;
}

interface Appointment {
  id: string;
  scheduled_at: string;
  appointment_type: string;
  status: string;
  ai_scheduled: boolean;
  facilities: { name: string } | null;
}

interface PatientData {
  wellness: WellnessScore | null;
  nextAppointment: Appointment | null;
  loading: boolean;
}

export function usePatientData(): PatientData {
  const { profile } = useAuthStore();
  const [wellness, setWellness]               = useState<WellnessScore | null>(null);
  const [nextAppointment, setNextAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading]                 = useState(true);

  useEffect(() => {
    if (!profile?.id) return;

    const fetchAll = async () => {
      setLoading(true);

      const [wsRes, apptRes] = await Promise.all([
        supabase
          .from('wellness_scores')
          .select('score, risk_level, risk_factors, ai_notes, computed_at')
          .eq('patient_id', profile.id)
          .order('computed_at', { ascending: false })
          .limit(1)
          .single(),

        supabase
          .from('appointments')
          .select('id, scheduled_at, appointment_type, status, ai_scheduled, facilities(name)')
          .eq('patient_id', profile.id)
          .in('status', ['scheduled', 'confirmed'])
          .gte('scheduled_at', new Date().toISOString())
          .order('scheduled_at', { ascending: true })
          .limit(1)
          .single(),
      ]);

      if (wsRes.data)   setWellness(wsRes.data);
      if (apptRes.data) setNextAppointment(apptRes.data as unknown as Appointment);
      setLoading(false);
    };

    fetchAll();
  }, [profile?.id]);

  return { wellness, nextAppointment, loading };
}
