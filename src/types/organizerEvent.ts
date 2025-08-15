export interface OrganizerEvent {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  time: string;
  endTime: string;
  venue: {
    name: string;
    address: string;
    capacity: number;
    type: 'physical' | 'virtual' | 'hybrid';
  };
  image: string;
  gallery: string[];
  status: 'draft' | 'published' | 'ongoing' | 'completed' | 'cancelled';
  visibility: 'public' | 'private' | 'unlisted';
  ticketTypes: TicketType[];
  totalTickets: number;
  soldTickets: number;
  revenue: number;
  attendees: Attendee[];
  tags: string[];
  organizer: {
    id: string;
    name: string;
    email: string;
  };
  settings: {
    allowWaitlist: boolean;
    requireApproval: boolean;
    maxTicketsPerPerson: number;
    refundPolicy: string;
  };
  analytics: {
    views: number;
    registrations: number;
    conversionRate: number;
    topReferrers: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface TicketType {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  quantity: number;
  sold: number;
  available: number;
  saleStart: string;
  saleEnd: string;
  isActive: boolean;
  benefits: string[];
  restrictions: string[];
}

export interface Attendee {
  id: string;
  name: string;
  email: string;
  ticketType: string;
  registrationDate: string;
  checkInStatus: 'pending' | 'checked-in' | 'no-show';
  paymentStatus: 'pending' | 'completed' | 'refunded';
  additionalInfo: Record<string, any>;
}

export interface EventFormData {
  title: string;
  description: string;
  category: string;
  date: string;
  time: string;
  endTime: string;
  venue: {
    name: string;
    address: string;
    capacity: number;
    type: 'physical' | 'virtual' | 'hybrid';
  };
  image: string;
  gallery: string[];
  tags: string[];
  visibility: 'public' | 'private' | 'unlisted';
  settings: {
    allowWaitlist: boolean;
    requireApproval: boolean;
    maxTicketsPerPerson: number;
    refundPolicy: string;
  };
}

export interface DashboardStats {
  totalEvents: number;
  publishedEvents: number;
  draftEvents: number;
  totalTicketsSold: number;
  totalRevenue: number;
  upcomingEvents: number;
  completedEvents: number;
  averageAttendance: number;
}

export interface RecentActivity {
  id: string;
  type: 'event_created' | 'ticket_sold' | 'event_published' | 'attendee_registered';
  message: string;
  timestamp: string;
  eventId?: string;
  eventTitle?: string;
}