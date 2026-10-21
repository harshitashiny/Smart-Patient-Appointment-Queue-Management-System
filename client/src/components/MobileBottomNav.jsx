import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

export default function MobileBottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();

  const pathname = location.pathname;

  const isHome = pathname === '/' || pathname === '/home' || pathname === '/patient/home';
  const isSearch = pathname === '/patient/search' || pathname.includes('/specialities');
  const isAppointments = pathname === '/patient' || pathname.startsWith('/patient/book');
  const isProfile = pathname === '/patient/profile' || pathname === '/doctor' || pathname === '/admin' || pathname === '/login';

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/95 backdrop-blur-lg border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-2 py-1.5 safe-area-bottom">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* Tab 1: Home */}
        <button
          onClick={() => navigate(user ? (user.role === 'patient' ? '/patient/home' : `/${user.role}`) : '/')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all cursor-pointer ${
            isHome
              ? 'text-[#0B2545] font-black scale-105'
              : 'text-slate-400 font-bold hover:text-slate-600'
          }`}
        >
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
            isHome ? 'bg-blue-50 text-[#0B2545]' : ''
          }`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={isHome ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">{t('Home')}</span>
        </button>

        {/* Tab 2: Find Doctors */}
        <button
          onClick={() => navigate('/patient/search')}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all cursor-pointer ${
            isSearch
              ? 'text-teal-700 font-black scale-105'
              : 'text-slate-400 font-bold hover:text-slate-600'
          }`}
        >
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
            isSearch ? 'bg-teal-50 text-teal-700' : ''
          }`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">{t('Doctors')}</span>
        </button>

        {/* Tab 3: Appointments / Book Slot */}
        <button
          onClick={() => {
            if (!user) {
              navigate('/login');
            } else if (user.role === 'patient') {
              navigate('/patient');
            } else {
              navigate(`/${user.role}`);
            }
          }}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all cursor-pointer ${
            isAppointments
              ? 'text-[#0B2545] font-black scale-105'
              : 'text-slate-400 font-bold hover:text-slate-600'
          }`}
        >
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center relative ${
            isAppointments ? 'bg-blue-50 text-[#0B2545]' : ''
          }`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
              <line x1="16" x1="2" x2="16" y2="6"/>
              <line x1="8" x1="2" x2="8" y2="6"/>
              <line x1="3" x1="10" x2="21" y2="10"/>
            </svg>
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">{t('Book')}</span>
        </button>

        {/* Tab 4: 24/7 Emergency Call (Instant Native Action) */}
        <a
          href="tel:105710"
          className="flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl text-rose-600 font-bold transition-all active:scale-95"
        >
          <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shadow-xs">
            <span className="text-sm">🚨</span>
          </div>
          <span className="text-[10px] mt-0.5 font-black text-rose-600 tracking-tight">10 57 10</span>
        </a>

        {/* Tab 5: Profile / Login */}
        <button
          onClick={() => {
            if (!user) navigate('/login');
            else if (user.role === 'patient') navigate('/patient/profile');
            else navigate(`/${user.role}`);
          }}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all cursor-pointer ${
            isProfile
              ? 'text-[#0B2545] font-black scale-105'
              : 'text-slate-400 font-bold hover:text-slate-600'
          }`}
        >
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
            isProfile ? 'bg-blue-50 text-[#0B2545]' : ''
          }`}>
            {user ? (
              <div className="w-5 h-5 rounded-full bg-[#0B2545] text-white flex items-center justify-center text-[10px] font-black">
                {user.name?.charAt(0) || 'U'}
              </div>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-[50px]">
            {user ? t('Profile') : t('Sign In')}
          </span>
        </button>
      </div>
    </nav>
  );
}
