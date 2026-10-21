import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import { isFavorite, toggleFavorite } from '../utils/favoriteUtils';
import LanguageSelector from '../components/LanguageSelector';
import { getDoctorPhoto } from '../utils/doctorPhotos';
import { getSocket } from '../services/socket';

const SPECIALTY_EXPERTISE_MAP = {
  Cardiology: ['Coronary Angiography', 'Heart Failure Management', 'Echocardiography', 'Hypertension', 'Preventive Cardiology', 'Arrhythmia'],
  Neurology: ['Acute Stroke Care', 'Epilepsy & Seizures', 'Migraine Therapeutics', 'Parkinson Disease', 'Neuro-Electrophysiology', 'Spine Disorders'],
  Pulmonology: ['Bronchial Asthma', 'COPD & Emphysema', 'Sleep Apnea', 'Interventional Bronchoscopy', 'Allergy & Immunology', 'Post-COVID Recovery'],
  'General Medicine': ['Metabolic Health', 'Diabetes Management', 'Hypertension', 'Fever & Infectious Care', 'Geriatric Wellness', 'Adult Immunization'],
  Orthopedics: ['Joint Replacement', 'Arthroscopy', 'Spine Surgery', 'Sports Injuries', 'Fracture & Trauma', 'Osteoporosis Management'],
  Oncology: ['Targeted Immunotherapy', 'Chemotherapy Protocols', 'Precision Genomics', 'Surgical Oncology', 'Radiation Oncology', 'Breast Cancer Screening'],
  Pediatrics: ['Newborn Care & Neonatology', 'Childhood Vaccination', 'Growth Milestones', 'Pediatric Asthma', 'Nutritional Guidance', 'Adolescent Care'],
  'Obstetrics & Gynecology': ['High-Risk Pregnancy', 'Natural Birthing', 'Laparoscopic Surgery', 'PCOS & Hormonal Care', 'Infertility Evaluation', 'Prenatal Ultrasound'],
  'Obs & Gynecology': ['High-Risk Pregnancy', 'Natural Birthing', 'Laparoscopic Surgery', 'PCOS & Hormonal Care', 'Infertility Evaluation', 'Prenatal Ultrasound'],
  Dermatology: ['Clinical Dermatology', 'Acne & Scar Laser', 'Psoriasis & Eczema', 'Hair Loss & PRP', 'Anti-Aging Aesthetics', 'Skin Pigmentation'],
  Ophthalmology: ['Robotic Cataract Surgery', 'Blade-Free LASIK', 'Glaucoma Therapeutics', 'Diabetic Retinopathy', 'Corneal Transplantation', 'Refractive Vision'],
  ENT: ['Endoscopic Sinus Surgery', 'Cochlear Implants', 'Micro-Ear Surgery', 'Snoring & Sleep Surgery', 'Tonsil & Adenoid', 'Vocal Cord Disorders'],
  Psychiatry: ['Anxiety & Panic Disorders', 'Clinical Depression', 'Cognitive Psychotherapy', 'Bipolar Disorder', 'Stress Management', 'Adolescent Counseling'],
  Dentistry: ['Invisible Aligners', 'Dental Implants', 'Root Canal Therapy', 'Cosmetic Smile Design', 'Ceramic Crowns', 'Teeth Whitening'],
  Nephrology: ['Chronic Kidney Disease', 'Hemodialysis Management', 'Renal Transplantation', 'Glomerulonephritis', 'Diabetic Nephropathy', 'Hypertension & Kidneys'],
  Hematology: ['Blood Disorders & Anemia', 'Leukemia & Lymphoma', 'Bone Marrow Biopsy', 'Platelet Abnormalities', 'Thalassemia Management', 'Coagulation Disorders'],
  Endocrinology: ['Type 1 & 2 Diabetes', 'Thyroid Nodules & Disorders', 'Adrenal Diseases', 'Hormonal Imbalances', 'Osteoporosis Care', 'Metabolic Syndrome'],
  'Infectious Diseases': ['Tropical Fevers & Sepsis', 'Antimicrobial Stewardship', 'Post-Viral Syndromes', 'Immunodeficiency Management', 'Travel Immunization', 'Fungal Infections'],
  Gastroenterology: ['Therapeutic Endoscopy', 'Colonoscopy & Polypectomy', 'Liver Cirrhosis & Fatty Liver', 'GERD & Peptic Ulcer', 'Inflammatory Bowel Disease', 'ERCP'],
  'Emergency Medicine': ['Advanced Trauma Life Support', 'ACLS Cardiac Resuscitation', 'Acute Toxicological Triage', 'Polytrauma Stabilization', 'Airway Management', 'Critical Care Response'],
  'General Surgery': ['Laparoscopic Hernia Repair', 'Gallbladder Removal', 'Laser Proctology & Piles', 'Minimal Access Surgery', 'Appendix Resection', 'Diabetic Wound Salvage']
};

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const WEEKDAY_KEYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function BookAppointment() {
  const { t, i18n } = useTranslation();
  const { doctorId } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  // Calendar & Date state
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [calendarViewDate, setCalendarViewDate] = useState(() => new Date());
  const [showFullCalendar, setShowFullCalendar] = useState(false);

  // Slots state
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('About');
  const [imgError, setImgError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);

  // Favorites
  const [isFav, setIsFav] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // Fetch doctor details
  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await api.get(`/doctors/${doctorId}`);
        setDoctor(res.data.data.doctor);
        setIsFav(isFavorite(doctorId));
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [doctorId]);

  // Fetch availability when selectedDate changes
  const fetchAvailability = useCallback(async () => {
    if (!selectedDate) return;
    setLoadingSlots(true);
    try {
      const res = await api.get(`/doctors/${doctorId}/availability?date=${selectedDate}`);
      setSlots(res.data.data.slots || []);
    } catch (err) {
      console.error(err);
      setSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  }, [selectedDate, doctorId]);

  useEffect(() => {
    fetchAvailability();
    setSelectedSlot('');
  }, [fetchAvailability]);

  // Real-time slot update listener and periodic auto-refresh
  useEffect(() => {
    let s;
    try {
      s = getSocket();
      if (s) {
        const onSlotBooked = (data) => {
          if (data && data.date === selectedDate) {
            fetchAvailability();
          }
        };
        s.on('slot:booked', onSlotBooked);
        return () => {
          s.off('slot:booked', onSlotBooked);
        };
      }
    } catch (e) {
      // socket init error fallback
    }

    const interval = setInterval(() => {
      fetchAvailability();
    }, 15000);
    return () => clearInterval(interval);
  }, [fetchAvailability, selectedDate]);

  const handleFavoriteClick = () => {
    if (!doctor) return;
    const added = toggleFavorite(doctor);
    setIsFav(added);
    setToastMsg(added ? t('Added to Favorites') : t('Removed from Favorites'));
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleBook = async () => {
    if (!selectedSlot) return;
    try {
      setIsSubmitting(true);
      setError('');

      const chosenSlot = slots.find((s) => s.start === selectedSlot);
      const timeSlotPayload = {
        start: selectedSlot,
        end: chosenSlot?.end || (selectedSlot === '16:30' ? '17:00' : `${(Number(selectedSlot.split(':')[0]) + 1).toString().padStart(2, '0')}:${selectedSlot.split(':')[1]}`),
      };

      const res = await api.post('/appointments', {
        doctor: doctorId,
        date: selectedDate,
        timeSlot: timeSlotPayload,
        reason: 'General Consultation',
      });

      const appointment = res.data.data.appointment;
      setBookingSuccess(appointment);
      // Immediately refresh slot availability so booked counts update dynamically
      fetchAvailability();
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Please try another slot.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calendar Helpers
  const currentYear = calendarViewDate.getFullYear();
  const currentMonth = calendarViewDate.getMonth();
  const monthNameKey = MONTH_NAMES[currentMonth];

  const prevMonth = () => {
    setCalendarViewDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const nextMonth = () => {
    setCalendarViewDate(new Date(currentYear, currentMonth + 1, 1));
  };

  // Days for Quick Strip (7 days starting from today)
  const quickDays = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const isoDate = d.toISOString().split('T')[0];
    const dayIndex = (d.getDay() + 6) % 7; // Monday = 0
    const weekdayKey = WEEKDAY_KEYS[dayIndex];
    quickDays.push({ isoDate, weekdayKey, dateNumber: d.getDate(), fullDate: d });
  }

  // Full Month Calendar Days calculation
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const startDayIndex = (firstDayOfMonth.getDay() + 6) % 7; // Monday = 0
  const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const fullCalendarDays = [];
  // Previous month trailing days
  const prevMonthTotalDays = new Date(currentYear, currentMonth, 0).getDate();
  for (let i = startDayIndex - 1; i >= 0; i--) {
    fullCalendarDays.push({
      dateNumber: prevMonthTotalDays - i,
      isCurrentMonth: false,
      isPast: true,
      isoDate: '',
    });
  }

  // Current month days
  for (let day = 1; day <= daysInCurrentMonth; day++) {
    const d = new Date(currentYear, currentMonth, day);
    d.setHours(0, 0, 0, 0);
    const isPast = d < today;
    const isoDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    fullCalendarDays.push({
      dateNumber: day,
      isCurrentMonth: true,
      isPast,
      isoDate,
    });
  }

  // Next month leading days to complete grid rows
  const remainingCells = 42 - fullCalendarDays.length;
  for (let day = 1; day <= (remainingCells >= 7 ? remainingCells - 7 : remainingCells); day++) {
    fullCalendarDays.push({
      dateNumber: day,
      isCurrentMonth: false,
      isPast: false,
      isoDate: '',
    });
  }

  // Formatting selected date in localized text
  const selectedDateObj = new Date(selectedDate);
  const selWeekdayKey = WEEKDAY_KEYS[(selectedDateObj.getDay() + 6) % 7];
  const selMonthKey = MONTH_NAMES[selectedDateObj.getMonth()];
  const formattedSelectedDateDisplay = `${t(selWeekdayKey)}, ${t(selMonthKey)} ${selectedDateObj.getDate()}, ${selectedDateObj.getFullYear()}`;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-transparent">
        <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!doctor) {
    return <div className="text-center mt-20 text-xl font-bold text-gray-700">{t('No doctors found')}</div>;
  }

  const { user, specialization, experience, rating, totalRatings = 140, clinicName, clinicAddress, consultationFee, hospitalPhone = '+91 44 42002288', emergencyPhone = '105710' } = doctor;
  const hospital = clinicName || 'MIOT International';
  const address = clinicAddress || '4/112, Mount Poonamallee Road, Manapakkam, Chennai';

  const doctorName = user?.name || 'Dr. Specialist';
  const expertises = SPECIALTY_EXPERTISE_MAP[specialization] || [
    'Cardiology', 'Hypertension', 'ECG', 'Heart Failure', 'Preventive Care', 'Lifestyle Management'
  ];

  return (
    <div className="bg-transparent min-h-screen pb-20 font-sans">
      
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900/90 text-white font-bold text-xs px-4 py-3 rounded-2xl shadow-xl backdrop-blur animate-in fade-in slide-in-from-top-3 flex items-center gap-2">
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ── TOP NAVIGATION HEADER ── */}
      <header className="bg-white sticky top-0 z-40 border-b border-gray-100 shadow-sm backdrop-blur-md bg-white/95">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
          
          {/* Back button & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (window.history.length > 1) navigate(-1);
                else navigate('/patient/search');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-teal-50 text-slate-700 hover:text-teal-700 font-bold transition-all cursor-pointer text-xs sm:text-sm border border-slate-200/60 shadow-xs"
              title="Go back"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
              <span>{t('Back')}</span>
            </button>

            <Link to="/patient/home" className="flex items-center gap-2 group hidden sm:flex">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-600 to-blue-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
                +
              </div>
              <span className="font-black text-slate-800 tracking-tight text-sm">SmartCare</span>
            </Link>
          </div>

          {/* Direct Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <Link
              to="/patient/home"
              className="px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-teal-700 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
            >
              <span>🏠</span>
              <span className="hidden md:inline">{t('Home')}</span>
            </Link>
            <Link
              to="/patient/search"
              className="px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold text-teal-700 bg-teal-50 border border-teal-200/70 transition-colors flex items-center gap-1.5"
            >
              <span>🩺</span>
              <span className="hidden md:inline">{t('Find a Doctor')}</span>
            </Link>
            <Link
              to="/patient"
              className="px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-teal-700 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
            >
              <span>📅</span>
              <span className="hidden md:inline">{t('Appointments')}</span>
            </Link>
            <Link
              to="/patient/profile"
              className="px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-teal-700 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
            >
              <span>👤</span>
              <span className="hidden md:inline">{t('Profile')}</span>
            </Link>
          </nav>

          {/* Right controls: Language & Favorite */}
          <div className="flex items-center gap-2">
            {/* 🌐 Multilingual Language Selector */}
            <LanguageSelector />

            {/* Favorite Heart Button */}
            <button
              onClick={handleFavoriteClick}
              title={isFav ? t('Removed from Favorites') : t('Added to Favorites')}
              className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all cursor-pointer shadow-sm ${
                isFav
                  ? 'bg-rose-50 border-rose-200 text-rose-600 scale-105'
                  : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200'
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill={isFav ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* ── BREADCRUMBS BAR ── */}
      <div className="bg-slate-50 border-b border-slate-200/60 py-2.5 px-4">
        <div className="max-w-6xl mx-auto flex items-center gap-2 text-xs font-semibold text-slate-500 overflow-x-auto">
          <Link to="/patient/home" className="hover:text-teal-700 transition-colors flex items-center gap-1 shrink-0">
            <span>🏠</span>
            <span>{t('Home')}</span>
          </Link>
          <span>/</span>
          <Link to="/patient/search" className="hover:text-teal-700 transition-colors shrink-0">
            {t('Find a Doctor')}
          </Link>
          <span>/</span>
          <Link
            to={`/patient/search?specialization=${encodeURIComponent(specialization)}`}
            className="text-teal-700 hover:underline font-bold shrink-0"
          >
            {t(specialization)}
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-bold truncate">{t(doctorName)}</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ═════════ LEFT COLUMN (Doctor Profile Info) ═════════ */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col h-full">
          
          {/* Top Profile Section */}
          <div className="flex gap-4 sm:gap-5 items-start">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0 bg-teal-50 border border-slate-200 shadow-sm">
              <img
                src={getDoctorPhoto(doctor)}
                alt={doctorName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const gender = doctor?.user?.gender || doctor?.gender || 'male';
                  e.target.src = gender === 'female'
                    ? 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80'
                    : 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&q=80';
                }}
              />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap mb-1">
                <h2 className="text-xl sm:text-2xl font-black text-slate-800 leading-tight">
                  {t(doctorName)}
                </h2>
                <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-0.5">
                  ✓ {t('Verified')}
                </span>
              </div>

              <p className="text-teal-700 font-bold text-sm mb-1">{t(specialization)}</p>

              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="font-black text-amber-500 text-sm">★ {rating || 4.9}</span>
                <span className="text-gray-400 text-xs font-medium">({totalRatings} {t('reviews')})</span>
              </div>

              <p className="text-slate-600 text-xs font-semibold">{experience}+ {t('Years Experience')}</p>

              <div className="flex items-start gap-1 text-slate-500 text-xs font-medium mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="shrink-0 mt-0.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <span className="truncate">{t(hospital)}, {t(address)}</span>
              </div>

              <div className="flex items-center gap-1.5 text-slate-700 text-xs font-bold mt-2 bg-slate-50 p-2 rounded-xl border border-slate-100">
                <span className="text-teal-600">📞 {t('Hospital Phone')}:</span>
                <a href={`tel:${hospitalPhone}`} className="text-teal-700 hover:underline">{hospitalPhone}</a>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-6">
            <a
              href={`tel:${hospitalPhone || user?.phone || '+914442002288'}`}
              className="flex items-center justify-center gap-1.5 bg-teal-50 text-teal-700 py-2.5 rounded-xl font-bold text-xs hover:bg-teal-100 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              {t('Call')}
            </a>
            <a
              href={`tel:${emergencyPhone || '105710'}`}
              className="flex items-center justify-center gap-1.5 bg-rose-50 text-rose-700 py-2.5 rounded-xl font-bold text-xs hover:bg-rose-100 transition-colors"
            >
              <span>🚨</span>
              {t('Emergency')}
            </a>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(hospital + ', ' + address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 bg-indigo-50 text-indigo-700 py-2.5 rounded-xl font-bold text-xs hover:bg-indigo-100 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
              {t('Directions')}
            </a>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b mt-6 mb-5">
            {['About', 'Services', 'Location'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 pb-3 text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer ${
                  activeTab === tab ? 'border-teal-600 text-teal-600' : 'border-transparent text-gray-400 hover:text-gray-700'
                }`}
              >
                {t(tab)}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1">
            {activeTab === 'About' && (
              <div>
                <h3 className="font-bold text-slate-800 text-base mb-2">{t('About Doctor')}</h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6 font-medium">
                  {`${t(doctorName)} ${t('is a renowned')} ${t(specialization)} ${t('specialist with over')} ${experience} ${t('Years Experience')}. ${t(hospital)}, ${t(address)}.`}
                </p>

                <div className="grid grid-cols-3 gap-2.5 mb-6">
                  <div className="bg-slate-50 rounded-2xl p-3 flex flex-col items-center justify-center text-center border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{t(doctor.qualification || 'MBBS, MD')}</span>
                    <span className="text-xs font-bold text-slate-800 mt-0.5 truncate w-full">{t(specialization)}</span>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-3 flex flex-col items-center justify-center text-center border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{t('Experience')}</span>
                    <span className="text-xs font-bold text-slate-800 mt-0.5">{experience}+ {t('Years')}</span>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-3 flex flex-col items-center justify-center text-center border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{t('Hospital')}</span>
                    <span className="text-xs font-black text-teal-700 mt-0.5 truncate w-full">{t(hospital)}</span>
                  </div>
                </div>

                <h3 className="font-bold text-slate-800 text-base mb-3">{t('Areas of Expertise')}</h3>
                <div className="flex flex-wrap gap-1.5">
                  {expertises.map((exp) => (
                    <span key={exp} className="bg-teal-50 text-teal-800 px-3 py-1 rounded-full text-xs font-bold border border-teal-100">
                      {t(exp)}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'Services' && (
              <div className="space-y-2.5 text-xs text-slate-700">
                <h3 className="font-bold text-slate-800 text-base mb-3">{t('Services')}</h3>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                  <span className="font-bold">{t('In-Clinic Consultation')}</span>
                  <span className="font-black text-teal-700">₹{consultationFee || 600}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                  <span className="font-bold">{t('Follow-Up Review (Within 7 Days)')}</span>
                  <span className="font-black text-emerald-600">{t('FREE')}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                  <span className="font-bold">{t('Diagnostic Prescription & Lab Orders')}</span>
                  <span className="font-black text-slate-700">{t('Included')}</span>
                </div>
              </div>
            )}

            {activeTab === 'Location' && (
              <div className="space-y-3 text-xs text-slate-700">
                <h3 className="font-bold text-slate-800 text-base mb-1">{t(hospital)}</h3>
                <p className="text-slate-500 font-medium">{t(address)}</p>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(hospital + ', ' + address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 text-white font-bold rounded-xl shadow-sm hover:bg-teal-700 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
                  {t('Get Directions')}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* ═════════ RIGHT COLUMN (Interactive Calendar & Slot Booking) ═════════ */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Main Booking Card with Calendar */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 font-bold text-sm border border-red-100">{error}</div>}

            {/* Date Header + Calendar Toggle */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-black text-lg text-slate-800">{t('Select Date')}</h3>
                <p className="text-xs font-bold text-teal-700 mt-0.5">{formattedSelectedDateDisplay}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowFullCalendar(!showFullCalendar)}
                  className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 font-bold text-xs rounded-xl flex items-center gap-1.5 border border-teal-200/70 transition-all shadow-xs cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  <span>{showFullCalendar ? t('Close Calendar') : t('Open Calendar')}</span>
                </button>
              </div>
            </div>

            {/* ── FULL MONTH CALENDAR VIEW ── */}
            {showFullCalendar ? (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 mb-6 animate-in fade-in zoom-in-95 duration-200">
                {/* Month Navigator */}
                <div className="flex items-center justify-between mb-4 px-2">
                  <h4 className="font-black text-slate-800 text-sm">
                    {t(monthNameKey)} {currentYear}
                  </h4>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={prevMonth}
                      className="w-8 h-8 rounded-full bg-white hover:bg-slate-200 flex items-center justify-center text-slate-600 shadow-xs transition-colors cursor-pointer"
                      title="Previous Month"
                    >
                      ‹
                    </button>
                    <button
                      onClick={nextMonth}
                      className="w-8 h-8 rounded-full bg-white hover:bg-slate-200 flex items-center justify-center text-slate-600 shadow-xs transition-colors cursor-pointer"
                      title="Next Month"
                    >
                      ›
                    </button>
                  </div>
                </div>

                {/* Weekday Labels */}
                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                  {WEEKDAY_KEYS.map((wk) => (
                    <span key={wk} className="text-[11px] font-black text-slate-400 uppercase py-1">
                      {t(wk)}
                    </span>
                  ))}
                </div>

                {/* Calendar Days Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {fullCalendarDays.map((cd, index) => {
                    if (!cd.isCurrentMonth) {
                      return (
                        <div key={index} className="h-10 flex items-center justify-center text-xs font-semibold text-slate-300">
                          {cd.dateNumber}
                        </div>
                      );
                    }

                    const isSelected = selectedDate === cd.isoDate;

                    return (
                      <button
                        key={index}
                        disabled={cd.isPast}
                        onClick={() => {
                          if (!cd.isPast) {
                            setSelectedDate(cd.isoDate);
                            setShowFullCalendar(false);
                          }
                        }}
                        className={`h-10 rounded-xl text-xs font-black transition-all flex flex-col items-center justify-center cursor-pointer ${
                          cd.isPast
                            ? 'text-slate-300 cursor-not-allowed opacity-50'
                            : isSelected
                            ? 'bg-gradient-to-r from-teal-600 to-blue-600 text-white shadow-md shadow-teal-500/30 scale-105'
                            : 'bg-white hover:bg-teal-50 text-slate-700 hover:text-teal-700 border border-slate-100 shadow-xs'
                        }`}
                      >
                        {cd.dateNumber}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* ── 7-DAY QUICK HORIZONTAL STRIP ── */
              <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-thin">
                {quickDays.map((d) => {
                  const isSelected = selectedDate === d.isoDate;
                  return (
                    <button
                      key={d.isoDate}
                      onClick={() => setSelectedDate(d.isoDate)}
                      className={`flex flex-col items-center justify-center min-w-[72px] py-3 rounded-2xl transition-all border cursor-pointer ${
                        isSelected
                          ? 'bg-gradient-to-br from-teal-600 to-blue-600 border-teal-600 text-white shadow-md shadow-teal-500/30 scale-105'
                          : 'bg-white border-gray-100 text-gray-400 hover:border-teal-200'
                      }`}
                    >
                      <span className={`text-[11px] font-bold mb-1 ${isSelected ? 'text-teal-100' : 'text-gray-400'}`}>
                        {t(d.weekdayKey)}
                      </span>
                      <span className={`text-lg font-black ${isSelected ? 'text-white' : 'text-slate-700'}`}>
                        {d.dateNumber}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Time Slot Selection */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-6 mb-4 gap-2">
              <div>
                <h3 className="font-black text-lg text-slate-800">{t('Select Time Slot')}</h3>
                <p className="text-xs text-slate-400 font-semibold">{t('Predefined 1-hour slots • Max 10 patients per slot')}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div> {t('Available')}
                </span>
                <span className="flex items-center gap-1.5 text-xs font-bold text-rose-500">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-400"></div> {t('Slot Full')}
                </span>
              </div>
            </div>

            {loadingSlots ? (
              <div className="py-12 flex flex-col items-center justify-center gap-3">
                <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs text-slate-400 font-bold">{t('Checking slot capacity...')}</p>
              </div>
            ) : slots.length > 0 ? (
              <div className="space-y-4">
                {/* Morning Session */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-black uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-1 rounded-lg">
                      🌅 {t('Morning Session')}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {slots.filter(s => ['09:30', '10:30', '11:30'].includes(s.start)).map((slot) => {
                      const isSelected = selectedSlot === slot.start;
                      const max = slot.maxPatients || 10;
                      const pct = Math.round((slot.booked / max) * 100);
                      const barColor = slot.isFull ? 'bg-rose-400' : pct >= 70 ? 'bg-amber-400' : 'bg-emerald-400';
                      return (
                        <button
                          key={slot.start}
                          disabled={slot.isFull}
                          onClick={() => setSelectedSlot(slot.start)}
                          className={`p-3.5 rounded-2xl font-bold text-xs transition-all border text-left flex flex-col gap-2 cursor-pointer ${
                            slot.isFull
                              ? 'bg-slate-50 border-slate-200 text-slate-400 opacity-60 cursor-not-allowed'
                              : isSelected
                              ? 'bg-gradient-to-br from-teal-600 to-blue-600 text-white border-teal-600 shadow-md shadow-teal-500/30 scale-[1.02]'
                              : 'bg-white text-slate-800 border-slate-200 hover:border-teal-400 hover:shadow-sm'
                          }`}
                        >
                          {/* Time label + status badge */}
                          <div className="flex items-center justify-between">
                            <span className="font-black text-sm">{slot.label || slot.start}</span>
                            <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${
                              slot.isFull
                                ? 'bg-rose-100 text-rose-700'
                                : isSelected
                                ? 'bg-white/20 text-white'
                                : 'bg-emerald-50 text-emerald-700'
                            }`}>
                              {slot.isFull ? `🔴 ${t('Full')}` : `🟢 ${t('Open')}`}
                            </span>
                          </div>
                          {/* Detailed capacity line */}
                          <div className={`text-[10px] font-semibold leading-snug ${
                            isSelected ? 'text-teal-100' : 'text-slate-500'
                          }`}>
                            {slot.booked} {t('out of')} {max} {t('slots booked')} – {slot.available} {t('slots available')}
                          </div>
                          {/* Capacity progress bar */}
                          <div className={`w-full h-1.5 rounded-full ${
                            isSelected ? 'bg-white/20' : 'bg-slate-100'
                          }`}>
                            <div
                              className={`h-full rounded-full transition-all ${isSelected ? 'bg-white' : barColor}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Lunch Break Banner */}
                <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-3 flex items-center justify-between text-xs text-amber-900 font-bold">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🥗</span>
                    <span>12:30 PM – 1:30 PM: {t('Lunch Break')}</span>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider bg-amber-200/70 text-amber-800 px-2.5 py-0.5 rounded-full">
                    {t('No Appointments')}
                  </span>
                </div>

                {/* Afternoon Session */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-black uppercase tracking-wider text-blue-800 bg-blue-50 px-2.5 py-1 rounded-lg">
                      ☀️ {t('Afternoon Session')}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                    {slots.filter(s => ['13:30', '14:30', '15:30', '16:30'].includes(s.start)).map((slot) => {
                      const isSelected = selectedSlot === slot.start;
                      const max = slot.maxPatients || 10;
                      const pct = Math.round((slot.booked / max) * 100);
                      const barColor = slot.isFull ? 'bg-rose-400' : pct >= 70 ? 'bg-amber-400' : 'bg-emerald-400';
                      return (
                        <button
                          key={slot.start}
                          disabled={slot.isFull}
                          onClick={() => setSelectedSlot(slot.start)}
                          className={`p-3.5 rounded-2xl font-bold text-xs transition-all border text-left flex flex-col gap-2 cursor-pointer ${
                            slot.isFull
                              ? 'bg-slate-50 border-slate-200 text-slate-400 opacity-60 cursor-not-allowed'
                              : isSelected
                              ? 'bg-gradient-to-br from-teal-600 to-blue-600 text-white border-teal-600 shadow-md shadow-teal-500/30 scale-[1.02]'
                              : 'bg-white text-slate-800 border-slate-200 hover:border-teal-400 hover:shadow-sm'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-black text-sm">{slot.label || slot.start}</span>
                            <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${
                              slot.isFull
                                ? 'bg-rose-100 text-rose-700'
                                : isSelected
                                ? 'bg-white/20 text-white'
                                : 'bg-emerald-50 text-emerald-700'
                            }`}>
                              {slot.isFull ? `🔴 ${t('Full')}` : `🟢 ${t('Open')}`}
                            </span>
                          </div>
                          <div className={`text-[10px] font-semibold leading-snug ${
                            isSelected ? 'text-teal-100' : 'text-slate-500'
                          }`}>
                            {slot.booked} {t('out of')} {max} {t('slots booked')} – {slot.available} {t('slots available')}
                          </div>
                          <div className={`w-full h-1.5 rounded-full ${
                            isSelected ? 'bg-white/20' : 'bg-slate-100'
                          }`}>
                            <div
                              className={`h-full rounded-full transition-all ${isSelected ? 'bg-white' : barColor}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Evening Break Banner */}
                <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-3 flex items-center justify-between text-xs text-amber-900 font-bold">
                  <div className="flex items-center gap-2">
                    <span className="text-base">☕</span>
                    <span>5:00 PM – 5:30 PM: {t('Evening Break')}</span>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider bg-amber-200/70 text-amber-800 px-2.5 py-0.5 rounded-full">
                    {t('No Appointments')}
                  </span>
                </div>

                {/* Evening Session */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-black uppercase tracking-wider text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded-lg">
                      🌙 {t('Evening Session')}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                    {slots.filter(s => ['17:30', '18:30', '19:30', '20:30'].includes(s.start)).map((slot) => {
                      const isSelected = selectedSlot === slot.start;
                      const max = slot.maxPatients || 10;
                      const pct = Math.round((slot.booked / max) * 100);
                      const barColor = slot.isFull ? 'bg-rose-400' : pct >= 70 ? 'bg-amber-400' : 'bg-emerald-400';
                      return (
                        <button
                          key={slot.start}
                          disabled={slot.isFull}
                          onClick={() => setSelectedSlot(slot.start)}
                          className={`p-3.5 rounded-2xl font-bold text-xs transition-all border text-left flex flex-col gap-2 cursor-pointer ${
                            slot.isFull
                              ? 'bg-slate-50 border-slate-200 text-slate-400 opacity-60 cursor-not-allowed'
                              : isSelected
                              ? 'bg-gradient-to-br from-teal-600 to-blue-600 text-white border-teal-600 shadow-md shadow-teal-500/30 scale-[1.02]'
                              : 'bg-white text-slate-800 border-slate-200 hover:border-teal-400 hover:shadow-sm'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-black text-sm">{slot.label || slot.start}</span>
                            <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${
                              slot.isFull
                                ? 'bg-rose-100 text-rose-700'
                                : isSelected
                                ? 'bg-white/20 text-white'
                                : 'bg-emerald-50 text-emerald-700'
                            }`}>
                              {slot.isFull ? `🔴 ${t('Full')}` : `🟢 ${t('Open')}`}
                            </span>
                          </div>
                          <div className={`text-[10px] font-semibold leading-snug ${
                            isSelected ? 'text-teal-100' : 'text-slate-500'
                          }`}>
                            {slot.booked} {t('out of')} {max} {t('slots booked')} – {slot.available} {t('slots available')}
                          </div>
                          <div className={`w-full h-1.5 rounded-full ${
                            isSelected ? 'bg-white/20' : 'bg-slate-100'
                          }`}>
                            <div
                              className={`h-full rounded-full transition-all ${isSelected ? 'bg-white' : barColor}`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-gray-500 font-bold bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-xs">
                {t('No slots available on this date.')}
              </div>
            )}
          </div>

          {/* Appointment Summary Card */}
          <div className="bg-teal-50/60 rounded-3xl p-6 border border-teal-100">
            <div className="flex items-center gap-2 text-slate-800 font-black mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>
              {t('Appointment Summary')}
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm mb-4 border border-teal-100/60 flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                <img src={getDoctorPhoto(doctor)} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-black text-slate-800 text-sm truncate">{t(doctorName)}</h4>
                <p className="text-teal-700 text-xs font-bold">{t(specialization)}</p>
                <p className="text-slate-400 text-[11px] truncate">{t(hospital)}</p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[10px] font-bold text-slate-400 uppercase">{t('Fee')}</span>
                <p className="text-sm font-black text-teal-700">₹{consultationFee || 600}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-2 text-xs">
              <div className="flex items-start gap-2">
                <span className="text-slate-400">📅</span>
                <div>
                  <p className="font-bold text-gray-400 text-[10px]">{t('Date')}</p>
                  <p className="font-bold text-slate-800">{formattedSelectedDateDisplay}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-slate-400">⏰</span>
                <div>
                  <p className="font-bold text-gray-400 text-[10px]">{t('Time')}</p>
                  <p className="font-bold text-slate-800">{selectedSlot || t('Not Selected')}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-slate-400">🏥</span>
                <div>
                  <p className="font-bold text-gray-400 text-[10px]">{t('Hospital')}</p>
                  <p className="font-bold text-slate-800 truncate">{t(hospital)}</p>
                  <p className="text-[10px] text-gray-500 truncate">{t(address)}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-slate-400">🩺</span>
                <div>
                  <p className="font-bold text-gray-400 text-[10px]">{t('Consultation Type')}</p>
                  <p className="font-bold text-slate-800">{t('In-clinic Visit')}</p>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-bold p-3.5 rounded-2xl flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={handleBook}
            disabled={!selectedSlot || isSubmitting}
            className="w-full bg-gradient-to-r from-teal-600 to-blue-600 text-white font-black py-4 rounded-2xl hover:from-teal-700 hover:to-blue-700 hover:shadow-xl hover:shadow-teal-500/30 transition-all disabled:opacity-50 disabled:hover:shadow-none flex items-center justify-center gap-2 text-base cursor-pointer active:scale-98"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>{t('Booking Appointment...')}</span>
              </>
            ) : (
              <>
                <span>{t('Confirm Booking')}</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ══════════ BOOKING SUCCESS CONFIRMATION MODAL ══════════ */}
      {bookingSuccess && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-teal-100 animate-in zoom-in-95 duration-200 space-y-6">
            
            {/* Header Icon & Title */}
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner ring-8 ring-emerald-50">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-800">
                {t('Appointment Booked Successfully!')}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Your consultation is confirmed. A notification and live token have been issued.
              </p>
            </div>

            {/* Appointment Card Details */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/70 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">APPOINTMENT ID</span>
                  <p className="text-xs font-black text-slate-800">{bookingSuccess.appointmentId}</p>
                </div>
                <div className="bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-black shadow-xs">
                  Token #{bookingSuccess.tokenNumber || 1}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Doctor</span>
                  <p className="font-bold text-slate-800 truncate">{t(doctorName)}</p>
                  <p className="text-[11px] text-teal-700 font-semibold">{t(specialization)}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Hospital / Clinic</span>
                  <p className="font-bold text-slate-800 truncate">{t(hospital)}</p>
                  <p className="text-[11px] text-slate-500 truncate">{t(address)}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Date</span>
                  <p className="font-bold text-slate-800">{formattedSelectedDateDisplay}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Slot Time</span>
                  <p className="font-bold text-teal-700">{selectedSlot}</p>
                </div>
              </div>
            </div>

            {/* Quick Action Navigation Buttons */}
            <div className="space-y-2.5">
              <button
                onClick={() => navigate('/patient')}
                className="w-full bg-gradient-to-r from-teal-600 to-blue-600 text-white font-bold py-3.5 rounded-2xl hover:shadow-lg hover:shadow-teal-500/25 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>📅</span>
                <span>{t('View in My Appointments')}</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => navigate('/patient/search')}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-2xl transition-all text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>🩺</span>
                  <span>{t('Find More Doctors')}</span>
                </button>
                <button
                  onClick={() => navigate('/patient/home')}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-2xl transition-all text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>🏠</span>
                  <span>{t('Back to Home')}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ══════════ FLOATING QUICK NAV BAR (MOBILE / SCROLL) ══════════ */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 bg-slate-900/90 backdrop-blur-md text-white px-4 py-2 rounded-full shadow-2xl flex items-center gap-4 text-xs font-bold sm:hidden">
        <Link to="/patient/home" className="hover:text-teal-400 transition-colors flex items-center gap-1">
          <span>🏠</span>
          <span>Home</span>
        </Link>
        <div className="w-px h-3 bg-slate-700"></div>
        <Link to="/patient/search" className="hover:text-teal-400 transition-colors flex items-center gap-1">
          <span>🩺</span>
          <span>Doctors</span>
        </Link>
        <div className="w-px h-3 bg-slate-700"></div>
        <Link to="/patient" className="hover:text-teal-400 transition-colors flex items-center gap-1">
          <span>📅</span>
          <span>{t('Appointments')}</span>
        </Link>
      </div>
    </div>
  );
}
