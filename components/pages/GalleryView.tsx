'use client';

import Image from 'next/image';
import suiteImg from '@/src/assets/images/dental_treatment_suite_1794988565232.jpg';
import smileImg from '@/src/assets/images/smile_transformation_showcase_1794988567315.jpg';
import docMaleImg from '@/src/assets/images/doctor_male_specialist_1794988565766.jpg';
import docFemaleImg from '@/src/assets/images/doctor_female_specialist_1794988566137.jpg';
import { GALLERY_ITEMS } from '@/lib/clinic-data';
import { useLanguage } from '@/components/LanguageProvider';
import PageHeader from '@/components/PageHeader';
import AppointmentButton from '@/components/AppointmentButton';
import SocialMediaGallerySection from '@/components/SocialMediaGallerySection';

const GALLERY_IMAGE_MAP = {
  hero: suiteImg,
  suite: suiteImg,
  smile: smileImg,
  docMale: docMaleImg,
  docFemale: docFemaleImg,
};

export default function GalleryView() {
  const { locale, t } = useLanguage();

  return (
    <>
      <PageHeader
        titlePrefix={t.nav.gallery}
        titleAccent="NOVA Dental Clinic"
        subtitle={
          locale === 'en'
            ? 'Explore our calm treatment suites, clinic interior, and aesthetic care environment across Fifth Settlement and Nasr City.'
            : 'جولة داخل غرف العلاج الرقمية وأجواء عيادة نوفا لطب الأسنان في فرعي التجمع الخامس ومدينة نصر.'
        }
        breadcrumbs={[{ label: t.nav.home, href: '/' }, { label: t.nav.gallery }]}
      />

      <section className="bg-[#080808] py-14 sm:py-20">
        <div className="mx-auto max-w-[1300px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {GALLERY_ITEMS.map((item) => {
              const title = locale === 'en' ? item.titleEn : item.titleAr;
              const category =
                locale === 'en' ? item.categoryEn : item.categoryAr;
              const description =
                locale === 'en' ? item.descriptionEn : item.descriptionAr;

              return (
                <article
                  key={item.id}
                  className="group overflow-hidden rounded-[30px] border border-[#D4AF37]/25 bg-[#161512] shadow-lg"
                >
                  <div className="relative aspect-[4/3.2] w-full overflow-hidden">
                    <Image
                      src={GALLERY_IMAGE_MAP[item.imageKey]}
                      alt={title}
                      fill
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <span className="text-xs font-bold text-[#D4AF37]">
                      {category}
                    </span>
                    <h2 className="mt-1.5 text-lg font-bold text-[#F7F3E9]">
                      {title}
                    </h2>
                    <p className="mt-2 text-sm text-[#C8BFA8]">{description}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <SocialMediaGallerySection />

      <section className="bg-[#080808] pb-16 pt-10 text-center">
        <div className="mx-auto max-w-[1300px] px-4 sm:px-6 lg:px-8">
          <AppointmentButton />
        </div>
      </section>
    </>
  );
}
