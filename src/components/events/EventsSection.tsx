import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, MapPin, Loader2 } from 'lucide-react';
import Navigation from '../Navigation';
import EventCard from './EventCard';
import LoginPromptOverlay from '../common/LoginPromptOverlay';
import AuthModal from '../auth/AuthModal';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  maxAttendees: number;
  price: number;
  image: string;
  category: string;
  featured?: boolean;
  rating?: number;
}

interface EventsSectionProps {
  onBookEvent: (eventId: string) => void;
  isAuthenticated: boolean;
  onLoginRequired: () => void;
  isStandalone?: boolean;
  user?: any;
  onLogin?: () => void;
  onLogout?: () => void;
  onShowBlog?: () => void;
  onShowSpeakers?: () => void;
  onShowSponsors?: () => void;
  onShowDashboard?: () => void;
}

// Mock events data
const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Tech Innovation Summit 2024',
    description: 'Join industry leaders and innovators for a day of cutting-edge technology discussions, networking, and hands-on workshops.',
    date: '2024-03-15',
    time: '09:00 AM - 06:00 PM',
    location: 'San Francisco Convention Center, CA',
    attendees: 245,
    maxAttendees: 300,
    price: 299,
    image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'technology',
    featured: true,
    rating: 4.8
  },
  {
    id: '2',
    title: 'Digital Marketing Masterclass',
    description: 'Learn the latest digital marketing strategies from industry experts. Perfect for marketers looking to stay ahead of the curve.',
    date: '2024-03-20',
    time: '10:00 AM - 04:00 PM',
    location: 'New York Business Center, NY',
    attendees: 89,
    maxAttendees: 150,
    price: 199,
    image: 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'marketing',
    rating: 4.6
  },
  {
    id: '3',
    title: 'Sustainable Business Workshop',
    description: 'Discover how to build sustainable business practices that benefit both your company and the environment.',
    date: '2024-03-25',
    time: '09:30 AM - 05:30 PM',
    location: 'Green Building, Seattle, WA',
    attendees: 67,
    maxAttendees: 100,
    price: 149,
    image: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'sustainability',
    rating: 4.7
  },
  {
    id: '4',
    title: 'Leadership Excellence Conference',
    description: 'Develop your leadership skills with renowned speakers and interactive sessions designed for executives and managers.',
    date: '2024-04-02',
    time: '08:00 AM - 07:00 PM',
    location: 'Chicago Leadership Institute, IL',
    attendees: 178,
    maxAttendees: 200,
    price: 399,
    image: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'business',
    featured: true,
    rating: 4.9
  },
  {
    id: '5',
    title: 'Creative Design Bootcamp',
    description: 'Intensive 2-day bootcamp covering the latest design trends, tools, and techniques for creative professionals.',
    date: '2024-04-08',
    time: '09:00 AM - 06:00 PM',
    location: 'Design Studio, Austin, TX',
    attendees: 45,
    maxAttendees: 50,
    price: 249,
    image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'design',
    rating: 4.5
  },
  {
    id: '6',
    title: 'Networking Mixer: Startup Edition',
    description: 'Connect with fellow entrepreneurs, investors, and startup enthusiasts in a relaxed networking environment.',
    date: '2024-04-12',
    time: '06:00 PM - 09:00 PM',
    location: 'Innovation Hub, Boston, MA',
    attendees: 95,
    maxAttendees: 120,
    price: 49,
    image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'networking',
    rating: 4.4
  },
  {
    id: '7',
    title: 'Mumbai Grand Wedding Exhibition',
    description: 'Discover the latest wedding trends, vendors, and services. Connect with top wedding planners and designers in Maharashtra.',
    date: '2024-03-28',
    time: '10:00 AM - 08:00 PM',
    location: 'Bombay Exhibition Centre, Mumbai, Maharashtra',
    attendees: 2800,
    maxAttendees: 5000,
    price: 150,
    image: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'wedding',
    rating: 4.5,
    organizer: 'Maharashtra Wedding Planners Association'
  },
  {
    id: '8',
    title: 'Pune Corporate Leadership Summit',
    description: 'Annual leadership conference featuring industry experts and networking opportunities for business professionals.',
    date: '2024-04-12',
    time: '09:00 AM - 06:00 PM',
    location: 'Pune International Centre, Pune, Maharashtra',
    attendees: 450,
    maxAttendees: 800,
    price: 2500,
    image: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'business',
    rating: 4.8,
    organizer: 'Pune Business Council'
  },
  {
    id: '9',
    title: 'Ganesh Festival Cultural Celebration',
    description: 'Join the grand celebration of Lord Ganesh with traditional music, dance, and cultural performances.',
    date: '2024-09-07',
    time: '06:00 AM - 10:00 PM',
    location: 'Shivaji Park, Mumbai, Maharashtra',
    attendees: 12000,
    maxAttendees: 15000,
    price: 0,
    image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'cultural',
    featured: true,
    rating: 4.9,
    organizer: 'Mumbai Cultural Society'
  },
  {
    id: '10',
    title: 'Nashik Wine Festival 2024',
    description: 'Experience the finest wines from Maharashtra vineyards with tastings, food pairings, and live entertainment.',
    date: '2024-04-20',
    time: '04:00 PM - 11:00 PM',
    location: 'Sula Vineyards, Nashik, Maharashtra',
    attendees: 890,
    maxAttendees: 1500,
    price: 1200,
    image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'entertainment',
    rating: 4.6,
    organizer: 'Maharashtra Wine Association'
  },
  {
    id: '11',
    title: 'Nagpur Education Technology Conference',
    description: 'Explore the future of education with technology integration, digital learning, and innovative teaching methods.',
    date: '2024-05-15',
    time: '09:00 AM - 05:00 PM',
    location: 'Nagpur University Convention Hall, Nagpur, Maharashtra',
    attendees: 320,
    maxAttendees: 500,
    price: 800,
    image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'education',
    rating: 4.4,
    organizer: 'Maharashtra Education Board'
  },
  {
    id: '12',
    title: 'Aurangabad Art & Craft Exhibition',
    description: 'Showcase of traditional and contemporary art from local artists. Features paintings, sculptures, and handicrafts.',
    date: '2024-04-25',
    time: '10:00 AM - 07:00 PM',
    location: 'Aurangabad Cultural Centre, Aurangabad, Maharashtra',
    attendees: 650,
    maxAttendees: 1000,
    price: 100,
    image: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'art',
    rating: 4.3,
    organizer: 'Aurangabad Artists Guild'
  },
  {
    id: '13',
    title: 'Kolhapur Sports Championship',
    description: 'Annual multi-sport championship featuring cricket, football, kabaddi, and traditional Maharashtrian sports.',
    date: '2024-05-10',
    time: '07:00 AM - 08:00 PM',
    location: 'Kolhapur Sports Complex, Kolhapur, Maharashtra',
    attendees: 1200,
    maxAttendees: 2000,
    price: 200,
    image: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'sports',
    rating: 4.7,
    organizer: 'Maharashtra Sports Authority'
  },
  {
    id: '14',
    title: 'Thane Birthday Party Planning Workshop',
    description: 'Learn creative birthday party planning ideas, decoration techniques, and entertainment options for memorable celebrations.',
    date: '2024-04-08',
    time: '02:00 PM - 06:00 PM',
    location: 'Thane Community Hall, Thane, Maharashtra',
    attendees: 85,
    maxAttendees: 120,
    price: 500,
    image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'workshop',
    rating: 4.2,
    organizer: 'Party Planners Maharashtra'
  },
  {
    id: '15',
    title: 'Solapur Classical Music Concert',
    description: 'Evening of classical Indian music featuring renowned artists performing ragas and traditional compositions.',
    date: '2024-05-18',
    time: '07:00 PM - 10:00 PM',
    location: 'Solapur Cultural Auditorium, Solapur, Maharashtra',
    attendees: 420,
    maxAttendees: 600,
    price: 300,
    image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'music',
    rating: 4.8,
    organizer: 'Solapur Music Society'
  },
  {
    id: '16',
    title: 'Satara School Annual Function',
    description: 'Celebrating academic achievements with cultural performances, award ceremonies, and parent-teacher interactions.',
    date: '2024-04-30',
    time: '04:00 PM - 08:00 PM',
    location: 'Satara Public School Auditorium, Satara, Maharashtra',
    attendees: 800,
    maxAttendees: 1000,
    price: 0,
    image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'education',
    rating: 4.5,
    organizer: 'Satara Public School'
  },
  {
    id: '17',
    title: 'Akola Religious Discourse & Prayer Meet',
    description: 'Spiritual gathering featuring religious discourse, community prayers, and cultural programs for spiritual enlightenment.',
    date: '2024-05-25',
    time: '06:00 AM - 12:00 PM',
    location: 'Akola Temple Complex, Akola, Maharashtra',
    attendees: 2500,
    maxAttendees: 3000,
    price: 0,
    image: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'religious',
    rating: 4.6,
    organizer: 'Akola Religious Committee'
  }
];

