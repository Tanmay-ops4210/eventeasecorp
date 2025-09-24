import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/NewAuthContext';
import { 
  Plus, Edit, Trash2, Send, BarChart2, Eye, Search, Filter, 
  MoreVertical, CheckCircle, Clock, XCircle, ChevronLeft, 
  ChevronRight, Loader2, Mail, Users, Calendar, X, Save
} from 'lucide-react';
import { realEventService, RealEvent, RealMarketingCampaign } from '../../services/realEventService';
import { organizerCrudService, OrganizerEvent, MarketingCampaign } from '../../services/organizerCrudService';

const RealEmailCampaignsPage: React.FC = () => {
  const { setBreadcrumbs } = useApp();
  const { user } = useAuth();
  const [events, setEvents] = useState<OrganizerEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<string>('');
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<MarketingCampaign | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const campaignsPerPage = 5;
  const [campaignFormData, setCampaignFormData] = useState({
    name: '',
    type: 'email' as const,
    subject: '',
    content: '',
    audience: 'all_subscribers',
    status: 'draft' as const
  });

  useEffect(() => {
    setBreadcrumbs(['Email Campaigns']);
    loadEvents();
  }, [setBreadcrumbs, user]);

  const loadEvents = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const result = await organizerCrudService.getMyEvents(user.id);
      if (result.success && result.events) {
        const publishedEvents = result.events.filter(e => e.status !== 'draft');
        setEvents(publishedEvents);
        if (publishedEvents.length > 0 && !selectedEvent) {
          const firstEvent = publishedEvents[0];
          setSelectedEvent(firstEvent.id);
          loadCampaigns(firstEvent.id);
        }
      }
    } catch (error) {
      console.error('Failed to load events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCampaigns = async (eventId: string) => {
    try {
      const result = await organizerCrudService.getMarketingCampaigns(eventId);
      if (result.success && result.campaigns) {
        setCampaigns(result.campaigns);
      }
    } catch (error) {
      console.error('Failed to load campaigns:', error);
    }
  };

  const handleEventChange = (eventId: string) => {
    setSelectedEvent(eventId);
    loadCampaigns(eventId);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(campaigns.length / campaignsPerPage);
  const paginatedCampaigns = campaigns.slice((currentPage - 1) * campaignsPerPage, currentPage * campaignsPerPage);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleCreateCampaign = () => {
    setCampaignFormData({
      name: '',
      type: 'email',
      subject: '',
      content: '',
      audience: 'all_subscribers',
      status: 'draft'
    });
    setEditingCampaign(null);
    setShowModal(true);
  };

  const handleEditCampaign = (campaign: MarketingCampaign) => {
    setCampaignFormData({
      name: campaign.name,
      type: campaign.type,
      subject: campaign.subject || '',
      content: campaign.content || '',
      audience: campaign.audience || 'all_subscribers',
      status: campaign.status
    });
    setEditingCampaign(campaign);
    setShowModal(true);
  };

  const handleSaveCampaign = async () => {
    if (!selectedEvent || !campaignFormData.name.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      let result;
      if (editingCampaign) {
        result = await organizerCrudService.updateMarketingCampaign(editingCampaign.id, campaignFormData);
      } else {
        result = await organizerCrudService.createMarketingCampaign(selectedEvent, campaignFormData);
      }

      if (result.success) {
        await loadCampaigns(selectedEvent);
        setShowModal(false);
        alert(`Campaign ${editingCampaign ? 'updated' : 'created'} successfully!`);
      } else {
        alert(result.error || 'Failed to save campaign');
      }
    } catch (error) {
      alert('Failed to save campaign');
    }
  };

  const handleDeleteCampaign = async (campaignId: string) => {
    if (confirm('Are you sure you want to delete this campaign?')) {
      try {
        const result = await organizerCrudService.deleteMarketingCampaign(campaignId);
        if (result.success) {
          await loadCampaigns(selectedEvent);
          alert('Campaign deleted successfully!');
        } else {
          alert(result.error || 'Failed to delete campaign');
        }
      } catch (error) {
        alert('Failed to delete campaign');
      }
    }
  };

  const getStatusComponent = (status: string) => {
    switch (status) {
      case 'sent':
        return <span className="flex items-center space-x-1 text-green-600"><CheckCircle size={14} /><span>Sent</span></span>;
      case 'draft':
        return <span className="flex items-center space-x-1 text-gray-600"><Edit size={14} /><span>Draft</span></span>;
      case 'scheduled':
        return <span className="flex items-center space-x-1 text-blue-600"><Clock size={14} /><span>Scheduled</span></span>;
      default:
        return <span className="flex items-center space-x-1 text-red-600"><XCircle size={14} /><span>Error</span></span>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading campaigns...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 md:mb-0">Email Campaigns</h1>
          <div className="flex items-center space-x-4">
            <select
              value={selectedEvent}
              onChange={(e) => handleEventChange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select an event</option>
              {events.map(event => (
                <option key={event.id} value={event.id}>{event.title}</option>
              ))}
            </select>
            <button
              onClick={handleCreateCampaign}
              disabled={!selectedEvent}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus size={16} />
              <span>Create Campaign</span>
            </button>
          </div>
        </div>

        {selectedEvent ? (
          <>
            {/* Campaign Table */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {campaigns.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Campaign Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Open Rate</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Click Rate</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {paginatedCampaigns.map(campaign => (
                        <tr key={campaign.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">{campaign.name}</div>
                            <div className="text-sm text-gray-500">{campaign.subject}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full text-xs font-medium capitalize">
                              {campaign.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{getStatusComponent(campaign.status)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{campaign.open_rate}%</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{campaign.click_rate}%</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button 
                                onClick={() => {/* View campaign details */}}
                                className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-gray-100 rounded-full"
                              >
                                <Eye size={16} />
                              </button>
                              <button 
                                onClick={() => handleEditCampaign(campaign)} 
                                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-full"
                              >
                                <Edit size={16} />
                              </button>
                              <button 
                                onClick={() => handleDeleteCampaign(campaign.id)} 
                                className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-full"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No campaigns yet</h3>
                  <p className="text-gray-600 mb-6">Create your first email campaign to start marketing your event</p>
                  <button
                    onClick={handleCreateCampaign}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                  >
                    Create Campaign
                  </button>
                </div>
              )}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <button 
                  onClick={() => handlePageChange(currentPage - 1)} 
                  disabled={currentPage === 1} 
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronLeft size={16} />
                  <span>Previous</span>
                </button>
                <span className="text-sm text-gray-700">Page {currentPage} of {totalPages}</span>
                <button 
                  onClick={() => handlePageChange(currentPage + 1)} 
                  disabled={currentPage === totalPages} 
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                >
                  <span>Next</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <div className="bg-white rounded-2xl p-12 shadow-lg">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No published events found</h3>
              <p className="text-gray-600 mb-6">Create and publish an event to start marketing campaigns</p>
              <button
                onClick={() => setCurrentView('event-builder')}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
              >
                Create Event
              </button>
            </div>
          </div>
        )}

        {/* Campaign Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b flex justify-between items-center">
                <h3 className="text-xl font-bold">{editingCampaign ? 'Edit' : 'Create'} Campaign</h3>
                <button 
                  onClick={() => setShowModal(false)} 
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-full"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Name *</label>
                  <input
                    type="text"
                    value={campaignFormData.name}
                    onChange={(e) => setCampaignFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g., Pre-Event Announcement"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Type</label>
                    <select
                      value={campaignFormData.type}
                      onChange={(e) => setCampaignFormData(prev => ({ ...prev, type: e.target.value as any }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="email">Email</option>
                      <option value="social">Social Media</option>
                      <option value="sms">SMS</option>
                      <option value="push">Push Notification</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
                    <select
                      value={campaignFormData.audience}
                      onChange={(e) => setCampaignFormData(prev => ({ ...prev, audience: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="all_subscribers">All Subscribers</option>
                      <option value="registered_users">Registered Users</option>
                      <option value="attendees">Event Attendees</option>
                      <option value="prospects">Prospects</option>
                    </select>
                  </div>
                </div>

                {campaignFormData.type === 'email' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Subject *</label>
                    <input
                      type="text"
                      value={campaignFormData.subject}
                      onChange={(e) => setCampaignFormData(prev => ({ ...prev, subject: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter email subject line"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content *</label>
                  <textarea
                    value={campaignFormData.content}
                    onChange={(e) => setCampaignFormData(prev => ({ ...prev, content: e.target.value }))}
                    rows={8}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter your campaign content..."
                  />
                </div>
              </div>

              <div className="p-6 border-t flex justify-end space-x-4">
                <button 
                  onClick={() => setShowModal(false)} 
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveCampaign}
                  className="flex items-center space-x-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingCampaign ? 'Update' : 'Create'} Campaign</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RealEmailCampaignsPage;
