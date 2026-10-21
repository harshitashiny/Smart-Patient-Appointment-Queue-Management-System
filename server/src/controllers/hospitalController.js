import Hospital from '../models/Hospital.js';
import Doctor from '../models/Doctor.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

// Calculate distance in kilometers using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(1));
};

/**
 * GET /api/hospitals - List hospitals (with optional nearby geo-sorting)
 */
export const getHospitals = async (req, res) => {
  try {
    const { lat, lon, maxDistance } = req.query;

    // Platform is exclusively for MIOT International online appointments
    const query = { name: { $regex: 'MIOT International', $options: 'i' } };

    let hospitals = await Hospital.find(query).lean();

    if (lat && lon && !isNaN(Number(lat)) && !isNaN(Number(lon))) {
      const userLat = Number(lat);
      const userLon = Number(lon);

      hospitals = hospitals.map((h) => {
        const dist = calculateDistance(userLat, userLon, h.location.lat, h.location.lon);
        return { ...h, distanceKm: dist };
      });

      if (maxDistance && !isNaN(Number(maxDistance))) {
        hospitals = hospitals.filter((h) => h.distanceKm <= Number(maxDistance));
      }

      hospitals.sort((a, b) => a.distanceKm - b.distanceKm);
    } else {
      // Default sort by rating
      hospitals.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return sendSuccess(res, { hospitals });
  } catch (error) {
    console.error('Get hospitals error:', error);
    return sendError(res, 'Failed to fetch hospitals', 500);
  }
};

/**
 * GET /api/hospitals/:id - Get hospital details and associated doctors
 */
export const getHospitalById = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id);
    if (!hospital) {
      return sendError(res, 'Hospital not found', 404);
    }

    const doctors = await Doctor.find({
      clinicName: { $regex: hospital.name, $options: 'i' },
    })
      .populate('user', 'name email phone avatar')
      .populate('department', 'name');

    return sendSuccess(res, { hospital, doctors });
  } catch (error) {
    return sendError(res, 'Failed to fetch hospital details', 500);
  }
};
