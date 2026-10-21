import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import LanguageSelector from '../components/LanguageSelector';
import MiotMegaMenu from '../components/MiotMegaMenu';
import homeCareImg from '../assets/miot_home_care_exact.png';
import founderImg from '../assets/founder_portrait.jpg';
import hospitalBannerImg from '../assets/miot_hospital_banner.jpg';
import medicalTeamImg from '../assets/miot_medical_team.jpg';
import orthoMobilityImg from '../assets/miot_ortho_mobility.jpg';
import kneeSurgeryImg from '../assets/miot_knee_surgery_ot.jpg';
import { getDoctorPhoto } from '../utils/doctorPhotos';

// ── Hero Slideshow Slides ──
const HERO_SLIDES = [
  {
    img: homeCareImg,
    alt: 'MIOT Home Care Services – illam varum namma miot',
    headline: 'illam varum namma MIOT',
    sub: 'Diagnostics & Medicine Delivery at your doorstep.',
    knowMore: 'doctor-directory',
  },
  {
    img: hospitalBannerImg,
    alt: 'MIOT International Hospital – Standing reassuring and tall on 14 acres',
    headline: 'Standing reassuring and tall on 14 acres.',
    sub: 'Expert medical care and best-in-class technology.',
    knowMore: 'centers',
  },
  {
    img: medicalTeamImg,
    alt: 'MIOT International – All under one roof',
    headline: 'All under one roof',
    sub: '63 specialities. World-class infrastructure. Committed caregivers.',
    knowMore: 'centers',
  },
  {
    img: orthoMobilityImg,
    alt: 'MIOT Rehab Centre – Mobility is Life',
    headline: 'MOBILITY IS LIFE',
    sub: 'MIOT Rehab Centre – 1st of its kind in South India.',
    knowMore: 'facilities',
  },
  {
    img: kneeSurgeryImg,
    alt: 'MIOT Advanced Orthopaedic Surgery',
    headline: 'Precision Orthopaedic Surgery',
    sub: 'World-class joint replacements & complex surgical interventions.',
    knowMore: 'doctor-directory',
  },
];

