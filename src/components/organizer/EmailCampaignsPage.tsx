import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Plus, Edit, Trash2, Send, BarChart2, Eye, Search, Filter, MoreVertical, CheckCircle, Clock, XCircle, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

// Mock data for email campaigns
const mockCampaigns = [
  { id: '1', name: 'Pre-Event Hype', subject: 'Get Ready for an Unforgettable Experience!', audience: 'All Subscribers', status: 'sent', sentDate: '2024-03-01', openRate: 45.2, clickRate: 12.5 },
  { id: '2', name: 'Early Bird Discount', subject: 'Exclusive 20% Off for Early Birds!', audience: 'Registered Users', status: 'sent', sentDate: '2024-02-15', openRate: 62.1, clickRate: 25.8 },
  { id: '3', name: 'Last Chance to Register', subject: 'Only 48 Hours Left to Secure Your Spot!', audience: 'Prospects', status: 'draft', sentDate: null, openRate: 0, clickRate: 0 },
  { id: '4', name: 'Post-Event Thank You', subject: 'Thank You for Attending!', audience: 'Attendees', status: 'scheduled', sentDate: '2024-03-16', openRate: 0, clickRate: 0 },
];

const EmailCampaignsPage: React.FC = () => {
  const { setBreadcrumbs } = useApp();
  const [campaigns, setCampaigns] = useState(mockCampaigns);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const campaignsPerPage = 5;

  useEffect(() => {
    setBreadcrumbs(['Email Campaigns']);
    // Simulate loading
    setTimeout(() => setIsLoading(false), 500);
  }, [setBreadcrumbs]);

  const totalPages = Math.ceil(campaigns.length / campaignsPerPage);
  const paginatedCampaigns = campaigns.slice((currentPage - 1) * campaignsPerPage, currentPage * campaignsPerPage);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSaveCampaign = (campaign: any) => {
    if (editingCampaign) {
      setCampaigns(campaigns.map(c => c.id === campaign.id ? campaign : c));
    } else {
      setCampaigns([...campaigns, { ...campaign, id: `${campaigns.length + 1}` }]);
    }
    setShowModal(false);
    setEditingCampaign(null);
  };

  const handleDeleteCampaign = (id: string) => {
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      setCampaigns(campaigns.filter(c => c.id !== id));
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
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 md:mb-0">Email Campaigns</h1>
          <div className="flex space-x-4">
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              <Filter size={16} />
              <span>Filter</span>
            </button>
            <button
              onClick={() => { setEditingCampaign(null); setShowModal(true); }}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <Plus size={16} />
              <span>Create Campaign</span>
            </button>
          </div>
        </div>

        {/* Campaign Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Campaign Name</th>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{getStatusComponent(campaign.status)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{campaign.openRate}%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{campaign.clickRate}%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-gray-100 rounded-full"><Eye size={16} /></button>
                        <button onClick={() => { setEditingCampaign(campaign); setShowModal(true); }} className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-full"><Edit size={16} /></button>
                        <button onClick={() => handleDeleteCampaign(campaign.id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-full"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50">
            <ChevronLeft size={16} />
            <span>Previous</span>
          </button>
          <span className="text-sm text-gray-700">Page {currentPage} of {totalPages}</span>
          <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50">
            <span>Next</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      
      {showModal && <CampaignModal campaign={editingCampaign} onSave={handleSaveCampaign} onClose={() => { setShowModal(false); setEditingCampaign(null); }} />}
    </div>
  );
};

const CampaignModal: React.FC<{ campaign: any; onSave: (campaign: any) => void; onClose: () => void; }> = ({ campaign, onSave, onClose }) => {
  const [formData, setFormData] = useState(campaign || { name: '', subject: '', audience: '', status: 'draft', content: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="text-xl font-bold">{campaign ? 'Edit' : 'Create'} Campaign</h3>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6">
            <input name="name" value={formData.name} onChange={handleChange} placeholder="Campaign Name" className="w-full p-3 border rounded-lg" required />
            <input name="subject" value={formData.subject} onChange={handleChange} placeholder="Email Subject" className="w-full p-3 border rounded-lg" required />
            <select name="audience" value={formData.audience} onChange={handleChange} className="w-full p-3 border rounded-lg">
              <option value="All Subscribers">All Subscribers</option>
              <option value="Registered Users">Registered Users</option>
              <option value="Attendees">Attendees</option>
              <option value="Prospects">Prospects</option>
            </select>
            <textarea name="content" value={formData.content} onChange={handleChange} placeholder="Email content..." rows={8} className="w-full p-3 border rounded-lg" />
          </div>
          <div className="p-6 border-t flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="px-6 py-2 border rounded-lg">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-lg">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmailCampaignsPage;
