import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { apiGetSettings } from '../api/client';
import { IconPhone, IconMail, IconMapPin } from './Icons';

export default function Footer() {
  const { t, lang, tField } = useLanguage();
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    apiGetSettings().then(setSettings).catch(() => {});
  }, []);

  const year = new Date().getFullYear();

  const links = [
    { to: '/', label: t('nav.home') },
    { to: '/services', label: t('nav.services') },
    { to: '/doctors', label: t('nav.doctors') },
    { to: '/about', label: t('nav.about') },
    { to: '/contact', label: t('nav.contact') },
  ];

  return (
    <footer className="bg-lotus-800 text-cream/90 mt-24">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <svg width="26" height="30" viewBox="0 0 64 64" aria-hidden="true">
              <path
                d="M32 8C32 8 20 20 20 34C20 43 25 50 32 54C39 50 44 43 44 34C44 20 32 8 32 8Z"
                fill="#F0C9C0"
              />
            </svg>
            <span className="font-display text-lg text-cream">
              {lang === 'ar' ? 'لوتس' : 'Lotus'}
            </span>
          </div>
          <p className="text-sm text-cream/60 leading-relaxed">{t('footer.tagline')}</p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-cream mb-4">{t('footer.quickLinks')}</h4>
          <ul className="space-y-2.5">
            {links.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-sm text-cream/60 hover:text-petal-200 transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-cream mb-4">{t('footer.contactInfo')}</h4>
          <ul className="space-y-3">
            {settings?.address && (
              <li className="flex items-start gap-2 text-sm text-cream/60">
                <IconMapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{tField(settings.address)}</span>
              </li>
            )}
            {settings?.phone?.[0] && (
              <li className="flex items-center gap-2 text-sm text-cream/60">
                <IconPhone className="w-4 h-4 shrink-0" />
                <span dir="ltr">{settings.phone[0]}</span>
              </li>
            )}
            {settings?.email && (
              <li className="flex items-center gap-2 text-sm text-cream/60">
                <IconMail className="w-4 h-4 shrink-0" />
                <span dir="ltr">{settings.email}</span>
              </li>
            )}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-cream mb-4">{t('footer.followUs')}</h4>
          <div className="flex gap-3">
            {settings?.socialLinks?.facebook && (
              <a
                href={settings.socialLinks.facebook}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-cream/10 flex items-center justify-center hover:bg-petal-200 hover:text-lotus-800 transition-colors text-xs"
              >
                FB
              </a>
            )}
            {settings?.socialLinks?.instagram && (
              <a
                href={settings.socialLinks.instagram}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-cream/10 flex items-center justify-center hover:bg-petal-200 hover:text-lotus-800 transition-colors text-xs"
              >
                IG
              </a>
            )}
          </div>
        </div>
      </div>
      <div className="border-t border-cream/10 py-5 text-center text-xs text-cream/50">
        © {year} {tField(settings?.clinicName) || (lang === 'ar' ? 'عيادة لوتس لطب الأسنان' : 'Lotus Dental Care')} —{' '}
        {t('footer.rights')}
      </div>
    </footer>
  );
}
