'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  CalendarCheck,
  Clock,
  MapPin,
  MessageCircle,
  Sparkles,
  Tag,
} from 'lucide-react';
import { CLINIC_INFO } from '@/lib/clinic-config';
import { DENTAL_SERVICES } from '@/lib/clinic-data';
import {
  ClinicOfferRecord,
  DEFAULT_CLINIC_OFFERS,
  isOfferExpired,
  OfferBranchId,
} from '@/lib/clinic-offers';
import { getTodayIsoDate } from '@/lib/booking-logic';
import { subscribeActiveOffers } from '@/lib/firestore-offers';
import { buildWhatsAppUrl } from '@/lib/whatsapp';
import { useLanguage } from './LanguageProvider';
import FirebaseErrorBoundary from './FirebaseErrorBoundary';

function OffersShowcaseContent() {
  const { locale } = useLanguage();
  const todayIso = useMemo(() => getTodayIsoDate(), []);

  const [liveOffers, setLiveOffers] = useState<ClinicOfferRecord[]>([]);
  const [branchFilter, setBranchFilter] = useState<OfferBranchId>('all');

  useEffect(() => {
    let active = true;
    const unsubscribe = subscribeActiveOffers(
      (items) => {
        if (!active) return;
        setLiveOffers(items);
      },
      () => {
        // Fallback gracefully to curated clinic showcase offers
      }
    );
    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const displayedOffers = useMemo(() => {
    const activeNonExpired = liveOffers.filter(
      (o) => o.active && !isOfferExpired(o.validUntil, todayIso)
    );
    const source =
      activeNonExpired.length > 0 ? activeNonExpired : DEFAULT_CLINIC_OFFERS;

    if (branchFilter === 'all') {
      return source;
    }
    return source.filter(
      (o) => o.branchId === 'all' || o.branchId === branchFilter
    );
  }, [liveOffers, branchFilter, todayIso]);

  const formatBranchLabel = (branchId: OfferBranchId) => {
    if (branchId === 'fifth-settlement') {
      return locale === 'en' ? 'Fifth Settlement' : 'فرع التجمع الخامس';
    }
    if (branchId === 'nasr-city') {
      return locale === 'en' ? 'Nasr City' : 'فرع مدينة نصر';
    }
    return locale === 'en' ? 'Both Branches' : 'متاح في الفرعين';
  };

  return (
    <section className="bg-[#080808] py-16 sm:py-20">
      <div className="mx-auto max-w-[1300px] px-4 sm:px-6 lg:px-8">
        {/* Branch Filter Bar */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#E6C76A] sm:text-sm">
              <Sparkles className="h-4 w-4 text-[#D4AF37]" aria-hidden="true" />
              <span>
                {locale === 'en'
                  ? 'SEASONAL PACKAGES & CARE PLANS'
                  : 'باقات وعروض عيادة نوفا'}
              </span>
            </div>
            <h2 className="mt-2 text-2xl font-bold text-[#F7F3E9] sm:text-3xl">
              {locale === 'en'
                ? 'Choose the Right Package for Your Smile'
                : 'اختر الباقة الأنسب لابتسامتك'}
            </h2>
          </div>

          <div
            role="group"
            aria-label={
              locale === 'en' ? 'Filter offers by branch' : 'تصفية العروض حسب الفرع'
            }
            className="inline-flex flex-wrap rounded-full border border-[#D4AF37]/25 bg-[#12110E] p-1"
          >
            {(
              [
                { id: 'all', ar: 'الكل', en: 'All' },
                { id: 'fifth-settlement', ar: 'التجمع الخامس', en: '5th Settlement' },
                { id: 'nasr-city', ar: 'مدينة نصر', en: 'Nasr City' },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setBranchFilter(opt.id)}
                className={`rounded-full px-4 py-2 text-xs font-bold transition-colors sm:text-sm cursor-pointer ${
                  branchFilter === opt.id
                    ? 'bg-[#D4AF37] text-[#080808]'
                    : 'text-[#C8BFA8] hover:text-[#F7F3E9]'
                }`}
              >
                {locale === 'en' ? opt.en : opt.ar}
              </button>
            ))}
          </div>
        </div>

        {/* Offers Cards Grid */}
        {displayedOffers.length === 0 ? (
          <div className="mt-10 rounded-[28px] border border-dashed border-[#D4AF37]/25 bg-[#12110E] p-12 text-center">
            <Tag className="mx-auto h-10 w-10 text-[#D4AF37]/60" aria-hidden="true" />
            <h3 className="mt-3 text-lg font-bold text-[#F7F3E9]">
              {locale === 'en'
                ? 'No active offers for this branch right now'
                : 'لا توجد عروض مخصصة لهذا الفرع حالياً'}
            </h3>
            <p className="mt-1.5 text-sm text-[#9E9580]">
              {locale === 'en'
                ? 'Switch to All Branches or contact reception via WhatsApp for personalized treatment plans.'
                : 'جرّب عرض جميع الفروع أو تواصل مع الاستقبال لمعرفة أحدث الباقات المتاحة.'}
            </p>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {displayedOffers.map((offer) => {
              const service = DENTAL_SERVICES.find((s) => s.id === offer.serviceId);
              const targetBranch =
                offer.branchId === 'all' ? 'fifth-settlement' : offer.branchId;
              const bookingHref = `/appointment?service=${encodeURIComponent(
                offer.serviceId
              )}&branch=${encodeURIComponent(targetBranch)}`;
              const whatsappHref = buildWhatsAppUrl(
                CLINIC_INFO.primaryPhoneInternational,
                locale,
                targetBranch === 'nasr-city'
                  ? 'appointment-nasr'
                  : 'appointment-fifth',
                locale === 'en'
                  ? `I would like to inquire about the offer: ${offer.titleEn}`
                  : `أرغب في الاستفسار عن عرض: ${offer.titleAr}`
              );

              return (
                <article
                  key={offer.id}
                  className={`flex flex-col justify-between rounded-[28px] border p-6 sm:p-7 transition-all duration-300 ${
                    offer.featured
                      ? 'border-[#D4AF37]/60 bg-gradient-to-b from-[#1A160D] to-[#11100C] shadow-[0_20px_50px_rgba(212,175,55,0.12)]'
                      : 'border-[#D4AF37]/25 bg-[#12110E] hover:border-[#D4AF37]/45'
                  }`}
                >
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D4AF37]/40 bg-[#1B1810] px-3 py-1 text-xs font-bold text-[#E6C76A]">
                        <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>
                          {locale === 'en' ? offer.badgeEn : offer.badgeAr}
                        </span>
                      </span>

                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#C8BFA8]">
                        <MapPin className="h-3.5 w-3.5 text-[#D4AF37]" aria-hidden="true" />
                        <span>{formatBranchLabel(offer.branchId)}</span>
                      </span>
                    </div>

                    <h3 className="mt-5 text-xl font-bold leading-snug text-[#F7F3E9]">
                      {locale === 'en' ? offer.titleEn : offer.titleAr}
                    </h3>

                    <p className="mt-3 text-sm leading-relaxed text-[#C8BFA8]">
                      {locale === 'en'
                        ? offer.descriptionEn
                        : offer.descriptionAr}
                    </p>

                    <div className="mt-5 rounded-2xl border border-[#D4AF37]/25 bg-[#0A0908] p-4">
                      <p className="text-[11px] font-semibold text-[#9E9580]">
                        {locale === 'en' ? 'Package Benefit' : 'ميزة الباقة'}
                      </p>
                      <p className="mt-1 text-base font-bold text-[#E6C76A]">
                        {locale === 'en'
                          ? offer.priceLabelEn
                          : offer.priceLabelAr}
                      </p>
                      <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 border-t border-[#D4AF37]/15 pt-2.5 text-xs text-[#9E9580]">
                        <span>
                          {service
                            ? locale === 'en'
                              ? service.titleEn
                              : service.titleAr
                            : offer.serviceId}
                        </span>
                        <span className="inline-flex items-center gap-1 tabular-nums">
                          <Clock className="h-3 w-3 text-[#D4AF37]" aria-hidden="true" />
                          <span>
                            {locale === 'en' ? 'Until' : 'حتى'}{' '}
                            <span dir="ltr" className="inline-block">
                              {offer.validUntil}
                            </span>
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col gap-2.5">
                    <Link
                      href={bookingHref}
                      className="inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-full bg-[#D4AF37] px-5 py-2.5 text-sm font-bold text-[#080808] transition-colors hover:bg-[#E6C76A]"
                    >
                      <CalendarCheck className="h-4 w-4" aria-hidden="true" />
                      <span>
                        {locale === 'en'
                          ? 'Book This Offer Now'
                          : 'احجز هذا العرض الآن'}
                      </span>
                    </Link>

                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[42px] w-full items-center justify-center gap-2 rounded-full border border-[#25D366]/35 bg-[#25D366]/10 px-5 py-2 text-xs font-bold text-[#25D366] transition-colors hover:bg-[#25D366]/20"
                    >
                      <MessageCircle className="h-4 w-4" aria-hidden="true" />
                      <span>
                        {locale === 'en'
                          ? 'Ask Details on WhatsApp'
                          : 'استفسر عن التفاصيل عبر واتساب'}
                      </span>
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default function OffersShowcase() {
  return (
    <FirebaseErrorBoundary>
      <OffersShowcaseContent />
    </FirebaseErrorBoundary>
  );
}
