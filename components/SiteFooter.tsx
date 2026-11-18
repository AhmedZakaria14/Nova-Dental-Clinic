'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Instagram, Mail, MapPin, Phone } from 'lucide-react';
import { CLINIC_INFO } from '@/lib/clinic-config';
import { useLanguage } from './LanguageProvider';
import LanguageSwitcher from './LanguageSwitcher';

export default function SiteFooter() {
  const { locale, t } = useLanguage();

  const brandName =
    locale === 'en' ? CLINIC_INFO.brandNameEn : CLINIC_INFO.brandNameAr;
  const slogan = locale === 'en' ? CLINIC_INFO.sloganEn : CLINIC_INFO.sloganAr;
  const address = locale === 'en' ? CLINIC_INFO.addressEn : CLINIC_INFO.addressAr;

  return (
    <footer className="border-t border-[#D4AF37]/25 bg-[#050505] text-[#F7F3E9] pt-16 sm:pt-20">
      <div className="mx-auto max-w-[1300px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12">
          {/* Column 1: Brand Logo & Official Slogan */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-flex items-center gap-3.5">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-[#D4AF37]/45 bg-black shadow-[0_0_20px_rgba(212,175,55,0.16)]">
                <Image
                  src={CLINIC_INFO.logoPath}
                  alt={brandName}
                  fill
                  sizes="56px"
                  className="object-cover scale-125"
                />
              </div>
              <span className="text-xl font-bold text-[#F7F3E9]">{brandName}</span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-relaxed text-[#C8BFA8]">
              {slogan}
            </p>

            <a
              href={CLINIC_INFO.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-start gap-2 text-sm text-[#C8BFA8] transition-colors hover:text-[#E6C76A]"
            >
              <MapPin className="mt-1 h-4 w-4 shrink-0 text-[#D4AF37]" aria-hidden="true" />
              <span>{address}</span>
            </a>
          </div>

          {/* Column 2: Quick Links */}
          <div className="lg:col-span-3">
            <h3 className="text-lg font-semibold text-[#E6C76A]">
              {t.footer.quickLinksTitle}
            </h3>
            <ul className="mt-5 space-y-2.5 text-sm text-[#C8BFA8]">
              <li>
                <Link href="/" className="transition-colors hover:text-[#E6C76A]">
                  {t.nav.home}
                </Link>
              </li>
              <li>
                <Link href="/about" className="transition-colors hover:text-[#E6C76A]">
                  {t.nav.about}
                </Link>
              </li>
              <li>
                <Link href="/services" className="transition-colors hover:text-[#E6C76A]">
                  {t.nav.services}
                </Link>
              </li>
              <li>
                <Link href="/doctors" className="transition-colors hover:text-[#E6C76A]">
                  {t.nav.doctors}
                </Link>
              </li>
              <li>
                <Link href="/appointment" className="transition-colors hover:text-[#E6C76A]">
                  {t.nav.bookAppointment}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Explore & Official Instagram */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold text-[#E6C76A]">
              {t.footer.socialTitle}
            </h3>
            <ul className="mt-5 space-y-2.5 text-sm text-[#C8BFA8]">
              <li>
                <a
                  href={CLINIC_INFO.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 transition-colors hover:text-[#E6C76A]"
                >
                  <Instagram className="h-4 w-4 text-[#D4AF37]" aria-hidden="true" />
                  <span dir="ltr">{CLINIC_INFO.instagramHandle}</span>
                </a>
              </li>
              <li>
                <Link href="/gallery" className="transition-colors hover:text-[#E6C76A]">
                  {t.nav.gallery}
                </Link>
              </li>
              <li>
                <Link href="/technology" className="transition-colors hover:text-[#E6C76A]">
                  {t.nav.technology}
                </Link>
              </li>
              <li>
                <Link href="/faqs" className="transition-colors hover:text-[#E6C76A]">
                  {t.nav.faqs}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="transition-colors hover:text-[#E6C76A]">
                  {t.nav.blog}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Verified Contact Info */}
          <div className="lg:col-span-3">
            <h3 className="text-lg font-semibold text-[#E6C76A]">
              {t.footer.contactTitle}
            </h3>
            <ul className="mt-5 space-y-3 text-sm text-[#C8BFA8]">
              <li>
                <a
                  href={`mailto:${CLINIC_INFO.email}`}
                  dir="ltr"
                  className="inline-flex items-center gap-2 transition-colors hover:text-[#E6C76A]"
                >
                  <Mail className="h-4 w-4 shrink-0 text-[#D4AF37]" aria-hidden="true" />
                  <span>{CLINIC_INFO.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={CLINIC_INFO.primaryPhoneTel}
                  dir="ltr"
                  className="inline-flex items-center gap-2 font-semibold text-[#F7F3E9] tabular-nums transition-colors hover:text-[#E6C76A]"
                >
                  <Phone className="h-4 w-4 shrink-0 text-[#D4AF37]" aria-hidden="true" />
                  <span>{CLINIC_INFO.primaryPhoneInternational}</span>
                </a>
              </li>
              <li className="flex flex-wrap gap-3 pt-1 text-xs text-[#9E9580]">
                {CLINIC_INFO.additionalPhones.map((item) => (
                  <a
                    key={item.display}
                    href={item.tel}
                    dir="ltr"
                    className="tabular-nums transition-colors hover:text-[#E6C76A]"
                  >
                    {item.display}
                  </a>
                ))}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-[#D4AF37]/20 py-7 text-center text-sm text-[#9E9580] sm:flex-row">
          <p>{t.footer.copyright}</p>
          <LanguageSwitcher variant="footer" />
        </div>
      </div>
    </footer>
  );
}
