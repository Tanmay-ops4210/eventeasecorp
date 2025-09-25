import React, { useState } from 'react';
import { Search, Filter, MapPin, Calendar, ArrowRight, User, Star, Award } from 'lucide-react';

interface Speaker {
  id: string;
  name: string;
  title: string;
  company: string;
  bio: string;
  image: string;
  expertise: string[];
  location: string;
  rating: number;
  events: number;
  featured: boolean;
}

interface SpeakerDirectoryProps {
  onSpeakerClick: (speakerId: string) => void;
}

const mockSpeakers: Speaker[] = [
  {
    id: '1',
    name: 'ZAWADI THANDWE',
    title: 'Chief Technology Officer',
    company: 'TechCorp Industries',
    bio: 'Professional with 20 years of experience helping brands reach their goals through innovative technology solutions and strategic leadership.',
    image: 'https://images.pexels.com/photos/3211476/pexels-photo-3211476.jpeg?auto=compress&cs=tinysrgb&w=400',
    expertise: ['Technology', 'Leadership', 'Innovation'],
    location: 'San Francisco, CA',
    rating: 4.9,
    events: 25,
    featured: true
  },
  {
    id: '2',
    name: 'EJIRO RUDO',
    title: 'Senior Product Manager',
    company: 'Innovation Labs',
    bio: 'Skilled in problem solving, communication, and strategic thinking with a focus on user-centered design and product development.',
    image: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400',
    expertise: ['Product Management', 'Strategy', 'Design'],
    location: 'New York, NY',
    rating: 4.8,
    events: 18,
    featured: true
  },
  {
    id: '3',
    name: 'DANIEL SAOIRSE',
    title: 'Creative Director',
    company: 'Design Studio Pro',
    bio: 'Dedicated to crafting innovative solutions throughout the year with change-driven creativity and forward-thinking design approaches.',
    image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
    expertise: ['Design', 'Creativity', 'Innovation'],
    location: 'Los Angeles, CA',
    rating: 4.7,
    events: 22,
    featured: false
  },
  {
    id: '4',
    name: 'SARAH JOHNSON',
    title: 'Digital Marketing Expert',
    company: 'Marketing Dynamics',
    bio: 'Leading digital transformation initiatives with expertise in data-driven marketing strategies and customer engagement.',
    image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400',
    expertise: ['Marketing', 'Digital Strategy', 'Analytics'],
    location: 'Chicago, IL',
    rating: 4.6,
    events: 15,
    featured: false
  },
  {
    id: '5',
    name: 'MICHAEL CHEN',
    title: 'Business Strategy Consultant',
    company: 'Strategic Solutions Inc',
    bio: 'Helping organizations navigate complex business challenges through strategic planning and operational excellence.',
    image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400',
    expertise: ['Strategy', 'Business Development', 'Operations'],
    location: 'Seattle, WA',
    rating: 4.8,
    events: 20,
    featured: false
  },
  {
    id: '6',
    name: 'EMMA RODRIGUEZ',
    title: 'Sustainability Expert',
    company: 'Green Future Corp',
    bio: 'Passionate about creating sustainable business practices that benefit both organizations and the environment.',
    image: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=400',
    expertise: ['Sustainability', 'Environmental Impact', 'Green Business'],
    location: 'Portland, OR',
    rating: 4.9,
    events: 12,
    featured: false
  }
];

const expertiseAreas = ['All', 'Technology', 'Leadership', 'Design', 'Marketing', 'Strategy', 'Sustainability'];

