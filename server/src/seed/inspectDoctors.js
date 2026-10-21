import dotenv from 'dotenv';
dotenv.config();
import connectDB from '../config/db.js';
import Doctor from '../models/Doctor.js';

async function run() {
  await connectDB();
  const counts = await Doctor.aggregate([
    { $group: { _id: '$specialization', count: { $sum: 1 }, clinics: { $addToSet: '$clinicName' } } },
    { $sort: { count: -1 } }
  ]);
  console.log(JSON.stringify(counts, null, 2));
  process.exit(0);
}

run();
