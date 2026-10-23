import { Terminal, ExternalLink, MessageCircle, Users } from 'lucide-react';
import { Github } from './GithubIcon';
import { WhatsAppIcon } from './WhatsAppIcon';

const CURRENT_YEAR = new Date().getFullYear();

export const Footer = () => {
  const WHATSAPP_COMMUNITY_URL = "https://chat.whatsapp.com/GjN9K8MultiCloudCDH";

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
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
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

              {/* WhatsApp Community Button in Brand section */}
              <a
                href={WHATSAPP_COMMUNITY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-[#25D366]/15 hover:bg-[#25D366]/25 text-xs font-semibold text-[#25D366] border border-[#25D366]/40 transition-colors shadow-2xs"
              >
                <WhatsAppIcon className="w-3.5 h-3.5 fill-[#25D366]" />
                <span>Join WhatsApp Community</span>
                <ExternalLink className="w-3 h-3 text-[#25D366]/80" />
              </a>
            </div>
          </div>

          {/* Quick Curriculum Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#f0f6fc] mb-3">
              Roadmap Modules
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-[#58a6ff] transition-colors cursor-pointer">Module 1: DevOps Foundations (Free)</li>
              <li className="hover:text-[#58a6ff] transition-colors cursor-pointer">Module 2: Linux Administration</li>
              <li className="hover:text-[#58a6ff] transition-colors cursor-pointer">Module 3: Git & CI/CD Pipelines</li>
              <li className="hover:text-[#58a6ff] transition-colors cursor-pointer">Module 4: AWS, GCP & Azure Multi-Cloud</li>
              <li className="hover:text-[#58a6ff] transition-colors cursor-pointer">Module 5: Docker & Containers</li>
              <li className="hover:text-[#58a6ff] transition-colors cursor-pointer">Module 6: Kubernetes Orchestration</li>
              <li className="hover:text-[#58a6ff] transition-colors cursor-pointer">Module 7: Terraform & IaC</li>
              <li className="hover:text-[#58a6ff] transition-colors cursor-pointer">Module 8: Observability & AI Ops</li>
            </ul>
          </div>

          {/* Resource & WhatsApp Community Box */}
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#f0f6fc] mb-3">
                Resources & Links
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

            {/* Dedicated WhatsApp Card */}
            <div className="p-3.5 rounded-xl bg-white dark:bg-gradient-to-br dark:from-[#161b22] dark:to-[#0d1117] border border-[#25D366]/40 shadow-xs">
              <div className="flex items-center space-x-2 text-[#1f2328] dark:text-white font-bold text-xs">
                <div className="w-6 h-6 rounded-full bg-[#25D366]/20 flex items-center justify-center text-[#25D366]">
                  <WhatsAppIcon className="w-3.5 h-3.5 fill-[#25D366]" />
                </div>
                <span>DevOps WhatsApp Group</span>
              </div>
              <p className="text-[11px] text-[#57606a] dark:text-[#8b949e] mt-1 leading-relaxed">
                Connect with peers, get instant doubt support, and discuss real-world cloud scenarios.
              </p>
              <a
                href={WHATSAPP_COMMUNITY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2.5 w-full py-2 px-3 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition-all shadow-xs cursor-pointer"
              >
                <WhatsAppIcon className="w-3.5 h-3.5 fill-white" />
                <span className="text-white">Join WhatsApp Community</span>
              </a>
            </div>
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
