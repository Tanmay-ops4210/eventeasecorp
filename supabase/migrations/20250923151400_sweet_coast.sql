/*
  # Fix Firebase Auth Integration with Supabase RLS

  This migration creates helper functions to properly handle Firebase authentication
  with Supabase Row Level Security policies.

  ## Changes Made

  1. **Helper Functions**
     - `get_firebase_uid()` - Extract Firebase UID from JWT token
     - `is_admin()` - Check admin privileges with Firebase UID
     - `user_exists()` - Check if user profile exists

  2. **Updated RLS Policies**
     - All policies now use Firebase UID instead of Supabase auth.uid()
     - Consistent authentication checks across all tables
     - Proper admin access controls

  3. **Security Improvements**
     - Enhanced error handling in functions
     - Consistent user identification
     - Proper permission checks
*/

-- Create helper function to extract Firebase UID from JWT token
CREATE OR REPLACE FUNCTION get_firebase_uid()
RETURNS TEXT AS $$
BEGIN
  -- Try to get Firebase UID from JWT claims
  RETURN COALESCE(
    current_setting('request.jwt.claims', true)::json->>'sub',
    current_setting('request.jwt.claims', true)::json->>'user_id',
    auth.uid()::text
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create helper function to check if user exists
CREATE OR REPLACE FUNCTION user_exists(user_id TEXT DEFAULT NULL)
RETURNS BOOLEAN AS $$
DECLARE
  check_user_id TEXT;
BEGIN
  check_user_id := COALESCE(user_id, get_firebase_uid());
  
  IF check_user_id IS NULL THEN
    RETURN FALSE;
  END IF;
  
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id::text = check_user_id
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create enhanced admin check function
CREATE OR REPLACE FUNCTION is_admin(user_id TEXT DEFAULT NULL)
RETURNS BOOLEAN AS $$
DECLARE
  check_user_id TEXT;
  user_role TEXT;
BEGIN
  check_user_id := COALESCE(user_id, get_firebase_uid());
  
  IF check_user_id IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Check if user is the bypass admin email
  IF check_user_id = 'tanmay365210mogabeera@gmail.com' THEN
    RETURN TRUE;
  END IF;
  
  -- Check user role in profiles table
  SELECT role INTO user_role
  FROM profiles 
  WHERE id::text = check_user_id;
  
  RETURN user_role = 'admin';
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update profiles table policies to use Firebase UID
DROP POLICY IF EXISTS "Allow authenticated users to insert profiles" ON profiles;
DROP POLICY IF EXISTS "Allow authenticated users to update own profiles" ON profiles;
DROP POLICY IF EXISTS "Allow public read access to profiles" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON profiles;

CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT
  USING (get_firebase_uid()::uuid = id OR is_admin());

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT
  WITH CHECK (get_firebase_uid()::uuid = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE
  USING (get_firebase_uid()::uuid = id OR is_admin())
  WITH CHECK (get_firebase_uid()::uuid = id OR is_admin());

CREATE POLICY "Admins can manage all profiles" ON profiles
  FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- Update events table policies
DROP POLICY IF EXISTS "Allow anonymous read access to public events" ON events;
DROP POLICY IF EXISTS "Allow public read access to published events" ON events;
DROP POLICY IF EXISTS "Organizers can create events" ON events;
DROP POLICY IF EXISTS "Organizers can manage own events" ON events;
DROP POLICY IF EXISTS "Organizers can manage their own events" ON events;
DROP POLICY IF EXISTS "Public can view published events" ON events;
DROP POLICY IF EXISTS "Admins have full access to events" ON events;

CREATE POLICY "Public can view published events" ON events
  FOR SELECT
  USING (status = 'published'::event_status AND visibility = 'public'::text);

CREATE POLICY "Organizers can create events" ON events
  FOR INSERT
  WITH CHECK (
    get_firebase_uid()::uuid = organizer_id AND
    user_exists(get_firebase_uid())
  );

CREATE POLICY "Organizers can manage own events" ON events
  FOR ALL
  USING (get_firebase_uid()::uuid = organizer_id OR is_admin())
  WITH CHECK (get_firebase_uid()::uuid = organizer_id OR is_admin());

-- Update organizer_events table policies
DROP POLICY IF EXISTS "Organizers can manage their own events" ON organizer_events;
DROP POLICY IF EXISTS "Public can view published events" ON organizer_events;

CREATE POLICY "Public can view published events" ON organizer_events
  FOR SELECT
  USING (status = 'published'::text AND visibility = 'public'::text);

CREATE POLICY "Organizers can manage their own events" ON organizer_events
  FOR ALL
  USING (get_firebase_uid()::uuid = organizer_id OR is_admin())
  WITH CHECK (get_firebase_uid()::uuid = organizer_id OR is_admin());

-- Update organizer_ticket_types table policies
DROP POLICY IF EXISTS "Organizers can manage their event tickets" ON organizer_ticket_types;
DROP POLICY IF EXISTS "Public can view tickets for published events" ON organizer_ticket_types;

CREATE POLICY "Organizers can manage their event tickets" ON organizer_ticket_types
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM organizer_events
      WHERE organizer_events.id = organizer_ticket_types.event_id
      AND (organizer_events.organizer_id::text = get_firebase_uid() OR is_admin())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM organizer_events
      WHERE organizer_events.id = organizer_ticket_types.event_id
      AND (organizer_events.organizer_id::text = get_firebase_uid() OR is_admin())
    )
  );

