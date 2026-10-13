import mongoose from 'mongoose';

const quizQuestionSchema = new mongoose.Schema(
  {
    sessionNumber: {
      type: Number,
      default: null,
      index: true,
    },
    moduleId: {
      type: String,
      default: 'm1',
      index: true,
    },
    question: {
      type: String,
      required: true,
      trim: true,
    },
    options: {
      type: [String],
      required: true,
      validate: [(val) => val.length >= 2, 'Quiz question must have at least 2 options'],
    },
    correctIndex: {
      type: Number,
      required: true,
      min: 0,
    },
    explanation: {
      type: String,
      default: '',
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Intermediate',
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const QuizQuestion = mongoose.model('QuizQuestion', quizQuestionSchema);

// Initial curated questions pool for in-memory and seeding
export const defaultQuizQuestions = [
  {
    _id: 'q_s0_1',
    sessionNumber: 0,
    moduleId: 'm1',
    question: 'What is the primary objective of the 55-Day MultiCloud DevOps Challenge?',
    options: [
      'Master only local Bash scripts without cloud integration',
      'Gain hands-on end-to-end expertise across AWS, Azure, GCP, CI/CD, IaC, and AI-assisted DevOps workflows',
      'Memorize multiple choice certification answers only',
      'Build monolithic PHP desktop applications'
    ],
    correctIndex: 1,
    explanation: 'The challenge is designed for hands-on, multi-cloud and production-grade DevOps engineering combining AWS, Azure, GCP, Terraform, Kubernetes, and AI tooling.',
    difficulty: 'Beginner',
    tags: ['Kickoff', 'Roadmap', 'Foundations'],
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'q_s0_2',
    sessionNumber: 0,
    moduleId: 'm1',
    question: 'Which branch is used for standard challenge submissions and pull requests?',
    options: [
      'master (deprecated)',
      'main branch of your forked repository',
      'gh-pages',
      'test-prod'
    ],
    correctIndex: 1,
    explanation: 'Forking the repository and pushing daily session tasks to your main/feature branches before opening PRs is the official workflow.',
    difficulty: 'Beginner',
    tags: ['Git', 'Forking'],
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'q_s1_1',
    sessionNumber: 1,
    moduleId: 'm1',
    question: 'What does the CALMS framework in DevOps stand for?',
    options: [
      'Code, Automation, Logging, Monitoring, Scaling',
      'Culture, Automation, Lean, Measurement, Sharing',
      'Cloud, Agile, Linux, Microservices, Security',
      'Continuous, Automated, Local, Managed, Secure'
    ],
    correctIndex: 1,
    explanation: 'CALMS was coined by Jez Humble and John Willis to emphasize Culture, Automation, Lean, Measurement, and Sharing as the 5 foundational pillars.',
    difficulty: 'Beginner',
    tags: ['DevOps', 'CALMS', 'Culture'],
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'q_s1_2',
    sessionNumber: 1,
    moduleId: 'm1',
    question: 'What is the primary difference between SRE (Site Reliability Engineering) and traditional DevOps?',
    options: [
      'SRE eliminates automation in favor of manual checks',
      'SRE is an opinionated implementation of DevOps principles treating operations as a software engineering problem (SLIs, SLOs, Error Budgets)',
      'DevOps is only for startups while SRE is only for university research',
      'SRE does not use monitoring tools'
    ],
    correctIndex: 1,
    explanation: 'Class SRE implements DevOps: SRE applies software engineering principles to operations and uses Error Budgets to balance feature release speed with uptime.',
    difficulty: 'Intermediate',
    tags: ['SRE', 'DevOps'],
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'q_s2_1',
    sessionNumber: 2,
    moduleId: 'm1',
    question: 'What is the primary difference between Type 1 and Type 2 Hypervisors?',
    options: [
      'Type 1 runs directly on bare-metal hardware; Type 2 runs on top of a host operating system.',
      'Type 1 is only for Linux; Type 2 is only for Windows.',
      'Type 1 virtualizes software; Type 2 virtualizes containers.',
      'Type 1 requires no CPU virtualization extensions.'
    ],
    correctIndex: 0,
    explanation: 'Type 1 hypervisors (ESXi, KVM, Hyper-V) run bare-metal without an intermediate operating system, yielding maximum I/O throughput and lower latency.',
    difficulty: 'Intermediate',
    tags: ['Virtualization', 'Hypervisors'],
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'q_s2_2',
    sessionNumber: 2,
    moduleId: 'm1',
    question: 'Under the Cloud Shared Responsibility Model for IaaS, which layer is ALWAYS the customer\'s responsibility?',
    options: [
      'Physical data center cooling and security',
      'Virtualization hypervisor patch updates',
      'Customer data, OS security patching, and network firewall configuration',
      'Server rack power cabling'
    ],
    correctIndex: 2,
    explanation: 'In IaaS, the cloud provider manages physical hardware, facilities, and the hypervisor, while the customer is responsible for guest OS patching, data, IAM, and security groups.',
    difficulty: 'Beginner',
    tags: ['Cloud', 'Security', 'Shared Responsibility'],
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'q_s3_1',
    sessionNumber: 3,
    moduleId: 'm1',
    question: 'What is Trunk-Based Development in Continuous Integration?',
    options: [
      'Developers keep feature branches open for 3-6 months without updating',
      'Developers merge small, frequent updates into a single main branch (trunk) at least once daily',
      'Releases are only branched manually once every quarter',
      'Developers bypass automated CI checks before committing'
    ],
    correctIndex: 1,
    explanation: 'Trunk-Based Development encourages merging small, frequent increments into main daily to prevent "merge hell" and ensure rapid automated feedback.',
    difficulty: 'Intermediate',
    tags: ['CI/CD', 'Git'],
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'q_s4_1',
    sessionNumber: 4,
    moduleId: 'm1',
    question: 'What is an essential security practice when managing SSH keys for cloud servers?',
    options: [
      'Commit your private key (id_rsa) into the public GitHub repository',
      'Use strong key algorithms (e.g. Ed25519), protect private keys with passphrases, and set strict permissions (chmod 600)',
      'Share the same private key with everyone in the company via email',
      'Never rotate SSH keys'
    ],
    correctIndex: 1,
    explanation: 'Private keys must remain confidential with 600 permissions, modern algorithms like Ed25519 are recommended, and they must NEVER be committed to Git.',
    difficulty: 'Beginner',
    tags: ['Security', 'SSH', 'Linux'],
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'q_s5_1',
    sessionNumber: 5,
    moduleId: 'm2',
    question: 'Which octal permission represents read and execute for owner, read-only for group, and no permissions for others in Linux?',
    options: [
      'chmod 755',
      'chmod 540',
      'chmod 644',
      'chmod 700'
    ],
    correctIndex: 1,
    explanation: 'Read (4) + Execute (1) = 5 for owner; Read (4) for group; None (0) for others = 540.',
    difficulty: 'Intermediate',
    tags: ['Linux', 'Permissions'],
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'q_s6_1',
    sessionNumber: 6,
    moduleId: 'm2',
    question: 'Which systemd command is required after editing or adding a service file in /etc/systemd/system/?',
    options: [
      'systemctl restart all',
      'systemctl daemon-reload',
      'service --reload',
      'init 6'
    ],
    correctIndex: 1,
    explanation: 'systemctl daemon-reload tells systemd to reload its configuration units from disk without restarting the host.',
    difficulty: 'Intermediate',
    tags: ['Linux', 'systemd'],
    createdAt: new Date().toISOString(),
  }
];

export let inMemoryQuizQuestions = [...defaultQuizQuestions];
