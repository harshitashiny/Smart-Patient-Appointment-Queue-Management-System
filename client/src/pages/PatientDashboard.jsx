import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const formatTime = (timeStr) => {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hr = h % 12 || 12;
  return `${hr}:${m.toString().padStart(2, '0')} ${ampm}`;
};

const formatDate = (dateStr, lang = 'en') => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const localeMap = {
    en: 'en-IN',
    ta: 'ta-IN',
    te: 'te-IN',
    hi: 'hi-IN',
  };
  return d.toLocaleDateString(localeMap[lang] || 'en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
};

const StatusBadge = ({ status }) => {
  const { t } = useTranslation();
  const normalized = (status || '').toLowerCase().trim();
  const colorMap = {
    confirmed: 'bg-emerald-100 text-emerald-700',
    pending: 'bg-amber-100 text-amber-700',
    'checked-in': 'bg-blue-100 text-blue-700',
    waiting: 'bg-purple-100 text-purple-700',
    'in-consultation': 'bg-indigo-100 text-indigo-700',
    completed: 'bg-slate-100 text-slate-600',
    cancelled: 'bg-red-100 text-red-600',
    'no-show': 'bg-gray-100 text-gray-500',
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-bold tracking-wide shadow-xs ${colorMap[normalized] || 'bg-slate-100 text-slate-500'}`}>
      {t(normalized) || status}
    </span>
  );
};

export default function PatientDashboard() {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [dashData, setDashData] = useState(null);
  const [dismissedReminders, setDismissedReminders] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('dismissedReminders') || '[]');
    } catch { return []; }
  });

  const fetchDashboard = useCallback(async () => {
    try {
      const res = await api.get('/patients/dashboard');
      setDashData(res.data.data);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
    // Refresh every 60 seconds for real-time updates
    const interval = setInterval(fetchDashboard, 60000);
    return () => clearInterval(interval);
  }, [fetchDashboard]);

  const dismissReminder = (appointmentId) => {
    const updated = [...dismissedReminders, appointmentId];
    setDismissedReminders(updated);
    localStorage.setItem('dismissedReminders', JSON.stringify(updated));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 font-medium">{t('Loading dashboard...')}</p>
        </div>
      </div>
    );
  }

  const upcomingCount = dashData?.upcomingCount || 0;
  const recordsCount = dashData?.recordsCount || 0;
  const pastCount = dashData?.pastCount || 0;
  const upcoming = dashData?.upcomingAppointments || [];
  const recentActivity = dashData?.recentActivity || [];
  const reminders = (dashData?.reminders || []).filter(
    (r) => !dismissedReminders.includes(r.appointmentId)
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">{t('Patient Dashboard')}</h1>
          <p className="text-slate-500 mt-1 font-medium">{t('Manage your appointments and track your queue in real-time.')}</p>
        </div>
        <button
          onClick={() => navigate('/patient/search')}
          className="group relative px-6 py-3 font-semibold text-white rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300 cursor-pointer"
        >
          <span className="relative z-10 flex items-center gap-2">
            {t('Book Appointment')}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
          </span>
        </button>
      </div>

      {/* Reminders Banner */}
      {reminders.length > 0 && (
        <div className="mb-6 space-y-3">
          {reminders.map((reminder, idx) => (
            <div
              key={reminder.appointmentId || idx}
              className={`rounded-2xl p-4 flex items-start gap-4 shadow-sm border animate-in slide-in-from-top-2 ${
                reminder.reminderType === 'today'
                  ? 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200'
                  : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'
              }`}
            >
              <div className={`p-2.5 rounded-xl flex-shrink-0 ${
                reminder.reminderType === 'today' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
              }`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-bold text-sm ${
                  reminder.reminderType === 'today' ? 'text-amber-800' : 'text-blue-800'
                }`}>
                  {reminder.reminderType === 'today' ? `⏰ ${t('Today\'s Appointment')}` : `📅 ${t('Tomorrow\'s Appointment')}`}
                </p>
                <p className={`text-sm mt-0.5 ${
                  reminder.reminderType === 'today' ? 'text-amber-700' : 'text-blue-700'
                }`}>
                  {reminder.reminderType === 'today' ? (
                    <span>
                      {t('You have an appointment today at')} <span className="font-bold font-mono">{formatTime(reminder.timeSlot?.start)}</span> {t('with')} <span className="font-bold">{t(reminder.doctor?.name)}</span>
                    </span>
                  ) : reminder.reminderType === 'tomorrow' ? (
                    <span>
                      {t('Reminder: You have an appointment tomorrow at')} <span className="font-bold font-mono">{formatTime(reminder.timeSlot?.start)}</span> {t('with')} <span className="font-bold">{t(reminder.doctor?.name)}</span>
                    </span>
                  ) : (
                    <span>
                      {t('Upcoming appointment on')} {formatDate(reminder.date, i18n.language)} {t('at')} <span className="font-bold font-mono">{formatTime(reminder.timeSlot?.start)}</span> {t('with')} <span className="font-bold">{t(reminder.doctor?.name)}</span>
                    </span>
                  )}
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs">
                  <span className="font-mono font-bold">{formatTime(reminder.timeSlot?.start)} - {formatTime(reminder.timeSlot?.end)}</span>
                  {reminder.doctor?.hospitalPhone && (
                    <a href={`tel:${reminder.doctor.hospitalPhone}`} className="flex items-center gap-1 hover:underline text-blue-600 font-semibold">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                      {reminder.doctor.hospitalPhone}
                    </a>
                  )}
                </div>
              </div>
              <button
                onClick={() => dismissReminder(reminder.appointmentId)}
                className="text-slate-400 hover:text-slate-600 p-1 flex-shrink-0 cursor-pointer"
                title={t('Dismiss')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Upcoming */}
        <div className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-md border border-slate-100/60 flex flex-col items-start gap-5 transition-shadow duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" x2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-2xl text-blue-600 shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" x2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/></svg>
          </div>
          <div>
            <h3 className="text-slate-500 text-sm font-semibold tracking-wide uppercase">{t('Upcoming')}</h3>
            <p className="text-4xl font-black text-slate-800 mt-1">{upcomingCount}</p>
          </div>
        </div>

        {/* Medical Records */}
        <div className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-md border border-slate-100/60 flex flex-col items-start gap-5 transition-shadow duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          </div>
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-2xl text-indigo-600 shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/></svg>
          </div>
          <div>
            <h3 className="text-slate-500 text-sm font-semibold tracking-wide uppercase">{t('Medical Records')}</h3>
            <p className="text-4xl font-black text-slate-800 mt-1">{recordsCount}</p>
          </div>
        </div>

        {/* Completed */}
        <div className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-md border border-slate-100/60 flex flex-col items-start gap-5 transition-shadow duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-2xl text-emerald-600 shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <div>
            <h3 className="text-slate-500 text-sm font-semibold tracking-wide uppercase">{t('Completed')}</h3>
            <p className="text-4xl font-black text-emerald-600 mt-1">{pastCount}</p>
          </div>
        </div>
      </div>

      {/* Upcoming Appointments List */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100/60 p-6 md:p-8 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-blue-500"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
            {t('Upcoming Appointments')}
          </h2>
        </div>

        {upcoming.length === 0 ? (
          <div className="text-slate-400 py-16 flex flex-col items-center justify-center text-sm bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-4 text-slate-300"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
            <p className="font-semibold text-slate-500 mb-1">{t('No upcoming appointments')}</p>
            <p className="text-slate-400">{t('Book an appointment to get started')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {upcoming.map((appt) => (
              <div
                key={appt._id}
                className="bg-gradient-to-r from-slate-50 to-white rounded-2xl p-5 border border-slate-100 hover:shadow-md hover:border-blue-200 transition-all duration-300 group"
              >
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                  {/* Doctor Info */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0">
                      {appt.doctor?.name?.replace(/^(Dr\.|Dr)\s*/i, '').charAt(0) || '?'}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-800 text-sm truncate">{t(appt.doctor?.name)}</h4>
                      <p className="text-xs text-slate-500 font-semibold">{t(appt.doctor?.specialization)}</p>
                      {appt.doctor?.designation && (
                        <p className="text-xs text-blue-600 font-medium line-clamp-1">{t(appt.doctor.designation)}</p>
                      )}
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-center">
                      <p className="text-xs text-slate-400 font-semibold uppercase">{t('Date')}</p>
                      <p className="font-bold text-slate-700">{formatDate(appt.date, i18n.language)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-slate-400 font-semibold uppercase">{t('Time')}</p>
                      <p className="font-bold text-slate-700 font-mono">{formatTime(appt.timeSlot?.start)} - {formatTime(appt.timeSlot?.end)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-slate-400 font-semibold uppercase">{t('Token')}</p>
                      <p className="font-bold text-blue-600">#{appt.tokenNumber || '-'}</p>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-center gap-3">
                    <StatusBadge status={appt.status} />
                  </div>
                </div>

                {/* Doctor Contact Row */}
                <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                  {appt.doctor?.hospitalPhone && (
                    <a href={`tel:${appt.doctor.hospitalPhone}`} className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                      <span className="font-semibold">{t('Hospital')}: {appt.doctor.hospitalPhone}</span>
                    </a>
                  )}
                  {appt.doctor?.clinicName && (
                    <span className="flex items-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                      {t(appt.doctor.clinicName)}
                    </span>
                  )}
                  {appt.reason && (
                    <span className="flex items-center gap-1.5 italic">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                      {t('Reason')}: {t(appt.reason)}
                    </span>
                  )}
                  <span className="text-xs font-mono text-slate-400">ID: {appt.appointmentId}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100/60 p-6 md:p-8 overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800">{t('Recent Activity')}</h2>
        </div>

        {recentActivity.length === 0 ? (
          <div className="text-slate-400 py-12 flex flex-col items-center justify-center text-sm bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-3 text-slate-300"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            {t('No recent activity to show.')}
          </div>
        ) : (
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div key={activity._id} className="flex items-center gap-4 py-3 px-4 rounded-xl hover:bg-slate-50 transition-colors">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm flex-shrink-0 ${
                  activity.status === 'completed' ? 'bg-emerald-500' :
                  activity.status === 'cancelled' ? 'bg-red-400' :
                  activity.status === 'confirmed' ? 'bg-blue-500' :
                  'bg-slate-400'
                }`}>
                  {activity.status === 'completed' ? '✓' : activity.status === 'cancelled' ? '✕' : '●'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-700 truncate">
                    {t('Appointment with')} {t(activity.doctor?.name) || t('Doctor')}
                  </p>
                  <p className="text-xs text-slate-400">
                    {formatDate(activity.date, i18n.language)} · {formatTime(activity.timeSlot?.start)}
                  </p>
                </div>
                <StatusBadge status={activity.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
