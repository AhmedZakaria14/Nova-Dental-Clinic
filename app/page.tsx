import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { DICTIONARIES, Locale } from '@/lib/i18n';
import HomeHeroV1 from '@/components/dentaire/HomeHeroV1';
import CtaContactStrip from '@/components/dentaire/CtaContactStrip';
import AboutSection from '@/components/dentaire/AboutSection';
import ServicesPreviewSection from '@/components/dentaire/ServicesPreviewSection';
import VisitClinicAndCounters from '@/components/dentaire/VisitClinicAndCounters';
import WhyChooseSection from '@/components/dentaire/WhyChooseSection';
import HowItWorkSection from '@/components/dentaire/HowItWorkSection';
import TeamPreviewSection from '@/components/dentaire/TeamPreviewSection';
import TestimonialsSection from '@/components/dentaire/TestimonialsSection';
import BlogPreviewSection from '@/components/dentaire/BlogPreviewSection';
import ContactSection from '@/components/ContactSection';

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const locale: Locale =
    cookieStore.get('nova_locale')?.value === 'en' ? 'en' : 'ar';
  const dict = DICTIONARIES[locale];

  return {
    title: dict.meta.homeTitle,
    description: dict.meta.homeDescription,
    alternates: {
      canonical: '/',
    },
  };
}

export default function HomePage() {
  return (
    <>
      <HomeHeroV1 />
      <CtaContactStrip />
      <AboutSection />
      <ServicesPreviewSection />
      <VisitClinicAndCounters />
      <WhyChooseSection />
      <HowItWorkSection />
      <TeamPreviewSection />
      <TestimonialsSection />
      <BlogPreviewSection />
      <ContactSection />
    </>
  );
}
