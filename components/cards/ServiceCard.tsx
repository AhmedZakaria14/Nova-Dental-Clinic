'use client';

import Link from 'next/link';
import {
  ArrowUpLeft,
  ArrowUpRight,
  Gem,
  Microscope,
  ShieldCheck,
  Smile,
  Stethoscope,
  Zap,
} from 'lucide-react';
import { DentalService } from '@/lib/clinic-data';
import { useLanguage } from '@/components/LanguageProvider';

const ICON_MAP = {
  sparkles: Gem,
  shield: ShieldCheck,
  smile: Smile,
  zap: Zap,
  microscope: Microscope,
  stethoscope: Stethoscope,
};

export default function ServiceCard({
  service,
  bordered = false,
}: {
  service: DentalService;
  bordered?: boolean;
}) {
  const { locale, dir, t } = useLanguage();
  const Icon = ICON_MAP[service.iconKey] ?? Gem;
  const ArrowIcon = dir === 'rtl' ? ArrowUpLeft : ArrowUpRight;

  const title = locale === 'en' ? service.titleEn : service.titleAr;
  const summary = locale === 'en' ? service.summaryEn : service.summaryAr;

  return (
    <article
      className={`dentaire-service-card group flex h-full flex-col justify-between p-7 sm:p-8 ${
        bordered ? 'border border-[#D4AF37]/25' : ''
      }`}
    >
      <div className="relative z-10">
        <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-[#D4AF37]/25 bg-[#D4AF37]/12 text-[#E6C76A] transition-colors duration-300 group-hover:border-[#080808]/20 group-hover:bg-[#080808]/12 group-hover:text-[#080808]">
          <Icon className="h-7 w-7" aria-hidden="true" />
        </div>

        <h3 className="text-xl font-bold text-[#F7F3E9] transition-colors duration-300 group-hover:text-[#080808]">
          <Link href={`/services/${service.slug}`} className="focus:outline-none">
            {title}
          </Link>
        </h3>

        <p className="mt-3 text-sm leading-relaxed text-[#C8BFA8] transition-colors duration-300 group-hover:text-[#1A160B]">
          {summary}
        </p>
      </div>

      <div className="relative z-10 mt-6 pt-2">
        <Link
          href={`/services/${service.slug}`}
          className="inline-flex items-center gap-2.5 text-sm font-bold text-[#E6C76A] transition-colors duration-300 group-hover:text-[#080808]"
        >
          <span>{t.servicesSection.readMore}</span>
          <span
            aria-hidden="true"
            className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#D4AF37] text-[#080808] transition-transform duration-300 group-hover:bg-[#080808] group-hover:text-[#E6C76A] group-hover:rotate-12"
          >
            <ArrowIcon className="h-3.5 w-3.5" />
          </span>
        </Link>
      </div>
    </article>
  );
}
