import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, MapPin, Users, Star, ArrowRight, Loader2 } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/NewAuthContext';

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
  organizer: string;
}

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Tech Innovation Summit 2024',
    description: 'Join industry leaders for cutting-edge technology discussions and networking.',
    date: '2024-03-15',
    time: '09:00 AM - 06:00 PM',
    location: 'San Francisco Convention Center, CA',
    attendees: 245,
    maxAttendees: 300,
    price: 299,
    image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Technology',
    featured: true,
    rating: 4.8,
    organizer: 'TechCorp Events'
  },
  {
    id: '2',
    title: 'Digital Marketing Masterclass',
    description: 'Learn the latest digital marketing strategies from industry experts.',
    date: '2024-03-20',
    time: '10:00 AM - 04:00 PM',
    location: 'New York Business Center, NY',
    attendees: 89,
    maxAttendees: 150,
    price: 199,
    image: 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Marketing',
    rating: 4.6,
    organizer: 'Marketing Pro'
  },
  {
    id: '3',
    title: 'Sustainable Business Workshop',
    description: 'Discover sustainable business practices for the future.',
    date: '2024-03-25',
    time: '09:30 AM - 05:30 PM',
    location: 'Green Building, Seattle, WA',
    attendees: 67,
    maxAttendees: 100,
    price: 149,
    image: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Sustainability',
    rating: 4.7,
    organizer: 'EcoEvents'
  },
  {
    id: '4',
    title: 'Leadership Excellence Conference',
    description: 'Develop leadership skills with renowned speakers and interactive sessions.',
    date: '2024-04-02',
    time: '08:00 AM - 07:00 PM',
    location: 'Chicago Leadership Institute, IL',
    attendees: 178,
    maxAttendees: 200,
    price: 399,
    image: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Business',
    featured: true,
    rating: 4.9,
    organizer: 'Leadership Pro'
  }
];

const categories = ['All', 'Technology', 'Marketing', 'Sustainability', 'Business', 'Design', 'Networking'];

const EventsPage: React.FC = () => {
  const { setBreadcrumbs, setCurrentView, setSelectedEventId } = useApp();
  const { isAuthenticated } = useAuth();
  const [events] = useState<Event[]>(mockEvents);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(mockEvents);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'price' | 'popularity'>('date');
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    setBreadcrumbs(['Events']);
  }, [setBreadcrumbs]);

  useEffect(() => {
    filterAndSortEvents();
  }, [events, selectedCategory, searchTerm, sortBy]);

  const filterAndSortEvents = () => {
    setIsLoading(true);
    
    // Simulate loading delay
    setTimeout(() => {
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
      setIsLoading(false);
    }, 300);
  };

  const handleEventClick = (eventId: string) => {
    setSelectedEventId(eventId);
    setCurrentView('event-page');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    filterAndSortEvents();
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Discover Events
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find amazing events, conferences, and workshops tailored to your interests
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
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
                <button
                  type="submit"
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                >
                  Search
                </button>
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
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading events...</p>
            </div>
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event, index) => (
              <div
                key={event.id}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden cursor-pointer"
                onClick={() => handleEventClick(event.id)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Event Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                   autoComplete="off"
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 flex space-x-2">
                    {event.featured && (
                      <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                        Featured
                      </span>
                    )}
                    <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                      {event.category}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full text-sm font-bold">
                      ${event.price}
                    </span>
                  </div>
                </div>

                {/* Event Details */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors duration-200 line-clamp-1">
                      {event.title}
                    </h3>
                    {event.rating && (
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium text-gray-600">{event.rating}</span>
                      </div>
                    )}
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {event.description}
                  </p>

                  {/* Event Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 text-indigo-600" />
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-indigo-600" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Users className="w-4 h-4 text-indigo-600" />
                      <span>{event.attendees} / {event.maxAttendees} attendees</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(event.attendees / event.maxAttendees) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">by {event.organizer}</span>
                    <ArrowRight className="w-4 h-4 text-indigo-600 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </div>
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
    </div>
  );
};

export default EventsPage;
