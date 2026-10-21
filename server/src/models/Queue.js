import mongoose from 'mongoose';

const queueEntrySchema = new mongoose.Schema(
  {
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
      required: true,
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tokenNumber: {
      type: Number,
      required: true,
    },
    position: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['waiting', 'next', 'in-consultation', 'completed', 'skipped', 'no-show'],
      default: 'waiting',
    },
    checkInTime: {
      type: Date,
      default: Date.now,
    },
    consultationStartTime: Date,
    consultationEndTime: Date,
    estimatedWaitTime: {
      type: Number, // in minutes
      default: 0,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

queueEntrySchema.index({ doctor: 1, date: 1 });
queueEntrySchema.index({ patient: 1, date: 1 });
queueEntrySchema.index({ status: 1 });

const Queue = mongoose.model('Queue', queueEntrySchema);
export default Queue;
