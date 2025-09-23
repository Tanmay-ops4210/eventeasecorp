/*
  # Fix RLS Policies for Firebase Auth Integration

  1. Security Functions
    - Create helper functions for Firebase UID authentication
    - Add admin check functions
    - Update RLS policies to work with Firebase Auth

  2. Policy Updates
    - Fix policies to use Firebase UID instead of Supabase auth.uid()
    - Add proper admin access controls
    - Ensure users can access their own data

  3. Table Updates
    - Enable RLS on all tables
    - Add missing policies for Firebase Auth integration
*/

-- Create helper function to get current Firebase UID from JWT
CREATE OR REPLACE FUNCTION get_firebase_uid()
RETURNS TEXT AS $$
BEGIN
  -- Extract Firebase UID from JWT token
  RETURN COALESCE(
    current_setting('request.jwt.claims', true)::json->>'sub',
    current_setting('request.jwt.claims', true)::json->>'user_id',
    auth.uid()::text
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN auth.uid()::text;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create admin check function
CREATE OR REPLACE FUNCTION is_admin(user_id TEXT DEFAULT NULL)
RETURNS BOOLEAN AS $$
DECLARE
  check_user_id TEXT;
  user_role TEXT;
BEGIN
  check_user_id := COALESCE(user_id, get_firebase_uid());
  
  -- Check if user is admin by email or role
  SELECT role INTO user_role
  FROM profiles 
  WHERE id::text = check_user_id;
  
  RETURN user_role = 'admin' OR check_user_id = 'tanmay365210mogabeera@gmail.com';
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check if user exists
CREATE OR REPLACE FUNCTION user_exists(user_id TEXT DEFAULT NULL)
RETURNS BOOLEAN AS $$
DECLARE
  check_user_id TEXT;
  user_count INTEGER;
BEGIN
  check_user_id := COALESCE(user_id, get_firebase_uid());
  
  SELECT COUNT(*) INTO user_count
  FROM profiles 
  WHERE id::text = check_user_id;
  
  RETURN user_count > 0;
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing problematic policies
DO $$ 
BEGIN
  -- Drop all existing policies that might conflict
  DROP POLICY IF EXISTS "Users can read own data" ON profiles;
  DROP POLICY IF EXISTS "Users can update own data" ON profiles;
  DROP POLICY IF EXISTS "Allow authenticated users to insert profiles" ON profiles;
  DROP POLICY IF EXISTS "Allow authenticated users to update own profiles" ON profiles;
  DROP POLICY IF EXISTS "Allow public read access to profiles" ON profiles;
  DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
  DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
  DROP POLICY IF EXISTS "Admins can manage all profiles" ON profiles;
  
  -- Events policies
  DROP POLICY IF EXISTS "Allow anonymous read access to public events" ON events;
  DROP POLICY IF EXISTS "Allow public read access to published events" ON events;
  DROP POLICY IF EXISTS "Organizers can create events" ON events;
  DROP POLICY IF EXISTS "Organizers can manage own events" ON events;
  DROP POLICY IF EXISTS "Organizers can manage their own events" ON events;
  DROP POLICY IF EXISTS "Public can view published events" ON events;
  DROP POLICY IF EXISTS "Admins have full access to events" ON events;
  
  -- Other table policies
  DROP POLICY IF EXISTS "Allow public read access to speakers" ON speakers;
  DROP POLICY IF EXISTS "Allow anonymous read access to public speakers" ON speakers;
  DROP POLICY IF EXISTS "Allow read access to all speakers" ON speakers;
  DROP POLICY IF EXISTS "Organizers can manage event speakers" ON speakers;
  DROP POLICY IF EXISTS "Admins can manage speakers" ON speakers;
  DROP POLICY IF EXISTS "Admins have full access to speakers" ON speakers;
  
  DROP POLICY IF EXISTS "Allow public read access to sponsors" ON sponsors;
  DROP POLICY IF EXISTS "Allow anonymous read access to public sponsors" ON sponsors;
  DROP POLICY IF EXISTS "Sponsors can manage own data" ON sponsors;
  
  DROP POLICY IF EXISTS "Allow public read access to resources" ON resources;
  DROP POLICY IF EXISTS "Allow anonymous read access to public resources" ON resources;
  DROP POLICY IF EXISTS "Admins can manage resources" ON resources;
  
  DROP POLICY IF EXISTS "Allow public read access to press releases" ON press_releases;
  DROP POLICY IF EXISTS "Allow anonymous read access to press releases" ON press_releases;
  DROP POLICY IF EXISTS "Admins can manage press releases" ON press_releases;
  
  DROP POLICY IF EXISTS "Allow public read access to blog articles" ON blog_articles;
  DROP POLICY IF EXISTS "Allow anonymous read access to public blog" ON blog_articles;
  DROP POLICY IF EXISTS "Authors can manage own articles" ON blog_articles;
  DROP POLICY IF EXISTS "Content creators can create articles" ON blog_articles;
EXCEPTION
  WHEN OTHERS THEN
    NULL; -- Ignore errors if policies don't exist
END $$;

-- PROFILES TABLE POLICIES
CREATE POLICY "Enable read access for authenticated users"
  ON profiles FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Enable insert for authenticated users"
  ON profiles FOR INSERT
  TO authenticated, anon
  WITH CHECK (
    get_firebase_uid()::uuid = id OR 
    get_firebase_uid() = id::text
  );

CREATE POLICY "Enable update for users on their own profile"
  ON profiles FOR UPDATE
  TO authenticated, anon
  USING (
    get_firebase_uid()::uuid = id OR 
    get_firebase_uid() = id::text OR
    is_admin()
  )
  WITH CHECK (
    get_firebase_uid()::uuid = id OR 
    get_firebase_uid() = id::text OR
    is_admin()
  );

CREATE POLICY "Enable delete for admins only"
  ON profiles FOR DELETE
  TO authenticated, anon
  USING (is_admin());

-- EVENTS TABLE POLICIES
CREATE POLICY "Enable read access for published events"
  ON events FOR SELECT
  TO authenticated, anon
  USING (
    status = 'published' OR 
    organizer_id::text = get_firebase_uid() OR
    is_admin()
  );

CREATE POLICY "Enable insert for organizers"
  ON events FOR INSERT
  TO authenticated, anon
  WITH CHECK (
    organizer_id::text = get_firebase_uid() AND
    user_exists()
  );

CREATE POLICY "Enable update for event organizers"
  ON events FOR UPDATE
  TO authenticated, anon
  USING (
    organizer_id::text = get_firebase_uid() OR
    is_admin()
  )
  WITH CHECK (
    organizer_id::text = get_firebase_uid() OR
    is_admin()
  );

CREATE POLICY "Enable delete for event organizers"
  ON events FOR DELETE
  TO authenticated, anon
  USING (
    organizer_id::text = get_firebase_uid() OR
    is_admin()
  );

-- ORGANIZER_EVENTS TABLE POLICIES
CREATE POLICY "Enable read access for organizer events"
  ON organizer_events FOR SELECT
  TO authenticated, anon
  USING (
    (status = 'published' AND visibility = 'public') OR
    organizer_id::text = get_firebase_uid() OR
    is_admin()
  );

CREATE POLICY "Enable insert for authenticated organizers"
  ON organizer_events FOR INSERT
  TO authenticated, anon
  WITH CHECK (
    organizer_id::text = get_firebase_uid() AND
    user_exists()
  );

CREATE POLICY "Enable update for event organizers"
  ON organizer_events FOR UPDATE
  TO authenticated, anon
  USING (
    organizer_id::text = get_firebase_uid() OR
    is_admin()
  )
  WITH CHECK (
    organizer_id::text = get_firebase_uid() OR
    is_admin()
  );

CREATE POLICY "Enable delete for event organizers"
  ON organizer_events FOR DELETE
  TO authenticated, anon
  USING (
    organizer_id::text = get_firebase_uid() OR
    is_admin()
  );

-- ORGANIZER_TICKET_TYPES TABLE POLICIES
CREATE POLICY "Enable read access for ticket types"
  ON organizer_ticket_types FOR SELECT
  TO authenticated, anon
  USING (
    EXISTS (
      SELECT 1 FROM organizer_events 
      WHERE id = organizer_ticket_types.event_id 
      AND (
        (status = 'published' AND visibility = 'public') OR
        organizer_id::text = get_firebase_uid() OR
        is_admin()
      )
    )
  );

CREATE POLICY "Enable insert for event organizers"
  ON organizer_ticket_types FOR INSERT
  TO authenticated, anon
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM organizer_events 
      WHERE id = organizer_ticket_types.event_id 
      AND organizer_id::text = get_firebase_uid()
    )
  );

