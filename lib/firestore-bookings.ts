'use client';

import type { User } from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  where,
  writeBatch,
  type Unsubscribe,
} from 'firebase/firestore';
import {
  BOOTSTRAP_ADMIN_EMAIL,
  db,
  handleFirestoreError,
  OperationType,
} from './firebase';
import { DEFAULT_ADMIN_EMAIL } from './admin-auth';
import { BranchId } from './clinic-data';
import {
  BLUEPRINT_LIMITS,
  BookingRecord,
  BookingSource,
  BookingStatus,
  buildBranchDateKey,
  buildSlotId,
  formatBookingReference,
  isStatusOccupyingSlot,
  sanitizeTextField,
  validateBookingInput,
} from './booking-logic';
import { Locale } from './i18n';

export class SlotAlreadyBookedError extends Error {
  constructor(locale: Locale) {
    super(
      locale === 'en'
        ? 'This time slot has just been booked. Please select another available time.'
        : 'هذا الموعد تم حجزه للتو، يرجى اختيار ساعة أخرى متاحة.'
    );
    this.name = 'SlotAlreadyBookedError';
  }
}

export class BookingValidationError extends Error {
  errors: Record<string, string>;
  constructor(message: string, errors: Record<string, string>) {
    super(message);
    this.name = 'BookingValidationError';
    this.errors = errors;
  }
}

export interface ClinicAdminRecord {
  uid: string;
  email: string;
  displayName: string;
  role: 'super_admin' | 'receptionist';
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

function timestampToIso(value: unknown): string {
  if (value instanceof Timestamp) {
    return value.toDate().toISOString();
  }
  if (typeof value === 'string') {
    return value;
  }
  return new Date().toISOString();
}

function mapDocToBooking(id: string, data: Record<string, unknown>): BookingRecord {
  return {
    id,
    referenceCode: String(data.referenceCode ?? ''),
    slotId: typeof data.slotId === 'string' ? data.slotId : undefined,
    branchId: (data.branchId === 'nasr-city'
      ? 'nasr-city'
      : 'fifth-settlement') as BranchId,
    serviceId: String(data.serviceId ?? 'veneers-dsd'),
    doctorId: String(data.doctorId ?? 'any'),
    date: String(data.date ?? ''),
    time: String(data.time ?? ''),
    patientName: String(data.patientName ?? ''),
    patientPhone: String(data.patientPhone ?? ''),
    notes: typeof data.notes === 'string' ? data.notes : undefined,
    adminNotes: typeof data.adminNotes === 'string' ? data.adminNotes : undefined,
    status: (data.status as BookingStatus) ?? 'pending',
    source: (data.source as BookingSource) ?? 'website',
    createdAt: timestampToIso(data.createdAt),
    updatedAt: data.updatedAt ? timestampToIso(data.updatedAt) : undefined,
  };
}

function generateBookingDocId(): string {
  const rand = Math.random().toString(36).slice(2, 10);
  return `bk_${Date.now()}_${rand}`;
}

/**
 * Subscribes in real time to public non-PII booked slots for a given branch + date.
 * Uses only single-field equality conditions so no composite index is required.
 */
export function subscribeBookedTimesForBranchDate(
  branchId: BranchId,
  date: string,
  onUpdate: (bookedTimes: string[]) => void,
  onError?: (err: unknown) => void
): Unsubscribe {
  const path = 'booking_slots';
  const branchDate = buildBranchDateKey(branchId, date);
  const q = query(
    collection(db, path),
    where('branchDate', '==', branchDate),
    where('status', '==', 'booked')
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const times: string[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (typeof data.time === 'string') {
          times.push(data.time);
        }
      });
      onUpdate(times);
    },
    (error) => {
      if (onError) {
        onError(error);
      }
      try {
        handleFirestoreError(error, OperationType.LIST, path);
      } catch {
        // Error already logged cleanly via handleFirestoreError
      }
    }
  );
}

