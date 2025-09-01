@@ -1,51 +1,56 @@
-- EventEase Supabase Schema (Firebase Auth Integration)
-- This schema is designed to work with an external authentication provider like Firebase.
-- User profiles are created and managed from the application code.

-- ----------------------------------------------------------------
-- 1. EXTENSIONS & TYPES
-- ----------------------------------------------------------------

-- Enable the pgcrypto extension for UUID generation if not already enabled.
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

-- Conditionally create custom types only if they don't already exist.
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE public.user_role AS ENUM ('attendee', 'organizer', 'sponsor', 'admin');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'event_status') THEN
        CREATE TYPE public.event_status AS ENUM ('draft', 'published', 'ongoing', 'completed', 'cancelled');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'lead_status') THEN
        CREATE TYPE public.lead_status AS ENUM ('new', 'contacted', 'qualified', 'converted');
    END IF;
END$$;


-- ----------------------------------------------------------------
-- 2. TABLES
-- ----------------------------------------------------------------

-- Create tables only if they do not already exist.
CREATE TABLE IF NOT EXISTS public.profiles (
  -- The 'id' is the Primary Key and will be populated with the Firebase Auth user's UID.
  id UUID PRIMARY KEY,
  -- CORRECTED: Changed from UUID to TEXT to store Firebase UIDs.
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role user_role NOT NULL DEFAULT 'attendee',
  plan TEXT DEFAULT 'free',
  company TEXT,
  title TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  -- Added for consistency
  created_at TIMESTAMPTZ DEFAULT NOW(),
  email TEXT
);
COMMENT ON TABLE public.profiles IS 'Stores public profile information for each user, linked by Firebase UID.';

CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  organizer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  -- CORRECTED: Changed organizer_id to TEXT to match profiles.id
  organizer_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  full_description TEXT,
@@ -78,7 +83,8 @@
CREATE TABLE IF NOT EXISTS public.attendees (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  -- CORRECTED: Changed user_id to TEXT
  user_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  ticket_type_id UUID NOT NULL REFERENCES public.ticket_types(id) ON DELETE CASCADE,
  registration_date TIMESTAMPTZ DEFAULT NOW(),
  check_in_status TEXT DEFAULT 'pending',
@@ -154,7 +160,8 @@
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  author_id UUID REFERENCES public.profiles(id),
  -- CORRECTED: Changed author_id to TEXT
  author_id TEXT REFERENCES public.profiles(id),
  published_date DATE,
  category TEXT,
  image_url TEXT,
@@ -184,7 +191,8 @@

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  -- CORRECTED: Changed user_id to TEXT
  user_id TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT,
  is_read BOOLEAN DEFAULT FALSE,
@@ -193,17 +201,20 @@


-- ----------------------------------------------------------------
-- 3. ROW LEVEL SECURITY (RLS) - PUBLIC ACCESS ONLY
-- 3. ROW LEVEL SECURITY (RLS)
-- ----------------------------------------------------------------

-- Enable RLS on all tables
-- Enable RLS on all relevant tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_types ENABLE ROW LEVEL SECURITY;
-- (Enable for other tables as needed)

-- RLS Policies that DON'T depend on Supabase Auth can remain.
-- You can add more specific rules here later that work with Firebase JWTs.
-- **NEW POLICY**: Allows new users to be created.
DROP POLICY IF EXISTS "Public profiles are writable." ON public.profiles;
CREATE POLICY "Public profiles are writable."
ON public.profiles FOR INSERT
WITH CHECK (true);

-- Allow public read access on certain tables.
DROP POLICY IF EXISTS "Allow public read access to profiles" ON public.profiles;
