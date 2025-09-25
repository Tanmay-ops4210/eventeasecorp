import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Calendar, MapPin, Users, Star, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/NewAuthContext';
import LoginPromptOverlay from '../common/LoginPromptOverlay';
import AuthModal from '../auth/AuthModal';

const EventDiscoveryPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const categories = [
    'All', 'Technology', 'Marketing', 'Business', 'Design', 
    'Healthcare', 'Education', 'Finance', 'Sustainability'
  ];

  const events = [
    {
      id: '1',
      title: 'Tech Innovation Summit 2024',
      description: 'Join industry leaders for cutting-edge technology discussions and networking.',
      date: '2024-03-15',
      time: '09:00 AM - 06:00 PM',
      location: 'San Francisco Convention Center, CA',
      price: 299,
      attendees: 245,
      maxAttendees: 300,
      image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Technology',
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
      price: 199,
      attendees: 89,
      maxAttendees: 150,
      image: 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Marketing',
      rating: 4.6,
      organizer: 'Marketing Pro'
    },
    {
      id: '3',
      title: 'Sustainable Business Forum',
      description: 'Discover sustainable business practices for the future.',
      date: '2024-03-25',
      time: '09:30 AM - 05:30 PM',
      location: 'Green Building, Seattle, WA',
      price: 149,
      attendees: 67,
      maxAttendees: 100,
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
      price: 399,
      attendees: 178,
      maxAttendees: 200,
      image: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Business',
      rating: 4.9,
      organizer: 'Leadership Pro'
    },
    {
      id: '5',
      title: 'Mumbai Grand Wedding Exhibition',
      description: 'Discover the latest wedding trends, vendors, and services. Connect with top wedding planners and designers in Maharashtra.',
      date: '2024-03-28',
      time: '10:00 AM - 08:00 PM',
      location: 'Bombay Exhibition Centre, Mumbai, Maharashtra',
      price: 150,
      attendees: 2800,
      maxAttendees: 5000,
      image: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Wedding',
      rating: 4.5,
      organizer: 'Maharashtra Wedding Planners Association'
    },
    {
      id: '6',
      title: 'Pune Corporate Leadership Summit',
      description: 'Annual leadership conference featuring industry experts and networking opportunities for business professionals.',
      date: '2024-04-12',
      time: '09:00 AM - 06:00 PM',
      location: 'Pune International Centre, Pune, Maharashtra',
      price: 2500,
      attendees: 450,
      maxAttendees: 800,
      image: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Business',
      rating: 4.8,
      organizer: 'Pune Business Council'
    },
    {
      id: '7',
      title: 'Ganesh Festival Cultural Celebration',
      description: 'Join the grand celebration of Lord Ganesh with traditional music, dance, and cultural performances.',
      date: '2024-09-07',
      time: '06:00 AM - 10:00 PM',
      location: 'Shivaji Park, Mumbai, Maharashtra',
      price: 0,
      attendees: 12000,
      maxAttendees: 15000,
      image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Cultural',
      rating: 4.9,
      organizer: 'Mumbai Cultural Society'
    },
    {
      id: '8',
      title: 'Nashik Wine Festival 2024',
      description: 'Experience the finest wines from Maharashtra vineyards with tastings, food pairings, and live entertainment.',
      date: '2024-04-20',
      time: '04:00 PM - 11:00 PM',
      location: 'Sula Vineyards, Nashik, Maharashtra',
      price: 1200,
      attendees: 890,
      maxAttendees: 1500,
      image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Entertainment',
      rating: 4.6,
      organizer: 'Maharashtra Wine Association'
    },
    {
      id: '9',
      title: 'Nagpur Education Technology Conference',
      description: 'Explore the future of education with technology integration, digital learning, and innovative teaching methods.',
      date: '2024-05-15',
      time: '09:00 AM - 05:00 PM',
      location: 'Nagpur University Convention Hall, Nagpur, Maharashtra',
      price: 800,
      attendees: 320,
      maxAttendees: 500,
      image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Education',
      rating: 4.4,
      organizer: 'Maharashtra Education Board'
    },
    {
      id: '10',
      title: 'Aurangabad Art & Craft Exhibition',
      description: 'Showcase of traditional and contemporary art from local artists. Features paintings, sculptures, and handicrafts.',
      date: '2024-04-25',
      time: '10:00 AM - 07:00 PM',
      location: 'Aurangabad Cultural Centre, Aurangabad, Maharashtra',
      price: 100,
      attendees: 650,
      maxAttendees: 1000,
      image: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Art',
      rating: 4.3,
      organizer: 'Aurangabad Artists Guild'
    },
    {
      id: '11',
      title: 'Kolhapur Sports Championship',
      description: 'Annual multi-sport championship featuring cricket, football, kabaddi, and traditional Maharashtrian sports.',
      date: '2024-05-10',
      time: '07:00 AM - 08:00 PM',
      location: 'Kolhapur Sports Complex, Kolhapur, Maharashtra',
      price: 200,
      attendees: 1200,
      maxAttendees: 2000,
      image: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Sports',
      rating: 4.7,
      organizer: 'Maharashtra Sports Authority'
    },
    {
      id: '12',
      title: 'Thane Birthday Party Planning Workshop',
      description: 'Learn creative birthday party planning ideas, decoration techniques, and entertainment options for memorable celebrations.',
      date: '2024-04-08',
      time: '02:00 PM - 06:00 PM',
      location: 'Thane Community Hall, Thane, Maharashtra',
      price: 500,
      attendees: 85,
      maxAttendees: 120,
      image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Workshop',
      rating: 4.2,
      organizer: 'Party Planners Maharashtra'
    },
    {
      id: '13',
      title: 'Solapur Classical Music Concert',
      description: 'Evening of classical Indian music featuring renowned artists performing ragas and traditional compositions.',
      date: '2024-05-18',
      time: '07:00 PM - 10:00 PM',
      location: 'Solapur Cultural Auditorium, Solapur, Maharashtra',
      price: 300,
      attendees: 420,
      maxAttendees: 600,
      image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Music',
      rating: 4.8,
      organizer: 'Solapur Music Society'
    },
    {
      id: '14',
      title: 'Satara School Annual Function',
      description: 'Celebrating academic achievements with cultural performances, award ceremonies, and parent-teacher interactions.',
      date: '2024-04-30',
      time: '04:00 PM - 08:00 PM',
      location: 'Satara Public School Auditorium, Satara, Maharashtra',
      price: 0,
      attendees: 800,
      maxAttendees: 1000,
      image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Education',
      rating: 4.5,
      organizer: 'Satara Public School'
    },
    {
      id: '15',
      title: 'Akola Religious Discourse & Prayer Meet',
      description: 'Spiritual gathering featuring religious discourse, community prayers, and cultural programs for spiritual enlightenment.',
      date: '2024-05-25',
      time: '06:00 AM - 12:00 PM',
      location: 'Akola Temple Complex, Akola, Maharashtra',
      price: 0,
      attendees: 2500,
      maxAttendees: 3000,
      image: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Religious',
      rating: 4.6,
      organizer: 'Akola Religious Committee'
    }
  ];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           event.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const handleEventClick = (eventId: string) => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }
    navigate(`/event/${eventId}`);
  };

  const handleLoginPromptClose = () => {
    setShowLoginPrompt(false);
  };

  const handleLoginPromptLogin = () => {
    setShowLoginPrompt(false);
    setShowAuthModal(true);
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

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
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
              <select className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                <option>All Dates</option>
                <option>This Week</option>
                <option>This Month</option>
                <option>Next Month</option>
              </select>
              <select className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                <option>All Locations</option>
                <option>San Francisco</option>
                <option>New York</option>
                <option>Chicago</option>
                <option>Seattle</option>
              </select>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 mb-6">
            <Filter className="w-5 h-5 text-gray-500 mt-2" />
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category.toLowerCase())}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
                  selectedCategory === category.toLowerCase()
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* View Toggle */}
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              {filteredEvents.length} events found
            </p>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  viewMode === 'list'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                List View
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  viewMode === 'map'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Map View
              </button>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        {viewMode === 'list' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event, index) => (
              <div
                key={event.id}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden cursor-pointer"
                onClick={() => handleEventClick(event.id)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Make the entire card clickable */}
                <div className="relative overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                   autoComplete="off"
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 flex space-x-2">
                    <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                      {event.category}
                    </span>
                    <span className="bg-white/90 text-gray-900 px-3 py-1 rounded-full text-xs font-bold">
                      ${event.price}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="flex items-center space-x-1 bg-white/90 px-2 py-1 rounded-full">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span className="text-xs font-medium">{event.rating}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors duration-200 line-clamp-2">
                    {event.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {event.description}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 text-indigo-600" />
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{event.time}</span>
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
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Map View</h3>
            <p className="text-gray-600">Interactive map view coming soon!</p>
          </div>
        )}

        {filteredEvents.length === 0 && (
          <div className="text-center py-20">
            <div className="bg-white rounded-2xl p-12 shadow-lg">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No events found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search criteria or browse all events
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>

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
      />
    </div>
  );
};

export default EventDiscoveryPage;
