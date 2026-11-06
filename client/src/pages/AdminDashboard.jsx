import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import { getSocket } from '../services/socket';
import LanguageSelector from '../components/LanguageSelector';
import {
  ShieldCheck, Users, Calendar, Stethoscope, CheckCircle2, XCircle,
  AlertCircle, Search, Filter, Plus, Trash2, Power, RefreshCw,
  Building, UserCheck, UserX, Clock, TrendingUp, ChevronLeft, ChevronRight,
  Award, Briefcase, MapPin, Mail, Phone, DollarSign, X, Check, ShieldAlert
} from 'lucide-react';

export default function AdminDashboard() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'users' | 'doctors' | 'appointments' | 'departments'
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ text: '', type: '' });

  // Dashboard Stats
  const [dashboardStats, setDashboardStats] = useState({
    stats: {
      totalPatients: 0,
      totalDoctors: 0,
      totalAppointments: 0,
      todaysAppointments: 0,
      completedToday: 0,
      cancelledToday: 0,
      waitingQueue: 0,
      pendingDoctors: 0,
      rejectedDoctors: 0,
    },
    weeklyData: [],
    monthlyData: [],
    statusDistribution: [],
  });

  // Doctor Registration Approval State
  const [doctorRequests, setDoctorRequests] = useState([]);
  const [doctorApprovalFilter, setDoctorApprovalFilter] = useState('pending'); // 'pending' | 'rejected' | 'all'
  const [rejectModal, setRejectModal] = useState({
    isOpen: false,
    request: null,
    reason: '',
  });

  // Users Management State
  const [users, setUsers] = useState([]);
  const [userRoleFilter, setUserRoleFilter] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [userPage, setUserPage] = useState(1);
  const [userPagination, setUserPagination] = useState({ total: 0, page: 1, pages: 1 });

  // Appointments Management State
  const [appointments, setAppointments] = useState([]);
  const [appointmentFilter, setAppointmentFilter] = useState('');
  const [appointmentPage, setAppointmentPage] = useState(1);

  // Departments State
  const [departments, setDepartments] = useState([]);
  const [newDepartmentName, setNewDepartmentName] = useState('');
  const [newDepartmentDesc, setNewDepartmentDesc] = useState('');
  const [isAddingDept, setIsAddingDept] = useState(false);

  // Status notification helper
  const showNotification = (text, type = 'success') => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage({ text: '', type: '' }), 4000);
  };

  // Fetch Stats
  const fetchDashboardStats = useCallback(async () => {
    try {
      const res = await api.get('/admin/dashboard');
      if (res.data?.data) {
        setDashboardStats(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard stats:', err);
    }
  }, []);

  // Fetch Pending Doctor Requests
  const fetchPendingDoctors = useCallback(async () => {
    try {
      const res = await api.get('/admin/pending-doctors', {
        params: { status: doctorApprovalFilter },
      });
      if (res.data?.data) {
        setDoctorRequests(res.data.data.requests || []);
      }
    } catch (err) {
      console.error('Failed to fetch doctor requests:', err);
    }
  }, [doctorApprovalFilter]);

  // Fetch Users
  const fetchUsers = useCallback(async () => {
    try {
      const params = {
        page: userPage,
        limit: 15,
        ...(userRoleFilter ? { role: userRoleFilter } : {}),
        ...(userSearch.trim() ? { search: userSearch.trim() } : {}),
      };
      const res = await api.get('/admin/users', { params });
      if (res.data?.data) {
        setUsers(res.data.data.users || []);
        setUserPagination(res.data.data.pagination || { total: 0, page: 1, pages: 1 });
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  }, [userPage, userRoleFilter, userSearch]);

  // Fetch Appointments
  const fetchAppointments = useCallback(async () => {
    try {
      const params = {
        page: appointmentPage,
        limit: 15,
        ...(appointmentFilter ? { status: appointmentFilter } : {}),
      };
      const res = await api.get('/admin/appointments', { params });
      if (res.data?.data) {
        setAppointments(res.data.data.appointments || []);
      }
    } catch (err) {
      console.error('Failed to fetch appointments:', err);
    }
  }, [appointmentPage, appointmentFilter]);

  // Fetch Departments
  const fetchDepartments = useCallback(async () => {
    try {
      const res = await api.get('/admin/departments');
      if (res.data?.data) {
        setDepartments(res.data.data.departments || []);
      }
    } catch (err) {
      console.error('Failed to fetch departments:', err);
    }
  }, []);

  // Load all initial data
  const loadAdminData = useCallback(async () => {
    setLoading(true);
    await Promise.all([
      fetchDashboardStats(),
      fetchPendingDoctors(),
      fetchUsers(),
      fetchAppointments(),
      fetchDepartments(),
    ]);
    setLoading(false);
  }, [fetchDashboardStats, fetchPendingDoctors, fetchUsers, fetchAppointments, fetchDepartments]);

  useEffect(() => {
    loadAdminData();
  }, [loadAdminData]);

  // Re-fetch doctor requests on filter change
  useEffect(() => {
    fetchPendingDoctors();
  }, [fetchPendingDoctors]);

  // Re-fetch users on filter / search changes
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Re-fetch appointments on filter change
  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // Real-time socket updates for doctor registrations
  useEffect(() => {
    const socket = getSocket();
    const handleNewDoc = () => {
      fetchPendingDoctors();
      fetchDashboardStats();
      showNotification('New doctor registration request received!', 'success');
    };
    const handleDocUpdate = () => {
      fetchPendingDoctors();
      fetchDashboardStats();
      fetchUsers();
    };

    socket.on('doctor:registration-requested', handleNewDoc);
    socket.on('doctor:status-updated', handleDocUpdate);

    return () => {
      socket.off('doctor:registration-requested', handleNewDoc);
      socket.off('doctor:status-updated', handleDocUpdate);
    };
  }, [fetchPendingDoctors, fetchDashboardStats, fetchUsers]);

  // Approve Doctor
  const handleApproveDoctor = async (id) => {
    setActionLoading(true);
    try {
      await api.put(`/admin/doctors/${id}/approve`);
      showNotification('Doctor registration approved! Doctor can now log in.', 'success');
      await Promise.all([fetchPendingDoctors(), fetchDashboardStats(), fetchUsers()]);
    } catch (err) {
      showNotification(err.response?.data?.message || 'Failed to approve doctor', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Reject Doctor
  const handleRejectDoctor = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!rejectModal.request) return;
    const id = rejectModal.request.user?._id || rejectModal.request._id;
    const finalReason = rejectModal.reason.trim() || 'Medical credentials could not be verified by hospital administration.';

    setActionLoading(true);
    try {
      await api.put(`/admin/doctors/${id}/reject`, { reason: finalReason });
      showNotification('Doctor registration request rejected.', 'success');
      setRejectModal({ isOpen: false, request: null, reason: '' });
      await Promise.all([fetchPendingDoctors(), fetchDashboardStats(), fetchUsers()]);
    } catch (err) {
      showNotification(err.response?.data?.message || 'Failed to reject doctor', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Doctor Registration
  const handleDeleteDoctor = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this doctor registration record?')) return;
    setActionLoading(true);
    try {
      await api.delete(`/admin/doctors/${id}/registration`);
      showNotification('Doctor registration record deleted.', 'success');
      await Promise.all([fetchPendingDoctors(), fetchDashboardStats(), fetchUsers()]);
    } catch (err) {
      showNotification(err.response?.data?.message || 'Failed to delete record', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Toggle User Active/Inactive
  const handleToggleUser = async (userId) => {
    setActionLoading(true);
    try {
      const res = await api.put(`/admin/users/${userId}/toggle-active`);
      showNotification(res.data?.message || 'User status updated', 'success');
      await fetchUsers();
    } catch (err) {
      showNotification(err.response?.data?.message || 'Failed to toggle status', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Create Department
  const handleCreateDepartment = async (e) => {
    e.preventDefault();
    if (!newDepartmentName.trim()) return;
    setActionLoading(true);
    try {
      await api.post('/admin/departments', {
        name: newDepartmentName.trim(),
        description: newDepartmentDesc.trim() || 'Specialised medical care and diagnostics',
      });
      setNewDepartmentName('');
      setNewDepartmentDesc('');
      setIsAddingDept(false);
      showNotification('Department created successfully', 'success');
      await fetchDepartments();
    } catch (err) {
      showNotification(err.response?.data?.message || 'Failed to create department', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Department
  const handleDeleteDepartment = async (id) => {
    if (!window.confirm('Are you sure you want to delete this department?')) return;
    setActionLoading(true);
    try {
      await api.delete(`/admin/departments/${id}`);
      showNotification('Department deleted', 'success');
      await fetchDepartments();
    } catch (err) {
      showNotification(err.response?.data?.message || 'Failed to delete department', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in">
      {/* Toast Alert */}
      {statusMessage.text && (
        <div
          className={`fixed top-20 right-6 z-50 p-4 rounded-2xl shadow-xl flex items-center gap-3 border text-sm font-semibold transition-all ${
            statusMessage.type === 'error'
              ? 'bg-red-50 text-red-700 border-red-200'
              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
          }`}
        >
          {statusMessage.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Admin Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white text-2xl font-black shadow-inner">
              <ShieldCheck size={32} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/30 text-blue-200 border border-blue-400/30 text-[11px] font-bold tracking-wide uppercase">
                  {t('Administrator Console')}
                </span>
                {dashboardStats.stats.pendingDoctors > 0 && (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/30 text-amber-200 border border-amber-400/30 text-[11px] font-bold">
                    {dashboardStats.stats.pendingDoctors} {t('Pending Approval')}
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-1">{t('SmartCare Central Control')}</h1>
              <p className="text-slate-300 text-xs sm:text-sm mt-0.5 font-medium">
                {t('Manage doctors, patients, departments, and system queues')}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              loadAdminData();
              showNotification(t('Data refreshed'), 'success');
            }}
            className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-xl backdrop-blur-sm border border-white/20 transition-all cursor-pointer flex items-center gap-2 text-xs font-bold"
          >
            <RefreshCw size={16} />
            <span>{t('Refresh')}</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10">
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-3 border border-white/10">
            <div className="text-xs text-slate-300 font-medium">Total Patients</div>
            <div className="text-2xl font-black mt-0.5 text-white">{dashboardStats.stats.totalPatients}</div>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-3 border border-white/10">
            <div className="text-xs text-slate-300 font-medium">Approved Doctors</div>
            <div className="text-2xl font-black mt-0.5 text-emerald-400">{dashboardStats.stats.totalDoctors}</div>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-3 border border-white/10">
            <div className="text-xs text-slate-300 font-medium">Today's Appointments</div>
            <div className="text-2xl font-black mt-0.5 text-amber-300">{dashboardStats.stats.todaysAppointments}</div>
          </div>
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-3 border border-white/10">
            <div className="text-xs text-slate-300 font-medium">Active In Queue</div>
            <div className="text-2xl font-black mt-0.5 text-blue-300">{dashboardStats.stats.waitingQueue}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'overview'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <TrendingUp size={16} />
          <span>{t('System Overview')}</span>
        </button>

        <button
          onClick={() => setActiveTab('doctors')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'doctors'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Stethoscope size={16} />
          <span>{t('Doctor Approvals')} ({dashboardStats.stats.pendingDoctors})</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'users'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Users size={16} />
          <span>{t('All Users')} ({userPagination.total})</span>
        </button>

        <button
          onClick={() => setActiveTab('appointments')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'appointments'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Calendar size={16} />
          <span>{t('Appointments')} ({dashboardStats.stats.totalAppointments})</span>
        </button>

        <button
          onClick={() => setActiveTab('departments')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'departments'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Building size={16} />
          <span>{t('Departments')} ({departments.length})</span>
        </button>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Weekly Appointments Breakdown */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
            <h3 className="font-black text-slate-800 text-base flex items-center gap-2">
              <TrendingUp size={18} className="text-blue-600" />
              <span>Weekly Appointments (Last 7 Days)</span>
            </h3>

            <div className="space-y-2 pt-2">
              {dashboardStats.weeklyData?.map((item) => (
                <div key={item.date} className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-600 w-24">
                    {item.day} ({item.date.slice(5)})
                  </span>
                  <div className="flex-1 mx-3 bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all"
                      style={{
                        width: `${Math.min(100, Math.max(5, (item.appointments / 20) * 100))}%`,
                      }}
                    />
                  </div>
                  <span className="font-bold text-slate-800 w-8 text-right">{item.appointments}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Today's Distribution */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-4">
            <h3 className="font-black text-slate-800 text-base flex items-center gap-2">
              <Clock size={18} className="text-indigo-600" />
              <span>Today's Consultation Status</span>
            </h3>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                <span className="text-[11px] font-bold text-emerald-800 uppercase">Completed</span>
                <p className="text-2xl font-black text-emerald-900 mt-1">{dashboardStats.stats.completedToday}</p>
              </div>

              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                <span className="text-[11px] font-bold text-blue-800 uppercase">Waiting / Next</span>
                <p className="text-2xl font-black text-blue-900 mt-1">{dashboardStats.stats.waitingQueue}</p>
              </div>

              <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100">
                <span className="text-[11px] font-bold text-rose-800 uppercase">Cancelled</span>
                <p className="text-2xl font-black text-rose-900 mt-1">{dashboardStats.stats.cancelledToday}</p>
              </div>

              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                <span className="text-[11px] font-bold text-amber-800 uppercase">Pending Approval</span>
                <p className="text-2xl font-black text-amber-900 mt-1">{dashboardStats.stats.pendingDoctors}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Doctor Approvals */}
      {activeTab === 'doctors' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-800">Doctor Registration Requests</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold text-xs">
                  {doctorRequests.length} Total
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Review credential submissions, clinical expertise, and approve or reject doctor registrations.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
              <button
                onClick={() => setDoctorApprovalFilter('pending')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  doctorApprovalFilter === 'pending'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Pending ({dashboardStats.stats.pendingDoctors || 0})
              </button>
              <button
                onClick={() => setDoctorApprovalFilter('rejected')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  doctorApprovalFilter === 'rejected'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Rejected ({dashboardStats.stats.rejectedDoctors || 0})
              </button>
              <button
                onClick={() => setDoctorApprovalFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  doctorApprovalFilter === 'all'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Requests
              </button>
            </div>
          </div>

          {doctorRequests.length === 0 ? (
            <div className="text-center py-20 px-4">
              <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 mx-auto mb-3 flex items-center justify-center shadow-inner">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="text-base font-bold text-slate-800">
                {doctorApprovalFilter === 'pending'
                  ? 'No Pending Doctor Requests'
                  : doctorApprovalFilter === 'rejected'
                  ? 'No Rejected Requests'
                  : 'No Doctor Requests Found'}
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                {doctorApprovalFilter === 'pending'
                  ? 'All doctor registrations have been reviewed. New submissions will appear here automatically.'
                  : 'There are currently no doctor applications under this filter.'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {doctorRequests.map((req) => {
                const docUser = req.user || {};
                const docProfile = req.doctor || {};
                const isPending = req.status === 'pending' || (!docUser.isApproved && req.status !== 'rejected');
                const isRejected = req.status === 'rejected' || docUser.approvalStatus === 'rejected';
                const isApproved = docUser.isApproved && !isRejected;

                return (
                  <div key={req._id} className="p-6 transition-colors hover:bg-slate-50/50 space-y-4">
                    {/* Top Row: Doctor Info & Badges */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-black shrink-0 shadow-xs ${
                            isRejected
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : isApproved
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-100 text-amber-900 border border-amber-200'
                          }`}
                        >
                          {docUser.name?.replace(/^Dr\.\s*/i, '').charAt(0) || 'D'}
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-black text-slate-900 text-base">
                              {docUser.name?.startsWith('Dr.') ? docUser.name : `Dr. ${docUser.name}`}
                            </h3>
                            {isPending && (
                              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200 text-[10px] font-black uppercase tracking-wider">
                                Pending Approval
                              </span>
                            )}
                            {isRejected && (
                              <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200 text-[10px] font-black uppercase tracking-wider">
                                Rejected
                              </span>
                            )}
                            {isApproved && (
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-black uppercase tracking-wider">
                                Approved & Active
                              </span>
                            )}
                            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold">
                              {docProfile.specialization || 'General Medicine'}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                            <span className="flex items-center gap-1">
                              <Mail size={13} className="text-slate-400" />
                              <span>{docUser.email}</span>
                            </span>
                            {docUser.phone && (
                              <span className="flex items-center gap-1">
                                <Phone size={13} className="text-slate-400" />
                                <span>{docUser.phone}</span>
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Clock size={13} className="text-slate-400" />
                              <span>Registered {new Date(req.createdAt || docUser.createdAt).toLocaleDateString()}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        {!isApproved && (
                          <button
                            onClick={() => handleApproveDoctor(docUser._id)}
                            disabled={actionLoading}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm hover:shadow cursor-pointer disabled:opacity-50"
                          >
                            <UserCheck size={15} />
                            <span>Approve Doctor</span>
                          </button>
                        )}

                        {!isRejected && (
                          <button
                            onClick={() =>
                              setRejectModal({
                                isOpen: true,
                                request: req,
                                reason: '',
                              })
                            }
                            disabled={actionLoading}
                            className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                          >
                            <UserX size={15} />
                            <span>Reject</span>
                          </button>
                        )}

                        {isRejected && (
                          <button
                            onClick={() => handleDeleteDoctor(docUser._id)}
                            disabled={actionLoading}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                            title="Delete Application"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Doctor Details Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50/70 p-3.5 rounded-2xl border border-slate-100 text-xs">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          Qualification
                        </span>
                        <span className="font-semibold text-slate-800">
                          {docProfile.qualification || 'MBBS'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          Experience
                        </span>
                        <span className="font-semibold text-slate-800">
                          {docProfile.experienceDisplay || `${docProfile.experience || 3}+ years`}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          Consultation Fee
                        </span>
                        <span className="font-semibold text-slate-800">
                          ₹{docProfile.consultationFee || 600}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          Clinic / Hospital
                        </span>
                        <span className="font-semibold text-slate-800 truncate block">
                          {docProfile.clinicName || 'SmartCare Clinic'}
                        </span>
                      </div>
                    </div>

                    {/* Bio or Rejection Reason Note */}
                    {isRejected && req.rejectionReason && (
                      <div className="p-3 bg-rose-50/80 border border-rose-100 rounded-xl text-xs text-rose-900 flex items-start gap-2">
                        <AlertCircle size={15} className="text-rose-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="font-bold">Rejection Reason:</strong>{' '}
                          <span>{req.rejectionReason}</span>
                        </div>
                      </div>
                    )}

                    {docProfile.bio && (
                      <p className="text-xs text-slate-500 italic">
                        "{docProfile.bio}"
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: All Users */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-slate-800">User Management</h2>
              <p className="text-xs text-slate-500">Search, filter, and manage platform user accounts</p>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              {/* Search */}
              <div className="relative flex-1 sm:w-64">
                <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search name or email..."
                  value={userSearch}
                  onChange={(e) => {
                    setUserSearch(e.target.value);
                    setUserPage(1);
                  }}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Role filter */}
              <select
                value={userRoleFilter}
                onChange={(e) => {
                  setUserRoleFilter(e.target.value);
                  setUserPage(1);
                }}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
              >
                <option value="">All Roles</option>
                <option value="patient">Patients</option>
                <option value="doctor">Doctors</option>
                <option value="admin">Admins</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Approval</th>
                  <th className="py-3 px-4">Joined</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800">{u.name}</div>
                      <div className="text-[11px] text-slate-400">{u.email}</div>
                    </td>
                    <td className="py-3.5 px-4 capitalize font-semibold text-slate-700">{u.role}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          u.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {u.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {u.role === 'doctor' ? (
                        u.isApproved ? (
                          <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full font-bold text-[10px]">
                            Approved
                          </span>
                        ) : u.approvalStatus === 'rejected' ? (
                          <div className="flex items-center gap-1.5">
                            <span className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-full font-bold text-[10px]">
                              Rejected
                            </span>
                            <button
                              onClick={() => handleApproveDoctor(u._id)}
                              className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold cursor-pointer"
                              title="Re-approve Doctor"
                            >
                              Approve
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleApproveDoctor(u._id)}
                              className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold cursor-pointer"
                              title="Approve Doctor"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() =>
                                setRejectModal({
                                  isOpen: true,
                                  request: { user: u },
                                  reason: '',
                                })
                              }
                              className="px-2 py-0.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-[10px] font-bold cursor-pointer"
                              title="Reject Doctor"
                            >
                              Reject
                            </button>
                          </div>
                        )
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleToggleUser(u._id)}
                        disabled={actionLoading}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                          u.isActive
                            ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        }`}
                      >
                        {u.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              Page {userPagination.page} of {userPagination.pages || 1} ({userPagination.total} users)
            </span>
            <div className="flex items-center gap-1">
              <button
                disabled={userPage <= 1}
                onClick={() => setUserPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-30 cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                disabled={userPage >= userPagination.pages}
                onClick={() => setUserPage((p) => p + 1)}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-30 cursor-pointer"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Appointments List */}
      {activeTab === 'appointments' && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-slate-800">Master Appointments Record</h2>
              <p className="text-xs text-slate-500">Real-time status of all hospital bookings</p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={appointmentFilter}
                onChange={(e) => setAppointmentFilter(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700"
              >
                <option value="">All Statuses</option>
                <option value="confirmed">Confirmed</option>
                <option value="checked-in">Checked In</option>
                <option value="in-consultation">In Consultation</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Token / ID</th>
                  <th className="py-3 px-4">Patient</th>
                  <th className="py-3 px-4">Doctor</th>
                  <th className="py-3 px-4">Date & Slot</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {appointments.map((apt) => (
                  <tr key={apt._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                      #{apt.tokenNumber || apt.appointmentId?.slice(-4) || '—'}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800">{apt.patient?.name || 'Patient'}</div>
                      <div className="text-[11px] text-slate-400">{apt.patient?.phone}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{apt.doctor?.name || 'Doctor'}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <div>{new Date(apt.date).toLocaleDateString()}</div>
                      <div className="text-[11px] text-slate-400">{apt.timeSlot?.start}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          apt.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : apt.status === 'cancelled'
                            ? 'bg-rose-100 text-rose-800'
                            : apt.status === 'in-consultation'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {apt.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 5: Departments */}
      {activeTab === 'departments' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-black text-slate-800">Medical Departments</h2>
                <p className="text-xs text-slate-500">Manage specialized clinical care departments</p>
              </div>
              <button
                onClick={() => setIsAddingDept(!isAddingDept)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus size={16} />
                <span>Add Department</span>
              </button>
            </div>

            {isAddingDept && (
              <form onSubmit={handleCreateDepartment} className="p-4 bg-slate-50 rounded-2xl space-y-3 mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Department Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rheumatology"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-blue-500"
                      value={newDepartmentName}
                      onChange={(e) => setNewDepartmentName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                    <input
                      type="text"
                      placeholder="Care description..."
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-blue-500"
                      value={newDepartmentDesc}
                      onChange={(e) => setNewDepartmentDesc(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 cursor-pointer disabled:opacity-50"
                  >
                    Save Department
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingDept(false)}
                    className="px-4 py-2 bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {departments.map((dept) => (
                <div
                  key={dept._id}
                  className="p-4 rounded-2xl border border-slate-100 hover:border-blue-200 bg-white transition-all shadow-xs flex items-start justify-between gap-3"
                >
                  <div>
                    <h4 className="font-bold text-sm text-slate-800">{dept.name}</h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{dept.description}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteDepartment(dept._id)}
                    className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer shrink-0"
                    title="Delete Department"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {rejectModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-rose-600">
                <ShieldAlert size={22} />
                <h3 className="font-black text-slate-900 text-base">Reject Doctor Registration</h3>
              </div>
              <button
                onClick={() => setRejectModal({ isOpen: false, request: null, reason: '' })}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Specify reason for declining registration for{' '}
              <strong>{rejectModal.request?.user?.name || 'this doctor'}</strong>. This explanation will be shown if they attempt to sign in.
            </p>

            {/* Quick Reason Presets */}
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                Quick Preset Reasons:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Medical license or credentials could not be verified',
                  'Incomplete specialization documentation',
                  'Hospital department quota currently fulfilled',
                  'Incorrect or unverifiable contact information',
                ].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setRejectModal((prev) => ({ ...prev, reason: preset }))}
                    className="text-[11px] px-2.5 py-1 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 rounded-lg font-medium transition-colors cursor-pointer text-left"
                  >
                    + {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Reason Textarea */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Reason / Explanation:
              </label>
              <textarea
                rows={3}
                required
                value={rejectModal.reason}
                onChange={(e) => setRejectModal((prev) => ({ ...prev, reason: e.target.value }))}
                placeholder="Enter explanation for rejection..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setRejectModal({ isOpen: false, request: null, reason: '' })}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRejectDoctor}
                disabled={actionLoading || !rejectModal.reason.trim()}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-rose-500/20 cursor-pointer disabled:opacity-50"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
