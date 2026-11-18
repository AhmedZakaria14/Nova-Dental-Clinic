import type { Metadata } from 'next';
import { getServerLocale } from '@/lib/locale-server';
import { DICTIONARIES } from '@/lib/i18n';
import AboutView from '@/components/pages/AboutView';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const dict = DICTIONARIES[locale];
  return {
    title: dict.nav.about,
    description: dict.about.description,
    alternates: { canonical: '/about' },
  };
}

export default function AboutPage() {
  return <AboutView />;
}
