import { createClient } from "@supabase/supabase-js";

// This is the correct way to read environment variables in a Vite project.
// Vercel will provide these values to your application during the build process.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY as string;

// This check will help you know if the variables are missing.
if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL or Anon Key is missing. Make sure to set them in your Vercel project settings and redeploy.");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
