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
    phone: {
      type: String,
      default: '',
    },
    countryCode: {
      type: String,
      default: '+91',
    },
    points: {
      type: Number,
      default: 0,
    },
    badges: {
      type: [String],
      default: [],
    },
    completedSessions: {
      type: [Number], // array of session numbers e.g. [0, 1, 2]
      default: [],
    },
    bookmarkedSessions: {
      type: [Number],
      default: [],
    },
    quizProgress: {
      type: [
        {
          sessionNumber: { type: Number, required: true },
          score: { type: Number, required: true },
          totalQuestions: { type: Number, required: true },
          percentage: { type: Number, required: true },
          passed: { type: Boolean, default: false },
          completedAt: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model('User', userSchema);

// In-Memory store fallback when running without MongoDB connection
export const inMemoryUsers = [
  {
    _id: 'admin_user_001',
    name: 'CDH Admin Instructor',
    email: 'admin@clouddevopshub.com',
    phone: '9876543210',
    countryCode: '+91',
    password: '$2a$10$DEMOHASHEDPASSWORD...',
    googleId: null,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
    role: 'admin',
    points: 0,
    badges: [],
    completedSessions: [],
    bookmarkedSessions: [],
    quizProgress: [],
    createdAt: new Date('2026-09-01T10:00:00Z').toISOString(),
  },
];