const ALL_DEPARTMENTS = [
  'All Specialties',
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

const CENTERS_OF_EXCELLENCE = [
  {
    title: 'MIOT Institute of Orthopaedics',
    dept: 'Orthopedics',
    head: 'Prof. Dr. P. V. A. Mohandas (Founder & Mentor, Chief Surgeon)',
    description: 'Pioneers in joint replacement, complex hip & knee revisions, spine surgery, and musculoskeletal trauma.',
    badge: 'Flagship Center',
    icon: '🦴',
    bgGradient: 'from-blue-900 to-indigo-950',
    color: '#0B2545'
  },
  {
    title: 'MIOT Institute of Cardiac Care',
    dept: 'Cardiology',
    head: 'Dr. M. S. Meenakshi & Interventional Cardiology Team',
    description: 'Interventional cardiology, primary & complex angioplasty, pacemakers, and 24/7 MIOT Heart Revive emergency.',
    badge: '24/7 Heart Revive',
    icon: '❤️',
    bgGradient: 'from-rose-900 to-slate-950',
    color: '#881337'
  },
  {
    title: 'Center for Gastrointestinal & Liver Diseases',
    dept: 'Gastroenterology',
    head: 'Dr. S. Palaniappan & HPB / Liver Transplant Team',
    description: 'Advanced medical gastroenterology, therapeutic ERCP, endoscopic ultrasound, and surgical HPB liver care.',
    badge: 'Liver & Digestive Care',
    icon: '🔬',
    bgGradient: 'from-emerald-900 to-slate-950',
    color: '#064E3B'
  },
  {
    title: 'MIOT Institute of Nephrology',
    dept: 'Nephrology',
    head: 'Dr. Rajan Ravichandran (Head - Institute of Nephrology)',
    description: 'State-of-the-art dialysis facility, chronic kidney management, and high-success renal transplantation.',
    badge: 'Renal & Kidney Care',
    icon: '🧪',
    bgGradient: 'from-amber-900 to-slate-950',
    color: '#78350F'
  },
  {
    title: 'MIOT Institute of Cancer Cure',
    dept: 'Oncology',
    head: 'Dr. Senthil Kumar Ravichander & Dr. Chezhian Subash',
    description: 'Comprehensive surgical oncology, medical chemotherapy, haematology oncology, and Bone Marrow Transplant (BMT).',
    badge: 'Comprehensive Oncology',
    icon: '🎗️',
    bgGradient: 'from-purple-900 to-slate-950',
    color: '#4C1D95'
  }
];

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All Specialties');
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);
  const [founderModalOpen, setFounderModalOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState(null);
  const [slideAnimating, setSlideAnimating] = useState(false);
  const heroTimerRef = useRef(null);

  // ── 1-minute auto-advance hero slideshow ──
  useEffect(() => {
    heroTimerRef.current = setInterval(() => {
      setSlideAnimating(true);
      setTimeout(() => {
        setActiveHeroSlide((prev) => (prev + 1) % HERO_SLIDES.length);
        setSlideAnimating(false);
      }, 400);
    }, 60000); // 60 000 ms = 1 minute
    return () => clearInterval(heroTimerRef.current);
  }, []);

  const goToSlide = (index) => {
    if (index === activeHeroSlide) return;
    clearInterval(heroTimerRef.current);
    setSlideAnimating(true);
    setTimeout(() => {
      setActiveHeroSlide(index);
      setSlideAnimating(false);
    }, 400);
    // Restart timer
    heroTimerRef.current = setInterval(() => {
      setSlideAnimating(true);
      setTimeout(() => {
        setActiveHeroSlide((prev) => (prev + 1) % HERO_SLIDES.length);
        setSlideAnimating(false);
      }, 400);
    }, 60000);
  };

  const prevSlide = () => goToSlide((activeHeroSlide - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  const nextSlide = () => goToSlide((activeHeroSlide + 1) % HERO_SLIDES.length);

  const toggleMegaMenu = (menuKey) => {
    setActiveMegaMenu((prev) => (prev === menuKey ? null : menuKey));
  };

  // Fetch all MIOT doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      setLoadingDoctors(true);
      try {
        const res = await api.get('/doctors');
        if (res.data && res.data.data && res.data.data.doctors) {
          setDoctors(res.data.data.doctors);
        }
      } catch (err) {
        console.error('Failed to fetch MIOT doctors:', err);
      } finally {
        setLoadingDoctors(false);
      }
    };
    fetchDoctors();
  }, []);

  // Filtered doctors based on search & selected department
  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      const docName = doc.user?.name || '';
      const docSpec = doc.specialization || '';
      const docDesig = doc.designation || '';
      const docQual = doc.qualification || '';
      const docExp = doc.expertise || '';

      const matchesDept =
        selectedDept === 'All Specialties' ||
        docSpec.toLowerCase() === selectedDept.toLowerCase() ||
        (selectedDept === 'Gastroenterology' && docSpec.toLowerCase().includes('gastro')) ||
        (selectedDept === 'Orthopedics' && docSpec.toLowerCase().includes('ortho'));

      const query = searchTerm.trim().toLowerCase();
      const matchesSearch =
        !query ||
        docName.toLowerCase().includes(query) ||
        docSpec.toLowerCase().includes(query) ||
        docDesig.toLowerCase().includes(query) ||
        docQual.toLowerCase().includes(query) ||
        docExp.toLowerCase().includes(query);

      return matchesDept && matchesSearch;
    });
  }, [doctors, searchTerm, selectedDept]);

  const handleBookClick = (docId) => {
    if (!user) {
      navigate(`/login?redirect=/patient/book/${docId}`);
    } else if (user.role === 'patient') {
      navigate(`/patient/book/${docId}`);
    } else {
      navigate('/patient/search');
    }
  };

  const handleDeptSelect = (dept) => {
    setSelectedDept(dept);
    const element = document.getElementById('doctor-directory');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      
      {/* ══════════════════════════════════════════════════════════════
          1. OFFICIAL MIOT INTERNATIONAL TOP HEADER (IMAGE 1)
      ══════════════════════════════════════════════════════════════ */}
      <header className="bg-white border-b border-slate-200 shadow-xs sticky top-0 z-50">
        
        {/* Top Brand & Emergency Strip */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
          
          {/* Authentic MIOT International Logo */}
          <Link to="/" className="flex items-center gap-3.5 group shrink-0">
            {/* Colorful 4-Quadrant Emblem */}
            <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm flex flex-wrap border border-slate-200/80 group-hover:scale-105 transition-transform">
              <div className="w-6 h-6 bg-[#D81E5B] flex items-center justify-center text-[10px] font-black text-white"></div>
              <div className="w-6 h-6 bg-[#0B2545]"></div>
              <div className="w-6 h-6 bg-[#133E87] flex items-center justify-center text-white">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 14.93V17a1 1 0 0 1-2 0v-.07A7 7 0 0 1 5.07 11H5a1 1 0 0 1 0-2h.07A7 7 0 0 1 11 3.07V3a1 1 0 0 1 2 0v.07A7 7 0 0 1 18.93 9H19a1 1 0 0 1 0 2h-.07A7 7 0 0 1 13 16.93z" opacity="0.3"/>
                  <path d="M7 13c1.5 2 4 3 6 1s4-3 5-1"/>
                </svg>
              </div>
              <div className="w-6 h-6 bg-[#EFA00B]"></div>
            </div>

            {/* Typography */}
            <div className="flex flex-col text-left">
              <span className="text-2xl sm:text-3xl font-black text-[#0B2545] tracking-tight leading-none font-sans">
                MIOT
              </span>
              <span className="text-xs sm:text-sm font-semibold text-[#133E87] tracking-wider leading-none mt-0.5">
                International
              </span>
            </div>
          </Link>

          {/* Center Info Widgets: Emergency & Home Care */}
          <div className="hidden lg:flex items-center gap-4">
            
            {/* 24/7 MIOT Emergency Care Box */}
            <div className="flex items-center gap-2.5 bg-slate-50 hover:bg-red-50/50 p-2 px-3 rounded-xl border border-slate-200/90 shadow-2xs transition-colors">
              <div className="flex flex-col items-center">
                <div className="bg-[#D81E5B] text-white text-[8px] font-black uppercase px-2 py-0.5 rounded tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-ping" />
                  <span>24x7 MIOT EMERGENCY CARE</span>
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-lg">📞</span>
                  <a href="tel:105710" className="text-2xl font-black text-[#D81E5B] tracking-tight hover:underline">
                    10 57 10
                  </a>
                </div>
                <span className="text-[8px] font-bold uppercase text-slate-500 tracking-wider">
                  TRAUMA • CARDIAC • STROKE
                </span>
              </div>
            </div>

            {/* illam varum namma miot Box */}
            <div className="hidden xl:flex items-center gap-2.5 bg-slate-50 hover:bg-blue-50/50 p-2 px-3 rounded-xl border border-slate-200/90 shadow-2xs transition-colors">
              <div className="flex flex-col items-center shrink-0">
                <svg width="24" height="12" viewBox="0 0 24 14" fill="none" className="text-red-600">
                  <path d="M2 13L12 2L22 13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="italic font-serif text-[10px] text-red-600 font-bold leading-none">
                  illam varum
                </span>
                <div className="flex items-center gap-0.5 -mt-0.5 leading-none">
                  <span className="font-black text-[11px] text-[#B91C1C]">namma</span>
                  <span className="font-black text-xs text-[#1E3A8A]">miot</span>
                </div>
              </div>
              <div className="border-l border-slate-200 pl-2.5 text-left">
                <span className="text-[10px] font-bold text-slate-700 block leading-tight">
                  {t('MIOT Diagnostics and Medicine Delivery')}
                </span>
                <a href="tel:04442002288" className="text-xs font-black text-[#B91C1C] hover:underline block mt-0.5">
                  044-4200 2288
                </a>
              </div>
            </div>
          </div>

          {/* Right: 3 Stacked Color Action Blocks */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col w-36 text-[10px] font-black uppercase tracking-wider text-white shadow-xs rounded-lg overflow-hidden shrink-0">
              <Link
                to="/contact"
                className="bg-[#EFA00B] hover:bg-[#D99008] py-1 px-3 flex items-center gap-1.5 transition-colors"
              >
                <span>📍</span>
                <span>{t('CONTACT US')}</span>
              </Link>
              <Link
                to="/connect-miot"
                className="bg-[#D81E5B] hover:bg-[#BE123C] py-1 px-3 flex items-center gap-1.5 transition-colors"
              >
                <span>✍️</span>
                <span>{t('CONNECT MIOT')}</span>
              </Link>
              <Link
                to="/careers"
                className="bg-[#1F54B0] hover:bg-[#163E85] py-1 px-3 flex items-center gap-1.5 transition-colors"
              >
                <span>👥</span>
                <span>{t('CAREERS')}</span>
              </Link>
            </div>

            {/* Mobile / Responsive Language & User */}
            <div className="flex items-center gap-2">
              <LanguageSelector />

              {user ? (
                <button
                  onClick={() => navigate(user.role === 'patient' ? '/patient' : `/${user.role}`)}
                  className="flex items-center gap-1.5 p-1 pl-1.5 pr-2.5 rounded-full bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-all text-xs font-bold text-[#0B2545]"
                  title="Go to Dashboard"
                >
                  <div className="w-6 h-6 rounded-full bg-[#0B2545] text-white flex items-center justify-center font-black text-[10px]">
                    {user.name?.charAt(0) || 'U'}
                  </div>
                  <span className="hidden sm:inline font-bold truncate max-w-[80px]">{user.name}</span>
                </button>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="px-3 py-1.5 border border-slate-300 hover:border-slate-400 bg-white text-slate-700 text-xs font-bold rounded-lg transition-all"
                >
                  {t('Sign In')}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Secondary Menu Bar */}
        <div className="bg-slate-50/80 border-t border-slate-200/80 relative z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
            
            {/* Nav Links with Home Icon */}
            <nav className="flex items-center gap-2 sm:gap-5 md:gap-7 text-xs font-black uppercase tracking-tight overflow-x-auto py-2.5 scrollbar-none">
              <a href="#official-hero" className="text-blue-800 hover:text-blue-950 transition-colors p-1 shrink-0" title="Home">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                </svg>
              </a>
              <Link
                to="/specialities-treatments"
                className="hover:text-[#D81E5B] transition-colors whitespace-nowrap shrink-0 text-slate-700"
              >
                {t('SPECIALITIES & TREATMENTS')}
              </Link>
              <button
                onClick={() => toggleMegaMenu('facilities')}
                className={`transition-colors whitespace-nowrap shrink-0 font-black cursor-pointer ${
                  activeMegaMenu === 'facilities'
                    ? 'text-[#D81E5B] border-b-2 border-[#D81E5B] pb-0.5'
                    : 'text-slate-700 hover:text-[#D81E5B]'
                }`}
              >
                {t('FACILITIES & RESOURCES')}
              </button>
              <button
                onClick={() => toggleMegaMenu('programmes')}
                className={`transition-colors whitespace-nowrap shrink-0 font-black cursor-pointer ${
                  activeMegaMenu === 'programmes'
                    ? 'text-[#D81E5B] border-b-2 border-[#D81E5B] pb-0.5'
                    : 'text-slate-700 hover:text-[#D81E5B] hidden lg:inline'
                }`}
              >
                {t('PROGRAMMES & EDUCATION')}
              </button>
              <button
                onClick={() => toggleMegaMenu('patients')}
                className={`transition-colors whitespace-nowrap shrink-0 font-black cursor-pointer ${
                  activeMegaMenu === 'patients'
                    ? 'text-[#D81E5B] border-b-2 border-[#D81E5B] pb-0.5'
                    : 'text-slate-700 hover:text-[#D81E5B] hidden md:inline'
                }`}
              >
                {t('PATIENTS & VISITORS')}
              </button>
              <button
                onClick={() => toggleMegaMenu('global')}
                className={`transition-colors whitespace-nowrap shrink-0 font-black cursor-pointer ${
                  activeMegaMenu === 'global'
                    ? 'text-[#D81E5B] border-b-2 border-[#D81E5B] pb-0.5'
                    : 'text-slate-700 hover:text-[#D81E5B] hidden xl:inline'
                }`}
              >
                {t('GLOBAL CENTERS')}
              </button>
            </nav>

            {/* Quick Portal Jump Button */}
            <button
              onClick={() => {
                setActiveMegaMenu(null);
                const el = document.getElementById('doctor-appointment-portal');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0B2545] hover:bg-[#133E87] text-white text-xs font-bold rounded-lg shadow-sm transition-all shrink-0"
            >
              <span>📅</span>
              <span>{t('Book Doctor Slot')} ↓</span>
            </button>
          </div>

          {/* MegaMenu Dropdown - renders below nav bar */}
          {activeMegaMenu && (
            <div className="absolute left-0 right-0 top-full z-50 shadow-2xl border-t border-slate-200">
              <MiotMegaMenu
                activeMenuKey={activeMegaMenu}
                isOverlay={true}
                onClose={() => setActiveMegaMenu(null)}
              />
            </div>
          )}
        </div>
      </header>

      {/* Backdrop to close megamenu on outside click */}
      {activeMegaMenu && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setActiveMegaMenu(null)}
        />
      )}

      {/* ══════════════════════════════════════════════════════════════
          2. OFFICIAL MIOT HERO BANNER SLIDESHOW & FOUNDER CARD
      ══════════════════════════════════════════════════════════════ */}
      <section id="official-hero" className="bg-white border-b border-slate-200 min-h-[calc(100vh-115px)] flex flex-col justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 w-full flex-1 flex flex-col justify-center">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch min-h-[440px] lg:min-h-[500px]">
            
            {/* ── LEFT HERO SLIDESHOW (~75% WIDTH, 9 COLS ON LG) ── */}
            <div className="lg:col-span-9 relative rounded-2xl overflow-hidden shadow-md min-h-[420px] lg:min-h-[500px] bg-slate-900 group border border-slate-200/80">

              {/* Slide Image */}
              <img
                key={activeHeroSlide}
                src={HERO_SLIDES[activeHeroSlide].img}
                alt={HERO_SLIDES[activeHeroSlide].alt}
                className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-500 ${
                  slideAnimating ? 'opacity-0' : 'opacity-100'
                }`}
                onClick={() => {
                  const el = document.getElementById(HERO_SLIDES[activeHeroSlide].knowMore);
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                style={{ cursor: 'pointer' }}
              />

              {/* Subtle dark gradient overlay at bottom for text legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

              {/* Slide headline text */}
              <div
                className={`absolute bottom-16 left-6 right-20 pointer-events-none transition-all duration-500 ${
                  slideAnimating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
                }`}
              >
                <h2 className="text-white text-xl sm:text-3xl font-black leading-tight drop-shadow-lg">
                  {HERO_SLIDES[activeHeroSlide].headline}
                </h2>
                <p className="text-white/80 text-xs sm:text-sm font-medium mt-1 drop-shadow">
                  {HERO_SLIDES[activeHeroSlide].sub}
                </p>
              </div>

              {/* ── LEFT NAV ARROW ── */}
              <button
                onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white flex items-center justify-center shadow-lg transition-all hover:scale-110 cursor-pointer z-20"
                title="Previous Slide"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
              </button>

              {/* ── RIGHT NAV ARROW ── */}
              <button
                onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white flex items-center justify-center shadow-lg transition-all hover:scale-110 cursor-pointer z-20"
                title="Next Slide"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
              </button>

              {/* ── SLIDE DOTS + TIMER BAR ── */}
              <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center gap-2 z-20">
                {/* Progress bar for 1 minute */}
                <div className="w-40 h-0.5 bg-white/20 rounded-full overflow-hidden">
                  <div
                    key={activeHeroSlide}
                    className="h-full bg-white rounded-full"
                    style={{
                      animation: 'slideProgress 60s linear forwards',
                    }}
                  />
                </div>
                {/* Dot indicators */}
                <div className="flex items-center gap-1.5">
                  {HERO_SLIDES.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => { e.stopPropagation(); goToSlide(idx); }}
                      className={`rounded-full transition-all cursor-pointer ${
                        idx === activeHeroSlide
                          ? 'w-6 h-2 bg-white'
                          : 'w-2 h-2 bg-white/50 hover:bg-white/80'
                      }`}
                      title={`Slide ${idx + 1}`}
                    />
                  ))}
                </div>
                {/* 1-min label */}
                <span className="text-white/50 text-[9px] font-bold uppercase tracking-wider">auto-advance · 1 min</span>
              </div>
            </div>

            {/* ── RIGHT FOUNDER CARD (~25% WIDTH, 3 COLS ON LG) ── */}
            <div className="lg:col-span-3 relative rounded-2xl overflow-hidden shadow-md flex flex-col justify-end min-h-[420px] lg:min-h-[500px] group bg-slate-900">
              
              {/* Founder Image */}
              <img
                src={founderImg}
                alt="Prof. PVA Mohandas"
                className="absolute inset-0 w-full h-full object-cover object-top filter grayscale contrast-105 brightness-95 group-hover:scale-105 transition-transform duration-700"
              />

              {/* Bronze / Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-transparent" />

              {/* Founder Information Content */}
              <div className="relative z-10 p-5 text-left text-white">
                <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-amber-300 leading-snug">
                  {t('FOUNDER & VISIONARY EXTRAORDINAIRE')}
                </h3>

                <p className="text-[11px] sm:text-xs text-slate-200 font-medium leading-relaxed mt-2.5 line-clamp-4">
                  {t('Prof. PVA Mohandas dreamt of bringing the very best in medical care to India and spared no expense or effort to create MIOT International, the super-speciality hospital.')}
                </p>

                <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-amber-400">Prof. Dr. P. V. A. Mohandas</span>
                  <button
                    onClick={() => setFounderModalOpen(true)}
                    className="w-7 h-7 rounded border border-amber-400/80 bg-amber-400/10 hover:bg-amber-400 text-amber-300 hover:text-slate-950 font-black text-sm flex items-center justify-center transition-all cursor-pointer"
                    title="Read Founder Biography"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Inject slideshow progress keyframe */}
      <style>{`
        @keyframes slideProgress {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>

      {/* ══════════════════════════════════════════════════════════════
          3. DOCTOR APPOINTMENT & CONSULTATION PORTAL (IMAGE 2)
      ══════════════════════════════════════════════════════════════ */}
      <div id="doctor-appointment-portal">

        {/* Emergency Helpline Strip */}
        <div className="bg-[#081B33] text-white text-[11px] font-semibold py-2 px-4 sm:px-8 border-y border-blue-900/40">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-4 flex-wrap">
              <a
                href="tel:105710"
                className="flex items-center gap-1.5 bg-red-600/90 hover:bg-red-600 text-white px-2.5 py-0.5 rounded-full font-bold shadow-xs transition-all hover:scale-105"
              >
                <span className="w-2 h-2 rounded-full bg-amber-300 animate-ping" />
                <span>🚨 {t('24/7 Emergency')}: <strong>10 57 10</strong></span>
              </a>

              <span className="text-blue-300/40 hidden sm:inline">|</span>

              <a
                href="tel:+914442002288"
                className="hover:text-blue-200 transition-colors flex items-center gap-1 font-medium"
              >
                <span>📞 {t('Appointments')}: <strong className="font-bold">+91 44 42002288</strong></span>
              </a>

              <span className="text-blue-300/40 hidden md:inline">|</span>

              <span className="text-slate-300 hidden md:inline flex items-center gap-1">
                <span>📍 {t('4/112, Mount Poonamallee Road, Manapakkam, Chennai - 600089')}</span>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[10px] text-teal-300 font-bold uppercase tracking-wider bg-blue-950/80 px-2 py-0.5 rounded border border-teal-500/30">
                {t('1000-Bed Quaternary Care Hospital')} • {t('63 Specialities')}
              </span>
            </div>
          </div>
        </div>

      {/* ══════════ 3. HERO BANNER & APPOINTMENT SEARCH ══════════ */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#071E3D] via-[#0B2545] to-[#133E87] text-white py-14 px-4 sm:px-6 shadow-xl">
        {/* Medical Background Watermark */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="medical-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#medical-grid)" />
          </svg>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-10">
          
          {/* Left Hero Content */}
          <div className="max-w-2xl text-left">
            
            {/* Accreditation Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold text-amber-300 mb-4 border border-white/15">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{t('NABH & NABL ACCREDITED QUATERNARY CARE HOSPITAL')}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              {t('MIOT International')}
            </h1>
            <p className="text-blue-100 text-base sm:text-lg font-medium mt-3 leading-relaxed">
              {t('Official Doctor Appointment & Consultation Portal. 1000 Beds, 63 Specialities, attracting patients from 130 countries.')}
            </p>

            {/* Founder Honor Line */}
            <div className="mt-4 p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 text-xs text-blue-100 flex items-center gap-3">
              <span className="text-2xl">👨‍⚕️</span>
              <div>
                <strong className="text-white">{t('Founder & Visionary:')} {t('Prof. Dr. P. V. A. Mohandas')}</strong>
                <p className="text-[11px] text-blue-200 mt-0.5">{t('Bringing the very best in global orthopaedic and multi-speciality quaternary care to Chennai, India.')}</p>
              </div>
            </div>

            {/* Live Search Bar */}
            <div className="mt-8 bg-white p-2 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-center gap-2 max-w-xl">
              <div className="flex-1 w-full flex items-center gap-2 px-3 text-slate-700">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-blue-900 shrink-0"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={t('Search doctor by name, qualification, or department...')}
                  className="w-full py-2 bg-transparent text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none"
                />
              </div>

              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full sm:w-auto py-2.5 px-3 bg-slate-50 text-slate-800 text-xs font-bold rounded-xl border border-slate-200 focus:outline-none"
              >
                {ALL_DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {t(dept)}
                  </option>
                ))}
              </select>

              <button
                onClick={() => {
                  const el = document.getElementById('doctor-directory');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-5 py-2.5 bg-[#0B2545] hover:bg-[#133E87] text-white text-xs font-bold rounded-xl transition-all shadow-md shrink-0"
              >
                {t('Find Doctor')}
              </button>
            </div>
          </div>

          {/* Right Hero Stats Graphic */}
          <div className="grid grid-cols-2 gap-4 w-full lg:w-auto shrink-0">
            <div className="bg-white/10 backdrop-blur-md p-5 rounded-3xl border border-white/20 text-center flex flex-col items-center">
              <span className="text-3xl font-black text-amber-300">1,000+</span>
              <span className="text-xs font-bold text-white uppercase tracking-wider mt-1">{t('Hospital Beds')}</span>
              <span className="text-[10px] text-blue-200 mt-0.5">{t('Quaternary Facility')}</span>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-5 rounded-3xl border border-white/20 text-center flex flex-col items-center">
              <span className="text-3xl font-black text-teal-300">63</span>
              <span className="text-xs font-bold text-white uppercase tracking-wider mt-1">{t('Specialities')}</span>
              <span className="text-[10px] text-blue-200 mt-0.5">{t('Advanced Treatment')}</span>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-5 rounded-3xl border border-white/20 text-center flex flex-col items-center">
              <span className="text-3xl font-black text-emerald-300">39</span>
              <span className="text-xs font-bold text-white uppercase tracking-wider mt-1">{t('Senior Specialists')}</span>
              <span className="text-[10px] text-blue-200 mt-0.5">{t('In PDF Directory')}</span>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-5 rounded-3xl border border-white/20 text-center flex flex-col items-center">
              <span className="text-3xl font-black text-rose-300">130+</span>
              <span className="text-xs font-bold text-white uppercase tracking-wider mt-1">{t('Global Countries')}</span>
              <span className="text-[10px] text-blue-200 mt-0.5">{t('International Care')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ 4. CENTERS OF EXCELLENCE ══════════ */}
      <section id="centers" className="py-14 max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-[#0B2545] text-xs font-extrabold uppercase tracking-wider mb-2">
              {t('⭐ MIOT Centers of Excellence')}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0B2545] tracking-tight">
              {t('Leading Medical Institutes at MIOT')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              {t('Internationally recognized centers spearheaded by visionary medical leaders.')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CENTERS_OF_EXCELLENCE.map((center, idx) => (
            <div
              key={center.title}
              className={`bg-gradient-to-br ${center.bgGradient} text-white rounded-3xl p-6 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">{center.icon}</span>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-amber-300 border border-white/20">
                    {t(center.badge)}
                  </span>
                </div>

                <h3 className="text-lg font-black text-white leading-tight group-hover:text-amber-200 transition-colors">
                  {t(center.title)}
                </h3>

                <p className="text-xs font-bold text-teal-200 mt-2">
                  {t(center.head)}
                </p>

                <p className="text-xs text-slate-200 font-normal leading-relaxed mt-2.5">
                  {t(center.description)}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/15 flex items-center justify-between">
                <button
                  onClick={() => handleDeptSelect(center.dept)}
                  className="text-xs font-bold text-white bg-white/20 hover:bg-white/30 px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5"
                >
                  <span>{t('View Doctors')} ({t(center.dept)})</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════ 5. 20 SPECIALTIES CATEGORY FILTER ══════════ */}
      <section id="specialties" className="py-8 bg-slate-100/70 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg sm:text-xl font-black text-[#0B2545] tracking-tight">
                {t('Browse by Speciality (20 Departments)')}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {t('Click any department below to view specialized MIOT doctors.')}
              </p>
            </div>
            {selectedDept !== 'All Specialties' && (
              <button
                onClick={() => setSelectedDept('All Specialties')}
                className="text-xs font-bold text-blue-700 hover:underline bg-white px-3 py-1 rounded-full shadow-xs border border-slate-200"
              >
                {t('Clear Filter')} ✕
              </button>
            )}
          </div>

          {/* Department Chips */}
          <div className="flex flex-wrap gap-2 pt-2">
            {ALL_DEPARTMENTS.map((dept) => {
              const isSelected = selectedDept.toLowerCase() === dept.toLowerCase();
              return (
                <button
                  key={dept}
                  onClick={() => setSelectedDept(dept)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
                    isSelected
                      ? 'bg-[#0B2545] text-white shadow-md shadow-blue-950/20 scale-105'
                      : 'bg-white text-slate-700 hover:bg-blue-50 hover:text-blue-900 border border-slate-200/80'
                  }`}
                >
                  {t(dept)}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════ 6. DOCTOR DIRECTORY & APPOINTMENTS GRID ══════════ */}
      <section id="doctor-directory" className="py-14 max-w-7xl mx-auto px-4 sm:px-6 w-full flex-1">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl sm:text-3xl font-black text-[#0B2545] tracking-tight">
                {t('MIOT Doctor Directory')}
              </h2>
              <span className="bg-blue-100 text-[#0B2545] text-xs font-black px-3 py-1 rounded-full">
                {filteredDoctors.length} {filteredDoctors.length === 1 ? t('Doctor') : t('Doctors')}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              {t('Select any doctor to book your confirmed appointment slot online.')}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-400">{t('Department:')}</span>
            <span className="text-xs font-black text-[#0B2545] bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200">
              {t(selectedDept)}
            </span>
          </div>
        </div>

        {/* Loading Skeleton */}
        {loadingDoctors ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs animate-pulse">
                <div className="flex gap-4 items-center mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-slate-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-3/4" />
                    <div className="h-3 bg-slate-200 rounded w-1/2" />
                  </div>
                </div>
                <div className="h-10 bg-slate-100 rounded-xl mb-3" />
                <div className="h-9 bg-slate-200 rounded-xl" />
              </div>
            ))}
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-lg mx-auto shadow-sm">
            <span className="text-4xl">🔍</span>
            <h3 className="text-lg font-black text-slate-800 mt-3">{t('No Doctors Found')}</h3>
            <p className="text-xs text-slate-500 mt-1">
              {t('No doctors found matching your selection')}
            </p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedDept('All Specialties'); }}
              className="mt-4 px-4 py-2 bg-[#0B2545] text-white text-xs font-bold rounded-xl"
            >
              {t('Reset Filters')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doc) => {
              const docName = doc.user?.name || 'Dr. Specialist';
              const docAvatar = doc.user?.avatar;
              const docSpec = doc.specialization;
              const docQual = doc.qualification || '';
              const docDesig = doc.designation || '';
              const docExp = doc.experienceDisplay || `${doc.experience || 10}+ years`;
              const fee = doc.consultationFee || 800;

              return (
                <div
                  key={doc._id}
                  className="bg-white rounded-3xl overflow-hidden shadow-xs border border-slate-200/80 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group"
                >
                  <div className="p-6">
                    {/* Top Row: Avatar + Name + Specialization */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 shadow-sm shrink-0 border border-slate-200 group-hover:scale-105 transition-transform">
                        <img
                          src={getDoctorPhoto(doc)}
                          alt={docName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const gender = doc.user?.gender || doc.gender || 'male';
                            e.target.src = gender === 'female'
                              ? 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80'
                              : 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&q=80';
                          }}
                        />
                      </div>

                      <div className="flex-1 min-w-0 text-left">
                        <span className="inline-block text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-50 text-[#0B2545] border border-blue-200/60 mb-1">
                          {t(docSpec)}
                        </span>
                        <h3 className="font-black text-slate-900 text-base leading-tight group-hover:text-[#133E87] transition-colors truncate">
                          {t(docName)}
                        </h3>
                        <p className="text-[11px] font-bold text-slate-500 line-clamp-1 mt-0.5">
                          {t(docDesig)}
                        </p>
                      </div>
                    </div>

                    {/* Qualifications & Experience */}
                    <div className="space-y-1.5 text-left border-t border-slate-100 pt-3">
                      {docQual && (
                        <div className="flex items-start gap-1.5 text-slate-600">
                          <span className="text-[11px] font-bold text-[#0B2545] shrink-0">🎓 {t('Degree:')}</span>
                          <span className="text-[11px] font-medium text-slate-600 line-clamp-1">{t(docQual)}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200/60">
                          ⏱️ {t(docExp)}
                        </span>
                        <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                          ⭐ {doc.rating || '4.9'} ({doc.totalRatings || '120'}+)
                        </span>
                      </div>

                      {doc.expertise && (
                        <p className="text-[11px] text-slate-500 font-medium line-clamp-2 mt-2 leading-relaxed">
                          <strong className="text-slate-700">{t('Expertise:')}</strong> {t(doc.expertise)}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Bottom Action Footer */}
                  <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-3">
                    <div className="text-left">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">{t('Consultation')}</span>
                      <span className="text-sm font-black text-[#0B2545]">₹{fee}</span>
                    </div>

                    <button
                      onClick={() => handleBookClick(doc._id)}
                      className="px-4 py-2 bg-gradient-to-r from-[#0B2545] to-[#133E87] hover:from-[#133E87] hover:to-[#0B2545] text-white text-xs font-black rounded-xl shadow-md shadow-blue-950/20 transition-all flex items-center gap-1.5 hover:scale-105 active:scale-95"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                      <span>{t('Book Slot')}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ══════════ 7. FACILITIES & EMERGENCY HIGHLIGHTS ══════════ */}
      <section id="facilities" className="py-14 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-black uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full">
              {t('World-Class Infrastructure')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0B2545] tracking-tight mt-2">
              {t('Advanced Technology & Round-the-Clock Emergency')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {t('Equipped with international medical standards for immediate diagnosis and quaternary interventions.')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 hover:shadow-lg transition-all text-left">
              <span className="text-3xl">🚨</span>
              <h4 className="text-base font-black text-[#0B2545] mt-3">{t('24/7 Emergency Care')}</h4>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                {t('Acute cardiac resuscitation, trauma surgical suite, stroke care, and rapid ambulances at emergency code: 10 57 10.')}
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 hover:shadow-lg transition-all text-left">
              <span className="text-3xl">⚡</span>
              <h4 className="text-base font-black text-[#0B2545] mt-3">{t('Biplane CathLab & 3T MRI')}</h4>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                {t('High-definition cardiovascular interventions, BodyTom mobile CT, and ultra-high-resolution imaging systems.')}
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 hover:shadow-lg transition-all text-left">
              <span className="text-3xl">🏥</span>
              <h4 className="text-base font-black text-[#0B2545] mt-3">{t('1000-Bed Facility')}</h4>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                {t('Laminar flow infection-controlled operation theatres, modern ICU beds, and MIOT COVID-Free Green Zone.')}
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 hover:shadow-lg transition-all text-left">
              <span className="text-3xl">🌍</span>
              <h4 className="text-base font-black text-[#0B2545] mt-3">{t('International Patients')}</h4>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                {t('Full-service international patient care (IPC) team offering airport pickup, visa facilitation, and foreign language translation.')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ 8. ABOUT MIOT INTERNATIONAL & FOUNDER ══════════ */}
      <section id="about" className="py-14 bg-gradient-to-r from-slate-900 to-[#0B2545] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="max-w-3xl text-left">
            <span className="text-xs font-bold text-amber-300 uppercase tracking-widest">
              {t('ABOUT MIOT INTERNATIONAL')}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mt-2">
              {t('Putting Patients First Since 1999')}
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm font-medium leading-relaxed mt-4">
              {t('MIOT International offers the best in healthcare to patients who have come to trust the hospital as one of India\'s foremost quaternary institutions. A 1000-bed facility offering superlative treatment in 63 specialities, MIOT proudly lays claim to a team of world-class medical professionals who use cutting-edge infrastructure to heal and give hope.')}
            </p>
            <p className="text-slate-300 text-xs sm:text-sm font-medium leading-relaxed mt-3">
              {t('Consistently adjudged as a leader in healthcare, MIOT International attracts patients from 130 countries who seek our surgical and clinical expertise in moving towards wellness.')}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-bold">
              <span className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/20">📍 {t('Manapakkam, Chennai')}</span>
              <span className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/20">📞 +91 44 42002288</span>
              <span className="bg-red-600/80 px-3 py-1.5 rounded-xl text-white">🚨 {t('Emergency')}: 10 57 10</span>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 max-w-sm w-full text-center shrink-0">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black text-2xl mx-auto mb-3 shadow-lg">
              MIOT
            </div>
            <h4 className="text-lg font-black text-white">{t('Prof. Dr. P. V. A. Mohandas')}</h4>
            <p className="text-xs font-bold text-amber-300 mt-0.5">{t('Founder & Mentor, Chief Surgeon')}</p>
            <p className="text-[11px] text-slate-300 mt-2 leading-relaxed">
              {t('"We spared no expense or effort to bring the very best in global medical talent, infrastructure, and empathy to heal human lives."')}
            </p>
          </div>
        </div>
      </section>

      {/* ══════════ 9. OFFICIAL MIOT FOOTER ══════════ */}
      <footer className="bg-[#051329] text-white pt-14 pb-8 border-t border-slate-800 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          
          {/* Col 1: Brand & Emergency */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-sm">
                +
              </div>
              <span className="text-lg font-black text-white">MIOT INTERNATIONAL</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t('4/112, Mount Poonamallee Road, Manapakkam, Chennai - 600089, Tamil Nadu, India.')}
            </p>

            <div className="mt-4 space-y-2 text-xs">
              <div className="text-slate-300">
                <span className="text-slate-500 font-bold">{t('Emergency 24/7')}:</span>{' '}
                <a href="tel:105710" className="text-red-400 font-bold hover:underline">10 57 10</a>
              </div>
              <div className="text-slate-300">
                <span className="text-slate-500 font-bold">{t('Appointments')}:</span>{' '}
                <a href="tel:+914442002288" className="text-teal-400 font-bold hover:underline">+91 44 42002288</a>
              </div>
              <div className="text-slate-300">
                <span className="text-slate-500 font-bold">{t('Email')}:</span> enquiry@miotinternational.com
              </div>
            </div>
          </div>

          {/* Col 2: Centers of Excellence */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-300 mb-4">
              {t('Centers of Excellence')}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li><button onClick={() => handleDeptSelect('Orthopedics')} className="hover:text-white transition-colors">{t('MIOT Institute of Orthopaedics')}</button></li>
              <li><button onClick={() => handleDeptSelect('Cardiology')} className="hover:text-white transition-colors">{t('MIOT Institute of Cardiac Care')}</button></li>
              <li><button onClick={() => handleDeptSelect('Gastroenterology')} className="hover:text-white transition-colors">{t('Center for Gastrointestinal & Liver Diseases')}</button></li>
              <li><button onClick={() => handleDeptSelect('Nephrology')} className="hover:text-white transition-colors">{t('MIOT Institute of Nephrology')}</button></li>
              <li><button onClick={() => handleDeptSelect('Oncology')} className="hover:text-white transition-colors">{t('MIOT Institute of Cancer Cure')}</button></li>
              <li><button onClick={() => handleDeptSelect('Neurology')} className="hover:text-white transition-colors">{t('Neurology')} & {t('Neurosciences')}</button></li>
            </ul>
          </div>

          {/* Col 3: Key Specialties */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-300 mb-4">
              {t('Key Specialties')}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li><button onClick={() => handleDeptSelect('Pulmonology')} className="hover:text-white transition-colors">{t('Pulmonology')} & {t('Sleep Medicine')}</button></li>
              <li><button onClick={() => handleDeptSelect('Pediatrics')} className="hover:text-white transition-colors">{t('Pediatrics')} & {t('Paediatric Surgery')}</button></li>
              <li><button onClick={() => handleDeptSelect('Obstetrics & Gynecology')} className="hover:text-white transition-colors">{t('Obstetrics & Gynecology')}</button></li>
              <li><button onClick={() => handleDeptSelect('Dermatology')} className="hover:text-white transition-colors">{t('Dermatology')} & {t('Trichology')}</button></li>
              <li><button onClick={() => handleDeptSelect('Ophthalmology')} className="hover:text-white transition-colors">{t('Ophthalmology')} & {t('Retina')}</button></li>
              <li><button onClick={() => handleDeptSelect('ENT')} className="hover:text-white transition-colors">{t('ENT')} & {t('Head-Neck Surgery')}</button></li>
            </ul>
          </div>

          {/* Col 4: Patient Info & Visiting */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-300 mb-4">
              {t('Visiting & Information')}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li>{t('Visiting Hours: 10:00 AM - 12:00 PM')}</li>
              <li>{t('Evening Hours: 05:00 PM - 07:00 PM')}</li>
              <li>{t('International Patient Care Desk')}</li>
              <li>{t('Bio-Medical Waste Reports')}</li>
              <li>{t('Privacy Policy & Patient Rights')}</li>
            </ul>

            <div className="mt-4">
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=13.0205,80.1783"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-900/60 hover:bg-blue-900 text-teal-300 rounded-lg text-xs font-bold transition-colors border border-blue-700/50"
              >
                <span>📍 {t('Get Hospital Directions')}</span>
                <span>↗</span>
              </a>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} {t('MIOT International. All Rights Reserved. Online Doctor Appointments & Consultation.')}</p>
          <p>{t('Official Portal for MIOT International Hospital, Chennai, India.')}</p>
        </div>
      </footer>
      </div>

      {/* ── FOUNDER BIOGRAPHY MODAL ── */}
      {founderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200 animate-in zoom-in-95">
            <button
              onClick={() => setFounderModalOpen(false)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm cursor-pointer transition-colors"
            >
              ✕
            </button>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                <img src={founderImg} alt="Prof. PVA Mohandas" className="w-full h-full object-cover object-top" />
              </div>
              <div className="text-left">
                <span className="text-[10px] font-black uppercase text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                  {t('FOUNDER & VISIONARY EXTRAORDINAIRE')}
                </span>
                <h3 className="text-lg font-black text-[#0B2545] mt-1">Prof. Dr. P. V. A. Mohandas</h3>
                <p className="text-xs font-bold text-slate-500">{t('Founder & Mentor, Chief Surgeon')}</p>
              </div>
            </div>
            <div className="text-xs text-slate-600 space-y-2.5 text-left leading-relaxed">
              <p>
                {t('Prof. PVA Mohandas dreamt of bringing the very best in medical care to India and spared no expense or effort to create MIOT International, the super-speciality hospital.')}
              </p>
              <p className="italic text-slate-700 font-medium">
                {t('"We spared no expense or effort to bring the very best in global medical talent, infrastructure, and empathy to heal human lives."')}
              </p>
              <p className="text-[11px] text-slate-500 border-t border-slate-100 pt-2 font-medium">
                {t('Under his leadership, MIOT has established 63 specialities, 1000 beds, and attracts patients from 130 countries worldwide for advanced joint replacement, cardiac care, oncology, and organ transplants.')}
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => {
                  setFounderModalOpen(false);
                  const el = document.getElementById('doctor-directory');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full py-2.5 bg-[#0B2545] hover:bg-[#133E87] text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer"
              >
                {t('View Hospital Doctors')} →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
