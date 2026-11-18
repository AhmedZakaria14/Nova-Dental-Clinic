import type { Metadata } from 'next';
import { getServerLocale } from '@/lib/locale-server';
import { DICTIONARIES } from '@/lib/i18n';
import DoctorsView from '@/components/pages/DoctorsView';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const dict = DICTIONARIES[locale];
  return {
    title: dict.nav.doctors,
    description: dict.teamSection.subtitle,
    alternates: { canonical: '/doctors' },
  };
}

export default function DoctorsPage() {
  return <DoctorsView />;
}
