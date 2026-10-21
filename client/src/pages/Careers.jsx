import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import LanguageSelector from '../components/LanguageSelector';
import MiotMegaMenu from '../components/MiotMegaMenu';
import careersImg from '../assets/miot_careers_team.jpg';

export default function Careers() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('working'); // 'working', 'positions', 'apply'
  const [activeMegaMenu, setActiveMegaMenu] = useState(null);

  const toggleMegaMenu = (menuKey) => {
    setActiveMegaMenu((prev) => (prev === menuKey ? null : menuKey));
  };
  const [openAccordion1, setOpenAccordion1] = useState(false);
  const [openAccordion2, setOpenAccordion2] = useState(false);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [quickLinksOpen, setQuickLinksOpen] = useState(true);

  const [applyForm, setApplyForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    roleApplied: 'Staff Nurse / Clinical Care',
    qualification: '',
    experience: '1-3 years',
    message: ''
  });
  const [applySuccess, setApplySuccess] = useState(false);

  const handleApplySubmit = (e) => {
    e.preventDefault();
    setApplySuccess(true);
    setTimeout(() => {
      setApplySuccess(false);
      setApplyModalOpen(false);
      setApplyForm({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        roleApplied: 'Staff Nurse / Clinical Care',
        qualification: '',
        experience: '1-3 years',
        message: ''
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-slate-800">
      
      {/* ══════════════════════════════════════════════════════════════
          1. OFFICIAL MIOT HEADER (IMAGE 1 HEADER WITH CAREERS ACTIVE)
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

          {/* Right: 3 Stacked Color Action Blocks (CAREERS ACTIVE) */}
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
                className="bg-[#1F54B0] ring-2 ring-blue-300 py-1.5 px-3 flex items-center gap-1.5 transition-colors font-extrabold"
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
          2. MAIN BODY: 3-COLUMN LAYOUT (IMAGE 1 CAREERS)
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

          {/* ── CENTER COLUMN: WORKING AT MIOT ── */}
          <div className="flex-1 p-6 sm:p-12 text-left bg-white">
            
            <h1 className="text-2xl sm:text-3xl font-black text-[#0B2545] tracking-tight mb-4">
              {t('Working at MIOT')}
            </h1>

            <p className="text-sm text-slate-700 leading-relaxed font-normal mb-8 max-w-3xl">
              {t("When you work at MIOT International, you can rest assured that you are making a difference. Our commitment to our patients, their comfort and their care is paramount. You'll find a work culture that values team work, respect for each other and the people who seek our care, and professionalism.")}
            </p>

            {/* Careers Team Photo (Matching Image 1) */}
            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm mb-8 max-w-3xl">
              <img
                src={careersImg}
                alt="Working at MIOT International"
                className="w-full h-auto object-cover max-h-[460px]"
              />
            </div>

            {/* Expandable Accordion 1: A Vibrant, Dynamic Work Environment */}
            <div className="border border-slate-200 rounded-xl mb-3 overflow-hidden shadow-2xs max-w-3xl">
              <button
                onClick={() => setOpenAccordion1(!openAccordion1)}
                className="w-full py-3.5 px-5 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-left text-sm font-bold text-[#0B2545] transition-colors"
              >
                <span>{t('A Vibrant, Dynamic Work Environment')}</span>
                <span className={`text-slate-500 transform transition-transform ${openAccordion1 ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
              {openAccordion1 && (
                <div className="p-5 text-xs text-slate-600 leading-relaxed bg-white border-t border-slate-100 space-y-2">
                  <p>
                    {t('At MIOT International, every team member contributes to our legacy of healing. We provide cutting-edge infrastructure, continuous medical training, advanced simulation labs, and a multi-disciplinary atmosphere where doctors, nurses, paramedics, and administrators work together with respect and dedication.')}
                  </p>
                  <ul className="list-disc pl-5 space-y-1 font-medium text-slate-700 mt-2">
                    <li>{t('Global Quaternary Care Exposure across 63 Specialities')}</li>
                    <li>{t('Advanced Surgical Theatres & Robotic Technologies')}</li>
                    <li>{t('Continuing Medical Education (CME) and Skill Development')}</li>
                    <li>{t('Equal opportunity, merit-driven professional growth')}</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Expandable Accordion 2: Would you like to join the MIOT Family? */}
            <div className="border border-slate-200 rounded-xl mb-8 overflow-hidden shadow-2xs max-w-3xl">
              <button
                onClick={() => setOpenAccordion2(!openAccordion2)}
                className="w-full py-3.5 px-5 bg-slate-50 hover:bg-slate-100 flex items-center justify-between text-left text-sm font-bold text-[#0B2545] transition-colors"
              >
                <span>{t('Would you like to join the MIOT Family?')}</span>
                <span className={`text-slate-500 transform transition-transform ${openAccordion2 ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
              {openAccordion2 && (
                <div className="p-5 text-xs text-slate-600 leading-relaxed bg-white border-t border-slate-100">
                  <p className="mb-3">
                    {t('We are always searching for compassionate, skilled healthcare professionals and administrative specialists. Browse our current vacancies or apply directly to our HR desk.')}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => setApplyModalOpen(true)}
                      className="px-4 py-2 bg-[#0B2545] hover:bg-[#133E87] text-white rounded-lg font-bold text-xs shadow-xs"
                    >
                      {t('Apply Now')} →
                    </button>
                    <a
                      href="mailto:careers@miotinternational.com"
                      className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg font-bold text-xs"
                    >
                      Email: careers@miotinternational.com
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Action Button */}
            <div className="max-w-3xl pt-4 border-t border-slate-100">
              <button
                onClick={() => setApplyModalOpen(true)}
                className="px-6 py-3 border-2 border-[#1F54B0] text-[#1F54B0] hover:bg-[#1F54B0] hover:text-white rounded-xl text-xs sm:text-sm font-black transition-all shadow-xs uppercase tracking-wider cursor-pointer"
              >
                {t('Apply for Open Positions at MIOT')}
              </button>
            </div>
          </div>

          {/* ── RIGHT COLUMN: DARK TEXTURED SIDEBAR ── */}
          <div className="lg:w-80 bg-[#35383D] text-slate-200 p-6 sm:p-8 shrink-0 text-left border-l border-slate-300/20">
            <h3 className="text-base font-black text-[#EFA00B] uppercase tracking-wider mb-6 pb-2 border-b border-slate-600">
              {t('Careers')}
            </h3>

            <ul className="space-y-4 text-xs font-bold">
              <li>
                <button
                  onClick={() => setActiveTab('working')}
                  className="text-[#EFA00B] flex items-center gap-2 cursor-pointer font-extrabold"
                >
                  <span>—</span>
                  <span>{t('Working at MIOT')}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setOpenAccordion2(true);
                    setApplyModalOpen(true);
                  }}
                  className="hover:text-amber-300 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <span>—</span>
                  <span>{t('Open Positions')}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setApplyModalOpen(true)}
                  className="hover:text-amber-300 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <span>—</span>
                  <span>{t('Apply Now')}</span>
                </button>
              </li>
            </ul>

            <div className="mt-12 p-4 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-300">
              <p className="font-bold text-amber-400 mb-1">{t('HR Recruitment Desk')}</p>
              <p className="text-[11px] leading-relaxed text-slate-400">
                MIOT International, Manapakkam, Chennai - 600089.
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Email: <span className="text-white font-semibold">careers@miotinternational.com</span>
              </p>
              <p className="text-[11px] text-slate-400">
                Tel: <span className="text-white font-semibold">+91 44 42002288</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          3. BLUE QUICK LINKS BAR & FOOTER
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

      {/* ══════════════════════════════════════════════════════════════
          4. CAREERS APPLICATION MODAL
      ══════════════════════════════════════════════════════════════ */}
      {applyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200">
            <button
              onClick={() => setApplyModalOpen(false)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm cursor-pointer"
            >
              ✕
            </button>

            <h3 className="text-xl font-black text-[#0B2545] mb-1 text-left">
              {t('Apply at MIOT International')}
            </h3>
            <p className="text-xs text-slate-500 font-medium mb-4 text-left">
              {t('Join our prestigious quaternary healthcare family.')}
            </p>

            {applySuccess ? (
              <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center text-emerald-800">
                <span className="text-3xl">✓</span>
                <h4 className="font-bold text-sm mt-2">{t('Application Received Successfully!')}</h4>
                <p className="text-xs text-emerald-700 mt-1">{t('Our HR Recruitment team will contact you.')}</p>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="space-y-3 text-left">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">{t('Full Name')}</label>
                  <input
                    type="text"
                    required
                    value={applyForm.name}
                    onChange={(e) => setApplyForm({ ...applyForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-600"
                    placeholder="Your full name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">{t('Email')}</label>
                    <input
                      type="email"
                      required
                      value={applyForm.email}
                      onChange={(e) => setApplyForm({ ...applyForm, email: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-600"
                      placeholder="Email address"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">{t('Phone Number')}</label>
                    <input
                      type="tel"
                      required
                      value={applyForm.phone}
                      onChange={(e) => setApplyForm({ ...applyForm, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-600"
                      placeholder="Phone number"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">{t('Role Applied For')}</label>
                  <select
                    value={applyForm.roleApplied}
                    onChange={(e) => setApplyForm({ ...applyForm, roleApplied: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 bg-white focus:outline-none"
                  >
                    <option value="Staff Nurse / Clinical Care">Staff Nurse / Clinical Care</option>
                    <option value="Resident Medical Officer (RMO)">Resident Medical Officer (RMO)</option>
                    <option value="Senior Consultant / Specialist">Senior Consultant / Specialist</option>
                    <option value="Pharmacist / Pharmacy Executive">Pharmacist / Pharmacy Executive</option>
                    <option value="Radiographer / Imaging Technologist">Radiographer / Imaging Technologist</option>
                    <option value="Hospital Administration / Patient Relations">Hospital Administration / Patient Relations</option>
                    <option value="Biomedical Engineer">Biomedical Engineer</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">{t('Qualification / Degree')}</label>
                  <input
                    type="text"
                    required
                    value={applyForm.qualification}
                    onChange={(e) => setApplyForm({ ...applyForm, qualification: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-600"
                    placeholder="e.g. B.Sc Nursing, MBBS, MD, MHA"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">{t('Brief Note / Experience')}</label>
                  <textarea
                    rows="2"
                    value={applyForm.message}
                    onChange={(e) => setApplyForm({ ...applyForm, message: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-blue-600"
                    placeholder="Summarize your experience & why you wish to join MIOT..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#1F54B0] hover:bg-[#163E85] text-white text-xs font-black rounded-xl shadow-md transition-all uppercase tracking-wider"
                >
                  {t('Submit Application')}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
