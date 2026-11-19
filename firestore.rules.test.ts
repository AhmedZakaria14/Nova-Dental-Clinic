import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const rulesPath = path.resolve(process.cwd(), 'firestore.rules');
const blueprintPath = path.resolve(process.cwd(), 'firebase-blueprint.json');
const rulesText = fs.readFileSync(rulesPath, 'utf8');
const blueprint = JSON.parse(fs.readFileSync(blueprintPath, 'utf8'));

test('firestore.rules enforces Global Safety Net (default deny) and rules_version 2', () => {
  assert.match(rulesText, /rules_version\s*=\s*'2';/);
  assert.match(
    rulesText,
    /match \/\{document=\*\*\}\s*\{\s*allow read, write: if false;\s*\}/
  );
});

test('every collection in firebase-blueprint.json has an explicit match block in firestore.rules', () => {
  const collections = Object.keys(blueprint.firestore);
  assert.deepEqual(collections.sort(), [
    '/admins/{adminUid}',
    '/booking_slots/{slotId}',
    '/bookings/{bookingId}',
  ]);

  for (const colPath of collections) {
    assert.ok(
      rulesText.includes(`match ${colPath}`),
      `Missing match block for ${colPath}`
    );
  }
});

test('Dirty Dozen 1-3: bookings PII is strictly isolated to verified/password admins (blocks unauth, non-admin, and unverified email spoofing)', () => {
  assert.match(
    rulesText,
    /function isVerifiedUser\(\)\s*\{\s*return isSignedIn\(\) && request\.auth\.token\.email_verified == true;\s*\}/
  );
  assert.match(
    rulesText,
    /function isBootstrapAdmin\(\)\s*\{\s*return isVerifiedUser\(\) && request\.auth\.token\.email == 'azeco77@gmail\.com';\s*\}/
  );
  assert.match(
    rulesText,
    /function isPasswordClinicAdmin\(\)\s*\{\s*return isSignedIn\(\)\s*&& request\.auth\.token\.firebase\.sign_in_provider == 'password'\s*&& request\.auth\.token\.email == 'admin@novadental\.eg';\s*\}/
  );
  assert.match(rulesText, /match \/bookings\/\{bookingId\}[\s\S]*?allow get: if isValidId\(bookingId\) && isAdmin\(\);/);
  assert.match(rulesText, /match \/bookings\/\{bookingId\}[\s\S]*?allow list: if isAdmin\(\);/);
});

test('Dirty Dozen 4-5: public booking create enforces strict keys (no shadow fields/adminNotes), pending status, and website source', () => {
  assert.match(rulesText, /data\.keys\(\)\.hasAll\(/);
  assert.match(rulesText, /data\.keys\(\)\.hasOnly\(/);
  assert.match(
    rulesText,
    /incoming\(\)\.status == 'pending'\s*&& incoming\(\)\.source == 'website'\s*&& !\('adminNotes' in incoming\(\)\)/
  );
});

test('Dirty Dozen 6-7: booking create and booking_slots enforce atomic existsAfter / getAfter sync and prevent overwriting booked slots', () => {
  assert.match(
    rulesText,
    /existsAfter\(\/databases\/\$\(database\)\/documents\/booking_slots\/\$\(incoming\(\)\.slotId\)\)/
  );
  assert.match(
    rulesText,
    /existsAfter\(\/databases\/\$\(database\)\/documents\/bookings\/\$\(incoming\(\)\.bookingId\)\)/
  );
  assert.match(
    rulesText,
    /existing\(\)\.status == 'released'\s*&& incoming\(\)\.status == 'booked'/
  );
});

test('Dirty Dozen 8-9: path ID hardening and blueprint-synchronized size/regex guards prevent ID & value poisoning', () => {
  assert.match(rulesText, /isValidId\(bookingId\)/);
  assert.match(rulesText, /isValidSlotId\(slotId\)/);
  assert.match(rulesText, /data\.patientName\.size\(\) >= 3[\s\S]*?data\.patientName\.size\(\) <= 120/);
  assert.match(rulesText, /data\.patientPhone\.matches\('\^01\[0125\]\[0-9\]\{8\}\$'\)/);
  assert.match(rulesText, /data\.notes\.size\(\) <= 500/);
  assert.match(rulesText, /data\.adminNotes\.size\(\) <= 500/);
});

test('Dirty Dozen 10-12: server timestamps, immutable createdAt, action-based updates, and admin RBAC self-escalation block', () => {
  assert.match(rulesText, /incoming\(\)\.createdAt == request\.time/);
  assert.match(rulesText, /incoming\(\)\.updatedAt == request\.time/);
  assert.match(rulesText, /incoming\(\)\.createdAt == existing\(\)\.createdAt/);
  assert.match(rulesText, /incoming\(\)\.diff\(existing\(\)\)\.affectedKeys\(\)\.hasOnly\(/);
  assert.match(
    rulesText,
    /match \/admins\/\{adminUid\}[\s\S]*?allow create: if isValidId\(adminUid\)\s*&& isValidAdminData\(incoming\(\)\)\s*&& isAdmin\(\)/
  );
});
