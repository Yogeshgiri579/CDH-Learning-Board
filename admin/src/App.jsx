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
  Shield,
  ArrowRight,
  Activity,
  Star,
  DownloadCloud,
  FileCheck2,
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
      <code className="bg-slate-800 text-amber-300 font-mono text-xs px-1.5 py-0.5 rounded border border-slate-700/60" {...props}>
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
    <div className="relative group my-3 rounded-xl overflow-hidden border border-slate-800 bg-[#060a12]">
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-[#0a0f1d] border-b border-slate-800/80 text-[11px] font-mono text-slate-400">
        <span>{match ? match[1] : 'code'}</span>
        <button
          onClick={handleCopy}
          type="button"
          className="flex items-center space-x-1 px-2 py-0.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
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
      <div className="p-3.5 overflow-x-auto text-xs sm:text-sm font-mono text-slate-200">
        <pre className="!bg-transparent !p-0 !m-0">
          <code>{children}</code>
        </pre>
      </div>
    </div>
  );
};

export function App() {
  const [activeTab, setActiveTab] = useState('importer'); // 'importer' | 'quizzes' | 'sandbox'

  // Sessions state
  const [sessions, setSessions] = useState([]);
  const [selectedSessionNum, setSelectedSessionNum] = useState(0);
  const [sessionSearch, setSessionSearch] = useState('');
  const [backendStatus, setBackendStatus] = useState('checking');

  // Importer Form state
  const [importUrl, setImportUrl] = useState('');
  const [importFileName, setImportFileName] = useState('');
  const [importDescription, setImportDescription] = useState('');
  const [importFileType, setImportFileType] = useState('code');
  const [setAsPrimary, setSetAsPrimary] = useState(true);

  // Live Verify & Preview in Importer
  const [verifying, setVerifying] = useState(false);
  const [verifiedData, setVerifiedData] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);

  // Session Files state
  const [sessionFilesMap, setSessionFilesMap] = useState({}); // { [sessionNum]: files[] }
  const [activeSessionFiles, setActiveSessionFiles] = useState([]);
  const [filesLoading, setFilesLoading] = useState(false);

  // Modal Preview (inspect full file)
  const [inspectModalFile, setInspectModalFile] = useState(null);
  const [inspectContent, setInspectContent] = useState('');
  const [inspectLoading, setInspectLoading] = useState(false);
  const [inspectViewMode, setInspectViewMode] = useState('formatted'); // 'formatted' | 'raw'
  const [inspectCopied, setInspectCopied] = useState(false);

  // Quizzes CRUD state
  const [quizzes, setQuizzes] = useState([]);
  const [quizzesLoading, setQuizzesLoading] = useState(false);
  const [quizSearch, setQuizSearch] = useState('');
  const [quizFilterSession, setQuizFilterSession] = useState('all');
  const [quizFilterModule, setQuizFilterModule] = useState('all');
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

  // Sandbox Tester state
  const [sandboxUrl, setSandboxUrl] = useState('https://github.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge/blob/main/README.md');
  const [sandboxResult, setSandboxResult] = useState(null);
  const [sandboxLoading, setSandboxLoading] = useState(false);
  const [sandboxCopied, setSandboxCopied] = useState(false);

  // Toast
  const [toast, setToast] = useState(null);

  const showToast = (text, type = 'success') => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3500);
  };

  // 1. Fetch sessions from API
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
        console.warn('API error:', e);
      }
    };

    init();
  }, []);

  // 2. Load files for current session
  const loadFilesForSession = async (sNum) => {
    setFilesLoading(true);
    try {
      const res = await api.getSessionFiles(sNum);
      if (res && res.success && res.files) {
        setActiveSessionFiles(res.files);
        setSessionFilesMap((prev) => ({ ...prev, [sNum]: res.files }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFilesLoading(false);
    }
  };

  useEffect(() => {
    loadFilesForSession(selectedSessionNum);
  }, [selectedSessionNum]);

  // 3. Load quizzes when on quizzes tab
  const loadQuizzes = async () => {
    setQuizzesLoading(true);
    try {
      const params = {};
      if (quizFilterSession !== 'all') params.sessionNumber = quizFilterSession;
      if (quizFilterModule !== 'all') params.moduleId = quizFilterModule;
      if (quizSearch.trim()) params.search = quizSearch.trim();

      const res = await api.getQuizzes(params);
      if (res && res.success && res.questions) {
        setQuizzes(res.questions);
      }
    } catch (err) {
      console.error('Error fetching quizzes:', err);
    } finally {
      setQuizzesLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'quizzes') {
      loadQuizzes();
    }
  }, [activeTab, quizFilterSession, quizFilterModule, quizSearch]);

  // Handle URL change with automatic smart name extraction
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

  // Handle Verify & Test Fetch
  const handleVerifyUrl = async () => {
    if (!importUrl.trim()) {
      showToast('Please enter a GitHub URL first', 'error');
      return;
    }
    setVerifying(true);
    setVerifiedData(null);

    try {
      const res = await api.previewGitHubUrl(importUrl.trim());
      if (res && res.success) {
        let cleanName = res.fileName;
        try {
          cleanName = decodeURIComponent(res.fileName);
        } catch {}
        res.fileName = cleanName;
        setVerifiedData(res);
        setImportFileName(cleanName);
        if (res.fileType) setImportFileType(res.fileType);
        showToast(`Successfully verified: ${cleanName} (${res.lineCount || 'image'} lines/bytes)`);
      } else {
        setVerifiedData({ error: res?.message || 'File not found on GitHub. Check URL.' });
      }
    } catch (err) {
      setVerifiedData({ error: err.message || 'Network error fetching GitHub URL' });
    } finally {
      setVerifying(false);
    }
  };

  // Handle Import & Save URL to Session
  const handleSaveImportedUrl = async (e) => {
    e.preventDefault();
    if (!importUrl.trim()) return;

    setSaveLoading(true);
    try {
      let finalName = importFileName.trim() || verifiedData?.fileName || 'custom-file';
      try {
        finalName = decodeURIComponent(finalName);
      } catch {}

      const payload = {
        url: importUrl.trim(),
        name: finalName,
        description: importDescription.trim(),
        fileType: importFileType || verifiedData?.fileType || 'markdown',
        isPrimary: setAsPrimary,
        isDefault: setAsPrimary,
      };

      const res = await api.addSessionFile(selectedSessionNum, payload);
      if (res && res.success) {
        showToast(
          setAsPrimary 
            ? `Imported & set "${payload.name}" as PRIMARY preview for Session #${selectedSessionNum}!` 
            : `Added "${payload.name}" to Session #${selectedSessionNum}!`
        );
        // Reset form
        setImportUrl('');
        setImportFileName('');
        setImportDescription('');
        setVerifiedData(null);
        await loadFilesForSession(selectedSessionNum);
      } else {
        showToast(res?.message || 'Failed to import file to session', 'error');
      }
    } catch (err) {
      showToast(err.message || 'Error saving file', 'error');
    } finally {
      setSaveLoading(false);
    }
  };

  // Set file as primary
  const handleSetPrimary = async (fileId, fileName) => {
    try {
      let cleanName = fileName;
      try { cleanName = decodeURIComponent(fileName); } catch {}
      const res = await api.setPrimarySessionFile(selectedSessionNum, fileId);
      if (res && res.success) {
        showToast(`"${cleanName}" is now the primary file for Session #${selectedSessionNum}!`);
        await loadFilesForSession(selectedSessionNum);
      } else {
        showToast('Failed to set primary file', 'error');
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Delete file
  const handleDeleteFile = async (fileId, fileName) => {
    let cleanName = fileName;
    try { cleanName = decodeURIComponent(fileName); } catch {}
    if (!window.confirm(`Remove "${cleanName}" from Session #${selectedSessionNum}?`)) return;
    try {
      const res = await api.deleteSessionFile(selectedSessionNum, fileId);
      if (res && res.success) {
        showToast(`Removed "${cleanName}"`);
        await loadFilesForSession(selectedSessionNum);
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Full inspect modal
  const handleOpenInspect = async (file) => {
    setInspectModalFile(file);
    setInspectLoading(true);
    setInspectContent('');
    setInspectViewMode('formatted');

    if (file.fileType === 'image') {
      setInspectContent(file.rawUrl || file.githubUrl);
      setInspectLoading(false);
      return;
    }

    // If preloaded content exists (e.g. from verify data)
    if (file.content) {
      setInspectContent(file.content);
      setInspectLoading(false);
      return;
    }

    try {
      const res = await api.previewGitHubUrl(file.githubUrl || file.rawUrl);
      if (res && res.success) {
        setInspectContent(res.content || '');
      } else {
        // Direct raw fallback
        if (file.rawUrl) {
          try {
            const rawRes = await fetch(file.rawUrl);
            if (rawRes.ok) {
              const text = await rawRes.text();
              setInspectContent(text);
              setInspectLoading(false);
              return;
            }
          } catch {}
        }
        setInspectContent(res?.message || 'Could not fetch file content');
      }
    } catch (err) {
      setInspectContent(err.message);
    } finally {
      setInspectLoading(false);
    }
  };

  // Quiz CRUD handlers
  const handleOpenCreateQuiz = () => {
    setEditingQuiz(null);
    setQuizForm({
      sessionNumber: selectedSessionNum,
      moduleId: 'm1',
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
      sessionNumber: q.sessionNumber !== null && q.sessionNumber !== undefined ? q.sessionNumber : '',
      moduleId: q.moduleId || 'm1',
      question: q.question,
      options: [...(q.options || ['', '', '', ''])],
      correctIndex: q.correctIndex || 0,
      explanation: q.explanation || '',
      difficulty: q.difficulty || 'Intermediate',
      tags: (q.tags || []).join(', '),
    });
    setQuizModalOpen(true);
  };

  const handleSaveQuiz = async (e) => {
    e.preventDefault();
    if (!quizForm.question.trim()) {
      showToast('Question text is required', 'error');
      return;
    }
    const cleanOpts = quizForm.options.map((o) => o.trim());
    if (cleanOpts.some((o) => !o)) {
      showToast('All 4 options must be filled', 'error');
      return;
    }

    setQuizSaveLoading(true);
    const payload = {
      ...quizForm,
      options: cleanOpts,
      tags: quizForm.tags.split(',').map((t) => t.trim()).filter(Boolean),
      sessionNumber: quizForm.sessionNumber !== '' ? parseInt(quizForm.sessionNumber, 10) : null,
    };

    try {
      if (editingQuiz) {
        const id = editingQuiz._id || editingQuiz.id;
        const res = await api.updateQuizQuestion(id, payload);
        if (res && res.success) {
          showToast('Quiz question updated!');
          setQuizModalOpen(false);
          loadQuizzes();
        }
      } else {
        const res = await api.createQuizQuestion(payload);
        if (res && res.success) {
          showToast('New question created!');
          setQuizModalOpen(false);
          loadQuizzes();
        }
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setQuizSaveLoading(false);
    }
  };

  const handleDeleteQuiz = async (q) => {
    if (!window.confirm(`Delete question: "${q.question.substring(0, 45)}..."?`)) return;
    try {
      const res = await api.deleteQuizQuestion(q._id || q.id);
      if (res && res.success) {
        showToast('Question deleted');
        loadQuizzes();
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleResetQuizzes = async () => {
    if (!window.confirm('Reset all questions back to the default curriculum bank?')) return;
    try {
      const res = await api.resetQuizzesToDefault();
      if (res && res.success) {
        showToast('Quizzes reset to defaults!');
        loadQuizzes();
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Sandbox run
  const handleRunSandbox = async (e) => {
    e.preventDefault();
    if (!sandboxUrl.trim()) return;
    setSandboxLoading(true);
    setSandboxResult(null);
    try {
      const res = await api.previewGitHubUrl(sandboxUrl.trim());
      setSandboxResult(res);
    } catch (err) {
      setSandboxResult({ success: false, message: err.message });
    } finally {
      setSandboxLoading(false);
    }
  };

  const currentSessionObj = sessions.find((s) => s.sessionNumber === selectedSessionNum) || {
    sessionNumber: selectedSessionNum,
    title: `Session #${selectedSessionNum}`,
    module: `Phase ${(Math.floor(selectedSessionNum / 7) + 1)}`,
    folder: `Session-${String(selectedSessionNum).padStart(2, '0')}`,
  };

  // Filtered session list
  const filteredSessions = sessions.filter((s) => {
    if (!sessionSearch) return true;
    const q = sessionSearch.toLowerCase();
    return s.title.toLowerCase().includes(q) || String(s.sessionNumber).includes(q) || s.module.toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 pb-20">
      
      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-2 text-xs font-semibold animate-in fade-in slide-in-from-bottom-2 ${
          toast.type === 'error' ? 'bg-rose-950/90 border border-rose-800 text-rose-200' : 'bg-emerald-950/90 border border-emerald-800 text-emerald-200'
        }`}>
          {toast.type === 'error' ? <AlertCircle className="w-4 h-4 text-rose-400" /> : <Check className="w-4 h-4 text-emerald-400" />}
          <span>{toast.text}</span>
        </div>
      )}

      {/* Top Header */}
      <header className="border-b border-slate-800 bg-[#0a0f1d]/90 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
              <DownloadCloud className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-base text-white">GitHub<span className="text-amber-400">Importer</span></span>
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider font-mono">
                  Admin CMS
                </span>
                <span className={`inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-[10px] font-mono ${
                  backendStatus === 'online' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                }`}>
                  <Activity className="w-2.5 h-2.5" />
                  <span>API {backendStatus}</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Add custom GitHub files to any session & manage quizzes</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center space-x-1 sm:space-x-2 bg-[#060a12] p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('importer')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                activeTab === 'importer' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              <DownloadCloud className="w-3.5 h-3.5" />
              <span>URL Importer</span>
            </button>

            <button
              onClick={() => setActiveTab('quizzes')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                activeTab === 'quizzes' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Quiz CRUD</span>
            </button>

            <button
              onClick={() => setActiveTab('sandbox')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                activeTab === 'sandbox' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">URL Tester</span>
            </button>
          </div>

          {/* Link to Student LMS */}
          <a
            href="http://localhost:5173"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20 flex items-center space-x-1.5 transition-colors cursor-pointer"
            title="Open Student LMS Portal at http://localhost:5173"
          >
            <span>Open Student LMS</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* TAB 1: GITHUB URL IMPORTER (THE CORE TOOL) */}
        {activeTab === 'importer' && (
          <div className="space-y-6">
            
            {/* HERO CARD: GITHUB URL IMPORTER FORM */}
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#0e1628] via-[#0d1322] to-[#121c33] border border-amber-500/30 shadow-xl space-y-5">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Link2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-extrabold text-white">
                      Import GitHub File to Session
                    </h2>
                    <p className="text-xs text-slate-400">
                      Paste the link of ANY file you created in GitHub (Markdown notes, Terraform config, Dockerfile, Python script, or diagram).
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 self-start sm:self-auto">
                  <span className="text-[11px] text-slate-400 font-mono">Target:</span>
                  <span className="text-xs font-bold text-amber-300 font-mono px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                    Session #{String(selectedSessionNum).padStart(2, '0')}
                  </span>
                </div>
              </div>

              {/* Form Grid */}
              <form onSubmit={handleSaveImportedUrl} className="space-y-4">
                
                {/* Step 1 & Step 2 */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                  
                  {/* Session Dropdown */}
                  <div className="md:col-span-4">
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      1. Choose Target Session:
                    </label>
                    <select
                      value={selectedSessionNum}
                      onChange={(e) => setSelectedSessionNum(parseInt(e.target.value, 10))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#070b14] border border-slate-700 text-slate-100 text-xs font-semibold focus:outline-none focus:border-amber-500"
                    >
                      {(sessions.length > 0 ? sessions : Array.from({ length: 55 }, (_, i) => ({ sessionNumber: i, title: `Session #${i}` }))).map((s) => (
                        <option key={s.sessionNumber} value={s.sessionNumber}>
                          Session #{String(s.sessionNumber).padStart(2, '0')}: {s.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* GitHub URL Input */}
                  <div className="md:col-span-6">
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      2. Paste GitHub File URL:
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="https://github.com/your-org/repo/blob/main/Session-01/your-notes.md"
                      value={importUrl}
                      onChange={(e) => handleImportUrlChange(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#070b14] border border-slate-700 text-slate-100 placeholder-slate-500 text-xs font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Verify Button */}
                  <div className="md:col-span-2">
                    <button
                      type="button"
                      onClick={handleVerifyUrl}
                      disabled={verifying || !importUrl.trim()}
                      className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 hover:border-amber-500/50 text-xs font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {verifying ? (
                        <>
                          <RotateCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Testing...</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5 text-amber-400" />
                          <span>Verify Link</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>

                {/* Verification result preview card */}
                {verifiedData && (
                  <div className={`p-3.5 rounded-xl border text-xs animate-in fade-in ${
                    verifiedData.error
                      ? 'bg-rose-950/20 border-rose-900/50 text-rose-300'
                      : 'bg-emerald-950/20 border-emerald-900/50 text-emerald-300'
                  }`}>
                    {verifiedData.error ? (
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                        <span>{verifiedData.error}</span>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        <div className="flex items-center space-x-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                          <span className="font-bold text-white">Verified: {decodeURIComponent(verifiedData.fileName || '')}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 uppercase">
                            {verifiedData.fileType}
                          </span>
                          <span className="text-slate-400 font-mono text-[11px]">
                            ({verifiedData.lineCount || 'image'} lines/bytes)
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleOpenInspect(verifiedData)}
                          className="text-xs text-cyan-300 hover:underline flex items-center space-x-1"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Preview Full Content</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Additional Settings (Label & Make Primary checkbox) */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
                  
                  <div className="sm:col-span-5">
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Tab Label / File Name:
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. My-Day-1-Summary.md, main.tf, Dockerfile"
                      value={importFileName}
                      onChange={(e) => setImportFileName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#070b14] border border-slate-700 text-slate-100 text-xs font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="sm:col-span-7 flex flex-col justify-end">
                    <label className="flex items-center space-x-2.5 p-2 rounded-xl bg-[#070b14]/70 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors">
                      <input
                        type="checkbox"
                        checked={setAsPrimary}
                        onChange={(e) => setSetAsPrimary(e.target.checked)}
                        className="w-4 h-4 text-amber-500 rounded accent-amber-500 cursor-pointer"
                      />
                      <div className="text-xs">
                        <span className="font-bold text-amber-300 flex items-center space-x-1">
                          <Star className="w-3 h-3 fill-amber-300" />
                          <span>Set as Primary File for Session #{selectedSessionNum}</span>
                        </span>
                        <p className="text-[11px] text-slate-400">
                          Learners in LMS will immediately read this file instead of the default README!
                        </p>
                      </div>
                    </label>
                  </div>

                </div>

                {/* Submit button */}
                <div className="flex justify-end pt-2 border-t border-slate-800">
                  <button
                    type="submit"
                    disabled={saveLoading || !importUrl.trim()}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center space-x-2 cursor-pointer disabled:opacity-50"
                  >
                    {saveLoading ? (
                      <>
                        <RotateCw className="w-4 h-4 animate-spin" />
                        <span>Importing & Saving...</span>
                      </>
                    ) : (
                      <>
                        <DownloadCloud className="w-4 h-4" />
                        <span>Import & Save to Session #{selectedSessionNum}</span>
                      </>
                    )}
                  </button>
                </div>

              </form>

            </div>

            {/* CATALOG & ATTACHED FILES FOR SELECTED SESSION */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: All 55 Sessions Navigation */}
              <div className="lg:col-span-4 bg-[#0d1322] border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Sessions (00–54)
                  </span>
                  <span className="text-[11px] font-mono text-amber-400">
                    {sessions.length || 55} Total
                  </span>
                </div>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Search session..."
                    value={sessionSearch}
                    onChange={(e) => setSessionSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-[#060a12] border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="max-h-[55vh] overflow-y-auto space-y-1.5 custom-scrollbar pr-1">
                  {(filteredSessions.length > 0 ? filteredSessions : Array.from({ length: 55 }, (_, i) => ({
                    sessionNumber: i,
                    title: `Session ${i}`,
                    module: `Phase ${(Math.floor(i / 7) + 1)}`
                  }))).map((s) => {
                    const isSelected = s.sessionNumber === selectedSessionNum;
                    const files = sessionFilesMap[s.sessionNumber] || [];
                    const hasCustom = files.some((f) => !f.isDefault || f.isPrimary);

                    return (
                      <button
                        key={s.id || s.sessionNumber}
                        onClick={() => setSelectedSessionNum(s.sessionNumber)}
                        className={`w-full text-left p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-amber-600/20 border border-amber-500/40 text-white'
                            : 'bg-[#090e1c] hover:bg-slate-800/60 border border-slate-800/80 text-slate-300'
                        }`}
                      >
                        <div className="min-w-0 pr-2">
                          <div className="flex items-center space-x-1.5">
                            <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-800 text-amber-300">
                              #{String(s.sessionNumber).padStart(2, '0')}
                            </span>
                            <span className="text-xs font-semibold truncate">{s.title}</span>
                          </div>
                          <p className="text-[10px] text-slate-400 truncate mt-0.5">{s.module}</p>
                        </div>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Files Configured for this Session */}
              <div className="lg:col-span-8 space-y-4">
                
                <div className="p-4 rounded-2xl bg-[#0d1322] border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono font-bold text-amber-400">
                      Session #{String(selectedSessionNum).padStart(2, '0')}
                    </span>
                    <h3 className="text-base font-extrabold text-white mt-0.5">{currentSessionObj.title}</h3>
                    <p className="text-xs text-slate-400 truncate">
                      LMS Folder: {currentSessionObj.folder}
                    </p>
                  </div>

                  <a
                    href="http://localhost:5173"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-cyan-400" />
                    <span>View in Student LMS</span>
                  </a>
                </div>

                {/* Attached Files List */}
                <div className="p-5 rounded-2xl bg-[#0d1322] border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-2">
                      <FileCode className="w-4 h-4 text-amber-400" />
                      <span>Files Attached to Session #{selectedSessionNum}</span>
                    </h4>

                    <button
                      onClick={() => loadFilesForSession(selectedSessionNum)}
                      className="p-1 rounded text-slate-400 hover:text-white"
                      title="Reload files"
                    >
                      <RotateCw className={`w-3.5 h-3.5 ${filesLoading ? 'animate-spin' : ''}`} />
                    </button>
                  </div>

                  {filesLoading ? (
                    <div className="py-8 text-center text-xs text-slate-400 font-mono">
                      Loading files...
                    </div>
                  ) : activeSessionFiles.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400">
                      No files configured for this session yet. Use the importer above to paste a GitHub URL!
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {activeSessionFiles.map((file) => {
                        const isPrimaryFile = Boolean(file.isDefault);

                        return (
                          <div
                            key={file._id}
                            className={`p-3 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-all ${
                              isPrimaryFile
                                ? 'bg-amber-950/20 border-amber-500/40'
                                : 'bg-[#090e1c] border-slate-800/80'
                            }`}
                          >
                            <div className="min-w-0 flex items-start space-x-3">
                              <div className="w-8 h-8 rounded-lg bg-[#0d1322] border border-slate-800 flex items-center justify-center flex-shrink-0 text-cyan-400">
                                {file.fileType === 'markdown' ? <FileText className="w-4 h-4 text-blue-400" /> :
                                 file.fileType === 'image' ? <ImageIcon className="w-4 h-4 text-purple-400" /> :
                                 file.fileType === 'code' ? <Terminal className="w-4 h-4 text-emerald-400" /> :
                                 <FileCode className="w-4 h-4 text-amber-400" />}
                              </div>

                              <div className="min-w-0">
                                <div className="flex items-center space-x-2">
                                  <span className="font-mono text-xs font-bold text-white truncate">
                                    {decodeURIComponent(file.name || 'file')}
                                  </span>
                                  {isPrimaryFile ? (
                                    <span className="text-[10px] px-2 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 flex items-center space-x-0.5">
                                      <Star className="w-2.5 h-2.5 fill-amber-300" />
                                      <span>Primary View</span>
                                    </span>
                                  ) : (
                                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 uppercase">
                                      {file.fileType}
                                    </span>
                                  )}
                                </div>
                                <p className="text-[10px] font-mono text-slate-500 truncate max-w-md mt-0.5">
                                  {file.githubUrl}
                                </p>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center space-x-1.5 self-end sm:self-center flex-shrink-0">
                              
                              {/* Make Primary button */}
                              {!isPrimaryFile && (
                                <button
                                  onClick={() => handleSetPrimary(file._id, file.name)}
                                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-300 text-xs font-semibold flex items-center space-x-1 transition-colors cursor-pointer"
                                  title="Make this the default file learners see"
                                >
                                  <Star className="w-3 h-3 text-amber-400" />
                                  <span>Make Primary</span>
                                </button>
                              )}

                              {/* Preview */}
                              <button
                                onClick={() => handleOpenInspect(file)}
                                className="px-2 py-1 rounded bg-amber-600/10 hover:bg-amber-600/20 text-amber-300 text-xs font-semibold flex items-center space-x-1 transition-colors cursor-pointer"
                              >
                                <Eye className="w-3 h-3" />
                                <span>Preview</span>
                              </button>

                              {/* External GitHub */}
                              <a
                                href={file.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1 rounded text-slate-400 hover:text-white"
                                title="Open on GitHub"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>

                              {/* Delete (if custom) */}
                              {file._id !== `default_readme_${selectedSessionNum}` && (
                                <button
                                  onClick={() => handleDeleteFile(file._id, file.name)}
                                  className="p-1 rounded text-rose-400 hover:bg-rose-500/10"
                                  title="Delete file link"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}

                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                </div>

              </div>

            </div>

          </div>
        )}

        {/* TAB 2: QUIZ CRUD */}
        {activeTab === 'quizzes' && (
          <div className="space-y-6">
            
            <div className="p-5 rounded-2xl bg-[#0d1322] border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
                  <span>Interactive Quiz Bank CRUD</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/20 text-purple-300">
                    {quizzes.length} Questions
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Manage multiple-choice questions for all sessions. Questions automatically sync with the student LMS quick quiz modal.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleResetQuizzes}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  <RotateCw className="w-3 h-3 inline mr-1" />
                  <span>Restore Defaults</span>
                </button>
                <button
                  onClick={handleOpenCreateQuiz}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-xs sm:text-sm shadow-md flex items-center space-x-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Question</span>
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="p-3.5 rounded-2xl bg-[#0d1322] border border-slate-800 grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-5 relative">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search questions..."
                  value={quizSearch}
                  onChange={(e) => setQuizSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-[#060a12] border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="sm:col-span-4">
                <select
                  value={quizFilterSession}
                  onChange={(e) => setQuizFilterSession(e.target.value)}
                  className="w-full px-3 py-2 bg-[#060a12] border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                >
                  <option value="all">All Sessions (00–54)</option>
                  {(sessions.length > 0 ? sessions : Array.from({ length: 55 }, (_, i) => ({ sessionNumber: i, title: `Session #${i}` }))).map((s) => (
                    <option key={s.sessionNumber} value={s.sessionNumber}>
                      Session #{String(s.sessionNumber).padStart(2, '0')}: {s.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-3">
                <select
                  value={quizFilterModule}
                  onChange={(e) => setQuizFilterModule(e.target.value)}
                  className="w-full px-3 py-2 bg-[#060a12] border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-purple-500"
                >
                  <option value="all">All Modules</option>
                  {modulesList.map((m) => (
                    <option key={m.id} value={m.id}>{m.title}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Questions Cards */}
            {quizzesLoading ? (
              <div className="py-12 text-center text-xs text-slate-400 font-mono">Loading questions...</div>
            ) : quizzes.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">No questions found. Click "Create Question" to add one!</div>
            ) : (
              <div className="space-y-3.5">
                {quizzes.map((q, idx) => (
                  <div key={q._id || q.id || idx} className="p-4 rounded-2xl bg-[#0d1322] border border-slate-800 space-y-3 shadow-md">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <div className="flex items-center space-x-2">
                        {q.sessionNumber !== null && q.sessionNumber !== undefined && (
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
                            Session #{String(q.sessionNumber).padStart(2, '0')}
                          </span>
                        )}
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-500/10 text-purple-300">
                          {q.moduleId?.toUpperCase()}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                          {q.difficulty}
                        </span>
                      </div>

                      <div className="flex items-center space-x-1.5">
                        <button onClick={() => handleOpenEditQuiz(q)} className="p-1 rounded text-slate-400 hover:text-white">
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDeleteQuiz(q)} className="p-1 rounded text-rose-400 hover:bg-rose-500/10">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-sm font-bold text-white">{idx + 1}. {q.question}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {(q.options || []).map((opt, oIdx) => {
                        const isCorrect = oIdx === q.correctIndex;
                        return (
                          <div
                            key={oIdx}
                            className={`p-2.5 rounded-xl border text-xs flex items-center space-x-2 ${
                              isCorrect ? 'bg-emerald-950/30 border-emerald-800/80 text-emerald-200' : 'bg-[#060a12] border-slate-800 text-slate-300'
                            }`}
                          >
                            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                              isCorrect ? 'bg-emerald-500 text-slate-900' : 'bg-slate-800 text-slate-400'
                            }`}>
                              {String.fromCharCode(65 + oIdx)}
                            </span>
                            <span className="flex-1">{opt}</span>
                            {isCorrect && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                          </div>
                        );
                      })}
                    </div>

                    {q.explanation && (
                      <div className="p-2.5 rounded-xl bg-blue-950/20 border border-blue-900/40 text-xs text-slate-300">
                        <strong className="text-blue-300 mr-1">Explanation:</strong> {q.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        {/* TAB 3: URL TESTER */}
        {activeTab === 'sandbox' && (
          <div className="p-5 rounded-2xl bg-[#0d1322] border border-slate-800 space-y-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Link2 className="w-4 h-4 text-amber-400" />
                <span>GitHub URL Direct Sandbox</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Inspect raw content, line counts, and format of any GitHub file URL.
              </p>
            </div>

            <form onSubmit={handleRunSandbox} className="flex gap-2">
              <input
                type="url"
                required
                placeholder="https://github.com/owner/repo/blob/main/folder/file.ext"
                value={sandboxUrl}
                onChange={(e) => setSandboxUrl(e.target.value)}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#060a12] border border-slate-700 text-slate-200 text-xs font-mono focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                disabled={sandboxLoading || !sandboxUrl.trim()}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs cursor-pointer"
              >
                {sandboxLoading ? 'Inspecting...' : 'Inspect URL'}
              </button>
            </form>

            {sandboxResult && (
              <div className="pt-4 border-t border-slate-800 space-y-3">
                {sandboxResult.success ? (
                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-[#090e1c] border border-slate-800 flex items-center justify-between text-xs">
                      <span className="font-bold text-white font-mono">{sandboxResult.fileName} ({sandboxResult.fileType})</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(sandboxResult.content || '');
                          setSandboxCopied(true);
                          setTimeout(() => setSandboxCopied(false), 2000);
                        }}
                        className="px-2 py-1 rounded bg-slate-800 text-xs text-slate-300"
                      >
                        {sandboxCopied ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                    <pre className="p-4 bg-[#060a12] border border-slate-800 rounded-xl font-mono text-xs text-slate-300 overflow-x-auto max-h-[50vh]">
                      {sandboxResult.content}
                    </pre>
                  </div>
                ) : (
                  <div className="p-3 text-xs text-rose-300 bg-rose-950/20 border border-rose-900/50 rounded-xl">
                    {sandboxResult.message}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </main>

      {/* INSPECT MODAL */}
      {inspectModalFile && (() => {
        let cleanTitle = inspectModalFile.fileName || inspectModalFile.name || 'File Preview';
        try {
          cleanTitle = decodeURIComponent(cleanTitle);
        } catch {}
        const isMarkdown = inspectModalFile.fileType === 'markdown' || cleanTitle.toLowerCase().endsWith('.md');
        const isImage = inspectModalFile.fileType === 'image' || Boolean(cleanTitle.match(/\.(png|jpg|jpeg|gif|svg|webp)$/i));
        const lines = inspectContent ? inspectContent.split('\n') : [];

        const handleCopyInspect = () => {
          if (!inspectContent) return;
          navigator.clipboard.writeText(inspectContent);
          setInspectCopied(true);
          setTimeout(() => setInspectCopied(false), 2000);
        };

        return (
          <div 
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-in fade-in"
            onClick={() => setInspectModalFile(null)}
          >
            <div 
              className="bg-[#0d1322] border border-slate-800 w-full max-w-5xl h-[88vh] rounded-2xl flex flex-col overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-5 py-3 border-b border-slate-800 bg-[#0a0f1d] flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
                <div className="flex items-center space-x-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0">
                    {isMarkdown ? <FileText className="w-4 h-4 text-blue-400" /> :
                     isImage ? <ImageIcon className="w-4 h-4 text-purple-400" /> :
                     <Terminal className="w-4 h-4 text-emerald-400" />}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs sm:text-sm font-bold text-white truncate max-w-sm sm:max-w-md">
                        {cleanTitle}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 uppercase border border-slate-700">
                        {inspectModalFile.fileType || 'file'}
                      </span>
                      {lines.length > 0 && !isImage && (
                        <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">
                          ({lines.length} lines)
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {/* View Mode Toggle for Markdown */}
                  {isMarkdown && !isImage && (
                    <div className="flex items-center bg-[#070b14] p-0.5 rounded-lg border border-slate-800 text-xs">
                      <button
                        type="button"
                        onClick={() => setInspectViewMode('formatted')}
                        className={`px-2.5 py-1 rounded-md font-semibold flex items-center space-x-1 transition-all ${
                          inspectViewMode === 'formatted'
                            ? 'bg-amber-600 text-white shadow-xs'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Eye className="w-3 h-3" />
                        <span>Formatted</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setInspectViewMode('raw')}
                        className={`px-2.5 py-1 rounded-md font-semibold flex items-center space-x-1 transition-all ${
                          inspectViewMode === 'raw'
                            ? 'bg-amber-600 text-white shadow-xs'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Code className="w-3 h-3" />
                        <span>Raw Source</span>
                      </button>
                    </div>
                  )}

                  {/* Copy button */}
                  {!isImage && inspectContent && (
                    <button
                      type="button"
                      onClick={handleCopyInspect}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center space-x-1 border border-slate-700 transition-colors cursor-pointer"
                      title="Copy file text"
                    >
                      {inspectCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-bold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  )}

                  {/* External GitHub */}
                  {(inspectModalFile.githubUrl || inspectModalFile.rawUrl) && (
                    <a
                      href={inspectModalFile.githubUrl || inspectModalFile.rawUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      title="Open source on GitHub"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}

                  {/* Close Modal */}
                  <button 
                    onClick={() => setInspectModalFile(null)} 
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content Body */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar bg-[#060a12]">
                {inspectLoading ? (
                  <div className="py-24 flex flex-col items-center justify-center space-y-3">
                    <RotateCw className="w-7 h-7 text-amber-400 animate-spin" />
                    <p className="text-xs text-slate-400 font-mono">Fetching content from GitHub...</p>
                  </div>
                ) : isImage ? (
                  <div className="text-center py-6">
                    <img 
                      src={inspectContent} 
                      alt="Preview" 
                      className="max-h-[65vh] mx-auto object-contain rounded-xl border border-slate-800 shadow-2xl" 
                    />
                  </div>
                ) : isMarkdown && inspectViewMode === 'formatted' ? (
                  <div className="max-w-4xl mx-auto leading-relaxed text-slate-200 text-sm markdown-content">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        code: AdminCodeBlock,
                        h1: ({ children }) => (
                          <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-6 mb-3 pb-2 border-b border-slate-800 flex items-center space-x-2">
                            <span>{children}</span>
                          </h1>
                        ),
                        h2: ({ children }) => (
                          <h2 className="text-lg sm:text-xl font-bold text-slate-100 mt-6 mb-2.5 pb-1 border-b border-slate-800/60">
                            {children}
                          </h2>
                        ),
                        h3: ({ children }) => (
                          <h3 className="text-sm sm:text-base font-bold text-amber-400 mt-4 mb-2">
                            {children}
                          </h3>
                        ),
                        p: ({ children }) => (
                          <p className="my-2.5 text-slate-300 leading-relaxed">{children}</p>
                        ),
                        ul: ({ children }) => (
                          <ul className="list-disc list-inside space-y-1.5 my-3 text-slate-300 pl-2">{children}</ul>
                        ),
                        ol: ({ children }) => (
                          <ol className="list-decimal list-inside space-y-1.5 my-3 text-slate-300 pl-2">{children}</ol>
                        ),
                        li: ({ children }) => (
                          <li className="text-slate-300">{children}</li>
                        ),
                        blockquote: ({ children }) => (
                          <blockquote className="border-l-4 border-amber-500/70 bg-amber-500/5 px-4 py-2 my-3 rounded-r-lg text-slate-300 italic">
                            {children}
                          </blockquote>
                        ),
                        table: ({ children }) => (
                          <div className="overflow-x-auto my-4 rounded-xl border border-slate-800">
                            <table className="w-full text-left text-xs border-collapse">{children}</table>
                          </div>
                        ),
                        th: ({ children }) => (
                          <th className="bg-[#0d1322] text-white font-bold p-2.5 border-b border-slate-800">{children}</th>
                        ),
                        td: ({ children }) => (
                          <td className="p-2.5 border-b border-slate-800/60 text-slate-300">{children}</td>
                        ),
                        hr: () => <hr className="my-6 border-slate-800" />,
                        a: ({ href, children }) => (
                          <a href={href} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">
                            {children}
                          </a>
                        ),
                      }}
                    >
                      {inspectContent}
                    </ReactMarkdown>
                  </div>
                ) : (
                  /* Raw Line Viewer */
                  <div className="overflow-x-auto font-mono text-xs text-slate-300">
                    <table className="w-full border-collapse">
                      <tbody>
                        {lines.map((line, idx) => (
                          <tr key={idx} className="hover:bg-slate-900/50 transition-colors">
                            <td className="w-12 pr-4 select-none text-right text-slate-600 text-xs font-mono align-top py-0.5">
                              {idx + 1}
                            </td>
                            <td className="whitespace-pre font-mono py-0.5 pl-3 border-l border-slate-800/60 text-slate-300">
                              {line || ' '}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* QUIZ CREATE/EDIT MODAL */}
      {quizModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setQuizModalOpen(false)}
        >
          <div 
            className="bg-[#0f172a] border border-slate-700 w-full max-w-2xl rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto custom-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                {editingQuiz ? 'Edit Quiz Question' : 'Create New Quiz Question'}
              </h3>
              <button onClick={() => setQuizModalOpen(false)} className="p-1 rounded text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuiz} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Target Session</label>
                  <select
                    value={quizForm.sessionNumber}
                    onChange={(e) => setQuizForm({ ...quizForm, sessionNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#090d16] border border-slate-700 text-slate-100 text-xs"
                  >
                    <option value="">General (No Session)</option>
                    {(sessions.length > 0 ? sessions : Array.from({ length: 55 }, (_, i) => ({ sessionNumber: i, title: `Session #${i}` }))).map((s) => (
                      <option key={s.sessionNumber} value={s.sessionNumber}>
                        Session #{String(s.sessionNumber).padStart(2, '0')}: {s.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Module</label>
                  <select
                    value={quizForm.moduleId}
                    onChange={(e) => setQuizForm({ ...quizForm, moduleId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#090d16] border border-slate-700 text-slate-100 text-xs"
                  >
                    {modulesList.map((m) => (
                      <option key={m.id} value={m.id}>{m.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Question Prompt</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Enter the quiz question statement..."
                  value={quizForm.question}
                  onChange={(e) => setQuizForm({ ...quizForm, question: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#090d16] border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300">
                  Options & Correct Answer (Click radio to mark correct answer):
                </label>
                {quizForm.options.map((opt, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="correctRadio"
                      checked={quizForm.correctIndex === idx}
                      onChange={() => setQuizForm({ ...quizForm, correctIndex: idx })}
                      className="w-4 h-4 accent-emerald-500 cursor-pointer"
                    />
                    <span className="text-xs font-bold text-slate-400 w-4">{String.fromCharCode(65 + idx)}.</span>
                    <input
                      type="text"
                      required
                      placeholder={`Option ${String.fromCharCode(65 + idx)} text`}
                      value={opt}
                      onChange={(e) => {
                        const copy = [...quizForm.options];
                        copy[idx] = e.target.value;
                        setQuizForm({ ...quizForm, options: copy });
                      }}
                      className="flex-1 px-3 py-1.5 rounded-lg bg-[#060a12] border border-slate-700 text-xs text-slate-100"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Explanation</label>
                <textarea
                  rows={2}
                  placeholder="Explain why the correct answer is right..."
                  value={quizForm.explanation}
                  onChange={(e) => setQuizForm({ ...quizForm, explanation: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#090d16] border border-slate-700 text-slate-100 text-xs"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setQuizModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={quizSaveLoading || !quizForm.question.trim()}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
                >
                  {quizSaveLoading ? 'Saving...' : 'Save Question'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
