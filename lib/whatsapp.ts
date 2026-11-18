import type { Locale } from './i18n';

export type WhatsAppIntent = 'inquiry' | 'appointment-fifth' | 'appointment-nasr';

const DEFAULT_MESSAGES: Record<Locale, Record<WhatsAppIntent, string>> = {
  ar: {
    inquiry:
      'مرحباً عيادة نوفا لطب الأسنان، لدي استفسار طبي وأود التواصل معكم.',
    'appointment-fifth':
      'مرحباً عيادة نوفا لطب الأسنان، أرغب في حجز موعد في فرع التجمع الخامس (مركز أوزون الطبي).',
    'appointment-nasr':
      'مرحباً عيادة نوفا لطب الأسنان، أرغب في حجز موعد في فرع مدينة نصر.',
  },
  en: {
    inquiry:
      'Hello NOVA Dental Clinic, I have an inquiry and would like to speak with your team.',
    'appointment-fifth':
      'Hello NOVA Dental Clinic, I would like to schedule an appointment at the Fifth Settlement branch (Ozone Medical Center).',
    'appointment-nasr':
      'Hello NOVA Dental Clinic, I would like to schedule an appointment at the Nasr City branch.',
  },
};

export function sanitizeWhatsAppDigits(rawPhone: string): string {
  return rawPhone.replace(/[^\d]/g, '');
}

export function buildWhatsAppMessage(
  locale: Locale,
  intent: WhatsAppIntent,
  customNote?: string
): string {
  const baseMessage = DEFAULT_MESSAGES[locale][intent];
  const trimmed = customNote?.trim();
  if (!trimmed) {
    return baseMessage;
  }
  return `${baseMessage}\n${trimmed}`;
}

export function buildWhatsAppUrl(
  rawPhone: string,
  locale: Locale,
  intent: WhatsAppIntent,
  customNote?: string
): string {
  const digits = sanitizeWhatsAppDigits(rawPhone);
  const message = buildWhatsAppMessage(locale, intent, customNote);
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