/**
 * Atomically creates a booking in /bookings/{bookingId} and locks /booking_slots/{slotId}.
 * Enforces strict blueprint constraints prior to hitting Firestore.
 */
export async function createFirestoreBooking(input: {
  locale: Locale;
  branchId: BranchId;
  serviceId: string;
  doctorId: string;
  date: string;
  time: string;
  patientName: string;
  patientPhone: string;
  notes?: string;
  adminNotes?: string;
  source?: BookingSource;
  status?: 'pending' | 'confirmed';
}): Promise<BookingRecord> {
  const validation = validateBookingInput(input, input.locale);
  if (!validation.valid) {
    throw new BookingValidationError(
      input.locale === 'en'
        ? 'Please check the required fields.'
        : 'يرجى مراجعة الحقول المطلوبة.',
      validation.errors as Record<string, string>
    );
  }

  const slotId = buildSlotId(input.branchId, input.date, input.time);
  const branchDate = buildBranchDateKey(input.branchId, input.date);
  const bookingId = generateBookingDocId();
  const referenceCode = formatBookingReference();
  const slotRef = doc(db, 'booking_slots', slotId);
  const bookingRef = doc(db, 'bookings', bookingId);

  // Check if slot exists first so we know whether to create or reclaim a released slot
  let existingSlotStatus: string | null = null;
  try {
    const slotSnap = await getDoc(slotRef);
    if (slotSnap.exists()) {
      existingSlotStatus = String(slotSnap.data().status ?? '');
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `booking_slots/${slotId}`);
  }

  if (existingSlotStatus === 'booked') {
    throw new SlotAlreadyBookedError(input.locale);
  }

  const sanitizedName = sanitizeTextField(
    input.patientName,
    BLUEPRINT_LIMITS.patientNameMax
  );
  const sanitizedNotes = sanitizeTextField(input.notes, BLUEPRINT_LIMITS.notesMax);
  const sanitizedAdminNotes = sanitizeTextField(
    input.adminNotes,
    BLUEPRINT_LIMITS.adminNotesMax
  );
  const source: BookingSource = input.source ?? 'website';
  const status: BookingStatus =
    source === 'admin-walkin' ? (input.status ?? 'confirmed') : 'pending';

  const bookingPayload: Record<string, unknown> = {
    referenceCode,
    slotId,
    branchId: input.branchId,
    serviceId: input.serviceId,
    doctorId: input.doctorId,
    date: input.date,
    time: input.time,
    patientName: sanitizedName,
    patientPhone: validation.normalizedPhone,
    status,
    source,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  if (sanitizedNotes) {
    bookingPayload.notes = sanitizedNotes;
  }
  if (source === 'admin-walkin' && sanitizedAdminNotes) {
    bookingPayload.adminNotes = sanitizedAdminNotes;
  }

  const batch = writeBatch(db);
  batch.set(bookingRef, bookingPayload);

  if (existingSlotStatus === 'released') {
    batch.update(slotRef, {
      bookingId,
      status: 'booked',
      updatedAt: serverTimestamp(),
    });
  } else {
    batch.set(slotRef, {
      bookingId,
      branchId: input.branchId,
      branchDate,
      date: input.date,
      time: input.time,
      status: 'booked',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  try {
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `bookings/${bookingId}`);
  }

  const nowIso = new Date().toISOString();
  return {
    id: bookingId,
    referenceCode,
    slotId,
    branchId: input.branchId,
    serviceId: input.serviceId,
    doctorId: input.doctorId,
    date: input.date,
    time: input.time,
    patientName: sanitizedName,
    patientPhone: validation.normalizedPhone,
    notes: sanitizedNotes || undefined,
    adminNotes:
      source === 'admin-walkin' && sanitizedAdminNotes
        ? sanitizedAdminNotes
        : undefined,
    status,
    source,
    createdAt: nowIso,
    updatedAt: nowIso,
  };
}

/**
 * Checks whether a signed-in user is an authorized clinic administrator.
 * Matches firestore.rules:
 *  - Password-authenticated default clinic admin (admin@novadental.eg)
 *  - Verified bootstrap clinic owner email
 *  - Active /admins/{uid} document
 */
export async function checkIsClinicAdmin(
  user: User
): Promise<{ isAdmin: boolean; role?: 'super_admin' | 'receptionist' }> {
  const emailLower = user.email?.toLowerCase() ?? '';
  const hasPasswordProvider = user.providerData.some(
    (provider) => provider.providerId === 'password'
  );

  if (hasPasswordProvider && emailLower === DEFAULT_ADMIN_EMAIL.toLowerCase()) {
    return { isAdmin: true, role: 'super_admin' };
  }

  if (
    user.emailVerified &&
    emailLower === BOOTSTRAP_ADMIN_EMAIL.toLowerCase()
  ) {
    return { isAdmin: true, role: 'super_admin' };
  }

  const path = `admins/${user.uid}`;
  try {
    const snap = await getDoc(doc(db, 'admins', user.uid));
    if (snap.exists() && snap.data().active === true) {
      const role =
        snap.data().role === 'super_admin' ? 'super_admin' : 'receptionist';
      return { isAdmin: true, role };
    }
    return { isAdmin: false };
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

/**
 * Real-time subscription to all clinic bookings (Admin only).
 */
export function subscribeAllAdminBookings(
  onData: (bookings: BookingRecord[]) => void,
  onError: (error: Error) => void
): Unsubscribe {
  const path = 'bookings';
  const q = query(collection(db, path), orderBy('createdAt', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const items: BookingRecord[] = [];
      snapshot.forEach((docSnap) => {
        items.push(
          mapDocToBooking(docSnap.id, docSnap.data() as Record<string, unknown>)
        );
      });
      onData(items);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, path);
      } catch (wrapped) {
        onError(wrapped instanceof Error ? wrapped : new Error(String(wrapped)));
      }
    }
  );
}

/**
 * Admin action: Update booking status and optional internal reception notes,
 * keeping /booking_slots/{slotId} synchronously released or locked.
 */
export async function updateAdminBookingStatus(params: {
  booking: BookingRecord;
  newStatus: BookingStatus;
  adminNotes?: string;
  locale: Locale;
}): Promise<void> {
  const { booking, newStatus, adminNotes, locale } = params;
  const bookingPath = `bookings/${booking.id}`;
  const bookingRef = doc(db, 'bookings', booking.id);
  const slotId =
    booking.slotId ?? buildSlotId(booking.branchId, booking.date, booking.time);
  const slotRef = doc(db, 'booking_slots', slotId);

  const sanitizedAdminNotes = sanitizeTextField(
    adminNotes ?? booking.adminNotes,
    BLUEPRINT_LIMITS.adminNotesMax
  );

  let slotSnapData: Record<string, unknown> | null = null;
  try {
    const snap = await getDoc(slotRef);
    if (snap.exists()) {
      slotSnapData = snap.data() as Record<string, unknown>;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `booking_slots/${slotId}`);
  }

  const wantsOccupied = isStatusOccupyingSlot(newStatus);
  if (
    wantsOccupied &&
    slotSnapData &&
    slotSnapData.status === 'booked' &&
    slotSnapData.bookingId !== booking.id
  ) {
    throw new SlotAlreadyBookedError(locale);
  }

  const batch = writeBatch(db);
  batch.update(bookingRef, {
    status: newStatus,
    adminNotes: sanitizedAdminNotes,
    updatedAt: serverTimestamp(),
  });

  if (slotSnapData) {
    // Only release if this booking owns the slot, or reclaim when occupying
    if (wantsOccupied || slotSnapData.bookingId === booking.id) {
      batch.update(slotRef, {
        bookingId: booking.id,
        status: wantsOccupied ? 'booked' : 'released',
        updatedAt: serverTimestamp(),
      });
    }
  } else if (wantsOccupied) {
    batch.set(slotRef, {
      bookingId: booking.id,
      branchId: booking.branchId,
      branchDate: buildBranchDateKey(booking.branchId, booking.date),
      date: booking.date,
      time: booking.time,
      status: 'booked',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  try {
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, bookingPath);
  }
}

/**
 * Admin action: Reschedule or edit full appointment slot/service/status atomically.
 */
export async function rescheduleAdminBooking(params: {
  booking: BookingRecord;
  branchId: BranchId;
  serviceId: string;
  doctorId: string;
  date: string;
  time: string;
  status: BookingStatus;
  adminNotes: string;
  locale: Locale;
}): Promise<void> {
  const {
    booking,
    branchId,
    serviceId,
    doctorId,
    date,
    time,
    status,
    adminNotes,
    locale,
  } = params;

  const oldSlotId =
    booking.slotId ?? buildSlotId(booking.branchId, booking.date, booking.time);
  const newSlotId = buildSlotId(branchId, date, time);
  const bookingRef = doc(db, 'bookings', booking.id);
  const oldSlotRef = doc(db, 'booking_slots', oldSlotId);
  const newSlotRef = doc(db, 'booking_slots', newSlotId);

  const wantsOccupied = isStatusOccupyingSlot(status);

  let newSlotData: Record<string, unknown> | null = null;
  let oldSlotData: Record<string, unknown> | null = null;

  try {
    const newSnap = await getDoc(newSlotRef);
    if (newSnap.exists()) {
      newSlotData = newSnap.data() as Record<string, unknown>;
    }
    if (oldSlotId !== newSlotId) {
      const oldSnap = await getDoc(oldSlotRef);
      if (oldSnap.exists()) {
        oldSlotData = oldSnap.data() as Record<string, unknown>;
      }
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `booking_slots/${newSlotId}`);
  }

  if (
    wantsOccupied &&
    newSlotData &&
    newSlotData.status === 'booked' &&
    newSlotData.bookingId !== booking.id
  ) {
    throw new SlotAlreadyBookedError(locale);
  }

  const batch = writeBatch(db);
  batch.update(bookingRef, {
    branchId,
    serviceId,
    doctorId,
    date,
    time,
    slotId: newSlotId,
    status,
    adminNotes: sanitizeTextField(adminNotes, BLUEPRINT_LIMITS.adminNotesMax),
    updatedAt: serverTimestamp(),
  });

  // Release old slot if moved to a different slot
  if (
    oldSlotId !== newSlotId &&
    oldSlotData &&
    oldSlotData.bookingId === booking.id
  ) {
    batch.update(oldSlotRef, {
      bookingId: booking.id,
      status: 'released',
      updatedAt: serverTimestamp(),
    });
  }

  // Update or create target slot
  if (newSlotData) {
    if (wantsOccupied || newSlotData.bookingId === booking.id) {
      batch.update(newSlotRef, {
        bookingId: booking.id,
        status: wantsOccupied ? 'booked' : 'released',
        updatedAt: serverTimestamp(),
      });
    }
  } else if (wantsOccupied) {
    batch.set(newSlotRef, {
      bookingId: booking.id,
      branchId,
      branchDate: buildBranchDateKey(branchId, date),
      date,
      time,
      status: 'booked',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }

  try {
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `bookings/${booking.id}`);
  }
}

/**
 * Admin action: Permanently delete a booking and release its slot lock.
 */
export async function deleteAdminBooking(booking: BookingRecord): Promise<void> {
  const bookingRef = doc(db, 'bookings', booking.id);
  const slotId =
    booking.slotId ?? buildSlotId(booking.branchId, booking.date, booking.time);
  const slotRef = doc(db, 'booking_slots', slotId);

  let ownsSlot = false;
  try {
    const slotSnap = await getDoc(slotRef);
    if (slotSnap.exists() && slotSnap.data().bookingId === booking.id) {
      ownsSlot = true;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `booking_slots/${slotId}`);
  }

  const batch = writeBatch(db);
  batch.delete(bookingRef);
  if (ownsSlot) {
    batch.delete(slotRef);
  }

  try {
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `bookings/${booking.id}`);
  }
}
