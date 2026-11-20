'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowUpLeft,
  ArrowUpRight,
  Crown,
  Gem,
  Layers,
  Microscope,
  Scissors,
  ShieldCheck,
  Smile,
  Stethoscope,
  Zap,
} from 'lucide-react';
import { DentalService } from '@/lib/clinic-data';
import { SERVICE_IMAGES } from '@/components/service-images';
import { useLanguage } from '@/components/LanguageProvider';

const ICON_MAP = {
  sparkles: Gem,
  shield: ShieldCheck,
  smile: Smile,
  zap: Zap,
  microscope: Microscope,
  stethoscope: Stethoscope,
  layers: Layers,
  crown: Crown,
  scissors: Scissors,
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
  const category =
    locale === 'en' ? service.categoryLabelEn : service.categoryLabelAr;
  const imageSrc = SERVICE_IMAGES[service.imageKey];

  return (
    <article
      className={`dentaire-service-card group flex h-full flex-col overflow-hidden ${
        bordered ? 'border border-[#D4AF37]/25' : ''
      }`}
    >
      {/* Expressive 4:3 Dental Treatment Photo */}
      <Link
        href={`/services/${service.slug}`}
        tabIndex={-1}
        aria-hidden="true"
        className="relative z-10 block aspect-[4/3] w-full overflow-hidden bg-[#0E0D0B]"
      >
        <Image
          src={imageSrc}
          alt={title}
          fill
          referrerPolicy="no-referrer"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#161512]/80 via-[#161512]/15 to-transparent transition-opacity duration-300 group-hover:opacity-60"
        />
      </Link>

      {/* Editorial Body with Signature Gold Curtain Hover */}
      <div className="relative z-10 flex flex-1 flex-col justify-between p-6">
        <div>
          <div className="flex items-center justify-between gap-2 text-xs font-medium text-[#9E9580] transition-colors duration-300 group-hover:text-[#1A160B]">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="font-bold text-[#E6C76A] tabular-nums transition-colors duration-300 group-hover:text-[#080808]">
                {service.number}
              </span>
              <span aria-hidden="true">·</span>
              <span className="truncate">{category}</span>
            </div>
            <Icon
              className="h-4 w-4 shrink-0 text-[#D4AF37] transition-colors duration-300 group-hover:text-[#080808]"
              aria-hidden="true"
            />
          </div>

          <h3 className="mt-2.5 text-lg sm:text-xl font-bold leading-snug text-[#F7F3E9] transition-colors duration-300 group-hover:text-[#080808]">
            <Link
              href={`/services/${service.slug}`}
              className="focus:outline-none focus-visible:underline"
            >
              {title}
            </Link>
          </h3>

          <p className="mt-2.5 text-sm leading-relaxed text-[#C8BFA8] line-clamp-3 transition-colors duration-300 group-hover:text-[#1A160B]">
            {summary}
          </p>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#D4AF37]/15 pt-4 transition-colors duration-300 group-hover:border-[#080808]/15">
          <Link
            href={`/services/${service.slug}`}
            className="inline-flex items-center gap-2 text-sm font-bold text-[#E6C76A] whitespace-nowrap transition-colors duration-300 group-hover:text-[#080808]"
          >
            <span>{t.servicesSection.readMore}</span>
            <span
              aria-hidden="true"
              className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#D4AF37] text-[#080808] transition-transform duration-300 group-hover:bg-[#080808] group-hover:text-[#E6C76A] group-hover:rotate-12"
            >
              <ArrowIcon className="h-3.5 w-3.5" />
            </span>
          </Link>

          <Link
            href={`/appointment?service=${service.id}`}
            className="text-xs font-semibold text-[#C8BFA8] underline-offset-4 hover:underline whitespace-nowrap transition-colors duration-300 group-hover:text-[#080808]"
          >
            {locale === 'en' ? 'Book' : 'احجز'}
          </Link>
        </div>
      </div>
    </article>
  );
}
