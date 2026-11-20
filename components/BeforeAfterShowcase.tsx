'use client';

import { useState } from 'react';
import Image from 'next/image';
import { MoveHorizontal, Sparkles } from 'lucide-react';
import smileImg from '@/src/assets/images/male_smile_showcase_1795203941309.jpg';
import { useLanguage } from '@/components/LanguageProvider';

interface ComparisonCase {
  id: string;
  titleAr: string;
  titleEn: string;
  categoryAr: string;
  categoryEn: string;
  summaryAr: string;
  summaryEn: string;
  beforeLabelAr: string;
  beforeLabelEn: string;
  afterLabelAr: string;
  afterLabelEn: string;
  beforeFilterClass: string;
  afterFilterClass: string;
}

const SMILE_PREVIEW_CASES: ComparisonCase[] = [
  {
    id: 'dsd-veneers',
    titleAr: 'معاينة تدرج لون الابتسامة — الفينيرز وتصميم DSD',
    titleEn: 'Smile Shade & Harmony Preview — Veneers & DSD',
    categoryAr: 'تجميل الأسنان',
    categoryEn: 'Cosmetic Dentistry',
    summaryAr:
      'اسحب المؤشر لمعاينة الفرق البصري بين درجة الاصفرار السطحي والتدرج اللوني الطبيعي المشرق بعد التجميل الرقمي.',
    summaryEn:
      'Drag the slider to preview the visual contrast between surface dullness and balanced natural translucency after Digital Smile Design.',
    beforeLabelAr: 'قبل التجميل',
    beforeLabelEn: 'Before',
    afterLabelAr: 'بعد التجميل',
    afterLabelEn: 'After',
    beforeFilterClass: 'brightness-[0.84] saturate-[0.72] sepia-[0.28] contrast-[0.94]',
    afterFilterClass: 'brightness-[1.06] saturate-[1.05] contrast-[1.04]',
  },
  {
    id: 'laser-whitening',
    titleAr: 'معاينة درجات التفتيح — التبييض الاحترافي بالليزر',
    titleEn: 'Shade Elevation Preview — Laser Whitening',
    categoryAr: 'التبييض بالليزر',
    categoryEn: 'Laser Whitening',
    summaryAr:
      'اسحب المؤشر للمقارنة بين تصبغات القهوة والشاي والنتيجة المشرقة الآمنة على طبقة المينا في جلسة واحدة.',
    summaryEn:
      'Slide to compare everyday coffee/tea staining against safe enamel-friendly brightness achieved in a single clinical session.',
    beforeLabelAr: 'قبل التبييض',
    beforeLabelEn: 'Before',
    afterLabelAr: 'بعد التبييض',
    afterLabelEn: 'After',
    beforeFilterClass: 'brightness-[0.88] sepia-[0.22] saturate-[0.82]',
    afterFilterClass: 'brightness-[1.08] contrast-[1.05] saturate-[1.02]',
  },
];

