import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { getSocket, joinQueueRoom, leaveQueueRoom } from '../services/socket';
import {
  Stethoscope, Users, Calendar, Clock, CheckCircle2, ChevronRight,
  AlertCircle, Phone, Mail, Award, MapPin, Building, User,
  Volume2, Play, Check, X, Shield, RefreshCw, Edit3, Save,
  FileText, Activity, Filter, Eye
} from 'lucide-react';

export default function DoctorDashboard() {
  const { user, profile, fetchUser } = useAuth();

  const [activeTab, setActiveTab] = useState('queue'); // 'queue' | 'appointments' | 'schedule' | 'profile'
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ text: '', type: '' });

  // Queue state
  const [queueData, setQueueData] = useState({
    queue: [],
    summary: {
      currentlyConsulting: null,
      nextPatient: null,
      totalWaiting: 0,
      completedCount: 0,
      avgConsultationTime: 15,
    },
  });

  // Appointments state
  const [appointments, setAppointments] = useState([]);
  const [appointmentFilter, setAppointmentFilter] = useState('all'); // 'all' | 'today' | 'upcoming' | 'completed'

  // Selected Patient Details Modal
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Profile Form state
  const [profileForm, setProfileForm] = useState({
    specialization: '',
    qualification: '',
    experience: 0,
    consultationFee: 500,
    appointmentDuration: 60,
    clinicName: '',
    clinicAddress: '',
    bio: '',
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Schedule state
  const [schedule, setSchedule] = useState([]);

  // Fetch Queue Data
  const fetchQueue = useCallback(async () => {
    if (!user?._id) return;
    try {
      const res = await api.get(`/queue/${user._id}`);
      if (res.data?.data) {
        setQueueData(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching queue:', err);
    }
  }, [user?._id]);

  // Fetch Appointments
  const fetchAppointments = useCallback(async () => {
    try {
      const res = await api.get('/appointments');
      if (res.data?.data?.appointments) {
        setAppointments(res.data.data.appointments);
      }
    } catch (err) {
      console.error('Error fetching appointments:', err);
    }
  }, []);

  // Fetch Doctor Profile and Schedule
  const loadDoctorData = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([fetchQueue(), fetchAppointments()]);

      if (profile) {
        setProfileForm({
          specialization: profile.specialization || '',
          qualification: profile.qualification || '',
          experience: profile.experience || 0,
          consultationFee: profile.consultationFee || 500,
          appointmentDuration: profile.appointmentDuration || 60,
          clinicName: profile.clinicName || '',
          clinicAddress: profile.clinicAddress || '',
          bio: profile.bio || '',
        });
        if (profile.schedule) {
          setSchedule(profile.schedule);
        }
      }
    } catch (error) {
      console.error('Error loading doctor data:', error);
    } finally {
      setLoading(false);
    }
  }, [fetchQueue, fetchAppointments, profile]);

  useEffect(() => {
    loadDoctorData();
  }, [loadDoctorData]);

  // Socket.IO Real-time updates
  useEffect(() => {
    if (!user?._id) return;

    joinQueueRoom(user._id);
    const socket = getSocket();

    const handleQueueUpdate = () => {
      fetchQueue();
      fetchAppointments();
    };

    const handleSlotBooked = (data) => {
      // If the slot booking is for this doctor, refresh appointments
      if (data.doctor && data.doctor === user._id) {
        fetchAppointments();
      }
    };

    socket.on('queue:updated', handleQueueUpdate);
    socket.on('slot:booked', handleSlotBooked);

    return () => {
      leaveQueueRoom(user._id);
      socket.off('queue:updated', handleQueueUpdate);
      socket.off('slot:booked', handleSlotBooked);
    };
  }, [user?._id, fetchQueue, fetchAppointments]);

  // Show status banner with auto dismiss
  const showNotification = (text, type = 'success') => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage({ text: '', type: '' }), 4000);
  };

  // Call Next Patient
  const handleCallNext = async () => {
    if (!user?._id) return;
    setActionLoading(true);
    try {
      const res = await api.post(`/queue/${user._id}/next`);
      showNotification(res.data?.message || 'Next patient called successfully!', 'success');
      await Promise.all([fetchQueue(), fetchAppointments()]);
    } catch (err) {
      showNotification(err.response?.data?.message || 'Failed to call next patient', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Update Status for a queue entry
  const handleUpdateStatus = async (appointmentId, newStatus) => {
    setActionLoading(true);
    try {
      await api.put(`/queue/${appointmentId}/status`, { status: newStatus });
      showNotification(`Patient status updated to ${newStatus}`, 'success');
      await Promise.all([fetchQueue(), fetchAppointments()]);
    } catch (err) {
      showNotification(err.response?.data?.message || 'Failed to update status', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Save Doctor Profile Updates
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await api.put('/doctors/profile', profileForm);
      await fetchUser();
      setIsEditingProfile(false);
      showNotification('Profile updated successfully!', 'success');
    } catch (err) {
      showNotification(err.response?.data?.message || 'Failed to update profile', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Toggle Schedule Day Availability
  const handleToggleDay = async (dayIndex) => {
    const updated = [...schedule];
    updated[dayIndex].isAvailable = !updated[dayIndex].isAvailable;
    setSchedule(updated);

    try {
      await api.put('/doctors/schedule', { schedule: updated });
      showNotification('Schedule updated successfully', 'success');
    } catch (err) {
      showNotification('Failed to update schedule', 'error');
    }
  };

  // Filtered Appointments
  const filteredAppointments = appointments.filter((apt) => {
    const aptDate = new Date(apt.date).toDateString();
    const todayStr = new Date().toDateString();

    if (appointmentFilter === 'today') return aptDate === todayStr;
    if (appointmentFilter === 'upcoming') {
      return new Date(apt.date) >= new Date() && apt.status !== 'completed' && apt.status !== 'cancelled';
    }
    if (appointmentFilter === 'completed') return apt.status === 'completed';
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in">
      {/* Toast Alert */}
      {statusMessage.text && (
        <div
          className={`fixed top-20 right-6 z-50 p-4 rounded-2xl shadow-xl flex items-center gap-3 border text-sm font-semibold transition-all ${
            statusMessage.type === 'error'
              ? 'bg-red-50 text-red-700 border-red-200 shadow-red-200/50'
              : 'bg-emerald-50 text-emerald-800 border-emerald-200 shadow-emerald-200/50'
          }`}
        >
          {statusMessage.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white text-2xl font-black shadow-inner">
              {user?.name ? user.name.replace(/^Dr\.\s*/i, '').charAt(0) : 'D'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/30 text-blue-200 border border-blue-400/30 text-[11px] font-bold tracking-wide uppercase">
                  Doctor Console
                </span>
                <span className="flex items-center gap-1 text-[11px] text-emerald-300 font-semibold bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-400/20">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Live Sync
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-1">
                {user?.name?.startsWith('Dr.') ? user?.name : `Dr. ${user?.name || 'Doctor'}`}
              </h1>
              <p className="text-blue-100 text-xs sm:text-sm mt-0.5 flex items-center gap-2 font-medium">
                <span>{profile?.specialization || 'Specialist'}</span>
                <span>•</span>
                <span>{profile?.clinicName || 'SmartCare Hospital'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => {
                fetchQueue();
                fetchAppointments();
                showNotification('Data refreshed', 'success');
              }}
              className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-xl backdrop-blur-sm border border-white/20 transition-all cursor-pointer"
              title="Refresh Queue"
            >
              <RefreshCw size={18} />
            </button>
            <button
              onClick={handleCallNext}
              disabled={actionLoading}
              className="flex-1 sm:flex-none px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-900/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Volume2 size={18} />
              <span>Call Next Patient</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10">
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-3 border border-white/10">
            <div className="text-xs text-blue-200 font-medium">Waiting in Queue</div>
            <div className="text-2xl font-black mt-0.5 text-white">{queueData.summary.totalWaiting}</div>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-3 border border-white/10">
            <div className="text-xs text-blue-200 font-medium">In Consultation</div>
            <div className="text-2xl font-black mt-0.5 text-amber-300">
              {queueData.summary.currentlyConsulting ? `Token #${queueData.summary.currentlyConsulting.tokenNumber}` : 'None'}
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-3 border border-white/10">
            <div className="text-xs text-blue-200 font-medium">Completed Today</div>
            <div className="text-2xl font-black mt-0.5 text-emerald-300">{queueData.summary.completedCount}</div>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-3 border border-white/10">
            <div className="text-xs text-blue-200 font-medium">Avg Consultation</div>
            <div className="text-2xl font-black mt-0.5 text-white">{queueData.summary.avgConsultationTime} mins</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('queue')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'queue'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Users size={16} />
          <span>Patient Queue ({queueData.queue?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('appointments')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'appointments'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Calendar size={16} />
          <span>Appointments ({appointments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('schedule')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'schedule'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Clock size={16} />
          <span>Schedule & Availability</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'profile'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <User size={16} />
          <span>Profile & Clinic Settings</span>
        </button>
      </div>

      {/* Tab 1: Patient Queue */}
      {activeTab === 'queue' && (
        <div className="space-y-6">
          {/* Active Consultation Spotlight */}
          {queueData.summary.currentlyConsulting && (
            <div className="bg-amber-50 border-2 border-amber-200 rounded-3xl p-6 shadow-md relative overflow-hidden animate-in slide-in-from-top-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-amber-500 text-white flex flex-col items-center justify-center font-black shadow-lg shadow-amber-500/30">
                    <span className="text-[10px] tracking-wider uppercase font-semibold">Token</span>
                    <span className="text-2xl leading-none">#{queueData.summary.currentlyConsulting.tokenNumber}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 text-xs font-bold uppercase tracking-wider">
                        In Consultation Now
                      </span>
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mt-1">
                      {queueData.summary.currentlyConsulting.patient?.name || 'Patient'}
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5 flex items-center gap-2">
                      <span>Phone: {queueData.summary.currentlyConsulting.patient?.phone || 'N/A'}</span>
                      <span>•</span>
                      <span>
                        Reason: {queueData.summary.currentlyConsulting.appointment?.reason || 'General Consultation'}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => setSelectedPatient(queueData.summary.currentlyConsulting.patient)}
                    className="px-3.5 py-2.5 bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Eye size={15} />
                    <span>View Patient</span>
                  </button>
                  <button
                    onClick={() =>
                      handleUpdateStatus(queueData.summary.currentlyConsulting.appointment?._id, 'completed')
                    }
                    disabled={actionLoading}
                    className="flex-1 sm:flex-none px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <CheckCircle2 size={16} />
                    <span>Complete Consultation</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Queue List Table / Cards */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-800">Today's Patient Queue</h2>
                <p className="text-xs text-slate-500">Live order of checked-in patients</p>
              </div>
              <button
                onClick={handleCallNext}
                disabled={actionLoading || queueData.summary.totalWaiting === 0}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
              >
                <Play size={14} />
                <span>Call Next</span>
              </button>
            </div>

            {queueData.queue?.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users size={28} />
                </div>
                <h3 className="text-base font-bold text-slate-700">No Patients in Queue</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                  Patients will appear here automatically as soon as they check in for their appointments today.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {queueData.queue.map((entry) => {
                  const isCurrent = entry.status === 'in-consultation';
                  const isNext = entry.status === 'next';
                  const isCompleted = entry.status === 'completed';

                  return (
                    <div
                      key={entry._id}
                      className={`p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors ${
                        isCurrent
                          ? 'bg-amber-50/60'
                          : isNext
                          ? 'bg-blue-50/40'
                          : isCompleted
                          ? 'bg-slate-50/50 opacity-70'
                          : 'hover:bg-slate-50/80'
                      }`}
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div
                          className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center font-black shrink-0 ${
                            isCurrent
                              ? 'bg-amber-500 text-white'
                              : isNext
                              ? 'bg-blue-600 text-white'
                              : isCompleted
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          <span className="text-[9px] uppercase font-bold leading-none">Token</span>
                          <span className="text-lg leading-tight">#{entry.tokenNumber}</span>
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-800 text-sm truncate">
                              {entry.patient?.name || 'Patient'}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                                isCurrent
                                  ? 'bg-amber-100 text-amber-800'
                                  : isNext
                                  ? 'bg-blue-100 text-blue-700'
                                  : isCompleted
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {entry.status}
                            </span>
                          </div>
                          <div className="text-xs text-slate-500 flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-0.5">
                            <span>Phone: {entry.patient?.phone || 'N/A'}</span>
                            <span>•</span>
                            <span>Est. Wait: {entry.estimatedWaitTime || 0} mins</span>
                            <span>•</span>
                            <span>Slot: {entry.appointment?.timeSlot?.start || 'Standard'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        <button
                          onClick={() => setSelectedPatient(entry.patient)}
                          className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="View Patient Info"
                        >
                          <Eye size={16} />
                        </button>

                        {entry.status !== 'completed' && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(entry.appointment?._id, 'in-consultation')}
                              disabled={actionLoading}
                              className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                            >
                              Start
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(entry.appointment?._id, 'completed')}
                              disabled={actionLoading}
                              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                            >
                              Done
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(entry.appointment?._id, 'no-show')}
                              disabled={actionLoading}
                              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                            >
                              No-Show
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Appointments */}
      {activeTab === 'appointments' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-slate-800">Doctor's Appointments</h2>
              <p className="text-xs text-slate-500">View and manage upcoming consultations</p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
              {['all', 'today', 'upcoming', 'completed'].map((f) => (
                <button
                  key={f}
                  onClick={() => setAppointmentFilter(f)}
                  className={`px-3 py-1.5 rounded-lg capitalize transition-all cursor-pointer ${
                    appointmentFilter === f ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {filteredAppointments.length === 0 ? (
            <div className="text-center py-16 px-4">
              <Calendar size={32} className="mx-auto text-slate-300 mb-2" />
              <h3 className="text-sm font-bold text-slate-700">No appointments found</h3>
              <p className="text-xs text-slate-400 mt-0.5">There are no appointments matching this filter.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-4">Token / ID</th>
                    <th className="py-3 px-4">Patient</th>
                    <th className="py-3 px-4">Date & Slot</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Reason</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAppointments.map((apt) => (
                    <tr key={apt._id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-800">
                        <span className="px-2 py-1 rounded-lg bg-blue-50 text-blue-700 font-mono text-[11px]">
                          #{apt.tokenNumber || apt.appointmentId?.slice(-4) || '—'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800">{apt.patient?.name || 'Patient'}</div>
                        <div className="text-[11px] text-slate-400">{apt.patient?.phone || apt.patient?.email}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-700">{new Date(apt.date).toLocaleDateString()}</div>
                        <div className="text-[11px] text-slate-400">
                          {apt.timeSlot?.start} – {apt.timeSlot?.end}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            apt.status === 'completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : apt.status === 'in-consultation'
                              ? 'bg-amber-100 text-amber-800'
                              : apt.status === 'checked-in'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {apt.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">{apt.reason || 'General Checkup'}</td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedPatient(apt.patient)}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Schedule & Availability */}
      {activeTab === 'schedule' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-6">
          <div>
            <h2 className="text-lg font-black text-slate-800">Weekly Schedule & Working Days</h2>
            <p className="text-xs text-slate-500">Toggle your active days to allow or pause appointment booking</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {schedule.map((dayPlan, index) => {
              const isAvailable = dayPlan.isAvailable;
              return (
                <div
                  key={dayPlan.day}
                  className={`p-4 rounded-2xl border transition-all ${
                    isAvailable ? 'bg-white border-blue-200 shadow-xs' : 'bg-slate-50 border-slate-200 opacity-70'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-black text-sm capitalize text-slate-800">{dayPlan.day}</h4>
                      <p className="text-[11px] text-slate-500">
                        {isAvailable ? 'Working (09:30 AM – 09:30 PM)' : 'Off / Holiday'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggleDay(index)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                        isAvailable
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                      }`}
                    >
                      {isAvailable ? 'Available' : 'Paused'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-100 text-xs text-blue-900 space-y-1">
            <strong>Standard Consultation Timings:</strong>
            <p className="text-blue-800">
              Slots run in 1-hour windows from 9:30 AM to 9:30 PM with break times (12:30 PM – 1:30 PM Lunch and 5:00 PM – 5:30 PM Refreshment). Sundays are designated off.
            </p>
          </div>
        </div>
      )}

      {/* Tab 4: Profile & Clinic Settings */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-black text-slate-800">Doctor Profile Information</h2>
              <p className="text-xs text-slate-500">Update your clinical qualifications, fees, and location details</p>
            </div>
            {!isEditingProfile && (
              <button
                onClick={() => setIsEditingProfile(true)}
                className="px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Edit3 size={15} />
                <span>Edit Profile</span>
              </button>
            )}
          </div>

          {isEditingProfile ? (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Specialization</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:border-blue-500"
                    value={profileForm.specialization}
                    onChange={(e) => setProfileForm({ ...profileForm, specialization: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Qualifications</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:border-blue-500"
                    value={profileForm.qualification}
                    onChange={(e) => setProfileForm({ ...profileForm, qualification: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Experience (Years)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:border-blue-500"
                    value={profileForm.experience}
                    onChange={(e) => setProfileForm({ ...profileForm, experience: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Consultation Fee (₹)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:border-blue-500"
                    value={profileForm.consultationFee}
                    onChange={(e) => setProfileForm({ ...profileForm, consultationFee: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Slot Duration (Mins)</label>
                  <input
                    type="number"
                    min="15"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:border-blue-500"
                    value={profileForm.appointmentDuration}
                    onChange={(e) => setProfileForm({ ...profileForm, appointmentDuration: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Clinic / Hospital Name</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:border-blue-500"
                    value={profileForm.clinicName}
                    onChange={(e) => setProfileForm({ ...profileForm, clinicName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Clinic Address</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:border-blue-500"
                    value={profileForm.clinicAddress}
                    onChange={(e) => setProfileForm({ ...profileForm, clinicAddress: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Professional Bio</label>
                <textarea
                  rows="3"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:outline-none focus:border-blue-500"
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-blue-500/20 cursor-pointer disabled:opacity-50"
                >
                  <Save size={15} />
                  <span>Save Changes</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-2xl space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Qualifications</span>
                <p className="text-sm font-bold text-slate-800">{profile?.qualification || 'MBBS'}</p>
                <p className="text-slate-600">{profile?.specialization || 'General Medicine'}</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Consultation Fee</span>
                <p className="text-sm font-bold text-emerald-700">₹{profile?.consultationFee || 500} per consultation</p>
                <p className="text-slate-600">{profile?.experience || 0} years professional experience</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl space-y-2 sm:col-span-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Clinic Location</span>
                <p className="text-sm font-bold text-slate-800">{profile?.clinicName || 'SmartCare Clinic'}</p>
                <p className="text-slate-600">{profile?.clinicAddress || 'Address on file'}</p>
              </div>

              {profile?.bio && (
                <div className="p-4 bg-slate-50 rounded-2xl space-y-2 sm:col-span-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Biography</span>
                  <p className="text-slate-700 leading-relaxed">{profile.bio}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Patient Detail Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  {selectedPatient.name?.charAt(0) || 'P'}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">{selectedPatient.name}</h3>
                  <p className="text-[11px] text-slate-400">Patient Details</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPatient(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-400">Email:</span>
                <span className="font-semibold text-slate-700">{selectedPatient.email || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-400">Phone:</span>
                <span className="font-semibold text-slate-700">{selectedPatient.phone || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-400">Gender:</span>
                <span className="font-semibold text-slate-700 capitalize">{selectedPatient.gender || 'N/A'}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-400">Age:</span>
                <span className="font-semibold text-slate-700">{selectedPatient.age || 'N/A'} years</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setSelectedPatient(null)}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
