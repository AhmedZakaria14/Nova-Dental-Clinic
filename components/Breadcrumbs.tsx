'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from './LanguageProvider';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export default function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const { dir } = useLanguage();
  const SepIcon = dir === 'rtl' ? ChevronLeft : ChevronRight;

  return (
    <nav aria-label="breadcrumb" className="mt-4 flex justify-center">
      <ol className="flex flex-wrap items-center justify-center gap-2 text-sm font-medium text-[#F7F3E9]">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={`${item.label}-${idx}`} className="flex items-center gap-2">
              {idx > 0 && (
                <SepIcon
                  className="h-4 w-4 text-[#D4AF37]"
                  aria-hidden="true"
                />
              )}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="transition-colors hover:text-[#E6C76A]"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isLast ? 'page' : undefined}
                  className={isLast ? 'text-[#C8BFA8]' : ''}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
