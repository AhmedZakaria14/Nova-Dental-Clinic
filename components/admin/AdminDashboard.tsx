'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import {
  AlertCircle,
  BarChart3,
  Calendar,
  CalendarCheck,
  CalendarDays,
  CalendarPlus,
  Check,
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  Eye,
  EyeOff,
  Inbox,
  KeyRound,
  LayoutGrid,
  List,
  Lock,
  LogIn,
  LogOut,
  MapPin,
  MessageCircle,
  Phone,
  Search,
  ShieldAlert,
  ShieldCheck,
  SlidersHorizontal,
  Star,
  Tag,
  User as UserIcon,
  Users,
  XCircle,
} from 'lucide-react';
import { CLINIC_INFO } from '@/lib/clinic-config';
import {
  BranchId,
  CLINIC_BRANCHES,
  DENTAL_SERVICES,
} from '@/lib/clinic-data';
import {
  AdminBookingFilters,
  BookingRecord,
  BookingStatus,
  buildBookingsCsv,
  buildPatientWhatsAppReplyUrl,
  computeDashboardMetrics,
  filterAdminBookings,
  formatTimeLocalized,
  getTodayIsoDate,
} from '@/lib/booking-logic';
import {
  SlotAlreadyBookedError,
  subscribeAllAdminBookings,
  updateAdminBookingStatus,
} from '@/lib/firestore-bookings';
import {
  InquiryRecord,
  PatientReviewRecord,
} from '@/lib/clinic-engagement';
import {
  subscribeAllAdminInquiries,
  subscribeAllAdminReviews,
} from '@/lib/firestore-engagement';
import { ClinicOfferRecord } from '@/lib/clinic-offers';
import { subscribeAllAdminOffers } from '@/lib/firestore-offers';
import { formatAdminDisplayIdentifier } from '@/lib/admin-auth';
import { FIREBASE_AUTH_PROVIDERS_URL } from '@/lib/firebase';
import { useLanguage } from '@/components/LanguageProvider';
import { useFirebase } from '@/components/FirebaseProvider';
import FirebaseErrorBoundary from '@/components/FirebaseErrorBoundary';
import WalkInBookingModal from './WalkInBookingModal';
import BookingDetailDrawer from './BookingDetailDrawer';
import ChangePasswordModal from './ChangePasswordModal';
import AdminInquiriesPanel from './AdminInquiriesPanel';
import AdminReviewsPanel from './AdminReviewsPanel';
import AdminOffersPanel from './AdminOffersPanel';
import AdminAnalyticsPanel from './AdminAnalyticsPanel';

const STATUS_STYLES: Record<
  BookingStatus,
  { badge: string; labelAr: string; labelEn: string }
> = {
  pending: {
    badge: 'border-amber-500/40 bg-amber-950/60 text-amber-300',
    labelAr: 'بانتظار التأكيد',
    labelEn: 'Pending',
  },
  confirmed: {
    badge: 'border-emerald-500/40 bg-emerald-950/60 text-emerald-300',
    labelAr: 'مؤكد',
    labelEn: 'Confirmed',
  },
  completed: {
    badge: 'border-sky-500/40 bg-sky-950/60 text-sky-300',
    labelAr: 'مكتمل',
    labelEn: 'Completed',
  },
  cancelled: {
    badge: 'border-rose-500/35 bg-rose-950/50 text-rose-300',
    labelAr: 'ملغي',
    labelEn: 'Cancelled',
  },
  'no-show': {
    badge: 'border-zinc-500/35 bg-zinc-900/80 text-zinc-300',
    labelAr: 'لم يحضر',
    labelEn: 'No-Show',
  },
};

