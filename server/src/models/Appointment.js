import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: String,
      unique: true,
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
    date: {
      type: Date,
      required: [true, 'Appointment date is required'],
    },
    timeSlot: {
      start: { type: String, required: true }, // "10:00"
      end: { type: String, required: true },   // "10:15"
    },
    status: {
      type: String,
      enum: [
        'pending',
        'confirmed',
        'checked-in',
        'waiting',
        'in-consultation',
        'completed',
        'cancelled',
        'no-show',
      ],
      default: 'pending',
    },
    reason: {
      type: String,
      default: '',
      maxlength: 500,
    },
    notes: {
      type: String,
      default: '',
    },
    tokenNumber: {
      type: Number,
    },
    queuePosition: {
      type: Number,
    },
    consultationStartTime: Date,
    consultationEndTime: Date,
    cancelledBy: {
      type: String,
      enum: ['patient', 'doctor', 'admin', ''],
      default: '',
    },
    cancellationReason: {
      type: String,
      default: '',
    },
    followUpDate: Date,
    reminderSent: {
      dayBefore: { type: Boolean, default: false },
      hourBefore: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true,
  }
);

appointmentSchema.index({ patient: 1, date: 1 });
appointmentSchema.index({ doctor: 1, date: 1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ appointmentId: 1 });
appointmentSchema.index({ date: 1 });

const Appointment = mongoose.model('Appointment', appointmentSchema);
export default Appointment;
