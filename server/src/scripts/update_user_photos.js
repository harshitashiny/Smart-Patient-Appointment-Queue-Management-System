import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

const USER_PROVIDED_PHOTOS = {
  "Prof. Dr. P. V. A. Mohandas": "/doctors/doctor_pva_mohandas.jpg",
  "Dr. P. V. A. Mohandas": "/doctors/doctor_pva_mohandas.jpg",
  "Dr. Rajan Ravichandran": "/doctors/doctor_rajan_ravichandran.png",
  "Dr. Surendran Rajagopal": "/doctors/doctor_surendran_rajagopal.png",
  "Dr. A. Murali": "/doctors/doctor_a_murali.png",
  "Dr. Sundararajan Sridhar": "/doctors/doctor_sundararajan_sridhar.png",
  "Dr. S. Palaniappan": "/doctors/doctor_s_palaniappan.png",
};

async function updateDbUserProvidedPhotos() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/smartcare';
  await mongoose.connect(mongoUri);

  const User = mongoose.model('User', new mongoose.Schema({
    name: String,
    avatar: String,
    role: String,
  }, { strict: false }));

  let updated = 0;
  for (const [name, photoUrl] of Object.entries(USER_PROVIDED_PHOTOS)) {
    const res = await User.updateMany(
      { name: name.trim() },
      { $set: { avatar: photoUrl } }
    );
    if (res.modifiedCount > 0) {
      updated += res.modifiedCount;
      console.log(`Updated user avatar for "${name}" -> ${photoUrl}`);
    }
  }

  console.log(`Successfully updated ${updated} official user-provided doctor portraits in MongoDB!`);
  await mongoose.disconnect();
}

updateDbUserProvidedPhotos().catch(console.error);
