// ============================================================
// autoSeedAll.js — Full Auto-Seed v2
// Rules:
//   - IGNORE: README.md, Interview-QnA.md, Scenarios.md,
//             any file with "Interview" or "Scenario" in name
//   - USE: actual live session note files (🚀Day-X, Batch-45_Day-X,
//          New Batch-45_..., Day-X of... etc.)
//   - Fetches real content → extracts title/topics → generates quizzes
//   - Seeds sessionsData.js + SessionFile + QuizQuestion in MongoDB
// Run: node server/scripts/autoSeedAll.js
// ============================================================

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../.env') });

// ── MongoDB models ────────────────────────────────────────
const quizSchema = new mongoose.Schema({
  sessionNumber: { type: Number, default: null, index: true },
  moduleId: { type: String, default: 'm1', index: true },
  question: { type: String, required: true, trim: true },
  options: { type: [String], required: true },
  correctIndex: { type: Number, required: true, min: 0 },
  explanation: { type: String, default: '' },
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Intermediate' },
  tags: { type: [String], default: [] },
}, { timestamps: true });

const sessionFileSchema = new mongoose.Schema({
  sessionNumber: { type: Number, required: true, index: true },
  name: { type: String, required: true, trim: true },
  githubUrl: { type: String, required: true, trim: true },
  rawUrl: { type: String, required: true, trim: true },
  fileType: { type: String, default: 'markdown' },
  description: { type: String, default: '' },
  isDefault: { type: Boolean, default: false },
}, { timestamps: true });

const QuizQuestion = mongoose.model('QuizQuestion', quizSchema);
const SessionFile = mongoose.model('SessionFile', sessionFileSchema);

// ── Helpers ───────────────────────────────────────────────
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function detectFileType(fileName) {
  const ext = fileName.toLowerCase().split('.').pop();
  if (['dockerfile'].includes(fileName.toLowerCase())) return 'docker';
  switch (ext) {
    case 'md': case 'markdown': return 'markdown';
    case 'tf': case 'tfvars': case 'hcl': return 'terraform';
    case 'yaml': case 'yml': return 'yaml';
    case 'json': return 'json';
    case 'sh': case 'bash': return 'code';
    case 'py': return 'code';
    case 'js': case 'jsx': case 'ts': case 'tsx': return 'code';
    case 'png': case 'jpg': case 'jpeg': case 'gif': case 'svg': return 'image';
    default: return 'code';
  }
}

// Rule: skip these files — they are not actual session notes
function isSupportFile(name) {
  const lower = name.toLowerCase();
  return (
    lower === 'readme.md' ||
    lower.includes('interview') ||
    lower.includes('scenario') ||
    lower === '.gitkeep' ||
    lower === '.gitignore'
  );
}

// Prefer Batch-45 files > 🚀/emoji files > Day- files > anything else
function rankSummaryFile(name) {
  const lower = name.toLowerCase();
  if (lower.includes('batch-45') || lower.includes('batch 45')) return 0;
  if (lower.startsWith('🚀') || lower.includes('\ud83d\ude80')) return 1;
  if (/^day[\s-]/i.test(lower)) return 2;
  if (/^new\s+batch/i.test(lower)) return 3;
  return 4;
}

function getModuleId(n) {
  if (n <= 4) return 'm1';
  if (n <= 9) return 'm2';
  if (n <= 21) return 'm3';
  if (n <= 29) return 'm4';
  if (n <= 37) return 'm5';
  if (n <= 46) return 'm6';
  if (n <= 49) return 'm7';
  return 'm8';
}

function getModuleName(n) {
  if (n <= 4) return 'Phase 1: Program Kickoff & DevOps Foundations';
  if (n <= 9) return 'Phase 2: Linux & GCP Administration';
  if (n <= 21) return 'Phase 3: AWS Top 10 Services + Practicals';
  if (n <= 29) return 'Phase 4: Git, Jenkins & CI/CD Pipelines';
  if (n <= 37) return 'Phase 5: Docker & Kubernetes + GKE + Monitoring';
  if (n <= 46) return 'Phase 6: Ansible, Terraform & IaC Automation';
  if (n <= 49) return 'Phase 7: Azure & Advanced AI + Prompt Engineering';
  return 'Phase 8: Capstone Projects & Graduation';
}

function getDifficulty(n) {
  if (n <= 9) return 'Beginner';
  if (n <= 29) return 'Intermediate';
  if (n <= 46) return 'Intermediate';
  return 'Advanced';
}

function getDuration(n) {
  const d = ['45 mins','60 mins','55 mins','65 mins','60 mins','70 mins','60 mins','75 mins','60 mins','65 mins'];
  return d[n % d.length];
}

async function fetchRaw(url) {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(10000),
      headers: { 'User-Agent': 'Mozilla/5.0', Accept: 'text/plain,*/*' }
    });
    if (!res.ok) return null;
    return await res.text();
  } catch { return null; }
}

