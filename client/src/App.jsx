import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AppLayout, ProtectedRoute } from './layouts/AppLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import HomePage from './pages/HomePage';
import ContactUs from './pages/ContactUs';
import Careers from './pages/Careers';
import ConnectMiot from './pages/ConnectMiot';
import SpecialitiesTreatments from './pages/SpecialitiesTreatments';
import PatientDashboard from './pages/PatientDashboard';
import DoctorSearch from './pages/DoctorSearch';
import BookAppointment from './pages/BookAppointment';
import PatientProfile from './pages/PatientProfile';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/patient/contact" element={<ContactUs />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/patient/careers" element={<Careers />} />
          <Route path="/connect-miot" element={<ConnectMiot />} />
          <Route path="/patient/connect-miot" element={<ConnectMiot />} />
          <Route path="/corporate" element={<ConnectMiot />} />
          <Route path="/about-miot" element={<ConnectMiot />} />
          <Route path="/specialities-treatments" element={<SpecialitiesTreatments />} />
          <Route path="/patient/specialities-treatments" element={<SpecialitiesTreatments />} />
          <Route path="/specialities" element={<SpecialitiesTreatments />} />
          <Route path="/patient/specialities" element={<SpecialitiesTreatments />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/patient/home" element={<HomePage />} />

          {/* Patient Booking Route */}
          <Route element={<ProtectedRoute allowedRoles={['patient']} />}>
            <Route path="/patient/book/:doctorId" element={<BookAppointment />} />
          </Route>

          {/* Protected Routes with AppLayout */}
          <Route element={<AppLayout />}>

            {/* Patient sub-routes */}
            <Route element={<ProtectedRoute allowedRoles={['patient']} />}>
              <Route path="/patient" element={<PatientDashboard />} />
              <Route path="/patient/search" element={<DoctorSearch />} />
              <Route path="/patient/profile" element={<PatientProfile />} />
            </Route>

            {/* Doctor Routes */}
            <Route element={<ProtectedRoute allowedRoles={['doctor']} />}>
              <Route path="/doctor" element={<DoctorDashboard />} />
            </Route>

            {/* Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>

            <Route path="/unauthorized" element={<div className="p-8 text-red-500 font-semibold">Unauthorized Access</div>} />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
