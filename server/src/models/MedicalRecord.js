import mongoose from 'mongoose';

const medicalRecordSchema = new mongoose.Schema(
  {
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
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
      required: true,
    },
    symptoms: {
      type: String,
      default: '',
    },
    diagnosis: {
      type: String,
      default: '',
    },
    prescription: {
      type: String,
      default: '',
    },
    notes: {
      type: String,
      default: '',
    },
    vitals: {
      bloodPressure: { type: String, default: '' },
      temperature: { type: String, default: '' },
      heartRate: { type: String, default: '' },
      weight: { type: String, default: '' },
    },
    followUpDate: Date,
    attachments: [String],
  },
  {
    timestamps: true,
  }
);

medicalRecordSchema.index({ patient: 1 });
medicalRecordSchema.index({ doctor: 1 });
medicalRecordSchema.index({ appointment: 1 });

const MedicalRecord = mongoose.model('MedicalRecord', medicalRecordSchema);
export default MedicalRecord;
