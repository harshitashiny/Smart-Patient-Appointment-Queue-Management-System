import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { NAVIGATION_MENUS } from '../data/navigationMenuData';
import { INSTITUTES_DATA, KEY_SPECIALTIES_DATA } from '../data/specialitiesData';

export default function MiotMegaMenu({
  activeMenuKey,       // 'specialities' | 'facilities' | 'programmes' | 'patients' | 'global'
  onClose,             // function to close if used as dropdown overlay
  isOverlay = false,   // true if rendered as dropdown overlay
  onNavigateSection,   // optional callback when switching section
  onSelectSpecialty    // callback for specialities item click
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Active sub-tab inside the selected menu
  // (e.g. for facilities: 'facilities' or 'resources'; for programmes: 'programmes' or 'education')
  const [activeSubTab, setActiveSubTab] = useState(() => {
    if (activeMenuKey === 'specialities') return 'centers';
    const menuConfig = NAVIGATION_MENUS[activeMenuKey];
    return menuConfig?.tabs?.[0]?.id || 'facilities';
  });

  // Selected item for modal details
  const [selectedItem, setSelectedItem] = useState(null);

  // When activeMenuKey changes, reset subTab to first tab
  React.useEffect(() => {
    if (activeMenuKey === 'specialities') {
      setActiveSubTab('centers');
    } else if (NAVIGATION_MENUS[activeMenuKey]?.tabs?.length > 0) {
      setActiveSubTab(NAVIGATION_MENUS[activeMenuKey].tabs[0].id);
    }
  }, [activeMenuKey]);

  const currentMenu = NAVIGATION_MENUS[activeMenuKey];

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const handleBookNow = () => {
    setSelectedItem(null);
    if (onClose) onClose();
    navigate('/patient/home#doctor-directory');
    setTimeout(() => {
      const el = document.getElementById('doctor-directory') || document.getElementById('doctor-appointment-portal');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  // If activeMenuKey is 'specialities', render Centers of Excellence / Key Specialties
  if (activeMenuKey === 'specialities') {
    return (
      <div className={`w-full bg-white ${isOverlay ? 'shadow-2xl border-b-4 border-blue-900 animate-in fade-in slide-in-from-top-2 duration-200' : ''}`}>
        {/* Top Header Tabs */}
        <div className="w-full flex items-stretch text-white text-xs sm:text-sm font-black uppercase tracking-wider select-none">
          <button
            onClick={() => setActiveSubTab('centers')}
            className={`flex-1 py-3.5 sm:py-4 px-6 flex items-center justify-center gap-2 cursor-pointer transition-all relative ${
              activeSubTab === 'centers' ? 'bg-[#EFA00B] text-white shadow-md' : 'bg-amber-600/80 hover:bg-amber-600 text-white/90'
            }`}
          >
            <span>{t('CENTERS OF EXCELLENCE')}</span>
            {activeSubTab === 'centers' && (
              <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-10 border-t-[#EFA00B] z-10" />
            )}
          </button>

          <button
            onClick={() => setActiveSubTab('key-specialties')}
            className={`flex-1 py-3.5 sm:py-4 px-6 flex items-center justify-center gap-2 cursor-pointer transition-all relative ${
              activeSubTab === 'key-specialties' ? 'bg-[#1F54B0] text-white shadow-md' : 'bg-blue-800/80 hover:bg-blue-800 text-white/90'
            }`}
          >
            <span>{t('KEY SPECIALTIES')}</span>
            {activeSubTab === 'key-specialties' && (
              <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-10 border-t-[#1F54B0] z-10" />
            )}
          </button>
        </div>

        {/* Content Directory */}
        <div className="max-w-7xl mx-auto px-6 sm:px-12 py-8 sm:py-10 text-left">
          {activeSubTab === 'centers' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
              {/* Column 1 */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-black text-[#0B2545] uppercase tracking-wider mb-3">
                    {t('MIOT INSTITUTE OF ORTHOPAEDICS')}
                  </h3>
                  <ul className="space-y-2.5 text-xs font-semibold text-slate-700">
                    {INSTITUTES_DATA[0].items.map((item) => (
                      <li key={item.id}>
                        <button
                          onClick={() => {
                            if (onClose) onClose();
                            if (onSelectSpecialty) onSelectSpecialty(INSTITUTES_DATA[0], item);
                            else navigate(`/specialities-treatments?institute=${INSTITUTES_DATA[0].id}&specialty=${item.id}`);
                          }}
                          className="group flex items-start gap-2 hover:text-blue-700 transition-colors cursor-pointer text-left w-full"
                        >
                          <span className="text-blue-600 font-bold group-hover:translate-x-0.5 transition-transform">›</span>
                          <span className="group-hover:underline">{t(item.title)}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm font-black text-[#0B2545] uppercase tracking-wider mb-3">
                    {t('MIOT INSTITUTE OF NEPHROLOGY')}
                  </h3>
                  <ul className="space-y-2.5 text-xs font-semibold text-slate-700">
                    {INSTITUTES_DATA[1].items.map((item) => (
                      <li key={item.id}>
                        <button
                          onClick={() => {
                            if (onClose) onClose();
                            if (onSelectSpecialty) onSelectSpecialty(INSTITUTES_DATA[1], item);
                            else navigate(`/specialities-treatments?institute=${INSTITUTES_DATA[1].id}&specialty=${item.id}`);
                          }}
                          className="group flex items-start gap-2 hover:text-blue-700 transition-colors cursor-pointer text-left w-full"
                        >
                          <span className="text-blue-600 font-bold group-hover:translate-x-0.5 transition-transform">›</span>
                          <span className="group-hover:underline">{t(item.title)}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Column 2 */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-black text-[#0B2545] uppercase tracking-wider mb-3">
                    {t('MIOT INSTITUTE OF CARDIAC CARE')}
                  </h3>
                  <ul className="space-y-2.5 text-xs font-semibold text-slate-700">
                    {INSTITUTES_DATA[2].items.map((item) => (
                      <li key={item.id}>
                        <button
                          onClick={() => {
                            if (onClose) onClose();
                            if (onSelectSpecialty) onSelectSpecialty(INSTITUTES_DATA[2], item);
                            else navigate(`/specialities-treatments?institute=${INSTITUTES_DATA[2].id}&specialty=${item.id}`);
                          }}
                          className="group flex items-start gap-2 hover:text-blue-700 transition-colors cursor-pointer text-left w-full"
                        >
                          <span className="text-blue-600 font-bold group-hover:translate-x-0.5 transition-transform">›</span>
                          <span className="group-hover:underline">{t(item.title)}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm font-black text-[#0B2545] uppercase tracking-wider mb-3">
                    {t('MIOT INSTITUTE OF THORACIC & CARDIOVASCULAR')}
                  </h3>
                  <ul className="space-y-2.5 text-xs font-semibold text-slate-700">
                    {INSTITUTES_DATA[3].items.map((item) => (
                      <li key={item.id}>
                        <button
                          onClick={() => {
                            if (onClose) onClose();
                            if (onSelectSpecialty) onSelectSpecialty(INSTITUTES_DATA[3], item);
                            else navigate(`/specialities-treatments?institute=${INSTITUTES_DATA[3].id}&specialty=${item.id}`);
                          }}
                          className="group flex items-start gap-2 hover:text-blue-700 transition-colors cursor-pointer text-left w-full"
                        >
                          <span className="text-blue-600 font-bold group-hover:translate-x-0.5 transition-transform">›</span>
                          <span className="group-hover:underline">{t(item.title)}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Column 3 */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-black text-[#0B2545] uppercase tracking-wider mb-3">
                    {t('MIOT INSTITUTE OF CANCER CURE')}
                  </h3>
                  <ul className="space-y-2.5 text-xs font-semibold text-slate-700">
                    {INSTITUTES_DATA[4].items.map((item) => (
                      <li key={item.id}>
                        <button
                          onClick={() => {
                            if (onClose) onClose();
                            if (onSelectSpecialty) onSelectSpecialty(INSTITUTES_DATA[4], item);
                            else navigate(`/specialities-treatments?institute=${INSTITUTES_DATA[4].id}&specialty=${item.id}`);
                          }}
                          className="group flex items-start gap-2 hover:text-blue-700 transition-colors cursor-pointer text-left w-full"
                        >
                          <span className="text-blue-600 font-bold group-hover:translate-x-0.5 transition-transform">›</span>
                          <span className="group-hover:underline">{t(item.title)}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-sm font-black text-[#0B2545] uppercase tracking-wider mb-3">
                    {t('MIOT INSTITUTE OF GASTROENTEROLOGY')}
                  </h3>
                  <ul className="space-y-2.5 text-xs font-semibold text-slate-700">
                    {INSTITUTES_DATA[5].items.map((item) => (
                      <li key={item.id}>
                        <button
                          onClick={() => {
                            if (onClose) onClose();
                            if (onSelectSpecialty) onSelectSpecialty(INSTITUTES_DATA[5], item);
                            else navigate(`/specialities-treatments?institute=${INSTITUTES_DATA[5].id}&specialty=${item.id}`);
                          }}
                          className="group flex items-start gap-2 hover:text-blue-700 transition-colors cursor-pointer text-left w-full"
                        >
                          <span className="text-blue-600 font-bold group-hover:translate-x-0.5 transition-transform">›</span>
                          <span className="group-hover:underline">{t(item.title)}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[
                KEY_SPECIALTIES_DATA.slice(0, 5),
                KEY_SPECIALTIES_DATA.slice(5, 10),
                KEY_SPECIALTIES_DATA.slice(10),
              ].map((col, colIdx) => (
                <div key={colIdx} className="space-y-3">
                  {col.map((spec) => (
                    <div
                      key={spec.name}
                      onClick={() => handleItemClick({ title: spec.name, desc: spec.desc })}
                      className="group flex items-center gap-2 hover:text-blue-700 transition-colors cursor-pointer text-left text-xs font-semibold text-slate-700"
                    >
                      <span className="text-blue-600 font-bold group-hover:translate-x-0.5 transition-transform">›</span>
                      <span className="group-hover:underline">{spec.name}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!currentMenu) return null;

  // Active tab object
  const currentTab = currentMenu.tabs.find((t) => t.id === activeSubTab) || currentMenu.tabs[0];

  return (
    <div className={`w-full bg-white select-none ${isOverlay ? 'shadow-2xl border-b-4 border-blue-900 animate-in fade-in slide-in-from-top-2 duration-200' : ''}`}>
      
      {/* ── TOP HEADER TABS (Exact match to images) ── */}
      <div className="w-full flex items-stretch text-white text-xs sm:text-sm font-black uppercase tracking-wider select-none">
        {currentMenu.tabs.map((tab) => {
          const isActive = tab.id === currentTab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              style={{ backgroundColor: isActive ? tab.bgColor : undefined }}
              className={`flex-1 py-3.5 sm:py-4 px-6 sm:px-10 flex items-center justify-center gap-2 cursor-pointer transition-all relative ${
                isActive
                  ? 'text-white shadow-md'
                  : 'bg-slate-700 hover:bg-slate-800 text-white/80'
              }`}
            >
              <span>{t(tab.label)}</span>
              {isActive && (
                <div
                  className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-10 z-10"
                  style={{ borderTopColor: tab.bgColor }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* ── CONTENT DIRECTORY (Exact 3-Column / Multi-Column match to images) ── */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 py-8 sm:py-10 text-left">
        <div className={`grid grid-cols-1 md:grid-cols-${Math.min(currentTab.columns.length, 3)} gap-6 md:gap-10 lg:gap-14`}>
          {currentTab.columns.map((col, colIdx) => (
            <div key={colIdx} className="space-y-4">
              {col.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className="group flex items-start gap-2.5 hover:text-blue-800 transition-colors cursor-pointer text-left w-full"
                >
                  {/* Blue Chevron from Image */}
                  <span className="text-[#1F54B0] font-bold text-sm shrink-0 leading-tight group-hover:translate-x-1 transition-transform">
                    ›
                  </span>
                  <span className="text-xs sm:text-[13px] font-bold text-[#1B499E] group-hover:text-blue-900 group-hover:underline leading-tight">
                    {t(item.title)}
                  </span>
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── MODAL POPUP FOR CLICKED ITEM ── */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative animate-in zoom-in-95">
            {/* Close Button */}
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-lg transition-colors cursor-pointer"
            >
              ✕
            </button>

            {/* Badge */}
            <div className="inline-block px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#1F54B0] text-[10px] font-black uppercase tracking-wider mb-2.5">
              {t(currentMenu.navKey)} • {t(currentTab.label)}
            </div>

            {/* Title */}
            <h3 className="text-xl font-black text-[#0B2545] tracking-tight mb-3">
              {t(selectedItem.title)}
            </h3>

            {/* Description */}
            <p className="text-sm font-medium text-slate-600 leading-relaxed mb-6">
              {selectedItem.desc || `${selectedItem.title} is an integral facility at MIOT International, equipped with advanced clinical infrastructure and managed by distinguished medical specialists.`}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 border-t border-slate-100">
              <button
                onClick={handleBookNow}
                className="w-full sm:flex-1 py-2.5 px-4 bg-[#0B2545] hover:bg-[#133E87] text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>📅</span>
                <span>{t('Book Doctor Slot')}</span>
              </button>

              <a
                href="tel:105710"
                className="w-full sm:w-auto py-2.5 px-4 bg-[#D81E5B] hover:bg-[#BE123C] text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>📞</span>
                <span>10 57 10 (Emergency)</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
