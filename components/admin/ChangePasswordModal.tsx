'use client';

import { FormEvent, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  X,
} from 'lucide-react';
import { Locale } from '@/lib/i18n';
import { useFirebase } from '@/components/FirebaseProvider';

interface ChangePasswordModalProps {
  open: boolean;
  locale: Locale;
  onClose: () => void;
  onChanged: (message: string) => void;
}

export default function ChangePasswordModal({
  open,
  locale,
  onClose,
  onChanged,
}: ChangePasswordModalProps) {
  const { changeAdminPassword } = useFirebase();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const res = await changeAdminPassword(
      currentPassword,
      newPassword,
      confirmPassword,
      locale
    );

    setSubmitting(false);
    if (!res.ok) {
      setError(res.error ?? null);
      return;
    }

    onChanged(
      locale === 'en'
        ? 'Administrator password updated successfully.'
        : 'تم تحديث كلمة مرور المدير بنجاح.'
    );
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="change-password-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
    >
      <div className="w-full max-w-md rounded-[28px] border border-[#D4AF37]/30 bg-[#12110E] p-6 shadow-2xl sm:p-7">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#D4AF37]/30 bg-[#1B1810] text-[#E6C76A]">
              <KeyRound className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h2
                id="change-password-title"
                className="text-lg font-bold text-[#F7F3E9]"
              >
                {locale === 'en'
                  ? 'Change Admin Password'
                  : 'تغيير كلمة مرور المدير'}
              </h2>
              <p className="text-xs text-[#9E9580]">
                {locale === 'en'
                  ? 'Minimum 8 characters recommended'
                  : 'يُفضل أن تتكون من ٨ أحرف على الأقل'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={locale === 'en' ? 'Close modal' : 'إغلاق النافذة'}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D4AF37]/20 bg-[#0A0908] text-[#C8BFA8] hover:border-[#E6C76A] hover:text-[#E6C76A] cursor-pointer"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="current-admin-password"
              className="mb-1.5 block text-xs font-semibold text-[#C8BFA8]"
            >
              {locale === 'en' ? 'Current Password' : 'كلمة المرور الحالية'}
            </label>
            <input
              id="current-admin-password"
              type={showPasswords ? 'text' : 'password'}
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              dir="ltr"
              className="w-full rounded-xl border border-[#D4AF37]/25 bg-[#0A0908] px-3.5 py-2.5 text-sm text-[#F7F3E9] focus:border-[#E6C76A] focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="new-admin-password"
              className="mb-1.5 block text-xs font-semibold text-[#C8BFA8]"
            >
              {locale === 'en' ? 'New Password' : 'كلمة المرور الجديدة'}
            </label>
            <input
              id="new-admin-password"
              type={showPasswords ? 'text' : 'password'}
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              dir="ltr"
              className="w-full rounded-xl border border-[#D4AF37]/25 bg-[#0A0908] px-3.5 py-2.5 text-sm text-[#F7F3E9] focus:border-[#E6C76A] focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="confirm-admin-password"
              className="mb-1.5 block text-xs font-semibold text-[#C8BFA8]"
            >
              {locale === 'en'
                ? 'Confirm New Password'
                : 'تأكيد كلمة المرور الجديدة'}
            </label>
            <input
              id="confirm-admin-password"
              type={showPasswords ? 'text' : 'password'}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              dir="ltr"
              className="w-full rounded-xl border border-[#D4AF37]/25 bg-[#0A0908] px-3.5 py-2.5 text-sm text-[#F7F3E9] focus:border-[#E6C76A] focus:outline-none"
            />
          </div>

          <button
            type="button"
            onClick={() => setShowPasswords((v) => !v)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C8BFA8] hover:text-[#E6C76A] cursor-pointer"
          >
            {showPasswords ? (
              <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />
            ) : (
              <Eye className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            <span>
              {showPasswords
                ? locale === 'en'
                  ? 'Hide passwords'
                  : 'إخفاء كلمات المرور'
                : locale === 'en'
                  ? 'Show passwords'
                  : 'إظهار كلمات المرور'}
            </span>
          </button>

          {error && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-xl border border-rose-500/35 bg-rose-950/50 p-3 text-xs font-medium text-rose-200"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-[#D4AF37]/25 bg-[#0A0908] px-4 py-2 text-xs font-bold text-[#C8BFA8] hover:border-[#E6C76A] hover:text-[#F7F3E9] cursor-pointer"
            >
              {locale === 'en' ? 'Cancel' : 'إلغاء'}
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#D4AF37] px-5 py-2 text-xs font-bold text-[#080808] hover:bg-[#E6C76A] disabled:opacity-60 cursor-pointer"
            >
              <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
              <span>
                {submitting
                  ? locale === 'en'
                    ? 'Updating...'
                    : 'جاري التحديث...'
                  : locale === 'en'
                    ? 'Save Password'
                    : 'حفظ كلمة المرور'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
