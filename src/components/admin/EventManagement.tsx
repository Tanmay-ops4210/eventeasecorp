import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Eye,
  Edit,
  Trash2,
  Plus,
  AlertTriangle,
  X,
  Calendar,
  LayoutGrid,
  List,
  CheckCircle,
  Clock,
  Loader2,
  MoreVertical,
  ChevronDown
} from 'lucide-react';
import { AppUser, Event, db } from '../../lib/supabaseclient';
import '../../styles/admin-panel.css';

interface EventManagementProps {
  users: AppUser[];
  events: Event[];
  onRefresh: () => void;
}

const EventManagement: React.FC<EventManagementProps> = ({ users, events, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const eventStatus = new Date(event.event_date || 0) > new Date() ? 'upcoming' : 'past';
      const matchesSearch = event.event_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (event.app_users?.username || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || eventStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [events, searchTerm, statusFilter]);

  const handleDelete = (event: Event) => {
    setSelectedEvent(event);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedEvent) return;
    setIsLoading(true);
    await db.deleteEvent(selectedEvent.id);
    await onRefresh();
    setIsLoading(false);
    setShowDeleteModal(false);
    setSelectedEvent(null);
  };

  const getStatusBadge = (eventDate: string | undefined) => {
    if (!eventDate) return <span className="admin-badge-status admin-badge-warning">Date TBD</span>;
    const isPast = new Date(eventDate) < new Date();
    return isPast ? (
      <span className="admin-badge-status admin-badge-info">Past</span>
    ) : (
      <span className="admin-badge-status admin-badge-success">Upcoming</span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Event Management</h3>
          <p className="text-gray-600 mt-1">Oversee, edit, and manage all platform events.</p>
        </div>
        <button className="admin-btn admin-btn-primary mt-4 md:mt-0" disabled>
          <Plus className="w-4 h-4" />
          <span>Create Event (Soon)</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="admin-search-container w-full md:flex-1">
          <Search className="admin-search-icon" />
          <input
            type="text"
            placeholder="Search by event name or organizer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="admin-search-input"
          />
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="admin-filter-select w-full md:w-auto"
          >
            <option value="all">All Statuses</option>
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
          </select>
          <div className="bg-gray-100 p-1 rounded-lg flex">
            <button 
              onClick={() => setViewMode('list')} 
              className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
              aria-label="List View"
            >
              <List className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setViewMode('grid')} 
              className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
              aria-label="Grid View"
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      {viewMode === 'list' ? (
        // Table View
        <div className="admin-table-container">
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Event Name</th>
                  <th>Organizer</th>
                  <th>Attendees</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((event) => (
                  <tr key={event.id}>
                    <td>
                      <div className="font-medium text-gray-900">{event.event_name}</div>
                      <div className="text-sm text-gray-500 capitalize">{event.event_type}</div>
                    </td>
                    <td>{event.app_users?.username || 'N/A'}</td>
                    <td>{event.expected_attendees}</td>
                    <td>{event.event_date ? new Date(event.event_date).toLocaleDateString() : 'TBD'}</td>
                    <td>{getStatusBadge(event.event_date)}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button className="admin-action-btn admin-tooltip" data-tooltip="View"><Eye className="w-4 h-4" /></button>
                        <button className="admin-action-btn admin-tooltip" data-tooltip="Edit (Soon)" disabled><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(event)} className="admin-action-btn danger admin-tooltip" data-tooltip="Delete"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        // Grid View
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map(event => (
            <div key={event.id} className="admin-card overflow-hidden !shadow-lg">
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <div>
                    {getStatusBadge(event.event_date)}
                    <h4 className="font-bold text-lg mt-2">{event.event_name}</h4>
                    <p className="text-sm text-gray-500 capitalize">{event.event_type}</p>
                  </div>
                  <div className="relative">
                     {/* Dropdown can be added here */}
                     <MoreVertical className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
                <div className="mt-4 space-y-2 text-sm">
                  <p className="flex items-center gap-2 text-gray-600"><Users className="w-4 h-4 text-purple-500" /> <span>{event.expected_attendees} Attendees</span></p>
                  <p className="flex items-center gap-2 text-gray-600"><Calendar className="w-4 h-4 text-purple-500" /> <span>{event.event_date ? new Date(event.event_date).toLocaleDateString() : 'TBD'}</span></p>
                  <p className="flex items-center gap-2 text-gray-600"><User className="w-4 h-4 text-purple-500" /> <span>{event.app_users?.username || 'N/A'}</span></p>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3 flex justify-end gap-2">
                <button className="admin-btn admin-btn-secondary admin-btn-sm">View</button>
                <button onClick={() => handleDelete(event)} className="admin-btn admin-btn-danger admin-btn-sm">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredEvents.length === 0 && (
          <div className="admin-empty-state">
            <Calendar className="admin-empty-icon" />
            <h3 className="admin-empty-title">No events found</h3>
            <p className="admin-empty-description">
              {searchTerm || statusFilter !== 'all' ? 'Try adjusting your search criteria.' : 'There are no events on the platform yet.'}
            </p>
          </div>
        )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedEvent && (
         <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">Delete Event</h3>
              <button onClick={() => setShowDeleteModal(false)} className="admin-modal-close"><X className="w-5 h-5" /></button>
            </div>
            <div className="admin-modal-body">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-red-600"/>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Are you sure?</h4>
                <p className="text-gray-600 mb-6">This will permanently delete the event "{selectedEvent.event_name}". This action cannot be undone.</p>
              </div>
            </div>
            <div className="admin-modal-footer">
              <button onClick={() => setShowDeleteModal(false)} className="admin-btn admin-btn-secondary">Cancel</button>
              <button onClick={confirmDelete} disabled={isLoading} className="admin-btn admin-btn-danger">
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                <span>{isLoading ? 'Deleting...' : 'Delete Event'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventManagement;
