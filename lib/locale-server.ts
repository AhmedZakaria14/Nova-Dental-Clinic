import { cookies } from 'next/headers';
import { Locale } from './i18n';

export async function getServerLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  return cookieStore.get('nova_locale')?.value === 'en' ? 'en' : 'ar';
}
