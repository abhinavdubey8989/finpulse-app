import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { expenseService, authService, userSettingsService } from '../services';
import type { Expense, ExpenseCategoryItem, UpdateExpenseRequest } from '../types';
import { authStorage } from '../utils/authStorage';

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

const ExpenseListPage = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const userId = authStorage.getUserId();
      if (!userId) {
        navigate('/');
        return;
      }

      const data = await expenseService.getExpenses(userId);
      setExpenses(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load expenses');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getSortedExpenses = () => {
    const sorted = [...expenses];
    
    switch (sortBy) {
      case 'newest':
        return sorted.sort((a, b) => 
          new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
        );
      case 'oldest':
        return sorted.sort((a, b) => 
          new Date(a.createdAt || '').getTime() - new Date(b.createdAt || '').getTime()
        );
      case 'amount-asc':
        return sorted.sort((a, b) => a.amount - b.amount);
      case 'amount-desc':
        return sorted.sort((a, b) => b.amount - a.amount);
      default:
        return sorted;
    }
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingExpense(null);
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const sortedExpenses = getSortedExpenses();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading expenses...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">My Expenses</h1>
              <p className="text-gray-600 mt-1">
                Total: <span className="font-semibold text-purple-600">₹{totalExpenses}</span>
              </p>
            </div>
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
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Sort Dropdown */}
        {expenses.length > 0 && (
          <div className="mb-4">
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="block w-64 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="amount-asc">Amount Ascending</option>
              <option value="amount-desc">Amount Descending</option>
            </select>
          </div>
        )}

        {/* Expense List */}
        {expenses.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg mb-4">No expenses yet</p>
            <button
              onClick={() => navigate('/create-expense')}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition"
            >
              Create Your First Expense
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {sortedExpenses.map((expense) => (
              <div
                key={expense.id}
                className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow relative"
              >
                {/* Three dots menu */}
                <button
                  onClick={() => handleEditExpense(expense)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  aria-label="Edit expense"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>

                <div className="flex justify-between items-start mb-2 pr-6">
                  {expense.categoryName && (
                    <span className="text-sm font-semibold text-gray-700 bg-gray-100 px-2 py-1 rounded-md capitalize">
                      {expense.categoryName}
                    </span>
                  )}
                  <span className="text-xl font-bold text-purple-600">
                    ₹{expense.amount}
                  </span>
                </div>

                {/* Tags and Description */}
                <div className="mb-2">
                  {expense.tag && (
                    <span className="inline-block bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium">
                      {expense.tag.name}
                    </span>
                  )}
                  {expense.description && (
                    <p className="text-gray-800 text-sm mt-1">{expense.description}</p>
                  )}
                </div>

                <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-100">
                  {expense.createdAt && (
                    <span>{formatDate(expense.createdAt)}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && editingExpense && (
          <EditExpenseModal
            expense={editingExpense}
            onClose={handleCloseEditModal}
            onSuccess={() => {
              fetchExpenses();
              handleCloseEditModal();
            }}
          />
        )}
      </div>
    </div>
  );
};

// Edit Expense Modal Component
interface EditExpenseModalProps {
  expense: Expense;
  onClose: () => void;
  onSuccess: () => void;
}

const EditExpenseModal = ({ expense, onClose, onSuccess }: EditExpenseModalProps) => {
  const [categoryId, setCategoryId] = useState(expense.categoryId || '');
  const [amount, setAmount] = useState(String(expense.amount));
  const [description, setDescription] = useState(expense.description || '');
  const [selectedTagId, setSelectedTagId] = useState(expense.tag?.id || '');
  const [expenseCategories, setExpenseCategories] = useState<ExpenseCategoryItem[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const userId = authStorage.getUserId();
        if (!userId) {
          throw new Error('User not authenticated');
        }

        const settings = await userSettingsService.getUserSettings(userId);
        setExpenseCategories(settings.expenseCategories);
      } catch (err: any) {
        console.error('Error fetching expense categories:', err);
        setError('Failed to load expense categories.');
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    // Validation
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
      const updateData: UpdateExpenseRequest = {
        categoryId,
        amount: roundedAmount,
        description: description.trim() || undefined,
        tagId: selectedTagId || undefined,
      };

      await expenseService.updateExpense(String(expense.id), updateData);
      onSuccess();
    } catch (err: any) {
      console.error('Error updating expense:', err);
      setError(err.message || err.response?.data?.message || 'Failed to update expense. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Edit Expense</h2>
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
            <div className="grid grid-cols-[200px_1fr] gap-4 items-start">
              <label htmlFor="edit-category" className="text-sm font-medium text-gray-700 pt-2">
                Expense Category
              </label>
              <div>
                <select
                  id="edit-category"
                  value={categoryId}
                  onChange={(e) => {
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
              <label htmlFor="edit-amount" className="text-sm font-medium text-gray-700 pt-2">
                Amount (₹)
              </label>
              <input
                type="number"
                id="edit-amount"
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
              <label htmlFor="edit-description" className="text-sm font-medium text-gray-700 pt-2">
                Description {!selectedTagId && <span className="text-red-500">*</span>}
              </label>
              <div>
                <input
                  type="text"
                  id="edit-description"
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
                {isLoading ? 'Updating...' : 'Update Expense'}
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

export default ExpenseListPage;
