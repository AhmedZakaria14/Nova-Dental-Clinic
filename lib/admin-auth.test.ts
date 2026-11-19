import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_ADMIN_EMAIL,
  DEFAULT_ADMIN_PASSWORD,
  DEFAULT_ADMIN_USERNAME,
  formatAdminDisplayIdentifier,
  resolveAdminUsernameToEmail,
  validateAdminLoginInput,
  validateNewPassword,
} from './admin-auth';

test('default admin constants resolve consistently', () => {
  assert.equal(DEFAULT_ADMIN_USERNAME, 'admin');
  assert.equal(DEFAULT_ADMIN_EMAIL, 'admin@novadental.eg');
  assert.equal(DEFAULT_ADMIN_PASSWORD.length >= 8, true);
  assert.equal(
    resolveAdminUsernameToEmail(DEFAULT_ADMIN_USERNAME),
    DEFAULT_ADMIN_EMAIL
  );
});

test('resolveAdminUsernameToEmail handles usernames, whitespace, case, and full emails', () => {
  assert.equal(resolveAdminUsernameToEmail('  Admin  '), 'admin@novadental.eg');
  assert.equal(
    resolveAdminUsernameToEmail('reception.nasr'),
    'reception.nasr@novadental.eg'
  );
  assert.equal(
    resolveAdminUsernameToEmail('Owner@Example.COM'),
    'owner@example.com'
  );
  assert.equal(resolveAdminUsernameToEmail('   '), '');
  assert.equal(resolveAdminUsernameToEmail('@@@'), '@@@');
});

test('formatAdminDisplayIdentifier strips internal clinic domain and preserves external emails', () => {
  assert.equal(formatAdminDisplayIdentifier('admin@novadental.eg'), 'admin');
  assert.equal(
    formatAdminDisplayIdentifier('ADMIN@NOVADENTAL.EG'),
    'admin'
  );
  assert.equal(
    formatAdminDisplayIdentifier('azeco77@gmail.com'),
    'azeco77@gmail.com'
  );
  assert.equal(formatAdminDisplayIdentifier(null), '');
});

test('validateAdminLoginInput rejects empty username or short password and accepts defaults', () => {
  const emptyUser = validateAdminLoginInput('', 'Nova@2026', 'ar');
  assert.equal(emptyUser.valid, false);
  assert.ok(emptyUser.error);

  const shortPass = validateAdminLoginInput('admin', '123', 'en');
  assert.equal(shortPass.valid, false);
  assert.ok(shortPass.error);

  const valid = validateAdminLoginInput(
    DEFAULT_ADMIN_USERNAME,
    DEFAULT_ADMIN_PASSWORD,
    'ar'
  );
  assert.equal(valid.valid, true);
  assert.equal(valid.email, DEFAULT_ADMIN_EMAIL);
});

test('validateNewPassword enforces current password, min length 8, and confirmation match', () => {
  assert.equal(
    validateNewPassword('', 'StrongPass1', 'StrongPass1', 'ar').valid,
    false
  );
  assert.equal(
    validateNewPassword('Nova@2026', 'short', 'short', 'ar').valid,
    false
  );
  assert.equal(
    validateNewPassword('Nova@2026', 'NewNova@2027', 'Different@2027', 'en')
      .valid,
    false
  );
  assert.equal(
    validateNewPassword('Nova@2026', 'NewNova@2027', 'NewNova@2027', 'ar')
      .valid,
    true
  );
});
