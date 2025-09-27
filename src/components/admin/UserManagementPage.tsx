import React, { useState, useMemo } from 'react';
import { Users, Search, Filter, Eye, CreditCard as Edit, Trash2, UserPlus, AlertTriangle, X, CheckCircle, XCircle, MoreVertical, ChevronDown, User } from 'lucide-react';
import '../../styles/admin-panel.css';

interface AppUser {
  id: string;
  email: string;
  full_name?: string;
  role: string;
  created_at: string;
}

interface Event {
  id: string;
  title: string;
  organizer_id?: string;
}

interface MemberManagementProps {
  users: AppUser[];
  events: Event[];
  onRefresh: () => void;
}

const MemberManagement: React.FC<MemberManagementProps> = ({ users, events, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const [selectedUser, setSelectedUser] = useState<AppUser | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Add role and status to mock data for demonstration
  const augmentedUsers = useMemo(() => users.map(user => ({
    ...user,
    role: ['attendee', 'organizer', 'sponsor'][Math.floor(Math.random() * 3)] as 'attendee' | 'organizer' | 'sponsor',
    status: Math.random() > 0.2 ? 'active' : 'banned'
  })), [users]);

  const filteredUsers = useMemo(() => {
    return augmentedUsers.filter(user => {
      const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [augmentedUsers, searchTerm, roleFilter, statusFilter]);

  const getUserEventCount = (userId: string) => {
    return events.filter(event => event.organizer_id === userId).length;
  };

  const handleDelete = (user: AppUser) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedUser) return;
    setIsLoading(true);
    
    // Mock delete operation
    await new Promise(resolve => setTimeout(resolve, 500));
    alert('User would be deleted in a real implementation');
    
    onRefresh();
    setIsLoading(false);
    setShowDeleteModal(false);
    setSelectedUser(null);
  };
  
  const getRoleBadge = (role: string) => {
    const colors: {[key: string]: string} = {
        attendee: 'admin-badge-info',
        organizer: 'admin-badge-success',
        sponsor: 'admin-badge-warning'
    };
    return <span className={`admin-badge-status ${colors[role] || 'admin-badge-info'}`}>{role}</span>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Member Management</h3>
          <p className="text-gray-600 mt-1">Manage platform users, roles, and permissions.</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="admin-btn admin-btn-primary mt-4 md:mt-0">
          <UserPlus className="w-4 h-4" />
          <span>Add Member</span>
        </button>
      </div>

      <div className="admin-card">
        <div className="admin-card-body !p-4 md:!p-6">
            <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="admin-search-container w-full md:flex-1 !m-0">
                <Search className="admin-search-icon" />
                <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                   autoComplete="off"
                    className="admin-search-input"
                />
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="admin-filter-select w-full md:w-auto">
                    <option value="all">All Roles</option>
                    <option value="attendee">Attendee</option>
                    <option value="organizer">Organizer</option>
                    <option value="sponsor">Sponsor</option>
                </select>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="admin-filter-select w-full md:w-auto">
                    <option value="all">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="banned">Banned</option>
                </select>
                </div>
            </div>
        </div>
      </div>

      <div className="admin-table-container">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Role</th>
                <th>Events Created</th>
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
                        <div className="font-medium text-gray-900">{user.full_name || user.email}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>{getRoleBadge(user.role)}</td>
                  <td>{getUserEventCount(user.id)}</td>
                  <td>
                    <span className={`admin-badge-status admin-badge-success`}>
                      active
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                        <button className="admin-action-btn admin-tooltip" data-tooltip="Edit (Soon)" disabled><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(user)} className="admin-action-btn danger admin-tooltip" data-tooltip="Delete"><Trash2 className="w-4 h-4" /></button>
                        <button className={`admin-action-btn admin-tooltip danger`} data-tooltip="Ban User">
                           <XCircle className="w-4 h-4"/>
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
            <p className="admin-empty-description">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>

      {showDeleteModal && selectedUser && (
         <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h3 className="admin-modal-title">Delete Member</h3>
              <button onClick={() => setShowDeleteModal(false)} className="admin-modal-close"><X className="w-5 h-5" /></button>
            </div>
            <div className="admin-modal-body text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-red-600"/>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Are you sure?</h4>
                <p className="text-gray-600 mb-6">This will permanently delete "{selectedUser.name || selectedUser.full_name}" and all associated data. This action cannot be undone.</p>
            </div>
            <div className="admin-modal-footer">
              <button onClick={() => setShowDeleteModal(false)} className="admin-btn admin-btn-secondary">Cancel</button>
              <button onClick={confirmDelete} disabled={isLoading} className="admin-btn admin-btn-danger">
                {isLoading ? 'Deleting...' : 'Delete Member'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberManagement;