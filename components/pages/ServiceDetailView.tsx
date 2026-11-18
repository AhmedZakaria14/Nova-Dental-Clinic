'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Phone,
} from 'lucide-react';
import suiteImg from '@/src/assets/images/dental_treatment_suite_1794988565232.jpg';
import { CLINIC_INFO } from '@/lib/clinic-config';
import { DENTAL_SERVICES, DentalService } from '@/lib/clinic-data';
import { useLanguage } from '@/components/LanguageProvider';
import PageHeader from '@/components/PageHeader';
import AppointmentButton from '@/components/AppointmentButton';

export default function ServiceDetailView({
  service,
}: {
  service: DentalService;
}) {
  const { locale, dir, t } = useLanguage();
  const ArrowIcon = dir === 'rtl' ? ArrowLeft : ArrowRight;

  const title = locale === 'en' ? service.titleEn : service.titleAr;
  const category =
    locale === 'en' ? service.categoryLabelEn : service.categoryLabelAr;
  const summary = locale === 'en' ? service.summaryEn : service.summaryAr;
  const details = locale === 'en' ? service.detailsEn : service.detailsAr;
  const technology =
    locale === 'en' ? service.technologyEn : service.technologyAr;
  const highlights =
    locale === 'en' ? service.highlightsEn : service.highlightsAr;

  return (
    <>
      <PageHeader
        titlePrefix={title}
        subtitle={summary}
        breadcrumbs={[
          { label: t.nav.home, href: '/' },
          { label: t.nav.services, href: '/services' },
          { label: title },
        ]}
      />

      <section className="bg-[#080808] py-14 sm:py-20">
        <div className="mx-auto max-w-[1300px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            {/* Dentaire Service Sidebar */}
            <aside className="space-y-6 lg:col-span-4">
              <div className="rounded-[30px] border border-[#D4AF37]/25 bg-[#161512] p-6 sm:p-7">
                <h2 className="text-lg font-bold text-[#F7F3E9]">
                  {locale === 'en' ? 'Our Dental Services' : 'خدمات العيادة'}
                </h2>
                <ul className="mt-5 space-y-2.5">
                  {DENTAL_SERVICES.map((item) => {
                    const active = item.slug === service.slug;
                    return (
                      <li key={item.id}>
                        <Link
                          href={`/services/${item.slug}`}
                          className={`flex items-center justify-between rounded-[14px] px-4 py-3 text-sm font-bold transition-colors ${
                            active
                              ? 'bg-[#D4AF37] text-[#080808]'
                              : 'border border-[#D4AF37]/15 bg-[#0A0908] text-[#F7F3E9] hover:border-[#E6C76A] hover:text-[#E6C76A]'
                          }`}
                        >
                          <span>
                            {locale === 'en' ? item.titleEn : item.titleAr}
                          </span>
                          <ArrowIcon className="h-4 w-4 shrink-0" />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Gold Accent Sidebar CTA Box */}
              <div className="rounded-[30px] border border-[#E6C76A]/40 bg-gradient-to-br from-[#1C1810] via-[#14120E] to-[#0A0908] p-7 text-[#F7F3E9] shadow-2xl">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[#D4AF37]/35 bg-[#D4AF37]/15 text-[#E6C76A]">
                  <CalendarCheck className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-xl font-bold text-[#F7F3E9]">
                  {locale === 'en'
                    ? 'Ready to Schedule?'
                    : 'هل ترغب في حجز هذه الخدمة؟'}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#C8BFA8]">
                  {locale === 'en'
                    ? 'Book directly online or call our Fifth Settlement clinic team.'
                    : 'احجز موعدك إلكترونياً أو اتصل بفريق الاستقبال في التجمع الخامس.'}
                </p>

                <div className="mt-5 space-y-3">
                  <AppointmentButton
                    href={`/appointment?service=${service.id}`}
                    highlighted
                    className="w-full justify-between"
                  />
                  <a
                    href={CLINIC_INFO.primaryPhoneTel}
                    dir="ltr"
                    className="inline-flex w-full min-h-[44px] items-center justify-center gap-2 rounded-full border border-[#D4AF37]/40 bg-[#080808] px-5 py-2.5 text-sm font-bold text-[#E6C76A] transition-colors hover:bg-[#D4AF37] hover:text-[#080808] tabular-nums"
                  >
                    <Phone className="h-4 w-4" aria-hidden="true" />
                    <span>{CLINIC_INFO.primaryPhone}</span>
                  </a>
                </div>
              </div>
            </aside>

            {/* Main Service Content */}
            <div className="lg:col-span-8">
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[36px] border border-[#D4AF37]/25 bg-[#161512]">
                <Image
                  src={suiteImg}
                  alt={title}
                  fill
                  referrerPolicy="no-referrer"
                  sizes="(max-width: 1024px) 100vw, 820px"
                  className="object-cover"
                />
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-[#D4AF37]/35 bg-[#D4AF37]/15 px-4 py-1.5 text-xs font-bold text-[#E6C76A]">
                  {category}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D4AF37]/25 bg-[#161512] px-4 py-1.5 text-xs font-semibold text-[#F7F3E9]">
                  <Clock className="h-3.5 w-3.5 text-[#D4AF37]" />
                  <span>
                    {service.durationMinutes}{' '}
                    {locale === 'en' ? 'min session' : 'دقيقة للجلسة'}
                  </span>
                </span>
              </div>

              <h2 className="mt-5 text-2xl sm:text-3xl font-bold text-[#F7F3E9]">
                {title}
              </h2>

              <p className="mt-4 text-base leading-relaxed text-[#C8BFA8]">
                {details}
              </p>

              <div className="mt-8 rounded-[24px] border border-[#D4AF37]/25 bg-[#161512] p-6 sm:p-8">
                <h3 className="text-lg font-bold text-[#F7F3E9]">
                  {locale === 'en'
                    ? 'Clinical Highlights & Technology'
                    : 'مميزات الإجراء والتقنية المستخدمة'}
                </h3>
                <p className="mt-2 text-sm font-semibold text-[#E6C76A]">
                  {technology}
                </p>

                <ul className="mt-5 space-y-3">
                  {highlights.map((pt) => (
                    <li key={pt} className="flex items-start gap-3">
                      <CheckCircle2
                        className="mt-0.5 h-5 w-5 shrink-0 text-[#D4AF37]"
                        aria-hidden="true"
                      />
                      <span className="text-sm sm:text-base font-medium text-[#F7F3E9]">
                        {pt}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                <AppointmentButton
                  href={`/appointment?service=${service.id}`}
                  label={
                    locale === 'en'
                      ? `Book ${service.titleEn}`
                      : `احجز موعد ${service.titleAr}`
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
