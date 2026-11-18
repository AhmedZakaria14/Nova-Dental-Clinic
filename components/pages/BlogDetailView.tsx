'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Clock } from 'lucide-react';
import suiteImg from '@/src/assets/images/dental_treatment_suite_1794988565232.jpg';
import smileImg from '@/src/assets/images/smile_transformation_showcase_1794988567315.jpg';
import { BLOG_ARTICLES, BlogArticle } from '@/lib/clinic-data';
import { useLanguage } from '@/components/LanguageProvider';
import PageHeader from '@/components/PageHeader';
import AppointmentButton from '@/components/AppointmentButton';

const IMAGE_MAP = {
  hero: suiteImg,
  suite: suiteImg,
  smile: smileImg,
};

export default function BlogDetailView({ article }: { article: BlogArticle }) {
  const { locale, t } = useLanguage();

  const title = locale === 'en' ? article.titleEn : article.titleAr;
  const category = locale === 'en' ? article.categoryEn : article.categoryAr;
  const paragraphs =
    locale === 'en' ? article.paragraphsEn : article.paragraphsAr;
  const recent = BLOG_ARTICLES.filter((a) => a.slug !== article.slug);

  return (
    <>
      <PageHeader
        titlePrefix={title}
        subtitle={`${category} · ${article.readMinutes} ${
          locale === 'en' ? 'min read' : 'دقائق قراءة'
        }`}
        breadcrumbs={[
          { label: t.nav.home, href: '/' },
          { label: t.nav.blog, href: '/blog' },
          { label: category },
        ]}
      />

      <section className="bg-[#080808] py-14 sm:py-20">
        <div className="mx-auto max-w-[1300px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            {/* Article Main Body */}
            <article className="lg:col-span-8">
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[36px] border border-[#D4AF37]/25 bg-[#161512]">
                <Image
                  src={IMAGE_MAP[article.imageKey] ?? suiteImg}
                  alt={title}
                  fill
                  referrerPolicy="no-referrer"
                  sizes="(max-width: 1024px) 100vw, 820px"
                  className="object-cover"
                />
              </div>

              <div className="mt-6 flex items-center gap-3 text-xs font-semibold text-[#D4AF37]">
                <span>{category}</span>
                <span>•</span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {article.readMinutes}{' '}
                  {locale === 'en' ? 'min read' : 'دقائق قراءة'}
                </span>
              </div>

              <div className="mt-6 space-y-5 text-base sm:text-[17px] leading-relaxed text-[#C8BFA8]">
                {paragraphs.map((para) => (
                  <p key={para}>{para}</p>
                ))}
              </div>

              <div className="mt-10 rounded-[26px] border border-[#D4AF37]/25 bg-[#161512] p-7">
                <h2 className="text-xl font-bold text-[#F7F3E9]">
                  {locale === 'en'
                    ? 'Have Questions About This Topic?'
                    : 'هل تود استشارة الطبيب حول هذا الموضوع؟'}
                </h2>
                <p className="mt-2 text-sm text-[#C8BFA8]">
                  {locale === 'en'
                    ? 'Schedule a visit with our specialists at Ozone Medical Center, Fifth Settlement.'
                    : 'احجز موعد استشارتك في مركز أوزون الطبي بالتجمع الخامس.'}
                </p>
                <div className="mt-5">
                  <AppointmentButton />
                </div>
              </div>
            </article>

            {/* Sidebar Recent Posts */}
            <aside className="space-y-6 lg:col-span-4">
              <div className="rounded-[28px] border border-[#D4AF37]/25 bg-[#161512] p-6">
                <h2 className="text-lg font-bold text-[#E6C76A]">
                  {locale === 'en' ? 'More Articles' : 'مقالات أخرى'}
                </h2>
                <div className="mt-5 space-y-4">
                  {recent.map((post) => (
                    <Link
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      className="block rounded-2xl border border-[#D4AF37]/20 bg-[#0A0908] p-4 transition-colors hover:border-[#E6C76A]"
                    >
                      <span className="text-xs font-semibold text-[#D4AF37]">
                        {locale === 'en' ? post.categoryEn : post.categoryAr}
                      </span>
                      <p className="mt-1 text-sm font-bold text-[#F7F3E9]">
                        {locale === 'en' ? post.titleEn : post.titleAr}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
