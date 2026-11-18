import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildWhatsAppMessage,
  buildWhatsAppUrl,
  sanitizeWhatsAppDigits,
} from './whatsapp';

test('sanitizeWhatsAppDigits strips formatting symbols cleanly', () => {
  assert.equal(sanitizeWhatsAppDigits('+20 10 3123-5562'), '201031235562');
});

test('buildWhatsAppMessage formats Arabic and English messages for all intents', () => {
  const arFifth = buildWhatsAppMessage('ar', 'appointment-fifth');
  assert.match(arFifth, /التجمع الخامس/);

  const arNasr = buildWhatsAppMessage('ar', 'appointment-nasr');
  assert.match(arNasr, /مدينة نصر/);

  const enInquiry = buildWhatsAppMessage('en', 'inquiry', '  Veneers pricing  ');
  assert.match(enInquiry, /NOVA Dental Clinic/);
  assert.match(enInquiry, /Veneers pricing$/);
});

test('buildWhatsAppUrl encodes message into valid wa.me URL', () => {
  const url = buildWhatsAppUrl('+20 10 31235562', 'en', 'appointment-nasr');
  assert.ok(url.startsWith('https://wa.me/201031235562?text='));
  const parsed = new URL(url);
  assert.equal(parsed.hostname, 'wa.me');
  assert.equal(parsed.pathname, '/201031235562');
  assert.match(parsed.searchParams.get('text') || '', /Nasr City branch/);
});
