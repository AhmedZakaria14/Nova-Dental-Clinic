'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Calendar,
  CalendarCheck,
  CalendarPlus,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  ListChecks,
  MapPin,
  MessageCircle,
  Phone,
  UserRound,
  X,
} from 'lucide-react';
import { CLINIC_INFO } from '@/lib/clinic-config';
import {
  BranchId,
  CLINIC_BRANCHES,
  DENTAL_SERVICES,
  DOCTORS,
} from '@/lib/clinic-data';
import {
  BLUEPRINT_LIMITS,
  BookingRecord,
  formatTimeLocalized,
  getAvailableSlotsFromBookedTimes,
  getUpcomingWorkingDays,
} from '@/lib/booking-logic';
import {
  buildAppointmentIcsContent,
  buildGoogleCalendarUrl,
} from '@/lib/clinic-offers';
import {
  BookingValidationError,
  createFirestoreBooking,
  SlotAlreadyBookedError,
  subscribeBookedTimesForBranchDate,
} from '@/lib/firestore-bookings';
import { useLanguage } from '@/components/LanguageProvider';
import FirebaseErrorBoundary from '@/components/FirebaseErrorBoundary';

const STORAGE_KEY = 'nova_dental_my_bookings_v1';

function AppointmentFormContent() {
  const { locale, t } = useLanguage();
  const searchParams = useSearchParams();

  const workingDays = useMemo(() => getUpcomingWorkingDays(8), []);

  const queryServiceId = searchParams.get('service');
  const queryDoctorId = searchParams.get('doctor');
  const queryBranchId = searchParams.get('branch');

  const initialBranch: BranchId = useMemo(() => {
    if (
      queryBranchId &&
      CLINIC_BRANCHES.some((b) => b.id === queryBranchId)
    ) {
      return queryBranchId as BranchId;
    }
    return CLINIC_BRANCHES[0].id;
  }, [queryBranchId]);

  const initialService = useMemo(() => {
    if (queryServiceId && DENTAL_SERVICES.some((s) => s.id === queryServiceId)) {
      return queryServiceId;
    }
    return DENTAL_SERVICES[0].id;
  }, [queryServiceId]);

  const initialDoctor = useMemo(() => {
    if (
      queryDoctorId &&
      (queryDoctorId === 'any' || DOCTORS.some((d) => d.id === queryDoctorId))
    ) {
      return queryDoctorId;
    }
    return 'any';
  }, [queryDoctorId]);

  const [branchId, setBranchId] = useState<BranchId>(initialBranch);
  const [serviceId, setServiceId] = useState(initialService);
  const [doctorId, setDoctorId] = useState(initialDoctor);
  const [date, setDate] = useState(() => workingDays[0]?.date ?? '');
  const [selectedTime, setSelectedTime] = useState('');
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [notes, setNotes] = useState('');

  const [bookedTimes, setBookedTimes] = useState<string[]>([]);
  const [loadedSlotKey, setLoadedSlotKey] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmedBooking, setConfirmedBooking] =
    useState<BookingRecord | null>(null);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [myBookings, setMyBookings] = useState<BookingRecord[]>([]);
  const [copiedRef, setCopiedRef] = useState(false);

  const handleDownloadIcs = (booking: BookingRecord) => {
    const ics = buildAppointmentIcsContent(booking, locale);
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `nova-dental-${booking.referenceCode}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyReference = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedRef(true);
      window.setTimeout(() => setCopiedRef(false), 2200);
    } catch {
      // Clipboard unavailable in restricted iframe
    }
  };

  // Hydrate patient's local booking receipt history asynchronously
  useEffect(() => {
    let active = true;
    async function loadSaved() {
      await Promise.resolve();
      if (!active) return;
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            setMyBookings(parsed);
          }
        }
      } catch {
        // ignore invalid storage payload
      }
    }
    void loadSaved();
    return () => {
      active = false;
    };
  }, []);

  const currentSlotKey = `${branchId}_${date}`;
  const loadingSlots = Boolean(date) && loadedSlotKey !== currentSlotKey;

  // Subscribe in real time to public non-PII slot availability in Firestore
  useEffect(() => {
    if (!date) return;
    let active = true;
    const key = `${branchId}_${date}`;

    const unsubscribe = subscribeBookedTimesForBranchDate(
      branchId,
      date,
      (times) => {
        if (!active) return;
        setBookedTimes(times);
        setLoadedSlotKey(key);
      },
      () => {
        if (!active) return;
        setBookedTimes([]);
        setLoadedSlotKey(key);
      }
    );

    return () => {
      active = false;
      unsubscribe();
    };
  }, [branchId, date]);

  const slots = useMemo(
    () =>
      getAvailableSlotsFromBookedTimes({
        branchId,
        date,
        bookedTimes,
      }),
    [branchId, date, bookedTimes]
  );

  const effectiveTime = useMemo(() => {
    const selectedIsAvailable = slots.some(
      (s) => s.time === selectedTime && s.available
    );
    if (selectedIsAvailable) return selectedTime;
    return slots.find((s) => s.available)?.time ?? '';
  }, [slots, selectedTime]);

  const selectedServiceObj =
    DENTAL_SERVICES.find((s) => s.id === serviceId) ?? DENTAL_SERVICES[0];
  const selectedDoctorObj = DOCTORS.find((d) => d.id === doctorId);
  const selectedDayObj = workingDays.find((d) => d.date === date);
  const branch =
    CLINIC_BRANCHES.find((b) => b.id === branchId) ?? CLINIC_BRANCHES[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    try {
      const created = await createFirestoreBooking({
        locale,
        branchId,
        serviceId,
        doctorId,
        date,
        time: effectiveTime,
        patientName,
        patientPhone,
        notes,
        source: 'website',
      });

      setConfirmedBooking(created);

      setMyBookings((prev) => {
        const next = [created, ...prev.filter((b) => b.id !== created.id)];
        try {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          // ignore storage quota errors
        }
        return next;
      });

      setPatientName('');
      setPatientPhone('');
      setNotes('');
    } catch (err) {
      if (err instanceof BookingValidationError) {
        setErrors(err.errors);
      } else if (err instanceof SlotAlreadyBookedError) {
        setErrors({ time: err.message, form: err.message });
      } else {
        setErrors({
          form:
            locale === 'en'
              ? 'Unable to save booking right now. Please try again or call 01031235562.'
              : 'تعذر حفظ الحجز حالياً، يرجى المحاولة مرة أخرى أو الاتصال على 01031235562.',
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const buildBookingWhatsAppUrl = (booking: BookingRecord, action: 'confirm' | 'modify') => {
    const br = CLINIC_BRANCHES.find((b) => b.id === booking.branchId);
    const srv = DENTAL_SERVICES.find((s) => s.id === booking.serviceId);
    const branchLabel = br
      ? locale === 'en'
        ? br.nameEn
        : br.nameAr
      : booking.branchId;
    const serviceLabel = srv
      ? locale === 'en'
        ? srv.titleEn
        : srv.titleAr
      : booking.serviceId;
    const timeLabel = formatTimeLocalized(booking.time, locale);

    const customMessage =
      action === 'confirm'
        ? locale === 'en'
          ? `Hello NOVA Dental Clinic, I just booked appointment ${booking.referenceCode} (${serviceLabel}) at ${branchLabel} on ${booking.date} at ${timeLabel}. Name: ${booking.patientName}.`
          : `مرحباً عيادة نوفا لطب الأسنان، قمت بحجز موعد برقم مرجع ${booking.referenceCode} لخدمة (${serviceLabel}) في ${branchLabel} يوم ${booking.date} الساعة ${timeLabel}. الاسم: ${booking.patientName}.`
        : locale === 'en'
          ? `Hello NOVA Dental Clinic, I would like to modify or cancel my appointment ${booking.referenceCode} scheduled for ${booking.date} at ${timeLabel} (${branchLabel}).`
          : `مرحباً عيادة نوفا لطب الأسنان، أرغب في تعديل أو إلغاء موعدي رقم ${booking.referenceCode} المسجل يوم ${booking.date} الساعة ${timeLabel} (${branchLabel}).`;

    return `https://wa.me/${CLINIC_INFO.whatsappNumber}?text=${encodeURIComponent(customMessage)}`;
  };

  return (
    <section className="bg-[#080808] py-14 sm:py-20">
      <div className="mx-auto max-w-[1300px] px-4 sm:px-6 lg:px-8">
        {/* Top Action Bar */}
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-[#D4AF37]/20 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#E6C76A]">
              <CalendarCheck className="h-4 w-4 shrink-0 text-[#D4AF37]" aria-hidden="true" />
              <span>{t.appointmentPage.kicker}</span>
            </div>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold text-[#F7F3E9]">
              <span>{t.appointmentPage.headingPrefix}</span>{' '}
              <span className="text-[#D4AF37]">{t.appointmentPage.headingAccent}</span>
            </h2>
            <p className="mt-2 max-w-2xl text-sm sm:text-base text-[#C8BFA8]">
              {t.appointmentPage.subtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[#D4AF37]/35 bg-[#161512] px-5 py-2.5 text-sm font-semibold text-[#F7F3E9] transition-colors hover:border-[#E6C76A] hover:text-[#E6C76A] cursor-pointer"
          >
            <ListChecks className="h-4 w-4 text-[#D4AF37]" aria-hidden="true" />
            <span>{t.appointmentPage.myBookingsBtn}</span>
            {myBookings.length > 0 && (
              <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#D4AF37] px-1.5 text-xs font-bold text-[#080808] tabular-nums">
                {myBookings.length}
              </span>
            )}
          </button>
        </div>

        {confirmedBooking ? (
          <div className="mx-auto max-w-2xl rounded-[30px] border border-[#D4AF37]/30 bg-[#161512] p-8 sm:p-10 text-center shadow-2xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-emerald-500/35 bg-emerald-950/60 text-emerald-300">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <h3 className="mt-5 text-2xl font-bold text-[#F7F3E9]">
              {t.appointmentPage.confirmedTitle}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[#C8BFA8]">
              {t.appointmentPage.confirmedDesc}
            </p>

            <div className="mt-6 rounded-[20px] border border-[#D4AF37]/25 bg-[#0A0908] p-5 text-start space-y-2.5 text-sm">
              <div className="flex items-center justify-between border-b border-[#D4AF37]/15 pb-2.5">
                <span className="font-medium text-[#C8BFA8]">
                  {t.appointmentPage.refLabel}
                </span>
                <div className="flex items-center gap-2">
                  <span
                    dir="ltr"
                    className="font-bold text-[#E6C76A] tabular-nums"
                  >
                    {confirmedBooking.referenceCode}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopyReference(confirmedBooking.referenceCode)
                    }
                    className="inline-flex items-center gap-1 rounded-full border border-[#D4AF37]/30 bg-[#161512] px-2.5 py-0.5 text-[11px] font-bold text-[#E6C76A] transition-colors hover:bg-[#D4AF37] hover:text-[#080808] cursor-pointer"
                  >
                    {copiedRef ? (
                      <>
                        <Check className="h-3 w-3" aria-hidden="true" />
                        <span>{locale === 'en' ? 'Copied' : 'تم النسخ'}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" aria-hidden="true" />
                        <span>{locale === 'en' ? 'Copy' : 'نسخ'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-[#C8BFA8]">
                  {t.appointmentPage.branchLabel}
                </span>
                <span className="font-bold text-[#F7F3E9]">
                  {locale === 'en' ? branch.nameEn : branch.nameAr}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-[#C8BFA8]">
                  {t.appointmentPage.serviceLabel}
                </span>
                <span className="font-bold text-[#F7F3E9]">
                  {locale === 'en'
                    ? selectedServiceObj.titleEn
                    : selectedServiceObj.titleAr}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-[#C8BFA8]">
                  {t.appointmentPage.dateLabel}
                </span>
                <span dir="ltr" className="font-bold text-[#F7F3E9] tabular-nums">
                  {confirmedBooking.date} ·{' '}
                  {formatTimeLocalized(confirmedBooking.time, locale)}
                </span>
              </div>
            </div>

            {/* Calendar Reminder Actions (.ics & Google Calendar) */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
              <button
                type="button"
                onClick={() => handleDownloadIcs(confirmedBooking)}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#D4AF37]/35 bg-[#0A0908] px-4 py-2 text-xs font-bold text-[#E6C76A] transition-colors hover:border-[#E6C76A] hover:bg-[#1B1810] cursor-pointer"
              >
                <CalendarPlus className="h-3.5 w-3.5" aria-hidden="true" />
                <span>
                  {locale === 'en'
                    ? 'Save to Calendar (.ics)'
                    : 'حفظ في التقويم (.ics)'}
                </span>
              </button>

              <a
                href={buildGoogleCalendarUrl(confirmedBooking, locale)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-[#D4AF37]/30 bg-[#0A0908] px-4 py-2 text-xs font-bold text-[#F7F3E9] transition-colors hover:border-[#E6C76A] hover:text-[#E6C76A]"
              >
                <ExternalLink className="h-3.5 w-3.5 text-[#D4AF37]" aria-hidden="true" />
                <span>
                  {locale === 'en'
                    ? 'Add to Google Calendar'
                    : 'إضافة إلى تقويم Google'}
                </span>
              </a>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <a
                href={buildBookingWhatsAppUrl(confirmedBooking, 'confirm')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-bold text-[#080808] transition-colors hover:bg-[#2be06f]"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                <span>
                  {locale === 'en'
                    ? 'Send Confirmation on WhatsApp'
                    : 'إرسال تأكيد الحجز عبر واتساب'}
                </span>
              </a>
              <button
                type="button"
                onClick={() => setConfirmedBooking(null)}
                className="rounded-full bg-[#D4AF37] px-6 py-3 text-sm font-bold text-[#080808] transition-colors hover:bg-[#E6C76A] cursor-pointer"
              >
                {t.appointmentPage.bookAnother}
              </button>
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="rounded-full border border-[#D4AF37]/35 bg-[#0A0908] px-6 py-3 text-sm font-semibold text-[#F7F3E9] transition-colors hover:border-[#E6C76A] hover:text-[#E6C76A] cursor-pointer"
              >
                {t.appointmentPage.manageBookings}
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            {/* Booking Form Column */}
            <form
              onSubmit={handleSubmit}
              noValidate
              className="space-y-6 rounded-[30px] border border-[#D4AF37]/25 bg-[#161512] p-6 sm:p-9 lg:col-span-8 shadow-xl"
            >
              {/* Clinic Branch Selector (Fifth Settlement & Nasr City) */}
              <div>
                <label className="mb-2 block text-sm font-bold text-[#F7F3E9]">
                  {t.appointmentPage.branchLabel}
                </label>
                <div
                  role="radiogroup"
                  aria-label={t.appointmentPage.branchLabel}
                  className="grid grid-cols-1 gap-3 sm:grid-cols-2"
                >
                  {CLINIC_BRANCHES.map((item) => {
                    const isSelected = item.id === branchId;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        onClick={() => setBranchId(item.id)}
                        className={`flex items-start gap-3 rounded-[16px] border px-4 py-3.5 text-start transition-colors cursor-pointer ${
                          isSelected
                            ? 'border-[#E6C76A] bg-[#1E1A11] shadow-[0_6px_20px_rgba(212,175,55,0.12)]'
                            : 'border-[#D4AF37]/25 bg-[#0A0908] hover:border-[#D4AF37]/60'
                        }`}
                      >
                        <MapPin
                          className={`mt-0.5 h-5 w-5 shrink-0 ${
                            isSelected ? 'text-[#E6C76A]' : 'text-[#D4AF37]/70'
                          }`}
                          aria-hidden="true"
                        />
                        <div>
                          <p className="text-sm font-bold text-[#F7F3E9]">
                            {locale === 'en' ? item.nameEn : item.nameAr}
                          </p>
                          <p className="mt-0.5 text-xs text-[#C8BFA8]">
                            {locale === 'en' ? item.addressEn : item.addressAr}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Service & Doctor Select */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="booking-service"
                    className="mb-2 block text-sm font-bold text-[#F7F3E9]"
                  >
                    {t.appointmentPage.serviceLabel}
                  </label>
                  <select
                    id="booking-service"
                    value={serviceId}
                    onChange={(e) => setServiceId(e.target.value)}
                    className="w-full rounded-[14px] border border-[#D4AF37]/25 bg-[#0A0908] px-4 py-3 text-sm font-medium text-[#F7F3E9] focus:border-[#E6C76A] focus:outline-none"
                  >
                    {DENTAL_SERVICES.map((srv) => (
                      <option key={srv.id} value={srv.id} className="bg-[#161512] text-[#F7F3E9]">
                        {locale === 'en' ? srv.titleEn : srv.titleAr}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="booking-doctor"
                    className="mb-2 block text-sm font-bold text-[#F7F3E9]"
                  >
                    {t.appointmentPage.doctorLabel}
                  </label>
                  <select
                    id="booking-doctor"
                    value={doctorId}
                    onChange={(e) => setDoctorId(e.target.value)}
                    className="w-full rounded-[14px] border border-[#D4AF37]/25 bg-[#0A0908] px-4 py-3 text-sm font-medium text-[#F7F3E9] focus:border-[#E6C76A] focus:outline-none"
                  >
                    <option value="any" className="bg-[#161512] text-[#F7F3E9]">
                      {t.appointmentPage.anyDoctor}
                    </option>
                    {DOCTORS.map((doc) => (
                      <option key={doc.id} value={doc.id} className="bg-[#161512] text-[#F7F3E9]">
                        {locale === 'en' ? doc.nameEn : doc.nameAr} —{' '}
                        {locale === 'en' ? doc.specialtyEn : doc.specialtyAr}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Working Days Picker */}
              <div>
                <label className="mb-2.5 flex items-center gap-2 text-sm font-bold text-[#F7F3E9]">
                  <Calendar className="h-4 w-4 text-[#D4AF37]" aria-hidden="true" />
                  <span>{t.appointmentPage.dateLabel}</span>
                </label>
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                  {workingDays.map((day) => {
                    const isSelected = day.date === date;
                    return (
                      <button
                        key={day.date}
                        type="button"
                        onClick={() => setDate(day.date)}
                        className={`rounded-[14px] border px-3 py-2.5 text-center transition-colors cursor-pointer ${
                          isSelected
                            ? 'border-[#E6C76A] bg-[#D4AF37] text-[#080808] shadow-md'
                            : 'border-[#D4AF37]/20 bg-[#0A0908] text-[#F7F3E9] hover:border-[#D4AF37]'
                        }`}
                      >
                        <span className="block text-xs font-bold">
                          {locale === 'en'
                            ? day.weekdayLabelEn
                            : day.weekdayLabelAr}
                        </span>
                        <span
                          className={`mt-0.5 block text-xs ${
                            isSelected ? 'text-[#1A160B] font-semibold' : 'text-[#C8BFA8]'
                          }`}
                        >
                          {locale === 'en'
                            ? day.displayLabelEn
                            : day.displayLabelAr}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Slots Picker */}
              <div>
                <label className="mb-2.5 flex items-center gap-2 text-sm font-bold text-[#F7F3E9]">
                  <Clock className="h-4 w-4 text-[#D4AF37]" aria-hidden="true" />
                  <span>{t.appointmentPage.timeLabel}</span>
                </label>

                {loadingSlots ? (
                  <p className="rounded-[14px] border border-[#D4AF37]/20 bg-[#0A0908] px-4 py-4 text-sm text-[#C8BFA8]">
                    {t.appointmentPage.loadingSlots}
                  </p>
                ) : (
                  <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-5">
                    {slots.map((slot) => {
                      const isSelected = slot.time === effectiveTime;
                      return (
                        <button
                          key={slot.time}
                          type="button"
                          disabled={!slot.available}
                          onClick={() => setSelectedTime(slot.time)}
                          className={`rounded-[12px] border px-3 py-2.5 text-xs font-bold transition-colors ${
                            !slot.available
                              ? 'border-[#D4AF37]/10 bg-[#12110E] text-[#6B6454] line-through cursor-not-allowed'
                              : isSelected
                              ? 'border-[#E6C76A] bg-[#D4AF37] text-[#080808] cursor-pointer shadow-sm'
                              : 'border-[#D4AF37]/20 bg-[#0A0908] text-[#F7F3E9] hover:border-[#D4AF37] cursor-pointer'
                          }`}
                        >
                          {locale === 'en' ? slot.labelEn : slot.labelAr}
                        </button>
                      );
                    })}
                  </div>
                )}
                {errors.time && (
                  <p className="mt-1.5 text-xs font-medium text-[#E65757]">
                    {errors.time}
                  </p>
                )}
              </div>

              {/* Patient Info */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="booking-name"
                    className="mb-2 block text-sm font-bold text-[#F7F3E9]"
                  >
                    {t.appointmentPage.nameLabel}
                  </label>
                  <input
                    id="booking-name"
                    type="text"
                    maxLength={BLUEPRINT_LIMITS.patientNameMax}
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder={t.appointmentPage.namePlaceholder}
                    className="w-full rounded-[14px] border border-[#D4AF37]/25 bg-[#0A0908] px-4 py-3 text-sm text-[#F7F3E9] placeholder:text-[#9E9580]/70 focus:border-[#E6C76A] focus:outline-none"
                  />
                  {errors.patientName && (
                    <p className="mt-1 text-xs font-medium text-[#E65757]">
                      {errors.patientName}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="booking-phone"
                    className="mb-2 block text-sm font-bold text-[#F7F3E9]"
                  >
                    {t.appointmentPage.phoneLabel}
                  </label>
                  <input
                    id="booking-phone"
                    type="tel"
                    dir="ltr"
                    maxLength={15}
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    placeholder={t.appointmentPage.phonePlaceholder}
                    className="w-full rounded-[14px] border border-[#D4AF37]/25 bg-[#0A0908] px-4 py-3 text-sm text-[#F7F3E9] rtl:text-right ltr:text-left placeholder:text-[#9E9580]/70 focus:border-[#E6C76A] focus:outline-none tabular-nums"
                  />
                  {errors.patientPhone && (
                    <p className="mt-1 text-xs font-medium text-[#E65757]">
                      {errors.patientPhone}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="booking-notes"
                  className="mb-2 block text-sm font-bold text-[#F7F3E9]"
                >
                  {t.appointmentPage.notesLabel}
                </label>
                <textarea
                  id="booking-notes"
                  rows={3}
                  maxLength={BLUEPRINT_LIMITS.notesMax}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t.appointmentPage.notesPlaceholder}
                  className="w-full rounded-[14px] border border-[#D4AF37]/25 bg-[#0A0908] px-4 py-3 text-sm text-[#F7F3E9] placeholder:text-[#9E9580]/70 focus:border-[#E6C76A] focus:outline-none"
                />
              </div>

              {errors.form && (
                <p className="text-xs font-medium text-[#E65757]">{errors.form}</p>
              )}

              <button
                type="submit"
                disabled={submitting || !effectiveTime}
                className="inline-flex w-full min-h-[50px] items-center justify-center gap-2 rounded-full bg-[#D4AF37] px-6 py-3.5 text-base font-bold text-[#080808] transition-colors hover:bg-[#E6C76A] disabled:opacity-60 cursor-pointer"
              >
                <CalendarCheck className="h-5 w-5" aria-hidden="true" />
                <span>
                  {submitting
                    ? t.appointmentPage.submittingBtn
                    : t.appointmentPage.submitBtn}
                </span>
              </button>
            </form>

            {/* Summary Sidebar Column */}
            <aside className="space-y-6 lg:col-span-4">
              <div className="rounded-[30px] border border-[#D4AF37]/30 bg-[#11100E] p-7 text-[#F7F3E9] shadow-2xl">
                <h3 className="text-xl font-bold text-[#E6C76A]">
                  {t.appointmentPage.summaryTitle}
                </h3>

                <dl className="mt-6 space-y-4 border-t border-[#D4AF37]/20 pt-5 text-sm">
                  <div>
                    <dt className="text-xs text-[#9E9580]">
                      {t.appointmentPage.branchLabel}
                    </dt>
                    <dd className="mt-1 font-semibold text-[#F7F3E9]">
                      {locale === 'en' ? branch.addressEn : branch.addressAr}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-xs text-[#9E9580]">
                      {t.appointmentPage.serviceLabel}
                    </dt>
                    <dd className="mt-1 font-semibold text-[#E6C76A]">
                      {locale === 'en'
                        ? selectedServiceObj.titleEn
                        : selectedServiceObj.titleAr}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-xs text-[#9E9580]">
                      {t.appointmentPage.doctorLabel}
                    </dt>
                    <dd className="mt-1 font-semibold text-[#F7F3E9]">
                      {selectedDoctorObj
                        ? locale === 'en'
                          ? selectedDoctorObj.nameEn
                          : selectedDoctorObj.nameAr
                        : t.appointmentPage.anyDoctor}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-xs text-[#9E9580]">
                      {t.appointmentPage.dateLabel}
                    </dt>
                    <dd className="mt-1 font-semibold text-[#F7F3E9]">
                      {selectedDayObj
                        ? `${
                            locale === 'en'
                              ? selectedDayObj.weekdayLabelEn
                              : selectedDayObj.weekdayLabelAr
                          } · ${
                            locale === 'en'
                              ? selectedDayObj.displayLabelEn
                              : selectedDayObj.displayLabelAr
                          }`
                        : date}
                      {effectiveTime && (
                        <span className="ms-2 text-[#E6C76A]">
                          ({formatTimeLocalized(effectiveTime, locale)})
                        </span>
                      )}
                    </dd>
                  </div>
                </dl>

                <div className="mt-6 rounded-2xl border border-[#D4AF37]/20 bg-[#161512] p-4 text-xs leading-relaxed text-[#C8BFA8]">
                  {t.appointmentPage.summaryNote}
                </div>

                <a
                  href={CLINIC_INFO.primaryPhoneTel}
                  dir="ltr"
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#D4AF37] px-5 py-3 text-sm font-bold text-[#080808] transition-colors hover:bg-[#E6C76A] tabular-nums"
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  <span>{CLINIC_INFO.primaryPhone}</span>
                </a>
              </div>
            </aside>
          </div>
        )}
      </div>

      {/* My Bookings Slide-Over Drawer */}
      {drawerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t.appointmentPage.drawerTitle}
          className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-xs"
        >
          <div className="flex h-full w-full max-w-md flex-col border-s border-[#D4AF37]/25 bg-[#0D0C0A] p-6 shadow-2xl">
            <div className="flex items-start justify-between border-b border-[#D4AF37]/20 pb-4">
              <div>
                <h3 className="text-xl font-bold text-[#F7F3E9]">
                  {t.appointmentPage.drawerTitle}
                </h3>
                <p className="mt-1 text-xs text-[#C8BFA8]">
                  {t.appointmentPage.drawerSubtitle}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label={t.nav.closeMenu}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#D4AF37]/30 bg-[#161512] text-[#E6C76A] hover:bg-[#D4AF37] hover:text-[#080808] cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 flex-1 space-y-4 overflow-y-auto">
              {myBookings.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#D4AF37]/30 p-8 text-center text-sm text-[#C8BFA8]">
                  {t.appointmentPage.noBookings}
                </div>
              ) : (
                myBookings.map((booking) => {
                  const br = CLINIC_BRANCHES.find(
                    (b) => b.id === booking.branchId
                  );
                  const srv = DENTAL_SERVICES.find(
                    (s) => s.id === booking.serviceId
                  );
                  const doc = DOCTORS.find((d) => d.id === booking.doctorId);

                  return (
                    <div
                      key={booking.id}
                      className="rounded-2xl border border-[#D4AF37]/20 bg-[#161512] p-4 text-sm"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span
                          dir="ltr"
                          className="text-xs font-bold text-[#E6C76A] tabular-nums"
                        >
                          {booking.referenceCode}
                        </span>
                        <span className="rounded-full border border-[#D4AF37]/30 bg-[#1E1A11] px-2.5 py-0.5 text-xs font-semibold text-[#E6C76A]">
                          {locale === 'en' ? 'Submitted' : 'تم التسجيل'}
                        </span>
                      </div>

                      <p className="mt-2 font-bold text-[#F7F3E9]">
                        {srv
                          ? locale === 'en'
                            ? srv.titleEn
                            : srv.titleAr
                          : booking.serviceId}
                      </p>

                      {br && (
                        <p className="mt-1 flex items-center gap-1.5 text-xs text-[#C8BFA8]">
                          <MapPin className="h-3.5 w-3.5 shrink-0 text-[#D4AF37]" />
                          <span>{locale === 'en' ? br.nameEn : br.nameAr}</span>
                        </p>
                      )}

                      <p className="mt-1 flex items-center gap-1.5 text-xs text-[#C8BFA8]">
                        <UserRound className="h-3.5 w-3.5 text-[#D4AF37]" />
                        <span>
                          {doc
                            ? locale === 'en'
                              ? doc.nameEn
                              : doc.nameAr
                            : t.appointmentPage.anyDoctor}
                        </span>
                      </p>

                      <p
                        dir="ltr"
                        className="mt-1 text-xs font-semibold text-[#E6C76A] rtl:text-right ltr:text-left tabular-nums"
                      >
                        {booking.date} ·{' '}
                        {formatTimeLocalized(booking.time, locale)}
                      </p>

                      <div className="mt-3 flex items-center gap-3 border-t border-[#D4AF37]/15 pt-3">
                        <a
                          href={buildBookingWhatsAppUrl(booking, 'modify')}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#25D366] hover:underline"
                        >
                          <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>
                            {locale === 'en'
                              ? 'Modify / Cancel via WhatsApp'
                              : 'تعديل أو إلغاء عبر واتساب'}
                          </span>
                        </a>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default function AppointmentForm() {
  return (
    <FirebaseErrorBoundary>
      <AppointmentFormContent />
    </FirebaseErrorBoundary>
  );
}
