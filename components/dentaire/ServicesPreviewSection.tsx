'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Stethoscope } from 'lucide-react';
import {
  DENTAL_SERVICES,
  SERVICE_CATEGORIES,
  ServiceCategory,
} from '@/lib/clinic-data';
import { useLanguage } from '@/components/LanguageProvider';
import ServiceCard from '@/components/cards/ServiceCard';
import AppointmentButton from '@/components/AppointmentButton';
import {
  FadeInUp,
  SplitHeadingReveal,
} from '@/components/dentaire/ScrollEffects';

export default function ServicesPreviewSection() {
  const { locale, t } = useLanguage();
  const [category, setCategory] = useState<ServiceCategory>('all');

  const visibleServices =
    category === 'all'
      ? DENTAL_SERVICES
      : DENTAL_SERVICES.filter((srv) => srv.category === category);

  return (
    <section className="dentaire-services-band py-16 sm:py-24">
      <div className="mx-auto max-w-[1300px] px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="mx-auto max-w-2xl text-center">
          <FadeInUp>
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#E6C76A]">
              <Stethoscope
                className="h-4 w-4 shrink-0 text-[#D4AF37]"
                aria-hidden="true"
              />
              <span>{t.servicesSection.kicker}</span>
            </div>
          </FadeInUp>

          <SplitHeadingReveal
            prefix={t.servicesSection.headingPrefix}
            accent={t.servicesSection.headingAccent}
            className="mt-3 text-[clamp(1.75rem,3.3vw,2.75rem)] font-bold text-[#F7F3E9] [text-wrap:balance]"
          />

          <FadeInUp delay={0.14}>
            <p className="mt-4 text-base text-[#C8BFA8]">
              {t.servicesSection.subtitle}
            </p>
          </FadeInUp>
        </div>

        {/* Interactive Category Filter Bar */}
        <div
          role="tablist"
          aria-label={locale === 'en' ? 'Service specialties' : 'تخصصات الخدمات'}
          className="mt-9 flex flex-wrap items-center justify-center gap-2"
        >
          {SERVICE_CATEGORIES.map((cat) => {
            const active = category === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setCategory(cat.id)}
                className={`min-h-[40px] rounded-full px-4 py-2 text-xs sm:text-sm font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#D4AF37] text-[#080808] shadow-md'
                    : 'border border-[#D4AF37]/25 bg-[#161512] text-[#F7F3E9] hover:border-[#E6C76A] hover:text-[#E6C76A]'
                }`}
              >
                {locale === 'en' ? cat.labelEn : cat.labelAr}
              </button>
            );
          })}
        </div>

        {/* All 12 Services Responsive Grid (4x3 on Desktop, 2x6 on Tablet, 1x12 on Mobile) */}
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {visibleServices.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>

        {/* Section Footer CTA */}
        <FadeInUp
          delay={0.2}
          className="mt-12 flex flex-col items-center justify-center gap-5 text-center"
        >
          <p className="text-sm sm:text-base text-[#C8BFA8]">
            {t.servicesSection.footerNotePrefix}{' '}
            <Link
              href="/services"
              className="font-semibold text-[#E6C76A] underline underline-offset-4 transition-colors hover:text-[#F7F3E9]"
            >
              {t.servicesSection.footerNoteLink}
            </Link>
          </p>
          <AppointmentButton href="/services" label={t.servicesSection.viewAll} />
        </FadeInUp>
      </div>
    </section>
  );
}
