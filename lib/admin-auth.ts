export const DEFAULT_ADMIN_USERNAME = 'admin';
export const DEFAULT_ADMIN_EMAIL = 'admin@novadental.eg';
export const DEFAULT_ADMIN_PASSWORD = 'Nova@2026';
export const ADMIN_EMAIL_DOMAIN = 'novadental.eg';

/**
 * Maps a clinic username (e.g. "admin") or full email address to the
 * canonical Firebase Auth email used for Email/Password authentication.
 */
export function resolveAdminUsernameToEmail(rawInput: string): string {
  const cleaned = rawInput.trim().toLowerCase();
  if (!cleaned) return '';
  if (cleaned.includes('@')) {
    return cleaned;
  }
  const safeUser = cleaned.replace(/[^a-z0-9._-]/g, '');
  if (!safeUser) return '';
  return `${safeUser}@${ADMIN_EMAIL_DOMAIN}`;
}

/**
 * Formats an admin email back into a concise display username when it belongs
 * to the clinic's internal domain.
 */
export function formatAdminDisplayIdentifier(email: string | null | undefined): string {
  if (!email) return '';
  const lower = email.toLowerCase();
  const suffix = `@${ADMIN_EMAIL_DOMAIN}`;
  if (lower.endsWith(suffix)) {
    return lower.slice(0, -suffix.length);
  }
  return email;
}

export function validateAdminLoginInput(
  username: string,
  password: string,
  locale: 'ar' | 'en' = 'ar'
): { valid: boolean; email: string; error?: string } {
  const email = resolveAdminUsernameToEmail(username);
  if (!email) {
    return {
      valid: false,
      email: '',
      error:
        locale === 'en'
          ? 'Please enter your username.'
          : 'يرجى إدخال اسم المستخدم.',
    };
  }
  if (!password || password.length < 6) {
    return {
      valid: false,
      email,
      error:
        locale === 'en'
          ? 'Please enter a valid password (at least 6 characters).'
          : 'يرجى إدخال كلمة مرور صحيحة (٦ أحرف على الأقل).',
    };
  }
  return { valid: true, email };
}

export function validateNewPassword(
  currentPassword: string,
  newPassword: string,
  confirmPassword: string,
  locale: 'ar' | 'en' = 'ar'
): { valid: boolean; error?: string } {
  if (!currentPassword) {
    return {
      valid: false,
      error:
        locale === 'en'
          ? 'Please enter your current password.'
          : 'يرجى إدخال كلمة المرور الحالية.',
    };
  }
  if (newPassword.length < 8) {
    return {
      valid: false,
      error:
        locale === 'en'
          ? 'New password must be at least 8 characters long.'
          : 'يجب أن تتكون كلمة المرور الجديدة من ٨ أحرف على الأقل.',
    };
  }
  if (newPassword !== confirmPassword) {
    return {
      valid: false,
      error:
        locale === 'en'
          ? 'New password and confirmation do not match.'
          : 'كلمة المرور الجديدة وتأكيدها غير متطابقتين.',
    };
  }
  return { valid: true };
}
