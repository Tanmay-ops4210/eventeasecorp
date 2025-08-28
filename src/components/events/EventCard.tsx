import React from 'react';
import { Calendar, MapPin, Users, Clock, Star, ArrowRight } from 'lucide-react';

interface EventCardProps {
  event: {
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
  };
  onBookNow: (eventId: string) => void;
  isAuthenticated: boolean;
  onLoginRequired: () => void;
  onEventClick?: (eventId: string) => void;
}

const EventCard: React.FC<EventCardProps> = ({ 
  event, 
  onBookNow, 
  isAuthenticated, 
  onLoginRequired,
  onEventClick
}) => {
  const handleBookClick = () => {
    if (!isAuthenticated) {
      onLoginRequired();
      return;
    }
    onBookNow(event.id);
  };

  const availableSpots = event.maxAttendees - event.attendees;
  const isAlmostFull = availableSpots <= 10;
  const isFull = availableSpots <= 0;

  const handleCardClick = () => {
    // Prevent the card click from triggering when clicking the book button
    // The book button has its own click handler with stopPropagation
    if (onEventClick) {
      onEventClick(event.id);
    }
  };

  return (
    <div 
      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Event Image */}
      <div className="relative overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex space-x-2">
          {event.featured && (
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium">
              Featured
            </span>
          )}
          <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-xs font-medium capitalize">
            {event.category}
          </span>
        </div>

        {/* Price */}
        <div className="absolute top-4 right-4">
          <span className="bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full text-sm font-bold">
            ${event.price}
          </span>
        </div>

        {/* Availability Status */}
        {(isAlmostFull || isFull) && (
          <div className="absolute bottom-4 left-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              isFull 
                ? 'bg-red-500 text-white' 
                : 'bg-orange-500 text-white'
            }`}>
              {isFull ? 'Sold Out' : `Only ${availableSpots} spots left`}
            </span>
          </div>
        )}
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
        <div className="space-y-3 mb-6">
          <div className="flex items-center space-x-3 text-sm text-gray-600">
            <Calendar className="w-4 h-4 text-indigo-600" />
            <span>{new Date(event.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-3 text-sm text-gray-600">
            <Clock className="w-4 h-4 text-indigo-600" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center space-x-3 text-sm text-gray-600">
            <MapPin className="w-4 h-4 text-indigo-600" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
          <div className="flex items-center space-x-3 text-sm text-gray-600">
            <Users className="w-4 h-4 text-indigo-600" />
            <span>{event.attendees} / {event.maxAttendees} attendees</span>
          </div>
        </div>

        {/* Attendance Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Attendance</span>
            <span>{Math.round((event.attendees / event.maxAttendees) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                isFull 
                  ? 'bg-red-500' 
                  : isAlmostFull 
                  ? 'bg-orange-500' 
                  : 'bg-green-500'
              }`}
              style={{ width: `${Math.min((event.attendees / event.maxAttendees) * 100, 100)}%` }}
            />
          </div>
        </div>

        {/* Book Now Button */}
        <button
          onClick={handleBookClick}
          onClick={(e) => {
            e.stopPropagation();
            handleBookClick();
          }}
          disabled={isFull}
          className={`w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${
            isFull
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : isAuthenticated
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
              : 'bg-gray-600 text-white hover:bg-gray-700'
          }`}
        >
          {isFull ? (
            <span>Sold Out</span>
          ) : isAuthenticated ? (
            <>
              <span>Book Now</span>
              <ArrowRight className="w-4 h-4" />
            </>
          ) : (
            <span>Login to Book</span>
          )}
        </button>

        {/* Additional Info for Non-Authenticated Users */}
        {!isAuthenticated && !isFull && (
          <p className="text-xs text-gray-500 text-center mt-2">
            Please log in to book this event
          </p>
        )}
      </div>
    </div>
  );
};

export default EventCard;