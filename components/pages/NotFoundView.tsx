'use client';

import { useLanguage } from '@/components/LanguageProvider';
import AppointmentButton from '@/components/AppointmentButton';

export default function NotFoundView() {
  const { t } = useLanguage();

  return (
    <section className="dentaire-hero-pattern py-24 sm:py-32">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 text-center">
        <p className="text-7xl sm:text-8xl font-bold text-[#D4AF37]">
          {t.notFound.code}
        </p>
        <h1 className="mt-4 text-3xl sm:text-4xl font-bold text-[#F7F3E9]">
          {t.notFound.title}
        </h1>
        <p className="mt-4 text-base text-[#C8BFA8]">{t.notFound.description}</p>
        <div className="mt-8">
          <AppointmentButton href="/" label={t.notFound.backHome} />
        </div>
      </div>
    </section>
  );
}
