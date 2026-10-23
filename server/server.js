import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import sessionRoutes from './routes/sessionRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import githubRoutes from './routes/githubRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { getLeaderboard } from './controllers/authController.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect Database (with automatic fallback to high-speed in-memory store)
connectDB();

// Middleware
app.use(
  cors({
    origin: true, // Dynamically reflect request origin so credentials: true works in all browsers
    credentials: true,
  })
);
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/github', githubRoutes);
app.use('/api/admin', adminRoutes);
app.get('/api/leaderboard', getLeaderboard);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'CloudDevOpsHub 55-Session LMS API',
  });
});

app.listen(PORT, () => {
  console.log(` CloudDevOpsHub LMS Server running on http://localhost:${PORT}`);
});