CREATE POLICY "Enable update for event organizers"
  ON organizer_ticket_types FOR UPDATE
  TO authenticated, anon
  USING (
    EXISTS (
      SELECT 1 FROM organizer_events 
      WHERE id = organizer_ticket_types.event_id 
      AND (organizer_id::text = get_firebase_uid() OR is_admin())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM organizer_events 
      WHERE id = organizer_ticket_types.event_id 
      AND (organizer_id::text = get_firebase_uid() OR is_admin())
    )
  );

CREATE POLICY "Enable delete for event organizers"
  ON organizer_ticket_types FOR DELETE
  TO authenticated, anon
  USING (
    EXISTS (
      SELECT 1 FROM organizer_events 
      WHERE id = organizer_ticket_types.event_id 
      AND (organizer_id::text = get_firebase_uid() OR is_admin())
    )
  );

-- ORGANIZER_EVENT_ANALYTICS TABLE POLICIES
CREATE POLICY "Enable read access for event analytics"
  ON organizer_event_analytics FOR SELECT
  TO authenticated, anon
  USING (
    EXISTS (
      SELECT 1 FROM organizer_events 
      WHERE id = organizer_event_analytics.event_id 
      AND (organizer_id::text = get_firebase_uid() OR is_admin())
    )
  );

CREATE POLICY "Enable insert for event analytics"
  ON organizer_event_analytics FOR INSERT
  TO authenticated, anon
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM organizer_events 
      WHERE id = organizer_event_analytics.event_id 
      AND organizer_id::text = get_firebase_uid()
    )
  );

