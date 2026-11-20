import type { Metadata } from 'next';
import { CLINIC_INFO } from './clinic-config';
import { DICTIONARIES, Locale } from './i18n';

export function getSiteBaseUrl(): string {
  return process.env.APP_URL || 'http://localhost:3000';
}

export function buildPageMetadata(params: {
  locale: Locale;
  title: string;
  description: string;
  path: string;
  type?: 'website' | 'article';
}): Metadata {
  const { locale, title, description, path, type = 'website' } = params;
  const siteName = DICTIONARIES[locale].meta.siteName;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const fullTitle = `${title} | ${siteName}`;
  const ogImage = {
    url: '/opengraph-image',
    width: 1200,
    height: 630,
    alt:
      locale === 'en'
        ? `${CLINIC_INFO.brandNameEn} — Cosmetic Dentistry, Implants & Smile Design`
        : `${CLINIC_INFO.brandNameAr} — تجميل وزراعة الأسنان وتصميم الابتسامة`,
  };

  return {
    title,
    description,
    alternates: {
      canonical: normalizedPath,
      languages: {
        ar: `${normalizedPath}?lang=ar`,
        en: `${normalizedPath}?lang=en`,
        'x-default': normalizedPath,
      },
    },
    openGraph: {
      title: fullTitle,
      description,
      url: normalizedPath,
      type,
      locale: locale === 'en' ? 'en_US' : 'ar_EG',
      siteName,
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: ['/twitter-image'],
    },
  };
}
