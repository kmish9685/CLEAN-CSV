import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import AuthForm from './AuthForm';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signup, loading, error } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    signup(email, password);
  };

  return (
    <AuthForm
      title="Sign Up"
      onSubmit={handleSubmit}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      buttonText="Sign Up"
      loading={loading}
      error={error}
    />
  );
};

export default Signup;