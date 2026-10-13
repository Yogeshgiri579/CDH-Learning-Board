// Comprehensive Quiz Bank for CloudDevOpsHub 55 Sessions & 8 Modules

export const moduleQuizzes = {
  m1: {
    id: 'm1',
    moduleId: 'm1',
    title: 'Module 1: DevOps Foundations & Kickoff Mastery Quiz',
    description: 'Test your understanding of CALMS principles, DevOps lifecycle, and cloud virtualization fundamentals.',
    questions: [
      {
        id: 'm1_q1',
        question: 'What does the CALMS framework in DevOps stand for?',
        options: [
          'Code, Automation, Logging, Monitoring, Scaling',
          'Culture, Automation, Lean, Measurement, Sharing',
          'Cloud, Agile, Linux, Microservices, Security',
          'Continuous, Automated, Local, Managed, Secure'
        ],
        correctIndex: 1,
        explanation: 'CALMS was coined by Jez Humble and John Willis to emphasize Culture, Automation, Lean, Measurement, and Sharing as the five foundational pillars of DevOps transformation.'
      },
      {
        id: 'm1_q2',
        question: 'What is the primary difference between Type 1 and Type 2 Hypervisors?',
        options: [
          'Type 1 runs directly on bare-metal hardware; Type 2 runs on top of a host operating system.',
          'Type 1 is only for Linux; Type 2 is only for Windows.',
          'Type 1 virtualizes software; Type 2 virtualizes containers.',
          'Type 1 requires no CPU virtualization extensions (VT-x).'
        ],
        correctIndex: 0,
        explanation: 'Type 1 hypervisors (like ESXi, KVM, Hyper-V) sit directly on physical hardware without a host OS layer, providing higher performance and lower latency.'
      },
      {
        id: 'm1_q3',
        question: 'Under the Cloud Shared Responsibility Model, which layer is ALWAYS the customer\'s responsibility in IaaS?',
        options: [
          'Physical data center security and power',
          'Virtualization hypervisor patch updates',
          'Customer data, OS security patching, and network firewall configuration',
          'Server hardware replacement'
        ],
        correctIndex: 2,
        explanation: 'In Infrastructure as a Service (IaaS), the cloud provider manages physical hardware and hypervisors, but the customer is responsible for guest OS updates, firewall rules (Security Groups), and all stored data.'
      },
      {
        id: 'm1_q4',
        question: 'What is the core principle of Trunk-Based Development in Continuous Integration?',
        options: [
          'Developers keep long-lived feature branches open for several months.',
          'Developers merge small, frequent updates into a single main branch (trunk) at least daily.',
          'Releases are only branched manually once every quarter.',
          'Developers bypass automated CI checks before committing.'
        ],
        correctIndex: 1,
        explanation: 'Trunk-Based Development encourages developers to merge frequent, small commits to the main branch daily to avoid high-friction merge conflicts and enable automated testing.'
      },
      {
        id: 'm1_q5',
        question: 'What is the key difference between Site Reliability Engineering (SRE) and traditional DevOps?',
        options: [
          'SRE eliminates all automation in favor of manual gatekeepers.',
          'SRE is an opinionated implementation of DevOps principles treating operations as a software engineering problem (e.g., using SLIs, SLOs, and Error Budgets).',
          'DevOps is only for startups while SRE is only for universities.',
          'SRE does not use monitoring or observability tools.'
        ],
        correctIndex: 1,
        explanation: 'As Google popularized: "class SRE implements DevOps". SRE uses software engineering methods, Service Level Objectives (SLOs), and Error Budgets to balance reliability and velocity.'
      }
    ]
  },
  m2: {
    id: 'm2',
    moduleId: 'm2',
    title: 'Module 2: Linux Administration & Shell Automation Quiz',
    description: 'Verify your proficiency with Bash scripting, permissions, systemd services, and Linux process management.',
    questions: [
      {
        id: 'm2_q1',
        question: 'Which octal permission represents read and execute for owner, read-only for group, and no permissions for others in Linux?',
        options: [
          'chmod 755',
          'chmod 540',
          'chmod 644',
          'chmod 700'
        ],
        correctIndex: 1,
        explanation: 'Read (4) + Execute (1) = 5 for owner; Read (4) for group; None (0) for others = 540.'
      },
      {
        id: 'm2_q2',
        question: 'Which command is used to reload systemd service definitions without rebooting?',
        options: [
          'systemctl restart all',
          'systemctl daemon-reload',
          'service --reload',
          'init 6'
        ],
        correctIndex: 1,
        explanation: '`systemctl daemon-reload` informs systemd to rescan unit file configuration files on disk whenever a service file in `/etc/systemd/system/` is modified.'
      },
      {
        id: 'm2_q3',
        question: 'In Bash, what does the exit status `$?` of `0` indicate?',
        options: [
          'Command failed with general error',
          'Command terminated with segmentation fault',
          'Command executed successfully',
          'Command is still running in the background'
        ],
        correctIndex: 2,
        explanation: 'In Unix/Linux standards, an exit code of 0 signifies success, while any non-zero exit code (1-255) represents an error.'
      },
      {
        id: 'm2_q4',
        question: 'Which tool and command combination monitors real-time CPU, memory, and top active processes with an interactive UI?',
        options: [
          'htop or top',
          'ls -la',
          'cat /proc/uptime',
          'df -h'
        ],
        correctIndex: 0,
        explanation: '`htop` and `top` provide dynamic real-time views of running processes, per-core CPU usage, and memory utilization.'
      },
      {
        id: 'm2_q5',
        question: 'How do you redirect standard error (stderr) to the same destination as standard output (stdout)?',
        options: [
          'command > output.log 2>&1',
          'command 2> output.log < 1',
          'command >> stderr stdout',
          'command | 2>1'
        ],
        correctIndex: 0,
        explanation: '`2>&1` redirects file descriptor 2 (stderr) to file descriptor 1 (stdout), combining both streams into the output destination.'
      }
    ]
  },
  m3: {
    id: 'm3',
    moduleId: 'm3',
    title: 'Module 3: Git & Version Control Workflows Quiz',
    description: 'Assess your Git skills: interactive rebase, merge conflicts, pull request conventions, and commit hygiene.',
    questions: [
      {
        id: 'm3_q1',
        question: 'What is the purpose of `git rebase -i HEAD~N`?',
        options: [
          'To completely erase the repository commit history',
          'To interactively squash, edit, reorder, or drop the last N commits before merging',
          'To revert unstaged changes in the working tree',
          'To create a new remote branch on GitHub'
        ],
        correctIndex: 1,
        explanation: 'Interactive rebase (`git rebase -i`) allows engineers to clean up local commit history by squashing experimental commits and rewriting commit messages before submitting a PR.'
      },
      {
        id: 'm3_q2',
        question: 'What does `git cherry-pick <commit-hash>` do?',
        options: [
          'Applies the changes introduced by an existing commit onto your current HEAD branch',
          'Picks random commits from remote to test CI pipelines',
          'Deletes the commit from git history forever',
          'Creates a brand new fork of the repository'
        ],
        correctIndex: 0,
        explanation: '`git cherry-pick` applies the exact diff from a specific commit on another branch to your currently checked-out branch.'
      },
      {
        id: 'm3_q3',
        question: 'Why is `git push --force-with-lease` preferred over standard `git push --force`?',
        options: [
          'It costs less bandwidth on GitHub servers',
          'It only overwrites the remote branch if nobody else has pushed commits since your last fetch, preventing accidental data loss',
          'It automatically resolves merge conflicts using AI',
          'It signs commits with GPG keys'
        ],
        correctIndex: 1,
        explanation: '`--force-with-lease` checks that your local tracking branch matches the remote state, ensuring you do not overwrite a teammate’s commits pushed while you were rebasing.'
      }
    ]
  },
  m4: {
    id: 'm4',
    moduleId: 'm4',
    title: 'Module 4: Multi-Cloud Architecture (AWS, GCP, Azure) Quiz',
    description: 'Test your cloud infrastructure knowledge across VPC networking, IAM security, object storage, and compute.',
    questions: [
      {
        id: 'm4_q1',
        question: 'In AWS VPC design, what distinguishes a Public Subnet from a Private Subnet?',
        options: [
          'A public subnet is encrypted, private subnet is unencrypted',
          'A public subnet has a route table directing 0.0.0.0/0 traffic to an Internet Gateway (IGW)',
          'A public subnet only supports Linux EC2 instances',
          'A private subnet cannot connect to the internet even through a NAT Gateway'
        ],
        correctIndex: 1,
        explanation: 'A subnet is considered public when its associated route table routes outbound internet traffic (0.0.0.0/0) directly to an Internet Gateway (IGW).'
      },
      {
        id: 'm4_q2',
        question: 'Which AWS IAM entity should be attached to an EC2 instance to grant it temporary permissions to access S3 buckets without hardcoded credentials?',
        options: [
          'IAM User with long-lived Access Keys in .bashrc',
          'IAM Role attached via Instance Profile',
          'Root account credentials in environment variables',
          'Security Group inbound rule on port 443'
        ],
        correctIndex: 1,
        explanation: 'IAM Roles attached via Instance Profiles supply automatic rotating temporary credentials to EC2 instances using the Instance Metadata Service (IMDS).'
      },
      {
        id: 'm4_q3',
        question: 'What are the cross-cloud equivalents of AWS S3 in Google Cloud and Microsoft Azure?',
        options: [
          'GCP Google Cloud Storage (GCS) and Azure Blob Storage',
          'GCP Cloud Bigtable and Azure Cosmos DB',
          'GCP Cloud SQL and Azure SQL Database',
          'GCP Filestore and Azure Files'
        ],
        correctIndex: 0,
        explanation: 'Object storage services designed for unstructured data are AWS S3, GCP Cloud Storage (GCS), and Azure Blob Storage.'
      }
    ]
  },
  m5: {
    id: 'm5',
    moduleId: 'm5',
    title: 'Module 5: Containers & Docker Mastery Quiz',
    description: 'Test your understanding of Dockerfiles, multi-stage builds, container networking, and image size optimization.',
    questions: [
      {
        id: 'm5_q1',
        question: 'What is the primary benefit of multi-stage Docker builds?',
        options: [
          'Allows building multiple images concurrently on different servers',
          'Separates compile-time build dependencies (compilers, SDKs) from the final slim production runtime image to minimize image size and attack surface',
          'Removes the need for Docker daemon',
          'Automatically runs integration tests inside GitHub'
        ],
        correctIndex: 1,
        explanation: 'Multi-stage builds allow developers to use intermediate stages for heavy compilation tools and only copy the compiled binary/artifact to a tiny final base image (e.g. alpine or distroless).'
      },
      {
        id: 'm5_q2',
        question: 'What is the difference between `CMD` and `ENTRYPOINT` in a Dockerfile?',
        options: [
          '`ENTRYPOINT` sets the executable process that runs by default, while `CMD` provides default arguments that can be easily overridden from the CLI',
          '`CMD` runs during image build time; `ENTRYPOINT` runs during container runtime',
          '`ENTRYPOINT` is only for Linux containers; `CMD` is for Windows containers',
          'There is no difference; they are exact aliases'
        ],
        correctIndex: 0,
        explanation: '`ENTRYPOINT` configures a container that will run as an executable. `CMD` provides default arguments to that executable which users can override with `docker run <image> <args>`.'
      },
      {
        id: 'm5_q3',
        question: 'Which Docker volume type persists data directly on the host file system and is managed entirely by Docker inside `/var/lib/docker/volumes/`?',
        options: [
          'Bind mount',
          'Named volume',
          'tmpfs mount',
          'OverlayFS layer'
        ],
        correctIndex: 1,
        explanation: 'Named volumes are created and managed by Docker under Docker\'s storage directory, making them more portable and safer than host bind mounts.'
      }
    ]
  },
  m6: {
    id: 'm6',
    moduleId: 'm6',
    title: 'Module 6: Kubernetes (K8s) Production Orchestration Quiz',
    description: 'Verify your knowledge of Pods, Deployments, Services (ClusterIP, NodePort, LoadBalancer), Ingress, and ConfigMaps.',
    questions: [
      {
        id: 'm6_q1',
        question: 'Why do production Kubernetes deployments use `Deployment` objects instead of managing bare `Pod` objects directly?',
        options: [
          'Pods cannot communicate with each other over the cluster network',
          'Deployments provide declarative updates, self-healing pod recreation, zero-downtime rolling updates, and rollback capabilities',
          'Deployments are required by Docker daemon',
          'Bare Pods can only run one container per node'
        ],
        correctIndex: 1,
        explanation: 'Deployments manage ReplicaSets, orchestrate automated rolling updates, monitor pod health, and recreate pods if a node fails or crashes.'
      },
      {
        id: 'm6_q2',
        question: 'Which Kubernetes Service type is best suited for internal microservice communication within the cluster only?',
        options: [
          'LoadBalancer',
          'NodePort',
          'ClusterIP',
          'ExternalName'
        ],
        correctIndex: 2,
        explanation: 'ClusterIP is the default service type that assigns an internal cluster-only virtual IP, keeping service traffic strictly within the private cluster network.'
      },
      {
        id: 'm6_q3',
        question: 'What is the function of a Kubernetes Ingress Controller?',
        options: [
          'Monitors node hardware temperatures',
          'Acts as an HTTP/HTTPS reverse proxy and load balancer routing external traffic to internal services based on hostnames and URL paths',
          'Stores cluster secrets in etcd database',
          'Compiles container images on worker nodes'
        ],
        correctIndex: 1,
        explanation: 'An Ingress Controller (like NGINX Ingress, Traefik, or AWS ALB Controller) inspects incoming Layer 7 HTTP requests and routes them to appropriate Kubernetes services based on domain rules and paths.'
      }
    ]
  },
  m7: {
    id: 'm7',
    moduleId: 'm7',
    title: 'Module 7: Infrastructure as Code (Terraform) & GitOps Quiz',
    description: 'Assess your skills with Terraform state locking, modules, plan/apply lifecycles, and ArgoCD declarative GitOps.',
    questions: [
      {
        id: 'm7_q1',
        question: 'Why is Terraform State Locking critical in multi-engineer teams?',
        options: [
          'To prevent concurrent Terraform operations from corrupting the state file simultaneously',
          'To encrypt state files with biometric keys',
          'To prevent git commits to the main branch',
          'To enforce licensing on cloud providers'
        ],
        correctIndex: 0,
        explanation: 'State locking (e.g. using AWS DynamoDB table with S3 remote backend) prevents two engineers or CI pipelines from running `terraform apply` at the same moment, which would cause state corruption.'
      },
      {
        id: 'm7_q2',
        question: 'What does `terraform plan` do?',
        options: [
          'Directly provisions infrastructure resources on the cloud provider',
          'Creates an execution plan comparing the desired configuration code with real-world state, showing what resources will be created, modified, or destroyed',
          'Deletes all existing resources',
          'Generates a billing estimate for the cloud account'
        ],
        correctIndex: 1,
        explanation: '`terraform plan` performs a dry run that inspects current cloud state, calculates diffs with declarative `.tf` code, and outputs the proposed changes for review.'
      },
      {
        id: 'm7_q3',
        question: 'In GitOps with ArgoCD, what is the Single Source of Truth for infrastructure and deployment state?',
        options: [
          'The Kubernetes API server memory',
          'The Git repository containing declarative manifests / Helm charts',
          'The CI build server logs',
          'The Docker Hub image tags'
        ],
        correctIndex: 1,
        explanation: 'In GitOps, the Git repository is the single source of truth. ArgoCD continuously reconciles differences between the Git repository state and the active live cluster state.'
      }
    ]
  },
  m8: {
    id: 'm8',
    moduleId: 'm8',
    title: 'Module 8: Observability, SRE & AI in DevOps Quiz',
    description: 'Test your knowledge on Prometheus metrics, Grafana alerting, log aggregation, and AI-driven incident resolution.',
    questions: [
      {
        id: 'm8_q1',
        question: 'What are the Three Pillars of Observability in modern distributed systems?',
        options: [
          'Metrics, Logs, and Traces',
          'Firewalls, Proxies, and Load Balancers',
          'Code, Tests, and Releases',
          'CPU, RAM, and Disk'
        ],
        correctIndex: 0,
        explanation: 'Metrics (aggregations over time), Logs (timestamped discrete event records), and Distributed Traces (request journeys across microservices) form the three pillars of observability.'
      },
      {
        id: 'm8_q2',
        question: 'How does Prometheus collect metrics from applications and microservices?',
        options: [
          'By scraping HTTP endpoints (pull model) serving metrics in Prometheus text format (e.g. /metrics)',
          'By constantly scanning local hard drives',
          'By reading kernel memory via dmesg',
          'Applications must push metrics via FTP'
        ],
        correctIndex: 0,
        explanation: 'Prometheus uses an active pull model, periodically scraping `/metrics` HTTP endpoints on targets configured via static definitions or Service Discovery.'
      },
      {
        id: 'm8_q3',
        question: 'How are Generative AI tools (AIOps) transforming DevOps root cause analysis (RCA)?',
        options: [
          'They replace all human engineers and eliminate code reviews',
          'They ingest disparate telemetry logs, error traces, and metrics anomalies to summarize incidents, suggest targeted remediation runbooks, and draft post-mortems',
          'They permanently disable cloud alerts to prevent alert fatigue',
          'They shut down all servers during traffic spikes'
        ],
        correctIndex: 1,
        explanation: 'AIOps leverages LLMs to correlate noisy alerts across distributed systems, identify root causes within seconds from log traces, and draft recommended remediation actions for on-call engineers.'
      }
    ]
  }
};

