import rawArchive from '@/public/assets/aistudio/NOVA_social_media_links_9fe88385.json';

export type SocialPlatform = 'Instagram' | 'Facebook';

export type SocialMediaType = 'image' | 'image_or_carousel' | 'video';

export type GalleryFilter = 'all' | 'image' | 'video' | 'Instagram' | 'Facebook';

export interface RawSocialMediaItem {
  id: string;
  platform: string;
  media_type: string;
  account: string;
  public_url: string;
  accessible_description?: string;
  views_text?: string;
}

export interface SocialMediaItem {
  id: string;
  platform: SocialPlatform;
  media_type: SocialMediaType;
  account: string;
  public_url: string;
  accessible_description: string;
  views_text?: string;
}

export interface SocialMediaArchive {
  clinic: string;
  capturedAt: string;
  totalCaptured: number;
  counts: {
    instagram: number;
    facebookPhotos: number;
    facebookReels: number;
  };
  completenessNote: string;
  items: SocialMediaItem[];
  excludedItems: RawSocialMediaItem[];
}

export function isValidPublicUrl(url: unknown): url is string {
  if (typeof url !== 'string') return false;
  const trimmed = url.trim();
  return /^https:\/\/(www\.)?(instagram|facebook)\.com\/.+/i.test(trimmed);
}

export function isImageMediaItem(item: Pick<SocialMediaItem, 'media_type'>): boolean {
  return item.media_type === 'image' || item.media_type === 'image_or_carousel';
}

export function isVideoMediaItem(item: Pick<SocialMediaItem, 'media_type'>): boolean {
  return item.media_type === 'video';
}

const GENERIC_EMPTY_DESCRIPTIONS = new Set([
  '',
  'no photo description available.',
  'no photo description available',
  'facebook reel',
  'instagram post',
  'instagram reel',
]);

export function getMediaDescription(
  item: Pick<SocialMediaItem, 'platform' | 'media_type' | 'accessible_description'>,
  locale: 'ar' | 'en'
): string {
  const raw = (item.accessible_description ?? '').trim();
  if (raw && !GENERIC_EMPTY_DESCRIPTIONS.has(raw.toLowerCase())) {
    return raw;
  }

  if (locale === 'en') {
    if (item.platform === 'Facebook') {
      return isVideoMediaItem(item)
        ? 'Video Reel from Facebook'
        : 'Photo from Facebook';
    }
    return isVideoMediaItem(item)
      ? 'Video Reel from Instagram'
      : 'Photo post from Instagram';
  }

  if (item.platform === 'Facebook') {
    return isVideoMediaItem(item)
      ? 'فيديو ريلز من Facebook'
      : 'صورة من Facebook';
  }
  return isVideoMediaItem(item)
    ? 'فيديو ريلز من Instagram'
    : 'منشور صور من Instagram';
}

export function getMediaTypeLabel(
  mediaType: SocialMediaType,
  locale: 'ar' | 'en'
): string {
  if (locale === 'en') {
    if (mediaType === 'video') return 'Video / Reel';
    if (mediaType === 'image_or_carousel') return 'Photo / Carousel';
    return 'Photo';
  }
  if (mediaType === 'video') return 'فيديو / ريلز';
  if (mediaType === 'image_or_carousel') return 'صورة / ألبوم';
  return 'صورة';
}

export function getOfficialEmbedUrl(
  item: Pick<SocialMediaItem, 'platform' | 'media_type' | 'public_url'>
): string | null {
  if (!isValidPublicUrl(item.public_url)) return null;

  if (item.platform === 'Instagram') {
    const match = item.public_url.match(/\/(p|reel)\/([A-Za-z0-9_-]+)/i);
    if (!match) return null;
    return `https://www.instagram.com/${match[1].toLowerCase()}/${match[2]}/embed/`;
  }

  const encoded = encodeURIComponent(item.public_url);
  if (isVideoMediaItem(item)) {
    return `https://www.facebook.com/plugins/video.php?href=${encoded}&show_text=false&width=360`;
  }
  return `https://www.facebook.com/plugins/post.php?href=${encoded}&show_text=false&width=360`;
}

