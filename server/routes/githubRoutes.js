import express from 'express';
import { previewGitHubUrl } from '../controllers/githubController.js';

const router = express.Router();

router.get('/preview', previewGitHubUrl);

export default router;
