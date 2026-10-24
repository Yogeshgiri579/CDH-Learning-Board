import React, { useState, useEffect, useMemo, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { 
  X, 
  ExternalLink, 
  CheckCircle2, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Copy, 
  Check, 
  RotateCw,
  FolderGit2,
  Lock,
  FileCode,
  FileText,
  Image as ImageIcon,
  Terminal,
  AlertCircle,
  BookOpen
} from 'lucide-react';
import { Github } from './GithubIcon';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

// Helper component for markdown code blocks with copy button
const CodeBlock = ({ className, children, ...props }) => {
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
        <span>{match ? match[1] : 'bash'}</span>
        <button
          onClick={handleCopy}
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
      <div className="p-3.5 overflow-x-auto text-xs sm:text-sm font-mono text-[#1f2328] dark:text-[#e6edf3]">
        <pre className="!bg-transparent !p-0 !m-0 font-mono text-[#1f2328] dark:text-[#e6edf3]">
          <code className="text-[#1f2328] dark:text-[#e6edf3] font-mono">{children}</code>
        </pre>
      </div>
    </div>
  );
};

// Raw Code Viewer with line numbers for standalone non-markdown files (.tf, .yaml, .py, .sh, Dockerfile)
const RawCodeViewer = ({ content, fileName, language }) => {
  const [copied, setCopied] = useState(false);
  const lines = useMemo(() => (content || '').split('\n'), [content]);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-[#30363d] bg-[#010409] overflow-hidden my-2 shadow-xl">
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#161b22] border-b border-[#30363d] text-xs font-mono text-[#8b949e]">
        <div className="flex items-center space-x-2">
          <FileCode className="w-4 h-4 text-[#58a6ff]" />
          <span className="text-white font-bold">{fileName}</span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-[#21262d] text-[#c9d1d9] border border-[#30363d] uppercase font-sans">
            {language || 'code'}
          </span>
          <span className="text-[#8b949e] text-[11px]">{lines.length} lines</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] hover:text-white transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-semibold">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy File</span>
            </>
          )}
        </button>
      </div>

      <div className="overflow-x-auto p-4 font-mono text-xs sm:text-sm text-[#1f2328] dark:text-[#e6edf3] bg-[#f6f8fa] dark:bg-[#010409] max-h-[70vh]">
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((line, idx) => (
              <tr key={idx} className="hover:bg-[#eaeef2] dark:hover:bg-[#161b22]/70 transition-colors">
                <td className="w-10 pr-4 select-none text-right text-[#8c959f] dark:text-[#484f58] text-xs font-mono align-top py-0.5">
                  {idx + 1}
                </td>
                <td className="whitespace-pre font-mono py-0.5 pl-2 border-l border-[#d0d7de] dark:border-[#21262d] text-[#1f2328] dark:text-[#c9d1d9]">
                  {line || ' '}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Fallback generator if GitHub rate-limits or repo folder name diverges
function generateFallbackNotes(s) {
  if (!s) return '';
  return `# ${s.title}
*CloudDevOpsHub 55-Session MultiCloud DevOps with AI Challenge*

**Module:** ${s.module}  
**Estimated Time:** ${s.duration} | **Level:** ${s.difficulty}

---

## 📌 Session Overview
${s.preview}

---

## 🚀 Core Learning Objectives
${(s.topics || []).map((t, idx) => `${idx + 1}. **${t}**`).join('\n')}

---

## 🛠️ Hands-on Tasks & Exercises
${(s.labs || []).map((l, idx) => `### Task 0${idx + 1}: ${l}
\`\`\`bash
# Clone / checkout the session workspace
git checkout main
cd "${s.folder}"

# Execute task steps and verify results
echo "Working on: ${l}"
\`\`\`
`).join('\n')}

---

## 💡 Practical DevOps Engineering Takeaways
- Ensure all commands and infrastructure scripts adhere to the **Shared Responsibility Model**.
- Always verify your local Git branch hygiene and push your lab completion PR.
- Take the interactive quick quiz to test your conceptual recall!
`;
}

export const GitHubPreviewModal = ({ 
  session, 
  allSessions = [],
  onClose, 
  onSelectSession, 
  onOpenQuiz 
}) => {
  const { isCompleted, toggleComplete, isAuthenticated, loading: authLoading, token, openAuthModal } = useAuth();

  // Session files state
  const [sessionFiles, setSessionFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filesLoading, setFilesLoading] = useState(true);

  // Content state
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [fontSize, setFontSize] = useState('text-sm'); // 'text-xs' | 'text-sm' | 'text-base'
  const [errorMsg, setErrorMsg] = useState('');

  const sessionNumber = session?.sessionNumber;
  const folderSafe = session?.folder || `Session-${String(session?.sessionNumber || 0).padStart(2, '0')}`;
  const isFree = session ? session.sessionNumber < 5 : false;
  const isLocked = session ? (!isFree && !isAuthenticated && !(authLoading && token)) : false;
  const completed = session ? isCompleted(session.sessionNumber) : false;

  // Determine current index for Prev/Next navigation
  const currentIndex = session ? allSessions.findIndex((s) => s.sessionNumber === session.sessionNumber) : -1;
  const prevSession = currentIndex > 0 ? allSessions[currentIndex - 1] : null;
  const nextSession = currentIndex >= 0 && currentIndex < allSessions.length - 1 ? allSessions[currentIndex + 1] : null;

  // Track active session for smooth restoration
  useEffect(() => {
    if (sessionNumber !== undefined) {
      try {
        localStorage.setItem('lastActiveSession', String(sessionNumber));
      } catch {}
    }
  }, [sessionNumber]);

  // Reset loading states immediately when session changes so README doesn't flash
  useEffect(() => {
    if (!session) return;
    setLoading(true);
    setFilesLoading(true);
    setContent('');
    setErrorMsg('');
    setSelectedFile(null);
    setSessionFiles([]);
  }, [sessionNumber]);

  // Load session files (README + custom uploaded GitHub files from backend)
  useEffect(() => {
    if (!session) return;

    let isMounted = true;
    const fetchFiles = async () => {
      setFilesLoading(true);
      try {
        const res = await api.getSessionFiles(session.sessionNumber);
        if (isMounted && res && res.success && res.files && res.files.length > 0) {
          setSessionFiles(res.files);
          // Prioritize the file marked as isDefault / primary (e.g. uploaded markdown file)
          const primaryFile = res.files.find((f) => f.isDefault) || res.files[0];
          setSelectedFile(primaryFile);
        } else if (isMounted) {
          // If no custom files attached in DB, build standard default README
          const fallbackDefault = {
            _id: 'default_readme',
            name: 'README.md',
            fileType: 'markdown',
            githubUrl: session.githubUrl,
            rawUrl: `https://raw.githubusercontent.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge/main/${encodeURIComponent(folderSafe)}/README.md`,
            isDefault: true,
          };
          setSessionFiles([fallbackDefault]);
          setSelectedFile(fallbackDefault);
        }
      } catch (err) {
        console.warn('Failed to load session files, fallback to default README:', err);
        if (isMounted) {
          const fallbackDefault = {
            _id: 'default_readme',
            name: 'README.md',
            fileType: 'markdown',
            githubUrl: session.githubUrl,
            rawUrl: `https://raw.githubusercontent.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge/main/${encodeURIComponent(folderSafe)}/README.md`,
            isDefault: true,
          };
          setSessionFiles([fallbackDefault]);
          setSelectedFile(fallbackDefault);
        }
      } finally {
        if (isMounted) {
          setFilesLoading(false);
        }
      }
    };

    fetchFiles();
    return () => {
      isMounted = false;
    };
  }, [sessionNumber, session?.githubUrl, folderSafe]);

  // Load content whenever selectedFile or session changes
  const loadContent = useCallback(async () => {
    if (!session) return;

    if (isLocked) {
      setLoading(false);
      setContent('');
      setErrorMsg('');
      return;
    }

    // Do NOT load or display fallback notes while files are still fetching or before selectedFile is set
    if (filesLoading || !selectedFile) {
      return;
    }

    setLoading(true);
    setErrorMsg('');

    const file = selectedFile;

    // Helper to get raw URL
    const getCleanRawUrl = (f) => {
      if (!f) return '';
      if (f.rawUrl) return f.rawUrl;
      if (f.githubUrl && f.githubUrl.includes('github.com/') && f.githubUrl.includes('/blob/')) {
        return f.githubUrl.replace('github.com/', 'raw.githubusercontent.com/').replace('/blob/', '/');
      }
      return f.githubUrl || '';
    };

    // Case 1: Image file
    if (file.fileType === 'image' || file.name?.match(/\.(png|jpg|jpeg|gif|svg|webp)$/i)) {
      const imgUrl = getCleanRawUrl(file);
      setContent(imgUrl);
      setLoading(false);
      return;
    }

    // Case 2: Pre-loaded content
    if (file.content) {
      setContent(file.content);
      setLoading(false);
      return;
    }

    // Identify if this file is strictly the built-in synthetic session default README tab
    const isSystemDefaultReadme = 
      file._id === 'default_readme' || 
      file._id === `default_readme_${session.sessionNumber}`;

    // Case 3: Any custom attached GitHub file (custom notes, scripts, markdown, primary file)
    if (!isSystemDefaultReadme && (file.githubUrl || file.rawUrl)) {
      const targetUrl = file.githubUrl || file.rawUrl;
      try {
        const res = await api.previewGitHubUrl(targetUrl);
        if (res && res.success && res.content !== undefined) {
          setContent(res.content);
          setLoading(false);
          return;
        } else {
          // If server preview fails, try direct fetch from raw URL
          const rawUrlFallback = getCleanRawUrl(file);
          if (rawUrlFallback) {
            try {
              const directRes = await fetch(rawUrlFallback, { signal: AbortSignal.timeout ? AbortSignal.timeout(6000) : undefined });
              if (directRes.ok) {
                const text = await directRes.text();
                setContent(text);
                setLoading(false);
                return;
              }
            } catch {}
          }
          setErrorMsg(res?.message || 'Failed to load GitHub file content. Please check branch and path.');
          setLoading(false);
          return;
        }
      } catch (err) {
        console.warn('Failed to fetch GitHub file via server preview:', err);
        // Client direct fetch fallback
        const rawUrlFallback = getCleanRawUrl(file);
        if (rawUrlFallback) {
          try {
            const directRes = await fetch(rawUrlFallback, { signal: AbortSignal.timeout ? AbortSignal.timeout(6000) : undefined });
            if (directRes.ok) {
              const text = await directRes.text();
              setContent(text);
              setLoading(false);
              return;
            }
          } catch {}
        }
        setErrorMsg(err.message || 'Error loading file from GitHub');
        setLoading(false);
        return;
      }
    }

    // Case 4: Official Session default README
    if (isSystemDefaultReadme) {
      try {
        const res = await api.getSessionReadme(session.sessionNumber);
        if (res && res.success && res.content) {
          setContent(res.content);
          setLoading(false);
          return;
        }
      } catch (apiErr) {
        console.warn('Backend readme fetch failed, attempting client direct fetch:', apiErr);
      }

      // Client direct fetch fallback
      try {
        const rawUrl1 = file.rawUrl || `https://raw.githubusercontent.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge/main/${encodeURIComponent(folderSafe)}/README.md`;
        const res = await fetch(rawUrl1, { signal: AbortSignal.timeout ? AbortSignal.timeout(5000) : undefined });
        if (res.ok) {
          const text = await res.text();
          setContent(text);
          setLoading(false);
          return;
        }
      } catch {}

      setContent(generateFallbackNotes(session));
      setLoading(false);
      return;
    }

    // Ultimate fallback
    setContent(generateFallbackNotes(session));
    setLoading(false);
  }, [session, isLocked, folderSafe, selectedFile, filesLoading]);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  // Determine current viewing mode
  const currentFileType = selectedFile?.fileType || 'markdown';
  const isImageFile = currentFileType === 'image' || Boolean(selectedFile?.name?.match(/\.(png|jpg|jpeg|gif|svg|webp)$/i));
  const isMarkdown = currentFileType === 'markdown' || selectedFile?.name?.toLowerCase().endsWith('.md');

  // File type icon helper
  const getFileIcon = (file) => {
    const ext = file.name?.toLowerCase().split('.').pop();
    if (ext === 'md') return <FileText className="w-3.5 h-3.5 text-[#58a6ff]" />;
    if (ext === 'sh' || ext === 'bash') return <Terminal className="w-3.5 h-3.5 text-emerald-400" />;
    if (['png', 'jpg', 'jpeg', 'svg', 'webp'].includes(ext)) return <ImageIcon className="w-3.5 h-3.5 text-purple-400" />;
    return <FileCode className="w-3.5 h-3.5 text-amber-400" />;
  };

  if (!session) return null;

  return (
    <div className="fixed inset-0 z-[55] bg-black/85 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
      <div 
        className="relative bg-[#0d1117] border border-[#30363d] w-full max-w-5xl h-[92vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-[#f0f6fc]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Header Bar */}
        <div className="px-4 sm:px-6 py-3 border-b border-[#30363d] bg-[#161b22] flex items-center justify-between gap-3 flex-shrink-0">
          
          {/* Breadcrumb & Repo Info */}
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#21262d] border border-[#30363d] flex items-center justify-center text-[#58a6ff] flex-shrink-0">
              <FolderGit2 className="w-4 h-4" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center space-x-2 text-xs font-mono text-[#8b949e]">
                <span className="text-[#58a6ff] font-bold truncate">CloudDevOpsHub</span>
                <span>/</span>
                <span className="text-[#c9d1d9] font-medium truncate">MultiCloud-DevOps-AI</span>
                <span className="hidden md:inline px-1.5 py-0.2 rounded bg-[#21262d] text-[10px] text-[#8b949e] border border-[#30363d]">
                  main
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-extrabold text-white truncate flex items-center space-x-2">
                <span>Session #{session.sessionNumber.toString().padStart(2, '0')}: {session.title}</span>
              </h2>
            </div>
          </div>

          {/* Action Tools Header */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            
            {/* Take Quick Quiz CTA Button */}
            <button
              onClick={() => onOpenQuiz(session)}
              className="px-3 py-1.5 rounded-lg bg-[#238636] hover:bg-[#2ea043] text-white text-xs font-semibold shadow-xs flex items-center space-x-1.5 transition-all cursor-pointer"
              title="Test your understanding with a quick quiz"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">Quick Quiz</span>
              <span className="sm:hidden">Quiz</span>
            </button>

            {/* External GitHub Link */}
            <a
              href={selectedFile?.githubUrl || session.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 sm:px-2.5 sm:py-1.5 rounded-lg border border-[#30363d] bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] hover:text-white text-xs font-semibold transition-colors flex items-center space-x-1.5 cursor-pointer"
              title="Open file or repository on GitHub"
            >
              <Github className="w-3.5 h-3.5 text-white" />
              <ExternalLink className="w-3 h-3 text-[#8b949e] hidden sm:inline" />
            </a>

            {/* Close Modal */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#8b949e] hover:text-white hover:bg-[#21262d] transition-colors cursor-pointer"
              title="Close reader"
            >
              <X className="w-5 h-5" />
            </button>

          </div>
        </div>

        {/* File Tabs Switcher Bar */}
        <div className="px-4 sm:px-6 py-2 border-b border-[#30363d] bg-[#0d1117] flex items-center justify-between gap-3 flex-shrink-0 overflow-x-auto custom-scrollbar">
          <div className="flex items-center space-x-1.5 min-w-0 flex-shrink-0">
            <span className="text-[11px] font-semibold text-[#8b949e] uppercase tracking-wider mr-1 hidden sm:inline">
              Session Files:
            </span>

            {filesLoading && sessionFiles.length === 0 ? (
              <div className="flex items-center space-x-2 py-1 px-2 text-xs text-[#8b949e]">
                <RotateCw className="w-3 h-3 animate-spin text-[#58a6ff]" />
                <span>Loading files...</span>
              </div>
            ) : (
              sessionFiles.map((file) => {
                const isCurrent = selectedFile?._id === file._id;
                let displayName = file.name || 'file';
                try {
                  displayName = decodeURIComponent(file.name);
                } catch {}

                return (
                  <button
                    key={file._id}
                    onClick={() => setSelectedFile(file)}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-[#21262d] text-white border border-[#30363d] shadow-xs'
                        : 'bg-[#161b22] hover:bg-[#21262d] text-[#8b949e] hover:text-[#f0f6fc] border border-[#21262d]'
                    }`}
                    title={file.description || displayName}
                  >
                    {getFileIcon(file)}
                    <span className="font-mono text-[11px] sm:text-xs truncate max-w-[170px]">{displayName}</span>
                    {file.isDefault && (
                      <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 font-sans ml-1 border border-amber-500/30">
                        primary
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Reading Controls */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            {isMarkdown && (
              <div className="hidden sm:flex items-center bg-[#161b22] border border-[#30363d] rounded-md p-0.5">
                <button
                  onClick={() => setFontSize('text-xs')}
                  className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${fontSize === 'text-xs' ? 'bg-[#21262d] text-white' : 'text-[#8b949e] hover:text-white'}`}
                  title="Small text"
                >
                  A-
                </button>
                <button
                  onClick={() => setFontSize('text-sm')}
                  className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${fontSize === 'text-sm' ? 'bg-[#21262d] text-white' : 'text-[#8b949e] hover:text-white'}`}
                  title="Standard text"
                >
                  A
                </button>
                <button
                  onClick={() => setFontSize('text-base')}
                  className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${fontSize === 'text-base' ? 'bg-[#21262d] text-white' : 'text-[#8b949e] hover:text-white'}`}
                  title="Larger text"
                >
                  A+
                </button>
              </div>
            )}

            {/* Reload button */}
            <button
              onClick={() => {
                setErrorMsg('');
                loadContent();
              }}
              className="p-1 rounded text-[#8b949e] hover:text-white hover:bg-[#21262d] transition-colors cursor-pointer"
              title="Reload file from GitHub"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Reader Body Content */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 custom-scrollbar bg-[#010409]">
          
          {(loading || filesLoading) ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-3">
              <div className="w-8 h-8 border-2 border-[#58a6ff] border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-[#8b949e] font-mono">
                Loading {selectedFile?.name || 'session content'} from GitHub...
              </p>
            </div>
          ) : errorMsg ? (
            <div className="max-w-md mx-auto my-12 p-6 rounded-2xl bg-[#161b22] border border-[#30363d] text-center space-y-4 shadow-xl">
              <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
              <h3 className="text-base font-bold text-white">Unable to Load File</h3>
              <p className="text-xs text-[#8b949e] leading-relaxed break-words">{errorMsg}</p>
              
              <div className="flex items-center justify-center space-x-2 pt-2">
                <button
                  onClick={() => {
                    setErrorMsg('');
                    loadContent();
                  }}
                  className="px-4 py-2 rounded-xl bg-[#21262d] hover:bg-[#30363d] text-white border border-[#30363d] text-xs font-semibold cursor-pointer transition-colors"
                >
                  Retry Loading
                </button>
                <button
                  onClick={() => {
                    setErrorMsg('');
                    setContent(generateFallbackNotes(session));
                  }}
                  className="px-4 py-2 rounded-xl bg-[#238636] hover:bg-[#2ea043] text-white text-xs font-semibold cursor-pointer transition-colors"
                >
                  View Session Summary Notes
                </button>
              </div>
            </div>
          ) : isLocked ? (
            /* Locked Session Gate */
            <div className="max-w-md mx-auto my-12 p-6 rounded-2xl bg-[#161b22] border border-[#30363d] text-center space-y-4 shadow-xl">
              <div className="w-12 h-12 rounded-xl bg-[#21262d] border border-[#30363d] text-amber-400 flex items-center justify-center mx-auto">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Sign In Required to Read Session {session.sessionNumber}</h3>
              <p className="text-xs text-[#8b949e] leading-relaxed">
                Sessions 00–04 are free for everyone. To access Sessions 05–54, read full GitHub notes, and take quizzes, please sign in or create a free account.
              </p>
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => openAuthModal(`Sign in to unlock Session ${session.sessionNumber} GitHub notes and quizzes.`)}
                  className="w-full py-2.5 rounded-xl bg-[#238636] hover:bg-[#2ea043] text-white text-xs sm:text-sm font-semibold transition-all shadow-md cursor-pointer"
                >
                  Sign In / Create Free Account
                </button>
              </div>
            </div>
          ) : isImageFile ? (
            /* Image Preview */
            <div className="max-w-3xl mx-auto my-6 text-center space-y-4">
              <div className="p-4 rounded-2xl bg-[#0d1117] border border-[#30363d] inline-block shadow-2xl">
                <img
                  src={content}
                  alt={selectedFile?.name || 'Session diagram'}
                  className="max-h-[65vh] w-auto rounded-lg mx-auto object-contain"
                />
              </div>
              <div className="text-xs text-[#8b949e] font-mono">
                <span>{selectedFile?.name}</span>
                {selectedFile?.description && <p className="text-[#c9d1d9] mt-1">{selectedFile.description}</p>}
              </div>
            </div>
          ) : !isMarkdown ? (
            /* Raw Code / Config Viewer (.tf, .yaml, .py, .sh, Dockerfile) */
            <div className="max-w-4xl mx-auto">
              <RawCodeViewer
                content={content}
                fileName={selectedFile?.name || 'code.txt'}
                language={selectedFile?.fileType || 'plaintext'}
              />
            </div>
          ) : (
            /* Markdown Rendered Content */
            <div className={`max-w-4xl mx-auto ${fontSize} leading-relaxed text-[#c9d1d9] markdown-content`}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  code: CodeBlock,
                  h1: ({ children }) => (
                    <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-6 mb-3 pb-2 border-b border-[#30363d] flex items-center space-x-2">
                      <span>{children}</span>
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-lg sm:text-xl font-bold text-white mt-6 mb-2.5 pb-1 border-b border-[#21262d]">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-sm sm:text-base font-bold text-[#58a6ff] mt-4 mb-2">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="mb-3 text-[#c9d1d9] leading-relaxed">{children}</p>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside space-y-1 mb-3 text-[#c9d1d9]">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside space-y-1 mb-3 text-[#c9d1d9]">{children}</ol>
                  ),
                  li: ({ children }) => (
                    <li className="text-[#c9d1d9]">{children}</li>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-[#58a6ff] bg-[#161b22] px-4 py-2.5 rounded-r-xl my-3 text-[#c9d1d9] italic text-xs sm:text-sm">
                      {children}
                    </blockquote>
                  ),
                  table: ({ children, node, ...props }) => (
                    <div className="overflow-x-auto my-4 border border-[#30363d] rounded-xl">
                      <table className="w-full text-left text-xs border-collapse" {...props}>
                        {children}
                      </table>
                    </div>
                  ),
                  th: ({ children, node, ...props }) => (
                    <th className="bg-[#161b22] px-3.5 py-2.5 font-bold text-white border-b border-[#30363d]" {...props}>
                      {children}
                    </th>
                  ),
                  td: ({ children, node, ...props }) => (
                    <td className="px-3.5 py-2 border border-[#30363d] text-[#c9d1d9] align-top" {...props}>
                      {children}
                    </td>
                  ),
                  a: ({ href, children, node, ...props }) => (
                    <a 
                      href={href} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-[#58a6ff] hover:underline transition-colors"
                      {...props}
                    >
                      {children}
                    </a>
                  )
                }}
              >
                {content}
              </ReactMarkdown>

              {/* End of Session Reading Card: Mark as Done & Quick Quiz Callout */}
              <div className="mt-10 p-5 rounded-2xl bg-[#161b22] border border-[#30363d] flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center md:text-left">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center justify-center md:justify-start space-x-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Finished Reading?</span>
                  </span>
                  <h4 className="text-base font-bold text-white">Complete this Session & Test Understanding</h4>
                  <p className="text-xs text-[#8b949e]">
                    Verify key concepts from Session #{session.sessionNumber.toString().padStart(2, '0')} and mark as done to earn badge credit.
                  </p>
                </div>

                <div className="flex items-center space-x-2.5 flex-wrap justify-center gap-y-2 flex-shrink-0">
                  {/* Mark as Done Button moved directly inside the reading content */}
                  <button
                    onClick={() => toggleComplete(session.sessionNumber)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all flex items-center space-x-2 cursor-pointer shadow-xs ${
                      completed
                        ? 'bg-emerald-950/60 border-emerald-600/80 text-emerald-400'
                        : 'bg-[#21262d] border-[#30363d] text-[#c9d1d9] hover:text-white hover:bg-[#30363d] hover:border-emerald-500/50'
                    }`}
                    title="Mark this session as done after reading"
                  >
                    <CheckCircle2 className={`w-4 h-4 ${completed ? 'fill-emerald-400 text-slate-900' : 'text-[#8b949e]'}`} />
                    <span>{completed ? 'Marked as Done ✓' : 'Mark as Done'}</span>
                  </button>

                  {/* Start Session Quiz */}
                  <button
                    onClick={() => onOpenQuiz(session)}
                    className="px-4 py-2.5 rounded-xl bg-[#238636] hover:bg-[#2ea043] text-white font-bold text-xs shadow-md transition-all flex items-center space-x-2 cursor-pointer"
                    title="Start session interactive quiz"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Start Session Quiz</span>
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer: Session Navigation */}
        <div className="px-4 sm:px-6 py-3.5 border-t border-[#30363d] bg-[#161b22] flex items-center justify-between gap-3 flex-shrink-0">
          
          {/* Previous Session Button */}
          {prevSession ? (
            <button
              onClick={() => onSelectSession(prevSession)}
              className="px-3 py-1.5 rounded-xl border border-[#30363d] bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] hover:text-white text-xs font-semibold flex items-center space-x-1 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Session #{prevSession.sessionNumber.toString().padStart(2, '0')}</span>
              <span className="sm:hidden">Prev</span>
            </button>
          ) : (
            <div className="w-16" />
          )}

          {/* Session Indicator in Center */}
          <div className="text-xs text-[#8b949e] font-mono hidden sm:block">
            Session #{session.sessionNumber.toString().padStart(2, '0')} / 55
          </div>

          {/* Next Session Button */}
          {nextSession ? (
            <button
              onClick={() => onSelectSession(nextSession)}
              className="px-3 py-1.5 rounded-xl border border-[#30363d] bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] hover:text-white text-xs font-semibold flex items-center space-x-1 transition-colors cursor-pointer"
            >
              <span className="hidden sm:inline">Session #{nextSession.sessionNumber.toString().padStart(2, '0')}</span>
              <span className="sm:hidden">Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="w-16" />
          )}

        </div>

      </div>
    </div>
  );
};
