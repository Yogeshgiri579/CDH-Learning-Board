import React from 'react';
import { 
  X, 
  CheckCircle2, 
  Lock, 
  Clock, 
  Sparkles, 
  Layers, 
  Terminal
} from 'lucide-react';
import { Github } from './GithubIcon';
import { useAuth } from '../context/AuthContext';

export const SessionPreviewModal = ({ session, onClose, onOpenGitHub, onOpenQuiz }) => {
  const { isAuthenticated, isCompleted, toggleComplete } = useAuth();

  if (!session) return null;

  const isFree = session.sessionNumber < 5;
  const isLocked = !isFree && !isAuthenticated;
  const completed = isCompleted(session.sessionNumber);

  const handleActionClick = () => {
    onClose();
    onOpenGitHub(session);
  };

  const handleQuizClick = () => {
    onClose();
    if (onOpenQuiz) {
      onOpenQuiz(session);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="relative bg-[#0d1322] w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0a0f1d]">
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
              Session #{session.sessionNumber.toString().padStart(2, '0')}
            </span>
            {isFree ? (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800/60">
                🟢 Free Access
              </span>
            ) : isLocked ? (
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
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="px-6 py-5 space-y-5 max-h-[75vh] overflow-y-auto custom-scrollbar">
          
          {/* Module & Title */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-400">
              {session.module}
            </p>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
              {session.title}
            </h2>
            <div className="flex items-center space-x-3 text-xs text-slate-400 mt-2">
              <span className="flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>Est. Duration: {session.duration}</span>
              </span>
              <span>•</span>
              <span className="font-semibold text-slate-300">Level: {session.difficulty}</span>
            </div>
          </div>

          {/* Preview Overview */}
          <div className="p-4 rounded-xl bg-[#080d19] border border-slate-800/80">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center space-x-1.5">
              <Layers className="w-4 h-4 text-blue-400" />
              <span>Session Overview</span>
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              {session.preview}
            </p>
          </div>

          {/* Key Topics */}
          {session.topics && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>What You Will Learn</span>
              </h4>
              <ul className="space-y-1.5">
                {session.topics.map((t, i) => (
                  <li key={i} className="flex items-start space-x-2 text-xs sm:text-sm text-slate-300">
                    <span className="text-blue-400 font-bold mt-0.5">•</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Hands-on Labs */}
          {session.labs && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center space-x-1.5">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>Hands-on Tasks on GitHub</span>
              </h4>
              <div className="space-y-1.5">
                {session.labs.map((lab, i) => (
                  <div key={i} className="flex items-center space-x-2 p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-900/40 text-xs sm:text-sm text-emerald-300 font-medium">
                    <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px] flex-shrink-0">
                      {i + 1}
                    </span>
                    <span>{lab}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* GitHub Destination Path Info */}
          <div className="p-3 bg-[#080d19] border border-slate-800 rounded-xl text-slate-300 flex items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center space-x-2 truncate">
              <Github className="w-4 h-4 text-white flex-shrink-0" />
              <span className="text-slate-500">Path:</span>
              <span className="text-blue-400 truncate">{session.folder}</span>
            </div>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider flex-shrink-0">main branch</span>
          </div>

          {/* Lock Alert Banner if applicable */}
          {isLocked && (
            <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-800/50 text-xs text-amber-200 flex items-start space-x-2.5">
              <Lock className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-300">Sign in required to access this resource</p>
                <p className="text-amber-200/80 mt-0.5">
                  Sessions 0 to 4 are free. To unlock Sessions 5-54 and sync your progress, sign in with your Google account or email.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-4 border-t border-slate-800 bg-[#0a0f1d] flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Mark Complete Checkbox */}
          <button
            onClick={() => toggleComplete(session.sessionNumber)}
            className={`w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold border transition-colors flex items-center justify-center space-x-2 cursor-pointer ${
              completed
                ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-400'
                : 'bg-[#080d19] border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <CheckCircle2 className={`w-4 h-4 ${completed ? 'fill-emerald-400 text-slate-900' : 'text-slate-500'}`} />
            <span>{completed ? 'Completed ✓' : 'Mark as Done'}</span>
          </button>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={handleQuizClick}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Quick Quiz</span>
            </button>

            <button
              onClick={handleActionClick}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer hover:shadow-blue-500/25"
            >
              {isLocked ? (
                <>
                  <Lock className="w-4 h-4 text-amber-300" />
                  <span>Read in App</span>
                </>
              ) : (
                <>
                  <Github className="w-4 h-4 text-white" />
                  <span>Read in App</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
