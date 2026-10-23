import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { User, inMemoryUsers } from '../models/User.js';
import { getDbStatus } from '../config/db.js';
import { calculateBadges, calculatePoints } from './authController.js';

// Get all users for admin management
export const getAllUsers = async (req, res) => {
  try {
    const isMongo = getDbStatus();
    let users = [];

    if (isMongo) {
      users = await User.find({ role: { $ne: 'admin' } }).sort({ createdAt: -1 });
    } else {
      users = inMemoryUsers.filter((u) => u.role !== 'admin');
    }

    const formattedUsers = users.map((u) => {
      const comp = u.completedSessions || [];
      const qProg = u.quizProgress || [];
      const badges = u.badges && u.badges.length > 0 ? u.badges : calculateBadges(comp, qProg);
      const points = u.points !== undefined && u.points !== null ? u.points : calculatePoints(comp, qProg);

      return {
        _id: u._id,
        name: u.name,
        email: u.email,
        phone: u.phone || '',
        countryCode: u.countryCode || '+91',
        role: u.role || 'user',
        avatar: u.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(u.name || 'User')}`,
        completedSessions: comp,
        completedCount: comp.length,
        quizProgress: qProg,
        quizzesPassed: qProg.filter((q) => q.passed).length,
        points,
        badges,
        createdAt: u.createdAt || new Date().toISOString(),
      };
    });

    return res.json({
      success: true,
      count: formattedUsers.length,
      users: formattedUsers,
    });
  } catch (err) {
    console.error('Error fetching admin users:', err);
    return res.status(500).json({ success: false, message: 'Server error retrieving users' });
  }
};

// Create a new user from Admin Panel
export const createUser = async (req, res) => {
  try {
    const { name, email, password, phone, countryCode, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone ? phone.replace(/\D/g, '').slice(-10) : '';
    const cleanCountryCode = countryCode || '+91';
    const isMongo = getDbStatus();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (isMongo) {
      const existing = await User.findOne({ email: cleanEmail });
      if (existing) {
        return res.status(400).json({ success: false, message: 'A user with this email already exists' });
      }

      const newUser = await User.create({
        name: name.trim(),
        email: cleanEmail,
        password: hashedPassword,
        phone: cleanPhone,
        countryCode: cleanCountryCode,
        role: role === 'admin' ? 'admin' : 'user',
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name.trim())}`,
        points: 50,
        badges: ['DevOps Pioneer'],
        completedSessions: [0],
        bookmarkedSessions: [],
        quizProgress: [],
      });

      return res.status(201).json({
        success: true,
        message: 'User created successfully',
        user: newUser,
      });
    } else {
      const existing = inMemoryUsers.find((u) => u.email.toLowerCase() === cleanEmail);
      if (existing) {
        return res.status(400).json({ success: false, message: 'A user with this email already exists' });
      }

      const newUser = {
        _id: 'user_' + Date.now(),
        name: name.trim(),
        email: cleanEmail,
        password: hashedPassword,
        phone: cleanPhone,
        countryCode: cleanCountryCode,
        role: role === 'admin' ? 'admin' : 'user',
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name.trim())}`,
        points: 50,
        badges: ['DevOps Pioneer'],
        completedSessions: [0],
        bookmarkedSessions: [],
        quizProgress: [],
        createdAt: new Date().toISOString(),
      };

      inMemoryUsers.unshift(newUser);

      return res.status(201).json({
        success: true,
        message: 'User created successfully',
        user: newUser,
      });
    }
  } catch (err) {
    console.error('Error creating user:', err);
    return res.status(500).json({ success: false, message: 'Server error creating user' });
  }
};

// Update an existing user from Admin Panel
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, countryCode, role, password, points } = req.body;

    const isMongo = getDbStatus();
    const updateData = {};

    if (name) updateData.name = name.trim();
    if (email) updateData.email = email.trim().toLowerCase();
    if (phone !== undefined) updateData.phone = phone.replace(/\D/g, '').slice(-10);
    if (countryCode !== undefined) updateData.countryCode = countryCode;
    if (role) updateData.role = role === 'admin' ? 'admin' : 'user';
    if (points !== undefined) updateData.points = Number(points);

    if (password && password.trim().length >= 6) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password.trim(), salt);
    }

    if (isMongo && mongoose.Types.ObjectId.isValid(id)) {
      const updated = await User.findByIdAndUpdate(id, updateData, { new: true });
      if (!updated) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      return res.json({ success: true, message: 'User updated successfully', user: updated });
    } else {
      const index = inMemoryUsers.findIndex((u) => u._id === id);
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      inMemoryUsers[index] = { ...inMemoryUsers[index], ...updateData };
      return res.json({ success: true, message: 'User updated successfully', user: inMemoryUsers[index] });
    }
  } catch (err) {
    console.error('Error updating user:', err);
    return res.status(500).json({ success: false, message: 'Server error updating user' });
  }
};

// Delete user from Admin Panel
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const isMongo = getDbStatus();

    if (isMongo && mongoose.Types.ObjectId.isValid(id)) {
      const deleted = await User.findByIdAndDelete(id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      return res.json({ success: true, message: 'User deleted successfully' });
    } else {
      const index = inMemoryUsers.findIndex((u) => u._id === id);
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      inMemoryUsers.splice(index, 1);
      return res.json({ success: true, message: 'User deleted successfully' });
    }
  } catch (err) {
    console.error('Error deleting user:', err);
    return res.status(500).json({ success: false, message: 'Server error deleting user' });
  }
};

// Get leaderboard for admin
export const getAdminLeaderboard = async (req, res) => {
  try {
    const isMongo = getDbStatus();
    let users = [];
    if (isMongo) {
      users = await User.find({ role: { $ne: 'admin' } }).select('name email avatar points badges completedSessions quizProgress role createdAt');
    } else {
      users = inMemoryUsers.filter((u) => u.role !== 'admin');
    }

    const leaderboard = users.map((u) => {
      const comp = u.completedSessions || [];
      const qProg = u.quizProgress || [];
      const badges = u.badges && u.badges.length > 0 ? u.badges : calculateBadges(comp, qProg);
      const points = u.points !== undefined && u.points !== null ? u.points : calculatePoints(comp, qProg);

      return {
        id: u._id,
        _id: u._id,
        name: u.name,
        email: u.email,
        role: u.role || 'user',
        points,
        badges,
        completedCount: comp.length,
        completedSessions: comp,
        quizzesPassed: qProg.filter((q) => q.passed).length,
        quizProgress: qProg,
        createdAt: u.createdAt,
      };
    });

    leaderboard.sort((a, b) => b.points - a.points || b.completedCount - a.completedCount);
    const ranked = leaderboard.map((item, idx) => ({ ...item, rank: idx + 1 }));

    return res.json({ success: true, count: ranked.length, leaderboard: ranked });
  } catch (err) {
    console.error('Error fetching admin leaderboard:', err);
    return res.status(500).json({ success: false, message: 'Server error retrieving leaderboard' });
  }
};

// Update leaderboard entry (points, badges, name)
export const updateLeaderboardEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const { points, badges, completedSessions, name } = req.body;
    const isMongo = getDbStatus();

    const updateData = {};
    if (points !== undefined) updateData.points = Number(points);
    if (badges !== undefined) updateData.badges = Array.isArray(badges) ? badges : [badges];
    if (completedSessions !== undefined) updateData.completedSessions = completedSessions;
    if (name) updateData.name = name.trim();

    if (isMongo && mongoose.Types.ObjectId.isValid(id)) {
      const updated = await User.findByIdAndUpdate(id, updateData, { new: true });
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Leaderboard entry not found' });
      }
      return res.json({ success: true, message: 'Leaderboard entry updated', entry: updated });
    } else {
      const index = inMemoryUsers.findIndex((u) => u._id === id);
      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Leaderboard entry not found' });
      }
      inMemoryUsers[index] = { ...inMemoryUsers[index], ...updateData };
      return res.json({ success: true, message: 'Leaderboard entry updated', entry: inMemoryUsers[index] });
    }
  } catch (err) {
    console.error('Error updating leaderboard entry:', err);
    return res.status(500).json({ success: false, message: 'Server error updating leaderboard' });
  }
};

// Create a new leaderboard record
export const createLeaderboardEntry = async (req, res) => {
  try {
    const { name, email, points = 100, badges = ['DevOps Pioneer'], completedCount = 0 } = req.body;
    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Name and email are required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const isMongo = getDbStatus();
    const completedSessions = Array.from({ length: Math.min(Number(completedCount) || 0, 55) }, (_, i) => i);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('learner123', salt);

    if (isMongo) {
      const existing = await User.findOne({ email: cleanEmail });
      if (existing) {
        existing.points = Number(points);
        if (badges) existing.badges = badges;
        if (completedSessions.length) existing.completedSessions = completedSessions;
        await existing.save();
        return res.json({ success: true, message: 'Student leaderboard points updated', entry: existing });
      }

      const newUser = await User.create({
        name: name.trim(),
        email: cleanEmail,
        password: hashedPassword,
        points: Number(points),
        badges: Array.isArray(badges) ? badges : [badges],
        completedSessions,
        quizProgress: [],
      });
      return res.status(201).json({ success: true, message: 'Leaderboard entry added', entry: newUser });
    } else {
      const existing = inMemoryUsers.find((u) => u.email.toLowerCase() === cleanEmail);
      if (existing) {
        existing.points = Number(points);
        if (badges) existing.badges = badges;
        if (completedSessions.length) existing.completedSessions = completedSessions;
        return res.json({ success: true, message: 'Student leaderboard points updated', entry: existing });
      }

      const newUser = {
        _id: 'user_' + Date.now(),
        name: name.trim(),
        email: cleanEmail,
        password: hashedPassword,
        points: Number(points),
        badges: Array.isArray(badges) ? badges : [badges],
        completedSessions,
        quizProgress: [],
        createdAt: new Date().toISOString(),
      };
      inMemoryUsers.unshift(newUser);
      return res.status(201).json({ success: true, message: 'Leaderboard entry added', entry: newUser });
    }
  } catch (err) {
    console.error('Error creating leaderboard entry:', err);
    return res.status(500).json({ success: false, message: 'Server error creating leaderboard entry' });
  }
};

// Reset leaderboard score for a student
export const resetLeaderboardEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const isMongo = getDbStatus();

    if (isMongo && mongoose.Types.ObjectId.isValid(id)) {
      const updated = await User.findByIdAndUpdate(id, { points: 0, badges: [], completedSessions: [] }, { new: true });
      if (!updated) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      return res.json({ success: true, message: 'Leaderboard score reset to 0' });
    } else {
      const user = inMemoryUsers.find((u) => u._id === id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      user.points = 0;
      user.badges = [];
      user.completedSessions = [];
      return res.json({ success: true, message: 'Leaderboard score reset to 0' });
    }
  } catch (err) {
    console.error('Error resetting leaderboard:', err);
    return res.status(500).json({ success: false, message: 'Server error resetting score' });
  }
};

// Recalculate leaderboard scores for all users
export const recalculateLeaderboard = async (req, res) => {
  try {
    const isMongo = getDbStatus();
    if (isMongo) {
      const users = await User.find({});
      for (const u of users) {
        const comp = u.completedSessions || [];
        const qProg = u.quizProgress || [];
        const badges = calculateBadges(comp, qProg);
        const points = calculatePoints(comp, qProg);
        u.points = points;
        u.badges = badges;
        await u.save();
      }
      return res.json({ success: true, message: `Recalculated scores for ${users.length} users` });
    } else {
      inMemoryUsers.forEach((u) => {
        const comp = u.completedSessions || [];
        const qProg = u.quizProgress || [];
        u.badges = calculateBadges(comp, qProg);
        u.points = calculatePoints(comp, qProg);
      });
      return res.json({ success: true, message: `Recalculated scores for ${inMemoryUsers.length} users` });
    }
  } catch (err) {
    console.error('Error recalculating leaderboard:', err);
    return res.status(500).json({ success: false, message: 'Server error recalculating leaderboard' });
  }
};

