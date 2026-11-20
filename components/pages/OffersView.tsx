'use client';

import { useLanguage } from '@/components/LanguageProvider';
import PageHeader from '@/components/PageHeader';
import OffersShowcase from '@/components/OffersShowcase';

export default function OffersView() {
  const { locale, t } = useLanguage();

  return (
    <>
      <PageHeader
        titlePrefix={locale === 'en' ? 'Clinic Offers &' : 'العروض وباقات'}
        titleAccent={locale === 'en' ? 'Smile Packages' : 'عيادة نوفا'}
        subtitle={
          locale === 'en'
            ? 'Transparent seasonal packages for cosmetic dentistry, laser whitening, digital smile design, and guided dental implants across our Fifth Settlement and Nasr City branches.'
            : 'باقات وعروض موسمية شفافة لتجميل الأسنان وتصميم الابتسامة الرقمي والتبييض بالليزر وزراعة الأسنان في فرعي التجمع الخامس ومدينة نصر.'
        }
        breadcrumbs={[
          { label: t.nav.home, href: '/' },
          { label: locale === 'en' ? 'Offers & Packages' : 'العروض والباقات' },
        ]}
      />

      <OffersShowcase />
    </>
  );
}
