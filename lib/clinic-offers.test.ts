import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildAppointmentIcsContent,
  buildGoogleCalendarUrl,
  computeClinicAnalytics,
  DEFAULT_CLINIC_OFFERS,
  isOfferExpired,
  validateOfferInput,
} from './clinic-offers';
import { BookingRecord } from './booking-logic';
import { InquiryRecord, PatientReviewRecord } from './clinic-engagement';

test('validateOfferInput accepts valid offer and rejects invalid fields', () => {
  const valid = validateOfferInput(
    {
      titleAr: 'باقة تبييض الليزر الشاملة',
      titleEn: 'Complete Laser Whitening Package',
      badgeAr: 'عرض خاص',
      badgeEn: 'Special',
      descriptionAr: 'تنظيف جير شامل مع جلسة تبييض ليزر وحماية اللثة في زيارة واحدة.',
      descriptionEn: 'Deep scaling paired with laser whitening and gum protection in one visit.',
      priceLabelAr: 'خصم 20% عند الحجز الإلكتروني',
      priceLabelEn: '20% Off Online Booking',
      serviceId: 'laser-whitening',
      branchId: 'all',
      validUntil: '2026-12-31',
      active: true,
      featured: true,
    },
    'ar'
  );
  assert.equal(valid.valid, true);
  assert.deepEqual(valid.errors, {});

  const invalid = validateOfferInput(
    {
      titleAr: 'أ',
      titleEn: '',
      badgeAr: 'x',
      badgeEn: '',
      descriptionAr: 'قصير',
      descriptionEn: 'short',
      priceLabelAr: '1',
      priceLabelEn: '',
      serviceId: 'unknown-service',
      branchId: 'all',
      validUntil: 'invalid-date',
      active: true,
      featured: false,
    },
    'en'
  );
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.titleAr);
  assert.ok(invalid.errors.serviceId);
  assert.ok(invalid.errors.validUntil);
});

test('isOfferExpired evaluates YYYY-MM-DD expiry accurately', () => {
  assert.equal(isOfferExpired('2026-05-01', '2026-05-02'), true);
  assert.equal(isOfferExpired('2026-05-02', '2026-05-02'), false);
  assert.equal(isOfferExpired('2026-12-31', '2026-05-02'), false);
  assert.ok(DEFAULT_CLINIC_OFFERS.length >= 3);
});

test('buildAppointmentIcsContent and buildGoogleCalendarUrl generate valid Cairo calendar exports', () => {
  const booking = {
    referenceCode: 'NV-482910',
    branchId: 'fifth-settlement' as const,
    serviceId: 'veneers-dsd',
    date: '2026-11-22',
    time: '14:00',
    patientName: 'كريم أحمد',
  };

  const ics = buildAppointmentIcsContent(booking, 'ar');
  assert.ok(ics.includes('BEGIN:VCALENDAR'));
  assert.ok(ics.includes('UID:NV-482910@novadental.eg'));
  assert.ok(ics.includes('DTSTART;TZID=Africa/Cairo:20261122T140000'));
  assert.ok(ics.includes('END:VCALENDAR'));

  const gcal = buildGoogleCalendarUrl(booking, 'en');
  assert.ok(gcal.startsWith('https://calendar.google.com/calendar/render?'));
  assert.ok(gcal.includes('ctz=Africa%2FCairo'));
  assert.ok(gcal.includes('NV-482910'));
});

test('computeClinicAnalytics calculates KPIs, branch split, service demand, and 7-day load', () => {
  const bookings: BookingRecord[] = [
    {
      id: 'b1',
      referenceCode: 'NV-100001',
      branchId: 'fifth-settlement',
      serviceId: 'veneers-dsd',
      doctorId: 'any',
      date: '2026-11-20',
      time: '13:00',
      patientName: 'Ahmed Ali',
      patientPhone: '01012345678',
      notes: '',
      status: 'confirmed',
      createdAt: '2026-11-19T10:00:00Z',
    },
    {
      id: 'b2',
      referenceCode: 'NV-100002',
      branchId: 'nasr-city',
      serviceId: 'veneers-dsd',
      doctorId: 'any',
      date: '2026-11-21',
      time: '15:00',
      patientName: 'Sara Hassan',
      patientPhone: '01112345678',
      notes: '',
      status: 'completed',
      createdAt: '2026-11-19T11:00:00Z',
    },
    {
      id: 'b3',
      referenceCode: 'NV-100003',
      branchId: 'fifth-settlement',
      serviceId: 'laser-whitening',
      doctorId: 'any',
      date: '2026-11-20',
      time: '16:00',
      patientName: 'Mona Said',
      patientPhone: '01212345678',
      notes: '',
      status: 'cancelled',
      createdAt: '2026-11-19T12:00:00Z',
    },
  ];

  const inquiries: InquiryRecord[] = [
    {
      id: 'i1',
      referenceCode: 'INQ-100001',
      branchId: 'fifth-settlement',
      name: 'Nour',
      phone: '01099998888',
      subject: 'Question',
      message: 'Need pricing details',
      status: 'replied',
      createdAt: '2026-11-19T10:00:00Z',
    },
    {
      id: 'i2',
      referenceCode: 'INQ-100002',
      branchId: 'general',
      name: 'Omar',
      phone: '01099997777',
      subject: 'Timing',
      message: 'Are you open Saturday?',
      status: 'new',
      createdAt: '2026-11-19T11:00:00Z',
    },
  ];

  const reviews: PatientReviewRecord[] = [
    {
      id: 'r1',
      patientName: 'Heba',
      branchId: 'fifth-settlement',
      treatment: 'Veneers',
      rating: 5,
      comment: 'Wonderful clinic and spotless hygiene!',
      status: 'approved',
      featured: true,
      createdAt: '2026-11-19T10:00:00Z',
    },
    {
      id: 'r2',
      patientName: 'Tarek',
      branchId: 'nasr-city',
      treatment: 'Implants',
      rating: 4,
      comment: 'Very professional medical team.',
      status: 'approved',
      featured: false,
      createdAt: '2026-11-19T11:00:00Z',
    },
  ];

  const summary = computeClinicAnalytics(bookings, inquiries, reviews, '2026-11-20');
  assert.equal(summary.totalBookings, 3);
  assert.equal(summary.confirmationRatePercent, 67);
  assert.equal(summary.completionRatePercent, 33);
  assert.equal(summary.cancellationRatePercent, 33);
  assert.equal(summary.inquiryReplyRatePercent, 50);
  assert.equal(summary.averageApprovedRating, 4.5);
  assert.equal(summary.branchSplit.fifthSettlement, 2);
  assert.equal(summary.branchSplit.nasrCity, 1);
  assert.equal(summary.serviceDemand[0].serviceId, 'veneers-dsd');
  assert.equal(summary.serviceDemand[0].count, 2);
  assert.equal(summary.nextSevenDaysLoad.length, 7);
  assert.equal(summary.nextSevenDaysLoad[0].date, '2026-11-20');
  assert.equal(summary.nextSevenDaysLoad[0].count, 1); // cancelled excluded
  assert.equal(summary.nextSevenDaysLoad[1].count, 1);
});
