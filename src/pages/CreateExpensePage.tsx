import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { expenseService, userSettingsService } from '../services';
import { authStorage } from '../utils/authStorage';
import type { ExpenseCategory, ExpenseCategoryItem } from '../types';

// Map month number to month name
const MONTH_NAMES: { [key: number]: string } = {
  1: 'January',
  2: 'February',
  3: 'March',
  4: 'April',
  5: 'May',
  6: 'June',
  7: 'July',
  8: 'August',
  9: 'September',
  10: 'October',
  11: 'November',
  12: 'December'
};

const CreateExpensePage = () => {
  const [categoryId, setCategoryId] = useState<string>('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTagId, setSelectedTagId] = useState<string>('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [expenseCategories, setExpenseCategories] = useState<ExpenseCategoryItem[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    authStorage.clearAuth();
    navigate('/', { replace: true });
  };

  useEffect(() => {
    // Check authentication status on mount and fetch expense categories
    const token = authStorage.getToken();
    const userId = authStorage.getUserId();
    console.log('CreateExpensePage mounted - Auth check:');
    console.log('  Token:', token);
    console.log('  UserId:', userId);
    
    if (!token || !userId) {
      console.error('Not authenticated on CreateExpensePage mount, redirecting to login');
      navigate('/', { replace: true });
      return;
    }

    // Fetch expense categories
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        console.log('Fetching expense categories for userId:', userId);
        const settings = await userSettingsService.getUserSettings(userId);
        console.log('Received expense categories:', settings.expenseCategories);
        
        setExpenseCategories(settings.expenseCategories);
        
        // Set default category to first one if available
        if (settings.expenseCategories.length > 0) {
          setCategoryId(settings.expenseCategories[0].id);
        }
      } catch (err: any) {
        console.error('Error fetching expense categories:', err);
        setError('Failed to load expense categories. Please try again.');
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, [navigate]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    console.log('Form submitted');

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

    setIsLoading(true);

    try {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-11, API expects 1-12
      const currentYear = currentDate.getFullYear();

      console.log('Creating expense with data:', {
        categoryId,
        amount: roundedAmount,
        description: description.trim() || undefined,
        tagId: selectedTagId || undefined,
        month: currentMonth,
        year: currentYear,
      });

      await expenseService.createExpense({
        categoryId,
        amount: roundedAmount,
        description: description.trim() || undefined,
        tagId: selectedTagId || undefined,
        month: currentMonth,
        year: currentYear,
      });

      console.log('Expense created successfully');
      // Redirect to expense list page
      navigate('/expenses');
    } catch (err: any) {
      console.error('Error creating expense:', err);
      setError(err.message || err.response?.data?.message || 'Failed to create expense. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
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
              <label htmlFor="category" className="text-sm font-medium text-gray-700 pt-2">
                Expense Category
              </label>
              <div>
                <select
                  id="category"
                  value={categoryId}
                  onChange={(e) => {
                    console.log('Category changed to:', e.target.value);
                    setCategoryId(e.target.value);
                    setSelectedTagId(''); // Reset tag selection when category changes
                  }}
                  disabled={categoriesLoading || expenseCategories.length === 0}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 bg-white capitalize"
                >
                  {categoriesLoading ? (
                    <option value="">Loading categories...</option>
                  ) : expenseCategories.length === 0 ? (
                    <option value="">No categories available</option>
                  ) : (
                    expenseCategories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.category}
                      </option>
                    ))
                  )}
                </select>
                {!categoriesLoading && expenseCategories.length > 0 && categoryId && (
                  <p className="text-sm text-gray-500 mt-1 text-left pl-1 capitalize">
                    {expenseCategories.find(c => c.id === categoryId)?.description}
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
            {categoryId && expenseCategories.find(c => c.id === categoryId)?.tags && expenseCategories.find(c => c.id === categoryId)!.tags.length > 0 && (
              <div className="grid grid-cols-[200px_1fr] gap-4 items-start">
                <label className="text-sm font-medium text-gray-700 pt-2">
                  Select Tag (Optional)
                </label>
                <div>
                  <div className="flex flex-wrap gap-2">
                    {expenseCategories.find(c => c.id === categoryId)!.tags.map((tag) => (
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
