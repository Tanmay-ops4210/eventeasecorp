/*
  # Fix Events Database Schema

  This migration fixes the database schema issues and ensures proper table structure
  for the event management system organizer flow.

  ## Changes Made

  1. **Events Table Updates**
     - Add missing 'date' column (mapped from event_date)
     - Ensure all required columns for organizer flow
     - Add proper indexing for performance

  2. **Table Relationships**
     - Ensure proper foreign key relationships
     - Add junction tables where needed
     - Update RLS policies for security

  3. **New/Updated Tables**
     - events: Core event information
     - ticket_types: Event ticket configurations  
     - attendees: Event registrations
     - event_analytics: Performance tracking
     - marketing_campaigns: Email/marketing campaigns

  ## Security
  - Enable RLS on all tables
  - Add policies for organizers to manage their events
  - Add policies for attendees to view/register for events
*/

-- First, let's add the missing 'date' column to events table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'date'
  ) THEN
    ALTER TABLE events ADD COLUMN date DATE;
    
    -- Populate the new 'date' column from event_date if it exists
    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'events' AND column_name = 'event_date'
    ) THEN
      UPDATE events SET date = event_date WHERE event_date IS NOT NULL;
    END IF;
  END IF;
END $$;

-- Add missing 'time' column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'time'
  ) THEN
    ALTER TABLE events ADD COLUMN time TIME DEFAULT '09:00:00';
  END IF;
END $$;

-- Add missing 'end_time' column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'end_time'
  ) THEN
    ALTER TABLE events ADD COLUMN end_time TIME;
  END IF;
END $$;

-- Add missing 'venue' column if it doesn't exist (rename from venue_name if needed)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'venue'
  ) THEN
    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'events' AND column_name = 'venue_name'
    ) THEN
      ALTER TABLE events RENAME COLUMN venue_name TO venue;
    ELSE
      ALTER TABLE events ADD COLUMN venue TEXT;
    END IF;
  END IF;
END $$;

-- Ensure events table has all required columns for the organizer flow
DO $$
BEGIN
  -- Add image_url column if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'image_url'
  ) THEN
    ALTER TABLE events ADD COLUMN image_url TEXT;
  END IF;

  -- Add visibility column if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'visibility'
  ) THEN
    ALTER TABLE events ADD COLUMN visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'private', 'unlisted'));
  END IF;
END $$;

-- Create event_analytics table if it doesn't exist
CREATE TABLE IF NOT EXISTS event_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  views INTEGER DEFAULT 0,
  registrations INTEGER DEFAULT 0,
  conversion_rate DECIMAL(5,2) DEFAULT 0.0,
  revenue DECIMAL(10,2) DEFAULT 0.0,
  top_referrers TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(event_id)
);

-- Create marketing_campaigns table if it doesn't exist
CREATE TABLE IF NOT EXISTS marketing_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'email' CHECK (type IN ('email', 'social', 'sms', 'push')),
  subject TEXT,
  content TEXT,
  audience TEXT DEFAULT 'all_subscribers',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sent', 'cancelled')),
  sent_date TIMESTAMPTZ,
  open_rate DECIMAL(5,2) DEFAULT 0.0,
  click_rate DECIMAL(5,2) DEFAULT 0.0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create event_attendees table if it doesn't exist (different from attendees table)
CREATE TABLE IF NOT EXISTS event_attendees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  ticket_type_id UUID REFERENCES ticket_types(id) ON DELETE SET NULL,
  registration_date TIMESTAMPTZ DEFAULT now(),
  check_in_status TEXT DEFAULT 'pending' CHECK (check_in_status IN ('pending', 'checked-in', 'no-show')),
  payment_status TEXT DEFAULT 'completed' CHECK (payment_status IN ('pending', 'completed', 'refunded')),
  additional_info JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(event_id, user_id)
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_events_organizer_status ON events(organizer_id, status);
CREATE INDEX IF NOT EXISTS idx_events_visibility_status ON events(visibility, status);
CREATE INDEX IF NOT EXISTS idx_event_analytics_event ON event_analytics(event_id);
CREATE INDEX IF NOT EXISTS idx_marketing_campaigns_event ON marketing_campaigns(event_id);
CREATE INDEX IF NOT EXISTS idx_event_attendees_event ON event_attendees(event_id);
CREATE INDEX IF NOT EXISTS idx_event_attendees_user ON event_attendees(user_id);
CREATE INDEX IF NOT EXISTS idx_ticket_types_event_active ON ticket_types(event_id, is_active);

