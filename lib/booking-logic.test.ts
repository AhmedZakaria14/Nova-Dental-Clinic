import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatBookingReference,
  formatTimeLocalized,
  getAvailableSlots,
  getUpcomingWorkingDays,
  isBranchOpenOnDate,
  normalizeArabicNumerals,
  validateBookingInput,
  validateEgyptianPhone,
  type BookingRecord,
} from './booking-logic';

test('normalizeArabicNumerals converts Arabic-Indic digits to ASCII digits', () => {
  assert.equal(normalizeArabicNumerals('٠١٠٣١٢٣٥٥٦٢'), '01031235562');
  assert.equal(normalizeArabicNumerals('015-5527-7054'), '015-5527-7054');
});

test('validateEgyptianPhone accepts valid prefixes and formats, rejects invalid numbers in both locales', () => {
  const validMobile = validateEgyptianPhone('01031235562', 'ar');
  assert.equal(validMobile.valid, true);
  assert.equal(validMobile.normalized, '01031235562');

  const validArabicDigits = validateEgyptianPhone('٠١٥٥٥٢٧٧٠٥٤', 'ar');
  assert.equal(validArabicDigits.valid, true);
  assert.equal(validArabicDigits.normalized, '01555277054');

  const validWithCountryCode = validateEgyptianPhone('+20 10 3123 5562', 'en');
  assert.equal(validWithCountryCode.valid, true);
  assert.equal(validWithCountryCode.normalized, '01031235562');

  const invalidEn = validateEgyptianPhone('1234', 'en');
  assert.equal(invalidEn.valid, false);
  assert.match(invalidEn.error ?? '', /11-digit Egyptian mobile/);
});

test('getUpcomingWorkingDays skips Fridays and returns bilingual labels', () => {
  const thursday = new Date(Date.UTC(2026, 10, 19));
  const days = getUpcomingWorkingDays(4, thursday);
  assert.equal(days.length, 4);
  assert.equal(days[0].date, '2026-11-19');
  assert.equal(days[0].weekdayLabelEn, 'Today');
  assert.equal(days[1].date, '2026-11-21');
  assert.equal(isBranchOpenOnDate('2026-11-20'), false);
  assert.equal(isBranchOpenOnDate('2026-11-21'), true);
});

test('getAvailableSlots marks confirmed bookings unavailable and formats AR/EN times', () => {
  const existing: BookingRecord[] = [
    {
      id: 'b-1',
      referenceCode: 'NV-100001',
      branchId: 'fifth-settlement',
      serviceId: 'veneers-dsd',
      doctorId: 'nova-specialist',
      date: '2026-11-21',
      time: '14:00',
      patientName: 'سارة محمود',
      patientPhone: '01031235562',
      status: 'confirmed',
      createdAt: '2026-11-18T10:00:00.000Z',
    },
    {
      id: 'b-2',
      referenceCode: 'NV-100002',
      branchId: 'fifth-settlement',
      serviceId: 'veneers-dsd',
      doctorId: 'nova-specialist',
      date: '2026-11-21',
      time: '16:00',
      patientName: 'أحمد علي',
      patientPhone: '01555277054',
      status: 'cancelled',
      createdAt: '2026-11-18T10:00:00.000Z',
    },
  ];

  const slots = getAvailableSlots({
    branchId: 'fifth-settlement',
    date: '2026-11-21',
    doctorId: 'nova-specialist',
    existingBookings: existing,
  });

  assert.equal(slots[0].time, '12:00');
  assert.equal(slots.find((s) => s.time === '14:00')?.available, false);
  assert.equal(slots.find((s) => s.time === '16:00')?.available, true);
  assert.equal(formatTimeLocalized('14:00', 'ar'), '02:00 م');
  assert.equal(formatTimeLocalized('14:00', 'en'), '02:00 PM');
});

test('validateBookingInput validates required fields in AR and EN', () => {
  const badResult = validateBookingInput(
    {
      branchId: 'fifth-settlement',
      serviceId: 'veneers-dsd',
      doctorId: 'nova-specialist',
      date: '2026-11-20',
      time: '14:00',
      patientName: 'م',
      patientPhone: '123',
    },
    'en'
  );

  assert.equal(badResult.valid, false);
  assert.ok(badResult.errors.date);
  assert.ok(badResult.errors.patientName);
  assert.ok(badResult.errors.patientPhone);

  const okResult = validateBookingInput(
    {
      branchId: 'fifth-settlement',
      serviceId: 'clear-aligners',
      doctorId: 'nova-specialist',
      date: '2026-11-21',
      time: '15:00',
      patientName: 'ياسمين محمد',
      patientPhone: '01031235562',
    },
    'ar'
  );
  assert.equal(okResult.valid, true);
  assert.equal(okResult.normalizedPhone, '01031235562');

  const nasrCityOk = validateBookingInput(
    {
      branchId: 'nasr-city',
      serviceId: 'clear-aligners',
      doctorId: 'nova-specialist',
      date: '2026-11-21',
      time: '14:00',
      patientName: 'طارق حسن',
      patientPhone: '01555277054',
    },
    'ar'
  );
  assert.equal(nasrCityOk.valid, true);
});

test('getAvailableSlots tracks Fifth Settlement and Nasr City branch availability independently', () => {
  const existing: BookingRecord[] = [
    {
      id: 'b-fs',
      referenceCode: 'NV-100009',
      branchId: 'fifth-settlement',
      serviceId: 'veneers-dsd',
      doctorId: 'nova-specialist',
      date: '2026-11-21',
      time: '14:00',
      patientName: 'هدير سامي',
      patientPhone: '01031235562',
      status: 'confirmed',
      createdAt: '2026-11-18T10:00:00.000Z',
    },
  ];

  const nasrSlots = getAvailableSlots({
    branchId: 'nasr-city',
    date: '2026-11-21',
    doctorId: 'nova-specialist',
    existingBookings: existing,
  });

  assert.equal(nasrSlots.find((s) => s.time === '14:00')?.available, true);
});

test('formatBookingReference returns NV-prefixed code', () => {
  assert.equal(formatBookingReference(42), 'NV-100042');
  assert.match(formatBookingReference(), /^NV-\d{6}$/);
});
