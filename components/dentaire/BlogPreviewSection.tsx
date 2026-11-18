'use client';

import { BookOpen } from 'lucide-react';
import { BLOG_ARTICLES } from '@/lib/clinic-data';
import { useLanguage } from '@/components/LanguageProvider';
import BlogCard from '@/components/cards/BlogCard';
import AppointmentButton from '@/components/AppointmentButton';
import {
  FadeInUp,
  SplitHeadingReveal,
} from '@/components/dentaire/ScrollEffects';

export default function BlogPreviewSection() {
  const { t } = useLanguage();

  return (
    <section className="border-t border-[#D4AF37]/20 bg-[#11100E] py-16 sm:py-24">
      <div className="mx-auto max-w-[1300px] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <FadeInUp>
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#E6C76A]">
              <BookOpen className="h-4 w-4 shrink-0 text-[#D4AF37]" aria-hidden="true" />
              <span>{t.blogSection.kicker}</span>
            </div>
          </FadeInUp>

          <SplitHeadingReveal
            prefix={t.blogSection.headingPrefix}
            accent={t.blogSection.headingAccent}
            className="mt-3 text-[clamp(1.75rem,3.3vw,2.75rem)] font-bold text-[#F7F3E9] [text-wrap:balance]"
          />

          <FadeInUp delay={0.18}>
            <p className="mt-4 text-base text-[#C8BFA8]">{t.blogSection.subtitle}</p>
          </FadeInUp>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {BLOG_ARTICLES.map((article, idx) => (
            <FadeInUp key={article.id} delay={idx * 0.14} className="h-full">
              <BlogCard article={article} />
            </FadeInUp>
          ))}
        </div>

        <FadeInUp delay={0.32} className="mt-12 text-center">
          <AppointmentButton href="/blog" label={t.blogSection.viewAll} />
        </FadeInUp>
      </div>
    </section>
  );
}