-- Enable RLS on new tables
ALTER TABLE event_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_attendees ENABLE ROW LEVEL SECURITY;

-- RLS Policies for event_analytics
CREATE POLICY "Organizers can view their event analytics"
  ON event_analytics
  FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM events 
      WHERE events.id = event_analytics.event_id 
      AND events.organizer_id = auth.uid()
    )
  );

CREATE POLICY "System can update event analytics"
  ON event_analytics
  FOR ALL
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM events 
      WHERE events.id = event_analytics.event_id 
      AND events.organizer_id = auth.uid()
    )
  );

-- RLS Policies for marketing_campaigns
CREATE POLICY "Organizers can manage their marketing campaigns"
  ON marketing_campaigns
  FOR ALL
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM events 
      WHERE events.id = marketing_campaigns.event_id 
      AND events.organizer_id = auth.uid()
    )
  );

-- RLS Policies for event_attendees
CREATE POLICY "Organizers can view their event attendees"
  ON event_attendees
  FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM events 
      WHERE events.id = event_attendees.event_id 
      AND events.organizer_id = auth.uid()
    )
  );

CREATE POLICY "Organizers can manage their event attendees"
  ON event_attendees
  FOR ALL
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM events 
      WHERE events.id = event_attendees.event_id 
      AND events.organizer_id = auth.uid()
    )
  );

CREATE POLICY "Users can view their own event registrations"
  ON event_attendees
  FOR SELECT
  TO public
  USING (user_id = auth.uid());

CREATE POLICY "Users can register for events"
  ON event_attendees
  FOR INSERT
  TO public
  WITH CHECK (
    user_id = auth.uid() 
    AND EXISTS (
      SELECT 1 FROM events 
      WHERE events.id = event_attendees.event_id 
      AND events.status = 'published'
    )
  );

-- Create trigger function for updating updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at columns
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_event_analytics_updated_at'
  ) THEN
    CREATE TRIGGER update_event_analytics_updated_at
      BEFORE UPDATE ON event_analytics
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_marketing_campaigns_updated_at'
  ) THEN
    CREATE TRIGGER update_marketing_campaigns_updated_at
      BEFORE UPDATE ON marketing_campaigns
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_event_attendees_updated_at'
  ) THEN
    CREATE TRIGGER update_event_attendees_updated_at
      BEFORE UPDATE ON event_attendees
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Create function to automatically create analytics record when event is published
CREATE OR REPLACE FUNCTION create_event_analytics()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create analytics when event is published for the first time
  IF NEW.status = 'published' AND (OLD.status IS NULL OR OLD.status != 'published') THEN
    INSERT INTO event_analytics (event_id)
    VALUES (NEW.id)
    ON CONFLICT (event_id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger for automatic analytics creation
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'create_analytics_on_publish'
  ) THEN
    CREATE TRIGGER create_analytics_on_publish
      AFTER INSERT OR UPDATE ON events
      FOR EACH ROW
      EXECUTE FUNCTION create_event_analytics();
  END IF;
END $$;

-- Ensure ticket_types table has all required columns
DO $$
BEGIN
  -- Add currency column if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ticket_types' AND column_name = 'currency'
  ) THEN
    ALTER TABLE ticket_types ADD COLUMN currency TEXT DEFAULT 'USD';
  END IF;

  -- Add sold column if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ticket_types' AND column_name = 'sold'
  ) THEN
    ALTER TABLE ticket_types ADD COLUMN sold INTEGER DEFAULT 0;
  END IF;

  -- Add benefits column if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ticket_types' AND column_name = 'benefits'
  ) THEN
    ALTER TABLE ticket_types ADD COLUMN benefits TEXT[] DEFAULT '{}';
  END IF;

  -- Add restrictions column if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ticket_types' AND column_name = 'restrictions'
  ) THEN
    ALTER TABLE ticket_types ADD COLUMN restrictions TEXT[] DEFAULT '{}';
  END IF;

  -- Add created_at column if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'ticket_types' AND column_name = 'created_at'
  ) THEN
    ALTER TABLE ticket_types ADD COLUMN created_at TIMESTAMPTZ DEFAULT now();
  END IF;
