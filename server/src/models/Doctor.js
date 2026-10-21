import mongoose from 'mongoose';

const timeSlotSchema = new mongoose.Schema(
  {
    start: { type: String, required: true }, // "09:00"
    end: { type: String, required: true },   // "13:00"
  },
  { _id: false }
);

const dayScheduleSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      required: true,
    },
    isAvailable: { type: Boolean, default: true },
    slots: [timeSlotSchema],
    breakSlots: [timeSlotSchema],
  },
  { _id: false }
);

const doctorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    specialization: {
      type: String,
      required: [true, 'Specialization is required'],
      trim: true,
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
    },
    qualification: {
      type: String,
      default: '',
    },
    designation: {
      type: String,
      default: '',
    },
    expertise: {
      type: String,
      default: '',
    },
    experience: {
      type: Number,
      default: 0,
    },
    experienceDisplay: {
      type: String,
      default: '',
    },
    hospitalPhone: {
      type: String,
      default: '+91 44 42002288',
    },
    emergencyPhone: {
      type: String,
      default: '105710',
    },
    informationSource: {
      type: String,
      default: '',
    },
    consultationFee: {
      type: Number,
      default: 500,
    },
    appointmentDuration: {
      type: Number,
      default: 60, // in minutes (1-hour slots)
    },
    maxPatientsPerSlot: {
      type: Number,
      default: 10,
    },
    bio: {
      type: String,
      default: '',
      maxlength: 1000,
    },
    clinicName: {
      type: String,
      default: 'MIOT International',
    },
    clinicAddress: {
      type: String,
      default: '4/112, Mount Poonamallee Road, Manapakkam, Chennai - 600089',
    },
    schedule: [dayScheduleSchema],
    unavailableDates: [
      {
        date: Date,
        reason: { type: String, default: '' },
      },
    ],
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
    totalPatients: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

doctorSchema.index({ specialization: 1 });
doctorSchema.index({ department: 1 });
doctorSchema.index({ user: 1 });

const Doctor = mongoose.model('Doctor', doctorSchema);
export default Doctor;
