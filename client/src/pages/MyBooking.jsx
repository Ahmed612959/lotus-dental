import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { apiLookupBooking, apiCancelBooking } from '../api/client';
import { IconCalendar, IconClock, IconUser } from '../components/Icons';
import PetalDivider from '../components/PetalDivider';

const STATUS_STYLES = {
  pending: 'bg-amber-50 text-amber-700',
  confirmed: 'bg-lotus-50 text-lotus-700',
  cancelled: 'bg-red-50 text-red-600',
  completed: 'bg-lotus-100 text-lotus-800',
  no_show: 'bg-ink/5 text-ink/50',
};

export default function MyBooking() {
  const { t, tField, lang } = useLanguage();
  const [code, setCode] = useState('');
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState(false);
  const [cancelSuccess, setCancelSuccess] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    setLoading(true);
    setError('');
    setAppointment(null);
    setCancelSuccess(false);
    try {
      const data = await apiLookupBooking(code.trim().toUpperCase());
      setAppointment(data);
    } catch (err) {
      setError(t('myBooking.notFound'));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm(t('myBooking.cancelConfirm'))) return;
    setCancelling(true);
    try {
      const { appointment: updated } = await apiCancelBooking(appointment.bookingCode);
      setAppointment({ ...appointment, status: updated.status });
      setCancelSuccess(true);
    } catch (err) {
      setError(err.message || t('common.error'));
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div>
      <section className="max-w-6xl mx-auto px-5 sm:px-8 pt-14 pb-8 text-center">
        <h1 className="font-display text-4xl text-lotus-800 mb-3">{t('myBooking.title')}</h1>
        <p className="text-ink/60 max-w-md mx-auto">{t('myBooking.subtitle')}</p>
      </section>

      <PetalDivider />

      <section className="max-w-md mx-auto px-5 py-10">
        <form onSubmit={handleSearch} className="flex gap-2 mb-8">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={t('myBooking.codeLabel')}
            dir="ltr"
            className="flex-1 border border-lotus-200 rounded-xl px-4 py-3 text-center tracking-widest uppercase focus:border-lotus-700 outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-lotus-700 text-cream font-medium px-6 py-3 rounded-xl hover:bg-lotus-800 disabled:opacity-60 transition-colors"
          >
            {t('myBooking.search')}
          </button>
        </form>

        {error && <p className="text-center text-red-500 text-sm mb-6">{error}</p>}

        {appointment && (
          <div className="bg-white border border-lotus-100 rounded-2xl p-6 shadow-soft">
            <div className="flex items-center justify-between mb-5">
              <span className="font-display text-xl tracking-widest text-lotus-700">
                {appointment.bookingCode}
              </span>
              <span
                className={`text-xs font-medium px-3 py-1 rounded-full ${STATUS_STYLES[appointment.status]}`}
              >
                {t(`myBooking.status.${appointment.status}`)}
              </span>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-sm text-ink/70">
                <IconUser className="w-4 h-4 text-lotus-600 shrink-0" />
                <span>{tField(appointment.doctor?.name)}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-ink/70">
                <IconCalendar className="w-4 h-4 text-lotus-600 shrink-0" />
                <span>{new Date(appointment.date).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-ink/70">
                <IconClock className="w-4 h-4 text-lotus-600 shrink-0" />
                <span dir="ltr">{appointment.startTime}</span>
              </div>
            </div>

            {cancelSuccess ? (
              <p className="text-center text-lotus-700 text-sm font-medium">
                {t('myBooking.cancelSuccess')}
              </p>
            ) : (
              ['pending', 'confirmed'].includes(appointment.status) && (
                <button
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="w-full border border-red-300 text-red-600 font-medium py-2.5 rounded-xl hover:bg-red-50 disabled:opacity-60 transition-colors"
                >
                  {t('myBooking.cancelBooking')}
                </button>
              )
            )}
          </div>
        )}
      </section>
    </div>
  );
}
