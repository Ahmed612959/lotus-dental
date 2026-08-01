import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';

import PublicLayout from './components/PublicLayout';
import Home from './pages/Home';
import Services from './pages/Services';
import Doctors from './pages/Doctors';
import About from './pages/About';
import Contact from './pages/Contact';
import Booking from './pages/Booking';
import MyBooking from './pages/MyBooking';

import AdminLogin from './pages/admin/Login';
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import AppointmentsAdmin from './pages/admin/AppointmentsAdmin';
import DoctorsAdmin from './pages/admin/DoctorsAdmin';
import ServicesAdmin from './pages/admin/ServicesAdmin';
import PatientsAdmin from './pages/admin/PatientsAdmin';
import ContentAdmin from './pages/admin/ContentAdmin';
import SettingsAdmin from './pages/admin/SettingsAdmin';

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public site */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/doctors" element={<Doctors />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/my-booking" element={<MyBooking />} />
            </Route>

            {/* Admin dashboard */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="appointments" element={<AppointmentsAdmin />} />
              <Route path="doctors" element={<DoctorsAdmin />} />
              <Route path="services" element={<ServicesAdmin />} />
              <Route path="patients" element={<PatientsAdmin />} />
              <Route path="content" element={<ContentAdmin />} />
              <Route path="settings" element={<SettingsAdmin />} />
            </Route>

            <Route path="*" element={<Home />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}
