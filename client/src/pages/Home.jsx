import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { apiGetServices, apiGetDoctors, apiGetSettings, apiGetTestimonials } from '../api/client';
import PetalDivider from '../components/PetalDivider';
import { ServiceIconMap, IconTooth, IconShield, IconUser, IconTag, IconStar } from '../components/Icons';

function useCountUp(target, active) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active || !target) return;
    let frame;
    const duration = 1200;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      setValue(Math.floor(progress * target));
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target, active]);
  return value;
}

export default function Home() {
  const { t, tField, lang } = useLanguage();
  const [services, setServices] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [settings, setSettings] = useState(null);
  const [testimonials, setTestimonials] = useState([]);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    apiGetServices().then((data) => setServices(data.slice(0, 6))).catch(() => {});
    apiGetDoctors().then((data) => setDoctors(data.slice(0, 3))).catch(() => {});
    apiGetSettings().then(setSettings).catch(() => {});
    apiGetTestimonials().then((data) => setTestimonials(data.slice(0, 4))).catch(() => {});
  }, []);

  useEffect(() => {
    const el = document.getElementById('stats-section');
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setStatsVisible(true),
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const patients = useCountUp(settings?.stats?.patients, statsVisible);
  const years = useCountUp(settings?.stats?.yearsExperience, statsVisible);
  const docCount = useCountUp(settings?.stats?.doctorsCount, statsVisible);

  const whyItems = [
    { key: 'equipment', Icon: IconTooth },
    { key: 'doctors', Icon: IconUser },
    { key: 'sterilization', Icon: IconShield },
    { key: 'pricing', Icon: IconTag },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-16 pb-20 md:pt-24 md:pb-28 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block text-sm font-medium text-lotus-700 bg-lotus-50 px-4 py-1.5 rounded-full mb-6">
              {t('hero.eyebrow')}
            </span>
            <h1 className="font-display text-4xl sm:text-5xl md:text-[3.4rem] leading-[1.15] text-lotus-800 mb-6">
              {t('hero.title')}
            </h1>
            <p className="text-ink/65 text-lg leading-relaxed mb-8 max-w-md">{t('hero.subtitle')}</p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/booking"
                className="bg-lotus-700 text-cream font-medium px-7 py-3.5 rounded-full hover:bg-lotus-800 transition-all shadow-card hover:-translate-y-0.5"
              >
                {t('hero.cta')}
              </Link>
              <Link
                to="/services"
                className="border border-lotus-700/30 text-lotus-800 font-medium px-7 py-3.5 rounded-full hover:bg-lotus-50 transition-colors"
              >
                {t('hero.ctaSecondary')}
              </Link>
            </div>
          </div>

          <div className="relative flex justify-center">
            <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-lotus-100 flex items-center justify-center animate-float">
              <svg width="55%" viewBox="0 0 64 64" aria-hidden="true">
                <path
                  d="M32 4C32 4 14 20 14 38C14 50 21 58 32 63C43 58 50 50 50 38C50 20 32 4 32 4Z"
                  fill="#1F4D3D"
                />
                <path
                  d="M32 20C32 20 23 30 23 40C23 46 26.5 52 32 55C37.5 52 41 46 41 40C41 30 32 20 32 20Z"
                  fill="#F0C9C0"
                />
              </svg>
            </div>
            <div className="absolute -bottom-4 start-4 bg-cream shadow-card rounded-2xl px-5 py-4 flex items-center gap-3">
              <IconStar className="w-5 h-5 text-gold" filled />
              <div>
                <div className="text-sm font-semibold text-ink">4.9 / 5</div>
                <div className="text-xs text-ink/50">
                  {lang === 'ar' ? 'تقييم المرضى' : 'Patient Rating'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PetalDivider />

      {/* Why choose us */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-16">
        <div className="text-center max-w-lg mx-auto mb-12">
          <h2 className="font-display text-3xl text-lotus-800 mb-3">{t('why.title')}</h2>
          <p className="text-ink/60">{t('why.subtitle')}</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {whyItems.map(({ key, Icon }) => (
            <div
              key={key}
              className="bg-white/60 border border-lotus-100 rounded-2xl p-6 hover:shadow-card hover:-translate-y-1 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-lotus-700 text-cream flex items-center justify-center mb-4">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-ink mb-2">{t(`why.items.${key}.title`)}</h3>
              <p className="text-sm text-ink/60 leading-relaxed">{t(`why.items.${key}.text`)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section id="stats-section" className="bg-lotus-700 text-cream">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14 grid grid-cols-3 gap-6 text-center">
          <div>
            <div className="font-display text-4xl sm:text-5xl mb-2">{patients.toLocaleString()}+</div>
            <div className="text-cream/70 text-sm">{t('stats.patients')}</div>
          </div>
          <div>
            <div className="font-display text-4xl sm:text-5xl mb-2">{years}+</div>
            <div className="text-cream/70 text-sm">{t('stats.years')}</div>
          </div>
          <div>
            <div className="font-display text-4xl sm:text-5xl mb-2">{docCount}+</div>
            <div className="text-cream/70 text-sm">{t('stats.doctors')}</div>
          </div>
        </div>
      </section>

      {/* Services preview */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-16">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <h2 className="font-display text-3xl text-lotus-800 mb-2">{t('services.title')}</h2>
            <p className="text-ink/60">{t('services.subtitle')}</p>
          </div>
          <Link to="/services" className="text-lotus-700 font-medium text-sm hover:underline">
            {t('services.viewAll')} →
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => {
            const Icon = ServiceIconMap[s.icon] || IconTooth;
            return (
              <Link
                key={s._id}
                to="/booking"
                state={{ serviceId: s._id }}
                className="group bg-white border border-lotus-100 rounded-2xl p-6 hover:border-lotus-700 hover:shadow-card transition-all"
              >
                <div className="w-11 h-11 rounded-xl bg-petal-100 text-lotus-700 flex items-center justify-center mb-4 group-hover:bg-lotus-700 group-hover:text-cream transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-ink mb-1.5">{tField(s.name)}</h3>
                <p className="text-sm text-ink/55 leading-relaxed line-clamp-2">{tField(s.description)}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <PetalDivider flip />

      {/* Doctors preview */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-16">
        <div className="text-center max-w-lg mx-auto mb-12">
          <h2 className="font-display text-3xl text-lotus-800 mb-3">{t('doctors.title')}</h2>
          <p className="text-ink/60">{t('doctors.subtitle')}</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((d) => (
            <div key={d._id} className="bg-white border border-lotus-100 rounded-2xl overflow-hidden hover:shadow-card transition-all">
              <div className="h-44 bg-lotus-100 flex items-center justify-center">
                {d.photo ? (
                  <img src={d.photo} alt={tField(d.name)} className="w-full h-full object-cover" />
                ) : (
                  <IconUser className="w-16 h-16 text-lotus-400" />
                )}
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-ink mb-1">{tField(d.name)}</h3>
                <p className="text-sm text-lotus-600 mb-4">{tField(d.specialty)}</p>
                <Link
                  to="/booking"
                  state={{ doctorId: d._id }}
                  className="text-sm font-medium text-lotus-700 hover:underline"
                >
                  {t('doctors.bookWithDoctor')} →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="bg-lotus-50">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16">
            <div className="text-center max-w-lg mx-auto mb-12">
              <h2 className="font-display text-3xl text-lotus-800 mb-3">{t('testimonials.title')}</h2>
              <p className="text-ink/60">{t('testimonials.subtitle')}</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              {testimonials.map((tm) => (
                <div key={tm._id} className="bg-white rounded-2xl p-6 shadow-soft">
                  <div className="flex gap-1 mb-3 text-gold">
                    {Array.from({ length: tm.rating }).map((_, i) => (
                      <IconStar key={i} className="w-4 h-4" filled />
                    ))}
                  </div>
                  <p className="text-ink/70 leading-relaxed mb-4">"{tField(tm.text)}"</p>
                  <div className="text-sm font-semibold text-ink">{tm.patientName}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="max-w-4xl mx-auto px-5 sm:px-8 py-20 text-center">
        <h2 className="font-display text-3xl sm:text-4xl text-lotus-800 mb-5">{t('hero.title')}</h2>
        <Link
          to="/booking"
          className="inline-block bg-lotus-700 text-cream font-medium px-8 py-4 rounded-full hover:bg-lotus-800 transition-all shadow-card hover:-translate-y-0.5"
        >
          {t('hero.cta')}
        </Link>
      </section>
    </div>
  );
}
