import React, { useState } from 'react';
import { 
  Calendar, MapPin, Users, Clock, Star, ArrowRight, Edit,
  Eye, Settings, MoreVertical, Trash2, Copy, Share2
} from 'lucide-react';
import EventDataInputModal from './EventDataInputModal';

interface EventCardWithDraftProps {
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
    status: 'draft' | 'published' | 'completed';
    featured?: boolean;
    rating?: number;
  };
  onEventUpdate: (eventId: string, eventData: any) => void;
  onEventDelete?: (eventId: string) => void;
  onEventDuplicate?: (eventId: string) => void;
  showActions?: boolean;
}

const EventCardWithDraft: React.FC<EventCardWithDraftProps> = ({ 
  event, 
  onEventUpdate,
  onEventDelete,
  onEventDuplicate,
  showActions = true
}) => {
  const [showDataInputModal, setShowDataInputModal] = useState(false);
  const [showActionsMenu, setShowActionsMenu] = useState(false);

  const handleDraftClick = () => {
    setShowDataInputModal(true);
  };

  const handleSaveEventData = (eventData: any) => {
    onEventUpdate(event.id, eventData);
    setShowDataInputModal(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'published': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <Edit className="w-4 h-4" />;
      case 'published': return <Eye className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const availableSpots = event.maxAttendees - event.attendees;
  const isAlmostFull = availableSpots <= 10;
  const isFull = availableSpots <= 0;

  return (
    <>
      <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden">
        {/* Event Image */}
        <div className="relative overflow-hidden">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
          />
          
          {/* Badges */}
          <div className="absolute top-4 left-4 flex space-x-2">
            <span className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(event.status)}`}>
              {getStatusIcon(event.status)}
              <span>{event.status}</span>
            </span>
            {event.featured && (
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                Featured
              </span>
            )}
            <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-xs font-medium capitalize">
              {event.category}
            </span>
          </div>

          {/* Actions Menu */}
          {showActions && (
            <div className="absolute top-4 right-4">
              <div className="relative">
                <button
                  onClick={() => setShowActionsMenu(!showActionsMenu)}
                  className="bg-white/90 backdrop-blur-sm text-gray-900 p-2 rounded-full hover:bg-white transition-colors duration-200"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
                
                {showActionsMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200">
                    <button
                      onClick={() => {
                        handleDraftClick();
                        setShowActionsMenu(false);
                      }}
                      className="w-full text-left flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit Event</span>
                    </button>
                    <button
                      onClick={() => {
                        onEventDuplicate?.(event.id);
                        setShowActionsMenu(false);
                      }}
                      className="w-full text-left flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <Copy className="w-4 h-4" />
                      <span>Duplicate</span>
                    </button>
                    <button
                      onClick={() => {
                        // Handle share
                        setShowActionsMenu(false);
                      }}
                      className="w-full text-left flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
                    </button>
                    <div className="border-t border-gray-200 my-1"></div>
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this event?')) {
                          onEventDelete?.(event.id);
                        }
                        setShowActionsMenu(false);
                      }}
                      className="w-full text-left flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Price */}
          <div className="absolute bottom-4 right-4">
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

          {/* Progress Bar */}
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

          {/* Action Buttons */}
          <div className="flex space-x-3">
            {event.status === 'draft' ? (
              <button
                onClick={handleDraftClick}
                className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                <Edit className="w-4 h-4" />
                <span>Complete & Publish</span>
              </button>
            ) : (
              <>
                <button
                  onClick={handleDraftClick}
                  className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <Settings className="w-4 h-4" />
                  <span>Manage</span>
                </button>
                <button
                  className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
                >
                  <Eye className="w-4 h-4" />
                  <span>View</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Event Data Input Modal */}
      <EventDataInputModal
        isOpen={showDataInputModal}
        onClose={() => setShowDataInputModal(false)}
        onSave={handleSaveEventData}
        initialData={event}
        mode={event.status === 'draft' ? 'create' : 'edit'}
      />
    </>
  );
};

export default EventCardWithDraft;