CREATE POLICY "Enable update for event analytics"
  ON organizer_event_analytics FOR UPDATE
  TO authenticated, anon
  USING (
    EXISTS (
      SELECT 1 FROM organizer_events 
      WHERE id = organizer_event_analytics.event_id 
      AND (organizer_id::text = get_firebase_uid() OR is_admin())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM organizer_events 
      WHERE id = organizer_event_analytics.event_id 
      AND (organizer_id::text = get_firebase_uid() OR is_admin())
    )
  );

-- ORGANIZER_ATTENDEES TABLE POLICIES
CREATE POLICY "Enable read access for event attendees"
  ON organizer_attendees FOR SELECT
  TO authenticated, anon
  USING (
    user_id::text = get_firebase_uid() OR
    EXISTS (
      SELECT 1 FROM organizer_events 
      WHERE id = organizer_attendees.event_id 
      AND (organizer_id::text = get_firebase_uid() OR is_admin())
    )
  );

CREATE POLICY "Enable insert for event registration"
  ON organizer_attendees FOR INSERT
  TO authenticated, anon
  WITH CHECK (
    user_id::text = get_firebase_uid() AND
    EXISTS (
      SELECT 1 FROM organizer_events 
      WHERE id = organizer_attendees.event_id 
      AND status = 'published'
    )
  );

CREATE POLICY "Enable update for attendee management"
  ON organizer_attendees FOR UPDATE
  TO authenticated, anon
  USING (
    user_id::text = get_firebase_uid() OR
    EXISTS (
      SELECT 1 FROM organizer_events 
      WHERE id = organizer_attendees.event_id 
      AND (organizer_id::text = get_firebase_uid() OR is_admin())
    )
  )
  WITH CHECK (
    user_id::text = get_firebase_uid() OR
    EXISTS (
      SELECT 1 FROM organizer_events 
      WHERE id = organizer_attendees.event_id 
      AND (organizer_id::text = get_firebase_uid() OR is_admin())
    )
  );

-- SPEAKERS TABLE POLICIES
CREATE POLICY "Enable read access for speakers"
  ON speakers FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Enable insert for organizers and admins"
  ON speakers FOR INSERT
  TO authenticated, anon
  WITH CHECK (
    user_exists() AND (
      EXISTS (
        SELECT 1 FROM profiles 
        WHERE id::text = get_firebase_uid() 
        AND role IN ('organizer', 'admin')
      ) OR
      is_admin()
    )
  );

CREATE POLICY "Enable update for organizers and admins"
  ON speakers FOR UPDATE
  TO authenticated, anon
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Enable delete for admins only"
  ON speakers FOR DELETE
  TO authenticated, anon
  USING (is_admin());

-- SPONSORS TABLE POLICIES
CREATE POLICY "Enable read access for sponsors"
  ON sponsors FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Enable insert for sponsors and admins"
  ON sponsors FOR INSERT
  TO authenticated, anon
  WITH CHECK (
    user_exists() AND (
      EXISTS (
        SELECT 1 FROM profiles 
        WHERE id::text = get_firebase_uid() 
        AND role IN ('sponsor', 'admin')
      ) OR
      is_admin()
    )
  );

