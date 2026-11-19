import { Locale } from './i18n';
import {
  BranchId,
  CLINIC_BRANCHES,
  DENTAL_SERVICES,
  DOCTORS,
} from './clinic-data';

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'completed'
  | 'cancelled'
  | 'no-show';

export type BookingSource = 'website' | 'admin-walkin';

export interface BookingRecord {
  id: string;
  referenceCode: string;
  slotId?: string;
  branchId: BranchId;
  serviceId: string;
  doctorId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  patientName: string;
  patientPhone: string;
  notes?: string;
  adminNotes?: string;
  status: BookingStatus;
  source?: BookingSource;
  createdAt: string;
  updatedAt?: string;
}

export interface WorkingDayOption {
  date: string; // YYYY-MM-DD
  weekdayLabelAr: string;
  weekdayLabelEn: string;
  displayLabelAr: string;
  displayLabelEn: string;
}

export interface TimeSlotOption {
  time: string; // "14:00"
  labelAr: string;
  labelEn: string;
  available: boolean;
}

export interface BookingValidationResult {
  valid: boolean;
  errors: Partial<
    Record<
      | 'branchId'
      | 'serviceId'
      | 'doctorId'
      | 'date'
      | 'time'
      | 'patientName'
      | 'patientPhone',
      string
    >
  >;
  normalizedPhone: string;
}

export interface AdminDashboardMetrics {
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  noShow: number;
  todayCount: number;
  fifthSettlementCount: number;
  nasrCityCount: number;
}

export interface AdminBookingFilters {
  search: string;
  branch: 'all' | BranchId;
  status: 'all' | BookingStatus;
  dateFilter: 'all' | 'today' | 'upcoming' | 'custom';
  customDate: string;
}

// Synchronized verbatim with firebase-blueprint.json constraints
export const BLUEPRINT_LIMITS = {
  patientNameMin: 3,
  patientNameMax: 120,
  notesMax: 500,
  adminNotesMax: 500,
  referenceCodePattern: /^NV-[0-9]{6}$/,
  datePattern: /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/,
  timePattern: /^[0-9]{2}:[0-9]{2}$/,
  phonePattern: /^01[0125][0-9]{8}$/,
  slotIdPattern:
    /^(fifth-settlement|nasr-city)_[0-9]{4}-[0-9]{2}-[0-9]{2}_[0-9]{2}-[0-9]{2}$/,
} as const;

const ARABIC_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

const ARABIC_WEEKDAYS = [
  'الأحد',
  'الإثنين',
  'الثلاثاء',
  'الأربعاء',
  'الخميس',
  'الجمعة',
  'السبت',
];

const ENGLISH_WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const ARABIC_MONTHS = [
  'يناير',
  'فبراير',
  'مارس',
  'أبريل',
  'مايو',
  'يونيو',
  'يوليو',
  'أغسطس',
  'سبتمبر',
  'أكتوبر',
  'نوفمبر',
  'ديسمبر',
];

const ENGLISH_MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export function normalizeArabicNumerals(input: string): string {
  return input.replace(/[٠-٩]/g, (char) => {
    const idx = ARABIC_DIGITS.indexOf(char);
    return idx >= 0 ? String(idx) : char;
  });
}

export function buildSlotId(
  branchId: BranchId,
  date: string,
  time: string
): string {
  return `${branchId}_${date}_${time.replace(':', '-')}`;
}

export function buildBranchDateKey(branchId: BranchId, date: string): string {
  return `${branchId}_${date}`;
}

