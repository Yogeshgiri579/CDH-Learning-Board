import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  Check,
  CheckCircle2,
  Code2,
  Copy,
  Gamepad2,
  GraduationCap,
  Laptop,
  PlayCircle,
  RotateCw,
  Sparkles,
  Sprout,
  Trophy,
  Zap,
} from 'lucide-react';

const JOURNEY_STEPS = [
  {
    label: 'STEP 1',
    title: 'Read Notes',
    description: 'Learn concepts with clear notes',
    action: 'Explore a lesson',
    icon: BookOpen,
    tone: 'green',
  },
  {
    label: 'STEP 2',
    title: 'Play Quiz',
    description: 'Test your understanding',
    action: 'Try a quiz',
    icon: Gamepad2,
    tone: 'blue',
  },
  {
    label: 'STEP 3',
    title: 'Get Rank',
    description: 'See your skill rank on the board',
    action: 'View leaderboard',
    icon: Trophy,
    tone: 'violet',
  },
  {
    label: 'STEP 4',
    title: 'Showcase Projects',
    description: 'Build a portfolio of real projects',
    action: 'Explore projects',
    icon: Briefcase,
    tone: 'amber',
  },
];

const LEARNING_MODES = [
  {
    name: 'Beginner Mode',
    detail: 'Foundations, Linux & Git',
    icon: Sprout,
    tone: 'green',
  },
  {
    name: 'Intermediate Mode',
    detail: 'Cloud, containers & CI/CD',
    icon: Zap,
    tone: 'blue',
  },
  {
    name: 'Expert Mode',
    detail: 'IaC, capstones & career prep',
    icon: GraduationCap,
    tone: 'violet',
  },
];

const toneStyles = {
  green: {
    icon: 'text-emerald-300',
    active: 'border-emerald-400/80 bg-emerald-400/[0.12] shadow-[0_0_24px_rgba(74,222,128,0.12)]',
    border: 'border-emerald-400/25',
    label: 'text-emerald-300',
  },
  blue: {
    icon: 'text-cyan-300',
    active: 'border-cyan-400/80 bg-cyan-400/[0.12] shadow-[0_0_24px_rgba(34,211,238,0.12)]',
    border: 'border-cyan-400/25',
    label: 'text-cyan-300',
  },
  violet: {
    icon: 'text-violet-300',
    active: 'border-violet-400/80 bg-violet-400/[0.12] shadow-[0_0_24px_rgba(167,139,250,0.12)]',
    border: 'border-violet-400/25',
    label: 'text-violet-300',
  },
  amber: {
    icon: 'text-amber-300',
    active: 'border-amber-400/80 bg-amber-400/[0.12] shadow-[0_0_24px_rgba(251,191,36,0.12)]',
    border: 'border-amber-400/25',
    label: 'text-amber-300',
  },
};

const TERRAFORM_SNIPPET = `module "production_vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.0.0"

  name = "cdh-multicloud-production"
  cidr = "10.0.0.0/16"
  enable_nat_gateway = true
}`;

