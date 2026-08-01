import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { apiGetSettings } from '../api/client';
import PetalDivider from '../components/PetalDivider';
import { IconShield, IconStar } from '../components/Icons';

export default function About() {
  const { t, tField, lang } = useLanguage();
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    apiGetSettings().then(setSettings).catch(() => {});
  }, []);

  return (
    <div>
      <section className="max-w-6xl mx-auto px-5 sm:px-8 pt-14 pb-10 text-center">
        <h1 className="font-display text-4xl text-lotus-800 mb-3">{t('about.title')}</h1>
      </section>

      <PetalDivider />

      <section className="max-w-3xl mx-auto px-5 sm:px-8 py-12">
        <h2 className="font-display text-2xl text-lotus-800 mb-4">{t('about.storyTitle')}</h2>
        <p className="text-ink/65 leading-relaxed text-lg">
          {settings ? tField(settings.aboutUs) : ''}
        </p>
      </section>

      <section className="bg-lotus-50">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 grid sm:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-8 shadow-soft">
            <div className="w-12 h-12 rounded-xl bg-lotus-700 text-cream flex items-center justify-center mb-5">
              <IconStar className="w-6 h-6" />
            </div>
            <h3 className="font-display text-xl text-lotus-800 mb-3">{t('about.visionTitle')}</h3>
            <p className="text-ink/60 leading-relaxed">
              {lang === 'ar'
                ? 'أن نكون العيادة الأولى اختيارًا لكل من يبحث عن رعاية أسنان بجودة عالمية بلمسة إنسانية.'
                : "To be the first choice for anyone seeking world-class dental care with a human touch."}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-soft">
            <div className="w-12 h-12 rounded-xl bg-lotus-700 text-cream flex items-center justify-center mb-5">
              <IconShield className="w-6 h-6" />
            </div>
            <h3 className="font-display text-xl text-lotus-800 mb-3">{t('about.missionTitle')}</h3>
            <p className="text-ink/60 leading-relaxed">
              {lang === 'ar'
                ? 'تقديم علاج آمن وفعّال باستخدام أحدث التقنيات، مع الحفاظ على راحة وثقة كل مريض.'
                : 'Delivering safe, effective treatment using the latest technology while preserving every patient\'s comfort and trust.'}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
