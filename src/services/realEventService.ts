import { supabase } from '../lib/supabaseClient';
import { RealtimeChannel } from '@supabase/supabase-js';

// --- INTERFACES ---
export interface RealEvent {
  id: string;
  organizer_id: string;
  title: string;
  description?: string;
  event_date: string;
  time: string;
  end_time?: string;
  venue: string;
  capacity: number;
  image_url?: string;
  category: string;
  status: 'draft' | 'published' | 'ongoing' | 'completed' | 'cancelled';
  visibility: 'public' | 'private' | 'unlisted';
  created_at: string;
  updated_at: string;
}

export interface EventFormData {
  title: string;
  description?: string;
  event_date: string;
  time: string;
  end_time?: string;
  venue: string;
  capacity: number;
  image_url?: string;
  category: string;
  visibility: 'public' | 'private' | 'unlisted';
}

export interface DashboardStats {
  totalEvents: number;
  publishedEvents: number;
  totalTicketsSold: number;
  totalRevenue: number;
  upcomingEvents: number;
}


// --- SERVICE CLASS ---
class RealEventService {
  private static instance: RealEventService;
  private channel: RealtimeChannel | null = null;

  static getInstance(): RealEventService {
    if (!RealEventService.instance) {
      RealEventService.instance = new RealEventService();
    }
    return RealEventService.instance;
  }

  // --- DATA MAPPING HELPERS ---
  /**
   * Maps a database event object to a frontend-friendly RealEvent object.
   * This is the single source of truth for data transformation from DB -> FE.
   */
  private mapDbToFrontend(dbEvent: any): RealEvent {
    const startDate = new Date(dbEvent.start_date || dbEvent.created_at);
    const endDate = dbEvent.end_date ? new Date(dbEvent.end_date) : null;

    const formatTime = (date: Date | null): string | undefined => {
      if (!date) return undefined;
      return date.toTimeString().split(' ')[0].substring(0, 5); // HH:MM format
    };

    return {
      id: dbEvent.id,
      organizer_id: dbEvent.organizer_id,
      title: dbEvent.title,
      description: dbEvent.description,
      event_date: startDate.toISOString().split('T')[0], // YYYY-MM-DD
      time: formatTime(startDate)!,
      end_time: formatTime(endDate),
      venue: dbEvent.venue || dbEvent.location, // Compatibility for old column name
      capacity: dbEvent.capacity || 100,
      image_url: dbEvent.image_url,
      category: dbEvent.category || 'conference',
      status: dbEvent.status,
      visibility: dbEvent.visibility || 'public',
      created_at: dbEvent.created_at,
      updated_at: dbEvent.updated_at,
    };
  }

  /**
   * Maps frontend form data to a database-friendly object.
   * This is the single source of truth for data transformation from FE -> DB.
   */
  private mapFrontendToDb(eventData: Partial<EventFormData>) {
    const { event_date, time, end_time, ...rest } = eventData;
    const dbData: any = { ...rest };

    if (event_date && time) {
      dbData.start_date = new Date(`${event_date}T${time}`).toISOString();
    }
    
    if (event_date && end_time) {
      dbData.end_date = new Date(`${event_date}T${end_time}`).toISOString();
    }

    return dbData;
  }


  // --- CRUD OPERATIONS ---
  async createEvent(eventData: EventFormData, organizerId: string): Promise<{ success: boolean; event?: RealEvent; error?: string }> {
    try {
      const dbPayload = { ...this.mapFrontendToDb(eventData), organizer_id: organizerId };
      
      const { data, error } = await supabase
        .from('events')
        .insert(dbPayload)
        .select()
        .single();

      if (error) throw error;
      return { success: true, event: this.mapDbToFrontend(data) };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
  
  async getMyEvents(organizerId: string): Promise<{ success: boolean; events?: RealEvent[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('organizer_id', organizerId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      const events = data.map(this.mapDbToFrontend);
      return { success: true, events };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
  
  async deleteEvent(eventId: string): Promise<{ success: boolean; error?: string }> {
    try {
        const { error } = await supabase.from('events').delete().eq('id', eventId);
        if (error) throw error;
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
  }

  // --- REALTIME SUBSCRIPTION ---
  /**
   * Subscribes to changes in the events table for a specific organizer.
   * @param organizerId The ID of the organizer to listen for.
   * @param callback A function to call with the updated list of events.
   */
  subscribeToEvents(organizerId: string, callback: (events: RealEvent[]) => void) {
    // Unsubscribe from any existing channel to prevent multiple listeners
    if (this.channel) {
        supabase.removeChannel(this.channel);
        this.channel = null;
    }

    this.channel = supabase
      .channel(`organizer-events-${organizerId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'events', filter: `organizer_id=eq.${organizerId}` },
        async () => {
          // When a change occurs, refetch the entire list to ensure consistency
          const result = await this.getMyEvents(organizerId);
          if (result.success && result.events) {
            callback(result.events);
          }
        }
      )
      .subscribe();
      
    // Return a cleanup function to be used in React's useEffect
    return () => {
        if(this.channel) {
            supabase.removeChannel(this.channel);
            this.channel = null;
        }
    };
  }
}

export const realEventService = RealEventService.getInstance();
