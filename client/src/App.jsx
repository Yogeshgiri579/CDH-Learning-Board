import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from './context/AuthContext';
import { api } from './services/api';
import { initialSessions, modulesList } from './data/sessions';
import { Navbar } from './components/Navbar';
import { Header } from './components/Header';
import { ProgressBanner } from './components/ProgressBanner';
import { CurriculumSheet } from './components/CurriculumSheet';
import { SessionCard } from './components/SessionCard';
import { SessionPreviewModal } from './components/SessionPreviewModal';
import { GitHubPreviewModal } from './components/GitHubPreviewModal';
import { QuickQuizModal } from './components/QuickQuizModal';
import { TakeUForwardSidebar } from './components/TakeUForwardSidebar';
import { AuthModal } from './components/AuthModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { getQuizForSession, getQuizForModule } from './data/quizzes';
import { 
  Search, 
  Layers, 
  List,
  LayoutGrid,
  Lock,
  CheckCircle2,
  Clock,
  Sparkles,
  BookOpen,
  Terminal,
  X,
  ArrowLeft,
  ArrowRight,
  Filter
} from 'lucide-react';

const QUICK_SEARCH_TAGS = [
  { label: 'Docker', query: 'Docker' },
  { label: 'Kubernetes', query: 'Kubernetes' },
  { label: 'Terraform', query: 'Terraform' },
  { label: 'AWS', query: 'AWS' },
  { label: 'Linux', query: 'Linux' },
  { label: 'Git', query: 'Git' },
  { label: 'CI/CD', query: 'CI/CD' },
  { label: 'Observability', query: 'Observability' },
];

