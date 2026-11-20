'use client';

import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  where,
  type Unsubscribe,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { BranchId } from './clinic-data';
import { Locale } from './i18n';
import { sanitizeTextField } from './booking-logic';
import {
  formatInquiryReference,
  INQUIRY_LIMITS,
  InquiryBranchId,
  InquiryRecord,
  InquiryStatus,
  PatientReviewRecord,
  REVIEW_LIMITS,
  ReviewStatus,
  validateInquiryInput,
  validateReviewInput,
} from './clinic-engagement';

export class EngagementValidationError extends Error {
  errors: Record<string, string>;
  constructor(message: string, errors: Record<string, string>) {
    super(message);
    this.name = 'EngagementValidationError';
    this.errors = errors;
  }
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

function mapDocToInquiry(
  id: string,
  data: Record<string, unknown>
): InquiryRecord {
  const rawBranch = String(data.branchId ?? 'general');
  const branchId: InquiryBranchId =
    rawBranch === 'fifth-settlement' || rawBranch === 'nasr-city'
      ? rawBranch
      : 'general';

  return {
    id,
    referenceCode: String(data.referenceCode ?? ''),
    branchId,
    name: String(data.name ?? ''),
    phone: String(data.phone ?? ''),
    subject: String(data.subject ?? ''),
    message: String(data.message ?? ''),
    status: (data.status as InquiryStatus) ?? 'new',
    adminNotes:
      typeof data.adminNotes === 'string' ? data.adminNotes : undefined,
    createdAt: timestampToIso(data.createdAt),
    updatedAt: data.updatedAt ? timestampToIso(data.updatedAt) : undefined,
  };
}

function mapDocToReview(
  id: string,
  data: Record<string, unknown>
): PatientReviewRecord {
  return {
    id,
    patientName: String(data.patientName ?? ''),
    branchId: (data.branchId === 'nasr-city'
      ? 'nasr-city'
      : 'fifth-settlement') as BranchId,
    treatment: String(data.treatment ?? ''),
    rating: Math.min(5, Math.max(1, Math.round(Number(data.rating ?? 5)))),
    comment: String(data.comment ?? ''),
    status: (data.status as ReviewStatus) ?? 'pending',
    featured: Boolean(data.featured),
    createdAt: timestampToIso(data.createdAt),
    updatedAt: data.updatedAt ? timestampToIso(data.updatedAt) : undefined,
  };
}

// ============================================================================
// Inquiries (Contact Form -> Firestore -> /admin Inbox)
// ============================================================================
export async function createFirestoreInquiry(input: {
  locale: Locale;
  branchId?: InquiryBranchId;
  name: string;
  phone: string;
  subject: string;
  message: string;
}): Promise<InquiryRecord> {
  const validation = validateInquiryInput(input, input.locale);
  if (!validation.valid) {
    throw new EngagementValidationError(
      input.locale === 'en'
        ? 'Please review the highlighted fields.'
        : 'يرجى مراجعة الحقول المطلوبة.',
      validation.errors
    );
  }

  const inquiryId = `inq_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  const referenceCode = formatInquiryReference();
  const cleanName = sanitizeTextField(input.name, INQUIRY_LIMITS.nameMax);
  const cleanSubject = sanitizeTextField(
    input.subject,
    INQUIRY_LIMITS.subjectMax
  );
  const cleanMessage = sanitizeTextField(
    input.message,
    INQUIRY_LIMITS.messageMax
  );

  const path = `inquiries/${inquiryId}`;
  try {
    await setDoc(doc(db, 'inquiries', inquiryId), {
      referenceCode,
      branchId: validation.branchId,
      name: cleanName,
      phone: validation.normalizedPhone,
      subject: cleanSubject,
      message: cleanMessage,
      status: 'new',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }

  const nowIso = new Date().toISOString();
  return {
    id: inquiryId,
    referenceCode,
    branchId: validation.branchId,
    name: cleanName,
    phone: validation.normalizedPhone,
    subject: cleanSubject,
    message: cleanMessage,
    status: 'new',
    createdAt: nowIso,
    updatedAt: nowIso,
  };
}

export function subscribeAllAdminInquiries(
  onData: (inquiries: InquiryRecord[]) => void,
  onError: (error: Error) => void
): Unsubscribe {
  const path = 'inquiries';
  const q = query(collection(db, path), orderBy('createdAt', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const items: InquiryRecord[] = [];
      snapshot.forEach((docSnap) => {
        items.push(
          mapDocToInquiry(docSnap.id, docSnap.data() as Record<string, unknown>)
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

export async function updateAdminInquiry(params: {
  inquiryId: string;
  status: InquiryStatus;
  adminNotes?: string;
}): Promise<void> {
  const path = `inquiries/${params.inquiryId}`;
  const cleanNotes = sanitizeTextField(
    params.adminNotes ?? '',
    INQUIRY_LIMITS.adminNotesMax
  );
  try {
    await updateDoc(doc(db, 'inquiries', params.inquiryId), {
      status: params.status,
      adminNotes: cleanNotes,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteAdminInquiry(inquiryId: string): Promise<void> {
  const path = `inquiries/${inquiryId}`;
  try {
    await deleteDoc(doc(db, 'inquiries', inquiryId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ============================================================================
// Moderated Patient Reviews (Public Submit -> Admin Approval -> Public Display)
// ============================================================================
export async function createFirestoreReview(input: {
  locale: Locale;
  patientName: string;
  branchId: BranchId;
  treatment: string;
  rating: number;
  comment: string;
}): Promise<PatientReviewRecord> {
  const validation = validateReviewInput(input, input.locale);
  if (!validation.valid) {
    throw new EngagementValidationError(
      input.locale === 'en'
        ? 'Please review your rating details.'
        : 'يرجى استكمال بيانات التقييم المطلوبة.',
      validation.errors
    );
  }

  const reviewId = `rev_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  const cleanName = sanitizeTextField(
    input.patientName,
    REVIEW_LIMITS.patientNameMax
  );
  const cleanTreatment = sanitizeTextField(
    input.treatment,
    REVIEW_LIMITS.treatmentMax
  );
  const cleanComment = sanitizeTextField(
    input.comment,
    REVIEW_LIMITS.commentMax
  );

  const path = `reviews/${reviewId}`;
  try {
    await setDoc(doc(db, 'reviews', reviewId), {
      patientName: cleanName,
      branchId: validation.branchId,
      treatment: cleanTreatment,
      rating: validation.rating,
      comment: cleanComment,
      status: 'pending',
      featured: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }

  const nowIso = new Date().toISOString();
  return {
    id: reviewId,
    patientName: cleanName,
    branchId: validation.branchId,
    treatment: cleanTreatment,
    rating: validation.rating,
    comment: cleanComment,
    status: 'pending',
    featured: false,
    createdAt: nowIso,
    updatedAt: nowIso,
  };
}

/**
 * Public real-time subscription to ONLY approved reviews.
 * Matches firestore.rules allow list: resource.data.status == 'approved'.
 * Sorts client-side by createdAt desc to avoid composite index requirements.
 */
export function subscribeApprovedReviews(
  onData: (reviews: PatientReviewRecord[]) => void,
  onError?: (error: unknown) => void
): Unsubscribe {
  const path = 'reviews';
  const q = query(collection(db, path), where('status', '==', 'approved'));

  return onSnapshot(
    q,
    (snapshot) => {
      const items: PatientReviewRecord[] = [];
      snapshot.forEach((docSnap) => {
        items.push(
          mapDocToReview(docSnap.id, docSnap.data() as Record<string, unknown>)
        );
      });
      items.sort((a, b) => {
        if (a.featured !== b.featured) return a.featured ? -1 : 1;
        return b.createdAt.localeCompare(a.createdAt);
      });
      onData(items);
    },
    (error) => {
      if (onError) onError(error);
      try {
        handleFirestoreError(error, OperationType.LIST, path);
      } catch {
        // Logged via handleFirestoreError
      }
    }
  );
}

export function subscribeAllAdminReviews(
  onData: (reviews: PatientReviewRecord[]) => void,
  onError: (error: Error) => void
): Unsubscribe {
  const path = 'reviews';
  const q = query(collection(db, path), orderBy('createdAt', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const items: PatientReviewRecord[] = [];
      snapshot.forEach((docSnap) => {
        items.push(
          mapDocToReview(docSnap.id, docSnap.data() as Record<string, unknown>)
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

export async function updateAdminReview(params: {
  reviewId: string;
  status: ReviewStatus;
  featured: boolean;
}): Promise<void> {
  const path = `reviews/${params.reviewId}`;
  try {
    await updateDoc(doc(db, 'reviews', params.reviewId), {
      status: params.status,
      featured: params.featured,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteAdminReview(reviewId: string): Promise<void> {
  const path = `reviews/${reviewId}`;
  try {
    await deleteDoc(doc(db, 'reviews', reviewId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}
