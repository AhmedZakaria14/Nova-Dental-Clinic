import test from 'node:test';
import assert from 'node:assert/strict';
import {
  SOCIAL_MEDIA_ARCHIVE,
  computeFilterCounts,
  filterSocialMediaItems,
  getMediaDescription,
  getOfficialEmbedUrl,
  isImageMediaItem,
  isValidPublicUrl,
  isVideoMediaItem,
  splitIntoMediaSections,
} from './social-media-gallery';

test('loads all 129 social media items cleanly with zero excluded entries', () => {
  assert.equal(SOCIAL_MEDIA_ARCHIVE.totalCaptured, 129);
  assert.equal(SOCIAL_MEDIA_ARCHIVE.items.length, 129);
  assert.equal(SOCIAL_MEDIA_ARCHIVE.excludedItems.length, 0);
});

test('computes exact platform and media type filter counts', () => {
  const counts = computeFilterCounts(SOCIAL_MEDIA_ARCHIVE.items);
  assert.equal(counts.all, 129);
  assert.equal(counts.Instagram, 36);
  assert.equal(counts.Facebook, 93);
  assert.equal(counts.image, 91); // 8 IG image_or_carousel + 83 FB image
  assert.equal(counts.video, 38); // 28 IG video + 10 FB video
});

test('splitIntoMediaSections routes images/carousels and videos accurately', () => {
  const { imageItems, videoItems } = splitIntoMediaSections(SOCIAL_MEDIA_ARCHIVE.items);
  assert.equal(imageItems.length, 91);
  assert.equal(videoItems.length, 38);
  assert.ok(imageItems.every(isImageMediaItem));
  assert.ok(videoItems.every(isVideoMediaItem));
});

test('filterSocialMediaItems narrows correctly by platform and media type', () => {
  const igOnly = filterSocialMediaItems(SOCIAL_MEDIA_ARCHIVE.items, 'Instagram');
  assert.equal(igOnly.length, 36);
  assert.ok(igOnly.every((item) => item.platform === 'Instagram'));

  const fbSections = splitIntoMediaSections(
    filterSocialMediaItems(SOCIAL_MEDIA_ARCHIVE.items, 'Facebook')
  );
  assert.equal(fbSections.imageItems.length, 83);
  assert.equal(fbSections.videoItems.length, 10);
});

test('getMediaDescription uses honest generic fallback for missing descriptions without inventing clinical claims', () => {
  const fbNoDesc = {
    platform: 'Facebook' as const,
    media_type: 'image' as const,
    accessible_description: 'No photo description available.',
  };
  assert.equal(getMediaDescription(fbNoDesc, 'ar'), 'صورة من Facebook');
  assert.equal(getMediaDescription(fbNoDesc, 'en'), 'Photo from Facebook');

  const fbReelGeneric = {
    platform: 'Facebook' as const,
    media_type: 'video' as const,
    accessible_description: 'Facebook Reel',
  };
  assert.equal(getMediaDescription(fbReelGeneric, 'ar'), 'فيديو ريلز من Facebook');

  const realDesc = {
    platform: 'Instagram' as const,
    media_type: 'image_or_carousel' as const,
    accessible_description: 'Photo by Nova Dental Clinic on October 18, 2026.',
  };
  assert.equal(
    getMediaDescription(realDesc, 'ar'),
    'Photo by Nova Dental Clinic on October 18, 2026.'
  );
});

test('isValidPublicUrl accepts official Instagram/Facebook URLs and rejects invalid ones', () => {
  assert.equal(
    isValidPublicUrl('https://www.instagram.com/nova.dental.clinic.eg/p/DepByggosWV/'),
    true
  );
  assert.equal(
    isValidPublicUrl('https://www.facebook.com/photo/?fbid=122116636784925987'),
    true
  );
  assert.equal(isValidPublicUrl('javascript:alert(1)'), false);
  assert.equal(isValidPublicUrl(''), false);
});

test('getOfficialEmbedUrl produces valid embed URLs for all 129 items', () => {
  for (const item of SOCIAL_MEDIA_ARCHIVE.items) {
    const embedUrl = getOfficialEmbedUrl(item);
    assert.ok(embedUrl && embedUrl.startsWith('https://'), `Expected embed URL for ${item.id}`);
  }

  assert.equal(
    getOfficialEmbedUrl({
      platform: 'Instagram',
      media_type: 'image_or_carousel',
      public_url: 'https://www.instagram.com/nova.dental.clinic.eg/p/DepByggosWV/',
    }),
    'https://www.instagram.com/p/DepByggosWV/embed/'
  );

  assert.equal(
    getOfficialEmbedUrl({
      platform: 'Facebook',
      media_type: 'video',
      public_url: 'https://www.facebook.com/reel/1152082487165705/',
    }),
    'https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1152082487165705%2F&show_text=false&width=360'
  );
});
