import React from 'react';
import { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { 
  MessageCircle, Calendar, Share2, Users, Send, Clock,
  Video, FileText, Download, Star, Search, Filter,
  Loader2, Plus, Eye, Mail, Phone, Globe, User,
  CheckCircle, AlertCircle, ArrowRight
} from 'lucide-react';
import { sponsorExhibitorService } from '../../services/sponsorExhibitorService';

const SponsorToolsPage: React.FC = () => {
  const { setBreadcrumbs } = useApp();
  const [activeTab, setActiveTab] = useState<'messaging' | 'demos' | 'resources' | 'networking'>('messaging');
  const [attendees, setAttendees] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAttendees, setSelectedAttendees] = useState<string[]>([]);
  const [messageData, setMessageData] = useState({
    subject: '',
    message: '',
    attachments: [] as string[]
  });
  const [demoData, setDemoData] = useState({
    title: '',
    description: '',
    duration: 30,
    availableSlots: [] as string[]
  });

  React.useEffect(() => {
    setBreadcrumbs(['Attendee Interaction Tools']);
    loadAttendees();
  }, [setBreadcrumbs]);

  const loadAttendees = async () => {
    setIsLoading(true);
    // Mock attendee data
    await new Promise(resolve => setTimeout(resolve, 500));
    setAttendees([
      {
        id: '1',
        name: 'John Doe',
        email: 'john@company.com',
        company: 'ABC Corp',
        title: 'Product Manager',
        interests: ['Enterprise Software', 'Cloud Solutions'],
        lastSeen: '2024-01-15T14:30:00Z',
        status: 'online'
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@startup.com',
        company: 'Startup Inc',
        title: 'CTO',
        interests: ['AI/ML', 'Security'],
        lastSeen: '2024-01-15T13:45:00Z',
        status: 'offline'
      }
    ]);
    setIsLoading(false);
  };

  const filteredAttendees = attendees.filter(attendee =>
    attendee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    attendee.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    attendee.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = async (attendeeId: string) => {
    try {
      const result = await sponsorExhibitorService.sendMessage(attendeeId, messageData.message);
      if (result.success) {
        alert('Message sent successfully!');
        setMessageData({ subject: '', message: '', attachments: [] });
      } else {
        alert(result.error || 'Failed to send message');
      }
    } catch (error) {
      alert('Failed to send message');
    }
  };

  const handleScheduleDemo = async (attendeeId: string) => {
    try {
      const result = await sponsorExhibitorService.scheduleDemo(attendeeId, demoData);
      if (result.success) {
        alert('Demo scheduled successfully!');
        setDemoData({ title: '', description: '', duration: 30, availableSlots: [] });
      } else {
        alert(result.error || 'Failed to schedule demo');
      }
    } catch (error) {
      alert('Failed to schedule demo');
    }
  };

  const handleShareResource = async (attendeeId: string, resourceId: string) => {
    try {
      const result = await sponsorExhibitorService.shareResource(attendeeId, resourceId);
      if (result.success) {
        alert('Resource shared successfully!');
      } else {
        alert(result.error || 'Failed to share resource');
      }
    } catch (error) {
      alert('Failed to share resource');
    }
  };

  const tabs = [
    { id: 'messaging', label: 'Messaging', icon: MessageCircle },
    { id: 'demos', label: 'Demo Scheduling', icon: Calendar },
    { id: 'resources', label: 'Resource Sharing', icon: Share2 },
    { id: 'networking', label: 'Networking', icon: Users }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Attendee Interaction Tools</h1>
          <p className="text-xl text-gray-600">Engage with event attendees and capture valuable leads</p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'border-purple-600 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {/* Messaging Tab */}
            {activeTab === 'messaging' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Attendee List */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Event Attendees</h3>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          placeholder="Search attendees..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {filteredAttendees.map((attendee, index) => (
                        <div
                          key={attendee.id}
                          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{attendee.name}</p>
                              <p className="text-sm text-gray-500">{attendee.title} at {attendee.company}</p>
                              <div className="flex items-center space-x-2 mt-1">
                                <div className={`w-2 h-2 rounded-full ${
                                  attendee.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                                }`} />
                                <span className="text-xs text-gray-500">
                                  {attendee.status === 'online' ? 'Online' : 'Last seen ' + new Date(attendee.lastSeen).toLocaleTimeString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => handleSendMessage(attendee.id)}
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Message Composer */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Compose Message</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                        <input
                          type="text"
                          value={messageData.subject}
                          onChange={(e) => setMessageData(prev => ({ ...prev, subject: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          placeholder="Message subject..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                        <textarea
                          value={messageData.message}
                          onChange={(e) => setMessageData(prev => ({ ...prev, message: e.target.value }))}
                          rows={6}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          placeholder="Type your message here..."
                        />
                      </div>
                      <button
                        onClick={() => selectedAttendees.length > 0 && handleSendMessage(selectedAttendees[0])}
                        disabled={!messageData.message.trim()}
                        className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                      >
                        <Send className="w-4 h-4" />
                        <span>Send Message</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Demo Scheduling Tab */}
            {activeTab === 'demos' && (
              <div className="space-y-6">
                <div className="text-center">
                  <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Demo Scheduling</h3>
                  <p className="text-gray-600 mb-6">Schedule product demos with interested attendees</p>
                  
                  <div className="bg-gray-50 rounded-lg p-6 max-w-md mx-auto">
                    <h4 className="font-semibold text-gray-900 mb-4">Schedule a Demo</h4>
                    <div className="space-y-4">
                      <input
                        type="text"
                        placeholder="Demo title..."
                        value={demoData.title}
                        onChange={(e) => setDemoData(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      />
                      <textarea
                        placeholder="Demo description..."
                        value={demoData.description}
                        onChange={(e) => setDemoData(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      />
                      <select
                        value={demoData.duration}
                        onChange={(e) => setDemoData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      >
                        <option value={15}>15 minutes</option>
                        <option value={30}>30 minutes</option>
                        <option value={45}>45 minutes</option>
                        <option value={60}>60 minutes</option>
                      </select>
                      <button
                        onClick={() => handleScheduleDemo('1')}
                        className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors duration-200"
                      >
                        Create Demo Slot
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Resource Sharing Tab */}
            {activeTab === 'resources' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Sample Resources */}
                  <div className="bg-gray-50 rounded-lg p-6 text-center">
                    <FileText className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h4 className="font-semibold text-gray-900 mb-2">Product Brochure</h4>
                    <p className="text-sm text-gray-600 mb-4">Comprehensive overview of our solutions</p>
                    <button
                      onClick={() => handleShareResource('1', 'brochure_1')}
                      className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200"
                    >
                      Share with Attendees
                    </button>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6 text-center">
                    <Video className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                    <h4 className="font-semibold text-gray-900 mb-2">Demo Video</h4>
                    <p className="text-sm text-gray-600 mb-4">5-minute product demonstration</p>
                    <button
                      onClick={() => handleShareResource('1', 'video_1')}
                      className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200"
                    >
                      Share with Attendees
                    </button>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6 text-center">
                    <Download className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <h4 className="font-semibold text-gray-900 mb-2">Case Studies</h4>
                    <p className="text-sm text-gray-600 mb-4">Success stories and use cases</p>
                    <button
                      onClick={() => handleShareResource('1', 'case_studies_1')}
                      className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200"
                    >
                      Share with Attendees
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Networking Tab */}
            {activeTab === 'networking' && (
              <div className="space-y-6">
                <div className="text-center">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Networking Hub</h3>
                  <p className="text-gray-600 mb-8">Connect with attendees and build valuable relationships</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAttendees.map((attendee, index) => (
                    <div
                      key={attendee.id}
                      className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{attendee.name}</h4>
                          <p className="text-sm text-gray-600">{attendee.title}</p>
                          <p className="text-sm text-gray-500">{attendee.company}</p>
                        </div>
                        <div className={`w-3 h-3 rounded-full ${
                          attendee.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                        }`} />
                      </div>

                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">Interests:</p>
                        <div className="flex flex-wrap gap-1">
                          {attendee.interests.map((interest: string, idx: number) => (
                            <span key={idx} className="bg-purple-100 text-purple-600 px-2 py-1 rounded-full text-xs">
                              {interest}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleSendMessage(attendee.id)}
                          className="flex-1 flex items-center justify-center space-x-1 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>Message</span>
                        </button>
                        <a
                          href={`mailto:${attendee.email}`}
                          className="p-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                        >
                          <Mail className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredAttendees.length === 0 && (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No attendees found</h3>
                    <p className="text-gray-600">
                      {searchTerm ? 'Try adjusting your search criteria' : 'No attendees are currently online'}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SponsorToolsPage;