import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import { getFavorites, isFavorite, toggleFavorite } from '../utils/favoriteUtils';
import { getDoctorPhoto } from '../utils/doctorPhotos';

const LOCATIONS = [
  { label: 'All MIOT International Centers', value: 'all' },
  { label: 'MIOT Main Hospital Campus (Manapakkam, Chennai)', value: 'all' },
  { label: 'MIOT Institute of Orthopaedics', value: 'Orthopaedics' },
  { label: 'MIOT Institute of Cardiac Care', value: 'Cardiac' },
  { label: 'Center for Gastrointestinal & Liver Diseases', value: 'Gastro' },
  { label: 'MIOT Institute of Nephrology', value: 'Nephrology' },
  { label: 'MIOT Institute of Cancer Cure', value: 'Oncology' },
];

const ALL_SPECIALTIES = [
  'Cardiology',
  'Neurology',
  'Pulmonology',
  'General Medicine',
  'Orthopedics',
  'Oncology',
  'Pediatrics',
  'Obstetrics & Gynecology',
  'Dermatology',
  'Ophthalmology',
  'ENT',
  'Psychiatry',
  'Dentistry',
  'Nephrology',
  'Hematology',
  'Endocrinology',
  'Infectious Diseases',
  'Gastroenterology',
  'Emergency Medicine',
  'General Surgery'
];

// Fallback avatar component using distinct photo or initials
const DoctorAvatar = ({ name, avatar, doc }) => {
  const [imgError, setImgError] = useState(false);
  const photo = getDoctorPhoto(doc || { name, user: { name, avatar } });

  if (photo && !imgError) {
    return (
      <img
        src={photo}
        alt={name}
        className="w-full h-full object-cover"
        onError={() => setImgError(true)}
      />
    );
  }

  const initials = name
    ? name
        .replace(/^(Dr\.|Dr)\s*/i, '')
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'DR';

  return (
    <div className="w-full h-full bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center text-white font-black text-xl shadow-inner">
      {initials}
    </div>
  );
};

