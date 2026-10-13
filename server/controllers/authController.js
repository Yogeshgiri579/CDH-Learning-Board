import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { User, inMemoryUsers } from '../models/User.js';
import { getDbStatus } from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'clouddevopshub_super_secret_jwt_key_2026';

// Helper to generate JWT token
const generateToken = (userId, email) => {
  return jwt.sign({ id: userId, email }, JWT_SECRET, { expiresIn: '30d' });
};

// Register
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

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
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
        completedSessions: [0], // grant kickoff session as completed welcome gift!
        bookmarkedSessions: [],
      });

      const token = generateToken(user._id, user.email);

      return res.status(201).json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          role: user.role || 'user',
          completedSessions: user.completedSessions,
          bookmarkedSessions: user.bookmarkedSessions,
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
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
        completedSessions: [0],
        bookmarkedSessions: [],
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
          avatar: newUser.avatar,
          role: newUser.role || 'user',
          completedSessions: newUser.completedSessions,
          bookmarkedSessions: newUser.bookmarkedSessions,
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
    if (isMongo) {
      user = await User.findOne({ email: email.toLowerCase() });
    } else {
      user = inMemoryUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    }

    // Demo account shortcut support
    const cleanEmail = email.trim().toLowerCase();
    if (cleanEmail === 'learner@clouddevopshub.com' || cleanEmail === 'demo@clouddevopshub.com') {
      let demoUser = null;
      if (isMongo) {
        demoUser = await User.findOne({ email: cleanEmail });
        if (!demoUser) {
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash('password123', salt);
          demoUser = await User.create({
            name: 'Cloud Learner (Demo)',
            email: cleanEmail,
            password: hashedPassword,
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
            completedSessions: [0, 1, 2],
            bookmarkedSessions: [5, 13],
          });
        }
      } else {
        demoUser = inMemoryUsers.find((u) => u.email.toLowerCase() === cleanEmail) || {
          _id: 'demo_user_123',
          name: 'Cloud Learner (Demo)',
          email: 'learner@clouddevopshub.com',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
          completedSessions: [0, 1, 2],
          bookmarkedSessions: [5, 13],
        };
      }

      const token = generateToken(demoUser._id, demoUser.email);
      return res.json({
        success: true,
        token,
        user: {
          id: demoUser._id,
          name: demoUser.name,
          email: demoUser.email,
          avatar: demoUser.avatar,
          role: demoUser.role || 'user',
          completedSessions: demoUser.completedSessions || [0, 1, 2],
          bookmarkedSessions: demoUser.bookmarkedSessions || [5, 13],
        },
      });
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
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
        role: user.role || 'user',
        completedSessions: user.completedSessions,
        bookmarkedSessions: user.bookmarkedSessions,
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
        avatar: user.avatar,
        role: user.role || 'user',
        completedSessions: user.completedSessions || [],
        bookmarkedSessions: user.bookmarkedSessions || [],
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
        await user.save();
        updatedCompleted = user.completedSessions;
        return res.json({
          success: true,
          completedSessions: updatedCompleted,
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
    updatedCompleted = user.completedSessions;

    return res.json({
      success: true,
      completedSessions: updatedCompleted,
      progressPercentage: Math.round((updatedCompleted.length / 55) * 100),
    });
  } catch (error) {
    console.error('Toggle complete error:', error);
    res.status(500).json({ success: false, message: 'Server error updating progress' });
  }
};
