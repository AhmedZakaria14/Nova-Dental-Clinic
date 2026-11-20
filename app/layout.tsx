import type { Metadata, Viewport } from 'next';
import { cookies } from 'next/headers';
import { IBM_Plex_Sans_Arabic } from 'next/font/google';
import './globals.css';
import { CLINIC_INFO } from '@/lib/clinic-config';
import { DENTAL_SERVICES } from '@/lib/clinic-data';
import { DICTIONARIES, Locale } from '@/lib/i18n';
import { LanguageProvider } from '@/components/LanguageProvider';
import { FirebaseProvider } from '@/components/FirebaseProvider';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import SmoothScrollProvider from '@/components/SmoothScrollProvider';
import FloatingWhatsAppButton from '@/components/FloatingWhatsAppButton';
import OfflineIndicator from '@/components/OfflineIndicator';

export const viewport: Viewport = {
  themeColor: '#080808',
  width: 'device-width',
  initialScale: 1,
};

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
    appleWebApp: {
      capable: true,
      statusBarStyle: 'black-translucent',
      title: 'NOVA Dental',
    },
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: 'any' },
        { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
        { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
        { url: '/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
      ],
      shortcut: ['/favicon.ico'],
      apple: [
        { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      ],
    },
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
      url: '/',
      type: 'website',
      locale: locale === 'en' ? 'en_US' : 'ar_EG',
      siteName: t.meta.siteName,
      images: [
        {
          url: '/opengraph-image',
          width: 1200,
          height: 630,
          alt:
            locale === 'en'
              ? `${CLINIC_INFO.brandNameEn} — Cosmetic Dentistry, Implants & Smile Design`
              : `${CLINIC_INFO.brandNameAr} — تجميل وزراعة الأسنان وتصميم الابتسامة`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t.meta.homeTitle,
      description: t.meta.homeDescription,
      images: ['/twitter-image'],
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
    image: `${baseUrl}/opengraph-image`,
    logo: `${baseUrl}${CLINIC_INFO.logoPath}`,
    priceRange: '$$',
    telephone: CLINIC_INFO.primaryPhoneInternational,
    email: CLINIC_INFO.email,
    sameAs: [CLINIC_INFO.instagramUrl],
    areaServed: ['Fifth Settlement, New Cairo', 'Nasr City, Cairo'],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Saturday',
          'Sunday',
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
        ],
        opens: '12:00',
        closes: '21:00',
      },
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Ozone Medical Center, Fifth Settlement',
      addressLocality: 'New Cairo',
      addressRegion: 'Cairo',
      addressCountry: 'EG',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name:
        initialLocale === 'en'
          ? 'NOVA Dental Clinic Services'
          : 'خدمات عيادة نوفا لطب الأسنان',
      itemListElement: DENTAL_SERVICES.map((srv) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'MedicalProcedure',
          name: initialLocale === 'en' ? srv.titleEn : srv.titleAr,
          description: initialLocale === 'en' ? srv.summaryEn : srv.summaryAr,
          url: `${baseUrl}/services/${srv.slug}`,
        },
      })),
    },
    department: [
      {
        '@type': 'Dentist',
        name: 'NOVA Dental Clinic — Fifth Settlement',
        telephone: CLINIC_INFO.primaryPhoneInternational,
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
        telephone: CLINIC_INFO.primaryPhoneInternational,
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
          <FirebaseProvider>
            <SmoothScrollProvider>
              <div className="flex min-h-screen flex-col">
                <SiteHeader />
                <main className="flex-1">{children}</main>
                <SiteFooter />
              </div>
              <FloatingWhatsAppButton />
              <OfflineIndicator />
            </SmoothScrollProvider>
          </FirebaseProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
