import { createClient } from '@supabase/supabase-js';

// This is the correct way to read environment variables in a Vite project.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// This will log a warning instead of crashing the app if the keys are missing.
if (!supabaseUrl || !supabaseKey) {
  console.warn("Supabase URL or Anon Key is missing. Make sure to set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables.");
}

export const supabase = createClient(supabaseUrl || '', supabaseKey || '');
