'use client';

import { useLanguage } from '@/components/LanguageProvider';
import PageHeader from '@/components/PageHeader';
import PatientReviewsHub from '@/components/PatientReviewsHub';

export default function TestimonialsView() {
  const { t } = useLanguage();

  return (
    <>
      <PageHeader
        titlePrefix={t.testimonialsSection.headingPrefix}
        titleAccent={t.testimonialsSection.headingAccent}
        subtitle={t.testimonialsSection.subtitle}
        breadcrumbs={[
          { label: t.nav.home, href: '/' },
          { label: t.nav.testimonials },
        ]}
      />

      <PatientReviewsHub />
    </>
  );
}
