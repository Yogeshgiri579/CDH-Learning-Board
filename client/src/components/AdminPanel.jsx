import React, { useState, useEffect, useMemo } from 'react';
import { api } from '../services/api';
import { initialSessions, modulesList } from '../data/sessions';
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
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { Github } from './GithubIcon';

export function AdminPanel({ onBackToLMS, onPreviewSession }) {
  // Navigation tabs in Admin
  const [activeAdminTab, setActiveAdminTab] = useState('files'); // 'files' | 'quizzes' | 'sandbox'

  // Sessions state
  const [sessions, setSessions] = useState(initialSessions);
  const [selectedSessionNumber, setSelectedSessionNumber] = useState(0);
  const [sessionSearch, setSessionSearch] = useState('');

  // Session Files state
  const [sessionFiles, setSessionFiles] = useState([]);
  const [filesLoading, setFilesLoading] = useState(false);
  const [addFileModalOpen, setAddFileModalOpen] = useState(false);
  const [editingFile, setEditingFile] = useState(null);

  // Add/Edit File Form state
  const [fileForm, setFileForm] = useState({
    name: '',
    url: '',
    description: '',
    fileType: 'code',
  });
  const [testFetchLoading, setTestFetchLoading] = useState(false);
  const [testFetchResult, setTestFetchResult] = useState(null);
  const [fileSaveLoading, setFileSaveLoading] = useState(false);

  // Live File Preview Modal (inside Admin)
  const [previewModalFile, setPreviewModalFile] = useState(null);
  const [previewContent, setPreviewContent] = useState('');
  const [previewLoading, setPreviewLoading] = useState(false);

  // Quizzes state
  const [quizzes, setQuizzes] = useState([]);
  const [quizzesLoading, setQuizzesLoading] = useState(false);
  const [quizSearch, setQuizSearch] = useState('');
  const [quizFilterSession, setQuizFilterSession] = useState('all');
  const [quizFilterModule, setQuizFilterModule] = useState('all');
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);

  // Quiz Form state
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

  // Toast / Status Message
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (text, type = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // 1. Fetch sessions from backend
  useEffect(() => {
    const loadSessions = async () => {
      try {
        const res = await api.getSessions();
        if (res && res.success && res.sessions?.length > 0) {
          setSessions(res.sessions);
        }
      } catch (e) {
        console.warn('Using cached sessions in admin');
      }
    };
    loadSessions();
  }, []);

  // 2. Load files for current selected session
  const loadFilesForCurrentSession = async (sNum) => {
    setFilesLoading(true);
    try {
      const res = await api.getSessionFiles(sNum);
      if (res && res.success && res.files) {
        setSessionFiles(res.files);
      }
    } catch (err) {
      console.error('Error fetching session files:', err);
      showToast('Could not load session files from server', 'error');
    } finally {
      setFilesLoading(false);
    }
  };

  useEffect(() => {
    loadFilesForCurrentSession(selectedSessionNumber);
  }, [selectedSessionNumber]);

  // 3. Load all quizzes for Quiz Manager
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
    if (activeAdminTab === 'quizzes') {
      loadQuizzes();
    }
  }, [activeAdminTab, quizFilterSession, quizFilterModule, quizSearch]);

  const currentSession = sessions.find((s) => s.sessionNumber === selectedSessionNumber) || sessions[0];

  // Helper to test fetch GitHub URL in form
  const handleTestFetchUrl = async () => {
    if (!fileForm.url.trim()) return;
    setTestFetchLoading(true);
    setTestFetchResult(null);

    try {
      const res = await api.previewGitHubUrl(fileForm.url.trim());
      if (res && res.success) {
        setTestFetchResult(res);
        // Automatically populate form if empty
        if (!fileForm.name) {
          setFileForm((prev) => ({ ...prev, name: res.fileName, fileType: res.fileType || prev.fileType }));
        }
        showToast(`Verified file: ${res.fileName} (${res.lineCount || 'image'} lines/bytes)`);
      } else {
        setTestFetchResult({ error: res?.message || 'File not found on GitHub' });
      }
    } catch (err) {
      setTestFetchResult({ error: err.message || 'Error connecting to GitHub' });
    } finally {
      setTestFetchLoading(false);
    }
  };

  // Helper to save new or edited file
  const handleSaveFile = async (e) => {
    e.preventDefault();
    if (!fileForm.url.trim()) return;

    setFileSaveLoading(true);
    try {
      if (editingFile) {
        const res = await api.updateSessionFile(selectedSessionNumber, editingFile._id, fileForm);
        if (res && res.success) {
          showToast(`File "${fileForm.name}" updated successfully!`);
          setAddFileModalOpen(false);
          setEditingFile(null);
          loadFilesForCurrentSession(selectedSessionNumber);
        } else {
          showToast(res?.message || 'Failed to update file', 'error');
        }
      } else {
        const res = await api.addSessionFile(selectedSessionNumber, fileForm);
        if (res && res.success) {
          showToast(`File "${fileForm.name || 'Resource'}" attached to Session #${selectedSessionNumber}!`);
          setAddFileModalOpen(false);
          setFileForm({ name: '', url: '', description: '', fileType: 'code' });
          setTestFetchResult(null);
          loadFilesForCurrentSession(selectedSessionNumber);
        } else {
          showToast(res?.message || 'Failed to add file', 'error');
        }
      }
    } catch (err) {
      showToast(err.message || 'Error saving file', 'error');
    } finally {
      setFileSaveLoading(false);
    }
  };

  // Delete session file
  const handleDeleteFile = async (fileId, fileName) => {
    if (!window.confirm(`Are you sure you want to remove "${fileName}" from Session #${selectedSessionNumber}?`)) {
      return;
    }
    try {
      const res = await api.deleteSessionFile(selectedSessionNumber, fileId);
      if (res && res.success) {
        showToast(`Removed "${fileName}"`);
        loadFilesForCurrentSession(selectedSessionNumber);
      } else {
        showToast(res?.message || 'Failed to delete file', 'error');
      }
    } catch (err) {
      showToast(err.message || 'Error deleting file', 'error');
    }
  };

  // Open Preview Modal inside Admin
  const handleOpenAdminPreview = async (file) => {
    setPreviewModalFile(file);
    setPreviewLoading(true);
    setPreviewContent('');

    try {
      if (file.fileType === 'image') {
        setPreviewContent(file.rawUrl || file.githubUrl);
        setPreviewLoading(false);
        return;
      }

      const res = await api.previewGitHubUrl(file.githubUrl || file.rawUrl);
      if (res && res.success) {
        setPreviewContent(res.content || '');
      } else {
        setPreviewContent(`Error: ${res?.message || 'Could not fetch file content'}`);
      }
    } catch (err) {
      setPreviewContent(`Fetch error: ${err.message}`);
    } finally {
      setPreviewLoading(false);
    }
  };

  // Open Quiz Modal (Create or Edit)
  const handleOpenCreateQuiz = () => {
    setEditingQuiz(null);
    setQuizForm({
      sessionNumber: selectedSessionNumber,
      moduleId: currentSession?.moduleId || 'm1',
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

  // Save Quiz Question (Create or Edit)
  const handleSaveQuiz = async (e) => {
    e.preventDefault();
    if (!quizForm.question.trim()) {
      showToast('Please provide a question prompt', 'error');
      return;
    }

    const cleanOptions = quizForm.options.map((opt) => opt.trim());
    if (cleanOptions.some((opt) => !opt)) {
      showToast('All 4 answer options must be filled', 'error');
      return;
    }

    setQuizSaveLoading(true);
    const tagsArray = quizForm.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      ...quizForm,
      options: cleanOptions,
      tags: tagsArray,
      sessionNumber: quizForm.sessionNumber !== '' ? parseInt(quizForm.sessionNumber, 10) : null,
    };

    try {
      if (editingQuiz) {
        const id = editingQuiz._id || editingQuiz.id;
        const res = await api.updateQuizQuestion(id, payload);
        if (res && res.success) {
          showToast('Quiz question updated successfully!');
          setQuizModalOpen(false);
          loadQuizzes();
        } else {
          showToast(res?.message || 'Failed to update question', 'error');
        }
      } else {
        const res = await api.createQuizQuestion(payload);
        if (res && res.success) {
          showToast('New quiz question created successfully!');
          setQuizModalOpen(false);
          loadQuizzes();
        } else {
          showToast(res?.message || 'Failed to create question', 'error');
        }
      }
    } catch (err) {
      showToast(err.message || 'Error saving quiz question', 'error');
    } finally {
      setQuizSaveLoading(false);
    }
  };

  // Delete Quiz Question
  const handleDeleteQuiz = async (q) => {
    const id = q._id || q.id;
    if (!window.confirm(`Delete question: "${q.question.substring(0, 50)}..."?`)) return;

    try {
      const res = await api.deleteQuizQuestion(id);
      if (res && res.success) {
        showToast('Question deleted successfully');
        loadQuizzes();
      } else {
        showToast(res?.message || 'Failed to delete question', 'error');
      }
    } catch (err) {
      showToast(err.message || 'Error deleting question', 'error');
    }
  };

  // Reset Quizzes to Default
  const handleResetQuizzes = async () => {
    if (!window.confirm('Reset all quiz questions back to the default curriculum question bank? This will restore standard questions.')) {
      return;
    }
    try {
      const res = await api.resetQuizzesToDefault();
      if (res && res.success) {
        showToast('Quizzes successfully reset to curriculum defaults!');
        loadQuizzes();
      } else {
        showToast(res?.message || 'Failed to reset quizzes', 'error');
      }
    } catch (err) {
      showToast(err.message || 'Error resetting quizzes', 'error');
    }
  };

  // Sandbox Tester Run
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

  // Filtered session list for session picker
  const filteredSessionsList = sessions.filter((s) => {
    if (!sessionSearch) return true;
    const q = sessionSearch.toLowerCase();
    return s.title.toLowerCase().includes(q) || String(s.sessionNumber).includes(q) || s.module.toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 pb-20">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-2 text-xs font-semibold animate-in fade-in slide-in-from-bottom-2 ${
          toastMessage.type === 'error' 
            ? 'bg-rose-950/90 border border-rose-800 text-rose-200' 
            : 'bg-emerald-950/90 border border-emerald-800 text-emerald-200'
        }`}>
          {toastMessage.type === 'error' ? <AlertCircle className="w-4 h-4 text-rose-400" /> : <Check className="w-4 h-4 text-emerald-400" />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Admin Top Navigation Bar */}
      <div className="border-b border-slate-800 bg-[#0a0f1d]/90 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
              <FolderGit2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-base text-white">CloudDevOps<span className="text-blue-400">Hub</span></span>
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
                  Admin Panel
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">GitHub File Links & Interactive Quiz Manager</p>
            </div>
          </div>

          {/* Tab Navigation Switches */}
          <div className="flex items-center space-x-1 sm:space-x-2 bg-[#060a12] p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveAdminTab('files')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                activeAdminTab === 'files'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Link2 className="w-3.5 h-3.5" />
              <span>GitHub Files</span>
            </button>

            <button
              onClick={() => setActiveAdminTab('quizzes')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                activeAdminTab === 'quizzes'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Quiz CRUD</span>
            </button>

            <button
              onClick={() => setActiveAdminTab('sandbox')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                activeAdminTab === 'sandbox'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">URL Tester</span>
            </button>
          </div>

          {/* Back to LMS Button */}
          <button
            onClick={onBackToLMS}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <span>Exit to LMS</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* TAB 1: GITHUB SESSION FILES MANAGER */}
        {activeAdminTab === 'files' && (
          <div className="space-y-6">
            
            {/* Header info banner */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-purple-950/40 border border-blue-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
                  <span>Session GitHub Files & Code Previews</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/20 text-blue-300">
                    Live Sync
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                  Add direct links to any GitHub file (<code className="text-cyan-300">main.tf</code>, <code className="text-cyan-300">Dockerfile</code>, <code className="text-cyan-300">deploy.sh</code>, notes, or images) to make them instantly previewable and switchable inside the student LMS player.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingFile(null);
                  setFileForm({
                    name: '',
                    url: '',
                    description: '',
                    fileType: 'code',
                  });
                  setTestFetchResult(null);
                  setAddFileModalOpen(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center space-x-2 flex-shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add GitHub File to Session</span>
              </button>
            </div>

            {/* Split layout: Session Selector on Left, Files Manager on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Session Selector */}
              <div className="lg:col-span-4 bg-[#0d1322] border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Select Session (00–54)
                  </span>
                  <span className="text-[11px] font-mono text-blue-400">
                    {sessions.length} Available
                  </span>
                </div>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Search session title..."
                    value={sessionSearch}
                    onChange={(e) => setSessionSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-[#060a12] border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="max-h-[60vh] overflow-y-auto space-y-1.5 custom-scrollbar pr-1">
                  {filteredSessionsList.map((s) => {
                    const isSelected = s.sessionNumber === selectedSessionNumber;
                    return (
                      <button
                        key={s.id || s.sessionNumber}
                        onClick={() => setSelectedSessionNumber(s.sessionNumber)}
                        className={`w-full text-left p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-blue-600/20 border border-blue-500/40 text-white'
                            : 'bg-[#090e1c] hover:bg-slate-800/60 border border-slate-800/80 text-slate-300'
                        }`}
                      >
                        <div className="min-w-0 pr-2">
                          <div className="flex items-center space-x-1.5">
                            <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-800 text-blue-300">
                              #{String(s.sessionNumber).padStart(2, '0')}
                            </span>
                            <span className="text-xs font-semibold truncate">{s.title}</span>
                          </div>
                          <p className="text-[10px] text-slate-400 truncate mt-0.5">{s.module}</p>
                        </div>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Files Attached to Current Session */}
              <div className="lg:col-span-8 space-y-4">
                
                {/* Current Session Summary Card */}
                <div className="p-4 rounded-2xl bg-[#0d1322] border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center space-x-2 text-xs text-slate-400">
                      <span className="font-bold text-blue-400 font-mono">
                        Session #{String(currentSession.sessionNumber).padStart(2, '0')}
                      </span>
                      <span>•</span>
                      <span>{currentSession.module}</span>
                    </div>
                    <h3 className="text-base font-extrabold text-white mt-0.5">{currentSession.title}</h3>
                    <p className="text-xs font-mono text-slate-400 mt-1 truncate max-w-lg">
                      📁 Folder: {currentSession.folder}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onPreviewSession(currentSession)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Preview in LMS</span>
                    </button>
                  </div>
                </div>

                {/* Files List Card */}
                <div className="p-5 rounded-2xl bg-[#0d1322] border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center space-x-2">
                      <FileCode className="w-4 h-4 text-blue-400" />
                      <h4 className="text-sm font-bold text-white">Configured Files for this Session</h4>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400 font-mono">
                        {sessionFiles.length} files
                      </span>
                    </div>

                    <button
                      onClick={() => loadFilesForCurrentSession(selectedSessionNumber)}
                      className="p-1 rounded text-slate-400 hover:text-white"
                      title="Reload files list"
                    >
                      <RotateCw className={`w-3.5 h-3.5 ${filesLoading ? 'animate-spin' : ''}`} />
                    </button>
                  </div>

                  {filesLoading ? (
                    <div className="py-12 text-center text-xs text-slate-400 font-mono flex flex-col items-center justify-center space-y-2">
                      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      <span>Loading session files from database...</span>
                    </div>
                  ) : sessionFiles.length === 0 ? (
                    <div className="py-10 text-center text-xs text-slate-400 space-y-3">
                      <p>No custom files attached to this session yet.</p>
                      <button
                        onClick={() => setAddFileModalOpen(true)}
                        className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold"
                      >
                        Add First File Link
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {sessionFiles.map((f) => (
                        <div
                          key={f._id}
                          className="p-3.5 rounded-xl bg-[#090e1c] border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                        >
                          <div className="min-w-0 flex items-start space-x-3">
                            <div className="w-9 h-9 rounded-xl bg-[#0d1322] border border-slate-800 flex items-center justify-center flex-shrink-0 text-cyan-400">
                              {f.fileType === 'markdown' ? <FileText className="w-4 h-4 text-blue-400" /> :
                               f.fileType === 'image' ? <ImageIcon className="w-4 h-4 text-purple-400" /> :
                               f.fileType === 'code' ? <Terminal className="w-4 h-4 text-emerald-400" /> :
                               <FileCode className="w-4 h-4 text-amber-400" />}
                            </div>

                            <div className="min-w-0">
                              <div className="flex items-center space-x-2">
                                <span className="font-mono text-xs font-bold text-white truncate">{f.name}</span>
                                <span className="text-[10px] px-2 py-0.2 rounded bg-slate-800 text-slate-300 uppercase font-sans">
                                  {f.fileType}
                                </span>
                                {f.isDefault && (
                                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20 font-sans">
                                    Primary Guide
                                  </span>
                                )}
                              </div>
                              {f.description && (
                                <p className="text-xs text-slate-400 mt-0.5 truncate">{f.description}</p>
                              )}
                              <p className="text-[10px] font-mono text-slate-500 truncate max-w-md mt-0.5">
                                {f.githubUrl}
                              </p>
                            </div>
                          </div>

                          {/* File Actions */}
                          <div className="flex items-center space-x-1.5 self-end sm:self-center flex-shrink-0">
                            
                            {/* Live Test Preview Button */}
                            <button
                              onClick={() => handleOpenAdminPreview(f)}
                              className="px-2.5 py-1.5 rounded-lg bg-blue-600/10 hover:bg-blue-600/20 text-blue-300 border border-blue-500/20 text-xs font-semibold flex items-center space-x-1 transition-colors cursor-pointer"
                              title="Live preview file content"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Preview</span>
                            </button>

                            {/* External GitHub link */}
                            <a
                              href={f.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                              title="Open on GitHub"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>

                            {/* Edit File (if not default readme) */}
                            {!f.isDefault && (
                              <button
                                onClick={() => {
                                  setEditingFile(f);
                                  setFileForm({
                                    name: f.name,
                                    url: f.githubUrl,
                                    description: f.description || '',
                                    fileType: f.fileType || 'code',
                                  });
                                  setTestFetchResult(null);
                                  setAddFileModalOpen(true);
                                }}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                                title="Edit file details"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {/* Delete File */}
                            {!f.isDefault && (
                              <button
                                onClick={() => handleDeleteFile(f._id, f.name)}
                                className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10"
                                title="Remove file link"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                </div>

              </div>

            </div>

          </div>
        )}

        {/* TAB 2: QUIZ CRUD MANAGEMENT */}
        {activeAdminTab === 'quizzes' && (
          <div className="space-y-6">
            
            {/* Header info banner */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-blue-950/30 to-indigo-950/40 border border-purple-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
                  <span>Quiz Bank & Question CRUD Manager</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/20 text-purple-300">
                    {quizzes.length} Questions
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                  Create, edit, or delete multiple-choice interactive quiz questions for each session and curriculum module. Changes are instantly saved to the database and reflected in the learner portal.
                </p>
              </div>

              <div className="flex items-center space-x-2 flex-wrap">
                <button
                  onClick={handleResetQuizzes}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
                  title="Reset to default questions bank"
                >
                  <RotateCw className="w-3 h-3 inline mr-1" />
                  <span>Restore Defaults</span>
                </button>

                <button
                  onClick={handleOpenCreateQuiz}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center space-x-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Quiz Question</span>
                </button>
              </div>
            </div>

            {/* Filters Bar */}
            <div className="p-4 rounded-2xl bg-[#0d1322] border border-slate-800 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              
              <div className="sm:col-span-5 relative">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search questions or keywords..."
                  value={quizSearch}
                  onChange={(e) => setQuizSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-[#060a12] border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="sm:col-span-4">
                <select
                  value={quizFilterSession}
                  onChange={(e) => setQuizFilterSession(e.target.value)}
                  className="w-full px-3 py-2 bg-[#060a12] border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="all">All Sessions (00–54)</option>
                  {sessions.map((s) => (
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
                  className="w-full px-3 py-2 bg-[#060a12] border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="all">All Modules</option>
                  {modulesList.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.title}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            {/* Questions List */}
            {quizzesLoading ? (
              <div className="py-16 text-center text-xs text-slate-400 font-mono flex flex-col items-center justify-center space-y-2">
                <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                <span>Loading quiz questions...</span>
              </div>
            ) : quizzes.length === 0 ? (
              <div className="p-12 text-center text-slate-400 bg-[#0d1322] border border-slate-800 rounded-2xl space-y-3">
                <HelpCircle className="w-10 h-10 text-slate-600 mx-auto" />
                <h4 className="text-base font-bold text-white">No questions found</h4>
                <p className="text-xs">Adjust your search filter or create a new question for this session.</p>
                <button
                  onClick={handleOpenCreateQuiz}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold cursor-pointer"
                >
                  Create Question
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {quizzes.map((q, qIndex) => {
                  const sInfo = sessions.find((s) => s.sessionNumber === q.sessionNumber);
                  return (
                    <div
                      key={q._id || q.id || qIndex}
                      className="p-5 rounded-2xl bg-[#0d1322] border border-slate-800 hover:border-slate-700/80 transition-all space-y-3.5 shadow-lg"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-800/80">
                        <div className="flex items-center space-x-2 flex-wrap">
                          {q.sessionNumber !== null && q.sessionNumber !== undefined && (
                            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
                              Session #{String(q.sessionNumber).padStart(2, '0')}
                            </span>
                          )}
                          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                            {q.moduleId?.toUpperCase() || 'MOD'}
                          </span>
                          <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                            {q.difficulty || 'Intermediate'}
                          </span>
                          {sInfo && (
                            <span className="text-xs text-slate-400 hidden md:inline truncate max-w-sm">
                              • {sInfo.title}
                            </span>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2 self-end sm:self-auto">
                          <button
                            onClick={() => handleOpenEditQuiz(q)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                            title="Edit question"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteQuiz(q)}
                            className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                            title="Delete question"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Question Text */}
                      <p className="text-sm sm:text-base font-bold text-white leading-snug">
                        {qIndex + 1}. {q.question}
                      </p>

                      {/* Options Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {(q.options || []).map((opt, optIdx) => {
                          const isCorrect = optIdx === q.correctIndex;
                          return (
                            <div
                              key={optIdx}
                              className={`p-3 rounded-xl border text-xs flex items-center space-x-2.5 ${
                                isCorrect
                                  ? 'bg-emerald-950/30 border-emerald-800/80 text-emerald-200'
                                  : 'bg-[#060a12] border-slate-800/80 text-slate-300'
                              }`}
                            >
                              <span
                                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                                  isCorrect ? 'bg-emerald-500 text-slate-900' : 'bg-slate-800 text-slate-400'
                                }`}
                              >
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                              <span className="font-medium flex-1">{opt}</span>
                              {isCorrect && <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
                            </div>
                          );
                        })}
                      </div>

                      {/* Explanation */}
                      {q.explanation && (
                        <div className="p-3 rounded-xl bg-blue-950/20 border border-blue-900/40 text-xs text-slate-300 leading-relaxed">
                          <strong className="text-blue-300 font-semibold mr-1">Explanation:</strong>
                          {q.explanation}
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

        {/* TAB 3: URL TESTER / SANDBOX */}
        {activeAdminTab === 'sandbox' && (
          <div className="space-y-6">
            
            <div className="p-5 rounded-2xl bg-[#0d1322] border border-slate-800 space-y-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <Link2 className="w-4 h-4 text-cyan-400" />
                  <span>GitHub URL Direct Inspector & Sandbox</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Test and inspect any public GitHub repository file (Blob link, Raw link, or folder link). Verify line counts, detect file language, and inspect raw content instantly.
                </p>
              </div>

              <form onSubmit={handleRunSandbox} className="space-y-3">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <input
                    type="url"
                    required
                    placeholder="https://github.com/owner/repo/blob/main/folder/file.ext"
                    value={sandboxUrl}
                    onChange={(e) => setSandboxUrl(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#060a12] border border-slate-700 text-slate-200 placeholder-slate-500 text-xs font-mono focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={sandboxLoading || !sandboxUrl.trim()}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                  >
                    {sandboxLoading ? (
                      <>
                        <RotateCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Inspecting...</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect & Fetch</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Sandbox Results */}
              {sandboxResult && (
                <div className="pt-4 border-t border-slate-800 space-y-4">
                  {sandboxResult.success ? (
                    <div className="space-y-3">
                      {/* Meta stats bar */}
                      <div className="p-3.5 rounded-xl bg-[#090e1c] border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div className="flex items-center space-x-3">
                          <span className="font-bold text-white font-mono">{sandboxResult.fileName}</span>
                          <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 font-sans uppercase text-[10px]">
                            {sandboxResult.fileType}
                          </span>
                          <span className="text-slate-400 font-mono">{sandboxResult.lineCount || 'image'} lines</span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(sandboxResult.content || sandboxResult.rawUrl);
                              setSandboxCopied(true);
                              setTimeout(() => setSandboxCopied(false), 2000);
                            }}
                            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium flex items-center space-x-1 cursor-pointer"
                          >
                            {sandboxCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{sandboxCopied ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Content Preview */}
                      {sandboxResult.isImage ? (
                        <div className="p-4 bg-[#060a12] border border-slate-800 rounded-xl text-center">
                          <img
                            src={sandboxResult.rawUrl}
                            alt={sandboxResult.fileName}
                            className="max-h-96 mx-auto rounded-lg object-contain"
                          />
                        </div>
                      ) : (
                        <div className="p-4 bg-[#060a12] border border-slate-800 rounded-xl font-mono text-xs text-slate-300 overflow-x-auto max-h-[60vh] custom-scrollbar">
                          <pre className="!bg-transparent !p-0 !m-0 whitespace-pre">
                            {sandboxResult.content}
                          </pre>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/50 text-xs text-rose-300 flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                      <span>{sandboxResult.message || 'Inspection failed. Please verify GitHub URL.'}</span>
                    </div>
                  )}
                </div>
              )}

            </div>

          </div>
        )}

      </div>

      {/* MODAL: ADD / EDIT GITHUB FILE */}
      {addFileModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setAddFileModalOpen(false)}
        >
          <div 
            className="bg-[#0f172a] border border-slate-700 w-full max-w-xl rounded-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto custom-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <FolderGit2 className="w-5 h-5 text-blue-400" />
                <h3 className="text-base font-bold text-white">
                  {editingFile ? 'Edit Session File' : `Attach GitHub File to Session #${selectedSessionNumber}`}
                </h3>
              </div>
              <button
                onClick={() => setAddFileModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFile} className="space-y-4">
              
              {/* URL Input with Test Fetch Button */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  GitHub File URL <span className="text-rose-400">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    required
                    placeholder="https://github.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge/blob/main/Session-01-.../main.tf"
                    value={fileForm.url}
                    onChange={(e) => setFileForm({ ...fileForm, url: e.target.value })}
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#090d16] border border-slate-700 text-slate-100 placeholder-slate-500 text-xs font-mono focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleTestFetchUrl}
                    disabled={testFetchLoading || !fileForm.url.trim()}
                    className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-xs font-semibold flex items-center space-x-1 cursor-pointer disabled:opacity-50"
                    title="Validate & preview link"
                  >
                    {testFetchLoading ? (
                      <RotateCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Eye className="w-3.5 h-3.5" />
                    )}
                    <span>Verify</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Supports GitHub blob links, rawusercontent URLs, and public repo paths.
                </p>
              </div>

              {/* Test Fetch Verification Card */}
              {testFetchResult && (
                <div className={`p-3 rounded-xl border text-xs ${
                  testFetchResult.error
                    ? 'bg-rose-950/20 border-rose-900/40 text-rose-300'
                    : 'bg-emerald-950/20 border-emerald-900/40 text-emerald-300'
                }`}>
                  {testFetchResult.error ? (
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                      <span>{testFetchResult.error}</span>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1.5 font-bold text-white">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Verified: {testFetchResult.fileName}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-mono">
                        Type: {testFetchResult.fileType} | Size: {testFetchResult.lineCount || 'Image'} lines/bytes
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* File Display Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  File Display Name / Tab Label <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. main.tf, Dockerfile, deploy.sh, Architecture Diagram"
                  value={fileForm.name}
                  onChange={(e) => setFileForm({ ...fileForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#090d16] border border-slate-700 text-slate-100 placeholder-slate-500 text-xs font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* File Type */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    File Type
                  </label>
                  <select
                    value={fileForm.fileType}
                    onChange={(e) => setFileForm({ ...fileForm, fileType: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#090d16] border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-blue-500"
                  >
                    <option value="code">Source Code / Script</option>
                    <option value="markdown">Markdown Notes (.md)</option>
                    <option value="yaml">YAML / Manifest</option>
                    <option value="terraform">Terraform (.tf / HCL)</option>
                    <option value="docker">Dockerfile</option>
                    <option value="image">Diagram / Image (.png / .svg)</option>
                    <option value="json">JSON / Config</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Target Session
                  </label>
                  <input
                    type="text"
                    disabled
                    value={`Session #${selectedSessionNumber}: ${currentSession.title}`}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-400 text-xs truncate"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Description / Learner Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Production Terraform module configuring multi-AZ VPC, subnets and NAT gateways"
                  value={fileForm.description}
                  onChange={(e) => setFileForm({ ...fileForm, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#090d16] border border-slate-700 text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setAddFileModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={fileSaveLoading || !fileForm.url.trim()}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
                >
                  {fileSaveLoading ? (
                    <RotateCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}
                  <span>{editingFile ? 'Update File' : 'Save File Link'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL: LIVE PREVIEW OF FILE (INSIDE ADMIN) */}
      {previewModalFile && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in"
          onClick={() => setPreviewModalFile(null)}
        >
          <div 
            className="bg-[#0d1322] border border-slate-800 w-full max-w-4xl h-[85vh] rounded-2xl flex flex-col overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-5 py-3 border-b border-slate-800 bg-[#0a0f1d] flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <FileCode className="w-4 h-4 text-cyan-400" />
                <span className="font-mono text-sm font-bold text-white">{previewModalFile.name}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 uppercase">
                  {previewModalFile.fileType}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <a
                  href={previewModalFile.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white"
                  title="Open GitHub source"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  onClick={() => setPreviewModalFile(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5 custom-scrollbar bg-[#060a12]">
              {previewLoading ? (
                <div className="h-64 flex flex-col items-center justify-center space-y-2 text-xs text-slate-400 font-mono">
                  <div className="w-7 h-7 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  <span>Loading file from GitHub...</span>
                </div>
              ) : previewModalFile.fileType === 'image' ? (
                <div className="text-center p-4">
                  <img
                    src={previewContent}
                    alt={previewModalFile.name}
                    className="max-h-[65vh] mx-auto rounded-lg object-contain"
                  />
                </div>
              ) : (
                <pre className="text-xs font-mono text-slate-200 whitespace-pre">
                  {previewContent}
                </pre>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CREATE / EDIT QUIZ QUESTION */}
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
              <div className="flex items-center space-x-2">
                <HelpCircle className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold text-white">
                  {editingQuiz ? 'Edit Quiz Question' : 'Create New Quiz Question'}
                </h3>
              </div>
              <button
                onClick={() => setQuizModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuiz} className="space-y-4">
              
              {/* Target Session & Module */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Associated Session (00–54)
                  </label>
                  <select
                    value={quizForm.sessionNumber}
                    onChange={(e) => setQuizForm({ ...quizForm, sessionNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#090d16] border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-purple-500"
                  >
                    <option value="">General Module Question (No Session)</option>
                    {sessions.map((s) => (
                      <option key={s.sessionNumber} value={s.sessionNumber}>
                        Session #{String(s.sessionNumber).padStart(2, '0')}: {s.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Curriculum Module
                  </label>
                  <select
                    value={quizForm.moduleId}
                    onChange={(e) => setQuizForm({ ...quizForm, moduleId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#090d16] border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-purple-500"
                  >
                    {modulesList.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Question Prompt */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Question Text <span className="text-rose-400">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Which Terraform command is used to review execution plan changes before applying?"
                  value={quizForm.question}
                  onChange={(e) => setQuizForm({ ...quizForm, question: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#090d16] border border-slate-700 text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Answer Options */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-300">
                    Options & Correct Answer <span className="text-rose-400">*</span>
                  </label>
                  <span className="text-[11px] text-emerald-400 font-medium">
                    (Click radio button to mark correct answer)
                  </span>
                </div>

                {quizForm.options.map((opt, idx) => {
                  const isChecked = quizForm.correctIndex === idx;
                  return (
                    <div
                      key={idx}
                      className={`p-2 rounded-xl border flex items-center space-x-2.5 transition-all ${
                        isChecked
                          ? 'bg-emerald-950/20 border-emerald-800/80'
                          : 'bg-[#090d16] border-slate-800'
                      }`}
                    >
                      <input
                        type="radio"
                        name="correctAnswerRadio"
                        checked={isChecked}
                        onChange={() => setQuizForm({ ...quizForm, correctIndex: idx })}
                        className="w-4 h-4 text-emerald-500 accent-emerald-500 cursor-pointer"
                        title="Mark as correct answer"
                      />
                      <span className="text-xs font-mono font-bold text-slate-400 w-4">
                        {String.fromCharCode(65 + idx)}.
                      </span>
                      <input
                        type="text"
                        required
                        placeholder={`Option ${String.fromCharCode(65 + idx)} text`}
                        value={opt}
                        onChange={(e) => {
                          const updated = [...quizForm.options];
                          updated[idx] = e.target.value;
                          setQuizForm({ ...quizForm, options: updated });
                        }}
                        className="flex-1 px-3 py-1.5 rounded-lg bg-[#060a12] border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  );
                })}
              </div>

              {/* Explanation */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Answer Explanation
                </label>
                <textarea
                  rows={2}
                  placeholder="Explain why the marked answer is correct to reinforce learning."
                  value={quizForm.explanation}
                  onChange={(e) => setQuizForm({ ...quizForm, explanation: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#090d16] border border-slate-700 text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Difficulty & Tags */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Difficulty Level
                  </label>
                  <select
                    value={quizForm.difficulty}
                    onChange={(e) => setQuizForm({ ...quizForm, difficulty: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#090d16] border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-purple-500"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Tags (Comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. AWS, IAM, S3, Security"
                    value={quizForm.tags}
                    onChange={(e) => setQuizForm({ ...quizForm, tags: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#090d16] border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setQuizModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={quizSaveLoading || !quizForm.question.trim()}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-xs font-bold shadow-md transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
                >
                  {quizSaveLoading ? (
                    <RotateCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}
                  <span>{editingQuiz ? 'Update Question' : 'Save Question'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
