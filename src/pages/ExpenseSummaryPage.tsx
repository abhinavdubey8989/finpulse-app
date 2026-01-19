import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { expenseService, groupService } from '../services';
import { authStorage } from '../utils/authStorage';
import type { ExpenseSummaryElement, GroupAndCategory, GroupSummaryResponse } from '../types';

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
  const [selectedGroup, setSelectedGroup] = useState<string>('personal');
  const [selectedYear, setSelectedYear] = useState<number>(currentDate.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(currentDate.getMonth() + 1);
  const [sortBy, setSortBy] = useState<string>('percent-desc');
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [cardBreakdownMode, setCardBreakdownMode] = useState<Map<string, 'user' | 'tag'>>(new Map());
  const [groupList, setGroupList] = useState<GroupAndCategory[]>([]);
  const [userName, setUserName] = useState<string | null>(null);
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

  const toggleBreakdownMode = (categoryId: string) => {
    setCardBreakdownMode(prev => {
      const newMap = new Map(prev);
      const currentMode = newMap.get(categoryId) || 'user';
      newMap.set(categoryId, currentMode === 'user' ? 'tag' : 'user');
      return newMap;
    });
  };

  useEffect(() => {
    // Check authentication status on mount
    const token = authStorage.getToken();
    const userId = authStorage.getUserId();
    
    if (!token || !userId) {
      navigate('/', { replace: true });
      return;
    }

    setUserName(authStorage.getUserName());
    fetchGroups();
  }, [navigate]);

  useEffect(() => {
    // Fetch summary when year/month/group changes
    if (groupList.length > 0 || selectedGroup === 'personal') {
      fetchSummary();
    }
  }, [selectedYear, selectedMonth, selectedGroup]);

  const fetchGroups = async () => {
    const userId = authStorage.getUserId();
    if (!userId) return;

    try {
      const configData = await groupService.getGroupConfiguration(userId);
      setGroupList(configData.groupAndCategoryList);
    } catch (err: any) {
    }
  };

  const fetchSummary = async () => {
    const userId = authStorage.getUserId();
    if (!userId) return;

    try {
      setIsLoading(true);
      setError('');
      
      let summary;
      if (selectedGroup === 'personal') {
        // Fetch personal expense summary
        summary = await expenseService.getExpenseSummary(userId, {
          year: selectedYear,
          month: selectedMonth,
        });
      } else {
        // Fetch group expense summary
        summary = await groupService.getGroupSummary(selectedGroup, {
          year: selectedYear,
          month: selectedMonth,
        });
      }
      
      setSummaryData(summary as any);
    } catch (err: any) {
      setError('Failed to load expense summary. Please try again.');
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

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[180px]">
              <label htmlFor="group" className="block text-sm font-medium text-gray-700 mb-2">
                Group
              </label>
              <select
                id="group"
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition text-gray-900 bg-white"
              >
                <option value="personal">Personal</option>
                {groupList.map((group) => (
                  <option key={group.groupId} value={group.groupId}>
                    {group.groupName}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-32">
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
            <div className="w-40">
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
            <div className="flex-1 min-w-[200px]">
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
            <div>
              <button
                onClick={fetchSummary}
                disabled={isLoading}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mt-6"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Overall Progress Bar */}
        {!isLoading && summaryData && summaryData.elements.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-gray-800">Total Monthly Expense</h3>
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
              <>
                {/* User Cards - Only for Group Summary */}
                {selectedGroup !== 'personal' && (summaryData as GroupSummaryResponse).users && (
                  <>
                    <div className="mb-6">
                      <h2 className="text-xl font-bold text-gray-800 mb-4">User Summary</h2>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {Object.entries((summaryData as GroupSummaryResponse).users).map(([userId, user]) => {
                          const isUserExpanded = expandedCards.has(`user-${userId}`);
                          const hasCredits = Object.keys(user.creditAmounts || {}).length > 0;
                          const hasDebits = Object.keys(user.debitAmounts || {}).length > 0;
                          const hasBreakdown = hasCredits || hasDebits;

                          return (
                            <div
                              key={userId}
                              className="rounded-lg shadow-md p-4 hover:shadow-lg transition-all bg-blue-500"
                              style={{ minHeight: '200px' }}
                            >
                              {/* Header with user name and toggle button */}
                              <div className="flex justify-between items-center mb-3">
                                <h3 className="text-base font-semibold text-white capitalize">
                                  {user.name}
                                </h3>
                                
                                {/* Toggle button */}
                                {hasBreakdown && (
                                  <button
                                    onClick={() => toggleCardExpansion(`user-${userId}`)}
                                    className="text-white/90 hover:text-white transition-colors"
                                    aria-label={isUserExpanded ? "Hide details" : "Show details"}
                                  >
                                    <svg
                                      className={`w-5 h-5 transition-transform ${
                                        isUserExpanded ? '' : 'rotate-180'
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

                              {/* Stats */}
                              <div className="grid grid-cols-2 gap-2 mb-2">
                                <div className="flex flex-col">
                                  <span className="text-xs text-white/70">Expenses:</span>
                                  <span className="text-sm font-bold text-white">
                                    {user.expenseCount}
                                  </span>
                                </div>
                                
                                <div className="flex flex-col">
                                  <span className="text-xs text-white/70">Total:</span>
                                  <span className="text-sm font-semibold text-white">
                                    ₹{Math.round(user.totalExpenseAmount)}
                                  </span>
                                </div>
                              </div>

                              {/* Credit/Debit Breakdown */}
                              {!isUserExpanded ? (
                                <div className="mt-2">
                                  <div className="w-full bg-white/30 rounded-full h-1.5">
                                    <div className="h-1.5 rounded-full bg-white" style={{ width: '50%' }}></div>
                                  </div>
                                </div>
                              ) : (
                                hasBreakdown && (
                                  <div className="mt-2">
                                    <h4 className="text-xs font-semibold text-white/90 mb-2">Breakdown:</h4>
                                    <div className="space-y-1 max-h-32 overflow-y-auto">
                                      {/* Credits */}
                                      {hasCredits && Object.entries(user.creditAmounts).map(([creditorId, amount]) => {
                                        const creditorName = (summaryData as GroupSummaryResponse).users[creditorId]?.name || 'Unknown';
                                        return (
                                          <div
                                            key={`credit-${creditorId}`}
                                            className="flex justify-between items-center bg-green-600/30 rounded px-2.5 py-1.5"
                                          >
                                            <span className="text-xs text-white font-medium truncate">
                                              {creditorName} (Credit)
                                            </span>
                                            <span className="text-xs text-white font-bold ml-1">₹{Math.round(amount)}</span>
                                          </div>
                                        );
                                      })}
                                      
                                      {/* Debits */}
                                      {hasDebits && Object.entries(user.debitAmounts).map(([debitorId, amount]) => {
                                        const debitorName = (summaryData as GroupSummaryResponse).users[debitorId]?.name || 'Unknown';
                                        return (
                                          <div
                                            key={`debit-${debitorId}`}
                                            className="flex justify-between items-center bg-red-600/30 rounded px-2.5 py-1.5"
                                          >
                                            <span className="text-xs text-white font-medium truncate">
                                              {debitorName} (Debit)
                                            </span>
                                            <span className="text-xs text-white font-bold ml-1">₹{Math.round(amount)}</span>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t-2 border-gray-300 my-6"></div>

                    <h2 className="text-xl font-bold text-gray-800 mb-4">Category Summary</h2>
                  </>
                )}

                {/* Category Cards */}
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
                  const isGroupSummary = selectedGroup !== 'personal';
                  const hasTagBreakup = element.tagBreakup && element.tagBreakup.length > 0;
                  const hasUserBreakup = 'userAmountBreakup' in element && element.userAmountBreakup && (element.userAmountBreakup as any[]).length > 0;
                  const hasBreakup = isGroupSummary ? (hasUserBreakup || hasTagBreakup) : hasTagBreakup;
                  const breakdownMode = cardBreakdownMode.get(element.categoryId) || 'user';
                  const showUserBreakdown = isGroupSummary && breakdownMode === 'user' && hasUserBreakup;
                  const showTagBreakdown = (isGroupSummary && breakdownMode === 'tag' && hasTagBreakup) || (!isGroupSummary && hasTagBreakup);
                  
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
                        {hasBreakup ? (
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
                        ) : null}
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

                      {/* Progress Bar OR Tag/User Breakdown - Same space */}
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
                        <>
                          {isGroupSummary && hasUserBreakup && hasTagBreakup && (
                            <div className="flex gap-2 mb-2">
                              <button
                                onClick={() => toggleBreakdownMode(element.categoryId)}
                                className={`flex-1 px-2 py-1 text-xs rounded transition-colors ${
                                  breakdownMode === 'user'
                                    ? 'bg-white text-gray-800 font-semibold'
                                    : 'bg-white/20 text-white hover:bg-white/30'
                                }`}
                              >
                                By User
                              </button>
                              <button
                                onClick={() => toggleBreakdownMode(element.categoryId)}
                                className={`flex-1 px-2 py-1 text-xs rounded transition-colors ${
                                  breakdownMode === 'tag'
                                    ? 'bg-white text-gray-800 font-semibold'
                                    : 'bg-white/20 text-white hover:bg-white/30'
                                }`}
                              >
                                By Tag
                              </button>
                            </div>
                          )}
                          {showUserBreakdown ? (
                            <div className="mt-2">
                              <div className="grid grid-cols-2 gap-1.5 max-h-32 overflow-y-auto">
                                {[...(element as any).userAmountBreakup]
                                  .sort((a: any, b: any) => b.expenseAmount - a.expenseAmount)
                                  .map((userBreakup: any) => {
                                    const groupSummary = summaryData as GroupSummaryResponse;
                                    const userName = groupSummary.users?.[userBreakup.userId]?.name || 'Unknown';
                                    return (
                                      <div
                                        key={userBreakup.userId}
                                        className="flex justify-between items-center bg-white/10 rounded px-2.5 py-1.5"
                                      >
                                        <span className="text-xs text-white font-medium truncate">{userName}</span>
                                        <span className="text-xs text-white font-bold ml-1">₹{Math.round(userBreakup.expenseAmount)}</span>
                                      </div>
                                    );
                                  })}
                              </div>
                            </div>
                          ) : showTagBreakdown ? (
                            <div className="mt-2">
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
                            ) : null}
                        </>
                      )}
                    </div>
                  );
                  })}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ExpenseSummaryPage;
