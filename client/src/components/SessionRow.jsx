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

const HighlightMatch = ({ text = '', query = '' }) => {
  if (!query || !text) return <>{text}</>;
  const trimmed = query.trim();
  if (!trimmed) return <>{text}</>;
  const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === trimmed.toLowerCase() ? (
          <mark key={i} className="bg-amber-400/25 text-amber-200 px-1 py-0.2 rounded font-bold">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
};

export const SessionRow = ({ session, onPreview, onOpenGitHub, onOpenQuiz, searchQuery = '' }) => {
  const { isCompleted, isAuthenticated, getQuizResult } = useAuth();
  const [expanded, setExpanded] = useState(false);
  
  const completed = isCompleted(session.sessionNumber);
  const quizResult = getQuizResult ? getQuizResult(session.sessionNumber) : null;
  const isFree = session.sessionNumber < 5;
  const isLocked = !isFree && !isAuthenticated;

  const handleStartClick = (e) => {
    e.stopPropagation();
    onOpenGitHub(session);
  };

  const handlePreviewClick = (e) => {
    e.stopPropagation();
    if (onPreview) {
      onPreview(session);
    } else if (onOpenGitHub) {
      onOpenGitHub(session);
    }
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
    dot: 'bg-[#8b949e]',
    badge: 'text-[#8b949e] bg-[#21262d] border-[#30363d]',
  };

  return (
    <div 
      className={`group border-b border-[#21262d] last:border-b-0 transition-all duration-150 ${
        completed 
          ? 'bg-[#0e2417] hover:bg-[#12311f]' 
          : 'bg-[#0d1117] hover:bg-[#161b22]'
      }`}
    >
      {/* Main Row */}
      <div 
        className="px-4 py-3.5 sm:py-4 flex items-center justify-between gap-3 sm:gap-5 cursor-pointer select-none"
        onClick={() => setExpanded(!expanded)}
      >
        
        {/* Left: Checkbox + Number + Title + Topics */}
        <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
          {/* Read-only Completion Status (Must read markdown inside to mark as done) */}
          <div 
            className="flex-shrink-0 p-0.5 select-none"
            title={completed ? 'Session Completed' : 'Read session to mark as done'}
          >
            {completed ? (
              <CheckCircle2 className="w-5 h-5 sm:w-5.5 sm:h-5.5 fill-emerald-400 text-slate-900" />
            ) : (
              <div className="w-5 h-5 sm:w-5.5 sm:h-5.5 rounded-full border border-[#30363d] flex items-center justify-center text-[10px] text-[#484f58] group-hover:border-[#484f58]" />
            )}
          </div>

          {/* Session Number */}
          <span className="font-mono text-xs sm:text-sm font-bold text-[#8b949e] group-hover:text-[#c9d1d9] flex-shrink-0 w-8 sm:w-9">
            #{session.sessionNumber.toString().padStart(2, '0')}
          </span>

          {/* Title & Preview info */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-2.5">
              <h4 
                className={`text-sm sm:text-base font-bold truncate transition-colors ${
                  completed ? 'text-[#8b949e] line-through decoration-[#484f58]' : 'text-[#f0f6fc] group-hover:text-[#58a6ff]'
                }`}
              >
                <HighlightMatch text={session.title} query={searchQuery} />
              </h4>

              {/* Free or Lock indicator */}
              {isFree ? (
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-[#238636]/20 text-[#3fb950] border border-[#238636]/40 flex-shrink-0">
                  FREE
                </span>
              ) : isLocked ? (
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#21262d] text-[#8b949e] border border-[#30363d] flex-shrink-0">
                  <Lock className="w-3 h-3 mr-0.5 text-[#8b949e]" />
                  Sign in
                </span>
              ) : null}
            </div>

            {/* Sub-line: Topics Tags */}
            <div className="hidden md:flex items-center space-x-2 mt-1 text-xs text-[#8b949e]">
              <span className="text-[#8b949e] truncate max-w-md">
                <HighlightMatch text={session.preview} query={searchQuery} />
              </span>
              {session.topics && session.topics.length > 0 && (
                <>
                  <span className="text-[#484f58]">•</span>
                  <span className="text-[#c9d1d9] font-medium truncate max-w-xs">
                    <HighlightMatch text={session.topics[0]} query={searchQuery} />
                  </span>
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
            <span className="text-xs sm:text-sm text-[#8b949e] font-medium">{session.difficulty}</span>
          </div>

          {/* Duration */}
          <div className="hidden sm:flex items-center space-x-1 text-xs sm:text-sm text-[#8b949e]">
            <Clock className="w-3.5 h-3.5 text-[#484f58]" />
            <span>{session.duration}</span>
          </div>

          {/* Quick Preview button */}
          <button
            onClick={handlePreviewClick}
            className="p-1.5 sm:px-3 sm:py-1.5 rounded-lg text-[#c9d1d9] hover:text-white hover:bg-[#30363d] border border-[#30363d] transition-colors text-xs font-semibold flex items-center space-x-1 cursor-pointer bg-[#21262d]"
            title="Quick preview session breakdown"
          >
            <Eye className="w-3.5 h-3.5 text-[#8b949e]" />
            <span className="hidden sm:inline">Overview</span>
          </button>

          {/* Quick Quiz button / Realtime Quiz Result based on score */}
          {quizResult ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenQuiz && onOpenQuiz(session);
              }}
              className={`p-1.5 sm:px-2.5 sm:py-1 rounded-lg text-xs font-bold flex items-center space-x-1.5 cursor-pointer transition-all shadow-xs ${
                quizResult.passed
                  ? 'text-emerald-400 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/35'
                  : 'text-amber-300 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/35'
              }`}
              title={`Quiz Score: ${quizResult.score}/${quizResult.totalQuestions} (${
                quizResult.percent !== undefined ? quizResult.percent : Math.round((quizResult.score / quizResult.totalQuestions) * 100)
              }%). ${quizResult.passed ? 'Passed!' : 'Needs 60% to pass.'} Click to retake.`}
            >
              {quizResult.passed ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              )}
              <span className="font-mono">{quizResult.score}/{quizResult.totalQuestions}</span>
              <span className="hidden md:inline text-[11px] font-semibold opacity-90">
                {quizResult.passed ? 'Passed' : 'Retake'}
              </span>
            </button>
          ) : (
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
          )}

          {/* Read button with Github icon & GitHub green styling */}
          <button
            onClick={handleStartClick}
            className="px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer bg-[#238636] hover:bg-[#2ea043] text-white active:scale-95"
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
            className="p-1 text-[#8b949e] hover:text-[#f0f6fc] transition-transform duration-200"
            aria-label="Expand details"
          >
            {expanded ? (
              <ChevronUp className="w-4 h-4 text-[#8b949e]" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </div>

        </div>
      </div>

      {/* Expanded Drawer Details */}
      {expanded && (
        <div className="px-5 sm:px-12 py-4 bg-[#010409] border-t border-[#21262d] text-xs sm:text-sm text-[#c9d1d9] animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl">
            
            {/* Overview & Topics */}
            <div>
              <p className="font-bold text-white mb-1 flex items-center space-x-1.5 text-xs sm:text-sm">
                <BookOpen className="w-4 h-4 text-[#58a6ff]" />
                <span>Session Summary</span>
              </p>
              <p className="text-[#8b949e] leading-relaxed text-xs sm:text-sm">
                {session.preview}
              </p>

              {session.topics && session.topics.length > 0 && (
                <div className="mt-3 space-y-1.5">
                  <p className="text-[11px] uppercase font-bold text-[#8b949e] tracking-wider">Key Learnings:</p>
                  <ul className="list-disc list-inside space-y-1 text-[#c9d1d9] text-xs">
                    {session.topics.slice(0, 3).map((topic, i) => (
                      <li key={i}>{topic}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Hands-on Tasks */}
            <div>
              <p className="font-bold text-white mb-1 flex items-center space-x-1.5 text-xs sm:text-sm">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>Hands-on Lab Exercise</span>
              </p>
              {session.labs && session.labs.length > 0 ? (
                <div className="space-y-2 mt-1">
                  {session.labs.slice(0, 2).map((lab, i) => (
                    <div key={i} className="p-2.5 rounded-lg bg-[#0d1117] border border-[#21262d] flex items-start space-x-2">
                      <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-800/40 flex-shrink-0">
                        Task {i + 1}
                      </span>
                      <p className="text-xs text-[#c9d1d9]">{lab}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#8b949e]">Lab steps available inside the session reader notes.</p>
              )}

              {/* Direct Open CTA */}
              <div className="mt-4 flex items-center space-x-3">
                <button
                  onClick={handleStartClick}
                  className="px-3.5 py-1.5 rounded-lg bg-[#238636] hover:bg-[#2ea043] text-white text-xs font-semibold flex items-center space-x-1.5 cursor-pointer shadow-xs"
                >
                  <Github className="w-3.5 h-3.5 text-white" />
                  <span>Launch Session Reader</span>
                </button>
                <button
                  onClick={() => onOpenQuiz && onOpenQuiz(session)}
                  className="px-3.5 py-1.5 rounded-lg bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] hover:text-white border border-[#30363d] text-xs font-semibold flex items-center space-x-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Take Quiz</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
