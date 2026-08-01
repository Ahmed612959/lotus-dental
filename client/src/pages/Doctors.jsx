import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { apiGetDoctors } from '../api/client';
import { IconUser, IconCheck } from '../components/Icons';
import PetalDivider from '../components/PetalDivider';

export default function Doctors() {
  const { t, tField } = useLanguage();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGetDoctors()
      .then(setDoctors)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <section className="max-w-6xl mx-auto px-5 sm:px-8 pt-14 pb-8 text-center">
        <h1 className="font-display text-4xl text-lotus-800 mb-3">{t('doctors.pageTitle')}</h1>
        <p className="text-ink/60 max-w-lg mx-auto">{t('doctors.pageSubtitle')}</p>
      </section>

      <PetalDivider />

      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-10">
        {loading ? (
          <div className="text-center text-ink/50 py-20">{t('common.loading')}</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {doctors.map((d) => (
              <div
                key={d._id}
                className="bg-white border border-lotus-100 rounded-2xl overflow-hidden hover:shadow-card transition-all flex flex-col"
              >
                <div className="h-52 bg-lotus-100 flex items-center justify-center">
                  {d.photo ? (
                    <img src={d.photo} alt={tField(d.name)} className="w-full h-full object-cover" />
                  ) : (
                    <IconUser className="w-20 h-20 text-lotus-400" />
                  )}
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-semibold text-lg text-ink mb-1">{tField(d.name)}</h3>
                  <p className="text-sm text-lotus-600 mb-3">{tField(d.specialty)}</p>
                  {d.yearsOfExperience > 0 && (
                    <p className="text-xs text-ink/50 mb-3">
                      {d.yearsOfExperience} {t('doctors.experience')}
                    </p>
                  )}
                  {d.bio && <p className="text-sm text-ink/60 leading-relaxed mb-4">{tField(d.bio)}</p>}

                  {d.qualifications?.length > 0 && (
                    <div className="mb-5">
                      <h4 className="text-xs font-semibold text-ink/50 uppercase tracking-wide mb-2">
                        {t('doctors.qualifications')}
                      </h4>
                      <ul className="space-y-1.5">
                        {d.qualifications.map((q, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-ink/65">
                            <IconCheck className="w-4 h-4 mt-0.5 text-lotus-600 shrink-0" />
                            <span>{tField(q)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <Link
                    to="/booking"
                    state={{ doctorId: d._id }}
                    className="mt-auto text-center bg-lotus-700 text-cream text-sm font-medium py-2.5 rounded-full hover:bg-lotus-800 transition-colors"
                  >
                    {t('doctors.bookWithDoctor')}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
