import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import CreateExpensePage from './pages/CreateExpensePage';
import CreateExpenseCategoryPage from './pages/CreateExpenseCategoryPage';
import CreateGroupPage from './pages/CreateGroupPage';
import ExpenseListPage from './pages/ExpenseListPage';
import ExpenseSummaryPage from './pages/ExpenseSummaryPage';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/expenses"
          element={
            <ProtectedRoute>
              <ExpenseListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-expense"
          element={
            <ProtectedRoute>
              <CreateExpensePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-category"
          element={
            <ProtectedRoute>
              <CreateExpenseCategoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-group"
          element={
            <ProtectedRoute>
              <CreateGroupPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/summary"
          element={
            <ProtectedRoute>
              <ExpenseSummaryPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

