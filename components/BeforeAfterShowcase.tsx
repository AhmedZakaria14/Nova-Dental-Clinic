'use client';

import { useState } from 'react';
import Image from 'next/image';
import { MoveHorizontal } from 'lucide-react';
import beforeCaseImg from '@/src/assets/images/real_case_before.jpg';
import afterCaseImg from '@/src/assets/images/real_case_after.jpg';
import { useLanguage } from '@/components/LanguageProvider';

const PRESET_VIEWS = [
  { id: 'before', value: 96, labelAr: 'قبل العلاج', labelEn: 'Before' },
  { id: 'split', value: 50, labelAr: 'مقارنة 50/50', labelEn: '50/50 Split' },
  { id: 'after', value: 4, labelAr: 'بعد العلاج', labelEn: 'After' },
] as const;

export default function BeforeAfterShowcase() {
  const { locale } = useLanguage();
  const [sliderValue, setSliderValue] = useState(50);

  return (
    <section
      aria-labelledby="before-after-heading"
      className="border-t border-[#D4AF37]/20 bg-[#0D0C0A] py-14 sm:py-20"
    >
      <div className="mx-auto max-w-[1160px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-wider text-[#E6C76A] sm:text-sm">
              {locale === 'en'
                ? 'REAL CLINICAL BEFORE & AFTER'
                : 'مقارنة تفاعلية قبل وبعد'}
            </p>
            <h2
              id="before-after-heading"
              className="mt-2 text-2xl font-bold text-[#F7F3E9] sm:text-3xl"
            >
              {locale === 'en'
                ? 'Authentic Before & After Smile Transformation'
                : 'نتيجة حقيقية قبل وبعد العلاج في عيادة نوفا'}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#C8BFA8]">
              {locale === 'en'
                ? 'Drag the slider left and right to compare this real case of anterior tooth restoration and natural aesthetic smile alignment.'
                : 'اسحب المؤشر يميناً ويساراً لمعاينة التحوّل الفعلي في تعويض الأسنان الأمامية المفقودة وتجميل الابتسامة بمظهر طبيعي متناسق.'}
            </p>
          </div>

          <div
            role="group"
            aria-label={
              locale === 'en' ? 'Quick comparison positions' : 'أوضاع المعاينة السريعة'
            }
            className="inline-flex flex-wrap gap-2"
          >
            {PRESET_VIEWS.map((preset) => {
              const selected =
                (preset.id === 'before' && sliderValue >= 85) ||
                (preset.id === 'after' && sliderValue <= 15) ||
                (preset.id === 'split' && sliderValue > 15 && sliderValue < 85);
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setSliderValue(preset.value)}
                  className={`rounded-full px-4 py-2 text-xs font-bold transition-colors cursor-pointer ${
                    selected
                      ? 'bg-[#D4AF37] text-[#080808]'
                      : 'border border-[#D4AF37]/30 bg-[#161512] text-[#C8BFA8] hover:text-[#F7F3E9]'
                  }`}
                >
                  {locale === 'en' ? preset.labelEn : preset.labelAr}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-[30px] border border-[#D4AF37]/30 bg-[#141310] p-4 shadow-2xl sm:p-6">
          {/* Comparison Viewport (LTR locked so left/right percentage always aligns with clip-path & slider) */}
          <div
            dir="ltr"
            className="relative mx-auto aspect-[16/9] max-h-[540px] w-full overflow-hidden rounded-[22px] border border-[#D4AF37]/20 bg-[#080808] select-none"
          >
            {/* Base layer: Real After Case */}
            <Image
              src={afterCaseImg}
              alt={
                locale === 'en'
                  ? 'After anterior dental restoration at NOVA Dental Clinic'
                  : 'النتيجة بعد تعويض وتجميل الأسنان الأمامية في عيادة نوفا'
              }
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 1060px"
              referrerPolicy="no-referrer"
              className="object-cover"
            />

            {/* Clipped Overlay: Real Before Case */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `inset(0 ${100 - sliderValue}% 0 0)` }}
            >
              <Image
                src={beforeCaseImg}
                alt={
                  locale === 'en'
                    ? 'Before anterior dental restoration at NOVA Dental Clinic'
                    : 'الحالة قبل تعويض وتجميل الأسنان الأمامية في عيادة نوفا'
                }
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 1060px"
                referrerPolicy="no-referrer"
                className="object-cover"
              />
            </div>

            {/* Gold Divider Line & Knob */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 z-10 w-0.5 bg-[#E6C76A] shadow-[0_0_16px_rgba(212,175,55,0.85)]"
              style={{ left: `${sliderValue}%` }}
            >
              <div className="absolute top-1/2 left-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-[#080808] bg-[#D4AF37] text-[#080808] shadow-xl">
                <MoveHorizontal className="h-5 w-5" />
              </div>
            </div>

            {/* Corner Badges */}
            <span className="pointer-events-none absolute top-4 left-4 z-10 rounded-full border border-white/15 bg-[#080808]/80 px-3.5 py-1 text-xs font-bold text-[#F7F3E9] backdrop-blur-sm">
              {locale === 'en' ? 'Before' : 'قبل العلاج'}
            </span>
            <span className="pointer-events-none absolute top-4 right-4 z-10 rounded-full border border-[#D4AF37]/45 bg-[#1B1810]/90 px-3.5 py-1 text-xs font-bold text-[#E6C76A] backdrop-blur-sm">
              {locale === 'en' ? 'After' : 'بعد العلاج'}
            </span>

            {/* Accessible Interactive Range Overlay */}
            <input
              type="range"
              min={2}
              max={98}
              value={sliderValue}
              onChange={(e) => setSliderValue(Number(e.target.value))}
              aria-label={
                locale === 'en'
                  ? 'Before and after comparison slider'
                  : 'مؤشر المقارنة بين قبل وبعد العلاج'
              }
              className="absolute inset-0 z-20 h-full w-full cursor-ew-resize opacity-0"
            />
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-[#9E9580]">
            <span className="font-semibold text-[#F7F3E9]">
              {locale === 'en'
                ? 'Real Case — Anterior Teeth Restoration & Aesthetic Harmony'
                : 'حالة فعلية — تعويض الأسنان الأمامية المفقودة وتناسق الابتسامة'}
            </span>
            <span>
              {locale === 'en'
                ? 'Clinical result photographed at NOVA Dental Clinic — individual plans vary by diagnosis.'
                : 'صورة حالة فعلية من عيادة نوفا لطب الأسنان — تختلف خطة العلاج والنتيجة حسب التشخيص الطبي لكل حالة.'}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
