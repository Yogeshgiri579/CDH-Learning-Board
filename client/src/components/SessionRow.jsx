import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Lock, 
  Eye, 
  Clock, 
  ChevronDown, 
  ChevronUp,
  Terminal,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { Github } from './GithubIcon';
import { useAuth } from '../context/AuthContext';

export const SessionRow = ({ session, onPreview, onOpenGitHub, onOpenQuiz }) => {
  const { isCompleted, toggleComplete, isAuthenticated } = useAuth();
  const [expanded, setExpanded] = useState(false);
  
  const completed = isCompleted(session.sessionNumber);
  const isFree = session.sessionNumber < 5;
  const isLocked = !isFree && !isAuthenticated;

  const handleStartClick = (e) => {
    e.stopPropagation();
    onOpenGitHub(session);
  };

  const handleToggleComplete = (e) => {
    e.stopPropagation();
    toggleComplete(session.sessionNumber);
  };

  const handlePreviewClick = (e) => {
    e.stopPropagation();
    onPreview(session);
  };

  // Difficulty color styling
  const diffBadge = {
    Beginner: {
      dot: 'bg-emerald-400',
      badge: 'text-emerald-400 bg-emerald-950/40 border-emerald-800/60',
    },
    Intermediate: {
      dot: 'bg-amber-400',
      badge: 'text-amber-400 bg-amber-950/40 border-amber-800/60',
    },
    Advanced: {
      dot: 'bg-purple-400',
      badge: 'text-purple-400 bg-purple-950/40 border-purple-800/60',
    },
  }[session.difficulty] || {
    dot: 'bg-slate-400',
    badge: 'text-slate-400 bg-slate-800 border-slate-700',
  };

  return (
    <div 
      className={`group border-b border-slate-800/70 last:border-b-0 transition-all duration-150 ${
        completed 
          ? 'bg-emerald-950/20 hover:bg-emerald-950/30' 
          : 'bg-[#0d1322] hover:bg-[#121a2d]'
      }`}
    >
      {/* Main Row */}
      <div 
        className="px-4 py-3.5 sm:py-4 flex items-center justify-between gap-3 sm:gap-5 cursor-pointer select-none"
        onClick={() => setExpanded(!expanded)}
      >
        
        {/* Left: Checkbox + Number + Title + Topics */}
        <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
          {/* Complete Status Checkbox */}
          <button
            onClick={handleToggleComplete}
            title={completed ? 'Completed' : 'Mark as done'}
            className="flex-shrink-0 text-slate-500 hover:text-emerald-400 transition-colors focus:outline-none p-0.5 cursor-pointer"
          >
            <CheckCircle2 
              className={`w-5 h-5 sm:w-5.5 sm:h-5.5 ${
                completed ? 'fill-emerald-400 text-slate-900' : 'text-slate-600 group-hover:text-slate-400'
              }`} 
            />
          </button>

          {/* Session Number */}
          <span className="font-mono text-xs sm:text-sm font-bold text-slate-500 group-hover:text-slate-300 flex-shrink-0 w-8 sm:w-9">
            #{session.sessionNumber.toString().padStart(2, '0')}
          </span>

          {/* Title & Preview info (Bigger typography) */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-2.5">
              <h4 
                className={`text-sm sm:text-base font-bold truncate transition-colors ${
                  completed ? 'text-slate-500 line-through decoration-slate-600' : 'text-slate-100 group-hover:text-blue-400'
                }`}
              >
                {session.title}
              </h4>

              {/* Free or Lock indicator */}
              {isFree ? (
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-950/50 text-emerald-400 border border-emerald-800/50 flex-shrink-0">
                  FREE
                </span>
              ) : isLocked ? (
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-slate-400 border border-slate-700 flex-shrink-0">
                  <Lock className="w-3 h-3 mr-0.5 text-slate-400" />
                  Sign in
                </span>
              ) : null}
            </div>

            {/* Sub-line: Topics Tags (visible on desktop with bigger text) */}
            <div className="hidden md:flex items-center space-x-2 mt-1 text-xs text-slate-400">
              <span className="text-slate-400 truncate max-w-md">{session.preview}</span>
              {session.topics && session.topics.length > 0 && (
                <>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-300 font-medium truncate max-w-xs">{session.topics[0]}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right side: Metadata + Quick Actions */}
        <div className="flex items-center space-x-2.5 sm:space-x-4 flex-shrink-0">
          
          {/* Difficulty pill */}
          <div className="hidden lg:flex items-center space-x-1.5">
            <span className={`w-2 h-2 rounded-full ${diffBadge.dot}`}></span>
            <span className="text-xs sm:text-sm text-slate-400 font-medium">{session.difficulty}</span>
          </div>

          {/* Duration */}
          <div className="hidden sm:flex items-center space-x-1 text-xs sm:text-sm text-slate-400">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>{session.duration}</span>
          </div>

          {/* Quick Preview button */}
          <button
            onClick={handlePreviewClick}
            className="p-1.5 sm:px-3 sm:py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/80 transition-colors text-xs font-semibold flex items-center space-x-1 cursor-pointer bg-[#080d19]"
            title="Quick preview session breakdown"
          >
            <Eye className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden xl:inline">Overview</span>
          </button>

          {/* Quick Quiz button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenQuiz && onOpenQuiz(session);
            }}
            className="p-1.5 sm:px-3 sm:py-1.5 rounded-lg text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-colors text-xs font-semibold flex items-center space-x-1 cursor-pointer"
            title="Take interactive quick quiz for this session"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Quiz</span>
          </button>

          {/* Read button with Github icon & clean dark styling */}
          <button
            onClick={handleStartClick}
            className="px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white active:scale-95"
            title="Read session GitHub README in-app"
          >
            {isLocked ? (
              <>
                <Lock className="w-3 h-3 text-amber-300" />
                <span>Read</span>
              </>
            ) : (
              <>
                <Github className="w-3.5 h-3.5 text-white" />
                <span>Read</span>
              </>
            )}
          </button>

          {/* Row expansion arrow */}
          <div 
            className="p-1 text-slate-500 hover:text-slate-300 transition-transform duration-200"
            aria-label="Expand details"
          >
            {expanded ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>

        </div>
      </div>

      {/* Expanded Drawer Details (Compact & clean inline breakdown) */}
      {expanded && (
        <div className="px-5 sm:px-12 py-4 bg-[#080d19] border-t border-slate-800 text-xs sm:text-sm text-slate-300 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl">
            
            {/* Overview & Topics */}
            <div>
              <p className="font-bold text-white mb-1 flex items-center space-x-1.5 text-xs sm:text-sm">
                <BookOpen className="w-4 h-4 text-blue-400" />
                <span>Session Summary</span>
              </p>
              <p className="text-slate-300 leading-relaxed text-xs sm:text-sm">
                {session.preview}
              </p>

              {session.topics && session.topics.length > 0 && (
                <div className="mt-3 space-y-1.5">
                  <p className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">Key Learnings:</p>
                  <ul className="list-disc list-inside space-y-1 text-slate-300 text-xs">
                    {session.topics.slice(0, 3).map((topic, i) => (
                      <li key={i} className="truncate">{topic}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Practical Hands-on Labs & GitHub redirect */}
            <div className="flex flex-col justify-between">
              {session.labs && session.labs.length > 0 && (
                <div>
                  <p className="font-bold text-white mb-1 flex items-center space-x-1.5 text-xs sm:text-sm">
                    <Terminal className="w-4 h-4 text-emerald-400" />
                    <span>Hands-on Tasks:</span>
                  </p>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {session.labs.slice(0, 2).map((lab, i) => (
                      <li key={i} className="flex items-center space-x-2 truncate">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                        <span className="truncate">{lab}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-4 flex flex-wrap items-center justify-between gap-2.5 pt-3 border-t border-slate-800 text-xs">
                <span className="text-slate-400 font-mono text-xs">
                  Folder: <code className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-200 border border-slate-700">{session.folder}</code>
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenQuiz && onOpenQuiz(session);
                    }}
                    className="px-3 py-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Quick Quiz</span>
                  </button>

                  <button
                    onClick={handleStartClick}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center space-x-1.5 shadow-xs transition-all cursor-pointer"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>Read in App</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
