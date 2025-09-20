-- ================================================================
-- ENABLE RLS ON ALL TABLES
-- ================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.speakers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_speakers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booths ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.press_releases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- ================================================================
-- HELPER FUNCTIONS (MUST BE CREATED BEFORE POLICIES THAT USE THEM)
-- ================================================================

-- Create a helper function to check user roles
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
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
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
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
WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- ** FIXED POLICY ** Admins can manage all profiles
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;
CREATE POLICY "Admins can manage all profiles"
ON public.profiles FOR ALL
USING ( public.is_admin(auth.uid()) );


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
    WHERE id = auth.uid()
    AND role IN ('organizer', 'admin')
  )
);

-- Allow organizers to manage their own events
DROP POLICY IF EXISTS "Organizers can manage own events" ON public.events;
CREATE POLICY "Organizers can manage own events"
ON public.events FOR ALL
USING (
  organizer_id = auth.uid() OR public.is_admin(auth.uid())
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
      events.organizer_id = auth.uid() OR public.is_admin(auth.uid())
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
  user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.events
    WHERE events.id = attendees.event_id
    AND events.organizer_id = auth.uid()
  ) OR
  public.is_admin(auth.uid())
);

-- Allow users to register for events
DROP POLICY IF EXISTS "Users can register for events" ON public.attendees;
CREATE POLICY "Users can register for events"
ON public.attendees FOR INSERT
WITH CHECK (
  user_id = auth.uid() AND
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
  user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM public.events
    WHERE events.id = attendees.event_id
    AND events.organizer_id = auth.uid()
  ) OR
  public.is_admin(auth.uid())
);

-- Allow users to cancel their registrations
DROP POLICY IF EXISTS "Users can cancel own registrations" ON public.attendees;
CREATE POLICY "Users can cancel own registrations"
ON public.attendees FOR DELETE
USING (
  user_id = auth.uid() OR public.is_admin(auth.uid())
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
USING ( public.is_admin(auth.uid()) );

-- Allow organizers to manage speakers for their events
DROP POLICY IF EXISTS "Organizers can manage event speakers" ON public.speakers;
CREATE POLICY "Organizers can manage event speakers"
ON public.speakers FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
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
      events.organizer_id = auth.uid() OR public.is_admin(auth.uid())
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
    WHERE id = auth.uid()
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
    AND events.organizer_id = auth.uid()
  ) OR
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
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
      WHERE id = auth.uid()
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
      WHERE id = auth.uid()
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
  author_id = auth.uid() OR public.is_admin(auth.uid())
);

-- Allow content creators to create articles
DROP POLICY IF EXISTS "Content creators can create articles" ON public.blog_articles;
CREATE POLICY "Content creators can create articles"
ON public.blog_articles FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
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
USING ( public.is_admin(auth.uid()) );

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
USING ( public.is_admin(auth.uid()) );

-- ================================================================
-- NOTIFICATIONS TABLE POLICIES
-- ================================================================

-- Allow users to read their own notifications
DROP POLICY IF EXISTS "Users can read own notifications" ON public.notifications;
CREATE POLICY "Users can read own notifications"
ON public.notifications FOR SELECT
USING ( user_id = auth.uid() OR public.is_admin(auth.uid()) );

-- Allow system to create notifications for users
DROP POLICY IF EXISTS "System can create notifications" ON public.notifications;
CREATE POLICY "System can create notifications"
ON public.notifications FOR INSERT
WITH CHECK (true);

-- Allow users to update their own notifications (mark as read)
DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
CREATE POLICY "Users can update own notifications"
ON public.notifications FOR UPDATE
USING ( user_id = auth.uid() OR public.is_admin(auth.uid()) );

-- Allow users to delete their own notifications
DROP POLICY IF EXISTS "Users can delete own notifications" ON public.notifications;
CREATE POLICY "Users can delete own notifications"
ON public.notifications FOR DELETE
USING ( user_id = auth.uid() OR public.is_admin(auth.uid()) );


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
