'use client';

import Image from 'next/image';
import {
  Award,
  CalendarCheck,
  HeartHandshake,
  PhoneCall,
  ScanLine,
  ShieldCheck,
  Stethoscope,
} from 'lucide-react';
import suiteImg from '@/src/assets/images/male_treatment_suite_1795203940951.jpg';
import { useLanguage } from '@/components/LanguageProvider';
import {
  CurtainImageReveal,
  FadeInUp,
  SplitHeadingReveal,
} from '@/components/dentaire/ScrollEffects';

const LEFT_ICONS = [Stethoscope, ScanLine, HeartHandshake];
const RIGHT_ICONS = [CalendarCheck, ShieldCheck, PhoneCall];

export default function WhyChooseSection() {
  const { locale, t } = useLanguage();

  return (
    <section className="border-t border-[#D4AF37]/20 bg-[#080808] py-16 sm:py-24 overflow-hidden">
      <div className="mx-auto max-w-[1300px] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <FadeInUp>
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#E6C76A]">
              <Award className="h-4 w-4 shrink-0 text-[#D4AF37]" aria-hidden="true" />
              <span>{t.whyChoose.kicker}</span>
            </div>
          </FadeInUp>

          <SplitHeadingReveal
            prefix={t.whyChoose.headingPrefix}
            accent={t.whyChoose.headingAccent}
            className="mt-3 text-[clamp(1.75rem,3.3vw,2.75rem)] font-bold text-[#F7F3E9] [text-wrap:balance]"
          />

          <FadeInUp delay={0.18}>
            <p className="mt-4 text-base text-[#C8BFA8]">{t.whyChoose.subtitle}</p>
          </FadeInUp>
        </div>

        {/* 3-Column Feature Split Around Center Image */}
        <div className="mt-14 grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-8">
          {/* Left/Start 3 Items */}
          <div className="space-y-8 lg:col-span-4">
            {t.whyChoose.leftItems.map((item, idx) => {
              const Icon = LEFT_ICONS[idx % LEFT_ICONS.length];
              return (
                <FadeInUp
                  key={item.title}
                  delay={idx * 0.14}
                  className="flex items-start gap-4 lg:flex-row-reverse lg:text-end"
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#D4AF37]/30 bg-[#161512] text-[#E6C76A]">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#F7F3E9]">{item.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-[#C8BFA8]">
                      {item.description}
                    </p>
                  </div>
                </FadeInUp>
              );
            })}
          </div>

          {/* Center Feature Image with Curtain Reveal */}
          <div className="lg:col-span-4">
            <CurtainImageReveal className="mx-auto max-w-[380px] rounded-[40px] border border-[#D4AF37]/30 shadow-[0_24px_60px_rgba(0,0,0,0.65)]">
              <div className="relative aspect-[4/4.8] w-full">
                <Image
                  src={suiteImg}
                  alt={
                    locale === 'en'
                      ? 'Clinical dental suite at NOVA Dental Clinic'
                      : 'غرفة العناية السنية في نوفا لطب الأسنان'
                  }
                  fill
                  referrerPolicy="no-referrer"
                  sizes="(max-width: 1024px) 100vw, 380px"
                  className="object-cover"
                />
              </div>
            </CurtainImageReveal>
          </div>

          {/* Right/End 3 Items */}
          <div className="space-y-8 lg:col-span-4">
            {t.whyChoose.rightItems.map((item, idx) => {
              const Icon = RIGHT_ICONS[idx % RIGHT_ICONS.length];
              return (
                <FadeInUp
                  key={item.title}
                  delay={idx * 0.14}
                  className="flex items-start gap-4"
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#D4AF37]/30 bg-[#161512] text-[#E6C76A]">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#F7F3E9]">{item.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-[#C8BFA8]">
                      {item.description}
                    </p>
                  </div>
                </FadeInUp>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
