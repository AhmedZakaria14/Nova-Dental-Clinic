'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Calendar,
  Clock,
  MessageCircle,
  Phone,
  Save,
  Trash2,
  UserRound,
  X,
} from 'lucide-react';
import {
  BranchId,
  CLINIC_BRANCHES,
  DENTAL_SERVICES,
} from '@/lib/clinic-data';
import {
  BLUEPRINT_LIMITS,
  BookingRecord,
  BookingStatus,
  buildPatientWhatsAppReplyUrl,
  formatTimeLocalized,
  getAvailableSlotsFromBookedTimes,
} from '@/lib/booking-logic';
import {
  deleteAdminBooking,
  rescheduleAdminBooking,
  SlotAlreadyBookedError,
  subscribeBookedTimesForBranchDate,
} from '@/lib/firestore-bookings';
import { Locale } from '@/lib/i18n';

interface BookingDetailDrawerProps {
  booking: BookingRecord | null;
  locale: Locale;
  onClose: () => void;
  onUpdated: (message: string) => void;
}

const STATUS_OPTIONS: {
  value: BookingStatus;
  labelAr: string;
  labelEn: string;
}[] = [
  { value: 'pending', labelAr: 'بانتظار التأكيد', labelEn: 'Pending' },
  { value: 'confirmed', labelAr: 'مؤكد', labelEn: 'Confirmed' },
  { value: 'completed', labelAr: 'مكتمل', labelEn: 'Completed' },
  { value: 'cancelled', labelAr: 'ملغي (تحرير الساعة)', labelEn: 'Cancelled (Release Slot)' },
  { value: 'no-show', labelAr: 'لم يحضر (تحرير الساعة)', labelEn: 'No-Show (Release Slot)' },
];

