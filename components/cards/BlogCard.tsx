'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpLeft, ArrowUpRight } from 'lucide-react';
import suiteImg from '@/src/assets/images/dental_treatment_suite_1794988565232.jpg';
import smileImg from '@/src/assets/images/smile_transformation_showcase_1794988567315.jpg';
import { BlogArticle } from '@/lib/clinic-data';
import { useLanguage } from '@/components/LanguageProvider';

const IMAGE_MAP = {
  hero: suiteImg,
  suite: suiteImg,
  smile: smileImg,
};

export default function BlogCard({ article }: { article: BlogArticle }) {
  const { locale, dir, t } = useLanguage();
  const ArrowIcon = dir === 'rtl' ? ArrowUpLeft : ArrowUpRight;

  const title = locale === 'en' ? article.titleEn : article.titleAr;
  const excerpt = locale === 'en' ? article.excerptEn : article.excerptAr;
  const category = locale === 'en' ? article.categoryEn : article.categoryAr;
  const imgSrc = IMAGE_MAP[article.imageKey] ?? suiteImg;

  return (
    <article className="group flex h-full flex-col justify-between">
      <div>
        <Link
          href={`/blog/${article.slug}`}
          className="dentaire-image-anime block overflow-hidden rounded-[30px] border border-[#D4AF37]/20 bg-[#161512]"
        >
          <div className="relative aspect-[1/0.68] w-full">
            <Image
              src={imgSrc}
              alt={title}
              fill
              referrerPolicy="no-referrer"
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </Link>

        <div className="mt-6">
          <p className="text-xs font-semibold text-[#D4AF37]">
            {category} · {article.readMinutes}{' '}
            {locale === 'en' ? 'min read' : 'دقائق قراءة'}
          </p>
          <h3 className="mt-2 text-xl font-bold leading-snug text-[#F7F3E9]">
            <Link
              href={`/blog/${article.slug}`}
              className="transition-colors hover:text-[#E6C76A]"
            >
              {title}
            </Link>
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-[#C8BFA8]">
            {excerpt}
          </p>
        </div>
      </div>

      <div className="mt-5">
        <Link
          href={`/blog/${article.slug}`}
          className="inline-flex items-center gap-2.5 text-sm font-bold text-[#E6C76A] transition-colors hover:text-[#F7F3E9]"
        >
          <span>{t.blogSection.readMore}</span>
          <span
            aria-hidden="true"
            className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#D4AF37] text-[#080808] transition-transform duration-300 group-hover:bg-[#F7F3E9] group-hover:text-[#080808] group-hover:rotate-12"
          >
            <ArrowIcon className="h-3.5 w-3.5" />
          </span>
        </Link>
      </div>
    </article>
  );
}
