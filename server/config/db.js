import mongoose from 'mongoose';

let isMongoConnected = false;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/learnwithcdh';
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500, // Quick timeout so fallback engages cleanly if no local mongo daemon
    });
    isMongoConnected = true;
    console.log(` MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    isMongoConnected = false;
    console.warn(`⚠️  MongoDB connection warning: ${error.message}`);
    console.log(`ℹ️  Running in high-performance Hybrid Mode (In-Memory State active with mock DB)`);
  }
};

export const getDbStatus = () => isMongoConnected;
