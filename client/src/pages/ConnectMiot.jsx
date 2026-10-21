import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import LanguageSelector from '../components/LanguageSelector';
import MiotMegaMenu from '../components/MiotMegaMenu';
import hospitalBannerImg from '../assets/miot_hospital_banner.jpg';
import medicalTeamImg from '../assets/miot_medical_team.jpg';

export default function ConnectMiot() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState('about');
  const [activeMegaMenu, setActiveMegaMenu] = useState(null);

  const toggleMegaMenu = (menuKey) => {
    setActiveMegaMenu((prev) => (prev === menuKey ? null : menuKey));
  };
  const [corporateOpen, setCorporateOpen] = useState(true);
  const [whatsNewOpen, setWhatsNewOpen] = useState(true);
  const [quickLinksOpen, setQuickLinksOpen] = useState(true);

  // Accordions below the team photo (Image 4)
  const [focusOpen, setFocusOpen] = useState(false);
  const [todayOpen, setTodayOpen] = useState(false);
  const [innovationOpen, setInnovationOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-slate-800">
      
      {/* ══════════════════════════════════════════════════════════════
          1. OFFICIAL MIOT HEADER (IMAGE 2 HEADER WITH CONNECT MIOT ACTIVE)
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

          {/* Right: 3 Stacked Color Action Blocks (CONNECT MIOT ACTIVE) */}
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
                className="bg-[#D81E5B] ring-2 ring-pink-300 py-1.5 px-3 flex items-center gap-1.5 transition-colors font-extrabold"
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

        {/* Secondary Menu Bar */}
        <div className="bg-slate-50/80 border-t border-slate-200/80 relative z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
            <nav className="flex items-center gap-2 sm:gap-5 md:gap-7 text-xs font-black uppercase tracking-tight overflow-x-auto py-2.5 scrollbar-none">
              <Link to="/patient/home" className="text-blue-800 hover:text-blue-950 transition-colors p-1 shrink-0" title="Home">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                </svg>
              </Link>
              <Link to="/specialities-treatments" className="text-slate-700 hover:text-[#D81E5B] transition-colors whitespace-nowrap shrink-0">
                {t('SPECIALITIES & TREATMENTS')}
              </Link>
              <button onClick={() => toggleMegaMenu('facilities')} className={`transition-colors whitespace-nowrap shrink-0 font-black cursor-pointer ${activeMegaMenu === 'facilities' ? 'text-[#D81E5B] border-b-2 border-[#D81E5B] pb-0.5' : 'text-slate-700 hover:text-[#D81E5B]'}`}>
                {t('FACILITIES & RESOURCES')}
              </button>
              <button onClick={() => toggleMegaMenu('programmes')} className={`transition-colors whitespace-nowrap shrink-0 font-black cursor-pointer hidden lg:inline ${activeMegaMenu === 'programmes' ? 'text-[#D81E5B] border-b-2 border-[#D81E5B] pb-0.5' : 'text-slate-700 hover:text-[#D81E5B]'}`}>
                {t('PROGRAMMES & EDUCATION')}
              </button>
              <button onClick={() => toggleMegaMenu('patients')} className={`transition-colors whitespace-nowrap shrink-0 font-black cursor-pointer hidden md:inline ${activeMegaMenu === 'patients' ? 'text-[#D81E5B] border-b-2 border-[#D81E5B] pb-0.5' : 'text-slate-700 hover:text-[#D81E5B]'}`}>
                {t('PATIENTS & VISITORS')}
              </button>
              <button onClick={() => toggleMegaMenu('global')} className={`transition-colors whitespace-nowrap shrink-0 font-black cursor-pointer hidden xl:inline ${activeMegaMenu === 'global' ? 'text-[#D81E5B] border-b-2 border-[#D81E5B] pb-0.5' : 'text-slate-700 hover:text-[#D81E5B]'}`}>
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

          {activeMegaMenu && (
            <div className="absolute left-0 right-0 top-full z-50 shadow-2xl border-t border-slate-200">
              <MiotMegaMenu activeMenuKey={activeMegaMenu} isOverlay={true} onClose={() => setActiveMegaMenu(null)} />
            </div>
          )}
        </div>
      </header>

      {activeMegaMenu && (
        <div className="fixed inset-0 z-30" onClick={() => setActiveMegaMenu(null)} />
      )}

      {/* ══════════════════════════════════════════════════════════════
          2. TOP BANNER: CORPORATE (IMAGE 2)
      ══════════════════════════════════════════════════════════════ */}
      <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-900">
        <img
          src={hospitalBannerImg}
          alt="MIOT International Corporate"
          className="w-full h-full object-cover object-center filter brightness-90"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent flex flex-col justify-center px-6 sm:px-16">
          <div className="max-w-7xl mx-auto w-full text-left">
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              {t('Corporate')}
            </h1>
          </div>
        </div>

        {/* Breadcrumb strip */}
        <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-xs py-2 px-6 sm:px-16 text-left">
          <div className="max-w-7xl mx-auto text-xs text-amber-400 font-bold flex items-center gap-2">
            <Link to="/patient/home" className="hover:underline">{t('Home')}</Link>
            <span>/</span>
            <span className="text-white">{t('Corporate')}</span>
            <span>/</span>
            <span className="text-amber-300">{t('About MIOT')}</span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          3. MAIN CONTENT: 3-COLUMN LAYOUT (IMAGES 2, 3, 4)
      ══════════════════════════════════════════════════════════════ */}
      <div className="flex-1 w-full bg-white">
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

          {/* ── CENTER COLUMN: ABOUT MIOT (SCROLL DOWN VIEW) ── */}
          <div className="flex-1 p-6 sm:p-12 text-left bg-white">
            
            <h2 className="text-2xl sm:text-3xl font-black text-[#0B2545] tracking-tight mb-6">
              {t('About MIOT')}
            </h2>

            {/* Quote Block (Image 2) */}
            <div className="relative my-6 p-6 sm:p-8 bg-slate-50/80 rounded-2xl border-l-4 border-[#0B2545]">
              <span className="text-5xl sm:text-6xl text-slate-300 font-serif leading-none absolute -top-4 left-3 select-none">
                “
              </span>
              <p className="italic text-base sm:text-lg font-serif font-bold text-slate-800 leading-relaxed pl-6">
                {t('“Medicine is not a trade; it is a calling where the physician thinks not only with his head, but also with his heart.” – Padmashri Prof. Dr. P. V. A. Mohandas')}
              </p>
              <span className="text-5xl sm:text-6xl text-slate-300 font-serif leading-none absolute -bottom-8 right-6 select-none">
                ”
              </span>
            </div>

            {/* Early days (Images 2 & 3) */}
            <div className="mt-8 space-y-4 text-sm text-slate-700 leading-relaxed font-normal">
              <h3 className="text-lg font-black text-slate-900 mb-2">
                {t('Early days')}
              </h3>

              <p>
                {t('Padmashri Prof. Dr. P. V. A. Mohandas started the Madras Institute of Orthopaedics and Traumatology (M.I.O.T) on 12 February, 1999, as a 70-bed hospital, with full-time doctors, focussed primarily on Orthopaedics and Trauma Care. It was soon apparent that some of the trauma patients, often brought there in a critical condition, came with pre-existing conditions involving the heart, kidneys, etc. In order to stabilise and deliver complete end-to-end care to these patients, these pre existing conditions had to be managed along with providing trauma care.')}
              </p>

              <p>
                {t('In other cases, patients were brought in with injuries to their organs. Treating such conditions called for the expertise of specialists. Given the nature of trauma care, it was important to have full-time specialists so that the right care could be delivered on time.')}
              </p>

              <p className="font-semibold text-[#0B2545]">
                {t('Thus MIOT Hospitals / International came to be.')}
              </p>

              <p>
                {t('With the addition of more specialities to address key health areas, and investment in the latest medical technology and the best talent, we are, today, able to deliver collaborative, multi-speciality care.')}
              </p>
            </div>

            {/* ── TEAM PHOTO WITH TRICOLOR BORDER (IMAGES 3 & 4) ── */}
            <div className="mt-8 mb-8 rounded-2xl overflow-hidden border border-slate-200 shadow-md">
              {/* Top Tricolor Strip */}
              <div className="flex h-3 w-full">
                <div className="w-1/3 bg-[#D81E5B]"></div>
                <div className="w-1/3 bg-[#EFA00B]"></div>
                <div className="w-1/3 bg-[#133E87]"></div>
              </div>

              {/* Group Team Photo */}
              <img
                src={medicalTeamImg}
                alt="MIOT International Medical Team"
                className="w-full h-auto object-cover max-h-[500px]"
              />

              {/* Bottom Tricolor Strip */}
              <div className="flex h-3 w-full">
                <div className="w-1/3 bg-[#D81E5B]"></div>
                <div className="w-1/3 bg-[#EFA00B]"></div>
                <div className="w-1/3 bg-[#133E87]"></div>
              </div>
            </div>

            {/* ── ACCORDIONS BELOW PHOTO (IMAGE 4) ── */}
            <div className="space-y-3 mb-8">
              
              {/* Accordion 1: Our focus */}
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                <button
                  onClick={() => setFocusOpen(!focusOpen)}
                  className="w-full py-3.5 px-5 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-left text-sm font-bold text-[#0B2545] transition-colors"
                >
                  <span>{t('Our focus')}</span>
                  <span className={`text-slate-500 transform transition-transform ${focusOpen ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>
                {focusOpen && (
                  <div className="p-5 text-xs text-slate-600 leading-relaxed bg-white border-t border-slate-100 space-y-2">
                    <p>
                      {t('To provide quaternary-level clinical excellence, patient-centric compassion, and ethically grounded medical treatment to patients from across India and over 130 countries worldwide.')}
                    </p>
                    <p>
                      {t('MIOT puts patients first in every protocol, ensuring 24x7 readiness for complex emergency trauma, heart attacks, and acute multi-organ crises.')}
                    </p>
                  </div>
                )}
              </div>

              {/* Accordion 2: MIOT International today */}
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                <button
                  onClick={() => setTodayOpen(!todayOpen)}
                  className="w-full py-3.5 px-5 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-left text-sm font-bold text-[#0B2545] transition-colors"
                >
                  <span>{t('MIOT International today')}</span>
                  <span className={`text-slate-500 transform transition-transform ${todayOpen ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>
                {todayOpen && (
                  <div className="p-5 text-xs text-slate-600 leading-relaxed bg-white border-t border-slate-100 space-y-2">
                    <p>
                      {t('Today, MIOT is a 1000-bed hospital with 63 specialities, state-of-the-art diagnostic labs, modular laminar air-flow operating suites, robotic surgical systems, and recognized centers of excellence in Orthopaedics, Cardiology, Oncology, Nephrology, and Gastroenterology.')}
                    </p>
                    <p>
                      {t('Over 300 full-time consultants and 1,200 trained nursing and paramedical professionals ensure 24/7 round-the-clock quaternary clinical care.')}
                    </p>
                  </div>
                )}
              </div>

              {/* Accordion 3: Embracing innovation */}
              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                <button
                  onClick={() => setInnovationOpen(!innovationOpen)}
                  className="w-full py-3.5 px-5 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-left text-sm font-bold text-[#0B2545] transition-colors"
                >
                  <span>{t('Embracing innovation')}</span>
                  <span className={`text-slate-500 transform transition-transform ${innovationOpen ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>
                {innovationOpen && (
                  <div className="p-5 text-xs text-slate-600 leading-relaxed bg-white border-t border-slate-100 space-y-2">
                    <p>
                      {t("From introducing India's first computerized navigation joint replacement surgery to cutting-edge Bone Marrow Transplants and minimally invasive pin-hole interventions, MIOT continues to redefine modern healthcare.")}
                    </p>
                    <p>
                      {t('MIOT remains at the forefront of medical research, international clinical trials, and robotic surgical advances.')}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Interactive Navigation to Doctor Booking Portal */}
            <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center gap-4">
              <Link
                to="/patient/home#doctor-directory"
                className="px-6 py-3 bg-[#0B2545] hover:bg-[#133E87] text-white rounded-xl text-xs sm:text-sm font-black transition-all shadow-md uppercase tracking-wider inline-flex items-center gap-2"
              >
                <span>📅</span>
                <span>{t('Book Doctor Appointment at MIOT')}</span>
              </Link>
              <Link
                to="/contact"
                className="px-6 py-3 border-2 border-[#EFA00B] text-[#D98200] hover:bg-[#EFA00B] hover:text-white rounded-xl text-xs sm:text-sm font-black transition-all shadow-xs uppercase tracking-wider inline-flex items-center gap-2"
              >
                <span>📍</span>
                <span>{t('Contact Hospital')}</span>
              </Link>
            </div>
          </div>

          {/* ── RIGHT COLUMN: DARK TEXTURED SIDEBAR (IMAGES 2, 3, 4) ── */}
          <div className="lg:w-80 bg-[#35383D] text-slate-200 p-6 sm:p-8 shrink-0 text-left border-l border-slate-300/20">
            <h3 className="text-base font-black text-[#EFA00B] uppercase tracking-wider mb-4 pb-2 border-b border-slate-600">
              {t('Connect MIOT')}
            </h3>

            {/* + Corporate section */}
            <div className="mb-6">
              <button
                onClick={() => setCorporateOpen(!corporateOpen)}
                className="flex items-center gap-1.5 text-xs font-black text-amber-400 uppercase tracking-wider mb-3 hover:text-amber-300 cursor-pointer"
              >
                <span>{corporateOpen ? '−' : '+'}</span>
                <span>{t('Corporate')}</span>
              </button>

              {corporateOpen && (
                <ul className="space-y-2.5 text-xs font-bold pl-2 border-l border-slate-600/50">
                  <li>
                    <span className="text-[#EFA00B] flex items-center gap-2">
                      <span>—</span>
                      <span>{t('About MIOT')}</span>
                    </span>
                  </li>
                  <li>
                    <button onClick={() => setFocusOpen(true)} className="hover:text-amber-300 transition-colors flex items-center gap-2 text-slate-300">
                      <span>—</span>
                      <span>{t('Mission, Vision and Values')}</span>
                    </button>
                  </li>
                  <li>
                    <Link to="/patient/home#about" className="hover:text-amber-300 transition-colors flex items-center gap-2 text-slate-300">
                      <span>—</span>
                      <span>{t('Hospital Leadership')}</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/patient/home#about" className="hover:text-amber-300 transition-colors flex items-center gap-2 text-slate-300">
                      <span>—</span>
                      <span>{t("Founder's Message")}</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/patient/home#about" className="hover:text-amber-300 transition-colors flex items-center gap-2 text-slate-300">
                      <span>—</span>
                      <span>{t('About Chairman')}</span>
                    </Link>
                  </li>
                  <li>
                    <button onClick={() => setTodayOpen(true)} className="hover:text-amber-300 transition-colors flex items-center gap-2 text-slate-300">
                      <span>—</span>
                      <span>{t('Our Journey')}</span>
                    </button>
                  </li>
                  <li>
                    <button onClick={() => setInnovationOpen(true)} className="hover:text-amber-300 transition-colors flex items-center gap-2 text-slate-300">
                      <span>—</span>
                      <span>{t('Our Initiatives')}</span>
                    </button>
                  </li>
                  <li>
                    <span className="hover:text-amber-300 transition-colors flex items-center gap-2 text-slate-300 cursor-pointer">
                      <span>—</span>
                      <span>{t('Our Logo')}</span>
                    </span>
                  </li>
                  <li>
                    <button onClick={() => setFocusOpen(true)} className="hover:text-amber-300 transition-colors flex items-center gap-2 text-slate-300">
                      <span>—</span>
                      <span>{t('Our Approach')}</span>
                    </button>
                  </li>
                  <li>
                    <button onClick={() => setTodayOpen(true)} className="hover:text-amber-300 transition-colors flex items-center gap-2 text-slate-300">
                      <span>—</span>
                      <span>{t('MIOT DNA')}</span>
                    </button>
                  </li>
                  <li>
                    <span className="hover:text-amber-300 transition-colors flex items-center gap-2 text-slate-300 cursor-pointer">
                      <span>—</span>
                      <span>{t('Patient Safety & Quality')}</span>
                    </span>
                  </li>
                  <li>
                    <span className="hover:text-amber-300 transition-colors flex items-center gap-2 text-slate-300 cursor-pointer">
                      <span>—</span>
                      <span>{t('Awards & Recognition')}</span>
                    </span>
                  </li>
                  <li>
                    <span className="hover:text-amber-300 transition-colors flex items-center gap-2 text-slate-300 cursor-pointer">
                      <span>—</span>
                      <span>{t('Empanelment')}</span>
                    </span>
                  </li>
                  <li>
                    <span className="hover:text-amber-300 transition-colors flex items-center gap-2 text-slate-300 cursor-pointer">
                      <span>—</span>
                      <span>{t('Collaborations & Joint Venture')}</span>
                    </span>
                  </li>
                  <li>
                    <span className="hover:text-amber-300 transition-colors flex items-center gap-2 text-slate-300 cursor-pointer">
                      <span>—</span>
                      <span>{t('Accreditations')}</span>
                    </span>
                  </li>
                </ul>
              )}
            </div>

            {/* + What's New section */}
            <div className="pt-4 border-t border-slate-600/50">
              <button
                onClick={() => setWhatsNewOpen(!whatsNewOpen)}
                className="flex items-center gap-1.5 text-xs font-black text-amber-400 uppercase tracking-wider mb-3 hover:text-amber-300 cursor-pointer"
              >
                <span>{whatsNewOpen ? '−' : '+'}</span>
                <span>{t("What's New")}</span>
              </button>

              {whatsNewOpen && (
                <ul className="space-y-2.5 text-xs font-bold pl-2 border-l border-slate-600/50">
                  <li>
                    <span className="hover:text-amber-300 transition-colors flex items-center gap-2 text-slate-300 cursor-pointer">
                      <span>—</span>
                      <span>{t('Upcoming events at MIOT')}</span>
                    </span>
                  </li>
                  <li>
                    <span className="hover:text-amber-300 transition-colors flex items-center gap-2 text-slate-300 cursor-pointer">
                      <span>—</span>
                      <span>{t('Past events at MIOT')}</span>
                    </span>
                  </li>
                  <li>
                    <span className="hover:text-amber-300 transition-colors flex items-center gap-2 text-slate-300 cursor-pointer">
                      <span>—</span>
                      <span>{t('In The Press')}</span>
                    </span>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

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
                <li><Link to="/contact" className="hover:underline">{t('Contact Us')}</Link></li>
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
