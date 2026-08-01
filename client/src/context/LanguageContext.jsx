import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import ar from '../locales/ar.json';
import en from '../locales/en.json';

const translations = { ar, en };
const RTL_LANGS = ['ar'];
const STORAGE_KEY = 'lotus_lang';

const LanguageContext = createContext(null);

// Resolves a dot-path like "booking.steps.service" against a translations object
function resolvePath(obj, path) {
  return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    if (typeof window === 'undefined') return 'ar';
    return localStorage.getItem(STORAGE_KEY) || 'ar';
  });

  const isRTL = RTL_LANGS.includes(lang);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    localStorage.setItem(STORAGE_KEY, lang);
  }, [lang, isRTL]);

  const setLang = useCallback((next) => {
    if (translations[next]) setLangState(next);
  }, []);

  const toggleLang = useCallback(() => {
    setLangState((prev) => (prev === 'ar' ? 'en' : 'ar'));
  }, []);

  // t('booking.steps.service') -> translated string; falls back to the key itself if missing
  const t = useCallback(
    (key, vars) => {
      let str = resolvePath(translations[lang], key);
      if (str === undefined) {
        // fallback to Arabic, then to the raw key, so missing EN strings never break the UI
        str = resolvePath(translations.ar, key);
      }
      if (str === undefined) return key;
      if (typeof str === 'string' && vars) {
        return Object.keys(vars).reduce((acc, k) => acc.replace(`{{${k}}}`, vars[k]), str);
      }
      return str;
    },
    [lang]
  );

  // For fields stored as { ar: '...', en: '...' } in the DB (doctor names, service names, etc.)
  const tField = useCallback(
    (field) => {
      if (!field) return '';
      if (typeof field === 'string') return field;
      return field[lang] || field.ar || field.en || '';
    },
    [lang]
  );

  const value = { lang, isRTL, setLang, toggleLang, t, tField };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider');
  return ctx;
}
