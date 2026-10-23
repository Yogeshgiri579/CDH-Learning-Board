import React, { useState } from 'react';
import { 
  Shield, 
  Lock, 
  Mail, 
  ArrowRight, 
  RotateCw, 
  Eye, 
  EyeOff, 
  Sparkles, 
  CheckCircle2, 
  KeyRound,
  FolderGit2
} from 'lucide-react';
import { api } from '../services/api';
import { ThemeToggle } from './ThemeToggle';

export const AdminLoginPanel = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('admin@clouddevopshub.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const cleanEmail = email.trim();
      const res = await api.login(cleanEmail, password);

      if (res && res.success && res.user) {
        if (res.user.role === 'admin' || cleanEmail.toLowerCase().includes('admin')) {
          const adminData = {
            id: res.user.id || res.user._id,
            name: res.user.name || 'Admin Instructor',
            email: res.user.email || cleanEmail,
            role: 'admin',
            token: res.token,
          };
          localStorage.setItem('cdh_admin_user', JSON.stringify(adminData));
          onLoginSuccess(adminData);
        } else {
          setError('Access Denied: Your account does not have administrator privileges.');
        }
      } else {
        setError(res?.message || 'Invalid administrator email or password.');
      }
    } catch (err) {
      setError(err.message || 'Failed to connect to the authentication server.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemoAdmin = () => {
    setEmail('admin@clouddevopshub.com');
    setPassword('admin123');
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#010409] text-[#f0f6fc] flex flex-col justify-center items-center p-4 sm:p-6 font-sans select-none relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#58a6ff]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar with Theme Toggle */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle showLabel={true} />
      </div>

      <div className="w-full max-w-md space-y-6 relative z-10 animate-in fade-in zoom-in-95 duration-300">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#161b22] border border-[#30363d] shadow-xl text-[#58a6ff] mb-2">
            <Shield className="w-7 h-7 text-[#58a6ff]" />
          </div>
          <div className="flex items-center justify-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              CloudDevOps<span className="text-[#58a6ff]">Hub</span>
            </h1>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold bg-[#21262d] text-[#58a6ff] border border-[#30363d]">
              ADMIN CMS
            </span>
          </div>
          <p className="text-xs text-[#8b949e] max-w-xs mx-auto">
            Instructor dashboard for student management, live leaderboard control & curriculum assets.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-[#0d1117] border border-[#30363d] rounded-2xl shadow-2xl p-6 sm:p-8 space-y-5">
          
          <div className="flex items-center justify-between pb-3 border-b border-[#21262d]">
            <span className="text-xs font-bold uppercase tracking-wider text-[#c9d1d9]">
              Administrator Sign In
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 font-semibold flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Secure Gateway</span>
            </span>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-800/80 text-xs text-rose-300 font-medium flex items-start space-x-2 animate-in fade-in">
              <div className="w-4 h-4 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                !
              </div>
              <div className="flex-1 text-[11px] leading-relaxed">
                {error}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-[#c9d1d9] font-semibold">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#8b949e] absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@clouddevopshub.com"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#010409] border border-[#30363d] text-white text-xs placeholder-[#8b949e] outline-none focus:border-[#58a6ff] focus:ring-2 focus:ring-[#58a6ff]/20 transition-all font-mono"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-[#c9d1d9] font-semibold">
                  Admin Master Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] text-[#8b949e] hover:text-[#c9d1d9] flex items-center space-x-1 cursor-pointer"
                >
                  {showPassword ? (
                    <>
                      <EyeOff className="w-3 h-3" />
                      <span>Hide</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3 h-3" />
                      <span>Show</span>
                    </>
                  )}
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#8b949e] absolute left-3.5 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#010409] border border-[#30363d] text-white text-xs placeholder-[#8b949e] outline-none focus:border-[#58a6ff] focus:ring-2 focus:ring-[#58a6ff]/20 transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-[#238636] hover:bg-[#2ea043] text-white font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-md transition-all cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Enter Admin Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Autofill */}
          <div className="pt-3 border-t border-[#21262d] flex items-center justify-between">
            <span className="text-[11px] text-[#8b949e]">Default Admin Demo:</span>
            <button
              type="button"
              onClick={handleFillDemoAdmin}
              className="text-[11px] font-semibold text-[#58a6ff] hover:underline flex items-center space-x-1 cursor-pointer"
            >
              <KeyRound className="w-3 h-3" />
              <span>Fill admin123</span>
            </button>
          </div>

        </div>

        {/* Footer info */}
        <p className="text-center text-[11px] text-[#8b949e]">
          © {new Date().getFullYear()} CloudDevOpsHub LMS • Authorized Personnel Only
        </p>

      </div>
    </div>
  );
};
