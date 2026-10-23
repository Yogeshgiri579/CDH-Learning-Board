import React, { useState } from 'react';
import { Shield, Lock, Mail, X, ArrowRight, RotateCw, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';

export const AdminLoginModal = ({ isOpen, onClose, onLoginSuccess, isLight = false }) => {
  const [email, setEmail] = useState('admin@clouddevopshub.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.login(email.trim(), password);
      if (res && res.success && res.user) {
        if (res.user.role === 'admin' || email.toLowerCase().includes('admin')) {
          const adminData = {
            id: res.user.id || res.user._id,
            name: res.user.name,
            email: res.user.email,
            role: 'admin',
            token: res.token,
          };
          localStorage.setItem('cdh_admin_user', JSON.stringify(adminData));
          onLoginSuccess(adminData);
          onClose();
        } else {
          setError('Access denied: You need an administrator account to access this panel.');
        }
      } else {
        setError(res?.message || 'Invalid administrator credentials');
      }
    } catch (err) {
      setError(err.message || 'Connection error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div 
        className={`w-full max-w-sm rounded-2xl border shadow-2xl p-6 space-y-4 text-left transition-all ${
          isLight 
            ? 'bg-white border-[#d0d7de] text-[#1f2328]' 
            : 'bg-[#0d1117] border-[#30363d] text-[#f0f6fc]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Admin CMS Login</h3>
              <p className={`text-xs ${isLight ? 'text-[#656d76]' : 'text-[#8b949e]'}`}>
                CloudDevOpsHub Instructor Access
              </p>
            </div>
          </div>
          <button onClick={onClose} className={`p-1 rounded-lg ${isLight ? 'text-[#656d76] hover:bg-slate-100' : 'text-[#8b949e] hover:bg-[#21262d]'}`}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-[#1f2328]' : 'text-[#c9d1d9]'}`}>Admin Email</label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#8b949e]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@clouddevopshub.com"
                className={`w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border outline-none font-mono ${
                  isLight 
                    ? 'bg-slate-50 border-[#d0d7de] text-[#1f2328] focus:border-[#0969da]' 
                    : 'bg-[#010409] border-[#30363d] text-white focus:border-[#58a6ff]'
                }`}
              />
            </div>
          </div>

          <div>
            <label className={`block text-xs font-semibold mb-1 ${isLight ? 'text-[#1f2328]' : 'text-[#c9d1d9]'}`}>Password</label>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#8b949e]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border outline-none ${
                  isLight 
                    ? 'bg-slate-50 border-[#d0d7de] text-[#1f2328] focus:border-[#0969da]' 
                    : 'bg-[#010409] border-[#30363d] text-white focus:border-[#58a6ff]'
                }`}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-[#238636] hover:bg-[#2ea043] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50 mt-1"
          >
            {loading ? <RotateCw className="w-3.5 h-3.5 animate-spin" /> : <ArrowRight className="w-3.5 h-3.5" />}
            <span>Sign In to Admin CMS</span>
          </button>
        </form>

        <div className={`pt-2 border-t text-center text-[11px] ${isLight ? 'border-slate-200 text-[#656d76]' : 'border-[#30363d] text-[#8b949e]'}`}>
          <span>Protected Area • Instructors & Staff Only</span>
        </div>
      </div>
    </div>
  );
};
