'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useRouter } from 'next/navigation';
import { DICTIONARIES, Dictionary, Locale } from '@/lib/i18n';

interface LanguageContextValue {
  locale: Locale;
  dir: 'rtl' | 'ltr';
  t: Dictionary;
  setLocale: (next: Locale) => void;
  toggleLocale: () => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({
  initialLocale = 'ar',
  children,
}: {
  initialLocale?: Locale;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  const applyDocumentDirection = useCallback((next: Locale) => {
    const dir = next === 'en' ? 'ltr' : 'rtl';
    document.documentElement.lang = next;
    document.documentElement.dir = dir;
    document.cookie = `nova_locale=${next}; path=/; max-age=31536000; SameSite=Lax`;
    try {
      window.localStorage.setItem('nova_locale', next);
    } catch {
      // Ignore storage errors
    }
  }, []);

  useEffect(() => {
    applyDocumentDirection(locale);
  }, [locale, applyDocumentDirection]);

  const setLocale = useCallback(
    (next: Locale) => {
      setLocaleState(next);
      applyDocumentDirection(next);
      router.refresh();
    },
    [applyDocumentDirection, router]
  );

  const toggleLocale = useCallback(() => {
    setLocale(locale === 'ar' ? 'en' : 'ar');
  }, [locale, setLocale]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      locale,
      dir: locale === 'en' ? 'ltr' : 'rtl',
      t: DICTIONARIES[locale],
      setLocale,
      toggleLocale,
    }),
    [locale, setLocale, toggleLocale]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return ctx;
}
