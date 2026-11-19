'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  onAuthStateChanged,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  type User,
} from 'firebase/auth';
import { auth, testConnection } from '@/lib/firebase';
import { checkIsClinicAdmin } from '@/lib/firestore-bookings';
import {
  DEFAULT_ADMIN_EMAIL,
  DEFAULT_ADMIN_PASSWORD,
  validateAdminLoginInput,
  validateNewPassword,
} from '@/lib/admin-auth';

interface AuthActionResult {
  ok: boolean;
  error?: string;
}

interface FirebaseContextValue {
  user: User | null;
  authReady: boolean;
  isAdmin: boolean;
  adminRole: 'super_admin' | 'receptionist' | null;
  authLoading: boolean;
  authError: string | null;
  authProviderDisabled: boolean;
  clearAuthError: () => void;
  signInWithCredentials: (
    username: string,
    password: string,
    locale?: 'ar' | 'en'
  ) => Promise<AuthActionResult>;
  changeAdminPassword: (
    currentPassword: string,
    newPassword: string,
    confirmPassword: string,
    locale?: 'ar' | 'en'
  ) => Promise<AuthActionResult>;
  signOutUser: () => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextValue>({
  user: null,
  authReady: false,
  isAdmin: false,
  adminRole: null,
  authLoading: false,
  authError: null,
  authProviderDisabled: false,
  clearAuthError: () => {},
  signInWithCredentials: async () => ({ ok: false }),
  changeAdminPassword: async () => ({ ok: false }),
  signOutUser: async () => {},
});

function extractAuthErrorCode(err: unknown): string {
  if (typeof err === 'object' && err && 'code' in err) {
    return String((err as { code?: string }).code ?? '');
  }
  return '';
}

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminRole, setAdminRole] = useState<
    'super_admin' | 'receptionist' | null
  >(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authProviderDisabled, setAuthProviderDisabled] = useState(false);

  useEffect(() => {
    void testConnection();

    let active = true;
    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      if (!active) return;
      setUser(nextUser);
      setAuthError(null);
      setAuthProviderDisabled(false);

      if (!nextUser) {
        setIsAdmin(false);
        setAdminRole(null);
        setAuthReady(true);
        return;
      }

      try {
        const adminCheck = await checkIsClinicAdmin(nextUser);
        if (!active) return;
        setIsAdmin(adminCheck.isAdmin);
        setAdminRole(adminCheck.role ?? null);
      } catch {
        if (!active) return;
        setIsAdmin(false);
        setAdminRole(null);
      } finally {
        if (active) {
          setAuthReady(true);
        }
      }
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const clearAuthError = useCallback(() => {
    setAuthError(null);
    setAuthProviderDisabled(false);
  }, []);

  const signInWithCredentials = useCallback(
    async (
      username: string,
      password: string,
      locale: 'ar' | 'en' = 'ar'
    ): Promise<AuthActionResult> => {
      const validation = validateAdminLoginInput(username, password, locale);
      if (!validation.valid) {
        setAuthError(validation.error ?? null);
        setAuthProviderDisabled(false);
        return { ok: false, error: validation.error };
      }

      setAuthLoading(true);
      setAuthError(null);
      setAuthProviderDisabled(false);

      try {
        await signInWithEmailAndPassword(auth, validation.email, password);
        return { ok: true };
      } catch (err) {
        const code = extractAuthErrorCode(err);

        // First-time bootstrap: automatically provision the default clinic admin account
        if (
          (code === 'auth/user-not-found' ||
            code === 'auth/invalid-credential') &&
          validation.email === DEFAULT_ADMIN_EMAIL &&
          password === DEFAULT_ADMIN_PASSWORD
        ) {
          try {
            await createUserWithEmailAndPassword(
              auth,
              validation.email,
              password
            );
            return { ok: true };
          } catch (createErr) {
            const createCode = extractAuthErrorCode(createErr);
            if (createCode === 'auth/operation-not-allowed') {
              const msg =
                locale === 'en'
                  ? 'Email/Password sign-in is not yet enabled in Firebase Authentication.'
                  : 'تسجيل الدخول بالبريد وكلمة المرور (Email/Password) غير مفعّل بعد في إعدادات Firebase Authentication.';
              setAuthProviderDisabled(true);
              setAuthError(msg);
              return { ok: false, error: msg };
            }
            if (createCode === 'auth/email-already-in-use') {
              const msg =
                locale === 'en'
                  ? 'Invalid username or password. If you previously changed the default admin password, please use your updated password.'
                  : 'اسم المستخدم أو كلمة المرور غير صحيحة. إذا كنت قد قمت بتغيير كلمة المرور الافتراضية سابقاً، يرجى إدخال كلمة المرور الجديدة.';
              setAuthError(msg);
              return { ok: false, error: msg };
            }
          }
        }

        if (code === 'auth/operation-not-allowed') {
          const msg =
            locale === 'en'
              ? 'Email/Password sign-in is not yet enabled in Firebase Authentication.'
              : 'تسجيل الدخول بالبريد وكلمة المرور (Email/Password) غير مفعّل بعد في إعدادات Firebase Authentication.';
          setAuthProviderDisabled(true);
          setAuthError(msg);
          return { ok: false, error: msg };
        }

        if (code === 'auth/too-many-requests') {
          const msg =
            locale === 'en'
              ? 'Too many failed sign-in attempts. Please wait a moment and try again.'
              : 'تم تجاوز عدد محاولات الدخول المسموح بها. يرجى الانتظار قليلاً ثم المحاولة مرة أخرى.';
          setAuthError(msg);
          return { ok: false, error: msg };
        }

        if (
          code === 'auth/invalid-credential' ||
          code === 'auth/wrong-password' ||
          code === 'auth/user-not-found' ||
          code === 'auth/invalid-email'
        ) {
          const msg =
            locale === 'en'
              ? 'Invalid username or password. Please verify your credentials and try again.'
              : 'اسم المستخدم أو كلمة المرور غير صحيحة. يرجى التأكد من البيانات والمحاولة مرة أخرى.';
          setAuthError(msg);
          return { ok: false, error: msg };
        }

        const fallback =
          locale === 'en'
            ? 'Unable to sign in right now. Please try again.'
            : 'تعذر تسجيل الدخول حالياً. يرجى المحاولة مرة أخرى.';
        setAuthError(fallback);
        return { ok: false, error: fallback };
      } finally {
        setAuthLoading(false);
      }
    },
    []
  );

  const changeAdminPassword = useCallback(
    async (
      currentPassword: string,
      newPassword: string,
      confirmPassword: string,
      locale: 'ar' | 'en' = 'ar'
    ): Promise<AuthActionResult> => {
      const currentUser = auth.currentUser;
      if (!currentUser || !currentUser.email) {
        return {
          ok: false,
          error:
            locale === 'en'
              ? 'No active administrator session found.'
              : 'لا توجد جلسة مدير نشطة حالياً.',
        };
      }

      const validation = validateNewPassword(
        currentPassword,
        newPassword,
        confirmPassword,
        locale
      );
      if (!validation.valid) {
        return { ok: false, error: validation.error };
      }

      try {
        const credential = EmailAuthProvider.credential(
          currentUser.email,
          currentPassword
        );
        await reauthenticateWithCredential(currentUser, credential);
        await updatePassword(currentUser, newPassword);
        return { ok: true };
      } catch (err) {
        const code = extractAuthErrorCode(err);
        if (
          code === 'auth/wrong-password' ||
          code === 'auth/invalid-credential'
        ) {
          return {
            ok: false,
            error:
              locale === 'en'
                ? 'Current password is incorrect.'
                : 'كلمة المرور الحالية غير صحيحة.',
          };
        }
        if (code === 'auth/weak-password') {
          return {
            ok: false,
            error:
              locale === 'en'
                ? 'Please choose a stronger password.'
                : 'يرجى اختيار كلمة مرور أقوى.',
          };
        }
        if (code === 'auth/requires-recent-login') {
          return {
            ok: false,
            error:
              locale === 'en'
                ? 'Please sign out and sign back in before changing your password.'
                : 'يرجى تسجيل الخروج ثم الدخول مجدداً قبل تغيير كلمة المرور.',
          };
        }
        return {
          ok: false,
          error:
            locale === 'en'
              ? 'Failed to update password. Please try again.'
              : 'تعذر تحديث كلمة المرور حالياً. يرجى المحاولة مرة أخرى.',
        };
      }
    },
    []
  );

  const signOutUser = useCallback(async () => {
    setAuthLoading(true);
    setAuthError(null);
    setAuthProviderDisabled(false);
    try {
      await signOut(auth);
      setIsAdmin(false);
      setAdminRole(null);
    } catch {
      setAuthError('تعذر تسجيل الخروج حالياً.');
    } finally {
      setAuthLoading(false);
    }
  }, []);

  return (
    <FirebaseContext.Provider
      value={{
        user,
        authReady,
        isAdmin,
        adminRole,
        authLoading,
        authError,
        authProviderDisabled,
        clearAuthError,
        signInWithCredentials,
        changeAdminPassword,
        signOutUser,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
}

export function useFirebase() {
  return useContext(FirebaseContext);
}
