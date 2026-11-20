import type { Metadata } from 'next';
import { getServerLocale } from '@/lib/locale-server';
import { DICTIONARIES } from '@/lib/i18n';
import { buildPageMetadata } from '@/lib/seo';
import ContactPageView from '@/components/pages/ContactPageView';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const dict = DICTIONARIES[locale];
  return buildPageMetadata({
    locale,
    title: dict.contactPage.pageTitle,
    description: dict.contactSection.subtitle,
    path: '/contact',
  });
}

export default function ContactPage() {
  return <ContactPageView />;
}
