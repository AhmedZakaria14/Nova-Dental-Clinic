import type { Metadata } from 'next';
import { getServerLocale } from '@/lib/locale-server';
import { DICTIONARIES } from '@/lib/i18n';
import ServicesView from '@/components/pages/ServicesView';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const dict = DICTIONARIES[locale];
  return {
    title: dict.nav.services,
    description: dict.servicesSection.subtitle,
    alternates: { canonical: '/services' },
  };
}

export default function ServicesPage() {
  return <ServicesView />;
}
