'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Menu, Phone, X } from 'lucide-react';
import { CLINIC_INFO } from '@/lib/clinic-config';
import { useLanguage } from './LanguageProvider';
import LanguageSwitcher from './LanguageSwitcher';
import AppointmentButton from './AppointmentButton';

export default function SiteHeader() {
  const pathname = usePathname();
  const { locale, t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pagesDropdownOpen, setPagesDropdownOpen] = useState(false);
  const [scrollState, setScrollState] = useState<'top' | 'hide' | 'active'>('top');

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      if (y > 600) {
        setScrollState('active');
      } else if (y > 180) {
        setScrollState('hide');
      } else {
        setScrollState('top');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const brandName =
    locale === 'en' ? CLINIC_INFO.brandNameEn : CLINIC_INFO.brandNameAr;

  const pageSubLinks = [
    { href: '/doctors', label: t.nav.doctors },
    { href: '/gallery', label: t.nav.gallery },
    { href: '/technology', label: t.nav.technology },
    { href: '/testimonials', label: t.nav.testimonials },
    { href: '/faqs', label: t.nav.faqs },
    { href: '/blog', label: t.nav.blog },
  ];

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  const isHidden = scrollState === 'hide' && !mobileOpen && !pagesDropdownOpen;
  const isPinned = scrollState === 'active';

  return (
    <header
      className={`sticky top-0 z-40 border-b border-[#D4AF37]/15 transition-all duration-300 ease-in-out ${
        isPinned
          ? 'bg-[#080808]/95 backdrop-blur-xl shadow-[0_12px_36px_rgba(0,0,0,0.65)]'
          : 'bg-[#0a0908]/95 backdrop-blur-md'
      } ${isHidden ? '-translate-y-full' : 'translate-y-0'}`}
    >
      <div className="mx-auto flex max-w-[1300px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8 lg:py-[26px]">
        {/* Official Brand Logo + Name (Dentaire .navbar-brand proportion) */}
        <Link
          href="/"
          className="flex items-center gap-3 shrink-0 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D4AF37]"
        >
          <div className="relative h-10 w-10 sm:h-12 sm:w-12 shrink-0 overflow-hidden rounded-xl border border-[#D4AF37]/30 bg-black">
            <Image
              src={CLINIC_INFO.logoPath}
              alt={brandName}
              fill
              sizes="48px"
              priority
              className="object-cover scale-125"
            />
          </div>
          <span className="text-base sm:text-xl font-bold tracking-tight text-[#F7F3E9]">
            {brandName}
          </span>
        </Link>

        {/* Centered Desktop Navigation — Exact 5 Dentaire Top-Level Items */}
        <nav
          aria-label={locale === 'ar' ? 'التنقل الرئيسي' : 'Main Navigation'}
          className="hidden lg:flex items-center justify-center gap-2 xl:gap-5"
        >
          <Link
            href="/"
            className={`px-3.5 py-2.5 text-[16px] font-medium transition-colors whitespace-nowrap ${
              isActive('/')
                ? 'text-[#E6C76A]'
                : 'text-[#F7F3E9] hover:text-[#D4AF37]'
            }`}
          >
            {t.nav.home}
          </Link>

          <Link
            href="/about"
            className={`px-3.5 py-2.5 text-[16px] font-medium transition-colors whitespace-nowrap ${
              isActive('/about')
                ? 'text-[#E6C76A]'
                : 'text-[#F7F3E9] hover:text-[#D4AF37]'
            }`}
          >
            {t.nav.about}
          </Link>

          <Link
            href="/services"
            className={`px-3.5 py-2.5 text-[16px] font-medium transition-colors whitespace-nowrap ${
              isActive('/services')
                ? 'text-[#E6C76A]'
                : 'text-[#F7F3E9] hover:text-[#D4AF37]'
            }`}
          >
            {t.nav.services}
          </Link>

          {/* Dentaire Pages Dropdown — Preserves All Current Internal Pages & Routes */}
          <div
            className="relative"
            onMouseEnter={() => setPagesDropdownOpen(true)}
            onMouseLeave={() => setPagesDropdownOpen(false)}
          >
            <button
              type="button"
              aria-expanded={pagesDropdownOpen}
              onClick={() => setPagesDropdownOpen((prev) => !prev)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 text-[16px] font-medium transition-colors whitespace-nowrap cursor-pointer ${
                pageSubLinks.some((sub) => isActive(sub.href))
                  ? 'text-[#E6C76A]'
                  : 'text-[#F7F3E9] hover:text-[#D4AF37]'
              }`}
            >
              <span>{t.nav.pages}</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${
                  pagesDropdownOpen ? 'rotate-180 text-[#D4AF37]' : ''
                }`}
                aria-hidden="true"
              />
            </button>

            {pagesDropdownOpen && (
              <div className="absolute top-full inset-inline-start-0 z-50 pt-2">
                <div className="w-[250px] rounded-[20px] border border-[#D4AF37]/25 bg-[#141310] py-3 shadow-2xl">
                  {pageSubLinks.map((sub) => (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      onClick={() => setPagesDropdownOpen(false)}
                      className={`block px-5 py-2 text-[15px] font-medium transition-colors ${
                        isActive(sub.href)
                          ? 'text-[#E6C76A]'
                          : 'text-[#F7F3E9] hover:text-[#D4AF37]'
                      }`}
                    >
                      {sub.label}
                    </Link>
                  ))}
                  <div className="mt-2 border-t border-[#D4AF37]/15 pt-1">
                    <LanguageSwitcher variant="dropdown" />
                  </div>
                </div>
              </div>
            )}
          </div>

          <Link
            href="/contact"
            className={`px-3.5 py-2.5 text-[16px] font-medium transition-colors whitespace-nowrap ${
              isActive('/contact')
                ? 'text-[#E6C76A]'
                : 'text-[#F7F3E9] hover:text-[#D4AF37]'
            }`}
          >
            {t.nav.contact}
          </Link>
        </nav>

        {/* End Action — Exact Dentaire Single CTA Button on Desktop, Single Toggle Button on Mobile */}
        <div className="flex items-center shrink-0">
          <div className="hidden lg:block">
            <AppointmentButton />
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? t.nav.closeMenu : t.nav.openMenu}
            className="inline-flex h-[40px] w-[40px] items-center justify-center rounded-[7px] bg-[#D4AF37] text-[#080808] transition-colors hover:bg-[#E6C76A] lg:hidden cursor-pointer"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile & Tablet Navigation Drawer */}
      {mobileOpen && (
        <div className="border-t border-[#D4AF37]/20 bg-[#0D0C0A] text-[#F7F3E9] lg:hidden">
          <nav
            aria-label={locale === 'ar' ? 'قائمة الجوال' : 'Mobile Navigation'}
            className="mx-auto max-w-[1300px] space-y-1 px-4 py-5 sm:px-6"
          >
            <div className="mb-3 flex items-center justify-between gap-3 border-b border-[#D4AF37]/15 pb-3">
              <LanguageSwitcher variant="mobile" />
              <a
                href={CLINIC_INFO.primaryPhoneTel}
                dir="ltr"
                className="inline-flex min-h-[40px] items-center gap-2 rounded-full border border-[#D4AF37]/25 bg-[#161512] px-4 py-2 text-sm font-semibold text-[#F7F3E9] tabular-nums"
              >
                <Phone className="h-4 w-4 text-[#D4AF37]" aria-hidden="true" />
                <span>{CLINIC_INFO.primaryPhone}</span>
              </a>
            </div>

            {[
              { href: '/', label: t.nav.home },
              { href: '/about', label: t.nav.about },
              { href: '/services', label: t.nav.services },
              ...pageSubLinks,
              { href: '/contact', label: t.nav.contact },
              { href: '/appointment', label: t.nav.appointment },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex min-h-[44px] items-center rounded-lg px-3 text-base font-medium transition-colors ${
                  isActive(item.href)
                    ? 'bg-[#D4AF37]/15 text-[#E6C76A]'
                    : 'text-[#F7F3E9] hover:bg-[#161512] hover:text-[#E6C76A]'
                }`}
              >
                {item.label}
              </Link>
            ))}

            <div className="pt-3">
              <AppointmentButton
                highlighted
                className="w-full justify-between"
                onClick={() => {
                  setMobileOpen(false);
                }}
                href="/appointment"
              />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
