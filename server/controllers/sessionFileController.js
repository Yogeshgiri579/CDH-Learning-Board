import { SessionFile, inMemorySessionFiles } from '../models/SessionFile.js';
import { sessionsData } from '../data/sessionsData.js';
import { getDbStatus } from '../config/db.js';
import { parseGitHubUrl, detectFileType } from './githubController.js';

const GITHUB_REPO_BASE = process.env.GITHUB_REPO_BASE || 'https://github.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge';

// Get all files for a specific session
export const getSessionFiles = async (req, res) => {
  try {
    const sessionNum = parseInt(req.params.id, 10);
    const session = sessionsData.find((s) => s.sessionNumber === sessionNum);

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    const isMongo = getDbStatus();
    let files = [];

    if (isMongo) {
      const existingCount = await SessionFile.countDocuments();
      if (existingCount === 0) {
        // Strip _id to let Mongo generate valid ObjectIds
        const seedData = inMemorySessionFiles.map(({ _id, ...rest }) => rest);
        await SessionFile.insertMany(seedData);
      }
      files = await SessionFile.find({ sessionNumber: sessionNum }).sort({ isDefault: -1, createdAt: 1 });
    } else {
      files = inMemorySessionFiles.filter((f) => f.sessionNumber === sessionNum);
    }

    // Ensure default official README is always present in session files list
    const hasReadme = files.some((f) => f.name.toLowerCase() === 'readme.md');
    const hasDefaultFile = files.some((f) => f.isDefault);

    if (!hasReadme) {
      const defaultReadme = {
        _id: `default_readme_${sessionNum}`,
        sessionNumber: sessionNum,
        name: 'README.md',
        githubUrl: `${GITHUB_REPO_BASE}/tree/main/${encodeURIComponent(session.folder)}`,
        rawUrl: `https://raw.githubusercontent.com/CloudDevOpsHub/MultiCloud-DevOps-AI-Challenge/main/${encodeURIComponent(session.folder)}/README.md`,
        fileType: 'markdown',
        description: `${session.title} - Main Session Guide`,
        isDefault: !hasDefaultFile,
      };
      // If no custom primary file is set, default README is first; otherwise, custom primary is first
      files = hasDefaultFile ? [...files, defaultReadme] : [defaultReadme, ...files];
    }

    return res.json({
      success: true,
      sessionNumber: sessionNum,
      sessionTitle: session.title,
      folder: session.folder,
      files,
    });
  } catch (error) {
    console.error('Error getting session files:', error);
    return res.status(500).json({ success: false, message: 'Server error retrieving session files' });
  }
};

// Add a new GitHub file link to a session
export const addSessionFile = async (req, res) => {
  try {
    const sessionNum = parseInt(req.params.id, 10);
    const targetUrl = req.body.url || req.body.githubUrl || req.body.rawUrl;
    const { name, description, fileType, isPrimary, isDefault } = req.body;

    if (!targetUrl) {
      return res.status(400).json({ success: false, message: 'GitHub URL is required' });
    }

    const session = sessionsData.find((s) => s.sessionNumber === sessionNum);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    let parsed;
    try {
      parsed = parseGitHubUrl(targetUrl);
    } catch (parseErr) {
      return res.status(400).json({ success: false, message: parseErr.message });
    }

    const detected = detectFileType(parsed.fileName);
    let cleanName = name?.trim();
    if (cleanName) {
      try {
        cleanName = decodeURIComponent(cleanName);
      } catch {}
    }
    const resolvedName = cleanName || parsed.fileName;
    const resolvedType = fileType || detected.type;
    const makePrimary = Boolean(isPrimary || isDefault);

    const isMongo = getDbStatus();

    if (isMongo) {
      if (makePrimary) {
        await SessionFile.updateMany({ sessionNumber: sessionNum }, { isDefault: false });
      }

      const newFile = await SessionFile.create({
        sessionNumber: sessionNum,
        name: resolvedName,
        githubUrl: parsed.githubUrl,
        rawUrl: parsed.rawUrl,
        fileType: resolvedType,
        description: description?.trim() || '',
        isDefault: makePrimary,
      });

      return res.status(201).json({
        success: true,
        message: makePrimary ? 'File imported and set as Primary Preview for this session' : 'File attached to session successfully',
        file: newFile,
      });
    } else {
      if (makePrimary) {
        inMemorySessionFiles.forEach((f) => {
          if (f.sessionNumber === sessionNum) f.isDefault = false;
        });
      }

      const newFile = {
        _id: `file_${sessionNum}_${Date.now()}`,
        sessionNumber: sessionNum,
        name: resolvedName,
        githubUrl: parsed.githubUrl,
        rawUrl: parsed.rawUrl,
        fileType: resolvedType,
        description: description?.trim() || '',
        isDefault: makePrimary,
        createdAt: new Date().toISOString(),
      };
      inMemorySessionFiles.push(newFile);

      return res.status(201).json({
        success: true,
        message: makePrimary ? 'File imported and set as Primary Preview for this session' : 'File attached to session successfully',
        file: newFile,
      });
    }
  } catch (error) {
    console.error('Error adding session file:', error);
    return res.status(500).json({ success: false, message: 'Server error adding session file' });
  }
};

