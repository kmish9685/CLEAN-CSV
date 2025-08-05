// src/contexts/TrialContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getSessionId, getTrialUsage, incrementTrialUsage, initializeTrialSession, isTrialExpired } from '../lib/supabase/client';

// Create the Trial Context
const TrialContext = createContext({
  sessionId: null,
  trialCount: 0,
  isModalOpen: false,
  incrementUsage: async () => {},
  closeModal: () => {},
});

// Create a custom hook to use the Trial Context
export const useTrial = () => {
  return useContext(TrialContext);
};

// Create the Trial Provider component
export const TrialProvider = ({ children }) => {
  const [sessionId, setSessionId] = useState(null);
  const [trialCount, setTrialCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const initializeTrial = async () => {
      const id = getSessionId();
      setSessionId(id);

      // Fetch initial usage and initialize if necessary
      const { count, error } = await getTrialUsage(id);

      if (error || count === null) {
         // Handle error or session not found - initialize a new one
         const { data: newData, error: initError } = await initializeTrialSession(id);
         if (initError) {
            console.error('Error initializing trial session:', initError);
         } else {
            setTrialCount(0);
            setIsModalOpen(false); // Ensure modal is closed on initialization
         }
      } else {
         setTrialCount(count);
         const expired = await isTrialExpired(id);
         setIsModalOpen(expired);
      }
    };

    initializeTrial();
  }, []); // Run only on component mount

  // Effect to check modal state when trialCount changes
  useEffect(() => {
    const checkModal = async () => {
      if (sessionId) {
        const expired = await isTrialExpired(sessionId);
        setIsModalOpen(expired);
      }
    };
    checkModal();
  }, [trialCount, sessionId]); // Re-run when trialCount or sessionId changes


  const incrementUsage = async () => {
    if (sessionId) {
      const { data, error } = await incrementTrialUsage(sessionId);
      if (error) {
        console.error('Error incrementing trial usage:', error);
      } else {
        // Update local state after successful increment
        setTrialCount(prevCount => prevCount + 1);
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const value = {
    sessionId,
    trialCount,
    isModalOpen,
    incrementUsage,
    closeModal,
  };

  return <TrialContext.Provider value={value}>{children}</TrialContext.Provider>;
};