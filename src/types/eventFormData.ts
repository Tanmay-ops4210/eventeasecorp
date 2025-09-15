export interface EventFormData {
  // Basic Information
  title: string;
  description: string;
  fullDescription: string;
  category: string;
  tags: string[];
  
  // Date & Time
  date: string;
  time: string;
  endTime: string;
  timezone: string;
  
  // Location & Venue
  venue: {
    name: string;
    address: string;
    capacity: number;
    type: 'physical' | 'virtual' | 'hybrid';
    amenities: string[];
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  
  // Visual Assets
  image: string;
  gallery: string[];
  
  // Pricing & Tickets
  ticketTypes: TicketTypeData[];
  currency: string;
  
  // Registration Settings
  maxAttendees: number;
  registrationDeadline: string;
  requireApproval: boolean;
  allowWaitlist: boolean;
  maxTicketsPerPerson: number;
  
  // Event Details
  whatToExpected: string[];
  requirements: string[];
  refundPolicy: string;
  
  // Organizer Information
  organizer: {
    name: string;
    bio: string;
    contact: string;
    avatar: string;
  };
  
  // Speakers (optional)
  speakers: SpeakerData[];
  
  // Schedule/Agenda
  schedule: ScheduleItem[];
  
  // Settings
  visibility: 'public' | 'private' | 'unlisted';
  status: 'draft' | 'published';
}

export interface TicketTypeData {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  saleStart: string;
  saleEnd: string;
  benefits: string[];
  restrictions: string[];
  isActive: boolean;
}

export interface SpeakerData {
  id: string;
  name: string;
  title: string;
  company: string;
  bio: string;
  image: string;
  sessions: string[];
}

export interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  description: string;
  speaker?: string;
  room: string;
  type: 'keynote' | 'session' | 'workshop' | 'break' | 'networking';
}

export interface EventRegistrationData {
  // All the data that will be displayed to users when they view event details
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  category: string;
  tags: string[];
  
  // Event timing
  date: string;
  time: string;
  endTime: string;
  duration: string;
  
  // Location details
  venue: {
    name: string;
    address: string;
    capacity: number;
    type: 'physical' | 'virtual' | 'hybrid';
    amenities: string[];
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  
  // Visual content
  image: string;
  gallery: string[];
  
  // Pricing information
  ticketTypes: {
    id: string;
    name: string;
    description: string;
    price: number;
    currency: string;
    quantity: number;
    available: number;
    benefits: string[];
    restrictions: string[];
    saleStart: string;
    saleEnd: string;
    isActive: boolean;
  }[];
  
  // Registration details
  maxAttendees: number;
  currentAttendees: number;
  registrationDeadline: string;
  requireApproval: boolean;
  allowWaitlist: boolean;
  maxTicketsPerPerson: number;
  
  // Event information
  whatToExpect: string[];
  requirements: string[];
  refundPolicy: string;
  
  // Organizer details
  organizer: {
    name: string;
    bio: string;
    contact: string;
    avatar: string;
  };
  
  // Additional content
  speakers: SpeakerData[];
  schedule: ScheduleItem[];
  
  // Meta information
  status: 'draft' | 'published' | 'completed';
  visibility: 'public' | 'private' | 'unlisted';
  isFeatured: boolean;
  rating?: number;
  createdAt: string;
  updatedAt: string;
}