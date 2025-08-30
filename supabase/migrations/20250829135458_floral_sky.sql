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
  username TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role user_role NOT NULL DEFAULT 'attendee',
  plan TEXT DEFAULT 'free',
  company TEXT,
  title TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
COMMENT ON TABLE public.profiles IS 'Stores public profile information for each user, linked by Firebase UID.';

CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  organizer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  full_description TEXT,
  category TEXT,
  event_date DATE,
  start_time TIME,
  end_time TIME,
  venue_name TEXT,
  venue_address TEXT,
  image_url TEXT,
  status event_status NOT NULL DEFAULT 'draft',
  visibility TEXT DEFAULT 'public',
  max_attendees INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ticket_types (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  quantity INTEGER NOT NULL,
  sale_start_date TIMESTAMPTZ,
  sale_end_date TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS public.attendees (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  ticket_type_id UUID NOT NULL REFERENCES public.ticket_types(id) ON DELETE CASCADE,
  registration_date TIMESTAMPTZ DEFAULT NOW(),
  check_in_status TEXT DEFAULT 'pending',
  payment_status TEXT DEFAULT 'completed'
);

CREATE TABLE IF NOT EXISTS public.speakers (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  name TEXT NOT NULL,
  title TEXT,
  company TEXT,
  bio TEXT,
  full_bio TEXT,
  image_url TEXT,
  expertise TEXT[],
  location TEXT,
  rating NUMERIC(2, 1),
  social_links JSONB,
  featured BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS public.event_speakers (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  speaker_id UUID NOT NULL REFERENCES public.speakers(id) ON DELETE CASCADE,
  UNIQUE(event_id, speaker_id)
);

CREATE TABLE IF NOT EXISTS public.sponsors (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  name TEXT NOT NULL,
  logo_url TEXT,
  tier TEXT,
  website TEXT,
  industry TEXT
);

CREATE TABLE IF NOT EXISTS public.event_sponsors (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  sponsor_id UUID NOT NULL REFERENCES public.sponsors(id) ON DELETE CASCADE,
  UNIQUE(event_id, sponsor_id)
);

CREATE TABLE IF NOT EXISTS public.booths (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  sponsor_id UUID NOT NULL REFERENCES public.sponsors(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  primary_color TEXT,
  secondary_color TEXT,
  banner_url TEXT,
  description TEXT,
  contact_info JSONB,
  UNIQUE(sponsor_id, event_id)
);

CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  sponsor_id UUID NOT NULL REFERENCES public.sponsors(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  title TEXT,
  phone TEXT,
  notes TEXT,
  status lead_status NOT NULL DEFAULT 'new'
);

CREATE TABLE IF NOT EXISTS public.blog_articles (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  author_id UUID REFERENCES public.profiles(id),
  published_date DATE,
  category TEXT,
  image_url TEXT,
  featured BOOLEAN DEFAULT FALSE,
  tags TEXT[]
);

CREATE TABLE IF NOT EXISTS public.resources (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  type TEXT,
  category TEXT,
  download_url TEXT,
  image_url TEXT,
  featured BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS public.press_releases (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  title TEXT NOT NULL,
  release_date DATE,
  excerpt TEXT,
  full_content TEXT,
  download_url TEXT
);

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- ----------------------------------------------------------------
-- 3. ROW LEVEL SECURITY (RLS) - PUBLIC ACCESS ONLY
-- ----------------------------------------------------------------

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_types ENABLE ROW LEVEL SECURITY;
-- (Enable for other tables as needed)

-- RLS Policies that DON'T depend on Supabase Auth can remain.
-- You can add more specific rules here later that work with Firebase JWTs.

-- Allow public read access on certain tables.
DROP POLICY IF EXISTS "Allow public read access to profiles" ON public.profiles;
CREATE POLICY "Allow public read access to profiles" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read access to published events" ON public.events;
CREATE POLICY "Allow public read access to published events" ON public.events FOR SELECT USING (status = 'published');

DROP POLICY IF EXISTS "Allow public read access to tickets of published events" ON public.ticket_types;
CREATE POLICY "Allow public read access to tickets of published events" ON public.ticket_types FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.events WHERE events.id = ticket_types.event_id AND events.status = 'published')
);

DROP POLICY IF EXISTS "Allow read access to all speakers" ON public.speakers;
CREATE POLICY "Allow read access to all speakers" ON public.speakers FOR SELECT USING (true);


-- ----------------------------------------------------------------
-- 4. TRIGGERS - UTILITY
-- ----------------------------------------------------------------

-- Function to automatically update 'updated_at' timestamps.
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply the trigger to tables that have an 'updated_at' column.
DROP TRIGGER IF EXISTS handle_updated_at ON public.profiles;
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS handle_updated_at ON public.events;
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
