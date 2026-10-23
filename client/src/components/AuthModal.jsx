import React, { useState, useEffect, useCallback } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  Phone,
  ArrowRight, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  Terminal,
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
    authPromptMessage 
  } = useAuth();

  const [overrideTab, setOverrideTab] = useState(null);
  const tab = overrideTab ?? authModalTab ?? 'signin';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleClose = useCallback(() => {
    setError('');
    setName('');
    setEmail('');
    setPhone('');
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

  const handlePhoneChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(raw);
  };

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

    if (tab === 'signup') {
      if (!name.trim()) {
        setError('Please enter your full name');
        return;
      }

      if (phone.length !== 10) {
        setError('Please enter a valid 10-digit mobile number');
        return;
      }
    }

    setSubmitting(true);

    try {
      if (tab === 'signin') {
        const res = await login(cleanEmail, password);
        if (!res.success) {
          setError(res.message || 'Login failed. Please check your credentials.');
        }
      } else {
        const res = await register(name.trim(), cleanEmail, password, phone, countryCode);
        if (!res.success) {
          setError(res.message || 'Account creation failed. Please try a different email.');
        }
      }
    } catch {
      setError('Unable to sign in. Please verify your email and password.');
    } finally {
      setSubmitting(false);
    }
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
        className="relative bg-[#0d1117] w-full max-w-[390px] max-h-[92vh] overflow-y-auto rounded-2xl shadow-2xl border border-[#30363d] transition-all transform animate-in zoom-in-95 duration-150 custom-scrollbar text-[#f0f6fc]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Accent Line */}
        <div className="h-1 w-full bg-[#238636]" />

        {/* Clean Header (No row buttons) */}
        <div className="px-6 pt-5 pb-2">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center space-x-1.5 mb-1.5">
                <div className="w-6 h-6 rounded-lg bg-[#21262d] border border-[#30363d] flex items-center justify-center text-[#58a6ff] shadow-xs">
                  <Terminal className="w-3.5 h-3.5" />
                </div>
                <span className="font-bold text-white text-xs tracking-tight">CloudDevOpsHub</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#21262d] text-[#58a6ff] border border-[#30363d]">LMS</span>
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                {tab === 'signin' ? 'Sign In to Your Account' : 'Create Student Account'}
              </h2>
              <p className="text-xs text-[#8b949e] leading-snug mt-1">
                {authPromptMessage 
                  ? authPromptMessage 
                  : tab === 'signin' 
                    ? 'Welcome back! Enter your email and password to access your sessions.' 
                    : 'Get full access to 55 DevOps labs, interactive quizzes, and rankings.'}
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

        {/* Modal Form */}
        <div className="p-6 pt-2 space-y-3.5">
          <form onSubmit={handleSubmit} className="space-y-3">
            {error && (
              <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-800/60 text-[11px] text-rose-300 font-medium flex items-start space-x-1.5 animate-in fade-in duration-150">
                <span className="text-rose-400 font-bold">✕</span>
                <span className="flex-1 leading-tight">{error}</span>
              </div>
            )}

            {tab === 'signup' && (
              <div>
                <label className="block text-[11px] font-semibold text-[#c9d1d9] mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-[#8b949e] absolute left-3 top-2.5 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Johnson"
                    autoComplete="name"
                    className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-[#30363d] bg-[#010409] focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff]/20 outline-none transition-all placeholder:text-[#8b949e] text-white"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-semibold text-[#c9d1d9] mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-[#8b949e] absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  autoComplete="email"
                  className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-[#30363d] bg-[#010409] focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff]/20 outline-none transition-all placeholder:text-[#8b949e] text-white"
                />
              </div>
            </div>

            {tab === 'signup' && (
              <div>
                <label className="block text-[11px] font-semibold text-[#c9d1d9] mb-1">Mobile Number</label>
                <div className="flex space-x-2">
                  <div className="px-2.5 py-2 rounded-xl border border-[#30363d] bg-[#161b22] text-xs font-mono font-semibold text-white flex items-center space-x-1 flex-shrink-0">
                    <span>🇮🇳</span>
                    <span>{countryCode}</span>
                  </div>
                  <div className="relative flex-1">
                    <Phone className="w-3.5 h-3.5 text-[#8b949e] absolute left-3 top-2.5 pointer-events-none" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={handlePhoneChange}
                      placeholder="10-digit number (e.g. 9876543210)"
                      maxLength={10}
                      autoComplete="tel"
                      className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-[#30363d] bg-[#010409] focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff]/20 outline-none transition-all placeholder:text-[#8b949e] text-white font-mono"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-[#8b949e] mt-1">Default country code is +91 (India)</p>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-semibold text-[#c9d1d9] mb-1">Password</label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-[#8b949e] absolute left-3 top-2.5 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete={tab === 'signin' ? 'current-password' : 'new-password'}
                  className="w-full pl-8 pr-8 py-2 text-xs rounded-xl border border-[#30363d] bg-[#010409] focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff]/20 outline-none transition-all placeholder:text-[#8b949e] text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-2.5 text-[#8b949e] hover:text-white p-0.5 rounded transition-colors cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Password strength bar for signup */}
              {tab === 'signup' && password.length > 0 && (
                <div className="mt-1.5 space-y-0.5 animate-in fade-in duration-150">
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
              className="w-full py-2.5 px-3 bg-[#238636] hover:bg-[#2ea043] text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center space-x-1.5 disabled:opacity-70 disabled:cursor-not-allowed group mt-2 cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>{tab === 'signin' ? 'Sign In to Account' : 'Create Free Student Account'}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Clean Switch Prompt */}
          <div className="pt-3 text-center border-t border-[#30363d] text-xs">
            {tab === 'signin' ? (
              <p className="text-[#8b949e] text-xs">
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => switchTab('signup')}
                  className="font-bold text-[#58a6ff] hover:underline cursor-pointer"
                >
                  Create one now →
                </button>
              </p>
            ) : (
              <p className="text-[#8b949e] text-xs">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => switchTab('signin')}
                  className="font-bold text-[#58a6ff] hover:underline cursor-pointer"
                >
                  Sign in here →
                </button>
              </p>
            )}
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
              <span>Points & Leaderboard</span>
            </div>
            <span>•</span>
            <div className="flex items-center space-x-0.5">
              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
              <span>Badges</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
