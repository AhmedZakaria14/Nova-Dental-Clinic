'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  MapPin,
  MessageSquarePlus,
  Quote,
  Send,
  Star,
} from 'lucide-react';
import {
  BranchId,
  CLINIC_BRANCHES,
  DENTAL_SERVICES,
  PATIENT_TESTIMONIALS,
} from '@/lib/clinic-data';
import {
  computeReviewSummary,
  PatientReviewRecord,
} from '@/lib/clinic-engagement';
import {
  createFirestoreReview,
  EngagementValidationError,
  subscribeApprovedReviews,
} from '@/lib/firestore-engagement';
import { useLanguage } from '@/components/LanguageProvider';

export default function PatientReviewsHub() {
  const { locale } = useLanguage();
  const [approvedReviews, setApprovedReviews] = useState<PatientReviewRecord[]>(
    []
  );
  const [branchFilter, setBranchFilter] = useState<'all' | BranchId>('all');

  // Review Submission Form State
  const [patientName, setPatientName] = useState('');
  const [branchId, setBranchId] = useState<BranchId>('fifth-settlement');
  const [treatment, setTreatment] = useState(
    locale === 'en'
      ? DENTAL_SERVICES[0].titleEn
      : DENTAL_SERVICES[0].titleAr
  );
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submittedOk, setSubmittedOk] = useState(false);

  useEffect(() => {
    let active = true;
    const unsub = subscribeApprovedReviews(
      (items) => {
        if (!active) return;
        setApprovedReviews(items);
      },
      () => {
        // Fallback gracefully to verified clinic testimonials on transient network error
      }
    );
    return () => {
      active = false;
      unsub();
    };
  }, []);

  // Merge live approved Firestore reviews with curated clinic testimonials
  const combinedReviews = useMemo(() => {
    const staticConverted: PatientReviewRecord[] = PATIENT_TESTIMONIALS.map(
      (item, idx) => ({
        id: `clinic-${item.id}`,
        patientName:
          locale === 'en' ? item.patientNameEn : item.patientNameAr,
        branchId: idx % 2 === 0 ? 'fifth-settlement' : 'nasr-city',
        treatment: locale === 'en' ? item.treatmentEn : item.treatmentAr,
        rating: 5,
        comment: locale === 'en' ? item.quoteEn : item.quoteAr,
        status: 'approved',
        featured: true,
        createdAt: '2026-10-01T12:00:00.000Z',
      })
    );
    return [...approvedReviews, ...staticConverted];
  }, [approvedReviews, locale]);

  const filteredReviews = useMemo(() => {
    if (branchFilter === 'all') return combinedReviews;
    return combinedReviews.filter((r) => r.branchId === branchFilter);
  }, [combinedReviews, branchFilter]);

  const summary = useMemo(
    () => computeReviewSummary(combinedReviews),
    [combinedReviews]
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    try {
      await createFirestoreReview({
        locale,
        patientName,
        branchId,
        treatment,
        rating,
        comment,
      });
      setSubmittedOk(true);
      setPatientName('');
      setComment('');
      setRating(5);
    } catch (err) {
      if (err instanceof EngagementValidationError) {
        setErrors(err.errors);
      } else {
        setErrors({
          form:
            locale === 'en'
              ? 'Unable to submit your review right now. Please try again.'
              : 'تعذر إرسال التقييم حالياً، يرجى المحاولة مرة أخرى.',
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="bg-[#11100E] py-14 sm:py-20">
      <div className="mx-auto max-w-[1300px] space-y-12 px-4 sm:px-6 lg:px-8">
        {/* Rating Summary & Branch Filter Bar */}
        <div className="grid grid-cols-1 gap-6 rounded-[30px] border border-[#D4AF37]/25 bg-[#161512] p-6 sm:p-8 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-4">
            <p className="text-xs font-bold text-[#D4AF37]">
              {locale === 'en'
                ? 'VERIFIED PATIENT SATISFACTION'
                : 'تقييمات مرضى عيادة نوفا'}
            </p>
            <div className="mt-2 flex items-baseline gap-3">
              <span className="text-5xl font-bold text-[#F7F3E9] tabular-nums">
                {summary.average.toFixed(1)}
              </span>
              <span className="text-sm font-semibold text-[#9E9580]">/ 5.0</span>
            </div>
            <div
              className="mt-2 flex items-center gap-1 text-[#E6C76A]"
              aria-label={`${summary.average} out of 5 stars`}
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className="h-4 w-4 fill-[#E6C76A] text-[#E6C76A]"
                  aria-hidden="true"
                />
              ))}
            </div>
            <p className="mt-2 text-xs text-[#C8BFA8]">
              {locale === 'en'
                ? `Based on ${summary.count} published patient reviews`
                : `استناداً إلى ${summary.count} تقييم منشور ومراجع`}
            </p>
          </div>

          <div className="space-y-2 lg:col-span-5">
            {([5, 4, 3, 2, 1] as const).map((star) => {
              const count = summary.distribution[star];
              const pct =
                summary.count > 0 ? Math.round((count / summary.count) * 100) : 0;
              return (
                <div key={star} className="flex items-center gap-3 text-xs">
                  <span className="flex w-10 items-center justify-end gap-1 font-bold text-[#E6C76A] tabular-nums">
                    <span>{star}</span>
                    <Star className="h-3 w-3 fill-[#E6C76A]" aria-hidden="true" />
                  </span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#0A0908]">
                    <div
                      className="h-full rounded-full bg-[#D4AF37]"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-8 text-end font-semibold text-[#9E9580] tabular-nums">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col gap-2.5 lg:col-span-3 lg:items-end">
            <span className="text-xs font-semibold text-[#9E9580]">
              {locale === 'en' ? 'Filter by Branch' : 'تصفية حسب الفرع'}
            </span>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  { id: 'all', labelAr: 'الكل', labelEn: 'All' },
                  {
                    id: 'fifth-settlement',
                    labelAr: 'التجمع الخامس',
                    labelEn: '5th Settlement',
                  },
                  {
                    id: 'nasr-city',
                    labelAr: 'مدينة نصر',
                    labelEn: 'Nasr City',
                  },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setBranchFilter(tab.id)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                    branchFilter === tab.id
                      ? 'bg-[#D4AF37] text-[#080808]'
                      : 'border border-[#D4AF37]/25 bg-[#0A0908] text-[#C8BFA8] hover:text-[#F7F3E9]'
                  }`}
                >
                  {locale === 'en' ? tab.labelEn : tab.labelAr}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredReviews.map((item) => (
            <article
              key={item.id}
              className="flex flex-col justify-between rounded-[28px] border border-[#D4AF37]/25 bg-[#161512] p-7 shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-[#D4AF37]/30 bg-[#D4AF37]/15 text-[#E6C76A]">
                    <Quote className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div className="flex items-center gap-0.5 text-[#E6C76A]">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`h-3.5 w-3.5 ${
                          s <= item.rating
                            ? 'fill-[#E6C76A] text-[#E6C76A]'
                            : 'text-[#D4AF37]/25'
                        }`}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                </div>

                <p className="mt-5 text-base leading-relaxed text-[#F7F3E9]">
                  “{item.comment}”
                </p>
              </div>

              <div className="mt-6 flex items-end justify-between gap-2 border-t border-[#D4AF37]/15 pt-4">
                <div>
                  <p className="font-bold text-[#F7F3E9]">{item.patientName}</p>
                  <p className="text-xs font-semibold text-[#D4AF37]">
                    {item.treatment}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full border border-[#D4AF37]/20 bg-[#0A0908] px-2.5 py-0.5 text-[10px] font-semibold text-[#C8BFA8]">
                  <MapPin className="h-3 w-3 text-[#D4AF37]" aria-hidden="true" />
                  <span>
                    {item.branchId === 'nasr-city'
                      ? locale === 'en'
                        ? 'Nasr City'
                        : 'مدينة نصر'
                      : locale === 'en'
                        ? '5th Settlement'
                        : 'التجمع الخامس'}
                  </span>
                </span>
              </div>
            </article>
          ))}
        </div>

        {/* Submit a New Review Form (Persisted to Firestore for Admin Approval) */}
        <div
          id="write-review"
          className="mx-auto max-w-3xl rounded-[30px] border border-[#D4AF37]/30 bg-[#161512] p-6 shadow-2xl sm:p-9"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#D4AF37]/30 bg-[#1B1810] text-[#E6C76A]">
              <MessageSquarePlus className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-[#F7F3E9] sm:text-2xl">
                {locale === 'en'
                  ? 'Share Your Experience at NOVA'
                  : 'شاركنا تجربتك في عيادة نوفا'}
              </h2>
              <p className="text-xs text-[#C8BFA8] sm:text-sm">
                {locale === 'en'
                  ? 'All submitted patient reviews are verified by our clinic team before publication.'
                  : 'تتم مراجعة جميع التقييمات من إدارة العيادة قبل نشرها لضمان مصداقية التجارب.'}
              </p>
            </div>
          </div>

          {submittedOk ? (
            <div className="mt-6 rounded-2xl border border-emerald-500/35 bg-emerald-950/40 p-6 text-center">
              <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-400" />
              <h3 className="mt-3 text-lg font-bold text-[#F7F3E9]">
                {locale === 'en'
                  ? 'Thank You for Your Review!'
                  : 'شكراً لمشاركة تجربتك معنا!'}
              </h3>
              <p className="mt-1.5 text-sm text-[#C8BFA8]">
                {locale === 'en'
                  ? 'Your review has been saved and will appear on this page once approved by clinic administration.'
                  : 'تم استلام تقييمك بنجاح وسيظهر في هذه الصفحة فور اعتماده من إدارة العيادة.'}
              </p>
              <button
                type="button"
                onClick={() => setSubmittedOk(false)}
                className="mt-5 rounded-full bg-[#D4AF37] px-5 py-2 text-xs font-bold text-[#080808] hover:bg-[#E6C76A] cursor-pointer"
              >
                {locale === 'en' ? 'Write Another Review' : 'إضافة تقييم آخر'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
              {/* Star Rating Picker */}
              <div>
                <span className="mb-2 block text-xs font-bold text-[#E6C76A]">
                  {locale === 'en' ? 'Your Rating' : 'تقييمك العام'}
                </span>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      aria-label={
                        locale === 'en'
                          ? `Rate ${star} out of 5 stars`
                          : `تقييم ${star} من ٥ نجوم`
                      }
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#D4AF37]/25 bg-[#0A0908] transition-colors hover:border-[#E6C76A] cursor-pointer"
                    >
                      <Star
                        className={`h-5 w-5 ${
                          star <= rating
                            ? 'fill-[#E6C76A] text-[#E6C76A]'
                            : 'text-[#9E9580]/40'
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                  ))}
                  <span className="ms-2 text-xs font-bold text-[#F7F3E9] tabular-nums">
                    {rating} / 5
                  </span>
                </div>
                {errors.rating && (
                  <p className="mt-1 text-xs font-medium text-[#E65757]">
                    {errors.rating}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label
                    htmlFor="review-patient-name"
                    className="mb-1.5 block text-xs font-semibold text-[#F7F3E9]"
                  >
                    {locale === 'en' ? 'Your Name' : 'الاسم'}
                  </label>
                  <input
                    id="review-patient-name"
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder={
                      locale === 'en' ? 'e.g. Mariam A.' : 'مثال: مريم أحمد'
                    }
                    className="w-full rounded-xl border border-[#D4AF37]/25 bg-[#0A0908] px-3.5 py-2.5 text-sm text-[#F7F3E9] placeholder:text-[#9E9580]/60 focus:border-[#E6C76A] focus:outline-none"
                  />
                  {errors.patientName && (
                    <p className="mt-1 text-xs font-medium text-[#E65757]">
                      {errors.patientName}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="review-branch"
                    className="mb-1.5 block text-xs font-semibold text-[#F7F3E9]"
                  >
                    {locale === 'en' ? 'Branch Visited' : 'الفرع'}
                  </label>
                  <select
                    id="review-branch"
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
                    htmlFor="review-treatment"
                    className="mb-1.5 block text-xs font-semibold text-[#F7F3E9]"
                  >
                    {locale === 'en' ? 'Treatment' : 'الخدمة الطبية'}
                  </label>
                  <select
                    id="review-treatment"
                    value={treatment}
                    onChange={(e) => setTreatment(e.target.value)}
                    className="w-full rounded-xl border border-[#D4AF37]/25 bg-[#0A0908] px-3.5 py-2.5 text-sm text-[#F7F3E9] focus:border-[#E6C76A] focus:outline-none"
                  >
                    {DENTAL_SERVICES.map((srv) => {
                      const val = locale === 'en' ? srv.titleEn : srv.titleAr;
                      return (
                        <option key={srv.id} value={val} className="bg-[#161512]">
                          {val}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="review-comment"
                  className="mb-1.5 block text-xs font-semibold text-[#F7F3E9]"
                >
                  {locale === 'en' ? 'Your Experience' : 'تفاصيل تجربتك'}
                </label>
                <textarea
                  id="review-comment"
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={
                    locale === 'en'
                      ? 'Tell us about your visit, care quality, and results...'
                      : 'اكتب رأيك في الخدمة، العناية الطبية، والنتيجة...'
                  }
                  className="w-full rounded-xl border border-[#D4AF37]/25 bg-[#0A0908] px-3.5 py-2.5 text-sm text-[#F7F3E9] placeholder:text-[#9E9580]/60 focus:border-[#E6C76A] focus:outline-none"
                />
                {errors.comment && (
                  <p className="mt-1 text-xs font-medium text-[#E65757]">
                    {errors.comment}
                  </p>
                )}
              </div>

              {errors.form && (
                <p role="alert" className="text-xs font-medium text-[#E65757]">
                  {errors.form}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full bg-[#D4AF37] px-6 py-2.5 text-sm font-bold text-[#080808] transition-colors hover:bg-[#E6C76A] disabled:opacity-60 cursor-pointer"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
                <span>
                  {submitting
                    ? locale === 'en'
                      ? 'Submitting...'
                      : 'جاري الإرسال...'
                    : locale === 'en'
                      ? 'Submit Review'
                      : 'إرسال التقييم'}
                </span>
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
