import React from 'react';
import { CheckCircle2, Flame, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const ProgressBanner = ({ totalSessions = 55 }) => {
  const { completedCount, isAuthenticated, openAuthModal } = useAuth();

  const percentage = Math.round((completedCount / totalSessions) * 100);

  return (
    <div className="bg-[#0d1117] border-b border-[#30363d] py-2.5 px-4 sm:px-6 lg:px-8 text-[#c9d1d9]">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 text-xs">
        
        {/* Progress Bar & Counter */}
        <div className="flex items-center space-x-3 min-w-0 flex-1">
          <span className="font-semibold text-[#f0f6fc] whitespace-nowrap hidden sm:inline">
            Your Progress:
          </span>
          
          <div className="flex-1 max-w-xs bg-[#21262d] h-2 rounded-full overflow-hidden border border-[#30363d]">
            <div 
              className="bg-[#238636] h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.max(percentage, completedCount > 0 ? 4 : 0)}%` }}
            />
          </div>

          <span className="font-mono font-bold text-[#c9d1d9] whitespace-nowrap">
            {completedCount}/{totalSessions} ({percentage}%)
          </span>
        </div>

        {/* Status / Streak / Sync */}
        <div className="flex items-center space-x-3 flex-shrink-0">
          <div className="hidden md:flex items-center space-x-1.5 text-[#8b949e]">
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="font-medium text-[#c9d1d9]">55-Day Challenge</span>
          </div>

          {!isAuthenticated ? (
            <button
              onClick={() => openAuthModal('Sign in with Google to sync your completed sessions across devices')}
              className="text-[#58a6ff] hover:underline font-semibold flex items-center space-x-1 transition-colors cursor-pointer"
            >
              <span>Sync Progress</span>
              <Sparkles className="w-3 h-3 text-[#58a6ff]" />
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
