import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  apiGetAppointments,
  apiUpdateAppointment,
  apiDeleteAppointment,
  apiGetAllDoctors,
  apiGetAllServices,
  apiGetAvailableSlots,
  apiCreateManualAppointment,
} from '../../api/client';
import { IconX } from '../../components/Icons';

const STATUS_STYLES = {
  pending: 'bg-amber-50 text-amber-700',
  confirmed: 'bg-lotus-50 text-lotus-700',
  cancelled: 'bg-red-50 text-red-600',
  completed: 'bg-lotus-100 text-lotus-800',
  no_show: 'bg-ink/5 text-ink/50',
};

function ManualBookingModal({ onClose, onCreated }) {
  const { token } = useAuth();
  const { t, tField } = useLanguage();
  const [doctors, setDoctors] = useState([]);
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({
    doctorId: '',
    serviceId: '',
    date: '',
    startTime: '',
    patientName: '',
    patientPhone: '',
    status: 'confirmed',
  });
  const [slots, setSlots] = useState([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    apiGetAllDoctors(token).then(setDoctors).catch(() => {});
    apiGetAllServices(token).then(setServices).catch(() => {});
  }, [token]);

  useEffect(() => {
    if (form.doctorId && form.serviceId && form.date) {
      apiGetAvailableSlots(form.doctorId, form.serviceId, form.date)
        .then((d) => setSlots(d.slots || []))
        .catch(() => setSlots([]));
    }
  }, [form.doctorId, form.serviceId, form.date]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await apiCreateManualAppointment(token, form);
      onCreated();
    } catch (err) {
      setError(err.message || t('common.error'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-cream rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-lg text-ink">{t('admin.appointments.addManual')}</h3>
          <button onClick={onClose}>
            <IconX className="w-5 h-5 text-ink/50" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            required
            value={form.serviceId}
            onChange={(e) => setForm({ ...form, serviceId: e.target.value })}
            className="w-full border border-lotus-200 rounded-xl px-4 py-2.5"
          >
            <option value="">{t('booking.selectService')}</option>
            {services.map((s) => (
              <option key={s._id} value={s._id}>
                {tField(s.name)}
              </option>
            ))}
          </select>
          <select
            required
            value={form.doctorId}
            onChange={(e) => setForm({ ...form, doctorId: e.target.value })}
            className="w-full border border-lotus-200 rounded-xl px-4 py-2.5"
          >
            <option value="">{t('booking.selectDoctor')}</option>
            {doctors.map((d) => (
              <option key={d._id} value={d._id}>
                {tField(d.name)}
              </option>
            ))}
          </select>
          <input
            type="date"
            required
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="w-full border border-lotus-200 rounded-xl px-4 py-2.5"
          />
          <select
            required
            value={form.startTime}
            onChange={(e) => setForm({ ...form, startTime: e.target.value })}
            className="w-full border border-lotus-200 rounded-xl px-4 py-2.5"
          >
            <option value="">{t('booking.selectTime')}</option>
            {slots.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <input
            required
            placeholder={t('booking.fullName')}
            value={form.patientName}
            onChange={(e) => setForm({ ...form, patientName: e.target.value })}
            className="w-full border border-lotus-200 rounded-xl px-4 py-2.5"
          />
          <input
            required
            dir="ltr"
            placeholder={t('booking.phone')}
            value={form.patientPhone}
            onChange={(e) => setForm({ ...form, patientPhone: e.target.value })}
            className="w-full border border-lotus-200 rounded-xl px-4 py-2.5"
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-lotus-700 text-cream font-medium py-3 rounded-xl hover:bg-lotus-800 disabled:opacity-60"
          >
            {t('common.save')}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AppointmentsAdmin() {
  const { token, user } = useAuth();
  const { t, tField, lang } = useLanguage();
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [filters, setFilters] = useState({ doctorId: '', status: '', search: '' });
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    const params = {};
    if (filters.doctorId) params.doctorId = filters.doctorId;
    if (filters.status) params.status = filters.status;
    if (filters.search) params.search = filters.search;
    apiGetAppointments(token, params)
      .then(setAppointments)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token, filters]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (user?.role === 'admin' || user?.role === 'receptionist') {
      apiGetAllDoctors(token).then(setDoctors).catch(() => {});
    }
  }, [token, user]);

  const updateStatus = async (id, status) => {
    await apiUpdateAppointment(token, id, { status });
    load();
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('admin.appointments.deleteConfirm'))) return;
    await apiDeleteAppointment(token, id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <h1 className="font-display text-2xl text-lotus-800">{t('admin.appointments.title')}</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-lotus-700 text-cream text-sm font-medium px-5 py-2.5 rounded-full hover:bg-lotus-800 transition-colors"
        >
          + {t('admin.appointments.addManual')}
        </button>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <input
          placeholder={t('admin.appointments.searchPlaceholder')}
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="border border-lotus-200 rounded-xl px-4 py-2.5 text-sm flex-1 min-w-[180px]"
        />
        {doctors.length > 0 && (
          <select
            value={filters.doctorId}
            onChange={(e) => setFilters({ ...filters, doctorId: e.target.value })}
            className="border border-lotus-200 rounded-xl px-4 py-2.5 text-sm"
          >
            <option value="">{t('admin.appointments.allDoctors')}</option>
            {doctors.map((d) => (
              <option key={d._id} value={d._id}>
                {tField(d.name)}
              </option>
            ))}
          </select>
        )}
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="border border-lotus-200 rounded-xl px-4 py-2.5 text-sm"
        >
          <option value="">{t('admin.appointments.allStatuses')}</option>
          {['pending', 'confirmed', 'cancelled', 'completed', 'no_show'].map((s) => (
            <option key={s} value={s}>
              {t(`myBooking.status.${s}`)}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white border border-lotus-100 rounded-2xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-lotus-50 text-ink/60 text-xs uppercase">
            <tr>
              <th className="text-start px-5 py-3 font-medium">{t('admin.appointments.table.patient')}</th>
              <th className="text-start px-5 py-3 font-medium">{t('admin.appointments.table.doctor')}</th>
              <th className="text-start px-5 py-3 font-medium">{t('admin.appointments.table.service')}</th>
              <th className="text-start px-5 py-3 font-medium">{t('admin.appointments.table.date')}</th>
              <th className="text-start px-5 py-3 font-medium">{t('admin.appointments.table.time')}</th>
              <th className="text-start px-5 py-3 font-medium">{t('admin.appointments.table.status')}</th>
              <th className="text-start px-5 py-3 font-medium">{t('admin.appointments.table.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-lotus-50">
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-ink/40">
                  {t('common.loading')}
                </td>
              </tr>
            ) : appointments.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-ink/40">
                  —
                </td>
              </tr>
            ) : (
              appointments.map((a) => (
                <tr key={a._id}>
                  <td className="px-5 py-3">
                    <div className="text-ink font-medium">{a.patient?.name}</div>
                    <div className="text-xs text-ink/45" dir="ltr">
                      {a.patient?.phone}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-ink/70">{tField(a.doctor?.name)}</td>
                  <td className="px-5 py-3 text-ink/70">{tField(a.service?.name)}</td>
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
                  <td className="px-5 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      {a.status === 'pending' && (
                        <button
                          onClick={() => updateStatus(a._id, 'confirmed')}
                          className="text-xs text-lotus-700 hover:underline"
                        >
                          {t('admin.appointments.confirm')}
                        </button>
                      )}
                      {['pending', 'confirmed'].includes(a.status) && (
                        <button
                          onClick={() => updateStatus(a._id, 'completed')}
                          className="text-xs text-lotus-700 hover:underline"
                        >
                          {t('admin.appointments.complete')}
                        </button>
                      )}
                      {['pending', 'confirmed'].includes(a.status) && (
                        <button
                          onClick={() => updateStatus(a._id, 'cancelled')}
                          className="text-xs text-red-500 hover:underline"
                        >
                          {t('admin.appointments.cancel')}
                        </button>
                      )}
                      {user?.role === 'admin' && (
                        <button
                          onClick={() => handleDelete(a._id)}
                          className="text-xs text-ink/40 hover:underline"
                        >
                          {t('admin.appointments.delete')}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <ManualBookingModal
          onClose={() => setShowModal(false)}
          onCreated={() => {
            setShowModal(false);
            load();
          }}
        />
      )}
    </div>
  );
}
