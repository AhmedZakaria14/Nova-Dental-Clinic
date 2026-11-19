'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Calendar,
  CalendarPlus,
  Clock,
  MapPin,
  X,
} from 'lucide-react';
import {
  BranchId,
  CLINIC_BRANCHES,
  DENTAL_SERVICES,
} from '@/lib/clinic-data';
import {
  BLUEPRINT_LIMITS,
  getAvailableSlotsFromBookedTimes,
  getUpcomingWorkingDays,
} from '@/lib/booking-logic';
import {
  BookingValidationError,
  createFirestoreBooking,
  SlotAlreadyBookedError,
  subscribeBookedTimesForBranchDate,
} from '@/lib/firestore-bookings';
import { Locale } from '@/lib/i18n';

interface WalkInBookingModalProps {
  open: boolean;
  locale: Locale;
  initialBranch?: BranchId;
  initialDate?: string;
  initialTime?: string;
  onClose: () => void;
  onCreated: () => void;
}

export default function WalkInBookingModal({
  open,
  locale,
  initialBranch = 'fifth-settlement',
  initialDate,
  initialTime = '',
  onClose,
  onCreated,
}: WalkInBookingModalProps) {
  const workingDays = useMemo(() => getUpcomingWorkingDays(12), []);
  const defaultDate = initialDate || workingDays[0]?.date || '';

  const [branchId, setBranchId] = useState<BranchId>(initialBranch);
  const [serviceId, setServiceId] = useState(DENTAL_SERVICES[0].id);
  const [date, setDate] = useState(defaultDate);
  const [selectedTime, setSelectedTime] = useState(initialTime);
  const [status, setStatus] = useState<'confirmed' | 'pending'>('confirmed');
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  const [bookedTimes, setBookedTimes] = useState<string[]>([]);
  const [loadedSlotKey, setLoadedSlotKey] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const currentSlotKey = `${branchId}_${date}`;
  const loadingSlots = Boolean(open && date) && loadedSlotKey !== currentSlotKey;

  useEffect(() => {
    if (!open || !date) return;
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
  }, [open, branchId, date]);

  const slots = useMemo(
    () => getAvailableSlotsFromBookedTimes({ branchId, date, bookedTimes }),
    [branchId, date, bookedTimes]
  );

  const effectiveTime = useMemo(() => {
    if (slots.some((s) => s.time === selectedTime && s.available)) {
      return selectedTime;
    }
    return slots.find((s) => s.available)?.time ?? '';
  }, [slots, selectedTime]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    try {
      await createFirestoreBooking({
        locale,
        branchId,
        serviceId,
        doctorId: 'nova-specialist',
        date,
        time: effectiveTime,
        patientName,
        patientPhone,
        notes,
        adminNotes,
        source: 'admin-walkin',
        status,
      });

      onCreated();
      onClose();
    } catch (err) {
      if (err instanceof BookingValidationError) {
        setErrors(err.errors);
      } else if (err instanceof SlotAlreadyBookedError) {
        setErrors({ time: err.message, form: err.message });
      } else {
        setErrors({
          form:
            locale === 'en'
              ? 'Failed to create booking. Please check your permissions and try again.'
              : 'تعذر إضافة الحجز حالياً. يرجى المحاولة مرة أخرى.',
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={
        locale === 'en' ? 'Add New Appointment' : 'إضافة حجز جديد (هاتفي / حضوري)'
      }
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs"
    >
      <div className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-[26px] border border-[#D4AF37]/30 bg-[#12110E] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#D4AF37]/20 bg-[#0D0C0A] px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#D4AF37]/35 bg-[#1B1810] text-[#E6C76A]">
              <CalendarPlus className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#F7F3E9]">
                {locale === 'en'
                  ? 'Add Clinic Appointment'
                  : 'إضافة حجز جديد (هاتفي / حضوري)'}
              </h2>
              <p className="text-xs text-[#9E9580]">
                {locale === 'en'
                  ? 'Saved immediately in Firestore with automatic slot locking.'
                  : 'يُحفظ مباشرة في قاعدة البيانات مع حجز الساعة تلقائياً.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={locale === 'en' ? 'Close' : 'إغلاق'}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#D4AF37]/25 bg-[#161512] text-[#E6C76A] hover:bg-[#D4AF37] hover:text-[#080808] cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex-1 space-y-5 overflow-y-auto p-6"
        >
          {/* Branch Selection */}
          <div>
            <label className="mb-2 block text-xs font-bold text-[#E6C76A]">
              {locale === 'en' ? 'Clinic Branch' : 'الفرع'}
            </label>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {CLINIC_BRANCHES.map((b) => {
                const selected = b.id === branchId;
                return (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setBranchId(b.id)}
                    className={`flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-start text-sm font-semibold transition-colors cursor-pointer ${
                      selected
                        ? 'border-[#E6C76A] bg-[#1F1B11] text-[#F7F3E9]'
                        : 'border-[#D4AF37]/20 bg-[#0A0908] text-[#C8BFA8] hover:border-[#D4AF37]/50'
                    }`}
                  >
                    <MapPin className="h-4 w-4 shrink-0 text-[#D4AF37]" />
                    <span>{locale === 'en' ? b.nameEn : b.nameAr}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Service & Initial Status */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="walkin-service"
                className="mb-1.5 block text-xs font-bold text-[#E6C76A]"
              >
                {locale === 'en' ? 'Service' : 'الخدمة الطبية'}
              </label>
              <select
                id="walkin-service"
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
                className="w-full rounded-xl border border-[#D4AF37]/25 bg-[#0A0908] px-3.5 py-2.5 text-sm text-[#F7F3E9] focus:border-[#E6C76A] focus:outline-none"
              >
                {DENTAL_SERVICES.map((srv) => (
                  <option
                    key={srv.id}
                    value={srv.id}
                    className="bg-[#161512] text-[#F7F3E9]"
                  >
                    {locale === 'en' ? srv.titleEn : srv.titleAr}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="walkin-status"
                className="mb-1.5 block text-xs font-bold text-[#E6C76A]"
              >
                {locale === 'en' ? 'Initial Status' : 'حالة الحجز'}
              </label>
              <select
                id="walkin-status"
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as 'confirmed' | 'pending')
                }
                className="w-full rounded-xl border border-[#D4AF37]/25 bg-[#0A0908] px-3.5 py-2.5 text-sm text-[#F7F3E9] focus:border-[#E6C76A] focus:outline-none"
              >
                <option value="confirmed" className="bg-[#161512]">
                  {locale === 'en' ? 'Confirmed' : 'مؤكد'}
                </option>
                <option value="pending" className="bg-[#161512]">
                  {locale === 'en' ? 'Pending Confirmation' : 'بانتظار التأكيد'}
                </option>
              </select>
            </div>
          </div>

          {/* Date Picker */}
          <div>
            <label
              htmlFor="walkin-date"
              className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-[#E6C76A]"
            >
              <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{locale === 'en' ? 'Date' : 'التاريخ'}</span>
            </label>
            <div className="flex flex-wrap items-center gap-2">
              <input
                id="walkin-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="rounded-xl border border-[#D4AF37]/25 bg-[#0A0908] px-3.5 py-2 text-sm text-[#F7F3E9] focus:border-[#E6C76A] focus:outline-none"
              />
              {workingDays.slice(0, 4).map((d) => (
                <button
                  key={d.date}
                  type="button"
                  onClick={() => setDate(d.date)}
                  className={`rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                    d.date === date
                      ? 'border-[#E6C76A] bg-[#D4AF37] text-[#080808]'
                      : 'border-[#D4AF37]/20 bg-[#0A0908] text-[#C8BFA8] hover:border-[#D4AF37]/60'
                  }`}
                >
                  {locale === 'en'
                    ? `${d.weekdayLabelEn} ${d.displayLabelEn}`
                    : `${d.weekdayLabelAr} ${d.displayLabelAr}`}
                </button>
              ))}
            </div>
            {errors.date && (
              <p className="mt-1 text-xs text-[#E65757]">{errors.date}</p>
            )}
          </div>

          {/* Live Time Slots */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-[#E6C76A]">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{locale === 'en' ? 'Available Time' : 'الساعة المتاحة'}</span>
            </label>
            {loadingSlots ? (
              <p className="rounded-xl border border-[#D4AF37]/20 bg-[#0A0908] px-3.5 py-3 text-xs text-[#C8BFA8]">
                {locale === 'en' ? 'Loading live slots...' : 'جاري تحديث المواعيد...'}
              </p>
            ) : slots.length === 0 ? (
              <p className="rounded-xl border border-amber-500/30 bg-amber-950/30 px-3.5 py-3 text-xs text-amber-200">
                {locale === 'en'
                  ? 'No slots available on this date (Fridays closed).'
                  : 'لا توجد ساعات متاحة في هذا التاريخ (الجمعة إجازة).'}
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                {slots.map((slot) => {
                  const selected = slot.time === effectiveTime;
                  return (
                    <button
                      key={slot.time}
                      type="button"
                      disabled={!slot.available}
                      onClick={() => setSelectedTime(slot.time)}
                      className={`rounded-xl border px-2.5 py-2 text-xs font-bold transition-colors ${
                        !slot.available
                          ? 'border-[#D4AF37]/10 bg-[#171512] text-[#6B6454] line-through cursor-not-allowed'
                          : selected
                            ? 'border-[#E6C76A] bg-[#D4AF37] text-[#080808] cursor-pointer'
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
              <p className="mt-1 text-xs text-[#E65757]">{errors.time}</p>
            )}
          </div>

          {/* Patient Name & Phone */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="walkin-name"
                className="mb-1.5 block text-xs font-bold text-[#E6C76A]"
              >
                {locale === 'en' ? 'Patient Full Name' : 'اسم المريض الكامل'}
              </label>
              <input
                id="walkin-name"
                type="text"
                maxLength={BLUEPRINT_LIMITS.patientNameMax}
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder={
                  locale === 'en' ? 'e.g. Mohamed Tarek' : 'مثال: محمد طارق'
                }
                className="w-full rounded-xl border border-[#D4AF37]/25 bg-[#0A0908] px-3.5 py-2.5 text-sm text-[#F7F3E9] placeholder:text-[#9E9580]/60 focus:border-[#E6C76A] focus:outline-none"
              />
              {errors.patientName && (
                <p className="mt-1 text-xs text-[#E65757]">{errors.patientName}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="walkin-phone"
                className="mb-1.5 block text-xs font-bold text-[#E6C76A]"
              >
                {locale === 'en' ? 'Egyptian Mobile Number' : 'رقم الموبايل المصري'}
              </label>
              <input
                id="walkin-phone"
                type="tel"
                dir="ltr"
                maxLength={15}
                value={patientPhone}
                onChange={(e) => setPatientPhone(e.target.value)}
                placeholder="010XXXXXXXX"
                className="w-full rounded-xl border border-[#D4AF37]/25 bg-[#0A0908] px-3.5 py-2.5 text-sm text-[#F7F3E9] rtl:text-right ltr:text-left placeholder:text-[#9E9580]/60 focus:border-[#E6C76A] focus:outline-none tabular-nums"
              />
              {errors.patientPhone && (
                <p className="mt-1 text-xs text-[#E65757]">{errors.patientPhone}</p>
              )}
            </div>
          </div>

          {/* Patient Notes & Admin Notes */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="walkin-notes"
                className="mb-1.5 block text-xs font-bold text-[#C8BFA8]"
              >
                {locale === 'en' ? 'Patient Notes (Optional)' : 'ملاحظات المريض (اختياري)'}
              </label>
              <textarea
                id="walkin-notes"
                rows={2}
                maxLength={BLUEPRINT_LIMITS.notesMax}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded-xl border border-[#D4AF37]/20 bg-[#0A0908] px-3.5 py-2 text-sm text-[#F7F3E9] focus:border-[#E6C76A] focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="walkin-admin-notes"
                className="mb-1.5 block text-xs font-bold text-[#C8BFA8]"
              >
                {locale === 'en'
                  ? 'Internal Reception Notes'
                  : 'ملاحظات داخلية للاستقبال'}
              </label>
              <textarea
                id="walkin-admin-notes"
                rows={2}
                maxLength={BLUEPRINT_LIMITS.adminNotesMax}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="w-full rounded-xl border border-[#D4AF37]/20 bg-[#0A0908] px-3.5 py-2 text-sm text-[#F7F3E9] focus:border-[#E6C76A] focus:outline-none"
              />
            </div>
          </div>

          {errors.form && (
            <p className="rounded-xl border border-[#E65757]/35 bg-[#E65757]/10 px-3.5 py-2 text-xs font-medium text-[#E65757]">
              {errors.form}
            </p>
          )}

          {/* Footer Buttons */}
          <div className="flex flex-wrap items-center justify-end gap-3 border-t border-[#D4AF37]/15 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-[#D4AF37]/25 bg-[#161512] px-5 py-2.5 text-sm font-semibold text-[#C8BFA8] hover:border-[#E6C76A] hover:text-[#F7F3E9] cursor-pointer"
            >
              {locale === 'en' ? 'Cancel' : 'إلغاء'}
            </button>
            <button
              type="submit"
              disabled={submitting || !effectiveTime}
              className="inline-flex items-center gap-2 rounded-full bg-[#D4AF37] px-6 py-2.5 text-sm font-bold text-[#080808] hover:bg-[#E6C76A] disabled:opacity-60 cursor-pointer"
            >
              <CalendarPlus className="h-4 w-4" aria-hidden="true" />
              <span>
                {submitting
                  ? locale === 'en'
                    ? 'Saving...'
                    : 'جاري الحفظ...'
                  : locale === 'en'
                    ? 'Save Appointment'
                    : 'حفظ الحجز'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
