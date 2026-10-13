import express from 'express';
import {
  getQuizzes,
  getQuizById,
  getQuizForSession,
  createQuizQuestion,
  updateQuizQuestion,
  deleteQuizQuestion,
  resetQuizzesToDefault,
} from '../controllers/quizController.js';

const router = express.Router();

router.get('/', getQuizzes);
router.get('/session/:sessionNumber', getQuizForSession);
router.get('/:id', getQuizById);
router.post('/', createQuizQuestion);
router.put('/:id', updateQuizQuestion);
router.delete('/:id', deleteQuizQuestion);
router.post('/reset', resetQuizzesToDefault);

export default router;