export default function BeforeAfterShowcase() {
  const { locale } = useLanguage();
  const [activeCaseId, setActiveCaseId] = useState(SMILE_PREVIEW_CASES[0].id);
  const [sliderValue, setSliderValue] = useState(52);

  const activeCase =
    SMILE_PREVIEW_CASES.find((item) => item.id === activeCaseId) ??
    SMILE_PREVIEW_CASES[0];

  return (
    <section
      aria-labelledby="before-after-heading"
      className="border-t border-[#D4AF37]/20 bg-[#0D0C0A] py-14 sm:py-20"
    >
      <div className="mx-auto max-w-[1160px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#E6C76A] sm:text-sm">
              <Sparkles className="h-4 w-4 text-[#D4AF37]" aria-hidden="true" />
              <span>
                {locale === 'en'
                  ? 'INTERACTIVE SMILE COMPARISON'
                  : 'مقارنة تفاعلية قبل وبعد'}
              </span>
            </div>
            <h2
              id="before-after-heading"
              className="mt-2 text-2xl font-bold text-[#F7F3E9] sm:text-3xl"
            >
              {locale === 'en'
                ? 'Interactive Smile Shade Preview'
                : 'معاينة تفاعلية لتأثير تجميل وتبييض الأسنان'}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#C8BFA8]">
              {locale === 'en' ? activeCase.summaryEn : activeCase.summaryAr}
            </p>
          </div>

          <div className="inline-flex flex-wrap gap-2">
            {SMILE_PREVIEW_CASES.map((item) => {
              const selected = item.id === activeCase.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveCaseId(item.id);
                    setSliderValue(52);
                  }}
                  className={`rounded-full px-4 py-2 text-xs font-bold transition-colors cursor-pointer ${
                    selected
                      ? 'bg-[#D4AF37] text-[#080808]'
                      : 'border border-[#D4AF37]/30 bg-[#161512] text-[#C8BFA8] hover:text-[#F7F3E9]'
                  }`}
                >
                  {locale === 'en' ? item.categoryEn : item.categoryAr}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-[30px] border border-[#D4AF37]/30 bg-[#141310] p-4 shadow-2xl sm:p-6">
          {/* Comparison Viewport (LTR locked so left/right percentage always aligns with clip-path & slider) */}
          <div
            dir="ltr"
            className="relative mx-auto aspect-[16/9] max-h-[500px] w-full overflow-hidden rounded-[22px] border border-[#D4AF37]/20 bg-[#080808] select-none"
          >
            {/* Base layer: After */}
            <Image
              src={smileImg}
              alt={locale === 'en' ? activeCase.titleEn : activeCase.titleAr}
              fill
              sizes="(max-width: 1024px) 100vw, 1060px"
              referrerPolicy="no-referrer"
              className={`object-cover ${activeCase.afterFilterClass}`}
            />

            {/* Clipped Overlay: Before */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `inset(0 ${100 - sliderValue}% 0 0)` }}
            >
              <Image
                src={smileImg}
                alt={locale === 'en' ? activeCase.beforeLabelEn : activeCase.beforeLabelAr}
                fill
                sizes="(max-width: 1024px) 100vw, 1060px"
                referrerPolicy="no-referrer"
                className={`object-cover ${activeCase.beforeFilterClass}`}
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
            <span className="pointer-events-none absolute top-4 left-4 z-10 rounded-full border border-white/15 bg-[#080808]/80 px-3.5 py-1 text-xs font-bold text-[#C8BFA8] backdrop-blur-sm">
              {locale === 'en'
                ? activeCase.beforeLabelEn
                : activeCase.beforeLabelAr}
            </span>
            <span className="pointer-events-none absolute top-4 right-4 z-10 rounded-full border border-[#D4AF37]/45 bg-[#1B1810]/90 px-3.5 py-1 text-xs font-bold text-[#E6C76A] backdrop-blur-sm">
              {locale === 'en'
                ? activeCase.afterLabelEn
                : activeCase.afterLabelAr}
            </span>

            {/* Accessible Interactive Range Overlay */}
            <input
              type="range"
              min={5}
              max={95}
              value={sliderValue}
              onChange={(e) => setSliderValue(Number(e.target.value))}
              aria-label={
                locale === 'en'
                  ? 'Before and after comparison slider'
                  : 'مؤشر المقارنة بين قبل وبعد'
              }
              className="absolute inset-0 z-20 h-full w-full cursor-ew-resize opacity-0"
            />
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-[#9E9580]">
            <span className="font-semibold text-[#F7F3E9]">
              {locale === 'en' ? activeCase.titleEn : activeCase.titleAr}
            </span>
            <span>
              {locale === 'en'
                ? 'Visual shade preview — individual clinical outcomes vary by diagnosis.'
                : 'معاينة بصرية توضيحية لدرجة التفتيح — تختلف النتائج الفعلية حسب التشخيص الطبي لكل حالة.'}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
