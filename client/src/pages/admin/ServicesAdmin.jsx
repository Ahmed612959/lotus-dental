import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { apiGetAllServices, apiCreateService, apiUpdateService, apiDeleteService } from '../../api/client';
import { ServiceIconMap, IconTooth, IconX } from '../../components/Icons';

const ICONS = Object.keys(ServiceIconMap);

const emptyForm = {
  name: { ar: '', en: '' },
  description: { ar: '', en: '' },
  icon: 'tooth',
  durationMinutes: 30,
  price: 0,
  showPrice: true,
};

function ServiceModal({ initial, onClose, onSaved }) {
  const { token } = useAuth();
  const { t } = useLanguage();
  const [form, setForm] = useState(initial || emptyForm);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (form._id) {
        await apiUpdateService(token, form._id, form);
      } else {
        await apiCreateService(token, form);
      }
      onSaved();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-cream rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-lg text-ink">{t('admin.services.addNew')}</h3>
          <button onClick={onClose}>
            <IconX className="w-5 h-5 text-ink/50" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            required
            placeholder={t('admin.services.nameAr')}
            value={form.name.ar}
            onChange={(e) => setForm({ ...form, name: { ...form.name, ar: e.target.value } })}
            className="w-full border border-lotus-200 rounded-xl px-4 py-2.5"
          />
          <input
            required
            dir="ltr"
            placeholder={t('admin.services.nameEn')}
            value={form.name.en}
            onChange={(e) => setForm({ ...form, name: { ...form.name, en: e.target.value } })}
            className="w-full border border-lotus-200 rounded-xl px-4 py-2.5"
          />
          <textarea
            placeholder={t('admin.services.nameAr') + ' - ' + t('contact.form.message')}
            value={form.description.ar}
            onChange={(e) => setForm({ ...form, description: { ...form.description, ar: e.target.value } })}
            className="w-full border border-lotus-200 rounded-xl px-4 py-2.5 resize-none"
            rows={2}
          />
          <textarea
            dir="ltr"
            placeholder={t('admin.services.nameEn') + ' - ' + t('contact.form.message')}
            value={form.description.en}
            onChange={(e) => setForm({ ...form, description: { ...form.description, en: e.target.value } })}
            className="w-full border border-lotus-200 rounded-xl px-4 py-2.5 resize-none"
            rows={2}
          />
          <div className="flex flex-wrap gap-2">
            {ICONS.map((icon) => {
              const Icon = ServiceIconMap[icon];
              return (
                <button
                  type="button"
                  key={icon}
                  onClick={() => setForm({ ...form, icon })}
                  className={`w-10 h-10 rounded-lg flex items-center justify-center border-2 ${
                    form.icon === icon ? 'border-lotus-700 bg-lotus-50 text-lotus-700' : 'border-lotus-100 text-ink/40'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </button>
              );
            })}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              min="5"
              step="5"
              placeholder={t('admin.services.duration')}
              value={form.durationMinutes}
              onChange={(e) => setForm({ ...form, durationMinutes: Number(e.target.value) })}
              className="border border-lotus-200 rounded-xl px-4 py-2.5"
            />
            <input
              type="number"
              min="0"
              placeholder={t('admin.services.price')}
              value={form.price}
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
              className="border border-lotus-200 rounded-xl px-4 py-2.5"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-ink/70">
            <input
              type="checkbox"
              checked={form.showPrice}
              onChange={(e) => setForm({ ...form, showPrice: e.target.checked })}
            />
            {t('admin.services.showPrice')}
          </label>
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

export default function ServicesAdmin() {
  const { token } = useAuth();
  const { t, tField } = useLanguage();
  const [services, setServices] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const load = () => apiGetAllServices(token).then(setServices).catch(() => {});
  useEffect(load, [token]);

  const toggleActive = async (s) => {
    if (s.isActive) {
      await apiDeleteService(token, s._id);
    } else {
      await apiUpdateService(token, s._id, { isActive: true });
    }
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <h1 className="font-display text-2xl text-lotus-800">{t('admin.services.title')}</h1>
        <button
          onClick={() => {
            setEditing(null);
            setShowModal(true);
          }}
          className="bg-lotus-700 text-cream text-sm font-medium px-5 py-2.5 rounded-full hover:bg-lotus-800 transition-colors"
        >
          + {t('admin.services.addNew')}
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {services.map((s) => {
          const Icon = ServiceIconMap[s.icon] || IconTooth;
          return (
            <div key={s._id} className="bg-white border border-lotus-100 rounded-2xl p-5">
              <div className="w-10 h-10 rounded-lg bg-petal-100 text-lotus-700 flex items-center justify-center mb-3">
                <Icon className="w-5 h-5" />
              </div>
              <div className="font-medium text-ink mb-1">{tField(s.name)}</div>
              <div className="text-xs text-ink/50 mb-3">
                {s.durationMinutes} {t('services.duration')} · {s.showPrice ? `${s.price} ${t('common.currency')}` : t('services.priceOnConsultation')}
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-lotus-50">
                <span className={`text-xs px-2 py-1 rounded-full ${s.isActive ? 'bg-lotus-50 text-lotus-700' : 'bg-ink/5 text-ink/40'}`}>
                  {s.isActive ? t('admin.doctors.activate') : t('admin.doctors.deactivate')}
                </span>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setEditing(s);
                      setShowModal(true);
                    }}
                    className="text-xs text-lotus-700 hover:underline"
                  >
                    {t('admin.doctors.edit')}
                  </button>
                  <button onClick={() => toggleActive(s)} className="text-xs text-ink/50 hover:underline">
                    {s.isActive ? t('admin.doctors.deactivate') : t('admin.doctors.activate')}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <ServiceModal
          initial={editing}
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
