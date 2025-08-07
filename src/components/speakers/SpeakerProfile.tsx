import React from 'react';
import { ArrowLeft, MapPin, Calendar, Star, Award, Mail, Linkedin, Twitter, Globe } from 'lucide-react';

interface SpeakerProfileProps {
  speakerId: string;
  onBack: () => void;
}

// Mock speaker data - in a real app, this would be fetched based on speakerId
const getSpeakerById = (id: string) => {
  const speakers = {
    '1': {
      id: '1',
      name: 'ZAWADI THANDWE',
      title: 'Chief Technology Officer',
      company: 'TechCorp Industries',
      bio: 'Professional with 20 years of experience helping brands reach their goals through innovative technology solutions and strategic leadership.',
      fullBio: `Zawadi Thandwe is a visionary technology leader with over two decades of experience in driving digital transformation and innovation across Fortune 500 companies. As the Chief Technology Officer at TechCorp Industries, she leads a team of 200+ engineers and data scientists in developing cutting-edge solutions that have revolutionized the industry.

Her expertise spans artificial intelligence, machine learning, cloud architecture, and enterprise software development. Zawadi has been instrumental in launching over 15 major technology initiatives that have generated over $500M in revenue for her organizations.

She holds a Ph.D. in Computer Science from MIT and an MBA from Stanford Graduate School of Business. Zawadi is a frequent keynote speaker at major technology conferences and has been featured in Forbes, TechCrunch, and Wired magazine.

When she's not revolutionizing technology, Zawadi mentors young women in STEM and serves on the board of several non-profit organizations focused on technology education in underserved communities.`,
      image: 'https://images.pexels.com/photos/3211476/pexels-photo-3211476.jpeg?auto=compress&cs=tinysrgb&w=800',
      expertise: ['Technology', 'Leadership', 'Innovation', 'AI/ML', 'Cloud Architecture'],
      location: 'San Francisco, CA',
      rating: 4.9,
      events: 25,
      featured: true,
      achievements: [
        'Forbes 40 Under 40 Technology Leader',
        'MIT Technology Review Innovator',
        'Women in Tech Leadership Award',
        'Patent holder for 12 technology innovations'
      ],
      upcomingEvents: [
        {
          name: 'Tech Innovation Summit 2024',
          date: '2024-03-15',
          location: 'San Francisco, CA',
          topic: 'The Future of AI in Enterprise'
        },
        {
          name: 'Digital Transformation Conference',
          date: '2024-04-20',
          location: 'New York, NY',
          topic: 'Leading Through Technology Change'
        }
      ],
      pastEvents: [
        {
          name: 'Global Tech Leaders Forum',
          date: '2023-11-10',
          location: 'London, UK',
          topic: 'Building Scalable Tech Teams'
        },
        {
          name: 'Innovation Summit Asia',
          date: '2023-09-15',
          location: 'Singapore',
          topic: 'AI Ethics and Governance'
        }
      ],
      socialLinks: {
        email: 'zawadi@techcorp.com',
        linkedin: 'https://linkedin.com/in/zawadi-thandwe',
        twitter: 'https://twitter.com/zawadi_tech',
        website: 'https://zawadi-thandwe.com'
      }
    }
    // Add more speakers as needed
  };

  return speakers[id as keyof typeof speakers] || null;
};

const SpeakerProfile: React.FC<SpeakerProfileProps> = ({ speakerId, onBack }) => {
  const speaker = getSpeakerById(speakerId);

  if (!speaker) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Speaker Not Found</h2>
          <button
            onClick={onBack}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
          >
            Back to Directory
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={onBack}
            className="inline-flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Speaker Directory</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Speaker Hero Section */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-1">
              <div className="relative">
                <img
                  src={speaker.image}
                  alt={speaker.name}
                  className="w-64 h-64 rounded-2xl object-cover mx-auto shadow-2xl"
                />
                {speaker.featured && (
                  <div className="absolute -top-4 -right-4 bg-yellow-400 text-yellow-900 p-3 rounded-full">
                    <Award className="w-6 h-6" />
                  </div>
                )}
              </div>
            </div>
            
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                {speaker.featured && (
                  <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Featured Speaker
                  </span>
                )}
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 text-yellow-300 fill-current" />
                  <span className="font-semibold">{speaker.rating}</span>
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{speaker.name}</h1>
              <p className="text-xl text-white/90 mb-2">{speaker.title}</p>
              <p className="text-lg text-white/80 mb-6">{speaker.company}</p>
              
              <div className="flex flex-wrap gap-4 mb-6 text-sm">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>{speaker.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{speaker.events} Events Spoken</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {speaker.expertise.map((exp) => (
                  <span key={exp} className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {exp}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Biography */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Biography</h2>
              <div className="prose prose-lg max-w-none">
                {speaker.fullBio.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-gray-700 leading-relaxed mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Achievements & Recognition</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {speaker.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center space-x-3 p-4 bg-indigo-50 rounded-lg">
                    <Award className="w-6 h-6 text-indigo-600" />
                    <span className="text-gray-900 font-medium">{achievement}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Past Events */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Past Speaking Engagements</h2>
              <div className="space-y-4">
                {speaker.pastEvents.map((event, index) => (
                  <div key={index} className="border-l-4 border-indigo-600 pl-6 py-4">
                    <h3 className="text-lg font-semibold text-gray-900">{event.name}</h3>
                    <p className="text-indigo-600 font-medium">{event.topic}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Contact Information */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Connect</h3>
              <div className="space-y-3">
                <a
                  href={`mailto:${speaker.socialLinks.email}`}
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <Mail className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-900">Email</span>
                </a>
                <a
                  href={speaker.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <Linkedin className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-900">LinkedIn</span>
                </a>
                <a
                  href={speaker.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <Twitter className="w-5 h-5 text-blue-400" />
                  <span className="text-gray-900">Twitter</span>
                </a>
                <a
                  href={speaker.socialLinks.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <Globe className="w-5 h-5 text-green-600" />
                  <span className="text-gray-900">Website</span>
                </a>
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h3>
              <div className="space-y-4">
                {speaker.upcomingEvents.map((event, index) => (
                  <div key={index} className="p-4 bg-indigo-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-1">{event.name}</h4>
                    <p className="text-sm text-indigo-600 mb-2">{event.topic}</p>
                    <div className="space-y-1 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Speaker Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Rating</span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="font-semibold">{speaker.rating}/5.0</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Events Spoken</span>
                  <span className="font-semibold">{speaker.events}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Expertise Areas</span>
                  <span className="font-semibold">{speaker.expertise.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeakerProfile;