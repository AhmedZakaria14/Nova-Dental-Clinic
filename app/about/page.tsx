import type { Metadata } from 'next';
import { getServerLocale } from '@/lib/locale-server';
import { DICTIONARIES } from '@/lib/i18n';
import { buildPageMetadata } from '@/lib/seo';
import AboutView from '@/components/pages/AboutView';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const dict = DICTIONARIES[locale];
  return buildPageMetadata({
    locale,
    title: dict.nav.about,
    description: dict.about.description,
    path: '/about',
  });
}

export default function AboutPage() {
  return <AboutView />;
}
