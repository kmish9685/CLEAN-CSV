import React from 'react';
import { useAuth } from './context/AuthContext';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {user ? (
        // Placeholder for the Dashboard component
        <div>Dashboard goes here</div>
      ) : (
        // Placeholder for the Landing Page with 'Try for Free'
        <div>Landing Page with 'Try for Free' goes here</div>
      )}
    </div>
  );
}

export default App;
