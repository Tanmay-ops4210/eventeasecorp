/*
  # Fix RLS Infinite Recursion

  This migration resolves the infinite recursion error in the profiles table RLS policies.

  ## Changes Made
  1. Remove obsolete get_firebase_uid() function (no longer needed after Firebase migration)
  2. Update is_admin() function to use JWT claims instead of querying profiles table
  3. Ensure RLS policies use auth.uid() directly for user identification
  4. Remove hardcoded email bypasses that cause recursion

  ## Security
  - Admin access is now determined from JWT user_metadata.role
  - No recursive queries in RLS policies
  - Maintains proper user isolation
*/

-- Drop the obsolete get_firebase_uid function
DROP FUNCTION IF EXISTS get_firebase_uid();

-- Update is_admin function to avoid querying profiles table
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  -- Get role directly from JWT claims to avoid recursion
  RETURN COALESCE(
    auth.jwt() -> 'user_metadata' ->> 'role' = 'admin',
    false
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate profiles policies without recursion
DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Simple, non-recursive policies for profiles table
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Admin policies that don't cause recursion
CREATE POLICY "Admins can read all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    auth.jwt() -> 'user_metadata' ->> 'role' = 'admin'
  );

CREATE POLICY "Admins can update all profiles"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (
    auth.jwt() -> 'user_metadata' ->> 'role' = 'admin'
  );

-- Update other tables to use direct JWT checks instead of is_admin() where possible
-- This prevents any potential recursion issues

-- Update events policies
DROP POLICY IF EXISTS "Anyone can read published events" ON events;
DROP POLICY IF EXISTS "Organizers can manage own events" ON events;

CREATE POLICY "Anyone can read published events"
  ON events
  FOR SELECT
  TO authenticated
  USING (
    (status = 'published' AND visibility = 'public') OR
    organizer_id = auth.uid() OR
    auth.jwt() -> 'user_metadata' ->> 'role' = 'admin'
  );

CREATE POLICY "Organizers can manage own events"
  ON events
  FOR ALL
  TO authenticated
  USING (
    organizer_id = auth.uid() OR
    auth.jwt() -> 'user_metadata' ->> 'role' = 'admin'
  );

-- Update organizer_events policies
DROP POLICY IF EXISTS "Organizers can create events" ON organizer_events;
DROP POLICY IF EXISTS "Organizers can delete own events" ON organizer_events;
DROP POLICY IF EXISTS "Organizers can read own events" ON organizer_events;
DROP POLICY IF EXISTS "Organizers can update own events" ON organizer_events;

CREATE POLICY "Organizers can read own events"
  ON organizer_events
  FOR SELECT
  TO authenticated
  USING (
    organizer_id = auth.uid() OR
    auth.jwt() -> 'user_metadata' ->> 'role' = 'admin'
  );

CREATE POLICY "Organizers can create events"
  ON organizer_events
  FOR INSERT
  TO authenticated
  WITH CHECK (organizer_id = auth.uid());

CREATE POLICY "Organizers can update own events"
  ON organizer_events
  FOR UPDATE
  TO authenticated
  USING (
    organizer_id = auth.uid() OR
    auth.jwt() -> 'user_metadata' ->> 'role' = 'admin'
  );

CREATE POLICY "Organizers can delete own events"
  ON organizer_events
  FOR DELETE
  TO authenticated
  USING (
    organizer_id = auth.uid() OR
    auth.jwt() -> 'user_metadata' ->> 'role' = 'admin'
  );

-- Update speakers policies to avoid recursion
DROP POLICY IF EXISTS "Admins can manage speakers" ON speakers;
DROP POLICY IF EXISTS "Anyone can read speakers" ON speakers;

CREATE POLICY "Anyone can read speakers"
  ON speakers
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage speakers"
  ON speakers
  FOR ALL
  TO authenticated
  USING (auth.jwt() -> 'user_metadata' ->> 'role' = 'admin');

-- Update sponsors policies to avoid recursion
DROP POLICY IF EXISTS "Admins can manage sponsors" ON sponsors;
DROP POLICY IF EXISTS "Anyone can read sponsors" ON sponsors;

CREATE POLICY "Anyone can read sponsors"
  ON sponsors
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage sponsors"
  ON sponsors
  FOR ALL
  TO authenticated
  USING (auth.jwt() -> 'user_metadata' ->> 'role' = 'admin');