const categories = ['All', 'Technology', 'Marketing', 'Sustainability', 'Business', 'Design', 'Networking', 'Wedding', 'Cultural', 'Entertainment', 'Education', 'Art', 'Sports', 'Workshop', 'Music', 'Religious'];

const EventsSection: React.FC<EventsSectionProps> = ({ 
  onBookEvent, 
  isAuthenticated, 
  onLoginRequired,
  isStandalone = false,
  user = null,
  onLogin = () => {},
  onLogout = () => {},
  onShowBlog = () => {},
  onShowSpeakers = () => {},
  onShowSponsors = () => {},
  onShowDashboard = () => {}
}) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'date' | 'price' | 'popularity'>('date');
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    // Simulate API call to load events
    const loadEvents = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setEvents(mockEvents);
      setFilteredEvents(mockEvents);
      setIsLoading(false);
    };

    loadEvents();
  }, []);

  useEffect(() => {
    filterAndSortEvents();
  }, [events, selectedCategory, searchTerm, sortBy]);

  const filterAndSortEvents = () => {
    let filtered = [...events];

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(event => 
        event.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort events
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'price':
          return a.price - b.price;
        case 'popularity':
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });

    setFilteredEvents(filtered);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by useEffect
  };

  const handleEventCardClick = (eventId: string) => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }
    onBookEvent(eventId);
  };

  const handleLoginPromptClose = () => {
    setShowLoginPrompt(false);
  };

  const handleLoginPromptLogin = () => {
    setShowLoginPrompt(false);
    setShowAuthModal(true);
  };

  if (isLoading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading events...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      {isStandalone && (
        <Navigation 
          isAuthenticated={isAuthenticated}
          user={user}
          onLogin={onLogin}
          onLogout={onLogout}
          onShowBlog={onShowBlog}
          onShowSpeakers={onShowSpeakers}
          onShowSponsors={onShowSponsors}
          onShowDashboard={onShowDashboard}
          currentPage="other"
        />
      )}
      <section className={`${isStandalone ? 'pt-20 pb-8' : 'py-20'} bg-gray-50`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-indigo-900 mb-4">
            UPCOMING EVENTS
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover amazing events, connect with like-minded people, and expand your horizons
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-12">
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search events by title, description, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoComplete="off"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                />
              </div>
              <div className="flex gap-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'date' | 'price' | 'popularity')}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                >
                  <option value="date">Sort by Date</option>
                  <option value="price">Sort by Price</option>
                  <option value="popularity">Sort by Rating</option>
                </select>
              </div>
            </div>
          </form>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-3">
            <Filter className="w-5 h-5 text-gray-500 mt-2" />
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Events Grid */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event, index) => (
              <div
                key={event.id}
                style={{ animationDelay: `${index * 0.1}s` }}
                className="animate-fade-in-up"
              >
                <EventCard
                  event={event}
                  onBookNow={onBookEvent}
                  isAuthenticated={isAuthenticated}
                  onLoginRequired={onLoginRequired}
                  onEventClick={handleEventCardClick}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="bg-white rounded-2xl p-12 shadow-lg">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No events found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm 
                  ? `No events match your search for "${searchTerm}"`
                  : `No events found in the ${selectedCategory} category`
                }
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                >
                  Clear Search
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </section>

      {/* Login Prompt Overlay */}
      <LoginPromptOverlay
        isOpen={showLoginPrompt}
        onClose={handleLoginPromptClose}
        onLogin={handleLoginPromptLogin}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLoginSuccess={() => setShowAuthModal(false)}
      />
    </>
  );
};

export default EventsSection;