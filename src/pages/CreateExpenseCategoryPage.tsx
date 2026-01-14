import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { userSettingsService } from '../services';
import { authStorage } from '../utils/authStorage';

const CreateExpenseCategoryPage = () => {
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [monthlyUpperLimit, setMonthlyUpperLimit] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    authStorage.clearAuth();
    navigate('/', { replace: true });
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmedTag = tagInput.trim();
      if (trimmedTag.length >= 3 && !tags.includes(trimmedTag)) {
        setTags([...tags, trimmedTag]);
        setTagInput('');
      } else if (trimmedTag.length < 3) {
        setError('Tag must be at least 3 characters');
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
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
        addTags: tags.length > 0 ? tags : undefined,
      });

      const response = await userSettingsService.createExpenseCategory(userId, {
        category,
        description,
        monthlyUpperLimit: limitValue,
        ...(tags.length > 0 && { addTags: tags }),
      });

      console.log('Expense category created successfully');
      
      // Show toast if some tags failed to add
      if (response.failedAddTags && response.failedAddTags.length > 0) {
        const failedTagsList = response.failedAddTags.join(', ');
        setToast(`Failed to add tags: ${failedTagsList}`);
        setTimeout(() => setToast(''), 5000);
      }
      
      // Redirect to create expense page after a short delay if there are failed tags
      setTimeout(() => navigate('/create-expense'), response.failedAddTags && response.failedAddTags.length > 0 ? 2000 : 0);
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

            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                Tags (Optional)
              </label>
              <div className="w-full px-4 py-2 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-transparent bg-white min-h-[42px] flex flex-wrap gap-2 items-center">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-purple-900 focus:outline-none"
                      aria-label={`Remove ${tag}`}
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  id="tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagInputKeyDown}
                  className="flex-1 min-w-[120px] outline-none text-gray-900 bg-transparent"
                  placeholder={tags.length === 0 ? "Enter tag and press Enter (min 3 chars)" : "Add another tag..."}
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Press Enter to add a tag (minimum 3 characters). Tags are sub-categories of the expense category.
              </p>
            </div>

            {toast && (
              <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 px-4 py-3 rounded-lg text-sm">
                {toast}
              </div>
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
