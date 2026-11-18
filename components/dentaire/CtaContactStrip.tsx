'use client';

import { MapPin, PhoneCall } from 'lucide-react';
import { CLINIC_INFO } from '@/lib/clinic-config';
import { useLanguage } from '@/components/LanguageProvider';
import AppointmentButton from '@/components/AppointmentButton';
import { FadeInUp } from '@/components/dentaire/ScrollEffects';

export default function CtaContactStrip() {
  const { locale, t } = useLanguage();
  const shortFifthSettlement =
    locale === 'en' ? CLINIC_INFO.shortAddressEn : CLINIC_INFO.shortAddressAr;
  const shortNasrCity =
    locale === 'en' ? CLINIC_INFO.nasrCityShortEn : CLINIC_INFO.nasrCityShortAr;

  return (
    <section className="border-y border-[#D4AF37]/25 bg-[#12110E] py-10 text-[#F7F3E9]">
      <div className="mx-auto max-w-[1300px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
          {/* Column 1: Primary Phone */}
          <FadeInUp
            delay={0}
            className="flex items-center gap-4 border-b border-[#D4AF37]/20 pb-6 lg:col-span-4 lg:border-b-0 lg:border-e lg:pb-0 lg:pe-6"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#D4AF37]/30 bg-[#D4AF37]/12 text-[#E6C76A]">
              <PhoneCall className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#F7F3E9]">
                {t.ctaStrip.callTitle}
              </h2>
              <a
                href={CLINIC_INFO.primaryPhoneTel}
                dir="ltr"
                className="mt-1 inline-block text-lg font-bold text-[#E6C76A] tabular-nums transition-colors hover:text-[#F7F3E9]"
              >
                {CLINIC_INFO.primaryPhone}
              </a>
            </div>
          </FadeInUp>

          {/* Column 2: Dual Branch Locations */}
          <FadeInUp
            delay={0.14}
            className="flex items-center gap-4 border-b border-[#D4AF37]/20 pb-6 lg:col-span-4 lg:border-b-0 lg:pb-0"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#D4AF37]/30 bg-[#D4AF37]/12 text-[#E6C76A]">
              <MapPin className="h-6 w-6" aria-hidden="true" />
            </div>
            <div className="space-y-0.5">
              <h2 className="text-base font-semibold text-[#F7F3E9]">
                {t.ctaStrip.locationTitle}
              </h2>
              <a
                href={CLINIC_INFO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-[#C8BFA8] transition-colors hover:text-[#E6C76A]"
              >
                {shortFifthSettlement}
              </a>
              <p className="text-sm text-[#C8BFA8]">{shortNasrCity}</p>
            </div>
          </FadeInUp>

          {/* Column 3: Appointment Action */}
          <FadeInUp
            delay={0.28}
            className="flex flex-wrap items-center justify-between gap-4 lg:col-span-4 lg:justify-end"
          >
            <div className="lg:hidden">
              <p className="text-sm font-semibold text-[#F7F3E9]">
                {t.ctaStrip.bookTitle}
              </p>
              <p className="text-xs text-[#C8BFA8]">{t.ctaStrip.bookSubtitle}</p>
            </div>
            <AppointmentButton highlighted label={t.ctaStrip.bookBtn} />
          </FadeInUp>
        </div>
      </div>
    </section>
  );
}