export const EXCLUDED_NON_DENTAL_IDS: ReadonlySet<string> = new Set([
  // Pure NOVA logo graphics & circle brand marks
  'fb_photo_122116636784925987',
  'fb_photo_122116636688925987',
  'fb_photo_122116618886925987',
  'fb_photo_122116618346925987',
  'fb_photo_122116617914925987',
  'fb_photo_122116617812925987',
  'fb_photo_122116617734925987',
  'fb_photo_122099157032925987',
  // Eid greeting graphic & generic "N" letter avatar unrelated to dental work
  'fb_photo_122165316056925987',
  'fb_photo_122099153738925987',
]);

export function isDentalGalleryItem(entry: Pick<RawSocialMediaItem, 'id'>): boolean {
  return !EXCLUDED_NON_DENTAL_IDS.has(entry.id);
}

export function parseSocialMediaArchive(data: {
  clinic: string;
  captured_at: string;
  total_captured: number;
  counts: Record<string, number>;
  completeness_note: string;
  items: RawSocialMediaItem[];
}): SocialMediaArchive {
  const validItems: SocialMediaItem[] = [];
  const excludedItems: RawSocialMediaItem[] = [];

  for (const entry of data.items) {
    const platformValid =
      entry.platform === 'Instagram' || entry.platform === 'Facebook';
    const mediaTypeValid =
      entry.media_type === 'image' ||
      entry.media_type === 'image_or_carousel' ||
      entry.media_type === 'video';

    if (
      platformValid &&
      mediaTypeValid &&
      isValidPublicUrl(entry.public_url) &&
      isDentalGalleryItem(entry)
    ) {
      validItems.push({
        id: entry.id,
        platform: entry.platform as SocialPlatform,
        media_type: entry.media_type as SocialMediaType,
        account: entry.account,
        public_url: entry.public_url.trim(),
        accessible_description: (entry.accessible_description ?? '').trim(),
        views_text: entry.views_text ? String(entry.views_text).trim() : undefined,
      });
    } else {
      excludedItems.push(entry);
    }
  }

  return {
    clinic: data.clinic,
    capturedAt: data.captured_at,
    totalCaptured: validItems.length,
    counts: {
      instagram: validItems.filter((item) => item.platform === 'Instagram').length,
      facebookPhotos: validItems.filter(
        (item) => item.platform === 'Facebook' && isImageMediaItem(item)
      ).length,
      facebookReels: validItems.filter(
        (item) => item.platform === 'Facebook' && isVideoMediaItem(item)
      ).length,
    },
    completenessNote: data.completeness_note,
    items: validItems,
    excludedItems,
  };
}

export function filterSocialMediaItems(
  items: SocialMediaItem[],
  filter: GalleryFilter
): SocialMediaItem[] {
  if (filter === 'all') return items;
  if (filter === 'image') return items.filter(isImageMediaItem);
  if (filter === 'video') return items.filter(isVideoMediaItem);
  return items.filter((item) => item.platform === filter);
}

export function splitIntoMediaSections(items: SocialMediaItem[]): {
  imageItems: SocialMediaItem[];
  videoItems: SocialMediaItem[];
} {
  return {
    imageItems: items.filter(isImageMediaItem),
    videoItems: items.filter(isVideoMediaItem),
  };
}

export function computeFilterCounts(items: SocialMediaItem[]): Record<GalleryFilter, number> {
  return {
    all: items.length,
    image: items.filter(isImageMediaItem).length,
    video: items.filter(isVideoMediaItem).length,
    Instagram: items.filter((i) => i.platform === 'Instagram').length,
    Facebook: items.filter((i) => i.platform === 'Facebook').length,
  };
}

export const SOCIAL_MEDIA_ARCHIVE = parseSocialMediaArchive(rawArchive);
