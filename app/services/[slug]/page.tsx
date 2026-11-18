import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CLINIC_INFO } from '@/lib/clinic-config';
import { DENTAL_SERVICES } from '@/lib/clinic-data';
import { getServerLocale } from '@/lib/locale-server';
import ServiceDetailView from '@/components/pages/ServiceDetailView';

export function generateStaticParams() {
  return DENTAL_SERVICES.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = DENTAL_SERVICES.find((s) => s.slug === slug);
  if (!service) return {};

  const locale = await getServerLocale();
  return {
    title: locale === 'en' ? service.titleEn : service.titleAr,
    description: locale === 'en' ? service.summaryEn : service.summaryAr,
    alternates: { canonical: `/services/${service.slug}` },
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = DENTAL_SERVICES.find((s) => s.slug === slug);
  if (!service) notFound();

  const locale = await getServerLocale();
  const baseUrl = process.env.APP_URL || 'http://localhost:3000';

  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MedicalProcedure',
    name: locale === 'en' ? service.titleEn : service.titleAr,
    description: locale === 'en' ? service.detailsEn : service.detailsAr,
    provider: {
      '@type': 'Dentist',
      name: CLINIC_INFO.brandNameEn,
      telephone: CLINIC_INFO.primaryPhoneInternational,
    },
    url: `${baseUrl}/services/${service.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <ServiceDetailView service={service} />
    </>
  );
}
