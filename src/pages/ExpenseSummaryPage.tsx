import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { expenseService } from '../services';
import { authStorage } from '../utils/authStorage';
import type { ExpenseSummaryElement } from '../types';

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

// Generate years from 2026 to 2036
const YEARS = Array.from({ length: 11 }, (_, i) => 2026 + i);

const ExpenseSummaryPage = () => {
  const navigate = useNavigate();
  const currentDate = new Date();
  const [selectedYear, setSelectedYear] = useState<number>(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(currentDate.getMonth() + 1);
  const [sortBy, setSortBy] = useState<string>('amount-desc');
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [summaryData, setSummaryData] = useState<{
    elements: ExpenseSummaryElement[];
    numberOfExpenses: number;
    totalExpenseAmount: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogout = () => {
    authStorage.clearAuth();
    navigate('/', { replace: true });
  };

  const toggleCardExpansion = (categoryId: string) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  useEffect(() => {
    // Check authentication status on mount
    const token = authStorage.getToken();
    const userId = authStorage.getUserId();
    
    if (!token || !userId) {
      console.error('Not authenticated, redirecting to login');
      navigate('/', { replace: true });
      return;
    }

    // Fetch summary on mount and when year/month changes
    fetchSummary();
  }, [selectedYear, selectedMonth, navigate]);

  const fetchSummary = async () => {
    const userId = authStorage.getUserId();
    if (!userId) return;

    try {
      setIsLoading(true);
      setError('');
      console.log('Fetching expense summary for:', { year: selectedYear, month: selectedMonth, userId });
      
      const summary = await expenseService.getExpenseSummary(userId, {
        year: selectedYear,
        month: selectedMonth,
      });
      
      console.log('Received expense summary:', summary);
      setSummaryData({
        elements: summary.elements,
        numberOfExpenses: summary.numberOfExpenses,
        totalExpenseAmount: summary.totalExpenseAmount,
      });
    } catch (err: any) {
      console.error('Error fetching expense summary:', err);
      setError('Failed to load expense summary. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Expense Summary</h1>
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

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
                Year
              </label>
              <select
                id="year"
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-gray-900 bg-white"
              >
                {YEARS.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="month" className="block text-sm font-medium text-gray-700 mb-2">
                Month
              </label>
              <select
                id="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-gray-900 bg-white"
              >
                {Object.entries(MONTH_NAMES).map(([num, name]) => (
                  <option key={num} value={num}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                id="sortBy"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-gray-900 bg-white"
              >
                <option value="amount-desc">Amount spent (highest to lowest)</option>
                <option value="amount-asc">Amount spent (lowest to highest)</option>
                <option value="percent-desc">Percentage spent (highest to lowest)</option>
                <option value="percent-asc">Percentage spent (lowest to highest)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Overall Progress Bar */}
        {!isLoading && summaryData && summaryData.elements.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-gray-800">Overall Monthly Progress</h3>
              <span className="text-sm font-medium text-gray-600">
                ₹{Math.round(summaryData.totalExpenseAmount)} / ₹{summaryData.elements.reduce((sum, el) => sum + el.monthlyUpperLimit, 0)}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min((summaryData.totalExpenseAmount / summaryData.elements.reduce((sum, el) => sum + el.monthlyUpperLimit, 0)) * 100, 100)}%`,
                  backgroundColor: (() => {
                    const totalLimit = summaryData.elements.reduce((sum, el) => sum + el.monthlyUpperLimit, 0);
                    const percentage = (summaryData.totalExpenseAmount / totalLimit) * 100;
                    if (percentage >= 100) return '#9c5962';
                    if (percentage >= 91) return '#c77350';
                    if (percentage >= 51) return '#b3b36f';
                    return '#84c38eff';
                  })()
                }}
              />
            </div>
            <div className="mt-2 text-center">
              <span className="text-lg font-bold text-gray-700">
                {Math.ceil((summaryData.totalExpenseAmount / summaryData.elements.reduce((sum, el) => sum + el.monthlyUpperLimit, 0)) * 100)}% used
              </span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">Loading summary...</p>
          </div>
        )}

        {/* Summary Content */}
        {!isLoading && summaryData && (
          <>
            {summaryData.elements.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <p className="text-gray-500 text-lg mb-4">No expenses found for {MONTH_NAMES[selectedMonth]} {selectedYear}</p>
                <button
                  onClick={() => navigate('/create-expense')}
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition"
                >
                  Add Your First Expense
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...summaryData.elements]
                  .sort((a, b) => {
                    const aPercent = (a.monthlyExpenseDone / a.monthlyUpperLimit) * 100;
                    const bPercent = (b.monthlyExpenseDone / b.monthlyUpperLimit) * 100;
                    
                    switch (sortBy) {
                      case 'amount-desc':
                        return b.monthlyExpenseDone - a.monthlyExpenseDone;
                      case 'amount-asc':
                        return a.monthlyExpenseDone - b.monthlyExpenseDone;
                      case 'percent-desc':
                        return bPercent - aPercent;
                      case 'percent-asc':
                        return aPercent - bPercent;
                      default:
                        return 0;
                    }
                  })
                  .map((element) => {
                  const usagePercent = (element.monthlyExpenseDone / element.monthlyUpperLimit) * 100;
                  let cardColor = '#84c38eff'; // Default: 50% or less
                  
                  if (usagePercent >= 100) {
                    cardColor = '#9c5962'; // 100% or more
                  } else if (usagePercent >= 91) {
                    cardColor = '#c77350'; // 91-99%
                  } else if (usagePercent >= 51) {
                    cardColor = '#b3b36f'; // 51-90%
                  }

                  const isExpanded = expandedCards.has(element.categoryId);
                  const hasTagBreakup = element.tagBreakup && element.tagBreakup.length > 0;
                  
                  return (
                    <div
                      key={element.categoryId}
                      className="rounded-lg shadow-md p-4 hover:shadow-lg transition-all"
                      style={{ backgroundColor: cardColor, minHeight: '200px' }}
                    >
                      {/* Header with category name and toggle button */}
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-semibold text-white capitalize">
                            {element.category}
                          </h3>
                          <div className="relative group">
                            <svg 
                              className="w-4 h-4 text-white/80 cursor-help" 
                              fill="currentColor" 
                              viewBox="0 0 20 20"
                            >
                              <path 
                                fillRule="evenodd" 
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" 
                                clipRule="evenodd" 
                              />
                            </svg>
                            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-48 p-2 bg-gray-900 text-white text-xs rounded shadow-lg z-10">
                              {element.categoryDescription}
                              <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Toggle button */}
                        {hasTagBreakup && (
                          <button
                            onClick={() => toggleCardExpansion(element.categoryId)}
                            className="text-white/90 hover:text-white transition-colors"
                            aria-label={isExpanded ? "Hide details" : "Show details"}
                          >
                            <svg
                              className={`w-5 h-5 transition-transform ${
                                isExpanded ? '' : 'rotate-180'
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        )}
                      </div>

                      {/* Stats - More compact when showing details */}
                      <div className="grid grid-cols-3 gap-2 mb-2">
                        <div className="flex flex-col">
                          <span className="text-xs text-white/70">Spent:</span>
                          <span className="text-sm font-bold text-white">
                            ₹{Math.round(element.monthlyExpenseDone)}
                          </span>
                        </div>
                        
                        <div className="flex flex-col">
                          <span className="text-xs text-white/70">Limit:</span>
                          <span className="text-sm font-semibold text-white">
                            ₹{element.monthlyUpperLimit}
                          </span>
                        </div>

                        <div className="flex flex-col">
                          <span className="text-xs text-white/70">Usage:</span>
                          <span className="text-sm font-semibold text-white">
                            {Math.ceil(usagePercent)}%
                          </span>
                        </div>
                      </div>

                      {/* Progress Bar OR Tag Breakdown - Same space */}
                      {!isExpanded ? (
                        <div className="mt-2">
                          <div className="w-full bg-white/30 rounded-full h-1.5">
                            <div
                              className="h-1.5 rounded-full bg-white"
                              style={{
                                width: `${Math.min(usagePercent, 100)}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      ) : (
                        hasTagBreakup && (
                          <div className="mt-2">
                            <h4 className="text-xs font-semibold text-white/90 mb-2">Tag Breakdown:</h4>
                            <div className="grid grid-cols-2 gap-1.5 max-h-32 overflow-y-auto">
                              {[...element.tagBreakup]
                                .sort((a, b) => b.expenseAmount - a.expenseAmount)
                                .map((tag) => (
                                  <div
                                    key={tag.id}
                                    className="flex justify-between items-center bg-white/10 rounded px-2.5 py-1.5"
                                  >
                                    <span className="text-xs text-white font-medium truncate">{tag.name}</span>
                                    <span className="text-xs text-white font-bold ml-1">₹{Math.round(tag.expenseAmount)}</span>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  );
                  })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ExpenseSummaryPage;
