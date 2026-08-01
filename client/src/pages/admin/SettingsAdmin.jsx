import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { apiGetSettings, apiUpdateSettings } from '../../api/client';
import { IconX } from '../../components/Icons';

const WEEKDAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

export default function SettingsAdmin() {
  const { token } = useAuth();
  const { t } = useLanguage();
  const [settings, setSettings] = useState(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newClosedDate, setNewClosedDate] = useState('');

  useEffect(() => {
    apiGetSettings().then(setSettings).catch(() => {});
  }, []);

  if (!settings) return <div className="text-ink/50">{t('common.loading')}</div>;

  const updateField = (path, value) => {
    setSaved(false);
    setSettings((prev) => {
      const next = structuredClone(prev);
      let obj = next;
      const keys = path.split('.');
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      obj[keys[keys.length - 1]] = value;
      return next;
    });
  };

  const updateWorkingHour = (day, field, value) => {
    setSaved(false);
    setSettings((prev) => ({
      ...prev,
      workingHours: prev.workingHours.map((wh) => (wh.day === day ? { ...wh, [field]: value } : wh)),
    }));
  };

  const addClosedDate = () => {
    if (!newClosedDate) return;
    setSettings((prev) => ({
      ...prev,
      closedDates: [...(prev.closedDates || []), { date: newClosedDate, reason: { ar: '', en: '' } }],
    }));
    setNewClosedDate('');
  };

  const removeClosedDate = (idx) => {
    setSettings((prev) => ({
      ...prev,
      closedDates: prev.closedDates.filter((_, i) => i !== idx),
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiUpdateSettings(token, settings);
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl text-lotus-800 mb-6">{t('admin.settings.title')}</h1>

      <section className="bg-white border border-lotus-100 rounded-2xl p-6 mb-6">
        <h2 className="font-semibold text-ink mb-4">{t('admin.settings.clinicInfo')}</h2>
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <input
            placeholder="Clinic name (AR)"
            value={settings.clinicName.ar}
            onChange={(e) => updateField('clinicName.ar', e.target.value)}
            className="border border-lotus-200 rounded-xl px-4 py-2.5"
          />
          <input
            dir="ltr"
            placeholder="Clinic name (EN)"
            value={settings.clinicName.en}
            onChange={(e) => updateField('clinicName.en', e.target.value)}
            className="border border-lotus-200 rounded-xl px-4 py-2.5"
          />
        </div>
        <input
          dir="ltr"
          placeholder="Email"
          value={settings.email}
          onChange={(e) => updateField('email', e.target.value)}
          className="w-full border border-lotus-200 rounded-xl px-4 py-2.5 mb-4"
        />
        <input
          dir="ltr"
          placeholder="Phone"
          value={settings.phone?.[0] || ''}
          onChange={(e) => updateField('phone', [e.target.value])}
          className="w-full border border-lotus-200 rounded-xl px-4 py-2.5 mb-4"
        />
        <textarea
          placeholder="Address (AR)"
          value={settings.address.ar}
          onChange={(e) => updateField('address.ar', e.target.value)}
          className="w-full border border-lotus-200 rounded-xl px-4 py-2.5 mb-4 resize-none"
          rows={2}
        />
        <textarea
          dir="ltr"
          placeholder="Address (EN)"
          value={settings.address.en}
          onChange={(e) => updateField('address.en', e.target.value)}
          className="w-full border border-lotus-200 rounded-xl px-4 py-2.5 resize-none"
          rows={2}
        />
      </section>

      <section className="bg-white border border-lotus-100 rounded-2xl p-6 mb-6">
        <h2 className="font-semibold text-ink mb-4">{t('admin.settings.workingHours')}</h2>
        <div className="space-y-2">
          {WEEKDAYS.map((day) => {
            const wh = settings.workingHours?.find((w) => w.day === day) || {
              day,
              startTime: '10:00',
              endTime: '18:00',
              isClosed: true,
            };
            return (
              <div key={day} className="flex items-center gap-3 text-sm">
                <span className="w-24 shrink-0">{t(`days.${day}`)}</span>
                <label className="flex items-center gap-1.5">
                  <input
                    type="checkbox"
                    checked={!wh.isClosed}
                    onChange={(e) => updateWorkingHour(day, 'isClosed', !e.target.checked)}
                  />
                  {t('common.yes')}
                </label>
                {!wh.isClosed && (
                  <>
                    <input
                      type="time"
                      value={wh.startTime}
                      onChange={(e) => updateWorkingHour(day, 'startTime', e.target.value)}
                      className="border border-lotus-200 rounded-lg px-2 py-1"
                    />
                    <input
                      type="time"
                      value={wh.endTime}
                      onChange={(e) => updateWorkingHour(day, 'endTime', e.target.value)}
                      className="border border-lotus-200 rounded-lg px-2 py-1"
                    />
                  </>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="bg-white border border-lotus-100 rounded-2xl p-6 mb-6">
        <h2 className="font-semibold text-ink mb-4">{t('admin.settings.closedDates')}</h2>
        <div className="flex gap-2 mb-4">
          <input
            type="date"
            value={newClosedDate}
            onChange={(e) => setNewClosedDate(e.target.value)}
            className="border border-lotus-200 rounded-xl px-4 py-2.5"
          />
          <button
            onClick={addClosedDate}
            className="bg-lotus-100 text-lotus-700 text-sm font-medium px-4 py-2.5 rounded-xl"
          >
            {t('admin.settings.addClosedDate')}
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {(settings.closedDates || []).map((cd, i) => (
            <span
              key={i}
              className="flex items-center gap-1.5 text-xs bg-lotus-50 text-lotus-700 px-3 py-1.5 rounded-full"
            >
              {new Date(cd.date).toLocaleDateString()}
              <button onClick={() => removeClosedDate(i)}>
                <IconX className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </section>

      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-lotus-700 text-cream font-medium px-7 py-3 rounded-full hover:bg-lotus-800 disabled:opacity-60 transition-colors"
      >
        {t('admin.settings.save')}
      </button>
      {saved && <span className="ms-4 text-sm text-lotus-700">{t('admin.settings.saved')}</span>}
    </div>
  );
}