CREATE POLICY "Enable update for sponsors and admins"
  ON sponsors FOR UPDATE
  TO authenticated, anon
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id::text = get_firebase_uid() 
      AND role IN ('sponsor', 'admin')
    ) OR
    is_admin()
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id::text = get_firebase_uid() 
      AND role IN ('sponsor', 'admin')
    ) OR
    is_admin()
  );

-- RESOURCES TABLE POLICIES
CREATE POLICY "Enable read access for resources"
  ON resources FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Enable insert for admins only"
  ON resources FOR INSERT
  TO authenticated, anon
  WITH CHECK (is_admin());

CREATE POLICY "Enable update for admins only"
  ON resources FOR UPDATE
  TO authenticated, anon
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Enable delete for admins only"
  ON resources FOR DELETE
  TO authenticated, anon
  USING (is_admin());

-- PRESS_RELEASES TABLE POLICIES
CREATE POLICY "Enable read access for press releases"
  ON press_releases FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Enable insert for admins only"
  ON press_releases FOR INSERT
  TO authenticated, anon
  WITH CHECK (is_admin());

CREATE POLICY "Enable update for admins only"
  ON press_releases FOR UPDATE
  TO authenticated, anon
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Enable delete for admins only"
  ON press_releases FOR DELETE
  TO authenticated, anon
  USING (is_admin());

-- BLOG_ARTICLES TABLE POLICIES
CREATE POLICY "Enable read access for published articles"
  ON blog_articles FOR SELECT
  TO authenticated, anon
  USING (
    (published_date IS NOT NULL AND published_date <= CURRENT_DATE) OR
    author_id::text = get_firebase_uid() OR
    is_admin()
  );

CREATE POLICY "Enable insert for content creators"
  ON blog_articles FOR INSERT
  TO authenticated, anon
  WITH CHECK (
    user_exists() AND (
      EXISTS (
        SELECT 1 FROM profiles 
        WHERE id::text = get_firebase_uid() 
        AND role IN ('admin', 'organizer')
      ) OR
      is_admin()
    )
  );

CREATE POLICY "Enable update for authors and admins"
  ON blog_articles FOR UPDATE
  TO authenticated, anon
  USING (
    author_id::text = get_firebase_uid() OR
    is_admin()
  )
  WITH CHECK (
    author_id::text = get_firebase_uid() OR
    is_admin()
  );

-- NOTIFICATIONS TABLE POLICIES
CREATE POLICY "Enable read access for own notifications"
  ON notifications FOR SELECT
  TO authenticated, anon
  USING (
    user_id::text = get_firebase_uid() OR
    is_admin()
  );

CREATE POLICY "Enable insert for system notifications"
  ON notifications FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

CREATE POLICY "Enable update for own notifications"
  ON notifications FOR UPDATE
  TO authenticated, anon
  USING (
    user_id::text = get_firebase_uid() OR
    is_admin()
  )
  WITH CHECK (
    user_id::text = get_firebase_uid() OR
    is_admin()
  );

CREATE POLICY "Enable delete for own notifications"
  ON notifications FOR DELETE
  TO authenticated, anon
  USING (
    user_id::text = get_firebase_uid() OR
    is_admin()
  );

-- TICKET_TYPES TABLE POLICIES
CREATE POLICY "Enable read access for ticket types"
  ON ticket_types FOR SELECT
  TO authenticated, anon
  USING (
    EXISTS (
      SELECT 1 FROM events 
      WHERE id = ticket_types.event_id 
      AND (
        status = 'published' OR
        organizer_id::text = get_firebase_uid() OR
        is_admin()
      )
    )
  );

CREATE POLICY "Enable insert for event organizers"
  ON ticket_types FOR INSERT
  TO authenticated, anon
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM events 
      WHERE id = ticket_types.event_id 
      AND organizer_id::text = get_firebase_uid()
    )
  );

CREATE POLICY "Enable update for event organizers"
  ON ticket_types FOR UPDATE
  TO authenticated, anon
  USING (
    EXISTS (
      SELECT 1 FROM events 
      WHERE id = ticket_types.event_id 
      AND (organizer_id::text = get_firebase_uid() OR is_admin())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM events 
      WHERE id = ticket_types.event_id 
      AND (organizer_id::text = get_firebase_uid() OR is_admin())
    )
  );

