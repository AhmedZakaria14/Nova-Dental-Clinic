# NOVA Dental Clinic — Firestore Security Specification (Phase 0 TDD)

## 1. Data Invariants
1. **Strict PII Isolation**: `/bookings/{bookingId}` stores patient PII (`patientName`, `patientPhone`, `notes`). Unauthenticated users and non-admin signed-in users MUST NEVER be able to `get` or `list` `/bookings`.
2. **Zero-PII Availability Split**: `/booking_slots/{slotId}` stores ONLY `bookingId`, `branchId`, `date`, `time`, `status`, `createdAt`, `updatedAt`. No patient name, phone, or notes may ever exist in `booking_slots`.
3. **Atomic Slot Locking**: Every public `create` on `/bookings/{bookingId}` MUST atomically create or claim `/booking_slots/{slotId}` in the same Firestore batch (`existsAfter` / `getAfter` invariant), and vice versa. Orphan bookings or orphan slot locks are forbidden.
4. **Deterministic Slot Key**: `slotId` MUST equal `{branchId}_{date}_{time-with-dash}` matching `^(fifth-settlement|nasr-city)_[0-9]{4}-[0-9]{2}-[0-9]{2}_[0-9]{2}-[0-9]{2}$`.
5. **Server Timestamp Integrity**: `createdAt` MUST equal `request.time` on creation and MUST remain immutable on updates. `updatedAt` MUST equal `request.time` on every write.
6. **Hardened Admin RBAC**: Admin operations require Firebase Authentication via either the clinic's Email/Password admin account (`sign_in_provider == 'password'` && `email == 'admin@novadental.eg'`), a verified bootstrapped owner account (`email == 'azeco77@gmail.com'` && `email_verified == true`), or an active document at `/admins/$(request.auth.uid)`.
7. **Volumetric & Schema Guardrails**: All string fields enforce `.size()` bounds synchronized verbatim with `firebase-blueprint.json`, and all writes enforce strict `keys().hasAll(...)` / `keys().hasOnly(...)` / `affectedKeys().hasOnly(...)`.

## 2. The "Dirty Dozen" Adversarial Payloads (Must Return PERMISSION_DENIED)
1. **Unauthenticated PII Read**: Unauthenticated `get` or `list` on `/bookings`.
2. **Authenticated Non-Admin PII Scrape**: Signed-in non-admin user attempts `get` or `list` on `/bookings`.
3. **Email Spoofing Attack**: Signed-in user with `email == 'azeco77@gmail.com'` but `email_verified == false` attempts to read `/bookings`.
4. **Shadow Field Injection on Booking Create**: Public client submits valid booking plus ghost field `isAdmin: true` or `adminNotes: 'hacked'`.
5. **Status Forgery on Public Booking Create**: Public client submits booking with `status: 'confirmed'` or `source: 'admin-walkin'` instead of `status: 'pending'`, `source: 'website'`.
6. **Orphan Booking Write (Bypassing Slot Lock)**: Public client writes `/bookings/{id}` without atomically locking `/booking_slots/{slotId}` in the same batch.
7. **Slot Overwrite Hijack**: Public client attempts to overwrite an already `'booked'` slot in `/booking_slots/{slotId}`.
8. **ID Poisoning Attack**: Attacker attempts `create` on `/bookings/{200-char-invalid-id!@#}` or `/booking_slots/invalid..path`.
9. **Value / Resource Poisoning (Denial of Wallet)**: Attacker submits 5000-character `patientName` or `notes`, or invalid phone `'not-a-phone'`.
10. **Client Timestamp Tampering**: Client submits `createdAt: Timestamp(2020-01-01)` instead of `serverTimestamp()`.
11. **Immutable Field Tampering**: Admin or user attempts to mutate `createdAt` during an update on `/bookings/{bookingId}`.
12. **Self-Assigned Admin Escalation**: Non-admin signed-in user attempts to create `/admins/{ownUid}` with `{ role: 'super_admin', active: true }`.
