import type { Metadata } from 'next';
import { getServerLocale } from '@/lib/locale-server';
import { DICTIONARIES } from '@/lib/i18n';
import BlogView from '@/components/pages/BlogView';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const dict = DICTIONARIES[locale];
  return {
    title: dict.nav.blog,
    description: dict.blogSection.subtitle,
    alternates: { canonical: '/blog' },
  };
}

export default function BlogPage() {
  return <BlogView />;
}
