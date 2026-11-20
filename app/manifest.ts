import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: 'نوفا لطب الأسنان | NOVA Dental Clinic',
    short_name: 'NOVA Dental',
    description:
      'عيادة نوفا لطب الأسنان في التجمع الخامس ومدينة نصر — تجميل وزراعة الأسنان وتصميم الابتسامة الرقمي والحجز الإلكتروني المباشر.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#080808',
    theme_color: '#080808',
    dir: 'rtl',
    lang: 'ar',
    categories: ['medical', 'health', 'lifestyle'],
    icons: [
      {
        src: '/pwa-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/pwa-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/pwa-maskable-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    shortcuts: [
      {
        name: 'احجز موعدك الآن',
        short_name: 'حجز موعد',
        description: 'احجز موعدك في فرع التجمع الخامس أو مدينة نصر',
        url: '/appointment',
        icons: [{ src: '/pwa-192x192.png', sizes: '192x192' }],
      },
      {
        name: 'العروض والباقات',
        short_name: 'العروض',
        description: 'استكشف أحدث عروض وباقات عيادة نوفا',
        url: '/offers',
        icons: [{ src: '/pwa-192x192.png', sizes: '192x192' }],
      },
      {
        name: 'تواصل معنا والفروع',
        short_name: 'الفروع',
        description: 'مواعيد العمل وأرقام الاستقبال المباشرة',
        url: '/contact',
        icons: [{ src: '/pwa-192x192.png', sizes: '192x192' }],
      },
    ],
  };
}
