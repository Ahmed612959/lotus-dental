import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { apiGetSettings } from '../api/client';
import { IconPhone, IconMail, IconMapPin, IconClock } from '../components/Icons';
import PetalDivider from '../components/PetalDivider';

export default function Contact() {
  const { t, tField, lang } = useLanguage();
  const [settings, setSettings] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error

  useEffect(() => {
    apiGetSettings().then(setSettings).catch(() => {});
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('sending');
    // NOTE: no dedicated "contact message" backend endpoint exists yet;
    // this simulates submission. Wire to a real endpoint (e.g. POST /api/contact) when added.
    setTimeout(() => {
      setStatus('sent');
      setForm({ name: '', email: '', message: '' });
    }, 700);
  };

  return (
    <div>
      <section className="max-w-6xl mx-auto px-5 sm:px-8 pt-14 pb-8 text-center">
        <h1 className="font-display text-4xl text-lotus-800 mb-3">{t('contact.title')}</h1>
        <p className="text-ink/60 max-w-lg mx-auto">{t('contact.subtitle')}</p>
      </section>

      <PetalDivider />

      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-10 grid md:grid-cols-2 gap-12">
        <div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-ink/70 mb-1.5">
                {t('contact.form.name')}
              </label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-lotus-200 rounded-xl px-4 py-3 focus:border-lotus-700 outline-none transition-colors bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink/70 mb-1.5">
                {t('contact.form.email')}
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border border-lotus-200 rounded-xl px-4 py-3 focus:border-lotus-700 outline-none transition-colors bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink/70 mb-1.5">
                {t('contact.form.message')}
              </label>
              <textarea
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full border border-lotus-200 rounded-xl px-4 py-3 focus:border-lotus-700 outline-none transition-colors bg-white resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={status === 'sending'}
              className="bg-lotus-700 text-cream font-medium px-7 py-3.5 rounded-full hover:bg-lotus-800 transition-colors disabled:opacity-60"
            >
              {status === 'sending' ? t('contact.form.sending') : t('contact.form.send')}
            </button>
            {status === 'sent' && (
              <p className="text-lotus-700 text-sm">{t('contact.form.success')}</p>
            )}
          </form>
        </div>

        <div className="space-y-5">
          {settings?.address && (
            <div className="flex items-start gap-4 bg-white border border-lotus-100 rounded-2xl p-5">
              <IconMapPin className="w-5 h-5 text-lotus-700 mt-0.5 shrink-0" />
              <div>
                <div className="text-sm font-semibold text-ink mb-1">{t('contact.info.address')}</div>
                <div className="text-sm text-ink/60">{tField(settings.address)}</div>
              </div>
            </div>
          )}
          {settings?.phone?.length > 0 && (
            <div className="flex items-start gap-4 bg-white border border-lotus-100 rounded-2xl p-5">
              <IconPhone className="w-5 h-5 text-lotus-700 mt-0.5 shrink-0" />
              <div>
                <div className="text-sm font-semibold text-ink mb-1">{t('contact.info.phone')}</div>
                {settings.phone.map((p) => (
                  <div key={p} dir="ltr" className="text-sm text-ink/60">
                    {p}
                  </div>
                ))}
              </div>
            </div>
          )}
          {settings?.email && (
            <div className="flex items-start gap-4 bg-white border border-lotus-100 rounded-2xl p-5">
              <IconMail className="w-5 h-5 text-lotus-700 mt-0.5 shrink-0" />
              <div>
                <div className="text-sm font-semibold text-ink mb-1">{t('contact.info.email')}</div>
                <div dir="ltr" className="text-sm text-ink/60">
                  {settings.email}
                </div>
              </div>
            </div>
          )}
          {settings?.workingHours?.length > 0 && (
            <div className="flex items-start gap-4 bg-white border border-lotus-100 rounded-2xl p-5">
              <IconClock className="w-5 h-5 text-lotus-700 mt-0.5 shrink-0" />
              <div className="flex-1">
                <div className="text-sm font-semibold text-ink mb-2">{t('contact.info.hours')}</div>
                <div className="space-y-1">
                  {settings.workingHours.map((wh) => (
                    <div key={wh.day} className="flex justify-between text-sm text-ink/60">
                      <span>{t(`days.${wh.day}`)}</span>
                      <span dir="ltr">
                        {wh.isClosed ? (lang === 'ar' ? 'مغلق' : 'Closed') : `${wh.startTime} - ${wh.endTime}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {settings?.mapEmbedUrl && (
            <div className="rounded-2xl overflow-hidden border border-lotus-100 h-56">
              <iframe
                title="map"
                src={settings.mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
              />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
