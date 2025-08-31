import { createClient } from '@supabase/supabase-js';

// The Supabase URL and Key are placed here directly.
const supabaseUrl = "https://vjdsijuyzhhlofmlzexe.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqZHNpanV5emhobG9mbWx6ZXhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4NzcwNDQsImV4cCI6MjA3MTQ1MzA0NH0.T7pK7N0whtHSkXIXcttNFfyQMqtHlIQbVhYAe7s6UrM";

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
