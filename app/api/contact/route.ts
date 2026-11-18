import { NextRequest, NextResponse } from 'next/server';
import { validateEgyptianPhone } from '@/lib/booking-logic';
import { Locale } from '@/lib/i18n';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const locale: Locale = body.locale === 'en' ? 'en' : 'ar';

    const name = String(body.name || '').trim();
    const phoneCheck = validateEgyptianPhone(String(body.phone || ''), locale);
    const subject = String(body.subject || '').trim();
    const message = String(body.message || '').trim();

    const errors: Record<string, string> = {};
    if (name.length < 3) {
      errors.name =
        locale === 'en'
          ? 'Please enter your full name.'
          : 'يرجى إدخال الاسم الكامل.';
    }
    if (!phoneCheck.valid && phoneCheck.error) {
      errors.phone = phoneCheck.error;
    }
    if (subject.length < 2) {
      errors.subject =
        locale === 'en'
          ? 'Please enter a subject.'
          : 'يرجى كتابة موضوع الرسالة.';
    }
    if (message.length < 6) {
      errors.message =
        locale === 'en'
          ? 'Please enter your message (at least 6 characters).'
          : 'يرجى كتابة تفاصيل رسالتك (٦ أحرف على الأقل).';
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    return NextResponse.json(
      {
        inquiry: {
          id: `INQ-${Date.now().toString().slice(-6)}`,
          name,
          phone: phoneCheck.normalized,
          subject,
          receivedAt: new Date().toISOString(),
        },
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: 'تعذر إرسال الرسالة، يرجى المحاولة مرة أخرى.' },
      { status: 400 }
    );
  }
}
