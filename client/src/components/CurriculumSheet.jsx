import React, { useState, useMemo } from 'react';
import { 
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { SessionRow } from './SessionRow';
import { useAuth } from '../context/AuthContext';

// Module Definitions matching CloudDevOpsHub 55 Sessions
const MODULE_METADATA = [
  {
    id: 'm1',
    moduleNum: 'Module 1',
    title: 'DevOps Foundations & Kickoff',
    description: 'Program setup, Git basics, mindset & cloud virtualization fundamentals',
    badge: 'Free Access 🟢',
    badgeClass: 'bg-emerald-950/60 text-emerald-400 border-emerald-800/60',
  },
  {
    id: 'm2',
    moduleNum: 'Module 2',
    title: 'Linux Administration & Shell Automation',
    description: 'Bash scripting, user permissions, networking, process management & systemd',
    badge: '8 Sessions',
    badgeClass: 'bg-slate-800 text-slate-300 border-slate-700',
  },
  {
    id: 'm3',
    moduleNum: 'Module 3',
    title: 'Git & Version Control Workflows',
    description: 'Branching strategies, interactive rebase, pull request workflows & CI triggers',
    badge: '6 Sessions',
    badgeClass: 'bg-slate-800 text-slate-300 border-slate-700',
  },
  {
    id: 'm4',
    moduleNum: 'Module 4',
    title: 'Multi-Cloud Architecture (AWS, GCP, Azure)',
    description: 'IAM, VPC networking, compute, storage, security & multi-cloud design',
    badge: '10 Sessions',
    badgeClass: 'bg-slate-800 text-slate-300 border-slate-700',
  },
  {
    id: 'm5',
    moduleNum: 'Module 5',
    title: 'Containers & Docker Mastery',
    description: 'Images, multi-stage Dockerfiles, Docker Compose, volumes & container networking',
    badge: '8 Sessions',
    badgeClass: 'bg-slate-800 text-slate-300 border-slate-700',
  },
  {
    id: 'm6',
    moduleNum: 'Module 6',
    title: 'Kubernetes (K8s) Production Orchestration',
    description: 'Pods, Deployments, Services, Ingress, ConfigMaps, Helm charts & RBAC',
    badge: '9 Sessions',
    badgeClass: 'bg-slate-800 text-slate-300 border-slate-700',
  },
  {
    id: 'm7',
    moduleNum: 'Module 7',
    title: 'Infrastructure as Code (Terraform) & GitOps',
    description: 'Declarative infra, state management, modules, CI/CD pipelines & ArgoCD GitOps',
    badge: '5 Sessions',
    badgeClass: 'bg-slate-800 text-slate-300 border-slate-700',
  },
  {
    id: 'm8',
    moduleNum: 'Module 8',
    title: 'Observability, SRE & AI in DevOps',
    description: 'Prometheus metrics, Grafana dashboards, Loki logging & AI-assisted root cause analysis',
    badge: '4 Sessions',
    badgeClass: 'bg-slate-800 text-slate-300 border-slate-700',
  },
];

export const CurriculumSheet = ({ 
  sessions, 
  onPreview, 
  onOpenGitHub,
  onOpenQuiz,
  onOpenModuleQuiz,
  searchQuery = ''
}) => {
  const { isCompleted } = useAuth();

  // Group filtered sessions into modules
  const groupedModules = useMemo(() => {
    return MODULE_METADATA.map((meta) => {
      const moduleSessions = sessions.filter((s) => s.moduleId === meta.id);
      const completedCount = moduleSessions.filter((s) => isCompleted(s.sessionNumber)).length;
      return {
        ...meta,
        sessions: moduleSessions,
        total: moduleSessions.length,
        completedCount,
        percent: moduleSessions.length > 0 ? Math.round((completedCount / moduleSessions.length) * 100) : 0,
      };
    }).filter(mod => mod.sessions.length > 0);
  }, [sessions, isCompleted]);

  // Collapsed state: ALL MODULES COLLAPSED BY DEFAULT ON INITIAL LOAD
  const [collapsedModules, setCollapsedModules] = useState(() => {
    const allCollapsed = {};
    MODULE_METADATA.forEach((m) => {
      allCollapsed[m.id] = true;
    });
    return allCollapsed;
  });

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
      {/* Top Module summary & Expand/Collapse actions */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-slate-400 px-1 font-medium">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-slate-200">Curriculum Modules</span>
          <span className="text-slate-600">•</span>
          <span>{groupedModules.length} Modules</span>
        </div>

        <div className="flex items-center space-x-2 text-xs sm:text-sm">
          <button
            onClick={expandAll}
            className="hover:text-blue-400 text-slate-400 font-semibold transition-colors cursor-pointer"
          >
            Expand All
          </button>
          <span className="text-slate-600">/</span>
          <button
            onClick={collapseAll}
            className="hover:text-blue-400 text-slate-400 font-semibold transition-colors cursor-pointer"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Structured Module Sections */}
      <div className="space-y-4">
        {groupedModules.map((mod) => {
          // If searching, auto-expand; otherwise obey collapsedModules
          const isCollapsed = !hasSearch && !!collapsedModules[mod.id];

          return (
            <div 
              key={mod.id}
              className={`group bg-[#0a0f1d] rounded-2xl border transition-all duration-300 overflow-hidden shadow-sm ${
                !isCollapsed ? 'border-blue-500/40 ring-1 ring-blue-500/20' : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Module Header Bar (Clickable with Active Animation) */}
              <div 
                onClick={() => toggleModule(mod.id)}
                className="px-5 sm:px-6 py-4 bg-[#0d1322] hover:bg-[#111a30] border-b border-slate-800/80 cursor-pointer flex items-center justify-between gap-4 select-none transition-colors active:scale-[0.998]"
              >
                {/* Left: Module Tag & Bigger Info */}
                <div className="flex items-center space-x-3.5 sm:space-x-4 min-w-0 flex-1">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-blue-500/10 border border-blue-400/30 text-blue-400 flex items-center justify-center font-extrabold text-sm sm:text-base flex-shrink-0 shadow-xs">
                    {mod.moduleNum.replace('Module ', 'M')}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-2.5 flex-wrap">
                      <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                        {mod.moduleNum}: {mod.title}
                      </h3>
                      
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${mod.badgeClass}`}>
                        {mod.badge}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-400 truncate mt-0.5">
                      {mod.description}
                    </p>
                  </div>
                </div>

                {/* Right: Module Quiz CTA, Progress indicator & Animated Chevron */}
                <div className="flex items-center space-x-2.5 sm:space-x-3 flex-shrink-0">
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
                    <span className="hidden sm:inline">Module Quiz</span>
                    <span className="sm:hidden">Quiz</span>
                  </button>

                  {/* Progress Pill */}
                  <div className="flex items-center space-x-2">
                    <span className="text-xs sm:text-sm font-semibold text-slate-300">
                      {mod.completedCount}/{mod.total} Done
                    </span>
                    <div className="w-16 sm:w-20 bg-slate-800 h-2 rounded-full overflow-hidden hidden sm:block">
                      <div 
                        className="bg-emerald-500 h-full rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${mod.percent}%` }}
                      />
                    </div>
                  </div>

                  {/* Toggle Arrow with smooth 180° rotation */}
                  <div className="p-1 rounded-lg text-slate-400 group-hover:text-slate-200 transition-colors">
                    <ChevronDown 
                      className={`w-5 h-5 transition-transform duration-300 ease-in-out ${
                        isCollapsed ? 'rotate-0' : 'rotate-180 text-blue-400'
                      }`} 
                    />
                  </div>
                </div>
              </div>

              {/* Sessions Table / List (Hidden when collapsed, animated entrance) */}
              {!isCollapsed && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300 ease-out bg-[#0a0f1d]">
                  {/* Table Column Labels for Desktop */}
                  <div className="hidden md:flex items-center justify-between px-5 py-2.5 bg-[#080d19] border-b border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-400">
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
                  <div className="divide-y divide-slate-800/60">
                    {mod.sessions.map((session) => (
                      <SessionRow
                        key={session.id}
                        session={session}
                        onPreview={onPreview}
                        onOpenGitHub={onOpenGitHub}
                        onOpenQuiz={onOpenQuiz}
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
