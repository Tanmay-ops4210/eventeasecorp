import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Eye, Share2, BarChart3, Users, Calendar, ArrowRight, Copy, ExternalLink } from 'lucide-react';

interface EventPublishSuccessProps {
  eventId: string;
  eventTitle: string;
  eventUrl: string;
}

const EventPublishSuccess: React.FC<EventPublishSuccessProps> = ({ 
  eventId, 
  eventTitle, 
  eventUrl 
}) => {
  const navigate = useNavigate();

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(eventUrl).then(() => {
      alert('Event URL copied to clipboard!');
    }).catch(() => {
      alert('Failed to copy URL. Please copy manually.');
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: eventTitle,
          text: `Check out this event: ${eventTitle}`,
          url: eventUrl,
        });
      } catch (err) {
        handleCopyUrl();
      }
    } else {
      handleCopyUrl();
    }
  };

  const nextSteps = [
    {
      icon: Eye,
      title: 'View Your Event',
      description: 'See how your event appears to attendees',
      action: () => navigate(`/event/${eventId}`),
      buttonText: 'View Event Page'
    },
    {
      icon: Share2,
      title: 'Share Your Event',
      description: 'Promote your event across social media and email',
      action: handleShare,
      buttonText: 'Share Event'
    },
    {
      icon: BarChart3,
      title: 'Track Performance',
      description: 'Monitor registrations and engagement',
      action: () => navigate('/organizer/analytics'),
      buttonText: 'View Analytics'
    },
    {
      icon: Users,
      title: 'Manage Attendees',
      description: 'View and manage event registrations',
      action: () => navigate('/organizer/attendee-management'),
      buttonText: 'Manage Attendees'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-indigo-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Event Published Successfully!</h1>
          <p className="text-xl text-gray-600 mb-6">
            "{eventTitle}" is now live and accepting registrations
          </p>
          
          {/* Event URL */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 max-w-2xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex-1 text-left">
                <p className="text-sm text-gray-600 mb-1">Your event is live at:</p>
                <p className="text-indigo-600 font-medium break-all">{eventUrl}</p>
              </div>
              <div className="flex space-x-2 ml-4">
                <button
                  onClick={handleCopyUrl}
                  className="p-2 text-gray-600 hover:text-indigo-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  title="Copy URL"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <a
                  href={eventUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-600 hover:text-indigo-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  title="Open in new tab"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* What Happens Next */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What Happens Next?</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-indigo-600 text-sm font-bold">1</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Event Goes Live</p>
                <p className="text-sm text-gray-600">Your event is now visible on the Discover Events page and attendees can start registering</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-indigo-600 text-sm font-bold">2</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Registration Notifications</p>
                <p className="text-sm text-gray-600">You'll receive email notifications for new registrations and can track them in real-time</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-indigo-600 text-sm font-bold">3</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Analytics Available</p>
                <p className="text-sm text-gray-600">View detailed analytics including page views, conversion rates, and attendee demographics</p>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {nextSteps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <IconComponent className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{step.title}</h3>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                </div>
                <button
                  onClick={step.action}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                >
                  <span>{step.buttonText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/my-events')}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              <Calendar className="w-4 h-4" />
              <span>View All Events</span>
            </button>
            
            <button
              onClick={() => navigate('/organizer/create-event')}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
            >
              <Calendar className="w-4 h-4" />
              <span>Create Another Event</span>
            </button>
            
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Go to Dashboard</span>
            </button>
          </div>
        </div>

        {/* Tips for Success */}
        <div className="mt-8 bg-indigo-50 border border-indigo-200 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-indigo-900 mb-4">Tips for Event Success</h3>
          <div className="space-y-2 text-sm text-indigo-800">
            <p>• Share your event URL on social media and with your network</p>
            <p>• Send email invitations to your contact list</p>
            <p>• Update your event details regularly to keep attendees informed</p>
            <p>• Engage with registered attendees through email campaigns</p>
            <p>• Monitor analytics to understand your audience and optimize promotion</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventPublishSuccess;