import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  UserPlus
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
  const [showAddModal, setShowAddModal] = useState(false); // State for Add Member modal

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());

    if (selectedFilter === 'all') return matchesSearch;

    const userEvents = events.filter(event => event.user_id === user.id);
    if (selectedFilter === 'active') return matchesSearch && userEvents.length > 0;

    return matchesSearch && userEvents.some(event => event.event_type === selectedFilter);
  });

  const getUserEventCount = (userId: string) => {
    return events.filter(event => event.user_id === userId).length;
  };

  const getUserEventTypes = (userId: string) => {
    const userEvents = events.filter(event => event.user_id === userId);
    const types = [...new Set(userEvents.map(event => event.event_type))];
    return types;
  };

  const handleViewUser = (user: AppUser) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  // Add Member Modal Component
  const AddMemberModal = () => {
    const [newUserData, setNewUserData] = useState({ username: '', email: '' });
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setNewUserData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddUser = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      try {
        const { error } = await db.createUser(newUserData);
        if (error) {
          alert('Error creating user: ' + error.message);
        } else {
          alert('Member added successfully!');
          setShowAddModal(false);
          onRefresh(); // Refresh the data to show the new user
        }
      } catch (err) {
        alert('An unexpected error occurred.');
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-900">Add New Member</h3>
          </div>
          <form onSubmit={handleAddUser} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
              <input
                type="text"
                name="username"
                value={newUserData.username}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={newUserData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div className="flex space-x-4 pt-4">
              <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                Cancel
              </button>
              <button type="submit" disabled={isLoading} className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50">
                {isLoading ? 'Adding...' : 'Add Member'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  // Other modals (View, Edit, Delete) remain the same...
  // (Assuming UserModal code is still here from previous steps)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Member Management</h2>
          <p className="text-gray-600 mt-1">Manage registered users and their events</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)} // This button now opens the modal
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Member</span>
        </button>
      </div>

      {/* Search and Filter */}
      {/* ... (rest of the component remains the same) ... */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search members by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Members</option>
              <option value="active">Active Members</option>
              <option value="conference">Conference Organizers</option>
              <option value="workshop">Workshop Organizers</option>
              <option value="seminar">Seminar Organizers</option>
              <option value="networking">Networking Organizers</option>
            </select>
          </div>
        </div>
      </div>
       {/* Members Table */}
       <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Member
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event Types
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Events Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.username}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {getUserEventTypes(user.id).map((type) => (
                        <span 
                          key={type}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 capitalize"
                        >
                          {type}
                        </span>
                      ))}
                      {getUserEventTypes(user.id).length === 0 && (
                        <span className="text-sm text-gray-400">No events</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{getUserEventCount(user.id)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(user.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleViewUser(user)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="text-gray-600 hover:text-gray-900 mr-3">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
       </div>

      {showAddModal && <AddMemberModal />}
      {/* ... other modals ... */}
    </div>
  );
};

export default MemberManagement;
