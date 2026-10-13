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
import { Footer } from './components/Footer';
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
  Terminal,
  BookOpen
} from 'lucide-react';

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
    // In-App GitHub Preview Reader modal
    setPreviewModalSession(null);
    setPreviewGithubSession(session);
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
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col selection:bg-blue-600/30 selection:text-blue-200">
      
      {/* Top Navbar */}
      <Navbar 
        onSearchClick={() => {
          setActiveTab('explore');
          setTimeout(() => searchInputRef.current?.focus(), 50);
        }}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
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
            
            {/* Filter and Search Bar Section (Dark Theme) */}
            <div className="bg-[#0d1322] p-3.5 sm:p-4 rounded-xl border border-slate-800 shadow-sm space-y-3">
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                {/* Search Input */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search sessions (e.g. Docker, Linux, K8s, AWS, Terraform, CI/CD)..."
                    className="w-full pl-9 pr-12 py-2 text-xs sm:text-sm rounded-lg border border-slate-700/80 bg-[#080d19] text-white focus:bg-[#070b14] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-500"
                  />
                  {searchQuery ? (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-2.5 text-xs font-semibold text-slate-400 hover:text-slate-200"
                    >
                      Clear
                    </button>
                  ) : (
                    <span className="hidden sm:inline absolute right-3 top-2.5 text-[10px] text-slate-500 font-mono">
                      ⌘K
                    </span>
                  )}
                </div>

                {/* Controls: Difficulty + View Switcher + Tree View */}
                <div className="flex items-center space-x-2">
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="px-2.5 py-2 text-xs font-medium rounded-lg border border-slate-700/80 bg-[#080d19] text-slate-200 outline-none hover:border-slate-600 cursor-pointer"
                  >
                    <option value="all">All Difficulties</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>

                  {/* View Mode Toggle: Sheet (List) vs Grid */}
                  <div className="flex items-center rounded-lg border border-slate-700/80 bg-[#080d19] p-0.5">
                    <button
                      onClick={() => setViewMode('sheet')}
                      title="Curriculum Sheet View"
                      className={`px-2 py-1.5 rounded-md text-xs font-semibold flex items-center space-x-1 transition-colors cursor-pointer ${
                        viewMode === 'sheet'
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <List className="w-3.5 h-3.5" />
                      <span className="hidden md:inline">Sheet</span>
                    </button>
                    <button
                      onClick={() => setViewMode('grid')}
                      title="Cards Grid View"
                      className={`px-2 py-1.5 rounded-md text-xs font-semibold flex items-center space-x-1 transition-colors cursor-pointer ${
                        viewMode === 'grid'
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                      <span className="hidden md:inline">Cards</span>
                    </button>
                  </div>

                  {/* TakeUForward Tree View switch button */}
                  <button
                    onClick={() => setActiveTab('roadmap')}
                    className="px-3 py-2 text-xs font-semibold rounded-lg border border-blue-500/30 bg-blue-600/15 text-blue-400 hover:bg-blue-600/25 transition-colors flex items-center space-x-1.5 whitespace-nowrap cursor-pointer"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Tree View</span>
                  </button>
                </div>
              </div>

              {/* Module Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 custom-scrollbar text-xs">
                {modulesList.map((m) => {
                  const isActive = selectedModule === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setSelectedModule(m.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center space-x-2 cursor-pointer ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-[#080d19] border border-slate-800 text-slate-300 hover:bg-slate-800/80 hover:text-white'
                      }`}
                    >
                      <span>{m.name.split(':')[1] ? m.name.split(':')[0] : m.name}</span>
                      <span className={`text-[11px] px-1.5 py-0.5 rounded-full font-bold ${
                        isActive ? 'bg-blue-700 text-white' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {m.count}
                      </span>
                    </button>
                  );
                })}
              </div>

            </div>

            {/* Results count & Free Trial Notice */}
            <div className="flex items-center justify-between px-1 text-xs text-slate-400">
              <p>
                Showing <span className="text-white font-bold">{filteredSessions.length}</span> of 55 sessions
              </p>
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center space-x-1 text-emerald-400 font-semibold bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-800/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>Sessions 00–04 Free</span>
                </span>
                <span className="text-slate-600 hidden sm:inline">|</span>
                <span className="hidden sm:inline text-slate-400">Sessions 05–54 unlocked on sign-in</span>
              </div>
            </div>

            {/* MAIN CONTENT REPRESENTATION */}
            {viewMode === 'sheet' ? (
              /* Style 1: Lightweight Structured Curriculum Sheet by Phases */
              <CurriculumSheet
                sessions={filteredSessions}
                onPreview={handlePreviewSession}
                onOpenGitHub={handleOpenGitHub}
                onOpenQuiz={handleOpenQuiz}
                onOpenModuleQuiz={handleOpenModuleQuiz}
                searchQuery={searchQuery}
                selectedModule={selectedModule}
              />
            ) : (
              /* Style 2: Compact Minimalist Cards Grid */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
              <div className="bg-[#0d1322] rounded-xl border border-slate-800 p-10 text-center max-w-md mx-auto">
                <Search className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-slate-200">No sessions match your search</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Try checking for keywords like "Linux", "Docker", "AWS", or clear your search query.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedModule('all');
                    setSelectedDifficulty('all');
                  }}
                  className="mt-3.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Clear Filters
                </button>
              </div>
            )}

          </div>
        )}

        {/* VIEW 2: TAKEUFORWARD ROADMAP TREE VIEW */}
        {activeTab === 'roadmap' && (
          <div className="bg-[#0a0f1d] rounded-xl border border-slate-800 shadow-xs overflow-hidden flex flex-col lg:flex-row min-h-[650px] text-slate-100">
            
            {/* Left: TakeUForward Style Collapsible Tree Sidebar */}
            <TakeUForwardSidebar
              sessions={sessions}
              selectedSession={selectedSession}
              onSelectSession={(s) => setSelectedSession(s)}
              onOpenGitHub={handleOpenGitHub}
              onOpenQuiz={handleOpenQuiz}
              onOpenModuleQuiz={handleOpenModuleQuiz}
              onResetView={() => setActiveTab('explore')}
            />

            {/* Right: Selected Session Detailed Preview Panel */}
            <div className="flex-1 p-5 lg:p-7 overflow-y-auto">
              {selectedSession ? (
                <div className="max-w-2xl space-y-5">
                  
                  {/* Top breadcrumb & Status */}
                  <div className="flex flex-wrap items-center justify-between gap-2.5 pb-3 border-b border-slate-800">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                        Session #{selectedSession.sessionNumber.toString().padStart(2, '0')}
                      </span>
                      {selectedSession.isFree ? (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800/60">
                          🟢 Free Access
                        </span>
                      ) : !isAuthenticated ? (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-950/60 text-amber-400 border border-amber-800/60 flex items-center space-x-1">
                          <Lock className="w-3 h-3" />
                          <span>Requires Sign In</span>
                        </span>
                      ) : (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-950/60 text-blue-300 border border-blue-800/60">
                          ✓ Unlocked
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => toggleComplete(selectedSession.sessionNumber)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold border flex items-center space-x-1.5 transition-colors cursor-pointer ${
                        isCompleted(selectedSession.sessionNumber)
                          ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-400'
                          : 'bg-[#080d19] border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <CheckCircle2 className={`w-3.5 h-3.5 ${isCompleted(selectedSession.sessionNumber) ? 'fill-emerald-400 text-slate-900' : 'text-slate-400'}`} />
                      <span>{isCompleted(selectedSession.sessionNumber) ? 'Completed' : 'Mark Done'}</span>
                    </button>
                  </div>

                  {/* Title & Module */}
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-blue-400">
                      {selectedSession.module}
                    </p>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-0.5">
                      {selectedSession.title}
                    </h2>
                    <div className="flex items-center space-x-3 text-xs text-slate-400 mt-1.5">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{selectedSession.duration}</span>
                      </span>
                      <span>•</span>
                      <span className="font-semibold text-slate-300">Difficulty: {selectedSession.difficulty}</span>
                    </div>
                  </div>

                  {/* Preview Overview Box */}
                  <div className="p-4 rounded-xl bg-[#080d19] border border-slate-800/80">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center space-x-1.5">
                      <Layers className="w-4 h-4 text-blue-400" />
                      <span>Session Overview</span>
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {selectedSession.preview}
                    </p>
                  </div>

                  {/* Learning Topics */}
                  {selectedSession.topics && (
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center space-x-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>Core Topics</span>
                      </h4>
                      <div className="space-y-1.5">
                        {selectedSession.topics.map((topic, i) => (
                          <div key={i} className="flex items-start space-x-2.5 p-2.5 rounded-lg bg-[#080d19] border border-slate-800 text-xs text-slate-300">
                            <span className="w-4 h-4 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
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
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center space-x-1.5">
                        <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Practical Hands-on Labs</span>
                      </h4>
                      <div className="space-y-1.5">
                        {selectedSession.labs.map((lab, i) => (
                          <div key={i} className="flex items-center space-x-2.5 p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-900/40 text-xs text-emerald-300 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                            <span>{lab}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Direct GitHub Redirect CTA Box */}
                  <div className="p-4 sm:p-5 rounded-xl bg-[#080d19] border border-slate-800 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                        Practice on GitHub
                      </p>
                      <h3 className="text-base font-bold text-white mt-0.5">
                        Open {selectedSession.folder}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5 max-w-sm">
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
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs sm:text-sm transition-all flex items-center justify-center space-x-2 shadow-xs cursor-pointer flex-shrink-0"
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
                <div className="text-center py-20 text-slate-400 text-sm">
                  Select a session from the roadmap tree on the left.
                </div>
              )}
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

      {/* Quick Quiz Modal (Session & Module Assessments) */}
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

      {/* Auth Modal (Login / Sign Up / Google Auth) */}
      <AuthModal />

      {/* Footer */}
      <Footer />

    </div>
  );
}

export default App;
