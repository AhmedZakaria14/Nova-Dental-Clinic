'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { Building2 } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import suiteImg from '@/src/assets/images/dental_treatment_suite_1794988565232.jpg';
import { useLanguage } from '@/components/LanguageProvider';
import AppointmentButton from '@/components/AppointmentButton';
import {
  FadeInUp,
  SplitHeadingReveal,
} from '@/components/dentaire/ScrollEffects';

export default function VisitClinicAndCounters() {
  const { locale, t } = useLanguage();
  const bannerRef = useRef<HTMLDivElement>(null);

  // Mirrors Dentaire's `.parallaxie` vertical background parallax on scroll
  const { scrollYProgress } = useScroll({
    target: bannerRef,
    offset: ['start end', 'end start'],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);

  return (
    <section className="bg-[#080808] pb-16 sm:pb-24">
      <div className="mx-auto max-w-[1300px] px-4 sm:px-6 lg:px-8">
        {/* Visit Clinic Parallax Overlay Banner */}
        <div
          ref={bannerRef}
          className="relative overflow-hidden rounded-[40px] border border-[#D4AF37]/30 bg-[#12110E] px-6 py-16 sm:px-12 sm:py-24 text-center text-[#F7F3E9] shadow-[0_24px_70px_rgba(0,0,0,0.7)]"
        >
          <motion.div
            style={{ y: parallaxY }}
            className="pointer-events-none absolute -inset-y-16 inset-x-0"
          >
            <Image
              src={suiteImg}
              alt={
                locale === 'en'
                  ? 'NOVA Dental Clinic suite at Ozone Medical Center'
                  : 'البيئة العلاجية في نوفا لطب الأسنان - مركز أوزون الطبي'
              }
              fill
              referrerPolicy="no-referrer"
              sizes="(max-width: 1300px) 100vw, 1300px"
              className="object-cover opacity-30"
            />
          </motion.div>

          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-[#080808]/95 via-[#080808]/80 to-[#14110B]/70"
          />

          <div className="relative z-10 mx-auto max-w-2xl">
            <FadeInUp>
              <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#E6C76A]">
                <Building2 className="h-4 w-4 shrink-0 text-[#D4AF37]" aria-hidden="true" />
                <span>{t.visitClinic.kicker}</span>
              </div>
            </FadeInUp>

            <SplitHeadingReveal
              prefix={t.visitClinic.heading}
              className="mt-4 text-[clamp(1.75rem,3.4vw,2.75rem)] font-bold leading-snug text-[#F7F3E9] [text-wrap:balance]"
            />

            <FadeInUp delay={0.22} className="mt-8">
              <AppointmentButton highlighted label={t.visitClinic.cta} />
            </FadeInUp>
          </div>
        </div>

        {/* 4-Column Factual Standards Strip */}
        <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {t.counters.items.map((item, idx) => (
            <FadeInUp
              key={item.title}
              delay={idx * 0.12}
              className={`border-b border-[#D4AF37]/20 pb-8 lg:border-b-0 lg:pb-0 ${
                idx < t.counters.items.length - 1
                  ? 'lg:border-e lg:border-[#D4AF37]/20 lg:pe-8'
                  : ''
              }`}
            >
              <p className="text-3xl sm:text-4xl font-bold tracking-tight text-[#E6C76A]">
                {item.value}
              </p>
              <h3 className="mt-2 text-lg font-bold text-[#F7F3E9]">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#C8BFA8]">
                {item.description}
              </p>
            </FadeInUp>
          ))}
        </div>
      </div>
    </section>
  );
}
