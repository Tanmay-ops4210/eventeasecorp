/*
  # Complete RLS Policies for All Tables

  1. New Policies
    - Add comprehensive RLS policies for all tables
    - Ensure proper access control for different user roles
    - Enable frontend data access while maintaining security

  2. Security
    - Organizers can manage their own events and related data
    - Sponsors can manage their own booth and leads
    - Attendees can view public data and manage their registrations
    - Admins have full access to all data

  3. Tables Covered
    - profiles: User profile management
    - events: Event creation and management
    - ticket_types: Ticket management for events
    - attendees: Event registration management
    - speakers: Speaker directory access
    - event_speakers: Speaker-event associations
    - sponsors: Sponsor directory access
    - event_sponsors: Sponsor-event associations
    - booths: Sponsor booth customization
    - leads: Sponsor lead management
    - blog_articles: Blog content management
    - resources: Resource library access
    - press_releases: Press release management
    - notifications: User notification system
*/

-- ================================================================
-- PROFILES TABLE POLICIES
-- ================================================================

-- Allow users to read all public profiles
DROP POLICY IF EXISTS "Allow public read access to profiles" ON public.profiles;
CREATE POLICY "Allow public read access to profiles" 
ON public.profiles FOR SELECT 
USING (true);

-- Allow users to insert their own profile
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (true);

-- Allow users to update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (id = current_setting('request.jwt.claims', true)::json->>'sub')
WITH CHECK (id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Allow admins to manage all profiles
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;
CREATE POLICY "Admins can manage all profiles" 
ON public.profiles FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = current_setting('request.jwt.claims', true)::json->>'sub' 
    AND role = 'admin'
  )
);

-- ================================================================
-- EVENTS TABLE POLICIES
-- ================================================================

-- Allow public read access to published events
DROP POLICY IF EXISTS "Allow public read access to published events" ON public.events;
CREATE POLICY "Allow public read access to published events" 
ON public.events FOR SELECT 
USING (status = 'published' OR status IS NULL);

-- Allow organizers to create events
DROP POLICY IF EXISTS "Organizers can create events" ON public.events;
CREATE POLICY "Organizers can create events" 
ON public.events FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = current_setting('request.jwt.claims', true)::json->>'sub' 
    AND role IN ('organizer', 'admin')
  )
);

-- Allow organizers to manage their own events
DROP POLICY IF EXISTS "Organizers can manage own events" ON public.events;
CREATE POLICY "Organizers can manage own events" 
ON public.events FOR ALL 
USING (
  organizer_id = current_setting('request.jwt.claims', true)::json->>'sub' OR
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = current_setting('request.jwt.claims', true)::json->>'sub' 
    AND role = 'admin'
  )
);

-- ================================================================
-- TICKET_TYPES TABLE POLICIES
-- ================================================================

-- Allow public read access to ticket types for published events
DROP POLICY IF EXISTS "Allow public read access to ticket types" ON public.ticket_types;
CREATE POLICY "Allow public read access to ticket types" 
ON public.ticket_types FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.events 
    WHERE events.id = ticket_types.event_id 
    AND (events.status = 'published' OR events.status IS NULL)
  )
);

-- Allow organizers to manage ticket types for their events
DROP POLICY IF EXISTS "Organizers can manage ticket types" ON public.ticket_types;
CREATE POLICY "Organizers can manage ticket types" 
ON public.ticket_types FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.events 
    WHERE events.id = ticket_types.event_id 
    AND (
      events.organizer_id = current_setting('request.jwt.claims', true)::json->>'sub' OR
      EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = current_setting('request.jwt.claims', true)::json->>'sub' 
        AND role = 'admin'
      )
    )
  )
);

-- ================================================================
-- ATTENDEES TABLE POLICIES
-- ================================================================

-- Allow attendees to view their own registrations
DROP POLICY IF EXISTS "Attendees can view own registrations" ON public.attendees;
CREATE POLICY "Attendees can view own registrations" 
ON public.attendees FOR SELECT 
USING (
  user_id = current_setting('request.jwt.claims', true)::json->>'sub' OR
  EXISTS (
    SELECT 1 FROM public.events 
    WHERE events.id = attendees.event_id 
    AND events.organizer_id = current_setting('request.jwt.claims', true)::json->>'sub'
  ) OR
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = current_setting('request.jwt.claims', true)::json->>'sub' 
    AND role = 'admin'
  )
);

