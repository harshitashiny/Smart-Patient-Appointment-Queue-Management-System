import mongoose from 'mongoose';

const hospitalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Hospital name is required'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
    },
    city: {
      type: String,
      default: 'Chennai',
    },
    state: {
      type: String,
      default: 'Tamil Nadu',
    },
    type: {
      type: String,
      default: 'Multi-Specialty Hospital',
    },
    location: {
      lat: { type: Number, required: true },
      lon: { type: Number, required: true },
    },
    phone: {
      type: String,
      default: '+91 44 2829 0200',
    },
    emergencyAvailable: {
      type: Boolean,
      default: true,
    },
    openHours: {
      type: String,
      default: '24/7 Open',
    },
    rating: {
      type: Number,
      default: 4.8,
    },
    totalReviews: {
      type: Number,
      default: 120,
    },
    img: {
      type: String,
      default: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=600&q=80',
    },
    departments: [
      {
        type: String,
      },
    ],
    availableBeds: {
      type: Number,
      default: 45,
    },
    establishedYear: {
      type: Number,
      default: 1995,
    },
  },
  {
    timestamps: true,
  }
);

hospitalSchema.index({ name: 'text', address: 'text', city: 'text' });
hospitalSchema.index({ 'location.lat': 1, 'location.lon': 1 });

const Hospital = mongoose.model('Hospital', hospitalSchema);
export default Hospital;
