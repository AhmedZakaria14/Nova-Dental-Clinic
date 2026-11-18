'use client';

import { ShieldCheck } from 'lucide-react';
import { TECH_STANDARDS } from '@/lib/clinic-data';
import { useLanguage } from '@/components/LanguageProvider';
import PageHeader from '@/components/PageHeader';
import AboutSection from '@/components/dentaire/AboutSection';
import HowItWorkSection from '@/components/dentaire/HowItWorkSection';
import TeamPreviewSection from '@/components/dentaire/TeamPreviewSection';

export default function AboutView() {
  const { locale, t } = useLanguage();

  return (
    <>
      <PageHeader
        titlePrefix={t.nav.about}
        titleAccent="NOVA Dental Clinic"
        subtitle={
          locale === 'en'
            ? 'Your smile is our joy, let us keep it shining.'
            : 'ابتسامتك مصدر سعادتنا، خلّينا نحافظ على إشراقها.'
        }
        breadcrumbs={[{ label: t.nav.home, href: '/' }, { label: t.nav.about }]}
      />

      <AboutSection linkToAbout={false} />

      {/* Dental Process & Clinical Standards */}
      <section className="border-t border-[#D4AF37]/20 bg-[#11100E] py-16 sm:py-20">
        <div className="mx-auto max-w-[1300px] px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#E6C76A]">
              <ShieldCheck className="h-4 w-4 shrink-0 text-[#D4AF37]" aria-hidden="true" />
              <span>
                {locale === 'en' ? 'CLINICAL STANDARDS' : 'معاييرنا الطبية'}
              </span>
            </div>
            <h2 className="mt-3 text-[clamp(1.75rem,3.3vw,2.75rem)] font-bold text-[#F7F3E9]">
              {locale === 'en'
                ? 'Precision, Hygiene & Patient Comfort'
                : 'الدقة الطبية والتعقيم وراحة المريض'}
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TECH_STANDARDS.map((std) => (
              <div
                key={std.id}
                className="rounded-[26px] border border-[#D4AF37]/25 bg-[#161512] p-7 shadow-lg"
              >
                <span className="text-2xl font-bold text-[#E6C76A]">
                  {std.number}
                </span>
                <h3 className="mt-3 text-lg font-bold text-[#F7F3E9]">
                  {locale === 'en' ? std.titleEn : std.titleAr}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-[#C8BFA8]">
                  {locale === 'en' ? std.detailEn : std.detailAr}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <HowItWorkSection />
      <TeamPreviewSection />
    </>
  );
}
