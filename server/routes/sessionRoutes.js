import express from 'express';
import {
  getSessions,
  getSessionById,
  getSessionRedirect,
  getCourseOverview,
  getSessionReadme,
} from '../controllers/sessionController.js';
import {
  getSessionFiles,
  addSessionFile,
  updateSessionFile,
  deleteSessionFile,
  setPrimarySessionFile,
} from '../controllers/sessionFileController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', optionalAuth, getSessions);
router.get('/overview', getCourseOverview);
router.get('/:id', optionalAuth, getSessionById);
router.get('/:id/redirect', optionalAuth, getSessionRedirect);
router.get('/:id/readme', optionalAuth, getSessionReadme);

// Session files & GitHub resources routes
router.get('/:id/files', getSessionFiles);
router.post('/:id/files', addSessionFile);
router.put('/:id/files/:fileId', updateSessionFile);
router.put('/:id/files/:fileId/primary', setPrimarySessionFile);
router.delete('/:id/files/:fileId', deleteSessionFile);

export default router;
