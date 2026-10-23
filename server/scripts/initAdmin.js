import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/learnwithcdh';
const adminEmail = (process.env.ADMIN_EMAIL || 'admin@clouddevopshub.com').trim().toLowerCase();
const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
const adminName = process.env.ADMIN_NAME || 'CDH Admin Instructor';

async function run() {
  console.log(' Connecting to MongoDB Atlas...');
  await mongoose.connect(uri);
  console.log(' Connected to DB:', mongoose.connection.name);

  // 1. Wipe all users
  const deleteResult = await mongoose.connection.db.collection('users').deleteMany({});
  console.log(` Cleared all ${deleteResult.deletedCount} existing user(s) from database.`);

  // 2. Hash admin password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(adminPassword, salt);

  // 3. Create fresh admin account
  const newAdmin = {
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
  };

  const insertResult = await mongoose.connection.db.collection('users').insertOne(newAdmin);
  console.log(` Created Admin successfully with ID: ${insertResult.insertedId}`);
  console.log(`   - Email: ${adminEmail}`);
  console.log(`   - Role: admin`);
  console.log(`   - Credentials read from: server/.env`);

  // 4. Verify count
  const totalUsers = await mongoose.connection.db.collection('users').countDocuments();
  const regularStudents = await mongoose.connection.db.collection('users').countDocuments({ role: { $ne: 'admin' } });

  console.log('\n Status Summary:');
  console.log(`   - Total users in DB: ${totalUsers}`);
  console.log(`   - Regular students in DB: ${regularStudents} (Empty - Clean Leaderboard)`);
  console.log(`   - Admin users in DB: ${totalUsers - regularStudents}`);

  await mongoose.disconnect();
  console.log('\n Database reset & admin initialization complete!');
}

run().catch((err) => {
  console.error(' Error initializing admin:', err);
  process.exit(1);
});
