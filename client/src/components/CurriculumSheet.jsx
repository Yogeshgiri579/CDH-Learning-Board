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
    badgeClass: 'bg-[#238636]/20 text-[#3fb950] border border-[#238636]/40',
  },
  {
    id: 'm2',
    moduleNum: 'Module 2',
    title: 'Linux Administration & Shell Automation',
    description: 'Bash scripting, user permissions, networking, process management & systemd',
    badge: '8 Sessions',
    badgeClass: 'bg-[#21262d] text-[#c9d1d9] border border-[#30363d]',
  },
  {
    id: 'm3',
    moduleNum: 'Module 3',
    title: 'Git & Version Control Workflows',
    description: 'Branching strategies, interactive rebase, pull request workflows & CI triggers',
    badge: '6 Sessions',
    badgeClass: 'bg-[#21262d] text-[#c9d1d9] border border-[#30363d]',
  },
  {
    id: 'm4',
    moduleNum: 'Module 4',
    title: 'Multi-Cloud Architecture (AWS, GCP, Azure)',
    description: 'IAM, VPC networking, compute, storage, security & multi-cloud design',
    badge: '10 Sessions',
    badgeClass: 'bg-[#21262d] text-[#c9d1d9] border border-[#30363d]',
  },
  {
    id: 'm5',
    moduleNum: 'Module 5',
    title: 'Containers & Docker Mastery',
    description: 'Images, multi-stage Dockerfiles, Docker Compose, volumes & container networking',
    badge: '8 Sessions',
    badgeClass: 'bg-[#21262d] text-[#c9d1d9] border border-[#30363d]',
  },
  {
    id: 'm6',
    moduleNum: 'Module 6',
    title: 'Kubernetes (K8s) Production Orchestration',
    description: 'Pods, Deployments, Services, Ingress, ConfigMaps, Helm charts & RBAC',
    badge: '9 Sessions',
    badgeClass: 'bg-[#21262d] text-[#c9d1d9] border border-[#30363d]',
  },
  {
    id: 'm7',
    moduleNum: 'Module 7',
    title: 'Infrastructure as Code with Terraform',
    description: 'HCL syntax, state management, modules, remote backends & multi-env IaC',
    badge: '7 Sessions',
    badgeClass: 'bg-[#21262d] text-[#c9d1d9] border border-[#30363d]',
  },
  {
    id: 'm8',
    moduleNum: 'Module 8',
    title: 'CI/CD Pipelines & DevSecOps',
    description: 'GitHub Actions, Jenkins, automated testing, SAST/DAST security & SonarQube',
    badge: '6 Sessions',
    badgeClass: 'bg-[#21262d] text-[#c9d1d9] border border-[#30363d]',
  },
  {
    id: 'm9',
    moduleNum: 'Module 9',
    title: 'Monitoring, Observability & SRE',
    description: 'Prometheus metrics, Grafana dashboards, ELK log aggregation & SLO/SLAs',
    badge: '5 Sessions',
    badgeClass: 'bg-[#21262d] text-[#c9d1d9] border border-[#30363d]',
  },
  {
    id: 'm10',
    moduleNum: 'Module 10',
    title: 'AIOps, Capstone & Enterprise Projects',
    description: 'AI-assisted DevOps workflows, end-to-end microservices deployment & capstone',
    badge: '6 Sessions',
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
}) => {
  const { isCompleted } = useAuth();

  // State to track accordion open/close per module (defaults to all expanded)
  const [collapsedModules, setCollapsedModules] = useState({});

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
          // If searching, auto-expand; otherwise obey collapsedModules
          const isCollapsed = !hasSearch && !!collapsedModules[mod.id];

          return (
            <div 
              key={mod.id}
              className="group bg-[#0d1117] rounded-2xl border border-[#30363d] transition-all duration-200 overflow-hidden shadow-sm"
            >
              {/* Module Header Bar */}
              <div 
                onClick={() => toggleModule(mod.id)}
                className="px-5 sm:px-6 py-4 bg-[#161b22] hover:bg-[#21262d] border-b border-[#30363d] cursor-pointer flex items-center justify-between gap-4 select-none transition-colors"
              >
                {/* Left: Module Tag & Info */}
                <div className="flex items-center space-x-3.5 sm:space-x-4 min-w-0 flex-1">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#21262d] border border-[#30363d] text-[#58a6ff] flex items-center justify-center font-extrabold text-sm sm:text-base flex-shrink-0 shadow-xs">
                    {mod.moduleNum.replace('Module ', 'M')}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-2.5 flex-wrap">
                      <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-[#58a6ff] transition-colors">
                        {mod.moduleNum}: {mod.title}
                      </h3>
                      
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${mod.badgeClass}`}>
                        {mod.badge}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-[#8b949e] truncate mt-0.5">
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
                    <span className="text-xs sm:text-sm font-semibold text-[#c9d1d9]">
                      {mod.completedCount}/{mod.total} Done
                    </span>
                    <div className="w-16 sm:w-20 bg-[#21262d] h-2 rounded-full overflow-hidden hidden sm:block border border-[#30363d]">
                      <div 
                        className="bg-emerald-500 h-full rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${mod.percent}%` }}
                      />
                    </div>
                  </div>

                  {/* Toggle Arrow with smooth rotation */}
                  <div className="p-1 rounded-lg text-[#8b949e] group-hover:text-white transition-colors">
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
