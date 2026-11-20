'use client';

import { useMemo } from 'react';
import {
  Activity,
  BarChart3,
  Building2,
  CheckCircle2,
  MessageSquare,
  Star,
  TrendingUp,
} from 'lucide-react';
import { BookingRecord } from '@/lib/booking-logic';
import { InquiryRecord, PatientReviewRecord } from '@/lib/clinic-engagement';
import { computeClinicAnalytics } from '@/lib/clinic-offers';
import { Locale } from '@/lib/i18n';

interface AdminAnalyticsPanelProps {
  bookings: BookingRecord[];
  inquiries: InquiryRecord[];
  reviews: PatientReviewRecord[];
  todayIso: string;
  locale: Locale;
}

export default function AdminAnalyticsPanel({
  bookings,
  inquiries,
  reviews,
  todayIso,
  locale,
}: AdminAnalyticsPanelProps) {
  const analytics = useMemo(
    () => computeClinicAnalytics(bookings, inquiries, reviews, todayIso),
    [bookings, inquiries, reviews, todayIso]
  );

  const maxDailyLoad = Math.max(
    1,
    ...analytics.nextSevenDaysLoad.map((d) => d.count)
  );

  return (
    <div className="space-y-6">
      {/* Executive Rate KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-[22px] border border-emerald-500/30 bg-[#101512] p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-300">
              {locale === 'en' ? 'Confirmation Rate' : 'معدل تأكيد الحجوزات'}
            </span>
            <CheckCircle2 className="h-5 w-5 text-emerald-400" aria-hidden="true" />
          </div>
          <p className="mt-2 text-3xl font-bold text-emerald-200 tabular-nums">
            {analytics.confirmationRatePercent}%
          </p>
          <p className="mt-1.5 text-xs text-[#C8BFA8]">
            {locale === 'en'
              ? `Completion: ${analytics.completionRatePercent}% · Cancelled: ${analytics.cancellationRatePercent}%`
              : `الإتمام: ${analytics.completionRatePercent}% · الإلغاء: ${analytics.cancellationRatePercent}%`}
          </p>
        </div>

        <div className="rounded-[22px] border border-[#D4AF37]/30 bg-[#16130D] p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#E6C76A]">
              {locale === 'en' ? 'Inquiry Response Rate' : 'معدل الرد على الرسائل'}
            </span>
            <MessageSquare className="h-5 w-5 text-[#E6C76A]" aria-hidden="true" />
          </div>
          <p className="mt-2 text-3xl font-bold text-[#E6C76A] tabular-nums">
            {analytics.inquiryReplyRatePercent}%
          </p>
          <p className="mt-1.5 text-xs text-[#C8BFA8]">
            {locale === 'en'
              ? `${inquiries.length} total inquiries received`
              : `إجمالي ${inquiries.length} رسالة تواصل`}
          </p>
        </div>

        <div className="rounded-[22px] border border-[#D4AF37]/25 bg-[#12110E] p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#C8BFA8]">
              {locale === 'en' ? 'Published Patient Rating' : 'متوسط تقييم المرضى'}
            </span>
            <Star className="h-5 w-5 fill-[#D4AF37] text-[#D4AF37]" aria-hidden="true" />
          </div>
          <p className="mt-2 text-3xl font-bold text-[#F7F3E9] tabular-nums">
            {analytics.averageApprovedRating.toFixed(1)}{' '}
            <span className="text-base font-medium text-[#9E9580]">/ 5</span>
          </p>
          <p className="mt-1.5 text-xs text-[#C8BFA8]">
            {locale === 'en'
              ? `${analytics.approvedReviewsCount} published reviews`
              : `${analytics.approvedReviewsCount} تقييم منشور`}
          </p>
        </div>

        <div className="rounded-[22px] border border-[#D4AF37]/25 bg-[#12110E] p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#C8BFA8]">
              {locale === 'en' ? 'Total Recorded Visits' : 'إجمالي الحجوزات المسجلة'}
            </span>
            <TrendingUp className="h-5 w-5 text-[#D4AF37]" aria-hidden="true" />
          </div>
          <p className="mt-2 text-3xl font-bold text-[#F7F3E9] tabular-nums">
            {analytics.totalBookings}
          </p>
          <p className="mt-1.5 text-xs text-[#C8BFA8]">
            {locale === 'en'
              ? 'Synced live across both Cairo branches'
              : 'متزامنة لحظياً بين فرعي القاهرة'}
          </p>
        </div>
      </div>

      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Service Demand Breakdown */}
        <div className="rounded-[26px] border border-[#D4AF37]/25 bg-[#12110E] p-6 lg:col-span-7">
          <div className="flex items-center gap-2.5">
            <BarChart3 className="h-5 w-5 text-[#D4AF37]" aria-hidden="true" />
            <h2 className="text-base font-bold text-[#F7F3E9]">
              {locale === 'en'
                ? 'Most Requested Dental Treatments'
                : 'توزيع الطلب حسب الخدمات الطبية'}
            </h2>
          </div>

          <div className="mt-5 space-y-4">
            {analytics.serviceDemand.map((srv) => (
              <div key={srv.serviceId} className="space-y-1.5">
                <div className="flex items-center justify-between gap-2 text-xs sm:text-sm">
                  <span className="font-semibold text-[#F7F3E9]">
                    {locale === 'en' ? srv.titleEn : srv.titleAr}
                  </span>
                  <span className="font-bold text-[#E6C76A] tabular-nums">
                    {srv.count} ({srv.sharePercent}%)
                  </span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#0A0908] border border-[#D4AF37]/15">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#D4AF37] to-[#E6C76A] transition-all duration-500"
                    style={{ width: `${Math.max(srv.sharePercent, srv.count > 0 ? 6 : 0)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Branch Performance + 7-Day Load */}
        <div className="space-y-6 lg:col-span-5">
          {/* Branch Split */}
          <div className="rounded-[26px] border border-[#D4AF37]/25 bg-[#12110E] p-6">
            <div className="flex items-center gap-2.5">
              <Building2 className="h-5 w-5 text-[#D4AF37]" aria-hidden="true" />
              <h2 className="text-base font-bold text-[#F7F3E9]">
                {locale === 'en'
                  ? 'Cairo Branch Split'
                  : 'مقارنة الإقبال بين الفرعين'}
              </h2>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-[#D4AF37]/25 bg-[#0A0908] p-4">
                <p className="text-xs font-semibold text-[#9E9580]">
                  {locale === 'en' ? 'Fifth Settlement' : 'التجمع الخامس'}
                </p>
                <p className="mt-1 text-2xl font-bold text-[#E6C76A] tabular-nums">
                  {analytics.branchSplit.fifthSettlement}
                </p>
                <p className="mt-0.5 text-xs text-[#C8BFA8] tabular-nums">
                  {analytics.branchSplit.fifthSettlementPercent}%
                </p>
              </div>

              <div className="rounded-2xl border border-[#D4AF37]/20 bg-[#0A0908] p-4">
                <p className="text-xs font-semibold text-[#9E9580]">
                  {locale === 'en' ? 'Nasr City' : 'مدينة نصر'}
                </p>
                <p className="mt-1 text-2xl font-bold text-[#F7F3E9] tabular-nums">
                  {analytics.branchSplit.nasrCity}
                </p>
                <p className="mt-0.5 text-xs text-[#C8BFA8] tabular-nums">
                  {analytics.branchSplit.nasrCityPercent}%
                </p>
              </div>
            </div>

            <div className="mt-4 flex h-3 w-full overflow-hidden rounded-full bg-[#0A0908] border border-[#D4AF37]/20">
              <div
                className="bg-[#D4AF37] transition-all duration-500"
                style={{ width: `${analytics.branchSplit.fifthSettlementPercent}%` }}
              />
              <div
                className="bg-[#5C4E2A] transition-all duration-500"
                style={{ width: `${analytics.branchSplit.nasrCityPercent}%` }}
              />
            </div>
          </div>

          {/* Next 7 Days Load */}
          <div className="rounded-[26px] border border-[#D4AF37]/25 bg-[#12110E] p-6">
            <div className="flex items-center gap-2.5">
              <Activity className="h-5 w-5 text-[#D4AF37]" aria-hidden="true" />
              <h2 className="text-base font-bold text-[#F7F3E9]">
                {locale === 'en'
                  ? 'Upcoming 7-Day Booking Load'
                  : 'حجم المواعيد للأيام السبعة القادمة'}
              </h2>
            </div>

            <div className="mt-5 grid grid-cols-7 items-end gap-2 h-36 pt-4">
              {analytics.nextSevenDaysLoad.map((day) => {
                const heightPct =
                  day.count === 0 ? 10 : Math.round((day.count / maxDailyLoad) * 100);
                return (
                  <div
                    key={day.date}
                    className="flex h-full flex-col items-center justify-end gap-1.5"
                  >
                    <span className="text-[11px] font-bold text-[#E6C76A] tabular-nums">
                      {day.count}
                    </span>
                    <div className="flex w-full flex-1 items-end justify-center">
                      <div
                        className={`w-full max-w-[26px] rounded-t-lg transition-all duration-500 ${
                          day.count > 0
                            ? 'bg-gradient-to-t from-[#B8942B] to-[#E6C76A]'
                            : 'bg-[#1D1B16]'
                        }`}
                        style={{ height: `${Math.max(heightPct, 10)}%` }}
                      />
                    </div>
                    <span
                      dir="ltr"
                      className="text-[10px] font-medium text-[#9E9580] tabular-nums"
                    >
                      {day.date.slice(5)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
