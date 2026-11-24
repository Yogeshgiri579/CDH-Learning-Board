import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  LogOut, 
  Menu, 
  X, 
  ArrowRight,
  Trophy,
  Cloud,
  Code2,
  Search
} from 'lucide-react';
import { Github } from './GithubIcon';
import { ThemeToggle } from './ThemeToggle';

export const Navbar = ({
  onSearchClick,
  onCurriculumClick,
  onPracticeClick,
  onCareerClick,
  onLeaderboardClick,
  totalSessions = 60,
}) => {
  const { user, token, loading, isAuthenticated, logout, openAuthModal, completedCount, quizPassedCount = 0 } = useAuth();
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
    <header className="sticky top-0 z-40 border-b border-emerald-300/10 bg-[#020a0b]/90 text-white shadow-[0_8px_30px_rgba(0,0,0,0.22)] backdrop-blur-xl">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4 sm:h-[72px]">
          
          {/* Brand Logo */}
          <button
            type="button"
            className="group flex flex-shrink-0 cursor-pointer items-center gap-2.5 text-left"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="CloudDevOpsHub home"
          >
            <div className="relative flex h-9 w-10 items-center justify-center text-emerald-300 transition group-hover:drop-shadow-[0_0_8px_rgba(52,211,153,0.7)]">
              <Cloud className="absolute h-9 w-10 stroke-[1.8]" />
              <Code2 className="relative mt-1 h-4 w-4 stroke-[2.4]" />
            </div>
            <div className="leading-tight">
              <div className="font-extrabold text-sm tracking-tight text-white sm:text-lg">
                CloudDevOps<span className="text-emerald-300">Hub</span>
              </div>
              <p className="mt-1 hidden text-[9px] font-semibold tracking-[0.16em] text-slate-400 sm:block">
                CLOUD · DEVOPS · AI
              </p>
            </div>
          </button>

          {/* Center Navigation Links */}
          <div className="hidden items-center gap-1 min-[1200px]:flex xl:gap-2">
            <button
              onClick={onPracticeClick || onCurriculumClick}
              className="rounded-full px-3 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.06] hover:text-emerald-200 xl:px-3.5"
            >
              Practice
            </button>

            <button
              onClick={() => onLeaderboardClick && onLeaderboardClick()}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.06] hover:text-emerald-200 xl:px-3.5"
            >
              <Trophy className="h-4 w-4 text-amber-300" />
              <span>Leaderboard</span>
            </button>

            <button
              type="button"
              onClick={onCareerClick || onCurriculumClick}
              className="rounded-full px-3 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.06] hover:text-emerald-200 xl:px-3.5"
            >
              Career Prep
            </button>
          </div>

          {/* Right Action Icons & Auth */}
          <div className="hidden flex-shrink-0 items-center gap-2 min-[1200px]:flex xl:gap-3">
            <a
              href="https://github.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open CloudDevOpsHub GitHub repository"
              title="GitHub Repository"
              className="rounded-full border border-white/15 bg-white/[0.03] p-2 text-slate-400 transition hover:border-emerald-300/40 hover:bg-white/[0.08] hover:text-white"
            >
              <Github className="h-4 w-4" />
            </a>

            <button
              onClick={onSearchClick}
              className="flex items-center space-x-2 rounded-full border border-white/15 bg-white/[0.03] px-3 py-2 text-xs text-slate-400 shadow-xs transition-all hover:bg-white/[0.08] hover:text-white focus:outline-none"
              title="Search Sessions (⌘K)"
            >
              <Search className="h-3.5 w-3.5 text-[#8b949e]" />
              <span className="hidden text-[#c9d1d9] lg:inline">Search topics...</span>
              <kbd className="rounded border border-[#30363d] bg-[#21262d] px-1.5 py-0.2 font-mono text-[10px] text-[#8b949e] shadow-2xs">
                ⌘K
              </kbd>
            </button>

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
                  className="flex cursor-pointer items-center space-x-2.5 rounded-xl border border-white/15 bg-white/[0.04] p-1 pl-3 transition-all hover:bg-white/[0.08] focus:outline-none"
                  aria-haspopup="true"
                  aria-expanded={userDropdownOpen}
                >
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-[#f0f6fc] truncate max-w-[170px]" title={user?.email || user?.name}>
                      {user?.email || user?.name || 'Learner'}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-medium leading-none">
                      {completedCount}/{totalSessions} Completed
                    </span>
                  </div>

                  <div className="w-8 h-8 rounded-lg bg-[#21262d] border border-[#30363d] flex items-center justify-center font-bold text-xs text-[#58a6ff]">
                    {(user?.email ? user.email[0] : user?.name ? user.name[0] : 'U').toUpperCase()}
                  </div>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#161b22] border border-[#30363d] shadow-2xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3.5 py-2 border-b border-[#21262d]">
                      <p className="text-xs font-bold text-white truncate">{user?.email}</p>
                      {user?.name && <p className="text-[11px] text-[#8b949e] truncate">{user.name}</p>}
                    </div>

                    <div className="py-1">
                      <div className="px-3.5 py-1.5 text-xs text-[#8b949e] flex items-center justify-between">
                        <span>Sessions Done:</span>
                        <span className="font-bold text-emerald-400">{completedCount} of {totalSessions}</span>
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
            ) : (loading && token) ? (
              <div className="flex items-center space-x-2">
                <div className="w-24 h-8 rounded-xl bg-[#21262d] border border-[#30363d] animate-pulse" />
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => openAuthModal('', 'signin')}
                  className="rounded-full border border-white/25 px-4 py-2 text-xs font-bold text-white transition-colors hover:border-emerald-300 hover:text-emerald-200"
                >
                  Log in
                </button>
                <button
                  onClick={() => openAuthModal('', 'signup')}
                  className="flex items-center space-x-1.5 rounded-full bg-gradient-to-r from-lime-300 to-emerald-400 px-4 py-2 text-xs font-extrabold text-slate-950 shadow-[0_0_22px_rgba(74,222,128,0.16)] transition-all hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(74,222,128,0.3)]"
                >
                  <span>Start Free</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Right Controls: Search, Theme Toggle & Menu Hamburger */}
          <div className="flex items-center space-x-1.5 min-[1200px]:hidden">
            <button
              onClick={onSearchClick}
              className="hidden rounded-xl p-2 text-[#8b949e] transition-colors hover:bg-[#21262d] hover:text-white sm:inline-flex"
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
        <div className="space-y-3 border-t border-emerald-300/10 bg-[#061013] px-4 pb-5 pt-3 shadow-xl min-[1200px]:hidden">
          {/* Mobile Theme Toggle Row */}
          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
            <span className="text-xs font-semibold text-slate-300">Theme Mode</span>
            <ThemeToggle showLabel={true} />
          </div>
          <div className="space-y-1">
            <button
              onClick={() => {
                if (onSearchClick) onSearchClick();
                setMobileMenuOpen(false);
              }}
              className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-slate-300 transition hover:bg-white/[0.06] sm:hidden"
            >
              <Search className="h-4 w-4" />
              Search topics
            </button>
            <button
              onClick={() => {
                if (onPracticeClick) onPracticeClick();
                else if (onCurriculumClick) onCurriculumClick();
                setMobileMenuOpen(false);
              }}
              className="w-full rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-slate-300 transition hover:bg-white/[0.06]"
            >
              Practice
            </button>
            <button
              onClick={() => {
                if (onLeaderboardClick) onLeaderboardClick();
                setMobileMenuOpen(false);
              }}
              className="flex w-full items-center space-x-2 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-slate-300 transition hover:bg-white/[0.06]"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Leaderboard & Badges</span>
            </button>
            <button
              onClick={() => {
                if (onCareerClick) onCareerClick();
                else if (onCurriculumClick) onCurriculumClick();
                setMobileMenuOpen(false);
              }}
              className="w-full rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-slate-300 transition hover:bg-white/[0.06]"
            >
              Career Prep
            </button>
            <a
              href="https://github.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge"
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.06]"
            >
              GitHub Repository
            </a>
          </div>

          <div className="border-t border-white/10 pt-3">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full rounded-xl bg-rose-500/10 px-3 py-2.5 text-center text-xs font-semibold text-rose-300"
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
                  className="rounded-full border border-white/25 px-3 py-2.5 text-center text-xs font-bold text-white"
                >
                  Log In
                </button>
                <button
                  onClick={() => {
                    openAuthModal('', 'signup');
                    setMobileMenuOpen(false);
                  }}
                  className="rounded-full bg-gradient-to-r from-lime-300 to-emerald-400 px-3 py-2.5 text-center text-xs font-extrabold text-slate-950"
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
