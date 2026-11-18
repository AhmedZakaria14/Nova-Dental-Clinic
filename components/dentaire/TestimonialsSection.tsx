'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, MessageSquareQuote, Quote } from 'lucide-react';
import smileImg from '@/src/assets/images/smile_transformation_showcase_1794988567315.jpg';
import { PATIENT_TESTIMONIALS } from '@/lib/clinic-data';
import { useLanguage } from '@/components/LanguageProvider';
import {
  CurtainImageReveal,
  FadeInUp,
  SplitHeadingReveal,
} from '@/components/dentaire/ScrollEffects';

export default function TestimonialsSection() {
  const { locale, dir, t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);

  const current = PATIENT_TESTIMONIALS[activeIndex] ?? PATIENT_TESTIMONIALS[0];

  const handlePrev = () => {
    setActiveIndex((prev) =>
      prev === 0 ? PATIENT_TESTIMONIALS.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setActiveIndex((prev) =>
      prev === PATIENT_TESTIMONIALS.length - 1 ? 0 : prev + 1
    );
  };

  const quote = locale === 'en' ? current.quoteEn : current.quoteAr;
  const patientName =
    locale === 'en' ? current.patientNameEn : current.patientNameAr;
  const treatment =
    locale === 'en' ? current.treatmentEn : current.treatmentAr;

  return (
    <section className="border-t border-[#D4AF37]/20 bg-[#080808] py-16 sm:py-24 overflow-hidden">
      <div className="mx-auto max-w-[1300px] px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <FadeInUp>
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#E6C76A]">
              <MessageSquareQuote className="h-4 w-4 shrink-0 text-[#D4AF37]" aria-hidden="true" />
              <span>{t.testimonialsSection.kicker}</span>
            </div>
          </FadeInUp>

          <SplitHeadingReveal
            prefix={t.testimonialsSection.headingPrefix}
            accent={t.testimonialsSection.headingAccent}
            className="mt-3 text-[clamp(1.75rem,3.3vw,2.75rem)] font-bold text-[#F7F3E9] [text-wrap:balance]"
          />

          <FadeInUp delay={0.18}>
            <p className="mt-4 text-base text-[#C8BFA8]">
              {t.testimonialsSection.subtitle}
            </p>
          </FadeInUp>
        </div>

        <div className="mt-12 grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Visual Column with Dentaire Curtain Reveal + Gold Highlight Box */}
          <div className="relative lg:col-span-5">
            <CurtainImageReveal className="w-full rounded-[40px] border border-[#D4AF37]/25 shadow-[0_24px_60px_rgba(0,0,0,0.65)]">
              <div className="relative aspect-[4/4.3] w-full">
                <Image
                  src={smileImg}
                  alt={
                    locale === 'en'
                      ? 'Patient smile showcase at NOVA Dental Clinic'
                      : 'تجارب مرضى نوفا لطب الأسنان'
                  }
                  fill
                  referrerPolicy="no-referrer"
                  sizes="(max-width: 1024px) 100vw, 480px"
                  className="object-cover"
                />
              </div>
            </CurtainImageReveal>

            <FadeInUp
              delay={0.2}
              className="relative z-10 mx-4 -mt-14 rounded-[26px] border-4 border-[#080808] bg-gradient-to-br from-[#E6C76A] via-[#D4AF37] to-[#B58E26] p-6 text-[#080808] shadow-2xl sm:mx-8"
            >
              <p className="text-xl font-bold tracking-wide text-[#080808]">
                {t.testimonialsSection.highlightBoxTitle}
              </p>
              <p className="mt-1.5 text-sm font-medium leading-relaxed text-[#1A160B]">
                {t.testimonialsSection.highlightBoxSubtitle}
              </p>
            </FadeInUp>
          </div>

          {/* Right Testimonial Slider */}
          <FadeInUp delay={0.16} className="lg:col-span-7">
            <div className="rounded-[30px] border border-[#D4AF37]/25 bg-[#161512] p-8 sm:p-10 shadow-xl">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D4AF37] text-[#080808]">
                <Quote className="h-6 w-6" aria-hidden="true" />
              </div>

              <blockquote className="mt-6 text-lg sm:text-xl font-medium leading-relaxed text-[#F7F3E9]">
                “{quote}”
              </blockquote>

              <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[#D4AF37]/15 pt-6">
                <div>
                  <p className="text-lg font-bold text-[#F7F3E9]">{patientName}</p>
                  <p className="text-sm font-medium text-[#E6C76A]">{treatment}</p>
                </div>

                {/* Prev / Next Controls */}
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handlePrev}
                    aria-label={t.testimonialsSection.prevSlide}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-[12px] bg-[#D4AF37] text-[#080808] transition-colors hover:bg-[#E6C76A] cursor-pointer"
                  >
                    {dir === 'rtl' ? (
                      <ArrowRight className="h-5 w-5" />
                    ) : (
                      <ArrowLeft className="h-5 w-5" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label={t.testimonialsSection.nextSlide}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-[12px] bg-[#D4AF37] text-[#080808] transition-colors hover:bg-[#E6C76A] cursor-pointer"
                  >
                    {dir === 'rtl' ? (
                      <ArrowLeft className="h-5 w-5" />
                    ) : (
                      <ArrowRight className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </FadeInUp>
        </div>
      </div>
    </section>
  );
}
