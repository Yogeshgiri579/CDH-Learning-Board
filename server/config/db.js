import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

let isMongoConnected = false;

export const ensureAdminUser = async () => {
  try {
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@clouddevopshub.com').trim().toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const adminName = process.env.ADMIN_NAME || 'CDH Admin Instructor';

    const existingAdmin = await mongoose.connection.db.collection('users').findOne({ email: adminEmail });
    if (!existingAdmin) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminPassword, salt);
      await mongoose.connection.db.collection('users').insertOne({
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        phone: '',
        countryCode: '+91',
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(adminName)}`,
        points: 0,
        badges: [],
        completedSessions: [],
        bookmarkedSessions: [],
        quizProgress: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log(` Admin account ensured in MongoDB from ENV: ${adminEmail}`);
    }
  } catch (err) {
    console.warn('⚠️ Could not verify admin existence:', err.message);
  }
};

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/learnwithcdh';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500, // Quick timeout so fallback engages cleanly if no local mongo daemon
    });
    isMongoConnected = true;
    console.log(` MongoDB Connected: ${conn.connection.host}`);
    await ensureAdminUser();
  } catch (error) {
    isMongoConnected = false;
    console.warn(`⚠️  MongoDB connection warning: ${error.message}`);
    console.log(`ℹ️  Running in high-performance Hybrid Mode (In-Memory State active with mock DB)`);
  }
};

export const getDbStatus = () => isMongoConnected;

