import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const update = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/smartcare');
    console.log('Connected to MongoDB');

    const standardSlots = [
      { start: '09:30', end: '10:30' },
      { start: '10:30', end: '11:30' },
      { start: '11:30', end: '12:30' },
      { start: '13:30', end: '14:30' },
      { start: '14:30', end: '15:30' },
      { start: '15:30', end: '16:30' },
      { start: '16:30', end: '17:00' },
      { start: '17:30', end: '18:30' },
      { start: '18:30', end: '19:30' },
      { start: '19:30', end: '20:30' },
      { start: '20:30', end: '21:30' },
    ];
    const standardBreaks = [
      { start: '12:30', end: '13:30' },
      { start: '17:00', end: '17:30' },
    ];
    const schedule = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].map((day) => ({
      day,
      isAvailable: true,
      slots: standardSlots,
      breakSlots: standardBreaks,
    })).concat([
      { day: 'sunday', isAvailable: false, slots: [], breakSlots: [] },
    ]);

    const result = await mongoose.connection.collection('doctors').updateMany(
      {},
      {
        $set: {
          schedule,
          maxPatientsPerSlot: 10,
          appointmentDuration: 60,
          hospitalPhone: '+91 44 42002288',
          emergencyPhone: '105710',
        },
      }
    );

    console.log(`Successfully updated ${result.modifiedCount} doctors with 11 slots and 10 max patients.`);
    process.exit(0);
  } catch (err) {
    console.error('Update failed:', err);
    process.exit(1);
  }
};

update();
