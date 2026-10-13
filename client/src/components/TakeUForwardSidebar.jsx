import React, { useState } from 'react';
import { 
  Folder, 
  FolderOpen, 
  ChevronDown, 
  ChevronRight, 
  CheckCircle2, 
  Lock, 
  Award, 
  HelpCircle, 
  CreditCard, 
  LogIn, 
  ArrowLeft,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const TakeUForwardSidebar = ({ 
  sessions, 
  selectedSession, 
  onSelectSession, 
  onOpenGitHub,
  onOpenQuiz,
  onOpenModuleQuiz,
  onResetView 
}) => {
  const { user, isAuthenticated, openAuthModal, isCompleted, completedCount } = useAuth();

  // Group sessions by module
  const modules = [
    {
      id: 'm1',
      title: 'Module 1: Foundations & Kickoff',
      badge: 'Free Trial Included',
      badgeColor: 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60',
      sessions: sessions.filter((s) => s.moduleId === 'm1'),
    },
    {
      id: 'm2',
      title: 'Module 2: Linux Administration & Shell',
      badge: 'Sessions 05 - 12',
      badgeColor: 'bg-slate-800 text-slate-300 border-slate-700',
      sessions: sessions.filter((s) => s.moduleId === 'm2'),
    },
    {
      id: 'm3',
      title: 'Module 3: Git & Version Control Pipelines',
      badge: 'Sessions 13 - 18',
      badgeColor: 'bg-slate-800 text-slate-300 border-slate-700',
      sessions: sessions.filter((s) => s.moduleId === 'm3'),
    },
    {
      id: 'm4',
      title: 'Module 4: Multi-Cloud (AWS, GCP, Azure)',
      badge: 'Sessions 19 - 28',
      badgeColor: 'bg-slate-800 text-slate-300 border-slate-700',
      sessions: sessions.filter((s) => s.moduleId === 'm4'),
    },
    {
      id: 'm5',
      title: 'Module 5: Containers & Docker Mastery',
      badge: 'Sessions 29 - 36',
      badgeColor: 'bg-slate-800 text-slate-300 border-slate-700',
      sessions: sessions.filter((s) => s.moduleId === 'm5'),
    },
    {
      id: 'm6',
      title: 'Module 6: Kubernetes (K8s) Orchestration',
      badge: 'Sessions 37 - 45',
      badgeColor: 'bg-slate-800 text-slate-300 border-slate-700',
      sessions: sessions.filter((s) => s.moduleId === 'm6'),
    },
    {
      id: 'm7',
      title: 'Module 7: IaC (Terraform) & GitOps',
      badge: 'Sessions 46 - 50',
      badgeColor: 'bg-slate-800 text-slate-300 border-slate-700',
      sessions: sessions.filter((s) => s.moduleId === 'm7'),
    },
    {
      id: 'm8',
      title: 'Module 8: Observability & AI in DevOps',
      badge: 'Sessions 51 - 54',
      badgeColor: 'bg-slate-800 text-slate-300 border-slate-700',
      sessions: sessions.filter((s) => s.moduleId === 'm8'),
    },
  ];

  // Open first 2 modules by default
  const [openModules, setOpenModules] = useState({
    m1: true,
    m2: false,
    m3: false,
    m4: false,
    m5: false,
    m6: false,
    m7: false,
    m8: false,
  });

  const toggleModule = (id) => {
    setOpenModules((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const progressPercent = Math.round((completedCount / 55) * 100);

  return (
    <aside className="w-full lg:w-80 flex-shrink-0 bg-[#0a0f1d] border-r border-slate-800 flex flex-col h-[calc(100vh-4rem)] sticky top-16 select-none">
      
      {/* Top Header of Sidebar (TakeUForward style) */}
      <div className="p-4 border-b border-slate-800">
        <button
          onClick={onResetView}
          className="flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard Overview</span>
        </button>

        <div className="mt-3">
          <p className="text-[11px] font-bold uppercase tracking-wider text-blue-400">
            CloudDevOpsHub Prep Hub
          </p>
          <h2 className="text-sm font-bold text-white mt-0.5">
            MultiCloud DevOps & AI Sheet
          </h2>
        </div>
      </div>

      {/* Tree Content (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
        {modules.map((mod) => {
          const isOpen = Boolean(openModules[mod.id]);
          const modCompletedCount = mod.sessions.filter((s) => isCompleted(s.sessionNumber)).length;

          return (
            <div key={mod.id} className="rounded-xl border border-slate-800 bg-[#0d1322] overflow-hidden">
              
              {/* Module Header / Folder Accordion */}
              <button
                onClick={() => toggleModule(mod.id)}
                className="w-full flex items-center justify-between p-2.5 text-left hover:bg-[#111a30] transition-colors cursor-pointer"
              >
                <div className="flex items-start space-x-2.5 min-w-0 pr-2">
                  <span className="text-slate-400 mt-0.5 flex-shrink-0">
                    {isOpen ? <FolderOpen className="w-4 h-4 text-blue-400" /> : <Folder className="w-4 h-4 text-slate-500" />}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-200 truncate leading-snug">
                      {mod.title}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${mod.badgeColor}`}>
                        {mod.badge}
                      </span>
                      {modCompletedCount > 0 && (
                        <span className="text-[10px] text-emerald-400 font-medium">
                          {modCompletedCount}/{mod.sessions.length} done
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-1 flex-shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenModuleQuiz && onOpenModuleQuiz(mod.id, mod.title);
                    }}
                    className="p-1 rounded text-amber-400 hover:text-amber-300 hover:bg-amber-500/20 transition-colors"
                    title={`Take ${mod.title} Quiz`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-slate-500 p-1">
                    {isOpen ? <ChevronDown className="w-4 h-4 text-blue-400" /> : <ChevronRight className="w-4 h-4" />}
                  </span>
                </div>
              </button>

              {/* Module Nested Sessions Tree with Connector Lines */}
              {isOpen && (
                <div className="relative pl-6 pr-2 pb-2 pt-1 border-t border-slate-800 bg-[#080d19] space-y-1">
                  
                  {/* Vertical Guide Line */}
                  <div className="absolute left-4 top-2 bottom-3 w-px bg-slate-800" />

                  {mod.sessions.map((session) => {
                    const isSessionCompleted = isCompleted(session.sessionNumber);
                    const isSelected = selectedSession?.sessionNumber === session.sessionNumber;
                    const isLocked = !session.isFree && !isAuthenticated;

                    return (
                      <div
                        key={session.id}
                        className="relative group"
                      >
                        {/* Horizontal Connector Line */}
                        <div className="absolute -left-2 top-3 w-2 h-px bg-slate-800" />

                        <div
                          onClick={() => onSelectSession(session)}
                          className={`flex items-start justify-between p-2 rounded-lg cursor-pointer transition-all text-left ${
                            isSelected
                              ? 'bg-blue-600/20 border border-blue-500/40 shadow-xs'
                              : 'hover:bg-slate-800/60 border border-transparent'
                          }`}
                        >
                          <div className="flex items-start space-x-2 min-w-0">
                            {/* Checkbox indicator */}
                            <span className="mt-0.5 flex-shrink-0">
                              {isSessionCompleted ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 fill-emerald-950/60" />
                              ) : isLocked ? (
                                <Lock className="w-3.5 h-3.5 text-slate-500" />
                              ) : (
                                <div className="w-3.5 h-3.5 rounded-full border border-slate-600" />
                              )}
                            </span>

                            <div className="min-w-0">
                              <p className={`text-xs leading-snug line-clamp-2 ${
                                isSelected ? 'font-bold text-blue-300' : 'font-medium text-slate-300 group-hover:text-white'
                              }`}>
                                <span className="font-semibold text-slate-500 mr-1">
                                  #{session.sessionNumber.toString().padStart(2, '0')}
                                </span>
                                {session.title}
                              </p>

                              <div className="flex items-center space-x-2 mt-1">
                                {session.isFree ? (
                                  <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-800/60">
                                    Free
                                  </span>
                                ) : (
                                  <span className="text-[10px] text-slate-500 font-normal">
                                    {session.duration}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Quick Actions (Quiz & Read) */}
                          <div className="flex items-center space-x-1 flex-shrink-0 opacity-80 group-hover:opacity-100">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenQuiz && onOpenQuiz(session);
                              }}
                              title="Take session quiz"
                              className="p-1 text-amber-400 hover:text-amber-300 hover:bg-slate-800 rounded transition-colors cursor-pointer"
                            >
                              <Sparkles className="w-3 h-3" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenGitHub(session);
                              }}
                              title="Read GitHub notes in-app"
                              className="p-1 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded transition-colors cursor-pointer"
                            >
                              <BookOpen className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          );
        })}
      </div>

      {/* Bottom Area: Progress bar & TakeUForward style Action Links */}
      <div className="p-3 border-t border-slate-800 bg-[#0d1322]">
        
        {/* Progress 0/55 */}
        <div className="mb-3 px-1">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-bold text-slate-300 flex items-center space-x-1">
              <Award className="w-3.5 h-3.5 text-blue-400" />
              <span>{completedCount}/55 Completed</span>
            </span>
            <span className="text-xs font-semibold text-blue-400">{progressPercent}%</span>
          </div>

          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-600 to-indigo-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.max(progressPercent, 2)}%` }}
            />
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-1 mb-3">
          <a
            href="https://github.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-xs text-slate-400 hover:text-white px-2 py-1 rounded hover:bg-slate-800/60 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
            <span>Community & Help Support</span>
          </a>
          <a
            href="https://github.com/CloudDevOpsHub"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-xs text-slate-400 hover:text-white px-2 py-1 rounded hover:bg-slate-800/60 transition-colors"
          >
            <CreditCard className="w-3.5 h-3.5 text-slate-500" />
            <span>CloudDevOpsHub Org & Repo</span>
          </a>
        </div>

        {/* Bottom Login / Signup Button (like screenshot 2) */}
        {!isAuthenticated ? (
          <button
            onClick={() => openAuthModal('Sign in to unlock all 55 sessions and save your progress')}
            className="w-full py-2.5 px-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>→] Log in / Sign up</span>
          </button>
        ) : (
          <div className="p-2 rounded-xl bg-[#080d19] border border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2 min-w-0">
              <img
                src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`}
                alt={user.name}
                className="w-6 h-6 rounded-full border border-blue-500/40"
              />
              <span className="text-xs font-semibold text-slate-200 truncate">{user.name}</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
              Unlocked
            </span>
          </div>
        )}

      </div>
    </aside>
  );
};
