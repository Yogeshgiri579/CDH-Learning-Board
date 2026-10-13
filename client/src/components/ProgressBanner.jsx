import React from 'react';
import { CheckCircle2, Flame, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const ProgressBanner = ({ totalSessions = 55 }) => {
  const { completedCount, isAuthenticated, openAuthModal } = useAuth();

  const percentage = Math.round((completedCount / totalSessions) * 100);

  return (
    <div className="bg-[#0a0f1d] border-b border-slate-800/80 py-2.5 px-4 sm:px-6 lg:px-8 text-slate-300">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 text-xs">
        
        {/* Progress Bar & Counter */}
        <div className="flex items-center space-x-3 min-w-0 flex-1">
          <span className="font-semibold text-slate-200 whitespace-nowrap hidden sm:inline">
            Your Progress:
          </span>
          
          <div className="flex-1 max-w-xs bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
            <div 
              className="bg-gradient-to-r from-blue-500 to-emerald-400 h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.max(percentage, completedCount > 0 ? 4 : 0)}%` }}
            />
          </div>

          <span className="font-mono font-bold text-slate-300 whitespace-nowrap">
            {completedCount}/{totalSessions} ({percentage}%)
          </span>
        </div>

        {/* Status / Streak / Sync */}
        <div className="flex items-center space-x-3 flex-shrink-0">
          <div className="hidden md:flex items-center space-x-1.5 text-slate-400">
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="font-medium text-slate-300">55-Day Challenge</span>
          </div>

          {!isAuthenticated ? (
            <button
              onClick={() => openAuthModal('Sign in with Google to sync your completed sessions across devices')}
              className="text-blue-400 hover:text-blue-300 font-semibold flex items-center space-x-1 transition-colors"
            >
              <span>Sync</span>
              <Sparkles className="w-3 h-3 text-blue-400" />
            </button>
          ) : (
            <span className="text-emerald-400 font-medium flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Synced</span>
            </span>
          )}
        </div>

      </div>
    </div>
  );
};
