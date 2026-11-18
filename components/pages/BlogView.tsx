'use client';

import { BLOG_ARTICLES } from '@/lib/clinic-data';
import { useLanguage } from '@/components/LanguageProvider';
import PageHeader from '@/components/PageHeader';
import BlogCard from '@/components/cards/BlogCard';

export default function BlogView() {
  const { t } = useLanguage();

  return (
    <>
      <PageHeader
        titlePrefix={t.blogSection.headingPrefix}
        titleAccent={t.blogSection.headingAccent}
        subtitle={t.blogSection.subtitle}
        breadcrumbs={[{ label: t.nav.home, href: '/' }, { label: t.nav.blog }]}
      />

      <section className="bg-[#080808] py-14 sm:py-20">
        <div className="mx-auto max-w-[1300px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {BLOG_ARTICLES.map((article) => (
              <BlogCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
