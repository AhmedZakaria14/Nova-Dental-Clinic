import { Locale } from './i18n';
import { BranchId, CLINIC_BRANCHES, DENTAL_SERVICES, DOCTORS } from './clinic-data';

export interface BookingRecord {
  id: string;
  referenceCode: string;
  branchId: BranchId;
  serviceId: string;
  doctorId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  patientName: string;
  patientPhone: string;
  notes?: string;
  status: 'confirmed' | 'cancelled';
  createdAt: string;
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
      'branchId' | 'serviceId' | 'doctorId' | 'date' | 'time' | 'patientName' | 'patientPhone',
      string
    >
  >;
  normalizedPhone: string;
}

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

  if (!/^01[0125]\d{8}$/.test(normalized)) {
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
        guard === 0 ? 'اليوم' : guard === 1 ? 'غداً' : ARABIC_WEEKDAYS[dayOfWeek];
      const weekdayLabelEn =
        guard === 0 ? 'Today' : guard === 1 ? 'Tomorrow' : ENGLISH_WEEKDAYS[dayOfWeek];
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

export function getAvailableSlots(params: {
  branchId: BranchId;
  date: string;
  doctorId: string;
  existingBookings: BookingRecord[];
}): TimeSlotOption[] {
  const branch = CLINIC_BRANCHES.find((b) => b.id === params.branchId);
  if (!branch || !isBranchOpenOnDate(params.date)) {
    return [];
  }

  const bookedTimes = new Set(
    params.existingBookings
      .filter(
        (b) =>
          b.status === 'confirmed' &&
          b.branchId === params.branchId &&
          b.date === params.date &&
          (params.doctorId === 'any' || b.doctorId === params.doctorId)
      )
      .map((b) => b.time)
  );

  const slots: TimeSlotOption[] = [];
  for (let hour = branch.openHour; hour <= branch.closeHour; hour += 1) {
    const time = `${String(hour).padStart(2, '0')}:00`;
    slots.push({
      time,
      labelAr: formatTimeArabic(time),
      labelEn: formatTimeEnglish(time),
      available: !bookedTimes.has(time),
    });
  }

  return slots;
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
      locale === 'en' ? 'Please select the clinic location.' : 'يرجى اختيار مقر العيادة.';
  }

  const serviceValid = DENTAL_SERVICES.some((s) => s.id === input.serviceId);
  if (!serviceValid) {
    errors.serviceId =
      locale === 'en' ? 'Please select a dental service.' : 'يرجى اختيار الخدمة الطبية.';
  }

  const doctorValid =
    input.doctorId === 'any' || DOCTORS.some((d) => d.id === input.doctorId);
  if (!doctorValid) {
    errors.doctorId =
      locale === 'en' ? 'Please select a specialist.' : 'يرجى اختيار الطبيب المختص.';
  }

  if (!input.date || !/^\d{4}-\d{2}-\d{2}$/.test(input.date)) {
    errors.date =
      locale === 'en' ? 'Please select an appointment date.' : 'يرجى اختيار تاريخ الموعد.';
  } else if (!isBranchOpenOnDate(input.date)) {
    errors.date =
      locale === 'en'
        ? 'Please select another day (Fridays are unavailable).'
        : 'يرجى اختيار يوم آخر متاح.';
  }

  if (!input.time || !/^\d{2}:\d{2}$/.test(input.time)) {
    errors.time =
      locale === 'en' ? 'Please choose a time slot.' : 'يرجى اختيار الساعة المناسبة.';
  }

  const trimmedName = (input.patientName || '').trim();
  if (trimmedName.length < 3) {
    errors.patientName =
      locale === 'en'
        ? 'Please enter your full name (at least 3 characters).'
        : 'يرجى إدخال الاسم الكامل (٣ أحرف على الأقل).';
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
