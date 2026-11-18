'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { CLINIC_FAQS } from '@/lib/clinic-data';
import { useLanguage } from '@/components/LanguageProvider';
import PageHeader from '@/components/PageHeader';
import AppointmentButton from '@/components/AppointmentButton';

export default function FaqsView() {
  const { locale, t } = useLanguage();
  const [openId, setOpenId] = useState<string>(CLINIC_FAQS[0].id);

  return (
    <>
      <PageHeader
        titlePrefix={t.nav.faqs}
        titleAccent="NOVA Dental Clinic"
        subtitle={
          locale === 'en'
            ? 'Clear answers about visiting our Fifth Settlement clinic, appointments, and clinical protocols.'
            : 'إجابات واضحة حول موقع العيادة، الحجز، والتعقيم ومعايير الرعاية السنية.'
        }
        breadcrumbs={[{ label: t.nav.home, href: '/' }, { label: t.nav.faqs }]}
      />

      <section className="bg-[#080808] py-14 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {CLINIC_FAQS.map((faq) => {
              const isOpen = openId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="overflow-hidden rounded-[22px] border border-[#D4AF37]/25 bg-[#161512]"
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenId(isOpen ? '' : faq.id)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-start font-bold text-[#F7F3E9] transition-colors hover:bg-[#1E1C17] cursor-pointer"
                  >
                    <span className="text-base sm:text-lg">
                      {locale === 'en' ? faq.questionEn : faq.questionAr}
                    </span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-[#D4AF37] transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#E6C76A]' : ''
                      }`}
                      aria-hidden="true"
                    />
                  </button>

                  {isOpen && (
                    <div className="border-t border-[#D4AF37]/15 bg-[#0D0C0A] px-6 py-5 text-sm sm:text-base leading-relaxed text-[#C8BFA8]">
                      {locale === 'en' ? faq.answerEn : faq.answerAr}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <AppointmentButton />
          </div>
        </div>
      </section>
    </>
  );
}
