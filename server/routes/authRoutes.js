import express from 'express';
import { register, login, googleAuth, githubAuth, getMe, toggleComplete, recordQuizProgress, getLeaderboard } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleAuth);
router.post('/github', githubAuth);
router.get('/me', protect, getMe);
router.get('/leaderboard', getLeaderboard);
router.post('/progress/toggle', protect, toggleComplete);
router.post('/progress/quiz', protect, recordQuizProgress);

export default router;
