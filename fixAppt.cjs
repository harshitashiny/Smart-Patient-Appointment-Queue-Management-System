const mongoose = require('./server/node_modules/mongoose');

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/smartcare');
  const meenakshi = await mongoose.connection.collection('users').findOne({ name: 'Dr. M. S. Meenakshi' });
  const joshika = await mongoose.connection.collection('users').findOne({ email: 'joshika@gmail.com' });
  console.log('Meenakshi:', meenakshi?._id, 'Joshika:', joshika?._id);

  if (meenakshi && joshika) {
    const updateRes = await mongoose.connection.collection('appointments').updateOne(
      { _id: new mongoose.Types.ObjectId('6ac48d83c520aa1d02c46524') },
      { $set: { patient: joshika._id, doctor: meenakshi._id } }
    );
    console.log('Updated appointment:', updateRes.modifiedCount);
  }
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
