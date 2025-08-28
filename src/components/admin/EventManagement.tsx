import React, { useState } from 'react';
import {
  Calendar,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  AlertTriangle,
  X,
  MapPin,
  Users as UsersIcon
} from 'lucide-react';
import { Event, AppUser, db } from '../../lib/supabase';
import '../../styles/admin-panel.css';

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
  const [addFormData, setAddFormData] = useState<Partial<Event>>({
    event_name: '',
    event_type: 'conference',
    expected_attendees: 50,
    user_id: ''
  });


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

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await db.createEvent(addFormData);
    onRefresh();
    setIsLoading(false);
    setShowAddEventModal(false);
    setAddFormData({
        event_name: '',
        event_type: 'conference',
        expected_attendees: 50,
        user_id: ''
    });
  };

  // --- MODAL COMPONENTS ---

  const ViewModal = () => {
    if (!selectedEvent) return null;
    return (
      <div className="admin-modal-overlay">
        <div className="admin-modal">
          <div className="admin-modal-header">
            <h3 className="admin-modal-title">Event Details</h3>
            <button onClick={() => setShowViewModal(false)} className="admin-modal-close">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="admin-modal-body space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="admin-form-label">Event Name</label>
                <div className="p-3 bg-gray-50 rounded-lg font-medium">{selectedEvent.event_name}</div>
              </div>
              <div>
                <label className="admin-form-label">Organizer</label>
                <div className="p-3 bg-gray-50 rounded-lg">{getUserName(selectedEvent.user_id)}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="admin-form-label">Event Type</label>
                <div className="p-3 bg-gray-50 rounded-lg capitalize">{selectedEvent.event_type}</div>
              </div>
              <div>
                <label className="admin-form-label">Expected Attendees</label>
                <div className="p-3 bg-gray-50 rounded-lg">{selectedEvent.expected_attendees}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="admin-form-label">Event Date</label>
                <div className="p-3 bg-gray-50 rounded-lg">
                  {selectedEvent.event_date ? new Date(selectedEvent.event_date).toLocaleDateString() : 'Not set'}
                </div>
              </div>
              <div>
                <label className="admin-form-label">Location</label>
                <div className="p-3 bg-gray-50 rounded-lg">
                  {selectedEvent.location_address || 'Not specified'}
                </div>
              </div>
            </div>
            {selectedEvent.description && (
              <div>
                <label className="admin-form-label">Description</label>
                <div className="p-3 bg-gray-50 rounded-lg">{selectedEvent.description}</div>
              </div>
            )}
          </div>
          <div className="admin-modal-footer">
            <button onClick={() => setShowViewModal(false)} className="admin-btn admin-btn-secondary">
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  const EditModal = () => {
    if (!selectedEvent) return null;
    return (
      <div className="admin-modal-overlay">
        <form onSubmit={handleUpdateEvent} className="admin-modal">
          <div className="admin-modal-header">
            <h3 className="admin-modal-title">Edit Event</h3>
            <button type="button" onClick={() => setShowEditModal(false)} className="admin-modal-close">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="admin-modal-body space-y-4">
            <div className="admin-form-group">
              <label className="admin-form-label">Event Name</label>
              <input 
                type="text" 
                value={editFormData.event_name || ''} 
                onChange={(e) => setEditFormData(prev => ({ ...prev, event_name: e.target.value }))} 
                className="admin-form-input"
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Event Type</label>
              <select 
                value={editFormData.event_type || ''} 
                onChange={(e) => setEditFormData(prev => ({ ...prev, event_type: e.target.value }))} 
                className="admin-form-select"
              >
                <option value="conference">Conference</option>
                <option value="workshop">Workshop</option>
                <option value="seminar">Seminar</option>
                <option value="networking">Networking</option>
              </select>
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Expected Attendees</label>
              <input 
                type="number" 
                value={editFormData.expected_attendees || ''} 
                onChange={(e) => setEditFormData(prev => ({ ...prev, expected_attendees: parseInt(e.target.value) }))} 
                className="admin-form-input"
              />
            </div>
          </div>
          <div className="admin-modal-footer">
            <button type="button" onClick={() => setShowEditModal(false)} className="admin-btn admin-btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={isLoading} className="admin-btn admin-btn-primary">
              {isLoading ? 'Updating...' : 'Update Event'}
            </button>
          </div>
        </form>
      </div>
    );
  };

  const DeleteModal = () => {
    if (!selectedEvent) return null;
    return (
      <div className="admin-modal-overlay">
        <div className="admin-modal">
          <div className="admin-modal-header">
            <h3 className="admin-modal-title">Delete Event</h3>
            <button onClick={() => setShowDeleteModal(false)} className="admin-modal-close">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="admin-modal-body">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600"/>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Are you sure?</h4>
              <p className="text-gray-600 mb-6">
                This will permanently delete the event "{selectedEvent.event_name}". This action cannot be undone.
              </p>
            </div>
          </div>
          <div className="admin-modal-footer">
            <button onClick={() => setShowDeleteModal(false)} className="admin-btn admin-btn-secondary">
              Cancel
            </button>
            <button onClick={handleConfirmDelete} disabled={isLoading} className="admin-btn admin-btn-danger">
              {isLoading ? 'Deleting...' : 'Delete Event'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const AddEventModal = () => {
    return (
      <div className="admin-modal-overlay">
        <form onSubmit={handleAddEvent} className="admin-modal">
          <div className="admin-modal-header">
            <h3 className="admin-modal-title">Add New Event</h3>
            <button type="button" onClick={() => setShowAddEventModal(false)} className="admin-modal-close">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="admin-modal-body space-y-4">
            <div className="admin-form-group">
              <label className="admin-form-label">Event Name</label>
              <input 
                type="text" 
                value={addFormData.event_name || ''} 
                onChange={(e) => setAddFormData(prev => ({ ...prev, event_name: e.target.value }))} 
                className="admin-form-input" 
                required 
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Event Type</label>
              <select 
                value={addFormData.event_type || ''} 
                onChange={(e) => setAddFormData(prev => ({ ...prev, event_type: e.target.value }))} 
                className="admin-form-select"
              >
                <option value="conference">Conference</option>
                <option value="workshop">Workshop</option>
                <option value="seminar">Seminar</option>
                <option value="networking">Networking</option>
              </select>
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Organizer</label>
              <select 
                value={addFormData.user_id || ''} 
                onChange={(e) => setAddFormData(prev => ({ ...prev, user_id: e.target.value }))} 
                className="admin-form-select" 
                required
              >
                <option value="" disabled>Select an organizer</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>{user.username}</option>
                ))}
              </select>
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Expected Attendees</label>
              <input 
                type="number" 
                value={addFormData.expected_attendees || ''} 
                onChange={(e) => setAddFormData(prev => ({ ...prev, expected_attendees: parseInt(e.target.value, 10) }))} 
                className="admin-form-input" 
                required
              />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Event Date</label>
              <input 
                type="date" 
                value={addFormData.event_date || ''} 
                onChange={(e) => setAddFormData(prev => ({ ...prev, event_date: e.target.value }))} 
                className="admin-form-input"
              />
            </div>
          </div>
          <div className="admin-modal-footer">
            <button type="button" onClick={() => setShowAddEventModal(false)} className="admin-btn admin-btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={isLoading} className="admin-btn admin-btn-primary">
              {isLoading ? 'Adding...' : 'Add Event'}
            </button>
          </div>
        </form>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Event Management</h3>
          <p className="text-gray-600 mt-1">Monitor and manage all platform events</p>
        </div>
        <button onClick={() => setShowAddEventModal(true)} className="admin-btn admin-btn-primary">
          <Plus className="w-4 h-4" />
          <span>Add Event</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="admin-search-container">
        <Search className="admin-search-icon" />
        <input
          type="text"
          placeholder="Search events by name or type..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="admin-search-input"
        />
      </div>

      <div className="admin-filters">
        <select
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
          className="admin-filter-select"
        >
          <option value="all">All Events</option>
          <option value="conference">Conferences</option>
          <option value="workshop">Workshops</option>
          <option value="seminar">Seminars</option>
          <option value="networking">Networking</option>
        </select>
      </div>

      {/* Events Table */}
      <div className="admin-table-container">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Event</th>
                <th>Organizer</th>
                <th>Type</th>
                <th>Attendees</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((event) => (
                <tr key={event.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{event.event_name}</div>
                        {event.location_address && (
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {event.location_address}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>{getUserName(event.user_id)}</td>
                  <td>
                    <span className="admin-badge-status admin-badge-info">
                      {event.event_type}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      <UsersIcon className="w-4 h-4 text-gray-400" />
                      {event.expected_attendees}
                    </div>
                  </td>
                  <td>{event.event_date ? new Date(event.event_date).toLocaleDateString() : 'Not set'}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleViewEvent(event)} 
                        className="admin-action-btn admin-tooltip" 
                        data-tooltip="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleEditEvent(event)} 
                        className="admin-action-btn admin-tooltip" 
                        data-tooltip="Edit Event"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteEvent(event)} 
                        className="admin-action-btn danger admin-tooltip" 
                        data-tooltip="Delete Event"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredEvents.length === 0 && (
          <div className="admin-empty-state">
            <Calendar className="admin-empty-icon" />
            <h3 className="admin-empty-title">No events found</h3>
            <p className="admin-empty-description">
              {searchTerm ? 'Try adjusting your search criteria' : 'No events have been created yet'}
            </p>
          </div>
        )}
      </div>

      {showViewModal && <ViewModal />}
      {showEditModal && <EditModal />}
      {showDeleteModal && <DeleteModal />}
      {showAddEventModal && <AddEventModal />}
    </div>
  );
};

export default EventManagement;

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
    if (!selectedEvent) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="w-8 h-8 text-red-600"/>
                </div>
                <h3 className="text-xl font-bold mb-2">Delete Event</h3>
                <p className="text-gray-600 mb-6">Are you sure you want to delete the event "{selectedEvent.event_name}"? This action cannot be undone.</p>
                <div className="flex space-x-4">
                    <button onClick={() => setShowDeleteModal(false)} className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
                    <button onClick={handleConfirmDelete} disabled={isLoading} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg disabled:opacity-50">{isLoading ? 'Deleting...' : 'Delete'}</button>
                </div>
            </div>
        </div>
    );
  };

  const AddEventModal = () => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
            <form onSubmit={handleAddEvent} className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
                <div className="p-6 border-b"><h3 className="text-xl font-bold">Add New Event</h3></div>
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Event Name</label>
                        <input type="text" value={addFormData.event_name || ''} onChange={(e) => setAddFormData(prev => ({ ...prev, event_name: e.target.value }))} className="w-full mt-1 p-2 border rounded-lg" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Event Type</label>
                        <select value={addFormData.event_type || ''} onChange={(e) => setAddFormData(prev => ({ ...prev, event_type: e.target.value }))} className="w-full mt-1 p-2 border rounded-lg">
                            <option value="conference">Conference</option>
                            <option value="workshop">Workshop</option>
                            <option value="seminar">Seminar</option>
                            <option value="networking">Networking</option>
                        </select>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Organizer</label>
                        <select value={addFormData.user_id || ''} onChange={(e) => setAddFormData(prev => ({ ...prev, user_id: e.target.value }))} className="w-full mt-1 p-2 border rounded-lg" required>
                            <option value="" disabled>Select an organizer</option>
                            {users.map(user => (
                                <option key={user.id} value={user.id}>{user.username}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Expected Attendees</label>
                        <input type="number" value={addFormData.expected_attendees || ''} onChange={(e) => setAddFormData(prev => ({ ...prev, expected_attendees: parseInt(e.target.value, 10) }))} className="w-full mt-1 p-2 border rounded-lg" required/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Event Date</label>
                        <input type="date" value={addFormData.event_date || ''} onChange={(e) => setAddFormData(prev => ({ ...prev, event_date: e.target.value }))} className="w-full mt-1 p-2 border rounded-lg"/>
                    </div>
                    <div className="flex space-x-4 pt-4">
                        <button type="button" onClick={() => setShowAddEventModal(false)} className="flex-1 px-4 py-2 border rounded-lg">Cancel</button>
                        <button type="submit" disabled={isLoading} className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50">{isLoading ? 'Adding...' : 'Add Event'}</button>
                    </div>
                </div>
            </form>
        </div>
    );
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