END $$;

-- Update existing RLS policies for events table to work with new columns
DROP POLICY IF EXISTS "Organizers can manage their own events" ON events;
CREATE POLICY "Organizers can manage their own events"
  ON events
  FOR ALL
  TO public
  USING (organizer_id = auth.uid())
  WITH CHECK (organizer_id = auth.uid());

-- Add policy for public to view published events
DROP POLICY IF EXISTS "Public can view published events" ON events;
CREATE POLICY "Public can view published events"
  ON events
  FOR SELECT
  TO public
  USING (status = 'published' AND visibility = 'public');

-- Ensure profiles table has proper structure for organizers
DO $$
BEGIN
  -- Add plan column if missing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'plan'
  ) THEN
    ALTER TABLE profiles ADD COLUMN plan TEXT DEFAULT 'free';
  END IF;
END $$;

-- Create a view for easier event queries with related data
CREATE OR REPLACE VIEW events_with_stats AS
SELECT 
  e.*,
  COALESCE(ea.views, 0) as total_views,
  COALESCE(ea.registrations, 0) as total_registrations,
  COALESCE(ea.revenue, 0) as total_revenue,
  COALESCE(tt_stats.total_tickets, 0) as total_tickets,
  COALESCE(tt_stats.sold_tickets, 0) as sold_tickets,
  p.full_name as organizer_name,
  p.company as organizer_company
FROM events e
LEFT JOIN event_analytics ea ON e.id = ea.event_id
LEFT JOIN profiles p ON e.organizer_id = p.id
LEFT JOIN (
  SELECT 
    event_id,
    SUM(quantity) as total_tickets,
    SUM(sold) as sold_tickets
  FROM ticket_types 
  GROUP BY event_id
) tt_stats ON e.id = tt_stats.event_id;

-- Grant access to the view
GRANT SELECT ON events_with_stats TO public;

-- Create RLS policy for the view
CREATE POLICY "View access follows events table policies"
  ON events_with_stats
  FOR SELECT
  TO public
  USING (
    -- Same logic as events table policies
    status = 'published' AND visibility = 'public'
    OR organizer_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Add helpful functions for the organizer flow
CREATE OR REPLACE FUNCTION get_event_dashboard_stats(organizer_uuid UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'totalEvents', COUNT(*),
    'publishedEvents', COUNT(*) FILTER (WHERE status = 'published'),
    'draftEvents', COUNT(*) FILTER (WHERE status = 'draft'),
    'upcomingEvents', COUNT(*) FILTER (WHERE status = 'published' AND date > CURRENT_DATE),
    'completedEvents', COUNT(*) FILTER (WHERE status = 'completed'),
    'totalRevenue', COALESCE(SUM(COALESCE(ea.revenue, 0)), 0),
    'totalRegistrations', COALESCE(SUM(COALESCE(ea.registrations, 0)), 0)
  ) INTO result
  FROM events e
  LEFT JOIN event_analytics ea ON e.id = ea.event_id
  WHERE e.organizer_id = organizer_uuid;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION get_event_dashboard_stats(UUID) TO public;

-- Add helpful indexes for the organizer dashboard queries
CREATE INDEX IF NOT EXISTS idx_events_organizer_date ON events(organizer_id, date);
CREATE INDEX IF NOT EXISTS idx_events_status_date ON events(status, date);
CREATE INDEX IF NOT EXISTS idx_ticket_types_event_sold ON ticket_types(event_id, sold);

-- Ensure all tables have proper constraints
DO $$
BEGIN
  -- Add check constraint for event dates
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints 
    WHERE constraint_name = 'events_date_future'
  ) THEN
    ALTER TABLE events ADD CONSTRAINT events_date_future 
    CHECK (date >= CURRENT_DATE OR status = 'completed');
  END IF;

  -- Add check constraint for ticket prices
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints 
    WHERE constraint_name = 'ticket_types_price_positive'
  ) THEN
    ALTER TABLE ticket_types ADD CONSTRAINT ticket_types_price_positive 
    CHECK (price >= 0);
  END IF;

  -- Add check constraint for ticket quantities
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints 
    WHERE constraint_name = 'ticket_types_quantity_positive'
  ) THEN
    ALTER TABLE ticket_types ADD CONSTRAINT ticket_types_quantity_positive 
    CHECK (quantity > 0);
  END IF;
