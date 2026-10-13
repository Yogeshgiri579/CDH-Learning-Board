import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Terminal, 
  Search, 
  BookOpen, 
  LogOut, 
  Menu, 
  X, 
  ExternalLink, 
  ArrowRight,
  Layers,
  Star,
  Shield
} from 'lucide-react';
import { Github } from './GithubIcon';

export const Navbar = ({ onSearchClick, activeTab, setActiveTab }) => {
  const { user, isAuthenticated, logout, openAuthModal, completedCount } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownTimeoutRef = useRef(null);

  const handleMouseEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setUserDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setUserDropdownOpen(false);
    }, 180);
  };

  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-[#070b14]/90 backdrop-blur-md border-b border-slate-800/80 text-white shadow-md shadow-black/20">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-4">
          
          {/* Brand Logo */}
          <div 
            className="flex items-center space-x-3 cursor-pointer flex-shrink-0 group" 
            onClick={() => setActiveTab('explore')}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-md shadow-blue-500/20 text-white group-hover:shadow-blue-500/35 transition-all">
              <Terminal className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-white leading-tight">
                  CloudDevOps<span className="text-blue-400">Hub</span>
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  LMS
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium hidden sm:block leading-none">
                55-Day MultiCloud Challenge
              </p>
            </div>
          </div>

          {/* Center Navigation Links (Clean, Uncluttered & Matching Dark Aesthetics) */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <button
              onClick={() => setActiveTab('explore')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center space-x-1.5 cursor-pointer ${
                activeTab === 'explore'
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Layers className="w-4 h-4 text-blue-400" />
              <span>Curriculum Modules</span>
            </button>

            <button
              onClick={() => setActiveTab('roadmap')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center space-x-1.5 cursor-pointer ${
                activeTab === 'roadmap'
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BookOpen className="w-4 h-4 text-blue-400" />
              <span>Roadmap View</span>
            </button>

            <a
              href="https://github.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              <Github className="w-3.5 h-3.5 text-slate-300" />
              <span>GitHub</span>
              <span className="hidden lg:inline-flex items-center space-x-0.5 px-1.5 py-0.2 rounded-full bg-slate-800/90 border border-slate-700/80 text-[10px] text-amber-300 font-mono">
                <Star className="w-2.5 h-2.5 fill-amber-300" />
                <span>1.2k</span>
              </span>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>
          </div>

          {/* Right Action Icons & Auth */}
          <div className="hidden md:flex items-center space-x-3 flex-shrink-0">
            {/* Quick Search Trigger */}
            <button
              onClick={onSearchClick}
              className="flex items-center space-x-2 px-3 py-2 rounded-xl border border-slate-800 bg-[#0d1322]/80 hover:bg-[#11192e] text-slate-400 hover:text-slate-200 text-xs transition-all shadow-xs cursor-pointer focus:outline-none focus:border-blue-500/50"
              title="Search Sessions (⌘K)"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden lg:inline text-slate-300">Search topics...</span>
              <kbd className="px-1.5 py-0.2 text-[10px] font-mono bg-slate-800 border border-slate-700 rounded text-slate-300 shadow-2xs">
                ⌘K
              </kbd>
            </button>

            {/* Auth Controls */}
            {isAuthenticated ? (
              <div 
                className="relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2.5 p-1 pl-3 rounded-xl border border-slate-800 bg-[#0d1322]/80 hover:bg-[#11192e] hover:border-slate-700 transition-all cursor-pointer focus:outline-none"
                  aria-haspopup="true"
                  aria-expanded={userDropdownOpen}
                >
                  <div className="text-right hidden xl:block">
                    <p className="text-xs font-bold text-slate-200 leading-tight">{user.name}</p>
                    <p className="text-[10px] text-emerald-400 font-semibold">{completedCount}/55 Done</p>
                  </div>
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`}
                    alt={user.name}
                    className="w-8 h-8 rounded-full border-2 border-blue-500/40 object-cover shadow-xs"
                  />
                </button>

                {/* Dropdown Menu (revealed on hover in dark theme) */}
                {userDropdownOpen && (
                  <div 
                    className="absolute right-0 top-full pt-2 w-56 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="bg-[#0d1322] rounded-xl shadow-2xl border border-slate-800 py-1 overflow-hidden backdrop-blur-md">
                      <div className="px-3.5 py-2.5 border-b border-slate-800/80 bg-slate-900/60">
                        <p className="text-[10px] text-slate-400 font-medium">Signed in as</p>
                        <p className="text-xs font-semibold text-slate-100 truncate">{user.email}</p>
                      </div>
                      
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          setActiveTab('roadmap');
                        }}
                        className="w-full text-left px-3.5 py-2.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/70 flex items-center space-x-2 transition-colors cursor-pointer"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                        <span>Roadmap Progress</span>
                      </button>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full text-left px-3.5 py-2.5 text-xs font-medium text-rose-400 hover:bg-rose-500/10 flex items-center space-x-2 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5 text-rose-400" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => openAuthModal('', 'signin')}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
                >
                  Log in
                </button>
                <button
                  onClick={() => openAuthModal('', 'signup')}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all flex items-center space-x-1.5 cursor-pointer"
                >
                  <span>Start Free</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-[#070b14] px-4 pt-3 pb-5 space-y-3">
          <div className="space-y-1">
            <button
              onClick={() => {
                setActiveTab('explore');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800"
            >
              Curriculum Modules
            </button>
            <button
              onClick={() => {
                setActiveTab('roadmap');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800"
            >
              Roadmap Tree View
            </button>
            <a
              href="https://github.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800"
            >
              <span>GitHub Repository</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>

          <div className="pt-2 border-t border-slate-800">
            {isAuthenticated ? (
              <div className="flex items-center justify-between py-1">
                <span className="text-xs font-bold text-slate-200">{user.name}</span>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs font-semibold text-rose-400 hover:underline"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => {
                    openAuthModal('', 'signin');
                    setMobileMenuOpen(false);
                  }}
                  className="py-2 text-center text-xs font-semibold text-slate-300 bg-slate-800 rounded-lg hover:bg-slate-700"
                >
                  Log in
                </button>
                <button
                  onClick={() => {
                    openAuthModal('', 'signup');
                    setMobileMenuOpen(false);
                  }}
                  className="py-2 text-center text-xs font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-500"
                >
                  Start Free
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </header>
  );
};
