import React, { useState } from 'react';
import Login from './Login';
import Signup from './Signup';

const AuthForm = ({ formType: initialFormType }) => {
  const [formType, setFormType] = useState(initialFormType || 'login');

  const toggleForm = () => {
    setFormType(formType === 'login' ? 'signup' : 'login');
  };

  return (
    <div>
      {formType === 'login' ? <Login /> : <Signup />}
      <button onClick={toggleForm}>
        Switch to {formType === 'login' ? 'Signup' : 'Login'}
      </button>
    </div>
  );
};

export default AuthForm;