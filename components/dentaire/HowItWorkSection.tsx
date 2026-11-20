'use client';

import { useState } from 'react';
import Image from 'next/image';
import { CalendarCheck, ChevronDown } from 'lucide-react';
import smileImg from '@/src/assets/images/male_smile_showcase_1795203941309.jpg';
import { useLanguage } from '@/components/LanguageProvider';
import AppointmentButton from '@/components/AppointmentButton';
import {
  CurtainImageReveal,
  FadeInUp,
  SplitHeadingReveal,
} from '@/components/dentaire/ScrollEffects';

export default function HowItWorkSection() {
  const { locale, t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number>(0);

  return (
    <section className="border-t border-[#D4AF37]/20 bg-[#11100E] py-16 sm:py-24 overflow-hidden">
      <div className="mx-auto max-w-[1300px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-14">
          {/* Image Column with Dentaire Curtain Reveal */}
          <div className="lg:col-span-6">
            <CurtainImageReveal className="w-full rounded-[40px] border border-[#D4AF37]/25 bg-[#161512] shadow-[0_24px_60px_rgba(0,0,0,0.65)]">
              <div className="relative aspect-[4/3.6] w-full">
                <Image
                  src={smileImg}
                  alt={
                    locale === 'en'
                      ? 'Healthy radiant smile cared for by NOVA Dental Clinic'
                      : 'ابتسامة مشرقة برعاية فريق نوفا لطب الأسنان'
                  }
                  fill
                  referrerPolicy="no-referrer"
                  sizes="(max-width: 1024px) 100vw, 600px"
                  className="object-cover"
                />
              </div>
            </CurtainImageReveal>
          </div>

          {/* Interactive Steps Accordion Column */}
          <div className="lg:col-span-6">
            <FadeInUp>
              <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#E6C76A]">
                <CalendarCheck className="h-4 w-4 shrink-0 text-[#D4AF37]" aria-hidden="true" />
                <span>{t.howItWork.kicker}</span>
              </div>
            </FadeInUp>

            <SplitHeadingReveal
              prefix={t.howItWork.headingPrefix}
              accent={t.howItWork.headingAccent}
              className="mt-3 text-[clamp(1.75rem,3.3vw,2.75rem)] font-bold text-[#F7F3E9] [text-wrap:balance]"
            />

            <FadeInUp delay={0.18}>
              <p className="mt-4 text-base text-[#C8BFA8]">{t.howItWork.subtitle}</p>
            </FadeInUp>

            <div className="mt-8 space-y-4">
              {t.howItWork.steps.map((step, idx) => {
                const isOpen = openIndex === idx;
                return (
                  <FadeInUp key={step.title} delay={idx * 0.14}>
                    <div className="overflow-hidden rounded-[22px] border border-[#D4AF37]/20 bg-[#161512] shadow-md">
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-start transition-colors hover:bg-[#1E1C17] cursor-pointer"
                      >
                        <div className="flex items-center gap-3.5">
                          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#D4AF37]/35 bg-[#D4AF37]/15 text-sm font-bold text-[#E6C76A]">
                            0{idx + 1}
                          </span>
                          <span className="text-base sm:text-lg font-bold text-[#F7F3E9]">
                            {step.title}
                          </span>
                        </div>
                        <ChevronDown
                          className={`h-5 w-5 shrink-0 text-[#D4AF37] transition-transform duration-200 ${
                            isOpen ? 'rotate-180 text-[#E6C76A]' : ''
                          }`}
                          aria-hidden="true"
                        />
                      </button>

                      {isOpen && (
                        <div className="border-t border-[#D4AF37]/15 px-6 pb-5 pt-4 text-sm leading-relaxed text-[#C8BFA8]">
                          {step.description}
                        </div>
                      )}
                    </div>
                  </FadeInUp>
                );
              })}
            </div>

            <FadeInUp delay={0.36} className="mt-8">
              <AppointmentButton label={t.howItWork.cta} />
            </FadeInUp>
          </div>
        </div>
      </div>
    </section>
  );
}
