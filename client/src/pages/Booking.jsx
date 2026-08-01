import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import {
  apiGetServices,
  apiGetDoctors,
  apiGetAvailableSlots,
  apiCreateAppointment,
} from '../api/client';
import { ServiceIconMap, IconTooth, IconUser, IconCheck, IconChevronLeft, IconChevronRight } from '../components/Icons';

const STEP_LABELS = ['service', 'doctor', 'datetime', 'details'];

// Builds the next 21 days as selectable calendar day options
function buildUpcomingDays() {
  const days = [];
  const today = new Date();
  for (let i = 0; i < 21; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    days.push(d);
  }
  return days;
}

function toISODate(d) {
  return d.toISOString().split('T')[0];
}

export default function Booking() {
  const { t, tField, lang } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [services, setServices] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [serviceId, setServiceId] = useState(location.state?.serviceId || '');
  const [doctorId, setDoctorId] = useState(location.state?.doctorId || '');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState({});

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [result, setResult] = useState(null);

  const upcomingDays = useMemo(buildUpcomingDays, []);

  useEffect(() => {
    apiGetServices().then(setServices).catch(() => {});
    apiGetDoctors().then(setDoctors).catch(() => {});
  }, []);

  // Doctors eligible for the currently selected service (if a service is picked)
  const eligibleDoctors = useMemo(() => {
    if (!serviceId) return doctors;
    return doctors.filter(
      (d) => !d.services?.length || d.services.some((s) => (s._id || s) === serviceId)
    );
  }, [doctors, serviceId]);

  // Fetch available slots whenever doctor + service + date are all chosen
  useEffect(() => {
    if (!doctorId || !serviceId || !date) {
      setSlots([]);
      return;
    }
    setSlotsLoading(true);
    setTime('');
    apiGetAvailableSlots(doctorId, serviceId, date)
      .then((data) => setSlots(data.slots || []))
      .catch(() => setSlots([]))
      .finally(() => setSlotsLoading(false));
  }, [doctorId, serviceId, date]);

  const selectedService = services.find((s) => s._id === serviceId);
  const selectedDoctor = doctors.find((d) => d._id === doctorId);

  const canGoNext = () => {
    if (step === 0) return !!serviceId;
    if (step === 1) return !!doctorId;
    if (step === 2) return !!date && !!time;
    return true;
  };

  const validateDetails = () => {
    const errs = {};
    if (!patientName.trim()) errs.patientName = t('booking.required');
    if (!patientPhone.trim() || !/^[0-9+\s-]{8,15}$/.test(patientPhone.trim())) {
      errs.patientPhone = t('booking.invalidPhone');
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateDetails()) return;
    setSubmitting(true);
    setSubmitError('');
    try {
      const res = await apiCreateAppointment({
        doctorId,
        serviceId,
        date,
        startTime: time,
        patientName: patientName.trim(),
        patientPhone: patientPhone.trim(),
        patientEmail: patientEmail.trim(),
        notes: notes.trim(),
      });
      setResult(res);
    } catch (err) {
      if (err.status === 409) {
        setSubmitError(t('booking.errorSlotTaken'));
        setSlots(err.data?.availableSlots || []);
        setTime('');
        setStep(2);
      } else {
        setSubmitError(err.message || t('common.error'));
      }
    } finally {
      setSubmitting(false);
    }
  };

  const ChevronNext = lang === 'ar' ? IconChevronLeft : IconChevronRight;
  const ChevronBack = lang === 'ar' ? IconChevronRight : IconChevronLeft;

  // ---------- Success screen ----------
  if (result) {
    const { appointment, bookingCode } = result;
    return (
      <div className="max-w-lg mx-auto px-5 py-24 text-center">
        <div className="w-16 h-16 rounded-full bg-lotus-700 text-cream flex items-center justify-center mx-auto mb-6">
          <IconCheck className="w-8 h-8" />
        </div>
        <h1 className="font-display text-3xl text-lotus-800 mb-3">{t('booking.successTitle')}</h1>
        <p className="text-ink/60 mb-8">{t('booking.successText')}</p>

        <div className="bg-white border-2 border-dashed border-lotus-300 rounded-2xl p-6 mb-8">
          <div className="text-xs text-ink/50 mb-1">{t('booking.bookingCode')}</div>
          <div className="font-display text-3xl tracking-widest text-lotus-700 mb-4">{bookingCode}</div>
          <div className="grid grid-cols-2 gap-4 text-sm text-start">
            <div>
              <div className="text-ink/45 text-xs mb-0.5">{t('booking.appointmentDate')}</div>
              <div className="font-medium text-ink">
                {new Date(appointment.date).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')}
              </div>
            </div>
            <div>
              <div className="text-ink/45 text-xs mb-0.5">{t('booking.appointmentTime')}</div>
              <div className="font-medium text-ink" dir="ltr">
                {appointment.startTime}
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate('/')}
          className="bg-lotus-700 text-cream font-medium px-7 py-3.5 rounded-full hover:bg-lotus-800 transition-colors"
        >
          {t('booking.backToHome')}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-14">
      <div className="text-center mb-10">
        <h1 className="font-display text-3xl sm:text-4xl text-lotus-800 mb-2">{t('booking.title')}</h1>
        <p className="text-ink/60">{t('booking.subtitle')}</p>
      </div>

      <div className="flex items-center justify-center gap-2 mb-12">
        {STEP_LABELS.map((label, i) => (
          <React.Fragment key={label}>
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  i < step
                    ? 'bg-lotus-700 text-cream'
                    : i === step
                    ? 'bg-lotus-700 text-cream ring-4 ring-lotus-100'
                    : 'bg-lotus-100 text-lotus-400'
                }`}
              >
                {i < step ? <IconCheck className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`text-xs ${i === step ? 'text-lotus-700 font-medium' : 'text-ink/40'}`}>
                {t(`booking.steps.${label}`)}
              </span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div className={`w-8 sm:w-16 h-0.5 mb-5 ${i < step ? 'bg-lotus-700' : 'bg-lotus-100'}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="bg-white border border-lotus-100 rounded-3xl p-6 sm:p-10 shadow-soft">
        {step === 0 && (
          <div>
            <h2 className="font-semibold text-lg text-ink mb-5">{t('booking.selectService')}</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {services.map((s) => {
                const Icon = ServiceIconMap[s.icon] || IconTooth;
                const active = serviceId === s._id;
                return (
                  <button
                    key={s._id}
                    onClick={() => {
                      setServiceId(s._id);
                      if (doctorId) setDoctorId('');
                    }}
                    className={`flex items-center gap-3 text-start p-4 rounded-xl border-2 transition-all ${
                      active ? 'border-lotus-700 bg-lotus-50' : 'border-lotus-100 hover:border-lotus-300'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                        active ? 'bg-lotus-700 text-cream' : 'bg-petal-100 text-lotus-700'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-ink">{tField(s.name)}</div>
                      <div className="text-xs text-ink/45">
                        {s.durationMinutes} {t('services.duration')}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 className="font-semibold text-lg text-ink mb-5">{t('booking.selectDoctor')}</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {eligibleDoctors.map((d) => {
                const active = doctorId === d._id;
                return (
                  <button
                    key={d._id}
                    onClick={() => setDoctorId(d._id)}
                    className={`flex items-center gap-3 text-start p-4 rounded-xl border-2 transition-all ${
                      active ? 'border-lotus-700 bg-lotus-50' : 'border-lotus-100 hover:border-lotus-300'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-lotus-100 flex items-center justify-center shrink-0 overflow-hidden">
                      {d.photo ? (
                        <img src={d.photo} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <IconUser className="w-5 h-5 text-lotus-500" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-ink">{tField(d.name)}</div>
                      <div className="text-xs text-ink/45">{tField(d.specialty)}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="font-semibold text-lg text-ink mb-5">{t('booking.selectDate')}</h2>
            <div className="flex gap-2 overflow-x-auto pb-3 mb-6 -mx-1 px-1">
              {upcomingDays.map((d) => {
                const iso = toISODate(d);
                const active = date === iso;
                return (
                  <button
                    key={iso}
                    onClick={() => setDate(iso)}
                    className={`shrink-0 w-16 py-3 rounded-xl border-2 flex flex-col items-center transition-all ${
                      active ? 'border-lotus-700 bg-lotus-700 text-cream' : 'border-lotus-100 hover:border-lotus-300 text-ink'
                    }`}
                  >
                    <span className="text-[11px] opacity-70">
                      {d.toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US', { weekday: 'short' })}
                    </span>
                    <span className="text-lg font-semibold">{d.getDate()}</span>
                  </button>
                );
              })}
            </div>

            {date && (
              <div>
                <h3 className="font-medium text-sm text-ink/70 mb-3">{t('booking.selectTime')}</h3>
                {slotsLoading ? (
                  <p className="text-sm text-ink/50">{t('booking.loadingSlots')}</p>
                ) : slots.length === 0 ? (
                  <p className="text-sm text-ink/50">{t('booking.noSlotsAvailable')}</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {slots.map((s) => (
                      <button
                        key={s}
                        onClick={() => setTime(s)}
                        dir="ltr"
                        className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                          time === s
                            ? 'border-lotus-700 bg-lotus-700 text-cream'
                            : 'border-lotus-100 hover:border-lotus-300 text-ink'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="font-semibold text-lg text-ink mb-5">{t('booking.steps.details')}</h2>

            <div className="bg-lotus-50 rounded-xl p-4 mb-6 text-sm text-ink/70 space-y-1">
              <div>
                <strong>{t('booking.selectService')}:</strong> {tField(selectedService?.name)}
              </div>
              <div>
                <strong>{t('booking.selectDoctor')}:</strong> {tField(selectedDoctor?.name)}
              </div>
              <div dir="ltr">
                <strong>{lang === 'ar' ? 'الموعد:' : 'When:'}</strong> {date} — {time}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink/70 mb-1.5">{t('booking.fullName')}</label>
                <input
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className={`w-full border rounded-xl px-4 py-3 outline-none transition-colors ${
                    errors.patientName ? 'border-red-400' : 'border-lotus-200 focus:border-lotus-700'
                  }`}
                />
                {errors.patientName && <p className="text-xs text-red-500 mt-1">{errors.patientName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-ink/70 mb-1.5">{t('booking.phone')}</label>
                <input
                  dir="ltr"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  className={`w-full border rounded-xl px-4 py-3 outline-none transition-colors ${
                    errors.patientPhone ? 'border-red-400' : 'border-lotus-200 focus:border-lotus-700'
                  }`}
                />
                {errors.patientPhone && <p className="text-xs text-red-500 mt-1">{errors.patientPhone}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-ink/70 mb-1.5">{t('booking.emailOptional')}</label>
                <input
                  dir="ltr"
                  type="email"
                  value={patientEmail}
                  onChange={(e) => setPatientEmail(e.target.value)}
                  className="w-full border border-lotus-200 rounded-xl px-4 py-3 focus:border-lotus-700 outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink/70 mb-1.5">{t('booking.notes')}</label>
                <textarea
                  rows={3}
                  placeholder={t('booking.notesPlaceholder')}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full border border-lotus-200 rounded-xl px-4 py-3 focus:border-lotus-700 outline-none transition-colors resize-none"
                />
              </div>
            </div>

            {submitError && (
              <div className="mt-4 bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3">{submitError}</div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between mt-10 pt-6 border-t border-lotus-100">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="flex items-center gap-1 text-sm font-medium text-ink/60 hover:text-lotus-700 disabled:opacity-0 transition-colors"
          >
            <ChevronBack className="w-4 h-4" />
            {t('booking.back')}
          </button>

          {step < 3 ? (
            <button
              onClick={() => canGoNext() && setStep((s) => s + 1)}
              disabled={!canGoNext()}
              className="flex items-center gap-1.5 bg-lotus-700 text-cream font-medium px-6 py-3 rounded-full hover:bg-lotus-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {t('booking.next')}
              <ChevronNext className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-lotus-700 text-cream font-medium px-7 py-3 rounded-full hover:bg-lotus-800 disabled:opacity-60 transition-colors"
            >
              {submitting ? t('booking.booking') : t('booking.confirmBooking')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
