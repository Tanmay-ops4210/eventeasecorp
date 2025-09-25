import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Calendar, MapPin, Users, Clock, Star, Share2, Download, 
  ExternalLink, Timer, Loader2, CheckCircle, AlertCircle, Play,
  User, Award, Globe, Mail, Phone
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/NewAuthContext';
import { EventDetail } from '../../types/eventDetail';
import { eventDetailService } from '../../services/eventDetailService';
import { attendeeEventService } from '../../services/attendeeEventService';

// Tier colors for sponsor badges
const tierColors = {
  platinum: 'from-gray-400 to-gray-600',
  gold: 'from-yellow-400 to-yellow-600',
  silver: 'from-gray-300 to-gray-500',
  bronze: 'from-orange-400 to-orange-600'
};

const EventDetailPage: React.FC = () => {
  const { setBreadcrumbs } = useApp();
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { setRegistrationData } = useApp();
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);
  const [selectedTicketType, setSelectedTicketType] = useState<'early' | 'regular' | 'vip' | 'student'>('regular');

  React.useEffect(() => {
    setBreadcrumbs(['Events', 'Event Details']);
  }, [setBreadcrumbs]);

  useEffect(() => {
    loadEvent();
  }, [eventId]);

  useEffect(() => {
    if (event && event.status === 'upcoming') {
      const timer = setInterval(() => {
        const eventDateTime = new Date(`${event.date} ${event.time}`).getTime();
        const now = new Date().getTime();
        const difference = eventDateTime - now;

        if (difference > 0) {
          setTimeLeft({
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((difference % (1000 * 60)) / 1000)
          });
        } else {
          setTimeLeft(null);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [event]);

  const loadEvent = async () => {
    if (!eventId) {
      setError('Event ID not provided');
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      const eventData = await eventDetailService.getEventDetail(eventId);
      
      if (!eventData) {
        setError('Event not found');
        return;
      }

      setEvent(eventData);
    } catch (err) {
      setError('Failed to load event details. Please try again.');
      console.error('Error loading event:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share && event) {
      try {
        await navigator.share({
          title: event.title,
          text: event.description,
          url: window.location.href,
        });
      } catch (err) {
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      alert('Event URL copied to clipboard!');
    }).catch(() => {
      alert('Failed to copy URL. Please copy manually from the address bar.');
    });
  };

  const handleDownloadSchedule = () => {
    // In a real app, this would generate and download a PDF
    alert('Schedule PDF download would start here');
  };

  const handleRegister = () => {
    if (!isAuthenticated) {
      alert('Please log in to register for this event');
      return;
    }
    
    if (event) {
      // Prepare registration data
      const registrationInfo = {
        eventId: event.id,
        eventDetails: {
          title: event.title,
          description: event.description,
          date: event.date,
          time: event.time,
          location: event.venue.name,
          image: event.image,
          category: event.category
        },
        ticketType: selectedTicketType,
        price: getTicketPrice()
      };
      
      setRegistrationData(registrationInfo);
      navigate('/event-payment');
    }
  };

  const getTicketPrice = () => {
    if (!event) return 0;
    return event.price[selectedTicketType];
  };

  const getAvailabilityStatus = () => {
    if (!event) return 'unknown';
    const spotsLeft = event.maxAttendees - event.currentAttendees;
    if (spotsLeft <= 0) return 'sold-out';
    if (spotsLeft <= 50) return 'limited';
    return 'available';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading event details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
              <p className="text-red-700 mb-4">{error || 'Event not found'}</p>
              <button
                onClick={() => window.history.back()}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const availabilityStatus = getAvailabilityStatus();

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Sticky Register Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={handleRegister}
          disabled={availabilityStatus === 'sold-out'}
          className={`px-6 py-3 rounded-full font-medium shadow-lg transition-all duration-200 transform hover:scale-105 ${
            availabilityStatus === 'sold-out'
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl'
          }`}
        >
          {availabilityStatus === 'sold-out' ? 'Sold Out' : `Register Now - $${getTicketPrice()}`}
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/discover')}
          className="inline-flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 font-medium transition-colors duration-200 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Events</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Event Header */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="relative">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-64 md:h-80 object-cover"
                />
                <div className="absolute top-4 left-4 flex space-x-2">
                  {event.isFeatured && (
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Featured
                    </span>
                  )}
                  <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {event.category}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <button
                    onClick={handleShare}
                    className="bg-white/90 backdrop-blur-sm text-gray-900 p-2 rounded-full hover:bg-white transition-colors duration-200"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{event.title}</h1>
                <p className="text-xl text-gray-600 mb-6">{event.description}</p>

                {/* Event Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-6 h-6 text-indigo-600" />
                    <div>
                      <p className="font-semibold text-gray-900">
                        {new Date(event.date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                      <p className="text-sm text-gray-600">{event.time} - {event.endTime}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-6 h-6 text-indigo-600" />
                    <div>
                      <p className="font-semibold text-gray-900">{event.venue.name}</p>
                      <p className="text-sm text-gray-600">{event.venue.address}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="w-6 h-6 text-indigo-600" />
                    <div>
                      <p className="font-semibold text-gray-900">
                        {event.currentAttendees} / {event.maxAttendees} Attendees
                      </p>
                      <p className="text-sm text-gray-600">
                        {event.maxAttendees - event.currentAttendees} spots remaining
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="w-6 h-6 text-indigo-600" />
                    <div>
                      <p className="font-semibold text-gray-900">Full Day Event</p>
                      <p className="text-sm text-gray-600">9 hours of content</p>
                    </div>
                  </div>
                </div>

                {/* Availability Status */}
                <div className={`p-4 rounded-lg mb-6 ${
                  availabilityStatus === 'sold-out' 
                    ? 'bg-red-50 border border-red-200' 
                    : availabilityStatus === 'limited'
                    ? 'bg-orange-50 border border-orange-200'
                    : 'bg-green-50 border border-green-200'
                }`}>
                  <div className="flex items-center space-x-2">
                    {availabilityStatus === 'sold-out' ? (
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    ) : availabilityStatus === 'limited' ? (
                      <AlertCircle className="w-5 h-5 text-orange-600" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    )}
                    <p className={`font-medium ${
                      availabilityStatus === 'sold-out' 
                        ? 'text-red-800' 
                        : availabilityStatus === 'limited'
                        ? 'text-orange-800'
                        : 'text-green-800'
                    }`}>
                      {availabilityStatus === 'sold-out' 
                        ? 'Event is sold out' 
                        : availabilityStatus === 'limited'
                        ? `Only ${event.maxAttendees - event.currentAttendees} spots left!`
                        : 'Tickets available'
                      }
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Registration Progress</span>
                    <span>{Math.round((event.currentAttendees / event.maxAttendees) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-300 ${
                        availabilityStatus === 'sold-out'
                          ? 'bg-red-500'
                          : availabilityStatus === 'limited'
                          ? 'bg-orange-500'
                          : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min((event.currentAttendees / event.maxAttendees) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Full Description */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">About This Event</h2>
              <div className="prose prose-lg max-w-none">
                {event.fullDescription.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-gray-700 leading-relaxed mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* What to Expect */}
              <div className="mt-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">What to Expect</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {event.whatToExpect.map((item, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Requirements */}
              {event.requirements.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">What to Bring</h3>
                  <ul className="space-y-2">
                    {event.requirements.map((requirement, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-gray-700">{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Schedule */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Event Schedule</h2>
                <button
                  onClick={handleDownloadSchedule}
                  className="inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </button>
              </div>

              <div className="space-y-4">
                {(event.schedule || []).map((item, index) => (
                  <div
                    key={item.id}
                    className={`p-4 rounded-lg border-l-4 ${
                      item.type === 'keynote' 
                        ? 'border-indigo-600 bg-indigo-50'
                        : item.type === 'workshop'
                        ? 'border-purple-600 bg-purple-50'
                        : item.type === 'break'
                        ? 'border-gray-400 bg-gray-50'
                        : 'border-green-600 bg-green-50'
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="font-bold text-gray-900">{item.time}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                            item.type === 'keynote' 
                              ? 'bg-indigo-100 text-indigo-600'
                              : item.type === 'workshop'
                              ? 'bg-purple-100 text-purple-600'
                              : item.type === 'break'
                              ? 'bg-gray-100 text-gray-600'
                              : 'bg-green-100 text-green-600'
                          }`}>
                            {item.type}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.title}</h3>
                        <p className="text-gray-600 mb-2">{item.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          {item.speaker && (
                            <span>Speaker: {item.speaker}</span>
                          )}
                          <span>Room: {item.room}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {(event.schedule || []).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>Schedule information will be available soon.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Speakers */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Speakers</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {event.speakers.map((speaker, index) => (
                  <div
                    key={speaker.id}
                    className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <img
                      src={speaker.image}
                      alt={speaker.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{speaker.name}</h3>
                      <p className="text-sm text-gray-600">{speaker.title}</p>
                      <p className="text-sm text-gray-500">{speaker.company}</p>
                      <p className="text-xs text-gray-600 mt-2">{speaker.bio}</p>
                      {speaker.sessions.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-indigo-600 font-medium">
                            Sessions: {speaker.sessions.join(', ')}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sponsors */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Event Sponsors</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {event.sponsors.map((sponsor, index) => (
                  <a
                    key={sponsor.id}
                    href={sponsor.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200 transform hover:scale-105"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <img
                      src={sponsor.logo}
                      alt={sponsor.name}
                      className="w-16 h-16 mx-auto mb-3 rounded-lg object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <p className="text-sm font-medium text-gray-900">{sponsor.name}</p>
                    <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${tierColors[sponsor.tier]} text-white`}>
                      {sponsor.tier.charAt(0).toUpperCase() + sponsor.tier.slice(1)}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Venue Map */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Venue Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{event.venue.name}</h3>
                  <p className="text-gray-600 mb-4">{event.venue.address}</p>
                  
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-gray-900">Capacity</h4>
                      <p className="text-gray-600">{event.venue.capacity.toLocaleString()} people</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Amenities</h4>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {event.venue.amenities.map((amenity, index) => (
                          <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Embedded Map Placeholder */}
                <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Interactive Map</p>
                    <p className="text-sm text-gray-500">
                      {event.venue.coordinates.lat.toFixed(4)}, {event.venue.coordinates.lng.toFixed(4)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Organizer Info */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Event Organizer</h2>
              <div className="flex items-start space-x-4">
                <img
                  src={event.organizer.avatar}
                  alt={event.organizer.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{event.organizer.name}</h3>
                  <p className="text-gray-600 mb-3">{event.organizer.bio}</p>
                  <div className="flex items-center space-x-4">
                    <a
                      href={`mailto:${event.organizer.contact}`}
                      className="inline-flex items-center space-x-1 text-indigo-600 hover:text-indigo-700 transition-colors duration-200"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Contact</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Countdown Timer */}
            {timeLeft && event.status === 'upcoming' && (
              <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
                <div className="text-center">
                  <Timer className="w-8 h-8 mx-auto mb-4" />
                  <h3 className="text-lg font-bold mb-4">Event Starts In</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-2xl font-bold">{timeLeft.days}</div>
                      <div className="text-sm opacity-80">Days</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{timeLeft.hours}</div>
                      <div className="text-sm opacity-80">Hours</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{timeLeft.minutes}</div>
                      <div className="text-sm opacity-80">Minutes</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{timeLeft.seconds}</div>
                      <div className="text-sm opacity-80">Seconds</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Ticket Pricing */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ticket Options</h3>
              <div className="space-y-3">
                {Object.entries(event.price).map(([type, price]) => (
                  <label
                    key={type}
                    className={`flex items-center justify-between p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedTicketType === type
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="ticketType"
                        value={type}
                        checked={selectedTicketType === type}
                        onChange={(e) => setSelectedTicketType(e.target.value as any)}
                        className="text-indigo-600 focus:ring-indigo-500"
                      />
                      <div>
                        <p className="font-medium text-gray-900 capitalize">{type}</p>
                        {type === 'early' && <p className="text-xs text-green-600">Save 33%</p>}
                        {type === 'student' && <p className="text-xs text-blue-600">Student Discount</p>}
                        {type === 'vip' && <p className="text-xs text-purple-600">Premium Access</p>}
                      </div>
                    </div>
                    <span className="font-bold text-gray-900">${price}</span>
                  </label>
                ))}
              </div>

              <button
                onClick={handleRegister}
                disabled={availabilityStatus === 'sold-out'}
                className={`w-full mt-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${
                  availabilityStatus === 'sold-out'
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                }`}
              >
                {availabilityStatus === 'sold-out' 
                  ? 'Sold Out' 
                  : `Register Now - $${getTicketPrice()}`
                }
              </button>

              {!isAuthenticated && availabilityStatus !== 'sold-out' && (
                <p className="text-xs text-gray-500 text-center mt-2">
                  Please log in to register for this event
                </p>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={handleShare}
                  className="w-full flex items-center justify-center space-x-2 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share Event</span>
                </button>
                <button
                  onClick={handleDownloadSchedule}
                  className="w-full flex items-center justify-center space-x-2 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Schedule</span>
                </button>
                <a
                  href={`mailto:${event.organizer.contact}?subject=Question about ${event.title}`}
                  className="w-full flex items-center justify-center space-x-2 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <Mail className="w-4 h-4" />
                  <span>Contact Organizer</span>
                </a>
              </div>
            </div>

            {/* Event Tags */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Tags</h3>
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors duration-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
