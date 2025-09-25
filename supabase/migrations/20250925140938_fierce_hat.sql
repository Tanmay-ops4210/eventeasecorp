/*
  # Fix RLS policies for organizer_events table

  1. Security Updates
    - Drop existing restrictive policies
    - Create new policies that allow organizers to manage their own events
    - Ensure proper access control for authenticated users

  2. Policy Changes
    - Allow organizers to read their own events
    - Allow organizers to create events (with proper organizer_id)
    - Allow organizers to update their own events
    - Allow organizers to delete their own events
    - Allow admins to manage all events
*/

-- Drop existing policies that might be too restrictive
DROP POLICY IF EXISTS "Organizers can create events" ON organizer_events;
DROP POLICY IF EXISTS "Organizers can delete own events" ON organizer_events;
DROP POLICY IF EXISTS "Organizers can read own events" ON organizer_events;
DROP POLICY IF EXISTS "Organizers can update own events" ON organizer_events;

-- Create comprehensive policies for organizer_events
CREATE POLICY "Organizers can read own events" 
  ON organizer_events 
  FOR SELECT 
  TO authenticated 
  USING (organizer_id = auth.uid() OR is_admin_user());

CREATE POLICY "Organizers can create events" 
  ON organizer_events 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (organizer_id = auth.uid());

CREATE POLICY "Organizers can update own events" 
  ON organizer_events 
  FOR UPDATE 
  TO authenticated 
  USING (organizer_id = auth.uid() OR is_admin_user())
  WITH CHECK (organizer_id = auth.uid() OR is_admin_user());

CREATE POLICY "Organizers can delete own events" 
  ON organizer_events 
  FOR DELETE 
  TO authenticated 
  USING (organizer_id = auth.uid() OR is_admin_user());

-- Ensure RLS is enabled
ALTER TABLE organizer_events ENABLE ROW LEVEL SECURITY;