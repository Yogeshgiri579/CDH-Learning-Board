import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  X, 
  Trophy, 
  Award, 
  Sparkles, 
  CheckCircle2, 
  Search, 
  RotateCw,
  Zap,
  Star,
  Users,
  Download,
  Share2,
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff
} from 'lucide-react';
import { LinkedInIcon } from './LinkedInIcon';
import { ModuleBadgeHexagon } from './ModuleBadgeHexagon';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  generateAndDownloadBadgeImage, 
  downloadHexagonBadgeImage,
  shareRankingOnLinkedIn, 
  shareBadgeOnLinkedIn 
} from '../utils/badgeCertificateGenerator';

// Curriculum Module Badges matching Batch 45 curriculum shield badges
export const CURRICULUM_MODULE_BADGES = [
  {
    moduleNumber: '01',
    moduleId: 'm1',
    title: 'FOUNDATIONS',
    subtitle: '& AI',
    fullName: 'Foundations & AI Module',
    sessions: [0, 1, 2, 3, 4],
    requiredPosts: 5,
    gradient: { from: '#334155', to: '#1e293b' },
  },
  {
    moduleNumber: '02',
    moduleId: 'm2',
    title: 'LINUX',
    subtitle: 'UBUNTU + GCP',
    fullName: 'Linux Ubuntu & GCP Module',
    sessions: [5, 6, 7, 8, 9, 10, 11, 12],
    requiredPosts: 5,
    gradient: { from: '#f04124', to: '#9e1c07' },
  },
  {
    moduleNumber: '03',
    moduleId: 'm3',
    title: 'AWS',
    subtitle: 'SERVICES',
    fullName: 'AWS Cloud Services Module',
    sessions: [19, 20, 21, 22, 23, 24, 25, 26, 27, 28],
    requiredPosts: 5,
    gradient: { from: '#ff8c00', to: '#b34700' },
  },
  {
    moduleNumber: '04',
    moduleId: 'm4',
    title: 'CI/CD',
    subtitle: 'GIT & JENKINS',
    fullName: 'CI/CD Git & Jenkins Module',
    sessions: [13, 14, 15, 16, 17, 18, 45, 46, 47, 48, 49, 50],
    requiredPosts: 5,
    gradient: { from: '#e11d74', to: '#88053a' },
  },
  {
    moduleNumber: '05',
    moduleId: 'm5',
    title: 'DOCKER',
    subtitle: '& KUBERNETES',
    fullName: 'Docker & Kubernetes Module',
    sessions: [29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44],
    requiredPosts: 5,
    gradient: { from: '#0284c7', to: '#075985' },
  },
  {
    moduleNumber: '06',
    moduleId: 'm6',
    title: 'TF',
    subtitle: '& ANSIBLE',
    fullName: 'Terraform & Ansible Module',
    sessions: [23, 24, 25],
    requiredPosts: 5,
    gradient: { from: '#8b5cf6', to: '#4c1d95' },
  },
  {
    moduleNumber: '07',
    moduleId: 'm7',
    title: 'PYTHON',
    subtitle: '& AUTOMATION',
    fullName: 'Python Automation Module',
    sessions: [51, 52],
    requiredPosts: 5,
    gradient: { from: '#10b981', to: '#047857' },
  },
  {
    moduleNumber: '08',
    moduleId: 'm8',
    title: 'AZURE',
    subtitle: 'AIOPS + GENAI',
    fullName: 'Azure AIOps & GenAI Module',
    sessions: [53, 54],
    requiredPosts: 5,
    gradient: { from: '#06b6d4', to: '#0e7490' },
  },
  {
    moduleNumber: '09',
    moduleId: 'm9',
    title: 'CAPSTONE',
    subtitle: '9 REAL PROJECTS',
    fullName: 'Graduation Capstone Projects',
    sessions: [54],
    requiredPosts: 5,
    gradient: { from: '#f59e0b', to: '#92400e' },
  },
  {
    moduleNumber: '10',
    moduleId: 'm10',
    title: 'CAREER',
    subtitle: '& REFERRALS',
    fullName: 'Career & Referrals Module',
    sessions: [0, 54],
    requiredPosts: 5,
    gradient: { from: '#ef4444', to: '#991b1b' },
  },
];

