import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { apiGetServices } from '../api/client';
import { ServiceIconMap, IconTooth } from '../components/Icons';
import PetalDivider from '../components/PetalDivider';

export default function Services() {
  const { t, tField } = useLanguage();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGetServices()
      .then(setServices)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <section className="max-w-6xl mx-auto px-5 sm:px-8 pt-14 pb-8 text-center">
        <h1 className="font-display text-4xl text-lotus-800 mb-3">{t('services.pageTitle')}</h1>
        <p className="text-ink/60 max-w-lg mx-auto">{t('services.pageSubtitle')}</p>
      </section>

      <PetalDivider />

      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-10">
        {loading ? (
          <div className="text-center text-ink/50 py-20">{t('common.loading')}</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s) => {
              const Icon = ServiceIconMap[s.icon] || IconTooth;
              return (
                <div
                  key={s._id}
                  className="bg-white border border-lotus-100 rounded-2xl p-7 flex flex-col hover:shadow-card hover:border-lotus-700 transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-petal-100 text-lotus-700 flex items-center justify-center mb-5">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-lg text-ink mb-2">{tField(s.name)}</h3>
                  <p className="text-sm text-ink/55 leading-relaxed mb-5 flex-1">
                    {tField(s.description)}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-lotus-100">
                    <div className="text-sm">
                      {s.showPrice && s.price > 0 ? (
                        <span className="font-semibold text-lotus-700">
                          {s.price} {t('common.currency')}
                        </span>
                      ) : (
                        <span className="text-ink/45">{t('services.priceOnConsultation')}</span>
                      )}
                      <span className="text-ink/40 mx-1.5">·</span>
                      <span className="text-ink/45">
                        {s.durationMinutes} {t('services.duration')}
                      </span>
                    </div>
                  </div>
                  <Link
                    to="/booking"
                    state={{ serviceId: s._id }}
                    className="mt-4 text-center bg-lotus-700 text-cream text-sm font-medium py-2.5 rounded-full hover:bg-lotus-800 transition-colors"
                  >
                    {t('services.bookThisService')}
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