export function getTodayIsoDate(referenceDate: Date = new Date()): string {
  const year = referenceDate.getFullYear();
  const month = String(referenceDate.getMonth() + 1).padStart(2, '0');
  const day = String(referenceDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function validateEgyptianPhone(
  rawPhone: string,
  locale: Locale = 'ar'
): {
  valid: boolean;
  normalized: string;
  error?: string;
} {
  const cleaned = normalizeArabicNumerals(rawPhone)
    .replace(/[\s\-()]/g, '')
    .trim();

  if (!cleaned) {
    return {
      valid: false,
      normalized: '',
      error:
        locale === 'en'
          ? 'Please enter your mobile phone number.'
          : 'يرجى إدخال رقم الهاتف المحمول.',
    };
  }

  let normalized = cleaned;
  if (normalized.startsWith('+20')) {
    normalized = '0' + normalized.slice(3);
  } else if (normalized.startsWith('0020')) {
    normalized = '0' + normalized.slice(4);
  } else if (normalized.startsWith('20') && normalized.length === 12) {
    normalized = '0' + normalized.slice(2);
  }

  if (!BLUEPRINT_LIMITS.phonePattern.test(normalized)) {
    return {
      valid: false,
      normalized,
      error:
        locale === 'en'
          ? 'Please enter a valid 11-digit Egyptian mobile number (starting with 010, 011, 012, or 015).'
          : 'رقم الهاتف يجب أن يكون مصرياً صحيحاً مكوناً من ١١ رقماً (يبدأ بـ 010 أو 011 أو 012 أو 015).',
    };
  }

  return { valid: true, normalized };
}

export function formatTimeArabic(time24: string): string {
  const [hourStr, minuteStr] = time24.split(':');
  const hourNum = Number(hourStr);
  const minute = minuteStr || '00';
  if (Number.isNaN(hourNum)) return time24;

  const period = hourNum >= 12 ? 'م' : 'ص';
  const hour12 = hourNum % 12 === 0 ? 12 : hourNum % 12;
  const paddedHour = hour12 < 10 ? `0${hour12}` : `${hour12}`;
  return `${paddedHour}:${minute} ${period}`;
}

export function formatTimeEnglish(time24: string): string {
  const [hourStr, minuteStr] = time24.split(':');
  const hourNum = Number(hourStr);
  const minute = minuteStr || '00';
  if (Number.isNaN(hourNum)) return time24;

  const period = hourNum >= 12 ? 'PM' : 'AM';
  const hour12 = hourNum % 12 === 0 ? 12 : hourNum % 12;
  const paddedHour = hour12 < 10 ? `0${hour12}` : `${hour12}`;
  return `${paddedHour}:${minute} ${period}`;
}

export function formatTimeLocalized(time24: string, locale: Locale): string {
  return locale === 'en' ? formatTimeEnglish(time24) : formatTimeArabic(time24);
}

export function isBranchOpenOnDate(dateIso: string): boolean {
  const parsed = new Date(`${dateIso}T12:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return false;
  return parsed.getUTCDay() !== 5;
}

export function getUpcomingWorkingDays(
  count = 8,
  referenceDate: Date = new Date()
): WorkingDayOption[] {
  const days: WorkingDayOption[] = [];
  const cursor = new Date(
    Date.UTC(
      referenceDate.getUTCFullYear(),
      referenceDate.getUTCMonth(),
      referenceDate.getUTCDate()
    )
  );

  let guard = 0;
  while (days.length < count && guard < 30) {
    const year = cursor.getUTCFullYear();
    const month = String(cursor.getUTCMonth() + 1).padStart(2, '0');
    const day = String(cursor.getUTCDate()).padStart(2, '0');
    const iso = `${year}-${month}-${day}`;
    const dayOfWeek = cursor.getUTCDay();

    if (dayOfWeek !== 5) {
      const weekdayLabelAr =
        guard === 0
          ? 'اليوم'
          : guard === 1
            ? 'غداً'
            : ARABIC_WEEKDAYS[dayOfWeek];
      const weekdayLabelEn =
        guard === 0
          ? 'Today'
          : guard === 1
            ? 'Tomorrow'
            : ENGLISH_WEEKDAYS[dayOfWeek];
      const displayLabelAr = `${cursor.getUTCDate()} ${ARABIC_MONTHS[cursor.getUTCMonth()]}`;
      const displayLabelEn = `${ENGLISH_MONTHS[cursor.getUTCMonth()]} ${cursor.getUTCDate()}`;

      days.push({
        date: iso,
        weekdayLabelAr,
        weekdayLabelEn,
        displayLabelAr,
        displayLabelEn,
      });
    }

    cursor.setUTCDate(cursor.getUTCDate() + 1);
    guard += 1;
  }

  return days;
}

export function getAvailableSlotsFromBookedTimes(params: {
  branchId: BranchId;
  date: string;
  bookedTimes: Iterable<string>;
}): TimeSlotOption[] {
  const branch = CLINIC_BRANCHES.find((b) => b.id === params.branchId);
  if (!branch || !isBranchOpenOnDate(params.date)) {
    return [];
  }

  const bookedSet = new Set(params.bookedTimes);
  const slots: TimeSlotOption[] = [];

  for (let hour = branch.openHour; hour <= branch.closeHour; hour += 1) {
    const time = `${String(hour).padStart(2, '0')}:00`;
    slots.push({
      time,
      labelAr: formatTimeArabic(time),
      labelEn: formatTimeEnglish(time),
      available: !bookedSet.has(time),
    });
  }

  return slots;
}

export function getAvailableSlots(params: {
  branchId: BranchId;
  date: string;
  doctorId: string;
  existingBookings: BookingRecord[];
}): TimeSlotOption[] {
  const bookedTimes = params.existingBookings
    .filter(
      (b) =>
        (b.status === 'confirmed' || b.status === 'pending') &&
        b.branchId === params.branchId &&
        b.date === params.date &&
        (params.doctorId === 'any' || b.doctorId === params.doctorId)
    )
    .map((b) => b.time);

  return getAvailableSlotsFromBookedTimes({
    branchId: params.branchId,
    date: params.date,
    bookedTimes,
  });
}

export function sanitizeTextField(raw: string | undefined, maxLen: number): string {
  return (raw ?? '').trim().slice(0, maxLen);
}

export function validateBookingInput(
  input: {
    branchId?: string;
    serviceId?: string;
    doctorId?: string;
    date?: string;
    time?: string;
    patientName?: string;
    patientPhone?: string;
  },
  locale: Locale = 'ar'
): BookingValidationResult {
  const errors: BookingValidationResult['errors'] = {};

  const branchValid = CLINIC_BRANCHES.some((b) => b.id === input.branchId);
  if (!branchValid) {
    errors.branchId =
      locale === 'en'
        ? 'Please select the clinic location.'
        : 'يرجى اختيار مقر العيادة.';
  }

  const serviceValid = DENTAL_SERVICES.some((s) => s.id === input.serviceId);
  if (!serviceValid) {
    errors.serviceId =
      locale === 'en'
        ? 'Please select a dental service.'
        : 'يرجى اختيار الخدمة الطبية.';
  }

  const doctorValid =
    input.doctorId === 'any' || DOCTORS.some((d) => d.id === input.doctorId);
  if (!doctorValid) {
    errors.doctorId =
      locale === 'en'
        ? 'Please select a specialist.'
        : 'يرجى اختيار الطبيب المختص.';
  }

  if (!input.date || !BLUEPRINT_LIMITS.datePattern.test(input.date)) {
    errors.date =
      locale === 'en'
        ? 'Please select an appointment date.'
        : 'يرجى اختيار تاريخ الموعد.';
  } else if (!isBranchOpenOnDate(input.date)) {
    errors.date =
      locale === 'en'
        ? 'Please select another day (Fridays are unavailable).'
        : 'يرجى اختيار يوم آخر متاح (الجمعة إجازة).';
  }

  if (!input.time || !BLUEPRINT_LIMITS.timePattern.test(input.time)) {
    errors.time =
      locale === 'en'
        ? 'Please choose a time slot.'
        : 'يرجى اختيار الساعة المناسبة.';
  }

  const trimmedName = (input.patientName || '').trim();
  if (trimmedName.length < BLUEPRINT_LIMITS.patientNameMin) {
    errors.patientName =
      locale === 'en'
        ? 'Please enter your full name (at least 3 characters).'
        : 'يرجى إدخال الاسم الكامل (٣ أحرف على الأقل).';
  } else if (trimmedName.length > BLUEPRINT_LIMITS.patientNameMax) {
    errors.patientName =
      locale === 'en'
        ? 'Name is too long (maximum 120 characters).'
        : 'الاسم طويل جداً (الحد الأقصى ١٢٠ حرفاً).';
  }

  const phoneCheck = validateEgyptianPhone(input.patientPhone || '', locale);
  if (!phoneCheck.valid) {
    errors.patientPhone = phoneCheck.error;
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    normalizedPhone: phoneCheck.normalized,
  };
}

export function formatBookingReference(seed?: number): string {
  const value =
    typeof seed === 'number'
      ? (Math.abs(Math.floor(seed)) % 900000) + 100000
      : Math.floor(100000 + Math.random() * 900000);
  return `NV-${value}`;
}

export function isStatusOccupyingSlot(status: BookingStatus): boolean {
  return status === 'pending' || status === 'confirmed' || status === 'completed';
}

export function computeDashboardMetrics(
  bookings: BookingRecord[],
  todayIso: string
): AdminDashboardMetrics {
  const metrics: AdminDashboardMetrics = {
    total: bookings.length,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
    noShow: 0,
    todayCount: 0,
    fifthSettlementCount: 0,
    nasrCityCount: 0,
  };

  for (const booking of bookings) {
    if (booking.status === 'pending') metrics.pending += 1;
    else if (booking.status === 'confirmed') metrics.confirmed += 1;
    else if (booking.status === 'completed') metrics.completed += 1;
    else if (booking.status === 'cancelled') metrics.cancelled += 1;
    else if (booking.status === 'no-show') metrics.noShow += 1;

    if (
      booking.date === todayIso &&
      booking.status !== 'cancelled' &&
      booking.status !== 'no-show'
    ) {
      metrics.todayCount += 1;
    }

    if (booking.branchId === 'fifth-settlement') {
      metrics.fifthSettlementCount += 1;
    } else if (booking.branchId === 'nasr-city') {
      metrics.nasrCityCount += 1;
    }
  }

  return metrics;
}

export function filterAdminBookings(
  bookings: BookingRecord[],
  filters: AdminBookingFilters,
  todayIso: string
): BookingRecord[] {
  const normalizedQuery = normalizeArabicNumerals(filters.search)
    .trim()
    .toLowerCase();

  return bookings.filter((item) => {
    if (filters.branch !== 'all' && item.branchId !== filters.branch) {
      return false;
    }

    if (filters.status !== 'all' && item.status !== filters.status) {
      return false;
    }

    if (filters.dateFilter === 'today' && item.date !== todayIso) {
      return false;
    }
    if (filters.dateFilter === 'upcoming' && item.date < todayIso) {
      return false;
    }
    if (
      filters.dateFilter === 'custom' &&
      filters.customDate &&
      item.date !== filters.customDate
    ) {
      return false;
    }

    if (normalizedQuery) {
      const haystack = [
        item.referenceCode,
        item.patientName,
        item.patientPhone,
        item.notes ?? '',
        item.adminNotes ?? '',
      ]
        .join(' ')
        .toLowerCase();

      if (!haystack.includes(normalizedQuery)) {
        return false;
      }
    }

    return true;
  });
}

function escapeCsvCell(value: string): string {
  const str = String(value ?? '');
  const safe = /^[=+\-@\t\r]/.test(str) ? `'${str}` : str;
  if (/[",\n\r]/.test(safe)) {
    return `"${safe.replace(/"/g, '""')}"`;
  }
  return safe;
}

export function buildBookingsCsv(
  bookings: BookingRecord[],
  locale: Locale = 'ar'
): string {
  const headers =
    locale === 'en'
      ? [
          'Reference',
          'Status',
          'Branch',
          'Service',
          'Date',
          'Time',
          'Patient Name',
          'Phone',
          'Source',
          'Patient Notes',
          'Admin Notes',
        ]
      : [
          'رقم المرجع',
          'الحالة',
          'الفرع',
          'الخدمة',
          'التاريخ',
          'الساعة',
          'اسم المريض',
          'رقم الهاتف',
          'المصدر',
          'ملاحظات المريض',
          'ملاحظات الاستقبال',
        ];

  const rows = bookings.map((b) => {
    const branch = CLINIC_BRANCHES.find((br) => br.id === b.branchId);
    const service = DENTAL_SERVICES.find((s) => s.id === b.serviceId);
    return [
      b.referenceCode,
      b.status,
      branch ? (locale === 'en' ? branch.nameEn : branch.nameAr) : b.branchId,
      service ? (locale === 'en' ? service.titleEn : service.titleAr) : b.serviceId,
      b.date,
      b.time,
      b.patientName,
      b.patientPhone,
      b.source ?? 'website',
      b.notes ?? '',
      b.adminNotes ?? '',
    ]
      .map(escapeCsvCell)
      .join(',');
  });

  return '\uFEFF' + [headers.map(escapeCsvCell).join(','), ...rows].join('\r\n');
}

export function buildPatientWhatsAppReplyUrl(
  booking: BookingRecord,
  locale: Locale = 'ar'
): string {
  const phoneCheck = validateEgyptianPhone(booking.patientPhone, locale);
  const intlPhone = phoneCheck.normalized
    ? `2${phoneCheck.normalized}`
    : booking.patientPhone.replace(/\D/g, '');
  const branch = CLINIC_BRANCHES.find((b) => b.id === booking.branchId);
  const service = DENTAL_SERVICES.find((s) => s.id === booking.serviceId);
  const branchLabel = branch
    ? locale === 'en'
      ? branch.nameEn
      : branch.nameAr
    : booking.branchId;
  const serviceLabel = service
    ? locale === 'en'
      ? service.titleEn
      : service.titleAr
    : booking.serviceId;
  const timeLabel = formatTimeLocalized(booking.time, locale);

  const message =
    locale === 'en'
      ? `Hello ${booking.patientName}, this is NOVA Dental Clinic confirming your appointment (${booking.referenceCode}) for ${serviceLabel} at ${branchLabel} on ${booking.date} at ${timeLabel}.`
      : `أهلاً ${booking.patientName}، معك فريق الاستقبال في عيادة نوفا لطب الأسنان (NOVA Dental Clinic). نؤكد لك حجزك رقم ${booking.referenceCode} لخدمة ${serviceLabel} في ${branchLabel} يوم ${booking.date} الساعة ${timeLabel}. يسعدنا استقبالك!`;

  return `https://wa.me/${intlPhone}?text=${encodeURIComponent(message)}`;
}
