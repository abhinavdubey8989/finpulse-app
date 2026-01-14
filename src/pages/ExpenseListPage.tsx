import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { expenseService, authService } from '../services';
import type { Expense } from '../types';
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

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

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
            {expenses.map((expense) => (
              <div
                key={expense.id}
                className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-2">
                  {expense.categoryName && (
                    <span className="text-sm font-semibold text-gray-700 bg-gray-100 px-2 py-1 rounded-md">
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
      </div>
    </div>
  );
};

export default ExpenseListPage;
