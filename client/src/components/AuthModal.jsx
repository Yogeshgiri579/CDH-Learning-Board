import React, { useState, useEffect, useCallback } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  Terminal,
  Zap,
  Loader2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthModal = () => {
  const { 
    authModalOpen, 
    authModalTab, 
    setAuthModalTab, 
    closeAuthModal, 
    login, 
    register, 
    loginDemo,
    loginWithGoogle 
  } = useAuth();

  const [overrideTab, setOverrideTab] = useState(null);
  const tab = overrideTab ?? authModalTab ?? 'signin';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [activeSocial, setActiveSocial] = useState(null);

  const handleClose = useCallback(() => {
    setError('');
    setName('');
    setEmail('');
    setPassword('');
    setOverrideTab(null);
    closeAuthModal();
  }, [closeAuthModal]);

  // Handle ESC key to dismiss modal
  useEffect(() => {
    if (!authModalOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [authModalOpen, handleClose]);

  if (!authModalOpen) return null;

  // Password strength calculation
  const getPasswordStrength = () => {
    if (!password) return { score: 0, label: '', color: 'bg-[#21262d]' };
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 8) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[A-Z]/.test(password) || /[^A-Za-z0-9]/.test(password)) score++;

    switch (score) {
      case 1:
        return { score: 1, label: 'Weak', color: 'bg-rose-500' };
      case 2:
        return { score: 2, label: 'Fair', color: 'bg-amber-500' };
      case 3:
        return { score: 3, label: 'Good', color: 'bg-[#58a6ff]' };
      case 4:
        return { score: 4, label: 'Strong', color: 'bg-emerald-500' };
      default:
        return { score: 1, label: 'Too short', color: 'bg-rose-500' };
    }
  };

  const strength = getPasswordStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setError('Please provide a valid email address');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (tab === 'signup' && !name.trim()) {
      setError('Please enter your full name');
      return;
    }

    setSubmitting(true);

    try {
      if (tab === 'signin') {
        const res = await login(cleanEmail, password);
        if (!res.success) {
          setError(res.message || 'Login failed. Please check your credentials.');
        }
      } else {
        const res = await register(name.trim(), cleanEmail, password);
        if (!res.success) {
          setError(res.message || 'Sign up failed. Please try a different email.');
        }
      }
    } catch {
      setError('Connection error. Please try again or use 1-Click Demo Login.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setActiveSocial('google');
    setSubmitting(true);
    try {
      const res = await loginWithGoogle();
      if (!res.success) {
        setError(res.message || 'Google authentication failed.');
      }
    } catch {
      setError('Could not connect to Google sign-in. Please use Demo login.');
    } finally {
      setSubmitting(false);
      setActiveSocial(null);
    }
  };

  const handleDemoLogin = async () => {
    setError('');
    setSubmitting(true);
    try {
      await loginDemo();
    } catch {
      setError('Failed to log into demo account.');
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemoCredentials = () => {
    setEmail('learner@clouddevopshub.com');
    setPassword('password123');
    setError('');
  };

  const switchTab = (newTab) => {
    setOverrideTab(newTab);
    if (setAuthModalTab) setAuthModalTab(newTab);
    setError('');
  };

  return (
    <div 
      className="fixed inset-0 z-[100] overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150"
      onClick={handleClose}
    >
      <div 
        className="relative bg-[#0d1117] w-full max-w-[380px] max-h-[92vh] overflow-y-auto rounded-2xl shadow-2xl border border-[#30363d] transition-all transform animate-in zoom-in-95 duration-150 custom-scrollbar text-[#f0f6fc]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Accent Line */}
        <div className="h-1 w-full bg-[#238636]" />

        {/* Compact Header */}
        <div className="px-5 pt-4 pb-1">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center space-x-1.5 mb-1.5">
                <div className="w-6 h-6 rounded-lg bg-[#21262d] border border-[#30363d] flex items-center justify-center text-[#58a6ff] shadow-xs">
                  <Terminal className="w-3.5 h-3.5" />
                </div>
                <span className="font-bold text-white text-xs tracking-tight">CloudDevOpsHub</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#21262d] text-[#58a6ff] border border-[#30363d]">LMS</span>
              </div>
              <h2 className="text-base font-bold text-white tracking-tight">
                {tab === 'signin' ? 'Sign in to account' : 'Create free account'}
              </h2>
              <p className="text-[11px] text-[#8b949e] leading-snug">
                {tab === 'signin' 
                  ? 'Access your 55 DevOps labs, repos, and progress.' 
                  : 'Start your 55-day MultiCloud & DevOps track for free.'}
              </p>
            </div>

            <button
              onClick={handleClose}
              className="p-1 rounded-lg text-[#8b949e] hover:text-white hover:bg-[#21262d] transition-colors focus:outline-none -mr-1 -mt-0.5 cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 pt-3 space-y-3">
          
          {/* Single Google One-Click Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={submitting}
            className="w-full py-2 px-3 bg-[#161b22] hover:bg-[#21262d] border border-[#30363d] rounded-xl text-xs font-semibold text-[#f0f6fc] shadow-xs transition-all flex items-center justify-center space-x-2 focus:ring-2 focus:ring-[#58a6ff]/20 disabled:opacity-60 cursor-pointer"
          >
            {activeSocial ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#58a6ff]" />
            ) : (
              <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-1">
            <div className="border-t border-[#30363d] w-full" />
            <span className="bg-[#0d1117] px-2 text-[10px] uppercase tracking-wider text-[#8b949e] font-semibold absolute">
              or continue with email
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-2.5">
            {error && (
              <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-800/60 text-[11px] text-rose-300 font-medium flex items-start space-x-1.5 animate-in fade-in duration-150">
                <span className="text-rose-400 font-bold">✕</span>
                <span className="flex-1 leading-tight">{error}</span>
              </div>
            )}

            {tab === 'signup' && (
              <div>
                <label className="block text-[11px] font-semibold text-[#c9d1d9] mb-0.5">Full Name</label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-[#8b949e] absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Johnson"
                    autoComplete="name"
                    className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-[#30363d] bg-[#010409] focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff]/20 outline-none transition-all placeholder:text-[#8b949e] text-white"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-semibold text-[#c9d1d9] mb-0.5">Email Address</label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-[#8b949e] absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@domain.com"
                  autoComplete="email"
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-[#30363d] bg-[#010409] focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff]/20 outline-none transition-all placeholder:text-[#8b949e] text-white"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-0.5">
                <label className="block text-[11px] font-semibold text-[#c9d1d9]">Password</label>
                {tab === 'signin' && (
                  <button
                    type="button"
                    onClick={fillDemoCredentials}
                    className="text-[10px] text-[#58a6ff] hover:underline font-medium cursor-pointer"
                  >
                    Auto-fill Demo
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-[#8b949e] absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete={tab === 'signin' ? 'current-password' : 'new-password'}
                  className="w-full pl-8 pr-8 py-1.5 text-xs rounded-xl border border-[#30363d] bg-[#010409] focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff]/20 outline-none transition-all placeholder:text-[#8b949e] text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-2 text-[#8b949e] hover:text-white p-0.5 rounded transition-colors cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Password strength bar for signup */}
              {tab === 'signup' && password.length > 0 && (
                <div className="mt-1 space-y-0.5 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-[#8b949e]">Strength:</span>
                    <span className="font-semibold text-[#c9d1d9]">{strength.label}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1 h-1 w-full">
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        className={`rounded-full transition-all duration-300 ${
                          strength.score >= step ? strength.color : 'bg-[#21262d]'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Primary Action Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2 px-3 bg-[#238636] hover:bg-[#2ea043] text-white rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center justify-center space-x-1.5 disabled:opacity-70 disabled:cursor-not-allowed group mt-1 cursor-pointer"
            >
              {submitting && !activeSocial ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>{tab === 'signin' ? 'Sign In to Account' : 'Create Free LMS Account'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Clean Switch Prompt */}
          <div className="pt-2 text-center border-t border-[#30363d] text-xs">
            {tab === 'signin' ? (
              <p className="text-[#8b949e] text-[11px]">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => switchTab('signup')}
                  className="font-semibold text-[#58a6ff] hover:underline cursor-pointer"
                >
                  Create one for free →
                </button>
              </p>
            ) : (
              <p className="text-[#8b949e] text-[11px]">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => switchTab('signin')}
                  className="font-semibold text-[#58a6ff] hover:underline cursor-pointer"
                >
                  Sign in here →
                </button>
              </p>
            )}
          </div>

          {/* 1-Click Instant Demo Evaluation */}
          <div className="pt-2 border-t border-[#30363d] flex items-center justify-between">
            <span className="text-[10px] text-[#8b949e] font-medium">Test Account:</span>
            <button
              onClick={handleDemoLogin}
              disabled={submitting}
              type="button"
              className="py-1 px-2.5 bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] hover:text-white rounded-lg text-[10px] font-semibold transition-colors flex items-center space-x-1.5 border border-[#30363d] cursor-pointer"
            >
              <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span>1-Click Demo Login</span>
            </button>
          </div>

          {/* Micro Value Footer */}
          <div className="pt-1 flex items-center justify-center space-x-2 text-[10px] text-[#8b949e]">
            <div className="flex items-center space-x-0.5">
              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
              <span>55 Labs</span>
            </div>
            <span>•</span>
            <div className="flex items-center space-x-0.5">
              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
              <span>Free Kickoff</span>
            </div>
            <span>•</span>
            <div className="flex items-center space-x-0.5">
              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
              <span>LMS Tracking</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