// Fast in-memory cache so reopening the modal is instant (0ms lag)
let cachedLeaderboardData = null;

// Deterministic gradient palette based on string hash
const AVATAR_GRADIENTS = [
  'from-emerald-500 to-teal-700',
  'from-blue-500 to-indigo-700',
  'from-violet-500 to-purple-800',
  'from-amber-500 to-orange-700',
  'from-rose-500 to-red-700',
  'from-cyan-500 to-blue-700',
  'from-fuchsia-500 to-pink-800',
  'from-teal-500 to-emerald-800',
];

const getInitials = (name = 'U') => {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

const getAvatarGradient = (str = 'user') => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_GRADIENTS.length;
  return AVATAR_GRADIENTS[index];
};

export const LeaderboardModal = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState(() => cachedLeaderboardData || []);
  const [loading, setLoading] = useState(!cachedLeaderboardData);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('rankings'); // 'rankings' | 'badges'
  const [displayCount, setDisplayCount] = useState(50);
  const [toastText, setToastText] = useState('');
  const badgesScrollRef = useRef(null);
  const toastTimerRef = useRef(null);
  const searchInputRef = useRef(null);

  const scrollBadges = (direction) => {
    if (badgesScrollRef.current) {
      badgesScrollRef.current.scrollBy({ left: direction * 280, behavior: 'smooth' });
    }
  };

  const showToast = (msg) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastText(msg);
    toastTimerRef.current = setTimeout(() => setToastText(''), 4000);
  };

  const handleShareRank = (student) => {
    const s = student || currentUserRank;
    if (!s) {
      showToast('⚠️ Please log in to share your personal ranking on LinkedIn.');
      return;
    }

    shareRankingOnLinkedIn({
      studentName: s.name || user?.name || 'DevOps Learner',
      rank: s.rank || 1,
      points: s.points || 0,
      completedCount: s.completedCount || 0,
      quizzesPassed: s.quizzesPassed || 0,
    });
    showToast('🚀 Your personal ranking caption copied to clipboard & LinkedIn opened!');
  };

  const userCompleted = user?.completedSessions || [];
  const userQuizzes = user?.quizProgress || [];

  // Calculate unlocked status and progress per module
  // Requirement: Badge unlocks ONLY when all module sessions are marked as done AND quizzes passed
  const curriculumBadgesWithStatus = useMemo(() => {
    return CURRICULUM_MODULE_BADGES.map((b) => {
      const totalSessions = b.sessions.length;

      // Fully finished = session is marked as done AND quiz is completed & passed
      const fullyCompletedSessions = b.sessions.filter((sNum) => {
        const isDone = userCompleted.includes(sNum);
        const isQuizPassed = userQuizzes.some((q) => Number(q.sessionNumber) === sNum && q.passed);
        return isDone && isQuizPassed;
      });

      const fullyFinishedCount = fullyCompletedSessions.length;
      const completedSessionsCount = b.sessions.filter((sNum) => userCompleted.includes(sNum)).length;
      const quizzesPassedCount = b.sessions.filter((sNum) => 
        userQuizzes.some((q) => Number(q.sessionNumber) === sNum && q.passed)
      ).length;

      // Badge unlocks only when all sessions in this module are both marked done & quiz passed
      const isUnlocked = totalSessions > 0 && fullyFinishedCount >= totalSessions;

      return {
        ...b,
        fullyFinishedCount,
        completedSessionsCount,
        quizzesPassedCount,
        totalSessions,
        isUnlocked,
      };
    });
  }, [userCompleted, userQuizzes]);

  const unlockedCount = useMemo(() => {
    return curriculumBadgesWithStatus.filter((b) => b.isUnlocked).length;
  }, [curriculumBadgesWithStatus]);

  const handleDownloadCurriculumBadge = (badge) => {
    if (!badge.isUnlocked) {
      showToast(`🔒 Module ${badge.moduleNumber} is locked. Complete module sessions to unlock!`);
      return;
    }

    downloadHexagonBadgeImage({
      moduleNumber: badge.moduleNumber,
      title: badge.title,
      subtitle: badge.subtitle,
      gradient: badge.gradient,
      studentName: user?.name || 'DevOps Engineer',
    });
    showToast(`📥 Downloaded ${badge.title} Hexagon Achievement Badge!`);
  };

  const handleShareCurriculumBadge = (badge) => {
    if (!badge.isUnlocked) {
      showToast(`🔒 Module ${badge.moduleNumber} is locked. Complete module sessions to unlock!`);
      return;
    }

    shareBadgeOnLinkedIn({
      badgeName: `Module ${badge.moduleNumber}: ${badge.title} (${badge.subtitle})`,
      badgeIcon: '🛡️',
      studentName: user?.name || 'DevOps Engineer',
    });
    showToast(`🎖️ Caption for "${badge.title}" copied & LinkedIn opened!`);
  };

  const fetchLeaderboard = async (isManual = false) => {
    if (!cachedLeaderboardData || isManual) {
      setLoading(true);
    }
    try {
      const res = await api.getLeaderboard();
      if (res && res.success) {
        const list = res.leaderboard || [];
        cachedLeaderboardData = list;
        setLeaderboard(list);
      }
    } catch (err) {
      console.error('Failed to load leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchLeaderboard();
    }
  }, [isOpen]);

  // Memoized filter for instantaneous 60fps search
  const filteredLeaderboard = useMemo(() => {
    if (!searchQuery.trim()) return leaderboard;
    const q = searchQuery.toLowerCase().trim();
    return leaderboard.filter((item) =>
      item.name?.toLowerCase().includes(q) ||
      item.email?.toLowerCase().includes(q)
    );
  }, [leaderboard, searchQuery]);

  const top3 = useMemo(() => leaderboard.slice(0, 3), [leaderboard]);

  const currentUserRank = useMemo(() => {
    if (!user) return null;
    return leaderboard.find(
      (item) => item.id === user.id || item.email?.toLowerCase() === user.email?.toLowerCase()
    );
  }, [leaderboard, user]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative bg-[#0d1117] border border-[#30363d] w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col text-[#f0f6fc] will-change-transform"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Toast Notification */}
        {toastText && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-2xl flex items-center space-x-2 animate-bounce border border-emerald-400">
            <Check className="w-4 h-4 flex-shrink-0" />
            <span>{toastText}</span>
          </div>
        )}

        {/* Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-[#30363d] bg-[#161b22] flex items-center justify-between gap-3 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white">Student Leaderboard & Badges</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#21262d] text-emerald-400 border border-[#30363d] flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Live</span>
                </span>
              </div>
              <p className="text-xs text-[#8b949e]">
                Rankings based on quizzes passed, lab checkpoints, and engineering challenges.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => fetchLeaderboard(true)}
              className="p-1.5 rounded-lg border border-[#30363d] bg-[#21262d] text-[#8b949e] hover:text-white transition-colors cursor-pointer"
              title="Refresh Leaderboard"
            >
              <RotateCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#58a6ff]' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#8b949e] hover:text-white hover:bg-[#21262d] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* View Switcher Bar */}
        <div className="px-5 sm:px-6 py-2.5 border-b border-[#30363d] bg-[#0d1117] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 flex-shrink-0">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('rankings')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'rankings'
                  ? 'bg-[#238636] text-white shadow-xs'
                  : 'bg-[#21262d] text-[#8b949e] hover:text-white'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Rankings ({leaderboard.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('badges')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'badges'
                  ? 'bg-[#238636] text-white shadow-xs'
                  : 'bg-[#21262d] text-[#8b949e] hover:text-white'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Badges ({CURRICULUM_MODULE_BADGES.length})</span>
            </button>
          </div>

          {activeTab === 'rankings' && (
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-[#8b949e] absolute left-2.5 top-2.5 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-7 py-1.5 text-xs rounded-xl border border-[#30363d] bg-[#010409] text-white placeholder-[#8b949e] outline-none focus:border-[#58a6ff] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-2 text-[10px] text-[#8b949e] hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
          )}
        </div>

        {/* Body */}
        <div 
          className="flex-1 overflow-y-auto custom-scrollbar p-5 sm:p-6 space-y-5"
          style={{ overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch' }}
        >
          {activeTab === 'rankings' ? (
            <>
              {/* Podium: Top 3 */}
              {!searchQuery && top3.length >= 3 && (
                <div className="grid grid-cols-3 gap-3 pt-1 pb-4 border-b border-[#30363d]">
                  
                  {/* 2nd Place */}
                  <div className="flex flex-col items-center justify-end p-3 rounded-2xl bg-[#161b22] border border-[#30363d] text-center">
                    <span className="text-xl">🥈</span>
                    <span className="text-[10px] font-bold text-[#8b949e] uppercase mt-0.5">Rank #2</span>
                    
                    <div className="w-10 h-10 rounded-full border-2 border-slate-300 bg-gradient-to-tr from-slate-400 to-slate-200 text-slate-900 font-extrabold flex items-center justify-center text-xs shadow-sm my-1.5">
                      {getInitials(top3[1].name)}
                    </div>

                    <p className="text-xs font-bold text-white truncate max-w-[100px]">{top3[1].name}</p>
                    <span className="text-xs font-mono font-bold text-slate-300 mt-0.5">{top3[1].points} pts</span>
                    <div className="mt-1 text-[10px] text-emerald-400 font-semibold">
                      {top3[1].completedCount}/55 Labs
                    </div>

                    {user && (top3[1].id === user.id || top3[1].email?.toLowerCase() === user.email?.toLowerCase()) && (
                      <button
                        onClick={() => handleShareRank(top3[1])}
                        className="mt-2 px-2 py-0.5 rounded-md bg-[#21262d] hover:bg-[#0a66c2] hover:text-white text-[#8b949e] text-[10px] font-semibold flex items-center space-x-1 border border-[#30363d] transition-colors cursor-pointer"
                        title="Share your Rank #2 on LinkedIn"
                      >
                        <LinkedInIcon className="w-3 h-3 fill-current" />
                        <span>Share Rank</span>
                      </button>
                    )}
                  </div>

                  {/* 1st Place Champion */}
                  <div className="flex flex-col items-center justify-end p-4 rounded-2xl bg-[#161b22] border-2 border-amber-500/60 text-center shadow-lg shadow-amber-500/10 scale-102">
                    <span className="text-2xl">🥇</span>
                    <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider mt-0.5">Champion #1</span>
                    
                    <div className="w-12 h-12 rounded-full border-2 border-amber-400 bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 font-black flex items-center justify-center text-sm shadow-md my-1.5">
                      {getInitials(top3[0].name)}
                    </div>

                    <p className="text-sm font-bold text-white truncate max-w-[120px]">{top3[0].name}</p>
                    <span className="text-sm font-mono font-extrabold text-amber-400 mt-0.5">{top3[0].points} pts</span>
                    <div className="mt-1 flex items-center space-x-1 text-[10px] text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{top3[0].completedCount}/55 Labs</span>
                    </div>

                    {user && (top3[0].id === user.id || top3[0].email?.toLowerCase() === user.email?.toLowerCase()) && (
                      <button
                        onClick={() => handleShareRank(top3[0])}
                        className="mt-2 px-2.5 py-1 rounded-lg bg-[#0a66c2] hover:bg-[#004182] text-white text-[10px] font-bold flex items-center space-x-1 shadow-sm transition-colors cursor-pointer"
                        title="Share your Champion Standing on LinkedIn"
                      >
                        <LinkedInIcon className="w-3 h-3 fill-current" />
                        <span>Share on LinkedIn</span>
                      </button>
                    )}
                  </div>

                  {/* 3rd Place */}
                  <div className="flex flex-col items-center justify-end p-3 rounded-2xl bg-[#161b22] border border-[#30363d] text-center">
                    <span className="text-xl">🥉</span>
                    <span className="text-[10px] font-bold text-[#8b949e] uppercase mt-0.5">Rank #3</span>
                    
                    <div className="w-10 h-10 rounded-full border-2 border-amber-700 bg-gradient-to-tr from-amber-700 to-amber-600 text-amber-100 font-extrabold flex items-center justify-center text-xs shadow-sm my-1.5">
                      {getInitials(top3[2].name)}
                    </div>

                    <p className="text-xs font-bold text-white truncate max-w-[100px]">{top3[2].name}</p>
                    <span className="text-xs font-mono font-bold text-amber-500 mt-0.5">{top3[2].points} pts</span>
                    <div className="mt-1 text-[10px] text-emerald-400 font-semibold">
                      {top3[2].completedCount}/55 Labs
                    </div>

                    {user && (top3[2].id === user.id || top3[2].email?.toLowerCase() === user.email?.toLowerCase()) && (
                      <button
                        onClick={() => handleShareRank(top3[2])}
                        className="mt-2 px-2 py-0.5 rounded-md bg-[#21262d] hover:bg-[#0a66c2] hover:text-white text-[#8b949e] text-[10px] font-semibold flex items-center space-x-1 border border-[#30363d] transition-colors cursor-pointer"
                        title="Share your Rank #3 on LinkedIn"
                      >
                        <LinkedInIcon className="w-3 h-3 fill-current" />
                        <span>Share Rank</span>
                      </button>
                    )}
                  </div>

                </div>
              )}

              {/* Personal Rank Banner (If Logged In) */}
              {currentUserRank && (
                <div className="p-3.5 rounded-xl bg-[#161b22] border border-[#58a6ff]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-lg bg-[#58a6ff]/20 text-[#58a6ff] font-bold text-sm flex items-center justify-center flex-shrink-0">
                      #{currentUserRank.rank}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white flex items-center space-x-2">
                        <span>Your Standing: {currentUserRank.name}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#238636] text-white font-bold">You</span>
                      </p>
                      <p className="text-[11px] text-[#8b949e]">
                        {currentUserRank.completedCount} sessions completed • {currentUserRank.quizzesPassed} quizzes passed
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 justify-between sm:justify-end">
                    <div className="text-right">
                      <span className="text-sm font-bold font-mono text-amber-400">{currentUserRank.points} PTS</span>
                      <p className="text-[10px] text-emerald-400 font-semibold">Keep learning to rank up!</p>
                    </div>
                    <button
                      onClick={() => handleShareRank(currentUserRank)}
                      className="px-3 py-1.5 rounded-xl bg-[#0a66c2] hover:bg-[#004182] text-white text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-all cursor-pointer flex-shrink-0"
                      title="Share your ranking & stats on LinkedIn"
                    >
                      <LinkedInIcon className="w-3.5 h-3.5 fill-current" />
                      <span>Share Rank</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Rankings Table (No External Images - Ultra Fast Native Render) */}
              <div className="border border-[#30363d] rounded-2xl overflow-x-auto custom-scrollbar bg-[#010409]">
                <table className="w-full min-w-[560px] text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#161b22] border-b border-[#30363d] text-[#8b949e] uppercase text-[10px] font-semibold">
                      <th className="py-3 px-4 w-16 text-center">Rank</th>
                      <th className="py-3 px-4">Student</th>
                      <th className="py-3 px-4 text-center">Sessions</th>
                      <th className="py-3 px-4 text-center">Quizzes</th>
                      <th className="py-3 px-4">Badges</th>
                      <th className="py-3 px-4 text-right">Points</th>
                      <th className="py-3 px-3 w-12 text-center">Share</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#21262d]">
                    {loading && leaderboard.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-[#8b949e]">
                          <RotateCw className="w-5 h-5 animate-spin mx-auto text-[#58a6ff] mb-2" />
                          <span>Loading leaderboard...</span>
                        </td>
                      </tr>
                    ) : filteredLeaderboard.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 px-4 text-center text-[#8b949e]">
                          <Trophy className="w-8 h-8 text-[#484f58] mx-auto mb-2 opacity-50" />
                          <span>No students found matching "{searchQuery || 'current filters'}"</span>
                        </td>
                      </tr>
                    ) : (
                      filteredLeaderboard.slice(0, displayCount).map((student) => {
                        const isMe = user && (student.id === user.id || student.email?.toLowerCase() === user.email?.toLowerCase());
                        const gradient = getAvatarGradient(student.name);
                        const initials = getInitials(student.name);

                        return (
                          <tr 
                            key={student.id || student.rank} 
                            style={{ contentVisibility: 'auto', containIntrinsicSize: '0 45px' }}
                            className={`transition-colors ${
                              isMe ? 'bg-[#58a6ff]/10 font-semibold' : 'hover:bg-[#161b22]/70'
                            }`}
                          >
                            <td className="py-3 px-4 text-center">
                              {student.rank === 1 ? (
                                <span className="text-base">🥇</span>
                              ) : student.rank === 2 ? (
                                <span className="text-base">🥈</span>
                              ) : student.rank === 3 ? (
                                <span className="text-base">🥉</span>
                              ) : (
                                <span className="font-mono text-xs text-[#8b949e] font-semibold">#{student.rank}</span>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center space-x-2.5">
                                {/* Pure CSS Initials Avatar - Zero Network Overhead */}
                                <div className={`w-7 h-7 rounded-full bg-gradient-to-tr ${gradient} text-white font-bold text-[11px] flex items-center justify-center flex-shrink-0 shadow-2xs`}>
                                  {initials}
                                </div>
                                <div className="min-w-0">
                                  <p className="font-bold text-white truncate text-xs flex items-center space-x-1">
                                    <span>{student.name}</span>
                                    {isMe && <span className="text-[10px] px-1 rounded bg-[#238636] text-white">You</span>}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-center font-mono text-[#c9d1d9]">
                              {student.completedCount}/55
                            </td>
                            <td className="py-3 px-4 text-center font-mono text-emerald-400 font-semibold">
                              {student.quizzesPassed}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex flex-wrap gap-1 max-w-xs">
                                {student.badges && student.badges.slice(0, 2).map((b, i) => (
                                  <span key={i} className="text-[10px] px-1.5 py-0.2 rounded-md bg-[#21262d] border border-[#30363d] text-[#c9d1d9]">
                                    {b}
                                  </span>
                                ))}
                                {student.badges && student.badges.length > 2 && (
                                  <span className="text-[10px] text-[#8b949e]">+{student.badges.length - 2}</span>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-right font-mono font-bold text-amber-400">
                              {student.points} pts
                            </td>
                            <td className="py-3 px-3 text-center">
                              {isMe ? (
                                <button
                                  onClick={() => handleShareRank(currentUserRank || student)}
                                  className="p-1 rounded-md bg-[#0a66c2]/20 text-[#58a6ff] hover:bg-[#0a66c2] hover:text-white transition-colors cursor-pointer"
                                  title="Share your ranking on LinkedIn"
                                >
                                  <LinkedInIcon className="w-3.5 h-3.5 fill-current" />
                                </button>
                              ) : (
                                <span className="text-[10px] text-[#30363d] select-none">—</span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Show more button if list is long */}
              {filteredLeaderboard.length > displayCount && (
                <div className="text-center pt-2">
                  <button
                    onClick={() => setDisplayCount((prev) => prev + 50)}
                    className="px-4 py-1.5 rounded-xl border border-[#30363d] bg-[#161b22] hover:bg-[#21262d] text-xs font-semibold text-[#8b949e] hover:text-white transition-colors cursor-pointer"
                  >
                    Show More ({filteredLeaderboard.length - displayCount} remaining)
                  </button>
                </div>
              )}
            </>
          ) : (
            /* Batch 45 Curriculum Module Badges matching user specifications */
            <div className="space-y-4">
              {/* Header with Module Progress and Smooth Scroll Buttons */}
              <div className="p-4 rounded-2xl bg-[#161b22] border border-[#30363d] flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center space-x-3 flex-wrap gap-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">🎖️</span>
                    <h4 className="text-sm font-bold text-white tracking-wide">
                      Batch 45 Curriculum Module Badges
                    </h4>
                  </div>
                  <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-[#58a6ff]/15 text-[#58a6ff] border border-[#58a6ff]/30">
                    {unlockedCount} / 10 Unlocked
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#21262d] text-[#8b949e] border border-[#30363d]">
                    Complete Sessions & Pass Quizzes to Unlock
                  </span>
                </div>

                {/* Carousel Left / Right Scroll Buttons */}
                <div className="flex items-center space-x-1 self-end md:self-auto">
                  <button
                    onClick={() => scrollBadges(-1)}
                    className="p-1.5 rounded-lg border border-[#30363d] bg-[#21262d] text-[#8b949e] hover:text-white hover:border-[#58a6ff]/50 transition-colors cursor-pointer"
                    title="Scroll badges left"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => scrollBadges(1)}
                    className="p-1.5 rounded-lg border border-[#30363d] bg-[#21262d] text-[#8b949e] hover:text-white hover:border-[#58a6ff]/50 transition-colors cursor-pointer"
                    title="Scroll badges right"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Horizontal Scrollable Carousel with Containment & High-FPS Scrolling */}
              <div 
                ref={badgesScrollRef}
                className="overflow-x-auto custom-scrollbar pb-3 pt-1 scroll-smooth overscroll-x-contain will-change-scroll"
                style={{ overscrollBehaviorX: 'contain', WebkitOverflowScrolling: 'touch' }}
              >
                <div className="flex space-x-3.5 min-w-max px-1">
                  {curriculumBadgesWithStatus.map((badge, idx) => (
                    <div 
                      key={idx} 
                      className={`flex-shrink-0 flex flex-col items-center justify-between p-3.5 rounded-2xl border transition-colors duration-150 ${
                        badge.isUnlocked 
                          ? 'bg-[#161b22]/90 border-[#30363d] hover:border-[#58a6ff]/50 shadow-lg' 
                          : 'bg-[#0d1117]/80 border-[#21262d]'
                      }`}
                      style={{ width: 184, contain: 'layout style paint' }}
                    >
                      {/* Hexagon Shield Badge Component */}
                      <div className="my-1">
                        <ModuleBadgeHexagon
                          moduleNumber={badge.moduleNumber}
                          title={badge.title}
                          subtitle={badge.subtitle}
                          isUnlocked={badge.isUnlocked}
                          gradient={badge.gradient}
                          size={145}
                        />
                      </div>

                      {/* Progress: Real Session & Quiz Completion */}
                      <div className="mt-2 text-center w-full">
                        <div className="text-xs font-bold mb-1">
                          {badge.isUnlocked ? (
                            <span className="text-emerald-400 flex items-center justify-center space-x-1">
                              <span>✓</span>
                              <span>Completed ({badge.fullyFinishedCount}/{badge.totalSessions})</span>
                            </span>
                          ) : (
                            <span className="text-[#8b949e] flex items-center justify-center space-x-1">
                              <span>🔒</span>
                              <span>{badge.fullyFinishedCount}/{badge.totalSessions} Completed</span>
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-[#8b949e] mb-2 font-medium">
                          {badge.quizzesPassedCount}/{badge.totalSessions} Quizzes Passed
                        </div>

                        {/* Actions: Download & Share enabled ONLY if unlocked */}
                        {badge.isUnlocked ? (
                          <div className="flex items-center justify-center space-x-1.5 w-full">
                            <button
                              onClick={() => handleDownloadCurriculumBadge(badge)}
                              className="flex-1 py-1 px-1.5 rounded-lg border border-[#30363d] bg-[#21262d] hover:bg-[#30363d] text-[10px] font-semibold text-white flex items-center justify-center space-x-1 transition-colors cursor-pointer"
                              title="Download HD Hexagon Badge PNG"
                            >
                              <Download className="w-3 h-3 text-[#58a6ff]" />
                              <span>Download</span>
                            </button>
                            <button
                              onClick={() => handleShareCurriculumBadge(badge)}
                              className="flex-1 py-1 px-1.5 rounded-lg bg-[#0a66c2] hover:bg-[#004182] text-white text-[10px] font-semibold flex items-center justify-center space-x-1 transition-colors cursor-pointer shadow-xs"
                              title="Share on LinkedIn"
                            >
                              <LinkedInIcon className="w-3 h-3 fill-current" />
                              <span>Share</span>
                            </button>
                          </div>
                        ) : (
                          <div className="w-full">
                            <button
                              disabled
                              className="w-full py-1 px-2 rounded-lg bg-[#21262d]/50 border border-[#30363d]/30 text-[#8b949e] text-[10px] font-semibold cursor-not-allowed opacity-60"
                              title="Mark all sessions as done & pass all quizzes to unlock this module badge"
                            >
                              🔒 Locked
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

