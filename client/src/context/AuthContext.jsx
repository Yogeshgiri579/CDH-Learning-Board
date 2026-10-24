import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('cdh_token') || null);
  const [user, setUser] = useState(() => {
    try {
      const savedToken = localStorage.getItem('cdh_token');
      const savedUser = localStorage.getItem('cdh_user');
      if (savedToken && savedUser) {
        return JSON.parse(savedUser);
      }
    } catch {}
    return null;
  });
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
              try {
                localStorage.setItem('cdh_user', JSON.stringify(res.user));
              } catch {}
            } else {
              // Token expired or invalid
              localStorage.removeItem('cdh_token');
              localStorage.removeItem('cdh_user');
              setUser(null);
              setToken(null);
            }
          }
        } catch (e) {
          console.error('Auth verification error:', e);
        }
      } else {
        localStorage.removeItem('cdh_user');
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
        if (res.user) {
          try {
            localStorage.setItem('cdh_user', JSON.stringify(res.user));
          } catch {}
        }
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

  const register = async (name, email, password, phone = '', countryCode = '+91') => {
    try {
      const res = await api.register(name, email, password, phone, countryCode);
      if (res && res.success && res.token) {
        localStorage.setItem('cdh_token', res.token);
        if (res.user) {
          try {
            localStorage.setItem('cdh_user', JSON.stringify(res.user));
          } catch {}
        }
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
        if (res.user) {
          try {
            localStorage.setItem('cdh_user', JSON.stringify(res.user));
          } catch {}
        }
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
        if (res.user) {
          try {
            localStorage.setItem('cdh_user', JSON.stringify(res.user));
          } catch {}
        }
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
    localStorage.removeItem('cdh_user');
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
        setUser((prev) => {
          const updated = {
            ...prev,
            completedSessions: res.completedSessions,
          };
          try {
            localStorage.setItem('cdh_user', JSON.stringify(updated));
          } catch {}
          return updated;
        });
      }
    } catch (e) {
      console.error('Error updating progress:', e);
    }
  };

  const recordQuizProgress = async (sessionNumber, score, totalQuestions, passed) => {
    if (!user) return { success: false };
    try {
      const res = await api.recordQuizProgress(sessionNumber, score, totalQuestions, passed);
      if (res && res.success) {
        setUser((prev) => {
          const updated = {
            ...prev,
            quizProgress: res.quizProgress,
            completedSessions: res.completedSessions || prev?.completedSessions || [],
          };
          try {
            localStorage.setItem('cdh_user', JSON.stringify(updated));
          } catch {}
          return updated;
        });
        return { success: true, quizProgress: res.quizProgress };
      }
    } catch (err) {
      console.error('Error saving quiz progress:', err);
    }
    return { success: false };
  };

  const isCompleted = (sessionNumber) => {
    if (!user || !user.completedSessions) return false;
    return user.completedSessions.includes(Number(sessionNumber));
  };

  const isQuizPassed = (sessionNumber) => {
    if (!user || !user.quizProgress) return false;
    const entry = user.quizProgress.find((q) => Number(q.sessionNumber) === Number(sessionNumber));
    return Boolean(entry && entry.passed);
  };

  const getQuizResult = (sessionNumber) => {
    if (!user || !user.quizProgress) return null;
    return user.quizProgress.find((q) => Number(q.sessionNumber) === Number(sessionNumber)) || null;
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
  const quizPassedCount = (user?.quizProgress || []).filter((q) => q.passed).length;

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
        recordQuizProgress,
        isCompleted,
        isQuizPassed,
        getQuizResult,
        completedCount,
        quizPassedCount,
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
