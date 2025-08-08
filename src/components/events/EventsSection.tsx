import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, MapPin, Loader2 } from 'lucide-react';
import Navigation from '../Navigation';
import EventCard from './EventCard';

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
  }
];

const categories = ['All', 'Technology', 'Marketing', 'Sustainability', 'Business', 'Design', 'Networking'];

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
    </>
  );
};

export default EventsSection;