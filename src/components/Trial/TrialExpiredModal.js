// src/components/Trial/TrialExpiredModal.js
import React from 'react';
import { useTrial } from '../../contexts/TrialContext';
import { useRouter } from 'next/router';

const TrialExpiredModal = () => {
  const { isModalOpen, closeModal } = useTrial();
  const router = useRouter();

  if (!isModalOpen) {
    return null; // Don't render the modal if it's not open
  }

  const handleLoginClick = () => {
    closeModal();
    router.push('/login');
  };

  const handleSignupClick = () => {
    closeModal();
    router.push('/signup');
  };

  // Basic modal styling
  const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  };

  const modalContentStyle = {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    textAlign: 'center',
    maxWidth: '400px',
    width: '90%',
  };

  const buttonContainerStyle = {
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'space-around',
  };

  const buttonStyle = {
    padding: '10px 15px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
  };

  const primaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#007bff', // Example primary color
    color: '#fff',
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#f8f9fa', // Example secondary color
    color: '#000',
    border: '1px solid #ccc',
  };

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <h2>You're loving our tool! 🎉</h2>
        <p>You've used your 2 free trials. Create an account to continue enjoying unlimited access plus premium features.</p>
        <p>Benefits:</p>
        <ul>
          <li>Unlimited tool usage</li>
          <li>Save your work</li>
          <li>Access premium templates</li>
          <li>Priority support</li>
        </ul>
        <div style={buttonContainerStyle}>
          <button style={primaryButtonStyle} onClick={handleSignupClick}>
            Create Free Account
          </button>
          <button style={secondaryButtonStyle} onClick={handleLoginClick}>
            Login to Existing Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrialExpiredModal;