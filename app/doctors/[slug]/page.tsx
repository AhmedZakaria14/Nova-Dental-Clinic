import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CLINIC_INFO } from '@/lib/clinic-config';
import { DOCTORS } from '@/lib/clinic-data';
import { getServerLocale } from '@/lib/locale-server';
import DoctorDetailView from '@/components/pages/DoctorDetailView';

export function generateStaticParams() {
  return DOCTORS.map((doc) => ({ slug: doc.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doctor = DOCTORS.find((d) => d.slug === slug);
  if (!doctor) return {};

  const locale = await getServerLocale();
  return {
    title: locale === 'en' ? doctor.nameEn : doctor.nameAr,
    description: locale === 'en' ? doctor.bioEn : doctor.bioAr,
    alternates: { canonical: `/doctors/${doctor.slug}` },
  };
}

export default async function DoctorDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doctor = DOCTORS.find((d) => d.slug === slug);
  if (!doctor) notFound();

  const locale = await getServerLocale();
  const physicianJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Physician',
    name: locale === 'en' ? doctor.nameEn : doctor.nameAr,
    medicalSpecialty:
      locale === 'en' ? doctor.specialtyEn : doctor.specialtyAr,
    worksFor: {
      '@type': 'Dentist',
      name: CLINIC_INFO.brandNameEn,
      address: CLINIC_INFO.addressEn,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(physicianJsonLd) }}
      />
      <DoctorDetailView doctor={doctor} />
    </>
  );
}
