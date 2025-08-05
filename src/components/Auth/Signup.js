// src/components/Auth/Signup.js
import React, { useState } from 'react';
import { auth } from '../../lib/supabase/client'; // Import the auth object
import { useRouter } from 'next/router'; // Assuming you are using Next.js router

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // You can add more fields here for metadata if needed (e.g., username, display_name)
    const metadata = {
      // username: '...',
      // display_name: '...'
    };

    const { data, error } = await auth.signUp(email, password, metadata);

    if (error) {
      setError(error.message);
    } else {
      // Redirect to a confirmation page or dashboard after successful signup
      router.push('/dashboard'); // Adjust the redirect path as needed
    }
    setLoading(false);
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
      {/* Link to login page */}
      <p>
        Already have an account? <button onClick={() => router.push('/login')}>Login</button>
      </p>
    </div>
  );
};

export default Signup;