export function App() {
  const { isAuthenticated, isCompleted, toggleComplete } = useAuth();
  
  const [sessions, setSessions] = useState(initialSessions);
  const [activeTab, setActiveTab] = useState('explore'); // 'explore' | 'roadmap'
  const [viewMode, setViewMode] = useState('sheet'); // 'sheet' | 'grid'
  const [selectedSession, setSelectedSession] = useState(initialSessions[0]);
  const [previewModalSession, setPreviewModalSession] = useState(null);
  const [previewGithubSession, setPreviewGithubSession] = useState(null);
  const [quizModalState, setQuizModalState] = useState({
    isOpen: false,
    quizData: null,
    session: null,
    moduleTitle: null,
  });
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModule, setSelectedModule] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  const searchInputRef = useRef(null);
  const prepHubRef = useRef(null);

  // Fetch updated sessions from backend
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await api.getSessions();
        if (res.success && res.sessions?.length > 0) {
          setSessions(res.sessions);
          setSelectedSession((prev) => prev || res.sessions[0]);
        }
      } catch (err) {
        console.warn('Backend fetch failed, using local sessions cache:', err);
      }
    };

    fetchSessions();
  }, [isAuthenticated]);

  // Clean up any stale active session state on mount
  useEffect(() => {
    try {
      localStorage.removeItem('lastActiveSession');
    } catch {}
  }, []);

  // Keyboard shortcut ⌘K or Ctrl+K for search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setActiveTab('explore');
        setTimeout(() => searchInputRef.current?.focus(), 50);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter sessions
  const filteredSessions = sessions.filter((s) => {
    const matchesModule = selectedModule === 'all' || s.moduleId === selectedModule;
    const matchesDiff = selectedDifficulty === 'all' || s.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      !q || 
      s.title.toLowerCase().includes(q) || 
      s.preview.toLowerCase().includes(q) || 
      (s.topics && s.topics.some((t) => t.toLowerCase().includes(q)));

    return matchesModule && matchesDiff && matchesSearch;
  });

  // Action handlers
  const handleOpenGitHub = (session) => {
    setPreviewModalSession(null);
    setPreviewGithubSession(session);
    try {
      localStorage.setItem('lastActiveSession', String(session.sessionNumber));
    } catch {}
  };

  const handleOpenQuiz = async (session) => {
    let quiz = null;
    try {
      const res = await api.getQuizForSession(session.sessionNumber);
      if (res && res.success && res.questions && res.questions.length > 0) {
        quiz = {
          id: `quiz_s${session.sessionNumber}`,
          title: `Session #${session.sessionNumber}: ${session.title} Quiz`,
          description: `Interactive knowledge check for Session #${session.sessionNumber}`,
          questions: res.questions.map((q) => ({
            ...q,
            id: q._id || q.id,
          })),
        };
      }
    } catch (err) {
      console.warn('Backend quiz fetch failed, using fallback bank:', err);
    }

    if (!quiz) {
      quiz = getQuizForSession(session);
    }

    setQuizModalState({
      isOpen: true,
      quizData: quiz,
      session,
      moduleTitle: session.module,
    });
  };

  const handleOpenModuleQuiz = (moduleId, moduleTitle) => {
    const quiz = getQuizForModule(moduleId);
    if (!quiz) return;
    setQuizModalState({
      isOpen: true,
      quizData: quiz,
      session: null,
      moduleTitle,
    });
  };

  const handleStartNow = () => {
    if (prepHubRef.current) {
      prepHubRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePreviewSession = (session) => {
    setPreviewModalSession(session);
  };

  return (
    <div className="min-h-screen bg-[#010409] text-[#f0f6fc] flex flex-col font-sans">
      
      {/* Top Navbar */}
      <Navbar 
        onSearchClick={() => {
          setActiveTab('explore');
          setTimeout(() => searchInputRef.current?.focus(), 50);
        }}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLeaderboardClick={() => setLeaderboardOpen(true)}
      />

      {/* Hero Header on Explore view */}
      {activeTab === 'explore' && (
        <Header 
          onStartNow={handleStartNow}
          onPreviewSession0={handlePreviewSession}
          firstSession={sessions[0]}
          onSwitchToRoadmap={() => setActiveTab('roadmap')}
        />
      )}

      {/* Progress & Milestone Banner */}
      <ProgressBanner totalSessions={55} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6" ref={prepHubRef}>
        
        {/* VIEW 1: PREP HUB EXPLORE VIEW */}
        {activeTab === 'explore' && (
          <div className="space-y-5">
            
            {/* Filter and Search Bar Section */}
            <div className={`p-3.5 sm:p-5 rounded-2xl border transition-all duration-300 shadow-md space-y-3.5 ${
              searchQuery.trim()
                ? 'bg-gradient-to-b from-[#161b22] to-[#0d1117] border-[#58a6ff]/60 shadow-[#58a6ff]/10 ring-1 ring-[#58a6ff]/30'
                : 'bg-[#0d1117] border-[#30363d]'
            }`}>
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                {/* Search Input with Dynamic Glow */}
                <div className="relative flex-1 group">
                  <Search className={`w-4 h-4 absolute left-3.5 top-3 transition-colors ${
                    searchQuery ? 'text-[#58a6ff]' : 'text-[#8b949e]'
                  }`} />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search sessions (e.g. Docker, Linux, K8s, AWS, Terraform, CI/CD)..."
                    className="w-full pl-9 pr-14 py-2.5 text-xs sm:text-sm rounded-xl border border-[#30363d] bg-[#010409] text-[#f0f6fc] focus:border-[#58a6ff] focus:ring-2 focus:ring-[#58a6ff]/20 outline-none transition-all placeholder:text-[#8b949e]"
                  />
                  {searchQuery ? (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-2.5 px-2 py-0.5 rounded-md text-xs font-bold bg-[#21262d] text-[#8b949e] hover:text-white hover:bg-rose-500/20 hover:text-rose-300 border border-[#30363d] transition-all cursor-pointer"
                      title="Clear Search"
                    >
                      Clear ✕
                    </button>
                  ) : (
                    <span className="hidden sm:inline absolute right-3 top-2.5 px-1.5 py-0.5 text-[10px] text-[#8b949e] font-mono bg-[#161b22] rounded border border-[#30363d]">
                      ⌘K
                    </span>
                  )}
                </div>

                {/* Controls: Difficulty + 3-Way View Switcher (Sheet, Cards, Tree View) */}
                <div className="flex items-center space-x-2">
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="px-2.5 py-2.5 text-xs font-semibold rounded-xl border border-[#30363d] bg-[#161b22] text-[#c9d1d9] outline-none hover:border-[#8b949e] cursor-pointer"
                  >
                    <option value="all">All Difficulties</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>

                  {/* Unified View Mode Switcher: Sheet | Cards | Tree View */}
                  <div className="flex items-center rounded-xl border border-[#30363d] bg-[#161b22] p-1 shadow-2xs">
                    <button
                      onClick={() => {
                        setActiveTab('explore');
                        setViewMode('sheet');
                      }}
                      title="Curriculum Sheet View"
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                        activeTab === 'explore' && viewMode === 'sheet'
                          ? 'bg-[#21262d] text-white shadow-xs border border-[#30363d]'
                          : 'text-[#8b949e] hover:text-[#f0f6fc]'
                      }`}
                    >
                      <List className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Sheet</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('explore');
                        setViewMode('grid');
                      }}
                      title="Cards Grid View"
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                        activeTab === 'explore' && viewMode === 'grid'
                          ? 'bg-[#21262d] text-white shadow-xs border border-[#30363d]'
                          : 'text-[#8b949e] hover:text-[#f0f6fc]'
                      }`}
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Cards</span>
                    </button>

                    <button
                      onClick={() => setActiveTab('roadmap')}
                      title="Roadmap Tree View"
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                        activeTab === 'roadmap'
                          ? 'bg-[#21262d] text-[#58a6ff] shadow-xs border border-[#30363d]'
                          : 'text-[#8b949e] hover:text-[#f0f6fc]'
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5 text-[#58a6ff]" />
                      <span className="hidden sm:inline">Tree View</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Search Tag Pills for Instant Filtering */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                <span className="text-[#8b949e] text-[11px] font-medium flex items-center space-x-1 flex-shrink-0 mr-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Quick Filter:</span>
                </span>
                {QUICK_SEARCH_TAGS.map((tag) => {
                  const isSelected = searchQuery.toLowerCase() === tag.query.toLowerCase();
                  return (
                    <button
                      key={tag.label}
                      onClick={() => setSearchQuery(isSelected ? '' : tag.query)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all whitespace-nowrap cursor-pointer ${
                        isSelected
                          ? 'bg-[#58a6ff]/20 text-[#58a6ff] border border-[#58a6ff]/50 shadow-2xs'
                          : 'bg-[#161b22] text-[#8b949e] hover:text-white hover:bg-[#21262d] border border-[#30363d]'
                      }`}
                    >
                      {tag.label}
                    </button>
                  );
                })}
              </div>

              {/* Module Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 custom-scrollbar text-xs border-t border-[#21262d] pt-3">
                {modulesList.map((m) => {
                  const isActive = selectedModule === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setSelectedModule(m.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center space-x-2 cursor-pointer ${
                        isActive
                          ? 'bg-[#238636] text-white border border-[#238636] shadow-sm'
                          : 'bg-[#161b22] border border-[#30363d] text-[#c9d1d9] hover:bg-[#21262d] hover:text-white'
                      }`}
                    >
                      <span>{m.name.split(':')[1] ? m.name.split(':')[0] : m.name}</span>
                      <span className={`text-[11px] px-1.5 py-0.5 rounded-full font-bold ${
                        isActive ? 'bg-[#1b6b2b] text-white' : 'bg-[#21262d] text-[#8b949e]'
                      }`}>
                        {m.count}
                      </span>
                    </button>
                  );
                })}
              </div>

            </div>

            {/* Results count & Free Trial Notice */}
            <div className="flex items-center justify-between px-1 text-xs text-[#8b949e]">
              <p>
                Showing <span className="text-white font-bold">{filteredSessions.length}</span> of 55 sessions
                {searchQuery && (
                  <span className="ml-2 font-semibold text-[#58a6ff]">
                    matching "{searchQuery}"
                  </span>
                )}
              </p>
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center space-x-1 text-[#3fb950] font-semibold bg-[#238636]/15 px-2 py-0.5 rounded border border-[#238636]/40">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3fb950]"></span>
                  <span>Sessions 00–04 Free</span>
                </span>
                <span className="text-[#30363d] hidden sm:inline">|</span>
                <span className="hidden sm:inline text-[#8b949e]">Sessions 05–54 unlocked on sign-in</span>
              </div>
            </div>

            {/* MAIN CONTENT REPRESENTATION */}
            {viewMode === 'sheet' ? (
              <CurriculumSheet
                sessions={filteredSessions}
                onPreview={handlePreviewSession}
                onOpenGitHub={handleOpenGitHub}
                onOpenQuiz={handleOpenQuiz}
                onOpenModuleQuiz={handleOpenModuleQuiz}
                searchQuery={searchQuery}
                selectedModule={selectedModule}
                onClearSearch={() => setSearchQuery('')}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in duration-200">
                {filteredSessions.map((session) => (
                  <SessionCard
                    key={session.id}
                    session={session}
                    onPreview={handlePreviewSession}
                    onOpenGitHub={handleOpenGitHub}
                    onOpenQuiz={handleOpenQuiz}
                  />
                ))}
              </div>
            )}

            {filteredSessions.length === 0 && (
              <div className="bg-[#0d1117] rounded-2xl border border-[#30363d] p-10 text-center max-w-md mx-auto shadow-md animate-in fade-in zoom-in-95 duration-200">
                <div className="w-12 h-12 rounded-2xl bg-[#21262d] border border-[#30363d] flex items-center justify-center mx-auto mb-3 text-[#58a6ff]">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-[#f0f6fc]">No sessions match your search</h3>
                <p className="text-xs text-[#8b949e] mt-1.5 leading-relaxed">
                  We couldn't find any sessions matching <span className="text-white font-semibold">"{searchQuery}"</span>. Try checking for keywords like "Linux", "Docker", "AWS", "Terraform", or clear your filter.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedModule('all');
                    setSelectedDifficulty('all');
                  }}
                  className="mt-4 px-4 py-2 bg-[#238636] hover:bg-[#2ea043] text-white rounded-xl text-xs font-bold cursor-pointer transition-all shadow-xs"
                >
                  Clear All Filters
                </button>
              </div>
            )}

          </div>
        )}

        {/* VIEW 2: TAKEUFORWARD ROADMAP TREE VIEW */}
        {activeTab === 'roadmap' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Top Bar inside Roadmap View with Switchers back to Sheet / Cards */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-[#0d1117] border border-[#30363d] shadow-sm">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setActiveTab('explore')}
                  className="p-2 rounded-xl bg-[#161b22] hover:bg-[#21262d] border border-[#30363d] text-[#c9d1d9] hover:text-white transition-colors cursor-pointer"
                  title="Back to Curriculum Modules"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-base font-bold text-white">Roadmap Tree View</h2>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#58a6ff]/20 text-[#58a6ff] border border-[#58a6ff]/30">
                      Interactive Tree
                    </span>
                  </div>
                  <p className="text-xs text-[#8b949e]">
                    TakeUForward-style hierarchical session navigator with instant markdown previews & quizzes.
                  </p>
                </div>
              </div>

              {/* View mode switcher */}
              <div className="flex items-center space-x-2 self-end sm:self-auto">
                <div className="flex items-center rounded-xl border border-[#30363d] bg-[#161b22] p-1 shadow-2xs">
                  <button
                    onClick={() => {
                      setActiveTab('explore');
                      setViewMode('sheet');
                    }}
                    title="Switch to Sheet View"
                    className="px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 text-[#8b949e] hover:text-[#f0f6fc] transition-colors cursor-pointer"
                  >
                    <List className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Sheet</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('explore');
                      setViewMode('grid');
                    }}
                    title="Switch to Cards View"
                    className="px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 text-[#8b949e] hover:text-[#f0f6fc] transition-colors cursor-pointer"
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Cards</span>
                  </button>
                  <button
                    disabled
                    title="Currently on Tree View"
                    className="px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 bg-[#21262d] text-[#58a6ff] border border-[#30363d] shadow-xs cursor-default"
                  >
                    <Layers className="w-3.5 h-3.5 text-[#58a6ff]" />
                    <span className="hidden sm:inline">Tree View</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Tree Container */}
            <div className="bg-[#0d1117] rounded-2xl border border-[#30363d] shadow-sm overflow-hidden flex flex-col lg:flex-row min-h-[650px] text-[#f0f6fc]">
              
              {/* Left: TakeUForward Style Collapsible Tree Sidebar */}
              <TakeUForwardSidebar
                sessions={sessions}
                selectedSession={selectedSession}
                onSelectSession={(s) => setSelectedSession(s)}
                onOpenGitHub={handleOpenGitHub}
                onOpenQuiz={handleOpenQuiz}
                onOpenModuleQuiz={handleOpenModuleQuiz}
                onResetView={() => {
                  setActiveTab('explore');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />

              {/* Right: Selected Session Detailed Preview Panel */}
              <div className="flex-1 p-5 lg:p-7 overflow-y-auto">
                {selectedSession ? (
                  <div className="max-w-2xl space-y-5">
                    
                    {/* Top breadcrumb & Status */}
                    <div className="flex flex-wrap items-center justify-between gap-2.5 pb-3 border-b border-[#30363d]">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#21262d] text-[#58a6ff] border border-[#30363d]">
                          Session #{selectedSession.sessionNumber.toString().padStart(2, '0')}
                        </span>
                        {selectedSession.isFree ? (
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#238636]/20 text-[#3fb950] border border-[#238636]/40">
                            🟢 Free Access
                          </span>
                        ) : !isAuthenticated ? (
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-950/60 text-amber-400 border border-amber-800/60 flex items-center space-x-1">
                            <Lock className="w-3 h-3" />
                            <span>Requires Sign In</span>
                          </span>
                        ) : (
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#21262d] text-emerald-400 border border-[#30363d]">
                            ✓ Unlocked
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => toggleComplete(selectedSession.sessionNumber)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold border flex items-center space-x-1.5 transition-colors cursor-pointer ${
                          isCompleted(selectedSession.sessionNumber)
                            ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-400'
                            : 'bg-[#21262d] border-[#30363d] text-[#c9d1d9] hover:bg-[#30363d] hover:text-white'
                        }`}
                      >
                        <CheckCircle2 className={`w-3.5 h-3.5 ${isCompleted(selectedSession.sessionNumber) ? 'fill-emerald-400 text-slate-900' : 'text-[#8b949e]'}`} />
                        <span>{isCompleted(selectedSession.sessionNumber) ? 'Completed' : 'Mark Done'}</span>
                      </button>
                    </div>

                    {/* Title & Module */}
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-[#58a6ff]">
                        {selectedSession.module}
                      </p>
                      <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-0.5">
                        {selectedSession.title}
                      </h2>
                      <div className="flex items-center space-x-3 text-xs text-[#8b949e] mt-1.5">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3.5 h-3.5 text-[#8b949e]" />
                          <span>{selectedSession.duration}</span>
                        </span>
                        <span>•</span>
                        <span className="font-semibold text-[#c9d1d9]">Difficulty: {selectedSession.difficulty}</span>
                      </div>
                    </div>

                    {/* Preview Overview Box */}
                    <div className="p-4 rounded-xl bg-[#161b22] border border-[#30363d]">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#8b949e] mb-1.5 flex items-center space-x-1.5">
                        <Layers className="w-4 h-4 text-[#58a6ff]" />
                        <span>Session Overview</span>
                      </h4>
                      <p className="text-xs sm:text-sm text-[#c9d1d9] leading-relaxed">
                        {selectedSession.preview}
                      </p>
                    </div>

                    {/* Learning Topics */}
                    {selectedSession.topics && (
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#8b949e] mb-2 flex items-center space-x-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          <span>Core Topics</span>
                        </h4>
                        <div className="space-y-1.5">
                          {selectedSession.topics.map((topic, i) => (
                            <div key={i} className="flex items-start space-x-2.5 p-2.5 rounded-lg bg-[#161b22] border border-[#30363d] text-xs text-[#c9d1d9]">
                              <span className="w-4 h-4 rounded bg-[#21262d] text-[#58a6ff] border border-[#30363d] flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                                {i + 1}
                              </span>
                              <span>{topic}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Hands-on Labs */}
                    {selectedSession.labs && (
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#8b949e] mb-2 flex items-center space-x-1.5">
                          <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Practical Hands-on Labs</span>
                        </h4>
                        <div className="space-y-1.5">
                          {selectedSession.labs.map((lab, i) => (
                            <div key={i} className="flex items-center space-x-2.5 p-2.5 rounded-lg bg-[#161b22] border border-[#30363d] text-xs text-[#c9d1d9] font-medium">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                              <span>{lab}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Direct GitHub Redirect CTA Box */}
                    <div className="p-4 sm:p-5 rounded-xl bg-[#161b22] border border-[#30363d] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#58a6ff]">
                          Practice on GitHub
                        </p>
                        <h3 className="text-base font-bold text-white mt-0.5">
                          Open {selectedSession.folder}
                        </h3>
                        <p className="text-xs text-[#8b949e] mt-0.5 max-w-sm">
                          Get step-by-step README instructions, code, Dockerfiles, and submission templates.
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleOpenQuiz(selectedSession)}
                          className="px-3.5 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 font-semibold text-xs sm:text-sm transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                          title="Take quiz on this session"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          <span>Quick Quiz</span>
                        </button>

                        <button
                          onClick={() => handleOpenGitHub(selectedSession)}
                          className="px-4 py-2 rounded-xl bg-[#238636] hover:bg-[#2ea043] text-white font-semibold text-xs sm:text-sm transition-all flex items-center justify-center space-x-2 shadow-xs cursor-pointer flex-shrink-0"
                        >
                          {!selectedSession.isFree && !isAuthenticated ? (
                            <>
                              <Lock className="w-3.5 h-3.5" />
                              <span>Sign in to Unlock</span>
                            </>
                          ) : (
                            <>
                              <BookOpen className="w-3.5 h-3.5 text-white" />
                              <span>Read in App</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                  </div>
                ) : (
                  <div className="text-center py-20 text-[#8b949e] text-sm">
                    Select a session from the roadmap tree on the left.
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

      </main>

      {/* Session Preview Modal */}
      {previewModalSession && (
        <SessionPreviewModal
          session={previewModalSession}
          onClose={() => setPreviewModalSession(null)}
          onOpenGitHub={handleOpenGitHub}
          onOpenQuiz={handleOpenQuiz}
        />
      )}

      {/* In-App GitHub Markdown Preview Modal */}
      {previewGithubSession && (
        <GitHubPreviewModal
          session={previewGithubSession}
          allSessions={sessions}
          onClose={() => setPreviewGithubSession(null)}
          onSelectSession={(s) => setPreviewGithubSession(s)}
          onOpenQuiz={(s) => {
            setPreviewGithubSession(null);
            handleOpenQuiz(s);
          }}
        />
      )}

      {/* Quick Quiz Modal */}
      {quizModalState.isOpen && (
        <QuickQuizModal
          isOpen={quizModalState.isOpen}
          onClose={() => setQuizModalState({ isOpen: false, quizData: null, session: null, moduleTitle: null })}
          quizData={quizModalState.quizData}
          session={quizModalState.session}
          moduleTitle={quizModalState.moduleTitle}
          onOpenReader={handleOpenGitHub}
        />
      )}

      {/* Auth Modal (z-[100] renders on top of everything) */}
      <AuthModal />

      {/* Public Student Leaderboard Modal */}
      <LeaderboardModal 
        isOpen={leaderboardOpen} 
        onClose={() => setLeaderboardOpen(false)} 
      />

      {/* Floating WhatsApp Community Button in Bottom Right */}
      <FloatingWhatsApp />

      {/* Footer with WhatsApp Community Links */}
      <Footer />

    </div>
  );
}

export default App;
