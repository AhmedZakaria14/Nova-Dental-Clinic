'use client';

import { useLanguage } from '@/components/LanguageProvider';
import PageHeader from '@/components/PageHeader';
import ContactSection from '@/components/ContactSection';

export default function ContactPageView() {
  const { t } = useLanguage();

  return (
    <>
      <PageHeader
        titlePrefix={t.contactPage.pageTitle}
        titleAccent="NOVA Dental Clinic"
        subtitle={t.contactSection.subtitle}
        breadcrumbs={[
          { label: t.nav.home, href: '/' },
          { label: t.nav.contact },
        ]}
      />

      <ContactSection showForm />
    </>
  );
}
