'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Award, MapPin, ShieldCheck, Smile, Stethoscope } from 'lucide-react';
import { motion } from 'motion/react';
import femaleDocImg from '@/src/assets/images/doctor_female_specialist_1794988566137.jpg';
import maleDocImg from '@/src/assets/images/doctor_male_specialist_1794988565766.jpg';
import { CLINIC_INFO } from '@/lib/clinic-config';
import { useLanguage } from '@/components/LanguageProvider';
import AppointmentButton from '@/components/AppointmentButton';

export default function HomeHeroV1() {
  const { locale, t } = useLanguage();
  const fifthSettlementAddress =
    locale === 'en' ? CLINIC_INFO.addressEn : CLINIC_INFO.addressAr;
  const nasrCityAddress =
    locale === 'en'
      ? CLINIC_INFO.nasrCityAddressEn
      : CLINIC_INFO.nasrCityAddressAr;

  return (
    <section className="dentaire-hero-pattern relative overflow-hidden pt-10 pb-0 sm:pt-14">
      <div className="mx-auto max-w-[1300px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Hero Content Column */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="pb-6 lg:col-span-6 lg:pb-16"
          >
            <div className="mb-3 inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#E6C76A]">
              <Award className="h-4 w-4 shrink-0 text-[#D4AF37]" aria-hidden="true" />
              <span>{t.hero.kicker}</span>
            </div>

            <h1 className="text-[clamp(2.25rem,4.2vw,3.375rem)] font-bold leading-[1.2] text-[#F7F3E9] [text-wrap:balance]">
              <span>{t.hero.headlinePrefix}</span>{' '}
              <span className="text-[#D4AF37]">{t.hero.headlineAccent}</span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-[#C8BFA8] sm:text-[17px]">
              {t.hero.description}
            </p>

            {/* Primary & Secondary CTAs matching Hero Version 1 */}
            <div className="mt-8 flex flex-wrap items-center gap-4 border-b border-[#D4AF37]/20 pb-8">
              <AppointmentButton label={t.hero.primaryCta} />

              <Link
                href="/services"
                className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-[#D4AF37]/40 bg-[#161512] px-6 py-3 text-sm font-semibold text-[#F7F3E9] transition-colors hover:border-[#E6C76A] hover:text-[#E6C76A] whitespace-nowrap"
              >
                {t.hero.secondaryCta}
              </Link>
            </div>

            {/* Verified Slogan & Dual Clinic Branches */}
            <div className="mt-6 flex flex-col gap-2 text-sm text-[#F7F3E9]">
              <p className="font-semibold text-[#E6C76A]">{t.hero.bottomSloganLabel}</p>
              <a
                href={CLINIC_INFO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs sm:text-sm text-[#C8BFA8] transition-colors hover:text-[#E6C76A]"
              >
                <MapPin className="h-4 w-4 shrink-0 text-[#D4AF37]" aria-hidden="true" />
                <span>{fifthSettlementAddress}</span>
              </a>
              <Link
                href="/appointment?branch=nasr-city"
                className="inline-flex items-center gap-2 text-xs sm:text-sm text-[#C8BFA8] transition-colors hover:text-[#E6C76A]"
              >
                <MapPin className="h-4 w-4 shrink-0 text-[#D4AF37]" aria-hidden="true" />
                <span>{nasrCityAddress}</span>
              </Link>
            </div>
          </motion.div>

          {/* Hero Visual Column matching Dentaire Version 1 Composition */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex justify-center lg:col-span-6 lg:self-end"
          >
            <div className="relative w-full max-w-[520px]">
              {/* Subtle Gold Ambient Glow Behind Hero Portrait */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-4 -z-10 rounded-t-[60px] bg-[radial-gradient(circle_at_50%_35%,rgba(212,175,55,0.2),transparent_70%)] blur-xl"
              />

              {/* Main Portrait Image */}
              <div className="relative aspect-[4/4.6] w-full overflow-hidden rounded-t-[48px] border border-[#D4AF37]/30 bg-[#161512] shadow-[0_24px_70px_rgba(0,0,0,0.7)]">
                <Image
                  src={femaleDocImg}
                  alt={
                    locale === 'en'
                      ? 'Specialist dental consultant at NOVA Dental Clinic'
                      : 'استشارية طب وتجميل الأسنان في نوفا لطب الأسنان'
                  }
                  fill
                  priority
                  referrerPolicy="no-referrer"
                  sizes="(max-width: 1024px) 100vw, 520px"
                  className="object-cover object-top"
                />
              </div>

              {/* Dentaire Signature 3 Circular Icon Badges */}
              <div
                aria-hidden="true"
                className="hidden sm:flex absolute top-14 -end-5 h-20 w-20 items-center justify-center rounded-full border border-[#D4AF37]/35 bg-[#161512] text-[#E6C76A] shadow-[0_12px_36px_rgba(0,0,0,0.55)] transition-colors duration-300 hover:bg-[#D4AF37] hover:text-[#080808]"
              >
                <Smile className="h-9 w-9" />
              </div>

              <div
                aria-hidden="true"
                className="hidden sm:flex absolute top-1/2 -start-6 -translate-y-1/2 h-20 w-20 items-center justify-center rounded-full border border-[#D4AF37]/35 bg-[#161512] text-[#E6C76A] shadow-[0_12px_36px_rgba(0,0,0,0.55)] transition-colors duration-300 hover:bg-[#D4AF37] hover:text-[#080808]"
              >
                <Stethoscope className="h-9 w-9" />
              </div>

              <div
                aria-hidden="true"
                className="hidden sm:flex absolute bottom-20 -end-4 h-20 w-20 items-center justify-center rounded-full border border-[#D4AF37]/35 bg-[#161512] text-[#E6C76A] shadow-[0_12px_36px_rgba(0,0,0,0.55)] transition-colors duration-300 hover:bg-[#D4AF37] hover:text-[#080808]"
              >
                <ShieldCheck className="h-9 w-9" />
              </div>

              {/* Dentaire Floating Specialist Card (export-dantist-box) */}
              <Link
                href="/doctors"
                className="absolute bottom-6 start-3 sm:-start-6 z-10 flex items-center gap-3 rounded-[16px] border border-[#D4AF37]/35 bg-[#141310]/95 backdrop-blur-md p-2.5 pe-5 shadow-[0_16px_44px_rgba(0,0,0,0.65)] transition-transform duration-200 hover:-translate-y-0.5 hover:border-[#E6C76A]"
              >
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[12px] border border-[#D4AF37]/25 bg-[#080808]">
                  <Image
                    src={maleDocImg}
                    alt={t.hero.floatingDoctorBadge}
                    fill
                    sizes="56px"
                    className="object-cover object-top"
                  />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#F7F3E9]">
                    {locale === 'en' ? 'Dr. Ahmed El-Sayed' : 'د. أحمد السيد'}
                  </p>
                  <p className="text-xs font-medium text-[#E6C76A]">
                    {t.hero.floatingDoctorBadge}
                  </p>
                </div>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
