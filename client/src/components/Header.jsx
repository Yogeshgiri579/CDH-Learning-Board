import React, { useState } from 'react';
import { 
  ArrowRight, 
  PlayCircle, 
  ExternalLink, 
  CheckCircle2, 
  Copy, 
  Check, 
  Sparkles, 
  BookOpen, 
  Layers, 
  Code2, 
  Cpu
} from 'lucide-react';
import { Github } from './GithubIcon';

export const Header = ({ onStartNow, onPreviewSession0, firstSession, onSwitchToRoadmap }) => {
  const [activeTab, setActiveTab] = useState('code'); // 'code' | 'progress' | 'arch'
  const [copied, setCopied] = useState(false);

  const terraformSnippet = `module "production_vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.0.0"

  name = "cdh-multicloud-production"
  cidr = "10.0.0.0/16"

  azs             = ["us-east-1a", "us-east-1b"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24"]

  enable_nat_gateway = true
  single_nat_gateway = true
  enable_vpn_gateway = false

  tags = {
    Challenge   = "MultiCloud-DevOps-55"
    Environment = "production"
  }
}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(terraformSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="relative bg-gradient-to-b from-[#070b14] via-[#0b1020] to-[#070b14] text-white overflow-hidden border-b border-slate-800/80">
      
      {/* High-Tech Background Grid & Ambient Glows */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-20 right-0 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Wide 2-Column Hero Container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column: Big Headline, Impact Copy, CTAs, Trust Metrics */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Eyebrow Badge Pill (inspired by takeUforward learners badge) */}
            <div className="inline-flex items-center space-x-2.5 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-semibold backdrop-blur-xs shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 font-bold">18,500+ Engineers Enrolled</span>
              <span className="text-blue-400/40">•</span>
              <span className="text-slate-300 font-normal">55 Hands-on Production Labs</span>
            </div>

            {/* Main Creative Headline with Signature Curved Underline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-extrabold tracking-tight text-white leading-[1.12]">
              Build the skills of a{' '}
              <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300 font-black">
                MultiCloud & DevOps
                {/* SVG curved wave underline like takeUforward style */}
                <svg 
                  className="absolute -bottom-2.5 left-0 w-full h-3.5 text-blue-500 opacity-90 pointer-events-none" 
                  viewBox="0 0 250 12" 
                  fill="none" 
                  preserveAspectRatio="none"
                >
                  <path d="M3 9C60 3 190 3 247 9" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
                </svg>
              </span>{' '}
              Engineer
            </h1>

            {/* High-Impact Descriptive Subtitle */}
            <p className="text-sm sm:text-base lg:text-lg text-slate-300 max-w-2xl leading-relaxed font-normal">
              55 production-grade labs taking you from Linux & AWS fundamentals to Terraform, Docker, Kubernetes, CI/CD pipelines, and AI Ops. Runnable code, architecture diagrams, and GitHub repositories the whole way down.
            </p>

            {/* Action CTA Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={onStartNow}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all flex items-center space-x-2 group cursor-pointer"
              >
                <span>Start Learning for Free</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              {firstSession && (
                <button
                  onClick={() => onPreviewSession0(firstSession)}
                  className="px-5 py-3 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 hover:text-white font-semibold text-xs sm:text-sm border border-slate-700/80 shadow-xs hover:-translate-y-0.5 transition-all flex items-center space-x-2 cursor-pointer backdrop-blur-xs"
                >
                  <PlayCircle className="w-4 h-4 text-cyan-400" />
                  <span>Preview Session 00</span>
                </button>
              )}

              <a
                href="https://github.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 text-slate-300 hover:text-white font-medium text-xs sm:text-sm border border-slate-800 hover:border-slate-700 transition-colors flex items-center space-x-2 cursor-pointer"
              >
                <Github className="w-4 h-4 text-white" />
                <span>GitHub Repos</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </div>

            {/* Feature Matrix Badges */}
            <div className="pt-4 border-t border-slate-800/70 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-300">
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>55 Production Labs</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Real Terraform & K8s</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Kickoff 0–4 Free</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>LMS Checkpoints</span>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Code & Architecture Window (AIdemy + takeUforward style) */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-2xl shadow-black/60 overflow-hidden backdrop-blur-md">
              
              {/* Window Titlebar */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950/60">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                  <span className="text-xs font-mono text-slate-400 pl-2 hidden sm:inline">
                    /labs/multicloud-vpc.tf
                  </span>
                </div>

                {/* Tab Controls */}
                <div className="flex items-center space-x-1 p-0.5 bg-slate-800/80 rounded-lg text-xs">
                  <button
                    onClick={() => setActiveTab('code')}
                    className={`px-2 py-1 rounded text-[11px] font-semibold transition-all flex items-center space-x-1 ${
                      activeTab === 'code' 
                        ? 'bg-blue-600 text-white shadow-xs' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Code2 className="w-3 h-3" />
                    <span>Code</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('progress')}
                    className={`px-2 py-1 rounded text-[11px] font-semibold transition-all flex items-center space-x-1 ${
                      activeTab === 'progress' 
                        ? 'bg-blue-600 text-white shadow-xs' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <BookOpen className="w-3 h-3" />
                    <span>Roadmap</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('arch')}
                    className={`px-2 py-1 rounded text-[11px] font-semibold transition-all flex items-center space-x-1 ${
                      activeTab === 'arch' 
                        ? 'bg-blue-600 text-white shadow-xs' 
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Layers className="w-3 h-3" />
                    <span>Stack</span>
                  </button>
                </div>
              </div>

              {/* Window Body: Tab 1 - Code Snippet */}
              {activeTab === 'code' && (
                <div className="p-4 sm:p-5 space-y-3 font-mono text-left animate-in fade-in duration-150">
                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center space-x-2">
                      <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 font-bold uppercase tracking-wider text-[10px]">
                        Session 01
                      </span>
                      <span className="text-slate-400 font-sans">AWS High-Availability VPC</span>
                    </div>
                    <button
                      onClick={handleCopy}
                      className="flex items-center space-x-1 text-slate-400 hover:text-slate-200 px-2 py-1 rounded bg-slate-800/60 hover:bg-slate-800 transition-colors text-[11px]"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  {/* Code block with syntax styling */}
                  <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/80 text-xs overflow-x-auto text-slate-300 leading-relaxed custom-scrollbar">
                    <pre>
                      <code>
                        <span className="text-purple-400">module</span>{" "}
                        <span className="text-amber-300">"production_vpc"</span> {"{\n"}
                        {"  "}<span className="text-cyan-400">source</span>{"  = "}
                        <span className="text-emerald-300">"terraform-aws-modules/vpc/aws"</span>{"\n"}
                        {"  "}<span className="text-cyan-400">cidr</span>{"    = "}
                        <span className="text-emerald-300">"10.0.0.0/16"</span>{"\n"}
                        {"  "}<span className="text-cyan-400">azs</span>{"     = ["}
                        <span className="text-emerald-300">"us-east-1a"</span>,{" "}
                        <span className="text-emerald-300">"us-east-1b"</span>]{"\n"}
                        {"  "}<span className="text-cyan-400">enable_nat_gateway</span>{" = "}
                        <span className="text-amber-400">true</span>{"\n"}
                        {"  "}<span className="text-cyan-400">tags</span>{" = {\n"}
                        {"    "}<span className="text-slate-400">Challenge</span>{" = "}
                        <span className="text-emerald-300">"MultiCloud-DevOps-55"</span>{"\n"}
                        {"  }\n"}
                        {"}"}
                      </code>
                    </pre>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 font-sans border-t border-slate-800/70">
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span>Ready to Deploy</span>
                    </div>
                    <span className="text-slate-500">Terraform v1.6+ • AWS Provider</span>
                  </div>
                </div>
              )}

              {/* Window Body: Tab 2 - Progress Tracker (takeUforward Planly style) */}
              {activeTab === 'progress' && (
                <div className="p-5 space-y-4 text-left font-sans animate-in fade-in duration-150">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                      MultiCloud & DevOps Roadmap
                    </span>
                    <h3 className="text-base font-bold text-white mt-0.5">Your Active Learning Track</h3>
                    <p className="text-xs text-slate-400">Master 55 curated sessions step-by-step with checkpoints.</p>
                  </div>

                  <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Completed Sessions:</span>
                      <span className="font-bold text-emerald-400">1 / 55 (Starter Active)</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-800 rounded-full h-2">
                      <div className="bg-gradient-to-r from-blue-500 to-emerald-400 h-2 rounded-full w-[4%]" />
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-[11px]">
                      <div>
                        <span className="text-slate-500 block">Current Module</span>
                        <span className="font-medium text-slate-200">AWS Core Networking</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Next Milestone</span>
                        <span className="font-medium text-slate-200">Docker & Containers</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={onSwitchToRoadmap}
                    className="w-full py-2.5 px-3 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all"
                  >
                    <span>Open Roadmap Tree View</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Window Body: Tab 3 - Architecture Specs */}
              {activeTab === 'arch' && (
                <div className="p-5 space-y-3.5 text-left font-sans animate-in fade-in duration-150">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300">
                      <Cpu className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Full-Stack Cloud Architecture</h4>
                      <p className="text-[11px] text-slate-400">Production tools covered across the 55 sessions</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                      <span className="text-slate-400 text-[10px] block">Cloud Providers</span>
                      <span className="font-bold text-white">AWS, GCP & Azure</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                      <span className="text-slate-400 text-[10px] block">Containers</span>
                      <span className="font-bold text-white">Docker, K8s, EKS</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                      <span className="text-slate-400 text-[10px] block">IaC & CI/CD</span>
                      <span className="font-bold text-white">Terraform, GitHub Actions</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                      <span className="text-slate-400 text-[10px] block">Monitoring & AI</span>
                      <span className="font-bold text-white">Prometheus, AI Ops</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px] flex items-center space-x-2">
                    <Sparkles className="w-3.5 h-3.5 flex-shrink-0 text-emerald-400" />
                    <span>Includes real GitHub repositories with deployable terraform scripts.</span>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>

    </header>
  );
};
