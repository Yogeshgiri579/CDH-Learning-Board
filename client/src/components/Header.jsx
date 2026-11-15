import React, { useState, useEffect } from 'react';
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
  Cpu,
  Trophy,
  HelpCircle,
  RotateCw
} from 'lucide-react';
import { Github } from './GithubIcon';

export const Header = ({ onStartNow, onPreviewSession0, firstSession, onOpenQuiz, onOpenLeaderboard }) => {
  const [activeTab, setActiveTab] = useState('interactive'); // 'interactive' | 'code' | 'progress' | 'arch'
  const [isFlipped, setIsFlipped] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Animation loop state for interactive preview: 0: Learn, 1: Play Quiz, 2: Rank Yourself
  const [animStep, setAnimStep] = useState(0);

  // Auto-cycle through the 3 steps smoothly with reduced snappy timing (2000ms)
  useEffect(() => {
    if (isFlipped || activeTab !== 'interactive') return;
    const interval = setInterval(() => {
      setAnimStep((prev) => (prev + 1) % 3);
    }, 2000);
    return () => clearInterval(interval);
  }, [animStep, isFlipped, activeTab]);

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
    <header className="relative bg-[#010409] text-white overflow-hidden border-b border-[#30363d]">
      
      {/* Subtle Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#21262d_1px,transparent_1px),linear-gradient(to_bottom,#21262d_1px,transparent_1px)] bg-[size:40px_40px] opacity-15 pointer-events-none" />

      {/* Main Wide 2-Column Hero Container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column: Headline, Copy, CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Eyebrow Badge Pill */}
            <div className="inline-flex items-center space-x-2.5 px-3.5 py-1.5 rounded-full bg-[#161b22] border border-[#30363d] text-[#c9d1d9] text-xs font-semibold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 font-bold">18,500+ Engineers Enrolled</span>
              <span className="text-[#30363d]">•</span>
              <span className="text-[#8b949e] font-normal">55 Hands-on Production Labs</span>
            </div>

            {/* Main Creative Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-extrabold tracking-tight text-white leading-[1.12]">
              Build the skills of a{' '}
              <span className="relative inline-block text-white font-black">
                MultiCloud & DevOps
                <svg 
                  className="absolute -bottom-2.5 left-0 w-full h-3.5 text-[#58a6ff] opacity-90 pointer-events-none" 
                  viewBox="0 0 250 12" 
                  fill="none" 
                  preserveAspectRatio="none"
                >
                  <path d="M3 9C60 3 190 3 247 9" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
                </svg>
              </span>{' '}
              Engineer
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base lg:text-lg text-[#8b949e] max-w-2xl leading-relaxed font-normal">
              55 production-grade labs taking you from Linux & AWS fundamentals to Terraform, Docker, Kubernetes, CI/CD pipelines, and AI Ops. Runnable code, architecture diagrams, and GitHub repositories the whole way down.
            </p>

            {/* Action CTA Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={onStartNow}
                className="px-6 py-3 rounded-xl bg-[#238636] hover:bg-[#2ea043] text-white font-semibold text-xs sm:text-sm shadow-md transition-all flex items-center space-x-2 group cursor-pointer"
              >
                <span>Start Learning for Free</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {firstSession && (
                <button
                  onClick={() => onPreviewSession0(firstSession)}
                  className="px-4 py-3 rounded-xl bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] hover:text-white font-semibold text-xs sm:text-sm border border-[#30363d] transition-colors flex items-center space-x-2 cursor-pointer"
                >
                  <PlayCircle className="w-4 h-4 text-[#58a6ff]" />
                  <span>Preview Session 00</span>
                </button>
              )}

              <a
                href="https://github.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 rounded-xl bg-[#161b22] hover:bg-[#21262d] text-[#c9d1d9] hover:text-white font-medium text-xs sm:text-sm border border-[#30363d] transition-colors flex items-center space-x-2 cursor-pointer"
              >
                <Github className="w-4 h-4 text-white" />
                <span>GitHub Repos</span>
                <ExternalLink className="w-3 h-3 text-[#8b949e]" />
              </a>
            </div>

            {/* Feature Matrix Badges */}
            <div className="pt-4 border-t border-[#30363d] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-[#c9d1d9]">
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

          {/* Right Column: Interactive 3-Step Flip & Simulation Card Window */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-[#0d1117] border border-[#30363d] shadow-2xl shadow-black/80 overflow-hidden transition-all duration-300 hover:border-[#58a6ff]/50">
              
              {/* Window Titlebar */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-[#30363d] bg-[#161b22]">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                  <span className="text-xs font-mono text-[#8b949e] pl-2 hidden sm:inline">
                    {isFlipped ? 'devops-workflow.ts' : '/labs/multicloud-vpc.tf'}
                  </span>
                </div>

                {/* Tab Controls + Flip Button */}
                <div className="flex items-center space-x-1.5">
                  <div className="flex items-center space-x-1 p-0.5 bg-[#21262d] rounded-lg text-xs border border-[#30363d]">
                    <button
                      onClick={() => { setActiveTab('interactive'); setIsFlipped(false); }}
                      className={`px-2 py-1 rounded text-[11px] font-semibold transition-all flex items-center space-x-1 ${
                        activeTab === 'interactive' && !isFlipped
                          ? 'bg-[#58a6ff]/20 text-[#58a6ff] border border-[#58a6ff]/40 shadow-xs' 
                          : 'text-[#8b949e] hover:text-white'
                      }`}
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Learn & Rank</span>
                    </button>
                    <button
                      onClick={() => { setActiveTab('code'); setIsFlipped(false); }}
                      className={`px-2 py-1 rounded text-[11px] font-semibold transition-all flex items-center space-x-1 ${
                        activeTab === 'code' && !isFlipped
                          ? 'bg-[#30363d] text-white shadow-xs' 
                          : 'text-[#8b949e] hover:text-white'
                      }`}
                    >
                      <Code2 className="w-3 h-3" />
                      <span>Code</span>
                    </button>
                  </div>

                  <button
                    onClick={() => setIsFlipped(!isFlipped)}
                    title="Flip card between 3-Step Journey and Live Simulation"
                    className="p-1.5 rounded-lg bg-[#21262d] hover:bg-[#30363d] text-[#8b949e] hover:text-[#58a6ff] border border-[#30363d] transition-colors cursor-pointer"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* CARD FACE A: 3 Clear Steps (LEARN • PLAY QUIZ • RANK YOURSELF) with Live Simulation */}
              {!isFlipped && activeTab === 'interactive' && (
                <div className="p-4 sm:p-5 space-y-4 text-left font-sans">
                  
                  {/* The 3 Core Pillars Banner */}
                  <div className="grid grid-cols-3 gap-2 p-1.5 bg-[#010409] rounded-xl border border-[#30363d]">
                    {/* Step 1: Learn */}
                    <button
                      onClick={() => setAnimStep(0)}
                      className={`relative p-2.5 rounded-lg text-left transition-all cursor-pointer overflow-hidden ${
                        animStep === 0 
                          ? 'bg-[#238636]/15 border border-[#238636]/40 text-[#3fb950] shadow-sm' 
                          : 'hover:bg-[#161b22] text-[#8b949e] border border-transparent'
                      }`}
                    >
                      <div className="flex items-center space-x-1.5">
                        <BookOpen className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Step 1</span>
                      </div>
                      <div className="font-extrabold text-xs sm:text-sm text-white mt-0.5">LEARN</div>
                      <div className="text-[10px] text-[#8b949e] leading-tight mt-0.5 truncate">Read 55 Labs</div>
                      {animStep === 0 && (
                        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#238636]/40 overflow-hidden">
                          <div key={animStep} className="h-full bg-emerald-400 animate-step-progress" />
                        </div>
                      )}
                    </button>

                    {/* Step 2: Play Quiz */}
                    <button
                      onClick={() => setAnimStep(1)}
                      className={`relative p-2.5 rounded-lg text-left transition-all cursor-pointer overflow-hidden ${
                        animStep === 1 
                          ? 'bg-[#f78166]/15 border border-[#f78166]/40 text-[#f78166] shadow-sm' 
                          : 'hover:bg-[#161b22] text-[#8b949e] border border-transparent'
                      }`}
                    >
                      <div className="flex items-center space-x-1.5">
                        <HelpCircle className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Step 2</span>
                      </div>
                      <div className="font-extrabold text-xs sm:text-sm text-white mt-0.5">PLAY QUIZ</div>
                      <div className="text-[10px] text-[#8b949e] leading-tight mt-0.5 truncate">149+ MCQs</div>
                      {animStep === 1 && (
                        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#f78166]/40 overflow-hidden">
                          <div key={animStep} className="h-full bg-orange-400 animate-step-progress" />
                        </div>
                      )}
                    </button>

                    {/* Step 3: Rank Yourself */}
                    <button
                      onClick={() => setAnimStep(2)}
                      className={`relative p-2.5 rounded-lg text-left transition-all cursor-pointer overflow-hidden ${
                        animStep === 2 
                          ? 'bg-[#e3b341]/15 border border-[#e3b341]/40 text-[#e3b341] shadow-sm' 
                          : 'hover:bg-[#161b22] text-[#8b949e] border border-transparent'
                      }`}
                    >
                      <div className="flex items-center space-x-1.5">
                        <Trophy className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Step 3</span>
                      </div>
                      <div className="font-extrabold text-xs sm:text-sm text-white mt-0.5">RANK UP</div>
                      <div className="text-[10px] text-[#8b949e] leading-tight mt-0.5 truncate">Leaderboard</div>
                      {animStep === 2 && (
                        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#e3b341]/40 overflow-hidden">
                          <div key={animStep} className="h-full bg-amber-400 animate-step-progress" />
                        </div>
                      )}
                    </button>
                  </div>

                  {/* Dynamic Simulation Box - Fixed height and clean transition */}
                  <div className="relative p-3.5 sm:p-4 rounded-xl bg-[#010409] border border-[#30363d] h-[185px] sm:h-[180px] flex flex-col justify-between overflow-hidden">

                    {/* STEP 0: Simulated Reading Screen */}
                    {animStep === 0 && (
                      <div className="space-y-2.5 transition-opacity duration-200">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-2">
                            <span className="px-1.5 py-0.5 rounded bg-[#238636]/20 text-emerald-400 font-mono text-[10px] font-bold border border-[#238636]/40">
                              ACTION 01
                            </span>
                            <span className="font-bold text-white text-xs truncate max-w-[190px]">
                              Read Session Notes
                            </span>
                          </div>
                          <span className="text-[10px] text-emerald-400 font-mono">100% Free Notes</span>
                        </div>

                        <div className="p-2.5 rounded-lg bg-[#0d1117] border border-[#30363d] space-y-1.5 text-xs text-[#c9d1d9]">
                          <div className="flex items-center justify-between font-mono text-[11px] text-[#8b949e]">
                            <span>Session-01-DevOps-Introduction</span>
                            <span className="text-emerald-400 text-[10px]">● live</span>
                          </div>
                          <p className="text-[11px] text-[#8b949e] line-clamp-2">
                            Deep dive into CALMS framework, CI/CD pipeline automation, and multi-cloud infrastructure patterns with runnable GitHub code.
                          </p>
                        </div>

                        <div className="pt-1 flex items-center justify-between">
                          <button
                            onClick={() => firstSession && onPreviewSession0(firstSession)}
                            className="px-3 py-1.5 rounded-lg bg-[#238636] hover:bg-[#2ea043] text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer shadow-sm"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>Click to Read Notes</span>
                          </button>
                          <span className="text-[11px] text-[#8b949e]">Step 1 of 3</span>
                        </div>
                      </div>
                    )}

                    {/* STEP 1: Simulated Quiz Question Screen */}
                    {animStep === 1 && (
                      <div className="space-y-2.5 transition-opacity duration-200">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-2">
                            <span className="px-1.5 py-0.5 rounded bg-[#f78166]/20 text-[#f78166] font-mono text-[10px] font-bold border border-[#f78166]/40">
                              ACTION 02
                            </span>
                            <span className="font-bold text-white text-xs truncate max-w-[190px]">
                              Play Interactive Quiz
                            </span>
                          </div>
                          <span className="text-[10px] text-[#f78166] font-mono">+25 Points</span>
                        </div>

                        <div className="p-2.5 rounded-lg bg-[#0d1117] border border-[#30363d] space-y-2">
                          <p className="text-xs font-semibold text-white">
                            Q: What does CALMS stand for in DevOps culture?
                          </p>
                          <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                            <div className="p-1 rounded bg-[#21262d] text-[#8b949e] border border-[#30363d] truncate">
                              A. Code, Auto, Log...
                            </div>
                            <div className="p-1 rounded bg-[#238636]/20 text-emerald-400 border border-[#238636]/60 font-bold flex items-center justify-between truncate">
                              <span>B. Culture, Auto...</span>
                              <Check className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                            </div>
                          </div>
                        </div>

                        <div className="pt-1 flex items-center justify-between">
                          <button
                            onClick={() => firstSession && onOpenQuiz && onOpenQuiz(firstSession)}
                            className="px-3 py-1.5 rounded-lg bg-[#f78166] hover:bg-[#fa9a85] text-black font-extrabold text-xs flex items-center space-x-1.5 transition-colors cursor-pointer shadow-sm"
                          >
                            <HelpCircle className="w-3.5 h-3.5" />
                            <span>Play Live Quiz</span>
                          </button>
                          <span className="text-[11px] text-[#8b949e]">Step 2 of 3</span>
                        </div>
                      </div>
                    )}

                    {/* STEP 2: Simulated Leaderboard Rank Screen */}
                    {animStep === 2 && (
                      <div className="space-y-2.5 transition-opacity duration-200">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-2">
                            <span className="px-1.5 py-0.5 rounded bg-[#e3b341]/20 text-[#e3b341] font-mono text-[10px] font-bold border border-[#e3b341]/40">
                              ACTION 03
                            </span>
                            <span className="font-bold text-white text-xs truncate max-w-[190px]">
                              Rank Yourself on Board
                            </span>
                          </div>
                          <span className="text-[10px] text-[#e3b341] font-mono">Top 5% Rank</span>
                        </div>

                        <div className="p-2.5 rounded-lg bg-[#0d1117] border border-[#30363d] space-y-1.5">
                          <div className="flex items-center justify-between text-xs font-semibold text-[#c9d1d9]">
                            <div className="flex items-center space-x-2">
                              <span className="w-5 h-5 rounded-full bg-amber-400 text-black font-black text-[10px] flex items-center justify-center">
                                1
                              </span>
                              <span className="text-white text-xs">Rahul S.</span>
                              <span className="text-[10px] text-[#8b949e]">(55/55 Passed)</span>
                            </div>
                            <span className="font-mono text-emerald-400 text-xs">1,850 pts</span>
                          </div>
                          <div className="flex items-center justify-between text-xs font-semibold text-[#c9d1d9] bg-[#21262d]/50 p-1 rounded">
                            <div className="flex items-center space-x-2">
                              <span className="w-5 h-5 rounded-full bg-[#58a6ff] text-black font-black text-[10px] flex items-center justify-center">
                                You
                              </span>
                              <span className="text-[#58a6ff] text-xs">Your Profile</span>
                            </div>
                            <span className="font-mono text-white text-xs">Ready to Rank</span>
                          </div>
                        </div>

                        <div className="pt-1 flex items-center justify-between">
                          <button
                            onClick={onOpenLeaderboard}
                            className="px-3 py-1.5 rounded-lg bg-[#e3b341] hover:bg-[#f0c24c] text-black font-extrabold text-xs flex items-center space-x-1.5 transition-colors cursor-pointer shadow-sm"
                          >
                            <Trophy className="w-3.5 h-3.5" />
                            <span>View Leaderboard</span>
                          </button>
                          <span className="text-[11px] text-[#8b949e]">Step 3 of 3</span>
                        </div>
                      </div>
                    )}

                  </div>

                </div>
              )}

              {/* CARD FACE B: Code & Infrastructure Details */}
              {(isFlipped || activeTab === 'code') && (
                <div className="p-4 sm:p-5 space-y-3 font-mono text-left animate-in fade-in duration-150">
                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center space-x-2">
                      <span className="px-1.5 py-0.5 rounded bg-[#21262d] text-[#58a6ff] border border-[#30363d] font-bold uppercase tracking-wider text-[10px]">
                        Session 01
                      </span>
                      <span className="text-[#8b949e] font-sans">AWS High-Availability VPC</span>
                    </div>
                    <button
                      onClick={handleCopy}
                      className="flex items-center space-x-1 text-[#8b949e] hover:text-white px-2 py-1 rounded bg-[#21262d] hover:bg-[#30363d] transition-colors text-[11px]"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  {/* Code block with syntax styling */}
                  <div className="bg-[#010409] p-3.5 rounded-xl border border-[#30363d] text-xs overflow-x-auto text-[#c9d1d9] leading-relaxed custom-scrollbar">
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

                  <div className="pt-2 flex items-center justify-between text-[11px] text-[#8b949e] font-sans border-t border-[#21262d]">
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span>Ready to Deploy</span>
                    </div>
                    <button
                      onClick={() => { setIsFlipped(false); setActiveTab('interactive'); }}
                      className="text-[#58a6ff] hover:underline flex items-center space-x-1 cursor-pointer font-medium"
                    >
                      <span>← Back to Learn & Rank</span>
                    </button>
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
