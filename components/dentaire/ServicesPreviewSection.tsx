'use client';

import Link from 'next/link';
import { Stethoscope } from 'lucide-react';
import { DENTAL_SERVICES } from '@/lib/clinic-data';
import { useLanguage } from '@/components/LanguageProvider';
import ServiceCard from '@/components/cards/ServiceCard';
import AppointmentButton from '@/components/AppointmentButton';
import {
  FadeInUp,
  SplitHeadingReveal,
} from '@/components/dentaire/ScrollEffects';

export default function ServicesPreviewSection() {
  const { t } = useLanguage();
  const featuredServices = DENTAL_SERVICES.slice(0, 4);

  return (
    <section className="dentaire-services-band py-16 sm:py-24">
      <div className="mx-auto max-w-[1300px] px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="mx-auto max-w-2xl text-center">
          <FadeInUp>
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#E6C76A]">
              <Stethoscope className="h-4 w-4 shrink-0 text-[#D4AF37]" aria-hidden="true" />
              <span>{t.servicesSection.kicker}</span>
            </div>
          </FadeInUp>

          <SplitHeadingReveal
            prefix={t.servicesSection.headingPrefix}
            accent={t.servicesSection.headingAccent}
            className="mt-3 text-[clamp(1.75rem,3.3vw,2.75rem)] font-bold text-[#F7F3E9] [text-wrap:balance]"
          />

          <FadeInUp delay={0.18}>
            <p className="mt-4 text-base text-[#C8BFA8]">
              {t.servicesSection.subtitle}
            </p>
          </FadeInUp>
        </div>

        {/* 4 Service Cards Row with staggered fadeInUp */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredServices.map((service, idx) => (
            <FadeInUp key={service.id} delay={idx * 0.14} className="h-full">
              <ServiceCard service={service} />
            </FadeInUp>
          ))}
        </div>

        {/* Section Footer CTA */}
        <FadeInUp
          delay={0.36}
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
