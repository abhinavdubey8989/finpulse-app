import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { authStorage } from './utils/authStorage';
import LoginPage from './pages/LoginPage';
import CreateExpensePage from './pages/CreateExpensePage';
import ExpenseListPage from './pages/ExpenseListPage';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  const isAuthenticated = authStorage.isAuthenticated();

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={isAuthenticated ? <Navigate to="/expenses" replace /> : <LoginPage />} 
        />
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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

