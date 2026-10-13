// Helper to sanitize path and decode file name
function sanitizePath(rawPath) {
  if (!rawPath) return { clean: '', safePath: '', decodedFileName: 'file' };
  const clean = rawPath.split('?')[0].split('#')[0];
  const segments = clean.split('/').filter(Boolean);
  const safePath = segments.map((seg) => encodeURIComponent(decodeURIComponent(seg))).join('/');
  const rawFileName = segments[segments.length - 1] || 'file';
  let decodedFileName = rawFileName;
  try {
    decodedFileName = decodeURIComponent(rawFileName);
  } catch {
    decodedFileName = rawFileName;
  }
  return { clean, safePath, decodedFileName };
}

// Helper to parse any GitHub URL into a raw fetchable URL and file details
export function parseGitHubUrl(inputUrl) {
  if (!inputUrl || typeof inputUrl !== 'string') {
    throw new Error('Please provide a valid URL string');
  }

  const cleanUrl = inputUrl.trim();

  // Pattern 1: Raw GitHub URL
  // https://raw.githubusercontent.com/:owner/:repo/:branch/:path...
  const rawRegex = /^https?:\/\/raw\.githubusercontent\.com\/([^/]+)\/([^/]+)\/([^/]+)\/(.+)$/i;
  const rawMatch = cleanUrl.match(rawRegex);
  if (rawMatch) {
    const [, owner, repo, branch, filePath] = rawMatch;
    const { safePath, decodedFileName } = sanitizePath(filePath);
    return {
      owner,
      repo,
      branch,
      filePath: safePath,
      fileName: decodedFileName,
      rawUrl: `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${safePath}`,
      githubUrl: `https://github.com/${owner}/${repo}/blob/${branch}/${safePath}`,
    };
  }

  // Pattern 2: Standard GitHub Blob URL
  // https://github.com/:owner/:repo/blob/:branch/:path...
  const blobRegex = /^https?:\/\/github\.com\/([^/]+)\/([^/]+)\/blob\/([^/]+)\/(.+)$/i;
  const blobMatch = cleanUrl.match(blobRegex);
  if (blobMatch) {
    const [, owner, repo, branch, filePath] = blobMatch;
    const { safePath, decodedFileName } = sanitizePath(filePath);
    return {
      owner,
      repo,
      branch,
      filePath: safePath,
      fileName: decodedFileName,
      rawUrl: `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${safePath}`,
      githubUrl: `https://github.com/${owner}/${repo}/blob/${branch}/${safePath}`,
    };
  }

  // Pattern 3: Standard GitHub Tree / Folder URL
  // https://github.com/:owner/:repo/tree/:branch/:folder...
  const treeRegex = /^https?:\/\/github\.com\/([^/]+)\/([^/]+)\/tree\/([^/]+)\/(.+)$/i;
  const treeMatch = cleanUrl.match(treeRegex);
  if (treeMatch) {
    const [, owner, repo, branch, folderPath] = treeMatch;
    const { safePath } = sanitizePath(folderPath);
    const targetPath = safePath ? `${safePath}/README.md` : 'README.md';
    return {
      owner,
      repo,
      branch,
      filePath: targetPath,
      fileName: 'README.md',
      rawUrl: `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${targetPath}`,
      githubUrl: `https://github.com/${owner}/${repo}/tree/${branch}/${safePath}`,
    };
  }

  // Pattern 4: Root Repo URL (https://github.com/:owner/:repo)
  const repoRegex = /^https?:\/\/github\.com\/([^/]+)\/([^/]+)\/?$/i;
  const repoMatch = cleanUrl.match(repoRegex);
  if (repoMatch) {
    const [, owner, repo] = repoMatch;
    return {
      owner,
      repo,
      branch: 'main',
      filePath: 'README.md',
      fileName: 'README.md',
      rawUrl: `https://raw.githubusercontent.com/${owner}/${repo}/main/README.md`,
      githubUrl: `https://github.com/${owner}/${repo}`,
    };
  }

  // Fallback: If it's already an http(s) URL pointing to a raw resource
  if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
    const urlWithoutQuery = cleanUrl.split('?')[0].split('#')[0];
    const rawFileName = urlWithoutQuery.split('/').pop() || 'custom-file';
    let decodedFileName = rawFileName;
    try {
      decodedFileName = decodeURIComponent(rawFileName);
    } catch {}
    return {
      owner: 'custom',
      repo: 'external',
      branch: 'main',
      filePath: decodedFileName,
      fileName: decodedFileName,
      rawUrl: cleanUrl,
      githubUrl: cleanUrl,
    };
  }

  throw new Error('Invalid GitHub URL format. Example: https://github.com/owner/repo/blob/main/path/file.ext');
}

