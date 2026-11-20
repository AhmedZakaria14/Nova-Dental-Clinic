import type { Metadata } from 'next';
import { getServerLocale } from '@/lib/locale-server';
import { DICTIONARIES } from '@/lib/i18n';
import { buildPageMetadata } from '@/lib/seo';
import ServicesView from '@/components/pages/ServicesView';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const dict = DICTIONARIES[locale];
  return buildPageMetadata({
    locale,
    title: dict.nav.services,
    description: dict.servicesSection.subtitle,
    path: '/services',
  });
}

export default function ServicesPage() {
  return <ServicesView />;
}
