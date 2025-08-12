import React, { useState } from 'react';
import { 
  Calendar, 
  Search, 
  Filter, 
  Plus,
  Edit,
  Trash2,
  Eye,
  MapPin,
  Users,
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

  const getUserData = (userId: string) => {
    return users.find(u => u.id === userId) || { username: 'Unknown User', email: 'Unknown Email' };
  };
  
  // --- ACTION HANDLERS ---
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
    alert('Event updated successfully!');
  };

  const handleConfirmDelete = async () => {
    if (!selectedEvent) return;
    setIsLoading(true);
    await db.deleteEvent(selectedEvent.id);
    onRefresh();
    setIsLoading(false);
    setShowDeleteModal(false);
    alert('Event deleted successfully!');
  };

  // --- MODAL COMPONENTS ---

  const ViewModal = () => {
    if (!selectedEvent) return null;
    const organizer = getUserData(selectedEvent.user_id);
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b flex justify-between items-center"><h3 className="text-xl font-bold">Event Details</h3><button onClick={() => setShowViewModal(false)} className="text-gray-400 hover:text-gray-600">&times;</button></div>
          <div className="p-6 space-y-4">
            <h4 className="text-lg font-semibold">{selectedEvent.event_name}</h4>
            <p><strong>Description:</strong> {selectedEvent.description || 'N/A'}</p>
            <p><strong>Organizer:</strong> {organizer.username} ({organizer.email})</p>
            <p><strong>Type:</strong> <span className="capitalize">{selectedEvent.event_type}</span></p>
            <p><strong>Attendees:</strong> {selectedEvent.expected_attendees}</p>
            <p><strong>Date:</strong> {selectedEvent.event_date ? new Date(selectedEvent.event_date).toLocaleDateString() : 'N/A'}</p>
            <p><strong>Location:</strong> {selectedEvent.location_address || 'N/A'}</p>
            <button onClick={() => setShowViewModal(false)} className="mt-4 px-4 py-2 bg-gray-200 rounded-lg">Close</button>
          </div>
        </div>
      </div>
    );
  };

  const EditModal = () => {
    if (!selectedEvent) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
        <form onSubmit={handleUpdateEvent} className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4">
            <h3 className="text-xl font-bold">Edit Event</h3>
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
              <button type="submit" disabled={isLoading} className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50">{isLoading ? 'Updating...' : 'Update'}</button>
            </div>
        </form>
      </div>
    );
  };

  const DeleteModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
          <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center"><AlertTriangle className="w-5 h-5 text-red-600"/></div>
              <h3 className="text-lg font-semibold">Delete Event</h3>
          </div>
          <p className="text-gray-600 mb-6">Are you sure you want to delete "{selectedEvent?.event_name}"? This action is permanent.</p>
          <div className="flex space-x-4">
              <button onClick={() => setShowDeleteModal(false)} className="flex-1 px-4 py-2 border rounded-lg">Cancel</button>
              <button onClick={handleConfirmDelete} disabled={isLoading} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg disabled:opacity-50">{isLoading ? 'Deleting...' : 'Delete'}</button>
          </div>
      </div>
    </div>
  );

  const AddEventModal = () => {
    // ... (This modal code is correct from the previous step)
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Event Management</h2>
          <p className="text-gray-600 mt-1">Manage all events created on the platform</p>
        </div>
        <button onClick={() => setShowAddEventModal(true)} className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          <Plus className="w-4 h-4" />
          <span>Add Event</span>
        </button>
      </div>
      
      <div className="bg-white rounded-xl shadow-lg p-6">
        {/* ... (Search and filter form is the same) ... */}
      </div>

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
