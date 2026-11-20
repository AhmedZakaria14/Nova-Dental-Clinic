import type { Metadata } from 'next';
import { getServerLocale } from '@/lib/locale-server';
import { buildPageMetadata } from '@/lib/seo';
import OffersView from '@/components/pages/OffersView';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  return buildPageMetadata({
    locale,
    title:
      locale === 'en'
        ? 'Clinic Offers & Smile Packages'
        : 'العروض والباقات',
    description:
      locale === 'en'
        ? 'Explore seasonal cosmetic dentistry, laser whitening, veneers, and dental implant packages at NOVA Dental Clinic in Fifth Settlement and Nasr City.'
        : 'اكتشف أحدث عروض وباقات تجميل الأسنان وتصميم الابتسامة والتبييض والزراعة في عيادة نوفا بفرعي التجمع الخامس ومدينة نصر.',
    path: '/offers',
  });
}

export default function OffersPage() {
  return <OffersView />;
}
