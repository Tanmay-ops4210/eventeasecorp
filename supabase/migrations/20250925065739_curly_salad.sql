/*
  # Fix RLS User Metadata Security Issues

  1. Security Functions
    - Create secure admin check function using profiles table
    - Remove insecure user_metadata references

  2. Updated Policies
    - Replace all user_metadata checks with secure profile-based checks
    - Maintain same functionality with proper security

  3. Tables Updated
    - profiles: Admin read/update policies
    - events: Admin and organizer policies  
    - organizer_events: All organizer policies
    - speakers: Admin management policy
    - sponsors: Admin management policy
*/

-- Create secure function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin_user()
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if current user has admin role in profiles table
  RETURN EXISTS (
    SELECT 1 
    FROM profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check if user is organizer
CREATE OR REPLACE FUNCTION is_organizer_user()
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if current user has organizer role in profiles table
  RETURN EXISTS (
    SELECT 1 
    FROM profiles 
    WHERE id = auth.uid() 
    AND role = 'organizer'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing insecure policies and recreate with secure functions

-- Fix profiles table policies
DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;

CREATE POLICY "Admins can read all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (is_admin_user());

CREATE POLICY "Admins can update all profiles"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (is_admin_user())
  WITH CHECK (is_admin_user());

-- Fix events table policies
DROP POLICY IF EXISTS "Anyone can read published events" ON events;
DROP POLICY IF EXISTS "Organizers can manage own events" ON events;

CREATE POLICY "Anyone can read published events"
  ON events
  FOR SELECT
  TO authenticated
  USING (
    (status = 'published' AND visibility = 'public') 
    OR (organizer_id = auth.uid()) 
    OR is_admin_user()
  );

CREATE POLICY "Organizers can manage own events"
  ON events
  FOR ALL
  TO authenticated
  USING (
    (organizer_id = auth.uid()) 
    OR is_admin_user()
  )
  WITH CHECK (
    (organizer_id = auth.uid()) 
    OR is_admin_user()
  );

-- Fix organizer_events table policies
DROP POLICY IF EXISTS "Organizers can read own events" ON organizer_events;
DROP POLICY IF EXISTS "Organizers can update own events" ON organizer_events;
DROP POLICY IF EXISTS "Organizers can delete own events" ON organizer_events;

CREATE POLICY "Organizers can read own events"
  ON organizer_events
  FOR SELECT
  TO authenticated
  USING (
    (organizer_id = auth.uid()) 
    OR is_admin_user()
  );

CREATE POLICY "Organizers can update own events"
  ON organizer_events
  FOR UPDATE
  TO authenticated
  USING (
    (organizer_id = auth.uid()) 
    OR is_admin_user()
  )
  WITH CHECK (
    (organizer_id = auth.uid()) 
    OR is_admin_user()
  );

CREATE POLICY "Organizers can delete own events"
  ON organizer_events
  FOR DELETE
  TO authenticated
  USING (
    (organizer_id = auth.uid()) 
    OR is_admin_user()
  );

-- Fix speakers table policies
DROP POLICY IF EXISTS "Admins can manage speakers" ON speakers;

CREATE POLICY "Admins can manage speakers"
  ON speakers
  FOR ALL
  TO authenticated
  USING (is_admin_user())
  WITH CHECK (is_admin_user());

-- Fix sponsors table policies
DROP POLICY IF EXISTS "Admins can manage sponsors" ON sponsors;

CREATE POLICY "Admins can manage sponsors"
  ON sponsors
  FOR ALL
  TO authenticated
  USING (is_admin_user())
  WITH CHECK (is_admin_user());

-- Update other policies that might reference user_metadata in related tables

-- Fix organizer_ticket_types policies
DROP POLICY IF EXISTS "Organizers can manage tickets for own events" ON organizer_ticket_types;

CREATE POLICY "Organizers can manage tickets for own events"
  ON organizer_ticket_types
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM organizer_events
      WHERE organizer_events.id = organizer_ticket_types.event_id
      AND (
        organizer_events.organizer_id = auth.uid()
        OR is_admin_user()
      )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM organizer_events
      WHERE organizer_events.id = organizer_ticket_types.event_id
      AND (
        organizer_events.organizer_id = auth.uid()
        OR is_admin_user()
      )
    )
  );

-- Fix organizer_attendees policies
DROP POLICY IF EXISTS "Organizers can manage attendees for own events" ON organizer_attendees;

CREATE POLICY "Organizers can manage attendees for own events"
  ON organizer_attendees
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM organizer_events
      WHERE organizer_events.id = organizer_attendees.event_id
      AND (
        organizer_events.organizer_id = auth.uid()
        OR is_admin_user()
      )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM organizer_events
      WHERE organizer_events.id = organizer_attendees.event_id
      AND (
        organizer_events.organizer_id = auth.uid()
        OR is_admin_user()
      )
    )
  );

-- Fix organizer_event_analytics policies
DROP POLICY IF EXISTS "Organizers can view analytics for own events" ON organizer_event_analytics;

CREATE POLICY "Organizers can view analytics for own events"
  ON organizer_event_analytics
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM organizer_events
      WHERE organizer_events.id = organizer_event_analytics.event_id
      AND (
        organizer_events.organizer_id = auth.uid()
        OR is_admin_user()
      )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM organizer_events
      WHERE organizer_events.id = organizer_event_analytics.event_id
      AND (
        organizer_events.organizer_id = auth.uid()
        OR is_admin_user()
      )
    )
  );

-- Grant execute permissions on the new functions
GRANT EXECUTE ON FUNCTION is_admin_user() TO authenticated;
GRANT EXECUTE ON FUNCTION is_organizer_user() TO authenticated;