// Dedicated session quizzes for common sessions (0-5, etc.) + dynamic generator for all sessions
export const sessionQuizzes = {
  0: {
    sessionNumber: 0,
    title: 'Session 00: Program Kickoff & Setup Quick Quiz',
    questions: [
      {
        id: 's0_q1',
        question: 'What is the recommended approach for organizing your MultiCloud DevOps repository?',
        options: [
          'Fork the official repository, configure Git SSH keys, and commit session tasks in dedicated folders',
          'Clone everything onto Desktop without version control',
          'Download zip files and email them to colleagues',
          'Commit all code directly to the upstream master branch'
        ],
        correctIndex: 0,
        explanation: 'Forking the repository and creating structured commits with SSH keys ensures an immutable portfolio of your DevOps accomplishments on GitHub.'
      },
      {
        id: 's0_q2',
        question: 'Why is learning in public (e.g., documenting progress on LinkedIn / GitHub) encouraged in this challenge?',
        options: [
          'It is required by GitHub terms of service',
          'It establishes proof of work, builds professional visibility with hiring managers, and reinforces conceptual mastery',
          'It replaces the need to write unit tests',
          'It guarantees automatic cloud certifications'
        ],
        correctIndex: 1,
        explanation: 'Learning in public creates undeniable proof of work and builds authority with tech recruiters and engineering leaders looking for active practitioners.'
      },
      {
        id: 's0_q3',
        question: 'Which tool is essential for managing your local Git identity across commits?',
        options: [
          '`git config --global user.name` and `git config --global user.email`',
          '`git reset --hard`',
          '`rm -rf .git`',
          '`git push -f`'
        ],
        correctIndex: 0,
        explanation: 'Configuring user.name and user.email globally associates your commits with your verified GitHub profile for green contribution graph credit.'
      }
    ]
  },
  1: {
    sessionNumber: 1,
    title: 'Session 01: DevOps Introduction & Modern Architecture Quiz',
    questions: [
      {
        id: 's1_q1',
        question: 'What does "Shift-Left Security" (DevSecOps) mean in modern software engineering?',
        options: [
          'Moving servers physically to the west coast',
          'Integrating security scans, static code analysis, and vulnerability checks early in the development lifecycle rather than right before production',
          'Removing developer permissions on GitHub',
          'Postponing all security reviews until after customer complaints'
        ],
        correctIndex: 1,
        explanation: 'Shift-Left integrates automated security testing (SAST, DAST, secret scanning) into early pipeline stages, catching vulnerabilities when they are fastest and cheapest to fix.'
      },
      {
        id: 's1_q2',
        question: 'Which of the following is considered a key anti-pattern that DevOps seeks to eliminate?',
        options: [
          'Siloed teams ("Throwing code over the wall" from Dev to Ops)',
          'Automated regression testing',
          'Infrastructure monitoring',
          'Short deployment cycles'
        ],
        correctIndex: 0,
        explanation: 'DevOps directly dismantles the historical wall of confusion between developers writing features and operations teams responsible for stability.'
      },
      {
        id: 's1_q3',
        question: 'What metric from DORA (DevOps Research and Assessment) measures the time it takes for a commit to get into production?',
        options: [
          'Lead Time for Changes',
          'Mean Time to Failure',
          'CPU Utilization Percentage',
          'Lines of Code per Sprint'
        ],
        correctIndex: 0,
        explanation: 'Lead Time for Changes tracks the velocity of software delivery from code commit to successful production deployment.'
      }
    ]
  },
  2: {
    sessionNumber: 2,
    title: 'Session 02: Cloud Computing & Virtualization Quiz',
    questions: [
      {
        id: 's2_q1',
        question: 'Which cloud deployment model combines on-premises infrastructure with public cloud resources?',
        options: [
          'Hybrid Cloud',
          'Private Cloud only',
          'Community Cloud',
          'Edge compute only'
        ],
        correctIndex: 0,
        explanation: 'Hybrid Cloud architectures blend on-premises private data centers with public cloud infrastructure (AWS/GCP/Azure) connected via VPN or Direct Connect.'
      },
      {
        id: 's2_q2',
        question: 'What is an Availability Zone (AZ) in AWS, GCP, and Azure?',
        options: [
          'A single rack inside an office closet',
          'One or more discrete physical data centers with redundant power, networking, and cooling within a geographical Region',
          'A virtual network interface card',
          'A software library for load balancing'
        ],
        correctIndex: 1,
        explanation: 'Availability Zones are isolated physical data center clusters within a Region designed to prevent failures in one AZ from affecting another AZ.'
      },
      {
        id: 's2_q3',
        question: 'Which cloud service model offers Serverless event-driven computing where you only supply code without provisioning virtual machines?',
        options: [
          'FaaS (Function as a Service, e.g. AWS Lambda / Cloud Functions)',
          'IaaS (Infrastructure as a Service)',
          'BaaS (Backend hardware)',
          'Colocation'
        ],
        correctIndex: 0,
        explanation: 'FaaS / Serverless allows developers to execute code in response to events without running or managing server instances.'
      }
    ]
  },
  3: {
    sessionNumber: 3,
    title: 'Session 03: DevOps Principles & CI Best Practices Quiz',
    questions: [
      {
        id: 's3_q1',
        question: 'What is the primary objective of Continuous Integration (CI)?',
        options: [
          'Automate merging, building, and running automated test suites on code commits to detect bugs early',
          'Eliminate code repositories',
          'Manually approve each line of code in weekly meetings',
          'Replace developer laptops with cloud terminals'
        ],
        correctIndex: 0,
        explanation: 'CI automates code compilation and testing on every push, ensuring changes integrate cleanly and test failures are immediately flagged.'
      },
      {
        id: 's3_q2',
        question: 'According to Semantic Versioning (SemVer), given version `MAJOR.MINOR.PATCH` (e.g., `2.4.1`), when should the `MAJOR` version number be incremented?',
        options: [
          'When fixing a minor bug',
          'When adding backwards-compatible new features',
          'When making incompatible API breaking changes',
          'At the start of every calendar month'
        ],
        correctIndex: 2,
        explanation: 'MAJOR version is incremented for breaking API changes; MINOR for backwards-compatible features; PATCH for backwards-compatible bug fixes.'
      }
    ]
  },
  4: {
    sessionNumber: 4,
    title: 'Session 04: Git Fundamentals & Collaborative Workflows Quiz',
    questions: [
      {
        id: 's4_q1',
        question: 'What command stages all modified and newly created files in the current working directory?',
        options: [
          '`git add .`',
          '`git commit -m`',
          '`git checkout`',
          '`git status`'
        ],
        correctIndex: 0,
        explanation: '`git add .` adds all modified, new, and deleted files in the current path to the Git staging index.'
      },
      {
        id: 's4_q2',
        question: 'Which command creates and immediately switches to a new Git branch named `feature/auth`?',
        options: [
          '`git switch -c feature/auth` or `git checkout -b feature/auth`',
          '`git branch -d feature/auth`',
          '`git push feature/auth`',
          '`git merge feature/auth`'
        ],
        correctIndex: 0,
        explanation: '`git switch -c` (modern) or `git checkout -b` creates a new branch and points HEAD to it in a single command.'
      }
    ]
  }
};

