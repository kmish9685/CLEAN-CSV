import React from 'react';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) {
    // This component should ideally be protected by routing,
    // but as a fallback, we can handle the case where user is not logged in.
    return <p>Please log in to view the dashboard.</p>;
  }

  return (
    <div className="dashboard-container">
      <h2>Welcome to your Dashboard, {user.displayName || user.email}!</h2>
      {/* Add your dashboard content here */}
      <p>Here you will find all your important information and tools.</p>
      {/* Example: Link to user settings, display recent activity, etc. */}
    </div>
  );
};

export default Dashboard;