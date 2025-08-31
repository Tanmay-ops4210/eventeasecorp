/*
  # Fix Firebase UID Data Type Mismatch

  1. Changes
    - Change `profiles.id` column from UUID to TEXT to support Firebase UIDs
    - Update foreign key references in related tables to use TEXT instead of UUID
    - Maintain all existing RLS policies and constraints

  2. Security
    - All existing RLS policies remain intact
    - Primary key constraints are preserved

  3. Notes
    - Firebase UIDs are strings that don't conform to PostgreSQL UUID format
    - This change allows proper storage of Firebase authentication IDs
*/

-- Change the profiles table id column from UUID to TEXT
ALTER TABLE public.profiles ALTER COLUMN id SET DATA TYPE TEXT;

-- Update foreign key columns that reference profiles.id
ALTER TABLE public.events ALTER COLUMN organizer_id SET DATA TYPE TEXT;
ALTER TABLE public.attendees ALTER COLUMN user_id SET DATA TYPE TEXT;
ALTER TABLE public.blog_articles ALTER COLUMN author_id SET DATA TYPE TEXT;
ALTER TABLE public.notifications ALTER COLUMN user_id SET DATA TYPE TEXT;