import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Eye,
  Edit,
  Trash2,
  UserPlus,
  AlertTriangle
} from 'lucide-react';
import { AppUser, Event, db } from '../../lib/supabase';

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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
          <div className="p-6 border-b flex justify-between items-center"><h3 className="text-xl font-bold">Member Details</h3><button onClick={() => setShowUserModal(false)} className="text-gray-400 text-2xl hover:text-gray-600">&times;</button></div>
          <div className="p-6 space-y-2">
            <p><strong>Username:</strong> {selectedUser.username}</p>
            <p><strong>Email:</strong> {selectedUser.email}</p>
            <p><strong>Joined:</strong> {new Date(selectedUser.created_at).toLocaleDateString()}</p>
            <p><strong>Events Created:</strong> {getUserEventCount(selectedUser.id)}</p>
            <div className="pt-4">
              <button onClick={() => setShowUserModal(false)} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Close</button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  const DeleteUserModal = () => {
    if (!selectedUser) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center"><AlertTriangle className="w-5 h-5 text-red-600"/></div>
                <h3 className="text-lg font-semibold">Delete Member</h3>
            </div>
            <p className="text-gray-600 mb-6">Are you sure you want to delete "{selectedUser.username}"? This will also remove all events they created. This action is permanent.</p>
            <div className="flex space-x-4">
                <button onClick={() => setShowDeleteModal(false)} className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
                <button onClick={handleConfirmDelete} disabled={isLoading} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg disabled:opacity-50">{isLoading ? 'Deleting...' : 'Delete'}</button>
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
          <div className="p-6 border-b"><h3 className="text-xl font-bold">Add New Member</h3></div>
          <form onSubmit={handleAddUser} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input type="text" name="username" onChange={handleInputChange} className="w-full p-2 border rounded-lg" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" name="email" onChange={handleInputChange} className="w-full p-2 border rounded-lg" required />
            </div>
            <div className="flex space-x-4 pt-4">
              <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2 border rounded-lg">Cancel</button>
              <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50">{isSubmitting ? 'Adding...' : 'Add Member'}</button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
            <h2 className="text-2xl font-bold text-gray-900">Member Management</h2>
            <p className="text-gray-600 mt-1">Manage registered users</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          <UserPlus className="w-4 h-4" />
          <span>Add Member</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        {/* Search and Filter UI */}
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Member</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Events Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{user.username}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getUserEventCount(user.id)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(user.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                    <button onClick={() => handleViewUser(user)} className="text-indigo-600 hover:text-indigo-900" title="View"><Eye className="w-4 h-4" /></button>
                    <button className="text-gray-400 cursor-not-allowed" title="Edit (Coming Soon)"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDeleteUser(user)} className="text-red-600 hover:text-red-900" title="Delete"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {showUserModal && <ViewUserModal />}
      {showDeleteModal && <DeleteUserModal />}
      {showAddModal && <AddMemberModal />}
    </div>
  );
};

export default MemberManagement;
