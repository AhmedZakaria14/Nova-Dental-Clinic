import type { Metadata } from 'next';
import { getServerLocale } from '@/lib/locale-server';
import { DICTIONARIES } from '@/lib/i18n';
import { buildPageMetadata } from '@/lib/seo';
import DoctorsView from '@/components/pages/DoctorsView';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const dict = DICTIONARIES[locale];
  return buildPageMetadata({
    locale,
    title: dict.nav.doctors,
    description: dict.teamSection.subtitle,
    path: '/doctors',
  });
}

export default function DoctorsPage() {
  return <DoctorsView />;
}
