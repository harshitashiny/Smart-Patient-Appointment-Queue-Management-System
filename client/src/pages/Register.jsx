import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import {
  User, Mail, Lock, Phone, Calendar, Loader2, Eye, EyeOff,
  Stethoscope, Award, Briefcase, Building, DollarSign, CheckCircle2, ShieldAlert
} from 'lucide-react';
import LanguageSelector from '../components/LanguageSelector';

const SPECIALIZATIONS = [
  'General Medicine',
  'Cardiology',
  'Neurology',
  'Pulmonology',
  'Orthopedics',
  'Pediatrics',
  'Dermatology',
  'Obstetrics & Gynecology',
  'Ophthalmology',
  'ENT',
  'Dentistry',
  'Psychiatry',
  'Gastroenterology',
  'Other'
];

export default function Register() {
  const { t } = useTranslation();
  const [role, setRole] = useState('patient'); // 'patient' | 'doctor'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    age: '',
    gender: 'male',
    specialization: 'General Medicine',
    customSpecialization: '',
    qualification: 'MBBS, MD',
    experience: '5',
    consultationFee: '600',
    clinicName: 'SmartCare Medical Center',
    clinicAddress: 'Chennai, Tamil Nadu',
    bio: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [doctorSuccess, setDoctorSuccess] = useState(null);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const finalSpecialization =
        role === 'doctor' && formData.specialization === 'Other' && formData.customSpecialization.trim()
          ? formData.customSpecialization.trim()
          : formData.specialization;

      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        phone: formData.phone.trim(),
        gender: formData.gender,
        role,
        ...(role === 'patient'
          ? {
              age: formData.age ? Number(formData.age) : undefined,
            }
          : {
              specialization: finalSpecialization,
              qualification: formData.qualification.trim(),
              experience: Number(formData.experience) || 1,
              consultationFee: Number(formData.consultationFee) || 500,
              clinicName: formData.clinicName.trim(),
              clinicAddress: formData.clinicAddress.trim(),
              bio: formData.bio.trim(),
            }),
      };

      const res = await register(payload);

      if (role === 'doctor') {
        // Doctor is pending approval
        setDoctorSuccess({
          name: formData.name,
          email: formData.email,
          specialization: finalSpecialization,
        });
      } else {
        // Patient proceeds straight to home
        localStorage.setItem('smartcare_remember_me', 'true');
        localStorage.setItem(
          'smartcare_saved_account',
          JSON.stringify({
            email: formData.email.trim().toLowerCase(),
            password: formData.password,
            name: res.data?.user?.name || formData.name,
            role: 'patient',
          })
        );
        navigate('/patient/home');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check your information and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const emailAlreadyExists = error.toLowerCase().includes('already exists');

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] py-10 relative selection:bg-blue-100">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100 via-transparent to-transparent opacity-60 pointer-events-none" />

      {/* Top Bar */}
      <div className="w-full max-w-lg flex justify-end mb-4 px-2 z-20">
        <LanguageSelector />
      </div>

      <div className="w-full max-w-lg bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-2xl shadow-blue-900/5 overflow-hidden border border-white/60 p-8 sm:p-10 relative z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-blue-500/30">
            {role === 'doctor' ? (
              <Stethoscope size={30} className="text-white" />
            ) : (
              <User size={30} className="text-white" />
            )}
          </div>
          <h2 className="text-3xl font-black text-slate-800 mb-1 tracking-tight">{t('Create Account')}</h2>
          <p className="text-slate-500 font-medium text-sm">{t('Join MIOT Healthcare Platform')}</p>
        </div>

        {/* Role Toggle Selector */}
        <div className="mb-6 p-1.5 bg-slate-100/80 rounded-2xl flex items-center gap-1 border border-slate-200/60 shadow-inner">
          <button
            type="button"
            onClick={() => {
              setRole('patient');
              setError('');
              setDoctorSuccess(null);
            }}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              role === 'patient'
                ? 'bg-white text-blue-600 shadow-md shadow-slate-200 scale-100'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <User size={16} />
            <span>{t('Patient Registration')}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setRole('doctor');
              setError('');
              setDoctorSuccess(null);
            }}
            className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              role === 'doctor'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 scale-100'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Stethoscope size={16} />
            <span>{t('Doctor Registration')}</span>
          </button>
        </div>

        {/* Doctor Registration Success Notice */}
        {doctorSuccess ? (
          <div className="p-6 bg-emerald-50/90 border border-emerald-200 rounded-2xl text-center space-y-4 animate-in fade-in">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 size={32} />
            </div>
            <div>
              <h3 className="text-lg font-black text-emerald-900">{t('Doctor Registration Received!')}</h3>
              <p className="text-xs text-emerald-700 mt-1">
                Thank you, <strong>Dr. {doctorSuccess.name}</strong> ({doctorSuccess.specialization}).
              </p>
            </div>
            <div className="p-3.5 bg-white/80 rounded-xl border border-emerald-100 text-left text-xs text-slate-600 space-y-2">
              <div className="flex items-start gap-2">
                <ShieldAlert size={16} className="text-amber-500 shrink-0 mt-0.5" />
                <span>
                  <strong>{t('Admin Verification Required:')}</strong> {t('For patient safety, doctor profiles require approval by the hospital administrator before login.')}
                </span>
              </div>
              <p className="text-slate-500 text-[11px]">
                {t('You can log in once your account is verified, or use the administrator console to approve it.')}
              </p>
            </div>
            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <Link
                to="/login"
                className="flex-1 py-3 bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-500/20 hover:bg-emerald-700 transition-colors text-center"
              >
                {t('Go to Login Page')}
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50/90 backdrop-blur border border-red-200 text-red-600 rounded-2xl text-sm font-medium animate-in fade-in">
                <div className="flex items-start gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  <span>{t(error)}</span>
                </div>
                {emailAlreadyExists && (
                  <div className="mt-3 pt-3 border-t border-red-100 text-xs text-red-500">
                    {t('This email is already registered.')}{' '}
                    <Link to="/login" className="font-bold underline text-red-600 hover:text-red-700">
                      {t('Log in instead →')}
                    </Link>
                  </div>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  {role === 'doctor' ? t("Doctor's Full Name") : t('Full Name')}
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                    {role === 'doctor' ? <Stethoscope size={18} /> : <User size={18} />}
                  </div>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-white/70 border-2 border-slate-100 rounded-xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all font-medium text-slate-800 placeholder-slate-400 text-sm"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={role === 'doctor' ? 'Dr. Robert Smith' : 'John Doe'}
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">{t('Email Address')}</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-white/70 border-2 border-slate-100 rounded-xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all font-medium text-slate-800 placeholder-slate-400 text-sm"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={role === 'doctor' ? 'dr.smith@hospital.com' : 'john@example.com'}
                  />
                </div>
              </div>

              {/* Phone & Gender */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">{t('Phone Number')}</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                      <Phone size={18} />
                    </div>
                    <input
                      type="text"
                      name="phone"
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-white/70 border-2 border-slate-100 rounded-xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all font-medium text-slate-800 placeholder-slate-400 text-sm"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">{t('Gender')}</label>
                  <select
                    name="gender"
                    className="w-full px-3.5 py-2.5 bg-white/70 border-2 border-slate-100 rounded-xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all font-medium text-slate-800 text-sm"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="male">{t('Male')}</option>
                    <option value="female">{t('Female')}</option>
                    <option value="other">{t('Other')}</option>
                  </select>
                </div>
              </div>

              {/* Patient Only: Age */}
              {role === 'patient' && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">{t('Age')}</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                      <Calendar size={18} />
                    </div>
                    <input
                      type="number"
                      name="age"
                      required
                      min="1"
                      max="120"
                      className="w-full pl-10 pr-4 py-2.5 bg-white/70 border-2 border-slate-100 rounded-xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all font-medium text-slate-800 placeholder-slate-400 text-sm"
                      value={formData.age}
                      onChange={handleChange}
                      placeholder="e.g. 28"
                    />
                  </div>
                </div>
              )}

              {/* Doctor Only Fields */}
              {role === 'doctor' && (
                <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-3.5">
                  <div className="text-xs font-black uppercase text-blue-800 tracking-wider flex items-center gap-1.5">
                    <Award size={15} />
                    <span>{t('Doctor Credentials & Clinic Details')}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">{t('Specialization')}</label>
                      <select
                        name="specialization"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:border-blue-500 text-sm font-medium text-slate-800"
                        value={formData.specialization}
                        onChange={handleChange}
                      >
                        {SPECIALIZATIONS.map((spec) => (
                          <option key={spec} value={spec}>
                            {t(spec)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">{t('Qualification')}</label>
                      <input
                        type="text"
                        name="qualification"
                        required
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:border-blue-500 text-sm font-medium text-slate-800"
                        value={formData.qualification}
                        onChange={handleChange}
                        placeholder="e.g. MBBS, MD (Cardiology)"
                      />
                    </div>
                  </div>

                  {formData.specialization === 'Other' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">{t('Specify Specialization')}</label>
                      <input
                        type="text"
                        name="customSpecialization"
                        required
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:border-blue-500 text-sm font-medium text-slate-800"
                        value={formData.customSpecialization}
                        onChange={handleChange}
                        placeholder={t('Enter specialization')}
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">{t('Experience (Years)')}</label>
                      <div className="relative">
                        <input
                          type="number"
                          name="experience"
                          min="0"
                          max="60"
                          required
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:border-blue-500 text-sm font-medium text-slate-800"
                          value={formData.experience}
                          onChange={handleChange}
                          placeholder="5"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">{t('Consultation Fee (₹)')}</label>
                      <input
                        type="number"
                        name="consultationFee"
                        min="0"
                        required
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:border-blue-500 text-sm font-medium text-slate-800"
                        value={formData.consultationFee}
                        onChange={handleChange}
                        placeholder="600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">{t('Clinic / Hospital Name')}</label>
                    <input
                      type="text"
                      name="clinicName"
                      required
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:border-blue-500 text-sm font-medium text-slate-800"
                      value={formData.clinicName}
                      onChange={handleChange}
                      placeholder="e.g. MIOT International"
                    />
                  </div>
                </div>
              )}

              {/* Password */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">{t('Password')}</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    minLength="6"
                    autoComplete="new-password"
                    className="w-full pl-10 pr-11 py-2.5 bg-white/70 border-2 border-slate-100 rounded-xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all font-medium text-slate-800 placeholder-slate-400 text-sm"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder={t('Minimum 6 characters')}
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

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3.5 rounded-xl hover:scale-[1.01] hover:shadow-lg hover:shadow-blue-500/30 focus:ring-4 focus:ring-blue-100 transition-all flex justify-center items-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer text-sm"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    <span>{t('Registering...')}</span>
                  </>
                ) : role === 'doctor' ? (
                  t('Register as Doctor')
                ) : (
                  t('Create Patient Account')
                )}
              </button>
            </form>
          </>
        )}

        <p className="mt-6 text-center text-xs text-slate-500 font-medium">
          {t('Already have an account?')}{' '}
          <Link to="/login" className="text-blue-600 hover:text-blue-700 hover:underline font-bold transition-colors">
            {t('Log in here →')}
          </Link>
        </p>
      </div>
    </div>
  );
}