// Helper function to get or dynamically synthesize quiz for ANY session number 0-54
export function getQuizForSession(session) {
  if (!session) return null;
  const num = session.sessionNumber;

  if (sessionQuizzes[num]) {
    return sessionQuizzes[num];
  }

  // Synthesize realistic topic-based questions from session metadata
  const topics = session.topics || ['DevOps Architecture', 'Pipeline Automation', 'Cloud Resources'];
  const topic1 = topics[0] || 'Core DevOps Workflow';
  const topic2 = topics[1] || 'Configuration Management';
  const lab = (session.labs && session.labs[0]) || 'Implement automated lab tasks and verify output';

  return {
    sessionNumber: num,
    title: `Session ${num.toString().padStart(2, '0')}: ${session.title}`,
    questions: [
      {
        id: `s${num}_q1`,
        question: `In "${session.title}", what is the primary focus regarding ${topic1}?`,
        options: [
          `Implementing structured best practices for ${topic1} to ensure high availability and reproducibility`,
          `Deprecating all automation scripts in favor of manual changes`,
          `Bypassing version control and deploying untested configurations`,
          `Storing plain-text secrets directly inside source code repositories`
        ],
        correctIndex: 0,
        explanation: `In production DevOps, mastering ${topic1} focuses on declarative automation, security hardening, and repeatable infrastructure patterns.`
      },
      {
        id: `s${num}_q2`,
        question: `When executing the hands-on lab: "${lab}", what is the recommended verification step?`,
        options: [
          'Assume the step succeeded without inspecting command exit status or logs',
          'Verify execution status, validate resource state via CLI/API, and test health endpoints',
          'Immediately reboot all nodes without capturing logs',
          'Delete the configuration files upon completion'
        ],
        correctIndex: 1,
        explanation: 'Best practice in cloud & DevOps labs requires validating the exact output, inspecting exit codes, and confirming health checks before marking tasks done.'
      },
      {
        id: `s${num}_q3`,
        question: `Regarding ${topic2}, which engineering principle is most critical for maintainable operations?`,
        options: [
          'Idempotency and declarative configuration as code',
          'Hardcoding IP addresses and credentials across scripts',
          'Running all production workloads as the root superuser',
          'Disabling all monitoring alerts to reduce noise'
        ],
        correctIndex: 0,
        explanation: 'Idempotency ensures that running an automation script multiple times produces the identical desired outcome without unwanted side effects.'
      }
    ]
  };
}

export function getQuizForModule(moduleId) {
  return moduleQuizzes[moduleId] || null;
}
