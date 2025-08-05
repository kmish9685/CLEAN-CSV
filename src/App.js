import React from 'react';
import { useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Placeholder components for demonstration
const Dashboard = () => <div>Welcome to your Dashboard!</div>;
const LandingPage = () => <div>Welcome to the Landing Page! <button>Try for Free</button></div>;
const LoginPage = () => <div>Login Page</div>;

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        {/* Add other routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
