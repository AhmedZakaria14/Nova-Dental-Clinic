import {
  CLINIC_BRANCHES,
  DENTAL_SERVICES,
  BranchId,
} from './clinic-data';
import { BookingRecord } from './booking-logic';
import { InquiryRecord, PatientReviewRecord } from './clinic-engagement';
import { Locale } from './i18n';

export type OfferBranchId = BranchId | 'all';

export const OFFER_LIMITS = {
  titleMin: 3,
  titleMax: 120,
  badgeMin: 2,
  badgeMax: 40,
  descriptionMin: 10,
  descriptionMax: 500,
  priceLabelMin: 2,
  priceLabelMax: 80,
} as const;

export interface ClinicOfferRecord {
  id: string;
  titleAr: string;
  titleEn: string;
  badgeAr: string;
  badgeEn: string;
  descriptionAr: string;
  descriptionEn: string;
  priceLabelAr: string;
  priceLabelEn: string;
  serviceId: string;
  branchId: OfferBranchId;
  validUntil: string; // YYYY-MM-DD
  active: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt?: string;
  isDefault?: boolean;
}

export interface OfferDraftInput {
  titleAr: string;
  titleEn: string;
  badgeAr: string;
  badgeEn: string;
  descriptionAr: string;
  descriptionEn: string;
  priceLabelAr: string;
  priceLabelEn: string;
  serviceId: string;
  branchId: OfferBranchId;
  validUntil: string;
  active: boolean;
  featured: boolean;
}

export const DEFAULT_CLINIC_OFFERS: ClinicOfferRecord[] = [
  {
    id: 'default-hollywood-smile',
    titleAr: 'باقة تصميم الابتسامة والفينير الرقمي (DSD)',
    titleEn: 'Digital Smile Design (DSD) & Veneers Package',
    badgeAr: 'الأكثر طلباً',
    badgeEn: 'Most Popular',
    descriptionAr:
      'تشمل المسح الرقمي ثلاثي الأبعاد للأسنان، معاينة التصميم التجريبي للابتسامة (Mock-up) قبل التنفيذ، ومتابعة مجانية بعد التركيب.',
    descriptionEn:
      'Includes 3D intraoral scanning, digital smile mock-up preview prior to placement, and complimentary post-placement polish & follow-up.',
    priceLabelAr: 'معاينة رقمية مجانية عند الحجز',
    priceLabelEn: 'Complimentary 3D Smile Preview',
    serviceId: 'veneers-dsd',
    branchId: 'all',
    validUntil: '2026-12-31',
    active: true,
    featured: true,
    createdAt: '2026-01-01T10:00:00.000Z',
    isDefault: true,
  },
  {
    id: 'default-laser-whitening',
    titleAr: 'جلسة التبييض بالليزر وتنظيف الجير الشامل',
    titleEn: 'In-Office Laser Whitening & Deep Scaling',
    badgeAr: 'عرض العيادة',
    badgeEn: 'Clinic Special',
    descriptionAr:
      'إزالة التصبغات والجير بالموجات فوق الصوتية مع جلسة تبييض آمنة بالليزر وحماية اللثة وجيل مضاد لحساسية المينا في زيارة واحدة.',
    descriptionEn:
      'Ultrasonic scaling and stain removal paired with safe in-office laser whitening, gingival barrier protection, and desensitizing gel in one visit.',
    priceLabelAr: 'باقة الزيارة الواحدة — اسأل عن السعر',
    priceLabelEn: 'Single-Visit Package — Ask for Rate',
    serviceId: 'laser-whitening',
    branchId: 'fifth-settlement',
    validUntil: '2026-12-31',
    active: true,
    featured: false,
    createdAt: '2026-01-02T10:00:00.000Z',
    isDefault: true,
  },
  {
    id: 'default-implant-consult',
    titleAr: 'خطة الزراعة الموجهة ثلاثية الأبعاد والمتابعة',
    titleEn: '3D Guided Dental Implant Assessment Plan',
    badgeAr: 'رعاية متقدمة',
    badgeEn: 'Precision Care',
    descriptionAr:
      'فحص شامل لعظام الفك وتقييم رقمي دقيق لخطة الزراعة الفورية أو التقليدية باستخدام غرسات ألمانية وسويسرية معتمدة.',
    descriptionEn:
      'Comprehensive bone assessment and digital 3D treatment planning for immediate or staged Swiss/German dental implants.',
    priceLabelAr: 'خطة علاج مفصلة وشفافة',
    priceLabelEn: 'Transparent Written Treatment Plan',
    serviceId: 'immediate-implants',
    branchId: 'nasr-city',
    validUntil: '2026-12-31',
    active: true,
    featured: false,
    createdAt: '2026-01-03T10:00:00.000Z',
    isDefault: true,
  },
];

