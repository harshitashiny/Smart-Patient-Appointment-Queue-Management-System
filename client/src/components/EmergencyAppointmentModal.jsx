import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AlertTriangle, Flame, Phone, MapPin, Clock, CheckCircle2,
  X, Loader2, HeartPulse, ShieldAlert, Navigation, ArrowRight
} from 'lucide-react';
import api from '../services/api';

const EMERGENCY_CATEGORIES = [
  { id: 'cardiac', label: 'Chest Pain / Cardiac Emergency', icon: '🫀', severity: 'Immediate' },
  { id: 'trauma', label: 'Severe Trauma / Accident / Fracture', icon: '🩸', severity: 'Immediate' },
  { id: 'respiratory', label: 'Acute Breathing Distress / Asthma', icon: '🫁', severity: 'Immediate' },
  { id: 'pediatric', label: 'Pediatric Emergency (Infant / Child)', icon: '👶', severity: 'Urgent' },
  { id: 'stroke', label: 'Sudden Numbness / Stroke / Weakness', icon: '🧠', severity: 'Immediate' },
  { id: 'abdominal', label: 'Acute Severe Pain / Bleeding', icon: '⚡', severity: 'Urgent' },
  { id: 'general', label: 'Other Critical Medical Emergency', icon: '🚨', severity: 'High' },
];

