'use client';

import { useState } from 'react';
import { DENTAL_SERVICES, SERVICE_CATEGORIES, ServiceCategory } from '@/lib/clinic-data';
import { useLanguage } from '@/components/LanguageProvider';
import PageHeader from '@/components/PageHeader';
import ServiceCard from '@/components/cards/ServiceCard';
import WhyChooseSection from '@/components/dentaire/WhyChooseSection';

export default function ServicesView() {
  const { locale, t } = useLanguage();
  const [category, setCategory] = useState<ServiceCategory>('all');

  const filtered =
    category === 'all'
      ? DENTAL_SERVICES
      : DENTAL_SERVICES.filter((srv) => srv.category === category);

  return (
    <>
      <PageHeader
        titlePrefix={t.servicesSection.headingPrefix}
        titleAccent={t.servicesSection.headingAccent}
        subtitle={t.servicesSection.subtitle}
        breadcrumbs={[{ label: t.nav.home, href: '/' }, { label: t.nav.services }]}
      />

      <section className="bg-[#080808] py-14 sm:py-20">
        <div className="mx-auto max-w-[1300px] px-4 sm:px-6 lg:px-8">
          {/* Category Tabs */}
          <div
            role="tablist"
            aria-label={locale === 'en' ? 'Service categories' : 'تصنيفات الخدمات'}
            className="mb-10 flex flex-wrap items-center justify-center gap-2.5"
          >
            {SERVICE_CATEGORIES.map((cat) => {
              const active = category === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setCategory(cat.id)}
                  className={`min-h-[42px] rounded-full px-5 py-2 text-sm font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#D4AF37] text-[#080808] shadow-md'
                      : 'border border-[#D4AF37]/30 bg-[#161512] text-[#F7F3E9] hover:border-[#E6C76A] hover:text-[#E6C76A]'
                  }`}
                >
                  {locale === 'en' ? cat.labelEn : cat.labelAr}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((srv) => (
              <ServiceCard key={srv.id} service={srv} bordered />
            ))}
          </div>
        </div>
      </section>

      <WhyChooseSection />
    </>
  );
}
