'use client';

import Image from 'next/image';
import Link from 'next/link';
import { CalendarCheck, UserRound } from 'lucide-react';
import { DoctorProfile } from '@/lib/clinic-data';
import { useLanguage } from '@/components/LanguageProvider';

export default function DoctorCard({ doctor }: { doctor: DoctorProfile }) {
  const { locale, t } = useLanguage();
  const specialty = locale === 'en' ? doctor.specialtyEn : doctor.specialtyAr;
  const clinicTitle = locale === 'en' ? 'NOVA Dental Clinic' : 'نوفا لطب الأسنان';

  return (
    <article className="group text-center">
      <div className="dentaire-image-anime relative overflow-hidden rounded-[30px] border border-[#D4AF37]/25 bg-[#161512]">
        <Link href={`/doctors/${doctor.slug}`} className="block aspect-[4/4.6] relative">
          <Image
            src={doctor.imageSrc}
            alt={clinicTitle}
            fill
            quality={95}
            referrerPolicy="no-referrer"
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {/* Dentaire hover action reveal */}
        <div className="pointer-events-none absolute inset-x-0 bottom-4 z-10 flex items-center justify-center gap-2.5 opacity-0 translate-y-3 transition-all duration-300 group-hover:pointer-events-auto group-hover:opacity-100 group-hover:translate-y-0">
          <Link
            href={`/appointment?doctor=${doctor.id}`}
            aria-label={t.teamSection.bookDoctor}
            className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-[#D4AF37] px-3.5 text-xs font-bold text-[#080808] shadow-md transition-colors hover:bg-[#E6C76A]"
          >
            <CalendarCheck className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{t.teamSection.bookDoctor}</span>
          </Link>
          <Link
            href={`/doctors/${doctor.slug}`}
            aria-label={t.teamSection.viewProfile}
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
            {specialty}
          </Link>
        </h3>
        <p className="mt-1 text-sm font-medium text-[#D4AF37]">{clinicTitle}</p>
      </div>
    </article>
  );
}
