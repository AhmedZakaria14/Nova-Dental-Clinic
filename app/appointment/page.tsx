import type { Metadata } from 'next';
import { getServerLocale } from '@/lib/locale-server';
import { DICTIONARIES } from '@/lib/i18n';
import AppointmentPageView from '@/components/pages/AppointmentPageView';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const dict = DICTIONARIES[locale];
  return {
    title: dict.appointmentPage.pageTitle,
    description: dict.appointmentPage.subtitle,
    alternates: { canonical: '/appointment' },
  };
}

export default function AppointmentPage() {
  return <AppointmentPageView />;
}
