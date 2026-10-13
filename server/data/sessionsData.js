// CloudDevOpsHub 55 Sessions Data
// First 5 sessions (Session 0 - 4) are completely FREE
// Sessions 5 - 54 require user to Sign In

export const sessionsData = [
  // MODULE 1: Program Kickoff & DevOps Foundations (Sessions 0-4) -> ALL FREE
  {
    id: 1,
    sessionNumber: 0,
    module: "Phase 1: Program Kickoff & DevOps Foundations",
    moduleId: "m1",
    title: "Program Kickoff & MultiCloud DevOps Roadmap Overview",
    folder: "Session-00-Program-Kickoff",
    githubUrl: "https://github.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge/tree/main/Session-00-Program-Kickoff",
    isFree: true,
    difficulty: "Beginner",
    duration: "45 mins",
    preview: "Kickstart your MultiCloud, DevOps & AI journey. Learn how this 55-day program is structured, how to submit tasks, and access the CloudDevOpsHub community.",
    topics: [
      "Welcome & program guidelines by CloudDevOpsHub",
      "55-Day challenge roadmap & milestone timeline",
      "Setting up your learning workstation & Git repository",
      "Community support, peer reviews & mentor guidance"
    ],
    labs: [
      "Fork the MultiCloud-DevOps-AI-Challenge repo",
      "Configure your local Git profile and SSH keys",
      "Submit your initial introductory PR"
    ]
  },
  {
    id: 2,
    sessionNumber: 1,
    module: "Phase 1: Program Kickoff & DevOps Foundations",
    moduleId: "m1",
    title: "DevOps Introduction, Culture & Modern Architecture Overview",
    folder: "Session-01-DevOps-Introduction-Course-Overview",
    githubUrl: "https://github.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge/tree/main/Session-01-DevOps-Introduction-Course-Over...",
    isFree: true,
    difficulty: "Beginner",
    duration: "60 mins",
    preview: "Understand what DevOps truly is beyond the buzzword. Explore CALMS principles, shift-left security, and how modern engineering teams ship reliable software.",
    topics: [
      "Evolution of software delivery: Waterfall to Agile to DevOps",
      "CALMS framework: Culture, Automation, Lean, Measurement, Sharing",
      "DevOps Lifecycle: Plan, Code, Build, Test, Release, Deploy, Operate, Monitor",
      "Role of Site Reliability Engineering (SRE) vs DevOps"
    ],
    labs: [
      "Map out a standard enterprise CI/CD release workflow",
      "Identify common deployment bottlenecks and solutions"
    ]
  },
  {
    id: 3,
    sessionNumber: 2,
    module: "Phase 1: Program Kickoff & DevOps Foundations",
    moduleId: "m1",
    title: "Cloud Computing & Virtualization Fundamentals",
    folder: "Session 02 Cloud Computing Virtualization",
    githubUrl: "https://github.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge/tree/main/Session%2002%20Cloud%20Computing%20Virtualization",
    isFree: true,
    difficulty: "Beginner",
    duration: "55 mins",
    preview: "Demystify cloud fundamentals, hypervisors, type 1 vs type 2 virtualization, shared responsibility models, and cloud deployment types (Public, Private, Hybrid).",
    topics: [
      "Virtualization mechanics: Hypervisors, guest OS & bare metal",
      "Cloud service models: IaaS, PaaS, SaaS, FaaS comparison",
      "Shared Responsibility Model across cloud providers",
      "Regions, Availability Zones & Edge Locations architecture"
    ],
    labs: [
      "Compare AWS, GCP, and Azure core infrastructure terminology",
      "Calculate high-availability design for 99.99% uptime"
    ]
  },
  {
    id: 4,
    sessionNumber: 3,
    module: "Phase 1: Program Kickoff & DevOps Foundations",
    moduleId: "m1",
    title: "DevOps Principles & Continuous Integration Best Practices",
    folder: "Session-03-DevOps-Principles-Practices",
    githubUrl: "https://github.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge/tree/main/Session-03-DevOps-Principles-Practices",
    isFree: true,
    difficulty: "Beginner",
    duration: "50 mins",
    preview: "Dive deep into Continuous Integration (CI) best practices, automated testing, trunk-based development, semantic versioning, and build artifacts.",
    topics: [
      "Trunk-based development vs feature branching strategies",
      "Continuous Integration (CI) pipeline stages & feedback loops",
      "Automated unit, integration, and security test gates",
      "Semantic Versioning (SemVer) & artifact tagging strategy"
    ],
    labs: [
      "Design an enterprise release pipeline schema",
      "Document automated test gates criteria for production builds"
    ]
  },
  {
    id: 5,
    sessionNumber: 4,
    module: "Phase 1: Program Kickoff & DevOps Foundations",
    moduleId: "m1",
    title: "Foundation of AI & Prompt Engineering for DevOps Engineers",
    folder: "Session-04-Foundation-of-AI-Prompt-Engineering",
    githubUrl: "https://github.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge/tree/main/Session-04-Foundation-of-AI-Prompt-Engineer...",
    isFree: true,
    difficulty: "Beginner",
    duration: "65 mins",
    preview: "Harness modern LLMs and Prompt Engineering techniques to accelerate debugging, write Terraform & Dockerfiles 10x faster, and build AI-assisted operations.",
    topics: [
      "Understanding LLMs for DevOps & infrastructure automation",
      "Prompt engineering frameworks: Role, Context, Task, Constraints (RCTC)",
      "Using AI for Dockerfile optimization and regex generation",
      "AI safety, credential leakage prevention, and hallucination checks"
    ],
    labs: [
      "Generate clean production Dockerfile using prompt templates",
      "Debug a corrupted Kubernetes deployment manifest using AI prompts"
    ]
  },

  // MODULE 2: Linux Administration & Shell Scripting (Sessions 5-12) -> LOCKED (Requires Sign-In)
  {
    id: 6,
    sessionNumber: 5,
    module: "Phase 2: Linux Administration & Automation",
    moduleId: "m2",
    title: "Linux Overview, Distros & GCP / AWS VM Setup",
    folder: "Session-05-Linux-Overview-GCP-Setup",
    githubUrl: "https://github.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge/tree/main/Session-05-Linux-Overview-GCP-Setup",
    isFree: false,
    difficulty: "Beginner",
    duration: "60 mins",
    preview: "Set up your free tier Linux VM on GCP and AWS. Understand Debian vs RHEL distros, package managers (apt, yum), and essential initial server hardening.",
    topics: [
      "Linux distributions in production: Ubuntu/Debian vs RHEL/Rocky Linux",
      "Provisioning free-tier virtual machines on GCP Compute Engine & AWS EC2",
      "Package managers: apt, dpkg, yum, dnf comparison",
      "Essential terminal productivity: tmux, htop, curl, wget"
    ],
    labs: [
      "Provision an Ubuntu 24.04 instance on cloud provider",
      "Configure static IP, timezone, and update software packages"
    ]
  },
  {
    id: 7,
    sessionNumber: 6,
    module: "Phase 2: Linux Administration & Automation",
    moduleId: "m2",
    title: "Linux VM, User Administration & SSH Key Hardening",
    folder: "Session-06-Linux-VM-User-Administration",
    githubUrl: "https://github.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge/tree/main/Session-06-Linux-VM-User-Administration",
    isFree: false,
    difficulty: "Beginner",
    duration: "60 mins",
    preview: "Master multi-user management, sudoers configuration, ED25519 SSH key generation, and disabling password-based SSH root login for production servers.",
    topics: [
      "User & group management: useradd, usermod, groupadd, /etc/passwd",
      "Sudo privilege delegation via /etc/sudoers.d/",
      "Public key cryptography: generating ED25519 and RSA keys",
      "Hardening sshd_config: Port change, permit root login false, fail2ban"
    ],
    labs: [
      "Create deploy user with restricted passwordless sudo",
      "Set up SSH key pair authentication and disable root password login"
    ]
  },
  {
    id: 8,
    sessionNumber: 7,
    module: "Phase 2: Linux Administration & Automation",
    moduleId: "m2",
    title: "Linux System Administration & Filesystem Hierarchy",
    folder: "Session 07 Linux System Administration",
    githubUrl: "https://github.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge/tree/main/Session%2007%20Linux%20System%20Administration",
    isFree: false,
    difficulty: "Intermediate",
    duration: "65 mins",
    preview: "Explore the Linux Filesystem Hierarchy Standard (FHS), disk partition tools (fdisk, lsblk, df, du), and mount points for enterprise storage.",
    topics: [
      "Filesystem Hierarchy Standard: /bin, /etc, /var, /opt, /proc, /dev",
      "Disk storage inspection: df -h, du -sh, lsblk, fdisk, blkid",
      "Mounting block devices, /etc/fstab persistence and UUIDs",
      "Inodes, hard links vs soft symbolic links"
    ],
    labs: [
      "Attach and format an additional cloud volume with ext4",
      "Configure persistent mount entry in /etc/fstab"
    ]
  },
  {
    id: 9,
    sessionNumber: 8,
    module: "Phase 2: Linux Administration & Automation",
    moduleId: "m2",
    title: "Linux Permissions, Ownership, Sticky Bits & ACLs",
    folder: "Session-08-Linux-Permissions-Ownership-Security",
    githubUrl: "https://github.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge/tree/main/Session-08-Linux-Permissions-Ownership-Security",
    isFree: false,
    difficulty: "Intermediate",
    duration: "55 mins",
    preview: "Deep dive into chmod numeric/symbolic notation, chown, chgrp, SUID, SGID, sticky bit on directories, and fine-grained POSIX Access Control Lists (ACLs).",
    topics: [
      "Standard permissions: Read (4), Write (2), Execute (1)",
      "Special permissions: SUID, SGID, and Sticky Bit (1777)",
      "POSIX Access Control Lists: getfacl and setfacl commands",
      "Umask calculation and default permission security"
    ],
    labs: [
      "Create a shared collaborative directory with SGID and sticky bit",
      "Apply granular read-only ACL to an external audit user"
    ]
  },
  {
    id: 10,
    sessionNumber: 9,
    module: "Phase 2: Linux Administration & Automation",
    moduleId: "m2",
    title: "Process Management, Daemons & Custom Systemd Services",
    folder: "Session-09-Process-Management-Daemons-Systemd",
    githubUrl: "https://github.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge/tree/main/Session-09-Process-Management-Daemons-Systemd",
    isFree: false,
    difficulty: "Intermediate",
    duration: "70 mins",
    preview: "Learn process states (running, sleeping, zombie), kill signals (SIGTERM, SIGKILL), journalctl logs, and writing custom systemd service unit files.",
    topics: [
      "Process inspection: ps aux, top, htop, pstree, pkill",
      "Linux signals: SIGINT (2), SIGTERM (15), SIGKILL (9), SIGHUP (1)",
      "Systemd unit architecture: [Unit], [Service], [Install] sections",
      "Inspecting system logs with journalctl -u -f"
    ],
    labs: [
      "Write a custom systemd service for a Node.js / Python daemon",
      "Configure auto-restart on failure and boot-time enablement"
    ]
  },
  {
    id: 11,
    sessionNumber: 10,
    module: "Phase 2: Linux Administration & Automation",
    moduleId: "m2",
    title: "Bash Shell Scripting - Basics, Variables & Loops",
    folder: "Session-10-Bash-Scripting-Basics-Automation",
    githubUrl: "https://github.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge/tree/main/Session-10-Bash-Scripting-Basics-Automation",
    isFree: false,
    difficulty: "Intermediate",
    duration: "65 mins",
    preview: "Write clean, robust shell scripts. Understand shebang, positional arguments, exit codes ($?), conditional tests [[ ... ]], for and while loops.",
    topics: [
      "Script anatomy: Shebang (#!/usr/bin/env bash) and strict mode (set -euo pipefail)",
      "Environment vs local variables, command substitution $(command)",
      "Conditionals: if/else, test expressions, integer and string comparisons",
      "Iterating through files and server lists with loops"
    ],
    labs: [
      "Write a backup script that archives directories with timestamp",
      "Build a disk usage alerting script that warns if usage > 85%"
    ]
  },
  {
    id: 12,
    sessionNumber: 11,
    module: "Phase 2: Linux Administration & Automation",
    moduleId: "m2",
    title: "Advanced Bash Scripting - Functions, Error Traps & Cron",
    folder: "Session-11-Bash-Functions-Error-Handling-Cron",
    githubUrl: "https://github.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge/tree/main/Session-11-Bash-Functions-Error-Handling-Cron",
    isFree: false,
    difficulty: "Intermediate",
    duration: "70 mins",
    preview: "Take your scripts to enterprise level: custom functions, trapping errors with trap, logging to syslog, parsing flags with getopts, and cron automation.",
    topics: [
      "Modular scripting with reusable bash functions & return codes",
      "Signal handling and cleanup handlers using trap 'cleanup' EXIT",
      "CLI argument parsing using getopts",
      "Automating background schedules with cron and crontab syntax"
    ],
    labs: [
      "Create a CLI server health diagnostic tool with flags (-v, -h, -d)",
      "Schedule automated daily database dumps via crontab"
    ]
  },
  {
    id: 13,
    sessionNumber: 12,
    module: "Phase 2: Linux Administration & Automation",
    moduleId: "m2",
    title: "Networking Basics for DevOps - DNS, Subnets, Ports & Firewalls",
    folder: "Session-12-DevOps-Networking-DNS-Subnets-Ports",
    githubUrl: "https://github.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge/tree/main/Session-12-DevOps-Networking-DNS-Subnets-Ports",
    isFree: false,
    difficulty: "Intermediate",
    duration: "75 mins",
    preview: "Master the networking foundations required for cloud and Kubernetes: TCP/IP, CIDR notation, DNS resolution (A, CNAME), netstat, ss, and UFW/iptables.",
    topics: [
      "OSI & TCP/IP stack: Transport (TCP/UDP) vs Application (HTTP/gRPC)",
      "IPv4 CIDR calculations (/24, /16) and subnetting formulas",
      "DNS resolution flow: Root servers, TLD, Authoritative, dig, nslookup",
      "Host firewalls: UFW rules, iptables basics, and open port checks with ss -tulpn"
    ],
    labs: [
      "Diagnose network latency and DNS packet drops using mtr & dig",
      "Configure UFW firewall allowing only SSH, HTTP, and HTTPS ports"
    ]
  },

  // MODULE 3: Git, Version Control & CI/CD Pipelines (Sessions 13-18)
  {
    id: 14,
    sessionNumber: 13,
    module: "Phase 3: Git & Version Control Mastery",
    moduleId: "m3",
    title: "Git Fundamentals, Branching Strategies & GitFlow",
    folder: "Session-13-Git-Fundamentals-Branching-Flow",
    githubUrl: "https://github.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge/tree/main/Session-13-Git-Fundamentals-Branching-Flow",
    isFree: false,
    difficulty: "Beginner",
    duration: "55 mins",
    preview: "Demystify Git internals (blobs, trees, commits). Compare GitFlow, GitHub Flow, and Trunk-based development for cloud-native teams.",
    topics: [
      "Git three-tree architecture: Working Directory, Staging Index, Repository",
      "Branching models: Trunk-Based Development vs GitFlow",
      "Conventional Commits specification (feat, fix, chore, docs, refactor)",
      "Remote management: fetch vs pull, tracking upstream branches"
    ],
    labs: [
      "Set up branch naming conventions and enforce commit linters",
      "Create release candidate branch and simulate production tagging"
    ]
  },
  {
    id: 15,
    sessionNumber: 14,
    module: "Phase 3: Git & Version Control Mastery",
    moduleId: "m3",
    title: "Advanced Git: Rebase, Cherry-Pick, Stash & Conflict Resolution",
    folder: "Session-14-Advanced-Git-Rebase-CherryPick-Conflicts",
    githubUrl: "https://github.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge/tree/main/Session-14-Advanced-Git-Rebase-CherryPick-Conflicts",
    isFree: false,
    difficulty: "Intermediate",
    duration: "65 mins",
    preview: "Never panic during a merge conflict again. Master git rebase -i (squash, reword), git cherry-pick, git reflog disaster recovery, and git stash.",
    topics: [
      "Interactive rebase: squashing messy commits into clean history",
      "Cherry-picking specific bug fixes to hotfix branches",
      "Git reflog: recovering lost commits and deleted branches",
      "Resolving complex 3-way merge conflicts cleanly"
    ],
    labs: [
      "Simulate a merge conflict between two branches and resolve it",
      "Recover an accidentally deleted branch using git reflog"
    ]
  },
  {
    id: 16,
    sessionNumber: 15,
    module: "Phase 3: Git & Version Control Mastery",
    moduleId: "m3",
    title: "GitHub Features: Pull Requests, Branch Protection & Secrets",
    folder: "Session-15-GitHub-PR-Workflows-Secrets-Actions",
    githubUrl: "https://github.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge/tree/main/Session-15-GitHub-PR-Workflows-Secrets-Actions",
    isFree: false,
    difficulty: "Intermediate",
    duration: "60 mins",
    preview: "Configure enterprise GitHub settings: required reviewers, status checks, protected branches, repository environments, and encrypted secrets.",
    topics: [
      "Setting up PR templates and issue forms (.github/)",
      "Branch protection rules: require approvals, require linear history",
      "Managing GitHub Secrets, Environment Secrets & OIDC tokens",
      "CODEOWNERS file for automated code review assignments"
    ],
    labs: [
      "Create a production repository with branch protection rules",
      "Configure repository secrets and test access scopes"
    ]
  },
  {
    id: 17,
    sessionNumber: 16,
    module: "Phase 3: Git & Version Control Mastery",
    moduleId: "m3",
    title: "Building Continuous Integration Pipeline with GitHub Actions",
    folder: "Session-16-GitHub-Actions-CI-Pipeline",
    githubUrl: "https://github.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge/tree/main/Session-16-GitHub-Actions-CI-Pipeline",
    isFree: false,
    difficulty: "Intermediate",
    duration: "75 mins",
    preview: "Construct your first production-grade GitHub Actions workflow (.github/workflows/ci.yml). Triggers, runners, steps, caching dependencies, and artifacts.",
    topics: [
      "GitHub Actions workflow syntax: on, jobs, steps, runs-on",
      "Trigger events: push, pull_request, workflow_dispatch, schedule",
      "Caching npm/pip packages to speed up builds by 70%",
      "Uploading and downloading build test report artifacts"
    ],
    labs: [
      "Build a Node.js / React CI pipeline that runs linting, formatting, and unit tests",
      "Add status badge to repository README"
    ]
  },
  {
    id: 18,
    sessionNumber: 17,
    module: "Phase 3: Git & Version Control Mastery",
    moduleId: "m3",
    title: "Multi-Environment CI/CD Pipelines & Matrix Builds",
    folder: "Session-17-Multi-Stage-CI-CD-Matrix-Builds",
    githubUrl: "https://github.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge/tree/main/Session-17-Multi-Stage-CI-CD-Matrix-Builds",
    isFree: false,
    difficulty: "Advanced",
    duration: "70 mins",
    preview: "Scale pipelines with matrix testing (multiple Node/OS versions), sequential dependent jobs (needs: [lint, test]), and deployment approvals.",
    topics: [
      "Matrix strategies: testing across Ubuntu, macOS, Node 18, 20, 22",
      "Job dependency graphs and conditional execution (if: success())",
      "Deployment environments: staging vs production with manual gates",
      "Re-usable workflows with workflow_call"
    ],
    labs: [
      "Create a matrix workflow testing across 3 runtime versions",
      "Build a multi-stage pipeline: Build -> Test -> Stage -> Deploy"
    ]
  },
  {
    id: 19,
    sessionNumber: 18,
    module: "Phase 3: Git & Version Control Mastery",
    moduleId: "m3",
    title: "DevSecOps in Git: GPG Signed Commits & Secret Scanning",
    folder: "Session-18-Git-Security-Rules-Branch-Protection",
    githubUrl: "https://github.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge/tree/main/Session-18-Git-Security-Rules-Branch-Protection",
    isFree: false,
    difficulty: "Intermediate",
    duration: "60 mins",
    preview: "Protect your supply chain. Sign commits with GPG keys for verified badges, prevent credential leaks with pre-commit hooks, and enable Trivy / GitGuardian.",
    topics: [
      "Generating GPG keys and configuring git config --global user.signingkey",
      "Pre-commit hooks framework for automated formatting & secret detection",
      "Secret scanning tools: TruffleHog, GitGuardian, and Gitleaks",
      "Supply chain security: Dependabot and automated vulnerability PRs"
    ],
    labs: [
      "Configure GPG signing and verify commit green checkmark on GitHub",
      "Set up pre-commit hook that blocks accidental AWS key commits"
    ]
  },

  // MODULE 4: Multi-Cloud Foundations (AWS, GCP, Azure) (Sessions 19-28)
  {
    id: 20,
    sessionNumber: 19,
    module: "Phase 4: Multi-Cloud Engineering (AWS, GCP, Azure)",
    moduleId: "m4",
    title: "AWS Cloud Networking: VPC, Public/Private Subnets & NAT",
    folder: "Session-19-AWS-VPC-Subnets-NAT-Gateways",
    githubUrl: "https://github.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge/tree/main/Session-19-AWS-VPC-Subnets-NAT-Gateways",
    isFree: false,
    difficulty: "Intermediate",
    duration: "80 mins",
    preview: "Architect a production-ready AWS Virtual Private Cloud (VPC) from scratch: CIDR blocks, public/private subnets across AZs, Internet Gateway, and NAT Gateway.",
    topics: [
      "AWS Global Infrastructure: Regions, Availability Zones, Edge Locations",
      "VPC CIDR design: allocating /16 VPC and /24 subnets",
      "Internet Gateway (IGW) vs NAT Gateway vs NAT Instance",
      "Route Tables, Network ACLs (NACL) vs Security Groups"
    ],
    labs: [
      "Design and provision a multi-AZ VPC with 2 public & 2 private subnets",
      "Route outbound traffic from private subnet through NAT Gateway"
    ]
  },
  {
    id: 21,
    sessionNumber: 20,
    module: "Phase 4: Multi-Cloud Engineering (AWS, GCP, Azure)",
    moduleId: "m4",
    title: "AWS Compute: EC2, Auto Scaling Groups & Application Load Balancers",
    folder: "Session-20-AWS-EC2-AutoScaling-ALB-LoadBalancer",
    githubUrl: "https://github.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge/tree/main/Session-20-AWS-EC2-AutoScaling-ALB-LoadBalancer",
    isFree: false,
    difficulty: "Intermediate",
    duration: "80 mins",
    preview: "Deploy highly available compute: Launch Templates, User Data scripts, Target Groups, Application Load Balancers (ALB), and dynamic Auto Scaling Groups (ASG).",
    topics: [
      "EC2 instance types, spot vs on-demand vs reserved instances",
      "Launch Templates with automated user-data bootstrap script",
      "Application Load Balancer: path-based and host-based routing rules",
      "Auto Scaling policies: target tracking, step scaling, scale in/out metrics"
    ],
    labs: [
      "Deploy an ALB distributing traffic between multiple private EC2 instances",
      "Stress-test CPU to trigger automated horizontal scale-out"
    ]
  },
  {
    id: 22,
    sessionNumber: 21,
    module: "Phase 4: Multi-Cloud Engineering (AWS, GCP, Azure)",
    moduleId: "m4",
    title: "AWS Storage & Content Delivery: S3, CloudFront & IAM RBAC",
    folder: "Session-21-AWS-S3-CloudFront-IAM-RBAC",
    githubUrl: "https://github.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge/tree/main/Session-21-AWS-S3-CloudFront-IAM-RBAC",
    isFree: false,
    difficulty: "Intermediate",
    duration: "70 mins",
    preview: "Host static frontend applications on S3, configure CloudFront CDN for global caching and HTTPS, and secure IAM access using least-privilege policies.",
    topics: [
      "S3 storage classes: Standard, Infrequent Access, Glacier, Lifecycle Rules",
      "CloudFront CDN distributions, Origin Access Control (OAC), cache behaviors",
      "IAM principles: Users, Groups, Roles, Policies, STS AssumeRole",
      "Writing JSON IAM Policies with conditions and explicit denys"
    ],
    labs: [
      "Host a static React SPA on S3 behind CloudFront with custom error pages",
      "Create an IAM Role for EC2 instance with S3 read-only access"
    ]
  },
  {
    id: 23,
    sessionNumber: 22,
    module: "Phase 4: Multi-Cloud Engineering (AWS, GCP, Azure)",
    moduleId: "m4",
    title: "AWS Managed Databases: RDS PostgreSQL & DynamoDB NoSQL",
    folder: "Session-22-AWS-RDS-Postgres-DynamoDB-Databases",
    githubUrl: "https://github.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge/tree/main/Session-22-AWS-RDS-Postgres-DynamoDB-Databases",
    isFree: false,
    difficulty: "Intermediate",
    duration: "75 mins",
    preview: "Understand relational vs NoSQL in cloud: AWS RDS Multi-AZ failover, read replicas, automated backups, and DynamoDB serverless key-value tables.",
    topics: [
      "RDS PostgreSQL: Subnet groups, Multi-AZ high availability, Read Replicas",
      "Database parameter groups, storage auto-scaling, automated snapshots",
      "DynamoDB architecture: Partition keys, Sort keys, Global Secondary Indexes",
      "Database security: VPC security group isolation, KMS encryption at rest"
    ],
    labs: [
      "Provision private RDS PostgreSQL instance in private DB subnet",
      "Connect securely to RDS using an EC2 bastion host"
    ]
  },
  {
    id: 24,
    sessionNumber: 23,
    module: "Phase 4: Multi-Cloud Engineering (AWS, GCP, Azure)",
    moduleId: "m4",
    title: "Google Cloud Platform (GCP): VPC, Compute Engine & Cloud Storage",
    folder: "Session-23-GCP-VPC-Compute-Engine-Cloud-Storage",
    githubUrl: "https://github.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge/tree/main/Session-23-GCP-VPC-Compute-Engine-Cloud-Storage",
    isFree: false,
    difficulty: "Intermediate",
    duration: "70 mins",
    preview: "Compare GCP architecture to AWS. Work with Google Cloud Projects, global VPC networks, Compute Engine VMs, and Google Cloud Storage (GCS) buckets.",
    topics: [
      "GCP Hierarchy: Organization, Folders, Projects, and billing accounts",
      "Global VPC architecture in GCP vs regional VPCs in AWS",
      "Compute Engine: VM instances, preemptible/spot VMs, startup scripts",
      "Google Cloud Storage (GCS): buckets, access control, and gsutil CLI"
    ],
    labs: [
      "Create custom GCP VPC with subnets in us-central1 and asia-south1",
      "Deploy a Compute Engine instance and attach persistent disk via gcloud CLI"
    ]
  },
  {
    id: 25,
    sessionNumber: 24,
    module: "Phase 4: Multi-Cloud Engineering (AWS, GCP, Azure)",
    moduleId: "m4",
    title: "GCP Identity & Access Management (IAM) & Cloud SQL",
    folder: "Session-24-GCP-IAM-ServiceAccounts-Cloud-SQL",
    githubUrl: "https://github.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge/tree/main/Session-24-GCP-IAM-ServiceAccounts-Cloud-SQL",
    isFree: false,
    difficulty: "Intermediate",
    duration: "65 mins",
    preview: "Master GCP Service Accounts, IAM Predefined & Custom Roles, Cloud SQL managed databases, and Cloud SQL Auth Proxy for secure private connections.",
    topics: [
      "GCP IAM: Members, Roles (Primitive, Predefined, Custom), Policy bindings",
      "Service Accounts, JSON keys vs Workload Identity Federation",
      "Cloud SQL for PostgreSQL: private IP configuration, automated backups",
      "Connecting securely without public IP using Cloud SQL Auth Proxy"
    ],
    labs: [
      "Configure Service Account with least-privilege Cloud Storage Viewer role",
      "Connect an application to Cloud SQL via Cloud SQL Auth Proxy"
    ]
  },
  {
    id: 26,
    sessionNumber: 25,
    module: "Phase 4: Multi-Cloud Engineering (AWS, GCP, Azure)",
    moduleId: "m4",
    title: "Microsoft Azure Core Services: VNet, Virtual Machines & Blob Storage",
    folder: "Session-25-Azure-VNet-VMs-Blob-Storage",
    githubUrl: "https://github.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge/tree/main/Session-25-Azure-VNet-VMs-Blob-Storage",
    isFree: false,
    difficulty: "Intermediate",
    duration: "70 mins",
    preview: "Complete the Multi-Cloud trifecta with Azure: Resource Groups, Virtual Networks (VNets), Azure Virtual Machines, Network Security Groups, and Blob Storage.",
    topics: [
      "Azure management structure: Subscriptions & Resource Groups",
      "Azure VNet, Subnets, and Network Security Groups (NSG) priority rules",
      "Azure Virtual Machines: B-series burstable vs D-series general purpose",
      "Azure Storage Accounts: Blob containers, SAS tokens, lifecycle tiers"
    ],
    labs: [
      "Deploy an Azure Linux VM inside a custom VNet using Azure CLI (az)",
      "Upload static assets to Azure Blob storage with timed SAS token"
    ]
  },
  {
    id: 27,
    sessionNumber: 26,
    module: "Phase 4: Multi-Cloud Engineering (AWS, GCP, Azure)",
    moduleId: "m4",
    title: "Multi-Cloud Hybrid Architecture & Disaster Recovery",
    folder: "Session-26-MultiCloud-Hybrid-Architecture-DR",
    githubUrl: "https://github.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge/tree/main/Session-26-MultiCloud-Hybrid-Architecture-DR",
    isFree: false,
    difficulty: "Advanced",
    duration: "75 mins",
    preview: "Learn how modern global enterprises design across multiple clouds: Active-Passive, Active-Active, RPO & RTO metrics, Route 53 DNS failover, and data replication.",
    topics: [
      "Multi-cloud motivations: Vendor lock-in avoidance, compliance, low latency",
      "Disaster recovery strategies: Backup & Restore, Pilot Light, Warm Standby, Multi-Site",
      "Recovery Time Objective (RTO) vs Recovery Point Objective (RPO)",
      "Global DNS failover using AWS Route 53 health checks & GCP Cloud DNS"
    ],
    labs: [
      "Configure multi-region DNS failover for a web application",
      "Calculate RTO and RPO for simulated cloud region outage"
    ]
  },
  {
    id: 28,
    sessionNumber: 27,
    module: "Phase 4: Multi-Cloud Engineering (AWS, GCP, Azure)",
    moduleId: "m4",
    title: "Cloud Cost Optimization & FinOps Best Practices",
    folder: "Session-27-Cloud-FinOps-Cost-Optimization",
    githubUrl: "https://github.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge/tree/main/Session-27-Cloud-FinOps-Cost-Optimization",
    isFree: false,
    difficulty: "Intermediate",
    duration: "60 mins",
    preview: "Save thousands of dollars in cloud bills: AWS Cost Explorer, GCP Billing Budgets, unattached EBS volume detection, right-sizing instances, and savings plans.",
    topics: [
      "FinOps framework: Inform, Optimize, Operate phases",
      "Tagging strategy: CostCenter, Environment, Owner tags for attribution",
      "Identifying zombie resources: unattached EBS, unused EIPs, old snapshots",
      "Reserved Instances, Savings Plans, and Compute Spot instances pricing"
    ],
    labs: [
      "Create an AWS Cost Anomaly Detection alert sending Slack alerts",
      "Write a script that finds unattached EBS volumes across AWS regions"
    ]
  },
  {
    id: 29,
    sessionNumber: 28,
    module: "Phase 4: Multi-Cloud Engineering (AWS, GCP, Azure)",
    moduleId: "m4",
    title: "Cloud Security: WAF, Shield, Security Groups & Compliance",
    folder: "Session-28-Cloud-Security-WAF-Shield-Compliance",
    githubUrl: "https://github.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge/tree/main/Session-28-Cloud-Security-WAF-Shield-Compliance",
    isFree: false,
    difficulty: "Advanced",
    duration: "70 mins",
    preview: "Harden your cloud infrastructure: Web Application Firewall (WAF) rate limiting, DDoS protection with Shield, CIS benchmarks, and security compliance.",
    topics: [
      "AWS WAF rules: SQL injection, Cross-Site Scripting (XSS), rate-based IP blocking",
      "AWS Shield Standard vs Advanced for DDoS mitigation",
      "Security Groups stateful inspection vs NACL stateless rules",
      "CIS Benchmarks and AWS Security Hub automated compliance posture"
    ],
    labs: [
      "Attach AWS WAF rate-limiting rule to Application Load Balancer",
      "Perform a simulated layer 7 attack and observe WAF blocking traffic"
    ]
  },

  // MODULE 5: Containers & Docker Mastery (Sessions 29-36)
  {
    id: 30,
    sessionNumber: 29,
    module: "Phase 5: Containers & Docker Mastery",
    moduleId: "m5",
    title: "Containerization Concepts & Docker Architecture",
    folder: "Session-29-Docker-Architecture-Container-Basics",
    githubUrl: "https://github.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge/tree/main/Session-29-Docker-Architecture-Container-Basics",
    isFree: false,
    difficulty: "Beginner",
    duration: "60 mins",
    preview: "Understand containers under the hood: Linux namespaces, cgroups, UnionFS/Overlay2. Learn how Docker Engine, dockerd, and containerd interact.",
    topics: [
      "Containers vs Virtual Machines: kernel sharing and startup speed",
      "Linux namespaces (PID, NET, MNT, IPC, UTS) and cgroups resource limits",
      "Docker Engine architecture: CLI, REST API, dockerd, containerd, runc",
      "Core Docker CLI: docker run, ps, exec, logs, stop, rm, inspect"
    ],
    labs: [
      "Run your first Nginx container with port mapping (-p 8080:80)",
      "Inspect container namespaces and CPU limits with docker stats"
    ]
  },
  {
    id: 31,
    sessionNumber: 30,
    module: "Phase 5: Containers & Docker Mastery",
    moduleId: "m5",
    title: "Writing Optimized Multi-Stage Dockerfiles",
    folder: "Session-30-Optimized-MultiStage-Dockerfiles",
    githubUrl: "https://github.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge/tree/main/Session-30-Optimized-MultiStage-Dockerfiles",
    isFree: false,
    difficulty: "Intermediate",
    duration: "70 mins",
    preview: "Shrink image sizes from 1.2GB to 35MB. Master layer caching, non-root users, .dockerignore, distroless images, and multi-stage builds.",
    topics: [
      "Dockerfile instructions: FROM, WORKDIR, COPY, RUN, CMD vs ENTRYPOINT",
      "Optimizing Docker build cache: order of operations and package managers",
      "Multi-stage builds: separate build environment from lean runtime image",
      "Security: running as non-root user (USER node / 10001) and distroless base"
    ],
    labs: [
      "Refactor a heavy Node/Go application Dockerfile using multi-stage build",
      "Measure layer cache efficiency and audit final image size"
    ]
  },
  {
    id: 32,
    sessionNumber: 31,
    module: "Phase 5: Containers & Docker Mastery",
    moduleId: "m5",
    title: "Docker Networking: Bridge, Host & Custom Networks",
    folder: "Session-31-Docker-Networking-Bridge-Host-Overlay",
    githubUrl: "https://github.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge/tree/main/Session-31-Docker-Networking-Bridge-Host-Overlay",
    isFree: false,
    difficulty: "Intermediate",
    duration: "65 mins",
    preview: "Connect containers seamlessly: default bridge vs user-defined bridge, embedded DNS resolver, host network mode, and container-to-container communication.",
    topics: [
      "Docker network drivers: bridge, host, none, macvlan, overlay",
      "User-defined bridge networks & automatic DNS resolution by container name",
      "Port forwarding mechanics via iptables NAT rules",
      "Debugging network issues between containers using netshoot"
    ],
    labs: [
      "Create custom bridge network and connect web frontend to Redis cache",
      "Verify container name resolution without hardcoded IP addresses"
    ]
  },
  {
    id: 33,
    sessionNumber: 32,
    module: "Phase 5: Containers & Docker Mastery",
    moduleId: "m5",
    title: "Docker Storage: Named Volumes, Bind Mounts & Persistence",
    folder: "Session-32-Docker-Storage-Volumes-BindMounts",
    githubUrl: "https://github.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge/tree/main/Session-32-Docker-Storage-Volumes-BindMounts",
    isFree: false,
    difficulty: "Intermediate",
    duration: "60 mins",
    preview: "Prevent data loss: understand ephemeral container storage vs persistent named volumes (/var/lib/docker/volumes/) and developer bind mounts.",
    topics: [
      "Container storage layer (copy-on-write) vs persistent storage",
      "Docker Named Volumes: lifecycle, backups, and volume drivers",
      "Bind Mounts for local development hot-reloading",
      "Permissions issues with mounted host volumes and UID/GID mapping"
    ],
    labs: [
      "Deploy PostgreSQL in Docker with persistent named volume",
      "Destroy and recreate the container to prove zero data loss"
    ]
  },
  {
    id: 34,
    sessionNumber: 33,
    module: "Phase 5: Containers & Docker Mastery",
    moduleId: "m5",
    title: "Docker Compose: Multi-Container Microservices Orchestration",
    folder: "Session-33-Docker-Compose-Microservices-Stack",
    githubUrl: "https://github.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge/tree/main/Session-33-Docker-Compose-Microservices-Stack",
    isFree: false,
    difficulty: "Intermediate",
    duration: "75 mins",
    preview: "Orchestrate full-stack applications locally with a single command: docker compose up -d. Services, networks, volumes, depends_on, and environment files.",
    topics: [
      "docker-compose.yml specification: version, services, networks, volumes",
      "Managing service dependencies with depends_on and healthchecks",
      "Environment variable injection with .env files and variable substitution",
      "Compose profiles for dev, test, and production stacks"
    ],
    labs: [
      "Write docker-compose.yml for a 3-tier app (React + Node API + MongoDB)",
      "Implement container healthchecks and graceful restart policies"
    ]
  },
  {
    id: 35,
    sessionNumber: 34,
    module: "Phase 5: Containers & Docker Mastery",
    moduleId: "m5",
    title: "Container Security: Image Vulnerability Scanning with Trivy",
    folder: "Session-34-Container-Security-Scanning-Trivy",
    githubUrl: "https://github.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge/tree/main/Session-34-Container-Security-Scanning-Trivy",
    isFree: false,
    difficulty: "Intermediate",
    duration: "60 mins",
    preview: "Secure container images before they reach production. Scan for CVE vulnerabilities, misconfigurations, and leaked secrets using Trivy and Docker Scout.",
    topics: [
      "Common container vulnerabilities: outdated base images and root permissions",
      "Installing and running Trivy scanner on images and Dockerfiles",
      "Filtering CVE severity: CRITICAL, HIGH, MEDIUM",
      "Integrating Trivy scan gates into CI pipelines to fail insecure builds"
    ],
    labs: [
      "Scan a vulnerable legacy Docker image and generate a vulnerability report",
      "Remediate CRITICAL CVEs by upgrading base images and pinning dependencies"
    ]
  },
  {
    id: 36,
    sessionNumber: 35,
    module: "Phase 5: Containers & Docker Mastery",
    moduleId: "m5",
    title: "Container Registries: Docker Hub & Amazon ECR CI Integration",
    folder: "Session-35-Docker-Hub-AWS-ECR-CI-Integration",
    githubUrl: "https://github.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge/tree/main/Session-35-Docker-Hub-AWS-ECR-CI-Integration",
    isFree: false,
    difficulty: "Intermediate",
    duration: "65 mins",
    preview: "Push and pull container images like a pro. Set up private Amazon Elastic Container Registry (ECR), automated GitHub Actions build-and-push, and image tagging.",
    topics: [
      "Docker image tagging conventions: semantic versions, git SHA, latest",
      "Creating and configuring Amazon ECR private repository",
      "ECR authentication with aws ecr get-login-password",
      "Automating docker buildx multi-arch (amd64, arm64) push via GitHub Actions"
    ],
    labs: [
      "Build and push tagged container image to Amazon ECR via GitHub Actions",
      "Configure ECR lifecycle policy to automatically expire untagged images"
    ]
  },
  {
    id: 37,
    sessionNumber: 36,
    module: "Phase 5: Containers & Docker Mastery",
    moduleId: "m5",
    title: "Troubleshooting Docker in Production Environments",
    folder: "Session-36-Docker-Troubleshooting-Production-Debugging",
    githubUrl: "https://github.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge/tree/main/Session-36-Docker-Troubleshooting-Production-Debugging",
    isFree: false,
    difficulty: "Advanced",
    duration: "65 mins",
    preview: "Diagnose crashing containers: Out of Memory (OOMKilled), dangling volumes filling up disks, orphan containers, docker system prune, and inspecting core dumps.",
    topics: [
      "Diagnosing OOMKilled (Exit Code 137) and resource starvation",
      "Disk cleanup operations: docker system prune -a --volumes safely",
      "Docker daemon logs and debugging dockerd systemd service",
      "Real-time debugging of live running containers without stopping them"
    ],
    labs: [
      "Diagnose an artificially created memory leak container",
      "Perform a complete safe disk reclamation on a production Docker host"
    ]
  },

  // MODULE 6: Kubernetes (K8s) & Container Orchestration (Sessions 37-45)
  {
    id: 38,
    sessionNumber: 37,
    module: "Phase 6: Kubernetes & Container Orchestration",
    moduleId: "m6",
    title: "Kubernetes Architecture: Control Plane, Worker Nodes & Kubelet",
    folder: "Session-37-Kubernetes-Architecture-ControlPlane-WorkerNodes",
    githubUrl: "https://github.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge/tree/main/Session-37-Kubernetes-Architecture-ControlPlane-WorkerNodes",
    isFree: false,
    difficulty: "Intermediate",
    duration: "75 mins",
    preview: "Understand how Kubernetes coordinates distributed systems: kube-apiserver, etcd, kube-scheduler, kube-controller-manager, kubelet, and kube-proxy.",
    topics: [
      "Control Plane components: API Server, etcd, Scheduler, Controller Manager",
      "Worker Node components: Kubelet, Kube-Proxy, Container Runtime (CRI)",
      "Declarative state reconciliation loop and desired vs actual state",
      "Setting up Minikube / Kind for local Kubernetes development"
    ],
    labs: [
      "Spin up a local multi-node Kubernetes cluster with Kind",
      "Explore cluster components status using kubectl get componentstatuses"
    ]
  },
  {
    id: 39,
    sessionNumber: 38,
    module: "Phase 6: Kubernetes & Container Orchestration",
    moduleId: "m6",
    title: "Pods, Deployments & ReplicaSets Manifests",
    folder: "Session-38-K8s-Pods-Deployments-ReplicaSets",
    githubUrl: "https://github.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge/tree/main/Session-38-K8s-Pods-Deployments-ReplicaSets",
    isFree: false,
    difficulty: "Intermediate",
    duration: "70 mins",
    preview: "Write clean Kubernetes YAML manifests. Understand Pod lifecycle, ReplicaSets for self-healing, rolling updates, and rollback strategies.",
    topics: [
      "Pod structure: containers, initContainers, probes, and restartPolicy",
      "Deployment manifests: replicas, selector, matchLabels, and template",
      "Rolling update strategies: maxSurge and maxUnavailable settings",
      "Rollback deployments seamlessly with kubectl rollout undo"
    ],
    labs: [
      "Deploy a 3-replica web application deployment with rolling update",
      "Trigger a bad deployment and perform instant automated rollback"
    ]
  },
  {
    id: 40,
    sessionNumber: 39,
    module: "Phase 6: Kubernetes & Container Orchestration",
    moduleId: "m6",
    title: "Kubernetes Services: ClusterIP, NodePort & LoadBalancer",
    folder: "Session-39-K8s-Services-ClusterIP-NodePort-LoadBalancer",
    githubUrl: "https://github.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge/tree/main/Session-39-K8s-Services-ClusterIP-NodePort-LoadBalancer",
    isFree: false,
    difficulty: "Intermediate",
    duration: "70 mins",
    preview: "Route network traffic reliably to dynamic Pods: ClusterIP for internal service discovery, NodePort for edge exposure, and LoadBalancer for cloud cloud provider integration.",
    topics: [
      "Service discovery problem in ephemeral container environments",
      "ClusterIP: internal virtual IP and CoreDNS name resolution",
      "NodePort: static port allocation on every cluster node",
      "LoadBalancer service: cloud controller provision of external LB"
    ],
    labs: [
      "Create a ClusterIP service and test DNS resolution from a debug pod",
      "Expose the frontend service via LoadBalancer and verify external traffic"
    ]
  },
  {
    id: 41,
    sessionNumber: 40,
    module: "Phase 6: Kubernetes & Container Orchestration",
    moduleId: "m6",
    title: "Kubernetes Ingress Controller & Cert-Manager SSL/TLS",
    folder: "Session-40-K8s-Ingress-Controller-TLS-Certificates",
    githubUrl: "https://github.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge/tree/main/Session-40-K8s-Ingress-Controller-TLS-Certificates",
    isFree: false,
    difficulty: "Advanced",
    duration: "80 mins",
    preview: "Stop creating expensive individual LoadBalancers. Install NGINX Ingress Controller, host-based routing, path rewrites, and auto-renewing Let's Encrypt TLS certificates.",
    topics: [
      "Ingress vs LoadBalancer cost and architectural comparison",
      "Installing NGINX Ingress Controller on your cluster",
      "Configuring Ingress rules: host routing and path-based routing (/api)",
      "Cert-Manager: automated Let's Encrypt certificates and ClusterIssuer"
    ],
    labs: [
      "Deploy Ingress routing api.domain.com and app.domain.com to different pods",
      "Issue automated HTTPS SSL certificate via Let's Encrypt ClusterIssuer"
    ]
  },
  {
    id: 42,
    sessionNumber: 41,
    module: "Phase 6: Kubernetes & Container Orchestration",
    moduleId: "m6",
    title: "ConfigMaps, Secrets & Environment Variables Injection",
    folder: "Session-41-K8s-ConfigMaps-Secrets-Env-Injection",
    githubUrl: "https://github.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge/tree/main/Session-41-K8s-ConfigMaps-Secrets-Env-Injection",
    isFree: false,
    difficulty: "Intermediate",
    duration: "65 mins",
    preview: "Decouple configuration from container code. Mount ConfigMaps as files and env variables, manage base64 K8s Secrets, and integrate External Secrets Operator.",
    topics: [
      "ConfigMap creation from files, directories, and literals",
      "Injecting ConfigMap as environment variables (envFrom) and volume mounts",
      "Kubernetes Secret types (Opaque, dockerconfigjson, tls) and security caveats",
      "Live configuration reloading without restarting application pods"
    ],
    labs: [
      "Mount application config JSON file via ConfigMap volume",
      "Secure database password in Secret and inject into backend pod"
    ]
  },
  {
    id: 43,
    sessionNumber: 42,
    module: "Phase 6: Kubernetes & Container Orchestration",
    moduleId: "m6",
    title: "Kubernetes Storage: PersistentVolumes, PVCs & StorageClasses",
    folder: "Session-42-K8s-PersistentVolumes-PVC-StorageClasses",
    githubUrl: "https://github.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge/tree/main/Session-42-K8s-PersistentVolumes-PVC-StorageClasses",
    isFree: false,
    difficulty: "Advanced",
    duration: "75 mins",
    preview: "Master stateful workloads in Kubernetes: CSI plugins, PersistentVolume (PV), PersistentVolumeClaim (PVC), Dynamic Provisioning, and StatefulSets.",
    topics: [
      "Container Storage Interface (CSI) specification",
      "PV vs PVC abstraction: admin provisioning vs developer claims",
      "StorageClasses and dynamic volume provisioning (AWS EBS gp3, GCP pd-ssd)",
      "StatefulSets vs Deployments: stable network IDs and ordered updates"
    ],
    labs: [
      "Deploy MongoDB StatefulSet with dynamic PVC volume allocation",
      "Simulate pod eviction and verify volume reattachment on replacement node"
    ]
  },
  {
    id: 44,
    sessionNumber: 43,
    module: "Phase 6: Kubernetes & Container Orchestration",
    moduleId: "m6",
    title: "Helm 3 Package Manager: Charts, Values & Templates",
    folder: "Session-43-Helm-3-Charts-Templates-Releases",
    githubUrl: "https://github.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge/tree/main/Session-43-Helm-3-Charts-Templates-Releases",
    isFree: false,
    difficulty: "Intermediate",
    duration: "70 mins",
    preview: "Package and deploy Kubernetes applications efficiently with Helm 3: Chart.yaml, values.yaml, Go templating, dry-run linting, and release versioning.",
    topics: [
      "Why Helm: templating vs copying repetitive YAML files",
      "Helm chart structure: templates/, values.yaml, Chart.yaml",
      "Helm Go templating: {{ .Values.image.tag }}, if/else, range loops",
      "Managing releases: helm install, upgrade, rollback, uninstall"
    ],
    labs: [
      "Package your microservice into a custom reusable Helm chart",
      "Deploy custom chart with different values files for dev and prod"
    ]
  },
  {
    id: 45,
    sessionNumber: 44,
    module: "Phase 6: Kubernetes & Container Orchestration",
    moduleId: "m6",
    title: "Managed Kubernetes: AWS EKS Cluster Provisioning",
    folder: "Session-44-Managed-Kubernetes-AWS-EKS-Setup",
    githubUrl: "https://github.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge/tree/main/Session-44-Managed-Kubernetes-AWS-EKS-Setup",
    isFree: false,
    difficulty: "Advanced",
    duration: "85 mins",
    preview: "Provision production-grade AWS Elastic Kubernetes Service (EKS): eksctl, IAM OIDC provider, managed node groups, AWS Load Balancer Controller, and VPC CNI.",
    topics: [
      "AWS EKS control plane pricing, architecture, and high availability",
      "Creating cluster with eksctl config file with managed node groups",
      "Configuring IAM Roles for Service Accounts (IRSA) with OIDC provider",
      "Installing AWS Load Balancer Controller for automated ALB creation"
    ],
    labs: [
      "Provision a 2-node AWS EKS cluster with eksctl",
      "Configure IRSA allowing a pod to read from AWS S3 without access keys"
    ]
  },
  {
    id: 46,
    sessionNumber: 45,
    module: "Phase 6: Kubernetes & Container Orchestration",
    moduleId: "m6",
    title: "Managed Kubernetes: Google Kubernetes Engine (GKE) Setup",
    folder: "Session-45-Managed-Kubernetes-GCP-GKE-Setup",
    githubUrl: "https://github.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge/tree/main/Session-45-Managed-Kubernetes-GCP-GKE-Setup",
    isFree: false,
    difficulty: "Advanced",
    duration: "80 mins",
    preview: "Deploy and manage GKE: Standard vs Autopilot clusters, Workload Identity, Cloud Logging integration, and automated node pool autoscaling.",
    topics: [
      "GKE Standard vs GKE Autopilot mode comparison",
      "Node autoprovisioning, cluster autoscaler, and horizontal pod autoscaler (HPA)",
      "GCP Workload Identity configuration for secure GCP API access",
      "Deploying applications to GKE using gcloud container clusters get-credentials"
    ],
    labs: [
      "Provision GKE cluster with cluster autoscaler enabled",
      "Deploy a microservice and trigger node pool auto-scale under load"
    ]
  },

  // MODULE 7: Infrastructure as Code (IaC) & GitOps (Sessions 46-50)
  {
    id: 47,
    sessionNumber: 46,
    module: "Phase 7: Infrastructure as Code (IaC) & GitOps",
    moduleId: "m7",
    title: "Terraform Fundamentals: HCL, Providers, Resources & State",
    folder: "Session-46-Terraform-IaC-HCL-State-Providers",
    githubUrl: "https://github.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge/tree/main/Session-46-Terraform-IaC-HCL-State-Providers",
    isFree: false,
    difficulty: "Intermediate",
    duration: "75 mins",
    preview: "Never click in the cloud console again. Learn HashiCorp Configuration Language (HCL), provider blocks, resource creation, terraform plan, and terraform apply.",
    topics: [
      "Declarative IaC principles vs imperative bash scripts",
      "Terraform CLI workflow: init, plan, apply, destroy, validate, fmt",
      "Understanding terraform.tfstate and state file drift detection",
      "Input variables, local values, output variables, and data sources"
    ],
    labs: [
      "Write Terraform code to provision an AWS VPC with subnets and security groups",
      "Inspect generated state file and execute terraform plan to verify zero changes"
    ]
  },
  {
    id: 48,
    sessionNumber: 47,
    module: "Phase 7: Infrastructure as Code (IaC) & GitOps",
    moduleId: "m7",
    title: "Terraform Remote State with AWS S3 & DynamoDB Locking",
    folder: "Session-47-Terraform-Remote-State-S3-DynamoDB",
    githubUrl: "https://github.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge/tree/main/Session-47-Terraform-Remote-State-S3-DynamoDB",
    isFree: false,
    difficulty: "Advanced",
    duration: "70 mins",
    preview: "Collaborate safely in teams. Store terraform state remotely in an encrypted S3 bucket with versioning and DynamoDB state locking to prevent race conditions.",
    topics: [
      "Risks of committing terraform.tfstate to Git repositories",
      "Configuring backend 's3' with encryption at rest and bucket versioning",
      "Distributed state locking using DynamoDB LockID table",
      "State migration from local to remote backend safely"
    ],
    labs: [
      "Provision backend S3 and DynamoDB resources with Terraform",
      "Migrate local state to remote backend and verify lock acquisition during apply"
    ]
  },
  {
    id: 49,
    sessionNumber: 48,
    module: "Phase 7: Infrastructure as Code (IaC) & GitOps",
    moduleId: "m7",
    title: "Reusable Terraform Modules & Multi-Environment Workspaces",
    folder: "Session-48-Terraform-Modules-Workspaces-DRY",
    githubUrl: "https://github.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge/tree/main/Session-48-Terraform-Modules-Workspaces-DRY",
    isFree: false,
    difficulty: "Advanced",
    duration: "80 mins",
    preview: "Write DRY (Don't Repeat Yourself) infrastructure. Build reusable custom Terraform modules with versioning, and structure dev, staging, and prod environments.",
    topics: [
      "Module design: root module, child modules, inputs, and outputs",
      "Terragrunt vs Terraform directory structures vs Terraform workspaces",
      "Publishing and sourcing modules from Git tags and private registries",
      "Terraform best practices: strict provider pinning and documentation with terraform-docs"
    ],
    labs: [
      "Build a reusable EC2 Webserver module with customizable inputs",
      "Deploy development and production environments using the same module"
    ]
  },
  {
    id: 50,
    sessionNumber: 49,
    module: "Phase 7: Infrastructure as Code (IaC) & GitOps",
    moduleId: "m7",
    title: "Configuration Management with Ansible Playbooks & Roles",
    folder: "Session-49-Ansible-Playbooks-Roles-Inventory",
    githubUrl: "https://github.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge/tree/main/Session-49-Ansible-Playbooks-Roles-Inventory",
    isFree: false,
    difficulty: "Intermediate",
    duration: "75 mins",
    preview: "Automate server configuration without agents. Learn Ansible architecture over SSH, inventory files, ad-hoc commands, YAML playbooks, and reusable roles.",
    topics: [
      "Ansible agentless architecture: SSH communication and Python interpreter",
      "Static vs Dynamic inventory files (AWS EC2 inventory plugin)",
      "Writing idempotent playbooks: apt, yum, copy, template, service, lineinfile",
      "Organizing production code with Ansible Galaxy and reusable Roles"
    ],
    labs: [
      "Write a playbook to install, configure, and secure Nginx on remote servers",
      "Execute playbook with check mode (--check) to audit changes before applying"
    ]
  },
  {
    id: 51,
    sessionNumber: 50,
    module: "Phase 7: Infrastructure as Code (IaC) & GitOps",
    moduleId: "m7",
    title: "GitOps with ArgoCD for Automated Kubernetes Deployments",
    folder: "Session-50-GitOps-with-ArgoCD-Kube-Deployment",
    githubUrl: "https://github.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge/tree/main/Session-50-GitOps-with-ArgoCD-Kube-Deployment",
    isFree: false,
    difficulty: "Advanced",
    duration: "85 mins",
    preview: "Turn your Git repository into the single source of truth for Kubernetes. Install ArgoCD, configure Application CRD, auto-sync, and automated self-healing.",
    topics: [
      "GitOps principles: Declarative state, version controlled, automated pull",
      "ArgoCD architecture: API Server, Repository Server, Application Controller",
      "Configuring ArgoCD Applications with automated sync & self-healing",
      "Managing secrets in GitOps using Sealed Secrets and HashiCorp Vault"
    ],
    labs: [
      "Install ArgoCD in Kubernetes and connect your Git repository",
      "Commit a manifest change to Git and watch ArgoCD auto-sync within seconds"
    ]
  },

  // MODULE 8: Observability, SRE & AI in DevOps (Sessions 51-54)
  {
    id: 52,
    sessionNumber: 51,
    module: "Phase 8: Observability, SRE & AI in DevOps",
    moduleId: "m8",
    title: "Prometheus Monitoring: Architecture & Metrics Collection",
    folder: "Session-51-Monitoring-Prometheus-Architecture-Metrics",
    githubUrl: "https://github.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge/tree/main/Session-51-Monitoring-Prometheus-Architecture-Metrics",
    isFree: false,
    difficulty: "Intermediate",
    duration: "75 mins",
    preview: "Understand modern observability metrics: Counter, Gauge, Histogram, Summary. Learn Prometheus pull architecture, service discovery, and PromQL queries.",
    topics: [
      "Three pillars of observability: Metrics, Logs, Traces",
      "Prometheus server components: TSDB, Retrieval, HTTP Server, AlertManager",
      "Scraping metrics: node_exporter, application instrumentation, scrape_configs",
      "PromQL fundamentals: rate(), increase(), sum by(), histogram_quantile()"
    ],
    labs: [
      "Deploy Prometheus and node_exporter to monitor host CPU, memory, and disk",
      "Write PromQL queries calculating 95th percentile request latency"
    ]
  },
  {
    id: 53,
    sessionNumber: 52,
    module: "Phase 8: Observability, SRE & AI in DevOps",
    moduleId: "m8",
    title: "Grafana Dashboards & AlertManager Alert Routing",
    folder: "Session-52-Visualization-Grafana-Dashboards-Alerts",
    githubUrl: "https://github.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge/tree/main/Session-52-Visualization-Grafana-Dashboards-Alerts",
    isFree: false,
    difficulty: "Intermediate",
    duration: "70 mins",
    preview: "Turn raw metrics into stunning actionable dashboards. Connect Prometheus data sources in Grafana, create alerting rules, and route incident alerts to Slack/Discord.",
    topics: [
      "Grafana architecture: Data sources, Dashboards, Panels, Variables",
      "Importing community dashboards (Node Exporter Full, Kubernetes Cluster)",
      "AlertManager configuration: routing trees, grouping, inhibit rules, receivers",
      "Integrating webhook alert notifications with Slack, Discord, and PagerDuty"
    ],
    labs: [
      "Build an executive DevOps dashboard displaying application SLOs",
      "Trigger high memory usage alert and receive automated notification in Slack"
    ]
  },
  {
    id: 54,
    sessionNumber: 53,
    module: "Phase 8: Observability, SRE & AI in DevOps",
    moduleId: "m8",
    title: "Centralized Logging with Grafana Loki & Promtail Stack",
    folder: "Session-53-Logging-Loki-Promtail-Grafana-Stack",
    githubUrl: "https://github.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge/tree/main/Session-53-Logging-Loki-Promtail-Grafana-Stack",
    isFree: false,
    difficulty: "Advanced",
    duration: "75 mins",
    preview: "Like Prometheus, but for logs. Understand why Loki is 10x cheaper than Elasticsearch. Deploy Promtail log collectors and query logs with LogQL.",
    topics: [
      "Log aggregation challenges in microservices and Kubernetes pods",
      "Grafana Loki architecture: indexing metadata labels, not text contents",
      "Deploying Promtail daemonset to ingest container stdout/stderr logs",
      "LogQL syntax: stream selectors, line filters |= 'error', and log-to-metrics"
    ],
    labs: [
      "Deploy Loki & Promtail in Kubernetes cluster to ingest all pod logs",
      "Construct LogQL dashboard showing real-time HTTP 500 error spikes"
    ]
  },
  {
    id: 55,
    sessionNumber: 54,
    module: "Phase 8: Observability, SRE & AI in DevOps",
    moduleId: "m8",
    title: "AI in DevOps: LLM-Assisted Root Cause Analysis (RCA) & Copilots",
    folder: "Session-54-AI-DevOps-LLM-RCA-Copilot-Automation",
    githubUrl: "https://github.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge/tree/main/Session-54-AI-DevOps-LLM-RCA-Copilot-Automation",
    isFree: false,
    difficulty: "Advanced",
    duration: "80 mins",
    preview: "Cap off the 55-day journey: Build an automated incident response workflow with AI. Use LLMs to analyze Prometheus alerts, parse Loki logs, and recommend exact fixes.",
    topics: [
      "The future of SRE: AI-assisted operations (AIOps) and Copilots",
      "Building automated triage pipelines: Alert -> Log Extraction -> LLM Analysis",
      "Generating automated post-mortem reports and incident timelines",
      "Graduation Capstone: MultiCloud DevOps & AI Portfolio Showcase"
    ],
    labs: [
      "Build a webhook script sending incident logs to LLM for automated RCA",
      "Complete your MultiCloud DevOps & AI Capstone and earn your certificate"
    ]
  }
];
