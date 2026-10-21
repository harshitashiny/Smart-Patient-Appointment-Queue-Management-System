import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

async function run() {
  await mongoose.connect('mongodb://127.0.0.1:27017/smartcare');
  const hash = await bcrypt.hash('password123', 12);
  const res = await mongoose.connection.collection('users').updateOne(
    { email: 'murali@gmail.com' },
    { $set: { isApproved: true, password: hash } }
  );
  console.log('Approved murali@gmail.com:', res.modifiedCount);
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
