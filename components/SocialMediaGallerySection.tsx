'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Camera,
  ExternalLink,
  Eye,
  Facebook,
  Film,
  Info,
  Instagram,
  Layers,
  Play,
} from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';
import {
  GalleryFilter,
  SOCIAL_MEDIA_ARCHIVE,
  SocialMediaItem,
  computeFilterCounts,
  filterSocialMediaItems,
  getMediaDescription,
  getMediaTypeLabel,
  getOfficialEmbedUrl,
  splitIntoMediaSections,
} from '@/lib/social-media-gallery';

const INITIAL_BATCH = 6;
const BATCH_INCREMENT = 6;

function EmbeddedMediaCard({
  item,
  locale,
}: {
  item: SocialMediaItem;
  locale: 'ar' | 'en';
}) {
  const isVideo = item.media_type === 'video';
  const isCarousel = item.media_type === 'image_or_carousel';
  const isInstagram = item.platform === 'Instagram';

  const description = getMediaDescription(item, locale);
  const typeLabel = getMediaTypeLabel(item.media_type, locale);
  const embedUrl = getOfficialEmbedUrl(item);

  const openLabel =
    locale === 'en'
      ? `Open original on ${item.platform}`
      : `فتح المنشور الأصلي على ${item.platform}`;

  const [shouldMountIframe, setShouldMountIframe] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const frameContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (shouldMountIframe || !embedUrl) return;
    if (typeof IntersectionObserver === 'undefined') {
      const raf = requestAnimationFrame(() => setShouldMountIframe(true));
      return () => cancelAnimationFrame(raf);
    }

    const node = frameContainerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldMountIframe(true);
          observer.disconnect();
        }
      },
      { rootMargin: '250px 0px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [shouldMountIframe, embedUrl]);

  const frameHeightClass = isVideo
    ? 'h-[430px] sm:h-[460px]'
    : isInstagram
      ? 'h-[420px] sm:h-[450px]'
      : 'h-[380px] sm:h-[400px]';

  return (
    <article
      style={{ contentVisibility: 'auto', containIntrinsicSize: '580px' }}
      className="group flex flex-col justify-between overflow-hidden rounded-[26px] border border-[#D4AF37]/25 bg-[#141310] transition-all duration-300 hover:border-[#E6C76A]/65 hover:shadow-[0_16px_40px_rgba(212,175,55,0.12)]"
    >
      <div>
        {/* Card Header: Platform, Media Type & Account */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D4AF37]/15 bg-[#0D0C0A] px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D4AF37]/30 bg-[#141310] px-2.5 py-1 text-[11px] font-bold text-[#E6C76A]">
              {isInstagram ? (
                <Instagram className="h-3.5 w-3.5" aria-hidden="true" />
              ) : (
                <Facebook className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              <span>{item.platform}</span>
            </span>

            <span className="inline-flex items-center gap-1 rounded-full border border-[#D4AF37]/20 bg-[#1B1914] px-2.5 py-1 text-[11px] font-semibold text-[#F7F3E9]">
              {isVideo ? (
                <Film className="h-3 w-3 text-[#D4AF37]" aria-hidden="true" />
              ) : isCarousel ? (
                <Layers className="h-3 w-3 text-[#D4AF37]" aria-hidden="true" />
              ) : (
                <Camera className="h-3 w-3 text-[#D4AF37]" aria-hidden="true" />
              )}
              <span>{typeLabel}</span>
            </span>
          </div>

          {item.views_text && (
            <span className="inline-flex items-center gap-1 rounded-full border border-[#D4AF37]/15 bg-[#161512] px-2.5 py-0.5 text-[11px] font-semibold text-[#C8BFA8]">
              <Eye className="h-3 w-3 text-[#D4AF37]" aria-hidden="true" />
              <span>
                {item.views_text} {locale === 'en' ? 'views' : 'مشاهدة'}
              </span>
            </span>
          )}
        </div>

        {/* Embedded Media Frame (Instagram / Facebook Official Embed) */}
        <div className="border-b border-[#D4AF37]/15 bg-[#0A0908] p-2.5">
          <div
            ref={frameContainerRef}
            className={`relative mx-auto w-full max-w-[360px] overflow-hidden rounded-xl bg-[#0A0908] ${frameHeightClass}`}
          >
            {embedUrl && shouldMountIframe ? (
              <>
                <iframe
                  src={embedUrl}
                  title={`${item.platform} · ${typeLabel} — ${description}`}
                  loading="lazy"
                  scrolling="no"
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  allowFullScreen
                  onLoad={() => setIframeLoaded(true)}
                  className="relative z-10 block h-full w-full border-0 bg-[#0A0908]"
                />
                {!iframeLoaded && (
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-[#0A0908]/95 px-4 text-center transition-opacity duration-300"
                  >
                    <div className="flex h-12 w-12 animate-pulse items-center justify-center rounded-2xl border border-[#D4AF37]/35 bg-[#141310] text-[#D4AF37]">
                      {isVideo ? (
                        <Play className="h-5 w-5" aria-hidden="true" />
                      ) : isCarousel ? (
                        <Layers className="h-5 w-5" aria-hidden="true" />
                      ) : (
                        <Camera className="h-5 w-5" aria-hidden="true" />
                      )}
                    </div>
                    <span className="text-xs font-medium text-[#C8BFA8]">
                      {locale === 'en'
                        ? `Loading ${item.platform} embed...`
                        : `جارٍ تحميل المحتوى من ${item.platform}...`}
                    </span>
                  </div>
                )}
              </>
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.12),rgba(10,9,8,0.98)_72%)] px-6 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#D4AF37]/35 bg-[#141310] text-[#E6C76A]">
                  {isVideo ? (
                    <Play className="h-6 w-6 fill-[#D4AF37]/20" aria-hidden="true" />
                  ) : isCarousel ? (
                    <Layers className="h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Camera className="h-6 w-6" aria-hidden="true" />
                  )}
                </div>
                <p className="text-xs leading-relaxed text-[#C8BFA8]">
                  {embedUrl
                    ? locale === 'en'
                      ? 'Scroll into view to load embedded post'
                      : 'يتحمل المنشور تلقائيًا عند التمرير'
                    : locale === 'en'
                      ? `Direct embed unavailable — open original post on ${item.platform}`
                      : `يتعذر تضمين هذا المنشور مباشرة — يمكنك فتحه على ${item.platform}`}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Account & Description */}
        <div className="px-4 py-3.5">
          <div className="flex items-center justify-between gap-2 text-xs text-[#9E9580]">
            <span dir="ltr" className="font-semibold text-[#D4AF37]">
              {isInstagram ? `@${item.account}` : item.account}
            </span>
          </div>
          <p
            dir="auto"
            className="mt-2 line-clamp-2 text-xs leading-relaxed text-[#F7F3E9]/85 sm:text-sm"
          >
            {description}
          </p>
        </div>
      </div>

      {/* Original Post External Link */}
      <a
        href={item.public_url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${openLabel} — ${description}`}
        className="flex items-center justify-between border-t border-[#D4AF37]/15 bg-[#0D0C0A]/85 px-4 py-3 text-xs font-bold text-[#D4AF37] transition-colors hover:bg-[#191712] hover:text-[#E6C76A] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#D4AF37]"
      >
        <span>{openLabel}</span>
        <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      </a>
    </article>
  );
}

function LazyMediaSubsection({
  title,
  subtitle,
  items,
  locale,
  sectionId,
}: {
  title: string;
  subtitle: string;
  items: SocialMediaItem[];
  locale: 'ar' | 'en';
  sectionId: string;
}) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_BATCH);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const effectiveCount = Math.min(visibleCount, items.length);
  const hasMore = effectiveCount < items.length;

  useEffect(() => {
    if (!hasMore) return;
    const node = sentinelRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisibleCount((prev) => Math.min(prev + BATCH_INCREMENT, items.length));
        }
      },
      { rootMargin: '240px 0px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, items.length]);

  const visibleItems = items.slice(0, effectiveCount);

  return (
    <div id={sectionId} className="space-y-6">
      <div className="flex flex-col gap-2 border-b border-[#D4AF37]/20 pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-xl font-bold text-[#F7F3E9] sm:text-2xl">{title}</h3>
          <p className="mt-1 text-sm text-[#C8BFA8]">{subtitle}</p>
        </div>
        <span className="inline-flex w-fit items-center rounded-full border border-[#D4AF37]/30 bg-[#161512] px-3.5 py-1 text-xs font-bold text-[#E6C76A] tabular-nums">
          {locale === 'en'
            ? `${effectiveCount} of ${items.length} shown`
            : `عرض ${effectiveCount} من أصل ${items.length}`}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visibleItems.map((item) => (
          <EmbeddedMediaCard key={item.id} item={item} locale={locale} />
        ))}
      </div>

      {hasMore && (
        <div
          ref={sentinelRef}
          className="flex flex-wrap items-center justify-center gap-3 pt-4"
        >
          <button
            type="button"
            onClick={() =>
              setVisibleCount((prev) => Math.min(prev + BATCH_INCREMENT, items.length))
            }
            className="inline-flex min-h-[42px] items-center justify-center rounded-full bg-[#D4AF37] px-6 py-2 text-sm font-bold text-[#080808] transition-colors hover:bg-[#E6C76A] cursor-pointer"
          >
            {locale === 'en'
              ? `Load more (+${Math.min(BATCH_INCREMENT, items.length - effectiveCount)})`
              : `عرض المزيد (+${Math.min(BATCH_INCREMENT, items.length - effectiveCount)})`}
          </button>

          <button
            type="button"
            onClick={() => setVisibleCount(items.length)}
            className="inline-flex min-h-[42px] items-center justify-center rounded-full border border-[#D4AF37]/35 bg-[#161512] px-6 py-2 text-sm font-semibold text-[#F7F3E9] transition-colors hover:border-[#E6C76A] hover:text-[#E6C76A] cursor-pointer"
          >
            {locale === 'en'
              ? `Show all (${items.length})`
              : `عرض الكل (${items.length})`}
          </button>
        </div>
      )}
    </div>
  );
}

export default function SocialMediaGallerySection() {
  const { locale } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<GalleryFilter>('all');

  const counts = useMemo(
    () => computeFilterCounts(SOCIAL_MEDIA_ARCHIVE.items),
    []
  );

  const filteredItems = useMemo(
    () => filterSocialMediaItems(SOCIAL_MEDIA_ARCHIVE.items, activeFilter),
    [activeFilter]
  );

  const { imageItems, videoItems } = useMemo(
    () => splitIntoMediaSections(filteredItems),
    [filteredItems]
  );

  const filterButtons: { key: GalleryFilter; labelAr: string; labelEn: string }[] = [
    { key: 'all', labelAr: 'الكل', labelEn: 'All' },
    { key: 'image', labelAr: 'الصور', labelEn: 'Photos' },
    { key: 'video', labelAr: 'الفيديوهات', labelEn: 'Videos / Reels' },
    { key: 'Instagram', labelAr: 'Instagram', labelEn: 'Instagram' },
    { key: 'Facebook', labelAr: 'Facebook', labelEn: 'Facebook' },
  ];

  return (
    <section
      id="social-media-gallery"
      className="border-t border-[#D4AF37]/15 bg-[#0C0B09] py-14 sm:py-20"
    >
      <div className="mx-auto max-w-[1300px] px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Heading + Honest Completeness Disclaimer */}
        <div className="space-y-6">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-[#D4AF37]">
              {locale === 'en'
                ? 'PUBLIC SOCIAL MEDIA ARCHIVE'
                : 'أرشيف المنصات الاجتماعية'}
            </span>
            <h2 className="mt-2 text-2xl font-bold text-[#F7F3E9] sm:text-4xl">
              {locale === 'en' ? (
                <>
                  Explore NOVA Dental Clinic on{' '}
                  <span className="text-[#D4AF37]">Instagram &amp; Facebook</span>
                </>
              ) : (
                <>
                  منشورات وفيديوهات العيادة على{' '}
                  <span className="text-[#D4AF37]">Instagram و Facebook</span>
                </>
              )}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[#C8BFA8] sm:text-base">
              {locale === 'en'
                ? 'View embedded clinic photos, carousels, and reels directly inside the gallery with lazy loading, or open any original post directly on Instagram or Facebook.'
                : 'شاهد صور العيادة والمنشورات والريلز مضمنة مباشرة داخل الصفحة مع التحميل الكسول، أو افتح المنشور الأصلي في تبويب جديد عند الحاجة.'}
            </p>
          </div>

          {/* Completeness & Date Note */}
          <div className="flex items-start gap-3 rounded-2xl border border-[#D4AF37]/25 bg-[#141310] p-4 sm:p-5">
            <Info
              className="mt-0.5 h-5 w-5 shrink-0 text-[#D4AF37]"
              aria-hidden="true"
            />
            <div className="text-xs leading-relaxed text-[#C8BFA8] sm:text-sm">
              <p className="font-semibold text-[#F7F3E9]">
                {locale === 'en'
                  ? `Dental Media Archive (${SOCIAL_MEDIA_ARCHIVE.capturedAt}) — ${SOCIAL_MEDIA_ARCHIVE.items.length} dental posts`
                  : `أرشيف الوسائط السنية (${SOCIAL_MEDIA_ARCHIVE.capturedAt}) — ${SOCIAL_MEDIA_ARCHIVE.items.length} منشورًا متعلقًا بالأسنان`}
              </p>
              <p className="mt-1">
                {locale === 'en'
                  ? `Includes ${SOCIAL_MEDIA_ARCHIVE.counts.instagram} Instagram dental posts, ${SOCIAL_MEDIA_ARCHIVE.counts.facebookPhotos} Facebook dental photos, and ${SOCIAL_MEDIA_ARCHIVE.counts.facebookReels} Facebook reels (standalone logos and non-dental graphics excluded). This archive does not claim to include every post on the Instagram profile.`
                  : `يعرض هذا القسم ${SOCIAL_MEDIA_ARCHIVE.counts.instagram} منشورًا من Instagram و${SOCIAL_MEDIA_ARCHIVE.counts.facebookPhotos} صورة و${SOCIAL_MEDIA_ARCHIVE.counts.facebookReels} فيديو من Facebook خاصة بطب الأسنان (بعد استبعاد الشعارات والصور غير السنية)، ولا يشمل بالضرورة جميع منشورات الحساب بالكامل.`}
              </p>
            </div>
          </div>

          {/* Filter Pills */}
          <div
            role="group"
            aria-label={
              locale === 'en'
                ? 'Filter social media gallery'
                : 'تصفية معرض الوسائط الاجتماعية'
            }
            className="flex flex-wrap items-center gap-2.5"
          >
            {filterButtons.map((btn) => {
              const active = activeFilter === btn.key;
              const label = locale === 'en' ? btn.labelEn : btn.labelAr;
              return (
                <button
                  key={btn.key}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setActiveFilter(btn.key)}
                  className={`inline-flex min-h-[42px] items-center gap-2 rounded-full px-5 py-2 text-sm font-bold transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#D4AF37] text-[#080808] shadow-[0_6px_20px_rgba(212,175,55,0.2)]'
                      : 'border border-[#D4AF37]/25 bg-[#161512] text-[#F7F3E9] hover:border-[#E6C76A] hover:text-[#E6C76A]'
                  }`}
                >
                  <span>{label}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs tabular-nums ${
                      active
                        ? 'bg-[#080808]/15 text-[#080808]'
                        : 'bg-[#080808] text-[#D4AF37]'
                    }`}
                  >
                    {counts[btn.key]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Photos & Image/Carousel Posts Section */}
        {imageItems.length > 0 && (
          <LazyMediaSubsection
            key={`${activeFilter}-images`}
            sectionId="social-photos-section"
            title={
              locale === 'en'
                ? 'Photos & Image Posts'
                : 'قسم الصور والمنشورات'
            }
            subtitle={
              locale === 'en'
                ? 'All captured photo and image carousel posts (image & image_or_carousel).'
                : 'جميع الصور ومنشورات الألبومات المتاحة (image و image_or_carousel).'
            }
            items={imageItems}
            locale={locale}
          />
        )}

        {/* Reels & Videos Section */}
        {videoItems.length > 0 && (
          <LazyMediaSubsection
            key={`${activeFilter}-videos`}
            sectionId="social-videos-section"
            title={
              locale === 'en'
                ? 'Reels & Videos'
                : 'قسم الريلز والفيديوهات'
            }
            subtitle={
              locale === 'en'
                ? 'All captured short videos and reels across Instagram and Facebook.'
                : 'جميع مقاطع الفيديو والريلز المتاحة عبر Instagram و Facebook.'
            }
            items={videoItems}
            locale={locale}
          />
        )}
      </div>
    </section>
  );
}
