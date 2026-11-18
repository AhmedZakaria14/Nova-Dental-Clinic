'use client';

import Image from 'next/image';
import Link from 'next/link';
import { CalendarCheck, UserRound } from 'lucide-react';
import maleDocImg from '@/src/assets/images/doctor_male_specialist_1794988565766.jpg';
import femaleDocImg from '@/src/assets/images/doctor_female_specialist_1794988566137.jpg';
import { DoctorProfile } from '@/lib/clinic-data';
import { useLanguage } from '@/components/LanguageProvider';

export default function DoctorCard({ doctor }: { doctor: DoctorProfile }) {
  const { locale, t } = useLanguage();
  const name = locale === 'en' ? doctor.nameEn : doctor.nameAr;
  const specialty = locale === 'en' ? doctor.specialtyEn : doctor.specialtyAr;
  const portrait =
    doctor.portraitKey === 'male'
      ? maleDocImg
      : doctor.portraitKey === 'female'
      ? femaleDocImg
      : null;

  return (
    <article className="group text-center">
      <div className="dentaire-image-anime relative overflow-hidden rounded-[30px] border border-[#D4AF37]/25 bg-[#161512]">
        <Link href={`/doctors/${doctor.slug}`} className="block aspect-[4/4.6] relative">
          {portrait ? (
            <Image
              src={portrait}
              alt={name}
              fill
              referrerPolicy="no-referrer"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-b from-[#161512] to-[#0A0908] p-6">
              <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-[#D4AF37]/50 bg-[#080808] text-2xl font-bold text-[#E6C76A] shadow-[0_0_24px_rgba(212,175,55,0.15)]">
                {doctor.initials}
              </div>
              <span className="mt-4 text-xs font-semibold text-[#D4AF37]">
                {specialty}
              </span>
            </div>
          )}
        </Link>

        {/* Dentaire hover action reveal */}
        <div className="pointer-events-none absolute inset-x-0 bottom-4 z-10 flex items-center justify-center gap-2.5 opacity-0 translate-y-3 transition-all duration-300 group-hover:pointer-events-auto group-hover:opacity-100 group-hover:translate-y-0">
          <Link
            href={`/appointment?doctor=${doctor.id}`}
            aria-label={`${t.teamSection.bookDoctor}: ${name}`}
            className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-[#D4AF37] px-3.5 text-xs font-bold text-[#080808] shadow-md transition-colors hover:bg-[#E6C76A]"
          >
            <CalendarCheck className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{t.teamSection.bookDoctor}</span>
          </Link>
          <Link
            href={`/doctors/${doctor.slug}`}
            aria-label={`${t.teamSection.viewProfile}: ${name}`}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#D4AF37]/40 bg-[#080808]/90 text-[#E6C76A] shadow-md transition-colors hover:bg-[#D4AF37] hover:text-[#080808]"
          >
            <UserRound className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>

      <div className="mt-5">
        <h3 className="text-xl font-bold text-[#F7F3E9]">
          <Link
            href={`/doctors/${doctor.slug}`}
            className="transition-colors hover:text-[#E6C76A]"
          >
            {name}
          </Link>
        </h3>
        <p className="mt-1 text-sm font-medium text-[#C8BFA8]">{specialty}</p>
      </div>
    </article>
  );
}
