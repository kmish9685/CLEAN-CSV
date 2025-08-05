import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase/config'; // Assuming firebase config is in this path
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config'; // Assuming Firestore db is in this path

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            setUserData(userDocSnap.data());
          } else {
            setUserData(null); // User document doesn't exist
          }
        } catch (err) {
          setError('Failed to fetch user data.');
          console.error('Error fetching user data:', err);
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signup = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // Additional logic to create user document in Firestore if needed
    } catch (err) {
      setError(err.message);
      console.error('Signup error:', err);
      throw err; // Re-throw to allow components to catch
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(err.message);
      console.error('Login error:', err);
      throw err; // Re-throw to allow components to catch
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      await signOut(auth);
    } catch (err) {
      setError(err.message);
      console.error('Logout error:', err);
      throw err; // Re-throw to allow components to catch
    } finally {
      setLoading(false);
    }
  };

  const value = {
    currentUser,
    userData,
    loading,
    error,
    signup,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase/config'; // Assuming firebase config is in this path
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config'; // Assuming Firestore db is in this path

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            setUserData(userDocSnap.data());
          } else {
            setUserData(null); // User document doesn't exist
          }
        } catch (err) {
          setError('Failed to fetch user data.');
          console.error('Error fetching user data:', err);
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signup = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // Additional logic to create user document in Firestore if needed
    } catch (err) {
      setError(err.message);
      console.error('Signup error:', err);
      throw err; // Re-throw to allow components to catch
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(err.message);
      console.error('Login error:', err);
      throw err; // Re-throw to allow components to catch
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setError(null);
    try {
      await signOut(auth);
    } catch (err) {
      setError(err.message);
      console.error('Logout error:', err);
      throw err; // Re-throw to allow components to catch
    } finally {
      setLoading(false);
    }
  };

  const value = {
    currentUser,
    userData,
    loading,
    error,
    signup,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};