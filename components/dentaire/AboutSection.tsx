'use client';

import Image from 'next/image';
import { Award, CheckCircle2, HeartHandshake } from 'lucide-react';
import smileImg from '@/src/assets/images/male_smile_showcase_1795203941309.jpg';
import treatmentSuiteImg from '@/src/assets/images/male_treatment_suite_1795203940951.jpg';
import { useLanguage } from '@/components/LanguageProvider';
import AppointmentButton from '@/components/AppointmentButton';
import {
  CurtainImageReveal,
  FadeInUp,
  SplitHeadingReveal,
} from '@/components/dentaire/ScrollEffects';

export default function AboutSection({
  linkToAbout = true,
}: {
  linkToAbout?: boolean;
}) {
  const { locale, t } = useLanguage();

  return (
    <section className="bg-[#080808] py-16 sm:py-24 overflow-hidden">
      <div className="mx-auto max-w-[1300px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-14">
          {/* Dual Overlapping Image Composition with Dentaire Curtain Reveal */}
          <div className="relative lg:col-span-6">
            <div className="relative pb-14 pe-6 sm:pe-12">
              <CurtainImageReveal className="w-4/5 rounded-[40px] border border-[#D4AF37]/25 shadow-[0_20px_50px_rgba(0,0,0,0.65)]">
                <div className="relative aspect-[4/3.6] w-full">
                  <Image
                    src={treatmentSuiteImg}
                    alt={
                      locale === 'en'
                        ? 'Modern dental treatment suite at NOVA Dental Clinic'
                        : 'غرفة العلاج الرقمية في نوفا لطب الأسنان - مركز أوزون الطبي'
                    }
                    fill
                    referrerPolicy="no-referrer"
                    sizes="(max-width: 1024px) 80vw, 480px"
                    className="object-cover"
                  />
                </div>
              </CurtainImageReveal>

              <CurtainImageReveal
                delay={0.18}
                className="relative -mt-32 ms-auto w-3/5 rounded-[40px] border-[6px] border-[#080808] ring-1 ring-[#D4AF37]/40 shadow-[0_20px_50px_rgba(0,0,0,0.75)]"
              >
                <div className="relative aspect-[4/3.4] w-full">
                  <Image
                    src={smileImg}
                    alt={
                      locale === 'en'
                        ? 'Radiant dental smile care at NOVA Dental Clinic'
                        : 'ابتسامة مشرقة برعاية نوفا لطب الأسنان'
                    }
                    fill
                    referrerPolicy="no-referrer"
                    sizes="(max-width: 1024px) 60vw, 340px"
                    className="object-cover"
                  />
                </div>
              </CurtainImageReveal>

              {/* Rotating Circular Seal Badge */}
              <div
                aria-hidden="true"
                className="hidden sm:flex absolute top-8 end-2 sm:end-6 z-10 h-28 w-28 items-center justify-center rounded-full border-2 border-dashed border-[#D4AF37]/60 bg-[#12110E] shadow-[0_0_30px_rgba(212,175,55,0.2)]"
              >
                <div className="animate-spin-slow flex h-24 w-24 items-center justify-center rounded-full border border-[#D4AF37]/30">
                  <span className="sr-only">{t.about.rotatingBadgeText}</span>
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <Award className="h-5 w-5 text-[#E6C76A]" />
                  <span className="mt-1 text-[10px] font-bold tracking-wider text-[#F7F3E9]">
                    NOVA
                  </span>
                  <span className="text-[9px] font-semibold text-[#D4AF37]">
                    NEW CAIRO
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Content Column */}
          <div className="lg:col-span-6">
            <FadeInUp>
              <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#E6C76A]">
                <HeartHandshake className="h-4 w-4 shrink-0 text-[#D4AF37]" aria-hidden="true" />
                <span>{t.about.kicker}</span>
              </div>
            </FadeInUp>

            <SplitHeadingReveal
              prefix={t.about.headingPrefix}
              accent={t.about.headingAccent}
              className="mt-3 text-[clamp(1.75rem,3.3vw,2.75rem)] font-bold text-[#F7F3E9] [text-wrap:balance]"
            />

            <FadeInUp delay={0.18}>
              <p className="mt-5 text-base leading-relaxed text-[#C8BFA8]">
                {t.about.description}
              </p>
            </FadeInUp>

            <FadeInUp delay={0.3}>
              <ul className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {t.about.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#D4AF37]/35 bg-[#D4AF37]/15 text-[#E6C76A]">
                      <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className="text-sm sm:text-[15px] font-semibold text-[#F7F3E9]">
                      {bullet}
                    </span>
                  </li>
                ))}
              </ul>
            </FadeInUp>

            <FadeInUp delay={0.42} className="mt-9">
              <AppointmentButton
                href={linkToAbout ? '/about' : '/appointment'}
                label={linkToAbout ? t.about.cta : t.nav.bookAppointment}
              />
            </FadeInUp>
          </div>
        </div>
      </div>
    </section>
  );
}
