/*
  # Fix Organizer RLS Policies

  1. New Policies
    - Allow organizers to create their own events
    - Allow organizers to view their own events  
    - Allow organizers to update their own events
    - Allow organizers to delete their own events
    - Allow organizers to manage their ticket types
    - Allow organizers to view their attendees

  2. Security
    - Ensure users can only access their own events
    - Maintain admin override capabilities
    - Protect against unauthorized access

  3. Changes
    - Drop existing conflicting policies
    - Create new comprehensive policies
    - Add helper functions for better policy management
*/

-- Drop existing policies that might conflict
DROP POLICY IF EXISTS "Organizers can manage own events" ON public.organizer_events;
DROP POLICY IF EXISTS "Organizers can manage tickets for own events" ON public.organizer_ticket_types;
DROP POLICY IF EXISTS "Organizers can manage attendees for own events" ON public.organizer_attendees;
DROP POLICY IF EXISTS "Organizers can view analytics for own events" ON public.organizer_event_analytics;

-- Create comprehensive policies for organizer_events
CREATE POLICY "Organizers can create their own events"
  ON public.organizer_events
  FOR INSERT
  WITH CHECK (auth.uid() = organizer_id OR is_admin_user());

CREATE POLICY "Organizers can view their own events"
  ON public.organizer_events
  FOR SELECT
  USING (auth.uid() = organizer_id OR is_admin_user());

CREATE POLICY "Organizers can update their own events"
  ON public.organizer_events
  FOR UPDATE
  USING (auth.uid() = organizer_id OR is_admin_user())
  WITH CHECK (auth.uid() = organizer_id OR is_admin_user());

CREATE POLICY "Organizers can delete their own events"
  ON public.organizer_events
  FOR DELETE
  USING (auth.uid() = organizer_id OR is_admin_user());

-- Create policies for organizer_ticket_types
CREATE POLICY "Organizers can manage tickets for own events"
  ON public.organizer_ticket_types
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.organizer_events
      WHERE organizer_events.id = organizer_ticket_types.event_id
      AND (organizer_events.organizer_id = auth.uid() OR is_admin_user())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.organizer_events
      WHERE organizer_events.id = organizer_ticket_types.event_id
      AND (organizer_events.organizer_id = auth.uid() OR is_admin_user())
    )
  );

-- Create policies for organizer_attendees
CREATE POLICY "Organizers can manage attendees for own events"
  ON public.organizer_attendees
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.organizer_events
      WHERE organizer_events.id = organizer_attendees.event_id
      AND (organizer_events.organizer_id = auth.uid() OR is_admin_user())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.organizer_events
      WHERE organizer_events.id = organizer_attendees.event_id
      AND (organizer_events.organizer_id = auth.uid() OR is_admin_user())
    )
  );

-- Create policies for organizer_event_analytics
CREATE POLICY "Organizers can view analytics for own events"
  ON public.organizer_event_analytics
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.organizer_events
      WHERE organizer_events.id = organizer_event_analytics.event_id
      AND (organizer_events.organizer_id = auth.uid() OR is_admin_user())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.organizer_events
      WHERE organizer_events.id = organizer_event_analytics.event_id
      AND (organizer_events.organizer_id = auth.uid() OR is_admin_user())
    )
  );

-- Ensure RLS is enabled on all tables
ALTER TABLE public.organizer_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizer_ticket_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizer_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizer_event_analytics ENABLE ROW LEVEL SECURITY;

-- Create helper function to check if user exists in profiles table
CREATE OR REPLACE FUNCTION public.user_exists()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on helper functions
GRANT EXECUTE ON FUNCTION public.user_exists() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin_user() TO authenticated;