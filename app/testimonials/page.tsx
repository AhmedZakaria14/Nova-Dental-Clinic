import type { Metadata } from 'next';
import { getServerLocale } from '@/lib/locale-server';
import { DICTIONARIES } from '@/lib/i18n';
import TestimonialsView from '@/components/pages/TestimonialsView';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const dict = DICTIONARIES[locale];
  return {
    title: dict.nav.testimonials,
    description: dict.testimonialsSection.subtitle,
    alternates: { canonical: '/testimonials' },
  };
}

export default function TestimonialsPage() {
  return <TestimonialsView />;
}
