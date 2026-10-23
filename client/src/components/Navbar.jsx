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
  Shield,
  Trophy
} from 'lucide-react';
import { Github } from './GithubIcon';
import { ThemeToggle } from './ThemeToggle';

export const Navbar = ({ onSearchClick, activeTab, setActiveTab, onLeaderboardClick }) => {
  const { user, isAuthenticated, logout, openAuthModal, completedCount, quizPassedCount = 0 } = useAuth();
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
    <header className="sticky top-0 z-40 bg-[#161b22]/95 backdrop-blur-md border-b border-[#30363d] text-white shadow-md shadow-black/40">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-4">
          
          {/* Brand Logo */}
          <div 
            className="flex items-center space-x-3 cursor-pointer flex-shrink-0 group" 
            onClick={() => setActiveTab('explore')}
          >
            <div className="w-9 h-9 rounded-xl bg-[#21262d] border border-[#30363d] flex items-center justify-center text-white group-hover:border-[#58a6ff] transition-all">
              <Terminal className="w-4 h-4 text-[#58a6ff]" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-white leading-tight">
                  CloudDevOps<span className="text-[#58a6ff]">Hub</span>
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#21262d] text-[#58a6ff] border border-[#30363d]">
                  LMS
                </span>
              </div>
              <p className="text-[10px] text-[#8b949e] font-medium hidden sm:block leading-none">
                55-Day MultiCloud Challenge
              </p>
            </div>
          </div>

          {/* Center Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <button
              onClick={() => setActiveTab('explore')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center space-x-1.5 cursor-pointer ${
                activeTab === 'explore'
                  ? 'bg-[#21262d] text-white border border-[#30363d] shadow-xs'
                  : 'text-[#c9d1d9] hover:text-white hover:bg-[#21262d]'
              }`}
            >
              <Layers className="w-4 h-4 text-[#58a6ff]" />
              <span>Curriculum Modules</span>
            </button>

            <button
              onClick={() => setActiveTab('roadmap')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center space-x-1.5 cursor-pointer ${
                activeTab === 'roadmap'
                  ? 'bg-[#21262d] text-white border border-[#30363d] shadow-xs'
                  : 'text-[#c9d1d9] hover:text-white hover:bg-[#21262d]'
              }`}
            >
              <BookOpen className="w-4 h-4 text-[#58a6ff]" />
              <span>Roadmap View</span>
            </button>

            <button
              onClick={() => onLeaderboardClick && onLeaderboardClick()}
              className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center space-x-1.5 cursor-pointer text-[#c9d1d9] hover:text-white hover:bg-[#21262d]"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Leaderboard</span>
            </button>

            <a
              href="https://github.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium text-[#c9d1d9] hover:text-white hover:bg-[#21262d] transition-colors"
            >
              <Github className="w-3.5 h-3.5 text-[#c9d1d9]" />
              <span>GitHub</span>
              <span className="hidden lg:inline-flex items-center space-x-0.5 px-1.5 py-0.2 rounded-full bg-[#21262d] border border-[#30363d] text-[10px] text-amber-300 font-mono">
                <Star className="w-2.5 h-2.5 fill-amber-300" />
                <span>1.2k</span>
              </span>
              <ExternalLink className="w-3 h-3 text-[#8b949e]" />
            </a>
          </div>

          {/* Right Action Icons & Auth */}
          <div className="hidden md:flex items-center space-x-3 flex-shrink-0">
            {/* Quick Search Trigger */}
            <button
              onClick={onSearchClick}
              className="flex items-center space-x-2 px-3 py-2 rounded-xl border border-[#30363d] bg-[#0d1117] hover:bg-[#21262d] text-[#8b949e] hover:text-[#f0f6fc] text-xs transition-all shadow-xs cursor-pointer focus:outline-none"
              title="Search Sessions (⌘K)"
            >
              <Search className="w-3.5 h-3.5 text-[#8b949e]" />
              <span className="hidden lg:inline text-[#c9d1d9]">Search topics...</span>
              <kbd className="px-1.5 py-0.2 text-[10px] font-mono bg-[#21262d] border border-[#30363d] rounded text-[#8b949e] shadow-2xs">
                ⌘K
              </kbd>
            </button>

            {/* Light / Dark Mode Toggle */}
            <ThemeToggle />

            {/* Auth Controls */}
            {isAuthenticated ? (
              <div 
                className="relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2.5 p-1 pl-3 rounded-xl border border-[#30363d] bg-[#0d1117] hover:bg-[#21262d] transition-all cursor-pointer focus:outline-none"
                  aria-haspopup="true"
                  aria-expanded={userDropdownOpen}
                >
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-[#f0f6fc] truncate max-w-[120px]">
                      {user?.name || user?.email?.split('@')[0] || 'Learner'}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-medium leading-none">
                      {completedCount}/55 Completed
                    </span>
                  </div>

                  <div className="w-8 h-8 rounded-lg bg-[#21262d] border border-[#30363d] flex items-center justify-center font-bold text-xs text-[#58a6ff]">
                    {user?.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#161b22] border border-[#30363d] shadow-2xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3.5 py-2 border-b border-[#21262d]">
                      <p className="text-xs font-bold text-white truncate">{user?.name || 'DevOps Engineer'}</p>
                      <p className="text-[11px] text-[#8b949e] truncate">{user?.email}</p>
                    </div>

                    <div className="py-1">
                      <div className="px-3.5 py-1.5 text-xs text-[#8b949e] flex items-center justify-between">
                        <span>Sessions Done:</span>
                        <span className="font-bold text-emerald-400">{completedCount} of 55</span>
                      </div>
                      <div className="px-3.5 py-1.5 text-xs text-[#8b949e] flex items-center justify-between border-b border-[#21262d] pb-2">
                        <span>Quizzes Passed:</span>
                        <span className="font-bold text-amber-400">{quizPassedCount} Mastered</span>
                      </div>

                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
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
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-[#c9d1d9] hover:text-white hover:bg-[#21262d] transition-colors cursor-pointer"
                >
                  Log in
                </button>
                <button
                  onClick={() => openAuthModal('', 'signup')}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#238636] hover:bg-[#2ea043] text-white shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer"
                >
                  <span>Start Free</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Right Controls: Search, Theme Toggle & Menu Hamburger */}
          <div className="md:hidden flex items-center space-x-1.5">
            <button
              onClick={onSearchClick}
              className="p-2 rounded-xl text-[#8b949e] hover:text-white hover:bg-[#21262d] transition-colors"
              title="Search Sessions"
            >
              <Search className="w-4 h-4" />
            </button>
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#8b949e] hover:text-white hover:bg-[#21262d] transition-colors"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#30363d] bg-[#161b22] px-4 pt-3 pb-5 space-y-3">
          {/* Mobile Theme Toggle Row */}
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#0d1117] border border-[#30363d]">
            <span className="text-xs font-semibold text-[#c9d1d9]">Theme Mode</span>
            <ThemeToggle showLabel={true} />
          </div>
          <div className="space-y-1">
            <button
              onClick={() => {
                setActiveTab('explore');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-[#c9d1d9] hover:bg-[#21262d]"
            >
              Curriculum Modules
            </button>
            <button
              onClick={() => {
                setActiveTab('roadmap');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-[#c9d1d9] hover:bg-[#21262d]"
            >
              Roadmap View
            </button>
            <button
              onClick={() => {
                onLeaderboardClick && onLeaderboardClick();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-[#c9d1d9] hover:bg-[#21262d] flex items-center space-x-2"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Leaderboard & Badges</span>
            </button>
            <a
              href="https://github.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge"
              target="_blank"
              rel="noopener noreferrer"
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-[#c9d1d9] hover:bg-[#21262d]"
            >
              GitHub Repository
            </a>
          </div>

          <div className="pt-2 border-t border-[#21262d]">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 px-3 rounded-lg bg-rose-500/10 text-rose-400 text-xs font-semibold text-center"
              >
                Sign Out ({user?.email})
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    openAuthModal('', 'signin');
                    setMobileMenuOpen(false);
                  }}
                  className="py-2 px-3 rounded-lg border border-[#30363d] bg-[#21262d] text-xs font-semibold text-[#c9d1d9] text-center"
                >
                  Log In
                </button>
                <button
                  onClick={() => {
                    openAuthModal('', 'signup');
                    setMobileMenuOpen(false);
                  }}
                  className="py-2 px-3 rounded-lg bg-[#238636] hover:bg-[#2ea043] text-xs font-bold text-white text-center"
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
