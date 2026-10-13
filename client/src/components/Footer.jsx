import { Terminal, ExternalLink } from 'lucide-react';
import { Github } from './GithubIcon';

const CURRENT_YEAR = new Date().getFullYear();

export const Footer = () => {
  return (
    <footer className="bg-[#050811] border-t border-slate-800/90 mt-16 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xs">
                <Terminal className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-lg text-white">
                CloudDevOps<span className="text-blue-400">Hub</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Curated 55-Session hands-on learning roadmap for MultiCloud Engineering, 
              DevOps Automation, Container Orchestration, CI/CD, and AI-driven SRE operations.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a
                href="https://github.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#0d1322] hover:bg-[#111a30] text-xs font-semibold text-slate-300 border border-slate-800 transition-colors"
              >
                <Github className="w-4 h-4 text-slate-300" />
                <span>MultiCloud-DevOps-AI-Challenge</span>
                <ExternalLink className="w-3 h-3 text-slate-500" />
              </a>
            </div>
          </div>

          {/* Quick Curriculum Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Roadmap Modules
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-blue-400 transition-colors cursor-pointer">Phase 1: DevOps Foundations (Free)</li>
              <li className="hover:text-blue-400 transition-colors cursor-pointer">Phase 2: Linux Administration</li>
              <li className="hover:text-blue-400 transition-colors cursor-pointer">Phase 3: Git & CI/CD Pipelines</li>
              <li className="hover:text-blue-400 transition-colors cursor-pointer">Phase 4: AWS, GCP & Azure Multi-Cloud</li>
              <li className="hover:text-blue-400 transition-colors cursor-pointer">Phase 5 & 6: Docker & Kubernetes</li>
              <li className="hover:text-blue-400 transition-colors cursor-pointer">Phase 7 & 8: Terraform & AI Ops</li>
            </ul>
          </div>

          {/* Resource Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Resources & Community
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://github.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge/tree/main/FREE%20Workshop's"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 flex items-center space-x-1"
                >
                  <span>FREE Workshops</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge/tree/main/Mock-Interview"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 flex items-center space-x-1"
                >
                  <span>Mock Interview Prep</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 flex items-center space-x-1"
                >
                  <span>Report an Issue / Ask Question</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <p>© {CURRENT_YEAR} CloudDevOpsHub LMS. Built for ambitious cloud engineers.</p>
          <p className="flex items-center space-x-1">
            <span>Free starter trial includes first 5 sessions with direct GitHub redirect</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