END $$;

-- Create helpful function to increment event views
CREATE OR REPLACE FUNCTION increment_event_views(event_uuid UUID)
RETURNS VOID AS $$
BEGIN
  INSERT INTO event_analytics (event_id, views)
  VALUES (event_uuid, 1)
  ON CONFLICT (event_id)
  DO UPDATE SET 
    views = event_analytics.views + 1,
    updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION increment_event_views(UUID) TO public;

-- Create function to handle event registration
CREATE OR REPLACE FUNCTION register_for_event(
  event_uuid UUID,
  ticket_type_uuid UUID,
  user_uuid UUID DEFAULT auth.uid()
)
RETURNS JSON AS $$
DECLARE
  result JSON;
  ticket_available INTEGER;
  event_published BOOLEAN;
BEGIN
  -- Check if event is published and tickets are available
  SELECT 
    e.status = 'published',
    tt.quantity - COALESCE(tt.sold, 0)
  INTO event_published, ticket_available
  FROM events e
  JOIN ticket_types tt ON e.id = tt.event_id
  WHERE e.id = event_uuid AND tt.id = ticket_type_uuid;

  IF NOT event_published THEN
    RETURN json_build_object('success', false, 'error', 'Event is not available for registration');
  END IF;

  IF ticket_available <= 0 THEN
    RETURN json_build_object('success', false, 'error', 'No tickets available');
  END IF;

  -- Register the user
  INSERT INTO event_attendees (event_id, user_id, ticket_type_id)
  VALUES (event_uuid, user_uuid, ticket_type_uuid);

  -- Update ticket sold count
  UPDATE ticket_types 
  SET sold = COALESCE(sold, 0) + 1 
  WHERE id = ticket_type_uuid;

  -- Update event analytics
  INSERT INTO event_analytics (event_id, registrations)
  VALUES (event_uuid, 1)
  ON CONFLICT (event_id)
  DO UPDATE SET 
    registrations = event_analytics.registrations + 1,
    updated_at = now();

  RETURN json_build_object('success', true, 'message', 'Successfully registered for event');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION register_for_event(UUID, UUID, UUID) TO public;
GRANT EXECUTE ON FUNCTION register_for_event(UUID, UUID) TO public;

-- Add comments to tables for documentation
COMMENT ON TABLE event_analytics IS 'Stores analytics data for events including views, registrations, and revenue';
COMMENT ON TABLE marketing_campaigns IS 'Stores marketing campaigns created by organizers for their events';
COMMENT ON TABLE event_attendees IS 'Stores event registration data linking users to events with ticket information';

COMMENT ON COLUMN events.date IS 'Event date (separate from time for easier querying)';
COMMENT ON COLUMN events.time IS 'Event start time';
COMMENT ON COLUMN events.end_time IS 'Event end time (optional)';
COMMENT ON COLUMN events.venue IS 'Event venue name and location';
COMMENT ON COLUMN events.image_url IS 'URL for event banner/featured image';
COMMENT ON COLUMN events.visibility IS 'Event visibility: public, private, or unlisted';

-- Final verification: Ensure the events table has the required 'date' column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'date'
  ) THEN
    RAISE EXCEPTION 'Failed to create date column in events table';
  END IF;
  
  RAISE NOTICE 'Events table schema has been successfully updated with date column and supporting infrastructure';
END $$;