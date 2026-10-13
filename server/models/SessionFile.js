import mongoose from 'mongoose';

const sessionFileSchema = new mongoose.Schema(
  {
    sessionNumber: {
      type: Number,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    githubUrl: {
      type: String,
      required: true,
      trim: true,
    },
    rawUrl: {
      type: String,
      required: true,
      trim: true,
    },
    fileType: {
      type: String,
      default: 'markdown', // 'markdown' | 'code' | 'yaml' | 'terraform' | 'docker' | 'image' | 'json' | 'text'
    },
    description: {
      type: String,
      default: '',
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const SessionFile = mongoose.model('SessionFile', sessionFileSchema);

// In-Memory store with starter files for sample sessions so users have rich examples immediately
export const inMemorySessionFiles = [
  {
    _id: 'file_00_readme',
    sessionNumber: 0,
    name: 'README.md',
    githubUrl: 'https://github.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge/tree/main/Session-00-Program-Kickoff',
    rawUrl: 'https://raw.githubusercontent.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge/main/Session-00-Program-Kickoff/README.md',
    fileType: 'markdown',
    description: 'Kickoff guide & setup instructions',
    isDefault: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'file_00_roadmap',
    sessionNumber: 0,
    name: '55-Day-Roadmap.md',
    githubUrl: 'https://github.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge/blob/main/README.md',
    rawUrl: 'https://raw.githubusercontent.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge/main/README.md',
    fileType: 'markdown',
    description: 'Master MultiCloud & DevOps Roadmap overview',
    isDefault: false,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'file_01_readme',
    sessionNumber: 1,
    name: 'README.md',
    githubUrl: 'https://github.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge/tree/main/Session-01-DevOps-Introduction-Course-Overview',
    rawUrl: 'https://raw.githubusercontent.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge/main/Session-01-DevOps-Introduction-Course-Overview/README.md',
    fileType: 'markdown',
    description: 'DevOps Culture & CALMS Overview notes',
    isDefault: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'file_01_script',
    sessionNumber: 1,
    name: 'verify-environment.sh',
    githubUrl: 'https://raw.githubusercontent.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge/main/Session-01-DevOps-Introduction-Course-Overview/verify-environment.sh',
    rawUrl: 'https://raw.githubusercontent.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge/main/Session-01-DevOps-Introduction-Course-Overview/verify-environment.sh',
    fileType: 'code',
    description: 'Shell script to verify local Git, Docker & AWS CLI environment',
    isDefault: false,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'file_02_readme',
    sessionNumber: 2,
    name: 'README.md',
    githubUrl: 'https://github.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge/tree/main/Session%2002%20Cloud%20Computing%20Virtualization',
    rawUrl: 'https://raw.githubusercontent.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge/main/Session%2002%20Cloud%20Computing%20Virtualization/README.md',
    fileType: 'markdown',
    description: 'Cloud Computing & Virtualization notes',
    isDefault: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'file_03_diagram',
    sessionNumber: 3,
    name: 'architecture-diagram.png',
    githubUrl: 'https://raw.githubusercontent.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge/main/assets/banner.png',
    rawUrl: 'https://raw.githubusercontent.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge/main/assets/banner.png',
    fileType: 'image',
    description: 'Architecture diagram preview',
    isDefault: false,
    createdAt: new Date().toISOString(),
  }
];
