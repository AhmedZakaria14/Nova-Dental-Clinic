'use client';

import { useMemo, useState } from 'react';
import {
  Archive,
  CheckCircle2,
  Clock,
  Download,
  Inbox,
  MessageCircle,
  Phone,
  Search,
  Trash2,
} from 'lucide-react';
import {
  AdminInquiryFilters,
  buildInquiriesCsv,
  buildInquiryWhatsAppReplyUrl,
  computeInquiryMetrics,
  filterAdminInquiries,
  InquiryBranchId,
  InquiryRecord,
  InquiryStatus,
} from '@/lib/clinic-engagement';
import {
  deleteAdminInquiry,
  updateAdminInquiry,
} from '@/lib/firestore-engagement';
import { Locale } from '@/lib/i18n';

const INQUIRY_STATUS_STYLES: Record<
  InquiryStatus,
  { badge: string; labelAr: string; labelEn: string }
> = {
  new: {
    badge: 'border-amber-500/40 bg-amber-950/60 text-amber-300',
    labelAr: 'جديدة',
    labelEn: 'New',
  },
  'in-progress': {
    badge: 'border-sky-500/40 bg-sky-950/60 text-sky-300',
    labelAr: 'قيد المتابعة',
    labelEn: 'In Progress',
  },
  replied: {
    badge: 'border-emerald-500/40 bg-emerald-950/60 text-emerald-300',
    labelAr: 'تم الرد',
    labelEn: 'Replied',
  },
  archived: {
    badge: 'border-zinc-500/35 bg-zinc-900/80 text-zinc-300',
    labelAr: 'مؤرشفة',
    labelEn: 'Archived',
  },
};

function formatBranchLabel(branchId: InquiryBranchId, locale: Locale): string {
  if (branchId === 'fifth-settlement') {
    return locale === 'en' ? 'Fifth Settlement' : 'التجمع الخامس';
  }
  if (branchId === 'nasr-city') {
    return locale === 'en' ? 'Nasr City' : 'مدينة نصر';
  }
  return locale === 'en' ? 'General' : 'استفسار عام';
}

interface AdminInquiriesPanelProps {
  inquiries: InquiryRecord[];
  loading: boolean;
  locale: Locale;
  onNotify: (message: string) => void;
  onError: (message: string) => void;
}

