import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  apiGetAllDoctors,
  apiCreateDoctor,
  apiUpdateDoctor,
  apiDeleteDoctor,
  apiGetAllServices,
} from '../../api/client';
import { IconX, IconUser } from '../../components/Icons';

const WEEKDAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

const emptyForm = {
  name: { ar: '', en: '' },
  specialty: { ar: '', en: '' },
  bio: { ar: '', en: '' },
  yearsOfExperience: 0,
  photo: '',
  workingHours: WEEKDAYS.map((day) => ({ day, startTime: '10:00', endTime: '18:00', isActive: false })),
  services: [],
};

function DoctorModal({ initial, services, onClose, onSaved }) {
  const { token } = useAuth();
  const { t, tField } = useLanguage();
  const [form, setForm] = useState(initial || emptyForm);
  const [saving, setSaving] = useState(false);

  const toggleDay = (day) => {
    setForm((f) => ({
      ...f,
      workingHours: f.workingHours.map((wh) =>
        wh.day === day ? { ...wh, isActive: !wh.isActive } : wh
      ),
    }));
  };

  const updateDayTime = (day, field, value) => {
    setForm((f) => ({
      ...f,
      workingHours: f.workingHours.map((wh) => (wh.day === day ? { ...wh, [field]: value } : wh)),
    }));
  };

  const toggleService = (id) => {
    setForm((f) => ({
      ...f,
      services: f.services.includes(id) ? f.services.filter((s) => s !== id) : [...f.services, id],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, workingHours: form.workingHours.filter((w) => w.isActive) };
      if (form._id) {
        await apiUpdateDoctor(token, form._id, payload);
      } else {
        await apiCreateDoctor(token, payload);
      }
      onSaved();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-cream rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-lg text-ink">{t('admin.doctors.addNew')}</h3>
          <button onClick={onClose}>
            <IconX className="w-5 h-5 text-ink/50" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <input
              required
              placeholder={t('admin.doctors.nameAr')}
              value={form.name.ar}
              onChange={(e) => setForm({ ...form, name: { ...form.name, ar: e.target.value } })}
              className="border border-lotus-200 rounded-xl px-4 py-2.5"
            />
            <input
              required
              dir="ltr"
              placeholder={t('admin.doctors.nameEn')}
              value={form.name.en}
              onChange={(e) => setForm({ ...form, name: { ...form.name, en: e.target.value } })}
              className="border border-lotus-200 rounded-xl px-4 py-2.5"
            />
            <input
              required
              placeholder={t('admin.doctors.specialtyAr')}
              value={form.specialty.ar}
              onChange={(e) => setForm({ ...form, specialty: { ...form.specialty, ar: e.target.value } })}
              className="border border-lotus-200 rounded-xl px-4 py-2.5"
            />
            <input
              required
              dir="ltr"
              placeholder={t('admin.doctors.specialtyEn')}
              value={form.specialty.en}
              onChange={(e) => setForm({ ...form, specialty: { ...form.specialty, en: e.target.value } })}
              className="border border-lotus-200 rounded-xl px-4 py-2.5"
            />
          </div>
          <input
            type="number"
            min="0"
            placeholder={t('admin.doctors.experience')}
            value={form.yearsOfExperience}
            onChange={(e) => setForm({ ...form, yearsOfExperience: Number(e.target.value) })}
            className="w-full border border-lotus-200 rounded-xl px-4 py-2.5"
          />

          <div>
            <h4 className="text-sm font-medium text-ink/70 mb-2">{t('admin.doctors.workingHours')}</h4>
            <div className="space-y-2">
              {form.workingHours.map((wh) => (
                <div key={wh.day} className="flex items-center gap-3 text-sm">
                  <label className="flex items-center gap-2 w-32 shrink-0">
                    <input type="checkbox" checked={wh.isActive} onChange={() => toggleDay(wh.day)} />
                    {t(`days.${wh.day}`)}
                  </label>
                  {wh.isActive && (
                    <>
                      <input
                        type="time"
                        value={wh.startTime}
                        onChange={(e) => updateDayTime(wh.day, 'startTime', e.target.value)}
                        className="border border-lotus-200 rounded-lg px-2 py-1"
                      />
                      <span className="text-ink/40">–</span>
                      <input
                        type="time"
                        value={wh.endTime}
                        onChange={(e) => updateDayTime(wh.day, 'endTime', e.target.value)}
                        className="border border-lotus-200 rounded-lg px-2 py-1"
                      />
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {services.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-ink/70 mb-2">{t('services.title')}</h4>
              <div className="flex flex-wrap gap-2">
                {services.map((s) => (
                  <button
                    type="button"
                    key={s._id}
                    onClick={() => toggleService(s._id)}
                    className={`text-xs px-3 py-1.5 rounded-full border ${
                      form.services.includes(s._id)
                        ? 'bg-lotus-700 text-cream border-lotus-700'
                        : 'border-lotus-200 text-ink/60'
                    }`}
                  >
                    {tField(s.name)}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-lotus-700 text-cream font-medium py-3 rounded-xl hover:bg-lotus-800 disabled:opacity-60"
          >
            {t('admin.doctors.save')}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function DoctorsAdmin() {
  const { token } = useAuth();
  const { t, tField } = useLanguage();
  const [doctors, setDoctors] = useState([]);
  const [services, setServices] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const load = () => {
    apiGetAllDoctors(token).then(setDoctors).catch(() => {});
    apiGetAllServices(token).then(setServices).catch(() => {});
  };

  useEffect(load, [token]);

  const toggleActive = async (d) => {
    if (d.isActive) {
      await apiDeleteDoctor(token, d._id); // soft delete = deactivate
    } else {
      await apiUpdateDoctor(token, d._id, { isActive: true });
    }
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <h1 className="font-display text-2xl text-lotus-800">{t('admin.doctors.title')}</h1>
        <button
          onClick={() => {
            setEditing(null);
            setShowModal(true);
          }}
          className="bg-lotus-700 text-cream text-sm font-medium px-5 py-2.5 rounded-full hover:bg-lotus-800 transition-colors"
        >
          + {t('admin.doctors.addNew')}
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {doctors.map((d) => (
          <div key={d._id} className="bg-white border border-lotus-100 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-full bg-lotus-100 flex items-center justify-center overflow-hidden shrink-0">
                {d.photo ? <img src={d.photo} alt="" className="w-full h-full object-cover" /> : <IconUser className="w-5 h-5 text-lotus-500" />}
              </div>
              <div className="min-w-0">
                <div className="font-medium text-ink truncate">{tField(d.name)}</div>
                <div className="text-xs text-ink/50 truncate">{tField(d.specialty)}</div>
              </div>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-lotus-50">
              <span className={`text-xs px-2 py-1 rounded-full ${d.isActive ? 'bg-lotus-50 text-lotus-700' : 'bg-ink/5 text-ink/40'}`}>
                {d.isActive ? t('admin.doctors.activate') : t('admin.doctors.deactivate')}
              </span>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setEditing(d);
                    setShowModal(true);
                  }}
                  className="text-xs text-lotus-700 hover:underline"
                >
                  {t('admin.doctors.edit')}
                </button>
                <button onClick={() => toggleActive(d)} className="text-xs text-ink/50 hover:underline">
                  {d.isActive ? t('admin.doctors.deactivate') : t('admin.doctors.activate')}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <DoctorModal
          initial={editing}
          services={services}
          onClose={() => setShowModal(false)}
          onSaved={() => {
            setShowModal(false);
            load();
          }}
        />
      )}
    </div>
  );
}
