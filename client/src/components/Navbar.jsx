import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { IconMenu, IconX, IconGlobe } from './Icons';

export default function Navbar() {
  const { t, lang, toggleLang, isRTL } = useLanguage();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { to: '/', label: t('nav.home') },
    { to: '/services', label: t('nav.services') },
    { to: '/doctors', label: t('nav.doctors') },
    { to: '/about', label: t('nav.about') },
    { to: '/contact', label: t('nav.contact') },
  ];

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors hover:text-lotus-700 ${
      isActive ? 'text-lotus-700' : 'text-ink/70'
    }`;

  return (
    <header
      className={`sticky top-0 z-40 transition-all ${
        scrolled ? 'bg-cream/90 backdrop-blur shadow-soft' : 'bg-cream/60 backdrop-blur-sm'
      }`}
    >
      <nav className="max-w-6xl mx-auto px-5 sm:px-8 h-18 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <svg width="30" height="34" viewBox="0 0 64 64" aria-hidden="true">
            <path
              d="M32 8C32 8 20 20 20 34C20 43 25 50 32 54C39 50 44 43 44 34C44 20 32 8 32 8Z"
              fill="#1F4D3D"
            />
            <path
              d="M32 20C32 20 26 28 26 36C26 41 28.5 46 32 48C35.5 46 38 41 38 36C38 28 32 20 32 20Z"
              fill="#F0C9C0"
            />
          </svg>
          <span className="font-display text-lg text-lotus-700">
            {lang === 'ar' ? 'لوتس' : 'Lotus'}
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 text-sm text-ink/70 hover:text-lotus-700 transition-colors px-2 py-1"
            aria-label="Toggle language"
          >
            <IconGlobe className="w-4 h-4" />
            {lang === 'ar' ? 'EN' : 'AR'}
          </button>
          <Link
            to="/booking"
            className="bg-lotus-700 text-cream text-sm font-medium px-5 py-2.5 rounded-full hover:bg-lotus-800 transition-colors shadow-soft"
          >
            {t('nav.bookNow')}
          </Link>
        </div>

        <button
          className="md:hidden text-ink"
          onClick={() => setOpen((o) => !o)}
          aria-label="Menu"
          aria-expanded={open}
        >
          {open ? <IconX className="w-6 h-6" /> : <IconMenu className="w-6 h-6" />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden bg-cream border-t border-lotus-100 px-5 py-4 flex flex-col gap-4">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={linkClass}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </NavLink>
          ))}
          <div className="flex items-center justify-between pt-2 border-t border-lotus-100">
            <button
              onClick={toggleLang}
              className="flex items-center gap-1.5 text-sm text-ink/70"
            >
              <IconGlobe className="w-4 h-4" />
              {lang === 'ar' ? 'English' : 'العربية'}
            </button>
            <Link
              to="/booking"
              onClick={() => setOpen(false)}
              className="bg-lotus-700 text-cream text-sm font-medium px-5 py-2.5 rounded-full"
            >
              {t('nav.bookNow')}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
