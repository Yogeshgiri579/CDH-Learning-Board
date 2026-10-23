import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/learnwithcdh';

async function run() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(uri);
  console.log('Connected to:', mongoose.connection.name);

  const dummyEmails = [
    'test12345@example.com',
    'googletest1@example.com',
    'dev_1791367201536@cdh.io',
    'octo@github.test',
    'testlearner@example.com',
    'devops.learner@gmail.com',
    'learner.google@clouddevopshub.com',
    'octo.engineer@clouddevopshub.com',
    'learner@clouddevopshub.com',
  ];

  const result = await mongoose.connection.db.collection('users').deleteMany({
    email: { $in: dummyEmails }
  });

  console.log(`Deleted ${result.deletedCount} dummy test users.`);

  const remaining = await mongoose.connection.db.collection('users').find({}).toArray();
  console.log('Remaining clean users in database:');
  remaining.forEach(u => console.log(`- ${u.name} (${u.email}) [role: ${u.role || 'user'}]`));

  await mongoose.disconnect();
  console.log('Done!');
}

run().catch(err => {
  console.error('Error cleaning dummy data:', err);
  process.exit(1);
});
