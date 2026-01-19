import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { groupService } from '../services';
import { authStorage } from '../utils/authStorage';
import type { User } from '../types';

const CreateGroupPage = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [userName, setUserName] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    authStorage.clearAuth();
    navigate('/', { replace: true });
  };

  useEffect(() => {
    // Check authentication status on mount and fetch available users
    const token = authStorage.getToken();
    const userId = authStorage.getUserId();
    
    if (!token || !userId) {
      navigate('/', { replace: true });
      return;
    }

    setUserName(authStorage.getUserName());

    // Fetch available users for group members
    const fetchUsers = async () => {
      try {
        setUsersLoading(true);
        const configData = await groupService.getGroupConfiguration(userId);
        
        // Filter out the current user from the members list
        const filteredUsers = configData.allUsers.filter(user => user.userId !== userId);
        setUsers(filteredUsers);
      } catch (err: any) {
        setError('Failed to load users. Please try again.');
      } finally {
        setUsersLoading(false);
      }
    };

    fetchUsers();
  }, [navigate]);

  const toggleMember = (userId: string) => {
    setSelectedMemberIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    // Validation
    if (name.trim().length < 4) {
      setError('Group name must be at least 4 characters');
      return;
    }

    if (description.trim().length < 4) {
      setError('Description must be at least 4 characters');
      return;
    }

    if (selectedMemberIds.length === 0) {
      setError('Please select at least one member');
      return;
    }

    setIsLoading(true);

    try {
      const userId = authStorage.getUserId();
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const response = await groupService.createGroup({
        createdBy: userId,
        name: name.trim(),
        description: description.trim(),
        memberUserIds: selectedMemberIds,
      });

      // Redirect to add expense page after successful group creation
      navigate('/create-expense');
    } catch (err: any) {
      setError(err.message || err.response?.data?.message || 'Failed to create group. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {userName && (
        <p className="text-lg text-gray-600 text-center mb-4">Hi {userName}</p>
      )}
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Create Expense Group</h1>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/create-category')}
                className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition"
              >
                + Add Category
              </button>
              <button
                onClick={() => navigate('/create-group')}
                className="bg-orange-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition"
              >
                + Add Group
              </button>
              <button
                onClick={() => navigate('/create-expense')}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition"
              >
                + Add Expense
              </button>
              <button
                onClick={() => navigate('/expenses')}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition"
              >
                View Past Expenses
              </button>
              <button
                onClick={() => navigate('/summary')}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
              >
                View Summary
              </button>
              <button
                onClick={handleLogout}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition"
              >
                Logout
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-[200px_1fr] gap-4 items-start">
              <label htmlFor="name" className="text-sm font-medium text-gray-700 pt-2">
                Group Name <span className="text-red-500">*</span>
              </label>
              <div>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  minLength={4}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-gray-900 bg-white"
                  placeholder="Enter group name (minimum 4 characters)"
                />
                <p className="text-sm text-gray-500 mt-1 text-left pl-1">
                  Minimum 4 characters required
                </p>
              </div>
            </div>

            <div className="grid grid-cols-[200px_1fr] gap-4 items-start">
              <label htmlFor="description" className="text-sm font-medium text-gray-700 pt-2">
                Description <span className="text-red-500">*</span>
              </label>
              <div>
                <input
                  type="text"
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  minLength={4}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-gray-900 bg-white"
                  placeholder="Enter group description (minimum 4 characters)"
                />
                <p className="text-sm text-gray-500 mt-1 text-left pl-1">
                  Minimum 4 characters required
                </p>
              </div>
            </div>

            <div className="grid grid-cols-[200px_1fr] gap-4 items-start">
              <label className="text-sm font-medium text-gray-700 pt-2">
                Members <span className="text-red-500">*</span>
              </label>
              <div>
                {usersLoading ? (
                  <p className="text-gray-500">Loading users...</p>
                ) : users.length === 0 ? (
                  <p className="text-gray-500">No users available</p>
                ) : (
                  <>
                    <div className="flex flex-wrap gap-2">
                      {users.map((user) => (
                        <button
                          key={user.userId}
                          type="button"
                          onClick={() => toggleMember(user.userId)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                            selectedMemberIds.includes(user.userId)
                              ? 'bg-purple-600 text-white'
                              : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                          }`}
                        >
                          {user.name}
                        </button>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500 mt-1 text-left pl-1">
                      Click on member names to select. You can select multiple members.
                    </p>
                  </>
                )}
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isLoading || usersLoading}
                className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating...' : 'Create Group'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/create-expense')}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupPage;
