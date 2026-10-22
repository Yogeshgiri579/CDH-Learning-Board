import React, { useState, useEffect, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { api } from './services/api';
import { modulesList } from './data/modules';
import { 
  FolderGit2, 
  Plus, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  RotateCw, 
  Eye, 
  Link2, 
  HelpCircle, 
  Search, 
  Layers, 
  FileCode, 
  FileText, 
  Image as ImageIcon, 
  Terminal, 
  Check, 
  Copy, 
  X, 
  Save, 
  Sparkles,
  Star,
  Activity,
  Code
} from 'lucide-react';
import { Github } from './components/GithubIcon';

// Helper component for markdown code blocks with copy button
const AdminCodeBlock = ({ className, children, ...props }) => {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const codeText = String(children || '').replace(/\n$/, '');
  const isInline = !match && !codeText.includes('\n');

  if (isInline) {
    return (
      <code className="bg-[#161b22] text-[#58a6ff] font-mono text-xs px-1.5 py-0.5 rounded border border-[#30363d]" {...props}>
        {children}
      </code>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(codeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-3 rounded-xl overflow-hidden border border-[#30363d] bg-[#010409]">
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-[#161b22] border-b border-[#30363d] text-[11px] font-mono text-[#8b949e]">
        <span>{match ? match[1] : 'code'}</span>
        <button
          onClick={handleCopy}
          type="button"
          className="flex items-center space-x-1 px-2 py-0.5 rounded hover:bg-[#21262d] text-[#8b949e] hover:text-[#f0f6fc] transition-colors cursor-pointer"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="p-3.5 overflow-x-auto text-xs sm:text-sm font-mono text-[#e6edf3]">
        <pre className="!bg-transparent !p-0 !m-0">
          <code>{children}</code>
        </pre>
      </div>
    </div>
  );
};

export function App() {
  // Sessions state
  const [sessions, setSessions] = useState([]);
  const [selectedSessionNum, setSelectedSessionNum] = useState(0);
  const [sessionSearch, setSessionSearch] = useState('');
  const [backendStatus, setBackendStatus] = useState('checking');

  // Inline Importer Form state for currently selected session
  const [importUrl, setImportUrl] = useState('');
  const [importFileName, setImportFileName] = useState('');
  const [setAsPrimary, setSetAsPrimary] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [verifiedData, setVerifiedData] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);

  // Active Session Files state
  const [activeSessionFiles, setActiveSessionFiles] = useState([]);
  const [filesLoading, setFilesLoading] = useState(false);

  // Active Session Quizzes state
  const [sessionQuizzes, setSessionQuizzes] = useState([]);
  const [quizzesLoading, setQuizzesLoading] = useState(false);

  // Quiz Add/Edit Modal
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [quizForm, setQuizForm] = useState({
    sessionNumber: 0,
    moduleId: 'm1',
    question: '',
    options: ['', '', '', ''],
    correctIndex: 0,
    explanation: '',
    difficulty: 'Intermediate',
    tags: '',
  });
  const [quizSaveLoading, setQuizSaveLoading] = useState(false);

  // Inspect Modal (for previewing full file content)
  const [inspectModalFile, setInspectModalFile] = useState(null);
  const [inspectContent, setInspectContent] = useState('');
  const [inspectLoading, setInspectLoading] = useState(false);
  const [inspectViewMode, setInspectViewMode] = useState('formatted'); // 'formatted' | 'raw'
  const [inspectCopied, setInspectCopied] = useState(false);

  // Quick URL Tester modal
  const [testerOpen, setTesterOpen] = useState(false);
  const [testerUrl, setTesterUrl] = useState('https://github.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge/blob/main/README.md');
  const [testerResult, setTesterResult] = useState(null);
  const [testerLoading, setTesterLoading] = useState(false);

  // Toast
  const [toast, setToast] = useState(null);

  const showToast = (text, type = 'success') => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3500);
  };

  // 1. Initial health & sessions fetch
  useEffect(() => {
    const init = async () => {
      try {
        const health = await api.getHealth();
        if (health && health.status === 'online') {
          setBackendStatus('online');
        } else {
          setBackendStatus('error');
        }
      } catch {
        setBackendStatus('offline');
      }

      try {
        const res = await api.getSessions();
        if (res && res.success && res.sessions?.length > 0) {
          setSessions(res.sessions);
        }
      } catch (e) {
        console.warn('API error fetching sessions:', e);
      }
    };

    init();
  }, []);

  // 2. Load attached files and quizzes whenever selected session changes
  const loadFilesForSession = async (sNum) => {
    setFilesLoading(true);
    try {
      const res = await api.getSessionFiles(sNum);
      if (res && res.success && res.files) {
        setActiveSessionFiles(res.files);
      } else {
        setActiveSessionFiles([]);
      }
    } catch (err) {
      console.error('Failed to load session files:', err);
      setActiveSessionFiles([]);
    } finally {
      setFilesLoading(false);
    }
  };

  const loadQuizzesForSession = async (sNum) => {
    setQuizzesLoading(true);
    try {
      const res = await api.getQuizForSession(sNum);
      if (res && res.success && res.questions) {
        setSessionQuizzes(res.questions);
      } else {
        setSessionQuizzes([]);
      }
    } catch (err) {
      console.error('Failed to load session quizzes:', err);
      setSessionQuizzes([]);
    } finally {
      setQuizzesLoading(false);
    }
  };

  useEffect(() => {
    loadFilesForSession(selectedSessionNum);
    loadQuizzesForSession(selectedSessionNum);
    // Reset file import form fields for new session
    setImportUrl('');
    setImportFileName('');
    setVerifiedData(null);
  }, [selectedSessionNum]);

  // Current session object
  const currentSession = useMemo(() => {
    return (
      sessions.find((s) => s.sessionNumber === selectedSessionNum) || {
        sessionNumber: selectedSessionNum,
        title: `Session #${String(selectedSessionNum).padStart(2, '0')}`,
        module: 'DevOps Foundations',
        moduleId: 'm1',
        folder: `Session-${String(selectedSessionNum).padStart(2, '0')}`,
        githubUrl: 'https://github.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge',
      }
    );
  }, [sessions, selectedSessionNum]);

  // Filter sessions in sidebar
  const filteredSessions = useMemo(() => {
    const list = sessions.length > 0 ? sessions : Array.from({ length: 55 }, (_, i) => ({
      sessionNumber: i,
      title: `Session #${String(i).padStart(2, '0')}`,
      module: i < 5 ? 'DevOps Foundations' : 'MultiCloud DevOps',
      moduleId: i < 5 ? 'm1' : 'm2',
    }));

    if (!sessionSearch.trim()) return list;
    const q = sessionSearch.toLowerCase().trim();
    return list.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        String(s.sessionNumber).includes(q) ||
        (s.module && s.module.toLowerCase().includes(q))
    );
  }, [sessions, sessionSearch]);

  // Handle URL change with smart name extraction
  const handleImportUrlChange = (val) => {
    setImportUrl(val);
    setVerifiedData(null);
    if (!val.trim()) return;

    try {
      const clean = val.trim().split('?')[0].split('#')[0];
      const segments = clean.split('/').filter(Boolean);
      const rawName = segments[segments.length - 1];
      if (rawName && !rawName.includes('github.com')) {
        let decoded = rawName;
        try {
          decoded = decodeURIComponent(rawName);
        } catch {}
        setImportFileName(decoded);
      }
    } catch {}
  };

  // Verify URL before saving
  const handleVerifyUrl = async () => {
    if (!importUrl.trim()) return;
    setVerifying(true);
    setVerifiedData(null);

    try {
      const res = await api.previewGitHubUrl(importUrl.trim());
      if (res && res.success) {
        setVerifiedData({
          success: true,
          name: res.fileName,
          fileName: res.fileName,
          fileType: res.fileType,
          language: res.language,
          rawUrl: res.rawUrl,
          githubUrl: res.githubUrl,
          content: res.content || '',
          lineCount: res.lineCount,
          byteSize: res.byteSize,
        });
        if (!importFileName.trim()) {
          setImportFileName(res.fileName || 'file');
        }
        showToast('GitHub URL verified successfully!', 'success');
      } else {
        setVerifiedData({ error: res?.message || 'Could not fetch file from GitHub. Check URL.' });
        showToast(res?.message || 'Verification failed', 'error');
      }
    } catch (err) {
      setVerifiedData({ error: err.message });
      showToast(`Verification error: ${err.message}`, 'error');
    } finally {
      setVerifying(false);
    }
  };

  // Save imported URL directly to active session
  const handleSaveImportedUrl = async (e) => {
    e.preventDefault();
    if (!importUrl.trim()) {
      showToast('Please enter a GitHub URL', 'error');
      return;
    }

    setSaveLoading(true);
    try {
      const name = importFileName.trim() || verifiedData?.fileName || verifiedData?.name || 'Session-Notes.md';
      const fileData = {
        name,
        url: importUrl.trim(),
        githubUrl: importUrl.trim(),
        fileType: verifiedData?.fileType || (name.endsWith('.md') ? 'markdown' : 'code'),
        isDefault: setAsPrimary,
        isPrimary: setAsPrimary,
        description: `Attached to Session #${selectedSessionNum}`,
      };

      const res = await api.addSessionFile(selectedSessionNum, fileData);
      if (res && res.success) {
        showToast(`Saved "${name}" to Session #${selectedSessionNum}`, 'success');
        setImportUrl('');
        setImportFileName('');
        setVerifiedData(null);
        await loadFilesForSession(selectedSessionNum);
      } else {
        showToast(res?.message || 'Failed to attach file', 'error');
      }
    } catch (err) {
      showToast(`Error: ${err.message}`, 'error');
    } finally {
      setSaveLoading(false);
    }
  };

  // Set file as primary
  const handleSetPrimary = async (file) => {
    try {
      const res = await api.setPrimarySessionFile(selectedSessionNum, file._id);
      if (res && res.success) {
        showToast(`"${file.name}" is now the primary view for Session #${selectedSessionNum}`, 'success');
        await loadFilesForSession(selectedSessionNum);
      } else {
        showToast(res?.message || 'Failed to set as primary', 'error');
      }
    } catch (err) {
      showToast(`Error: ${err.message}`, 'error');
    }
  };

  // Delete attached file
  const handleDeleteFile = async (file) => {
    if (!window.confirm(`Remove "${file.name}" from Session #${selectedSessionNum}?`)) return;
    try {
      const res = await api.deleteSessionFile(selectedSessionNum, file._id);
      if (res && res.success) {
        showToast(`Removed "${file.name}"`, 'success');
        await loadFilesForSession(selectedSessionNum);
      } else {
        showToast(res?.message || 'Failed to delete file', 'error');
      }
    } catch (err) {
      showToast(`Error: ${err.message}`, 'error');
    }
  };

  // Open full inspect preview modal
  const handleOpenInspect = async (file) => {
    const rawName = file?.name || file?.fileName || importFileName.trim() || 'Session File';
    let cleanName = rawName;
    try {
      cleanName = decodeURIComponent(rawName);
    } catch {}

    const fileObj = {
      ...file,
      name: cleanName,
      fileName: cleanName,
    };
    setInspectModalFile(fileObj);
    setInspectContent('');
    setInspectLoading(true);

    if (file?.content) {
      setInspectContent(file.content);
      setInspectLoading(false);
      return;
    }

    try {
      const targetUrl = file?.githubUrl || file?.rawUrl || file?.url || importUrl.trim();
      const res = await api.previewGitHubUrl(targetUrl);
      if (res && res.success) {
        setInspectContent(res.content || '');
      } else {
        setInspectContent(`Failed to load: ${res?.message || 'Unknown error'}`);
      }
    } catch (err) {
      setInspectContent(`Error fetching file: ${err.message}`);
    } finally {
      setInspectLoading(false);
    }
  };

  // Quiz CRUD handlers
  const handleOpenAddQuiz = () => {
    setEditingQuiz(null);
    setQuizForm({
      sessionNumber: selectedSessionNum,
      moduleId: currentSession.moduleId || 'm1',
      question: '',
      options: ['', '', '', ''],
      correctIndex: 0,
      explanation: '',
      difficulty: 'Intermediate',
      tags: '',
    });
    setQuizModalOpen(true);
  };

  const handleOpenEditQuiz = (q) => {
    setEditingQuiz(q);
    setQuizForm({
      sessionNumber: q.sessionNumber ?? selectedSessionNum,
      moduleId: q.moduleId || 'm1',
      question: q.question || '',
      options: q.options && q.options.length === 4 ? [...q.options] : ['', '', '', ''],
      correctIndex: q.correctIndex || 0,
      explanation: q.explanation || '',
      difficulty: q.difficulty || 'Intermediate',
      tags: Array.isArray(q.tags) ? q.tags.join(', ') : '',
    });
    setQuizModalOpen(true);
  };

  const handleDeleteQuiz = async (qId) => {
    if (!window.confirm('Are you sure you want to delete this quiz question?')) return;
    try {
      const res = await api.deleteQuizQuestion(qId);
      if (res && res.success) {
        showToast('Question deleted successfully', 'success');
        await loadQuizzesForSession(selectedSessionNum);
      } else {
        showToast(res?.message || 'Failed to delete question', 'error');
      }
    } catch (err) {
      showToast(`Error deleting question: ${err.message}`, 'error');
    }
  };

  const handleSaveQuiz = async (e) => {
    e.preventDefault();
    if (!quizForm.question.trim()) {
      showToast('Please enter a question', 'error');
      return;
    }
    if (quizForm.options.some((opt) => !opt.trim())) {
      showToast('All 4 options must be filled', 'error');
      return;
    }

    setQuizSaveLoading(true);
    try {
      const payload = {
        sessionNumber: selectedSessionNum,
        moduleId: currentSession.moduleId || 'm1',
        question: quizForm.question.trim(),
        options: quizForm.options.map((o) => o.trim()),
        correctIndex: parseInt(quizForm.correctIndex, 10),
        explanation: quizForm.explanation.trim(),
        difficulty: quizForm.difficulty,
        tags: quizForm.tags
          ? quizForm.tags
              .split(',')
              .map((t) => t.trim())
              .filter(Boolean)
          : [],
      };

      let res;
      if (editingQuiz) {
        res = await api.updateQuizQuestion(editingQuiz._id || editingQuiz.id, payload);
      } else {
        res = await api.createQuizQuestion(payload);
      }

      if (res && res.success) {
        showToast(editingQuiz ? 'Question updated' : 'Question added to Session', 'success');
        setQuizModalOpen(false);
        await loadQuizzesForSession(selectedSessionNum);
      } else {
        showToast(res?.message || 'Failed to save question', 'error');
      }
    } catch (err) {
      showToast(`Error saving question: ${err.message}`, 'error');
    } finally {
      setQuizSaveLoading(false);
    }
  };

  // URL Tester handler
  const handleRunTester = async (e) => {
    e.preventDefault();
    if (!testerUrl.trim()) return;
    setTesterLoading(true);
    setTesterResult(null);
    try {
      const res = await api.previewGitHubUrl(testerUrl.trim());
      setTesterResult(res);
    } catch (err) {
      setTesterResult({ success: false, message: err.message });
    } finally {
      setTesterLoading(false);
    }
  };

  const getFileIcon = (file) => {
    const rawName = file?.name || file?.fileName || '';
    const ext = rawName.toLowerCase().split('.').pop();
    if (ext === 'md') return <FileText className="w-4 h-4 text-[#58a6ff]" />;
    if (ext === 'sh' || ext === 'bash') return <Terminal className="w-4 h-4 text-emerald-400" />;
    if (['png', 'jpg', 'jpeg', 'svg', 'webp'].includes(ext)) return <ImageIcon className="w-4 h-4 text-purple-400" />;
    return <FileCode className="w-4 h-4 text-amber-400" />;
  };

  return (
    <div className="min-h-screen bg-[#010409] text-[#f0f6fc] font-sans antialiased flex flex-col">
      
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-5 right-5 z-[150] animate-in fade-in slide-in-from-top-3 duration-200">
          <div className={`px-4 py-2.5 rounded-xl border text-xs font-semibold shadow-2xl flex items-center space-x-2 ${
            toast.type === 'error'
              ? 'bg-rose-950/90 border-rose-800 text-rose-200'
              : 'bg-[#161b22] border-[#30363d] text-[#f0f6fc]'
          }`}>
            {toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            )}
            <span>{toast.text}</span>
          </div>
        </div>
      )}

      {/* Top GitHub Dark Header */}
      <header className="sticky top-0 z-40 bg-[#161b22] border-b border-[#30363d] px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo & Identity */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-[#21262d] border border-[#30363d] flex items-center justify-center text-white">
              <FolderGit2 className="w-4 h-4 text-[#58a6ff]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-sm font-extrabold text-white tracking-tight">
                  CloudDevOpsHub <span className="text-[#8b949e] font-normal">Admin CMS</span>
                </h1>
                <span className="text-[10px] px-1.5 py-0.2 rounded font-mono font-bold bg-[#21262d] text-[#58a6ff] border border-[#30363d]">
                  PRO
                </span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono flex items-center space-x-1 border ${
                  backendStatus === 'online'
                    ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/60'
                    : 'bg-rose-950/40 text-rose-400 border-rose-800/60'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${backendStatus === 'online' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                  <span>{backendStatus === 'online' ? 'API Online' : 'API Offline'}</span>
                </span>
              </div>
              <p className="text-[11px] text-[#8b949e]">
                Direct Session Content & Interactive Quiz Management
              </p>
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center space-x-2.5">
            <button
              onClick={() => setTesterOpen(true)}
              className="px-3 py-1.5 rounded-xl border border-[#30363d] bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] hover:text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
              title="Test any GitHub URL live"
            >
              <Link2 className="w-3.5 h-3.5 text-[#58a6ff]" />
              <span className="hidden sm:inline">URL Tester</span>
            </button>

            <a
              href="http://localhost:5173"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#238636] hover:bg-[#2ea043] text-white shadow-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
              title="Open Student LMS at http://localhost:5173"
            >
              <span>Open Student LMS</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>
      </header>

      {/* Main Consolidated Workspace: Master-Detail Layout */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex-1 flex flex-col">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
          
          {/* Left Column: Sessions List (00-54) */}
          <div className="lg:col-span-4 flex flex-col space-y-3">
            
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8b949e]">
                Sessions (00–54)
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#161b22] text-[#8b949e] border border-[#30363d]">
                {filteredSessions.length} Total
              </span>
            </div>

            {/* Session Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#8b949e] absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search session # or title..."
                value={sessionSearch}
                onChange={(e) => setSessionSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#0d1117] border border-[#30363d] text-xs text-[#f0f6fc] placeholder-[#8b949e] focus:border-[#58a6ff] outline-none"
              />
            </div>

            {/* Scrollable Sessions List */}
            <div className="rounded-2xl border border-[#30363d] bg-[#0d1117] overflow-y-auto max-h-[78vh] custom-scrollbar divide-y divide-[#21262d]">
              {filteredSessions.map((s) => {
                const isSelected = s.sessionNumber === selectedSessionNum;
                return (
                  <button
                    key={s.sessionNumber}
                    onClick={() => setSelectedSessionNum(s.sessionNumber)}
                    className={`w-full text-left p-3 transition-colors flex items-start space-x-3 cursor-pointer ${
                      isSelected
                        ? 'bg-[#161b22] text-white border-l-4 border-l-[#58a6ff]'
                        : 'hover:bg-[#161b22]/50 text-[#c9d1d9]'
                    }`}
                  >
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5 border ${
                      isSelected 
                        ? 'bg-[#21262d] text-[#58a6ff] border-[#30363d]' 
                        : 'bg-[#21262d] text-[#8b949e] border-[#30363d]'
                    }`}>
                      #{String(s.sessionNumber).padStart(2, '0')}
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className={`text-xs font-bold truncate leading-tight ${isSelected ? 'text-white' : 'text-[#c9d1d9]'}`}>
                        {s.title}
                      </p>
                      <p className="text-[10px] text-[#8b949e] truncate mt-0.5">
                        {s.module}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

          </div>

          {/* Right Column: Active Session Workspace (Files & Quiz Attached Directly!) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Session Detail Banner */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#0d1117] border border-[#30363d] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#21262d] text-[#58a6ff] border border-[#30363d]">
                    Session #{String(selectedSessionNum).padStart(2, '0')}
                  </span>
                  <span className="text-xs text-[#8b949e] truncate">{currentSession.module}</span>
                </div>
                <h2 className="text-base sm:text-lg font-extrabold text-white truncate mt-1">
                  {currentSession.title}
                </h2>
                <p className="text-xs text-[#8b949e] font-mono mt-0.5 truncate">
                  LMS Folder: {currentSession.folder}
                </p>
              </div>

              <div className="flex items-center space-x-2 self-start sm:self-auto flex-shrink-0">
                <button
                  onClick={() => {
                    loadFilesForSession(selectedSessionNum);
                    loadQuizzesForSession(selectedSessionNum);
                    showToast('Refreshed session data', 'success');
                  }}
                  className="p-2 rounded-xl border border-[#30363d] bg-[#161b22] hover:bg-[#21262d] text-[#8b949e] hover:text-white transition-colors cursor-pointer"
                  title="Reload session files & quizzes"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
                <a
                  href={`http://localhost:5173`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl border border-[#30363d] bg-[#161b22] hover:bg-[#21262d] text-[#c9d1d9] hover:text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-[#58a6ff]" />
                  <span>View in LMS</span>
                </a>
              </div>
            </div>

            {/* SECTION 1: FILES ATTACHED & INLINE ADD FORM (Directly Attached!) */}
            <div className="p-5 rounded-2xl bg-[#0d1117] border border-[#30363d] shadow-sm space-y-4">
              
              <div className="flex items-center justify-between pb-3 border-b border-[#21262d]">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-[#21262d] border border-[#30363d] flex items-center justify-center text-[#58a6ff]">
                    <Link2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      Files Attached to Session #{String(selectedSessionNum).padStart(2, '0')}
                    </h3>
                    <p className="text-xs text-[#8b949e]">
                      Notes, Terraform, Dockerfile or diagram files loaded directly in the student reader.
                    </p>
                  </div>
                </div>

                <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#161b22] text-[#8b949e] border border-[#30363d]">
                  {activeSessionFiles.length} file{activeSessionFiles.length === 1 ? '' : 's'}
                </span>
              </div>

              {/* Inline Add / Import File Form for THIS Session */}
              <form onSubmit={handleSaveImportedUrl} className="p-4 rounded-xl bg-[#161b22] border border-[#30363d] space-y-3">
                <p className="text-xs font-bold text-white flex items-center space-x-1.5">
                  <Plus className="w-3.5 h-3.5 text-[#58a6ff]" />
                  <span>Attach New GitHub File to Session #{selectedSessionNum}</span>
                </p>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                  
                  {/* GitHub URL */}
                  <div className="md:col-span-7">
                    <label className="block text-[11px] font-semibold text-[#c9d1d9] mb-1">
                      Paste GitHub File URL (Blob / Raw / Repo):
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="https://github.com/org/repo/blob/main/Session-01/Day-3-Linux.md"
                      value={importUrl}
                      onChange={(e) => handleImportUrlChange(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-[#010409] border border-[#30363d] text-xs font-mono text-[#f0f6fc] placeholder-[#8b949e] focus:border-[#58a6ff] outline-none"
                    />
                  </div>

                  {/* Tab Label */}
                  <div className="md:col-span-3">
                    <label className="block text-[11px] font-semibold text-[#c9d1d9] mb-1">
                      Tab Label / Name:
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Day-3 Linux"
                      value={importFileName}
                      onChange={(e) => setImportFileName(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-[#010409] border border-[#30363d] text-xs font-mono text-[#f0f6fc] placeholder-[#8b949e] focus:border-[#58a6ff] outline-none"
                    />
                  </div>

                  {/* Verify Link */}
                  <div className="md:col-span-2">
                    <button
                      type="button"
                      onClick={handleVerifyUrl}
                      disabled={verifying || !importUrl.trim()}
                      className="w-full py-1.5 rounded-xl bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] hover:text-white border border-[#30363d] text-xs font-semibold flex items-center justify-center space-x-1 cursor-pointer disabled:opacity-40"
                    >
                      {verifying ? (
                        <RotateCw className="w-3.5 h-3.5 animate-spin text-[#58a6ff]" />
                      ) : (
                        <Eye className="w-3.5 h-3.5 text-[#58a6ff]" />
                      )}
                      <span>Verify</span>
                    </button>
                  </div>

                </div>

                {/* Verification result preview */}
                {verifiedData && (
                  <div className={`p-2.5 rounded-xl border text-xs ${
                    verifiedData.error
                      ? 'bg-rose-950/30 border-rose-800/60 text-rose-300'
                      : 'bg-emerald-950/30 border-emerald-800/60 text-emerald-300'
                  }`}>
                    {verifiedData.error ? (
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                        <span>{verifiedData.error}</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                          <span className="font-bold text-white">Verified: {verifiedData.fileName}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#21262d] text-[#c9d1d9] uppercase font-mono">
                            {verifiedData.fileType}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleOpenInspect(verifiedData)}
                          className="text-[11px] text-[#58a6ff] hover:underline"
                        >
                          Preview Content
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Checkbox & Save CTA */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                  <label className="flex items-center space-x-2 text-xs text-[#c9d1d9] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={setAsPrimary}
                      onChange={(e) => setSetAsPrimary(e.target.checked)}
                      className="rounded border-[#30363d] bg-[#010409] text-[#238636] focus:ring-0"
                    />
                    <span>Set as Primary File (Students read this immediately upon opening Session #{selectedSessionNum})</span>
                  </label>

                  <button
                    type="submit"
                    disabled={saveLoading || !importUrl.trim()}
                    className="px-4 py-2 rounded-xl bg-[#238636] hover:bg-[#2ea043] text-white text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-40"
                  >
                    {saveLoading ? <RotateCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                    <span>Attach & Save File</span>
                  </button>
                </div>
              </form>

              {/* List of Files attached to Session */}
              {filesLoading ? (
                <div className="py-8 text-center text-xs text-[#8b949e] flex items-center justify-center space-x-2">
                  <RotateCw className="w-4 h-4 animate-spin text-[#58a6ff]" />
                  <span>Loading session files...</span>
                </div>
              ) : activeSessionFiles.length === 0 ? (
                <div className="py-8 text-center text-xs text-[#8b949e] border border-dashed border-[#30363d] rounded-xl p-6">
                  <p>No custom files attached to Session #{selectedSessionNum} yet.</p>
                  <p className="mt-1 text-[#484f58]">Students will see the default README.md notes until you attach a file above.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {activeSessionFiles.map((file) => (
                    <div
                      key={file._id}
                      className="p-3 rounded-xl bg-[#161b22] border border-[#30363d] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        <div className="w-8 h-8 rounded-lg bg-[#21262d] border border-[#30363d] flex items-center justify-center flex-shrink-0">
                          {getFileIcon(file)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-xs text-white truncate">
                              {(() => {
                                try {
                                  return decodeURIComponent(file.name || file.fileName || 'File');
                                } catch {
                                  return file.name || file.fileName || 'File';
                                }
                              })()}
                            </span>
                            {file.isDefault && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded font-sans font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex-shrink-0">
                                Primary View
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] font-mono text-[#8b949e] truncate mt-0.5 max-w-lg">
                            {file.githubUrl || file.rawUrl}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1.5 self-end sm:self-auto flex-shrink-0">
                        <button
                          onClick={() => handleOpenInspect(file)}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] hover:text-white border border-[#30363d] transition-colors flex items-center space-x-1 cursor-pointer"
                          title="Inspect full file content"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#58a6ff]" />
                          <span>Preview</span>
                        </button>

                        {!file.isDefault && (
                          <button
                            onClick={() => handleSetPrimary(file)}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#21262d] hover:bg-[#30363d] text-amber-300 hover:text-amber-200 border border-[#30363d] transition-colors cursor-pointer"
                            title="Set as the default file learners see first"
                          >
                            Set Primary
                          </button>
                        )}

                        <a
                          href={file.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg text-[#8b949e] hover:text-white hover:bg-[#21262d] transition-colors"
                          title="Open on GitHub"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>

                        <button
                          onClick={() => handleDeleteFile(file)}
                          className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors cursor-pointer"
                          title="Delete file from session"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>

            {/* SECTION 2: SESSION QUIZ QUESTIONS (Directly Attached in Same Place!) */}
            <div className="p-5 rounded-2xl bg-[#0d1117] border border-[#30363d] shadow-sm space-y-4">
              
              <div className="flex items-center justify-between pb-3 border-b border-[#21262d]">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-[#21262d] border border-[#30363d] flex items-center justify-center text-amber-400">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      Session #{String(selectedSessionNum).padStart(2, '0')} Quiz Questions
                    </h3>
                    <p className="text-xs text-[#8b949e]">
                      Interactive multiple-choice knowledge checks presented to students for this session.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleOpenAddQuiz}
                  className="px-3 py-1.5 rounded-xl bg-[#238636] hover:bg-[#2ea043] text-white text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Question</span>
                </button>
              </div>

              {/* Questions List */}
              {quizzesLoading ? (
                <div className="py-8 text-center text-xs text-[#8b949e] flex items-center justify-center space-x-2">
                  <RotateCw className="w-4 h-4 animate-spin text-[#58a6ff]" />
                  <span>Loading quiz questions...</span>
                </div>
              ) : sessionQuizzes.length === 0 ? (
                <div className="py-8 text-center text-xs text-[#8b949e] border border-dashed border-[#30363d] rounded-xl p-6 space-y-2">
                  <HelpCircle className="w-8 h-8 text-[#484f58] mx-auto" />
                  <p>No custom quiz questions configured for Session #{selectedSessionNum}.</p>
                  <button
                    onClick={handleOpenAddQuiz}
                    className="px-3 py-1.5 rounded-lg bg-[#21262d] hover:bg-[#30363d] text-white text-xs font-semibold border border-[#30363d] cursor-pointer"
                  >
                    + Create First Question for Session #{selectedSessionNum}
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {sessionQuizzes.map((q, qIdx) => (
                    <div
                      key={q._id || q.id || qIdx}
                      className="p-4 rounded-xl bg-[#161b22] border border-[#30363d] space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start space-x-2 min-w-0 flex-1">
                          <span className="w-5 h-5 rounded-md bg-[#21262d] border border-[#30363d] text-[#58a6ff] flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                            {qIdx + 1}
                          </span>
                          <div className="min-w-0">
                            <h4 className="text-xs sm:text-sm font-bold text-white leading-snug">
                              {q.question}
                            </h4>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#21262d] text-[#8b949e] border border-[#30363d]">
                                {q.difficulty || 'Intermediate'}
                              </span>
                              {q.tags && q.tags.length > 0 && (
                                <span className="text-[10px] text-[#8b949e] truncate">
                                  Tags: {q.tags.join(', ')}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-1 flex-shrink-0">
                          <button
                            onClick={() => handleOpenEditQuiz(q)}
                            className="p-1.5 rounded-lg text-[#8b949e] hover:text-white hover:bg-[#21262d] transition-colors cursor-pointer"
                            title="Edit Question"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteQuiz(q._id || q.id)}
                            className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors cursor-pointer"
                            title="Delete Question"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* 4 Choices */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {(q.options || []).map((opt, oIdx) => {
                          const isCorrect = oIdx === q.correctIndex;
                          return (
                            <div
                              key={oIdx}
                              className={`p-2.5 rounded-lg border text-xs flex items-start space-x-2 ${
                                isCorrect
                                  ? 'bg-[#238636]/15 border-[#238636]/40 text-[#3fb950]'
                                  : 'bg-[#0d1117] border-[#21262d] text-[#8b949e]'
                              }`}
                            >
                              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5 border ${
                                isCorrect ? 'bg-[#238636] text-white border-[#238636]' : 'border-[#30363d] text-[#8b949e]'
                              }`}>
                                {isCorrect ? '✓' : String.fromCharCode(65 + oIdx)}
                              </span>
                              <span className="flex-1 leading-snug">{opt}</span>
                            </div>
                          );
                        })}
                      </div>

                      {q.explanation && (
                        <p className="text-[11px] text-[#8b949e] italic border-t border-[#21262d] pt-2">
                          💡 Explanation: {q.explanation}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

            </div>

          </div>

        </div>
      </main>

      {/* QUIZ ADD / EDIT MODAL */}
      {quizModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in"
          onClick={() => setQuizModalOpen(false)}
        >
          <div 
            className="bg-[#0d1117] border border-[#30363d] w-full max-w-xl rounded-2xl p-6 shadow-2xl space-y-4 my-auto text-[#f0f6fc]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#30363d]">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">
                  {editingQuiz ? 'Edit Question' : `Add Question to Session #${selectedSessionNum}`}
                </h3>
              </div>
              <button
                onClick={() => setQuizModalOpen(false)}
                className="p-1 rounded text-[#8b949e] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuiz} className="space-y-3.5">
              
              {/* Question Text */}
              <div>
                <label className="block text-xs font-semibold text-[#c9d1d9] mb-1">
                  Question Text:
                </label>
                <textarea
                  required
                  rows={3}
                  value={quizForm.question}
                  onChange={(e) => setQuizForm({ ...quizForm, question: e.target.value })}
                  placeholder="e.g. In AWS VPC, which subnet type directly routes traffic to an Internet Gateway?"
                  className="w-full px-3 py-2 rounded-xl bg-[#010409] border border-[#30363d] text-xs text-[#f0f6fc] placeholder-[#8b949e] focus:border-[#58a6ff] outline-none"
                />
              </div>

              {/* 4 Options with Radio Selector for Correct Answer */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-[#c9d1d9]">
                  4 Multiple Choice Options (Select radio for Correct Answer):
                </label>
                {quizForm.options.map((opt, oIdx) => (
                  <div key={oIdx} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="correctIndex"
                      checked={parseInt(quizForm.correctIndex, 10) === oIdx}
                      onChange={() => setQuizForm({ ...quizForm, correctIndex: oIdx })}
                      className="text-[#238636] focus:ring-0 bg-[#010409] border-[#30363d] cursor-pointer"
                    />
                    <span className="w-6 text-xs font-mono font-bold text-[#8b949e]">
                      {String.fromCharCode(65 + oIdx)}.
                    </span>
                    <input
                      type="text"
                      required
                      placeholder={`Option ${String.fromCharCode(65 + oIdx)} text...`}
                      value={opt}
                      onChange={(e) => {
                        const newOpts = [...quizForm.options];
                        newOpts[oIdx] = e.target.value;
                        setQuizForm({ ...quizForm, options: newOpts });
                      }}
                      className="flex-1 px-3 py-1.5 rounded-xl bg-[#010409] border border-[#30363d] text-xs text-[#f0f6fc] placeholder-[#8b949e] focus:border-[#58a6ff] outline-none"
                    />
                  </div>
                ))}
              </div>

              {/* Explanation & Difficulty */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#c9d1d9] mb-1">
                    Difficulty:
                  </label>
                  <select
                    value={quizForm.difficulty}
                    onChange={(e) => setQuizForm({ ...quizForm, difficulty: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#010409] border border-[#30363d] text-xs text-[#f0f6fc] outline-none"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#c9d1d9] mb-1">
                    Tags (comma separated):
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. aws, vpc, networking"
                    value={quizForm.tags}
                    onChange={(e) => setQuizForm({ ...quizForm, tags: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#010409] border border-[#30363d] text-xs text-[#f0f6fc] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#c9d1d9] mb-1">
                  Explanation (shown to learners after answering):
                </label>
                <textarea
                  rows={2}
                  value={quizForm.explanation}
                  onChange={(e) => setQuizForm({ ...quizForm, explanation: e.target.value })}
                  placeholder="Explain why the chosen answer is correct..."
                  className="w-full px-3 py-2 rounded-xl bg-[#010409] border border-[#30363d] text-xs text-[#f0f6fc] placeholder-[#8b949e] focus:border-[#58a6ff] outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-[#21262d]">
                <button
                  type="button"
                  onClick={() => setQuizModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#21262d] text-[#c9d1d9] hover:text-white text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={quizSaveLoading}
                  className="px-4 py-2 rounded-xl bg-[#238636] hover:bg-[#2ea043] text-white text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
                >
                  {quizSaveLoading ? <RotateCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>{editingQuiz ? 'Update Question' : 'Save Question'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* INSPECT FILE PREVIEW MODAL */}
      {inspectModalFile && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in"
          onClick={() => setInspectModalFile(null)}
        >
          <div 
            className="bg-[#0d1117] border border-[#30363d] w-full max-w-4xl h-[88vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-[#f0f6fc]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-5 py-3.5 border-b border-[#30363d] bg-[#161b22] flex items-center justify-between gap-3 flex-shrink-0">
              <div className="flex items-center space-x-2 min-w-0">
                {getFileIcon(inspectModalFile)}
                <span className="font-bold text-sm text-white truncate">
                  {(() => {
                    const raw = inspectModalFile?.name || inspectModalFile?.fileName || 'File Preview';
                    try {
                      return decodeURIComponent(raw);
                    } catch {
                      return raw;
                    }
                  })()}
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#21262d] text-[#8b949e] uppercase font-mono">
                  {inspectModalFile?.fileType || 'file'}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setInspectViewMode(inspectViewMode === 'formatted' ? 'raw' : 'formatted')}
                  className="px-2.5 py-1 rounded-lg bg-[#21262d] text-xs font-semibold text-[#c9d1d9] hover:text-white border border-[#30363d]"
                >
                  {inspectViewMode === 'formatted' ? 'View Raw' : 'View Formatted'}
                </button>
                <button
                  onClick={() => setInspectModalFile(null)}
                  className="p-1 rounded-lg text-[#8b949e] hover:text-white hover:bg-[#21262d]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5 custom-scrollbar bg-[#010409]">
              {inspectLoading ? (
                <div className="py-20 text-center text-xs text-[#8b949e] flex items-center justify-center space-x-2">
                  <RotateCw className="w-5 h-5 animate-spin text-[#58a6ff]" />
                  <span>Loading content from GitHub...</span>
                </div>
              ) : inspectViewMode === 'raw' ? (
                <pre className="text-xs font-mono text-[#c9d1d9] whitespace-pre-wrap leading-relaxed">
                  {inspectContent}
                </pre>
              ) : (
                <div className="markdown-content text-sm text-[#c9d1d9] leading-relaxed max-w-3xl mx-auto">
                  <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ code: AdminCodeBlock }}>
                    {inspectContent}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* QUICK URL TESTER MODAL */}
      {testerOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in"
          onClick={() => setTesterOpen(false)}
        >
          <div 
            className="bg-[#0d1117] border border-[#30363d] w-full max-w-xl rounded-2xl p-6 shadow-2xl space-y-4 text-[#f0f6fc]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#30363d]">
              <div className="flex items-center space-x-2">
                <Link2 className="w-5 h-5 text-[#58a6ff]" />
                <h3 className="text-base font-bold text-white">Live GitHub URL Tester</h3>
              </div>
              <button onClick={() => setTesterOpen(false)} className="p-1 text-[#8b949e] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRunTester} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#c9d1d9] mb-1">GitHub File URL:</label>
                <input
                  type="url"
                  required
                  value={testerUrl}
                  onChange={(e) => setTesterUrl(e.target.value)}
                  placeholder="https://github.com/org/repo/blob/main/path/file.ext"
                  className="w-full px-3 py-2 rounded-xl bg-[#010409] border border-[#30363d] text-xs font-mono text-white placeholder-[#8b949e] outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="submit"
                  disabled={testerLoading || !testerUrl.trim()}
                  className="px-4 py-2 rounded-xl bg-[#238636] hover:bg-[#2ea043] text-white text-xs font-bold flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
                >
                  {testerLoading ? <RotateCw className="w-3.5 h-3.5 animate-spin" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>Test URL</span>
                </button>
              </div>
            </form>

            {testerResult && (
              <div className="p-3 rounded-xl border border-[#30363d] bg-[#161b22] text-xs font-mono space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="text-[#8b949e]">Status:</span>
                  <span className={testerResult.success ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                    {testerResult.success ? 'Success 200 OK' : 'Failed'}
                  </span>
                </div>
                {testerResult.message && <p className="text-rose-300">{testerResult.message}</p>}
                {testerResult.fileName && <p className="text-white">File: {testerResult.fileName}</p>}
                {testerResult.rawUrl && <p className="text-[#8b949e] break-all">Raw: {testerResult.rawUrl}</p>}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
