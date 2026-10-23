import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const ThemeToggle = ({ className = '', showLabel = false }) => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className={`p-2 rounded-xl border transition-all flex items-center space-x-2 cursor-pointer ${
        isDark
          ? 'bg-[#161b22] hover:bg-[#21262d] border-[#30363d] text-amber-300 hover:text-amber-200'
          : 'bg-[#f6f8fa] hover:bg-[#eaeef2] border-[#d0d7de] text-indigo-600 hover:text-indigo-800 shadow-2xs'
      } ${className}`}
    >
      {isDark ? (
        <Sun className="w-4 h-4 transition-transform duration-200 hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 transition-transform duration-200 hover:-rotate-12" />
      )}
      {showLabel && (
        <span className="text-xs font-semibold">
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </span>
      )}
    </button>
  );
};
