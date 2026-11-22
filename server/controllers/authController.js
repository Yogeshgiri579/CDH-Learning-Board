import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { User, inMemoryUsers } from '../models/User.js';
import { getDbStatus } from '../config/db.js';
import { getUnlockedCurriculumBadges } from '../../shared/curriculumBadges.mjs';

const JWT_SECRET = process.env.JWT_SECRET || 'clouddevopshub_super_secret_jwt_key_2026';

// Helper to generate JWT token
const generateToken = (userId, email) => {
  return jwt.sign({ id: userId, email }, JWT_SECRET, { expiresIn: '30d' });
};

export const calculateBadges = (completedSessions = [], quizProgress = []) =>
  getUnlockedCurriculumBadges(completedSessions, quizProgress)
    .map((badge) => `Module ${badge.moduleNumber}: ${badge.fullName}`);

// Calculate total points with base, completed sessions, passed quizzes, and badge bonuses
export const calculatePoints = (completedSessions = [], quizProgress = [], bonusPoints = 0) => {
  const comp = completedSessions || [];
  const qProg = quizProgress || [];
  const sessionPoints = comp.length * 50;
  const quizPoints = qProg.reduce((s, q) => s + (q.passed ? 100 : 20), 0);
  const unlockedBadges = calculateBadges(comp, qProg);
  const badgeBonus = unlockedBadges.length * 150;
  return 50 + sessionPoints + quizPoints + badgeBonus + (Number(bonusPoints) || 0);
};

// Register
export const register = async (req, res) => {
  try {
    const { name, email, password, phone, countryCode } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const cleanPhone = phone ? phone.replace(/\D/g, '').slice(-10) : '';
    const cleanCountryCode = countryCode || '+91';
    const isMongo = getDbStatus();

    if (isMongo) {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'An account with this email already exists' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await User.create({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        phone: cleanPhone,
        countryCode: cleanCountryCode,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
        points: 50,
        badges: [],
        completedSessions: [0], // grant kickoff session as completed welcome gift!
        bookmarkedSessions: [],
        quizProgress: [],
      });

      const token = generateToken(user._id, user.email);

      return res.status(201).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone || '',
          countryCode: user.countryCode || '+91',
          avatar: user.avatar,
          role: user.role || 'user',
          points: user.points || 50,
          badges: calculateBadges(user.completedSessions, user.quizProgress),
          completedSessions: user.completedSessions,
          bookmarkedSessions: user.bookmarkedSessions,
          quizProgress: user.quizProgress || [],
        },
      });
    } else {
      // Memory Store Fallback
      const existing = inMemoryUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        return res.status(400).json({ success: false, message: 'An account with this email already exists' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = {
        _id: 'user_' + Date.now(),
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        phone: cleanPhone,
        countryCode: cleanCountryCode,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
        points: 50,
        badges: [],
        completedSessions: [0],
        bookmarkedSessions: [],
        quizProgress: [],
        createdAt: new Date().toISOString(),
      };

      inMemoryUsers.push(newUser);
      const token = generateToken(newUser._id, newUser.email);

      return res.status(201).json({
        success: true,
        token,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone || '',
          countryCode: newUser.countryCode || '+91',
          avatar: newUser.avatar,
          role: newUser.role || 'user',
          points: newUser.points || 50,
          badges: calculateBadges(newUser.completedSessions, newUser.quizProgress),
          completedSessions: newUser.completedSessions,
          bookmarkedSessions: newUser.bookmarkedSessions,
          quizProgress: newUser.quizProgress || [],
        },
      });
    }
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const isMongo = getDbStatus();

    let user;
    const cleanEmail = email.trim().toLowerCase();

    if (isMongo) {
      user = await User.findOne({ email: cleanEmail });
    } else {
      user = inMemoryUsers.find((u) => u.email.toLowerCase() === cleanEmail);
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user._id, user.email);

    return res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        countryCode: user.countryCode || '+91',
        avatar: user.avatar,
        role: user.role || 'user',
        points: user.points || 50,
        badges: calculateBadges(user.completedSessions, user.quizProgress),
        completedSessions: user.completedSessions || [],
        bookmarkedSessions: user.bookmarkedSessions || [],
        quizProgress: user.quizProgress || [],
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

// Google Auth (One-tap / OAuth handler)
export const googleAuth = async (req, res) => {
  try {
    const { name, email, googleId, avatar } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Google email is required' });
    }

    const isMongo = getDbStatus();
    let user;

    if (isMongo) {
      user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        user = await User.create({
          name: name || 'Google Cloud Explorer',
          email: email.toLowerCase(),
          googleId: googleId || 'google_' + Date.now(),
          avatar: avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || 'Cloud')}`,
          completedSessions: [0, 1],
          bookmarkedSessions: [],
        });
      }
    } else {
      user = inMemoryUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        user = {
          _id: 'user_g_' + Date.now(),
          name: name || 'Google Cloud Explorer',
          email: email.toLowerCase(),
          googleId: googleId || 'google_' + Date.now(),
          avatar: avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || 'Cloud')}`,
          completedSessions: [0, 1],
          bookmarkedSessions: [],
        };
        inMemoryUsers.push(user);
      }
    }

    const token = generateToken(user._id, user.email);

    return res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        completedSessions: user.completedSessions,
        bookmarkedSessions: user.bookmarkedSessions,
      },
    });
  } catch (error) {
    console.error('Google Auth error:', error);
    res.status(500).json({ success: false, message: 'Server error during Google authentication' });
  }
};

