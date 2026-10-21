import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import LanguageSelector from '../components/LanguageSelector';
import hospitalBannerImg from '../assets/miot_hospital_banner.jpg';
import orthoMobilityImg from '../assets/miot_ortho_mobility.jpg';
import kneeSurgeryOtImg from '../assets/miot_knee_surgery_ot.jpg';
import medicalTeamImg from '../assets/miot_medical_team.jpg';
import { INSTITUTES_DATA, KEY_SPECIALTIES_DATA } from '../data/specialitiesData';
import MiotMegaMenu from '../components/MiotMegaMenu';

export default function SpecialitiesTreatments() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Active top navigation tab: 'specialities' | 'facilities' | 'programmes' | 'patients' | 'global'
  const sectionParam = searchParams.get('section');
  const [activeSection, setActiveSection] = useState(sectionParam || 'specialities');

  // Active top tab in Directory view (Image 1): 'centers' or 'key-specialties'
  const [activeMainTab, setActiveMainTab] = useState('centers');

  // Selected institute & specialty for Detail view (Images 2 & 3)
  const instituteParam = searchParams.get('institute');
  const specialtyParam = searchParams.get('specialty');

  const [selectedInstitute, setSelectedInstitute] = useState(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState(null);

  // Accordion open states for detail view (Image 3)
  const [openAccordions, setOpenAccordions] = useState({ 0: false, 1: false, 2: false, 3: false });
  const [quickLinksOpen, setQuickLinksOpen] = useState(true);

  // Sync state with URL params
  useEffect(() => {
    if (sectionParam) {
      setActiveSection(sectionParam);
    } else {
      setActiveSection('specialities');
    }

    if (instituteParam && specialtyParam) {
      const inst = INSTITUTES_DATA.find((i) => i.id === instituteParam);
      if (inst) {
        const spec = inst.items.find((s) => s.id === specialtyParam) || inst.items[0];
        setSelectedInstitute(inst);
        setSelectedSpecialty(spec);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }
    // If no params, default to directory view
    setSelectedInstitute(null);
    setSelectedSpecialty(null);
  }, [sectionParam, instituteParam, specialtyParam]);

  const handleNavClick = (section) => {
    setActiveSection(section);
    setSelectedInstitute(null);
    setSelectedSpecialty(null);
    if (section === 'specialities') {
      setSearchParams({});
    } else {
      setSearchParams({ section });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectSpecialty = (institute, specialty) => {
    setActiveSection('specialities');
    setSelectedInstitute(institute);
    setSelectedSpecialty(specialty);
    setSearchParams({ institute: institute.id, specialty: specialty.id });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToDirectory = () => {
    setActiveSection('specialities');
    setSelectedInstitute(null);
    setSelectedSpecialty(null);
    setSearchParams({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleAccordion = (idx) => {
    setOpenAccordions((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-slate-800">
      
      {/* ══════════════════════════════════════════════════════════════
          1. OFFICIAL MIOT HEADER
      ══════════════════════════════════════════════════════════════ */}
      <header className="bg-white border-b border-slate-200 shadow-xs sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
          
          {/* Logo */}
          <Link to="/patient/home" className="flex items-center gap-3.5 group shrink-0">
            <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm flex flex-wrap border border-slate-200/80 group-hover:scale-105 transition-transform">
              <div className="w-6 h-6 bg-[#D81E5B]"></div>
              <div className="w-6 h-6 bg-[#0B2545]"></div>
              <div className="w-6 h-6 bg-[#133E87] flex items-center justify-center text-white">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 14.93V17a1 1 0 0 1-2 0v-.07A7 7 0 0 1 5.07 11H5a1 1 0 0 1 0-2h.07A7 7 0 0 1 11 3.07V3a1 1 0 0 1 2 0v.07A7 7 0 0 1 18.93 9H19a1 1 0 0 1 0 2h-.07A7 7 0 0 1 13 16.93z" opacity="0.3"/>
                  <path d="M7 13c1.5 2 4 3 6 1s4-3 5-1"/>
                </svg>
              </div>
              <div className="w-6 h-6 bg-[#EFA00B]"></div>
            </div>

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
            <div className="flex items-center gap-2.5 bg-slate-50 p-2 px-3 rounded-xl border border-slate-200 shadow-2xs">
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

            <div className="hidden xl:flex items-center gap-2.5 bg-slate-50 p-2 px-3 rounded-xl border border-slate-200 shadow-2xs">
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

            <div className="flex items-center gap-2">
              <LanguageSelector />

              {user ? (
                <button
                  onClick={() => navigate(user.role === 'patient' ? '/patient' : `/${user.role}`)}
                  className="flex items-center gap-1.5 p-1 pl-1.5 pr-2.5 rounded-full bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-all text-xs font-bold text-[#0B2545]"
                >
                  <div className="w-6 h-6 rounded-full bg-[#0B2545] text-white flex items-center justify-center font-black text-[10px]">
                    {user.name?.charAt(0) || 'U'}
                  </div>
                  <span className="hidden sm:inline font-bold truncate max-w-[80px]">{user.name}</span>
                </button>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="px-3 py-1.5 border border-slate-300 bg-white text-slate-700 text-xs font-bold rounded-lg"
                >
                  {t('Sign In')}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Secondary Menu Bar with Active Red Highlight (matching user images) */}
        <div className="bg-slate-50/80 border-t border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
            <nav className="flex items-center gap-2 sm:gap-5 md:gap-7 text-xs font-black uppercase tracking-tight overflow-x-auto py-2.5 scrollbar-none">
              <Link to="/patient/home" className="text-blue-800 hover:text-blue-950 transition-colors p-1 shrink-0" title="Home">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                </svg>
              </Link>
              
              {/* SPECIALITIES & TREATMENTS */}
              <button
                onClick={() => handleNavClick('specialities')}
                className={`transition-colors whitespace-nowrap shrink-0 font-black cursor-pointer ${
                  activeSection === 'specialities'
                    ? 'text-[#D81E5B] border-b-2 border-[#D81E5B] pb-0.5'
                    : 'text-slate-700 hover:text-[#D81E5B]'
                }`}
              >
                {t('SPECIALITIES & TREATMENTS')}
              </button>

              {/* FACILITIES & RESOURCES (Image 1) */}
              <button
                onClick={() => handleNavClick('facilities')}
                className={`transition-colors whitespace-nowrap shrink-0 font-black cursor-pointer ${
                  activeSection === 'facilities'
                    ? 'text-[#D81E5B] border-b-2 border-[#D81E5B] pb-0.5'
                    : 'text-slate-700 hover:text-[#D81E5B]'
                }`}
              >
                {t('FACILITIES & RESOURCES')}
              </button>

              {/* PROGRAMMES & EDUCATION (Image 2) */}
              <button
                onClick={() => handleNavClick('programmes')}
                className={`transition-colors whitespace-nowrap shrink-0 font-black cursor-pointer ${
                  activeSection === 'programmes'
                    ? 'text-[#D81E5B] border-b-2 border-[#D81E5B] pb-0.5'
                    : 'text-slate-700 hover:text-[#D81E5B]'
                }`}
              >
                {t('PROGRAMMES & EDUCATION')}
              </button>

              {/* PATIENTS & VISITORS (Image 3) */}
              <button
                onClick={() => handleNavClick('patients')}
                className={`transition-colors whitespace-nowrap shrink-0 font-black cursor-pointer ${
                  activeSection === 'patients'
                    ? 'text-[#D81E5B] border-b-2 border-[#D81E5B] pb-0.5'
                    : 'text-slate-700 hover:text-[#D81E5B]'
                }`}
              >
                {t('PATIENTS & VISITORS')}
              </button>

              {/* GLOBAL CENTERS (Image 4) */}
              <button
                onClick={() => handleNavClick('global')}
                className={`transition-colors whitespace-nowrap shrink-0 font-black cursor-pointer ${
                  activeSection === 'global'
                    ? 'text-[#D81E5B] border-b-2 border-[#D81E5B] pb-0.5'
                    : 'text-slate-700 hover:text-[#D81E5B]'
                }`}
              >
                {t('GLOBAL CENTERS')}
              </button>
            </nav>

            <Link
              to="/patient/home#doctor-directory"
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0B2545] hover:bg-[#133E87] text-white text-xs font-bold rounded-lg shadow-sm transition-all shrink-0"
            >
              <span>📅</span>
              <span>{t('Book Doctor Slot')}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════════════
          2. MAIN CONTENT AREA (MegaMenu for Facilities, Programmes, Patients, Global OR Specialities)
      ══════════════════════════════════════════════════════════════ */}
      {activeSection !== 'specialities' ? (
        <div className="flex-1 w-full bg-white animate-in fade-in">
          <MiotMegaMenu
            activeMenuKey={activeSection}
            onSelectSpecialty={handleSelectSpecialty}
          />
        </div>
      ) : !selectedSpecialty ? (
        <div className="flex-1 w-full bg-white animate-in fade-in">
          
          {/* Top Two Big Tabs matching Image 1 */}
          <div className="w-full flex items-stretch text-white text-xs sm:text-sm font-black uppercase tracking-wider select-none">
            
            {/* Centers of Excellence Tab */}
            <button
              onClick={() => setActiveMainTab('centers')}
              className={`flex-1 py-4 sm:py-5 px-6 sm:px-12 flex items-center justify-center gap-2 cursor-pointer transition-all relative ${
                activeMainTab === 'centers'
                  ? 'bg-[#EFA00B] text-white shadow-md'
                  : 'bg-amber-600/80 hover:bg-amber-600 text-white/90'
              }`}
            >
              <span>{t('CENTERS OF EXCELLENCE')}</span>
              {activeMainTab === 'centers' && (
                <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-10 border-t-[#EFA00B] z-10" />
              )}
            </button>

            {/* Key Specialties Tab */}
            <button
              onClick={() => setActiveMainTab('key-specialties')}
              className={`flex-1 py-4 sm:py-5 px-6 sm:px-12 flex items-center justify-center gap-2 cursor-pointer transition-all relative ${
                activeMainTab === 'key-specialties'
                  ? 'bg-[#1F54B0] text-white shadow-md'
                  : 'bg-blue-800/80 hover:bg-blue-800 text-white/90'
              }`}
            >
              <span>{t('KEY SPECIALTIES')}</span>
              {activeMainTab === 'key-specialties' && (
                <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-10 border-t-[#1F54B0] z-10" />
              )}
            </button>
          </div>

          {/* TAB 1: CENTERS OF EXCELLENCE (IMAGE 1 3-COLUMN DIRECTORY) */}
          {activeMainTab === 'centers' ? (
            <div className="max-w-7xl mx-auto px-6 sm:px-12 py-10 sm:py-14 text-left">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14">
                
                {/* ── COLUMN 1: ORTHOPAEDICS & NEPHROLOGY ── */}
                <div className="space-y-10">
                  {/* MIOT Institute of Orthopaedics */}
                  <div>
                    <h3 className="text-sm font-black text-[#0B2545] uppercase tracking-wider mb-5">
                      {t('MIOT INSTITUTE OF ORTHOPAEDICS')}
                    </h3>
                    <ul className="space-y-3.5 text-xs font-semibold text-slate-700">
                      {INSTITUTES_DATA[0].items.map((item) => (
                        <li key={item.id}>
                          <button
                            onClick={() => handleSelectSpecialty(INSTITUTES_DATA[0], item)}
                            className="group flex items-start gap-2.5 hover:text-blue-700 transition-colors cursor-pointer text-left w-full"
                          >
                            <span className="text-blue-600 font-bold group-hover:translate-x-0.5 transition-transform">›</span>
                            <span className="group-hover:underline">{t(item.title)}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="border-t border-amber-300/60 pt-8">
                    {/* MIOT Institute of Nephrology */}
                    <h3 className="text-sm font-black text-[#0B2545] uppercase tracking-wider mb-5">
                      {t('MIOT INSTITUTE OF NEPHROLOGY')}
                    </h3>
                    <ul className="space-y-3.5 text-xs font-semibold text-slate-700">
                      {INSTITUTES_DATA[3].items.map((item) => (
                        <li key={item.id}>
                          <button
                            onClick={() => handleSelectSpecialty(INSTITUTES_DATA[3], item)}
                            className="group flex items-start gap-2.5 hover:text-blue-700 transition-colors cursor-pointer text-left w-full"
                          >
                            <span className="text-blue-600 font-bold group-hover:translate-x-0.5 transition-transform">›</span>
                            <span className="group-hover:underline">{t(item.title)}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* ── COLUMN 2: CARDIAC CARE & CANCER CURE ── */}
                <div className="space-y-10">
                  {/* MIOT Institute of Cardiac Care */}
                  <div>
                    <h3 className="text-sm font-black text-[#0B2545] uppercase tracking-wider mb-5">
                      {t('MIOT INSTITUTE OF CARDIAC CARE')}
                    </h3>
                    <ul className="space-y-3.5 text-xs font-semibold text-slate-700">
                      {INSTITUTES_DATA[1].items.map((item) => (
                        <li key={item.id}>
                          <button
                            onClick={() => handleSelectSpecialty(INSTITUTES_DATA[1], item)}
                            className="group flex items-start gap-2.5 hover:text-blue-700 transition-colors cursor-pointer text-left w-full"
                          >
                            <span className="text-blue-600 font-bold group-hover:translate-x-0.5 transition-transform">›</span>
                            <span className="group-hover:underline">{t(item.title)}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="border-t border-amber-300/60 pt-8">
                    {/* MIOT Institute of Cancer Cure */}
                    <h3 className="text-sm font-black text-[#0B2545] uppercase tracking-wider mb-5">
                      {t('MIOT INSTITUTE OF CANCER CURE')}
                    </h3>
                    <ul className="space-y-3.5 text-xs font-semibold text-slate-700">
                      {INSTITUTES_DATA[4].items.map((item) => (
                        <li key={item.id}>
                          <button
                            onClick={() => handleSelectSpecialty(INSTITUTES_DATA[4], item)}
                            className="group flex items-start gap-2.5 hover:text-blue-700 transition-colors cursor-pointer text-left w-full"
                          >
                            <span className="text-blue-600 font-bold group-hover:translate-x-0.5 transition-transform">›</span>
                            <span className="group-hover:underline">{t(item.title)}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* ── COLUMN 3: GASTROINTESTINAL & LIVER ── */}
                <div>
                  <h3 className="text-sm font-black text-[#0B2545] uppercase tracking-wider mb-5">
                    {t('CENTER FOR GASTROINTESTINAL AND LIVER DISEASES')}
                  </h3>
                  <ul className="space-y-3.5 text-xs font-semibold text-slate-700">
                    {INSTITUTES_DATA[2].items.map((item) => (
                      <li key={item.id}>
                        <button
                          onClick={() => handleSelectSpecialty(INSTITUTES_DATA[2], item)}
                          className="group flex items-start gap-2.5 hover:text-blue-700 transition-colors cursor-pointer text-left w-full"
                        >
                          <span className="text-blue-600 font-bold group-hover:translate-x-0.5 transition-transform">›</span>
                          <span className="group-hover:underline">{t(item.title)}</span>
                        </button>
                      </li>
                    ))}
                  </ul>

                  <div className="border-t border-amber-300/60 mt-10 pt-8">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block mb-1">
                        {t('Comprehensive Quaternary Care')}
                      </span>
                      <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                        {t('All Centers of Excellence are equipped with dedicated 24x7 intensive care units, lamin-air flow operating suites, and senior consultant surgical teams.')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* TAB 2: KEY SPECIALTIES (ARRANGED IN 3 NEAT COLUMNS) */
            <div className="max-w-7xl mx-auto px-6 sm:px-12 py-10 sm:py-14 text-left animate-in fade-in">
              <h3 className="text-base font-black text-[#0B2545] uppercase tracking-wider mb-8 pb-2 border-b border-slate-200">
                {t('Browse All 20 Key Specialties')}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {KEY_SPECIALTIES_DATA.map((spec) => (
                  <div
                    key={spec.name}
                    className="p-5 rounded-2xl border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all bg-white flex flex-col justify-between"
                  >
                    <div>
                      <h4 className="text-sm font-black text-[#0B2545] mb-2">{t(spec.name)}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed font-normal">{t(spec.desc)}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={() => navigate(`/patient/home#doctor-directory`)}
                        className="text-xs font-bold text-blue-700 hover:underline flex items-center gap-1"
                      >
                        <span>{t('View Doctors')}</span>
                        <span>→</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* ══════════════════════════════════════════════════════════════
            3. DETAIL VIEW (IMAGES 2 & 3) - WHEN A SPECIALTY IS CLICKED
        ══════════════════════════════════════════════════════════════ */
        <div className="flex-1 w-full bg-white animate-in fade-in">
          
          {/* Top Banner with Breadcrumbs matching Image 2 */}
          <div className="relative h-60 sm:h-72 w-full overflow-hidden bg-slate-900">
            <img
              src={hospitalBannerImg}
              alt={selectedInstitute.name}
              className="w-full h-full object-cover object-center filter brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/55 to-transparent flex flex-col justify-center px-6 sm:px-16">
              <div className="max-w-7xl mx-auto w-full text-left flex items-center gap-4">
                {selectedSpecialty.icon === 'knee' && (
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-[#EFA00B] flex items-center justify-center p-2.5 shadow-lg shrink-0">
                    <svg viewBox="0 0 64 64" fill="white" className="w-full h-full">
                      <path d="M24 6C20 6 18 9 18 13C18 19 24 23 26 27C23 29 20 33 20 37C20 42 23 45 26 47C23 51 18 55 18 60C18 64 22 67 26 67C31 67 33 63 33 59C33 55 31 51 29 47C33 45 36 41 36 37C36 32 33 29 29 27C31 23 33 19 33 14C33 9 30 6 26 6C25 6 24.5 6 24 6Z" opacity="0.4"/>
                      <path d="M38 6C34 6 31 9 31 14C31 19 33 23 35 27C31 29 28 32 28 37C28 41 31 45 35 47C33 51 31 55 31 59C31 63 33 67 38 67C42 67 46 64 46 60C46 55 41 51 38 47C41 45 44 42 44 37C44 33 41 29 38 27C40 23 46 19 46 13C46 9 44 6 40 6C39.5 6 39 6 38 6Z"/>
                    </svg>
                  </div>
                )}
                <div>
                  <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                    {t(selectedSpecialty.title)}
                  </h1>
                  <p className="text-xs sm:text-sm font-bold text-amber-300 mt-2">
                    {t(selectedInstitute.shortName)}
                  </p>
                </div>
              </div>
            </div>

            {/* Sub-banner strip for Joint for Life (Matching Image 1) */}
            {selectedSpecialty.hasJointForLifeBanner && (
              <div className="absolute top-auto bottom-8 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200 hidden md:flex items-center justify-between px-6 sm:px-16 py-0 text-xs shadow-md">
                <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
                  {/* Left Joint for Life Badge */}
                  <div className="bg-[#002D62] text-white py-2 px-4 flex items-center gap-2 rounded-t-md shadow-xs">
                    <span className="bg-[#EFA00B] text-[#002D62] font-black text-[10px] px-1.5 py-0.5 rounded">MIOT</span>
                    <span className="font-extrabold italic text-xs tracking-tight text-white">Joint for Life</span>
                    <span className="text-[9px] text-blue-200 border-l border-blue-400 pl-2">Hip and Knee Replacement Surgeries</span>
                  </div>

                  {/* Center Tabs */}
                  <div className="flex items-center text-xs font-bold">
                    <span className="bg-[#EFA00B] text-white py-2.5 px-6 font-black uppercase tracking-wider shadow-xs">
                      — {t('Overview')}
                    </span>
                    <span className="bg-[#5B626C] text-white/90 py-2.5 px-6 font-bold uppercase tracking-wider hover:bg-slate-700 cursor-pointer">
                      + {t('Treatments & Procedures')}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Breadcrumb Strip matching Image 2 */}
            <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-xs py-2 px-6 sm:px-16 text-left">
              <div className="max-w-7xl mx-auto text-xs text-amber-400 font-bold flex items-center gap-2 flex-wrap">
                <Link to="/patient/home" className="hover:underline">{t('Home')}</Link>
                <span>/</span>
                <button onClick={handleBackToDirectory} className="hover:underline text-white cursor-pointer">
                  {t(selectedInstitute.shortName)}
                </button>
                <span>/</span>
                <span className="text-amber-300">{t(selectedSpecialty.title)}</span>
              </div>
            </div>
          </div>

          {/* 3-Column Body matching Images 2 & 3 */}
          <div className="flex flex-col lg:flex-row w-full items-stretch border-b border-slate-200">
            
            {/* ── LEFT COLUMN: GOLD WATERMARK BAR ── */}
            <div className="lg:w-72 bg-[#EFA00B] text-white/90 p-8 sm:p-10 flex flex-col justify-center relative overflow-hidden shrink-0 select-none">
              <div className="text-3xl sm:text-4xl font-serif italic font-extrabold text-[#D98200] leading-tight select-none">
                &ldquo;Where the art of medicine is loved, there is also a love of humanity&rdquo;
              </div>
              <p className="text-sm font-black text-[#8C5300] uppercase tracking-widest mt-4">
                — Hippocrates
              </p>
            </div>

            {/* ── CENTER COLUMN: SPECIALTY DETAILS & ACCORDIONS ── */}
            <div className="flex-1 p-6 sm:p-12 text-left bg-white">
              
              {/* Institute Sub-heading */}
              <div className="flex items-center justify-between gap-4 mb-2">
                <span className="text-xs sm:text-sm font-black text-slate-500 uppercase tracking-wider">
                  {t(selectedInstitute.name)}
                </span>
                <button
                  onClick={handleBackToDirectory}
                  className="text-xs font-bold text-blue-700 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>←</span>
                  <span>{t('Back to Directory')}</span>
                </button>
              </div>

              {/* Main Heading matching Image 2 */}
              <h2 className="text-2xl sm:text-3xl font-black text-[#133E87] tracking-tight mb-6">
                {t(selectedSpecialty.title)}
              </h2>

              {/* Overview Section */}
              <div className="mb-6">
                <h3 className="text-base font-black text-slate-900 mb-2">
                  {t('Overview')}
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed font-normal">
                  {t(selectedSpecialty.overview)}
                </p>
              </div>

              {/* Dynamic sections before image (e.g. Total knee replacement) */}
              {selectedSpecialty.sections ? (
                selectedSpecialty.sections.map((sec, i) => (
                  <div key={i} className="mb-6">
                    <h3 className="text-base font-black text-slate-900 mb-2">
                      {t(sec.heading)}
                    </h3>
                    <p className="text-sm text-slate-700 leading-relaxed font-normal">
                      {t(sec.text)}
                    </p>
                  </div>
                ))
              ) : (
                selectedSpecialty.restoringMobilityTitle && (
                  <div className="mb-8">
                    <h3 className="text-base font-black text-slate-900 mb-2">
                      {t(selectedSpecialty.restoringMobilityTitle)}
                    </h3>
                    <p className="text-sm text-slate-700 leading-relaxed font-normal">
                      {t(selectedSpecialty.restoringMobilityText)}
                    </p>
                  </div>
                )
              )}

              {/* Clinical Hero Photo (Operating Theatre for Knee OT, Yoga mobility for Ortho, Medical team for others) */}
              <div className="my-8 rounded-2xl overflow-hidden border border-slate-200 shadow-md">
                <img
                  src={
                    selectedSpecialty.imageType === 'knee_ot'
                      ? kneeSurgeryOtImg
                      : selectedSpecialty.imageType === 'ortho'
                      ? orthoMobilityImg
                      : medicalTeamImg
                  }
                  alt={selectedSpecialty.title}
                  className="w-full h-auto object-cover max-h-[460px]"
                />
              </div>

              {/* Dynamic sections after image (e.g. Computer-navigated knee replacement & Revision surgery) */}
              {selectedSpecialty.afterImageSections && selectedSpecialty.afterImageSections.map((sec, i) => (
                <div key={i} className="mb-6">
                  <h3 className="text-base font-black text-slate-900 mb-2">
                    {t(sec.heading)}
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed font-normal">
                    {t(sec.text)}
                  </p>
                </div>
              ))}

              {/* Accordions matching Image 3 */}
              <div className="space-y-3 mb-8">
                {selectedSpecialty.accordions.map((acc, idx) => (
                  <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                    <button
                      onClick={() => toggleAccordion(idx)}
                      className="w-full py-3.5 px-5 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-left text-sm font-bold text-[#0B2545] transition-colors cursor-pointer"
                    >
                      <span>{t(acc.title)}</span>
                      <span className={`text-slate-500 transform transition-transform ${openAccordions[idx] ? 'rotate-180' : ''}`}>
                        ▼
                      </span>
                    </button>
                    {openAccordions[idx] && (
                      <div className="p-5 text-xs text-slate-600 leading-relaxed bg-white border-t border-slate-100">
                        <p>{t(acc.content)}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => {
                    navigate(`/patient/home#doctor-directory`);
                  }}
                  className="px-6 py-3 bg-[#0B2545] hover:bg-[#133E87] text-white rounded-xl text-xs sm:text-sm font-black transition-all shadow-md uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>📅</span>
                  <span>{t('Book Doctor Appointment for')} {t(selectedInstitute.dept)}</span>
                </button>

                <button
                  onClick={handleBackToDirectory}
                  className="px-6 py-3 border-2 border-slate-300 hover:border-slate-400 text-slate-700 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer"
                >
                  {t('Explore Other Treatments')}
                </button>
              </div>
            </div>

            {/* ── RIGHT COLUMN: DARK TEXTURED SIDEBAR (IMAGES 2 & 3) ── */}
            <div className="lg:w-80 bg-[#35383D] text-slate-200 p-6 sm:p-8 shrink-0 text-left border-l border-slate-300/20">
              
              {/* Institute Title in Sidebar */}
              <h3 className="text-sm font-black text-[#EFA00B] uppercase tracking-wider mb-5 pb-2 border-b border-slate-600">
                {t(selectedInstitute.shortName)}
              </h3>

              {/* Sub-items in current institute */}
              <ul className="space-y-3.5 text-xs font-bold mb-8">
                {selectedInstitute.items.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => handleSelectSpecialty(selectedInstitute, item)}
                      className={`flex items-start gap-2 text-left cursor-pointer transition-colors ${
                        item.id === selectedSpecialty.id
                          ? 'text-[#EFA00B] font-extrabold'
                          : 'text-slate-300 hover:text-amber-300 font-semibold'
                      }`}
                    >
                      <span>—</span>
                      <span>{t(item.title)}</span>
                    </button>
                  </li>
                ))}
              </ul>

              {/* Related Quick Links Cards (matching Image 2 & 3) */}
              <div className="pt-6 border-t border-slate-600/60 space-y-3">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-2">
                  {t('Other Institutes of Excellence')}
                </span>

                {/* Institute 2: Cardiac Care */}
                <button
                  onClick={() => handleSelectSpecialty(INSTITUTES_DATA[1], INSTITUTES_DATA[1].items[0])}
                  className="w-full p-3 rounded-xl bg-[#881337] hover:bg-[#9F1239] text-white text-xs font-bold flex items-center gap-3 transition-colors text-left cursor-pointer"
                >
                  <span className="text-lg">❤️</span>
                  <span className="leading-tight">{t('MIOT Institute of Cardiac Care')}</span>
                </button>

                {/* Institute 4: Nephrology */}
                <button
                  onClick={() => handleSelectSpecialty(INSTITUTES_DATA[3], INSTITUTES_DATA[3].items[0])}
                  className="w-full p-3 rounded-xl bg-[#0E7490] hover:bg-[#0891B2] text-white text-xs font-bold flex items-center gap-3 transition-colors text-left cursor-pointer"
                >
                  <span className="text-lg">🧪</span>
                  <span className="leading-tight">{t('MIOT Institute of Nephrology')}</span>
                </button>

                {/* Institute 5: Cancer Cure */}
                <button
                  onClick={() => handleSelectSpecialty(INSTITUTES_DATA[4], INSTITUTES_DATA[4].items[0])}
                  className="w-full p-3 rounded-xl bg-[#15803D] hover:bg-[#16A34A] text-white text-xs font-bold flex items-center gap-3 transition-colors text-left cursor-pointer"
                >
                  <span className="text-lg">🎗️</span>
                  <span className="leading-tight">{t('MIOT Institute of Cancer Cure')}</span>
                </button>

                {/* Institute 3: GI & Liver */}
                <button
                  onClick={() => handleSelectSpecialty(INSTITUTES_DATA[2], INSTITUTES_DATA[2].items[0])}
                  className="w-full p-3 rounded-xl bg-[#0369A1] hover:bg-[#0284C7] text-white text-xs font-bold flex items-center gap-3 transition-colors text-left cursor-pointer"
                >
                  <span className="text-lg">🔬</span>
                  <span className="leading-tight">{t('MIOT Advanced Centre for Gastrointestinal and Liver Diseases')}</span>
                </button>

                {/* Key Specialties Card */}
                <button
                  onClick={() => {
                    handleBackToDirectory();
                    setActiveMainTab('key-specialties');
                  }}
                  className="w-full p-3 rounded-xl bg-[#EFA00B] hover:bg-[#D99008] text-slate-900 text-xs font-black flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span>{t('Key Specialities')}</span>
                  <span className="text-base font-black">+</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          4. BLUE QUICK LINKS BAR & 3-COLUMN FOOTER
      ══════════════════════════════════════════════════════════════ */}
      <div className="bg-[#2157A2] text-white py-2.5 px-6 sm:px-16 flex items-center justify-between text-xs font-black uppercase tracking-wider">
        <button
          onClick={() => setQuickLinksOpen(!quickLinksOpen)}
          className="flex items-center gap-2 hover:text-amber-200 transition-colors cursor-pointer"
        >
          <span>{quickLinksOpen ? t('HIDE QUICK LINKS —') : t('SHOW QUICK LINKS +')}</span>
        </button>
      </div>

      {quickLinksOpen && (
        <footer className="bg-slate-50 border-b border-slate-200 py-10 px-6 sm:px-16 text-left">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 mb-3 pb-1 border-b border-slate-200">
                {t('PRIMARY CONTACT')}
              </h4>
              <p className="text-xs font-semibold text-slate-600">
                {t('Phone:')} <a href="tel:+914442002288" className="font-bold text-slate-800 hover:underline">+91 44 42002288</a>
              </p>
              <p className="text-xs font-semibold text-slate-600 mt-1">
                {t('Emergency:')} <a href="tel:105710" className="font-bold text-red-600 hover:underline">10 57 10</a>
              </p>
            </div>

            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 mb-3 pb-1 border-b border-slate-200">
                {t('ADDRESS')}
              </h4>
              <p className="text-xs font-bold text-slate-800">MIOT International</p>
              <p className="text-xs text-slate-600 mt-0.5">4/112, Mount Poonamallee Road,</p>
              <p className="text-xs text-slate-600">Manapakkam, Chennai - 600 089</p>
              <p className="text-xs text-slate-600">Tamil Nadu, India</p>
            </div>

            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 mb-3 pb-1 border-b border-slate-200">
                {t('LINKS')}
              </h4>
              <ul className="space-y-1.5 text-xs text-blue-700 font-semibold">
                <li><Link to="/contact" className="hover:underline">{t('Location')}</Link></li>
                <li><Link to="/patient/home#facilities" className="hover:underline">{t('International Patient Care')}</Link></li>
                <li><Link to="/patient/home#about" className="hover:underline">{t('Visiting Hours')}</Link></li>
                <li><Link to="/connect-miot" className="hover:underline">{t('About MIOT')}</Link></li>
              </ul>
            </div>
          </div>
        </footer>
      )}

      {/* Social & Copyright bottom */}
      <div className="bg-white py-6 border-t border-slate-100 text-center text-xs text-slate-500">
        <p className="font-bold text-slate-700 mb-2">{t('Follow us on')}</p>
        <div className="flex items-center justify-center gap-3 mb-3">
          <span className="w-7 h-7 rounded-full bg-slate-100 hover:bg-blue-600 hover:text-white flex items-center justify-center cursor-pointer transition-colors font-bold text-xs">f</span>
          <span className="w-7 h-7 rounded-full bg-slate-100 hover:bg-pink-600 hover:text-white flex items-center justify-center cursor-pointer transition-colors font-bold text-xs">📸</span>
          <span className="w-7 h-7 rounded-full bg-slate-100 hover:bg-blue-700 hover:text-white flex items-center justify-center cursor-pointer transition-colors font-bold text-xs">in</span>
          <span className="w-7 h-7 rounded-full bg-slate-100 hover:bg-red-600 hover:text-white flex items-center justify-center cursor-pointer transition-colors font-bold text-xs">▶</span>
        </div>
        <p>© {new Date().getFullYear()} MIOT International. {t('All Rights Reserved.')}</p>
      </div>
    </div>
  );
}
