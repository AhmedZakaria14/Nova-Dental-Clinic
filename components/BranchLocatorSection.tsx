'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  CalendarCheck,
  Clock,
  ExternalLink,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  Sparkles,
} from 'lucide-react';
import { CLINIC_INFO } from '@/lib/clinic-config';
import { BranchId, CLINIC_BRANCHES } from '@/lib/clinic-data';
import { getBranchLiveStatus } from '@/lib/clinic-engagement';
import { buildWhatsAppUrl } from '@/lib/whatsapp';
import { useLanguage } from '@/components/LanguageProvider';

interface BranchDetailMeta {
  id: BranchId;
  areaAr: string;
  areaEn: string;
  landmarkAr: string;
  landmarkEn: string;
  highlightsAr: string[];
  highlightsEn: string[];
  mapsUrl?: string;
}

const BRANCH_META: Record<BranchId, BranchDetailMeta> = {
  'fifth-settlement': {
    id: 'fifth-settlement',
    areaAr: 'التجمع الخامس — القاهرة الجديدة',
    areaEn: 'Fifth Settlement — New Cairo',
    landmarkAr: 'داخل مركز أوزون الطبي (Ozone Medical Center)',
    landmarkEn: 'Inside Ozone Medical Center',
    highlightsAr: [
      'موقف سيارات متاح داخل مركز أوزون الطبي',
      'أحدث أجهزة المسح الرقمي وتصميم الابتسامة DSD',
      'استقبال فوري للحجوزات المؤكدة والحالات التجميلية',
    ],
    highlightsEn: [
      'Convenient parking inside Ozone Medical Center',
      'Digital intraoral scanning & DSD smile studio',
      'Dedicated reception for scheduled and cosmetic visits',
    ],
    mapsUrl: CLINIC_INFO.googleMapsUrl,
  },
  'nasr-city': {
    id: 'nasr-city',
    areaAr: 'مدينة نصر — القاهرة',
    areaEn: 'Nasr City — Cairo',
    landmarkAr: 'موقع مركزي يسهل الوصول إليه من شرق ووسط القاهرة',
    landmarkEn: 'Central location easily accessible from East & Central Cairo',
    highlightsAr: [
      'متابعة كاملة لحالات الزراعة، التقويم الشفاف، وعلاج الجذور',
      'أرقام تواصل وحجز مخصصة للفرع مع تأكيد فوري عبر واتساب',
      'نفس بروتوكولات التعقيم الصارمة وجودة الخامات الأوروبية',
    ],
    highlightsEn: [
      'Full care for implants, clear aligners, and endodontics',
      'Dedicated branch phone lines with instant WhatsApp confirmation',
      'Identical sterilization standards and European dental materials',
    ],
  },
};

const WEEKLY_SCHEDULE = [
  { dayAr: 'السبت', dayEn: 'Saturday', open: true },
  { dayAr: 'الأحد', dayEn: 'Sunday', open: true },
  { dayAr: 'الاثنين', dayEn: 'Monday', open: true },
  { dayAr: 'الثلاثاء', dayEn: 'Tuesday', open: true },
  { dayAr: 'الأربعاء', dayEn: 'Wednesday', open: true },
  { dayAr: 'الخميس', dayEn: 'Thursday', open: true },
  { dayAr: 'الجمعة', dayEn: 'Friday', open: false },
];

