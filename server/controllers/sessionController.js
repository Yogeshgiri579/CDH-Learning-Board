import { sessionsData } from '../data/sessionsData.js';

const GITHUB_REPO_BASE = process.env.GITHUB_REPO_BASE || 'https://github.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge';

// Get all 55 sessions with lock status based on whether user is authenticated
export const getSessions = (req, res) => {
  try {
    const isAuthenticated = Boolean(req.user && req.user.id);
    const { phase, search, difficulty } = req.query;

    let results = sessionsData.map((session) => {
      // First 5 sessions are free for everyone
      const isFree = session.sessionNumber < 5;
      const isLocked = !isFree && !isAuthenticated;

      return {
        ...session,
        isFree,
        isLocked,
        // GitHub direct link
        githubUrl: `${GITHUB_REPO_BASE}/tree/main/${encodeURIComponent(session.folder)}`,
      };
    });

    // Optional query filters
    if (phase && phase !== 'all') {
      results = results.filter((s) => s.moduleId === phase || s.module.toLowerCase().includes(phase.toLowerCase()));
    }

    if (difficulty && difficulty !== 'all') {
      results = results.filter((s) => s.difficulty.toLowerCase() === difficulty.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      results = results.filter((s) =>
        s.title.toLowerCase().includes(q) ||
        s.preview.toLowerCase().includes(q) ||
        s.topics.some((t) => t.toLowerCase().includes(q))
      );
    }

    return res.json({
      success: true,
      total: sessionsData.length,
      count: results.length,
      isAuthenticated,
      sessions: results,
    });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ success: false, message: 'Server error fetching sessions' });
  }
};

// Get single session preview & details
export const getSessionById = (req, res) => {
  try {
    const isAuthenticated = Boolean(req.user && req.user.id);
    const sessionNum = parseInt(req.params.id, 10);

    let session = sessionsData.find((s) => s.sessionNumber === sessionNum);
    if (!session) {
      session = sessionsData.find((s) => s.id === sessionNum);
    }

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    const isFree = session.sessionNumber < 5;
    const isLocked = !isFree && !isAuthenticated;

    return res.json({
      success: true,
      session: {
        ...session,
        isFree,
        isLocked,
        githubUrl: `${GITHUB_REPO_BASE}/tree/main/${encodeURIComponent(session.folder)}`,
      },
    });
  } catch (error) {
    console.error('Error getting session:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Redirect route for a session (returns the destination GitHub link or 403 if locked)
export const getSessionRedirect = (req, res) => {
  try {
    const isAuthenticated = Boolean(req.user && req.user.id);
    const sessionNum = parseInt(req.params.id, 10);

    let session = sessionsData.find((s) => s.sessionNumber === sessionNum);
    if (!session) {
      session = sessionsData.find((s) => s.id === sessionNum);
    }

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    const isFree = session.sessionNumber < 5;

    if (!isFree && !isAuthenticated) {
      return res.status(403).json({
        success: false,
        requiresAuth: true,
        message: 'This session is locked. Please sign in with Google or your account to access sessions 5-54.',
      });
    }

    const targetUrl = `${GITHUB_REPO_BASE}/tree/main/${encodeURIComponent(session.folder)}`;

    return res.json({
      success: true,
      sessionNumber: session.sessionNumber,
      title: session.title,
      redirectUrl: targetUrl,
    });
  } catch (error) {
    console.error('Error handling redirect:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get Course Modules Roadmap stats
export const getCourseOverview = (req, res) => {
  const modulesMap = {};

  sessionsData.forEach((s) => {
    if (!modulesMap[s.moduleId]) {
      modulesMap[s.moduleId] = {
        moduleId: s.moduleId,
        title: s.module,
        total: 0,
        freeCount: 0,
        sessions: [],
      };
    }
    modulesMap[s.moduleId].total += 1;
    if (s.sessionNumber < 5) modulesMap[s.moduleId].freeCount += 1;
    modulesMap[s.moduleId].sessions.push({
      sessionNumber: s.sessionNumber,
      title: s.title,
      isFree: s.sessionNumber < 5,
    });
  });

  return res.json({
    success: true,
    totalSessions: 55,
    freeSessions: 5,
    modules: Object.values(modulesMap),
  });
};

// In-memory cache for README content
const readmeCache = new Map();

function generateCuratedReadme(s) {
  if (!s) return '';
  const topicsList = (s.topics || []).map((t, idx) => `${idx + 1}. **${t}**`).join('\n');
  const labsList = (s.labs || []).map((l, idx) => `### Task 0${idx + 1}: ${l}
\`\`\`bash
# Setup session workspace
git checkout main
cd "${s.folder}"

# Execute lab instructions
echo "Executing: ${l}"
\`\`\`
`).join('\n');

  return `# ${s.title}
*CloudDevOpsHub 55-Session MultiCloud DevOps with AI Challenge*

**Module:** ${s.module}  
**Estimated Duration:** ${s.duration} | **Difficulty:** ${s.difficulty}

---

## 📌 Session Overview
${s.preview}

---

## 🚀 Key Learning Objectives
${topicsList}

---

## 🛠️ Hands-on Labs & Tasks
${labsList}

---

## 💡 Practical DevOps Engineering Takeaways
- Ensure all configurations follow the **Shared Responsibility Model** and zero-trust guidelines.
- Commit clean changes to your Git repository and open a pull request for mentor feedback.
- Challenge your knowledge with the interactive quiz in the LMS.
`;
}

// Get session README notes (with GitHub fetch & cache)
export const getSessionReadme = async (req, res) => {
  try {
    const isAuthenticated = Boolean(req.user && req.user.id);
    const sessionNum = parseInt(req.params.id, 10);

    let session = sessionsData.find((s) => s.sessionNumber === sessionNum);
    if (!session) {
      session = sessionsData.find((s) => s.id === sessionNum);
    }

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    const isFree = session.sessionNumber < 5;
    const isLocked = !isFree && !isAuthenticated;

    if (isLocked) {
      return res.status(403).json({
        success: false,
        isLocked: true,
        message: 'This session is locked. Please sign in to read notes.',
      });
    }

    // Check cache
    const cacheKey = `session_${session.sessionNumber}`;
    if (readmeCache.has(cacheKey)) {
      return res.json({
        success: true,
        source: 'cache',
        folder: session.folder,
        content: readmeCache.get(cacheKey),
      });
    }

    // Try fetching from GitHub raw
    const rawUrl = `https://raw.githubusercontent.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge/main/${encodeURIComponent(session.folder)}/README.md`;
    try {
      const response = await fetch(rawUrl, {
        signal: AbortSignal.timeout(3500),
      });

      if (response.ok) {
        const text = await response.text();
        readmeCache.set(cacheKey, text);
        return res.json({
          success: true,
          source: 'github',
          folder: session.folder,
          content: text,
        });
      }
    } catch (fetchErr) {
      console.warn(`GitHub fetch timed out/failed for ${session.folder}, using curated notes:`, fetchErr.message);
    }

    // Fallback to curated notes
    const fallback = generateCuratedReadme(session);
    readmeCache.set(cacheKey, fallback);
    return res.json({
      success: true,
      source: 'curated',
      folder: session.folder,
      content: fallback,
    });
  } catch (error) {
    console.error('Error getting session readme:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving notes' });
  }
};

