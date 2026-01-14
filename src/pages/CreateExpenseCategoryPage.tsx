import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { userSettingsService } from '../services';
import { authStorage } from '../utils/authStorage';
import type { ExpenseCategoryItem, UpdateExpenseCategoryRequest } from '../types';

const CreateExpenseCategoryPage = () => {
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [monthlyUpperLimit, setMonthlyUpperLimit] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [existingCategories, setExistingCategories] = useState<ExpenseCategoryItem[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ExpenseCategoryItem | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
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
    } else {
      // Fetch existing categories
      fetchExistingCategories();
    }
  }, [navigate]);

  const fetchExistingCategories = async () => {
    setIsLoadingCategories(true);
    try {
      const userId = authStorage.getUserId();
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const settingsData = await userSettingsService.getUserSettings(userId);
      setExistingCategories(settingsData.expenseCategories || []);
    } catch (err: any) {
      console.error('Error fetching categories:', err);
      setError(err.message || 'Failed to load categories');
      setTimeout(() => setError(''), 3000);
    } finally {
      setIsLoadingCategories(false);
    }
  };

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

      // Clear form
      setCategory('');
      setDescription('');
      setMonthlyUpperLimit('');
      setTags([]);
      
      // Refresh categories list
      fetchExistingCategories();
      
      setToast('Category created successfully!');
      setTimeout(() => setToast(''), 3000);
    } catch (err: any) {
      console.error('Error creating expense category:', err);
      setError(err.message || err.response?.data?.message || 'Failed to create expense category. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditCategory = (categoryItem: ExpenseCategoryItem) => {
    setEditingCategory(categoryItem);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingCategory(null);
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
            <div className="grid grid-cols-[200px_1fr] gap-4 items-start">
              <label htmlFor="category" className="text-sm font-medium text-gray-700 pt-2">
                Category Name
              </label>
              <div>
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
                {/* <p className="text-sm text-gray-500 mt-1">
                  {category.length} characters
                </p> */}
              </div>
            </div>

            <div className="grid grid-cols-[200px_1fr] gap-4 items-start">
              <label htmlFor="description" className="text-sm font-medium text-gray-700 pt-2">
                Description
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
                  placeholder="Enter description (minimum 4 characters)"
                />
                {/* <p className="text-sm text-gray-500 mt-1">
                  {description.length} characters
                </p> */}
              </div>
            </div>

            <div className="grid grid-cols-[200px_1fr] gap-4 items-start">
              <label htmlFor="monthlyUpperLimit" className="text-sm font-medium text-gray-700 pt-2">
                Monthly Upper Limit (₹)
              </label>
              <div>
                <input
                  type="number"
                  id="monthlyUpperLimit"
                  value={monthlyUpperLimit}
                  onChange={(e) => setMonthlyUpperLimit(e.target.value)}
                  step="1"
                  min="1"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-gray-900 bg-white"
                  placeholder="Maximum allowed spend in a month for this category"
                />
                {/* <p className="text-sm text-gray-500 mt-1">
                  Enter a positive integer only (no decimals)
                </p> */}
              </div>
            </div>

            <div className="grid grid-cols-[200px_1fr] gap-4 items-start">
              <label htmlFor="tags" className="text-sm font-medium text-gray-700 pt-2">
                Tags (Optional)
              </label>
              <div>
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
                {/* <p className="text-sm text-gray-500 mt-1">
                  Press Enter to add a tag (minimum 3 characters). Tags are sub-categories of the expense category.
                </p> */}
              </div>
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

        {/* Existing Categories */}
        {existingCategories.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 mt-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Existing Categories</h2>
            {isLoadingCategories ? (
              <div className="text-center text-gray-600">Loading categories...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {existingCategories.map((cat) => (
                  <div
                    key={cat.id}
                    className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:shadow-md transition-shadow relative"
                  >
                    {/* Three dots menu */}
                    <button
                      onClick={() => handleEditCategory(cat)}
                      className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 focus:outline-none"
                      aria-label="Edit category"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </button>

                    <h3 className="text-base font-semibold text-gray-800 mb-1 pr-6">{cat.category}</h3>
                    <p className="text-xs text-gray-600 mb-1">{cat.description}</p>
                    <p className="text-xs font-medium text-purple-600 mb-2">
                      Limit: ₹{cat.monthlyUpperLimit}
                    </p>
                    {cat.tags && cat.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {cat.tags.map((tag) => (
                          <span
                            key={tag.id}
                            className="inline-block bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs font-medium"
                          >
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && editingCategory && (
          <EditCategoryModal
            category={editingCategory}
            onClose={handleCloseEditModal}
            onSuccess={() => {
              fetchExistingCategories();
              handleCloseEditModal();
              setToast('Category updated successfully!');
              setTimeout(() => setToast(''), 3000);
            }}
          />
        )}
      </div>
    </div>
  );
};

// Edit Category Modal Component
interface EditCategoryModalProps {
  category: ExpenseCategoryItem;
  onClose: () => void;
  onSuccess: () => void;
}

const EditCategoryModal = ({ category, onClose, onSuccess }: EditCategoryModalProps) => {
  const [categoryName, setCategoryName] = useState(category.category);
  const [description, setDescription] = useState(category.description);
  const [monthlyUpperLimit, setMonthlyUpperLimit] = useState(String(category.monthlyUpperLimit));
  const [newTags, setNewTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState('');
  const [existingTags, setExistingTags] = useState(category.tags.map(t => ({ ...t, isEditing: false, newName: t.name })));
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleNewTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmedTag = newTagInput.trim();
      if (trimmedTag.length >= 3 && !newTags.includes(trimmedTag)) {
        setNewTags([...newTags, trimmedTag]);
        setNewTagInput('');
      } else if (trimmedTag.length < 3) {
        setError('Tag must be at least 3 characters');
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  const removeNewTag = (tagToRemove: string) => {
    setNewTags(newTags.filter(tag => tag !== tagToRemove));
  };

  const toggleEditTag = (tagId: string) => {
    setExistingTags(existingTags.map(tag =>
      tag.id === tagId ? { ...tag, isEditing: !tag.isEditing } : tag
    ));
  };

  const updateTagName = (tagId: string, newName: string) => {
    setExistingTags(existingTags.map(tag =>
      tag.id === tagId ? { ...tag, newName } : tag
    ));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    // Validation
    if (categoryName.length < 4) {
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

      // Build update tags array - only include tags that were actually edited
      const updateTags = existingTags
        .filter(tag => tag.newName !== tag.name && tag.newName.trim().length >= 3)
        .map(tag => ({
          id: tag.id,
          newName: tag.newName,
        }));

      const updateData: UpdateExpenseCategoryRequest = {
        categoryName,
        description,
        monthlyUpperLimit: limitValue,
        ...(newTags.length > 0 && { addTags: newTags }),
        ...(updateTags.length > 0 && { updateTags }),
      };

      const response = await userSettingsService.updateExpenseCategory(
        userId,
        category.id,
        updateData
      );

      if (response.failedAddTags && response.failedAddTags.length > 0) {
        setError(`Failed to add tags: ${response.failedAddTags.join(', ')}`);
        setTimeout(() => setError(''), 5000);
      }

      if (response.failedUpdateTags && response.failedUpdateTags.length > 0) {
        setError(`Failed to update tags: ${response.failedUpdateTags.join(', ')}`);
        setTimeout(() => setError(''), 5000);
      }

      onSuccess();
    } catch (err: any) {
      console.error('Error updating expense category:', err);
      setError(err.message || err.response?.data?.message || 'Failed to update expense category. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Edit Category</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 focus:outline-none"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="edit-category" className="block text-sm font-medium text-gray-700 mb-2">
                Category Name
              </label>
              <input
                type="text"
                id="edit-category"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                minLength={4}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-gray-900 bg-white"
              />
            </div>

            <div>
              <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <input
                type="text"
                id="edit-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                minLength={4}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-gray-900 bg-white"
              />
            </div>

            <div>
              <label htmlFor="edit-limit" className="block text-sm font-medium text-gray-700 mb-2">
                Monthly Upper Limit (₹)
              </label>
              <input
                type="number"
                id="edit-limit"
                value={monthlyUpperLimit}
                onChange={(e) => setMonthlyUpperLimit(e.target.value)}
                step="1"
                min="1"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-gray-900 bg-white"
              />
            </div>

            {/* Existing Tags */}
            {existingTags.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Existing Tags (click to edit)
                </label>
                <div className="flex flex-wrap gap-2">
                  {existingTags.map((tag) => (
                    <div key={tag.id}>
                      {tag.isEditing ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={tag.newName}
                            onChange={(e) => updateTagName(tag.id, e.target.value)}
                            className="px-3 py-1 border border-gray-300 rounded-full focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-sm bg-white text-gray-900"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={() => toggleEditTag(tag.id)}
                            className="text-green-600 hover:text-green-700 text-sm font-medium"
                          >
                            Done
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => toggleEditTag(tag.id)}
                          className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium hover:bg-purple-200 transition"
                        >
                          {tag.newName}
                          <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Tags */}
            <div>
              <label htmlFor="edit-new-tags" className="block text-sm font-medium text-gray-700 mb-2">
                Add New Tags
              </label>
              <div className="w-full px-4 py-2 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-transparent bg-white min-h-[42px] flex flex-wrap gap-2 items-center">
                {newTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeNewTag(tag)}
                      className="hover:text-purple-900 focus:outline-none"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  id="edit-new-tags"
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  onKeyDown={handleNewTagInputKeyDown}
                  className="flex-1 min-w-[120px] outline-none text-gray-900 bg-transparent"
                  placeholder="Enter tag and press Enter"
                />
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
                {isLoading ? 'Updating...' : 'Update Category'}
              </button>
              <button
                type="button"
                onClick={onClose}
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

