import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { apiGetStats, apiGetAppointments } from '../../api/client';
import { IconCalendar, IconClock, IconUser, IconCheck } from '../../components/Icons';

const STATUS_STYLES = {
  pending: 'bg-amber-50 text-amber-700',
  confirmed: 'bg-lotus-50 text-lotus-700',
  cancelled: 'bg-red-50 text-red-600',
  completed: 'bg-lotus-100 text-lotus-800',
  no_show: 'bg-ink/5 text-ink/50',
};

export default function Dashboard() {
  const { token } = useAuth();
  const { t, tField, lang } = useLanguage();
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    apiGetStats(token).then(setStats).catch(() => {});
    apiGetAppointments(token).then((data) => setRecent(data.slice(0, 8))).catch(() => {});
  }, [token]);

  const cards = [
    { key: 'todayAppointments', value: stats?.todayCount, Icon: IconCalendar },
    { key: 'weekAppointments', value: stats?.weekCount, Icon: IconClock },
    { key: 'pendingReview', value: stats?.pendingCount, Icon: IconCheck },
    { key: 'totalPatients', value: stats?.totalPatients, Icon: IconUser },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl text-lotus-800 mb-6">{t('admin.dashboard.title')}</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {cards.map(({ key, value, Icon }) => (
          <div key={key} className="bg-white border border-lotus-100 rounded-2xl p-5">
            <div className="w-10 h-10 rounded-lg bg-lotus-50 text-lotus-700 flex items-center justify-center mb-4">
              <Icon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-semibold text-ink mb-1">{value ?? '—'}</div>
            <div className="text-sm text-ink/50">{t(`admin.dashboard.${key}`)}</div>
          </div>
        ))}
      </div>

      <h2 className="font-semibold text-lg text-ink mb-4">{t('admin.dashboard.recentAppointments')}</h2>
      <div className="bg-white border border-lotus-100 rounded-2xl overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-lotus-50 text-ink/60 text-xs uppercase">
            <tr>
              <th className="text-start px-5 py-3 font-medium">{t('admin.appointments.table.patient')}</th>
              <th className="text-start px-5 py-3 font-medium">{t('admin.appointments.table.doctor')}</th>
              <th className="text-start px-5 py-3 font-medium">{t('admin.appointments.table.date')}</th>
              <th className="text-start px-5 py-3 font-medium">{t('admin.appointments.table.time')}</th>
              <th className="text-start px-5 py-3 font-medium">{t('admin.appointments.table.status')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-lotus-50">
            {recent.map((a) => (
              <tr key={a._id}>
                <td className="px-5 py-3 text-ink">{a.patient?.name}</td>
                <td className="px-5 py-3 text-ink/70">{tField(a.doctor?.name)}</td>
                <td className="px-5 py-3 text-ink/70">
                  {new Date(a.date).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')}
                </td>
                <td className="px-5 py-3 text-ink/70" dir="ltr">
                  {a.startTime}
                </td>
                <td className="px-5 py-3">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLES[a.status]}`}>
                    {t(`myBooking.status.${a.status}`)}
                  </span>
                </td>
              </tr>
            ))}
            {recent.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-8 text-ink/40">
                  —
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