// Helper to determine file language and category
export function detectFileType(fileName) {
  const lower = fileName.toLowerCase();
  const ext = lower.split('.').pop();

  if (lower === 'dockerfile' || lower.endsWith('.dockerfile')) return { type: 'docker', lang: 'dockerfile' };
  if (lower === 'jenkinsfile') return { type: 'code', lang: 'groovy' };
  if (lower === 'vagrantfile') return { type: 'code', lang: 'ruby' };
  if (lower === 'makefile') return { type: 'code', lang: 'makefile' };

  switch (ext) {
    case 'md':
    case 'markdown':
      return { type: 'markdown', lang: 'markdown' };
    case 'tf':
    case 'tfvars':
    case 'hcl':
      return { type: 'terraform', lang: 'hcl' };
    case 'yaml':
    case 'yml':
      return { type: 'yaml', lang: 'yaml' };
    case 'json':
      return { type: 'json', lang: 'json' };
    case 'sh':
    case 'bash':
    case 'zsh':
      return { type: 'code', lang: 'bash' };
    case 'py':
      return { type: 'code', lang: 'python' };
    case 'js':
    case 'jsx':
      return { type: 'code', lang: 'javascript' };
    case 'ts':
    case 'tsx':
      return { type: 'code', lang: 'typescript' };
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'svg':
    case 'webp':
      return { type: 'image', lang: 'image' };
    case 'txt':
    case 'log':
      return { type: 'text', lang: 'plaintext' };
    default:
      return { type: 'code', lang: ext || 'plaintext' };
  }
}

// Controller: Fetch & Preview any GitHub file URL
export const previewGitHubUrl = async (req, res) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ success: false, message: 'Missing url query parameter' });
    }

    let parsed;
    try {
      parsed = parseGitHubUrl(url);
    } catch (parseErr) {
      return res.status(400).json({ success: false, message: parseErr.message });
    }

    const { type, lang } = detectFileType(parsed.fileName);

    // If it's an image, return direct preview URL without loading binary body as text
    if (type === 'image') {
      return res.json({
        success: true,
        isImage: true,
        fileName: parsed.fileName,
        fileType: type,
        language: lang,
        rawUrl: parsed.rawUrl,
        githubUrl: parsed.githubUrl,
        parsed,
      });
    }

    // Fetch the raw text content with a reasonable timeout and branch fallback
    let fetchUrl = parsed.rawUrl;
    let response = await fetch(fetchUrl, {
      signal: AbortSignal.timeout(8000),
      headers: {
        'Accept': 'text/plain, text/markdown, application/json, text/yaml, */*',
      },
    });

    if (!response.ok && response.status === 404 && (parsed.branch === 'main' || parsed.branch === 'master')) {
      const altBranch = parsed.branch === 'main' ? 'master' : 'main';
      const altUrl = parsed.rawUrl.replace(`/${parsed.branch}/`, `/${altBranch}/`);
      try {
        const altRes = await fetch(altUrl, {
          signal: AbortSignal.timeout(8000),
          headers: {
            'Accept': 'text/plain, text/markdown, application/json, text/yaml, */*',
          },
        });
        if (altRes.ok) {
          response = altRes;
          fetchUrl = altUrl;
          parsed.branch = altBranch;
          parsed.rawUrl = altUrl;
        }
      } catch {}
    }

    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({
          success: false,
          message: `File not found on GitHub (${fetchUrl}). Please check branch and path.`,
          rawUrl: fetchUrl,
        });
      }
      return res.status(response.status).json({
        success: false,
        message: `GitHub returned status ${response.status}: ${response.statusText}`,
        rawUrl: fetchUrl,
      });
    }

    const content = await response.text();
    const lineCount = content.split('\n').length;
    const byteSize = Buffer.byteLength(content, 'utf8');

    return res.json({
      success: true,
      content,
      fileName: parsed.fileName,
      fileType: type,
      language: lang,
      lineCount,
      byteSize,
      rawUrl: parsed.rawUrl,
      githubUrl: parsed.githubUrl,
      parsed,
    });
  } catch (error) {
    console.error('Error previewing GitHub URL:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch GitHub file content',
    });
  }
};
