import React, { useState, useMemo } from 'react';
import { 
  ChevronDown,
  Sparkles,
  Search,
  X,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { SessionRow } from './SessionRow';
import { useAuth } from '../context/AuthContext';

// Exact 8 Module Definitions matching CloudDevOpsHub 55 Sessions
export const MODULE_METADATA = [
  {
    id: 'm1',
    moduleNum: 'Module 1',
    title: 'DevOps Foundations & Mindset Kickoff',
    description: 'Program setup, Git basics, mindset & cloud virtualization fundamentals (Sessions 00 - 04)',
    badge: 'Free Access 🟢',
    badgeClass: 'bg-[#238636]/20 text-[#3fb950] border border-[#238636]/40',
  },
  {
    id: 'm2',
    moduleNum: 'Module 2',
    title: 'Linux Administration & Shell Automation',
    description: 'Bash scripting, user permissions, networking, process management & systemd (Sessions 05 - 12)',
    badge: '8 Sessions',
    badgeClass: 'bg-[#21262d] text-[#c9d1d9] border border-[#30363d]',
  },
  {
    id: 'm3',
    moduleNum: 'Module 3',
    title: 'Git & Version Control Workflows',
    description: 'Branching strategies, interactive rebase, pull request workflows & CI triggers (Sessions 13 - 18)',
    badge: '6 Sessions',
    badgeClass: 'bg-[#21262d] text-[#c9d1d9] border border-[#30363d]',
  },
  {
    id: 'm4',
    moduleNum: 'Module 4',
    title: 'Multi-Cloud Architecture (AWS, GCP, Azure)',
    description: 'IAM, VPC networking, compute, storage, security & multi-cloud design (Sessions 19 - 28)',
    badge: '10 Sessions',
    badgeClass: 'bg-[#21262d] text-[#c9d1d9] border border-[#30363d]',
  },
  {
    id: 'm5',
    moduleNum: 'Module 5',
    title: 'Containers & Docker Mastery',
    description: 'Images, multi-stage Dockerfiles, Docker Compose, volumes & container networking (Sessions 29 - 36)',
    badge: '8 Sessions',
    badgeClass: 'bg-[#21262d] text-[#c9d1d9] border border-[#30363d]',
  },
  {
    id: 'm6',
    moduleNum: 'Module 6',
    title: 'Kubernetes (K8s) Production Orchestration',
    description: 'Pods, Deployments, Services, Ingress, ConfigMaps, Helm charts & RBAC (Sessions 37 - 45)',
    badge: '9 Sessions',
    badgeClass: 'bg-[#21262d] text-[#c9d1d9] border border-[#30363d]',
  },
  {
    id: 'm7',
    moduleNum: 'Module 7',
    title: 'Infrastructure as Code with Terraform & GitOps',
    description: 'HCL syntax, state management, modules, remote backends & multi-env IaC (Sessions 46 - 50)',
    badge: '5 Sessions',
    badgeClass: 'bg-[#21262d] text-[#c9d1d9] border border-[#30363d]',
  },
  {
    id: 'm8',
    moduleNum: 'Module 8',
    title: 'Observability, SRE & AI in DevOps',
    description: 'Prometheus, Grafana, Loki logs, alert triage & AI Root Cause Analysis (Sessions 51 - 54)',
    badge: '4 Sessions',
    badgeClass: 'bg-[#21262d] text-[#c9d1d9] border border-[#30363d]',
  },
];

export const CurriculumSheet = ({
  sessions = [],
  onPreview,
  onOpenGitHub,
  onOpenQuiz,
  onOpenModuleQuiz,
  searchQuery = '',
  selectedModule = 'all',
  onClearSearch
}) => {
  const { isCompleted } = useAuth();

  // On initial load: Collapse all modules except Module 1 (m1 is expanded)
  const [collapsedModules, setCollapsedModules] = useState({
    m2: true,
    m3: true,
    m4: true,
    m5: true,
    m6: true,
    m7: true,
    m8: true,
  });

  // Group filtered sessions by their moduleId
  const groupedModules = useMemo(() => {
    return MODULE_METADATA.map((meta) => {
      const moduleSessions = sessions.filter((s) => s.moduleId === meta.id);
      const total = moduleSessions.length;
      const completedCount = moduleSessions.filter((s) => isCompleted(s.sessionNumber)).length;
      const percent = total > 0 ? Math.round((completedCount / total) * 100) : 0;

      return {
        ...meta,
        sessions: moduleSessions,
        total,
        completedCount,
        percent,
      };
    }).filter((m) => {
      // If a specific module pill was clicked at top level
      if (selectedModule !== 'all' && m.id !== selectedModule) return false;
      // Hide modules that have 0 sessions matching current search filter
      return m.sessions.length > 0;
    });
  }, [sessions, selectedModule, isCompleted]);

  const toggleModule = (moduleId) => {
    setCollapsedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  const expandAll = () => {
    setCollapsedModules({});
  };

  const collapseAll = () => {
    const allCollapsed = {};
    MODULE_METADATA.forEach((m) => {
      allCollapsed[m.id] = true;
    });
    setCollapsedModules(allCollapsed);
  };

  const hasSearch = searchQuery.trim().length > 0;

  return (
    <div className="space-y-4">
      {/* Dynamic Search Filter Status Banner */}
      {hasSearch && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-[#161b22] via-[#0d1117] to-[#161b22] border border-[#58a6ff]/50 shadow-lg shadow-[#58a6ff]/5 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-[#58a6ff]/15 text-[#58a6ff] border border-[#58a6ff]/30 flex items-center justify-center flex-shrink-0">
              <Search className="w-4 h-4 animate-pulse" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2 flex-wrap">
                <span className="text-xs sm:text-sm font-extrabold text-white">
                  Filtered Results:
                </span>
                <span className="px-2 py-0.5 rounded-lg bg-[#58a6ff]/20 text-[#58a6ff] border border-[#58a6ff]/40 font-mono text-xs font-bold">
                  "{searchQuery}"
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-[#8b949e] mt-0.5">
                Found <span className="font-bold text-white">{sessions.length}</span> matching sessions across <span className="font-bold text-white">{groupedModules.length}</span> modules • All matching modules expanded
              </p>
            </div>
          </div>

          {onClearSearch && (
            <button
              onClick={onClearSearch}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#21262d] hover:bg-rose-500/20 text-[#c9d1d9] hover:text-rose-300 border border-[#30363d] hover:border-rose-500/40 transition-all flex items-center space-x-1.5 cursor-pointer shadow-xs"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear Filter</span>
            </button>
          )}
        </div>
      )}

      {/* Top Module summary & Expand/Collapse actions */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-[#8b949e] px-1 font-medium">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-[#f0f6fc]">Curriculum Modules</span>
          <span className="text-[#30363d]">•</span>
          <span>{groupedModules.length} Modules</span>
        </div>

        <div className="flex items-center space-x-2 text-xs sm:text-sm">
          <button
            onClick={expandAll}
            className="hover:text-[#58a6ff] text-[#8b949e] font-semibold transition-colors cursor-pointer"
          >
            Expand All
          </button>
          <span className="text-[#30363d]">/</span>
          <button
            onClick={collapseAll}
            className="hover:text-[#58a6ff] text-[#8b949e] font-semibold transition-colors cursor-pointer"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Structured Module Sections */}
      <div className="space-y-4">
        {groupedModules.map((mod) => {
          // If searching, auto-expand so user can immediately see the match; otherwise obey collapsedModules
          const isCollapsed = !hasSearch && !!collapsedModules[mod.id];

          return (
            <div 
              key={mod.id}
              className="group bg-[#0d1117] rounded-2xl border border-[#30363d] transition-all duration-200 overflow-hidden shadow-sm"
            >
              {/* Module Header Bar */}
              <div 
                onClick={() => toggleModule(mod.id)}
                className="p-3.5 sm:px-6 sm:py-4 bg-[#161b22] hover:bg-[#21262d] border-b border-[#30363d] cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 select-none transition-colors"
              >
                {/* Left/Top: Module Tag & Info */}
                <div className="flex items-start sm:items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
                  <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-[#21262d] border border-[#30363d] text-[#58a6ff] flex items-center justify-center font-extrabold text-xs sm:text-base flex-shrink-0 shadow-xs mt-0.5 sm:mt-0">
                    {mod.moduleNum.replace('Module ', 'M')}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2 sm:block">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                          <h3 className="text-sm sm:text-lg font-bold text-white group-hover:text-[#58a6ff] transition-colors leading-snug">
                            {mod.moduleNum}: {mod.title}
                          </h3>
                          
                          <span className={`text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full border ${mod.badgeClass}`}>
                            {mod.badge}
                          </span>
                        </div>

                        <p className="text-[11px] sm:text-sm text-[#8b949e] line-clamp-1 sm:truncate mt-0.5">
                          {mod.description}
                        </p>
                      </div>

                      {/* Mobile-only right: Progress pill & Chevron at top */}
                      <div className="flex items-center space-x-2 sm:hidden flex-shrink-0 mt-0.5">
                        <span className="text-[11px] font-bold text-[#8b949e] font-mono bg-[#21262d] px-1.5 py-0.5 rounded border border-[#30363d]">
                          {mod.completedCount}/{mod.total}
                        </span>
                        <div className="p-0.5 rounded text-[#8b949e]">
                          <ChevronDown 
                            className={`w-4 h-4 transition-transform duration-200 ${
                              isCollapsed ? 'rotate-0' : 'rotate-180 text-[#58a6ff]'
                            }`} 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right/Bottom: Module Quiz CTA, Progress indicator & Desktop Chevron */}
                <div className="flex items-center justify-between sm:justify-end space-x-2.5 sm:space-x-3 flex-shrink-0 pt-2 sm:pt-0 border-t border-[#21262d] sm:border-t-0 pl-12 sm:pl-0">
                  {/* Module Quiz Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenModuleQuiz && onOpenModuleQuiz(mod.id, `${mod.moduleNum}: ${mod.title}`);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
                    title={`Take ${mod.moduleNum} Mastery Quiz`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Module Quiz</span>
                  </button>

                  {/* Desktop Progress Pill */}
                  <div className="hidden sm:flex items-center space-x-2">
                    <span className="text-xs sm:text-sm font-semibold text-[#c9d1d9]">
                      {mod.completedCount}/{mod.total} Done
                    </span>
                    <div className="w-16 sm:w-20 bg-[#21262d] h-2 rounded-full overflow-hidden border border-[#30363d]">
                      <div 
                        className="bg-emerald-500 h-full rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${mod.percent}%` }}
                      />
                    </div>
                  </div>

                  {/* Desktop Animated Chevron */}
                  <div className="hidden sm:block p-1 rounded-lg text-[#8b949e] group-hover:text-white transition-colors">
                    <ChevronDown 
                      className={`w-5 h-5 transition-transform duration-200 ease-in-out ${
                        isCollapsed ? 'rotate-0' : 'rotate-180 text-[#58a6ff]'
                      }`} 
                    />
                  </div>
                </div>
              </div>

              {/* Sessions Table */}
              {!isCollapsed && (
                <div className="animate-in fade-in duration-200 bg-[#0d1117]">
                  {/* Table Column Labels for Desktop */}
                  <div className="hidden md:flex items-center justify-between px-5 py-2.5 bg-[#161b22] border-b border-[#30363d] text-xs font-bold uppercase tracking-wider text-[#8b949e]">
                    <div className="flex items-center space-x-4 flex-1">
                      <span className="w-6 text-center">Done</span>
                      <span className="w-9">#</span>
                      <span>Session Title & Practical Scope</span>
                    </div>
                    <div className="flex items-center space-x-6 text-right pr-6">
                      <span className="hidden lg:inline w-24 text-center">Difficulty</span>
                      <span className="w-16 text-center">Duration</span>
                      <span className="w-28 text-center">Actions</span>
                    </div>
                  </div>

                  {/* Sessions Rows */}
                  <div className="divide-y divide-[#21262d]">
                    {mod.sessions.map((session) => (
                      <SessionRow
                        key={session.id}
                        session={session}
                        onPreview={onPreview}
                        onOpenGitHub={onOpenGitHub}
                        onOpenQuiz={onOpenQuiz}
                        searchQuery={searchQuery}
                      />
                    ))}
                  </div>
                </div>
              )}

            </div>
          );
        })}
      </div>
    </div>
  );
};
