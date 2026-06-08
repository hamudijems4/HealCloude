import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://qoxipedwkwibsijuyiou.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFveGlwZWR3a3dpYnNpanV5aW91Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3ODkzNjMsImV4cCI6MjA5NjM2NTM2M30.1WlVVjPtK_YnIQS1n0xp8zuRQvRm_UNbnJO4iSOKwck';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