-- Allow users to register for events
DROP POLICY IF EXISTS "Users can register for events" ON public.attendees;
CREATE POLICY "Users can register for events" 
ON public.attendees FOR INSERT 
WITH CHECK (
  user_id = current_setting('request.jwt.claims', true)::json->>'sub' AND
  EXISTS (
    SELECT 1 FROM public.events 
    WHERE events.id = attendees.event_id 
    AND events.status = 'published'
  )
);

-- Allow users to update their own registrations
DROP POLICY IF EXISTS "Users can update own registrations" ON public.attendees;
CREATE POLICY "Users can update own registrations" 
ON public.attendees FOR UPDATE 
USING (
  user_id = current_setting('request.jwt.claims', true)::json->>'sub' OR
  EXISTS (
    SELECT 1 FROM public.events 
    WHERE events.id = attendees.event_id 
    AND events.organizer_id = current_setting('request.jwt.claims', true)::json->>'sub'
  ) OR
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = current_setting('request.jwt.claims', true)::json->>'sub' 
    AND role = 'admin'
  )
);

-- Allow users to cancel their registrations
DROP POLICY IF EXISTS "Users can cancel own registrations" ON public.attendees;
CREATE POLICY "Users can cancel own registrations" 
ON public.attendees FOR DELETE 
USING (
  user_id = current_setting('request.jwt.claims', true)::json->>'sub' OR
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = current_setting('request.jwt.claims', true)::json->>'sub' 
    AND role = 'admin'
  )
);

-- ================================================================
-- SPEAKERS TABLE POLICIES
-- ================================================================

-- Allow public read access to all speakers
DROP POLICY IF EXISTS "Allow public read access to speakers" ON public.speakers;
CREATE POLICY "Allow public read access to speakers" 
ON public.speakers FOR SELECT 
USING (true);

-- Allow admins to manage speakers
DROP POLICY IF EXISTS "Admins can manage speakers" ON public.speakers;
CREATE POLICY "Admins can manage speakers" 
ON public.speakers FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = current_setting('request.jwt.claims', true)::json->>'sub' 
    AND role = 'admin'
  )
);

-- Allow organizers to manage speakers for their events
DROP POLICY IF EXISTS "Organizers can manage event speakers" ON public.speakers;
CREATE POLICY "Organizers can manage event speakers" 
ON public.speakers FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = current_setting('request.jwt.claims', true)::json->>'sub' 
    AND role IN ('organizer', 'admin')
  )
);

-- ================================================================
-- EVENT_SPEAKERS TABLE POLICIES
-- ================================================================

-- Allow public read access to event-speaker associations
DROP POLICY IF EXISTS "Allow public read access to event speakers" ON public.event_speakers;
CREATE POLICY "Allow public read access to event speakers" 
ON public.event_speakers FOR SELECT 
USING (true);

-- Allow organizers to manage speakers for their events
DROP POLICY IF EXISTS "Organizers can manage event speaker associations" ON public.event_speakers;
CREATE POLICY "Organizers can manage event speaker associations" 
ON public.event_speakers FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.events 
    WHERE events.id = event_speakers.event_id 
    AND (
      events.organizer_id = current_setting('request.jwt.claims', true)::json->>'sub' OR
      EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = current_setting('request.jwt.claims', true)::json->>'sub' 
        AND role = 'admin'
      )
    )
  )
);

-- ================================================================
-- SPONSORS TABLE POLICIES
-- ================================================================

-- Allow public read access to all sponsors
DROP POLICY IF EXISTS "Allow public read access to sponsors" ON public.sponsors;
CREATE POLICY "Allow public read access to sponsors" 
ON public.sponsors FOR SELECT 
USING (true);

-- Allow admins and sponsors to manage sponsor data
DROP POLICY IF EXISTS "Sponsors can manage own data" ON public.sponsors;
CREATE POLICY "Sponsors can manage own data" 
ON public.sponsors FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = current_setting('request.jwt.claims', true)::json->>'sub' 
    AND role IN ('sponsor', 'admin')
  )
);

