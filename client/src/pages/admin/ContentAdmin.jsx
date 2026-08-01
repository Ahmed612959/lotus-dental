import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  apiGetAllTestimonials,
  apiCreateTestimonial,
  apiUpdateTestimonial,
  apiDeleteTestimonial,
} from '../../api/client';
import { IconStar, IconX } from '../../components/Icons';

const emptyForm = { patientName: '', text: { ar: '', en: '' }, rating: 5 };

function TestimonialModal({ onClose, onSaved }) {
  const { token } = useAuth();
  const { t } = useLanguage();
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiCreateTestimonial(token, form);
      onSaved();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-cream rounded-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-lg text-ink">{t('admin.content.addTestimonial')}</h3>
          <button onClick={onClose}>
            <IconX className="w-5 h-5 text-ink/50" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            required
            placeholder={t('booking.fullName')}
            value={form.patientName}
            onChange={(e) => setForm({ ...form, patientName: e.target.value })}
            className="w-full border border-lotus-200 rounded-xl px-4 py-2.5"
          />
          <textarea
            required
            placeholder="Arabic"
            value={form.text.ar}
            onChange={(e) => setForm({ ...form, text: { ...form.text, ar: e.target.value } })}
            className="w-full border border-lotus-200 rounded-xl px-4 py-2.5 resize-none"
            rows={2}
          />
          <textarea
            required
            dir="ltr"
            placeholder="English"
            value={form.text.en}
            onChange={(e) => setForm({ ...form, text: { ...form.text, en: e.target.value } })}
            className="w-full border border-lotus-200 rounded-xl px-4 py-2.5 resize-none"
            rows={2}
          />
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                type="button"
                key={n}
                onClick={() => setForm({ ...form, rating: n })}
                className={n <= form.rating ? 'text-gold' : 'text-ink/20'}
              >
                <IconStar className="w-6 h-6" filled />
              </button>
            ))}
          </div>
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

export default function ContentAdmin() {
  const { token } = useAuth();
  const { t, tField } = useLanguage();
  const [testimonials, setTestimonials] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const load = () => apiGetAllTestimonials(token).then(setTestimonials).catch(() => {});
  useEffect(load, [token]);

  const togglePublish = async (tm) => {
    await apiUpdateTestimonial(token, tm._id, { isPublished: !tm.isPublished });
    load();
  };

  const remove = async (id) => {
    if (!window.confirm(t('admin.appointments.deleteConfirm'))) return;
    await apiDeleteTestimonial(token, id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="font-display text-2xl text-lotus-800 mb-1">{t('admin.content.title')}</h1>
          <p className="text-sm text-ink/50">{t('admin.content.testimonials')}</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-lotus-700 text-cream text-sm font-medium px-5 py-2.5 rounded-full hover:bg-lotus-800 transition-colors"
        >
          + {t('admin.content.addTestimonial')}
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        {testimonials.map((tm) => (
          <div key={tm._id} className="bg-white border border-lotus-100 rounded-2xl p-5">
            <div className="flex gap-1 text-gold mb-2">
              {Array.from({ length: tm.rating }).map((_, i) => (
                <IconStar key={i} className="w-3.5 h-3.5" filled />
              ))}
            </div>
            <p className="text-sm text-ink/70 mb-3">{tField(tm.text)}</p>
            <div className="flex items-center justify-between pt-3 border-t border-lotus-50">
              <div>
                <div className="text-sm font-medium text-ink">{tm.patientName}</div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${tm.isPublished ? 'bg-lotus-50 text-lotus-700' : 'bg-ink/5 text-ink/40'}`}>
                  {tm.isPublished ? t('admin.content.publish') : t('admin.content.unpublish')}
                </span>
              </div>
              <div className="flex gap-3">
                <button onClick={() => togglePublish(tm)} className="text-xs text-lotus-700 hover:underline">
                  {tm.isPublished ? t('admin.content.unpublish') : t('admin.content.publish')}
                </button>
                <button onClick={() => remove(tm._id)} className="text-xs text-ink/40 hover:underline">
                  {t('admin.appointments.delete')}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <TestimonialModal
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
