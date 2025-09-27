import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Search, Filter, CheckCircle, XCircle, AlertTriangle, Eye } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  category: string;
  status: string;
  created_at: string;
}

const EventOversightPage: React.FC = () => {
  const { setBreadcrumbs } = useApp();
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    
    // Mock data loading
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockEvents: Event[] = [
      {
        id: '1',
        title: 'Tech Conference 2024',
        category: 'Technology',
        status: 'pending',
        created_at: new Date().toISOString()
      },
      {
        id: '2',
        title: 'Marketing Workshop',
        category: 'Marketing',
        status: 'approved',
        created_at: new Date().toISOString()
      }
    ];
    
    setEvents(mockEvents);
    setIsLoading(false);
  };

  useEffect(() => {
    setBreadcrumbs(['Event Oversight & Moderation']);
    fetchData();
  }, [setBreadcrumbs]);

  const filteredEvents = events.filter(event => {
    const matchesSearch = (event.title || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || (event as any).status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleApprove = (event: Event) => {
    setSelectedEvent(event);
    setShowApproveModal(true);
  };

  const handleReject = (event: Event) => {
    setSelectedEvent(event);
    setShowRejectModal(true);
  };

  const confirmApprove = () => {
    if (!selectedEvent) return;
    alert(`Event "${selectedEvent.title}" approved.`);
    setShowApproveModal(false);
    onRefresh();
  };

  const confirmReject = () => {
    if (!selectedEvent) return;
    alert(`Event "${selectedEvent.title}" rejected.`);
    setShowRejectModal(false);
    onRefresh();
  };

  const onRefresh = () => {
      fetchData();
  }


  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <p>Loading events for moderation...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Event Oversight & Moderation</h1>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="relative w-1/2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Search events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                   autoComplete="off"
                    className="w-full pl-10 pr-4 py-2 border rounded-lg"
                />
            </div>
            <div className="flex items-center space-x-4">
                <Filter className="w-5 h-5 text-gray-500" />
                <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="border rounded-lg p-2">
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Organizer</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredEvents.map((event) => (
                            <tr key={event.id}>
                                <td className="px-6 py-4 whitespace-nowrap">{event.title}</td>
                                <td className="px-6 py-4 whitespace-nowrap">Organizer</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        event.status === 'approved' ? 'bg-green-100 text-green-800' :
                                        event.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                        'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {event.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                    <button className="text-indigo-600 hover:text-indigo-900"><Eye className="w-4 h-4" /></button>
                                    <button onClick={() => handleApprove(event)} className="text-green-600 hover:text-green-900"><CheckCircle className="w-4 h-4" /></button>
                                    <button onClick={() => handleReject(event)} className="text-red-600 hover:text-red-900"><XCircle className="w-4 h-4" /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Modals */}
        {showApproveModal && selectedEvent && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
                <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 text-center">
                    <h3 className="text-lg font-semibold mb-4">Approve Event</h3>
                    <p>Are you sure you want to approve "{selectedEvent.title}"?</p>
                    <div className="flex space-x-4 mt-6">
                        <button onClick={() => setShowApproveModal(false)} className="flex-1 px-4 py-2 border rounded-lg">Cancel</button>
                        <button onClick={confirmApprove} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg">Approve</button>
                    </div>
                </div>
            </div>
        )}
        {showRejectModal && selectedEvent && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
                <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 text-center">
                    <h3 className="text-lg font-semibold mb-4">Reject Event</h3>
                    <p>Are you sure you want to reject "{selectedEvent.title}"?</p>
                    <div className="flex space-x-4 mt-6">
                        <button onClick={() => setShowRejectModal(false)} className="flex-1 px-4 py-2 border rounded-lg">Cancel</button>
                        <button onClick={confirmReject} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg">Reject</button>
                    </div>
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default EventOversightPage;