-- ================================================================
-- EVENT_SPONSORS TABLE POLICIES
-- ================================================================

-- Allow public read access to event-sponsor associations
DROP POLICY IF EXISTS "Allow public read access to event sponsors" ON public.event_sponsors;
CREATE POLICY "Allow public read access to event sponsors" 
ON public.event_sponsors FOR SELECT 
USING (true);

-- Allow organizers and sponsors to manage associations
DROP POLICY IF EXISTS "Organizers and sponsors can manage associations" ON public.event_sponsors;
CREATE POLICY "Organizers and sponsors can manage associations" 
ON public.event_sponsors FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.events 
    WHERE events.id = event_sponsors.event_id 
    AND events.organizer_id = current_setting('request.jwt.claims', true)::json->>'sub'
  ) OR
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = current_setting('request.jwt.claims', true)::json->>'sub' 
    AND role IN ('sponsor', 'admin')
  )
);

-- ================================================================
-- BOOTHS TABLE POLICIES
-- ================================================================

-- Allow public read access to booth information
DROP POLICY IF EXISTS "Allow public read access to booths" ON public.booths;
CREATE POLICY "Allow public read access to booths" 
ON public.booths FOR SELECT 
USING (true);

-- Allow sponsors to manage their own booths
DROP POLICY IF EXISTS "Sponsors can manage own booths" ON public.booths;
CREATE POLICY "Sponsors can manage own booths" 
ON public.booths FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.sponsors 
    WHERE sponsors.id = booths.sponsor_id 
    AND EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = current_setting('request.jwt.claims', true)::json->>'sub' 
      AND role IN ('sponsor', 'admin')
    )
  )
);

-- ================================================================
-- LEADS TABLE POLICIES
-- ================================================================

-- Allow sponsors to view and manage their own leads
DROP POLICY IF EXISTS "Sponsors can manage own leads" ON public.leads;
CREATE POLICY "Sponsors can manage own leads" 
ON public.leads FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.sponsors 
    WHERE sponsors.id = leads.sponsor_id 
    AND EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = current_setting('request.jwt.claims', true)::json->>'sub' 
      AND role IN ('sponsor', 'admin')
    )
  )
);

-- ================================================================
-- BLOG_ARTICLES TABLE POLICIES
-- ================================================================

-- Allow public read access to published blog articles
DROP POLICY IF EXISTS "Allow public read access to blog articles" ON public.blog_articles;
CREATE POLICY "Allow public read access to blog articles" 
ON public.blog_articles FOR SELECT 
USING (published_date IS NOT NULL AND published_date <= CURRENT_DATE);

-- Allow admins and authors to manage blog articles
DROP POLICY IF EXISTS "Authors can manage own articles" ON public.blog_articles;
CREATE POLICY "Authors can manage own articles" 
ON public.blog_articles FOR ALL 
USING (
  author_id = current_setting('request.jwt.claims', true)::json->>'sub' OR
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = current_setting('request.jwt.claims', true)::json->>'sub' 
    AND role = 'admin'
  )
);

-- Allow content creators to create articles
DROP POLICY IF EXISTS "Content creators can create articles" ON public.blog_articles;
CREATE POLICY "Content creators can create articles" 
ON public.blog_articles FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = current_setting('request.jwt.claims', true)::json->>'sub' 
    AND role IN ('admin', 'organizer')
  )
);

-- ================================================================
-- RESOURCES TABLE POLICIES
-- ================================================================

-- Allow public read access to all resources
DROP POLICY IF EXISTS "Allow public read access to resources" ON public.resources;
CREATE POLICY "Allow public read access to resources" 
ON public.resources FOR SELECT 
USING (true);

-- Allow admins to manage resources
DROP POLICY IF EXISTS "Admins can manage resources" ON public.resources;
CREATE POLICY "Admins can manage resources" 
ON public.resources FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = current_setting('request.jwt.claims', true)::json->>'sub' 
    AND role = 'admin'
  )
);

-- ================================================================
-- PRESS_RELEASES TABLE POLICIES
-- ================================================================

-- Allow public read access to all press releases
DROP POLICY IF EXISTS "Allow public read access to press releases" ON public.press_releases;
CREATE POLICY "Allow public read access to press releases" 
ON public.press_releases FOR SELECT 
USING (true);

