import type { Metadata } from 'next';
import { getServerLocale } from '@/lib/locale-server';
import { DICTIONARIES } from '@/lib/i18n';
import ContactPageView from '@/components/pages/ContactPageView';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const dict = DICTIONARIES[locale];
  return {
    title: dict.contactPage.pageTitle,
    description: dict.contactSection.subtitle,
    alternates: { canonical: '/contact' },
  };
}

export default function ContactPage() {
  return <ContactPageView />;
}
