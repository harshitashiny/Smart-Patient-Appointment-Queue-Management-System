import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

async function verifyAllDoctors() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/smartcare';
  await mongoose.connect(mongoUri);

  const User = mongoose.model('User', new mongoose.Schema({
    name: String,
    avatar: String,
    role: String,
    gender: String,
  }, { strict: false }));

  const doctorUsers = await User.find({ role: 'doctor' }).select('name avatar gender role');
  console.log(`Found ${doctorUsers.length} doctor users in MongoDB:`);
  
  const avatars = new Set();
  let duplicates = 0;
  for (const doc of doctorUsers) {
    if (avatars.has(doc.avatar)) {
      console.log(`DUPLICATE AVATAR: ${doc.name} (${doc.gender}) -> ${doc.avatar}`);
      duplicates++;
    } else {
      avatars.add(doc.avatar);
    }
  }

  console.log(`Summary: ${doctorUsers.length} doctors, ${avatars.size} unique avatars, ${duplicates} duplicates.`);
  await mongoose.disconnect();
}

verifyAllDoctors().catch(console.error);
