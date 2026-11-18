'use client';

import { Suspense } from 'react';
import { useLanguage } from '@/components/LanguageProvider';
import PageHeader from '@/components/PageHeader';
import AppointmentForm from '@/components/AppointmentForm';

export default function AppointmentPageView() {
  const { t } = useLanguage();

  return (
    <>
      <PageHeader
        titlePrefix={t.appointmentPage.headingPrefix}
        titleAccent={t.appointmentPage.headingAccent}
        subtitle={t.appointmentPage.subtitle}
        breadcrumbs={[
          { label: t.nav.home, href: '/' },
          { label: t.appointmentPage.pageTitle },
        ]}
      />

      <Suspense
        fallback={
          <div className="mx-auto max-w-[1300px] px-4 py-16 text-center text-sm text-[#C8BFA8]">
            {t.appointmentPage.loadingSlots}
          </div>
        }
      >
        <AppointmentForm />
      </Suspense>
    </>
  );
}
