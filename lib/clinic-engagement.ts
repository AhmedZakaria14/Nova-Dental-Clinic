import { BranchId } from './clinic-data';
import { CLINIC_INFO } from './clinic-config';
import { Locale } from './i18n';
import { sanitizeTextField, validateEgyptianPhone } from './booking-logic';

export type InquiryBranchId = BranchId | 'general';
export type InquiryStatus = 'new' | 'in-progress' | 'replied' | 'archived';

export interface InquiryRecord {
  id: string;
  referenceCode: string;
  branchId: InquiryBranchId;
  name: string;
  phone: string;
  subject: string;
  message: string;
  status: InquiryStatus;
  adminNotes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AdminInquiryFilters {
  search: string;
  status: 'all' | InquiryStatus;
  branch: 'all' | InquiryBranchId;
}

export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface PatientReviewRecord {
  id: string;
  patientName: string;
  branchId: BranchId;
  treatment: string;
  rating: number;
  comment: string;
  status: ReviewStatus;
  featured: boolean;
  createdAt: string;
  updatedAt?: string;
}

export const INQUIRY_LIMITS = {
  nameMin: 3,
  nameMax: 120,
  subjectMin: 2,
  subjectMax: 140,
  messageMin: 6,
  messageMax: 1000,
  adminNotesMax: 500,
} as const;

export const REVIEW_LIMITS = {
  patientNameMin: 2,
  patientNameMax: 80,
  treatmentMin: 2,
  treatmentMax: 100,
  commentMin: 10,
  commentMax: 600,
  minRating: 1,
  maxRating: 5,
} as const;

export function formatInquiryReference(seed?: number): string {
  const num = seed ?? Math.floor(100000 + Math.random() * 900000);
  return `INQ-${String(num).slice(0, 6).padStart(6, '0')}`;
}

export function validateInquiryInput(
  input: {
    branchId?: string;
    name?: string;
    phone?: string;
    subject?: string;
    message?: string;
  },
  locale: Locale = 'ar'
): {
  valid: boolean;
  errors: Record<string, string>;
  normalizedPhone: string;
  branchId: InquiryBranchId;
} {
  const errors: Record<string, string> = {};
  const branchId: InquiryBranchId =
    input.branchId === 'fifth-settlement' || input.branchId === 'nasr-city'
      ? input.branchId
      : 'general';

  const name = sanitizeTextField(input.name, INQUIRY_LIMITS.nameMax);
  const subject = sanitizeTextField(input.subject, INQUIRY_LIMITS.subjectMax);
  const message = sanitizeTextField(input.message, INQUIRY_LIMITS.messageMax);
  const phoneCheck = validateEgyptianPhone(input.phone ?? '', locale);

  if (name.length < INQUIRY_LIMITS.nameMin) {
    errors.name =
      locale === 'en'
        ? 'Please enter your full name (at least 3 characters).'
        : 'يرجى إدخال الاسم الكامل (٣ أحرف على الأقل).';
  }
  if (!phoneCheck.valid && phoneCheck.error) {
    errors.phone = phoneCheck.error;
  }
  if (subject.length < INQUIRY_LIMITS.subjectMin) {
    errors.subject =
      locale === 'en'
        ? 'Please enter a subject for your inquiry.'
        : 'يرجى كتابة موضوع الرسالة.';
  }
  if (message.length < INQUIRY_LIMITS.messageMin) {
    errors.message =
      locale === 'en'
        ? 'Please enter your message (at least 6 characters).'
        : 'يرجى كتابة تفاصيل استفسارك (٦ أحرف على الأقل).';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    normalizedPhone: phoneCheck.normalized,
    branchId,
  };
}

export function computeInquiryMetrics(inquiries: InquiryRecord[]) {
  let unreadCount = 0;
  let inProgressCount = 0;
  let repliedCount = 0;
  let archivedCount = 0;

  for (const item of inquiries) {
    if (item.status === 'new') unreadCount += 1;
    else if (item.status === 'in-progress') inProgressCount += 1;
    else if (item.status === 'replied') repliedCount += 1;
    else if (item.status === 'archived') archivedCount += 1;
  }

  return {
    total: inquiries.length,
    unreadCount,
    inProgressCount,
    repliedCount,
    archivedCount,
  };
}

export function filterAdminInquiries(
  inquiries: InquiryRecord[],
  filters: AdminInquiryFilters
): InquiryRecord[] {
  const q = filters.search.trim().toLowerCase();
  return inquiries.filter((item) => {
    if (filters.status !== 'all' && item.status !== filters.status) {
      return false;
    }
    if (filters.branch !== 'all' && item.branchId !== filters.branch) {
      return false;
    }
    if (q) {
      const hay =
        `${item.referenceCode} ${item.name} ${item.phone} ${item.subject} ${item.message}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

export function buildInquiryWhatsAppReplyUrl(
  inquiry: Pick<InquiryRecord, 'name' | 'phone' | 'referenceCode' | 'subject'>,
  locale: Locale = 'ar'
): string {
  const digits = inquiry.phone.replace(/[^\d]/g, '');
  const intlPhone = digits.startsWith('20')
    ? digits
    : digits.startsWith('0')
      ? `2${digits}`
      : CLINIC_INFO.whatsappNumber;

  const text =
    locale === 'en'
      ? `Hello ${inquiry.name}, thank you for contacting NOVA Dental Clinic regarding "${inquiry.subject}" (Ref: ${inquiry.referenceCode}). How can we assist you today?`
      : `مرحباً ${inquiry.name}، نشكرك على تواصلك مع عيادة نوفا لطب الأسنان بخصوص "${inquiry.subject}" (المرجع: ${inquiry.referenceCode}). يسعدنا الرد على استفسارك ومساعدتك.`;

  return `https://wa.me/${intlPhone}?text=${encodeURIComponent(text)}`;
}

function escapeCsvCell(value: string): string {
  const clean = value.replace(/\r?\n/g, ' ').trim();
  const safe = /^[=+\-@]/.test(clean) ? `'${clean}` : clean;
  return `"${safe.replace(/"/g, '""')}"`;
}

export function buildInquiriesCsv(
  inquiries: InquiryRecord[],
  locale: Locale = 'ar'
): string {
  const headers =
    locale === 'en'
      ? ['Reference', 'Name', 'Phone', 'Branch', 'Subject', 'Message', 'Status', 'Admin Notes', 'Created At']
      : ['المرجع', 'الاسم', 'رقم الهاتف', 'الفرع', 'الموضوع', 'الرسالة', 'الحالة', 'ملاحظات الإدارة', 'تاريخ الإرسال'];

  const rows = inquiries.map((item) => [
    item.referenceCode,
    item.name,
    item.phone,
    item.branchId,
    item.subject,
    item.message,
    item.status,
    item.adminNotes ?? '',
    item.createdAt,
  ]);

  const lines = [headers, ...rows].map((row) =>
    row.map((cell) => escapeCsvCell(String(cell))).join(',')
  );

  return `\uFEFF${lines.join('\n')}`;
}

export function validateReviewInput(
  input: {
    patientName?: string;
    branchId?: string;
    treatment?: string;
    rating?: number;
    comment?: string;
  },
  locale: Locale = 'ar'
): {
  valid: boolean;
  errors: Record<string, string>;
  branchId: BranchId;
  rating: number;
} {
  const errors: Record<string, string> = {};
  const branchId: BranchId =
    input.branchId === 'nasr-city' ? 'nasr-city' : 'fifth-settlement';
  const rating = Math.round(Number(input.rating ?? 0));

  const patientName = sanitizeTextField(
    input.patientName,
    REVIEW_LIMITS.patientNameMax
  );
  const treatment = sanitizeTextField(
    input.treatment,
    REVIEW_LIMITS.treatmentMax
  );
  const comment = sanitizeTextField(input.comment, REVIEW_LIMITS.commentMax);

  if (patientName.length < REVIEW_LIMITS.patientNameMin) {
    errors.patientName =
      locale === 'en'
        ? 'Please enter your name (at least 2 characters).'
        : 'يرجى إدخال اسمك (حرفين على الأقل).';
  }
  if (treatment.length < REVIEW_LIMITS.treatmentMin) {
    errors.treatment =
      locale === 'en'
        ? 'Please select or enter the treatment.'
        : 'يرجى اختيار أو كتابة الخدمة الطبية.';
  }
  if (
    !Number.isInteger(rating) ||
    rating < REVIEW_LIMITS.minRating ||
    rating > REVIEW_LIMITS.maxRating
  ) {
    errors.rating =
      locale === 'en'
        ? 'Please select a star rating between 1 and 5.'
        : 'يرجى اختيار التقييم من ١ إلى ٥ نجوم.';
  }
  if (comment.length < REVIEW_LIMITS.commentMin) {
    errors.comment =
      locale === 'en'
        ? 'Please share a brief review (at least 10 characters).'
        : 'يرجى كتابة تجربتك بشكل مختصر (١٠ أحرف على الأقل).';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    branchId,
    rating,
  };
}

export function computeReviewSummary(
  reviews: Pick<PatientReviewRecord, 'rating'>[]
): {
  count: number;
  average: number;
  distribution: Record<1 | 2 | 3 | 4 | 5, number>;
} {
  const distribution: Record<1 | 2 | 3 | 4 | 5, number> = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };

  if (reviews.length === 0) {
    return { count: 0, average: 0, distribution };
  }

  let total = 0;
  for (const r of reviews) {
    const clamped = Math.min(5, Math.max(1, Math.round(r.rating))) as
      | 1
      | 2
      | 3
      | 4
      | 5;
    distribution[clamped] += 1;
    total += clamped;
  }

  return {
    count: reviews.length,
    average: Number((total / reviews.length).toFixed(1)),
    distribution,
  };
}

export interface BranchLiveStatus {
  isOpen: boolean;
  isFriday: boolean;
  cairoHour: number;
  cairoMinute: number;
  labelAr: string;
  labelEn: string;
  sublabelAr: string;
  sublabelEn: string;
}

/**
 * Computes real-time clinic open/closed status using Cairo local time (Africa/Cairo).
 * Clinic operates Saturday–Thursday from openHour (12:00) to closeHour (21:00); Friday closed.
 */
export function getBranchLiveStatus(
  openHour = 12,
  closeHour = 21,
  nowDate: Date = new Date()
): BranchLiveStatus {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Africa/Cairo',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const parts = formatter.formatToParts(nowDate);
  const weekday = parts.find((p) => p.type === 'weekday')?.value ?? 'Sat';
  const rawHour = Number(parts.find((p) => p.type === 'hour')?.value ?? '12');
  const cairoHour = rawHour === 24 ? 0 : rawHour;
  const cairoMinute = Number(
    parts.find((p) => p.type === 'minute')?.value ?? '0'
  );

  const isFriday = weekday === 'Fri';
  const isOpen = !isFriday && cairoHour >= openHour && cairoHour < closeHour;

  if (isOpen) {
    return {
      isOpen: true,
      isFriday: false,
      cairoHour,
      cairoMinute,
      labelAr: 'مفتوح الآن',
      labelEn: 'Open Now',
      sublabelAr: 'نستقبل المرضى حتى ٩:٠٠ مساءً بتوقيت القاهرة',
      sublabelEn: 'Welcoming patients until 9:00 PM Cairo time',
    };
  }

  if (isFriday) {
    return {
      isOpen: false,
      isFriday: true,
      cairoHour,
      cairoMinute,
      labelAr: 'مغلق (عطلة الجمعة)',
      labelEn: 'Closed (Friday)',
      sublabelAr: 'يفتح غداً السبت الساعة ١٢:٠٠ ظهراً',
      sublabelEn: 'Reopens Saturday at 12:00 PM',
    };
  }

  if (cairoHour < openHour) {
    return {
      isOpen: false,
      isFriday: false,
      cairoHour,
      cairoMinute,
      labelAr: 'يفتح اليوم ١٢:٠٠ ظهراً',
      labelEn: 'Opens Today at 12:00 PM',
      sublabelAr: 'يمكنك حجز موعدك أونلاين على مدار الساعة',
      sublabelEn: 'Online appointment booking is available 24/7',
    };
  }

  return {
    isOpen: false,
    isFriday: false,
    cairoHour,
    cairoMinute,
    labelAr: 'مغلق الآن',
    labelEn: 'Closed Now',
    sublabelAr:
      weekday === 'Thu'
        ? 'يفتح السبت الساعة ١٢:٠٠ ظهراً'
        : 'يفتح غداً الساعة ١٢:٠٠ ظهراً',
    sublabelEn:
      weekday === 'Thu'
        ? 'Reopens Saturday at 12:00 PM'
        : 'Reopens tomorrow at 12:00 PM',
  };
}