// Set a file as the primary preview file for a session
export const setPrimarySessionFile = async (req, res) => {
  try {
    const sessionNum = parseInt(req.params.id, 10);
    const { fileId } = req.params;
    const isMongo = getDbStatus();

    if (isMongo) {
      await SessionFile.updateMany({ sessionNumber: sessionNum }, { isDefault: false });
      const updated = await SessionFile.findByIdAndUpdate(fileId, { isDefault: true }, { new: true });
      return res.json({ success: true, message: 'Primary preview file updated', file: updated });
    } else {
      inMemorySessionFiles.forEach((f) => {
        if (f.sessionNumber === sessionNum) {
          f.isDefault = f._id === fileId;
        }
      });
      return res.json({ success: true, message: 'Primary preview file updated' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Update an existing session file
export const updateSessionFile = async (req, res) => {
  try {
    const { fileId } = req.params;
    const targetUrl = req.body.url || req.body.githubUrl || req.body.rawUrl;
    const { name, description, fileType } = req.body;

    const isMongo = getDbStatus();

    let updatedPayload = {};
    if (name) updatedPayload.name = name.trim();
    if (description !== undefined) updatedPayload.description = description.trim();
    if (fileType) updatedPayload.fileType = fileType;

    if (targetUrl) {
      try {
        const parsed = parseGitHubUrl(targetUrl);
        updatedPayload.githubUrl = parsed.githubUrl;
        updatedPayload.rawUrl = parsed.rawUrl;
        if (!name) updatedPayload.name = parsed.fileName;
        if (!fileType) updatedPayload.fileType = detectFileType(parsed.fileName).type;
      } catch (err) {
        return res.status(400).json({ success: false, message: err.message });
      }
    }

    if (isMongo) {
      const updated = await SessionFile.findByIdAndUpdate(fileId, updatedPayload, { new: true });
      if (!updated) {
        return res.status(404).json({ success: false, message: 'File not found' });
      }
      return res.json({ success: true, message: 'File updated successfully', file: updated });
    } else {
      const index = inMemorySessionFiles.findIndex((f) => f._id === fileId);
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'File not found' });
      }
      inMemorySessionFiles[index] = { ...inMemorySessionFiles[index], ...updatedPayload };
      return res.json({ success: true, message: 'File updated successfully', file: inMemorySessionFiles[index] });
    }
  } catch (error) {
    console.error('Error updating session file:', error);
    return res.status(500).json({ success: false, message: 'Server error updating file' });
  }
};

// Delete a session file
export const deleteSessionFile = async (req, res) => {
  try {
    const { fileId } = req.params;
    const isMongo = getDbStatus();

    if (isMongo) {
      const deleted = await SessionFile.findByIdAndDelete(fileId);
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'File not found' });
      }
      return res.json({ success: true, message: 'File deleted successfully' });
    } else {
      const index = inMemorySessionFiles.findIndex((f) => f._id === fileId);
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'File not found' });
      }
      inMemorySessionFiles.splice(index, 1);
      return res.json({ success: true, message: 'File deleted successfully' });
    }
  } catch (error) {
    console.error('Error deleting session file:', error);
    return res.status(500).json({ success: false, message: 'Server error deleting file' });
  }
};
