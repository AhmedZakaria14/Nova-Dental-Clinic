'use client';

import { useMemo, useState } from 'react';
import {
  CheckCircle2,
  Clock,
  MapPin,
  Sparkles,
  Star,
  Trash2,
  XCircle,
} from 'lucide-react';
import {
  PatientReviewRecord,
  ReviewStatus,
} from '@/lib/clinic-engagement';
import {
  deleteAdminReview,
  updateAdminReview,
} from '@/lib/firestore-engagement';
import { Locale } from '@/lib/i18n';

const REVIEW_STATUS_BADGE: Record<
  ReviewStatus,
  { cls: string; labelAr: string; labelEn: string }
> = {
  pending: {
    cls: 'border-amber-500/40 bg-amber-950/60 text-amber-300',
    labelAr: 'بانتظار المراجعة',
    labelEn: 'Pending',
  },
  approved: {
    cls: 'border-emerald-500/40 bg-emerald-950/60 text-emerald-300',
    labelAr: 'منشور بالموقع',
    labelEn: 'Published',
  },
  rejected: {
    cls: 'border-rose-500/35 bg-rose-950/50 text-rose-300',
    labelAr: 'مرفوض',
    labelEn: 'Rejected',
  },
};

interface AdminReviewsPanelProps {
  reviews: PatientReviewRecord[];
  loading: boolean;
  locale: Locale;
  onNotify: (message: string) => void;
  onError: (message: string) => void;
}