// GitHub Auth (One-tap / OAuth handler)
export const githubAuth = async (req, res) => {
  try {
    const { name, email, githubId, avatar } = req.body;
    const cleanEmail = (email || `${githubId || 'dev'}@github.user`).toLowerCase();
    const isMongo = getDbStatus();
    let user;

    if (isMongo) {
      user = await User.findOne({ email: cleanEmail });
      if (!user) {
        user = await User.create({
          name: name || 'GitHub Developer',
          email: cleanEmail,
          avatar: avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(cleanEmail)}`,
          completedSessions: [0, 1, 2],
          bookmarkedSessions: [],
        });
      }
    } else {
      user = inMemoryUsers.find((u) => u.email.toLowerCase() === cleanEmail);
      if (!user) {
        user = {
          _id: 'user_gh_' + Date.now(),
          name: name || 'GitHub Developer',
          email: cleanEmail,
          avatar: avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(cleanEmail)}`,
          completedSessions: [0, 1, 2],
          bookmarkedSessions: [],
        };
        inMemoryUsers.push(user);
      }
    }

    const token = generateToken(user._id, user.email);

    return res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        completedSessions: user.completedSessions,
        bookmarkedSessions: user.bookmarkedSessions,
      },
    });
  } catch (error) {
    console.error('GitHub Auth error:', error);
    res.status(500).json({ success: false, message: 'Server error during GitHub authentication' });
  }
};

