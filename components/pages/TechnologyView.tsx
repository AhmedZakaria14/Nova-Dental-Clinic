'use client';

import Image from 'next/image';
import { Cpu } from 'lucide-react';
import smileImg from '@/src/assets/images/male_smile_showcase_1795203941309.jpg';
import suiteImg from '@/src/assets/images/male_treatment_suite_1795203940951.jpg';
import { TECH_STANDARDS } from '@/lib/clinic-data';
import { useLanguage } from '@/components/LanguageProvider';
import PageHeader from '@/components/PageHeader';
import AppointmentButton from '@/components/AppointmentButton';

export default function TechnologyView() {
  const { locale, t } = useLanguage();

  return (
    <>
      <PageHeader
        titlePrefix={t.nav.technology}
        titleAccent="NOVA Dental Clinic"
        subtitle={
          locale === 'en'
            ? 'Modern digital diagnostics and hospital-grade Class-B sterilization protocols.'
            : 'تقنيات التشخيص الرقمي ثلاثي الأبعاد ومعايير التعقيم الأوروبية Class-B.'
        }
        breadcrumbs={[
          { label: t.nav.home, href: '/' },
          { label: t.nav.technology },
        ]}
      />

      <section className="bg-[#080808] py-14 sm:py-20">
        <div className="mx-auto max-w-[1300px] px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[36px] border border-[#D4AF37]/25">
              <Image
                src={suiteImg}
                alt={
                  locale === 'en'
                    ? 'Digital treatment suite'
                    : 'وحدة العلاج الرقمي'
                }
                fill
                referrerPolicy="no-referrer"
                sizes="(max-width: 1024px) 100vw, 620px"
                className="object-cover"
              />
            </div>

            <div className="relative aspect-[16/10] overflow-hidden rounded-[36px] border border-[#D4AF37]/25">
              <Image
                src={smileImg}
                alt={
                  locale === 'en'
                    ? 'Smile care results at NOVA Dental Clinic'
                    : 'نتائج العناية السنية في نوفا لطب الأسنان'
                }
                fill
                referrerPolicy="no-referrer"
                sizes="(max-width: 1024px) 100vw, 620px"
                className="object-cover"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {TECH_STANDARDS.map((item) => (
              <div
                key={item.id}
                className="rounded-[28px] border border-[#D4AF37]/25 bg-[#161512] p-8"
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-[#E6C76A]">
                    {item.number}
                  </span>
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[#D4AF37]/30 bg-[#0A0908] text-[#D4AF37]">
                    <Cpu className="h-5 w-5" aria-hidden="true" />
                  </span>
                </div>
                <h2 className="mt-4 text-xl font-bold text-[#F7F3E9]">
                  {locale === 'en' ? item.titleEn : item.titleAr}
                </h2>
                <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#C8BFA8]">
                  {locale === 'en' ? item.detailEn : item.detailAr}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <AppointmentButton />
          </div>
        </div>
      </section>
    </>
  );
}
