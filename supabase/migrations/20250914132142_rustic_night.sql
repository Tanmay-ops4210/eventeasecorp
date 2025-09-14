/*
  # Event Management System Schema

  1. New Tables
    - `events`
      - `id` (uuid, primary key)
      - `organizer_id` (uuid, references app_users.id)
      - `title` (text, not null)
      - `description` (text)
      - `date` (date, not null)
      - `time` (time, not null)
      - `end_time` (time)
      - `location` (text, not null)
      - `capacity` (integer, not null)
      - `image_url` (text)
      - `category` (text, default 'conference')
      - `status` (text, default 'draft')
      - `visibility` (text, default 'public')
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())

    - `ticket_types`
      - `id` (uuid, primary key)
      - `event_id` (uuid, references events.id)
      - `name` (text, not null)
      - `description` (text)
      - `price` (decimal, not null)
      - `currency` (text, default 'USD')
      - `quantity` (integer, not null)
      - `sold` (integer, default 0)
      - `sale_start` (timestamptz, not null)
      - `sale_end` (timestamptz, not null)
      - `is_active` (boolean, default true)
      - `benefits` (text[])
      - `restrictions` (text[])
      - `created_at` (timestamptz, default now())

    - `event_attendees`
      - `id` (uuid, primary key)
      - `event_id` (uuid, references events.id)
      - `user_id` (uuid, references app_users.id)
      - `ticket_type_id` (uuid, references ticket_types.id)
      - `registration_date` (timestamptz, default now())
      - `check_in_status` (text, default 'pending')
      - `payment_status` (text, default 'pending')
      - `additional_info` (jsonb)

    - `event_analytics`
      - `id` (uuid, primary key)
      - `event_id` (uuid, references events.id)
      - `views` (integer, default 0)
      - `registrations` (integer, default 0)
      - `conversion_rate` (decimal, default 0)
      - `revenue` (decimal, default 0)
      - `top_referrers` (text[])
      - `updated_at` (timestamptz, default now())

    - `marketing_campaigns`
      - `id` (uuid, primary key)
      - `event_id` (uuid, references events.id)
      - `name` (text, not null)
      - `type` (text, not null)
      - `subject` (text)
      - `content` (text)
      - `audience` (text)
      - `status` (text, default 'draft')
      - `sent_date` (timestamptz)
      - `open_rate` (decimal, default 0)
      - `click_rate` (decimal, default 0)
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on all tables
    - Add policies for organizers to manage their own events
    - Add policies for attendees to view public events
    - Add policies for analytics and marketing data access

  3. Functions
    - Update trigger for events table
    - Function to calculate analytics
    - Function to update ticket sales
*/

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id uuid NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  date date NOT NULL,
  time time NOT NULL,
  end_time time,
  location text NOT NULL,
  capacity integer NOT NULL CHECK (capacity > 0),
  image_url text,
  category text DEFAULT 'conference',
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'ongoing', 'completed', 'cancelled')),
  visibility text DEFAULT 'public' CHECK (visibility IN ('public', 'private', 'unlisted')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create ticket_types table
CREATE TABLE IF NOT EXISTS ticket_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  price decimal(10,2) NOT NULL CHECK (price >= 0),
  currency text DEFAULT 'USD',
  quantity integer NOT NULL CHECK (quantity > 0),
  sold integer DEFAULT 0 CHECK (sold >= 0 AND sold <= quantity),
  sale_start timestamptz NOT NULL,
  sale_end timestamptz NOT NULL,
  is_active boolean DEFAULT true,
  benefits text[] DEFAULT '{}',
  restrictions text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_sale_period CHECK (sale_end > sale_start)
);

-- Create event_attendees table
CREATE TABLE IF NOT EXISTS event_attendees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  ticket_type_id uuid NOT NULL REFERENCES ticket_types(id) ON DELETE CASCADE,
  registration_date timestamptz DEFAULT now(),
  check_in_status text DEFAULT 'pending' CHECK (check_in_status IN ('pending', 'checked-in', 'no-show')),
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'refunded')),
  additional_info jsonb DEFAULT '{}',
  UNIQUE(event_id, user_id, ticket_type_id)
);

-- Create event_analytics table
CREATE TABLE IF NOT EXISTS event_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE UNIQUE,
  views integer DEFAULT 0,
  registrations integer DEFAULT 0,
  conversion_rate decimal(5,2) DEFAULT 0,
  revenue decimal(10,2) DEFAULT 0,
  top_referrers text[] DEFAULT '{}',
  updated_at timestamptz DEFAULT now()
);

-- Create marketing_campaigns table
CREATE TABLE IF NOT EXISTS marketing_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('email', 'social', 'sms', 'push')),
  subject text,
  content text,
  audience text,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sent', 'cancelled')),
  sent_date timestamptz,
  open_rate decimal(5,2) DEFAULT 0,
  click_rate decimal(5,2) DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_campaigns ENABLE ROW LEVEL SECURITY;

