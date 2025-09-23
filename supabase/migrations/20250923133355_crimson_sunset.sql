/*
  # Organizer Section - Simple CRUD Schema

  1. New Tables
    - `organizer_events` - Core event data with simple structure
    - `organizer_ticket_types` - Ticket types for events
    - `organizer_event_analytics` - Basic analytics per event
    - `organizer_attendees` - Event registrations

  2. Security
    - Enable RLS on all tables
    - Add policies for organizers to manage their own data

  3. Simple Flow
    - Create Event → Dashboard/My Events → Analytics → Ticketing → Publish
*/

-- Drop existing tables if they exist
DROP TABLE IF EXISTS public.organizer_attendees CASCADE;
DROP TABLE IF EXISTS public.organizer_event_analytics CASCADE;
DROP TABLE IF EXISTS public.organizer_ticket_types CASCADE;
DROP TABLE IF EXISTS public.organizer_events CASCADE;

-- Create organizer_events table
CREATE TABLE IF NOT EXISTS public.organizer_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  category text DEFAULT 'conference',
  event_date date NOT NULL,
  time time NOT NULL,
  end_time time,
  venue text NOT NULL,
  capacity integer NOT NULL DEFAULT 100,
  image_url text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'ongoing', 'completed', 'cancelled')),
  visibility text NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'private', 'unlisted')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create organizer_ticket_types table
CREATE TABLE IF NOT EXISTS public.organizer_ticket_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.organizer_events(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  price numeric(10,2) NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'USD',
  quantity integer NOT NULL DEFAULT 100,
  sold integer NOT NULL DEFAULT 0,
  sale_start timestamptz DEFAULT now(),
  sale_end timestamptz,
  is_active boolean DEFAULT true,
  benefits text[] DEFAULT '{}',
  restrictions text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create organizer_event_analytics table
CREATE TABLE IF NOT EXISTS public.organizer_event_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.organizer_events(id) ON DELETE CASCADE,
  views integer DEFAULT 0,
  registrations integer DEFAULT 0,
  conversion_rate numeric(5,2) DEFAULT 0.0,
  revenue numeric(10,2) DEFAULT 0.0,
  top_referrers text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(event_id)
);

-- Create organizer_attendees table
CREATE TABLE IF NOT EXISTS public.organizer_attendees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.organizer_events(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  ticket_type_id uuid REFERENCES public.organizer_ticket_types(id) ON DELETE SET NULL,
  registration_date timestamptz DEFAULT now(),
  check_in_status text DEFAULT 'pending' CHECK (check_in_status IN ('pending', 'checked-in', 'no-show')),
  payment_status text DEFAULT 'completed' CHECK (payment_status IN ('pending', 'completed', 'refunded')),
  additional_info jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(event_id, user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_organizer_events_organizer ON public.organizer_events(organizer_id);
CREATE INDEX IF NOT EXISTS idx_organizer_events_status ON public.organizer_events(status);
CREATE INDEX IF NOT EXISTS idx_organizer_events_date ON public.organizer_events(event_date);
CREATE INDEX IF NOT EXISTS idx_organizer_ticket_types_event ON public.organizer_ticket_types(event_id);
CREATE INDEX IF NOT EXISTS idx_organizer_attendees_event ON public.organizer_attendees(event_id);
CREATE INDEX IF NOT EXISTS idx_organizer_attendees_user ON public.organizer_attendees(user_id);

-- Enable RLS on all tables
ALTER TABLE public.organizer_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizer_ticket_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizer_event_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizer_attendees ENABLE ROW LEVEL SECURITY;

-- RLS Policies for organizer_events
CREATE POLICY "Organizers can manage their own events"
  ON public.organizer_events
  FOR ALL
  TO authenticated
  USING (organizer_id = auth.uid())
  WITH CHECK (organizer_id = auth.uid());

CREATE POLICY "Public can view published events"
  ON public.organizer_events
  FOR SELECT
  TO public
  USING (status = 'published' AND visibility = 'public');

-- RLS Policies for organizer_ticket_types
CREATE POLICY "Organizers can manage their event tickets"
  ON public.organizer_ticket_types
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.organizer_events 
      WHERE id = event_id AND organizer_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.organizer_events 
      WHERE id = event_id AND organizer_id = auth.uid()
    )
  );

CREATE POLICY "Public can view tickets for published events"
  ON public.organizer_ticket_types
  FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM public.organizer_events 
      WHERE id = event_id AND status = 'published' AND visibility = 'public'
    )
  );

-- RLS Policies for organizer_event_analytics
CREATE POLICY "Organizers can view their event analytics"
  ON public.organizer_event_analytics
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.organizer_events 
      WHERE id = event_id AND organizer_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.organizer_events 
      WHERE id = event_id AND organizer_id = auth.uid()
    )
  );

-- RLS Policies for organizer_attendees
CREATE POLICY "Organizers can manage their event attendees"
  ON public.organizer_attendees
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.organizer_events 
      WHERE id = event_id AND organizer_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.organizer_events 
      WHERE id = event_id AND organizer_id = auth.uid()
    )
  );

CREATE POLICY "Users can register for events"
  ON public.organizer_attendees
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.organizer_events 
      WHERE id = event_id AND status = 'published'
    )
  );

CREATE POLICY "Users can view their own registrations"
  ON public.organizer_attendees
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Create trigger function for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_organizer_events_updated_at
  BEFORE UPDATE ON public.organizer_events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_organizer_event_analytics_updated_at
  BEFORE UPDATE ON public.organizer_event_analytics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_organizer_attendees_updated_at
  BEFORE UPDATE ON public.organizer_attendees
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to automatically create analytics when event is created
CREATE OR REPLACE FUNCTION create_event_analytics_for_organizer()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.organizer_event_analytics (event_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to auto-create analytics
CREATE TRIGGER create_analytics_on_organizer_event_insert
  AFTER INSERT ON public.organizer_events
  FOR EACH ROW EXECUTE FUNCTION create_event_analytics_for_organizer();