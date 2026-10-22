import { Terminal, ExternalLink } from 'lucide-react';
import { Github } from './GithubIcon';

const CURRENT_YEAR = new Date().getFullYear();

export const Footer = () => {
  return (
    <footer className="bg-[#010409] border-t border-[#30363d] mt-16 text-[#8b949e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#21262d] border border-[#30363d] flex items-center justify-center text-white">
                <Terminal className="w-4 h-4 text-[#58a6ff]" />
              </div>
              <span className="font-extrabold text-lg text-white">
                CloudDevOps<span className="text-[#58a6ff]">Hub</span>
              </span>
            </div>
            <p className="text-xs text-[#8b949e] max-w-sm leading-relaxed">
              Curated 55-Session hands-on learning roadmap for MultiCloud Engineering, 
              DevOps Automation, Container Orchestration, CI/CD, and AI-driven SRE operations.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a
                href="https://github.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#161b22] hover:bg-[#21262d] text-xs font-semibold text-[#c9d1d9] border border-[#30363d] transition-colors"
              >
                <Github className="w-4 h-4 text-white" />
                <span>MultiCloud-DevOps-AI-Challenge</span>
                <ExternalLink className="w-3 h-3 text-[#8b949e]" />
              </a>
            </div>
          </div>

          {/* Quick Curriculum Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#f0f6fc] mb-3">
              Roadmap Modules
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-[#58a6ff] transition-colors cursor-pointer">Phase 1: DevOps Foundations (Free)</li>
              <li className="hover:text-[#58a6ff] transition-colors cursor-pointer">Phase 2: Linux Administration</li>
              <li className="hover:text-[#58a6ff] transition-colors cursor-pointer">Phase 3: Git & CI/CD Pipelines</li>
              <li className="hover:text-[#58a6ff] transition-colors cursor-pointer">Phase 4: AWS, GCP & Azure Multi-Cloud</li>
              <li className="hover:text-[#58a6ff] transition-colors cursor-pointer">Phase 5 & 6: Docker & Kubernetes</li>
              <li className="hover:text-[#58a6ff] transition-colors cursor-pointer">Phase 7 & 8: Terraform & AI Ops</li>
            </ul>
          </div>

          {/* Resource Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#f0f6fc] mb-3">
              Resources & Community
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://github.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#58a6ff] transition-colors inline-flex items-center space-x-1"
                >
                  <span>Report Lab Issue</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge/pulls"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#58a6ff] transition-colors inline-flex items-center space-x-1"
                >
                  <span>Submit Solution PR</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/CloudDevOpsHub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#58a6ff] transition-colors inline-flex items-center space-x-1"
                >
                  <span>GitHub Organization</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom credits */}
        <div className="pt-6 border-t border-[#21262d] flex flex-col sm:flex-row items-center justify-between text-xs text-[#8b949e] gap-3">
          <p>© {CURRENT_YEAR} CloudDevOpsHub. All rights reserved.</p>
          <p className="flex items-center space-x-1">
            <span>Built for DevOps & MultiCloud Practitioners with</span>
            <span className="text-rose-400">♥</span>
          </p>
        </div>

      </div>
    </footer>
  );
};
