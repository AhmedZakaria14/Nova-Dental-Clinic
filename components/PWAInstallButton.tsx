'use client';

import { useState } from 'react';
import { Download, Share, Smartphone, X } from 'lucide-react';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { useLanguage } from './LanguageProvider';

interface PWAInstallButtonProps {
  variant?: 'footer' | 'mobile';
}

export default function PWAInstallButton({
  variant = 'footer',
}: PWAInstallButtonProps) {
  const { locale } = useLanguage();
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  const label =
    locale === 'en' ? 'Install NOVA Clinic App' : 'تثبيت تطبيق عيادة نوفا';

  const buttonClasses =
    variant === 'mobile'
      ? 'inline-flex min-h-[42px] w-full items-center justify-center gap-2 rounded-full border border-[#D4AF37]/40 bg-[#1B1810] px-4 py-2 text-xs font-bold text-[#E6C76A] transition-colors hover:bg-[#D4AF37] hover:text-[#080808] cursor-pointer'
      : 'inline-flex min-h-[38px] items-center gap-2 rounded-full border border-[#D4AF37]/35 bg-[#141310] px-4 py-1.5 text-xs font-bold text-[#E6C76A] transition-colors hover:border-[#E6C76A] hover:bg-[#D4AF37] hover:text-[#080808] cursor-pointer';

  if (isInstallable) {
    return (
      <button type="button" onClick={install} className={buttonClasses}>
        <Download className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <span>{label}</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowIOSGuide(true)}
          className={buttonClasses}
        >
          <Smartphone className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>{label}</span>
        </button>

        {showIOSGuide && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="ios-pwa-title"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs"
          >
            <div className="w-full max-w-sm rounded-[26px] border border-[#D4AF37]/35 bg-[#12110E] p-6 text-start shadow-2xl">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#D4AF37]/30 bg-[#0A0908] text-[#E6C76A]">
                    <Smartphone className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3
                    id="ios-pwa-title"
                    className="text-base font-bold text-[#F7F3E9]"
                  >
                    {locale === 'en'
                      ? 'Install on iPhone / iPad'
                      : 'التثبيت على iPhone و iPad'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  aria-label={locale === 'en' ? 'Close' : 'إغلاق'}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-[#9E9580] hover:text-[#F7F3E9] cursor-pointer"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              <ol className="mt-4 space-y-2.5 text-sm leading-relaxed text-[#C8BFA8]">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#D4AF37]/20 text-xs font-bold text-[#E6C76A]">
                    1
                  </span>
                  <span>
                    {locale === 'en' ? (
                      <>
                        Tap the <strong className="text-[#F7F3E9]">Share</strong>{' '}
                        <Share className="inline h-3.5 w-3.5 text-[#E6C76A]" />{' '}
                        button in Safari.
                      </>
                    ) : (
                      <>
                        اضغط على زر{' '}
                        <strong className="text-[#F7F3E9]">المشاركة</strong>{' '}
                        <Share className="inline h-3.5 w-3.5 text-[#E6C76A]" /> في
                        شريط متصفح Safari.
                      </>
                    )}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#D4AF37]/20 text-xs font-bold text-[#E6C76A]">
                    2
                  </span>
                  <span>
                    {locale === 'en' ? (
                      <>
                        Scroll down and tap{' '}
                        <strong className="text-[#F7F3E9]">
                          Add to Home Screen
                        </strong>
                        .
                      </>
                    ) : (
                      <>
                        مرّر للأسفل واختر{' '}
                        <strong className="text-[#F7F3E9]">
                          إضافة إلى الشاشة الرئيسية
                        </strong>
                        .
                      </>
                    )}
                  </span>
                </li>
              </ol>

              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-full bg-[#D4AF37] py-2.5 text-sm font-bold text-[#080808] transition-colors hover:bg-[#E6C76A] cursor-pointer"
              >
                {locale === 'en' ? 'Got It' : 'حسناً'}
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
}
