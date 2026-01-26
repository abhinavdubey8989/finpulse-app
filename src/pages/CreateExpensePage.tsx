import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { expenseService, userSettingsService, groupService } from '../services';
import { authStorage } from '../utils/authStorage';
import type { ExpenseCategoryItem, GroupAndCategory } from '../types';

// Map month number to month name
// const MONTH_NAMES: { [key: number]: string } = {
//   1: 'January',
//   2: 'February',
//   3: 'March',
//   4: 'April',
//   5: 'May',
//   6: 'June',
//   7: 'July',
//   8: 'August',
//   9: 'September',
//   10: 'October',
//   11: 'November',
//   12: 'December'
// };

const CreateExpensePage = () => {
  const [selectedGroup, setSelectedGroup] = useState<string>('personal');
  const [categoryId, setCategoryId] = useState<string>('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTagId, setSelectedTagId] = useState<string>('');
  const [splitType, setSplitType] = useState<'EXACT' | 'PERCENT'>('EXACT');
  const [splits, setSplits] = useState<{ [userId: string]: string }>({});
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [expenseCategories, setExpenseCategories] = useState<ExpenseCategoryItem[]>([]);
  const [groupList, setGroupList] = useState<GroupAndCategory[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [userName, setUserName] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    authStorage.clearAuth();
    navigate('/', { replace: true });
  };

  useEffect(() => {
    // Check authentication status on mount and fetch expense categories
    const token = authStorage.getToken();
    const userId = authStorage.getUserId();
    
    if (!token || !userId) {
      navigate('/', { replace: true });
      return;
    }

    setUserName(authStorage.getUserName());

    // Fetch group configuration and expense categories
    const fetchData = async () => {
      try {
        setCategoriesLoading(true);
        
        // Fetch group configuration (includes groups and personal categories)
        const configData = await groupService.getGroupConfiguration(userId);
        
        setGroupList(configData.groupAndCategoryList);
        
        // Fetch personal expense categories
        const settings = await userSettingsService.getUserSettings(userId);
        
        setExpenseCategories(settings.expenseCategories);
        
        // Set default category to first one if available
        if (settings.expenseCategories.length > 0) {
          setCategoryId(settings.expenseCategories[0].id);
        }
      } catch (err: any) {
        setError('Failed to load data. Please try again.');
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // Get current group and its members
  const getCurrentGroup = (): GroupAndCategory | null => {
    if (selectedGroup === 'personal') return null;
    return groupList.find(g => g.groupId === selectedGroup) || null;
  };

  // Get available categories based on selected group
  const getAvailableCategories = (): ExpenseCategoryItem[] => {
    if (selectedGroup === 'personal') {
      return expenseCategories;
    }
    const group = getCurrentGroup();
    return group ? group.expenseCategories : [];
  };

  // Handle group selection change
  const handleGroupChange = (groupId: string) => {
    setSelectedGroup(groupId);
    setCategoryId('');
    setSelectedTagId('');
    setSplits({});
    
    // Initialize splits for group members
    if (groupId !== 'personal') {
      const group = groupList.find(g => g.groupId === groupId);
      if (group) {
        const initialSplits: { [userId: string]: string } = {};
        group.members.forEach(member => {
          initialSplits[member.userId] = '';
        });
        setSplits(initialSplits);
        
        // Set first category if available
        if (group.expenseCategories.length > 0) {
          setCategoryId(group.expenseCategories[0].id);
        }
      }
    } else {
      // Set first personal category if available
      if (expenseCategories.length > 0) {
        setCategoryId(expenseCategories[0].id);
      }
    }
  };

  // Handle split value change
  const handleSplitChange = (userId: string, value: string) => {
    setSplits(prev => ({
      ...prev,
      [userId]: value
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    // Validation: User must select a tag or enter description (or both)
    if (!selectedTagId && (!description || description.trim().length === 0)) {
      setError('Please select a tag or enter a description (or both)');
      return;
    }

    if (description && (description.length < 3 || description.length > 40)) {
      setError('Description must be between 3 and 40 characters');
      return;
    }

    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    // Round up to next integer
    const roundedAmount = Math.ceil(amountValue);

    // Additional validation for group expenses
    if (selectedGroup !== 'personal') {
      const group = getCurrentGroup();
      if (!group) {
        setError('Selected group not found');
        return;
      }

      // Validate splits
      const splitValues: { [userId: string]: number } = {};
      let totalSplit = 0;
      let hasInvalidSplit = false;

      for (const [userId, value] of Object.entries(splits)) {
        const numValue = parseFloat(value);
        if (isNaN(numValue) || numValue < 0) {
          hasInvalidSplit = true;
          break;
        }
        splitValues[userId] = splitType === 'EXACT' ? Math.ceil(numValue) : numValue;
        totalSplit += splitValues[userId];
      }

      if (hasInvalidSplit) {
        setError('Please enter valid split values for all members');
        return;
      }

      if (splitType === 'EXACT' && totalSplit !== roundedAmount) {
        setError(`Total split amount (${totalSplit}) must equal the expense amount (${roundedAmount})`);
        return;
      }

      if (splitType === 'PERCENT' && totalSplit !== 100) {
        setError(`Total split percentage (${totalSplit}%) must equal 100%`);
        return;
      }
    }

    setIsLoading(true);

    try {
      const userId = authStorage.getUserId();
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1;
      const currentYear = currentDate.getFullYear();

      if (selectedGroup === 'personal') {
        // Create personal expense
        await expenseService.createExpense({
          categoryId,
          amount: roundedAmount,
          description: description.trim() || undefined,
          tagId: selectedTagId || undefined,
          month: currentMonth,
          year: currentYear,
        });
      } else {
        // Create group expense
        const splitValues: { [userId: string]: number } = {};
        for (const [userId, value] of Object.entries(splits)) {
          splitValues[userId] = splitType === 'EXACT' ? Math.ceil(parseFloat(value)) : parseFloat(value);
        }

        await groupService.createGroupExpense(selectedGroup, {
          paidByUserId: userId,
          categoryId,
          year: currentYear,
          month: currentMonth,
          amount: roundedAmount,
          description: description.trim() || undefined,
          tagId: selectedTagId || undefined,
          splitType,
          splits: splitValues,
        });
      }

      // Redirect to expense list page
      navigate('/expenses');
    } catch (err: any) {
      setError(err.message || err.response?.data?.message || 'Failed to create expense. Please try again.');
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
            <h1 className="text-3xl font-bold text-gray-800">Add New Expense</h1>
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
              <label htmlFor="group" className="text-sm font-medium text-gray-700 pt-2">
                Select Group
              </label>
              <div>
                <select
                  id="group"
                  value={selectedGroup}
                  onChange={(e) => handleGroupChange(e.target.value)}
                  disabled={categoriesLoading}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 bg-white capitalize"
                >
                  <option value="personal">Personal expense</option>
                  {groupList.map((group) => (
                    <option key={group.groupId} value={group.groupId}>
                      {group.groupName}
                    </option>
                  ))}
                </select>
                {selectedGroup !== 'personal' && (
                  <p className="text-sm text-gray-500 mt-1 text-left pl-1">
                    {getCurrentGroup()?.groupDescription}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-[200px_1fr] gap-4 items-start">
              <label htmlFor="category" className="text-sm font-medium text-gray-700 pt-2">
                Expense Category
              </label>
              <div>
                <select
                  id="category"
                  value={categoryId}
                  onChange={(e) => {
                    setCategoryId(e.target.value);
                    setSelectedTagId(''); // Reset tag selection when category changes
                  }}
                  disabled={categoriesLoading || getAvailableCategories().length === 0}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 bg-white capitalize"
                >
                  {categoriesLoading ? (
                    <option value="">Loading categories...</option>
                  ) : getAvailableCategories().length === 0 ? (
                    <option value="">No categories available</option>
                  ) : (
                    getAvailableCategories().map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.category}
                      </option>
                    ))
                  )}
                </select>
                {!categoriesLoading && getAvailableCategories().length > 0 && categoryId && (
                  <p className="text-sm text-gray-500 mt-1 text-left pl-1 capitalize">
                    {getAvailableCategories().find(c => c.id === categoryId)?.description}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-[200px_1fr] gap-4 items-start">
              <label htmlFor="amount" className="text-sm font-medium text-gray-700 pt-2">
                Amount (₹)
              </label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                step="0.01"
                min="0.01"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-gray-900 bg-white"
                placeholder="Enter amount"
              />
            </div>

            {/* Tags Selection */}
            {categoryId && getAvailableCategories().find(c => c.id === categoryId)?.tags && getAvailableCategories().find(c => c.id === categoryId)!.tags.length > 0 && (
              <div className="grid grid-cols-[200px_1fr] gap-4 items-start">
                <label className="text-sm font-medium text-gray-700 pt-2">
                  Select Tag (Optional)
                </label>
                <div>
                  <div className="flex flex-wrap gap-2">
                    {getAvailableCategories().find(c => c.id === categoryId)!.tags.map((tag) => (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => setSelectedTagId(selectedTagId === tag.id ? '' : tag.id)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                          selectedTagId === tag.id
                            ? 'bg-purple-600 text-white'
                            : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                        }`}
                      >
                        {tag.name}
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-1 text-left pl-1">
                    Click to select a tag. You can select only one tag per expense.
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-[200px_1fr] gap-4 items-start">
              <label htmlFor="description" className="text-sm font-medium text-gray-700 pt-2">
                Description {!selectedTagId && <span className="text-red-500">*</span>}
              </label>
              <div>
                <input
                  type="text"
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  minLength={3}
                  maxLength={40}
                  required={!selectedTagId}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-gray-900 bg-white"
                  placeholder={selectedTagId ? "Enter description (optional)" : "Enter description (3-40 characters)"}
                />
                <p className="text-sm text-gray-500 mt-1 text-left pl-1">
                  {description.length}/40 characters {selectedTagId && '(Optional when tag is selected)'}
                </p>
              </div>
            </div>

            {/* Split Form for Group Expenses */}
            {selectedGroup !== 'personal' && getCurrentGroup() && (
              <>
                <div className="grid grid-cols-[200px_1fr] gap-4 items-start">
                  <label htmlFor="splitType" className="text-sm font-medium text-gray-700 pt-2">
                    Split Type
                  </label>
                  <div>
                    <select
                      id="splitType"
                      value={splitType}
                      onChange={(e) => setSplitType(e.target.value as 'EXACT' | 'PERCENT')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-gray-900 bg-white"
                    >
                      <option value="EXACT">Exact (Amount)</option>
                      <option value="PERCENT">Percent (%)</option>
                    </select>
                    <p className="text-sm text-gray-500 mt-1 text-left pl-1">
                      {splitType === 'EXACT' 
                        ? 'Enter the exact amount each member owes' 
                        : 'Enter the percentage each member owes (must total 100%)'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-[200px_1fr] gap-4 items-start">
                  <label className="text-sm font-medium text-gray-700 pt-2">
                    Split by Member
                  </label>
                  <div className="space-y-3">
                    {getCurrentGroup()!.members.map((member) => (
                      <div key={member.userId} className="flex items-center gap-3">
                        <label className="text-sm font-medium text-gray-700 w-40">
                          {member.name}
                        </label>
                        <input
                          type="number"
                          value={splits[member.userId] || ''}
                          onChange={(e) => handleSplitChange(member.userId, e.target.value)}
                          step={splitType === 'EXACT' ? '0.01' : '0.1'}
                          min="0"
                          required
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-gray-900 bg-white"
                          placeholder={splitType === 'EXACT' ? 'Amount' : 'Percentage'}
                        />
                        <span className="text-sm text-gray-600 w-8">
                          {splitType === 'EXACT' ? '₹' : '%'}
                        </span>
                      </div>
                    ))}
                    <p className="text-sm text-gray-500 mt-2 text-left pl-1">
                      {splitType === 'EXACT' 
                        ? `Total must equal ${amount ? Math.ceil(parseFloat(amount)) : 0} ₹` 
                        : 'Total must equal 100%'}
                    </p>
                  </div>
                </div>
              </>
            )}

            {error && (
              <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating...' : 'Create Expense'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/expenses')}
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

export default CreateExpensePage;
