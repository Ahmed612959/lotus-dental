import React, { useState } from 'react';
import { Navigate, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  IconCalendar,
  IconUser,
  IconTooth,
  IconMenu,
  IconX,
  IconGlobe,
} from '../Icons';

const NAV_ITEMS = [
  { to: '/admin', key: 'dashboard', end: true, roles: ['admin', 'receptionist', 'doctor'] },
  { to: '/admin/appointments', key: 'appointments', roles: ['admin', 'receptionist', 'doctor'] },
  { to: '/admin/doctors', key: 'doctors', roles: ['admin'] },
  { to: '/admin/services', key: 'services', roles: ['admin'] },
  { to: '/admin/patients', key: 'patients', roles: ['admin', 'receptionist'] },
  { to: '/admin/content', key: 'content', roles: ['admin'] },
  { to: '/admin/settings', key: 'settings', roles: ['admin'] },
];

export default function AdminLayout() {
  const { user, loading, logout, isAuthenticated } = useAuth();
  const { t, toggleLang, lang } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-ink/50">{t('common.loading')}</div>;
  }
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;

  const visibleItems = NAV_ITEMS.filter((item) => item.roles.includes(user.role));

  return (
    <div className="min-h-screen flex bg-cream">
      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 start-0 z-30 w-64 bg-lotus-800 text-cream flex flex-col transition-transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
        style={lang === 'ar' ? { transform: sidebarOpen ? 'translateX(0)' : undefined } : undefined}
      >
        <div className="flex items-center gap-2 px-6 py-6">
          <svg width="24" height="28" viewBox="0 0 64 64" aria-hidden="true">
            <path d="M32 8C32 8 20 20 20 34C20 43 25 50 32 54C39 50 44 43 44 34C44 20 32 8 32 8Z" fill="#F0C9C0" />
          </svg>
          <span className="font-display text-lg">{lang === 'ar' ? 'لوتس' : 'Lotus'}</span>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {visibleItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive ? 'bg-cream text-lotus-800' : 'text-cream/70 hover:bg-cream/10'
                }`
              }
            >
              {t(`admin.sidebar.${item.key}`)}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 pb-6 space-y-1">
          <button
            onClick={toggleLang}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-cream/70 hover:bg-cream/10 transition-colors"
          >
            <IconGlobe className="w-4 h-4" />
            {lang === 'ar' ? 'English' : 'العربية'}
          </button>
          <button
            onClick={logout}
            className="w-full text-start px-4 py-2.5 rounded-xl text-sm text-cream/70 hover:bg-cream/10 transition-colors"
          >
            {t('admin.sidebar.logout')}
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden flex items-center justify-between px-5 py-4 bg-white border-b border-lotus-100">
          <button onClick={() => setSidebarOpen(true)} aria-label="Menu">
            <IconMenu className="w-6 h-6 text-ink" />
          </button>
          <span className="font-display text-lotus-800">{lang === 'ar' ? 'لوحة التحكم' : 'Dashboard'}</span>
          <div className="w-6" />
        </header>
        <main className="flex-1 p-5 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
