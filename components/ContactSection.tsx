'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  CheckCircle2,
  ExternalLink,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Send,
} from 'lucide-react';
import suiteImg from '@/src/assets/images/dental_treatment_suite_1794988565232.jpg';
import { CLINIC_INFO } from '@/lib/clinic-config';
import { useLanguage } from '@/components/LanguageProvider';
import AppointmentButton from '@/components/AppointmentButton';
import {
  CurtainImageReveal,
  FadeInUp,
  SplitHeadingReveal,
} from '@/components/dentaire/ScrollEffects';

export default function ContactSection({
  showForm = false,
}: {
  showForm?: boolean;
}) {
  const { locale, t } = useLanguage();
  const address = locale === 'en' ? CLINIC_INFO.addressEn : CLINIC_INFO.addressAr;
  const nasrCityAddress =
    locale === 'en'
      ? CLINIC_INFO.nasrCityAddressEn
      : CLINIC_INFO.nasrCityAddressAr;
  const shortBranches =
    locale === 'en' ? CLINIC_INFO.shortBranchesEn : CLINIC_INFO.shortBranchesAr;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locale, name, phone, subject, message }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors(data.errors || { form: data.error || 'Error' });
        return;
      }
      setSubmittedId(data.inquiry?.id || 'INQ-OK');
      setName('');
      setPhone('');
      setSubject('');
      setMessage('');
    } catch {
      setErrors({
        form:
          locale === 'en'
            ? 'Network error. Please call 01031235562.'
            : 'تعذر الاتصال، يرجى المحاولة أو الاتصال على 01031235562.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="border-t border-[#D4AF37]/20 bg-[#080808] py-16 sm:py-24">
      <div className="mx-auto max-w-[1300px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-14">
          {/* Column 1: Dentaire Location Showcase Card / Contact Form */}
          <div className="lg:col-span-6">
            {showForm ? (
              <div className="rounded-[30px] border border-[#D4AF37]/25 bg-[#161512] p-7 sm:p-10 shadow-2xl">
                {submittedId ? (
                  <div className="py-8 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-emerald-500/35 bg-emerald-950/60 text-emerald-300">
                      <CheckCircle2 className="h-8 w-8" />
                    </div>
                    <h3 className="mt-5 text-2xl font-bold text-[#F7F3E9]">
                      {t.contactPage.sentTitle}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-[#C8BFA8]">
                      {t.contactPage.sentDesc}
                    </p>
                    <p
                      dir="ltr"
                      className="mt-4 inline-block rounded-full border border-[#D4AF37]/35 bg-[#0A0908] px-4 py-1.5 text-xs font-bold text-[#E6C76A] tabular-nums"
                    >
                      {submittedId}
                    </p>
                    <div className="mt-7">
                      <button
                        type="button"
                        onClick={() => setSubmittedId(null)}
                        className="rounded-full bg-[#D4AF37] px-6 py-3 text-sm font-bold text-[#080808] transition-colors hover:bg-[#E6C76A] cursor-pointer"
                      >
                        {t.contactPage.sendAnother}
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="space-y-5">
                    <div>
                      <h2 className="text-2xl font-bold text-[#F7F3E9]">
                        {t.contactPage.formTitle}
                      </h2>
                      <p className="mt-1.5 text-sm text-[#C8BFA8]">
                        {t.contactPage.formSubtitle}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-sm font-semibold text-[#F7F3E9]">
                          {t.appointmentPage.nameLabel}
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder={t.appointmentPage.namePlaceholder}
                          className="w-full rounded-[14px] border border-[#D4AF37]/25 bg-[#0A0908] px-4 py-3 text-sm text-[#F7F3E9] placeholder:text-[#9E9580]/70 focus:border-[#E6C76A] focus:outline-none"
                        />
                        {errors.name && (
                          <p className="mt-1 text-xs font-medium text-[#E65757]">
                            {errors.name}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="mb-1.5 block text-sm font-semibold text-[#F7F3E9]">
                          {t.appointmentPage.phoneLabel}
                        </label>
                        <input
                          type="tel"
                          dir="ltr"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder={t.appointmentPage.phonePlaceholder}
                          className="w-full rounded-[14px] border border-[#D4AF37]/25 bg-[#0A0908] px-4 py-3 text-sm text-[#F7F3E9] rtl:text-right ltr:text-left placeholder:text-[#9E9580]/70 focus:border-[#E6C76A] focus:outline-none tabular-nums"
                        />
                        {errors.phone && (
                          <p className="mt-1 text-xs font-medium text-[#E65757]">
                            {errors.phone}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-semibold text-[#F7F3E9]">
                        {t.contactPage.subjectLabel}
                      </label>
                      <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder={t.contactPage.subjectPlaceholder}
                        className="w-full rounded-[14px] border border-[#D4AF37]/25 bg-[#0A0908] px-4 py-3 text-sm text-[#F7F3E9] placeholder:text-[#9E9580]/70 focus:border-[#E6C76A] focus:outline-none"
                      />
                      {errors.subject && (
                        <p className="mt-1 text-xs font-medium text-[#E65757]">
                          {errors.subject}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-semibold text-[#F7F3E9]">
                        {t.contactPage.messageLabel}
                      </label>
                      <textarea
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={t.contactPage.messagePlaceholder}
                        className="w-full rounded-[14px] border border-[#D4AF37]/25 bg-[#0A0908] px-4 py-3 text-sm text-[#F7F3E9] placeholder:text-[#9E9580]/70 focus:border-[#E6C76A] focus:outline-none"
                      />
                      {errors.message && (
                        <p className="mt-1 text-xs font-medium text-[#E65757]">
                          {errors.message}
                        </p>
                      )}
                    </div>

                    {errors.form && (
                      <p className="text-xs font-medium text-[#E65757]">{errors.form}</p>
                    )}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="inline-flex w-full min-h-[48px] items-center justify-center gap-2 rounded-full bg-[#D4AF37] px-6 py-3 text-sm font-bold text-[#080808] transition-colors hover:bg-[#E6C76A] disabled:opacity-60 cursor-pointer"
                    >
                      <Send className="h-4 w-4" aria-hidden="true" />
                      <span>
                        {submitting ? t.contactPage.sendingBtn : t.contactPage.sendBtn}
                      </span>
                    </button>
                  </form>
                )}
              </div>
            ) : (
              <div className="relative overflow-hidden rounded-[40px] border border-[#D4AF37]/30 bg-[#12110E] shadow-[0_24px_70px_rgba(0,0,0,0.7)]">
                <CurtainImageReveal className="w-full">
                  <div className="relative aspect-[4/3.6] w-full">
                    <Image
                      src={suiteImg}
                      alt={address}
                      fill
                      referrerPolicy="no-referrer"
                      sizes="(max-width: 1024px) 100vw, 600px"
                      className="object-cover opacity-45"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/65 to-transparent"
                    />
                  </div>
                </CurtainImageReveal>

                <div className="absolute inset-x-0 bottom-0 z-10 p-6 sm:p-9 text-[#F7F3E9]">
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/35 bg-[#080808]/80 px-3.5 py-1 text-xs font-semibold backdrop-blur-sm">
                    <MapPin className="h-3.5 w-3.5 text-[#E6C76A]" aria-hidden="true" />
                    <span>{shortBranches}</span>
                  </div>
                  <p className="mt-3 text-base sm:text-lg font-bold leading-snug text-[#F7F3E9]">
                    {address}
                  </p>
                  <p className="mt-1 text-sm sm:text-base font-semibold text-[#E6C76A]">
                    {nasrCityAddress}
                  </p>
                  <a
                    href={CLINIC_INFO.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#D4AF37] px-5 py-2.5 text-sm font-bold text-[#080808] transition-colors hover:bg-[#E6C76A]"
                  >
                    <span>{t.contactSection.directionsBtn}</span>
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Column 2: Verified Contact Details */}
          <div className="lg:col-span-6">
            <FadeInUp>
              <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#E6C76A]">
                <Phone className="h-4 w-4 shrink-0 text-[#D4AF37]" aria-hidden="true" />
                <span>{t.contactSection.kicker}</span>
              </div>
            </FadeInUp>

            <SplitHeadingReveal
              prefix={t.contactSection.headingPrefix}
              accent={t.contactSection.headingAccent}
              className="mt-3 text-[clamp(1.75rem,3.3vw,2.75rem)] font-bold text-[#F7F3E9] [text-wrap:balance]"
            />

            <FadeInUp delay={0.18}>
              <p className="mt-4 text-base leading-relaxed text-[#C8BFA8]">
                {t.contactSection.subtitle}
              </p>
            </FadeInUp>

            {/* Contact Info Cards */}
            <div className="mt-8 space-y-4">
              {/* Address */}
              <div className="flex items-start gap-4 rounded-[22px] border border-[#D4AF37]/20 bg-[#161512] p-4 sm:p-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#D4AF37]/30 bg-[#0A0908] text-[#E6C76A]">
                  <MapPin className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1 space-y-2">
                  <p className="text-xs font-semibold text-[#D4AF37]">
                    {t.contactSection.addressLabel}
                  </p>
                  <a
                    href={CLINIC_INFO.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm sm:text-base font-bold text-[#F7F3E9] transition-colors hover:text-[#E6C76A]"
                  >
                    {locale === 'en' ? '1. Fifth Settlement: ' : '١. فرع التجمع الخامس: '}
                    {address}
                  </a>
                  <p className="text-sm sm:text-base font-bold text-[#F7F3E9]">
                    {locale === 'en' ? '2. Nasr City: ' : '٢. فرع مدينة نصر: '}
                    {nasrCityAddress}
                  </p>
                </div>
              </div>

              {/* Phones */}
              <div className="flex items-start gap-4 rounded-[22px] border border-[#D4AF37]/20 bg-[#161512] p-4 sm:p-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#D4AF37]/30 bg-[#0A0908] text-[#E6C76A]">
                  <Phone className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-[#D4AF37]">
                    {t.contactSection.primaryPhoneLabel}
                  </p>
                  <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
                    <a
                      href={CLINIC_INFO.primaryPhoneTel}
                      dir="ltr"
                      className="text-lg font-bold text-[#F7F3E9] rtl:text-right ltr:text-left tabular-nums transition-colors hover:text-[#E6C76A]"
                    >
                      {CLINIC_INFO.primaryPhone}
                    </a>
                    <span className="text-xs text-[#9E9580] tabular-nums" dir="ltr">
                      ({CLINIC_INFO.primaryPhoneInternational})
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-[#C8BFA8]">
                    {t.contactSection.additionalPhonesLabel}:{' '}
                    <span dir="ltr" className="inline-flex gap-3 font-semibold text-[#E6C76A] tabular-nums">
                      {CLINIC_INFO.additionalPhones.map((p) => (
                        <a key={p.display} href={p.tel} className="hover:text-[#F7F3E9]">
                          {p.display}
                        </a>
                      ))}
                    </span>
                  </p>
                </div>
              </div>

              {/* Email + Official Instagram */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3.5 rounded-[22px] border border-[#D4AF37]/20 bg-[#161512] p-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#D4AF37]/30 bg-[#0A0908] text-[#E6C76A]">
                    <Mail className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-[#D4AF37]">
                      {t.contactSection.emailLabel}
                    </p>
                    <a
                      href={`mailto:${CLINIC_INFO.email}`}
                      dir="ltr"
                      className="mt-1 block truncate text-sm font-bold text-[#F7F3E9] rtl:text-right ltr:text-left hover:text-[#E6C76A]"
                    >
                      {CLINIC_INFO.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 rounded-[22px] border border-[#D4AF37]/20 bg-[#161512] p-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#D4AF37]/30 bg-[#0A0908] text-[#E6C76A]">
                    <Instagram className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-[#D4AF37]">
                      {t.contactSection.instagramLabel}
                    </p>
                    <a
                      href={CLINIC_INFO.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      dir="ltr"
                      className="mt-1 block truncate text-sm font-bold text-[#F7F3E9] rtl:text-right ltr:text-left hover:text-[#E6C76A]"
                    >
                      {CLINIC_INFO.instagramHandle}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <AppointmentButton label={t.contactSection.ctaBtn} />
              <a
                href={CLINIC_INFO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[46px] items-center gap-2 rounded-full border border-[#D4AF37]/35 bg-[#161512] px-5 py-2.5 text-sm font-semibold text-[#F7F3E9] transition-colors hover:border-[#E6C76A] hover:text-[#E6C76A]"
              >
                <MapPin className="h-4 w-4 text-[#D4AF37]" aria-hidden="true" />
                <span>{t.contactSection.directionsBtn}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