const SpeakerDirectory: React.FC<SpeakerDirectoryProps> = ({ onSpeakerClick }) => {
  const [speakers] = useState<Speaker[]>(mockSpeakers);
  const [filteredSpeakers, setFilteredSpeakers] = useState<Speaker[]>(mockSpeakers);
  const [selectedExpertise, setSelectedExpertise] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'rating' | 'events'>('name');

  React.useEffect(() => {
    filterAndSortSpeakers();
  }, [speakers, selectedExpertise, searchTerm, sortBy]);

  const filterAndSortSpeakers = () => {
    let filtered = [...speakers];

    // Filter by expertise
    if (selectedExpertise !== 'All') {
      filtered = filtered.filter(speaker =>
        speaker.expertise.includes(selectedExpertise)
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(speaker =>
        speaker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        speaker.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        speaker.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        speaker.expertise.some(exp => exp.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Sort speakers
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating':
          return b.rating - a.rating;
        case 'events':
          return b.events - a.events;
        default:
          return 0;
      }
    });

    setFilteredSpeakers(filtered);
  };

  const featuredSpeakers = filteredSpeakers.filter(speaker => speaker.featured);
  const regularSpeakers = filteredSpeakers.filter(speaker => !speaker.featured);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-indigo-900 mb-4">
            SPEAKER DIRECTORY
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Meet our incredible lineup of industry experts, thought leaders, and innovators
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-12">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search speakers by name, title, company, or expertise..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoComplete="off"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
              />
            </div>
            <div className="flex gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'rating' | 'events')}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
              >
                <option value="name">Sort by Name</option>
                <option value="rating">Sort by Rating</option>
                <option value="events">Sort by Events</option>
              </select>
            </div>
          </div>

          {/* Expertise Filter */}
          <div className="flex flex-wrap gap-3">
            <Filter className="w-5 h-5 text-gray-500 mt-2" />
            {expertiseAreas.map((expertise) => (
              <button
                key={expertise}
                onClick={() => setSelectedExpertise(expertise)}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
                  selectedExpertise === expertise
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {expertise}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Speakers */}
        {featuredSpeakers.length > 0 && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-indigo-900 mb-8 text-center">Featured Speakers</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredSpeakers.map((speaker, index) => (
                <div
                  key={speaker.id}
                  className="group bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-8 text-white cursor-pointer transform hover:scale-105 transition-all duration-300 shadow-2xl"
                  onClick={() => onSpeakerClick(speaker.id)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <Award className="w-6 h-6 text-yellow-300" />
                    <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Featured
                    </span>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-white/20">
                      <img
                        src={speaker.image}
                        alt={speaker.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    
                    <h3 className="text-xl font-bold mb-2">{speaker.name}</h3>
                    <p className="text-white/90 text-sm mb-1">{speaker.title}</p>
                    <p className="text-white/80 text-sm mb-4">{speaker.company}</p>
                    
                    <div className="flex items-center justify-center space-x-4 mb-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-300 fill-current" />
                        <span>{speaker.rating}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{speaker.events} events</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 justify-center">
                      {speaker.expertise.slice(0, 2).map((exp) => (
                        <span key={exp} className="bg-white/20 text-white px-2 py-1 rounded-full text-xs">
                          {exp}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Speakers Grid */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-indigo-900 mb-8 text-center">
            {featuredSpeakers.length > 0 ? 'All Speakers' : 'Our Speakers'}
          </h2>
          
          {regularSpeakers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularSpeakers.map((speaker, index) => (
                <div
                  key={speaker.id}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden cursor-pointer"
                  onClick={() => onSpeakerClick(speaker.id)}
                  style={{ animationDelay: `${(featuredSpeakers.length + index) * 0.1}s` }}
                >
                  <div className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden">
                        <img
                          src={speaker.image}
                          alt={speaker.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors duration-200">
                          {speaker.name}
                        </h3>
                        <p className="text-sm text-gray-600">{speaker.title}</p>
                        <p className="text-sm text-gray-500">{speaker.company}</p>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {speaker.bio}
                    </p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span>{speaker.rating}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{speaker.events}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span className="truncate">{speaker.location}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {speaker.expertise.map((exp) => (
                        <span key={exp} className="bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full text-xs font-medium">
                          {exp}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">View Profile</span>
                      <ArrowRight className="w-4 h-4 text-indigo-600 group-hover:translate-x-1 transition-transform duration-200" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="bg-white rounded-2xl p-12 shadow-lg">
                <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No speakers found</h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm 
                    ? `No speakers match your search for "${searchTerm}"`
                    : `No speakers found in the ${selectedExpertise} category`
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
    </div>
  );
};

export default SpeakerDirectory;