import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { IBM_Plex_Sans_Arabic } from 'next/font/google';
import './globals.css';
import { CLINIC_INFO } from '@/lib/clinic-config';
import { DICTIONARIES, Locale } from '@/lib/i18n';
import { LanguageProvider } from '@/components/LanguageProvider';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import SmoothScrollProvider from '@/components/SmoothScrollProvider';
import FloatingWhatsAppButton from '@/components/FloatingWhatsAppButton';

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-ibm-arabic',
  display: 'swap',
});

const baseUrl = process.env.APP_URL || 'http://localhost:3000';

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const locale: Locale =
    cookieStore.get('nova_locale')?.value === 'en' ? 'en' : 'ar';
  const t = DICTIONARIES[locale];

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: t.meta.homeTitle,
      template: `%s | ${t.meta.siteName}`,
    },
    description: t.meta.homeDescription,
    alternates: {
      canonical: '/',
      languages: {
        ar: '/?lang=ar',
        en: '/?lang=en',
        'x-default': '/',
      },
    },
    openGraph: {
      title: t.meta.homeTitle,
      description: t.meta.homeDescription,
      type: 'website',
      locale: locale === 'en' ? 'en_US' : 'ar_EG',
      siteName: t.meta.siteName,
    },
    twitter: {
      card: 'summary_large_image',
      title: t.meta.homeTitle,
      description: t.meta.homeDescription,
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const initialLocale: Locale =
    cookieStore.get('nova_locale')?.value === 'en' ? 'en' : 'ar';
  const dir = initialLocale === 'en' ? 'ltr' : 'rtl';

  const clinicSchema = {
    '@context': 'https://schema.org',
    '@type': 'Dentist',
    name: CLINIC_INFO.brandNameEn,
    alternateName: CLINIC_INFO.brandNameAr,
    description:
      initialLocale === 'en' ? CLINIC_INFO.sloganEn : CLINIC_INFO.sloganAr,
    url: baseUrl,
    telephone: CLINIC_INFO.primaryPhoneInternational,
    email: CLINIC_INFO.email,
    sameAs: [CLINIC_INFO.instagramUrl],
    areaServed: ['Fifth Settlement, New Cairo', 'Nasr City, Cairo'],
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Ozone Medical Center, Fifth Settlement',
      addressLocality: 'New Cairo',
      addressRegion: 'Cairo',
      addressCountry: 'EG',
    },
    department: [
      {
        '@type': 'Dentist',
        name: 'NOVA Dental Clinic — Fifth Settlement',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Ozone Medical Center, Fifth Settlement',
          addressLocality: 'New Cairo',
          addressRegion: 'Cairo',
          addressCountry: 'EG',
        },
        hasMap: CLINIC_INFO.googleMapsUrl,
      },
      {
        '@type': 'Dentist',
        name: 'NOVA Dental Clinic — Nasr City',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Nasr City',
          addressRegion: 'Cairo',
          addressCountry: 'EG',
        },
      },
    ],
    hasMap: CLINIC_INFO.googleMapsUrl,
  };

  return (
    <html
      lang={initialLocale}
      dir={dir}
      className={ibmPlexArabic.variable}
      suppressHydrationWarning
    >
      <body
        className="min-h-screen bg-[#080808] text-[#C8BFA8] selection:bg-[#D4AF37] selection:text-[#080808]"
        suppressHydrationWarning
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(clinicSchema) }}
        />
        <LanguageProvider initialLocale={initialLocale}>
          <SmoothScrollProvider>
            <div className="flex min-h-screen flex-col">
              <SiteHeader />
              <main className="flex-1">{children}</main>
              <SiteFooter />
            </div>
            <FloatingWhatsAppButton />
          </SmoothScrollProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