export default function AdminReviewsPanel({
  reviews,
  loading,
  locale,
  onNotify,
  onError,
}: AdminReviewsPanelProps) {
  const [statusFilter, setStatusFilter] = useState<'all' | ReviewStatus>('all');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const counts = useMemo(() => {
    let pending = 0;
    let approved = 0;
    let rejected = 0;
    for (const r of reviews) {
      if (r.status === 'pending') pending += 1;
      else if (r.status === 'approved') approved += 1;
      else rejected += 1;
    }
    return { total: reviews.length, pending, approved, rejected };
  }, [reviews]);

  const filtered = useMemo(() => {
    if (statusFilter === 'all') return reviews;
    return reviews.filter((r) => r.status === statusFilter);
  }, [reviews, statusFilter]);

  const handleModerate = async (
    review: PatientReviewRecord,
    status: ReviewStatus,
    featured: boolean
  ) => {
    setBusyId(review.id);
    try {
      await updateAdminReview({ reviewId: review.id, status, featured });
      onNotify(
        locale === 'en'
          ? `Review by ${review.patientName} updated.`
          : `تم تحديث حالة تقييم ${review.patientName}.`
      );
    } catch {
      onError(
        locale === 'en'
          ? 'Failed to update review.'
          : 'تعذر تحديث التقييم حالياً.'
      );
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (review: PatientReviewRecord) => {
    setBusyId(review.id);
    try {
      await deleteAdminReview(review.id);
      setConfirmDeleteId(null);
      onNotify(
        locale === 'en'
          ? `Deleted review by ${review.patientName}.`
          : `تم حذف تقييم ${review.patientName}.`
      );
    } catch {
      onError(
        locale === 'en' ? 'Failed to delete review.' : 'تعذر حذف التقييم حالياً.'
      );
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* KPI Filter Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <button
          type="button"
          onClick={() => setStatusFilter('all')}
          className="rounded-[22px] border border-[#D4AF37]/25 bg-[#12110E] p-5 text-start transition-colors hover:border-[#E6C76A]/60 cursor-pointer"
        >
          <span className="text-xs font-semibold text-[#9E9580]">
            {locale === 'en' ? 'Total Reviews' : 'إجمالي التقييمات'}
          </span>
          <p className="mt-2 text-3xl font-bold text-[#F7F3E9] tabular-nums">
            {counts.total}
          </p>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('pending')}
          className="rounded-[22px] border border-amber-500/35 bg-[#16130D] p-5 text-start transition-colors hover:border-amber-400 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-300">
              {locale === 'en' ? 'Pending Approval' : 'بانتظار الاعتماد'}
            </span>
            <Clock className="h-4 w-4 text-amber-400" aria-hidden="true" />
          </div>
          <p className="mt-2 text-3xl font-bold text-amber-200 tabular-nums">
            {counts.pending}
          </p>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('approved')}
          className="rounded-[22px] border border-emerald-500/30 bg-[#101512] p-5 text-start transition-colors hover:border-emerald-400 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-300">
              {locale === 'en' ? 'Published' : 'المنشورة'}
            </span>
            <CheckCircle2
              className="h-4 w-4 text-emerald-400"
              aria-hidden="true"
            />
          </div>
          <p className="mt-2 text-3xl font-bold text-emerald-200 tabular-nums">
            {counts.approved}
          </p>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('rejected')}
          className="rounded-[22px] border border-rose-500/30 bg-[#141010] p-5 text-start transition-colors hover:border-rose-400 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-300">
              {locale === 'en' ? 'Rejected' : 'المرفوضة'}
            </span>
            <XCircle className="h-4 w-4 text-rose-400" aria-hidden="true" />
          </div>
          <p className="mt-2 text-3xl font-bold text-rose-200 tabular-nums">
            {counts.rejected}
          </p>
        </button>
      </div>

      {/* Reviews Moderation List */}
      {loading ? (
        <div className="rounded-[24px] border border-[#D4AF37]/20 bg-[#12110E] p-12 text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-[#D4AF37]/25 border-t-[#D4AF37]" />
          <p className="mt-4 text-sm text-[#C8BFA8]">
            {locale === 'en'
              ? 'Loading patient reviews...'
              : 'جاري تحميل تقييمات المرضى...'}
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-[24px] border border-dashed border-[#D4AF37]/25 bg-[#12110E] p-12 text-center">
          <Star className="mx-auto h-10 w-10 text-[#D4AF37]/50" aria-hidden="true" />
          <h2 className="mt-3 text-lg font-bold text-[#F7F3E9]">
            {reviews.length === 0
              ? locale === 'en'
                ? 'No patient reviews submitted yet'
                : 'لا توجد تقييمات مرسلة من المرضى بعد'
              : locale === 'en'
                ? 'No reviews in this status'
                : 'لا توجد تقييمات في هذه الحالة'}
          </h2>
          <p className="mt-1 text-sm text-[#9E9580]">
            {locale === 'en'
              ? 'Reviews submitted on /testimonials appear here for moderation before publishing.'
              : 'أي تقييم يُرسل عبر صفحة «آراء المرضى» سيظهر هنا لاعتماده قبل النشر.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((review) => {
            const badge = REVIEW_STATUS_BADGE[review.status];
            const isBusy = busyId === review.id;

            return (
              <article
                key={review.id}
                className="rounded-[24px] border border-[#D4AF37]/25 bg-[#12110E] p-5 sm:p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${badge.cls}`}
                      >
                        {locale === 'en' ? badge.labelEn : badge.labelAr}
                      </span>
                      {review.featured && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-[#D4AF37]/40 bg-[#1B1810] px-2.5 py-0.5 text-[11px] font-bold text-[#E6C76A]">
                          <Sparkles className="h-3 w-3" aria-hidden="true" />
                          <span>{locale === 'en' ? 'Featured' : 'مميز'}</span>
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 rounded-full border border-[#D4AF37]/20 bg-[#0A0908] px-2.5 py-0.5 text-[11px] font-semibold text-[#C8BFA8]">
                        <MapPin className="h-3 w-3 text-[#D4AF37]" aria-hidden="true" />
                        <span>
                          {review.branchId === 'nasr-city'
                            ? locale === 'en'
                              ? 'Nasr City'
                              : 'مدينة نصر'
                            : locale === 'en'
                              ? 'Fifth Settlement'
                              : 'التجمع الخامس'}
                        </span>
                      </span>
                    </div>

                    <div className="mt-2.5 flex flex-wrap items-center gap-3">
                      <h3 className="text-base font-bold text-[#F7F3E9]">
                        {review.patientName}
                      </h3>
                      <span className="text-xs font-semibold text-[#D4AF37]">
                        {review.treatment}
                      </span>
                      <div className="flex items-center gap-0.5 text-[#E6C76A]">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`h-3.5 w-3.5 ${
                              s <= review.rating
                                ? 'fill-[#E6C76A] text-[#E6C76A]'
                                : 'text-[#D4AF37]/20'
                            }`}
                            aria-hidden="true"
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Moderation Actions */}
                  <div className="flex flex-wrap items-center gap-2">
                    {review.status !== 'approved' && (
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() =>
                          handleModerate(review, 'approved', review.featured)
                        }
                        className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600/25 border border-emerald-500/45 px-3.5 py-1.5 text-xs font-bold text-emerald-200 hover:bg-emerald-600/40 disabled:opacity-50 cursor-pointer"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>{locale === 'en' ? 'Publish' : 'اعتماد ونشر'}</span>
                      </button>
                    )}

                    {review.status === 'approved' && (
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() =>
                          handleModerate(review, 'approved', !review.featured)
                        }
                        className="inline-flex items-center gap-1.5 rounded-full border border-[#D4AF37]/35 bg-[#1B1810] px-3.5 py-1.5 text-xs font-bold text-[#E6C76A] hover:bg-[#D4AF37] hover:text-[#080808] disabled:opacity-50 cursor-pointer"
                      >
                        <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>
                          {review.featured
                            ? locale === 'en'
                              ? 'Unfeature'
                              : 'إلغاء التمييز'
                            : locale === 'en'
                              ? 'Feature'
                              : 'تمييز بالأعلى'}
                        </span>
                      </button>
                    )}

                    {review.status !== 'rejected' && (
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => handleModerate(review, 'rejected', false)}
                        className="inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-950/40 px-3 py-1.5 text-xs font-bold text-rose-300 hover:bg-rose-950/70 disabled:opacity-50 cursor-pointer"
                      >
                        <XCircle className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>{locale === 'en' ? 'Reject' : 'رفض'}</span>
                      </button>
                    )}

                    {confirmDeleteId === review.id ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => handleDelete(review)}
                          className="rounded-full bg-rose-600 px-3 py-1.5 text-xs font-bold text-white cursor-pointer"
                        >
                          {locale === 'en' ? 'Confirm' : 'تأكيد'}
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
                        onClick={() => setConfirmDeleteId(review.id)}
                        aria-label={
                          locale === 'en'
                            ? `Delete review by ${review.patientName}`
                            : `حذف تقييم ${review.patientName}`
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-xl border border-rose-500/25 bg-rose-950/30 text-rose-300 hover:bg-rose-950/60 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    )}
                  </div>
                </div>

                <p className="mt-4 rounded-2xl border border-[#D4AF37]/15 bg-[#0A0908] p-4 text-sm leading-relaxed text-[#F7F3E9]">
                  “{review.comment}”
                </p>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
