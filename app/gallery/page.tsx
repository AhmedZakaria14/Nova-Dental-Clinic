import type { Metadata } from 'next';
import { getServerLocale } from '@/lib/locale-server';
import { DICTIONARIES } from '@/lib/i18n';
import { buildPageMetadata } from '@/lib/seo';
import GalleryView from '@/components/pages/GalleryView';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const dict = DICTIONARIES[locale];
  return buildPageMetadata({
    locale,
    title: dict.nav.gallery,
    description:
      locale === 'en'
        ? 'NOVA Dental Clinic interior suites and clinical smile showcase in Fifth Settlement.'
        : 'معرض غرف العلاج وأجواء نوفا لطب الأسنان في مركز أوزون الطبي.',
    path: '/gallery',
  });
}

export default function GalleryPage() {
  return <GalleryView />;
}
