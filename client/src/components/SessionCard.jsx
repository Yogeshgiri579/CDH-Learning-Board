import React from 'react';
import { 
  CheckCircle2, 
  Lock, 
  Eye, 
  Clock,
  Sparkles
} from 'lucide-react';
import { Github } from './GithubIcon';
import { useAuth } from '../context/AuthContext';

export const SessionCard = ({ session, onPreview, onOpenGitHub, onOpenQuiz }) => {
  const { isCompleted, toggleComplete, isAuthenticated } = useAuth();
  
  const completed = isCompleted(session.sessionNumber);
  const isFree = session.sessionNumber < 5;
  const isLocked = !isFree && !isAuthenticated;

  const handleStartClick = (e) => {
    e.stopPropagation();
    onOpenGitHub(session);
  };

  const handlePreviewClick = (e) => {
    e.stopPropagation();
    onPreview(session);
  };

  return (
    <div 
      className={`group relative rounded-2xl border transition-all duration-150 p-5 flex flex-col justify-between ${
        completed
          ? 'border-emerald-800/60 bg-[#0e2417]'
          : 'border-[#30363d] bg-[#0d1117] hover:border-[#8b949e]'
      }`}
    >
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#21262d] text-[#8b949e] border border-[#30363d]">
              #{session.sessionNumber.toString().padStart(2, '0')}
            </span>

            {isFree ? (
              <span className="text-[11px] font-bold text-[#3fb950] bg-[#238636]/20 px-2 py-0.5 rounded border border-[#238636]/40">
                FREE
              </span>
            ) : isLocked ? (
              <span className="text-[11px] font-medium text-[#8b949e] bg-[#21262d] px-2 py-0.5 rounded border border-[#30363d] flex items-center space-x-1">
                <Lock className="w-3 h-3 text-[#8b949e]" />
                <span>Locked</span>
              </span>
            ) : null}
          </div>

          <button
            onClick={() => toggleComplete(session.sessionNumber)}
            title={completed ? 'Completed' : 'Mark as done'}
            className="text-[#484f58] hover:text-emerald-400 transition-colors p-1 cursor-pointer"
          >
            <CheckCircle2 className={`w-5 h-5 ${completed ? 'fill-emerald-400 text-slate-900' : 'text-[#484f58]'}`} />
          </button>
        </div>

        {/* Module Subtitle */}
        <p className="text-xs font-semibold text-[#58a6ff] uppercase tracking-wider truncate">
          {session.module.split(':')[1] || session.module}
        </p>

        {/* Title */}
        <h4 
          onClick={handlePreviewClick}
          className={`mt-1.5 text-base font-bold text-white group-hover:text-[#58a6ff] cursor-pointer transition-colors line-clamp-2 leading-snug ${
            completed ? 'text-[#8b949e] line-through' : ''
          }`}
        >
          {session.title}
        </h4>

        {/* Preview snippet */}
        <p className="mt-2 text-xs sm:text-sm text-[#8b949e] line-clamp-2 leading-relaxed">
          {session.preview}
        </p>

        {/* Tags */}
        {session.topics && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {session.topics.slice(0, 2).map((topic, i) => (
              <span 
                key={i} 
                className="text-xs bg-[#161b22] text-[#8b949e] px-2 py-0.5 rounded border border-[#21262d] font-medium truncate max-w-[200px]"
              >
                {topic}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer Details */}
      <div className="mt-5 pt-3.5 border-t border-[#21262d] flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2 text-xs text-[#8b949e] font-medium">
          <span className="flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5 text-[#484f58]" />
            <span>{session.duration}</span>
          </span>
          <span>•</span>
          <span className={session.difficulty === 'Beginner' ? 'text-emerald-400' : session.difficulty === 'Intermediate' ? 'text-amber-400' : 'text-purple-400'}>
            {session.difficulty}
          </span>
        </div>

        <div className="flex items-center space-x-1.5">
          {/* Quick Quiz Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenQuiz && onOpenQuiz(session);
            }}
            className="p-1.5 text-amber-400 hover:text-amber-300 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 cursor-pointer transition-colors"
            title="Take session quiz"
          >
            <Sparkles className="w-4 h-4" />
          </button>

          <button
            onClick={handlePreviewClick}
            className="p-1.5 text-[#8b949e] hover:text-white rounded-lg hover:bg-[#21262d] border border-transparent hover:border-[#30363d] cursor-pointer"
            title="Preview overview"
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Read button with Github icon & GitHub green styling */}
          <button
            onClick={handleStartClick}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer bg-[#238636] hover:bg-[#2ea043] text-white active:scale-95"
            title="Read session GitHub notes in-app"
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
        </div>
      </div>
    </div>
  );
};
