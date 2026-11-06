import React from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../components/LanguageSelector';
import { Home, Calendar, Users, Stethoscope, ShieldCheck, Search, LogOut, Clock, ShieldAlert, RefreshCw } from 'lucide-react';

export const PendingApprovalNotice = ({ user }) => {
  const { logout, fetchUser } = useAuth();
  const [checking, setChecking] = React.useState(false);
  const isRejected = user?.approvalStatus === 'rejected';

  const handleRefresh = async () => {
    setChecking(true);
    try {
      await fetchUser();
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200/80 shadow-2xl text-center space-y-6 animate-in fade-in">
        <div
          className={`w-20 h-20 rounded-3xl mx-auto flex items-center justify-center shadow-lg ${
            isRejected ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'
          }`}
        >
          {isRejected ? <ShieldAlert size={40} /> : <Clock size={40} className="animate-pulse" />}
        </div>

        <div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              isRejected ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
            }`}
          >
            {isRejected ? 'Registration Declined' : 'Verification In Progress'}
          </span>
          <h2 className="text-2xl font-black text-slate-800 mt-2">
            {isRejected ? 'Account Request Declined' : 'Doctor Approval Pending'}
          </h2>
          <p className="text-slate-500 text-xs mt-1">
            Welcome, <strong>Dr. {user?.name}</strong>.
          </p>
        </div>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 text-xs text-slate-600 text-left space-y-2">
          {isRejected ? (
            <>
              <p className="font-bold text-rose-700">Administrator Remarks:</p>
              <p className="text-slate-600 italic">
                {user?.rejectionReason || 'Your submitted medical credentials could not be verified by the hospital administration.'}
              </p>
            </>
          ) : (
            <>
              <p className="font-semibold text-slate-700">
                Hospital Verification Required:
              </p>
              <p>
                Your registration has been submitted to the hospital administrator for credentials verification. You will be able to access the doctor console and patient queue once approved.
              </p>
            </>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          {!isRejected && (
            <button
              onClick={handleRefresh}
              disabled={checking}
              className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/20 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              <RefreshCw size={14} className={checking ? 'animate-spin' : ''} />
              <span>{checking ? 'Checking...' : 'Check Status'}</span>
            </button>
          )}
          <button
            onClick={logout}
            className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-slate-500 font-bold">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Doctors must be approved by admin before accessing protected features
  if (user.role === 'doctor' && (!user.isApproved || user.approvalStatus === 'rejected')) {
    return <PendingApprovalNotice user={user} />;
  }

  return <Outlet />;
};

export const AppLayout = () => {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const location = useLocation();

  const homeLink =
    user?.role === 'doctor' ? '/doctor' : user?.role === 'admin' ? '/admin' : '/patient/home';

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 font-sans relative selection:bg-blue-100">
      {/* Top MIOT Emergency & Contact Bar */}
      <div className="bg-[#0B2545] text-white text-[11px] font-semibold py-1.5 px-4 sm:px-8 flex flex-wrap items-center justify-between gap-2 border-b border-blue-950/40">
        <div className="flex items-center gap-4 flex-wrap">
          <a href="tel:105710" className="flex items-center gap-1.5 text-amber-300 hover:text-amber-200 font-bold transition-colors">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span>🚨 {t('24/7 Emergency')}: <strong className="underline">10 57 10</strong></span>
          </a>
          <span className="text-blue-300/40 hidden sm:inline">|</span>
          <a href="tel:+914442002288" className="hover:text-blue-200 transition-colors flex items-center gap-1">
            <span>📞 {t('Appointments')}: <strong>+91 44 42002288</strong></span>
          </a>
          <span className="text-blue-300/40 hidden md:inline">|</span>
          <a
            href="https://www.google.com/maps/dir/?api=1&destination=13.0266079,80.1761188"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-300 hidden md:inline hover:text-teal-300 transition-colors"
          >
            📍 {t('4/112, Mount Poonamallee Road, Manapakkam, Chennai - 600089')}
          </a>
        </div>
        <div className="flex items-center gap-3 text-slate-300">
          <span className="hidden lg:inline text-[10px] text-teal-300 font-bold uppercase tracking-wider">{t('1000-Bed Quaternary Care Hospital')}</span>
          <span className="text-blue-300/40 hidden lg:inline">|</span>
          <span className="hidden sm:inline text-slate-300">{t('130+ Countries Served')}</span>
        </div>
      </div>

      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/95 border-b border-slate-200/80 shadow-xs transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Brand Logo */}
            <div className="flex items-center gap-6">
              <Link to={homeLink} className="flex items-center gap-2.5 cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0B2545] to-[#133E87] flex items-center justify-center shadow-md shadow-blue-900/20 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 10.5h-5.5V5a1.5 1.5 0 0 0-3 0v5.5H5a1.5 1.5 0 0 0 0 3h5.5V19a1.5 1.5 0 0 0 3 0v-5.5H19a1.5 1.5 0 0 0 0-3z" />
                  </svg>
                </div>
                <div className="flex flex-col text-left">
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-black text-[#0B2545] tracking-tight leading-none">MIOT</span>
                    <span className="text-xs font-black text-[#133E87] tracking-wider uppercase">INTERNATIONAL</span>
                  </div>
                  <span className="text-[9px] font-bold text-slate-400 tracking-wider uppercase">{t('PUTTING PATIENTS FIRST • CHENNAI')}</span>
                </div>
              </Link>

              {/* Navigation Links by Role */}
              {user && (
                <div className="hidden md:flex items-center gap-1 text-xs font-bold text-slate-600 pl-4 border-l border-slate-200">
                  {user.role === 'patient' && (
                    <>
                      <Link
                        to="/patient/home"
                        className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                          location.pathname === '/patient/home'
                            ? 'bg-blue-50 text-blue-700'
                            : 'hover:bg-slate-100 text-slate-600'
                        }`}
                      >
                        <Home size={15} />
                        <span>{t('Home')}</span>
                      </Link>
                      <Link
                        to="/patient"
                        className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                          location.pathname === '/patient'
                            ? 'bg-blue-50 text-blue-700'
                            : 'hover:bg-slate-100 text-slate-600'
                        }`}
                      >
                        <Calendar size={15} />
                        <span>{t('My Dashboard')}</span>
                      </Link>
                      <Link
                        to="/patient/search"
                        className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                          location.pathname === '/patient/search'
                            ? 'bg-blue-50 text-blue-700'
                            : 'hover:bg-slate-100 text-slate-600'
                        }`}
                      >
                        <Search size={15} />
                        <span>{t('Find Doctors')}</span>
                      </Link>
                    </>
                  )}

                  {user.role === 'doctor' && (
                    <Link
                      to="/doctor"
                      className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 flex items-center gap-1.5"
                    >
                      <Stethoscope size={15} />
                      <span>{t('Doctor Console')}</span>
                    </Link>
                  )}

                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 flex items-center gap-1.5"
                    >
                      <ShieldCheck size={15} />
                      <span>{t('Admin Console')}</span>
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* Right Side Options */}
            <div className="flex gap-3 sm:gap-4 items-center">
              <LanguageSelector />

              {user ? (
                <div className="flex items-center gap-3">
                  <Link
                    to={user.role === 'patient' ? '/patient/profile' : homeLink}
                    className="flex items-center gap-2 p-1.5 px-2.5 rounded-xl hover:bg-slate-100/80 transition-all cursor-pointer border border-transparent hover:border-slate-200"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                      {user.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="hidden sm:flex flex-col text-left">
                      <span className="text-xs font-bold text-slate-800 leading-tight">
                        {user.name}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400 capitalize leading-none mt-0.5">
                        {user.role}
                      </span>
                    </div>
                  </Link>

                  <button
                    onClick={logout}
                    className="p-2 sm:px-3 sm:py-1.5 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                    title={t('Logout')}
                  >
                    <LogOut size={16} />
                    <span className="hidden sm:inline">{t('Logout')}</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
                >
                  {t('Login')}
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto relative z-10">
        <Outlet />
      </main>
    </div>
  );
};
