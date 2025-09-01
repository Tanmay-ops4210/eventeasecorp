import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Eye,
  Edit,
  Trash2,
  UserPlus,
  AlertTriangle,
  X
} from 'lucide-react';
import { AppUser, Event, db } from '../../lib/supabaseclient';
import '../../styles/admin-panel.css';

interface MemberManagementProps {
  users: AppUser[];
  events: Event[];
  onRefresh: () => void;
}

const MemberManagement: React.FC<MemberManagementProps> = ({ users, events, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<AppUser | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());

    if (selectedFilter === 'all') return matchesSearch;

    const userEvents = events.filter(event => event.user_id === user.id);
    if (selectedFilter === 'active') return matchesSearch && userEvents.length > 0;
    
    // This part requires event_type to be on the event object from mock data
    return matchesSearch && userEvents.some(event => event.event_type === selectedFilter);
  });

  const getUserEventCount = (userId: string) => {
    return events.filter(event => event.user_id === userId).length;
  };

  // --- ACTION HANDLERS ---
  const handleViewUser = (user: AppUser) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleDeleteUser = (user: AppUser) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedUser) return;
    setIsLoading(true);
    await db.deleteUser(selectedUser.id);
    onRefresh();
    setIsLoading(false);
    setShowDeleteModal(false);
    alert('User and their events deleted successfully!');
  };

  // --- MODAL COMPONENTS ---

  const ViewUserModal = () => {
    if (!selectedUser) return null;
    return (
      <div className="admin-modal-overlay">
        <div className="admin-modal">
          <div className="admin-modal-header">
            <h3 className="admin-modal-title">Member Details</h3>
            <button onClick={() => setShowUserModal(false)} className="admin-modal-close">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="admin-modal-body space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="admin-form-label">Username</label>
                <div className="p-3 bg-gray-50 rounded-lg">{selectedUser.username}</div>
              </div>
              <div>
                <label className="admin-form-label">Email</label>
                <div className="p-3 bg-gray-50 rounded-lg">{selectedUser.email}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="admin-form-label">Joined Date</label>
                <div className="p-3 bg-gray-50 rounded-lg">{new Date(selectedUser.created_at).toLocaleDateString()}</div>
              </div>
              <div>
                <label className="admin-form-label">Events Created</label>
                <div className="p-3 bg-gray-50 rounded-lg">{getUserEventCount(selectedUser.id)}</div>
              </div>
            </div>
          </div>
          <div className="admin-modal-footer">
            <button onClick={() => setShowUserModal(false)} className="admin-btn admin-btn-secondary">
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  const DeleteUserModal = () => {
    if (!selectedUser) return null;
    return (
      <div className="admin-modal-overlay">
        <div className="admin-modal">
          <div className="admin-modal-header">
            <h3 className="admin-modal-title">Delete Member</h3>
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
                This will permanently delete "{selectedUser.username}" and all their events. This action cannot be undone.
              </p>
            </div>
          </div>
          <div className="admin-modal-footer">
            <button onClick={() => setShowDeleteModal(false)} className="admin-btn admin-btn-secondary">
              Cancel
            </button>
            <button 
              onClick={handleConfirmDelete} 
              disabled={isLoading} 
              className="admin-btn admin-btn-danger"
            >
              {isLoading ? 'Deleting...' : 'Delete Member'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const AddMemberModal = () => {
    const [newUserData, setNewUserData] = useState({ username: '', email: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setNewUserData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleAddUser = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      await db.createUser(newUserData);
      onRefresh();
      setIsSubmitting(false);
      setShowAddModal(false);
      alert('Member added successfully!');
    };

    return (
      <div className="admin-modal-overlay">
        <div className="admin-modal">
          <div className="admin-modal-header">
            <h3 className="admin-modal-title">Add New Member</h3>
            <button onClick={() => setShowAddModal(false)} className="admin-modal-close">
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleAddUser}>
            <div className="admin-modal-body space-y-4">
              <div className="admin-form-group">
                <label className="admin-form-label">Username</label>
                <input 
                  type="text" 
                  name="username" 
                  onChange={handleInputChange} 
                  className="admin-form-input" 
                  required 
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Email</label>
                <input 
                  type="email" 
                  name="email" 
                  onChange={handleInputChange} 
                  className="admin-form-input" 
                  required 
                />
              </div>
            </div>
            <div className="admin-modal-footer">
              <button type="button" onClick={() => setShowAddModal(false)} className="admin-btn admin-btn-secondary">
                Cancel
              </button>
              <button type="submit" disabled={isSubmitting} className="admin-btn admin-btn-primary">
                {isSubmitting ? 'Adding...' : 'Add Member'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Member Management</h3>
          <p className="text-gray-600 mt-1">Manage registered users and their permissions</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="admin-btn admin-btn-primary">
          <UserPlus className="w-4 h-4" />
          <span>Add Member</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="admin-search-container">
        <Search className="admin-search-icon" />
        <input
          type="text"
          placeholder="Search members by name or email..."
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
          <option value="all">All Members</option>
          <option value="active">Active Members</option>
          <option value="conference">Conference Organizers</option>
          <option value="workshop">Workshop Organizers</option>
        </select>
      </div>

      {/* Members Table */}
      <div className="admin-table-container">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Events Created</th>
                <th>Joined Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{user.username}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="admin-badge-status admin-badge-info">
                      {getUserEventCount(user.id)}
                    </span>
                  </td>
                  <td>{new Date(user.created_at).toLocaleDateString()}</td>
                  <td>
                    <span className="admin-badge-status admin-badge-success">
                      Active
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleViewUser(user)} 
                        className="admin-action-btn admin-tooltip" 
                        data-tooltip="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        className="admin-action-btn admin-tooltip" 
                        data-tooltip="Edit (Coming Soon)"
                        disabled
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user)} 
                        className="admin-action-btn danger admin-tooltip" 
                        data-tooltip="Delete Member"
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
        
        {filteredUsers.length === 0 && (
          <div className="admin-empty-state">
            <Users className="admin-empty-icon" />
            <h3 className="admin-empty-title">No members found</h3>
            <p className="admin-empty-description">
              {searchTerm ? 'Try adjusting your search criteria' : 'No members have been added yet'}
            </p>
          </div>
        )}
      </div>
      
      {showUserModal && <ViewUserModal />}
      {showDeleteModal && <DeleteUserModal />}
      {showAddModal && <AddMemberModal />}
    </div>
  );
};

export default MemberManagement;
