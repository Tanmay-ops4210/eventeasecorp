import React, { useState } from 'react';
import { 
  Calendar, 
  Search, 
  Filter, 
  Plus,
  Edit,
  Trash2,
  Eye,
  AlertTriangle
} from 'lucide-react';
import { Event, AppUser, db } from '../../lib/supabase';

interface EventManagementProps {
  events: Event[];
  users: AppUser[];
  onRefresh: () => void;
}

const EventManagement: React.FC<EventManagementProps> = ({ events, users, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<Event>>({});

  const filteredEvents = events.filter(event => {
    const eventName = event.event_name || '';
    const eventType = event.event_type || '';
    const matchesSearch = eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         eventType.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedFilter === 'all') return matchesSearch;
    return matchesSearch && event.event_type === selectedFilter;
  });

  const getUserName = (userId: string) => users.find(u => u.id === userId)?.username || 'Unknown';

  const handleViewEvent = (event: Event) => {
    setSelectedEvent(event);
    setShowViewModal(true);
  };

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    setEditFormData(event);
    setShowEditModal(true);
  };

  const handleDeleteEvent = (event: Event) => {
    setSelectedEvent(event);
    setShowDeleteModal(true);
  };

  const handleUpdateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;
    setIsLoading(true);
    await db.updateEvent(selectedEvent.id, editFormData);
    onRefresh();
    setIsLoading(false);
    setShowEditModal(false);
  };

  const handleConfirmDelete = async () => {
    if (!selectedEvent) return;
    setIsLoading(true);
    await db.deleteEvent(selectedEvent.id);
    onRefresh();
    setIsLoading(false);
    setShowDeleteModal(false);
  };
  
  const handleAddEvent = async (newEventData: Partial<Event>) => {
    setIsLoading(true);
    await db.createEvent(newEventData);
    onRefresh();
    setIsLoading(false);
    setShowAddEventModal(false);
  };

  // --- MODAL COMPONENTS ---

  const ViewModal = () => {
    if (!selectedEvent) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
          <div className="p-6 border-b flex justify-between items-center"><h3 className="text-xl font-bold">Event Details</h3><button onClick={() => setShowViewModal(false)} className="text-gray-400 text-2xl hover:text-gray-600">&times;</button></div>
          <div className="p-6 space-y-2">
            <p><strong>Event:</strong> {selectedEvent.event_name}</p>
            <p><strong>Organizer:</strong> {getUserName(selectedEvent.user_id)}</p>
            <p><strong>Type:</strong> <span className="capitalize">{selectedEvent.event_type}</span></p>
            <p><strong>Attendees:</strong> {selectedEvent.expected_attendees}</p>
            <p><strong>Date:</strong> {selectedEvent.event_date ? new Date(selectedEvent.event_date).toLocaleDateString() : 'N/A'}</p>
            <div className="pt-4">
              <button onClick={() => setShowViewModal(false)} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Close</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const EditModal = () => {
    if (!selectedEvent) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
        <form onSubmit={handleUpdateEvent} className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
          <div className="p-6 border-b"><h3 className="text-xl font-bold">Edit Event</h3></div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Event Name</label>
              <input type="text" value={editFormData.event_name || ''} onChange={(e) => setEditFormData(prev => ({ ...prev, event_name: e.target.value }))} className="w-full mt-1 p-2 border rounded-lg"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Event Type</label>
              <select value={editFormData.event_type || ''} onChange={(e) => setEditFormData(prev => ({ ...prev, event_type: e.target.value }))} className="w-full mt-1 p-2 border rounded-lg">
                <option value="conference">Conference</option>
                <option value="workshop">Workshop</option>
                <option value="seminar">Seminar</option>
                <option value="networking">Networking</option>
              </select>
            </div>
            <div className="flex space-x-4 pt-4">
              <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 px-4 py-2 border rounded-lg">Cancel</button>
              <button type="submit" disabled={isLoading} className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50">{isLoading ? 'Updating...' : 'Update Event'}</button>
            </div>
          </div>
        </form>
      </div>
    );
  };
  
  const DeleteModal = () => {
    // ... same as before ...
  };
  
  const AddEventModal = () => {
    // ... same as before ...
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Event Management</h2>
          <button onClick={() => setShowAddEventModal(true)} className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            <Plus className="w-4 h-4" />
            <span>Add Event</span>
          </button>
      </div>

      {/* ... (Search and Filter UI is the same) ... */}

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                      <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Organizer</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Attendees</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                      {filteredEvents.map((event) => (
                          <tr key={event.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{event.event_name}</div>
                                <div className="text-sm text-gray-500 capitalize">{event.event_type}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getUserName(event.user_id)}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{event.expected_attendees}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{event.event_date ? new Date(event.event_date).toLocaleDateString() : 'Not set'}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                                <button onClick={() => handleViewEvent(event)} className="text-indigo-600 hover:text-indigo-900" title="View"><Eye className="w-4 h-4" /></button>
                                <button onClick={() => handleEditEvent(event)} className="text-gray-600 hover:text-gray-900" title="Edit"><Edit className="w-4 h-4" /></button>
                                <button onClick={() => handleDeleteEvent(event)} className="text-red-600 hover:text-red-900" title="Delete"><Trash2 className="w-4 h-4" /></button>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      </div>
      
      {showViewModal && <ViewModal />}
      {showEditModal && <EditModal />}
      {showDeleteModal && <DeleteModal />}
      {showAddEventModal && <AddEventModal />}
    </div>
  );
};

export default EventManagement;
