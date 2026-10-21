import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import LanguageSelector from '../components/LanguageSelector';
import MiotMegaMenu from '../components/MiotMegaMenu';
import hospitalBannerImg from '../assets/miot_hospital_banner.jpg';

export default function ContactUs() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [quickLinksOpen, setQuickLinksOpen] = useState(true);
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState(null);

  const toggleMegaMenu = (menuKey) => {
    setActiveMegaMenu((prev) => (prev === menuKey ? null : menuKey));
  };
  const [enquiryData, setEnquiryData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    department: 'General Medicine',
    message: ''
  });
  const [enquirySuccess, setEnquirySuccess] = useState(false);

  const handleEnquirySubmit = (e) => {
    e.preventDefault();
    setEnquirySuccess(true);
    setTimeout(() => {
      setEnquirySuccess(false);
      setEnquiryModalOpen(false);
      setEnquiryData({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        department: 'General Medicine',
        message: ''
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-slate-800">
      
      {/* ══════════════════════════════════════════════════════════════
          1. OFFICIAL MIOT HEADER (IMAGE 1 HEADER)
      ══════════════════════════════════════════════════════════════ */}
      <header className="bg-white border-b border-slate-200 shadow-xs sticky top-0 z-50">
        
        {/* Top Brand & Emergency Strip */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
          
          {/* Authentic MIOT International Logo */}
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
            {/* 24/7 MIOT Emergency Care Box */}
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

            {/* illam varum namma miot Box */}
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
                className="bg-[#EFA00B] ring-2 ring-amber-300 py-1.5 px-3 flex items-center gap-1.5 transition-colors font-extrabold"
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
          2. TOP BANNER: CONTACT US (IMAGE 1)
      ══════════════════════════════════════════════════════════════ */}
      <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-900">
        <img
          src={hospitalBannerImg}
          alt="MIOT International Hospital"
          className="w-full h-full object-cover object-center filter brightness-90"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent flex flex-col justify-center px-6 sm:px-16">
          <div className="max-w-7xl mx-auto w-full text-left">
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              {t('Contact Us')}
            </h1>
          </div>
        </div>

        {/* Breadcrumb strip */}
        <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-xs py-2 px-6 sm:px-16 text-left">
          <div className="max-w-7xl mx-auto text-xs text-amber-400 font-bold flex items-center gap-2">
            <Link to="/patient/home" className="hover:underline">{t('Home')}</Link>
            <span>/</span>
            <span className="text-white">{t('Contact Us')}</span>
            <span>/</span>
            <span className="text-amber-300">{t('Get in touch')}</span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          3. MAIN CONTENT: 3-COLUMN LAYOUT (IMAGES 1 & 2)
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

          {/* ── CENTER COLUMN: GET IN TOUCH & INTERACTIVE MAP ── */}
          <div className="flex-1 p-6 sm:p-12 text-left bg-white">
            
            <h2 className="text-2xl sm:text-3xl font-black text-[#0B2545] tracking-tight mb-6">
              {t('Get in touch')}
            </h2>

            {/* Address */}
            <div className="space-y-1 text-sm font-semibold text-slate-700 mb-6">
              <h3 className="text-base font-black text-slate-900 mb-2">{t('Address:')}</h3>
              <p className="font-bold text-[#0B2545] text-base">MIOT International</p>
              <p>4/112, Mount Poonamallee Road,</p>
              <p>Manapakkam, Chennai - 600 089</p>
              <p>Tamil Nadu, INDIA</p>
            </div>

            {/* Contact Details */}
            <div className="space-y-2 text-sm font-semibold text-slate-700 mb-8 pt-4 border-t border-slate-100">
              <p>
                <strong className="text-slate-900">{t('Email:')}</strong>{' '}
                <a href="mailto:hlp@miotinternational.com" className="text-blue-700 hover:underline">
                  hlp@miotinternational.com
                </a>
              </p>
              <p>
                <strong className="text-slate-900">{t('Phone :')}</strong>{' '}
                <a href="tel:+914442002288" className="text-slate-800 hover:text-blue-700 font-bold">
                  +91 44 42002288
                </a>,{' '}
                <a href="tel:+914422492288" className="text-slate-800 hover:text-blue-700 font-bold">
                  +91 44 22492288
                </a>
              </p>
              <p>
                <strong className="text-slate-900">{t('Fax :')}</strong> +91 44 22491188, +91 44 22491313
              </p>
            </div>

            {/* ── INTERACTIVE GOOGLE MAP (IMAGE 2) ── */}
            <div className="mt-8 rounded-2xl overflow-hidden border border-slate-200 shadow-md">
              <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs font-bold">
                <div className="flex items-center gap-2">
                  <span className="text-red-600 text-lg">📍</span>
                  <div>
                    <span className="text-slate-900 block font-black">MIOT International</span>
                    <span className="text-[11px] text-slate-500 font-normal">4/112, Mount Poonamallee Rd, Manapakkam, Chennai - 600089</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-amber-500 font-black">★ 4.5 (6,912)</span>
                  <a
                    href="https://www.google.com/maps/dir/?api=1&destination=13.0205,80.1783"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors"
                  >
                    {t('Directions')} ↗
                  </a>
                </div>
              </div>

              {/* Embedded Google Map iframe */}
              <iframe
                title="MIOT International Hospital Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.1423851508215!2d80.17611887588325!3d13.026607913670966!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5260b64d1f5ea1%3A0xe54625b1b46dae85!2sMIOT%20International!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="320"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full"
              ></iframe>
            </div>

            {/* ── EMERGENCY SECTION & ENQUIRY BUTTON (IMAGE 3) ── */}
            <div className="mt-10 pt-8 border-t border-slate-200">
              <span className="text-xs font-black uppercase text-slate-500 tracking-wider block mb-2">
                {t('Emergency:')}
              </span>

              {/* Emergency logo box */}
              <div className="inline-flex items-center gap-3 bg-red-50 border border-red-200 p-2.5 px-4 rounded-xl mb-4">
                <div className="bg-[#D81E5B] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded tracking-wider">
                  24x7 MIOT EMERGENCY CARE
                </div>
                <a href="tel:105710" className="text-2xl font-black text-[#D81E5B] tracking-tight hover:underline">
                  10 57 10
                </a>
              </div>

              <p className="text-sm font-bold text-red-600 mb-6">
                {t('In case of an emergency, dial MIOT Emergency Care number - 105710')}
              </p>

              {/* Gold bordered Enquiry CTA */}
              <button
                onClick={() => setEnquiryModalOpen(true)}
                className="px-6 py-3 border-2 border-[#EFA00B] text-[#D98200] hover:bg-[#EFA00B] hover:text-white rounded-xl text-xs sm:text-sm font-black transition-all shadow-xs uppercase tracking-wider cursor-pointer"
              >
                {t('Click Here To Leave Us An Enquiry')}
              </button>
            </div>
          </div>

          {/* ── RIGHT COLUMN: DARK TEXTURED SIDEBAR ── */}
          <div className="lg:w-80 bg-[#35383D] text-slate-200 p-6 sm:p-8 shrink-0 text-left border-l border-slate-300/20">
            <h3 className="text-base font-black text-[#EFA00B] uppercase tracking-wider mb-6 pb-2 border-b border-slate-600">
              {t('Contact Us')}
            </h3>

            <ul className="space-y-4 text-xs font-bold">
              <li>
                <span className="text-[#EFA00B] flex items-center gap-2">
                  <span>—</span>
                  <span>{t('Get in touch')}</span>
                </span>
              </li>
              <li>
                <button
                  onClick={() => setEnquiryModalOpen(true)}
                  className="hover:text-amber-300 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <span>—</span>
                  <span>{t('Enquiry')}</span>
                </button>
              </li>
              <li>
                <a href="tel:105710" className="hover:text-amber-300 transition-colors flex items-center gap-2">
                  <span>—</span>
                  <span>{t('MIOT Emergency Care 105710 – 24x7 Emergency Hospital In Chennai')}</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=13.0205,80.1783"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-300 transition-colors flex items-center gap-2"
                >
                  <span>—</span>
                  <span>{t('Directions')}</span>
                </a>
              </li>
              <li>
                <Link to="/patient/home#facilities" className="hover:text-amber-300 transition-colors flex items-center gap-2">
                  <span>—</span>
                  <span>{t('Information Centers')}</span>
                </Link>
              </li>
              <li>
                <Link to="/patient/home#facilities" className="hover:text-amber-300 transition-colors flex items-center gap-2">
                  <span>—</span>
                  <span>{t('Rehab Centers')}</span>
                </Link>
              </li>
              <li>
                <Link to="/patient/home#centers" className="hover:text-amber-300 transition-colors flex items-center gap-2">
                  <span>—</span>
                  <span>{t('Medical Centers')}</span>
                </Link>
              </li>
              <li>
                <Link to="/patient/home#facilities" className="hover:text-amber-300 transition-colors flex items-center gap-2">
                  <span>—</span>
                  <span>{t('Outreach Clinic')}</span>
                </Link>
              </li>
              <li>
                <button
                  onClick={() => setEnquiryModalOpen(true)}
                  className="hover:text-amber-300 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <span>—</span>
                  <span>{t('Feedback Form')}</span>
                </button>
              </li>
              <li>
                <Link to="/patient/home#doctor-directory" className="hover:text-amber-300 transition-colors flex items-center gap-2">
                  <span>—</span>
                  <span>{t('Online Payment')}</span>
                </Link>
              </li>
              <li>
                <Link to="/patient/home#doctor-directory" className="hover:text-amber-300 transition-colors flex items-center gap-2">
                  <span>—</span>
                  <span>{t('MIOT Telemedicine')}</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          4. BLUE QUICK LINKS BAR & 3-COLUMN FOOTER (IMAGE 3)
      ══════════════════════════════════════════════════════════════ */}
      
      {/* Blue Accordion Bar */}
      <div className="bg-[#2157A2] text-white py-2.5 px-6 sm:px-16 flex items-center justify-between text-xs font-black uppercase tracking-wider">
        <button
          onClick={() => setQuickLinksOpen(!quickLinksOpen)}
          className="flex items-center gap-2 hover:text-amber-200 transition-colors cursor-pointer"
        >
          <span>{quickLinksOpen ? t('HIDE QUICK LINKS —') : t('SHOW QUICK LINKS +')}</span>
        </button>
      </div>

      {/* 3-Column Footer */}
      {quickLinksOpen && (
        <footer className="bg-slate-50 border-b border-slate-200 py-10 px-6 sm:px-16 text-left">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Primary Contact */}
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

            {/* Address */}
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 mb-3 pb-1 border-b border-slate-200">
                {t('ADDRESS')}
              </h4>
              <p className="text-xs font-bold text-slate-800">MIOT International</p>
              <p className="text-xs text-slate-600 mt-0.5">4/112, Mount Poonamallee Road,</p>
              <p className="text-xs text-slate-600">Manapakkam, Chennai - 600 089</p>
              <p className="text-xs text-slate-600">Tamil Nadu, India</p>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 mb-3 pb-1 border-b border-slate-200">
                {t('LINKS')}
              </h4>
              <ul className="space-y-1.5 text-xs text-blue-700 font-semibold">
                <li><a href="https://www.google.com/maps/dir/?api=1&destination=13.0205,80.1783" target="_blank" rel="noopener noreferrer" className="hover:underline">{t('Location')}</a></li>
                <li><Link to="/patient/home#facilities" className="hover:underline">{t('International Patient Care')}</Link></li>
                <li><Link to="/patient/home#about" className="hover:underline">{t('Visiting Hours')}</Link></li>
                <li><Link to="/patient/home#about" className="hover:underline">{t('Privacy Policy')}</Link></li>
                <li><Link to="/patient/home#facilities" className="hover:underline">{t('BIO Medical Waste Monthly Report')}</Link></li>
                <li><Link to="/patient/home#facilities" className="hover:underline">{t('BIO Medical Waste Annual Reports')}</Link></li>
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
          5. ENQUIRY MODAL
      ══════════════════════════════════════════════════════════════ */}
      {enquiryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200">
            <button
              onClick={() => setEnquiryModalOpen(false)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm cursor-pointer"
            >
              ✕
            </button>

            <h3 className="text-xl font-black text-[#0B2545] mb-1 text-left">
              {t('Leave Us An Enquiry')}
            </h3>
            <p className="text-xs text-slate-500 font-medium mb-4 text-left">
              {t('Our medical desk will get back to you within 2 hours.')}
            </p>

            {enquirySuccess ? (
              <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center text-emerald-800">
                <span className="text-3xl">✓</span>
                <h4 className="font-bold text-sm mt-2">{t('Enquiry Sent Successfully!')}</h4>
                <p className="text-xs text-emerald-700 mt-1">{t('We will contact you shortly.')}</p>
              </div>
            ) : (
              <form onSubmit={handleEnquirySubmit} className="space-y-3 text-left">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">{t('Full Name')}</label>
                  <input
                    type="text"
                    required
                    value={enquiryData.name}
                    onChange={(e) => setEnquiryData({ ...enquiryData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-600"
                    placeholder="Your name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">{t('Email')}</label>
                    <input
                      type="email"
                      required
                      value={enquiryData.email}
                      onChange={(e) => setEnquiryData({ ...enquiryData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-600"
                      placeholder="Email address"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">{t('Phone Number')}</label>
                    <input
                      type="tel"
                      required
                      value={enquiryData.phone}
                      onChange={(e) => setEnquiryData({ ...enquiryData, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-600"
                      placeholder="Phone"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">{t('Department / Speciality')}</label>
                  <select
                    value={enquiryData.department}
                    onChange={(e) => setEnquiryData({ ...enquiryData, department: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 bg-white focus:outline-none"
                  >
                    <option value="General Medicine">General Medicine</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="Nephrology">Nephrology</option>
                    <option value="Oncology">Oncology</option>
                    <option value="Gastroenterology">Gastroenterology</option>
                    <option value="Neurology">Neurology</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">{t('Message / Symptoms')}</label>
                  <textarea
                    rows="3"
                    required
                    value={enquiryData.message}
                    onChange={(e) => setEnquiryData({ ...enquiryData, message: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-blue-600"
                    placeholder="How can MIOT assist you?"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#EFA00B] hover:bg-[#D99008] text-white text-xs font-black rounded-xl shadow-md transition-all uppercase tracking-wider"
                >
                  {t('Submit Enquiry')}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