// Get Me (profile and progress)
export const getMe = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    const isMongo = getDbStatus();
    let user = null;

    if (isMongo && mongoose.Types.ObjectId.isValid(userId)) {
      user = await User.findById(userId).select('-password');
    }

    if (!user) {
      user = inMemoryUsers.find((u) => u._id === userId || u.email?.toLowerCase() === req.user?.email?.toLowerCase());
    }

    if (!user) {
      // Fallback dummy user for demo session
      return res.json({
        success: true,
        user: {
          id: userId,
          name: req.user.email?.split('@')[0] || 'Cloud Engineer',
          email: req.user.email,
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(req.user.email || 'Cloud')}`,
          completedSessions: [0, 1],
          bookmarkedSessions: [],
        },
      });
    }

    return res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        countryCode: user.countryCode || '+91',
        avatar: user.avatar,
        role: user.role || 'user',
        points: user.points || 50,
        badges: calculateBadges(user.completedSessions, user.quizProgress),
        completedSessions: user.completedSessions || [],
        bookmarkedSessions: user.bookmarkedSessions || [],
        quizProgress: user.quizProgress || [],
      },
    });
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Toggle Complete Session
export const toggleComplete = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { sessionNumber } = req.body;

    if (sessionNumber === undefined || sessionNumber === null) {
      return res.status(400).json({ success: false, message: 'sessionNumber is required' });
    }

    const sNum = parseInt(sessionNumber, 10);
    const isMongo = getDbStatus();

    let updatedCompleted = [];

    if (isMongo && mongoose.Types.ObjectId.isValid(userId)) {
      const user = await User.findById(userId);
      if (user) {
        if (user.completedSessions.includes(sNum)) {
          user.completedSessions = user.completedSessions.filter((n) => n !== sNum);
        } else {
          user.completedSessions.push(sNum);
        }
        user.badges = calculateBadges(user.completedSessions, user.quizProgress);
        user.points = calculatePoints(user.completedSessions, user.quizProgress);
        await user.save();
        invalidateLeaderboardCache();
        updatedCompleted = user.completedSessions;
        return res.json({
          success: true,
          completedSessions: updatedCompleted,
          points: user.points,
          badges: user.badges,
          progressPercentage: Math.round((updatedCompleted.length / 55) * 100),
        });
      }
    }

    // Memory store or fallback
    let user = inMemoryUsers.find((u) => u._id === userId || u.email?.toLowerCase() === req.user?.email?.toLowerCase());
    if (!user) {
      user = { _id: userId, email: req.user?.email, completedSessions: [0] };
      inMemoryUsers.push(user);
    }
    if (user.completedSessions.includes(sNum)) {
      user.completedSessions = user.completedSessions.filter((n) => n !== sNum);
    } else {
      user.completedSessions.push(sNum);
    }
    user.badges = calculateBadges(user.completedSessions, user.quizProgress);
    user.points = calculatePoints(user.completedSessions, user.quizProgress);
    updatedCompleted = user.completedSessions;

    invalidateLeaderboardCache();

    return res.json({
      success: true,
      completedSessions: updatedCompleted,
      points: user.points,
      badges: user.badges,
      progressPercentage: Math.round((updatedCompleted.length / 55) * 100),
    });
  } catch (error) {
    console.error('Toggle complete error:', error);
    res.status(500).json({ success: false, message: 'Server error updating progress' });
  }
};

// Record Quiz Progress (Track Quiz Scores and Auto-Complete Sessions)
export const recordQuizProgress = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { sessionNumber, score, totalQuestions, passed } = req.body;

    if (sessionNumber === undefined || score === undefined || totalQuestions === undefined) {
      return res.status(400).json({ success: false, message: 'sessionNumber, score, and totalQuestions are required' });
    }

    const sNum = parseInt(sessionNumber, 10);
    const numScore = parseInt(score, 10);
    const numTotal = parseInt(totalQuestions, 10);
    const percentage = numTotal > 0 ? Math.round((numScore / numTotal) * 100) : 0;
    const isPassed = passed !== undefined ? Boolean(passed) : percentage >= 60;

    const record = {
      sessionNumber: sNum,
      score: numScore,
      totalQuestions: numTotal,
      percentage,
      passed: isPassed,
      completedAt: new Date(),
    };

    const isMongo = getDbStatus();

    if (isMongo && mongoose.Types.ObjectId.isValid(userId)) {
      const user = await User.findById(userId);
      if (user) {
        if (!user.quizProgress) user.quizProgress = [];
        const existingIdx = user.quizProgress.findIndex((q) => q.sessionNumber === sNum);
        if (existingIdx >= 0) {
          if (percentage >= (user.quizProgress[existingIdx].percentage || 0)) {
            user.quizProgress[existingIdx] = record;
          }
        } else {
          user.quizProgress.push(record);
        }

        if (isPassed && !user.completedSessions.includes(sNum)) {
          user.completedSessions.push(sNum);
        }

        user.badges = calculateBadges(user.completedSessions, user.quizProgress);
        user.points = calculatePoints(user.completedSessions, user.quizProgress);

        await user.save();
        invalidateLeaderboardCache();
        return res.json({
          success: true,
          quizProgress: user.quizProgress,
          completedSessions: user.completedSessions,
          points: user.points,
          badges: user.badges,
          progressPercentage: Math.round((user.completedSessions.length / 55) * 100),
        });
      }
    }

    // Memory store fallback
    let user = inMemoryUsers.find((u) => u._id === userId || u.email?.toLowerCase() === req.user?.email?.toLowerCase());
    if (!user) {
      user = { _id: userId, email: req.user?.email, completedSessions: [0], quizProgress: [] };
      inMemoryUsers.push(user);
    }
    if (!user.quizProgress) user.quizProgress = [];
    const existingIdx = user.quizProgress.findIndex((q) => q.sessionNumber === sNum);
    if (existingIdx >= 0) {
      if (percentage >= (user.quizProgress[existingIdx].percentage || 0)) {
        user.quizProgress[existingIdx] = record;
      }
    } else {
      user.quizProgress.push(record);
    }
    if (isPassed && !user.completedSessions.includes(sNum)) {
      user.completedSessions.push(sNum);
    }

    user.badges = calculateBadges(user.completedSessions, user.quizProgress);
    user.points = calculatePoints(user.completedSessions, user.quizProgress);
    invalidateLeaderboardCache();

    return res.json({
      success: true,
      quizProgress: user.quizProgress,
      completedSessions: user.completedSessions,
      points: user.points,
      badges: user.badges,
      progressPercentage: Math.round((user.completedSessions.length / 55) * 100),
    });
  } catch (error) {
    console.error('Record quiz progress error:', error);
    res.status(500).json({ success: false, message: 'Server error saving quiz progress' });
  }
};

// High-speed in-memory cache for leaderboard to avoid heavy MongoDB Atlas overhead
let cachedLeaderboardPayload = null;
let cachedLeaderboardTimestamp = 0;
const LEADERBOARD_CACHE_TTL = 45 * 1000; // 45 seconds

export const invalidateLeaderboardCache = () => {
  cachedLeaderboardPayload = null;
  cachedLeaderboardTimestamp = 0;
};

// Public Leaderboard Endpoint
export const getLeaderboard = async (req, res) => {
  try {
    const now = Date.now();
    if (cachedLeaderboardPayload && (now - cachedLeaderboardTimestamp < LEADERBOARD_CACHE_TTL)) {
      return res.json(cachedLeaderboardPayload);
    }

    const isMongo = getDbStatus();
    let users = [];

    if (isMongo) {
      users = await User.find({ role: { $ne: 'admin' } })
        .select('name email points completedSessions quizProgress.sessionNumber quizProgress.passed role')
        .lean();
    } else {
      users = inMemoryUsers.filter((u) => u.role !== 'admin');
    }

    const leaderboard = users.map((u) => {
      const comp = u.completedSessions || [];
      const qProg = u.quizProgress || [];
      const unlockedBadges = getUnlockedCurriculumBadges(comp, qProg);
      const badges = unlockedBadges.map((badge) => `Module ${badge.moduleNumber}: ${badge.fullName}`);
      const computedPoints = u.points !== undefined && u.points !== null ? u.points : calculatePoints(comp, qProg);

      return {
        id: u._id,
        name: u.name,
        email: u.email,
        role: u.role || 'user',
        points: computedPoints,
        badges,
        badgeIds: unlockedBadges.map((badge) => badge.moduleId),
        completedCount: comp.length,
        quizzesPassed: qProg.filter((q) => q.passed).length,
      };
    });

    leaderboard.sort((a, b) => b.points - a.points || b.completedCount - a.completedCount);

    const ranked = leaderboard.map((item, index) => ({
      ...item,
      rank: index + 1,
    }));

    cachedLeaderboardPayload = {
      success: true,
      count: ranked.length,
      leaderboard: ranked,
    };
    cachedLeaderboardTimestamp = Date.now();

    return res.json(cachedLeaderboardPayload);
  } catch (err) {
    console.error('Leaderboard error:', err);
    if (cachedLeaderboardPayload) {
      return res.json(cachedLeaderboardPayload);
    }
    return res.status(500).json({ success: false, message: 'Server error retrieving leaderboard' });
  }
};
