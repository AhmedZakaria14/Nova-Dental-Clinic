import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CLINIC_INFO } from '@/lib/clinic-config';
import { BLOG_ARTICLES } from '@/lib/clinic-data';
import { getServerLocale } from '@/lib/locale-server';
import { buildPageMetadata } from '@/lib/seo';
import BlogDetailView from '@/components/pages/BlogDetailView';

export function generateStaticParams() {
  return BLOG_ARTICLES.map((art) => ({ slug: art.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = BLOG_ARTICLES.find((a) => a.slug === slug);
  if (!article) return {};

  const locale = await getServerLocale();
  return buildPageMetadata({
    locale,
    title: locale === 'en' ? article.titleEn : article.titleAr,
    description: locale === 'en' ? article.excerptEn : article.excerptAr,
    path: `/blog/${article.slug}`,
    type: 'article',
  });
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = BLOG_ARTICLES.find((a) => a.slug === slug);
  if (!article) notFound();

  const locale = await getServerLocale();
  const baseUrl = process.env.APP_URL || 'http://localhost:3000';

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: locale === 'en' ? article.titleEn : article.titleAr,
    description: locale === 'en' ? article.excerptEn : article.excerptAr,
    author: {
      '@type': 'Organization',
      name: CLINIC_INFO.brandNameEn,
    },
    url: `${baseUrl}/blog/${article.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <BlogDetailView article={article} />
    </>
  );
}
