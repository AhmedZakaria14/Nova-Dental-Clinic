import { NextRequest, NextResponse } from 'next/server';
import { BranchId } from '@/lib/clinic-data';
import { Locale } from '@/lib/i18n';
import { getAvailableSlots, validateBookingInput } from '@/lib/booking-logic';
import {
  addServerBooking,
  cancelServerBooking,
  getServerBookings,
} from '@/lib/server-bookings';

export async function GET(req: NextRequest) {
  const bookings = getServerBookings();
  const { searchParams } = new URL(req.url);
  const branchId = (searchParams.get('branchId') || 'fifth-settlement') as BranchId;
  const date = searchParams.get('date');
  const doctorId = searchParams.get('doctorId') || 'any';

  if (date) {
    const slots = getAvailableSlots({
      branchId,
      date,
      doctorId,
      existingBookings: bookings,
    });
    return NextResponse.json({ bookings, slots });
  }

  return NextResponse.json({ bookings });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const locale: Locale = body.locale === 'en' ? 'en' : 'ar';
    const validation = validateBookingInput(body, locale);

    if (!validation.valid) {
      return NextResponse.json(
        {
          error:
            locale === 'en'
              ? 'Please check the required fields.'
              : 'يرجى مراجعة الحقول المطلوبة.',
          errors: validation.errors,
        },
        { status: 400 }
      );
    }

    const existing = getServerBookings();
    const slots = getAvailableSlots({
      branchId: body.branchId as BranchId,
      date: body.date,
      doctorId: body.doctorId,
      existingBookings: existing,
    });

    const chosenSlot = slots.find((s) => s.time === body.time);
    if (!chosenSlot || !chosenSlot.available) {
      return NextResponse.json(
        {
          error:
            locale === 'en'
              ? 'This time slot has just been booked. Please select another time.'
              : 'هذا الموعد تم حجزه للتو، يرجى اختيار ساعة أخرى متاحة.',
          errors: {
            time:
              locale === 'en'
                ? 'Selected time is unavailable.'
                : 'الموعد غير متاح حالياً.',
          },
        },
        { status: 409 }
      );
    }

    const booking = addServerBooking({
      branchId: body.branchId as BranchId,
      serviceId: body.serviceId,
      doctorId: body.doctorId,
      date: body.date,
      time: body.time,
      patientName: String(body.patientName).trim(),
      patientPhone: validation.normalizedPhone,
      notes: body.notes ? String(body.notes).trim() : undefined,
    });

    return NextResponse.json({ booking }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'تعذر إتمام الطلب، يرجى المحاولة مرة أخرى.' },
      { status: 400 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const idOrRef = String(body.id || body.referenceCode || '').trim();
    if (!idOrRef) {
      return NextResponse.json(
        { error: 'معرف الحجز مطلوب.' },
        { status: 400 }
      );
    }

    const updated = cancelServerBooking(idOrRef);
    if (!updated) {
      return NextResponse.json(
        { error: 'لم يتم العثور على الحجز المطلوب.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ booking: updated });
  } catch {
    return NextResponse.json(
      { error: 'تعذر تحديث حالة الحجز.' },
      { status: 400 }
    );
  }
}
