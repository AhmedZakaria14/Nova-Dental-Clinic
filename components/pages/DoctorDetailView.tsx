'use client';

import Image from 'next/image';
import { Award, MapPin, Phone, Stethoscope } from 'lucide-react';
import maleDocImg from '@/src/assets/images/doctor_male_specialist_1794988565766.jpg';
import femaleDocImg from '@/src/assets/images/doctor_female_specialist_1794988566137.jpg';
import { CLINIC_INFO } from '@/lib/clinic-config';
import { DoctorProfile } from '@/lib/clinic-data';
import { useLanguage } from '@/components/LanguageProvider';
import PageHeader from '@/components/PageHeader';
import AppointmentButton from '@/components/AppointmentButton';

export default function DoctorDetailView({ doctor }: { doctor: DoctorProfile }) {
  const { locale, t } = useLanguage();

  const name = locale === 'en' ? doctor.nameEn : doctor.nameAr;
  const title = locale === 'en' ? doctor.titleEn : doctor.titleAr;
  const specialty = locale === 'en' ? doctor.specialtyEn : doctor.specialtyAr;
  const credentials =
    locale === 'en' ? doctor.credentialsEn : doctor.credentialsAr;
  const bio = locale === 'en' ? doctor.bioEn : doctor.bioAr;
  const address = locale === 'en' ? CLINIC_INFO.addressEn : CLINIC_INFO.addressAr;

  const portrait =
    doctor.portraitKey === 'male'
      ? maleDocImg
      : doctor.portraitKey === 'female'
      ? femaleDocImg
      : null;

  return (
    <>
      <PageHeader
        titlePrefix={name}
        subtitle={title}
        breadcrumbs={[
          { label: t.nav.home, href: '/' },
          { label: t.nav.doctors, href: '/doctors' },
          { label: name },
        ]}
      />

      <section className="bg-[#080808] py-14 sm:py-20">
        <div className="mx-auto max-w-[1300px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
            {/* Portrait Column */}
            <div className="lg:col-span-5">
              <div className="relative aspect-[4/4.5] overflow-hidden rounded-[40px] border border-[#D4AF37]/30 bg-[#161512] shadow-2xl">
                {portrait ? (
                  <Image
                    src={portrait}
                    alt={name}
                    fill
                    referrerPolicy="no-referrer"
                    sizes="(max-width: 1024px) 100vw, 480px"
                    className="object-cover object-top"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-b from-[#161512] to-[#0A0908] p-8 text-center">
                    <div className="flex h-32 w-32 items-center justify-center rounded-full border-2 border-[#D4AF37]/50 bg-[#080808] text-4xl font-bold text-[#E6C76A] shadow-[0_0_24px_rgba(212,175,55,0.16)]">
                      {doctor.initials}
                    </div>
                    <p className="mt-5 text-base font-bold text-[#D4AF37]">
                      {specialty}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Bio & Booking Column */}
            <div className="lg:col-span-7">
              <span className="inline-block rounded-full border border-[#D4AF37]/35 bg-[#D4AF37]/15 px-4 py-1.5 text-xs font-bold text-[#E6C76A]">
                {specialty}
              </span>

              <h2 className="mt-4 text-3xl font-bold text-[#F7F3E9]">{name}</h2>
              <p className="mt-2 text-base font-semibold text-[#D4AF37]">
                {title}
              </p>

              <p className="mt-5 text-base leading-relaxed text-[#C8BFA8]">
                {bio}
              </p>

              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-[20px] border border-[#D4AF37]/20 bg-[#161512] p-5">
                  <div className="flex items-center gap-2.5 text-sm font-bold text-[#F7F3E9]">
                    <Award className="h-5 w-5 text-[#D4AF37]" aria-hidden="true" />
                    <span>
                      {locale === 'en' ? 'Clinical Credentials' : 'المؤهل التخصصي'}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-[#C8BFA8]">{credentials}</p>
                </div>

                <div className="rounded-[20px] border border-[#D4AF37]/20 bg-[#161512] p-5">
                  <div className="flex items-center gap-2.5 text-sm font-bold text-[#F7F3E9]">
                    <Stethoscope
                      className="h-5 w-5 text-[#D4AF37]"
                      aria-hidden="true"
                    />
                    <span>
                      {locale === 'en' ? 'Clinic Location' : 'موقع الاستقبال'}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-[#C8BFA8]">{address}</p>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <AppointmentButton
                  href={`/appointment?doctor=${doctor.id}`}
                  label={t.teamSection.bookDoctor}
                />

                <a
                  href={CLINIC_INFO.primaryPhoneTel}
                  dir="ltr"
                  className="inline-flex min-h-[46px] items-center gap-2 rounded-full border border-[#D4AF37]/35 bg-[#161512] px-5 py-2.5 text-sm font-bold text-[#F7F3E9] tabular-nums transition-colors hover:border-[#E6C76A] hover:text-[#E6C76A]"
                >
                  <Phone className="h-4 w-4 text-[#D4AF37]" aria-hidden="true" />
                  <span>{CLINIC_INFO.primaryPhone}</span>
                </a>

                <a
                  href={CLINIC_INFO.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[46px] items-center gap-2 rounded-full border border-[#D4AF37]/35 bg-[#161512] px-5 py-2.5 text-sm font-semibold text-[#F7F3E9] transition-colors hover:border-[#E6C76A] hover:text-[#E6C76A]"
                >
                  <MapPin className="h-4 w-4 text-[#D4AF37]" aria-hidden="true" />
                  <span>{t.ctaStrip.locationBtn}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
