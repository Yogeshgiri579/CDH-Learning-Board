import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: false, // Optional for Google OAuth users
    },
    googleId: {
      type: String,
      default: null,
    },
    avatar: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    completedSessions: {
      type: [Number], // array of session numbers e.g. [0, 1, 2]
      default: [],
    },
    bookmarkedSessions: {
      type: [Number],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model('User', userSchema);

// In-Memory store for instances without a local MongoDB running
export const inMemoryUsers = [
  {
    _id: 'demo_user_123',
    name: 'Cloud Learner (Demo)',
    email: 'learner@clouddevopshub.com',
    password: '$2a$10$DEMOHASHEDPASSWORD...',
    googleId: null,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    role: 'user',
    completedSessions: [0, 1],
    bookmarkedSessions: [2, 5],
  },
  {
    _id: 'admin_user_001',
    name: 'CDH Admin Instructor',
    email: 'admin@clouddevopshub.com',
    password: '$2a$10$DEMOHASHEDPASSWORD...',
    googleId: null,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
    role: 'admin',
    completedSessions: [0, 1, 2, 3, 4, 5],
    bookmarkedSessions: [],
  }
];