-- Events policies
CREATE POLICY "Organizers can manage their own events"
  ON events
  FOR ALL
  TO authenticated
  USING (organizer_id = auth.uid()::uuid);

CREATE POLICY "Users can view published events"
  ON events
  FOR SELECT
  TO authenticated
  USING (status = 'published' AND visibility = 'public');

-- Ticket types policies
CREATE POLICY "Organizers can manage ticket types for their events"
  ON ticket_types
  FOR ALL
  TO authenticated
  USING (
    event_id IN (
      SELECT id FROM events WHERE organizer_id = auth.uid()::uuid
    )
  );

CREATE POLICY "Users can view ticket types for published events"
  ON ticket_types
  FOR SELECT
  TO authenticated
  USING (
    event_id IN (
      SELECT id FROM events WHERE status = 'published' AND visibility = 'public'
    )
  );

-- Event attendees policies
CREATE POLICY "Organizers can view attendees for their events"
  ON event_attendees
  FOR SELECT
  TO authenticated
  USING (
    event_id IN (
      SELECT id FROM events WHERE organizer_id = auth.uid()::uuid
    )
  );

CREATE POLICY "Users can manage their own registrations"
  ON event_attendees
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid()::uuid);

-- Analytics policies
CREATE POLICY "Organizers can view analytics for their events"
  ON event_analytics
  FOR ALL
  TO authenticated
  USING (
    event_id IN (
      SELECT id FROM events WHERE organizer_id = auth.uid()::uuid
    )
  );

-- Marketing campaigns policies
CREATE POLICY "Organizers can manage campaigns for their events"
  ON marketing_campaigns
  FOR ALL
  TO authenticated
  USING (
    event_id IN (
      SELECT id FROM events WHERE organizer_id = auth.uid()::uuid
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_events_organizer_id ON events(organizer_id);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_ticket_types_event_id ON ticket_types(event_id);
CREATE INDEX IF NOT EXISTS idx_event_attendees_event_id ON event_attendees(event_id);
CREATE INDEX IF NOT EXISTS idx_event_attendees_user_id ON event_attendees(user_id);
CREATE INDEX IF NOT EXISTS idx_event_analytics_event_id ON event_analytics(event_id);
CREATE INDEX IF NOT EXISTS idx_marketing_campaigns_event_id ON marketing_campaigns(event_id);

-- Create trigger function for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
DROP TRIGGER IF EXISTS update_events_updated_at ON events;
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_event_analytics_updated_at ON event_analytics;
CREATE TRIGGER update_event_analytics_updated_at
  BEFORE UPDATE ON event_analytics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically create analytics record when event is created
CREATE OR REPLACE FUNCTION create_event_analytics()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO event_analytics (event_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS create_analytics_on_event_creation ON events;
CREATE TRIGGER create_analytics_on_event_creation
  AFTER INSERT ON events
  FOR EACH ROW
  EXECUTE FUNCTION create_event_analytics();

-- Function to update analytics when attendee registers
CREATE OR REPLACE FUNCTION update_analytics_on_registration()
RETURNS TRIGGER AS $$
BEGIN
  -- Update registrations count
  UPDATE event_analytics 
  SET 
    registrations = registrations + 1,
    updated_at = now()
  WHERE event_id = NEW.event_id;
  
  -- Update ticket sold count
  UPDATE ticket_types 
  SET sold = sold + 1
  WHERE id = NEW.ticket_type_id;
  
  -- Update revenue in analytics
  UPDATE event_analytics 
  SET 
    revenue = revenue + (SELECT price FROM ticket_types WHERE id = NEW.ticket_type_id),
    updated_at = now()
  WHERE event_id = NEW.event_id;
  
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_analytics_on_registration ON event_attendees;
CREATE TRIGGER update_analytics_on_registration
  AFTER INSERT ON event_attendees
  FOR EACH ROW
  EXECUTE FUNCTION update_analytics_on_registration();

-- Function to calculate conversion rate
CREATE OR REPLACE FUNCTION calculate_conversion_rate(event_uuid uuid)
RETURNS decimal AS $$
DECLARE
  total_views integer;
  total_registrations integer;
  conversion_rate decimal;
BEGIN
  SELECT views, registrations INTO total_views, total_registrations
  FROM event_analytics
  WHERE event_id = event_uuid;
  
  IF total_views > 0 THEN
    conversion_rate = (total_registrations::decimal / total_views::decimal) * 100;
  ELSE
    conversion_rate = 0;
  END IF;
  
  UPDATE event_analytics 
  SET 
    conversion_rate = conversion_rate,
    updated_at = now()
  WHERE event_id = event_uuid;
  
  RETURN conversion_rate;
END;
$$ language 'plpgsql';