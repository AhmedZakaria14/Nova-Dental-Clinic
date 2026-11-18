'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Phone } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { CLINIC_INFO } from '@/lib/clinic-config';
import { useLanguage } from './LanguageProvider';
import LanguageSwitcher from './LanguageSwitcher';
import AppointmentButton from './AppointmentButton';

export default function SiteHeader() {
  const pathname = usePathname();
  const { locale, t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobilePagesOpen, setMobilePagesOpen] = useState(false);
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

  useEffect(() => {
    if (!mobileOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileOpen(false);
        setMobilePagesOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileOpen]);

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

  const isAnySubPageActive = pageSubLinks.some((sub) => isActive(sub.href));
  const isHidden = scrollState === 'hide' && !mobileOpen && !pagesDropdownOpen;
  const isPinned = scrollState === 'active';

  const closeMobileMenu = () => {
    setMobileOpen(false);
    setMobilePagesOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileOpen((prev) => {
      const next = !prev;
      if (next) {
        setMobilePagesOpen(isAnySubPageActive);
      } else {
        setMobilePagesOpen(false);
      }
      return next;
    });
  };

  return (
    <header
      className={`sticky top-0 z-40 border-b border-[#D4AF37]/15 transition-all duration-300 ease-in-out ${
        isPinned
          ? 'bg-[#080808]/95 backdrop-blur-xl shadow-[0_12px_36px_rgba(0,0,0,0.65)]'
          : 'bg-[#0a0908]/95 backdrop-blur-md'
      } ${isHidden ? '-translate-y-full' : 'translate-y-0'}`}
    >
      <div className="relative z-20 mx-auto flex max-w-[1300px] items-center justify-between gap-3 px-4 py-3 sm:gap-4 sm:px-6 lg:px-8 lg:py-[18px]">
        {/* Official Brand Logo + Name (Larger HD NOVA Mark + Dentaire Proportion) */}
        <Link
          href="/"
          onClick={closeMobileMenu}
          className="flex min-w-0 items-center gap-2.5 sm:gap-3.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D4AF37]"
        >
          <div className="relative h-[46px] w-[68px] sm:h-[56px] sm:w-[84px] lg:h-[64px] lg:w-[96px] shrink-0 overflow-hidden rounded-xl border border-[#D4AF37]/40 bg-black p-0.5 shadow-[0_0_18px_rgba(212,175,55,0.18)]">
            <Image
              src={CLINIC_INFO.logoPath}
              alt={brandName}
              fill
              sizes="(max-width: 640px) 192px, 256px"
              quality={100}
              priority
              className="object-contain p-0.5"
            />
          </div>
          <span className="truncate text-[15px] sm:text-xl font-bold tracking-tight text-[#F7F3E9]">
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
                isAnySubPageActive
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

            <AnimatePresence>
              {pagesDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute top-full inset-inline-start-0 z-50 pt-2"
                >
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
                </motion.div>
              )}
            </AnimatePresence>
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

        {/* End Action — Exact Dentaire Single CTA Button on Desktop, Single SlickNav Toggle on Mobile */}
        <div className="flex items-center shrink-0">
          <div className="hidden lg:block">
            <AppointmentButton />
          </div>

          <button
            type="button"
            onClick={toggleMobileMenu}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation-drawer"
            aria-label={mobileOpen ? t.nav.closeMenu : t.nav.openMenu}
            className="inline-flex h-[38px] w-[38px] flex-col items-center justify-center gap-[4px] rounded-[8px] bg-[#D4AF37] text-[#080808] shadow-[0_4px_14px_rgba(212,175,55,0.25)] transition-colors hover:bg-[#E6C76A] lg:hidden cursor-pointer"
          >
            <span
              aria-hidden="true"
              className={`block h-[2.5px] w-[20px] rounded-full bg-[#080808] transition-all duration-200 ease-in-out ${
                mobileOpen ? 'translate-y-[6.5px] -rotate-45' : ''
              }`}
            />
            <span
              aria-hidden="true"
              className={`block h-[2.5px] w-[20px] rounded-full bg-[#080808] transition-all duration-200 ease-in-out ${
                mobileOpen ? 'opacity-0 scale-x-0' : 'opacity-100'
              }`}
            />
            <span
              aria-hidden="true"
              className={`block h-[2.5px] w-[20px] rounded-full bg-[#080808] transition-all duration-200 ease-in-out ${
                mobileOpen ? '-translate-y-[6.5px] rotate-45' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile & Tablet Slide-Down Drawer (Dentaire SlickNav Transition + Full Viewport Fit) */}
      <AnimatePresence initial={false}>
        {mobileOpen && (
          <>
            {/* Tap-outside Backdrop */}
            <motion.div
              key="mobile-nav-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.24, ease: 'easeOut' }}
              onClick={closeMobileMenu}
              aria-hidden="true"
              className="absolute inset-x-0 top-full h-dvh z-10 bg-black/65 backdrop-blur-[2px] lg:hidden"
            />

            {/* Slide-Down Menu Container (max-h uses 100dvh so nothing clips on any mobile screen) */}
            <motion.div
              id="mobile-navigation-drawer"
              key="mobile-nav-panel"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-x-0 top-full z-30 overflow-hidden border-t border-[#D4AF37]/25 bg-[#0D0C0A] text-[#F7F3E9] shadow-[0_24px_60px_rgba(0,0,0,0.85)] lg:hidden"
            >
              <nav
                aria-label={locale === 'ar' ? 'قائمة الجوال' : 'Mobile Navigation'}
                className="mx-auto max-h-[calc(100dvh-74px)] sm:max-h-[calc(100dvh-88px)] max-w-[1300px] overflow-y-auto overscroll-contain px-4 pt-3.5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:px-6"
              >
                {/* Compact Utility Row (wraps safely on 320px screens) */}
                <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2 border-b border-[#D4AF37]/15 pb-3">
                  <LanguageSwitcher variant="mobile" />
                  <a
                    href={CLINIC_INFO.primaryPhoneTel}
                    dir="ltr"
                    className="inline-flex min-h-[38px] items-center gap-2 rounded-full border border-[#D4AF37]/25 bg-[#161512] px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-[#F7F3E9] tabular-nums transition-colors hover:border-[#E6C76A]"
                  >
                    <Phone className="h-3.5 w-3.5 text-[#D4AF37]" aria-hidden="true" />
                    <span>{CLINIC_INFO.primaryPhone}</span>
                  </a>
                </div>

                {/* Primary 5 Dentaire Items with Nested Accordion for Pages */}
                <ul className="space-y-0.5 py-1">
                  <li>
                    <Link
                      href="/"
                      onClick={closeMobileMenu}
                      className={`flex min-h-[44px] items-center rounded-lg px-3.5 text-[15px] sm:text-base font-medium transition-colors ${
                        isActive('/')
                          ? 'bg-[#D4AF37]/15 text-[#E6C76A]'
                          : 'text-[#F7F3E9] hover:bg-[#161512] hover:text-[#E6C76A]'
                      }`}
                    >
                      {t.nav.home}
                    </Link>
                  </li>

                  <li>
                    <Link
                      href="/about"
                      onClick={closeMobileMenu}
                      className={`flex min-h-[44px] items-center rounded-lg px-3.5 text-[15px] sm:text-base font-medium transition-colors ${
                        isActive('/about')
                          ? 'bg-[#D4AF37]/15 text-[#E6C76A]'
                          : 'text-[#F7F3E9] hover:bg-[#161512] hover:text-[#E6C76A]'
                      }`}
                    >
                      {t.nav.about}
                    </Link>
                  </li>

                  <li>
                    <Link
                      href="/services"
                      onClick={closeMobileMenu}
                      className={`flex min-h-[44px] items-center rounded-lg px-3.5 text-[15px] sm:text-base font-medium transition-colors ${
                        isActive('/services')
                          ? 'bg-[#D4AF37]/15 text-[#E6C76A]'
                          : 'text-[#F7F3E9] hover:bg-[#161512] hover:text-[#E6C76A]'
                      }`}
                    >
                      {t.nav.services}
                    </Link>
                  </li>

                  {/* Expandable Pages Accordion (mirrors Dentaire .slicknav_parent + .slicknav_arrow) */}
                  <li>
                    <button
                      type="button"
                      aria-expanded={mobilePagesOpen}
                      aria-controls="mobile-pages-submenu"
                      onClick={() => setMobilePagesOpen((prev) => !prev)}
                      className={`flex min-h-[44px] w-full items-center justify-between rounded-lg px-3.5 text-[15px] sm:text-base font-medium transition-colors cursor-pointer ${
                        isAnySubPageActive || mobilePagesOpen
                          ? 'bg-[#D4AF37]/10 text-[#E6C76A]'
                          : 'text-[#F7F3E9] hover:bg-[#161512] hover:text-[#E6C76A]'
                      }`}
                    >
                      <span>{t.nav.pages}</span>
                      <ChevronDown
                        className={`h-4 w-4 shrink-0 transition-transform duration-300 ease-out ${
                          mobilePagesOpen ? 'rotate-180 text-[#D4AF37]' : ''
                        }`}
                        aria-hidden="true"
                      />
                    </button>

                    <AnimatePresence initial={false}>
                      {mobilePagesOpen && (
                        <motion.ul
                          id="mobile-pages-submenu"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden border-s border-[#D4AF37]/25 ms-5 ps-2 mt-0.5 space-y-0.5"
                        >
                          {pageSubLinks.map((sub) => (
                            <li key={sub.href}>
                              <Link
                                href={sub.href}
                                onClick={closeMobileMenu}
                                className={`flex min-h-[40px] items-center rounded-lg px-3 text-sm sm:text-[15px] font-medium transition-colors ${
                                  isActive(sub.href)
                                    ? 'bg-[#D4AF37]/15 text-[#E6C76A]'
                                    : 'text-[#C8BFA8] hover:bg-[#161512] hover:text-[#E6C76A]'
                                }`}
                              >
                                {sub.label}
                              </Link>
                            </li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </li>

                  <li>
                    <Link
                      href="/contact"
                      onClick={closeMobileMenu}
                      className={`flex min-h-[44px] items-center rounded-lg px-3.5 text-[15px] sm:text-base font-medium transition-colors ${
                        isActive('/contact')
                          ? 'bg-[#D4AF37]/15 text-[#E6C76A]'
                          : 'text-[#F7F3E9] hover:bg-[#161512] hover:text-[#E6C76A]'
                      }`}
                    >
                      {t.nav.contact}
                    </Link>
                  </li>
                </ul>

                <div className="mt-2 border-t border-[#D4AF37]/15 pt-3">
                  <AppointmentButton
                    highlighted
                    className="w-full justify-between"
                    onClick={closeMobileMenu}
                    href="/appointment"
                  />
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
