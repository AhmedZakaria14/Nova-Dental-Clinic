import type { Metadata } from 'next';
import { CLINIC_FAQS } from '@/lib/clinic-data';
import { DICTIONARIES } from '@/lib/i18n';
import { getServerLocale } from '@/lib/locale-server';
import FaqsView from '@/components/pages/FaqsView';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const dict = DICTIONARIES[locale];
  return {
    title: dict.nav.faqs,
    description:
      locale === 'en'
        ? 'Frequently asked questions about NOVA Dental Clinic in Ozone Medical Center, Fifth Settlement.'
        : 'الأسئلة الشائعة حول عيادة نوفا لطب الأسنان في مركز أوزون الطبي بالتجمع الخامس.',
    alternates: { canonical: '/faqs' },
  };
}

export default async function FaqsPage() {
  const locale = await getServerLocale();

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: CLINIC_FAQS.map((faq) => ({
      '@type': 'Question',
      name: locale === 'en' ? faq.questionEn : faq.questionAr,
      acceptedAnswer: {
        '@type': 'Answer',
        text: locale === 'en' ? faq.answerEn : faq.answerAr,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <FaqsView />
    </>
  );
}
