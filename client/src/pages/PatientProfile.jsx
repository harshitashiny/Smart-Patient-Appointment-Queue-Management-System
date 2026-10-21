import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import LanguageSelector from '../components/LanguageSelector';

const PatientProfile = () => {
  const { user, fetchUser } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    gender: 'male',
    phone: '',
    preferredLang: 'en'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        age: user.age || '',
        gender: user.gender || 'male',
        phone: user.phone || '',
        preferredLang: user.preferredLang || 'en'
      });
      if (user.avatar) {
        setAvatarPreview(
          user.avatar.startsWith('http')
            ? user.avatar
            : `http://localhost:5000${user.avatar}`
        );
      }
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      await api.put('/users/profile', {
        name: formData.name,
        age: formData.age ? Number(formData.age) : undefined,
        gender: formData.gender,
        phone: formData.phone,
        preferredLang: formData.preferredLang
      });
      
      // Update local context
      if (fetchUser) await fetchUser();
      setMessage(t('Profile updated successfully!'));
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || t('Failed to update profile'));
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError(t('Only image files (JPEG, PNG, GIF, WebP) are allowed'));
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError(t('Image must be less than 5MB'));
      return;
    }

    // Show preview immediately
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);

    // Upload
    setUploadingAvatar(true);
    setError('');
    setMessage('');

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('avatar', file);

      const res = await api.post('/users/avatar', formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const avatarUrl = res.data?.data?.avatar;
      if (avatarUrl) {
        setAvatarPreview(
          avatarUrl.startsWith('http')
            ? avatarUrl
            : `http://localhost:5000${avatarUrl}`
        );
      }

      if (fetchUser) await fetchUser();
      setMessage(t('Profile photo updated!'));
    } catch (err) {
      setError(err.response?.data?.message || t('Failed to upload photo'));
      // Revert preview
      if (user?.avatar) {
        setAvatarPreview(
          user.avatar.startsWith('http')
            ? user.avatar
            : `http://localhost:5000${user.avatar}`
        );
      } else {
        setAvatarPreview(null);
      }
    } finally {
      setUploadingAvatar(false);
      // Reset file input so the same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveAvatar = async () => {
    setUploadingAvatar(true);
    setError('');
    setMessage('');

    try {
      await api.delete('/users/avatar');
      setAvatarPreview(null);
      if (fetchUser) await fetchUser();
      setMessage(t('Profile photo removed'));
    } catch (err) {
      setError(err.response?.data?.message || t('Failed to remove photo'));
    } finally {
      setUploadingAvatar(false);
    }
  };

  const userInitial = formData.name?.trim()?.charAt(0)?.toUpperCase() || 'P';
  const roleDisplay = user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Patient';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header Bar */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/patient/home')}
            className="w-10 h-10 bg-white shadow-sm border border-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </button>
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">{t('Patient Profile')}</h1>
            <p className="text-sm text-slate-500 font-medium">{t('Manage your personal details and healthcare preferences')}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <LanguageSelector />
          {!isEditing && (
            <button 
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-105 transition-all cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              {t('Edit Profile')}
            </button>
          )}
        </div>
      </div>

      {message && (
        <div className="mb-6 bg-emerald-50 text-emerald-700 p-4 rounded-2xl text-sm font-semibold border border-emerald-200 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          {message}
        </div>
      )}
      {error && (
        <div className="mb-6 bg-rose-50 text-rose-700 p-4 rounded-2xl text-sm font-semibold border border-rose-200 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          {error}
        </div>
      )}

      {/* Profile Card Banner */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden mb-8">
        <div className="h-28 bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 relative">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        </div>
        <div className="px-8 pb-8 pt-0 relative flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 -mt-12">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            {/* ═══ Avatar with Upload ═══ */}
            <div className="relative group">
              <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-lg shadow-blue-500/10">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt={formData.name || 'User'}
                    className="w-full h-full rounded-xl object-cover"
                    onError={() => setAvatarPreview(null)}
                  />
                ) : (
                  <div className="w-full h-full rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-3xl shadow-inner">
                    {userInitial}
                  </div>
                )}
              </div>

              {/* Upload overlay on hover */}
              <button
                type="button"
                onClick={handleAvatarClick}
                disabled={uploadingAvatar}
                className="absolute inset-0 rounded-2xl bg-black/0 group-hover:bg-black/40 flex items-center justify-center transition-all duration-200 cursor-pointer"
                title={t('Change profile photo')}
              >
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center gap-1">
                  {uploadingAvatar ? (
                    <svg className="animate-spin w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                        <circle cx="12" cy="13" r="4"/>
                      </svg>
                      <span className="text-[10px] font-bold text-white tracking-wide">{t('CHANGE')}</span>
                    </>
                  )}
                </div>
              </button>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                onChange={handleAvatarChange}
                className="hidden"
              />

              {/* Remove avatar button (shown when avatar exists) */}
              {avatarPreview && !uploadingAvatar && (
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  className="absolute -top-1 -right-1 w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-rose-600 shadow-md cursor-pointer"
                  title={t('Remove photo')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              )}
            </div>

            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h2 className="text-2xl font-black text-slate-800">{formData.name ? (t(formData.name) || formData.name) : t('User')}</h2>
                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {t(roleDisplay)}
                </span>
              </div>
              <p className="text-slate-500 text-sm font-medium mt-0.5">{formData.email}</p>
              <p className="text-slate-400 text-xs font-medium mt-1">
                {t('Click on avatar to upload a profile photo')}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              {t('Active Account')}
            </span>
          </div>
        </div>
      </div>

      {/* Main Details Form */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
        <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          {t('Personal & Medical Information')}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">{t('Full Name')}</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50/80 disabled:text-slate-700 font-semibold transition-all"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">{t('Email Address (Registered)')}</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                disabled={true}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/80 text-slate-500 focus:outline-none font-semibold cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">{t('Phone Number')}</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50/80 disabled:text-slate-700 font-semibold transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">{t('Age')}</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="e.g. 28"
                min="1"
                max="120"
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50/80 disabled:text-slate-700 font-semibold transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">{t('Gender')}</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50/80 disabled:text-slate-700 font-semibold transition-all capitalize"
              >
                <option value="male">{t('Male')}</option>
                <option value="female">{t('Female')}</option>
                <option value="other">{t('Other')}</option>
              </select>
            </div>
          </div>

          {isEditing && (
            <div className="pt-6 border-t border-slate-100 flex items-center gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-[1.01] transition-all disabled:opacity-70 cursor-pointer"
              >
                {loading ? t('Saving Changes...') : t('Save Profile Changes')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    name: user.name || '',
                    email: user.email || '',
                    age: user.age || '',
                    gender: user.gender || 'male',
                    phone: user.phone || '',
                    preferredLang: user.preferredLang || 'en'
                  });
                }}
                className="flex-1 bg-slate-100 text-slate-700 font-bold py-3.5 rounded-2xl hover:bg-slate-200 transition-colors cursor-pointer"
              >
                {t('Cancel')}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default PatientProfile;