CREATE POLICY "Public can view tickets for published events" ON organizer_ticket_types
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM organizer_events
      WHERE organizer_events.id = organizer_ticket_types.event_id
      AND organizer_events.status = 'published'::text
      AND organizer_events.visibility = 'public'::text
    )
  );

-- Update organizer_attendees table policies
DROP POLICY IF EXISTS "Organizers can manage their event attendees" ON organizer_attendees;
DROP POLICY IF EXISTS "Users can register for events" ON organizer_attendees;
DROP POLICY IF EXISTS "Users can view their own registrations" ON organizer_attendees;

CREATE POLICY "Organizers can manage their event attendees" ON organizer_attendees
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM organizer_events
      WHERE organizer_events.id = organizer_attendees.event_id
      AND (organizer_events.organizer_id::text = get_firebase_uid() OR is_admin())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM organizer_events
      WHERE organizer_events.id = organizer_attendees.event_id
      AND (organizer_events.organizer_id::text = get_firebase_uid() OR is_admin())
    )
  );

CREATE POLICY "Users can register for events" ON organizer_attendees
  FOR INSERT
  WITH CHECK (
    get_firebase_uid()::uuid = user_id AND
    EXISTS (
      SELECT 1 FROM organizer_events
      WHERE organizer_events.id = organizer_attendees.event_id
      AND organizer_events.status = 'published'::text
    )
  );

CREATE POLICY "Users can view their own registrations" ON organizer_attendees
  FOR SELECT
  USING (get_firebase_uid()::uuid = user_id OR is_admin());

-- Update organizer_event_analytics table policies
DROP POLICY IF EXISTS "Organizers can view their event analytics" ON organizer_event_analytics;

CREATE POLICY "Organizers can view their event analytics" ON organizer_event_analytics
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM organizer_events
      WHERE organizer_events.id = organizer_event_analytics.event_id
      AND (organizer_events.organizer_id::text = get_firebase_uid() OR is_admin())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM organizer_events
      WHERE organizer_events.id = organizer_event_analytics.event_id
      AND (organizer_events.organizer_id::text = get_firebase_uid() OR is_admin())
    )
  );

-- Update notifications table policies
DROP POLICY IF EXISTS "Users can access their own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can only see their own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can read own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can delete own notifications" ON notifications;
DROP POLICY IF EXISTS "System can create notifications" ON notifications;

CREATE POLICY "Users can manage their own notifications" ON notifications
  FOR ALL
  USING (get_firebase_uid()::uuid = user_id OR is_admin())
  WITH CHECK (get_firebase_uid()::uuid = user_id OR is_admin());

CREATE POLICY "System can create notifications" ON notifications
  FOR INSERT
  WITH CHECK (true);

-- Test the functions
DO $$
BEGIN
  -- Test get_firebase_uid function
  RAISE NOTICE 'Testing get_firebase_uid(): %', get_firebase_uid();
  
  -- Test is_admin function
  RAISE NOTICE 'Testing is_admin(): %', is_admin();
  
  -- Test user_exists function
  RAISE NOTICE 'Testing user_exists(): %', user_exists();
  
  RAISE NOTICE 'Firebase Auth integration functions created successfully!';
END $$;