export default function DoctorSearch() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedSpecialty, setSelectedSpecialty] = useState(searchParams.get('specialization') || 'all');
  const [selectedClinic, setSelectedClinic] = useState(searchParams.get('clinic') || '');
  const [selectedLocation, setSelectedLocation] = useState(searchParams.get('location') || 'all');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [favMap, setFavMap] = useState({});

  // Listen to favorite updates
  const refreshFavMap = useCallback(() => {
    const favs = getFavorites();
    const map = {};
    favs.forEach((f) => {
      const id = typeof f === 'string' ? f : f._id;
      if (id) map[id] = true;
    });
    setFavMap(map);
  }, []);

  useEffect(() => {
    refreshFavMap();
    const handleFavChange = () => refreshFavMap();
    window.addEventListener('favoritesUpdated', handleFavChange);
    return () => window.removeEventListener('favoritesUpdated', handleFavChange);
  }, [refreshFavMap]);

  // Sync state with URL search params changes
  useEffect(() => {
    const qParam = searchParams.get('q') || '';
    const specParam = searchParams.get('specialization') || 'all';
    const clinicParam = searchParams.get('clinic') || '';
    const locParam = searchParams.get('location') || 'all';

    setSearchQuery(qParam);
    setSelectedSpecialty(specParam);
    setSelectedClinic(clinicParam);
    setSelectedLocation(locParam);
  }, [searchParams]);

  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    try {
      let url = '/doctors?';
      const params = [];

      if (searchQuery.trim()) {
        params.push(`search=${encodeURIComponent(searchQuery.trim())}`);
      }
      if (selectedSpecialty && selectedSpecialty !== 'all') {
        params.push(`specialization=${encodeURIComponent(selectedSpecialty)}`);
      }
      if (selectedClinic && selectedClinic.trim()) {
        params.push(`clinic=${encodeURIComponent(selectedClinic.trim())}`);
      }

      url += params.join('&');
      const res = await api.get(url);
      setDoctors(res.data.data.doctors || []);
    } catch (error) {
      console.error('Failed to fetch doctors:', error);
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedSpecialty, selectedClinic]);

  useEffect(() => {
    const timer = setTimeout(fetchDoctors, 250);
    return () => clearTimeout(timer);
  }, [fetchDoctors]);

  const handleSpecialtySelect = (spec) => {
    setSelectedSpecialty(spec);
    const newParams = new URLSearchParams(searchParams);
    if (spec === 'all') {
      newParams.delete('specialization');
    } else {
      newParams.set('specialization', spec);
    }
    setSearchParams(newParams);
  };

  const handleLocationSelect = (loc) => {
    setSelectedLocation(loc);
    const newParams = new URLSearchParams(searchParams);
    if (loc === 'all') {
      newParams.delete('location');
    } else {
      newParams.set('location', loc);
    }
    setSearchParams(newParams);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedSpecialty('all');
    setSelectedClinic('');
    setSelectedLocation('all');
    setShowOnlyFavorites(false);
    setSearchParams({});
  };

  const handleToggleDoctorFav = (e, doc) => {
    e.stopPropagation();
    toggleFavorite(doc);
    refreshFavMap();
  };

  // Filter list by favorites AND user location
  const displayedDoctors = doctors.filter((d) => {
    if (showOnlyFavorites && !favMap[d._id]) return false;
    if (selectedLocation && selectedLocation !== 'all') {
      const addr = (d.clinicAddress || '').toLowerCase();
      const clinic = (d.clinicName || '').toLowerCase();
      const loc = selectedLocation.toLowerCase();
      if (!addr.includes(loc) && !clinic.includes(loc)) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="animate-in fade-in duration-500 max-w-7xl mx-auto space-y-6 pb-20 font-sans">
      
      {/* ── TOP NAVIGATION BAR ── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-3 shadow-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/patient/home')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-700 font-bold transition-all cursor-pointer text-xs"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            <span>{t('Home')}</span>
          </button>
          <span className="text-slate-300 hidden sm:inline">/</span>
          <span className="text-xs font-bold text-slate-700 hidden sm:inline">{t('Find a Doctor')}</span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <Link
            to="/patient/home"
            className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-teal-700 hover:bg-slate-100 transition-colors flex items-center gap-1"
          >
            <span>🏠</span>
            <span className="hidden sm:inline">{t('Home')}</span>
          </Link>
          <Link
            to="/patient"
            className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-teal-700 hover:bg-slate-100 transition-colors flex items-center gap-1"
          >
            <span>📅</span>
            <span className="hidden sm:inline">{t('Appointments')}</span>
          </Link>
          <Link
            to="/patient/profile"
            className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-teal-700 hover:bg-slate-100 transition-colors flex items-center gap-1"
          >
            <span>👤</span>
            <span className="hidden sm:inline">{t('Profile')}</span>
          </Link>
        </div>
      </div>

      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
            {t('Find a Doctor')}
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1">
            {selectedSpecialty !== 'all'
              ? `${t(selectedSpecialty)} ${t('Specialized Doctors!')}`
              : t('Browse verified healthcare professionals across 20 specialties')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Favorites Filter Toggle */}
          <button
            onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer ${
              showOnlyFavorites
                ? 'bg-rose-500 text-white shadow-rose-200'
                : 'bg-white text-slate-700 hover:bg-rose-50 hover:text-rose-600 border border-slate-200'
            }`}
          >
            <span>❤️</span>
            <span>{t('Favorites')}</span>
          </button>

          {/* Clear Filters */}
          {(selectedSpecialty !== 'all' || selectedClinic || selectedLocation !== 'all' || searchQuery || showOnlyFavorites) && (
            <button
              onClick={handleClearFilters}
              className="text-xs font-bold bg-red-50 hover:bg-red-100 text-red-600 px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <span>✕ {t('Clear')}</span>
            </button>
          )}
        </div>
      </div>

      {/* ── SEARCH & LOCATION FILTER ROW ── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        {/* Search Input */}
        <div className="relative md:col-span-8">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-teal-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </div>
          <input
            type="text"
            placeholder={t('Search by specialty, doctor name...')}
            className="w-full pl-11 pr-10 py-3.5 rounded-2xl border-2 border-slate-100 bg-white/90 backdrop-blur focus:border-teal-500 focus:outline-none transition-all text-xs sm:text-sm font-bold text-slate-800 placeholder-slate-400 shadow-sm"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              const newParams = new URLSearchParams(searchParams);
              if (e.target.value) newParams.set('q', e.target.value);
              else newParams.delete('q');
              setSearchParams(newParams);
            }}
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                const newParams = new URLSearchParams(searchParams);
                newParams.delete('q');
                setSearchParams(newParams);
              }}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Location Dropdown */}
        <div className="relative md:col-span-4">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
          <select
            value={selectedLocation}
            onChange={(e) => handleLocationSelect(e.target.value)}
            className="w-full pl-10 pr-4 py-3.5 rounded-2xl border-2 border-slate-100 bg-white font-bold text-xs sm:text-sm text-slate-800 focus:border-teal-500 focus:outline-none transition-all shadow-sm cursor-pointer truncate"
          >
            {LOCATIONS.map((loc) => (
              <option key={loc.value} value={loc.value}>
                {t(loc.label)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── HORIZONTAL SPECIALTIES FILTER BAR (ALL 20 CATEGORIES) ── */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-black text-slate-600 uppercase tracking-wider">
            {t('Categories')} (20)
          </span>
          <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full">
            {displayedDoctors.length} {t('Doctor Details')}
          </span>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-200">
          {/* All button */}
          <button
            onClick={() => handleSpecialtySelect('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-black shrink-0 transition-all cursor-pointer ${
              selectedSpecialty === 'all'
                ? 'bg-gradient-to-r from-teal-600 to-blue-600 text-white shadow-md shadow-teal-500/20 scale-105'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            ✨ {t('All Specialties')}
          </button>

          {/* 20 Specialties */}
          {ALL_SPECIALTIES.map((spec) => (
            <button
              key={spec}
              onClick={() => handleSpecialtySelect(spec)}
              className={`px-3.5 py-2 rounded-xl text-xs font-black shrink-0 transition-all cursor-pointer ${
                selectedSpecialty.toLowerCase() === spec.toLowerCase()
                  ? 'bg-gradient-to-r from-teal-600 to-blue-600 text-white shadow-md shadow-teal-500/20 scale-105'
                  : 'bg-white text-slate-700 hover:bg-teal-50 hover:text-teal-700 border border-slate-200/80'
              }`}
            >
              {t(spec)}
            </button>
          ))}
        </div>
      </div>

      {/* ── DOCTORS LIST ── */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white p-5 rounded-3xl border border-slate-100 animate-pulse flex flex-col gap-4">
              <div className="flex gap-4">
                <div className="w-20 h-20 rounded-2xl bg-slate-100 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-100 rounded w-3/4" />
                  <div className="h-3 bg-slate-100 rounded w-1/2" />
                  <div className="h-3 bg-slate-100 rounded w-2/3" />
                </div>
              </div>
              <div className="h-10 bg-slate-100 rounded-xl" />
            </div>
          ))}
        </div>
      ) : displayedDoctors.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-200 max-w-lg mx-auto shadow-sm">
          <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </div>
          <h3 className="text-lg font-black text-slate-800 mb-1">{t('No doctors found')}</h3>
          <p className="text-slate-500 text-xs mb-5">{t('Try searching another keyword or specialty')}</p>
          <button
            onClick={handleClearFilters}
            className="px-5 py-2.5 bg-gradient-to-r from-teal-600 to-blue-600 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
          >
            {t('Show All Doctors')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedDoctors.map((doc) => {
            const isDoctorFav = !!favMap[doc._id];
            const doctorName = doc.user?.name || 'Dr. Specialist';

            return (
              <div
                key={doc._id}
                className="bg-white rounded-3xl p-5 border border-slate-100/90 hover:border-teal-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group relative"
              >
                {/* Favorite Heart on Card */}
                <button
                  onClick={(e) => handleToggleDoctorFav(e, doc)}
                  title={isDoctorFav ? t('Removed from Favorites') : t('Added to Favorites')}
                  className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all z-10 cursor-pointer shadow-sm ${
                    isDoctorFav
                      ? 'bg-rose-50 text-rose-600'
                      : 'bg-slate-50 text-slate-300 hover:text-rose-500 hover:bg-rose-50'
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill={isDoctorFav ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    strokeWidth="2.2"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </button>

                <div>
                  {/* Doctor Top Row: Avatar + Main Info */}
                  <div className="flex gap-4 items-start pr-8">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200/60 shadow-sm group-hover:scale-105 transition-transform duration-300">
                      <DoctorAvatar name={doctorName} avatar={doc.user?.avatar} doc={doc} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-teal-50 text-teal-700 border border-teal-100">
                          {t(doc.specialization)}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                          ✓ {t('Verified')}
                        </span>
                      </div>

                      <h3 className="font-black text-slate-900 text-base mt-1 truncate group-hover:text-teal-700 transition-colors">
                        {t(doctorName)}
                      </h3>

                      {doc.designation && (
                        <p className="text-[11px] font-bold text-teal-700 truncate mt-0.5">
                          {t(doc.designation)}
                        </p>
                      )}

                      {doc.qualification && (
                        <p className="text-[11px] font-semibold text-slate-500 line-clamp-1 mt-0.5">
                          🎓 {t(doc.qualification)}
                        </p>
                      )}

                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-amber-500 text-xs font-black">★ {doc.rating || 4.9}</span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          ({doc.totalRatings || 120} {t('reviews')})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Expertise Preview */}
                  {doc.expertise && (
                    <div className="mt-3 p-2 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{t('Specialization / Expertise')}</p>
                      <p className="text-xs text-slate-700 font-medium line-clamp-2 leading-relaxed">
                        {t(doc.expertise)}
                      </p>
                    </div>
                  )}

                  {/* Hospital / Clinic Info */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 text-slate-600 text-xs space-y-1">
                    <div className="flex items-center justify-between font-bold text-slate-800">
                      <div className="flex items-center gap-1.5 truncate">
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                        <span className="truncate">{t(doc.clinicName || 'MIOT International')}</span>
                      </div>
                      <span className="text-[10px] text-teal-700 font-bold bg-teal-50 px-2 py-0.5 rounded-md shrink-0">
                        📞 {doc.hospitalPhone || '+91 44 42002288'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-medium truncate pl-4">
                      {t(doc.clinicAddress || '4/112, Mount Poonamallee Road, Manapakkam, Chennai')}
                    </p>
                  </div>

                  {/* Badges: Exp + Fee + Source */}
                  <div className="grid grid-cols-2 gap-2 mt-3 p-2 bg-slate-50/80 rounded-2xl border border-slate-100 text-center">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">{t('Experience')}</p>
                      <p className="text-xs font-black text-slate-800">{t(doc.experienceDisplay || `${doc.experience || 10}+ Years`)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">{t('Fee')}</p>
                      <p className="text-xs font-black text-teal-700">₹{doc.consultationFee || 600}</p>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => navigate(`/patient/book/${doc._id}`)}
                  className="w-full mt-4 py-2.5 px-4 bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white rounded-xl text-xs font-black shadow-md shadow-teal-500/20 hover:shadow-teal-500/40 active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>{t('Book Consultation')}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
