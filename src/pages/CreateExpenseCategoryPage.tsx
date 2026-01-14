import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { userSettingsService } from '../services';
import { authStorage } from '../utils/authStorage';

const CreateExpenseCategoryPage = () => {
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [monthlyUpperLimit, setMonthlyUpperLimit] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    authStorage.clearAuth();
    navigate('/', { replace: true });
  };

  useEffect(() => {
    // Check authentication status on mount
    const token = authStorage.getToken();
    const userId = authStorage.getUserId();
    console.log('CreateExpenseCategoryPage mounted - Auth check:');
    console.log('  Token:', token);
    console.log('  UserId:', userId);
    
    if (!token || !userId) {
      console.error('Not authenticated on CreateExpenseCategoryPage mount, redirecting to login');
      navigate('/', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    console.log('Form submitted');

    // Validation
    if (category.length < 4) {
      setError('Category must be at least 4 characters');
      return;
    }

    if (description.length < 4) {
      setError('Description must be at least 4 characters');
      return;
    }

    const limitValue = parseInt(monthlyUpperLimit, 10);
    if (isNaN(limitValue) || limitValue <= 0 || !Number.isInteger(limitValue)) {
      setError('Monthly upper limit must be a positive integer');
      return;
    }

    setIsLoading(true);

    try {
      const userId = authStorage.getUserId();
      if (!userId) {
        throw new Error('User not authenticated');
      }

      console.log('Creating expense category with data:', {
        category,
        description,
        monthlyUpperLimit: limitValue,
      });

      await userSettingsService.createExpenseCategory(userId, {
        category,
        description,
        monthlyUpperLimit: limitValue,
      });

      console.log('Expense category created successfully');
      // Redirect to create expense page
      navigate('/create-expense');
    } catch (err: any) {
      console.error('Error creating expense category:', err);
      setError(err.message || err.response?.data?.message || 'Failed to create expense category. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Add Expense Category</h1>
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
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category Name
              </label>
              <input
                type="text"
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                minLength={4}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-gray-900 bg-white"
                placeholder="Enter category name (minimum 4 characters)"
              />
              <p className="text-sm text-gray-500 mt-1">
                {category.length} characters
              </p>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <input
                type="text"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                minLength={4}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-gray-900 bg-white"
                placeholder="Enter description (minimum 4 characters)"
              />
              <p className="text-sm text-gray-500 mt-1">
                {description.length} characters
              </p>
            </div>

            <div>
              <label htmlFor="monthlyUpperLimit" className="block text-sm font-medium text-gray-700 mb-2">
                Monthly Upper Limit (₹)
              </label>
              <input
                type="number"
                id="monthlyUpperLimit"
                value={monthlyUpperLimit}
                onChange={(e) => setMonthlyUpperLimit(e.target.value)}
                step="1"
                min="1"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-gray-900 bg-white"
                placeholder="Enter monthly upper limit (whole number only)"
              />
              <p className="text-sm text-gray-500 mt-1">
                Enter a positive integer only (no decimals)
              </p>
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
                {isLoading ? 'Creating...' : 'Create Category'}
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

export default CreateExpenseCategoryPage;