export default function AdminInquiriesPanel({
  inquiries,
  loading,
  locale,
  onNotify,
  onError,
}: AdminInquiriesPanelProps) {
  const [filters, setFilters] = useState<AdminInquiryFilters>({
    search: '',
    status: 'all',
    branch: 'all',
  });
  const [busyId, setBusyId] = useState<string | null>(null);
  const [notesDraft, setNotesDraft] = useState<Record<string, string>>({});
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const metrics = useMemo(() => computeInquiryMetrics(inquiries), [inquiries]);
  const filtered = useMemo(
    () => filterAdminInquiries(inquiries, filters),
    [inquiries, filters]
  );

  const handleStatusChange = async (
    item: InquiryRecord,
    newStatus: InquiryStatus
  ) => {
    setBusyId(item.id);
    try {
      await updateAdminInquiry({
        inquiryId: item.id,
        status: newStatus,
        adminNotes: notesDraft[item.id] ?? item.adminNotes ?? '',
      });
      onNotify(
        locale === 'en'
          ? `Inquiry ${item.referenceCode} marked as ${INQUIRY_STATUS_STYLES[newStatus].labelEn}.`
          : `تم تحديث حالة الرسالة ${item.referenceCode} إلى (${INQUIRY_STATUS_STYLES[newStatus].labelAr}).`
      );
    } catch {
      onError(
        locale === 'en'
          ? 'Failed to update inquiry status.'
          : 'تعذر تحديث حالة الرسالة حالياً.'
      );
    } finally {
      setBusyId(null);
    }
  };

  const handleSaveNote = async (item: InquiryRecord) => {
    setBusyId(item.id);
    try {
      await updateAdminInquiry({
        inquiryId: item.id,
        status: item.status,
        adminNotes: notesDraft[item.id] ?? item.adminNotes ?? '',
      });
      onNotify(
        locale === 'en'
          ? `Saved notes for ${item.referenceCode}.`
          : `تم حفظ ملاحظات الإدارة للرسالة ${item.referenceCode}.`
      );
    } catch {
      onError(
        locale === 'en' ? 'Failed to save notes.' : 'تعذر حفظ الملاحظات حالياً.'
      );
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (item: InquiryRecord) => {
    setBusyId(item.id);
    try {
      await deleteAdminInquiry(item.id);
      setConfirmDeleteId(null);
      onNotify(
        locale === 'en'
          ? `Deleted inquiry ${item.referenceCode}.`
          : `تم حذف الرسالة ${item.referenceCode}.`
      );
    } catch {
      onError(
        locale === 'en' ? 'Failed to delete inquiry.' : 'تعذر حذف الرسالة حالياً.'
      );
    } finally {
      setBusyId(null);
    }
  };

  const handleExportCsv = () => {
    const csv = buildInquiriesCsv(filtered, locale);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `nova-dental-inquiries.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* KPI Strip */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <button
          type="button"
          onClick={() => setFilters((f) => ({ ...f, status: 'all' }))}
          className="rounded-[22px] border border-[#D4AF37]/25 bg-[#12110E] p-5 text-start transition-colors hover:border-[#E6C76A]/60 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#9E9580]">
              {locale === 'en' ? 'Total Inquiries' : 'إجمالي الرسائل'}
            </span>
            <Inbox className="h-5 w-5 text-[#D4AF37]" aria-hidden="true" />
          </div>
          <p className="mt-2 text-3xl font-bold text-[#F7F3E9] tabular-nums">
            {metrics.total}
          </p>
        </button>

        <button
          type="button"
          onClick={() => setFilters((f) => ({ ...f, status: 'new' }))}
          className="rounded-[22px] border border-amber-500/35 bg-[#16130D] p-5 text-start transition-colors hover:border-amber-400 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-300">
              {locale === 'en' ? 'New / Unread' : 'رسائل جديدة'}
            </span>
            <Clock className="h-5 w-5 text-amber-400" aria-hidden="true" />
          </div>
          <p className="mt-2 text-3xl font-bold text-amber-200 tabular-nums">
            {metrics.unreadCount}
          </p>
        </button>

        <button
          type="button"
          onClick={() => setFilters((f) => ({ ...f, status: 'replied' }))}
          className="rounded-[22px] border border-emerald-500/30 bg-[#101512] p-5 text-start transition-colors hover:border-emerald-400 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-300">
              {locale === 'en' ? 'Replied' : 'تم الرد عليها'}
            </span>
            <CheckCircle2
              className="h-5 w-5 text-emerald-400"
              aria-hidden="true"
            />
          </div>
          <p className="mt-2 text-3xl font-bold text-emerald-200 tabular-nums">
            {metrics.repliedCount}
          </p>
        </button>

        <button
          type="button"
          onClick={() => setFilters((f) => ({ ...f, status: 'archived' }))}
          className="rounded-[22px] border border-zinc-600/35 bg-[#12110E] p-5 text-start transition-colors hover:border-zinc-400 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-300">
              {locale === 'en' ? 'Archived' : 'مؤرشفة'}
            </span>
            <Archive className="h-5 w-5 text-zinc-400" aria-hidden="true" />
          </div>
          <p className="mt-2 text-3xl font-bold text-zinc-200 tabular-nums">
            {metrics.archivedCount}
          </p>
        </button>
      </div>

      {/* Filters + CSV Export */}
      <div className="grid grid-cols-1 gap-3 rounded-[24px] border border-[#D4AF37]/20 bg-[#12110E] p-4 md:grid-cols-12">
        <div className="relative md:col-span-5">
          <Search
            className="pointer-events-none absolute top-1/2 start-3.5 h-4 w-4 -translate-y-1/2 text-[#9E9580]"
            aria-hidden="true"
          />
          <input
            type="search"
            value={filters.search}
            onChange={(e) =>
              setFilters((f) => ({ ...f, search: e.target.value }))
            }
            placeholder={
              locale === 'en'
                ? 'Search sender, phone, subject, or INQ-code...'
                : 'ابحث بالاسم، رقم الهاتف، الموضوع، أو المرجع...'
            }
            className="w-full rounded-xl border border-[#D4AF37]/20 bg-[#0A0908] py-2.5 ps-10 pe-3.5 text-sm text-[#F7F3E9] placeholder:text-[#9E9580]/70 focus:border-[#E6C76A] focus:outline-none"
          />
        </div>

        <div className="md:col-span-3">
          <select
            aria-label={
              locale === 'en' ? 'Filter inquiries by branch' : 'تصفية حسب الفرع'
            }
            value={filters.branch}
            onChange={(e) =>
              setFilters((f) => ({
                ...f,
                branch: e.target.value as 'all' | InquiryBranchId,
              }))
            }
            className="w-full rounded-xl border border-[#D4AF37]/20 bg-[#0A0908] px-3.5 py-2.5 text-sm text-[#F7F3E9] focus:border-[#E6C76A] focus:outline-none"
          >
            <option value="all" className="bg-[#161512]">
              {locale === 'en' ? 'All Branches' : 'جميع الفروع'}
            </option>
            <option value="fifth-settlement" className="bg-[#161512]">
              {locale === 'en' ? 'Fifth Settlement' : 'التجمع الخامس'}
            </option>
            <option value="nasr-city" className="bg-[#161512]">
              {locale === 'en' ? 'Nasr City' : 'مدينة نصر'}
            </option>
            <option value="general" className="bg-[#161512]">
              {locale === 'en' ? 'General' : 'استفسار عام'}
            </option>
          </select>
        </div>

        <div className="md:col-span-2">
          <select
            aria-label={
              locale === 'en' ? 'Filter inquiries by status' : 'تصفية حسب الحالة'
            }
            value={filters.status}
            onChange={(e) =>
              setFilters((f) => ({
                ...f,
                status: e.target.value as 'all' | InquiryStatus,
              }))
            }
            className="w-full rounded-xl border border-[#D4AF37]/20 bg-[#0A0908] px-3.5 py-2.5 text-sm text-[#F7F3E9] focus:border-[#E6C76A] focus:outline-none"
          >
            <option value="all" className="bg-[#161512]">
              {locale === 'en' ? 'All Statuses' : 'جميع الحالات'}
            </option>
            {(Object.keys(INQUIRY_STATUS_STYLES) as InquiryStatus[]).map(
              (st) => (
                <option key={st} value={st} className="bg-[#161512]">
                  {locale === 'en'
                    ? INQUIRY_STATUS_STYLES[st].labelEn
                    : INQUIRY_STATUS_STYLES[st].labelAr}
                </option>
              )
            )}
          </select>
        </div>

        <div className="flex items-center justify-end md:col-span-2">
          <button
            type="button"
            onClick={handleExportCsv}
            disabled={filtered.length === 0}
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-[#D4AF37]/30 bg-[#161512] px-3.5 py-2.5 text-xs font-bold text-[#F7F3E9] hover:border-[#E6C76A] hover:text-[#E6C76A] disabled:opacity-50 cursor-pointer"
          >
            <Download className="h-3.5 w-3.5 text-[#D4AF37]" aria-hidden="true" />
            <span>{locale === 'en' ? 'Export CSV' : 'تصدير CSV'}</span>
          </button>
        </div>
      </div>

      {/* Inquiries List */}
      {loading ? (
        <div className="rounded-[24px] border border-[#D4AF37]/20 bg-[#12110E] p-12 text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-[#D4AF37]/25 border-t-[#D4AF37]" />
          <p className="mt-4 text-sm text-[#C8BFA8]">
            {locale === 'en'
              ? 'Loading contact inquiries...'
              : 'جاري تحميل رسائل التواصل...'}
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-[24px] border border-dashed border-[#D4AF37]/25 bg-[#12110E] p-12 text-center">
          <Inbox className="mx-auto h-10 w-10 text-[#D4AF37]/50" aria-hidden="true" />
          <h2 className="mt-3 text-lg font-bold text-[#F7F3E9]">
            {inquiries.length === 0
              ? locale === 'en'
                ? 'No contact messages yet'
                : 'لا توجد رسائل تواصل حتى الآن'
              : locale === 'en'
                ? 'No inquiries match your filters'
                : 'لا توجد رسائل تطابق الفلاتر الحالية'}
          </h2>
          <p className="mt-1 text-sm text-[#9E9580]">
            {locale === 'en'
              ? 'Messages submitted from /contact will appear here in real time.'
              : 'أي استفسار يرسله المرضى من صفحة «تواصل معنا» سيظهر هنا لحظياً.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => {
            const st = INQUIRY_STATUS_STYLES[item.status];
            const isBusy = busyId === item.id;
            const currentNote = notesDraft[item.id] ?? item.adminNotes ?? '';

            return (
              <article
                key={item.id}
                className="rounded-[24px] border border-[#D4AF37]/25 bg-[#12110E] p-5 sm:p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        dir="ltr"
                        className="rounded-md border border-[#D4AF37]/30 bg-[#1B1810] px-2.5 py-0.5 text-xs font-bold text-[#E6C76A] tabular-nums"
                      >
                        {item.referenceCode}
                      </span>
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${st.badge}`}
                      >
                        {locale === 'en' ? st.labelEn : st.labelAr}
                      </span>
                      <span className="rounded-full border border-[#D4AF37]/20 bg-[#0A0908] px-2.5 py-0.5 text-[11px] font-semibold text-[#C8BFA8]">
                        {formatBranchLabel(item.branchId, locale)}
                      </span>
                    </div>

                    <h3 className="mt-2.5 text-lg font-bold text-[#F7F3E9]">
                      {item.subject}
                    </h3>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-[#C8BFA8]">
                      <span className="font-bold text-[#F7F3E9]">
                        {item.name}
                      </span>
                      <a
                        href={`tel:+2${item.phone}`}
                        dir="ltr"
                        className="inline-flex items-center gap-1 font-semibold text-[#E6C76A] hover:underline tabular-nums"
                      >
                        <Phone className="h-3 w-3" aria-hidden="true" />
                        <span>{item.phone}</span>
                      </a>
                      <a
                        href={buildInquiryWhatsAppReplyUrl(item, locale)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-full border border-[#25D366]/35 bg-[#25D366]/10 px-2.5 py-0.5 font-bold text-[#25D366] hover:bg-[#25D366]/20"
                      >
                        <MessageCircle className="h-3 w-3" aria-hidden="true" />
                        <span>
                          {locale === 'en' ? 'Reply on WhatsApp' : 'رد عبر واتساب'}
                        </span>
                      </a>
                    </div>
                  </div>

                  {/* Quick Status Selector */}
                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      aria-label={
                        locale === 'en'
                          ? `Status for ${item.referenceCode}`
                          : `حالة الرسالة ${item.referenceCode}`
                      }
                      disabled={isBusy}
                      value={item.status}
                      onChange={(e) =>
                        handleStatusChange(item, e.target.value as InquiryStatus)
                      }
                      className="rounded-xl border border-[#D4AF37]/30 bg-[#0A0908] px-3 py-1.5 text-xs font-bold text-[#F7F3E9] focus:border-[#E6C76A] focus:outline-none"
                    >
                      {(Object.keys(INQUIRY_STATUS_STYLES) as InquiryStatus[]).map(
                        (key) => (
                          <option key={key} value={key} className="bg-[#161512]">
                            {locale === 'en'
                              ? INQUIRY_STATUS_STYLES[key].labelEn
                              : INQUIRY_STATUS_STYLES[key].labelAr}
                          </option>
                        )
                      )}
                    </select>

                    {confirmDeleteId === item.id ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => handleDelete(item)}
                          className="rounded-full bg-rose-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-rose-500 cursor-pointer"
                        >
                          {locale === 'en' ? 'Confirm Delete' : 'تأكيد الحذف'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(null)}
                          className="rounded-full border border-[#D4AF37]/25 px-2.5 py-1.5 text-xs text-[#C8BFA8] cursor-pointer"
                        >
                          {locale === 'en' ? 'Cancel' : 'إلغاء'}
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(item.id)}
                        aria-label={
                          locale === 'en'
                            ? `Delete inquiry ${item.referenceCode}`
                            : `حذف الرسالة ${item.referenceCode}`
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-xl border border-rose-500/25 bg-rose-950/30 text-rose-300 hover:bg-rose-950/60 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    )}
                  </div>
                </div>

                <p className="mt-4 rounded-2xl border border-[#D4AF37]/15 bg-[#0A0908] p-4 text-sm leading-relaxed text-[#F7F3E9]">
                  {item.message}
                </p>

                {/* Internal Admin Follow-up Note */}
                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <input
                    type="text"
                    value={currentNote}
                    onChange={(e) =>
                      setNotesDraft((prev) => ({
                        ...prev,
                        [item.id]: e.target.value,
                      }))
                    }
                    placeholder={
                      locale === 'en'
                        ? 'Add internal reception follow-up note...'
                        : 'أضف ملاحظة داخلية لمتابعة الاستقبال...'
                    }
                    className="flex-1 rounded-xl border border-[#D4AF37]/20 bg-[#0A0908] px-3.5 py-2 text-xs text-[#F7F3E9] placeholder:text-[#9E9580]/60 focus:border-[#E6C76A] focus:outline-none"
                  />
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => handleSaveNote(item)}
                    className="rounded-xl border border-[#D4AF37]/35 bg-[#1B1810] px-4 py-2 text-xs font-bold text-[#E6C76A] hover:bg-[#D4AF37] hover:text-[#080808] disabled:opacity-50 cursor-pointer"
                  >
                    {locale === 'en' ? 'Save Note' : 'حفظ الملاحظة'}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
