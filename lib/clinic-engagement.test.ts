import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildInquiriesCsv,
  buildInquiryWhatsAppReplyUrl,
  computeInquiryMetrics,
  computeReviewSummary,
  filterAdminInquiries,
  formatInquiryReference,
  getBranchLiveStatus,
  InquiryRecord,
  validateInquiryInput,
  validateReviewInput,
} from './clinic-engagement';

test('formatInquiryReference produces INQ-XXXXXX format', () => {
  assert.match(formatInquiryReference(), /^INQ-[0-9]{6}$/);
  assert.equal(formatInquiryReference(421908), 'INQ-421908');
});

test('validateInquiryInput validates required fields and normalizes Egyptian phone', () => {
  const invalid = validateInquiryInput(
    { name: 'أ', phone: '1234', subject: '', message: 'قصير' },
    'ar'
  );
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.name);
  assert.ok(invalid.errors.phone);
  assert.ok(invalid.errors.subject);
  assert.ok(invalid.errors.message);

  const valid = validateInquiryInput(
    {
      branchId: 'nasr-city',
      name: 'أحمد محمود',
      phone: '٠١٠٣١٢٣٥٥٦٢',
      subject: 'استفسار عن الفينيرز',
      message: 'أرغب في معرفة عدد جلسات الفينيرز وتفاصيل الحجز.',
    },
    'ar'
  );
  assert.equal(valid.valid, true);
  assert.equal(valid.branchId, 'nasr-city');
  assert.equal(valid.normalizedPhone, '01031235562');
});

test('computeInquiryMetrics, filterAdminInquiries, CSV escaping, and WhatsApp reply URL', () => {
  const items: InquiryRecord[] = [
    {
      id: 'inq_1',
      referenceCode: 'INQ-111222',
      branchId: 'fifth-settlement',
      name: '=HYPERLINK("bad") سارة',
      phone: '01012345678',
      subject: 'تبييض بالليزر',
      message: 'استفسار عن جلسات تبييض الأسنان',
      status: 'new',
      createdAt: '2026-11-19T10:00:00.000Z',
    },
    {
      id: 'inq_2',
      referenceCode: 'INQ-333444',
      branchId: 'nasr-city',
      name: 'كريم طارق',
      phone: '01555277054',
      subject: 'زراعة أسنان',
      message: 'مواعيد فرع مدينة نصر',
      status: 'replied',
      createdAt: '2026-11-18T10:00:00.000Z',
    },
  ];

  const metrics = computeInquiryMetrics(items);
  assert.equal(metrics.total, 2);
  assert.equal(metrics.unreadCount, 1);
  assert.equal(metrics.repliedCount, 1);

  const filtered = filterAdminInquiries(items, {
    search: 'كريم',
    status: 'replied',
    branch: 'nasr-city',
  });
  assert.equal(filtered.length, 1);
  assert.equal(filtered[0].id, 'inq_2');

  const csv = buildInquiriesCsv(items, 'en');
  assert.ok(csv.includes(`"'=HYPERLINK(""bad"") سارة"`));

  const waUrl = buildInquiryWhatsAppReplyUrl(items[1], 'ar');
  assert.ok(waUrl.startsWith('https://wa.me/201555277054?text='));
  assert.ok(decodeURIComponent(waUrl).includes('INQ-333444'));
});

test('validateReviewInput enforces rating bounds 1..5 and comment length', () => {
  const invalid = validateReviewInput(
    { patientName: 'أ', treatment: '', rating: 0, comment: 'ممتاز' },
    'ar'
  );
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.patientName);
  assert.ok(invalid.errors.rating);
  assert.ok(invalid.errors.comment);

  const valid = validateReviewInput(
    {
      patientName: 'دينا حسام',
      branchId: 'fifth-settlement',
      treatment: 'تصميم الابتسامة والفينيرز',
      rating: 5,
      comment: 'تجربة ممتازة وتعقيم على أعلى مستوى ونتيجة طبيعية جداً.',
    },
    'ar'
  );
  assert.equal(valid.valid, true);
  assert.equal(valid.rating, 5);
});

test('computeReviewSummary calculates accurate average and star distribution', () => {
  const summary = computeReviewSummary([
    { rating: 5 },
    { rating: 5 },
    { rating: 4 },
  ]);
  assert.equal(summary.count, 3);
  assert.equal(summary.average, 4.7);
  assert.equal(summary.distribution[5], 2);
  assert.equal(summary.distribution[4], 1);
  assert.equal(summary.distribution[1], 0);
});

test('getBranchLiveStatus evaluates Cairo opening hours accurately', () => {
  // Thursday 2026-11-19 15:00 Cairo (UTC+2 => 13:00Z) -> Open
  const openStatus = getBranchLiveStatus(12, 21, new Date('2026-11-19T13:00:00Z'));
  assert.equal(openStatus.isOpen, true);
  assert.equal(openStatus.isFriday, false);

  // Friday 2026-11-20 15:00 Cairo (UTC+2 => 13:00Z) -> Closed (Friday)
  const fridayStatus = getBranchLiveStatus(12, 21, new Date('2026-11-20T13:00:00Z'));
  assert.equal(fridayStatus.isOpen, false);
  assert.equal(fridayStatus.isFriday, true);

  // Saturday 2026-11-21 10:00 Cairo (UTC+2 => 08:00Z) -> Opens Today at 12:00 PM
  const morningStatus = getBranchLiveStatus(12, 21, new Date('2026-11-21T08:00:00Z'));
  assert.equal(morningStatus.isOpen, false);
  assert.equal(morningStatus.isFriday, false);
});
