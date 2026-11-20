import type { Metadata } from 'next';
import { getServerLocale } from '@/lib/locale-server';
import { DICTIONARIES } from '@/lib/i18n';
import { buildPageMetadata } from '@/lib/seo';
import TechnologyView from '@/components/pages/TechnologyView';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const dict = DICTIONARIES[locale];
  return buildPageMetadata({
    locale,
    title: dict.nav.technology,
    description:
      locale === 'en'
        ? 'Digital intraoral scanning, 3D CBCT diagnostics, and Class-B sterilization at NOVA Dental Clinic.'
        : 'أجهزة المسح الرقمي ثلاثي الأبعاد وبروتوكولات التعقيم الأوروبية في نوفا لطب الأسنان.',
    path: '/technology',
  });
}

export default function TechnologyPage() {
  return <TechnologyView />;
}
