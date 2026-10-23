import express from 'express';
import { 
  getAllUsers, 
  createUser, 
  updateUser, 
  deleteUser,
  getAdminLeaderboard,
  createLeaderboardEntry,
  updateLeaderboardEntry,
  resetLeaderboardEntry,
  recalculateLeaderboard
} from '../controllers/adminController.js';

const router = express.Router();

// Users Management
router.get('/users', getAllUsers);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Leaderboard Management & CRUD
router.get('/leaderboard', getAdminLeaderboard);
router.post('/leaderboard', createLeaderboardEntry);
router.put('/leaderboard/:id', updateLeaderboardEntry);
router.delete('/leaderboard/:id', resetLeaderboardEntry);
router.post('/leaderboard/recalculate', recalculateLeaderboard);

export default router;
