import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import {
  Mail, Lock, Loader2, Eye, EyeOff, UserCheck, ShieldCheck,
  Stethoscope, User, ShieldAlert, Sparkles
} from 'lucide-react';
import LanguageSelector from '../components/LanguageSelector';

export default function Login() {
  const { t } = useTranslation();
  const { login, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === 'patient') navigate('/patient/home');
      else if (user.role === 'doctor') navigate('/doctor');
      else if (user.role === 'admin') navigate('/admin');
      else navigate('/patient/home');
    }
  }, [user, navigate]);

  // Load saved credentials from localStorage
  const [savedAccount, setSavedAccount] = useState(() => {
    try {
      const stored = localStorage.getItem('smartcare_saved_account');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [rememberMe, setRememberMe] = useState(() => {
    return localStorage.getItem('smartcare_remember_me') !== 'false';
  });

  const [activeRoleTab, setActiveRoleTab] = useState('patient'); // 'patient' | 'doctor' | 'admin'
  const [email, setEmail] = useState(() => {
    if (savedAccount?.email) return savedAccount.email;
    return 'joshika@gmail.com';
  });
  const [password, setPassword] = useState(() => {
    if (savedAccount?.password) return savedAccount.password;
    return 'password123';
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingApproval, setPendingApproval] = useState(false);

  // Switch demo credentials when tab changes
  const handleSelectRoleTab = (role) => {
    setActiveRoleTab(role);
    setError('');
    setPendingApproval(false);
    if (role === 'patient') {
      setEmail('joshika@gmail.com');
      setPassword('password123');
    } else if (role === 'doctor') {
      setEmail('drkjaisankar.cardiology@miot.com');
      setPassword('password123');
    } else if (role === 'admin') {
      setEmail('admin@smartcare.com');
      setPassword('password123');
    }
  };

  const executeLogin = async (loginEmail, loginPassword) => {
    setError('');
    setPendingApproval(false);
    setIsSubmitting(true);
    try {
      const res = await login(loginEmail.trim().toLowerCase(), loginPassword);

      if (rememberMe) {
        localStorage.setItem('smartcare_remember_me', 'true');
        localStorage.setItem(
          'smartcare_saved_account',
          JSON.stringify({
            email: loginEmail.trim().toLowerCase(),
            password: loginPassword,
            name: res.data?.user?.name || 'User',
            role: res.data?.user?.role || 'patient',
          })
        );
      } else {
        localStorage.setItem('smartcare_remember_me', 'false');
        localStorage.removeItem('smartcare_saved_account');
      }

      const userRole = res.data?.user?.role;
      if (userRole === 'patient') navigate('/patient/home');
      else if (userRole === 'doctor') navigate('/doctor');
      else if (userRole === 'admin') navigate('/admin');
      else navigate('/patient/home');
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please check your credentials and try again.';
      if (msg.toLowerCase().includes('pending admin approval') || err.response?.status === 403) {
        setPendingApproval(true);
      }
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    executeLogin(email, password);
  };

  const isEmailNotFound = error.toLowerCase().includes('invalid email') || error.toLowerCase().includes('not found');

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] py-10 relative selection:bg-blue-100">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100 via-transparent to-transparent opacity-60 pointer-events-none" />

      {/* Top bar with Language Selector */}
      <div className="w-full max-w-md flex justify-end mb-4 px-2 z-20">
        <LanguageSelector />
      </div>

      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-2xl shadow-blue-900/5 overflow-hidden border border-white/60 p-8 sm:p-10 relative z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Brand Header */}
        <div className="mb-6 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          <h2 className="text-3xl font-black text-slate-800 mb-1 tracking-tight">{t('Welcome Back')}</h2>
          <p className="text-slate-500 font-medium text-xs">{t('Sign in to your MIOT account')}</p>
        </div>

        {/* Role Quick Selector Tabs */}
        <div className="mb-6 p-1 bg-slate-100 rounded-2xl flex items-center gap-1 border border-slate-200/60 shadow-inner">
          <button
            type="button"
            onClick={() => handleSelectRoleTab('patient')}
            className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeRoleTab === 'patient'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <User size={14} />
            <span>{t('Patient')}</span>
          </button>
          <button
            type="button"
            onClick={() => handleSelectRoleTab('doctor')}
            className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeRoleTab === 'doctor'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Stethoscope size={14} />
            <span>{t('Doctor')}</span>
          </button>
          <button
            type="button"
            onClick={() => handleSelectRoleTab('admin')}
            className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeRoleTab === 'admin'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <ShieldCheck size={14} />
            <span>{t('Admin')}</span>
          </button>
        </div>

        {/* Pending Approval Alert */}
        {pendingApproval && (
          <div className="mb-5 p-4 bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl text-xs space-y-2 animate-in fade-in">
            <div className="flex items-start gap-2">
              <ShieldAlert size={18} className="text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold">{t('Doctor Account Pending Approval:')}</strong>
                <p className="mt-0.5 text-amber-800">
                  {t('Your doctor profile has been created and is waiting for administrator approval before you can access the doctor console.')}
                </p>
              </div>
            </div>
            <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between">
              <span className="text-[11px] text-amber-700">{t('Need immediate testing?')}</span>
              <button
                type="button"
                onClick={() => handleSelectRoleTab('admin')}
                className="text-[11px] font-bold text-amber-900 bg-amber-200/70 hover:bg-amber-300 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
              >
                {t('Log in as Admin to Approve →')}
              </button>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && !pendingApproval && (
          <div className="mb-5 p-3.5 bg-red-50/90 backdrop-blur border border-red-200 text-red-600 rounded-2xl text-xs font-medium animate-in fade-in">
            <div className="flex items-start gap-2.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 shrink-0">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{t(error)}</span>
            </div>
            {isEmailNotFound && (
              <div className="mt-2.5 pt-2.5 border-t border-red-100 text-[11px] text-red-500 flex items-center justify-between">
                <span>{t('No account found with this email.')}</span>
                <Link to="/register" className="font-bold underline text-red-600 hover:text-red-700">
                  {t('Register now →')}
                </Link>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              {t('Email Address')}
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                <Mail size={18} />
              </div>
              <input
                type="email"
                required
                autoComplete="email"
                className="w-full pl-10 pr-4 py-2.5 bg-white/70 border-2 border-slate-100 rounded-xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all font-medium text-slate-800 placeholder-slate-400 text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                {t('Password')}
              </label>
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                className="w-full pl-10 pr-11 py-2.5 bg-white/70 border-2 border-slate-100 rounded-xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all font-medium text-slate-800 placeholder-slate-400 text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('Enter password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-blue-500 transition-colors cursor-pointer"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-slate-600 hover:text-slate-800 transition-colors">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span className="flex items-center gap-1">
                <ShieldCheck size={14} className="text-blue-600" />
                <span>{t('Remember me')}</span>
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3.5 rounded-xl hover:scale-[1.01] hover:shadow-lg hover:shadow-blue-500/30 focus:ring-4 focus:ring-blue-100 active:scale-95 transition-all flex justify-center items-center gap-2 mt-3 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed text-sm shadow-md"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                <span>{t('Signing In...')}</span>
              </>
            ) : (
              <span>
                {activeRoleTab === 'doctor'
                  ? t('Sign In as Doctor')
                  : activeRoleTab === 'admin'
                  ? t('Sign In as Admin')
                  : t('Sign In')}
              </span>
            )}
          </button>
        </form>

        <div className="mt-6 p-3 bg-slate-50 rounded-xl border border-slate-100 text-center text-xs text-slate-600">
          {t("Don't have an account?")}{' '}
          <Link to="/register" className="text-blue-600 hover:text-blue-700 font-bold underline transition-colors">
            {t('Register as Patient or Doctor →')}
          </Link>
        </div>
      </div>
    </div>
  );
}
