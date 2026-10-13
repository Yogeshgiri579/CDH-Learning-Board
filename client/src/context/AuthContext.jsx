import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('cdh_token') || null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authPromptMessage, setAuthPromptMessage] = useState('');
  const [authModalTab, setAuthModalTab] = useState('signin');

  // Initial load check
  useEffect(() => {
    let isMounted = true;
    const checkAuth = async () => {
      const savedToken = localStorage.getItem('cdh_token');
      if (savedToken) {
        try {
          const res = await api.getMe();
          if (isMounted) {
            if (res && res.success && res.user) {
              setUser(res.user);
            } else {
              // Token expired or invalid
              localStorage.removeItem('cdh_token');
              setUser(null);
              setToken(null);
            }
          }
        } catch (e) {
          console.error('Auth verification error:', e);
        }
      }
      if (isMounted) setLoading(false);
    };

    checkAuth();
    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.login(email, password);
      if (res && res.success && res.token) {
        localStorage.setItem('cdh_token', res.token);
        setToken(res.token);
        setUser(res.user);
        setAuthModalOpen(false);
        return { success: true, user: res.user };
      }
      return { success: false, message: res?.message || 'Invalid email or password' };
    } catch (err) {
      console.error('Login error:', err);
      return { success: false, message: err.message || 'Unable to connect to server. Please try again.' };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await api.register(name, email, password);
      if (res && res.success && res.token) {
        localStorage.setItem('cdh_token', res.token);
        setToken(res.token);
        setUser(res.user);
        setAuthModalOpen(false);
        return { success: true, user: res.user };
      }
      return { success: false, message: res?.message || 'Registration failed' };
    } catch (err) {
      console.error('Registration error:', err);
      return { success: false, message: err.message || 'Unable to connect to server. Please try again.' };
    }
  };

  const loginWithGoogle = async (customProfile = null) => {
    try {
      const profile = customProfile || {
        name: 'Google Cloud Learner',
        email: 'learner.google@clouddevopshub.com',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        googleId: 'g_' + Math.floor(Math.random() * 1000000),
      };

      const res = await api.googleAuth(profile);
      if (res && res.success && res.token) {
        localStorage.setItem('cdh_token', res.token);
        setToken(res.token);
        setUser(res.user);
        setAuthModalOpen(false);
        return { success: true, user: res.user };
      }
      return { success: false, message: res?.message || 'Google authentication failed' };
    } catch (err) {
      console.error('Google Auth error:', err);
      return { success: false, message: err.message || 'Google authentication connection error' };
    }
  };

  const loginWithGitHub = async (customProfile = null) => {
    try {
      const profile = customProfile || {
        name: 'OctoDevOps Pro',
        email: 'octo.engineer@clouddevopshub.com',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        githubId: 'gh_' + Math.floor(Math.random() * 1000000),
      };

      const res = await api.githubAuth(profile);
      if (res && res.success && res.token) {
        localStorage.setItem('cdh_token', res.token);
        setToken(res.token);
        setUser(res.user);
        setAuthModalOpen(false);
        return { success: true, user: res.user };
      }
      return { success: false, message: res?.message || 'GitHub authentication failed' };
    } catch (err) {
      console.error('GitHub Auth error:', err);
      return { success: false, message: err.message || 'GitHub authentication connection error' };
    }
  };

  const loginDemo = async () => {
    return login('learner@clouddevopshub.com', 'password123');
  };

  const logout = () => {
    localStorage.removeItem('cdh_token');
    setToken(null);
    setUser(null);
  };

  const toggleComplete = async (sessionNumber) => {
    if (!user) {
      setAuthPromptMessage('Sign in to track your learning progress and mark sessions as completed!');
      setAuthModalTab('signin');
      setAuthModalOpen(true);
      return;
    }

    try {
      const res = await api.toggleComplete(sessionNumber);
      if (res && res.success) {
        setUser((prev) => ({
          ...prev,
          completedSessions: res.completedSessions,
        }));
      }
    } catch (e) {
      console.error('Error updating progress:', e);
    }
  };

  const isCompleted = (sessionNumber) => {
    if (!user || !user.completedSessions) return false;
    return user.completedSessions.includes(Number(sessionNumber));
  };

  const openAuthModal = (customMsg = '', initialTab = 'signin') => {
    setAuthPromptMessage(customMsg);
    setAuthModalTab(initialTab);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
    setAuthPromptMessage('');
  };

  const completedCount = user?.completedSessions?.length || 0;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(user),
        loading,
        login,
        register,
        loginWithGoogle,
        loginWithGitHub,
        loginDemo,
        logout,
        toggleComplete,
        isCompleted,
        completedCount,
        authModalOpen,
        authPromptMessage,
        authModalTab,
        setAuthModalTab,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
