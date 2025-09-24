/*
  # Complete Organizer Event Management System

  1. New Tables
    - `organizer_events` - Main events table for organizers
    - `organizer_ticket_types` - Ticket types for events
    - `organizer_attendees` - Event attendees management
    - `organizer_event_analytics` - Event analytics and metrics

  2. Security
    - Enable RLS on all new tables
    - Add policies for organizers to manage their own events
    - Add policies for attendees to view published events

  3. Functions
    - Auto-create analytics record when event is created
    - Update analytics when attendees register
    - Handle updated_at timestamps

  4. Indexes
    - Performance indexes for common queries
    - Unique constraints where needed
*/

-- Create organizer_events table
CREATE TABLE IF NOT EXISTS organizer_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  category text DEFAULT 'conference',
  event_date date NOT NULL,
  time time NOT NULL,
  end_time time,
  venue text NOT NULL,
  capacity integer DEFAULT 100,
  image_url text,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'ongoing', 'completed', 'cancelled')),
  visibility text DEFAULT 'public' CHECK (visibility IN ('public', 'private', 'unlisted')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  price numeric(10,2) DEFAULT 0,
  currency text DEFAULT 'INR'
);

-- Create organizer_ticket_types table
CREATE TABLE IF NOT EXISTS organizer_ticket_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES organizer_events(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  price numeric(10,2) DEFAULT 0,
  currency text DEFAULT 'USD',
  quantity integer DEFAULT 100,
  sold integer DEFAULT 0,
  sale_start timestamptz DEFAULT now(),
  sale_end timestamptz,
  is_active boolean DEFAULT true,
  benefits text[] DEFAULT '{}',
  restrictions text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create organizer_attendees table
CREATE TABLE IF NOT EXISTS organizer_attendees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES organizer_events(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  ticket_type_id uuid REFERENCES organizer_ticket_types(id),
  registration_date timestamptz DEFAULT now(),
  check_in_status text DEFAULT 'pending' CHECK (check_in_status IN ('pending', 'checked-in', 'no-show')),
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'refunded')),
  additional_info jsonb DEFAULT '{}'
);

-- Create organizer_event_analytics table
CREATE TABLE IF NOT EXISTS organizer_event_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES organizer_events(id) ON DELETE CASCADE,
  views integer DEFAULT 0,
  registrations integer DEFAULT 0,
  conversion_rate numeric(5,2) DEFAULT 0,
  revenue numeric(10,2) DEFAULT 0,
  top_referrers text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE organizer_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizer_ticket_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizer_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizer_event_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for organizer_events
CREATE POLICY "Organizers can create events"
  ON organizer_events
  FOR INSERT
  TO authenticated
  WITH CHECK (organizer_id = auth.uid());

CREATE POLICY "Organizers can read own events"
  ON organizer_events
  FOR SELECT
  TO authenticated
  USING (organizer_id = auth.uid());

CREATE POLICY "Organizers can update own events"
  ON organizer_events
  FOR UPDATE
  TO authenticated
  USING (organizer_id = auth.uid());

CREATE POLICY "Organizers can delete own events"
  ON organizer_events
  FOR DELETE
  TO authenticated
  USING (organizer_id = auth.uid());

-- RLS Policies for organizer_ticket_types
CREATE POLICY "Organizers can manage tickets for own events"
  ON organizer_ticket_types
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM organizer_events
      WHERE organizer_events.id = organizer_ticket_types.event_id
      AND organizer_events.organizer_id = auth.uid()
    )
  );

-- RLS Policies for organizer_attendees
CREATE POLICY "Organizers can manage attendees for own events"
  ON organizer_attendees
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM organizer_events
      WHERE organizer_events.id = organizer_attendees.event_id
      AND organizer_events.organizer_id = auth.uid()
    )
  );

CREATE POLICY "Users can read own attendance records"
  ON organizer_attendees
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- RLS Policies for organizer_event_analytics
CREATE POLICY "Organizers can view analytics for own events"
  ON organizer_event_analytics
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM organizer_events
      WHERE organizer_events.id = organizer_event_analytics.event_id
      AND organizer_events.organizer_id = auth.uid()
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_organizer_events_organizer_id ON organizer_events(organizer_id);
CREATE INDEX IF NOT EXISTS idx_organizer_events_status ON organizer_events(status);
CREATE INDEX IF NOT EXISTS idx_organizer_events_event_date ON organizer_events(event_date);
CREATE INDEX IF NOT EXISTS idx_organizer_ticket_types_event_id ON organizer_ticket_types(event_id);
CREATE INDEX IF NOT EXISTS idx_organizer_attendees_event_id ON organizer_attendees(event_id);
CREATE INDEX IF NOT EXISTS idx_organizer_attendees_user_id ON organizer_attendees(user_id);

-- Create unique constraint for analytics (one record per event)
CREATE UNIQUE INDEX IF NOT EXISTS unique_event_analytics ON organizer_event_analytics(event_id);

-- Create function to handle updated_at timestamps
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER handle_updated_at
  BEFORE UPDATE ON organizer_events
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_updated_at
  BEFORE UPDATE ON organizer_event_analytics
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Create function to auto-create analytics record
CREATE OR REPLACE FUNCTION create_event_analytics()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO organizer_event_analytics (event_id, views, registrations, conversion_rate, revenue, top_referrers)
  VALUES (NEW.id, 0, 0, 0, 0, '{}');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-create analytics
CREATE TRIGGER on_organizer_event_created
  AFTER INSERT ON organizer_events
  FOR EACH ROW
  EXECUTE FUNCTION create_event_analytics();

-- Create function to update analytics on registration
CREATE OR REPLACE FUNCTION update_analytics_on_registration()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE organizer_event_analytics
  SET 
    registrations = registrations + 1,
    updated_at = now()
  WHERE event_id = NEW.event_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update analytics on attendee registration
CREATE TRIGGER on_attendee_registered
  AFTER INSERT ON organizer_attendees
  FOR EACH ROW
  EXECUTE FUNCTION update_analytics_on_registration();