export function isOfferExpired(validUntil: string, todayIso: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(validUntil)) return false;
  return validUntil < todayIso;
}

export function validateOfferInput(
  input: OfferDraftInput,
  locale: Locale
): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  const validServiceIds = new Set(DENTAL_SERVICES.map((s) => s.id));
  const validBranches: OfferBranchId[] = ['fifth-settlement', 'nasr-city', 'all'];

  const tAr = input.titleAr.trim();
  const tEn = input.titleEn.trim();
  const bAr = input.badgeAr.trim();
  const bEn = input.badgeEn.trim();
  const dAr = input.descriptionAr.trim();
  const dEn = input.descriptionEn.trim();
  const pAr = input.priceLabelAr.trim();
  const pEn = input.priceLabelEn.trim();

  if (tAr.length < OFFER_LIMITS.titleMin || tAr.length > OFFER_LIMITS.titleMax) {
    errors.titleAr =
      locale === 'en'
        ? `Arabic title must be ${OFFER_LIMITS.titleMin}–${OFFER_LIMITS.titleMax} chars.`
        : `عنوان العرض بالعربية يجب أن يكون بين ${OFFER_LIMITS.titleMin} و${OFFER_LIMITS.titleMax} حرفاً.`;
  }

  if (tEn.length < OFFER_LIMITS.titleMin || tEn.length > OFFER_LIMITS.titleMax) {
    errors.titleEn =
      locale === 'en'
        ? `English title must be ${OFFER_LIMITS.titleMin}–${OFFER_LIMITS.titleMax} chars.`
        : `عنوان العرض بالإنجليزية يجب أن يكون بين ${OFFER_LIMITS.titleMin} و${OFFER_LIMITS.titleMax} حرفاً.`;
  }

  if (bAr.length < OFFER_LIMITS.badgeMin || bAr.length > OFFER_LIMITS.badgeMax) {
    errors.badgeAr =
      locale === 'en' ? 'Enter a short Arabic badge.' : 'يرجى إدخال شارة مختصرة بالعربية.';
  }

  if (bEn.length < OFFER_LIMITS.badgeMin || bEn.length > OFFER_LIMITS.badgeMax) {
    errors.badgeEn =
      locale === 'en' ? 'Enter a short English badge.' : 'يرجى إدخال شارة مختصرة بالإنجليزية.';
  }

  if (
    dAr.length < OFFER_LIMITS.descriptionMin ||
    dAr.length > OFFER_LIMITS.descriptionMax
  ) {
    errors.descriptionAr =
      locale === 'en'
        ? 'Arabic description must be at least 10 characters.'
        : 'وصف العرض بالعربية يجب ألا يقل عن 10 أحرف.';
  }

  if (
    dEn.length < OFFER_LIMITS.descriptionMin ||
    dEn.length > OFFER_LIMITS.descriptionMax
  ) {
    errors.descriptionEn =
      locale === 'en'
        ? 'English description must be at least 10 characters.'
        : 'وصف العرض بالإنجليزية يجب ألا يقل عن 10 أحرف.';
  }

  if (pAr.length < OFFER_LIMITS.priceLabelMin || pAr.length > OFFER_LIMITS.priceLabelMax) {
    errors.priceLabelAr =
      locale === 'en' ? 'Enter Arabic price/benefit label.' : 'أدخل وصف السعر أو الميزة بالعربية.';
  }

  if (pEn.length < OFFER_LIMITS.priceLabelMin || pEn.length > OFFER_LIMITS.priceLabelMax) {
    errors.priceLabelEn =
      locale === 'en' ? 'Enter English price/benefit label.' : 'أدخل وصف السعر أو الميزة بالإنجليزية.';
  }

  if (!validServiceIds.has(input.serviceId)) {
    errors.serviceId =
      locale === 'en' ? 'Select a valid dental service.' : 'اختر خدمة طبية صحيحة.';
  }

  if (!validBranches.includes(input.branchId)) {
    errors.branchId =
      locale === 'en' ? 'Select a valid branch.' : 'اختر فرعاً صحيحاً.';
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.validUntil)) {
    errors.validUntil =
      locale === 'en'
        ? 'Valid-until date must be YYYY-MM-DD.'
        : 'تاريخ الانتهاء يجب أن يكون بصيغة YYYY-MM-DD.';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

// =============================================================================
// Patient Calendar Export (.ics & Google Calendar Link)
// =============================================================================
function escapeIcsText(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/\r?\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;');
}

function buildCompactDateTime(dateIso: string, timeHHmm: string, addMinutes = 0): string {
  const [y, m, d] = dateIso.split('-').map(Number);
  const [hh, mm] = timeHHmm.split(':').map(Number);
  const totalMins = hh * 60 + mm + addMinutes;
  const endH = Math.floor(totalMins / 60) % 24;
  const endM = totalMins % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${y}${pad(m)}${pad(d)}T${pad(endH)}${pad(endM)}00`;
}

export function buildAppointmentIcsContent(
  booking: Pick<
    BookingRecord,
    'referenceCode' | 'branchId' | 'serviceId' | 'date' | 'time' | 'patientName'
  >,
  locale: Locale
): string {
  const branch = CLINIC_BRANCHES.find((b) => b.id === booking.branchId);
  const service = DENTAL_SERVICES.find((s) => s.id === booking.serviceId);
  const duration = service?.durationMinutes ?? 45;

  const summary =
    locale === 'en'
      ? `NOVA Dental Appointment — ${service?.titleEn ?? booking.serviceId}`
      : `موعد عيادة نوفا لطب الأسنان — ${service?.titleAr ?? booking.serviceId}`;

  const location = branch
    ? locale === 'en'
      ? `${branch.nameEn}, ${branch.addressEn}`
      : `${branch.nameAr}، ${branch.addressAr}`
    : 'NOVA Dental Clinic, Cairo';

  const description =
    locale === 'en'
      ? `Reference: ${booking.referenceCode}\nPatient: ${booking.patientName}\nBranch Phone: ${branch?.phone ?? '01031235562'}`
      : `رقم الحجز المرجعي: ${booking.referenceCode}\nالاسم: ${booking.patientName}\nهاتف العيادة: ${branch?.phone ?? '01031235562'}`;

  const dtStart = buildCompactDateTime(booking.date, booking.time, 0);
  const dtEnd = buildCompactDateTime(booking.date, booking.time, duration);
  const stamp = new Date()
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}Z$/, 'Z');

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//NOVA Dental Clinic//Appointment Booking//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${booking.referenceCode}@novadental.eg`,
    `DTSTAMP:${stamp}`,
    `DTSTART;TZID=Africa/Cairo:${dtStart}`,
    `DTEND;TZID=Africa/Cairo:${dtEnd}`,
    `SUMMARY:${escapeIcsText(summary)}`,
    `LOCATION:${escapeIcsText(location)}`,
    `DESCRIPTION:${escapeIcsText(description)}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

export function buildGoogleCalendarUrl(
  booking: Pick<
    BookingRecord,
    'referenceCode' | 'branchId' | 'serviceId' | 'date' | 'time' | 'patientName'
  >,
  locale: Locale
): string {
  const branch = CLINIC_BRANCHES.find((b) => b.id === booking.branchId);
  const service = DENTAL_SERVICES.find((s) => s.id === booking.serviceId);
  const duration = service?.durationMinutes ?? 45;

  const title =
    locale === 'en'
      ? `NOVA Dental — ${service?.titleEn ?? booking.serviceId}`
      : `موعد نوفا لطب الأسنان — ${service?.titleAr ?? booking.serviceId}`;

  const location = branch
    ? locale === 'en'
      ? `${branch.nameEn}, ${branch.addressEn}`
      : `${branch.nameAr}، ${branch.addressAr}`
    : 'NOVA Dental Clinic, Cairo';

  const details =
    locale === 'en'
      ? `Booking Ref: ${booking.referenceCode}\nPatient: ${booking.patientName}\nPhone: ${branch?.phone ?? '01031235562'}`
      : `رقم الحجز: ${booking.referenceCode}\nالاسم: ${booking.patientName}\nالهاتف: ${branch?.phone ?? '01031235562'}`;

  const start = buildCompactDateTime(booking.date, booking.time, 0);
  const end = buildCompactDateTime(booking.date, booking.time, duration);

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${start}/${end}`,
    ctz: 'Africa/Cairo',
    details,
    location,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

// =============================================================================
// Clinic Live Analytics Aggregator (Admin Dashboard)
// =============================================================================
export interface ServiceDemandStat {
  serviceId: string;
  titleAr: string;
  titleEn: string;
  count: number;
  sharePercent: number;
}

export interface DailyLoadStat {
  date: string;
  count: number;
}

export interface ClinicAnalyticsSummary {
  totalBookings: number;
  confirmationRatePercent: number;
  completionRatePercent: number;
  cancellationRatePercent: number;
  inquiryReplyRatePercent: number;
  averageApprovedRating: number;
  approvedReviewsCount: number;
  branchSplit: {
    fifthSettlement: number;
    nasrCity: number;
    fifthSettlementPercent: number;
    nasrCityPercent: number;
  };
  serviceDemand: ServiceDemandStat[];
  nextSevenDaysLoad: DailyLoadStat[];
}

export function computeClinicAnalytics(
  bookings: BookingRecord[],
  inquiries: InquiryRecord[],
  reviews: PatientReviewRecord[],
  todayIso: string
): ClinicAnalyticsSummary {
  const totalBookings = bookings.length;
  const activeOrDone = bookings.filter(
    (b) => b.status === 'confirmed' || b.status === 'completed'
  ).length;
  const completed = bookings.filter((b) => b.status === 'completed').length;
  const cancelledOrNoShow = bookings.filter(
    (b) => b.status === 'cancelled' || b.status === 'no-show'
  ).length;

  const confirmationRatePercent =
    totalBookings === 0 ? 0 : Math.round((activeOrDone / totalBookings) * 100);
  const completionRatePercent =
    totalBookings === 0 ? 0 : Math.round((completed / totalBookings) * 100);
  const cancellationRatePercent =
    totalBookings === 0
      ? 0
      : Math.round((cancelledOrNoShow / totalBookings) * 100);

  const repliedInquiries = inquiries.filter(
    (i) => i.status === 'replied' || i.status === 'archived'
  ).length;
  const inquiryReplyRatePercent =
    inquiries.length === 0
      ? 100
      : Math.round((repliedInquiries / inquiries.length) * 100);

  const approvedReviews = reviews.filter((r) => r.status === 'approved');
  const averageApprovedRating =
    approvedReviews.length === 0
      ? 5
      : Number(
          (
            approvedReviews.reduce((acc, r) => acc + r.rating, 0) /
            approvedReviews.length
          ).toFixed(1)
        );

  const fifthSettlement = bookings.filter(
    (b) => b.branchId === 'fifth-settlement'
  ).length;
  const nasrCity = bookings.filter((b) => b.branchId === 'nasr-city').length;
  const fifthSettlementPercent =
    totalBookings === 0 ? 50 : Math.round((fifthSettlement / totalBookings) * 100);
  const nasrCityPercent =
    totalBookings === 0 ? 50 : 100 - fifthSettlementPercent;

  const serviceCounts = new Map<string, number>();
  for (const b of bookings) {
    serviceCounts.set(b.serviceId, (serviceCounts.get(b.serviceId) ?? 0) + 1);
  }

  const serviceDemand: ServiceDemandStat[] = DENTAL_SERVICES.map((srv) => {
    const count = serviceCounts.get(srv.id) ?? 0;
    return {
      serviceId: srv.id,
      titleAr: srv.titleAr,
      titleEn: srv.titleEn,
      count,
      sharePercent:
        totalBookings === 0 ? 0 : Math.round((count / totalBookings) * 100),
    };
  }).sort((a, b) => b.count - a.count);

  // Build next 7 calendar days starting from todayIso
  const baseDate = new Date(`${todayIso}T12:00:00Z`);
  const nextSevenDaysLoad: DailyLoadStat[] = [];
  for (let i = 0; i < 7; i += 1) {
    const d = new Date(baseDate);
    d.setUTCDate(baseDate.getUTCDate() + i);
    const iso = d.toISOString().slice(0, 10);
    const count = bookings.filter(
      (b) =>
        b.date === iso && b.status !== 'cancelled' && b.status !== 'no-show'
    ).length;
    nextSevenDaysLoad.push({ date: iso, count });
  }

  return {
    totalBookings,
    confirmationRatePercent,
    completionRatePercent,
    cancellationRatePercent,
    inquiryReplyRatePercent,
    averageApprovedRating,
    approvedReviewsCount: approvedReviews.length,
    branchSplit: {
      fifthSettlement,
      nasrCity,
      fifthSettlementPercent,
      nasrCityPercent,
    },
    serviceDemand,
    nextSevenDaysLoad,
  };
}
