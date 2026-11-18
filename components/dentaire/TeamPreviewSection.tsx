'use client';

import { Users } from 'lucide-react';
import { DOCTORS } from '@/lib/clinic-data';
import { useLanguage } from '@/components/LanguageProvider';
import DoctorCard from '@/components/cards/DoctorCard';
import AppointmentButton from '@/components/AppointmentButton';
import {
  FadeInUp,
  SplitHeadingReveal,
} from '@/components/dentaire/ScrollEffects';

export default function TeamPreviewSection() {
  const { t } = useLanguage();

  return (
    <section className="border-t border-[#D4AF37]/20 bg-[#080808] py-16 sm:py-24">
      <div className="mx-auto max-w-[1300px] px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="mx-auto max-w-2xl text-center">
          <FadeInUp>
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#E6C76A]">
              <Users className="h-4 w-4 shrink-0 text-[#D4AF37]" aria-hidden="true" />
              <span>{t.teamSection.kicker}</span>
            </div>
          </FadeInUp>

          <SplitHeadingReveal
            prefix={t.teamSection.headingPrefix}
            accent={t.teamSection.headingAccent}
            className="mt-3 text-[clamp(1.75rem,3.3vw,2.75rem)] font-bold text-[#F7F3E9] [text-wrap:balance]"
          />

          <FadeInUp delay={0.18}>
            <p className="mt-4 text-base text-[#C8BFA8]">{t.teamSection.subtitle}</p>
          </FadeInUp>
        </div>

        {/* Sole Clinic Doctor Card centered cleanly */}
        <div className="mx-auto mt-12 grid max-w-[380px] grid-cols-1 gap-8">
          {DOCTORS.map((doctor, idx) => (
            <FadeInUp key={doctor.id} delay={idx * 0.14}>
              <DoctorCard doctor={doctor} />
            </FadeInUp>
          ))}
        </div>

        <FadeInUp delay={0.36} className="mt-12 text-center">
          <AppointmentButton href="/doctors" label={t.teamSection.viewAll} />
        </FadeInUp>
      </div>
    </section>
  );
}
