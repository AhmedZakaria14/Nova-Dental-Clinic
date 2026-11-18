'use client';

import { Quote } from 'lucide-react';
import { PATIENT_TESTIMONIALS } from '@/lib/clinic-data';
import { useLanguage } from '@/components/LanguageProvider';
import PageHeader from '@/components/PageHeader';
import TestimonialsSection from '@/components/dentaire/TestimonialsSection';

export default function TestimonialsView() {
  const { locale, t } = useLanguage();

  return (
    <>
      <PageHeader
        titlePrefix={t.testimonialsSection.headingPrefix}
        titleAccent={t.testimonialsSection.headingAccent}
        subtitle={t.testimonialsSection.subtitle}
        breadcrumbs={[
          { label: t.nav.home, href: '/' },
          { label: t.nav.testimonials },
        ]}
      />

      <section className="bg-[#11100E] py-14 sm:py-20">
        <div className="mx-auto max-w-[1300px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {PATIENT_TESTIMONIALS.map((item) => (
              <article
                key={item.id}
                className="flex flex-col justify-between rounded-[28px] border border-[#D4AF37]/25 bg-[#161512] p-7 shadow-xl"
              >
                <div>
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[#D4AF37]/30 bg-[#D4AF37]/15 text-[#E6C76A]">
                    <Quote className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <p className="mt-5 text-base leading-relaxed text-[#F7F3E9]">
                    “{locale === 'en' ? item.quoteEn : item.quoteAr}”
                  </p>
                </div>

                <div className="mt-6 border-t border-[#D4AF37]/15 pt-4">
                  <p className="font-bold text-[#F7F3E9]">
                    {locale === 'en' ? item.patientNameEn : item.patientNameAr}
                  </p>
                  <p className="text-xs font-semibold text-[#D4AF37]">
                    {locale === 'en' ? item.treatmentEn : item.treatmentAr}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <TestimonialsSection />
    </>
  );
}
