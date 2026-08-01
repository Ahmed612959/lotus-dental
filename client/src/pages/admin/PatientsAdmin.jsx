import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { apiGetPatients, apiGetPatientById } from '../../api/client';
import { IconX } from '../../components/Icons';

function PatientDetailModal({ patientId, onClose }) {
  const { token } = useAuth();
  const { t, tField, lang } = useLanguage();
  const [data, setData] = useState(null);

  useEffect(() => {
    apiGetPatientById(token, patientId).then(setData).catch(() => {});
  }, [token, patientId]);

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-cream rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-lg text-ink">{data?.patient?.name || '—'}</h3>
          <button onClick={onClose}>
            <IconX className="w-5 h-5 text-ink/50" />
          </button>
        </div>
        {data && (
          <>
            <p className="text-sm text-ink/60 mb-5" dir="ltr">
              {data.patient.phone} {data.patient.email && `· ${data.patient.email}`}
            </p>
            <h4 className="text-sm font-medium text-ink/70 mb-3">{t('admin.patients.visitHistory')}</h4>
            <div className="space-y-2">
              {data.appointments.map((a) => (
                <div key={a._id} className="flex items-center justify-between text-sm bg-white border border-lotus-100 rounded-xl px-4 py-3">
                  <div>
                    <div className="font-medium text-ink">{tField(a.service?.name)}</div>
                    <div className="text-xs text-ink/50">{tField(a.doctor?.name)}</div>
                  </div>
                  <div className="text-end">
                    <div className="text-ink/70">{new Date(a.date).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')}</div>
                    <div className="text-xs text-ink/45">{t(`myBooking.status.${a.status}`)}</div>
                  </div>
                </div>
              ))}
              {data.appointments.length === 0 && <p className="text-sm text-ink/40">—</p>}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function PatientsAdmin() {
  const { token } = useAuth();
  const { t } = useLanguage();
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      apiGetPatients(token, search).then(setPatients).catch(() => {});
    }, 300);
    return () => clearTimeout(timeout);
  }, [token, search]);

  return (
    <div>
      <h1 className="font-display text-2xl text-lotus-800 mb-6">{t('admin.patients.title')}</h1>

      <input
        placeholder={t('admin.patients.searchPlaceholder')}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-sm border border-lotus-200 rounded-xl px-4 py-2.5 text-sm mb-6"
      />

      <div className="bg-white border border-lotus-100 rounded-2xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-lotus-50 text-ink/60 text-xs uppercase">
            <tr>
              <th className="text-start px-5 py-3 font-medium">Name</th>
              <th className="text-start px-5 py-3 font-medium">Phone</th>
              <th className="text-start px-5 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-lotus-50">
            {patients.map((p) => (
              <tr key={p._id}>
                <td className="px-5 py-3 text-ink font-medium">{p.name}</td>
                <td className="px-5 py-3 text-ink/70" dir="ltr">
                  {p.phone}
                </td>
                <td className="px-5 py-3 text-end">
                  <button onClick={() => setSelected(p._id)} className="text-xs text-lotus-700 hover:underline">
                    {t('admin.patients.visitHistory')}
                  </button>
                </td>
              </tr>
            ))}
            {patients.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center py-8 text-ink/40">
                  —
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selected && <PatientDetailModal patientId={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