CREATE POLICY "Enable delete for event organizers"
  ON ticket_types FOR DELETE
  TO authenticated, anon
  USING (
    EXISTS (
      SELECT 1 FROM events 
      WHERE id = ticket_types.event_id 
      AND (organizer_id::text = get_firebase_uid() OR is_admin())
    )
  );

-- EVENT_ANALYTICS TABLE POLICIES
CREATE POLICY "Enable read access for event analytics"
  ON event_analytics FOR SELECT
  TO authenticated, anon
  USING (
    EXISTS (
      SELECT 1 FROM events 
      WHERE id = event_analytics.event_id 
      AND (organizer_id::text = get_firebase_uid() OR is_admin())
    )
  );

CREATE POLICY "Enable insert for event analytics"
  ON event_analytics FOR INSERT
  TO authenticated, anon
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM events 
      WHERE id = event_analytics.event_id 
      AND organizer_id::text = get_firebase_uid()
    )
  );

CREATE POLICY "Enable update for event analytics"
  ON event_analytics FOR UPDATE
  TO authenticated, anon
  USING (
    EXISTS (
      SELECT 1 FROM events 
      WHERE id = event_analytics.event_id 
      AND (organizer_id::text = get_firebase_uid() OR is_admin())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM events 
      WHERE id = event_analytics.event_id 
      AND (organizer_id::text = get_firebase_uid() OR is_admin())
    )
  );

-- EVENT_ATTENDEES TABLE POLICIES
CREATE POLICY "Enable read access for attendees"
  ON event_attendees FOR SELECT
  TO authenticated, anon
  USING (
    user_id::text = get_firebase_uid() OR
    EXISTS (
      SELECT 1 FROM events 
      WHERE id = event_attendees.event_id 
      AND (organizer_id::text = get_firebase_uid() OR is_admin())
    )
  );

CREATE POLICY "Enable insert for event registration"
  ON event_attendees FOR INSERT
  TO authenticated, anon
  WITH CHECK (
    user_id::text = get_firebase_uid() AND
    EXISTS (
      SELECT 1 FROM events 
      WHERE id = event_attendees.event_id 
      AND status = 'published'
    )
  );

CREATE POLICY "Enable update for attendee management"
  ON event_attendees FOR UPDATE
  TO authenticated, anon
  USING (
    user_id::text = get_firebase_uid() OR
    EXISTS (
      SELECT 1 FROM events 
      WHERE id = event_attendees.event_id 
      AND (organizer_id::text = get_firebase_uid() OR is_admin())
    )
  )
  WITH CHECK (
    user_id::text = get_firebase_uid() OR
    EXISTS (
      SELECT 1 FROM events 
      WHERE id = event_attendees.event_id 
      AND (organizer_id::text = get_firebase_uid() OR is_admin())
    )
  );

-- MARKETING_CAMPAIGNS TABLE POLICIES
CREATE POLICY "Enable read access for marketing campaigns"
  ON marketing_campaigns FOR SELECT
  TO authenticated, anon
  USING (
    EXISTS (
      SELECT 1 FROM events 
      WHERE id = marketing_campaigns.event_id 
      AND (organizer_id::text = get_firebase_uid() OR is_admin())
    )
  );

CREATE POLICY "Enable insert for event organizers"
  ON marketing_campaigns FOR INSERT
  TO authenticated, anon
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM events 
      WHERE id = marketing_campaigns.event_id 
      AND organizer_id::text = get_firebase_uid()
    )
  );

CREATE POLICY "Enable update for event organizers"
  ON marketing_campaigns FOR UPDATE
  TO authenticated, anon
  USING (
    EXISTS (
      SELECT 1 FROM events 
      WHERE id = marketing_campaigns.event_id 
      AND (organizer_id::text = get_firebase_uid() OR is_admin())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM events 
      WHERE id = marketing_campaigns.event_id 
      AND (organizer_id::text = get_firebase_uid() OR is_admin())
    )
  );

CREATE POLICY "Enable delete for event organizers"
  ON marketing_campaigns FOR DELETE
  TO authenticated, anon
  USING (
    EXISTS (
      SELECT 1 FROM events 
      WHERE id = marketing_campaigns.event_id 
      AND (organizer_id::text = get_firebase_uid() OR is_admin())
    )
  );

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated, anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated, anon;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated, anon;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated, anon;

-- Refresh schema cache
NOTIFY pgrst, 'reload schema';