export default function BookingDetailDrawer({
  booking,
  locale,
  onClose,
  onUpdated,
}: BookingDetailDrawerProps) {
  const [branchId, setBranchId] = useState<BranchId>(
    booking?.branchId ?? 'fifth-settlement'
  );
  const [serviceId, setServiceId] = useState(
    booking?.serviceId ?? DENTAL_SERVICES[0].id
  );
  const [date, setDate] = useState(booking?.date ?? '');
  const [time, setTime] = useState(booking?.time ?? '');
  const [status, setStatus] = useState<BookingStatus>(
    booking?.status ?? 'pending'
  );
  const [adminNotes, setAdminNotes] = useState(booking?.adminNotes ?? '');

  const [bookedTimes, setBookedTimes] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDeleteStep, setConfirmDeleteStep] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!booking || !date) return;
    let active = true;

    const unsubscribe = subscribeBookedTimesForBranchDate(
      branchId,
      date,
      (times) => {
        if (!active) return;
        setBookedTimes(times);
      },
      () => {
        if (!active) return;
        setBookedTimes([]);
      }
    );

    return () => {
      active = false;
      unsubscribe();
    };
  }, [booking, branchId, date]);

  const slots = useMemo(() => {
    if (!booking) return [];
    // Treat the booking's own current slot as available for itself
    const filteredBooked = bookedTimes.filter(
      (t) =>
        !(
          branchId === booking.branchId &&
          date === booking.date &&
          t === booking.time
        )
    );
    return getAvailableSlotsFromBookedTimes({
      branchId,
      date,
      bookedTimes: filteredBooked,
    });
  }, [booking, branchId, date, bookedTimes]);

  if (!booking) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage(null);

    try {
      await rescheduleAdminBooking({
        booking,
        branchId,
        serviceId,
        doctorId: booking.doctorId || 'nova-specialist',
        date,
        time,
        status,
        adminNotes,
        locale,
      });

      onUpdated(
        locale === 'en'
          ? `Booking ${booking.referenceCode} updated.`
          : `تم تحديث الحجز ${booking.referenceCode} بنجاح.`
      );
      onClose();
    } catch (err) {
      if (err instanceof SlotAlreadyBookedError) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage(
          locale === 'en'
            ? 'Could not save changes. Please verify date/slot and try again.'
            : 'تعذر حفظ التعديلات. يرجى التأكد من التاريخ والساعة والمحاولة مرة أخرى.'
        );
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setErrorMessage(null);
    try {
      await deleteAdminBooking(booking);
      onUpdated(
        locale === 'en'
          ? `Booking ${booking.referenceCode} permanently deleted.`
          : `تم حذف الحجز ${booking.referenceCode} نهائياً.`
      );
      onClose();
    } catch {
      setErrorMessage(
        locale === 'en'
          ? 'Unable to delete booking right now.'
          : 'تعذر حذف الحجز حالياً.'
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={
        locale === 'en'
          ? `Manage Booking ${booking.referenceCode}`
          : `إدارة الحجز ${booking.referenceCode}`
      }
      className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-xs"
    >
      <div className="flex h-full w-full max-w-lg flex-col border-s border-[#D4AF37]/25 bg-[#0F0E0C] shadow-2xl">
        {/* Drawer Header */}
        <div className="flex items-start justify-between border-b border-[#D4AF37]/20 bg-[#0A0908] px-6 py-5">
          <div>
            <span
              dir="ltr"
              className="inline-flex items-center rounded-full border border-[#D4AF37]/35 bg-[#1B1810] px-3 py-0.5 text-xs font-bold text-[#E6C76A] tabular-nums"
            >
              {booking.referenceCode}
            </span>
            <h2 className="mt-2 text-lg font-bold text-[#F7F3E9]">
              {booking.patientName}
            </h2>
            <p className="mt-0.5 text-xs text-[#9E9580]">
              {booking.source === 'admin-walkin'
                ? locale === 'en'
                  ? 'Created via Reception / Phone'
                  : 'تم التسجيل عبر الاستقبال / الهاتف'
                : locale === 'en'
                  ? 'Booked via Website'
                  : 'حجز إلكتروني من الموقع'}
            </p>
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

        {/* Contact Quick Actions */}
        <div className="flex flex-wrap items-center gap-2.5 border-b border-[#D4AF37]/15 bg-[#141310] px-6 py-3.5">
          <a
            href={`tel:+2${booking.patientPhone}`}
            dir="ltr"
            className="inline-flex items-center gap-1.5 rounded-full border border-[#D4AF37]/30 bg-[#0A0908] px-3.5 py-1.5 text-xs font-bold text-[#E6C76A] hover:border-[#E6C76A] tabular-nums"
          >
            <Phone className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{booking.patientPhone}</span>
          </a>

          <a
            href={buildPatientWhatsAppReplyUrl(booking, locale)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#25D366] px-3.5 py-1.5 text-xs font-bold text-[#080808] hover:bg-[#2be06f]"
          >
            <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
            <span>
              {locale === 'en'
                ? 'Confirm via WhatsApp'
                : 'إرسال تأكيد واتساب للمريض'}
            </span>
          </a>
        </div>

        {/* Form Body */}
        <form
          onSubmit={handleSave}
          className="flex-1 space-y-5 overflow-y-auto px-6 py-5"
        >
          {/* Patient Notes Readonly Box */}
          {booking.notes && (
            <div className="rounded-2xl border border-[#D4AF37]/20 bg-[#161512] p-4">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#E6C76A]">
                <UserRound className="h-3.5 w-3.5" aria-hidden="true" />
                <span>
                  {locale === 'en' ? 'Patient Notes' : 'ملاحظات المريض'}
                </span>
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-[#F7F3E9]">
                {booking.notes}
              </p>
            </div>
          )}

          {/* Status */}
          <div>
            <label
              htmlFor="detail-status"
              className="mb-1.5 block text-xs font-bold text-[#E6C76A]"
            >
              {locale === 'en' ? 'Appointment Status' : 'حالة الموعد'}
            </label>
            <select
              id="detail-status"
              value={status}
              onChange={(e) => setStatus(e.target.value as BookingStatus)}
              className="w-full rounded-xl border border-[#D4AF37]/25 bg-[#0A0908] px-3.5 py-2.5 text-sm font-semibold text-[#F7F3E9] focus:border-[#E6C76A] focus:outline-none"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option
                  key={opt.value}
                  value={opt.value}
                  className="bg-[#161512] text-[#F7F3E9]"
                >
                  {locale === 'en' ? opt.labelEn : opt.labelAr}
                </option>
              ))}
            </select>
          </div>

          {/* Branch & Service */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="detail-branch"
                className="mb-1.5 block text-xs font-bold text-[#E6C76A]"
              >
                {locale === 'en' ? 'Branch' : 'الفرع'}
              </label>
              <select
                id="detail-branch"
                value={branchId}
                onChange={(e) => setBranchId(e.target.value as BranchId)}
                className="w-full rounded-xl border border-[#D4AF37]/25 bg-[#0A0908] px-3.5 py-2.5 text-sm text-[#F7F3E9] focus:border-[#E6C76A] focus:outline-none"
              >
                {CLINIC_BRANCHES.map((b) => (
                  <option key={b.id} value={b.id} className="bg-[#161512]">
                    {locale === 'en' ? b.nameEn : b.nameAr}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="detail-service"
                className="mb-1.5 block text-xs font-bold text-[#E6C76A]"
              >
                {locale === 'en' ? 'Service' : 'الخدمة الطبية'}
              </label>
              <select
                id="detail-service"
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
                className="w-full rounded-xl border border-[#D4AF37]/25 bg-[#0A0908] px-3.5 py-2.5 text-sm text-[#F7F3E9] focus:border-[#E6C76A] focus:outline-none"
              >
                {DENTAL_SERVICES.map((srv) => (
                  <option key={srv.id} value={srv.id} className="bg-[#161512]">
                    {locale === 'en' ? srv.titleEn : srv.titleAr}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Reschedule Date & Time */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="detail-date"
                className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-[#E6C76A]"
              >
                <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{locale === 'en' ? 'Date' : 'التاريخ'}</span>
              </label>
              <input
                id="detail-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-[#D4AF37]/25 bg-[#0A0908] px-3.5 py-2.5 text-sm text-[#F7F3E9] focus:border-[#E6C76A] focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="detail-time"
                className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-[#E6C76A]"
              >
                <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{locale === 'en' ? 'Time Slot' : 'الساعة'}</span>
              </label>
              <select
                id="detail-time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full rounded-xl border border-[#D4AF37]/25 bg-[#0A0908] px-3.5 py-2.5 text-sm text-[#F7F3E9] focus:border-[#E6C76A] focus:outline-none"
              >
                {slots.length === 0 ? (
                  <option value={time} className="bg-[#161512]">
                    {formatTimeLocalized(time, locale)}
                  </option>
                ) : (
                  slots.map((s) => (
                    <option
                      key={s.time}
                      value={s.time}
                      disabled={!s.available}
                      className="bg-[#161512]"
                    >
                      {locale === 'en' ? s.labelEn : s.labelAr}
                      {!s.available
                        ? locale === 'en'
                          ? ' (Booked)'
                          : ' (محجوز)'
                        : ''}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          {/* Internal Reception Notes */}
          <div>
            <label
              htmlFor="detail-admin-notes"
              className="mb-1.5 block text-xs font-bold text-[#E6C76A]"
            >
              {locale === 'en'
                ? 'Internal Reception Notes'
                : 'ملاحظات الاستقبال الداخلية'}
            </label>
            <textarea
              id="detail-admin-notes"
              rows={3}
              maxLength={BLUEPRINT_LIMITS.adminNotesMax}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder={
                locale === 'en'
                  ? 'Add confirmation call status, follow-up reminders, or doctor notes...'
                  : 'سجّل حالة التواصل الهاتفي، أو تفاصيل المتابعة، أو ملاحظات الطبيب...'
              }
              className="w-full rounded-xl border border-[#D4AF37]/25 bg-[#0A0908] px-3.5 py-2.5 text-sm text-[#F7F3E9] placeholder:text-[#9E9580]/60 focus:border-[#E6C76A] focus:outline-none"
            />
          </div>

          {errorMessage && (
            <p className="rounded-xl border border-[#E65757]/35 bg-[#E65757]/10 px-3.5 py-2 text-xs font-medium text-[#E65757]">
              {errorMessage}
            </p>
          )}

          {/* Save Button */}
          <button
            type="submit"
            disabled={saving}
            className="inline-flex w-full min-h-[46px] items-center justify-center gap-2 rounded-full bg-[#D4AF37] px-6 py-3 text-sm font-bold text-[#080808] transition-colors hover:bg-[#E6C76A] disabled:opacity-60 cursor-pointer"
          >
            <Save className="h-4 w-4" aria-hidden="true" />
            <span>
              {saving
                ? locale === 'en'
                  ? 'Saving changes...'
                  : 'جاري حفظ التعديلات...'
                : locale === 'en'
                  ? 'Save Changes'
                  : 'حفظ التعديلات'}
            </span>
          </button>

          {/* Danger Zone: Inline Two-Step Delete */}
          <div className="rounded-2xl border border-[#E65757]/25 bg-[#1A1111] p-4">
            {!confirmDeleteStep ? (
              <button
                type="button"
                onClick={() => setConfirmDeleteStep(true)}
                className="inline-flex items-center gap-2 text-xs font-bold text-[#E65757] hover:underline cursor-pointer"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                <span>
                  {locale === 'en'
                    ? 'Permanently delete this booking'
                    : 'حذف هذا الحجز نهائياً من قاعدة البيانات'}
                </span>
              </button>
            ) : (
              <div className="space-y-3">
                <p className="text-xs font-semibold text-[#F7F3E9]">
                  {locale === 'en'
                    ? 'Are you sure you want to permanently delete this booking and release its time slot?'
                    : 'هل أنت متأكد من حذف هذا الحجز نهائياً وتحرير الساعة المخصصة له؟'}
                </p>
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    disabled={deleting}
                    onClick={handleDelete}
                    className="rounded-full bg-[#E65757] px-4 py-1.5 text-xs font-bold text-white hover:bg-[#f06b6b] disabled:opacity-60 cursor-pointer"
                  >
                    {deleting
                      ? locale === 'en'
                        ? 'Deleting...'
                        : 'جاري الحذف...'
                      : locale === 'en'
                        ? 'Confirm Delete'
                        : 'تأكيد الحذف النهائي'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteStep(false)}
                    className="rounded-full border border-[#D4AF37]/25 bg-[#12110E] px-4 py-1.5 text-xs font-semibold text-[#C8BFA8] hover:text-[#F7F3E9] cursor-pointer"
                  >
                    {locale === 'en' ? 'Cancel' : 'تراجع'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
