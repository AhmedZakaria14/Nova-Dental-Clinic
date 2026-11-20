# NOVA Dental Clinic — Firestore Security Specification (Phase 0 TDD)

## 1. Data Invariants
1. **Strict PII Isolation (Bookings & Inquiries)**: `/bookings/{bookingId}` and `/inquiries/{inquiryId}` store patient PII (`patientName`/`name`, `patientPhone`/`phone`, `notes`/`message`). Unauthenticated users and non-admin signed-in users MUST NEVER be able to `get` or `list` `/bookings` or `/inquiries`.
2. **Zero-PII Availability Split**: `/booking_slots/{slotId}` stores ONLY `bookingId`, `branchId`, `branchDate`, `date`, `time`, `status`, `createdAt`, `updatedAt`. No patient PII may ever exist in `booking_slots`.
3. **Atomic Slot Locking**: Every public `create` on `/bookings/{bookingId}` MUST atomically create or claim `/booking_slots/{slotId}` in the same Firestore batch (`existsAfter` / `getAfter` invariant), and vice versa.
4. **Deterministic Slot Key**: `slotId` MUST equal `{branchId}_{date}_{time-with-dash}` matching `^(fifth-settlement|nasr-city)_[0-9]{4}-[0-9]{2}-[0-9]{2}_[0-9]{2}-[0-9]{2}$`.
5. **Server Timestamp Integrity**: `createdAt` MUST equal `request.time` on creation and MUST remain immutable on updates. `updatedAt` MUST equal `request.time` on every write.
6. **Hardened Admin RBAC**: Admin operations require Firebase Authentication via either the clinic's Email/Password admin account (`sign_in_provider == 'password'` && `email == 'admin@novadental.eg'`), a verified bootstrapped owner account (`email == 'azeco77@gmail.com'` && `email_verified == true`), or an active document at `/admins/$(request.auth.uid)`.
7. **Volumetric & Schema Guardrails**: All string fields enforce `.size()` bounds synchronized verbatim with `firebase-blueprint.json`, and all writes enforce strict `keys().hasAll(...)` / `keys().hasOnly(...)` / `affectedKeys().hasOnly(...)`.
8. **Moderated Public Reviews**: Public visitors may create `/reviews/{reviewId}` ONLY with `status == 'pending'`, `featured == false`, and integer `rating` between `1` and `5`. Public `get` and `list` on `/reviews` are strictly gated by `resource.data.status == 'approved'` (never relying on client queries alone).
9. **Admin-Managed Public Offers**: `/offers/{offerId}` is strictly writable (`create`/`update`/`delete`) ONLY by verified clinic admins (`isAdmin()`). Public `get` and `list` are strictly gated by `resource.data.active == true`.

## 2. Adversarial Payloads (Must Return PERMISSION_DENIED)
1. **Unauthenticated PII Read**: Unauthenticated `get` or `list` on `/bookings` or `/inquiries`.
2. **Authenticated Non-Admin PII Scrape**: Signed-in non-admin user attempts `get` or `list` on `/bookings` or `/inquiries`.
3. **Email Spoofing Attack**: Signed-in user with `email == 'azeco77@gmail.com'` but `email_verified == false` attempts to read `/bookings` or `/inquiries`.
4. **Shadow Field Injection on Create**: Public client submits booking, inquiry, or review with ghost fields (`isAdmin: true`, `adminNotes: 'hacked'`).
5. **Status/Moderation Forgery on Create**: Public client submits booking with `status: 'confirmed'`, inquiry with `status: 'replied'`, or review with `status: 'approved'` / `featured: true`.
6. **Orphan Booking Write (Bypassing Slot Lock)**: Public client writes `/bookings/{id}` without atomically locking `/booking_slots/{slotId}` in the same batch.
7. **Slot Overwrite Hijack**: Public client attempts to overwrite an already `'booked'` slot in `/booking_slots/{slotId}`.
8. **ID Poisoning Attack**: Attacker attempts `create` on invalid path IDs (`>128` chars or special characters) across any collection.
9. **Value / Resource Poisoning (Denial of Wallet)**: Attacker submits 5000-character strings, invalid Egyptian phone, or out-of-range rating (`rating: 99` or `rating: 0`).
10. **Client Timestamp Tampering**: Client submits arbitrary `createdAt` instead of `serverTimestamp()`.
11. **Immutable Field Tampering**: Admin or user attempts to mutate `createdAt` during an update on `/bookings`, `/inquiries`, `/reviews`, or `/offers`.
12. **Self-Assigned Admin Escalation, Unmoderated Review Leak & Unauthorized Offer Creation**: Non-admin user attempts to create `/admins/{ownUid}`, list `pending`/`rejected` reviews from `/reviews`, list inactive offers (`active == false`), or write to `/offers/{offerId}`.
