export const CURRICULUM_MODULE_BADGES = [
  {
    moduleNumber: '01',
    moduleId: 'm1',
    title: 'FOUNDATIONS',
    subtitle: '& AI',
    fullName: 'Foundations & AI Module',
    sessions: [0, 1, 2, 3, 4],
    requiredPosts: 5,
    gradient: { from: '#334155', to: '#1e293b' },
  },
  {
    moduleNumber: '02',
    moduleId: 'm2',
    title: 'LINUX',
    subtitle: 'UBUNTU + GCP',
    fullName: 'Linux Ubuntu & GCP Module',
    sessions: [5, 6, 7, 8, 9],
    requiredPosts: 5,
    gradient: { from: '#f04124', to: '#9e1c07' },
  },
  {
    moduleNumber: '03',
    moduleId: 'm3',
    title: 'AWS',
    subtitle: 'SERVICES',
    fullName: 'AWS Cloud Services Module',
    sessions: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
    requiredPosts: 5,
    gradient: { from: '#ff8c00', to: '#b34700' },
  },
  {
    moduleNumber: '04',
    moduleId: 'm4',
    title: 'CI/CD',
    subtitle: 'GIT & JENKINS',
    fullName: 'CI/CD Git & Jenkins Module',
    sessions: [22, 23, 24, 25, 26, 27, 28, 29, 59],
    requiredPosts: 5,
    gradient: { from: '#e11d74', to: '#88053a' },
  },
  {
    moduleNumber: '05',
    moduleId: 'm5',
    title: 'DOCKER',
    subtitle: '& KUBERNETES',
    fullName: 'Docker & Kubernetes Module',
    sessions: [30, 31, 32, 33, 34, 35, 36, 37],
    requiredPosts: 5,
    gradient: { from: '#0284c7', to: '#075985' },
  },
  {
    moduleNumber: '06',
    moduleId: 'm6',
    title: 'IAC',
    subtitle: '& ANSIBLE',
    fullName: 'Terraform & Ansible Module',
    sessions: [38, 39, 40, 41, 42, 43, 44],
    requiredPosts: 5,
    gradient: { from: '#8b5cf6', to: '#4c1d95' },
  },
  {
    moduleNumber: '07',
    moduleId: 'm7',
    title: 'CAREER',
    subtitle: '& RESUME',
    fullName: 'Career Prep & Resume Module',
    sessions: [45, 46],
    requiredPosts: 5,
    gradient: { from: '#10b981', to: '#047857' },
  },
  {
    moduleNumber: '08',
    moduleId: 'm8',
    title: 'AZURE',
    subtitle: 'DEVOPS + GENAI',
    fullName: 'Azure DevOps & GenAI Module',
    sessions: [47, 48, 49],
    requiredPosts: 5,
    gradient: { from: '#06b6d4', to: '#0e7490' },
  },
  {
    moduleNumber: '09',
    moduleId: 'm9',
    title: 'CAPSTONE',
    subtitle: '8 REAL PROJECTS',
    fullName: 'Graduation Capstone Projects',
    sessions: [50, 51, 52, 53, 54, 55, 56, 57],
    requiredPosts: 5,
    gradient: { from: '#f59e0b', to: '#92400e' },
  },
  {
    moduleNumber: '10',
    moduleId: 'm10',
    title: 'GRADUATION',
    subtitle: '& INTERVIEWS',
    fullName: 'Graduation & Placement Module',
    sessions: [58],
    requiredPosts: 5,
    gradient: { from: '#ef4444', to: '#991b1b' },
  },
];

export const getCurriculumBadgeProgress = (completedSessions = [], quizProgress = []) => {
  const completedSet = new Set((completedSessions || []).map(Number));
  const passedQuizSet = new Set(
    (quizProgress || [])
      .filter((quiz) => quiz && quiz.passed)
      .map((quiz) => Number(quiz.sessionNumber))
  );

  return CURRICULUM_MODULE_BADGES.map((badge) => {
    const totalSessions = badge.sessions.length;
    const completedSessionsCount = badge.sessions.filter((sessionNumber) =>
      completedSet.has(sessionNumber)
    ).length;
    const quizzesPassedCount = badge.sessions.filter((sessionNumber) =>
      passedQuizSet.has(sessionNumber)
    ).length;
    const fullyFinishedCount = badge.sessions.filter(
      (sessionNumber) => completedSet.has(sessionNumber) && passedQuizSet.has(sessionNumber)
    ).length;

    return {
      ...badge,
      totalSessions,
      completedSessionsCount,
      quizzesPassedCount,
      fullyFinishedCount,
      isUnlocked: totalSessions > 0 && fullyFinishedCount === totalSessions,
    };
  });
};

export const getUnlockedCurriculumBadges = (completedSessions = [], quizProgress = []) =>
  getCurriculumBadgeProgress(completedSessions, quizProgress).filter((badge) => badge.isUnlocked);
