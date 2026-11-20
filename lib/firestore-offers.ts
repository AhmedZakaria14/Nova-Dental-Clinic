import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import {
  db,
  handleFirestoreError,
  OperationType,
} from './firebase';
import {
  ClinicOfferRecord,
  OfferBranchId,
  OfferDraftInput,
  OFFER_LIMITS,
  validateOfferInput,
} from './clinic-offers';
import { Locale } from './i18n';

function timestampToIso(value: unknown): string {
  if (value instanceof Timestamp) {
    return value.toDate().toISOString();
  }
  if (typeof value === 'string') {
    return value;
  }
  return new Date().toISOString();
}

function mapOfferDoc(
  id: string,
  data: Record<string, unknown>
): ClinicOfferRecord {
  return {
    id,
    titleAr: String(data.titleAr ?? ''),
    titleEn: String(data.titleEn ?? ''),
    badgeAr: String(data.badgeAr ?? ''),
    badgeEn: String(data.badgeEn ?? ''),
    descriptionAr: String(data.descriptionAr ?? ''),
    descriptionEn: String(data.descriptionEn ?? ''),
    priceLabelAr: String(data.priceLabelAr ?? ''),
    priceLabelEn: String(data.priceLabelEn ?? ''),
    serviceId: String(data.serviceId ?? 'veneers-dsd'),
    branchId: (data.branchId as OfferBranchId) ?? 'all',
    validUntil: String(data.validUntil ?? '2026-12-31'),
    active: Boolean(data.active),
    featured: Boolean(data.featured),
    createdAt: timestampToIso(data.createdAt),
    updatedAt: data.updatedAt ? timestampToIso(data.updatedAt) : undefined,
  };
}

function sortOffers(items: ClinicOfferRecord[]): ClinicOfferRecord[] {
  return [...items].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return b.createdAt.localeCompare(a.createdAt);
  });
}

function sanitizeOfferPayload(input: OfferDraftInput) {
  return {
    titleAr: input.titleAr.trim().slice(0, OFFER_LIMITS.titleMax),
    titleEn: input.titleEn.trim().slice(0, OFFER_LIMITS.titleMax),
    badgeAr: input.badgeAr.trim().slice(0, OFFER_LIMITS.badgeMax),
    badgeEn: input.badgeEn.trim().slice(0, OFFER_LIMITS.badgeMax),
    descriptionAr: input.descriptionAr.trim().slice(0, OFFER_LIMITS.descriptionMax),
    descriptionEn: input.descriptionEn.trim().slice(0, OFFER_LIMITS.descriptionMax),
    priceLabelAr: input.priceLabelAr.trim().slice(0, OFFER_LIMITS.priceLabelMax),
    priceLabelEn: input.priceLabelEn.trim().slice(0, OFFER_LIMITS.priceLabelMax),
    serviceId: input.serviceId,
    branchId: input.branchId,
    validUntil: input.validUntil,
    active: Boolean(input.active),
    featured: Boolean(input.featured),
  };
}

export function subscribeActiveOffers(
  onUpdate: (items: ClinicOfferRecord[]) => void,
  onError?: (err: Error) => void
): () => void {
  const offersRef = collection(db, 'offers');
  // Single-field equality filter matches `allow list: if isAdmin() || resource.data.active == true;`
  const q = query(offersRef, where('active', '==', true));

  return onSnapshot(
    q,
    (snapshot) => {
      const items = snapshot.docs.map((d) =>
        mapOfferDoc(d.id, d.data() as Record<string, unknown>)
      );
      onUpdate(sortOffers(items));
    },
    (err) => {
      onError?.(err);
      try {
        handleFirestoreError(err, OperationType.LIST, 'offers');
      } catch {
        // surfaced cleanly to caller
      }
    }
  );
}

export function subscribeAllAdminOffers(
  onUpdate: (items: ClinicOfferRecord[]) => void,
  onError?: (err: Error) => void
): () => void {
  const offersRef = collection(db, 'offers');

  return onSnapshot(
    offersRef,
    (snapshot) => {
      const items = snapshot.docs.map((d) =>
        mapOfferDoc(d.id, d.data() as Record<string, unknown>)
      );
      onUpdate(sortOffers(items));
    },
    (err) => {
      onError?.(err);
      try {
        handleFirestoreError(err, OperationType.LIST, 'offers');
      } catch {
        // surfaced cleanly to caller
      }
    }
  );
}

export async function createAdminOffer(
  input: OfferDraftInput,
  locale: Locale
): Promise<string> {
  const check = validateOfferInput(input, locale);
  if (!check.valid) {
    throw new Error(Object.values(check.errors)[0] ?? 'Invalid offer payload');
  }

  const offerRef = doc(collection(db, 'offers'));
  const clean = sanitizeOfferPayload(input);

  try {
    await setDoc(offerRef, {
      ...clean,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return offerRef.id;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, `offers/${offerRef.id}`);
  }
}

export async function updateAdminOffer(
  offerId: string,
  patch: Partial<OfferDraftInput>
): Promise<void> {
  const offerRef = doc(db, 'offers', offerId);
  const payload: Record<string, unknown> = {
    updatedAt: serverTimestamp(),
  };

  if (patch.titleAr !== undefined)
    payload.titleAr = patch.titleAr.trim().slice(0, OFFER_LIMITS.titleMax);
  if (patch.titleEn !== undefined)
    payload.titleEn = patch.titleEn.trim().slice(0, OFFER_LIMITS.titleMax);
  if (patch.badgeAr !== undefined)
    payload.badgeAr = patch.badgeAr.trim().slice(0, OFFER_LIMITS.badgeMax);
  if (patch.badgeEn !== undefined)
    payload.badgeEn = patch.badgeEn.trim().slice(0, OFFER_LIMITS.badgeMax);
  if (patch.descriptionAr !== undefined)
    payload.descriptionAr = patch.descriptionAr
      .trim()
      .slice(0, OFFER_LIMITS.descriptionMax);
  if (patch.descriptionEn !== undefined)
    payload.descriptionEn = patch.descriptionEn
      .trim()
      .slice(0, OFFER_LIMITS.descriptionMax);
  if (patch.priceLabelAr !== undefined)
    payload.priceLabelAr = patch.priceLabelAr
      .trim()
      .slice(0, OFFER_LIMITS.priceLabelMax);
  if (patch.priceLabelEn !== undefined)
    payload.priceLabelEn = patch.priceLabelEn
      .trim()
      .slice(0, OFFER_LIMITS.priceLabelMax);
  if (patch.serviceId !== undefined) payload.serviceId = patch.serviceId;
  if (patch.branchId !== undefined) payload.branchId = patch.branchId;
  if (patch.validUntil !== undefined) payload.validUntil = patch.validUntil;
  if (patch.active !== undefined) payload.active = Boolean(patch.active);
  if (patch.featured !== undefined) payload.featured = Boolean(patch.featured);

  try {
    await updateDoc(offerRef, payload);
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, `offers/${offerId}`);
  }
}

export async function deleteAdminOffer(offerId: string): Promise<void> {
  const offerRef = doc(db, 'offers', offerId);
  try {
    await deleteDoc(offerRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, `offers/${offerId}`);
  }
}