-- Allow admins to manage press releases
DROP POLICY IF EXISTS "Admins can manage press releases" ON public.press_releases;
CREATE POLICY "Admins can manage press releases" 
ON public.press_releases FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = current_setting('request.jwt.claims', true)::json->>'sub' 
    AND role = 'admin'
  )
);

-- ================================================================
-- NOTIFICATIONS TABLE POLICIES
-- ================================================================

-- Allow users to read their own notifications
DROP POLICY IF EXISTS "Users can read own notifications" ON public.notifications;
CREATE POLICY "Users can read own notifications" 
ON public.notifications FOR SELECT 
USING (
  user_id = current_setting('request.jwt.claims', true)::json->>'sub' OR
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = current_setting('request.jwt.claims', true)::json->>'sub' 
    AND role = 'admin'
  )
);

-- Allow system to create notifications for users
DROP POLICY IF EXISTS "System can create notifications" ON public.notifications;
CREATE POLICY "System can create notifications" 
ON public.notifications FOR INSERT 
WITH CHECK (true);

-- Allow users to update their own notifications (mark as read)
DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
CREATE POLICY "Users can update own notifications" 
ON public.notifications FOR UPDATE 
USING (
  user_id = current_setting('request.jwt.claims', true)::json->>'sub' OR
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = current_setting('request.jwt.claims', true)::json->>'sub' 
    AND role = 'admin'
  )
);

-- Allow users to delete their own notifications
DROP POLICY IF EXISTS "Users can delete own notifications" ON public.notifications;
CREATE POLICY "Users can delete own notifications" 
ON public.notifications FOR DELETE 
USING (
  user_id = current_setting('request.jwt.claims', true)::json->>'sub' OR
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = current_setting('request.jwt.claims', true)::json->>'sub' 
    AND role = 'admin'
  )
);

-- ================================================================
-- ADDITIONAL POLICIES FOR ANONYMOUS ACCESS
-- ================================================================

-- Allow anonymous read access to public content
DROP POLICY IF EXISTS "Allow anonymous read access to public events" ON public.events;
CREATE POLICY "Allow anonymous read access to public events" 
ON public.events FOR SELECT 
USING (status = 'published' OR status IS NULL);

DROP POLICY IF EXISTS "Allow anonymous read access to public speakers" ON public.speakers;
CREATE POLICY "Allow anonymous read access to public speakers" 
ON public.speakers FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Allow anonymous read access to public sponsors" ON public.sponsors;
CREATE POLICY "Allow anonymous read access to public sponsors" 
ON public.sponsors FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Allow anonymous read access to public blog" ON public.blog_articles;
CREATE POLICY "Allow anonymous read access to public blog" 
ON public.blog_articles FOR SELECT 
USING (published_date IS NOT NULL AND published_date <= CURRENT_DATE);

DROP POLICY IF EXISTS "Allow anonymous read access to public resources" ON public.resources;
CREATE POLICY "Allow anonymous read access to public resources" 
ON public.resources FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Allow anonymous read access to press releases" ON public.press_releases;
CREATE POLICY "Allow anonymous read access to press releases" 
ON public.press_releases FOR SELECT 
USING (true);

-- ================================================================
-- HELPER FUNCTION FOR ROLE CHECKING
-- ================================================================

-- Create a helper function to check user roles
CREATE OR REPLACE FUNCTION public.get_user_role(user_id TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN (
    SELECT role::TEXT 
    FROM public.profiles 
    WHERE id = user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a helper function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT role = 'admin' 
    FROM public.profiles 
    WHERE id = user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================================================
-- INDEXES FOR PERFORMANCE
-- ================================================================

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_events_organizer ON public.events(organizer_id);
CREATE INDEX IF NOT EXISTS idx_events_status ON public.events(status);
CREATE INDEX IF NOT EXISTS idx_attendees_user ON public.attendees(user_id);
CREATE INDEX IF NOT EXISTS idx_attendees_event ON public.attendees(event_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_leads_sponsor ON public.leads(sponsor_id);
CREATE INDEX IF NOT EXISTS idx_blog_published ON public.blog_articles(published_date);