'use client';

import { Globe } from 'lucide-react';
import { useLanguage } from './LanguageProvider';

export default function LanguageSwitcher({
  variant = 'header',
}: {
  variant?: 'header' | 'mobile' | 'dropdown' | 'footer';
}) {
  const { locale, t, toggleLocale } = useLanguage();

  const variantClasses =
    variant === 'mobile'
      ? 'inline-flex min-h-[40px] items-center gap-2 rounded-full border border-[#D4AF37]/35 bg-[#161512] px-4 py-2 text-sm font-semibold text-[#F7F3E9] transition-colors hover:border-[#E6C76A] hover:text-[#E6C76A] cursor-pointer'
      : variant === 'dropdown'
        ? 'flex w-full items-center justify-between px-5 py-2.5 text-xs font-semibold text-[#C8BFA8] transition-colors hover:text-[#E6C76A] cursor-pointer'
        : variant === 'footer'
          ? 'inline-flex min-h-[36px] items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#11100E] px-4 py-1.5 text-xs font-semibold text-[#F7F3E9] transition-colors hover:border-[#E6C76A] hover:text-[#E6C76A] whitespace-nowrap shrink-0 cursor-pointer'
          : 'inline-flex min-h-[38px] items-center gap-1.5 rounded-full border border-[#D4AF37]/30 bg-[#161512] px-3.5 py-1.5 text-xs font-semibold text-[#F7F3E9] transition-colors hover:border-[#E6C76A] hover:text-[#E6C76A] whitespace-nowrap shrink-0 cursor-pointer';

  return (
    <button
      type="button"
      onClick={toggleLocale}
      aria-label={
        locale === 'ar' ? 'Switch language to English' : 'التبديل إلى اللغة العربية'
      }
      data-testid="language-switcher"
      className={variantClasses}
    >
      <span className="inline-flex items-center gap-1.5">
        <Globe className="h-3.5 w-3.5 text-[#D4AF37]" aria-hidden="true" />
        <span>{t.nav.switchLangLabel}</span>
      </span>
    </button>
  );
}
