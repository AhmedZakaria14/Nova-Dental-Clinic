'use client';

import Breadcrumbs, { BreadcrumbItem } from './Breadcrumbs';

interface PageHeaderProps {
  titlePrefix: string;
  titleAccent?: string;
  breadcrumbs: BreadcrumbItem[];
  subtitle?: string;
}

export default function PageHeader({
  titlePrefix,
  titleAccent,
  breadcrumbs,
  subtitle,
}: PageHeaderProps) {
  return (
    <section className="dentaire-hero-pattern border-b border-[#D4AF37]/20 py-14 sm:py-20">
      <div className="mx-auto max-w-[1300px] px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-[clamp(2rem,4vw,3.375rem)] font-bold text-[#D4AF37] [text-wrap:balance]">
          <span>{titlePrefix}</span>
          {titleAccent && (
            <>
              {' '}
              <span className="text-[#F7F3E9]">{titleAccent}</span>
            </>
          )}
        </h1>

        {subtitle && (
          <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base text-[#C8BFA8]">
            {subtitle}
          </p>
        )}

        <Breadcrumbs items={breadcrumbs} />
      </div>
    </section>
  );
}
