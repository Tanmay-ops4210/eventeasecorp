/*
  # Fix Firebase UID Data Type Mismatch

  This migration fixes the data type mismatch between Firebase UIDs (text strings) 
  and PostgreSQL UUID columns. Firebase UIDs are alphanumeric strings that don't 
  follow the standard UUID format, so they must be stored as TEXT.

  ## Changes Made

  1. **Events Table**
     - Change `organizer_id` from UUID to TEXT to store Firebase UIDs

  2. **Profiles Table** 
     - Change `id` from UUID to TEXT to store Firebase UIDs as primary key

  3. **Event Attendees Table**
     - Change `user_id` from UUID to TEXT to reference Firebase UIDs

  4. **Blog Articles Table**
     - Change `author_id` from UUID to TEXT to reference Firebase UIDs

  5. **Notifications Table**
     - Change `user_id` from UUID to TEXT to reference Firebase UIDs

  6. **Marketing Campaigns Table**
     - No changes needed (event_id references events.id which remains UUID)

  ## Important Notes
  - This migration preserves all existing data
  - Foreign key relationships are maintained
  - All RLS policies continue to work with TEXT UIDs
*/

-- First, drop foreign key constraints that reference the columns we're changing
ALTER TABLE public.events DROP CONSTRAINT IF EXISTS events_organizer_id_fkey;
ALTER TABLE public.event_attendees DROP CONSTRAINT IF EXISTS event_attendees_user_id_fkey;
ALTER TABLE public.blog_articles DROP CONSTRAINT IF EXISTS blog_articles_author_id_fkey;
ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS notifications_user_id_fkey;

-- Change the profiles table id column to TEXT (this is the primary key that others reference)
ALTER TABLE public.profiles ALTER COLUMN id SET DATA TYPE TEXT;

-- Change organizer_id in events table to TEXT
ALTER TABLE public.events ALTER COLUMN organizer_id SET DATA TYPE TEXT;

-- Change user_id in event_attendees table to TEXT
ALTER TABLE public.event_attendees ALTER COLUMN user_id SET DATA TYPE TEXT;

-- Change author_id in blog_articles table to TEXT (if it exists)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'blog_articles' AND column_name = 'author_id'
  ) THEN
    ALTER TABLE public.blog_articles ALTER COLUMN author_id SET DATA TYPE TEXT;
  END IF;
END $$;

-- Change user_id in notifications table to TEXT
ALTER TABLE public.notifications ALTER COLUMN user_id SET DATA TYPE TEXT;

-- Recreate the foreign key constraints with the new TEXT data type
ALTER TABLE public.events 
ADD CONSTRAINT events_organizer_id_fkey 
FOREIGN KEY (organizer_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.event_attendees 
ADD CONSTRAINT event_attendees_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Recreate blog_articles foreign key if the column exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'blog_articles' AND column_name = 'author_id'
  ) THEN
    ALTER TABLE public.blog_articles 
    ADD CONSTRAINT blog_articles_author_id_fkey 
    FOREIGN KEY (author_id) REFERENCES public.profiles(id);
  END IF;
END $$;

ALTER TABLE public.notifications 
ADD CONSTRAINT notifications_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Update any RLS policies that might be affected by the data type change
-- Most RLS policies should continue to work since they use auth.uid()::text anyway

-- Ensure the profiles table has proper RLS policies for Firebase UIDs
DROP POLICY IF EXISTS "Users can read own data" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own data" ON public.profiles;

CREATE POLICY "Users can read own data" ON public.profiles
  FOR SELECT USING (auth.uid()::text = id);

CREATE POLICY "Users can update own data" ON public.profiles  
  FOR UPDATE USING (auth.uid()::text = id);

-- Ensure events table RLS policies work with TEXT organizer_id
DROP POLICY IF EXISTS "Organizers can manage own events" ON public.events;

CREATE POLICY "Organizers can manage own events" ON public.events
  FOR ALL USING (auth.uid()::text = organizer_id);

-- Ensure event_attendees RLS policies work with TEXT user_id
DROP POLICY IF EXISTS "Users can view their own attendance" ON public.event_attendees;

CREATE POLICY "Users can view their own attendance" ON public.event_attendees
  FOR SELECT USING (auth.uid()::text = user_id);

-- Ensure notifications RLS policies work with TEXT user_id
DROP POLICY IF EXISTS "Users can access their own notifications" ON public.notifications;

CREATE POLICY "Users can access their own notifications" ON public.notifications
  FOR ALL USING (auth.uid()::text = user_id);