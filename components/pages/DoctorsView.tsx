'use client';

import { DOCTORS } from '@/lib/clinic-data';
import { useLanguage } from '@/components/LanguageProvider';
import PageHeader from '@/components/PageHeader';
import DoctorCard from '@/components/cards/DoctorCard';
import VisitClinicAndCounters from '@/components/dentaire/VisitClinicAndCounters';

export default function DoctorsView() {
  const { t } = useLanguage();

  return (
    <>
      <PageHeader
        titlePrefix={t.teamSection.headingPrefix}
        titleAccent={t.teamSection.headingAccent}
        subtitle={t.teamSection.subtitle}
        breadcrumbs={[{ label: t.nav.home, href: '/' }, { label: t.nav.doctors }]}
      />

      <section className="bg-[#080808] py-16 sm:py-20">
        <div className="mx-auto max-w-[1300px] px-4 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-[400px] grid-cols-1 gap-8">
            {DOCTORS.map((doctor) => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        </div>
      </section>

      <VisitClinicAndCounters />
    </>
  );
}