function AdminDashboardContent() {
  const { locale } = useLanguage();
  const {
    user,
    authReady,
    isAdmin,
    adminRole,
    authLoading,
    authError,
    authProviderDisabled,
    clearAuthError,
    signInWithCredentials,
    signOutUser,
  } = useFirebase();

  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);

  const todayIso = useMemo(() => getTodayIsoDate(), []);

  const [activeTab, setActiveTab] = useState<
    'bookings' | 'inquiries' | 'reviews' | 'offers' | 'analytics'
  >('bookings');
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [inquiries, setInquiries] = useState<InquiryRecord[]>([]);
  const [reviews, setReviews] = useState<PatientReviewRecord[]>([]);
  const [offers, setOffers] = useState<ClinicOfferRecord[]>([]);
  const [loadedAdminUid, setLoadedAdminUid] = useState<string | null>(null);
  const [loadedInquiriesUid, setLoadedInquiriesUid] = useState<string | null>(null);
  const [loadedReviewsUid, setLoadedReviewsUid] = useState<string | null>(null);
  const [loadedOffersUid, setLoadedOffersUid] = useState<string | null>(null);
  const [dbError, setDbError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [busyBookingId, setBusyBookingId] = useState<string | null>(null);

  const [viewMode, setViewMode] = useState<'list' | 'schedule'>('list');
  const [scheduleDate, setScheduleDate] = useState(todayIso);

  const [filters, setFilters] = useState<AdminBookingFilters>({
    search: '',
    branch: 'all',
    status: 'all',
    dateFilter: 'all',
    customDate: todayIso,
  });

  const [walkInOpen, setWalkInOpen] = useState(false);
  const [walkInPreset, setWalkInPreset] = useState<{
    branchId: BranchId;
    date: string;
    time: string;
  }>({
    branchId: 'fifth-settlement',
    date: todayIso,
    time: '',
  });
  const [selectedBooking, setSelectedBooking] = useState<BookingRecord | null>(
    null
  );

  const activeBookings = useMemo(
    () => (authReady && user && isAdmin ? bookings : []),
    [authReady, user, isAdmin, bookings]
  );

  const activeInquiries = useMemo(
    () => (authReady && user && isAdmin ? inquiries : []),
    [authReady, user, isAdmin, inquiries]
  );

  const activeReviews = useMemo(
    () => (authReady && user && isAdmin ? reviews : []),
    [authReady, user, isAdmin, reviews]
  );

  const activeOffers = useMemo(
    () => (authReady && user && isAdmin ? offers : []),
    [authReady, user, isAdmin, offers]
  );

  const loadingBookings = Boolean(
    authReady && user && isAdmin && loadedAdminUid !== user.uid
  );

  const loadingInquiries = Boolean(
    authReady && user && isAdmin && loadedInquiriesUid !== user.uid
  );

  const loadingReviews = Boolean(
    authReady && user && isAdmin && loadedReviewsUid !== user.uid
  );

  const loadingOffers = Boolean(
    authReady && user && isAdmin && loadedOffersUid !== user.uid
  );

  const unreadInquiriesCount = useMemo(
    () => activeInquiries.filter((i) => i.status === 'new').length,
    [activeInquiries]
  );

  const pendingReviewsCount = useMemo(
    () => activeReviews.filter((r) => r.status === 'pending').length,
    [activeReviews]
  );

  // Subscribe to live Firestore collections ONLY once auth is ready & admin verified
  useEffect(() => {
    if (!authReady || !user || !isAdmin) {
      return;
    }

    let active = true;
    const currentUid = user.uid;

    const unsubscribeBookings = subscribeAllAdminBookings(
      (items) => {
        if (!active) return;
        setBookings(items);
        setDbError(null);
        setLoadedAdminUid(currentUid);
      },
      (err) => {
        if (!active) return;
        setDbError(err.message);
        setLoadedAdminUid(currentUid);
      }
    );

    const unsubscribeInquiries = subscribeAllAdminInquiries(
      (items) => {
        if (!active) return;
        setInquiries(items);
        setLoadedInquiriesUid(currentUid);
      },
      (err) => {
        if (!active) return;
        setDbError(err.message);
        setLoadedInquiriesUid(currentUid);
      }
    );

    const unsubscribeReviews = subscribeAllAdminReviews(
      (items) => {
        if (!active) return;
        setReviews(items);
        setLoadedReviewsUid(currentUid);
      },
      (err) => {
        if (!active) return;
        setDbError(err.message);
        setLoadedReviewsUid(currentUid);
      }
    );

    const unsubscribeOffers = subscribeAllAdminOffers(
      (items) => {
        if (!active) return;
        setOffers(items);
        setLoadedOffersUid(currentUid);
      },
      (err) => {
        if (!active) return;
        setDbError(err.message);
        setLoadedOffersUid(currentUid);
      }
    );

    return () => {
      active = false;
      unsubscribeBookings();
      unsubscribeInquiries();
      unsubscribeReviews();
      unsubscribeOffers();
    };
  }, [authReady, user, isAdmin]);

  // Auto-hide toast feedback after 3.5 seconds
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const metrics = useMemo(
    () => computeDashboardMetrics(activeBookings, todayIso),
    [activeBookings, todayIso]
  );

  const filteredBookings = useMemo(
    () => filterAdminBookings(activeBookings, filters, todayIso),
    [activeBookings, filters, todayIso]
  );

  const handleQuickStatus = async (
    booking: BookingRecord,
    newStatus: BookingStatus
  ) => {
    setBusyBookingId(booking.id);
    setDbError(null);
    try {
      await updateAdminBookingStatus({
        booking,
        newStatus,
        locale,
      });
      setToast(
        locale === 'en'
          ? `Updated ${booking.referenceCode} to ${STATUS_STYLES[newStatus].labelEn}`
          : `تم تحديث حالة الحجز ${booking.referenceCode} إلى (${STATUS_STYLES[newStatus].labelAr})`
      );
    } catch (err) {
      if (err instanceof SlotAlreadyBookedError) {
        setDbError(err.message);
      } else {
        setDbError(
          locale === 'en'
            ? 'Failed to update booking status.'
            : 'تعذر تحديث حالة الحجز حالياً.'
        );
      }
    } finally {
      setBusyBookingId(null);
    }
  };

  const handleExportCsv = () => {
    const csv = buildBookingsCsv(filteredBookings, locale);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `nova-dental-bookings-${todayIso}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const openWalkInWithPreset = (
    branchId: BranchId = 'fifth-settlement',
    date: string = todayIso,
    time = ''
  ) => {
    setWalkInPreset({ branchId, date, time });
    setWalkInOpen(true);
  };

  // ===========================================================================
  // State 1: Auth Initializing
  // ===========================================================================
  if (!authReady) {
    return (
      <section className="flex min-h-[72vh] items-center justify-center bg-[#080808] px-4 py-20">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-2 border-[#D4AF37]/25 border-t-[#D4AF37]" />
          <p className="text-sm font-medium text-[#C8BFA8]">
            {locale === 'en'
              ? 'Verifying clinic administrator session...'
              : 'جاري التحقق من جلسة إدارة العيادة...'}
          </p>
        </div>
      </section>
    );
  }

  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await signInWithCredentials(loginUsername, loginPassword, locale);
  };

  // ===========================================================================
  // State 2: Unauthenticated Admin Sign-In Gate (Classic Username & Password)
  // ===========================================================================
  if (!user) {
    return (
      <section className="flex min-h-[78vh] items-center justify-center bg-[#080808] px-4 py-14 sm:py-16">
        <div className="w-full max-w-md rounded-[30px] border border-[#D4AF37]/30 bg-[#12110E] p-7 shadow-[0_24px_80px_rgba(0,0,0,0.75)] sm:p-9">
          <div className="text-center">
            <div className="relative mx-auto h-20 w-24 overflow-hidden rounded-2xl border border-[#D4AF37]/30 bg-[#080808] p-2">
              <Image
                src={CLINIC_INFO.logoPath}
                alt={CLINIC_INFO.brandNameEn}
                fill
                sizes="96px"
                quality={100}
                referrerPolicy="no-referrer"
                className="object-contain p-1.5"
              />
            </div>

            <span className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-[#D4AF37]/30 bg-[#1B1810] px-3 py-1 text-xs font-bold text-[#E6C76A]">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              <span>
                {locale === 'en'
                  ? 'RESTRICTED CLINIC PORTAL'
                  : 'بوابة إدارة العيادة'}
              </span>
            </span>

            <h1 className="mt-4 text-2xl font-bold text-[#F7F3E9]">
              {locale === 'en'
                ? 'NOVA Bookings Dashboard'
                : 'لوحة إدارة حجوزات نوفا'}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-[#C8BFA8]">
              {locale === 'en'
                ? 'Sign in with your clinic administrator username and password to manage appointments for Fifth Settlement and Nasr City.'
                : 'سجّل الدخول باسم المستخدم وكلمة المرور لإدارة ومتابعة حجوزات المرضى لفرعي التجمع الخامس ومدينة نصر.'}
            </p>
          </div>

          <form
            onSubmit={handleLoginSubmit}
            noValidate
            className="mt-6 space-y-4 text-start"
          >
            {/* Username Field */}
            <div>
              <label
                htmlFor="admin-username"
                className="mb-1.5 block text-xs font-bold text-[#E6C76A]"
              >
                {locale === 'en' ? 'Username' : 'اسم المستخدم'}
              </label>
              <div className="relative">
                <UserIcon
                  className="pointer-events-none absolute top-1/2 start-3.5 h-4 w-4 -translate-y-1/2 text-[#9E9580]"
                  aria-hidden="true"
                />
                <input
                  id="admin-username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  dir="ltr"
                  value={loginUsername}
                  onChange={(e) => {
                    setLoginUsername(e.target.value);
                    if (authError) clearAuthError();
                  }}
                  placeholder={
                    locale === 'en' ? 'Enter username' : 'أدخل اسم المستخدم'
                  }
                  className="w-full rounded-xl border border-[#D4AF37]/25 bg-[#0A0908] py-3 ps-10 pe-3.5 text-sm font-medium text-[#F7F3E9] placeholder:text-[#9E9580]/60 focus:border-[#E6C76A] focus:outline-none"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="admin-password"
                className="mb-1.5 block text-xs font-bold text-[#E6C76A]"
              >
                {locale === 'en' ? 'Password' : 'كلمة المرور'}
              </label>
              <div className="relative">
                <Lock
                  className="pointer-events-none absolute top-1/2 start-3.5 h-4 w-4 -translate-y-1/2 text-[#9E9580]"
                  aria-hidden="true"
                />
                <input
                  id="admin-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  dir="ltr"
                  value={loginPassword}
                  onChange={(e) => {
                    setLoginPassword(e.target.value);
                    if (authError) clearAuthError();
                  }}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-[#D4AF37]/25 bg-[#0A0908] py-3 ps-10 pe-11 text-sm font-medium text-[#F7F3E9] placeholder:text-[#9E9580]/60 focus:border-[#E6C76A] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={
                    showPassword
                      ? locale === 'en'
                        ? 'Hide password'
                        : 'إخفاء كلمة المرور'
                      : locale === 'en'
                        ? 'Show password'
                        : 'إظهار كلمة المرور'
                  }
                  className="absolute top-1/2 end-2.5 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-[#9E9580] transition-colors hover:text-[#E6C76A] cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            {authError && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-xl border border-[#E65757]/35 bg-[#E65757]/10 p-3 text-xs font-medium text-[#F59B9B]"
              >
                <AlertCircle
                  className="mt-0.5 h-4 w-4 shrink-0 text-[#E65757]"
                  aria-hidden="true"
                />
                <span>{authError}</span>
              </div>
            )}

            {authProviderDisabled && (
              <div className="space-y-2.5 rounded-2xl border border-[#D4AF37]/40 bg-[#1B1810] p-4 text-xs text-[#F7F3E9]">
                <p className="font-bold text-[#E6C76A]">
                  {locale === 'en'
                    ? 'One-Time Firebase Setup Required'
                    : 'خطوة تفعيل لمرة واحدة في Firebase'}
                </p>
                <ol className="list-decimal space-y-1 ps-4 leading-relaxed text-[#C8BFA8]">
                  <li>
                    {locale === 'en'
                      ? 'Open Firebase Authentication Sign-in method.'
                      : 'افتح إعدادات طرق تسجيل الدخول في Firebase Authentication.'}
                  </li>
                  <li>
                    {locale === 'en'
                      ? 'Enable "Email/Password" and click Save, then sign in again here.'
                      : 'فعّل خيار (Email/Password) ثم اضغط Save، وبعدها اضغط تسجيل الدخول هنا.'}
                  </li>
                </ol>
                <a
                  href={FIREBASE_AUTH_PROVIDERS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#D4AF37]/50 bg-[#0A0908] px-3.5 py-1.5 text-xs font-bold text-[#E6C76A] transition-colors hover:bg-[#D4AF37] hover:text-[#080808]"
                >
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>
                    {locale === 'en'
                      ? 'Open Firebase Sign-in Providers'
                      : 'فتح إعدادات Firebase Authentication'}
                  </span>
                </a>
              </div>
            )}

            <button
              type="submit"
              disabled={authLoading}
              className="mt-2 inline-flex min-h-[50px] w-full items-center justify-center gap-2.5 rounded-full bg-[#D4AF37] px-6 py-3.5 text-sm font-bold text-[#080808] transition-colors hover:bg-[#E6C76A] disabled:opacity-60 cursor-pointer"
            >
              <LogIn className="h-4 w-4" aria-hidden="true" />
              <span>
                {authLoading
                  ? locale === 'en'
                    ? 'Signing in...'
                    : 'جاري تسجيل الدخول...'
                  : locale === 'en'
                    ? 'Sign In to Dashboard'
                    : 'تسجيل الدخول إلى لوحة التحكم'}
              </span>
            </button>
          </form>

          <p className="mt-5 text-center text-[11px] leading-relaxed text-[#9E9580]">
            {locale === 'en'
              ? 'Protected by Firebase Authentication and Firestore Security Rules.'
              : 'محمية عبر Firebase Authentication وقواعد أمان Firestore لحماية بيانات المرضى.'}
          </p>
        </div>
      </section>
    );
  }

  // ===========================================================================
  // State 3: Authenticated Non-Admin User
  // ===========================================================================
  if (!isAdmin) {
    return (
      <section className="flex min-h-[75vh] items-center justify-center bg-[#080808] px-4 py-16">
        <div className="w-full max-w-lg rounded-[30px] border border-rose-500/30 bg-[#141110] p-8 text-center shadow-2xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-rose-500/35 bg-rose-950/50 text-rose-300">
            <ShieldAlert className="h-7 w-7" aria-hidden="true" />
          </div>

          <h1 className="mt-4 text-2xl font-bold text-[#F7F3E9]">
            {locale === 'en'
              ? 'Administrator Access Required'
              : 'هذا الحساب غير مصرح له بالدخول'}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-[#C8BFA8]">
            {locale === 'en'
              ? 'Patient appointment records are strictly protected. Your signed-in account does not have clinic admin permissions.'
              : 'بيانات حجوزات المرضى محمية بالكامل. الحساب المسجل به حالياً لا يملك صلاحية إدارة عيادة نوفا.'}
          </p>

          <div className="mt-5 space-y-1.5 rounded-2xl border border-[#D4AF37]/20 bg-[#0A0908] p-4 text-start text-xs text-[#C8BFA8]">
            <p>
              <span className="text-[#9E9580]">
                {locale === 'en' ? 'Account: ' : 'الحساب: '}
              </span>
              <span dir="ltr" className="font-semibold text-[#F7F3E9]">
                {formatAdminDisplayIdentifier(user.email)}
              </span>
            </p>
            <p>
              <span className="text-[#9E9580]">UID: </span>
              <span dir="ltr" className="font-mono text-[#E6C76A] break-all">
                {user.uid}
              </span>
            </p>
          </div>

          <button
            type="button"
            onClick={signOutUser}
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/35 bg-[#161512] px-6 py-2.5 text-sm font-bold text-[#F7F3E9] hover:border-[#E6C76A] hover:text-[#E6C76A] cursor-pointer"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            <span>
              {locale === 'en'
                ? 'Sign out & switch account'
                : 'تسجيل الخروج وتبديل الحساب'}
            </span>
          </button>
        </div>
      </section>
    );
  }

  // ===========================================================================
  // State 4: Full Real-Time Clinic Admin Dashboard
  // ===========================================================================
  return (
    <section className="min-h-screen bg-[#080808] py-8 sm:py-12">
      <div className="mx-auto max-w-[1380px] space-y-7 px-4 sm:px-6 lg:px-8">
        {/* Top Command Header */}
        <div className="flex flex-col gap-5 rounded-[26px] border border-[#D4AF37]/25 bg-[#12110E] p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/35 bg-emerald-950/60 px-3 py-0.5 text-[11px] font-bold text-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span>
                  {locale === 'en' ? 'Live Firestore Sync' : 'متصل مباشر بقاعدة البيانات'}
                </span>
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-[#D4AF37]/30 bg-[#1B1810] px-2.5 py-0.5 text-[11px] font-semibold text-[#E6C76A]">
                <ShieldCheck className="h-3 w-3" aria-hidden="true" />
                <span>
                  {adminRole === 'super_admin'
                    ? locale === 'en'
                      ? 'Clinic Owner'
                      : 'مدير العيادة'
                    : locale === 'en'
                      ? 'Receptionist'
                      : 'استقبال العيادة'}
                </span>
              </span>
            </div>

            <h1 className="text-2xl font-bold text-[#F7F3E9] sm:text-3xl">
              {locale === 'en'
                ? 'NOVA Clinic Control Center'
                : 'لوحة إدارة عيادة نوفا'}
            </h1>
            <p className="text-xs text-[#9E9580] sm:text-sm">
              <span dir="ltr" className="font-semibold text-[#E6C76A]">
                {formatAdminDisplayIdentifier(user.email)}
              </span>{' '}
              ·{' '}
              {locale === 'en'
                ? CLINIC_INFO.shortBranchesEn
                : CLINIC_INFO.shortBranchesAr}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => openWalkInWithPreset('fifth-settlement', todayIso, '')}
              className="inline-flex min-h-[42px] items-center gap-2 rounded-full bg-[#D4AF37] px-5 py-2 text-sm font-bold text-[#080808] transition-colors hover:bg-[#E6C76A] cursor-pointer"
            >
              <CalendarPlus className="h-4 w-4" aria-hidden="true" />
              <span>{locale === 'en' ? 'New Booking' : 'إضافة حجز جديد'}</span>
            </button>

            {activeTab === 'bookings' && (
              <button
                type="button"
                onClick={handleExportCsv}
                disabled={filteredBookings.length === 0}
                className="inline-flex min-h-[42px] items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#161512] px-4 py-2 text-sm font-semibold text-[#F7F3E9] transition-colors hover:border-[#E6C76A] hover:text-[#E6C76A] disabled:opacity-50 cursor-pointer"
              >
                <Download className="h-4 w-4 text-[#D4AF37]" aria-hidden="true" />
                <span>{locale === 'en' ? 'Export CSV' : 'تصدير CSV'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setChangePasswordOpen(true)}
              className="inline-flex min-h-[42px] items-center gap-2 rounded-full border border-[#D4AF37]/25 bg-[#161512] px-4 py-2 text-sm font-semibold text-[#F7F3E9] transition-colors hover:border-[#E6C76A] hover:text-[#E6C76A] cursor-pointer"
            >
              <KeyRound className="h-4 w-4 text-[#D4AF37]" aria-hidden="true" />
              <span>
                {locale === 'en' ? 'Password' : 'تغيير كلمة المرور'}
              </span>
            </button>

            <button
              type="button"
              onClick={signOutUser}
              className="inline-flex min-h-[42px] items-center gap-2 rounded-full border border-[#D4AF37]/20 bg-[#0A0908] px-4 py-2 text-sm font-semibold text-[#C8BFA8] transition-colors hover:border-rose-400/50 hover:text-rose-300 cursor-pointer"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              <span>{locale === 'en' ? 'Sign Out' : 'خروج'}</span>
            </button>
          </div>
        </div>

        {/* Unified Section Navigation Tabs */}
        <div
          role="tablist"
          aria-label={
            locale === 'en' ? 'Clinic management sections' : 'أقسام إدارة العيادة'
          }
          className="flex flex-wrap items-center gap-2 rounded-[22px] border border-[#D4AF37]/20 bg-[#12110E] p-2"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'bookings'}
            onClick={() => setActiveTab('bookings')}
            className={`inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-bold transition-colors sm:flex-none sm:px-6 cursor-pointer ${
              activeTab === 'bookings'
                ? 'bg-[#D4AF37] text-[#080808]'
                : 'text-[#C8BFA8] hover:bg-[#191712] hover:text-[#F7F3E9]'
            }`}
          >
            <CalendarDays className="h-4 w-4" aria-hidden="true" />
            <span>{locale === 'en' ? 'Appointments' : 'الحجوزات'}</span>
            {metrics.pending > 0 && (
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-bold tabular-nums ${
                  activeTab === 'bookings'
                    ? 'bg-[#080808]/20 text-[#080808]'
                    : 'border border-amber-500/40 bg-amber-950/70 text-amber-300'
                }`}
              >
                {metrics.pending}
              </span>
            )}
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'inquiries'}
            onClick={() => setActiveTab('inquiries')}
            className={`inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-bold transition-colors sm:flex-none sm:px-6 cursor-pointer ${
              activeTab === 'inquiries'
                ? 'bg-[#D4AF37] text-[#080808]'
                : 'text-[#C8BFA8] hover:bg-[#191712] hover:text-[#F7F3E9]'
            }`}
          >
            <Inbox className="h-4 w-4" aria-hidden="true" />
            <span>{locale === 'en' ? 'Contact Inquiries' : 'رسائل التواصل'}</span>
            {unreadInquiriesCount > 0 && (
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-bold tabular-nums ${
                  activeTab === 'inquiries'
                    ? 'bg-[#080808]/20 text-[#080808]'
                    : 'border border-amber-500/40 bg-amber-950/70 text-amber-300'
                }`}
              >
                {unreadInquiriesCount}
              </span>
            )}
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'reviews'}
            onClick={() => setActiveTab('reviews')}
            className={`inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-bold transition-colors sm:flex-none sm:px-5 cursor-pointer ${
              activeTab === 'reviews'
                ? 'bg-[#D4AF37] text-[#080808]'
                : 'text-[#C8BFA8] hover:bg-[#191712] hover:text-[#F7F3E9]'
            }`}
          >
            <Star className="h-4 w-4" aria-hidden="true" />
            <span>{locale === 'en' ? 'Reviews' : 'تقييمات المرضى'}</span>
            {pendingReviewsCount > 0 && (
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-bold tabular-nums ${
                  activeTab === 'reviews'
                    ? 'bg-[#080808]/20 text-[#080808]'
                    : 'border border-amber-500/40 bg-amber-950/70 text-amber-300'
                }`}
              >
                {pendingReviewsCount}
              </span>
            )}
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'offers'}
            onClick={() => setActiveTab('offers')}
            className={`inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-bold transition-colors sm:flex-none sm:px-5 cursor-pointer ${
              activeTab === 'offers'
                ? 'bg-[#D4AF37] text-[#080808]'
                : 'text-[#C8BFA8] hover:bg-[#191712] hover:text-[#F7F3E9]'
            }`}
          >
            <Tag className="h-4 w-4" aria-hidden="true" />
            <span>{locale === 'en' ? 'Offers' : 'العروض والباقات'}</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'analytics'}
            onClick={() => setActiveTab('analytics')}
            className={`inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-bold transition-colors sm:flex-none sm:px-5 cursor-pointer ${
              activeTab === 'analytics'
                ? 'bg-[#D4AF37] text-[#080808]'
                : 'text-[#C8BFA8] hover:bg-[#191712] hover:text-[#F7F3E9]'
            }`}
          >
            <BarChart3 className="h-4 w-4" aria-hidden="true" />
            <span>{locale === 'en' ? 'Analytics' : 'التحليلات والتقارير'}</span>
          </button>
        </div>

        {/* Toast & Error Alerts */}
        {toast && (
          <div
            role="status"
            className="flex items-center gap-2.5 rounded-2xl border border-emerald-500/35 bg-emerald-950/60 px-4 py-3 text-sm font-semibold text-emerald-200"
          >
            <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{toast}</span>
          </div>
        )}

        {dbError && (
          <div
            role="alert"
            className="flex items-center gap-2.5 rounded-2xl border border-rose-500/35 bg-rose-950/50 px-4 py-3 text-sm font-medium text-rose-200"
          >
            <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{dbError}</span>
          </div>
        )}

        {activeTab === 'inquiries' && (
          <AdminInquiriesPanel
            inquiries={activeInquiries}
            loading={loadingInquiries}
            locale={locale}
            onNotify={(msg) => setToast(msg)}
            onError={(msg) => setDbError(msg)}
          />
        )}

        {activeTab === 'reviews' && (
          <AdminReviewsPanel
            reviews={activeReviews}
            loading={loadingReviews}
            locale={locale}
            onNotify={(msg) => setToast(msg)}
            onError={(msg) => setDbError(msg)}
          />
        )}

        {activeTab === 'offers' && (
          <AdminOffersPanel
            offers={activeOffers}
            loading={loadingOffers}
            locale={locale}
            onNotify={(msg) => setToast(msg)}
            onError={(msg) => setDbError(msg)}
          />
        )}

        {activeTab === 'analytics' && (
          <AdminAnalyticsPanel
            bookings={activeBookings}
            inquiries={activeInquiries}
            reviews={activeReviews}
            todayIso={todayIso}
            locale={locale}
          />
        )}

        {activeTab === 'bookings' && (
          <>
        {/* KPI Metrics Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <button
            type="button"
            onClick={() =>
              setFilters((f) => ({ ...f, status: 'all', dateFilter: 'all' }))
            }
            className="rounded-[22px] border border-[#D4AF37]/25 bg-[#12110E] p-5 text-start transition-colors hover:border-[#E6C76A]/60 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#9E9580]">
                {locale === 'en' ? 'Total Bookings' : 'إجمالي الحجوزات'}
              </span>
              <Users className="h-5 w-5 text-[#D4AF37]" aria-hidden="true" />
            </div>
            <p className="mt-2 text-3xl font-bold text-[#F7F3E9] tabular-nums">
              {metrics.total}
            </p>
            <p className="mt-2 text-xs text-[#C8BFA8]">
              {locale === 'en'
                ? `5th Settlement: ${metrics.fifthSettlementCount} · Nasr City: ${metrics.nasrCityCount}`
                : `التجمع الخامس: ${metrics.fifthSettlementCount} · مدينة نصر: ${metrics.nasrCityCount}`}
            </p>
          </button>

          <button
            type="button"
            onClick={() =>
              setFilters((f) => ({ ...f, status: 'pending', dateFilter: 'all' }))
            }
            className="rounded-[22px] border border-amber-500/35 bg-[#16130D] p-5 text-start transition-colors hover:border-amber-400 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-300">
                {locale === 'en' ? 'Awaiting Confirmation' : 'بانتظار التأكيد'}
              </span>
              <Clock className="h-5 w-5 text-amber-400" aria-hidden="true" />
            </div>
            <p className="mt-2 text-3xl font-bold text-amber-200 tabular-nums">
              {metrics.pending}
            </p>
            <p className="mt-2 text-xs text-[#C8BFA8]">
              {locale === 'en'
                ? 'Click to filter new patient requests'
                : 'اضغط لعرض الطلبات الجديدة فقط'}
            </p>
          </button>

          <button
            type="button"
            onClick={() =>
              setFilters((f) => ({ ...f, status: 'all', dateFilter: 'today' }))
            }
            className="rounded-[22px] border border-[#D4AF37]/35 bg-[#15130E] p-5 text-start transition-colors hover:border-[#E6C76A] cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#E6C76A]">
                {locale === 'en' ? "Today's Appointments" : 'مواعيد اليوم'}
              </span>
              <CalendarDays className="h-5 w-5 text-[#E6C76A]" aria-hidden="true" />
            </div>
            <p className="mt-2 text-3xl font-bold text-[#E6C76A] tabular-nums">
              {metrics.todayCount}
            </p>
            <p dir="ltr" className="mt-2 text-xs text-[#C8BFA8] rtl:text-right tabular-nums">
              {todayIso}
            </p>
          </button>

          <button
            type="button"
            onClick={() =>
              setFilters((f) => ({ ...f, status: 'confirmed', dateFilter: 'all' }))
            }
            className="rounded-[22px] border border-emerald-500/30 bg-[#101512] p-5 text-start transition-colors hover:border-emerald-400 cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-300">
                {locale === 'en' ? 'Confirmed & Completed' : 'المؤكدة والمكتملة'}
              </span>
              <CalendarCheck className="h-5 w-5 text-emerald-400" aria-hidden="true" />
            </div>
            <p className="mt-2 text-3xl font-bold text-emerald-200 tabular-nums">
              {metrics.confirmed + metrics.completed}
            </p>
            <p className="mt-2 text-xs text-[#C8BFA8]">
              {locale === 'en'
                ? `Confirmed: ${metrics.confirmed} · Completed: ${metrics.completed}`
                : `مؤكد: ${metrics.confirmed} · مكتمل: ${metrics.completed}`}
            </p>
          </button>
        </div>

        {/* View Mode Switcher & Filter Toolbar */}
        <div className="space-y-4 rounded-[24px] border border-[#D4AF37]/20 bg-[#12110E] p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex rounded-full border border-[#D4AF37]/25 bg-[#0A0908] p-1">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-[#D4AF37] text-[#080808]'
                    : 'text-[#C8BFA8] hover:text-[#F7F3E9]'
                }`}
              >
                <List className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{locale === 'en' ? 'Bookings Table' : 'قائمة الحجوزات'}</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('schedule')}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                  viewMode === 'schedule'
                    ? 'bg-[#D4AF37] text-[#080808]'
                    : 'text-[#C8BFA8] hover:text-[#F7F3E9]'
                }`}
              >
                <LayoutGrid className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{locale === 'en' ? 'Daily Branch Schedule' : 'جدول الساعات اليومي'}</span>
              </button>
            </div>

            {viewMode === 'schedule' ? (
              <div className="flex items-center gap-2">
                <label
                  htmlFor="schedule-date-picker"
                  className="text-xs font-semibold text-[#C8BFA8]"
                >
                  {locale === 'en' ? 'Schedule Date:' : 'تاريخ الجدول:'}
                </label>
                <input
                  id="schedule-date-picker"
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="rounded-xl border border-[#D4AF37]/25 bg-[#0A0908] px-3 py-1.5 text-xs font-semibold text-[#F7F3E9] focus:border-[#E6C76A] focus:outline-none"
                />
              </div>
            ) : (
              <span className="text-xs font-semibold text-[#9E9580] tabular-nums">
                {locale === 'en'
                  ? `Showing ${filteredBookings.length} of ${bookings.length} bookings`
                  : `عرض ${filteredBookings.length} من أصل ${bookings.length} حجز`}
              </span>
            )}
          </div>

          {viewMode === 'list' && (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-12">
              {/* Search */}
              <div className="relative lg:col-span-4">
                <Search
                  className="pointer-events-none absolute top-1/2 start-3.5 h-4 w-4 -translate-y-1/2 text-[#9E9580]"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={filters.search}
                  onChange={(e) =>
                    setFilters((f) => ({ ...f, search: e.target.value }))
                  }
                  placeholder={
                    locale === 'en'
                      ? 'Search name, phone, or NV-code...'
                      : 'ابحث بالاسم، رقم الهاتف، أو كود الحجز...'
                  }
                  className="w-full rounded-xl border border-[#D4AF37]/20 bg-[#0A0908] py-2.5 ps-10 pe-3.5 text-sm text-[#F7F3E9] placeholder:text-[#9E9580]/70 focus:border-[#E6C76A] focus:outline-none"
                />
              </div>

              {/* Branch Filter */}
              <div className="lg:col-span-3">
                <select
                  aria-label={locale === 'en' ? 'Filter by branch' : 'تصفية حسب الفرع'}
                  value={filters.branch}
                  onChange={(e) =>
                    setFilters((f) => ({
                      ...f,
                      branch: e.target.value as 'all' | BranchId,
                    }))
                  }
                  className="w-full rounded-xl border border-[#D4AF37]/20 bg-[#0A0908] px-3.5 py-2.5 text-sm text-[#F7F3E9] focus:border-[#E6C76A] focus:outline-none"
                >
                  <option value="all" className="bg-[#161512]">
                    {locale === 'en' ? 'All Branches' : 'جميع الفروع'}
                  </option>
                  {CLINIC_BRANCHES.map((b) => (
                    <option key={b.id} value={b.id} className="bg-[#161512]">
                      {locale === 'en' ? b.nameEn : b.nameAr}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className="lg:col-span-2">
                <select
                  aria-label={locale === 'en' ? 'Filter by status' : 'تصفية حسب الحالة'}
                  value={filters.status}
                  onChange={(e) =>
                    setFilters((f) => ({
                      ...f,
                      status: e.target.value as 'all' | BookingStatus,
                    }))
                  }
                  className="w-full rounded-xl border border-[#D4AF37]/20 bg-[#0A0908] px-3.5 py-2.5 text-sm text-[#F7F3E9] focus:border-[#E6C76A] focus:outline-none"
                >
                  <option value="all" className="bg-[#161512]">
                    {locale === 'en' ? 'All Statuses' : 'جميع الحالات'}
                  </option>
                  {(Object.keys(STATUS_STYLES) as BookingStatus[]).map((st) => (
                    <option key={st} value={st} className="bg-[#161512]">
                      {locale === 'en'
                        ? STATUS_STYLES[st].labelEn
                        : STATUS_STYLES[st].labelAr}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Filter */}
              <div className="flex items-center gap-2 lg:col-span-3">
                <select
                  aria-label={locale === 'en' ? 'Filter by date' : 'تصفية حسب التاريخ'}
                  value={filters.dateFilter}
                  onChange={(e) =>
                    setFilters((f) => ({
                      ...f,
                      dateFilter: e.target.value as AdminBookingFilters['dateFilter'],
                    }))
                  }
                  className="w-full rounded-xl border border-[#D4AF37]/20 bg-[#0A0908] px-3.5 py-2.5 text-sm text-[#F7F3E9] focus:border-[#E6C76A] focus:outline-none"
                >
                  <option value="all" className="bg-[#161512]">
                    {locale === 'en' ? 'All Dates' : 'كل التواريخ'}
                  </option>
                  <option value="today" className="bg-[#161512]">
                    {locale === 'en' ? 'Today Only' : 'اليوم فقط'}
                  </option>
                  <option value="upcoming" className="bg-[#161512]">
                    {locale === 'en' ? 'Upcoming' : 'المواعيد القادمة'}
                  </option>
                  <option value="custom" className="bg-[#161512]">
                    {locale === 'en' ? 'Specific Date' : 'تاريخ محدد'}
                  </option>
                </select>

                {filters.dateFilter === 'custom' && (
                  <input
                    type="date"
                    value={filters.customDate}
                    onChange={(e) =>
                      setFilters((f) => ({ ...f, customDate: e.target.value }))
                    }
                    className="rounded-xl border border-[#D4AF37]/20 bg-[#0A0908] px-2.5 py-2 text-xs text-[#F7F3E9] focus:border-[#E6C76A] focus:outline-none"
                  />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Main Content Area: Table/Cards vs Daily Branch Schedule */}
        {loadingBookings ? (
          <div className="rounded-[24px] border border-[#D4AF37]/20 bg-[#12110E] p-12 text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-[#D4AF37]/25 border-t-[#D4AF37]" />
            <p className="mt-4 text-sm text-[#C8BFA8]">
              {locale === 'en'
                ? 'Loading live clinic bookings...'
                : 'جاري تحميل حجوزات العيادة...'}
            </p>
          </div>
        ) : viewMode === 'schedule' ? (
          /* Daily Branch Hourly Schedule View (Fifth Settlement & Nasr City Side-by-Side) */
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {CLINIC_BRANCHES.map((branch) => {
              const hours: string[] = [];
              for (let h = branch.openHour; h <= branch.closeHour; h += 1) {
                hours.push(`${String(h).padStart(2, '0')}:00`);
              }

              const branchDayBookings = bookings.filter(
                (b) =>
                  b.branchId === branch.id &&
                  b.date === scheduleDate &&
                  b.status !== 'cancelled' &&
                  b.status !== 'no-show'
              );

              return (
                <div
                  key={branch.id}
                  className="overflow-hidden rounded-[24px] border border-[#D4AF37]/25 bg-[#12110E]"
                >
                  <div className="flex items-center justify-between border-b border-[#D4AF37]/20 bg-[#0D0C0A] px-5 py-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-[#D4AF37]" aria-hidden="true" />
                      <h2 className="text-base font-bold text-[#F7F3E9]">
                        {locale === 'en' ? branch.nameEn : branch.nameAr}
                      </h2>
                    </div>
                    <span className="rounded-full border border-[#D4AF37]/30 bg-[#1B1810] px-3 py-0.5 text-xs font-bold text-[#E6C76A] tabular-nums">
                      {branchDayBookings.length} / {hours.length}
                    </span>
                  </div>

                  <div className="divide-y divide-[#D4AF37]/10">
                    {hours.map((hour) => {
                      const slotBooking = branchDayBookings.find(
                        (b) => b.time === hour
                      );
                      const srv = slotBooking
                        ? DENTAL_SERVICES.find(
                            (s) => s.id === slotBooking.serviceId
                          )
                        : null;

                      return (
                        <div
                          key={hour}
                          className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-[#171510]"
                        >
                          <span
                            dir="ltr"
                            className="w-20 shrink-0 text-xs font-bold text-[#E6C76A] tabular-nums"
                          >
                            {formatTimeLocalized(hour, locale)}
                          </span>

                          {slotBooking ? (
                            <button
                              type="button"
                              onClick={() => setSelectedBooking(slotBooking)}
                              className="flex flex-1 items-center justify-between gap-3 rounded-xl border border-[#D4AF37]/25 bg-[#191711] px-3.5 py-2 text-start transition-colors hover:border-[#E6C76A] cursor-pointer"
                            >
                              <div className="min-w-0">
                                <p className="truncate text-sm font-bold text-[#F7F3E9]">
                                  {slotBooking.patientName}
                                </p>
                                <p className="truncate text-xs text-[#C8BFA8]">
                                  {srv
                                    ? locale === 'en'
                                      ? srv.titleEn
                                      : srv.titleAr
                                    : slotBooking.serviceId}
                                </p>
                              </div>
                              <span
                                className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${
                                  STATUS_STYLES[slotBooking.status].badge
                                }`}
                              >
                                {locale === 'en'
                                  ? STATUS_STYLES[slotBooking.status].labelEn
                                  : STATUS_STYLES[slotBooking.status].labelAr}
                              </span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() =>
                                openWalkInWithPreset(branch.id, scheduleDate, hour)
                              }
                              className="flex flex-1 items-center justify-between rounded-xl border border-dashed border-[#D4AF37]/20 px-3.5 py-2 text-xs text-[#9E9580] transition-colors hover:border-[#D4AF37]/60 hover:text-[#E6C76A] cursor-pointer"
                            >
                              <span>
                                {locale === 'en' ? 'Available slot' : 'موعد متاح'}
                              </span>
                              <span className="font-bold">
                                + {locale === 'en' ? 'Book' : 'حجز'}
                              </span>
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-[#D4AF37]/25 bg-[#12110E] p-12 text-center">
            <Calendar className="mx-auto h-10 w-10 text-[#D4AF37]/50" aria-hidden="true" />
            <h2 className="mt-3 text-lg font-bold text-[#F7F3E9]">
              {bookings.length === 0
                ? locale === 'en'
                  ? 'No appointments recorded yet'
                  : 'لا توجد حجوزات مسجلة حتى الآن'
                : locale === 'en'
                  ? 'No bookings match your current filters'
                  : 'لا توجد حجوزات تطابق معايير البحث الحالية'}
            </h2>
            <p className="mt-1.5 text-sm text-[#9E9580]">
              {bookings.length === 0
                ? locale === 'en'
                  ? 'New patient bookings from /appointment will appear here instantaneously, or add a walk-in booking now.'
                  : 'ستظهر حجوزات المرضى الجديدة من صفحة الحجز هنا فوراً، أو يمكنك إضافة حجز هاتفي/حضوري الآن.'
                : locale === 'en'
                  ? 'Try clearing your search or changing branch/status filters.'
                  : 'جرّب مسح نص البحث أو تغيير فلاتر الفرع والحالة.'}
            </p>
            <button
              type="button"
              onClick={() =>
                bookings.length === 0
                  ? openWalkInWithPreset('fifth-settlement', todayIso, '')
                  : setFilters({
                      search: '',
                      branch: 'all',
                      status: 'all',
                      dateFilter: 'all',
                      customDate: todayIso,
                    })
              }
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#D4AF37] px-5 py-2.5 text-sm font-bold text-[#080808] hover:bg-[#E6C76A] cursor-pointer"
            >
              {bookings.length === 0 ? (
                <>
                  <CalendarPlus className="h-4 w-4" aria-hidden="true" />
                  <span>{locale === 'en' ? 'Add First Booking' : 'إضافة أول حجز'}</span>
                </>
              ) : (
                <span>{locale === 'en' ? 'Reset Filters' : 'إعادة ضبط الفلاتر'}</span>
              )}
            </button>
          </div>
        ) : (
          /* Bookings Responsive Table (Desktop) + Cards (Mobile) */
          <div className="overflow-hidden rounded-[24px] border border-[#D4AF37]/25 bg-[#12110E]">
            {/* Desktop Table */}
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full border-collapse text-start text-sm">
                <thead>
                  <tr className="border-b border-[#D4AF37]/20 bg-[#0D0C0A] text-xs font-bold text-[#E6C76A]">
                    <th className="px-4 py-3.5 text-start">
                      {locale === 'en' ? 'Reference' : 'المرجع'}
                    </th>
                    <th className="px-4 py-3.5 text-start">
                      {locale === 'en' ? 'Patient' : 'المريض والتواصل'}
                    </th>
                    <th className="px-4 py-3.5 text-start">
                      {locale === 'en' ? 'Branch & Service' : 'الفرع والخدمة'}
                    </th>
                    <th className="px-4 py-3.5 text-start">
                      {locale === 'en' ? 'Date & Time' : 'الموعد'}
                    </th>
                    <th className="px-4 py-3.5 text-start">
                      {locale === 'en' ? 'Status' : 'الحالة'}
                    </th>
                    <th className="px-4 py-3.5 text-end">
                      {locale === 'en' ? 'Actions' : 'الإجراءات'}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D4AF37]/10">
                  {filteredBookings.map((booking) => {
                    const branch = CLINIC_BRANCHES.find(
                      (b) => b.id === booking.branchId
                    );
                    const service = DENTAL_SERVICES.find(
                      (s) => s.id === booking.serviceId
                    );
                    const st = STATUS_STYLES[booking.status];
                    const isBusy = busyBookingId === booking.id;

                    return (
                      <tr
                        key={booking.id}
                        className="transition-colors hover:bg-[#171510]"
                      >
                        <td className="px-4 py-4 align-top">
                          <span
                            dir="ltr"
                            className="block font-bold text-[#E6C76A] tabular-nums"
                          >
                            {booking.referenceCode}
                          </span>
                          <span className="mt-1 inline-block rounded-md border border-[#D4AF37]/20 bg-[#0A0908] px-2 py-0.5 text-[10px] font-semibold text-[#9E9580]">
                            {booking.source === 'admin-walkin'
                              ? locale === 'en'
                                ? 'Reception'
                                : 'استقبال'
                              : locale === 'en'
                                ? 'Website'
                                : 'الموقع'}
                          </span>
                        </td>

                        <td className="px-4 py-4 align-top">
                          <p className="font-bold text-[#F7F3E9]">
                            {booking.patientName}
                          </p>
                          <div className="mt-1 flex flex-wrap items-center gap-2">
                            <a
                              href={`tel:+2${booking.patientPhone}`}
                              dir="ltr"
                              className="inline-flex items-center gap-1 text-xs font-semibold text-[#C8BFA8] hover:text-[#E6C76A] tabular-nums"
                            >
                              <Phone className="h-3 w-3 text-[#D4AF37]" />
                              <span>{booking.patientPhone}</span>
                            </a>
                            <a
                              href={buildPatientWhatsAppReplyUrl(booking, locale)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 rounded-full border border-[#25D366]/35 bg-[#25D366]/10 px-2 py-0.5 text-[11px] font-bold text-[#25D366] hover:bg-[#25D366]/20"
                            >
                              <MessageCircle className="h-3 w-3" />
                              <span>WhatsApp</span>
                            </a>
                          </div>
                          {(booking.notes || booking.adminNotes) && (
                            <p className="mt-1.5 max-w-xs truncate text-xs text-[#9E9580]">
                              {booking.adminNotes || booking.notes}
                            </p>
                          )}
                        </td>

                        <td className="px-4 py-4 align-top">
                          <p className="font-semibold text-[#F7F3E9]">
                            {service
                              ? locale === 'en'
                                ? service.titleEn
                                : service.titleAr
                              : booking.serviceId}
                          </p>
                          <p className="mt-1 flex items-center gap-1 text-xs text-[#C8BFA8]">
                            <MapPin className="h-3.5 w-3.5 shrink-0 text-[#D4AF37]" />
                            <span>
                              {branch
                                ? locale === 'en'
                                  ? branch.nameEn
                                  : branch.nameAr
                                : booking.branchId}
                            </span>
                          </p>
                        </td>

                        <td className="px-4 py-4 align-top">
                          <p
                            dir="ltr"
                            className="font-bold text-[#F7F3E9] rtl:text-right tabular-nums"
                          >
                            {booking.date}
                          </p>
                          <p className="mt-0.5 text-xs font-semibold text-[#E6C76A]">
                            {formatTimeLocalized(booking.time, locale)}
                          </p>
                        </td>

                        <td className="px-4 py-4 align-top">
                          <span
                            className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${st.badge}`}
                          >
                            {locale === 'en' ? st.labelEn : st.labelAr}
                          </span>
                        </td>

                        <td className="px-4 py-4 align-top text-end">
                          <div className="flex flex-wrap items-center justify-end gap-1.5">
                            {booking.status === 'pending' && (
                              <button
                                type="button"
                                disabled={isBusy}
                                onClick={() =>
                                  handleQuickStatus(booking, 'confirmed')
                                }
                                className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 px-3 py-1 text-xs font-bold text-emerald-300 hover:bg-emerald-500/30 disabled:opacity-50 cursor-pointer"
                              >
                                <Check className="h-3.5 w-3.5" />
                                <span>{locale === 'en' ? 'Confirm' : 'تأكيد'}</span>
                              </button>
                            )}

                            {booking.status === 'confirmed' && (
                              <button
                                type="button"
                                disabled={isBusy}
                                onClick={() =>
                                  handleQuickStatus(booking, 'completed')
                                }
                                className="inline-flex items-center gap-1 rounded-full bg-sky-500/20 border border-sky-500/40 px-3 py-1 text-xs font-bold text-sky-300 hover:bg-sky-500/30 disabled:opacity-50 cursor-pointer"
                              >
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                <span>{locale === 'en' ? 'Done' : 'مكتمل'}</span>
                              </button>
                            )}

                            {(booking.status === 'pending' ||
                              booking.status === 'confirmed') && (
                              <button
                                type="button"
                                disabled={isBusy}
                                onClick={() =>
                                  handleQuickStatus(booking, 'cancelled')
                                }
                                className="inline-flex items-center gap-1 rounded-full bg-rose-500/15 border border-rose-500/35 px-3 py-1 text-xs font-bold text-rose-300 hover:bg-rose-500/25 disabled:opacity-50 cursor-pointer"
                              >
                                <XCircle className="h-3.5 w-3.5" />
                                <span>{locale === 'en' ? 'Cancel' : 'إلغاء'}</span>
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => setSelectedBooking(booking)}
                              className="inline-flex items-center gap-1 rounded-full border border-[#D4AF37]/30 bg-[#1B1810] px-3 py-1 text-xs font-bold text-[#E6C76A] hover:bg-[#D4AF37] hover:text-[#080808] cursor-pointer"
                            >
                              <SlidersHorizontal className="h-3.5 w-3.5" />
                              <span>{locale === 'en' ? 'Manage' : 'إدارة'}</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="divide-y divide-[#D4AF37]/15 lg:hidden">
              {filteredBookings.map((booking) => {
                const branch = CLINIC_BRANCHES.find(
                  (b) => b.id === booking.branchId
                );
                const service = DENTAL_SERVICES.find(
                  (s) => s.id === booking.serviceId
                );
                const st = STATUS_STYLES[booking.status];
                const isBusy = busyBookingId === booking.id;

                return (
                  <div key={booking.id} className="space-y-3 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        dir="ltr"
                        className="text-xs font-bold text-[#E6C76A] tabular-nums"
                      >
                        {booking.referenceCode}
                      </span>
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${st.badge}`}
                      >
                        {locale === 'en' ? st.labelEn : st.labelAr}
                      </span>
                    </div>

                    <div>
                      <p className="text-base font-bold text-[#F7F3E9]">
                        {booking.patientName}
                      </p>
                      <p className="mt-0.5 text-xs font-semibold text-[#E6C76A]">
                        {service
                          ? locale === 'en'
                            ? service.titleEn
                            : service.titleAr
                          : booking.serviceId}
                      </p>
                      <p className="mt-1 text-xs text-[#C8BFA8]">
                        {branch
                          ? locale === 'en'
                            ? branch.nameEn
                            : branch.nameAr
                          : booking.branchId}{' '}
                        · {booking.date} ·{' '}
                        {formatTimeLocalized(booking.time, locale)}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <a
                        href={`tel:+2${booking.patientPhone}`}
                        dir="ltr"
                        className="inline-flex items-center gap-1 rounded-full border border-[#D4AF37]/25 bg-[#0A0908] px-3 py-1 text-xs font-semibold text-[#F7F3E9] tabular-nums"
                      >
                        <Phone className="h-3 w-3 text-[#D4AF37]" />
                        <span>{booking.patientPhone}</span>
                      </a>

                      <a
                        href={buildPatientWhatsAppReplyUrl(booking, locale)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-full bg-[#25D366]/15 border border-[#25D366]/35 px-3 py-1 text-xs font-bold text-[#25D366]"
                      >
                        <MessageCircle className="h-3 w-3" />
                        <span>WhatsApp</span>
                      </a>

                      {booking.status === 'pending' && (
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => handleQuickStatus(booking, 'confirmed')}
                          className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-3 py-1 text-xs font-bold text-emerald-300 cursor-pointer"
                        >
                          {locale === 'en' ? 'Confirm' : 'تأكيد'}
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => setSelectedBooking(booking)}
                        className="ms-auto rounded-full bg-[#D4AF37] px-3.5 py-1 text-xs font-bold text-[#080808] cursor-pointer"
                      >
                        {locale === 'en' ? 'Manage' : 'إدارة'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
          </>
        )}
      </div>

      {/* Modals & Drawers */}
      {walkInOpen && (
        <WalkInBookingModal
          open={walkInOpen}
          locale={locale}
          initialBranch={walkInPreset.branchId}
          initialDate={walkInPreset.date}
          initialTime={walkInPreset.time}
          onClose={() => setWalkInOpen(false)}
          onCreated={() =>
            setToast(
              locale === 'en'
                ? 'New clinic appointment saved to Firestore.'
                : 'تم حفظ الحجز الجديد بنجاح في قاعدة البيانات.'
            )
          }
        />
      )}

      {selectedBooking && (
        <BookingDetailDrawer
          key={selectedBooking.id}
          booking={selectedBooking}
          locale={locale}
          onClose={() => setSelectedBooking(null)}
          onUpdated={(msg) => setToast(msg)}
        />
      )}

      {changePasswordOpen && (
        <ChangePasswordModal
          open={changePasswordOpen}
          locale={locale}
          onClose={() => setChangePasswordOpen(false)}
          onChanged={(msg) => setToast(msg)}
        />
      )}
    </section>
  );
}

export default function AdminDashboard() {
  return (
    <FirebaseErrorBoundary>
      <AdminDashboardContent />
    </FirebaseErrorBoundary>
  );
}
