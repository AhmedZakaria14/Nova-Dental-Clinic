'use client';

import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useLanguage } from './LanguageProvider';

export default function OfflineIndicator() {
  const isOnline = useOnlineStatus();
  const { locale } = useLanguage();

  if (isOnline) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 start-4 z-50 flex items-center gap-2 rounded-full border border-amber-500/40 bg-[#1B160C]/95 px-4 py-2 text-xs font-bold text-amber-200 shadow-2xl backdrop-blur-md"
    >
      <WifiOff className="h-3.5 w-3.5 text-amber-400" aria-hidden="true" />
      <span>
        {locale === 'en'
          ? 'Offline Mode — Showing cached clinic info'
          : 'أنت غير متصل بالإنترنت — يتم عرض البيانات المحفوظة'}
      </span>
    </div>
  );
}