export default function BranchLocatorSection() {
  const { locale } = useLanguage();
  const [selectedBranchId, setSelectedBranchId] =
    useState<BranchId>('fifth-settlement');

  const branch = useMemo(
    () =>
      CLINIC_BRANCHES.find((b) => b.id === selectedBranchId) ??
      CLINIC_BRANCHES[0],
    [selectedBranchId]
  );
  const meta = BRANCH_META[branch.id];
  const liveStatus = useMemo(
    () => getBranchLiveStatus(branch.openHour, branch.closeHour),
    [branch.openHour, branch.closeHour]
  );

  const whatsappUrl = buildWhatsAppUrl(
    CLINIC_INFO.primaryPhoneInternational,
    locale,
    branch.id === 'fifth-settlement' ? 'appointment-fifth' : 'appointment-nasr',
    locale === 'en'
      ? `Please share the exact arrival location for the ${branch.nameEn} branch.`
      : `يرجى إرسال موقع الوصول الدقيق لفرع ${branch.nameAr}.`
  );

  return (
    <section
      aria-labelledby="branch-locator-heading"
      className="border-t border-[#D4AF37]/20 bg-[#0D0C0A] py-16 sm:py-20"
    >
      <div className="mx-auto max-w-[1300px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#E6C76A] sm:text-sm">
              <Navigation className="h-4 w-4 text-[#D4AF37]" aria-hidden="true" />
              <span>
                {locale === 'en'
                  ? 'CLINIC LOCATIONS & HOURS'
                  : 'فروع العيادة ومواعيد العمل'}
              </span>
            </div>
            <h2
              id="branch-locator-heading"
              className="mt-2.5 text-2xl font-bold text-[#F7F3E9] sm:text-4xl"
            >
              {locale === 'en' ? (
                <>
                  Visit{' '}
                  <span className="text-[#E6C76A]">NOVA Dental Clinic</span>
                </>
              ) : (
                <>
                  اختر الفرع الأقرب لك في{' '}
                  <span className="text-[#E6C76A]">القاهرة</span>
                </>
              )}
            </h2>
            <p className="mt-2.5 text-sm leading-relaxed text-[#C8BFA8] sm:text-base">
              {locale === 'en'
                ? 'Switch between our Fifth Settlement and Nasr City branches to view live working hours, direct reception lines, and instant booking.'
                : 'تنقّل بين فرعي التجمع الخامس ومدينة نصر لمعرفة حالة العمل الحالية بتوقيت القاهرة، أرقام الاستقبال المباشرة، وحجز موعدك فوراً.'}
            </p>
          </div>

          {/* Interactive Branch Switcher */}
          <div
            role="tablist"
            aria-label={locale === 'en' ? 'Clinic branches' : 'فروع العيادة'}
            className="inline-flex rounded-full border border-[#D4AF37]/30 bg-[#161512] p-1.5"
          >
            {CLINIC_BRANCHES.map((item) => {
              const active = item.id === selectedBranchId;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSelectedBranchId(item.id)}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-colors sm:px-5 sm:text-sm cursor-pointer ${
                    active
                      ? 'bg-[#D4AF37] text-[#080808]'
                      : 'text-[#C8BFA8] hover:text-[#F7F3E9]'
                  }`}
                >
                  <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>
                    {item.id === 'fifth-settlement'
                      ? locale === 'en'
                        ? 'Fifth Settlement'
                        : 'التجمع الخامس'
                      : locale === 'en'
                        ? 'Nasr City'
                        : 'مدينة نصر'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Branch Details Grid */}
        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Primary Branch Card */}
          <div className="rounded-[30px] border border-[#D4AF37]/30 bg-[#141310] p-6 shadow-2xl sm:p-8 lg:col-span-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#1B1810] px-3.5 py-1 text-xs font-bold text-[#E6C76A]">
                <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{locale === 'en' ? meta.areaEn : meta.areaAr}</span>
              </span>

              <span
                className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-xs font-bold ${
                  liveStatus.isOpen
                    ? 'border-emerald-500/40 bg-emerald-950/60 text-emerald-300'
                    : 'border-amber-500/40 bg-amber-950/50 text-amber-300'
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    liveStatus.isOpen ? 'bg-emerald-400' : 'bg-amber-400'
                  }`}
                />
                <span>
                  {locale === 'en' ? liveStatus.labelEn : liveStatus.labelAr}
                </span>
              </span>
            </div>

            <h3 className="mt-5 text-2xl font-bold text-[#F7F3E9]">
              {locale === 'en' ? branch.nameEn : branch.nameAr}
            </h3>
            <p className="mt-2 text-sm font-semibold text-[#E6C76A]">
              {locale === 'en' ? meta.landmarkEn : meta.landmarkAr}
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-[#C8BFA8]">
              {locale === 'en' ? branch.addressEn : branch.addressAr}
            </p>

            <ul className="mt-6 space-y-2.5">
              {(locale === 'en' ? meta.highlightsEn : meta.highlightsAr).map(
                (point) => (
                  <li
                    key={point}
                    className="flex items-start gap-2.5 text-sm text-[#F7F3E9]"
                  >
                    <Sparkles
                      className="mt-0.5 h-4 w-4 shrink-0 text-[#D4AF37]"
                      aria-hidden="true"
                    />
                    <span>{point}</span>
                  </li>
                )
              )}
            </ul>

            <div className="mt-7 grid grid-cols-1 gap-3 border-t border-[#D4AF37]/15 pt-6 sm:grid-cols-2">
              <a
                href={`tel:+2${branch.phone}`}
                className="flex items-center gap-3 rounded-2xl border border-[#D4AF37]/20 bg-[#0A0908] px-4 py-3 transition-colors hover:border-[#E6C76A]"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1B1810] text-[#E6C76A]">
                  <Phone className="h-4 w-4" aria-hidden="true" />
                </span>
                <div>
                  <span className="block text-[11px] text-[#9E9580]">
                    {locale === 'en' ? 'Branch Reception' : 'استقبال الفرع'}
                  </span>
                  <span
                    dir="ltr"
                    className="block text-sm font-bold text-[#F7F3E9] tabular-nums"
                  >
                    {branch.phone}
                  </span>
                </div>
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-2xl border border-[#25D366]/30 bg-[#25D366]/10 px-4 py-3 transition-colors hover:bg-[#25D366]/15"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#25D366]/20 text-[#25D366]">
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                </span>
                <div>
                  <span className="block text-[11px] text-[#C8BFA8]">
                    {locale === 'en' ? 'Instant Location Help' : 'واتساب الفرع'}
                  </span>
                  <span className="block text-sm font-bold text-[#25D366]">
                    {locale === 'en'
                      ? 'Request Exact Pin'
                      : 'اطلب اللوكيشن على واتساب'}
                  </span>
                </div>
              </a>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href={`/appointment?branch=${branch.id}`}
                className="inline-flex min-h-[46px] items-center gap-2 rounded-full bg-[#D4AF37] px-6 py-2.5 text-sm font-bold text-[#080808] transition-colors hover:bg-[#E6C76A]"
              >
                <CalendarCheck className="h-4 w-4" aria-hidden="true" />
                <span>
                  {locale === 'en'
                    ? 'Book at This Branch'
                    : 'احجز موعدك في هذا الفرع'}
                </span>
              </Link>

              {meta.mapsUrl && (
                <a
                  href={meta.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[46px] items-center gap-2 rounded-full border border-[#D4AF37]/35 bg-[#0A0908] px-5 py-2.5 text-sm font-semibold text-[#F7F3E9] transition-colors hover:border-[#E6C76A] hover:text-[#E6C76A]"
                >
                  <span>
                    {locale === 'en'
                      ? 'Open Official Directions'
                      : 'فتح الاتجاهات على الخريطة'}
                  </span>
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </a>
              )}
            </div>
          </div>

          {/* Weekly Hours Schedule Card */}
          <div className="flex flex-col justify-between rounded-[30px] border border-[#D4AF37]/25 bg-[#141310] p-6 shadow-xl sm:p-8 lg:col-span-5">
            <div>
              <div className="flex items-center gap-2.5">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#D4AF37]/30 bg-[#0A0908] text-[#E6C76A]">
                  <Clock className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-lg font-bold text-[#F7F3E9]">
                    {locale === 'en' ? 'Clinic Working Hours' : 'مواعيد العمل الأسبوعية'}
                  </h3>
                  <p className="text-xs text-[#9E9580]">
                    {locale === 'en'
                      ? liveStatus.sublabelEn
                      : liveStatus.sublabelAr}
                  </p>
                </div>
              </div>

              <div className="mt-6 divide-y divide-[#D4AF37]/15">
                {WEEKLY_SCHEDULE.map((row) => (
                  <div
                    key={row.dayEn}
                    className="flex items-center justify-between py-3 text-sm"
                  >
                    <span className="font-semibold text-[#F7F3E9]">
                      {locale === 'en' ? row.dayEn : row.dayAr}
                    </span>
                    {row.open ? (
                      <span
                        dir={locale === 'en' ? 'ltr' : 'rtl'}
                        className="font-semibold text-[#E6C76A] tabular-nums"
                      >
                        {locale === 'en'
                          ? '12:00 PM – 9:00 PM'
                          : '12:00 ظهراً – 9:00 مساءً'}
                      </span>
                    ) : (
                      <span className="rounded-full border border-rose-500/30 bg-rose-950/40 px-3 py-0.5 text-xs font-bold text-rose-300">
                        {locale === 'en' ? 'Closed' : 'عطلة أسبوعية'}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-[#D4AF37]/20 bg-[#0A0908] p-4 text-xs leading-relaxed text-[#C8BFA8]">
              {locale === 'en'
                ? 'Appointments are scheduled in advance to guarantee zero waiting time. Online booking stays open 24/7 for both branches.'
                : 'نعمل بنظام الحجز المسبق لضمان عدم الانتظار وتخصيص الوقت الكامل لكل حالة. الحجز الإلكتروني متاح طوال أيام الأسبوع على مدار الساعة.'}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