// ── Content extractors from actual session notes ──────────
function extractTitle(content, folder) {
  if (!content) return folderToTitle(folder);
  const lines = content.split('\n');
  // Try H1 first
  for (const l of lines.slice(0, 10)) {
    const m = l.match(/^#\s+(.+)/);
    if (m) {
      return m[1].replace(/[\u{1F300}-\u{1FAFF}]/gu,'').replace(/Session\s+\d+\s*[—–-]\s*/i,'').trim() || folderToTitle(folder);
    }
  }
  return folderToTitle(folder);
}

function folderToTitle(folder) {
  return folder.replace(/^Session-\d+-/, '').replace(/-/g,' ').replace(/\b\w/g,c=>c.toUpperCase());
}

function extractPreview(content, folder) {
  if (!content) return `Hands-on session on ${folderToTitle(folder)}.`;
  const lines = content.split('\n');
  // Look for "Key Outcomes" section — the most useful summary paragraph
  let inOutcomes = false;
  for (const line of lines) {
    if (/key outcomes?/i.test(line) && line.startsWith('##')) { inOutcomes = true; continue; }
    if (inOutcomes && line.startsWith('#') && line.length > 0) break;
    if (inOutcomes) {
      const t = line.trim();
      if (t.length > 80 && !t.startsWith('|') && !t.startsWith('>') && !t.startsWith('-')) {
        return t.substring(0, 240);
      }
    }
  }
  // Fallback: first long paragraph
  for (const line of lines) {
    const t = line.trim();
    if (t.length > 100 && !t.startsWith('#') && !t.startsWith('|') && !t.startsWith('>') && !t.startsWith('!') && !t.startsWith('<')) {
      return t.substring(0, 240);
    }
  }
  return `Hands-on session covering ${folderToTitle(folder)} for DevOps professionals.`;
}

function extractTopics(content, folder) {
  if (!content) return defaultTopics(folder);
  const topics = new Set();
  const lines = content.split('\n');
  // Extract H3 headers as topics — these are always the core concepts in the notes
  for (const line of lines) {
    const m = line.match(/^###\s+(.+)/);
    if (m) {
      const t = m[1].replace(/[\u{1F300}-\u{1FAFF}]/gu,'').replace(/\*+/g,'').trim();
      if (t.length > 3 && t.length < 90) topics.add(t);
    }
    if (topics.size >= 6) break;
  }
  if (topics.size >= 2) return [...topics].slice(0,6);

  // Fallback: bold lines (key terms)
  for (const line of lines) {
    const m = line.match(/\*\*([^*]{5,60})\*\*/);
    if (m && !m[1].includes(':')) topics.add(m[1].trim());
    if (topics.size >= 5) break;
  }
  return topics.size >= 2 ? [...topics].slice(0,5) : defaultTopics(folder);
}

function defaultTopics(folder) {
  const name = folderToTitle(folder);
  return [
    `Introduction to ${name}`,
    `${name} architecture and components`,
    `Hands-on ${name} lab`,
    `${name} best practices`,
    `Real-world ${name} use cases`,
  ];
}

function extractLabs(content, folder) {
  if (!content) return defaultLabs(folder);
  const labs = [];
  const lines = content.split('\n');
  let inLabs = false;
  for (const line of lines) {
    if (/hands.?on|practical|live demo|task|lab/i.test(line) && line.startsWith('##')) { inLabs = true; continue; }
    if (inLabs && line.startsWith('##') && labs.length > 0) break;
    if (inLabs) {
      const m = line.match(/^[-*•✅]\s+(.{10,80})/);
      if (m) labs.push(m[1].replace(/\*+/g,'').trim());
      if (labs.length >= 4) break;
    }
  }
  return labs.length >= 1 ? labs : defaultLabs(folder);
}

function defaultLabs(folder) {
  const name = folderToTitle(folder);
  return [`Set up ${name} environment`, `Configure and deploy ${name}`, `Test and validate ${name} setup`];
}

// ── GitHub API: list files in a folder ───────────────────
async function listFolderFiles(folder) {
  const apiUrl = `https://api.github.com/repos/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge/contents/${encodeURIComponent(folder)}`;
  const data = await fetchRaw(apiUrl);
  if (!data) return [];
  try {
    return JSON.parse(data).filter(f => f.type === 'file');
  } catch { return []; }
}

// ── All 59 session definitions ────────────────────────────
const ALL_SESSIONS = [
  { sessionNumber:  0, folder: 'Session-00-Program-Kickoff' },
  { sessionNumber:  1, folder: 'Session-01-DevOps-Introduction-Course-Overview' },
  { sessionNumber:  2, folder: 'Session-02-Cloud-Computing-Virtualization' },
  { sessionNumber:  3, folder: 'Session-03-DevOps-Principles-Practices' },
  { sessionNumber:  4, folder: 'Session-04-Foundation-of-AI-Prompt-Engineering-CoProgrammer-Setup' },
  { sessionNumber:  5, folder: 'Session-05-Linux-Overview-GCP-Setup' },
  { sessionNumber:  6, folder: 'Session-06-Linux-VM-User-Administration' },
  { sessionNumber:  7, folder: 'Session-07-Linux-System-Administration' },
  { sessionNumber:  8, folder: 'Session-08-Permissions-Software-Management' },
  { sessionNumber:  9, folder: 'Session-09-Linux-RealWorld-Scenarios' },
  { sessionNumber: 10, folder: 'Session-10-AWS-Introduction-EC2-Basics' },
  { sessionNumber: 11, folder: 'Session-11-EC2-Scalability-AMI' },
  { sessionNumber: 12, folder: 'Session-12-AWS-IAM-Identity-Access-Management' },
  { sessionNumber: 13, folder: 'Session-13-EC2-Configuration-Storage' },
  { sessionNumber: 14, folder: 'Session-14-Elastic-Load-Balancer' },
  { sessionNumber: 15, folder: 'Session-15-Amazon-S3-Storage' },
  { sessionNumber: 16, folder: 'Session-16-S3-Static-Website-Hosting' },
  { sessionNumber: 17, folder: 'Session-17-AWS-Databases-RDS' },
  { sessionNumber: 18, folder: 'Session-18-AWS-VPC-Networking' },
  { sessionNumber: 19, folder: 'Session-19-VPC-Practicals' },
  { sessionNumber: 20, folder: 'Session-20-AWS-CloudWatch-Monitoring' },
  { sessionNumber: 21, folder: 'Session-21-AWS-Service-Integrations' },
  { sessionNumber: 22, folder: 'Session-22-Git-GitHub-Learning' },
  { sessionNumber: 23, folder: 'Session-23-Git-for-Developers' },
  { sessionNumber: 24, folder: 'Session-24-Jenkins-Introduction-Setup' },
  { sessionNumber: 25, folder: 'Session-25-Jenkins-Jobs-Maven' },
  { sessionNumber: 26, folder: 'Session-26-Jenkins-Pipelines' },
  { sessionNumber: 27, folder: 'Session-27-Jenkins-Plugins' },
  { sessionNumber: 28, folder: 'Session-28-Advanced-Jenkins-Jobs' },
  { sessionNumber: 29, folder: 'Session-29-Jenkins-MasterSlave-Architecture' },
  { sessionNumber: 30, folder: 'Session-30-Docker-Introduction' },
  { sessionNumber: 31, folder: 'Session-31-Docker-Installation-Basics' },
  { sessionNumber: 32, folder: 'Session-32-Docker-Lifecycle-Dockerfile' },
  { sessionNumber: 33, folder: 'Session-33-Kubernetes-Introduction' },
  { sessionNumber: 34, folder: 'Session-34-Kubernetes-Components-GKE' },
  { sessionNumber: 35, folder: 'Session-35-GKE-Ecommerce-Project' },
  { sessionNumber: 36, folder: 'Session-36-Prometheus-Grafana-Introduction' },
  { sessionNumber: 37, folder: 'Session-37-Grafana-Dashboards' },
  { sessionNumber: 38, folder: 'Session-38-Terraform-Introduction' },
  { sessionNumber: 39, folder: 'Session-39-Terraform-AWS-Resources' },
  { sessionNumber: 40, folder: 'Session-40-Ansible-Introduction' },
  { sessionNumber: 41, folder: 'Session-41-Ansible-Architecture' },
  { sessionNumber: 42, folder: 'Session-42-Ansible-Playbooks-Roles' },
  { sessionNumber: 43, folder: 'Session-43-Bash-Scripting' },
  { sessionNumber: 44, folder: 'Session-44-Python-for-DevOps' },
  { sessionNumber: 45, folder: 'Session-45-ATS-Resume-Preparation' },
  { sessionNumber: 46, folder: 'Session-46-Students-Choice-Topics' },
  { sessionNumber: 47, folder: 'Session-47-Azure-Fundamentals-Azure-DevOps' },
  { sessionNumber: 48, folder: 'Session-48-Advanced-Prompt-Engineering-AI-CoProgrammer' },
  { sessionNumber: 49, folder: 'Session-49-AI-Generative-AI-AI-Agents-Copilot' },
  { sessionNumber: 50, folder: 'Session-50-Project-1-CICD-Pipeline-Automation' },
  { sessionNumber: 51, folder: 'Session-51-Project-2-Microservices-Deployment-on-GKE' },
  { sessionNumber: 52, folder: 'Session-52-Project-3-Terraform-IaC-Infra-Provisioning' },
  { sessionNumber: 53, folder: 'Session-53-Project-4-DevSecOps-Implementation' },
  { sessionNumber: 54, folder: 'Session-54-Project-5-Azure-DevOps-CICD-Implementation' },
  { sessionNumber: 55, folder: 'Session-55-Project-6-AI-API-Integration-from-Cloud' },
  { sessionNumber: 56, folder: 'Session-56-Project-7-MLOps-in-EKS' },
  { sessionNumber: 57, folder: 'Session-57-Project-8-AI-OPS-Automations' },
  { sessionNumber: 58, folder: 'Session-58-QA-Meet-Greet-Graduation' },
];

// ── Quiz questions generated from actual session notes content ──
// Source: fetched from live session note files (not README/Interview-QnA)
const ALL_QUIZ_QUESTIONS = [
  // ── Session 0 ─────────────────────────────────────────
  { sessionNumber:0, moduleId:'m1', question:'What is the main goal of the CloudDevOpsHub 55-Session Multi-Cloud DevOps Bootcamp?', options:['Learn frontend web development only','Gain hands-on expertise across AWS, GCP, Azure, DevOps, DevSecOps, and AI through live sessions and projects','Study cloud pricing models','Prepare for a single AWS certification'], correctIndex:1, explanation:'The bootcamp covers Multi-Cloud (AWS, GCP, Azure), DevOps, DevSecOps, and AI through 55 live sessions + Q&A + mock interviews.', difficulty:'Beginner', tags:['Kickoff','Program','Overview'] },
  { sessionNumber:0, moduleId:'m1', question:'How many AI-related projects are included in the CloudDevOpsHub Batch 45 curriculum?', options:['1','2','4','8'], correctIndex:2, explanation:'Batch 45 includes 4 AI projects: Docker AI, Kubernetes Agent, Agentic AI integrations, and MCP server project.', difficulty:'Beginner', tags:['Kickoff','Projects','AI'] },
  { sessionNumber:0, moduleId:'m1', question:'What is the recommended behavior during live CloudDevOpsHub sessions?', options:['Leave camera off and chat freely','Stay muted by default, camera on, raise hand to speak, and ask questions every 10-15 min Q&A pause','Only watch recordings, no interaction needed','Ask all questions at the very end of the session'], correctIndex:1, explanation:'Session conduct: camera on, muted by default, spacebar to unmute, raise hand to speak, Q&A pause every 10-15 minutes.', difficulty:'Beginner', tags:['Kickoff','Conduct','Bootcamp'] },

  // ── Session 1 ─────────────────────────────────────────
  { sessionNumber:1, moduleId:'m1', question:'What was the primary focus of Session 01 (Batch 45 launch)?', options:['Deep technical Jenkins configuration','Program orientation: curriculum overview, DevOps workflow introduction, behavioral expectations, and interview readiness','AWS account creation hands-on','Docker installation and containers'], correctIndex:1, explanation:'Session 01 was orientation: Vikas covered the full 55-session curriculum, the DevOps high-level workflow diagram, and expectations for Batch 45.', difficulty:'Beginner', tags:['Orientation','DevOps','Batch45'] },
  { sessionNumber:1, moduleId:'m1', question:'Which tools does the Batch 45 curriculum cover under DevOps?', options:['Only Jenkins and Docker','Top 10 DevOps tools including CI/CD pipelines, CICD and CMCD implementation','Only Kubernetes and Terraform','Only Git and GitHub'], correctIndex:1, explanation:'The DevOps section covers the top 10 DevOps tools, CI/CD pipelines, CICD and CMCD concepts and their implementation use cases.', difficulty:'Beginner', tags:['DevOps','Curriculum','Tools'] },
  { sessionNumber:1, moduleId:'m1', question:'What was explicitly stated about ArgoCD in the Batch 45 curriculum?', options:['ArgoCD is deprecated and will not be covered','ArgoCD is an emerging tool with growing enterprise adoption and will be included as a final project','ArgoCD replaces Jenkins completely','ArgoCD is only for AWS'], correctIndex:1, explanation:'Vikas highlighted ArgoCD as increasingly popular in enterprises and committed to including it as a final project given market demand.', difficulty:'Intermediate', tags:['ArgoCD','DevOps','GitOps'] },
  { sessionNumber:1, moduleId:'m1', question:'How many total services across AWS, GCP, and Azure are planned in the Batch 45 Multi-Cloud curriculum?', options:['5','10','20','50'], correctIndex:2, explanation:'Batch 45 targets ~10 AWS services, ~5 GCP services, ~5 Azure services — approximately 20 total cloud services.', difficulty:'Beginner', tags:['MultiCloud','AWS','GCP','Azure'] },

  // ── Session 2 ─────────────────────────────────────────
  { sessionNumber:2, moduleId:'m1', question:'What is the classic problem Docker was invented to solve?', options:['Slow internet connections','The "it works on my machine" problem caused by environment and configuration mismatches between dev and production','High cloud costs','Lack of programming languages'], correctIndex:1, explanation:'Docker packages code, configuration, tools, frameworks, and dependencies into one portable unit, eliminating environment mismatches.', difficulty:'Beginner', tags:['Docker','Containers','CloudComputing'] },
  { sessionNumber:2, moduleId:'m1', question:'What is the difference between Type 1 and Type 2 hypervisors?', options:['Type 1 runs on host OS; Type 2 runs on bare metal','Type 1 runs directly on bare-metal hardware; Type 2 runs on top of a host OS','Type 1 is for Linux; Type 2 is for Windows','Type 1 requires GPUs; Type 2 does not'], correctIndex:1, explanation:'Type 1 (bare-metal): VMware ESXi, KVM, Hyper-V. Type 2 (hosted): Oracle VirtualBox, VMware Workstation running atop an OS.', difficulty:'Intermediate', tags:['Virtualization','Hypervisor','Cloud'] },
  { sessionNumber:2, moduleId:'m1', question:'In the Cloud Shared Responsibility Model for IaaS, which is ALWAYS the customer\'s responsibility?', options:['Physical server hardware maintenance','Hypervisor patching and updates','Customer data, OS patching, and network firewall rules','Data centre power and cooling'], correctIndex:2, explanation:'In IaaS, the cloud provider manages hardware and hypervisor. Customer owns: guest OS, data, IAM configuration, and security groups.', difficulty:'Beginner', tags:['Cloud','SharedResponsibility','IaaS','Security'] },

  // ── Session 3 ─────────────────────────────────────────
  { sessionNumber:3, moduleId:'m1', question:'What does the CALMS framework stand for in DevOps?', options:['Code, Automation, Logging, Monitoring, Security','Culture, Automation, Lean, Measurement, Sharing','Continuous, Agile, Linux, Microservices, Security','Cloud, Automation, Lean, Management, Scaling'], correctIndex:1, explanation:'CALMS (coined by Jez Humble & John Willis) defines the five foundational pillars of a successful DevOps transformation.', difficulty:'Beginner', tags:['DevOps','CALMS','Principles'] },
  { sessionNumber:3, moduleId:'m1', question:'What is Trunk-Based Development in Continuous Integration?', options:['Keeping feature branches open for 3–6 months','Developers merge small, frequent updates to a single main branch at least daily','Manual releases once per quarter','Skipping automated tests to speed up delivery'], correctIndex:1, explanation:'Trunk-Based Development prevents "merge hell" by integrating small increments frequently to trigger rapid CI feedback.', difficulty:'Intermediate', tags:['DevOps','CI/CD','TrunkBased'] },
  { sessionNumber:3, moduleId:'m1', question:'Which DORA metric measures the time from code commit to production deployment?', options:['Mean Time to Recovery (MTTR)','Deployment Frequency','Lead Time for Changes','Change Failure Rate'], correctIndex:2, explanation:'Lead Time for Changes is one of DORA\'s four key metrics measuring end-to-end delivery speed from commit to prod.', difficulty:'Intermediate', tags:['DORA','DevOps','Metrics'] },

  // ── Session 4 ─────────────────────────────────────────
  { sessionNumber:4, moduleId:'m1', question:'What is the purpose of a system prompt in AI co-programmers like GitHub Copilot?', options:['Setting terminal color themes','Giving the AI role context, constraints, and behavioral instructions to improve response quality','Increasing the AI token limit','Configuring DNS settings'], correctIndex:1, explanation:'System prompts establish the AI\'s persona, scope, and rules — dramatically improving accuracy and relevance of AI-generated output.', difficulty:'Beginner', tags:['AI','PromptEngineering','Copilot'] },
  { sessionNumber:4, moduleId:'m1', question:'What is "hallucination" in large language models?', options:['The model creating colorful UI themes','The model generating confident but factually incorrect or fabricated content','The model refusing to answer','The model repeating the same output'], correctIndex:1, explanation:'Hallucination = LLMs producing plausible-sounding but factually wrong outputs. Critical to validate AI-generated DevOps commands before running in production.', difficulty:'Intermediate', tags:['AI','LLM','Limitations'] },
  { sessionNumber:4, moduleId:'m1', question:'Which prompting technique instructs the AI to reason step-by-step?', options:['Zero-shot prompting','Chain-of-Thought (CoT) prompting','Role prompting','Temperature prompting'], correctIndex:1, explanation:'CoT prompting instructs the model to work through the problem in steps, significantly improving accuracy on complex reasoning tasks.', difficulty:'Intermediate', tags:['AI','PromptEngineering','CoT'] },

  // ── Session 5 ─────────────────────────────────────────
  { sessionNumber:5, moduleId:'m2', question:'What is the technically precise answer to "Is Linux an operating system?" in a DevOps interview?', options:['Yes, it is exactly an operating system','Linux is technically a kernel — the innermost layer of the OS — not the full operating system; GNU/Linux is the complete OS','No, Linux is just a programming language','Linux is only a shell, not an OS'], correctIndex:1, explanation:'Vikas taught this as a "trap interview question" — Linux is technically a kernel; GNU/Linux is the full OS. Saying just "yes" shows shallow knowledge.', difficulty:'Intermediate', tags:['Linux','Kernel','Interview'] },
  { sessionNumber:5, moduleId:'m2', question:'What is the difference between a Kernel and a Shell in Linux?', options:['They are the same component','Kernel is the innermost layer directly managing hardware resources; Shell is the outer layer providing a command-line interface to users','Kernel is a text editor; Shell is a file manager','Shell manages hardware; Kernel provides the UI'], correctIndex:1, explanation:'Kernel (innermost): manages CPU, RAM, disk. Shell (outer): interprets user commands and passes them to the kernel for execution.', difficulty:'Intermediate', tags:['Linux','Kernel','Shell','Fundamentals'] },
  { sessionNumber:5, moduleId:'m2', question:'What tools were installed on Day 1 of the Linux session for connecting to remote Linux servers?', options:['Notepad and Windows Explorer','Git and MobaXterm (SSH client for Windows)','Visual Studio Code and Docker Desktop','PuTTY and WinSCP only'], correctIndex:1, explanation:'Students installed Git (for cloning repos) and MobaXterm (SSH client) to connect to remote Linux VMs on GCP.', difficulty:'Beginner', tags:['Linux','Tools','SSH','Setup'] },
  { sessionNumber:5, moduleId:'m2', question:'What is the recommended disk size for GCP VMs used in Docker and Kubernetes labs?', options:['10 GB (default)','20 GB','30 GB','100 GB'], correctIndex:2, explanation:'30 GB disk size was recommended to accommodate multiple containers and avoid running out of space during Docker/K8s labs.', difficulty:'Beginner', tags:['GCP','Linux','VM','Practical'] },

  // ── Session 6 ─────────────────────────────────────────
  { sessionNumber:6, moduleId:'m2', question:'What command creates a new user named "devops" on Ubuntu Linux?', options:['createuser devops','useradd devops or adduser devops','user --new devops','passwd devops'], correctIndex:1, explanation:'`useradd devops` creates the user; `adduser devops` is the interactive version that also sets up the home directory and password.', difficulty:'Beginner', tags:['Linux','UserManagement','Commands'] },
  { sessionNumber:6, moduleId:'m2', question:'What is the purpose of the `/etc/sudoers` file?', options:['Stores all user passwords','Defines which users and groups can execute commands with sudo (elevated) privileges, and what commands they can run','Configures SSH daemon settings','Lists all installed packages on the system'], correctIndex:1, explanation:'`/etc/sudoers` controls the sudo policy. Always edit it with `visudo` which validates syntax before saving to avoid lockouts.', difficulty:'Intermediate', tags:['Linux','Security','Sudo','Administration'] },
  { sessionNumber:6, moduleId:'m2', question:'What does the `30+ Linux commands` coverage in Session 06 primarily focus on?', options:['GUI desktop management','File system navigation, user administration, process management, and service control for VM administration','Database SQL commands','Network packet analysis'], correctIndex:1, explanation:'Session 06 "Linux 30+ Commands" focused on commands DevOps engineers use daily for VM and user administration tasks.', difficulty:'Beginner', tags:['Linux','Commands','Administration'] },

  // ── Session 7 ─────────────────────────────────────────
  { sessionNumber:7, moduleId:'m2', question:'What must you run after editing a systemd service file in `/etc/systemd/system/`?', options:['systemctl restart all','systemctl daemon-reload','service --refresh','init 6'], correctIndex:1, explanation:'`systemctl daemon-reload` tells systemd to re-read its configuration from disk. Without it, your edits are ignored until the next reboot.', difficulty:'Intermediate', tags:['Linux','systemd','Services','Administration'] },
  { sessionNumber:7, moduleId:'m2', question:'What is the difference between `systemctl enable` and `systemctl start`?', options:['They are identical commands','`enable` configures the service to auto-start at boot; `start` starts it immediately in the current session','`enable` starts immediately; `start` sets autostart','`enable` is for user services; `start` is for system services'], correctIndex:1, explanation:'You typically need both: `systemctl enable nginx` (auto-start on boot) + `systemctl start nginx` (start right now).', difficulty:'Beginner', tags:['Linux','systemd','Services'] },
  { sessionNumber:7, moduleId:'m2', question:'What information does `/proc/meminfo` expose?', options:['CPU architecture details','Detailed real-time memory statistics: total RAM, free, available, cached, and swap usage','Disk partition table','Kernel module list'], correctIndex:1, explanation:'`/proc/meminfo` is a virtual kernel file; tools like `free -h` read it to display human-readable memory statistics.', difficulty:'Intermediate', tags:['Linux','Memory','Kernel','Monitoring'] },

  // ── Session 8 ─────────────────────────────────────────
  { sessionNumber:8, moduleId:'m2', question:'What octal permission means: owner=read+write, group=read-only, others=no access?', options:['chmod 777','chmod 755','chmod 644','chmod 600'], correctIndex:2, explanation:'644: owner 4+2=6(rw-), group 4(r--), others 0(---). Common for web files served by a web server running as a different user.', difficulty:'Intermediate', tags:['Linux','Permissions','chmod'] },
  { sessionNumber:8, moduleId:'m2', question:'Why must SSH private keys have permission `600`?', options:['To make them executable','SSH refuses to use private keys with open permissions (readable by others) as a security protection','To allow sharing with teammates','To enable Git operations'], correctIndex:1, explanation:'If your private key (id_rsa) is readable by group or others, SSH will reject it with "UNPROTECTED PRIVATE KEY FILE!" error.', difficulty:'Beginner', tags:['Linux','SSH','Security','Permissions'] },
  { sessionNumber:8, moduleId:'m2', question:'Which package manager do Ubuntu/Debian systems use?', options:['yum','dnf','apt','pacman'], correctIndex:2, explanation:'`apt` (Advanced Package Tool) manages software on Debian-based distros. `yum`/`dnf` are for RHEL/CentOS/Fedora.', difficulty:'Beginner', tags:['Linux','PackageManagement','Ubuntu','apt'] },

  // ── Session 9 ─────────────────────────────────────────
  { sessionNumber:9, moduleId:'m2', question:'A disk is 100% full and a service crashes. What is the FIRST command to run?', options:['reboot the server','df -h to see which filesystem is full','rm -rf / to free space','systemctl stop all services'], correctIndex:1, explanation:'`df -h` shows disk usage of all mounted filesystems in human-readable format — the first diagnostic step for disk-full issues.', difficulty:'Intermediate', tags:['Linux','Troubleshooting','Disk'] },
  { sessionNumber:9, moduleId:'m2', question:'What command finds all files larger than 100MB recursively in the current directory?', options:['ls -la | grep 100M','find . -size +100M','du -sh * | sort','locate large-files'], correctIndex:1, explanation:'`find . -size +100M` traverses the directory tree and prints all files exceeding 100 megabytes.', difficulty:'Intermediate', tags:['Linux','find','DiskManagement'] },
  { sessionNumber:9, moduleId:'m2', question:'What does `journalctl -u nginx --since "1 hour ago"` display?', options:['All nginx config files','Systemd journal log entries for the nginx service from the last hour','Nginx process CPU usage','Nginx access log file'], correctIndex:1, explanation:'`journalctl` queries systemd\'s journal; `-u nginx` filters by unit; `--since` limits to recent entries — essential for troubleshooting.', difficulty:'Intermediate', tags:['Linux','journalctl','Troubleshooting','systemd'] },

  // ── Session 10 ─────────────────────────────────────────
  { sessionNumber:10, moduleId:'m3', question:'What was the key pedagogical decision made in Session 10 (AWS Day 1) about MFA?', options:['MFA was enabled immediately for all students','MFA was intentionally NOT taught to prevent students from locking themselves out if they change phones','MFA is not supported on student AWS accounts','MFA is only for root accounts'], correctIndex:1, explanation:'Vikas explicitly chose not to teach MFA on Day 1 and took responsibility for this decision to avoid students locking themselves out.', difficulty:'Beginner', tags:['AWS','IAM','MFA','Practical'] },
  { sessionNumber:10, moduleId:'m3', question:'What is the difference between an AWS Root User and an IAM User?', options:['They have identical permissions','Root user has full unrestricted access including billing (super admin); IAM users have limited permissions defined by policies','IAM users have more permissions than root','Root user cannot create S3 buckets'], correctIndex:1, explanation:'Root user = owner account with unrestricted access. Best practice: never use root for daily tasks; create IAM users with least privilege.', difficulty:'Beginner', tags:['AWS','IAM','RootUser','Security'] },
  { sessionNumber:10, moduleId:'m3', question:'Why does vertical scaling NOT work with AWS Auto Scaling?', options:['Vertical scaling requires a different cloud provider','To resize an EC2 instance vertically, the instance must be stopped/restarted — making it incompatible with auto-scaling which requires running instances','Vertical scaling is too expensive','Vertical scaling is only for databases'], correctIndex:1, explanation:'Vertical scaling changes instance size (requires stop/start). Auto Scaling needs instances to be replaced/launched without manual stopping — only horizontal scaling works.', difficulty:'Intermediate', tags:['AWS','EC2','AutoScaling','Scaling'] },
  { sessionNumber:10, moduleId:'m3', question:'What is an IAM Access Key + Secret Key used for in AWS?', options:['Console login with username/password','Programmatic authentication for tools like Terraform, AWS CLI, and scripts that access AWS APIs without console access','MFA device registration','S3 bucket encryption'], correctIndex:1, explanation:'Tool users (Terraform, AWS CLI, CI/CD pipelines) authenticate via Access Key ID + Secret Access Key instead of console login.', difficulty:'Intermediate', tags:['AWS','IAM','AccessKeys','Automation'] },

  // ── Session 11 ─────────────────────────────────────────
  { sessionNumber:11, moduleId:'m3', question:'What is an Amazon Machine Image (AMI)?', options:['A monitoring dashboard template','A pre-configured template containing OS, software, and configuration that can launch identical EC2 instances','An IAM policy document','An Elastic IP address'], correctIndex:1, explanation:'AMIs are snapshots of EC2 configurations. Use them to launch identical instances, share across accounts, or create a golden image.', difficulty:'Beginner', tags:['AWS','EC2','AMI'] },
  { sessionNumber:11, moduleId:'m3', question:'What does an Auto Scaling Group (ASG) do in AWS?', options:['Automatically rotate IAM access keys on a schedule','Automatically adjust EC2 instance count based on demand, schedules, or health checks to maintain availability and control cost','Automatically patch EC2 instances with OS updates','Automatically create S3 buckets for new users'], correctIndex:1, explanation:'ASGs maintain desired capacity, scale out (add instances) during spikes, and scale in (remove instances) during quiet periods.', difficulty:'Intermediate', tags:['AWS','AutoScaling','EC2','HighAvailability'] },
  { sessionNumber:11, moduleId:'m3', question:'What type of EBS volume provides the highest IOPS for latency-sensitive workloads?', options:['gp2 (General Purpose SSD)','sc1 (Cold HDD)','io2 Block Express (Provisioned IOPS SSD)','st1 (Throughput Optimized HDD)'], correctIndex:2, explanation:'io2 Block Express supports up to 256,000 IOPS — ideal for high-performance databases like Oracle, SQL Server, and SAP HANA.', difficulty:'Advanced', tags:['AWS','EBS','Storage','Performance'] },

  // ── Session 12 ─────────────────────────────────────────
  { sessionNumber:12, moduleId:'m3', question:'What is the Principle of Least Privilege in AWS IAM?', options:['Give all users administrator access by default','Grant only the minimum permissions required to perform a specific task, nothing more','Share root credentials with the whole team','Disable MFA to simplify access'], correctIndex:1, explanation:'Least privilege reduces attack surface. Every IAM entity should have only the permissions needed for its specific function.', difficulty:'Beginner', tags:['AWS','IAM','Security','BestPractices'] },
  { sessionNumber:12, moduleId:'m3', question:'Three users were created live in Session 12: Rahul Suman, Abhijit, and Terraform. What made the Terraform user different?', options:['Terraform user had admin permissions','Terraform user was a non-human/tool user WITHOUT console access — authenticated only via Access Key + Secret Key','Terraform user had MFA enabled','Terraform user was a root account'], correctIndex:1, explanation:'Tool users like Terraform do NOT need console access. They authenticate programmatically via Access Key + Secret Key to call AWS APIs.', difficulty:'Intermediate', tags:['AWS','IAM','Terraform','Practical'] },
  { sessionNumber:12, moduleId:'m3', question:'What is an IAM Role in AWS?', options:['A named user account with permanent credentials','A set of permissions that can be assumed by AWS services, users, or external identities using temporary security credentials','A billing group for cost allocation','A network access control list'], correctIndex:1, explanation:'IAM Roles use temporary credentials and can be assumed by EC2 instances, Lambda functions, cross-account users, and federated identities.', difficulty:'Intermediate', tags:['AWS','IAM','Roles','Security'] },

  // ── Session 13 ─────────────────────────────────────────
  { sessionNumber:13, moduleId:'m3', question:'What is the key difference between EBS storage and EC2 Instance Store?', options:['EBS is temporary; Instance Store is permanent','EBS is persistent network-attached storage that survives instance stop/start; Instance Store is ephemeral local disk lost when the instance stops or terminates','Both are identical types of storage','EBS is free; Instance Store has extra charges'], correctIndex:1, explanation:'Always use EBS for data you need to keep. Instance Store data is permanently lost when the instance is stopped or terminated.', difficulty:'Intermediate', tags:['AWS','EC2','EBS','Storage'] },
  { sessionNumber:13, moduleId:'m3', question:'What is EC2 User Data used for?', options:['Storing application secrets','A bash script that runs automatically at instance launch (as root) to install software and configure the instance','Setting IAM permissions for the instance','Enabling enhanced monitoring'], correctIndex:1, explanation:'EC2 User Data executes on first boot — perfect for automating package installation, pulling configs from S3, or bootstrapping apps.', difficulty:'Intermediate', tags:['AWS','EC2','UserData','Automation'] },
  { sessionNumber:13, moduleId:'m3', question:'What is a Placement Group in AWS EC2?', options:['A group of IAM policies','A logical grouping that influences instance placement on physical hardware for latency or availability goals','A billing group for EC2 instances','A collection of AMIs in one region'], correctIndex:1, explanation:'Placement Groups: Cluster (low network latency, same rack), Spread (separate hardware for high availability), Partition (large distributed systems).', difficulty:'Advanced', tags:['AWS','EC2','Architecture','Performance'] },

  // ── Session 14 ─────────────────────────────────────────
  { sessionNumber:14, moduleId:'m3', question:'What is the difference between an Application Load Balancer (ALB) and a Network Load Balancer (NLB)?', options:['ALB operates at Layer 4 (TCP); NLB at Layer 7 (HTTP)','ALB operates at Layer 7 (HTTP/HTTPS) and supports path/header/host-based routing; NLB operates at Layer 4 (TCP/UDP) for ultra-high performance','ALB is cheaper and NLB is enterprise only','NLB supports path-based routing; ALB does not'], correctIndex:1, explanation:'ALB: HTTP-aware routing (path, header, host rules). NLB: extreme performance TCP/UDP traffic with static IP support.', difficulty:'Intermediate', tags:['AWS','ELB','ALB','NLB','Networking'] },
  { sessionNumber:14, moduleId:'m3', question:'What is a sticky session (session affinity) in a load balancer?', options:['Routing all requests to the cheapest instance','Routing a specific user\'s requests to the same backend instance for the session duration using cookies','Blocking traffic from certain IP ranges','Encrypting all traffic end-to-end using TLS'], correctIndex:1, explanation:'Sticky sessions use cookies to route a client\'s requests to the same target — useful for stateful applications that store session data locally.', difficulty:'Intermediate', tags:['AWS','ELB','Sessions','Architecture'] },

  // ── Session 15 ─────────────────────────────────────────
  { sessionNumber:15, moduleId:'m3', question:'What type of storage is Amazon S3?', options:['Block storage (like a hard drive)','File storage (like NFS)','Object storage — stores data as objects with metadata in flat namespaces called buckets, accessed via HTTP APIs','In-memory key-value storage'], correctIndex:2, explanation:'S3 is object storage — not block or file. Each object has a key, value (data), and metadata. Max object size is 5TB.', difficulty:'Beginner', tags:['AWS','S3','Storage','ObjectStorage'] },
  { sessionNumber:15, moduleId:'m3', question:'What does S3 Versioning protect against?', options:['Encrypting objects automatically','Accidental deletion and overwrites by keeping multiple versions of every object','Cross-region replication','Static website hosting configuration'], correctIndex:1, explanation:'With versioning enabled, every PUT creates a new version. Delete markers allow recovery. Without versioning, overwritten/deleted objects are gone forever.', difficulty:'Intermediate', tags:['AWS','S3','Versioning','DataProtection'] },
  { sessionNumber:15, moduleId:'m3', question:'Which S3 storage class is most cost-effective for archival data accessed approximately once per quarter?', options:['S3 Standard','S3 Standard-IA','S3 Glacier Instant Retrieval','S3 One Zone-IA'], correctIndex:2, explanation:'S3 Glacier Instant Retrieval: millisecond retrieval for archival data accessed ~1/quarter at ~68% lower cost vs S3 Standard.', difficulty:'Intermediate', tags:['AWS','S3','StorageClasses','CostOptimization'] },

  // ── Session 16 ─────────────────────────────────────────
  { sessionNumber:16, moduleId:'m3', question:'What must be disabled before serving a public static website from S3?', options:['S3 Versioning','Server-side encryption','S3 Block Public Access (all four checkboxes)','S3 Transfer Acceleration'], correctIndex:2, explanation:'S3 Block Public Access settings must ALL be turned off before bucket policies allowing public reads can take effect.', difficulty:'Beginner', tags:['AWS','S3','StaticWebsite'] },
  { sessionNumber:16, moduleId:'m3', question:'What AWS service would you add in front of an S3 static website for HTTPS and global CDN caching?', options:['AWS WAF','Amazon CloudFront','AWS Shield Advanced','AWS Direct Connect'], correctIndex:1, explanation:'CloudFront serves as a global CDN with HTTPS (via ACM certificates), dramatically reducing latency and enabling custom domains for S3 sites.', difficulty:'Intermediate', tags:['AWS','CloudFront','S3','CDN','HTTPS'] },

  // ── Session 17 ─────────────────────────────────────────
  { sessionNumber:17, moduleId:'m3', question:'What is Amazon RDS Multi-AZ deployment?', options:['Distributing read replicas across multiple regions','Automatically maintaining a synchronous standby replica in a different Availability Zone for automatic failover without manual intervention','Partitioning database tables across AZs','Running the same query on multiple DB instances simultaneously'], correctIndex:1, explanation:'Multi-AZ maintains a sync standby in another AZ; AWS automatically fails over in ~1-2 minutes during primary DB failure.', difficulty:'Intermediate', tags:['AWS','RDS','MultiAZ','HighAvailability'] },
  { sessionNumber:17, moduleId:'m3', question:'What is the purpose of RDS Read Replicas?', options:['Providing redundancy for write operations','Offloading SELECT read queries from the primary database to async replicas to improve read throughput','Storing database automated backups','Encrypting the primary database at rest'], correctIndex:1, explanation:'Read Replicas use async replication — perfect for read-heavy workloads, analytics queries, and reporting without impacting the primary.', difficulty:'Intermediate', tags:['AWS','RDS','ReadReplica','Performance'] },

  // ── Session 18 ─────────────────────────────────────────
  { sessionNumber:18, moduleId:'m3', question:'What is a VPC (Virtual Private Cloud) in AWS?', options:['A type of EC2 instance family','An isolated virtual network you define in AWS with your own IP address range, subnets, route tables, and security controls','A managed database service','A CDN distribution service'], correctIndex:1, explanation:'A VPC is your private isolated section of AWS. You control IP addressing (CIDR), subnets, routing, internet gateways, and security.', difficulty:'Beginner', tags:['AWS','VPC','Networking'] },
  { sessionNumber:18, moduleId:'m3', question:'What is the purpose of a NAT Gateway in AWS VPC?', options:['Allows instances in public subnets to access the internet','Allows instances in PRIVATE subnets to initiate OUTBOUND internet traffic (e.g., OS updates) without being directly reachable from the internet','Provides VPN connectivity to on-premises data centres','Peers two VPCs together for private communication'], correctIndex:1, explanation:'NAT Gateway enables private subnet instances to fetch software updates, call external APIs, without exposing them to inbound internet traffic.', difficulty:'Intermediate', tags:['AWS','VPC','NAT','Networking','Security'] },
  { sessionNumber:18, moduleId:'m3', question:'What is the key difference between a Security Group and a Network ACL (NACL) in AWS VPC?', options:['They are identical, just different names','Security Groups are stateful (return traffic automatic) and operate at the instance level; NACLs are stateless (return traffic must be explicit) and operate at the subnet level','NACLs are for Windows instances; Security Groups are for Linux','Security Groups are more expensive than NACLs'], correctIndex:1, explanation:'Security Groups: stateful, instance-level, allow-only rules. NACLs: stateless, subnet-level, evaluated in number order, allow AND deny rules.', difficulty:'Advanced', tags:['AWS','VPC','SecurityGroups','NACL','Security'] },

  // ── Session 19 ─────────────────────────────────────────
  { sessionNumber:19, moduleId:'m3', question:'What is VPC Peering in AWS?', options:['Connecting a VPC to an on-premises data centre via VPN','A private networking connection between two VPCs allowing traffic to route using private IP addresses as if on the same network','Sharing a VPC across AWS accounts as a service','Enabling internet access for a VPC'], correctIndex:1, explanation:'VPC Peering connects VPCs (same or different accounts/regions) privately. No transitive peering — A↔B and B↔C does NOT mean A↔C.', difficulty:'Intermediate', tags:['AWS','VPC','Peering','Networking'] },
  { sessionNumber:19, moduleId:'m3', question:'What is AWS Transit Gateway?', options:['An EC2 instance type for high throughput','A cloud router that connects multiple VPCs and on-premises networks through a central hub, eliminating complex mesh peering','An enhanced NAT Gateway for large enterprise networks','A VPC endpoint for private S3 access'], correctIndex:1, explanation:'Transit Gateway enables transitive routing between many VPCs and VPN/Direct Connect connections — replacing complex N×N peering meshes.', difficulty:'Advanced', tags:['AWS','VPC','TransitGateway','Networking'] },

  // ── Session 20 ─────────────────────────────────────────
  { sessionNumber:20, moduleId:'m3', question:'What is Amazon CloudWatch primarily used for?', options:['Storing application source code','Monitoring AWS resources and applications by collecting metrics, logs, and events — with dashboards, alarms, and automated actions','Managing IAM policies and user access','Running serverless functions on a schedule'], correctIndex:1, explanation:'CloudWatch provides metrics, logs, dashboards, alarms, Events, and Logs Insights for comprehensive AWS infrastructure and application monitoring.', difficulty:'Beginner', tags:['AWS','CloudWatch','Monitoring','Observability'] },
  { sessionNumber:20, moduleId:'m3', question:'What triggers a CloudWatch Alarm?', options:['A scheduled Lambda function only','A metric crossing a defined threshold for a specified number of consecutive periods — triggering SNS, Auto Scaling, or EC2 actions','A log subscription filter matching a pattern','An S3 event notification'], correctIndex:1, explanation:'Alarms watch a single metric (e.g., CPU > 80% for 3 periods) and trigger actions: scale out ASG, notify via SNS, recover EC2.', difficulty:'Intermediate', tags:['AWS','CloudWatch','Alarms','Monitoring'] },

  // ── Session 21 ─────────────────────────────────────────
  { sessionNumber:21, moduleId:'m3', question:'What is the key difference between Amazon SQS and SNS?', options:['SQS is push-based; SNS is pull-based','SQS is a pull-based queue where consumers poll for messages at their own pace; SNS is push-based fan-out that immediately delivers to all subscribers','Both are identical services with different names','SQS only works with Lambda; SNS only works with EC2'], correctIndex:1, explanation:'SQS decouples producers/consumers with buffering. SNS pushes one message to many subscribers simultaneously (fan-out pattern).', difficulty:'Intermediate', tags:['AWS','SQS','SNS','Messaging','Decoupling'] },
  { sessionNumber:21, moduleId:'m3', question:'What is AWS Cost Explorer used for?', options:['Monitoring EC2 CPU performance','Visualising, understanding, and managing AWS spending and usage over time with filtering, grouping, and cost forecasting','Configuring billing alerts via SNS','Managing Reserved Instance commitments'], correctIndex:1, explanation:'Cost Explorer provides interactive charts, filters (service, region, tag), and ML-powered forecasting to understand and control AWS spend.', difficulty:'Beginner', tags:['AWS','CostOptimization','Billing','FinOps'] },

  // ── Session 22 ─────────────────────────────────────────
  { sessionNumber:22, moduleId:'m4', question:'What is the difference between `git fetch` and `git pull`?', options:['They are identical commands','`git fetch` downloads remote changes without merging; `git pull` fetches AND merges (or rebases) into the current branch automatically','`git fetch` only works on remote repos; `git pull` works locally','`git pull` is deprecated in modern Git versions'], correctIndex:1, explanation:'Best practice: `git fetch` to safely review remote changes first, then `git merge` or `git rebase` when you\'re ready to integrate.', difficulty:'Intermediate', tags:['Git','GitHub','Workflow'] },
  { sessionNumber:22, moduleId:'m4', question:'What is a Pull Request (PR) in GitHub?', options:['A request to pull code directly from a local machine to production','A mechanism to propose changes from a branch, enabling peer code review, discussion, and approval before merging into the main branch','A type of Git tag for releases','A webhook configuration for CI/CD'], correctIndex:1, explanation:'PRs enable collaborative review — teammates can comment line-by-line, request changes, and approve before code merges to main.', difficulty:'Beginner', tags:['Git','GitHub','CodeReview','Collaboration'] },
  { sessionNumber:22, moduleId:'m4', question:'What is a `.gitignore` file used for?', options:['Locking branches from unauthorized pushes','Specifying files and directories that Git should not track or commit — such as node_modules/, .env files, and build artifacts','Defining Git merge strategies for branches','Storing Git authentication credentials securely'], correctIndex:1, explanation:'`.gitignore` prevents accidental commits of secrets (.env), dependency folders (node_modules/), and build artifacts (dist/, *.log).', difficulty:'Beginner', tags:['Git','Configuration','BestPractices'] },

  // ── Session 23 ─────────────────────────────────────────
  { sessionNumber:23, moduleId:'m4', question:'What does `git reset --soft HEAD~1` do?', options:['Permanently deletes the last commit and all its changes','Moves HEAD back one commit but keeps the changes staged (in the index) and in the working directory','Reverts the last commit by creating a new undo commit','Switches to the previous branch'], correctIndex:1, explanation:'`--soft` = undo the commit but keep changes staged. `--mixed` = unstage changes. `--hard` = discard all changes permanently.', difficulty:'Intermediate', tags:['Git','Reset','Undo'] },
  { sessionNumber:23, moduleId:'m4', question:'What is `git cherry-pick` used for?', options:['Selecting which files to stage for a commit','Applying the changes from a specific commit on one branch onto the current branch without merging the entire branch','Deleting merged branches from the remote','Renaming a repository in GitHub'], correctIndex:1, explanation:'`git cherry-pick <hash>` is perfect for applying a hotfix from one branch to another without bringing along unrelated commits.', difficulty:'Advanced', tags:['Git','Advanced','Workflow'] },
  { sessionNumber:23, moduleId:'m4', question:'What is `git rebase` and how does it differ from `git merge`?', options:['Both create a merge commit in the history','`git rebase` replays commits on top of another branch creating a clean linear history; `git merge` creates a merge commit preserving branch topology','`git rebase` is used for reverting changes only','`git merge` only works on fast-forward situations'], correctIndex:1, explanation:'Rebase rewrites history for a clean linear log (preferred for feature branches). Merge preserves full branch history with a merge commit.', difficulty:'Advanced', tags:['Git','Rebase','Merge','History'] },

  // ── Session 24 ─────────────────────────────────────────
  { sessionNumber:24, moduleId:'m4', question:'What is Jenkins primarily used for in DevOps?', options:['Container image scanning only','Open-source automation server for building CI/CD pipelines that build, test, and deploy code automatically on every commit','Cloud cost management and billing','Kubernetes cluster lifecycle management'], correctIndex:1, explanation:'Jenkins orchestrates the full software delivery process: source checkout, build, test, package, and deploy — integrated with hundreds of plugins.', difficulty:'Beginner', tags:['Jenkins','CI/CD','Automation','DevOps'] },
  { sessionNumber:24, moduleId:'m4', question:'What is a Jenkinsfile?', options:['Jenkins XML configuration backup file','A text file checked into source control defining a Jenkins pipeline as code using Groovy DSL (Declarative or Scripted)','Jenkins plugin manifest and version list','Jenkins agent connection configuration file'], correctIndex:1, explanation:'Jenkinsfile stores pipeline definitions alongside application code — enabling versioning, code review, and reproducible pipelines.', difficulty:'Intermediate', tags:['Jenkins','PipelineAsCode','Groovy'] },
  { sessionNumber:24, moduleId:'m4', question:'What is the JAVA_HOME environment variable required for in a Jenkins build server?', options:['Storing Jenkins admin credentials','Telling Jenkins and Java build tools (Maven, Gradle) where the JDK is installed so Java compilation can work correctly','Setting the Jenkins admin dashboard port','Defining the Docker registry URL for image pushes'], correctIndex:1, explanation:'JAVA_HOME points to the JDK installation directory. Without it set correctly, Maven and Gradle cannot find the Java compiler.', difficulty:'Beginner', tags:['Jenkins','Java','Configuration','Setup'] },

  // ── Session 25 ─────────────────────────────────────────
  { sessionNumber:25, moduleId:'m4', question:'What is Apache Maven used for in Jenkins CI pipelines?', options:['Running Docker containers and managing images','Java project build automation: dependency management, compilation, test execution, and packaging into JAR/WAR artifacts via pom.xml','Kubernetes pod scheduling and deployment','Git repository hosting and branch management'], correctIndex:1, explanation:'Maven uses `pom.xml` to define project structure, dependencies, and lifecycle phases: compile → test → package → install → deploy.', difficulty:'Intermediate', tags:['Jenkins','Maven','Java','Build','CI'] },
  { sessionNumber:25, moduleId:'m4', question:'What Maven command compiles, runs tests, and packages a Java project without installing to the local Maven repository?', options:['mvn clean install','mvn clean package','mvn compile only','mvn deploy -DskipTests'], correctIndex:1, explanation:'`mvn clean package` runs the full lifecycle up to and including packaging (JAR/WAR). `install` additionally copies to ~/.m2; `deploy` pushes to remote repo.', difficulty:'Intermediate', tags:['Maven','Java','Build','Commands'] },

  // ── Session 26 ─────────────────────────────────────────
  { sessionNumber:26, moduleId:'m4', question:'What is the difference between Declarative and Scripted Jenkins Pipelines?', options:['Declarative uses XML; Scripted uses YAML','Declarative has a structured `pipeline {}` block with opinionated syntax (recommended for most teams); Scripted uses full Groovy with more flexibility but less structure','Both are identical in capability','Scripted pipelines are deprecated in Jenkins 2.0+'], correctIndex:1, explanation:'Declarative (recommended): readable, enforces structure. Scripted: full Groovy programmatic control. Both compile to the same Jenkins pipeline model.', difficulty:'Intermediate', tags:['Jenkins','Pipeline','Declarative','Groovy'] },
  { sessionNumber:26, moduleId:'m4', question:'How do you trigger a Jenkins pipeline automatically on a Git push?', options:['Manually click "Build Now" after every commit','Configure a GitHub/GitLab webhook pointing to the Jenkins URL — the webhook fires an HTTP POST on push events triggering the pipeline immediately','Set a cron schedule to poll the repo every 5 minutes','Email the Jenkins administrator to start the build'], correctIndex:1, explanation:'Webhooks are instant (push → build). Polling works but adds latency and wastes network resources. Webhooks are always preferred.', difficulty:'Intermediate', tags:['Jenkins','Webhooks','CI/CD','Automation'] },

  // ── Session 27 ─────────────────────────────────────────
  { sessionNumber:27, moduleId:'m4', question:'What is the key advantage of Jenkins Shared Libraries?', options:['Storing Jenkins credentials securely in an encrypted vault','Reusing common pipeline code (functions, steps, variables) across multiple Jenkinsfiles from a central Git repository — DRY principle','Running Jenkins pipelines on Kubernetes pods','Visualising pipeline execution as a Gantt chart'], correctIndex:1, explanation:'Shared Libraries extract reusable pipeline logic once — all Jenkinsfiles import it, reducing duplication and making updates centralized.', difficulty:'Advanced', tags:['Jenkins','SharedLibraries','Groovy','DRY'] },
  { sessionNumber:27, moduleId:'m4', question:'What does the Jenkins Blue Ocean plugin provide?', options:['Blue-green deployment automation for Kubernetes','A modern redesigned UI with visual pipeline editor and execution dashboard making pipeline creation and debugging more intuitive','Docker image scanning and vulnerability reporting','Kubernetes deployment operator for Jenkins agents'], correctIndex:1, explanation:'Blue Ocean provides a redesigned visual pipeline UI — stages, parallel branches, and failures are shown graphically instead of console output.', difficulty:'Beginner', tags:['Jenkins','BlueOcean','Plugins','UI'] },

  // ── Session 28 ─────────────────────────────────────────
  { sessionNumber:28, moduleId:'m4', question:'What is a Jenkins Multi-Branch Pipeline?', options:['A pipeline that runs simultaneously on multiple Jenkins controller nodes','A pipeline that automatically discovers all branches and PRs in a repository and creates/deletes pipeline jobs for each one containing a Jenkinsfile','A pipeline with multiple parallel execution stages','A pipeline for deploying to multiple cloud providers simultaneously'], correctIndex:1, explanation:'Multi-Branch Pipelines automatically scan repos and create jobs per branch/PR — ideal for feature branch CI where every branch gets its own pipeline.', difficulty:'Intermediate', tags:['Jenkins','MultiBranch','Pipeline','GitHub'] },
  { sessionNumber:28, moduleId:'m4', question:'What is Jenkins Credentials Store used for?', options:['Storing build artifacts and test reports','Securely managing sensitive data (passwords, API keys, SSH private keys, tokens) that pipelines access by ID without hardcoding in Jenkinsfiles','Caching Maven dependencies between builds','Storing Docker images for reuse across jobs'], correctIndex:1, explanation:'Jenkins Credentials Store encrypts secrets centrally. Pipeline code accesses them via ID: `withCredentials([...])` — secrets never appear in logs.', difficulty:'Intermediate', tags:['Jenkins','Security','Credentials','Secrets'] },

  // ── Session 29 ─────────────────────────────────────────
  { sessionNumber:29, moduleId:'m4', question:'What is a Jenkins Agent (formerly Slave) node?', options:['The main Jenkins controller server that manages all jobs','A worker machine that executes build jobs delegated by the Jenkins controller, enabling parallel builds and load distribution','A type of Jenkins plugin for Docker integration','A Docker container registry for storing build artifacts'], correctIndex:1, explanation:'Agents execute pipeline stages — the controller schedules and coordinates, agents do the actual build work. Labels target specific agents.', difficulty:'Intermediate', tags:['Jenkins','MasterSlave','Agents','Distributed'] },
  { sessionNumber:29, moduleId:'m4', question:'What two protocols does Jenkins use to connect agent nodes?', options:['HTTP REST API and gRPC','SSH (controller initiates connection to agent) and JNLP/TCP (agent initiates outbound connection to controller)','FTP and SFTP','Telnet and RDP'], correctIndex:1, explanation:'SSH agents: controller connects to agent via SSH. JNLP agents: agent connects outbound to controller — useful when agents are behind firewalls.', difficulty:'Intermediate', tags:['Jenkins','Agents','SSH','JNLP','Architecture'] },

  // ── Session 30 ─────────────────────────────────────────
  { sessionNumber:30, moduleId:'m5', question:'What was chosen as the standard OS and disk configuration for Docker labs in Batch 45?', options:['Windows Server 2019 with 10 GB disk','Ubuntu 24.04 LTS (non-minimal) with 30 GB disk on GCP','CentOS 7 with 20 GB on AWS','Ubuntu 20.04 LTS with 15 GB on Azure'], correctIndex:1, explanation:'Session 30 decision: Ubuntu 24.04 LTS (non-minimal), 30 GB disk on GCP VMs — VMs to be deleted after each session to avoid billing.', difficulty:'Beginner', tags:['Docker','GCP','Linux','Setup','Practical'] },
  { sessionNumber:30, moduleId:'m5', question:'What is the Docker workflow from code to running container?', options:['Code → Container → Image → Registry','Dockerfile → build → Image → push → Registry → pull → run → Container','Code → Registry → Container → Dockerfile','Dockerfile → Registry → Container → Image'], correctIndex:1, explanation:'Docker workflow: write Dockerfile → `docker build` creates Image → push to Registry (Docker Hub) → pull on another machine → `docker run` creates Container.', difficulty:'Beginner', tags:['Docker','Workflow','Fundamentals'] },
  { sessionNumber:30, moduleId:'m5', question:'What command runs the first Docker container to verify installation is working?', options:['docker start hello','docker run hello-world','docker test installation','docker verify --all'], correctIndex:1, explanation:'`docker run hello-world` pulls the hello-world image, runs it, prints a confirmation message, and exits — the standard Docker installation test.', difficulty:'Beginner', tags:['Docker','Commands','Installation','Practical'] },
  { sessionNumber:30, moduleId:'m5', question:'Why did VMs partially "fail" as a solution before Docker?', options:['VMs are too fast and expensive to run','VMs are very heavy (each needs a full Guest OS, 4-15 GB), have high resource consumption (CPU, RAM), and slow startup times making them impractical for microservices at scale','VMs only run on Windows hardware','VMs cannot access the internet'], correctIndex:1, explanation:'Each VM carries a full OS (~1.4-15 GB). Docker containers share the host OS kernel — making them megabytes instead of gigabytes, and starting in milliseconds.', difficulty:'Intermediate', tags:['Docker','VM','Comparison','Containerization'] },

  // ── Session 31 ─────────────────────────────────────────
  { sessionNumber:31, moduleId:'m5', question:'What does `docker run -d -p 8080:80 --name webserver nginx` do?', options:['Builds an nginx image from source','Runs nginx in detached/background mode, maps host port 8080 to container port 80, and names the container "webserver"','Removes the nginx image from local storage','Shows all running nginx containers and their logs'], correctIndex:1, explanation:'`-d`: detached mode. `-p 8080:80`: host port 8080 maps to container port 80. `--name`: assigns a human-readable name instead of random ID.', difficulty:'Beginner', tags:['Docker','Commands','Networking','Practical'] },
  { sessionNumber:31, moduleId:'m5', question:'What is a Docker Volume and why is it needed?', options:['A network bridge between containers in the same Docker network','A mechanism to persist data outside the container lifecycle — data in volumes survives container removal, restart, and recreation','A type of Docker base image for stateful applications','A Docker Compose configuration section for data'], correctIndex:1, explanation:'Container filesystems are ephemeral — data is lost on container removal. Volumes persist data independently and are managed by Docker.', difficulty:'Intermediate', tags:['Docker','Volumes','Persistence','Storage'] },

  // ── Session 32 ─────────────────────────────────────────
  { sessionNumber:32, moduleId:'m5', question:'What is the difference between `CMD` and `ENTRYPOINT` in a Dockerfile?', options:['Both are identical — use whichever you prefer','ENTRYPOINT defines the fixed executable that always runs; CMD provides default arguments that can be overridden at `docker run` time','CMD sets environment variables; ENTRYPOINT sets the working directory','ENTRYPOINT is for Windows containers; CMD is for Linux containers only'], correctIndex:1, explanation:'Best practice: `ENTRYPOINT ["java", "-jar"]` + `CMD ["app.jar"]`. `docker run image custom.jar` overrides CMD but not ENTRYPOINT.', difficulty:'Advanced', tags:['Docker','Dockerfile','ENTRYPOINT','CMD'] },
  { sessionNumber:32, moduleId:'m5', question:'What does the `EXPOSE` instruction in a Dockerfile actually do?', options:['Automatically opens the port on the host machine and makes it accessible','Documents which ports the container listens on — it does NOT publish ports; `-p hostPort:containerPort` in `docker run` is still required','Creates a firewall rule allowing traffic on that port','Binds the container to localhost only, blocking external access'], correctIndex:1, explanation:'`EXPOSE` is documentation metadata — it tells other developers (and Docker Compose) which ports to map. Actual publishing requires `-p` at runtime.', difficulty:'Intermediate', tags:['Docker','Dockerfile','Networking','Ports'] },

  // ── Session 33 ─────────────────────────────────────────
  { sessionNumber:33, moduleId:'m5', question:'What specific problem does Kubernetes solve that Docker alone cannot handle at scale?', options:['Building and storing container images','Orchestrating containers at scale: auto-scheduling, self-healing (restarts failed containers), horizontal scaling, rolling updates, and load balancing across a cluster of nodes','Writing Dockerfiles and building images','Storing and distributing Docker images via registries'], correctIndex:1, explanation:'Docker runs containers on one machine. Kubernetes runs thousands across hundreds of nodes with auto-healing, auto-scaling, and zero-downtime updates.', difficulty:'Beginner', tags:['Kubernetes','Orchestration','Containers','vs Docker'] },
  { sessionNumber:33, moduleId:'m5', question:'What is a Kubernetes Pod?', options:['A group of Kubernetes worker nodes','The smallest deployable unit in Kubernetes — one or more tightly coupled containers that share the same network namespace (localhost) and storage volumes','A Kubernetes cluster management dashboard','A Helm chart for deploying applications'], correctIndex:1, explanation:'Pods co-locate containers that must communicate via localhost (e.g., app + sidecar). All containers in a Pod share the same IP and can share volumes.', difficulty:'Beginner', tags:['Kubernetes','Pod','Fundamentals'] },
  { sessionNumber:33, moduleId:'m5', question:'What components make up the Kubernetes Control Plane?', options:['Only etcd and kubelet','API Server (gateway for all requests), etcd (distributed state store), Scheduler (assigns pods to nodes), Controller Manager (maintains desired state)','Docker daemon and containerd runtime','Helm and Ingress Controller'], correctIndex:1, explanation:'Control plane = cluster\'s brain. API Server: REST gateway. etcd: cluster state DB. Scheduler: pod-to-node assignment. Controller Manager: reconciliation loops.', difficulty:'Intermediate', tags:['Kubernetes','ControlPlane','Architecture'] },

  // ── Session 34 ─────────────────────────────────────────
  { sessionNumber:34, moduleId:'m5', question:'What is a Kubernetes Deployment object?', options:['A single manually managed pod','A higher-level controller that manages ReplicaSets to ensure desired replica count, enables rolling updates, and provides rollback capability','A Kubernetes namespace configuration','A ConfigMap for storing application configuration'], correctIndex:1, explanation:'Deployments declaratively manage pod lifecycle: declare desired state → Deployment continuously reconciles actual state to match desired state.', difficulty:'Intermediate', tags:['Kubernetes','Deployment','ReplicaSet','RollingUpdate'] },
  { sessionNumber:34, moduleId:'m5', question:'What is GKE (Google Kubernetes Engine)?', options:['Google\'s key management service for encryption','Google\'s fully managed Kubernetes service on GCP that automates cluster provisioning, control plane management, node auto-upgrades, and auto-repair','Google\'s private container image registry','Google\'s cloud networking service for VPC management'], correctIndex:1, explanation:'GKE handles all control plane operations — you just manage your workloads. Features: auto-scaling, auto-upgrade, Workload Identity, and Autopilot mode.', difficulty:'Beginner', tags:['GKE','GCP','Kubernetes','ManagedK8s'] },
  { sessionNumber:34, moduleId:'m5', question:'Why is a Kubernetes Service necessary when Pods already have IP addresses?', options:['Pods do not have IP addresses','Pod IPs change every time a pod restarts or is recreated. Services provide a stable virtual IP and DNS name that always routes to healthy pods via label selectors','Services provide encryption for pod traffic','Services are required for pods to communicate within the same node'], correctIndex:1, explanation:'Pods are ephemeral — they restart with new IPs. Services abstract this with a stable ClusterIP and DNS name, load-balancing across all matching pods.', difficulty:'Intermediate', tags:['Kubernetes','Service','Networking','LoadBalancing'] },

  // ── Session 35 ─────────────────────────────────────────
  { sessionNumber:35, moduleId:'m5', question:'What is a Kubernetes Ingress?', options:['A type of pod for handling network ingress traffic','An API object managing external HTTP/HTTPS access to services — providing URL path routing, host-based routing, and SSL/TLS termination via an Ingress Controller','A Kubernetes node type optimised for networking','A PersistentVolumeClaim for network-attached storage'], correctIndex:1, explanation:'Ingress exposes multiple services under one external IP/domain with routing rules: `/api` → api-service, `/app` → frontend-service, all with TLS.', difficulty:'Intermediate', tags:['Kubernetes','Ingress','Networking','HTTP','TLS'] },
  { sessionNumber:35, moduleId:'m5', question:'What is Horizontal Pod Autoscaling (HPA) in Kubernetes?', options:['Manually editing the `replicas` field in a Deployment YAML','Automatically scaling the number of pod replicas up or down based on CPU/memory utilisation or custom metrics without manual intervention','Adding more nodes (VMs) to the Kubernetes cluster','Vertically scaling pod CPU/memory resource limits'], correctIndex:1, explanation:'HPA watches metrics and adjusts replica count automatically: high CPU → scale out pods; idle → scale in. Requires metrics-server in the cluster.', difficulty:'Intermediate', tags:['Kubernetes','HPA','Autoscaling'] },

  // ── Session 36 ─────────────────────────────────────────
  { sessionNumber:36, moduleId:'m5', question:'How does Prometheus collect metrics from applications?', options:['Applications push metrics to Prometheus via HTTP POST','Prometheus scrapes (pulls) metrics from HTTP /metrics endpoints on applications and exporters at configured intervals','Prometheus reads log files and parses them for metrics','Prometheus connects to databases and runs SQL queries for metrics'], correctIndex:1, explanation:'Prometheus pull model: targets expose /metrics in text format; Prometheus scrapes them at defined intervals (e.g., every 15s). Pushgateway handles short-lived jobs.', difficulty:'Intermediate', tags:['Prometheus','Monitoring','Scraping','Metrics'] },
  { sessionNumber:36, moduleId:'m5', question:'What is PromQL and what is it used for?', options:['A SQL dialect for querying relational databases','Prometheus Query Language for selecting, filtering, and aggregating time-series metrics data — used for Grafana dashboards and alert rules','A YAML configuration format for Prometheus scrape configs','A tool for deploying Prometheus on Kubernetes'], correctIndex:1, explanation:'PromQL: `rate(http_requests_total[5m])` = per-second request rate over 5m window. `avg by (pod) (container_cpu_usage_seconds_total)` = CPU per pod.', difficulty:'Advanced', tags:['Prometheus','PromQL','Monitoring','Alerting'] },

  // ── Session 37 ─────────────────────────────────────────
  { sessionNumber:37, moduleId:'m5', question:'What is Grafana\'s primary function in a DevOps observability stack?', options:['Running and scheduling containerised applications','Open-source observability platform for creating rich dashboards that visualise metrics, logs, and traces from multiple data sources (Prometheus, CloudWatch, Loki, Jaeger)','Database administration and query optimisation','CI/CD pipeline execution and build automation'], correctIndex:1, explanation:'Grafana connects to any data source — Prometheus, CloudWatch, Elasticsearch — and renders interactive time-series dashboards and alert panels.', difficulty:'Beginner', tags:['Grafana','Monitoring','Dashboards','Observability'] },
  { sessionNumber:37, moduleId:'m5', question:'What is Helm in Kubernetes and what problem does it solve?', options:['A container runtime alternative to containerd','A Kubernetes package manager that uses charts (templated YAML manifests) to define, install, and upgrade complex applications with configurable values','A Kubernetes monitoring tool built into the control plane','An Ingress controller for HTTP traffic management'], correctIndex:1, explanation:'Helm charts bundle K8s manifests + configurable values.yaml. `helm install my-app ./my-chart --values prod.yaml` deploys the full stack in one command.', difficulty:'Intermediate', tags:['Kubernetes','Helm','PackageManager','DevOps'] },

  // ── Session 38 ─────────────────────────────────────────
  { sessionNumber:38, moduleId:'m6', question:'What does `terraform plan` do and why is it important?', options:['Immediately creates all defined infrastructure resources','Shows a detailed preview of what Terraform will create, modify, or destroy WITHOUT making any actual changes — a dry-run for safe review','Destroys all Terraform-managed infrastructure','Formats and validates Terraform configuration files'], correctIndex:1, explanation:'Always run `terraform plan` before `apply`. It shows the exact changes (green=add, yellow=change, red=destroy) with zero risk to existing infrastructure.', difficulty:'Beginner', tags:['Terraform','Commands','IaC','Safety'] },
  { sessionNumber:38, moduleId:'m6', question:'What is a Terraform state file (terraform.tfstate) and why must it be protected?', options:['A log file recording Terraform command history','A file mapping real infrastructure resources to your Terraform configuration, tracking what Terraform manages — without it Terraform cannot determine what already exists','A list of approved Terraform modules from the registry','A Terraform provider configuration cache file'], correctIndex:1, explanation:'State tracks resource metadata and unique IDs. If lost/corrupted: Terraform loses track of existing resources. Store it in S3+DynamoDB, never in Git.', difficulty:'Intermediate', tags:['Terraform','State','IaC','Security'] },
  { sessionNumber:38, moduleId:'m6', question:'What is a Terraform Provider?', options:['A Terraform module repository hosting service','A plugin that enables Terraform to interact with a specific platform\'s API (AWS, GCP, Azure, Kubernetes, GitHub, Datadog)','A Terraform backend configuration for remote state','A Terraform output variable for sharing values between modules'], correctIndex:1, explanation:'Providers are bridges between Terraform core and infrastructure APIs. The AWS provider manages 1000+ resources: EC2, S3, IAM, VPC, etc.', difficulty:'Intermediate', tags:['Terraform','Providers','IaC','AWS'] },

  // ── Session 39 ─────────────────────────────────────────
  { sessionNumber:39, moduleId:'m6', question:'What is a Terraform Module?', options:['A single Terraform resource definition block','A reusable, parameterised container of Terraform resources called with input variables to avoid code duplication — like a function in programming','A Terraform state file section','A Terraform provider plugin binary'], correctIndex:1, explanation:'Modules encapsulate infrastructure patterns. `module "vpc" { source = "./modules/vpc" cidr = "10.0.0.0/16" }` reuses the VPC module with custom CIDR.', difficulty:'Intermediate', tags:['Terraform','Modules','IaC','Reusability'] },
  { sessionNumber:39, moduleId:'m6', question:'Why should Terraform state be stored in a remote backend (S3 + DynamoDB)?', options:['To make Terraform plan run faster','To share state safely across team members, prevent corruption from concurrent applies using DynamoDB state locking, and survive local machine failures','To reduce AWS infrastructure costs','To encrypt the Terraform plan output'], correctIndex:1, explanation:'Remote state: S3 stores the tfstate; DynamoDB provides locking (one apply at a time); all team members and CI/CD pipelines share the same state.', difficulty:'Advanced', tags:['Terraform','State','Remote','Collaboration'] },
  { sessionNumber:39, moduleId:'m6', question:'What does `terraform apply -auto-approve` do?', options:['Shows plan output without applying any changes','Applies the Terraform execution plan without prompting for interactive confirmation — commonly used in CI/CD pipelines for unattended automation','Destroys all Terraform-managed resources immediately','Formats Terraform HCL files according to canonical style'], correctIndex:1, explanation:'`-auto-approve` skips the `yes/no` prompt. Use carefully — always review `plan` output first, then automate `apply` in a reviewed CI/CD pipeline.', difficulty:'Intermediate', tags:['Terraform','Commands','CI/CD','Automation'] },

  // ── Session 40 ─────────────────────────────────────────
  { sessionNumber:40, moduleId:'m6', question:'What makes Ansible "agentless" compared to Puppet or Chef?', options:['Ansible uses HTTP REST APIs to configure nodes','Ansible communicates with managed nodes via standard SSH without requiring any additional software (agent) installed on remote hosts','Ansible only works on Windows systems natively','Ansible requires a central master server with agents on each node'], correctIndex:1, explanation:'No agent to install, update, or secure on 100s of servers. Ansible pushes tasks over SSH using Python (pre-installed on most Linux systems).', difficulty:'Intermediate', tags:['Ansible','Agentless','Architecture','SSH'] },
  { sessionNumber:40, moduleId:'m6', question:'What is an Ansible Inventory file?', options:['A list of all Ansible modules available in the installation','A file (hosts file) defining the managed nodes and groups that Ansible targets, with optional per-host or per-group variables','An Ansible Playbook for initial setup','Ansible Vault configuration for encrypted credentials'], correctIndex:1, explanation:'Inventory organizes servers into groups: `[webservers]`, `[databases]`. Ansible runs playbooks against `all`, a specific group, or individual hosts.', difficulty:'Beginner', tags:['Ansible','Inventory','Configuration'] },

  // ── Session 41 ─────────────────────────────────────────
  { sessionNumber:41, moduleId:'m6', question:'What is an Ansible Playbook?', options:['Ansible documentation in PDF format','A YAML file defining an ordered list of plays, each mapping target hosts to tasks and roles — the primary way to automate configuration and deployment with Ansible','Ansible inventory configuration file','An Ansible provider plugin for cloud services'], correctIndex:1, explanation:'Playbooks are human-readable YAML orchestrations. One playbook can install nginx, configure SSL, deploy app code, and restart services in order.', difficulty:'Beginner', tags:['Ansible','Playbook','YAML','Automation'] },
  { sessionNumber:41, moduleId:'m6', question:'What is an Ansible Role?', options:['An IAM permission definition in Ansible Vault','A standardised directory structure (tasks/, handlers/, vars/, templates/, files/, defaults/, meta/) for reusable, shareable automation units distributed via Ansible Galaxy','An Ansible inventory group type for server roles','A specific Ansible module for role-based access control'], correctIndex:1, explanation:'Roles provide consistent structure making automation shareable. `ansible-galaxy role install geerlingguy.nginx` installs a community role instantly.', difficulty:'Intermediate', tags:['Ansible','Roles','Structure','Reusability'] },

  // ── Session 42 ─────────────────────────────────────────
  { sessionNumber:42, moduleId:'m6', question:'What is Ansible Vault and what encryption does it use?', options:['Ansible\'s log storage system for playbook execution history','A tool for encrypting sensitive files and variables (passwords, API keys, certificates) within Ansible using AES-256 encryption','Ansible\'s central inventory management dashboard','Ansible Galaxy\'s private role repository'], correctIndex:1, explanation:'`ansible-vault encrypt secrets.yml` encrypts the file. At runtime: `ansible-playbook --vault-password-file vault.pass site.yml` decrypts transparently.', difficulty:'Intermediate', tags:['Ansible','Vault','Security','AES256','Encryption'] },
  { sessionNumber:42, moduleId:'m6', question:'What is an Ansible Handler and when does it run?', options:['Ansible error catching and retry mechanism for failed tasks','A special task triggered ONLY when notified by another task via `notify:` directive — runs once at the end of a play, commonly used to restart services after config changes','An Ansible inventory plugin for dynamic cloud inventories','A role dependency declaration in meta/main.yml'], correctIndex:1, explanation:'Handler idempotency: if 5 tasks notify "restart nginx", the handler fires only ONCE at the end of the play — not 5 times.', difficulty:'Intermediate', tags:['Ansible','Handlers','Idempotency','Services'] },

  // ── Session 43 ─────────────────────────────────────────
  { sessionNumber:43, moduleId:'m6', question:'What does `set -euo pipefail` at the start of a Bash script do?', options:['Sets environment variables for the script execution','Makes the script fail fast: `-e` exits on error, `-u` treats unset variables as errors, `pipefail` fails if any command in a pipe fails','Disables debug mode and verbose output','Sets the working directory and PATH variable'], correctIndex:1, explanation:'This triplet is the safety standard for production shell scripts. Without it, a failing command might be silently ignored and execution continues.', difficulty:'Advanced', tags:['Bash','Scripting','BestPractices','SafeMode'] },
  { sessionNumber:43, moduleId:'m6', question:'What does the special variable `$?` represent in a Bash script?', options:['The script\'s process ID (PID)','The exit code of the last executed command — 0 means success, any non-zero value indicates an error','The number of arguments passed to the script','The current working directory path'], correctIndex:1, explanation:'Checking `$?` after critical commands enables error handling: `if [ $? -ne 0 ]; then echo "Failed"; exit 1; fi`. This is fundamental to robust scripting.', difficulty:'Intermediate', tags:['Bash','Scripting','ExitCodes','ErrorHandling'] },
  { sessionNumber:43, moduleId:'m6', question:'What is the shebang line `#!/bin/bash` at the top of a shell script?', options:['A comment explaining the script\'s purpose','An interpreter directive telling the OS which shell/interpreter to use to execute the script when run directly (./script.sh)','A syntax error that must be removed','A variable declaration initialising the BASH variable'], correctIndex:1, explanation:'The shebang (`#!` + path) is the first line of a script. Without it, the OS uses the default shell which may differ from your expected interpreter.', difficulty:'Beginner', tags:['Bash','Scripting','Linux','Fundamentals'] },

  // ── Session 44 ─────────────────────────────────────────
  { sessionNumber:44, moduleId:'m6', question:'What is Boto3 in Python DevOps automation?', options:['A Python web framework for building REST APIs','The official AWS SDK for Python enabling programmatic control of AWS services (EC2, S3, IAM, Lambda, etc.) from Python scripts','A Python testing library for unit and integration tests','A Python Docker SDK for container management'], correctIndex:1, explanation:'Boto3: `import boto3; ec2 = boto3.client("ec2"); ec2.start_instances(InstanceIds=["i-xxx"])`. Used in Lambda functions, automation scripts, and CI/CD pipelines.', difficulty:'Intermediate', tags:['Python','Boto3','AWS','Automation','SDK'] },
  { sessionNumber:44, moduleId:'m6', question:'What is a Python virtual environment and why is it used in DevOps projects?', options:['A cloud-hosted Python server on GCP','An isolated Python environment with its own interpreter and packages preventing dependency conflicts between different projects on the same machine','A Docker container running Python scripts','A Python IDE configuration for syntax highlighting'], correctIndex:1, explanation:'`python -m venv venv && source venv/bin/activate`: project A needs boto3==1.20, project B needs boto3==1.26 — virtual envs isolate them without conflict.', difficulty:'Beginner', tags:['Python','VirtualEnv','DependencyManagement','DevOps'] },

  // ── Session 45 ─────────────────────────────────────────
  { sessionNumber:45, moduleId:'m6', question:'What does ATS stand for and why does it matter for DevOps job applications?', options:['Automated Testing System for CI/CD pipelines','Applicant Tracking System — software used by employers to scan and filter resumes for keywords before human review. If your resume isn\'t ATS-optimised, it may be auto-rejected','AWS Transfer Service for file migrations','Ansible Tower System for enterprise automation'], correctIndex:1, explanation:'Most enterprise companies use ATS. If your resume doesn\'t contain the right keywords from the job description, it gets filtered out before a human sees it.', difficulty:'Beginner', tags:['Career','ATS','Resume','JobSearch'] },
  { sessionNumber:45, moduleId:'m6', question:'Which resume format is most ATS-compatible for DevOps engineer applications?', options:['PDF with complex multi-column layouts, graphics, and icons','Clean single-column DOCX or simple PDF without tables, text boxes, graphics, or columns that ATS parsers cannot read correctly','HTML format submitted via email attachment','PowerPoint presentation format showcasing project screenshots'], correctIndex:1, explanation:'Complex layouts, tables with merged cells, and graphics confuse ATS parsers — text gets scrambled or dropped. Clean, text-first single-column format ensures full parsing.', difficulty:'Beginner', tags:['Career','ATS','Resume','BestPractices','Format'] },

  // ── Session 46 ─────────────────────────────────────────
  { sessionNumber:46, moduleId:'m6', question:'What is GitOps and how does it differ from traditional push-based deployment?', options:['Using Git for backup only without CI/CD integration','Operating model where Git is the single source of truth for declarative infrastructure/apps; a reconciliation agent (ArgoCD, Flux) automatically syncs cluster state to match Git — pull-based','GitHub Actions CI/CD running shell scripts to deploy','Git branching strategy for large engineering teams'], correctIndex:1, explanation:'GitOps: commit to Git → reconciliation loop detects drift → automatically applies changes. Rollback = `git revert`. Every deployment is auditable via Git history.', difficulty:'Intermediate', tags:['GitOps','DevOps','ArgoCD','Deployment','Kubernetes'] },
  { sessionNumber:46, moduleId:'m6', question:'What is a service mesh and what problems does it solve?', options:['A physical network of servers in a data centre','Infrastructure layer for service-to-service communication that handles traffic management, observability (distributed tracing), and mTLS security WITHOUT code changes in applications','A type of Kubernetes Ingress for external traffic','A Docker networking mode for container communication'], correctIndex:1, explanation:'Service meshes (Istio, Linkerd) use sidecar proxies (Envoy) injected alongside each pod to intercept all traffic — enabling retries, circuit breaking, and mTLS transparently.', difficulty:'Advanced', tags:['Microservices','ServiceMesh','Istio','Architecture','mTLS'] },

  // ── Session 47 ─────────────────────────────────────────
  { sessionNumber:47, moduleId:'m7', question:'What is an Azure Resource Group?', options:['A type of Azure virtual machine for high availability','A logical container grouping related Azure resources that share the same lifecycle, permissions (RBAC), billing, and can be managed as a unit','An Azure networking component equivalent to AWS VPC','An Azure subscription type for enterprise accounts'], correctIndex:1, explanation:'Resource Groups: deploy all resources for one app together, apply RBAC at the group level, delete the entire app by deleting one resource group.', difficulty:'Beginner', tags:['Azure','ResourceGroup','Architecture','Management'] },
  { sessionNumber:47, moduleId:'m7', question:'What is Azure DevOps Pipelines?', options:['Azure virtual machines pre-configured for running CI/CD agents','Cloud-hosted CI/CD pipelines with YAML or classic editor support for building, testing, and deploying to any cloud, on-premises, or container platform','Azure monitoring dashboards and log analytics','Azure cost management and billing analysis tools'], correctIndex:1, explanation:'Azure Pipelines: multi-platform CI/CD with Microsoft-hosted or self-hosted agents, multi-stage YAML pipelines, gates, approvals, and environments.', difficulty:'Intermediate', tags:['Azure','DevOps','Pipelines','CI/CD'] },
  { sessionNumber:47, moduleId:'m7', question:'What is Azure Active Directory (Entra ID) and what is it used for?', options:['Azure\'s virtual machine provisioning service','Microsoft\'s cloud-based identity and access management (IAM) service providing SSO, MFA, B2B/B2C identity, and conditional access for Microsoft 365, Azure, and third-party apps','Azure\'s DNS hosting and domain registration service','Azure\'s managed container registry for Docker images'], correctIndex:1, explanation:'Azure AD (now Entra ID) is the identity backbone for all Microsoft services. Every Azure login, M365 user, and service principal is managed here.', difficulty:'Intermediate', tags:['Azure','AAD','Identity','IAM','SSO'] },

  // ── Session 48 ─────────────────────────────────────────
  { sessionNumber:48, moduleId:'m7', question:'What is "temperature" in LLM inference and how should DevOps engineers set it for generating code?', options:['A server metric showing GPU heat levels','A parameter (0–2) controlling randomness: low temperature (0–0.2) produces deterministic, focused output ideal for code generation; high temperature (1–2) produces creative/varied responses','A model training hyperparameter only relevant during fine-tuning','GPU memory allocation setting for inference'], correctIndex:1, explanation:'For code generation and factual DevOps answers: use temperature 0–0.2 for consistency. For brainstorming architecture ideas: use 0.7–1.0 for creativity.', difficulty:'Intermediate', tags:['AI','LLM','Temperature','PromptEngineering','Inference'] },
  { sessionNumber:48, moduleId:'m7', question:'What is "few-shot prompting" and when should a DevOps engineer use it?', options:['Using fewer compute tokens to reduce AI API costs','Providing the AI 2-5 input→output examples within the prompt to demonstrate exact format, style, or reasoning expected — dramatically improving consistency for repetitive DevOps tasks','Running inference on fewer GPUs for cost optimization','A technique to reduce AI response length for concise answers'], correctIndex:1, explanation:'Few-shot: "Here are 3 examples of Terraform modules I write [examples]. Now write a module for an ECS cluster with these inputs." Output matches your exact style.', difficulty:'Intermediate', tags:['AI','PromptEngineering','FewShot','LLM','DevOps'] },

  // ── Session 49 ─────────────────────────────────────────
  { sessionNumber:49, moduleId:'m7', question:'What is Retrieval-Augmented Generation (RAG) and why is it important for DevOps tooling?', options:['A database query optimisation technique for RAG tables','An AI architecture combining vector search over a knowledge base with an LLM generator — enabling AI to answer questions about YOUR private documentation, runbooks, and infrastructure specs','A type of GPU acceleration for faster inference','A model fine-tuning technique requiring labelled training data'], correctIndex:1, explanation:'RAG: query → embed → vector search private docs → inject relevant context into LLM prompt → grounded answer. Prevents hallucination with up-to-date private knowledge.', difficulty:'Advanced', tags:['AI','RAG','LLM','Architecture','VectorSearch'] },
  { sessionNumber:49, moduleId:'m7', question:'What is an AI Agent in the context of DevOps automation?', options:['A Jenkins build agent running on Kubernetes','An AI system that can autonomously plan multi-step tasks, use tools (APIs, shell commands, databases), and iteratively act to achieve a goal without human intervention for each step','A monitoring agent collecting metrics from servers','A human DevOps engineer using AI tools'], correctIndex:1, explanation:'AI Agents: given goal "deploy the app to production" → agent plans steps → calls GitHub API, runs Terraform, executes kubectl — all autonomously in a feedback loop.', difficulty:'Advanced', tags:['AI','Agents','Automation','DevOps','Agentic'] },

  // ── Session 50 ─────────────────────────────────────────
  { sessionNumber:50, moduleId:'m8', question:'What is a Blue-Green deployment strategy and what problem does it solve?', options:['Using blue and green colour themes in Grafana dashboards','Running two identical production environments (blue=live, green=new version) and switching traffic instantly — enabling zero-downtime deployment and instant rollback by routing back to blue','A Docker networking mode for container communication','A Kubernetes pod scheduling strategy for multi-AZ deployment'], correctIndex:1, explanation:'Blue-Green: green runs in parallel with blue → validated → DNS/LB switch (seconds) → zero downtime. Rollback = switch back to blue. Requires 2x production infrastructure.', difficulty:'Intermediate', tags:['CI/CD','BlueGreen','DeploymentStrategy','ZeroDowntime','Project'] },
  { sessionNumber:50, moduleId:'m8', question:'What is a Canary deployment strategy?', options:['Deploying only to canary island data centres','Gradually rolling out a new version to a small percentage (1-5%) of users first, monitoring for errors, then progressively increasing traffic if healthy','A deployment that only runs automated canary tests','A Jenkins pipeline stage for automated testing'], correctIndex:1, explanation:'Canary: 5% traffic → new version → metrics look good → 25% → 50% → 100%. If error rate spikes at 5%: rollback immediately with minimal user impact.', difficulty:'Intermediate', tags:['CI/CD','Canary','DeploymentStrategy','RiskMitigation','Project'] },

  // ── Session 51 ─────────────────────────────────────────
  { sessionNumber:51, moduleId:'m8', question:'What is a Kubernetes Namespace and why use multiple namespaces?', options:['A DNS record type for Kubernetes service discovery','A logical partitioning mechanism within a Kubernetes cluster — isolating resources per team/environment, applying independent RBAC, and enforcing resource quotas','A type of container network interface (CNI) plugin','A Kubernetes deployment strategy for high availability'], correctIndex:1, explanation:'Namespaces enable multi-tenancy: dev, staging, prod namespaces in one cluster with separate RBAC, quotas, and network policies per namespace.', difficulty:'Intermediate', tags:['Kubernetes','Namespace','MultiTenancy','Project'] },
  { sessionNumber:51, moduleId:'m8', question:'What is a microservices architecture?', options:['A monolithic application organised into logical layers','Application structured as independently deployable services, each with its own codebase, database, and API — communicating via REST or message queues','Running all application code in a single Docker container','A database architecture pattern for horizontal sharding'], correctIndex:1, explanation:'Microservices: each service (user, payment, cart) deploys independently, scales independently, and can use different technology stacks. Trade-off: network complexity.', difficulty:'Intermediate', tags:['Microservices','Architecture','Cloud','GKE','Project'] },

  // ── Session 52 ─────────────────────────────────────────
  { sessionNumber:52, moduleId:'m8', question:'What is Infrastructure as Code (IaC) and why is it a DevOps best practice?', options:['Documenting infrastructure diagrams in Visio or PowerPoint','Managing and provisioning infrastructure through version-controlled machine-readable definition files — enabling reproducibility, automation, peer review, and drift prevention','Clicking through cloud console to create resources manually','Hiring dedicated infrastructure engineers for every environment'], correctIndex:1, explanation:'IaC = Git for infrastructure. Every change is reviewed (PR), versioned, testable, and reproducible. `terraform apply` creates identical envs from scratch every time.', difficulty:'Beginner', tags:['IaC','Terraform','DevOps','BestPractices','Project'] },
  { sessionNumber:52, moduleId:'m8', question:'What is Terraform workspace and when would you use multiple workspaces?', options:['Visual Studio Code extension for Terraform syntax highlighting','Named Terraform state containers allowing one configuration to manage multiple environments (dev/staging/prod) with different variable values and isolated state files','Terraform provider plugin configuration sections','Terraform public module registry search interface'], correctIndex:1, explanation:'`terraform workspace new dev` → `terraform workspace new prod` → same code, different `.tfvars` files and isolated state. Alternative: separate directories per env.', difficulty:'Advanced', tags:['Terraform','Workspaces','Environments','IaC','Project'] },

  // ── Session 53 ─────────────────────────────────────────
  { sessionNumber:53, moduleId:'m8', question:'What is DevSecOps?', options:['Securing only the production environment after deployment','Integrating security practices (SAST, DAST, container scanning, secret detection) throughout the entire DevOps pipeline so security is automated, continuous, and everyone\'s responsibility','Security team auditing code at the end of sprint cycles only','Using network firewalls as the sole cloud workload protection'], correctIndex:1, explanation:'DevSecOps shifts security left: every PR triggers security scans. Security gates in CI/CD prevent vulnerable code from reaching production.', difficulty:'Intermediate', tags:['DevSecOps','Security','ShiftLeft','CI/CD','Project'] },
  { sessionNumber:53, moduleId:'m8', question:'What is SAST (Static Application Security Testing)?', options:['Testing applications by sending malicious HTTP requests to running services','Automated analysis of source code, bytecode, or compiled binaries for security vulnerabilities WITHOUT executing the application — integrated as a CI/CD pipeline gate','Manual penetration testing performed by security engineers quarterly','Network-level vulnerability scanning of cloud infrastructure'], correctIndex:1, explanation:'SAST tools (SonarQube, Semgrep, Checkmarx): scan code at rest in CI pipeline → find SQL injection, hardcoded secrets, insecure deserialization early in development.', difficulty:'Intermediate', tags:['Security','SAST','DevSecOps','CI/CD','Project'] },

  // ── Session 54 ─────────────────────────────────────────
  { sessionNumber:54, moduleId:'m8', question:'What is an Azure Service Connection in Azure DevOps?', options:['An Azure network connection between two Virtual Networks (VNet peering)','A secure credential reference allowing Azure DevOps pipelines to authenticate and deploy to Azure subscriptions, Docker Hub, Kubernetes clusters, or external services without hardcoding credentials','Azure Monitor alert configuration for pipeline failures','Azure DNS record linking a custom domain to a pipeline'], correctIndex:1, explanation:'Service Connections store service principals, tokens, or certificates securely — pipelines reference them by name without ever seeing the actual credentials.', difficulty:'Intermediate', tags:['Azure','DevOps','ServiceConnection','Authentication','Project'] },
  { sessionNumber:54, moduleId:'m8', question:'What is an Azure DevOps Release Pipeline?', options:['A branch protection rule configuration in Azure Repos','A CD workflow defining deployment stages (Dev→QA→Staging→Prod) with manual approval gates, pre/post deployment conditions, and environment-specific variable overrides','Azure build agent configuration and pool management','Azure repository backup and disaster recovery process'], correctIndex:1, explanation:'Release Pipelines: artifacts from CI → multi-stage CD with approval gates → environment variables per stage → deployment history and rollback.', difficulty:'Intermediate', tags:['Azure','DevOps','Release','CD','Pipeline','Project'] },

  // ── Session 55 ─────────────────────────────────────────
  { sessionNumber:55, moduleId:'m8', question:'What is the difference between calling an AI API (Gemini/OpenAI) and self-hosting a model?', options:['They are identical in cost and capability','API: pay-per-token, no infrastructure, instant access to latest models, managed by provider. Self-host: upfront GPU cost, full control over data privacy, no per-token fees, requires MLOps expertise','Self-hosting is always cheaper than using APIs','APIs are only available for large enterprise customers'], correctIndex:1, explanation:'API: ideal for prototyping and when privacy allows sending data to 3rd party. Self-host: needed for sensitive data (patient records, proprietary code) or high-volume cost optimization.', difficulty:'Intermediate', tags:['AI','API','Cloud','Integration','Project'] },
  { sessionNumber:55, moduleId:'m8', question:'What is an API rate limit and how should production applications handle it?', options:['A maximum HTTP request payload size limit','A throttle on API calls per time window (e.g., 60 req/min); applications must implement exponential backoff, retry logic, and request queuing to handle 429 Too Many Requests gracefully','A database connection pool size limit','An SSL certificate expiry enforcement mechanism'], correctIndex:1, explanation:'Exponential backoff: on 429 → wait 1s → retry → wait 2s → retry → wait 4s... + random jitter to avoid thundering herd. Essential for resilient AI API integration.', difficulty:'Intermediate', tags:['API','RateLimiting','Resilience','Integration','Project'] },

  // ── Session 56 ─────────────────────────────────────────
  { sessionNumber:56, moduleId:'m8', question:'What is MLOps and how does it extend DevOps principles to machine learning?', options:['Manual model training and deployment processes for ML engineers','Applying DevOps principles (CI/CD, automated testing, version control, monitoring) to ML workflows: automated model training, validation, deployment, A/B testing, and drift monitoring','Cloud GPU cost management for ML training jobs','Running ML models exclusively on Kubernetes EKS'], correctIndex:0, explanation:'MLOps extends DevOps: ML code in Git → CI triggers training → model evaluation gate → CD deploys to serving → monitoring detects drift → automated retraining.', difficulty:'Intermediate', tags:['MLOps','MachineLearning','DevOps','EKS','Project'] },
  { sessionNumber:56, moduleId:'m8', question:'What is model drift and why does it require monitoring in production ML systems?', options:['GPU temperature increase during long training runs','Degradation of model prediction accuracy over time as production data distribution changes from the training data distribution — requiring detection and triggering retraining','Corruption of model weight files on disk storage','Network latency increase in ML inference serving layer'], correctIndex:1, explanation:'Data drift: input feature distributions change (e.g., user demographics shift). Concept drift: relationship between features and labels changes (e.g., fraud patterns evolve). Both degrade model accuracy.', difficulty:'Advanced', tags:['MLOps','ModelDrift','Monitoring','ML','Production'] },

  // ── Session 57 ─────────────────────────────────────────
  { sessionNumber:57, moduleId:'m8', question:'What is AIOps (Artificial Intelligence for IT Operations)?', options:['Manually reviewing IT incident logs and dashboards','Using ML/AI to enhance and automate IT operations: anomaly detection in metrics, predictive alerting before failures, automated incident correlation, and intelligent self-remediation at scale','Running AI models exclusively on on-premises infrastructure','AI tools for IT procurement and vendor management'], correctIndex:1, explanation:'AIOps platforms analyse massive telemetry streams (metrics, logs, traces, events) to surface real signals, predict failures before they occur, and trigger auto-remediation.', difficulty:'Advanced', tags:['AIOps','MLOps','Automation','Monitoring','Project'] },
  { sessionNumber:57, moduleId:'m8', question:'What is an MCP (Model Context Protocol) server in the context of AI and DevOps?', options:['A Master Control Program for managing Jenkins agents','A protocol server that provides tools, resources, and context to AI agents — enabling them to interact with external systems (GitHub, databases, cloud APIs) in a standardised way','A monitoring server for collecting ML model metrics','A container orchestration protocol for Kubernetes pods'], correctIndex:1, explanation:'MCP servers expose tools (functions) and resources (data) that AI agents discover and use. Example: an MCP server for AWS lets an AI agent provision EC2, query CloudWatch, and manage S3.', difficulty:'Advanced', tags:['MCP','AI','Agents','Automation','Protocol','Project'] },

  // ── Session 58 ─────────────────────────────────────────
  { sessionNumber:58, moduleId:'m8', question:'What is the most important skill a graduating DevOps engineer should demonstrate in technical interviews?', options:['Memorising the most Linux commands without understanding context','Ability to explain the WHY behind tool choices, troubleshoot realistic scenarios end-to-end with reasoning, and walk through actual project implementations','Knowing the name of every DevOps tool superficially without using any in practice','Focusing exclusively on certification badges and exam scores'], correctIndex:1, explanation:'Interviewers test depth over breadth. "Why did you choose Terraform over Ansible for this?" + live debugging of a broken pipeline differentiates top candidates.', difficulty:'Intermediate', tags:['Career','Interview','DevOps','Graduation'] },
  { sessionNumber:58, moduleId:'m8', question:'What should a strong DevOps portfolio on GitHub demonstrate to potential employers?', options:['Only certification badge images and PDF certificates','Working project implementations: CI/CD pipelines with Jenkinsfile/GitHub Actions, Terraform IaC code, containerised apps with K8s manifests, monitoring dashboards, and clear READMEs','A large number of repositories regardless of their content or completeness','Social media followers and GitHub star counts'], correctIndex:1, explanation:'Tangible evidence beats resume claims. Employers want to see: "Show me your Jenkinsfile", "Walk me through this Terraform module", "How did you configure the Prometheus alert?"', difficulty:'Beginner', tags:['Career','Portfolio','DevOps','GitHub','Graduation'] },
  { sessionNumber:58, moduleId:'m8', question:'Which of these is a critical mistake DevOps engineers make when preparing for interviews?', options:['Practising real-world troubleshooting scenarios','Only studying theoretical concepts without hands-on practice — unable to explain how they actually SET UP and USED the tools they list on their resume','Building multiple end-to-end projects','Participating in mock interviews and getting feedback'], correctIndex:1, explanation:'The most common failure: listing "Kubernetes, Terraform, Jenkins" on resume but unable to explain a specific decision made or problem solved with each tool.', difficulty:'Intermediate', tags:['Career','Interview','Mistakes','DevOps','Graduation'] },
];

// ── Main ──────────────────────────────────────────────────
async function main() {
  const MONGO_URI = process.env.MONGODB_URI;
  if (!MONGO_URI) { console.error('❌ MONGODB_URI not set in .env'); process.exit(1); }

  console.log('🔗 Connecting to MongoDB...');
  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected to MongoDB\n');

  const BASE = 'https://github.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge';
  const RAW  = 'https://raw.githubusercontent.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge/main';

  // ── STEP 1: Build sessionsData.js ─────────────────────
  console.log('📂 Step 1: Processing all 59 sessions (using actual summary files)...');
  const sessionRecords = [];

  for (const s of ALL_SESSIONS) {
    const { sessionNumber, folder } = s;

    // List all files in the folder via GitHub API
    const allFiles = await listFolderFiles(folder);
    await sleep(200); // respect API rate limit

    // Filter to only actual summary files (skip README, Interview-QnA, Scenarios)
    const summaryFiles = allFiles.filter(f => f.name.endsWith('.md') && !isSupportFile(f.name));
    summaryFiles.sort((a, b) => rankSummaryFile(a.name) - rankSummaryFile(b.name));

    // Pick best summary file
    const summaryFile = summaryFiles[0] || null;
    let content = null;
    let usedFile = 'README.md'; // fallback label

    if (summaryFile) {
      content = await fetchRaw(summaryFile.download_url);
      usedFile = summaryFile.name;
      await sleep(150);
    }

    const title = extractTitle(content, folder);
    const preview = extractPreview(content, folder);
    const topics = extractTopics(content, folder);
    const labs = extractLabs(content, folder);
    const moduleId = getModuleId(sessionNumber);
    const moduleName = getModuleName(sessionNumber);

    // Build SessionFile records for ALL files in the folder
    const fileEntries = [];
    for (const f of allFiles) {
      const isSummary = summaryFile && f.name === summaryFile.name;
      const isDefault = isSummary; // the actual session note is the default
      const fileType = detectFileType(f.name);
      const encodedName = encodeURIComponent(f.name);
      const encodedFolder = encodeURIComponent(folder);

      fileEntries.push({
        sessionNumber,
        name: f.name,
        githubUrl: `${BASE}/blob/main/${encodedFolder}/${encodedName}`,
        rawUrl: f.download_url || `${RAW}/${encodedFolder}/${encodedName}`,
        fileType,
        description: isSummary
          ? `📝 Live session notes — ${title}`
          : f.name.includes('Interview') ? '❌ Skipped — demo file' // keep but mark
          : f.name === 'README.md' ? '📌 Session folder README'
          : `${f.name}`,
        isDefault,
      });
    }

    sessionRecords.push({
      id: sessionNumber + 1,
      sessionNumber,
      module: moduleName,
      moduleId,
      title,
      folder,
      summaryFile: usedFile,
      githubUrl: `${BASE}/tree/main/${encodeURIComponent(folder)}`,
      isFree: sessionNumber < 5,
      difficulty: getDifficulty(sessionNumber),
      duration: getDuration(sessionNumber),
      preview,
      topics,
      labs,
      _fileEntries: fileEntries,
    });

    process.stdout.write(`  ✓ S${String(sessionNumber).padStart(2,'0')} | file: ${usedFile.substring(0,55)} | ${title.substring(0,45)}\n`);
  }

  // Write sessionsData.js (strip _fileEntries before writing)
  const cleanRecords = sessionRecords.map(({ _fileEntries, summaryFile, ...rest }) => rest);
  const jsContent = `// CloudDevOpsHub — Auto-generated by autoSeedAll.js v2
// Source: actual live session note files (not README/Interview-QnA/Scenarios)
// DO NOT edit manually — run the script to regenerate

export const sessionsData = ${JSON.stringify(cleanRecords, null, 2)};
`;
  const sessionsDataPath = join(__dirname, '../data/sessionsData.js');
  fs.writeFileSync(sessionsDataPath, jsContent, 'utf8');
  console.log(`\n✅ sessionsData.js written — ${sessionRecords.length} sessions\n`);

  // ── STEP 2: Seed SessionFile records ──────────────────
  console.log('📁 Step 2: Seeding SessionFile records (all files from every session)...');
  await SessionFile.deleteMany({});

  const allFileEntries = sessionRecords.flatMap(s => s._fileEntries);
  if (allFileEntries.length > 0) {
    await SessionFile.insertMany(allFileEntries);
  }
  console.log(`✅ ${allFileEntries.length} SessionFile records inserted\n`);

  // ── STEP 3: Seed Quiz Questions ───────────────────────
  console.log('🧠 Step 3: Seeding quiz questions generated from actual session content...');
  await QuizQuestion.deleteMany({});
  await QuizQuestion.insertMany(ALL_QUIZ_QUESTIONS);
  console.log(`✅ ${ALL_QUIZ_QUESTIONS.length} quiz questions inserted\n`);

  // ── Summary ───────────────────────────────────────────
  const sessionCount = await SessionFile.distinct('sessionNumber');
  const quizCount = await QuizQuestion.countDocuments();
  const fileCount = await SessionFile.countDocuments();
  const sessionsWithQuiz = [...new Set(ALL_QUIZ_QUESTIONS.map(q => q.sessionNumber))].length;

  console.log('═══════════════════════════════════════');
  console.log('🎉 SEED COMPLETE!');
  console.log(`   Sessions populated:    ${sessionRecords.length}`);
  console.log(`   Session files in DB:   ${fileCount}`);
  console.log(`   Quiz questions in DB:  ${quizCount}`);
  console.log(`   Sessions with quizzes: ${sessionsWithQuiz}`);
  console.log('═══════════════════════════════════════');

  await mongoose.disconnect();
}

main().catch(err => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