export default function EmergencyAppointmentModal({ isOpen, onClose, onSuccess, initialDoctorId = '' }) {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState(EMERGENCY_CATEGORIES[0].id);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState(initialDoctorId || '');
  const [symptoms, setSymptoms] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bookingResult, setBookingResult] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setBookingResult(null);
      setError('');
      // Fetch available approved doctors
      api.get('/doctors')
        .then((res) => {
          if (res.data?.data?.doctors) {
            setDoctors(res.data.data.doctors);
          }
        })
        .catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const categoryObj = EMERGENCY_CATEGORIES.find((c) => c.id === selectedCategory);

    try {
      const payload = {
        doctor: selectedDoctorId || undefined,
        emergencyType: categoryObj ? categoryObj.label : 'General Medical Emergency',
        reason: symptoms.trim() || (categoryObj ? categoryObj.label : 'Emergency Care'),
        notes: symptoms.trim(),
        phone: contactPhone.trim(),
      };

      const res = await api.post('/appointments/emergency', payload);
      setBookingResult(res.data?.data);
      if (onSuccess) {
        onSuccess(res.data?.data);
      }
    } catch (err) {
      console.error('Emergency booking error:', err);
      setError(err.response?.data?.message || t('Failed to book emergency appointment. Please call emergency hotline 10 57 10 immediately.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border-2 border-red-500/30 my-auto animate-in zoom-in-95">
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white p-5 sm:p-6 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white text-xl animate-pulse">
                🚨
              </div>
              <div>
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-black uppercase tracking-wider">
                  {t('24x7 Fast-Track Emergency')}
                </span>
                <h3 className="text-xl font-black tracking-tight leading-tight mt-0.5">
                  {t('Emergency Patient Care')}
                </h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
          <p className="text-red-100 text-xs mt-2 font-medium">
            {t('Immediate priority triage and instant token generation for urgent medical conditions at MIOT International.')}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5">
          {bookingResult ? (
            /* Success confirmation card */
            <div className="text-center space-y-4 animate-in fade-in">
              <div className="w-16 h-16 rounded-3xl bg-red-100 text-red-600 mx-auto flex items-center justify-center shadow-inner">
                <CheckCircle2 size={38} />
              </div>

              <div>
                <span className="px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-black uppercase tracking-wider">
                  {t('Emergency Token Allocated')}
                </span>
                <h4 className="text-2xl font-black text-slate-900 mt-2">
                  #{bookingResult.appointment?.tokenNumber || '1'} · {bookingResult.appointment?.appointmentId}
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  {t('Assigned Specialist:')}{' '}
                  <strong className="text-slate-800">
                    Dr. {bookingResult.appointment?.doctor?.name || 'On-Duty Emergency Consultant'}
                  </strong>
                </p>
              </div>

              {/* Triage Guidance Card */}
              <div className="p-4 bg-red-50 rounded-2xl border border-red-200 text-left text-xs space-y-2.5 text-red-900">
                <div className="flex items-center gap-2 font-black text-red-800 text-sm">
                  <ShieldAlert size={18} className="text-red-600 shrink-0" />
                  <span>{t('Immediate Hospital Triage Instructions')}</span>
                </div>
                <p className="text-xs leading-relaxed">
                  {t('1. Please proceed immediately to the')} <strong>{t('MIOT Emergency Trauma & Critical Care Center')}</strong>.
                </p>
                <p className="text-xs leading-relaxed">
                  {t('2. Present this Emergency Token')} (<strong>#{bookingResult.appointment?.tokenNumber}</strong>) {t('at the reception desk for instant zero-wait intake.')}
                </p>
                <div className="pt-2 border-t border-red-200/80 flex items-center justify-between text-xs">
                  <span>🚨 {t('Direct ER Desk Hotline:')}</span>
                  <a href="tel:105710" className="font-black text-base text-red-700 underline">
                    10 57 10
                  </a>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                <a
                  href="https://www.google.com/maps/dir/?api=1&destination=13.0266079,80.1761188"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Navigation size={15} />
                  <span>{t('Hospital Navigation (GPS)')} ↗</span>
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  {t('View in My Dashboard')}
                </button>
              </div>
            </div>
          ) : (
            /* Booking Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold flex items-start gap-2">
                  <AlertTriangle size={16} className="text-red-600 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Emergency Category */}
              <div>
                <label className="block text-xs font-black uppercase text-slate-700 tracking-wider mb-2">
                  {t('Select Emergency Condition:')}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  {EMERGENCY_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`p-2.5 rounded-xl border text-left flex items-center gap-2 text-xs transition-all cursor-pointer ${
                        selectedCategory === cat.id
                          ? 'bg-red-50/90 border-red-500 text-red-950 font-bold shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-lg">{cat.icon}</span>
                      <div className="flex-1 min-w-0">
                        <span className="truncate block font-bold leading-tight">{t(cat.label)}</span>
                        <span className="text-[10px] text-red-600 font-semibold">{t(cat.severity)}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Doctor Selection (Optional / Auto) */}
              <div>
                <label className="block text-xs font-black uppercase text-slate-700 tracking-wider mb-1">
                  {t('Specialist On-Call:')}
                </label>
                <select
                  value={selectedDoctorId}
                  onChange={(e) => setSelectedDoctorId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-red-500"
                >
                  <option value="">
                    ⚡ {t('Auto-assign Next Available Emergency Specialist (Recommended / Fastest)')}
                  </option>
                  {doctors.map((d) => (
                    <option key={d._id} value={d.user?._id || d._id}>
                      Dr. {d.user?.name || d.name} — {d.specialization} ({d.qualification})
                    </option>
                  ))}
                </select>
              </div>

              {/* Symptoms / Emergency Details */}
              <div>
                <label className="block text-xs font-black uppercase text-slate-700 tracking-wider mb-1">
                  {t('Symptoms / Vital Details:')}
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder={t('Describe emergency condition (e.g., severe chest tightness since 20 mins, high fever, accident fracture)...')}
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:border-red-500"
                />
              </div>

              {/* Emergency Contact Phone */}
              <div>
                <label className="block text-xs font-black uppercase text-slate-700 tracking-wider mb-1">
                  {t('Patient Emergency Phone Number:')}
                </label>
                <div className="relative">
                  <Phone size={14} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  {t('Cancel')}
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-red-500/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>{t('Registering Emergency Priority...')}</span>
                    </>
                  ) : (
                    <>
                      <span>🚨</span>
                      <span>{t('Confirm Emergency Appointment')}</span>
                    </>
                  )}
                </button>
              </div>

              {/* 24/7 Phone Warning */}
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 flex items-center justify-between">
                <span>{t('For ambulance or immediate life support, call:')}</span>
                <a href="tel:105710" className="font-black text-red-700 underline flex items-center gap-1">
                  <Phone size={12} />
                  <span>10 57 10</span>
                </a>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
