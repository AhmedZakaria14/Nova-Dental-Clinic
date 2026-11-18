'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowUpRight,
  CalendarCheck,
  MapPin,
  MessageCircle,
  Send,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { CLINIC_INFO } from '@/lib/clinic-config';
import { buildWhatsAppUrl, type WhatsAppIntent } from '@/lib/whatsapp';
import { useLanguage } from './LanguageProvider';

export default function FloatingWhatsAppButton() {
  const { locale, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [intent, setIntent] = useState<WhatsAppIntent>('inquiry');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const whatsappUrl = buildWhatsAppUrl(
    CLINIC_INFO.whatsappNumber,
    locale,
    intent,
    note
  );

  const intentOptions: {
    id: WhatsAppIntent;
    label: string;
    icon: typeof MessageCircle;
  }[] = [
    {
      id: 'inquiry',
      label: t.whatsapp.intentInquiry,
      icon: MessageCircle,
    },
    {
      id: 'appointment-fifth',
      label: t.whatsapp.intentFifth,
      icon: CalendarCheck,
    },
    {
      id: 'appointment-nasr',
      label: t.whatsapp.intentNasr,
      icon: MapPin,
    },
  ];

  return (
    <div
      data-testid="floating-whatsapp-widget"
      dir="ltr"
      className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 sm:bottom-6 sm:right-6 z-30 flex flex-col items-end gap-3"
    >
      <AnimatePresence>
        {isOpen && (
          <motion.section
            id="whatsapp-quick-chat-panel"
            dir={locale === 'en' ? 'ltr' : 'rtl'}
            aria-label={t.whatsapp.title}
            initial={{ opacity: 0, y: 14, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="w-[min(340px,calc(100vw-2rem))] overflow-hidden rounded-[22px] border border-[#D4AF37]/35 bg-[#0D0C0A] text-[#F7F3E9] shadow-[0_24px_60px_rgba(0,0,0,0.85)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-3 border-b border-[#D4AF37]/20 bg-[#141310] px-4 py-3.5">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#25D366] shadow-[0_4px_14px_rgba(37,211,102,0.28)]">
                  <Image
                    src="/assets/whatsapp-logo.png"
                    alt="WhatsApp"
                    width={22}
                    height={22}
                    quality={100}
                    className="h-[22px] w-[22px] object-contain"
                  />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-[#F7F3E9]">
                    {t.whatsapp.title}
                  </p>
                  <p className="truncate text-xs text-[#C8BFA8]">
                    {t.whatsapp.subtitle}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label={t.whatsapp.closeLabel}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#D4AF37]/20 bg-[#0D0C0A] text-[#C8BFA8] transition-colors hover:border-[#D4AF37] hover:text-[#F7F3E9] cursor-pointer"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            {/* Body */}
            <div className="space-y-3.5 p-4">
              <p className="rounded-xl border border-[#D4AF37]/15 bg-[#161512] p-3 text-xs leading-relaxed text-[#C8BFA8]">
                {t.whatsapp.welcomeText}
              </p>

              {/* Topic & Branch Selector */}
              <div className="space-y-1.5" role="radiogroup" aria-label={t.whatsapp.subtitle}>
                {intentOptions.map((option) => {
                  const Icon = option.icon;
                  const active = intent === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => setIntent(option.id)}
                      className={`flex w-full items-center gap-2.5 rounded-xl border px-3 py-2 text-xs font-medium transition-colors cursor-pointer ${
                        active
                          ? 'border-[#D4AF37] bg-[#D4AF37]/15 text-[#E6C76A]'
                          : 'border-[#D4AF37]/15 bg-[#141310] text-[#C8BFA8] hover:border-[#D4AF37]/40 hover:text-[#F7F3E9]'
                      }`}
                    >
                      <Icon
                        className={`h-3.5 w-3.5 shrink-0 ${
                          active ? 'text-[#D4AF37]' : 'text-[#9E9580]'
                        }`}
                        aria-hidden="true"
                      />
                      <span className="truncate">{option.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Optional Custom Note */}
              <div>
                <label
                  htmlFor="whatsapp-quick-note"
                  className="mb-1 block text-[11px] font-medium text-[#C8BFA8]"
                >
                  {t.whatsapp.noteLabel}
                </label>
                <textarea
                  id="whatsapp-quick-note"
                  rows={2}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder={t.whatsapp.notePlaceholder}
                  className="w-full resize-none rounded-xl border border-[#D4AF37]/20 bg-[#141310] px-3 py-2 text-xs text-[#F7F3E9] placeholder:text-[#7E7665] focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              {/* Direct WhatsApp Link CTA */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 text-sm font-bold text-[#051B0E] shadow-[0_10px_24px_rgba(37,211,102,0.22)] transition-colors hover:bg-[#2BE070]"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
                <span>{t.whatsapp.startChat}</span>
              </a>

              <div className="pt-0.5 text-center">
                <Link
                  href="/appointment"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center gap-1 text-xs font-medium text-[#E6C76A] transition-colors hover:text-[#F7F3E9]"
                >
                  <span>{t.whatsapp.orBookOnline}</span>
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Circular Floating Official WhatsApp Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-controls="whatsapp-quick-chat-panel"
        aria-label={isOpen ? t.whatsapp.closeLabel : t.whatsapp.fabLabel}
        className={`group flex h-14 w-14 sm:h-[60px] sm:w-[60px] items-center justify-center rounded-full border-2 shadow-[0_14px_34px_rgba(0,0,0,0.68),0_0_24px_rgba(37,211,102,0.28)] transition-all duration-200 hover:scale-105 cursor-pointer ${
          isOpen
            ? 'border-[#D4AF37] bg-[#0D0C0A] text-[#E6C76A]'
            : 'border-[#D4AF37]/75 bg-gradient-to-br from-[#2EE673] to-[#1EB854] hover:border-[#E6C76A]'
        }`}
      >
        {isOpen ? (
          <X className="h-6 w-6" strokeWidth={2.25} aria-hidden="true" />
        ) : (
          <Image
            src="/assets/whatsapp-logo.png"
            alt="WhatsApp"
            width={34}
            height={34}
            quality={100}
            className="h-7 w-7 sm:h-8 sm:w-8 object-contain drop-shadow-xs transition-transform duration-200 group-hover:scale-105"
          />
        )}
      </button>
    </div>
  );
}
