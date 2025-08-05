// src/components/Auth/AuthWrapper.js
import React from 'react';
import { useAuth } from '../../contexts/AuthContext'; // Import the useAuth hook
import { useRouter } from 'next/router'; // Assuming Next.js router
import { useEffect } from 'react';

const AuthWrapper = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Define public paths that don't require authentication
  const publicPaths = ['/', '/login', '/signup', '/terms']; // Add your public paths here

  useEffect(() => {
    // Redirect if not authenticated and trying to access a protected path
    if (!loading && !user && !publicPaths.includes(router.pathname)) {
      router.push('/login'); // Redirect to login page
    }
  }, [user, loading, router.pathname]);

  // Show a loading indicator while fetching auth state
  if (loading) {
    return <div>Loading...</div>; // Replace with a better loading component
  }

  // Render children if authenticated or on a public path
  return <>{children}</>;
};

export default AuthWrapper;