export const Header = ({
  onStartNow,
  onPreviewSession0,
  firstSession,
  onOpenQuiz,
  onOpenLeaderboard,
}) => {
  const [activeTab, setActiveTab] = useState('journey');
  const [animStep, setAnimStep] = useState(0);
  const [copied, setCopied] = useState(false);
  const [selectedMode, setSelectedMode] = useState('');
  const copyTimerRef = useRef(null);

  useEffect(() => {
    if (activeTab !== 'journey' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      setAnimStep((step) => (step + 1) % JOURNEY_STEPS.length);
    }, 2600);

    return () => window.clearInterval(interval);
  }, [activeTab]);

  useEffect(() => () => window.clearTimeout(copyTimerRef.current), []);

  const handleStepAction = (index) => {
    setAnimStep(index);

    if (index === 0 && firstSession) {
      onPreviewSession0?.(firstSession);
    } else if (index === 1 && firstSession) {
      onOpenQuiz?.(firstSession);
    } else if (index === 2) {
      onOpenLeaderboard?.();
    } else if (index === 3) {
      onStartNow?.();
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(TERRAFORM_SNIPPET);
      setCopied(true);
      window.clearTimeout(copyTimerRef.current);
      copyTimerRef.current = window.setTimeout(() => setCopied(false), 1800);
    } catch (error) {
      console.error('Unable to copy the Terraform example:', error);
    }
  };

  const activeStep = JOURNEY_STEPS[animStep];
  const ActiveStepIcon = activeStep.icon;

  return (
    <header className="cdh-hero relative isolate overflow-hidden border-b border-emerald-400/10 text-white">
      <div className="cdh-hero-grid pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="cdh-hero-glow cdh-hero-glow-one pointer-events-none absolute" aria-hidden="true" />
      <div className="cdh-hero-glow cdh-hero-glow-two pointer-events-none absolute" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-4 pb-8 pt-10 sm:px-6 sm:pb-10 sm:pt-14 lg:px-8 lg:pt-16">
        <div className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-10">
          <div className="cdh-hero-copy min-w-0 space-y-6">
            <div className="cdh-enter inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-400/[0.08] px-3.5 py-2 text-xs font-semibold text-emerald-100 shadow-[0_0_20px_rgba(34,197,94,0.08)]">
              <Zap className="h-3.5 w-3.5 fill-emerald-300 text-emerald-300" />
              <span>Hands-on · Project-based · Career-focused</span>
            </div>

            <div className="cdh-enter cdh-enter-delay-1">
              <h1 className="max-w-2xl text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-[48px] 2xl:text-[54px]">
                Build the Skills of a
                <span className="cdh-headline-accent relative mt-1 block w-fit">
                  MultiCloud &amp; DevOps
                </span>
                Engineer
              </h1>
              <p className="mt-5 max-w-xl text-sm leading-6 text-slate-300 sm:text-base sm:leading-7">
                Learn, practice, get ranked, and showcase your skills to recruiters — from the
                fundamentals to real production projects.
              </p>
            </div>

            <div className="cdh-enter cdh-enter-delay-2 flex max-w-xl flex-wrap gap-x-5 gap-y-3 text-xs font-medium text-slate-200 sm:text-sm">
              {[
                '55+ Production Labs',
                'Real Projects',
                'AWS · Azure · GCP',
                'DevOps · Kubernetes · AI',
                'Job & Interview Support',
              ].map((item) => (
                <span key={item} className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                  {item}
                </span>
              ))}
            </div>

            <div className="cdh-enter cdh-enter-delay-3 flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={onStartNow}
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-lime-300 to-emerald-400 px-5 py-3 text-sm font-extrabold text-slate-950 shadow-[0_0_28px_rgba(74,222,128,0.2)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_38px_rgba(74,222,128,0.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
              >
                <PlayCircle className="h-4 w-4 fill-slate-950/10" />
                Start Learning for Free
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                type="button"
                onClick={() => firstSession && onPreviewSession0?.(firstSession)}
                className="inline-flex items-center gap-2 rounded-full border border-slate-400/50 bg-slate-900/40 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:border-emerald-300/70 hover:bg-emerald-300/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
              >
                <PlayCircle className="h-4 w-4 text-emerald-300" />
                Preview a Session
              </button>
            </div>
          </div>

          <div className="cdh-enter cdh-enter-delay-2 relative min-w-0">
            <div className="cdh-window w-full min-w-0 overflow-hidden rounded-[1.6rem] border border-cyan-200/20 bg-[#061217]/90 shadow-[0_24px_90px_rgba(0,0,0,0.5),0_0_50px_rgba(34,211,238,0.06)] backdrop-blur-xl">
              <div className="flex min-h-14 flex-wrap items-center justify-between gap-2 rounded-t-[1.5rem] border-b border-white/10 bg-white/[0.045] px-4 py-2.5 sm:px-5">
                <div className="flex min-w-0 items-center gap-2.5">
                  <div className="flex shrink-0 items-center gap-1.5" aria-hidden="true">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.6)]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-300 shadow-[0_0_8px_rgba(252,211,77,0.5)]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                  </div>
                  <span className="hidden truncate font-mono text-[11px] text-slate-400 sm:inline sm:text-xs">
                    /labs/multicloud-devops
                  </span>
                </div>

                <div className="flex min-w-0 flex-wrap items-center justify-end gap-1.5">
                  <button
                    type="button"
                    onClick={() => setActiveTab('journey')}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-bold transition sm:text-xs ${
                      activeTab === 'journey'
                        ? 'bg-sky-400/20 text-sky-100 ring-1 ring-sky-300/25'
                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    Learn &amp; Rank
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('code')}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-bold transition sm:text-xs ${
                      activeTab === 'code'
                        ? 'bg-white/10 text-white'
                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Code2 className="h-3.5 w-3.5" />
                    Code
                  </button>
                  <button
                    type="button"
                    onClick={() => setAnimStep(0)}
                    aria-label="Restart workflow animation"
                    title="Restart animation"
                    className="rounded-lg border border-white/10 p-1.5 text-slate-400 transition hover:border-emerald-300/40 hover:text-emerald-200"
                  >
                    <RotateCw className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {activeTab === 'journey' ? (
                <div className="p-4 sm:p-5">
                  <div className="grid grid-cols-2 gap-2.5 min-[1200px]:grid-cols-4">
                    {JOURNEY_STEPS.map((step, index) => {
                      const StepIcon = step.icon;
                      const tone = toneStyles[step.tone];
                      const isActive = animStep === index;

                      return (
                        <button
                          key={step.label}
                          type="button"
                          aria-pressed={isActive}
                          onClick={() => handleStepAction(index)}
                          className={`cdh-step-card group relative flex min-h-36 flex-col items-center justify-center overflow-hidden rounded-2xl border px-2.5 py-3 text-center transition duration-300 hover:-translate-y-1 ${
                            isActive ? tone.active : `bg-slate-950/40 ${tone.border} hover:bg-white/[0.04]`
                          }`}
                        >
                          <StepIcon className={`mb-2 h-7 w-7 transition-transform duration-300 group-hover:scale-110 ${tone.icon}`} />
                          <span className={`text-[10px] font-extrabold tracking-widest ${tone.label}`}>
                            {step.label}
                          </span>
                          <span className="mt-1 text-xs font-extrabold leading-tight text-white sm:text-sm">
                            {step.title}
                          </span>
                          <span className="mt-1.5 max-w-32 text-[10px] leading-4 text-slate-400 sm:text-[11px]">
                            {step.description}
                          </span>
                          {isActive && (
                            <span className="cdh-step-progress absolute inset-x-0 bottom-0 h-0.5 origin-left bg-gradient-to-r from-emerald-300 to-cyan-300" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <div className="relative mx-8 my-5 hidden h-2 sm:block" aria-hidden="true">
                    <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-slate-700/80" />
                    <div
                      className="cdh-rail-fill absolute left-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-gradient-to-r from-emerald-400 via-cyan-300 to-violet-400 transition-[width] duration-700"
                      style={{ width: `${(animStep / (JOURNEY_STEPS.length - 1)) * 100}%` }}
                    />
                    <div className="relative flex h-full items-center justify-between">
                      {JOURNEY_STEPS.map((step, index) => (
                        <span
                          key={step.label}
                          className={`h-3.5 w-3.5 rounded-full border-2 transition-all duration-300 ${
                            index <= animStep
                              ? 'scale-110 border-emerald-200 bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]'
                              : 'border-slate-500 bg-[#071419]'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-slate-950/55 px-3.5 py-3 sm:px-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10">
                      <ActiveStepIcon className={`h-5 w-5 ${toneStyles[activeStep.tone].icon}`} />
                    </div>
                    <p className="min-w-0 flex-1 text-xs leading-5 text-slate-300 sm:text-sm">
                      <span className="font-bold text-white">{activeStep.action}.</span>{' '}
                      A complete learn, practice, rank, and showcase journey to help you grow into
                      cloud and DevOps roles.
                    </p>
                    <div className="hidden shrink-0 -rotate-6 items-center justify-center rounded-xl border border-cyan-300/40 bg-cyan-400/10 p-2 text-cyan-300 sm:flex">
                      <Laptop className="h-8 w-8" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="min-h-[280px] p-4 sm:p-5">
                  <div className="mb-3 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-violet-400/10 px-2 py-1 font-bold text-violet-200 ring-1 ring-violet-300/20">
                        TERRAFORM
                      </span>
                      <span className="truncate text-slate-400">multicloud-vpc.tf</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-1.5 text-slate-300 transition hover:border-emerald-300/40 hover:text-white"
                    >
                      {copied ? <Check className="h-3.5 w-3.5 text-emerald-300" /> : <Copy className="h-3.5 w-3.5" />}
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                  <pre className="overflow-x-auto rounded-xl border border-white/[0.08] bg-[#03090d] p-4 font-mono text-xs leading-6 text-emerald-100 custom-scrollbar">
                    <code>{TERRAFORM_SNIPPET}</code>
                  </pre>
                  <div className="mt-4 flex items-center justify-between border-t border-white/[0.08] pt-3 text-xs">
                    <span className="inline-flex items-center gap-2 text-slate-400">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]" />
                      Production-style learning lab
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveTab('journey')}
                      className="font-semibold text-cyan-300 transition hover:text-cyan-100"
                    >
                      Back to journey
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="cdh-orbit-dot absolute -right-2 top-1/2 h-2.5 w-2.5 rounded-full bg-emerald-300 shadow-[0_0_16px_4px_rgba(52,211,153,0.35)]" aria-hidden="true" />
          </div>
        </div>

        <div className="cdh-mode-section mt-10 border-t border-emerald-300/10 pt-6 sm:mt-12 sm:pt-7">
          <div className="grid items-center gap-4 lg:grid-cols-[0.9fr_2.1fr] lg:gap-7">
            <div className="flex items-center gap-3">
              <h2 className="max-w-56 text-lg font-extrabold leading-snug text-white sm:text-xl">
                Let&apos;s Start Learning
                <span className="block text-slate-300">Choose Your Mode</span>
              </h2>
              <ArrowRight className="cdh-mode-arrow hidden h-6 w-6 text-emerald-400 sm:block" />
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {LEARNING_MODES.map((mode) => {
                const ModeIcon = mode.icon;
                const tone = toneStyles[mode.tone];
                const isSelected = selectedMode === mode.name;

                return (
                  <button
                    key={mode.name}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => {
                      setSelectedMode(mode.name);
                      onStartNow?.();
                    }}
                    className={`group flex min-h-[76px] items-center gap-3 rounded-2xl border px-4 py-3 text-left transition duration-200 hover:-translate-y-0.5 ${
                      isSelected
                        ? tone.active
                        : `bg-slate-950/40 ${tone.border} hover:bg-white/[0.04]`
                    }`}
                  >
                    <ModeIcon className={`h-8 w-8 shrink-0 transition-transform group-hover:scale-110 ${tone.icon}`} />
                    <span>
                      <span className="block text-sm font-extrabold text-white">{mode.name}</span>
                      <span className="mt-1 block text-[11px] leading-4 text-slate-400">{mode.detail}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="cdh-roadmap relative mt-8 px-3 pb-1 pt-3 sm:mt-9 sm:px-10">
            <div className="cdh-roadmap-track absolute left-[12%] right-[12%] top-7 h-1 rounded-full bg-gradient-to-r from-emerald-400 via-cyan-300 to-violet-400" aria-hidden="true" />
            <div className="cdh-roadmap-glow absolute left-[12%] right-[12%] top-[25px] h-2 rounded-full bg-gradient-to-r from-emerald-400 via-cyan-300 to-violet-400 blur-md" aria-hidden="true" />
            <div className="relative grid grid-cols-4">
              {[
                { label: 'Learn', icon: BookOpen, tone: 'green' },
                { label: 'Practice', icon: Code2, tone: 'blue' },
                { label: 'Rank', icon: Trophy, tone: 'violet' },
                { label: 'Get Hired', icon: Briefcase, tone: 'amber' },
              ].map((milestone) => {
                const MilestoneIcon = milestone.icon;
                return (
                  <div key={milestone.label} className="flex flex-col items-center gap-1.5">
                    <span className={`z-10 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-[#061217] ${toneStyles[milestone.tone].label}`}>
                      <MilestoneIcon className="h-4 w-4" />
                    </span>
                    <span className="text-[11px] font-bold text-slate-200 sm:text-xs">{milestone.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
