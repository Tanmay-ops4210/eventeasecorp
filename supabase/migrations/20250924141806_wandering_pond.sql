/*
  # Analytics Functions and Procedures

  1. Functions
    - `increment_event_views` - Increment event view count
    - `calculate_conversion_rate` - Calculate event conversion rates
    - `get_dashboard_stats` - Get organizer dashboard statistics

  2. Triggers
    - Auto-update analytics on attendee registration
    - Auto-calculate conversion rates
*/

-- Function to increment event views
CREATE OR REPLACE FUNCTION increment_event_views(event_id uuid)
RETURNS void AS $$
BEGIN
  INSERT INTO organizer_event_analytics (event_id, views, registrations, conversion_rate, revenue)
  VALUES (event_id, 1, 0, 0, 0)
  ON CONFLICT (event_id) 
  DO UPDATE SET 
    views = organizer_event_analytics.views + 1,
    updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to calculate conversion rate
CREATE OR REPLACE FUNCTION calculate_conversion_rate(event_id uuid)
RETURNS decimal AS $$
DECLARE
  view_count integer;
  registration_count integer;
  conversion_rate decimal;
BEGIN
  SELECT views, registrations INTO view_count, registration_count
  FROM organizer_event_analytics
  WHERE organizer_event_analytics.event_id = calculate_conversion_rate.event_id;
  
  IF view_count > 0 THEN
    conversion_rate := (registration_count::decimal / view_count::decimal) * 100;
  ELSE
    conversion_rate := 0;
  END IF;
  
  UPDATE organizer_event_analytics 
  SET conversion_rate = calculate_conversion_rate.conversion_rate,
      updated_at = now()
  WHERE organizer_event_analytics.event_id = calculate_conversion_rate.event_id;
  
  RETURN conversion_rate;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update analytics on registration
CREATE OR REPLACE FUNCTION update_analytics_on_registration()
RETURNS trigger AS $$
DECLARE
  ticket_price decimal;
BEGIN
  -- Get ticket price
  SELECT price INTO ticket_price
  FROM organizer_ticket_types
  WHERE id = NEW.ticket_type_id;
  
  -- Update analytics
  INSERT INTO organizer_event_analytics (event_id, views, registrations, revenue)
  VALUES (NEW.event_id, 0, 1, COALESCE(ticket_price, 0))
  ON CONFLICT (event_id)
  DO UPDATE SET
    registrations = organizer_event_analytics.registrations + 1,
    revenue = organizer_event_analytics.revenue + COALESCE(ticket_price, 0),
    updated_at = now();
  
  -- Update ticket sold count
  UPDATE organizer_ticket_types
  SET sold = sold + 1
  WHERE id = NEW.ticket_type_id;
  
  -- Recalculate conversion rate
  PERFORM calculate_conversion_rate(NEW.event_id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for analytics update on registration
DROP TRIGGER IF EXISTS on_attendee_registered ON organizer_attendees;
CREATE TRIGGER on_attendee_registered
  AFTER INSERT ON organizer_attendees
  FOR EACH ROW EXECUTE FUNCTION update_analytics_on_registration();

-- Add unique constraint to analytics table
ALTER TABLE organizer_event_analytics 
ADD CONSTRAINT unique_event_analytics UNIQUE (event_id);