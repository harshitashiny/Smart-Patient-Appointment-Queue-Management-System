/**
 * Script: cap_experience.js
 * Randomly assigns experience (1–10 years) to every doctor in the database
 * and updates experienceDisplay accordingly.
 *
 * Run: node server/src/scripts/cap_experience.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import Doctor from '../models/Doctor.js';

const randomExp = () => Math.floor(Math.random() * 10) + 1; // 1–10

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ MongoDB connected');

  const doctors = await Doctor.find({});
  console.log(`📋 Found ${doctors.length} doctors`);

  let updated = 0;
  for (const doc of doctors) {
    const exp = randomExp();
    doc.experience = exp;
    doc.experienceDisplay = `${exp} year${exp > 1 ? 's' : ''}`;
    await doc.save();
    updated++;
    process.stdout.write(`\r  ✏️  Updated ${updated}/${doctors.length}`);
  }

  console.log(`\n🎉 Done! Randomly assigned 1–10 years of experience to ${updated} doctors.`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error('❌ Error:', err);
  process.exit(1);
});
