'use client';

import { FormEvent, useState } from 'react';
import {
  Award,
  CheckCircle2,
  Eye,
  EyeOff,
  MapPin,
  Plus,
  Tag,
  Trash2,
  X,
} from 'lucide-react';
import { DENTAL_SERVICES } from '@/lib/clinic-data';
import {
  ClinicOfferRecord,
  OfferBranchId,
  OfferDraftInput,
  validateOfferInput,
} from '@/lib/clinic-offers';
import {
  createAdminOffer,
  deleteAdminOffer,
  updateAdminOffer,
} from '@/lib/firestore-offers';
import { Locale } from '@/lib/i18n';

interface AdminOffersPanelProps {
  offers: ClinicOfferRecord[];
  loading: boolean;
  locale: Locale;
  onNotify: (message: string) => void;
  onError: (message: string) => void;
}

const INITIAL_DRAFT: OfferDraftInput = {
  titleAr: '',
  titleEn: '',
  badgeAr: 'عرض خاص',
  badgeEn: 'Special Offer',
  descriptionAr: '',
  descriptionEn: '',
  priceLabelAr: '',
  priceLabelEn: '',
  serviceId: 'veneers-dsd',
  branchId: 'all',
  validUntil: '2026-12-31',
  active: true,
  featured: false,
};

export default function AdminOffersPanel({
  offers,
  loading,
  locale,
  onNotify,
  onError,
}: AdminOffersPanelProps) {
  const [composerOpen, setComposerOpen] = useState(false);
  const [draft, setDraft] = useState<OfferDraftInput>(INITIAL_DRAFT);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const activeCount = offers.filter((o) => o.active).length;
  const featuredCount = offers.filter((o) => o.featured).length;

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    const check = validateOfferInput(draft, locale);
    if (!check.valid) {
      setFormErrors(check.errors);
      return;
    }

    setSaving(true);
    setFormErrors({});
    try {
      await createAdminOffer(draft, locale);
      setDraft(INITIAL_DRAFT);
      setComposerOpen(false);
      onNotify(
        locale === 'en'
          ? 'New clinic offer published to Firestore.'
          : 'تم نشر العرض الجديد بنجاح في قاعدة البيانات.'
      );
    } catch (err) {
      onError(
        err instanceof Error
          ? err.message
          : locale === 'en'
            ? 'Failed to create clinic offer.'
            : 'تعذر إنشاء العرض حالياً.'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (offer: ClinicOfferRecord) => {
    setBusyId(offer.id);
    try {
      await updateAdminOffer(offer.id, { active: !offer.active });
      onNotify(
        !offer.active
          ? locale === 'en'
            ? 'Offer activated on /offers.'
            : 'تم تفعيل العرض وظهوره في صفحة العروض.'
          : locale === 'en'
            ? 'Offer hidden from public view.'
            : 'تم إخفاء العرض من الصفحة العامة.'
      );
    } catch {
      onError(
        locale === 'en'
          ? 'Failed to update offer status.'
          : 'تعذر تحديث حالة العرض.'
      );
    } finally {
      setBusyId(null);
    }
  };

  const handleToggleFeatured = async (offer: ClinicOfferRecord) => {
    setBusyId(offer.id);
    try {
      await updateAdminOffer(offer.id, { featured: !offer.featured });
      onNotify(
        locale === 'en'
          ? 'Offer highlight updated.'
          : 'تم تحديث تمييز العرض بنجاح.'
      );
    } catch {
      onError(
        locale === 'en'
          ? 'Failed to update offer highlight.'
          : 'تعذر تحديث تمييز العرض.'
      );
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (offer: ClinicOfferRecord) => {
    setBusyId(offer.id);
    try {
      await deleteAdminOffer(offer.id);
      setConfirmDeleteId(null);
      onNotify(
        locale === 'en' ? 'Offer deleted.' : 'تم حذف العرض نهائياً.'
      );
    } catch {
      onError(
        locale === 'en' ? 'Failed to delete offer.' : 'تعذر حذف العرض.'
      );
    } finally {
      setBusyId(null);
    }
  };

  const formatBranch = (branchId: OfferBranchId) => {
    if (branchId === 'fifth-settlement') {
      return locale === 'en' ? 'Fifth Settlement' : 'التجمع الخامس';
    }
    if (branchId === 'nasr-city') {
      return locale === 'en' ? 'Nasr City' : 'مدينة نصر';
    }
    return locale === 'en' ? 'Both Branches' : 'الفرعين معاً';
  };

  return (
    <div className="space-y-6">
      {/* KPI & Action Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-[22px] border border-[#D4AF37]/25 bg-[#12110E] p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#9E9580]">
              {locale === 'en' ? 'Total Custom Offers' : 'إجمالي العروض المخصصة'}
            </span>
            <Tag className="h-5 w-5 text-[#D4AF37]" aria-hidden="true" />
          </div>
          <p className="mt-2 text-3xl font-bold text-[#F7F3E9] tabular-nums">
            {offers.length}
          </p>
        </div>

        <div className="rounded-[22px] border border-emerald-500/30 bg-[#101512] p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-300">
              {locale === 'en' ? 'Active on Website' : 'نشط على الموقع'}
            </span>
            <CheckCircle2 className="h-5 w-5 text-emerald-400" aria-hidden="true" />
          </div>
          <p className="mt-2 text-3xl font-bold text-emerald-200 tabular-nums">
            {activeCount}
          </p>
        </div>

        <div className="flex flex-col justify-between rounded-[22px] border border-[#D4AF37]/30 bg-[#16130D] p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#E6C76A]">
              {locale === 'en' ? 'Featured Packages' : 'العروض المميزة'}
            </span>
            <Award className="h-5 w-5 text-[#E6C76A]" aria-hidden="true" />
          </div>
          <div className="mt-2 flex items-center justify-between gap-3">
            <p className="text-3xl font-bold text-[#E6C76A] tabular-nums">
              {featuredCount}
            </p>
            <button
              type="button"
              onClick={() => setComposerOpen((prev) => !prev)}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#D4AF37] px-4 py-2 text-xs font-bold text-[#080808] transition-colors hover:bg-[#E6C76A] cursor-pointer"
            >
              {composerOpen ? (
                <>
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{locale === 'en' ? 'Close Form' : 'إغلاق النموذج'}</span>
                </>
              ) : (
                <>
                  <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{locale === 'en' ? 'New Offer' : 'إضافة عرض جديد'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Create Offer Composer */}
      {composerOpen && (
        <form
          onSubmit={handleCreate}
          className="space-y-4 rounded-[26px] border border-[#D4AF37]/35 bg-[#141310] p-6 shadow-2xl"
        >
          <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-3">
            <h2 className="text-lg font-bold text-[#F7F3E9]">
              {locale === 'en'
                ? 'Publish New Clinic Offer'
                : 'نشر عرض أو باقة جديدة للعيادة'}
            </h2>
            <span className="text-xs text-[#9E9580]">
              {locale === 'en' ? 'Appears live on /offers' : 'يظهر فوراً في صفحة /offers'}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="offer-title-ar"
                className="mb-1 block text-xs font-bold text-[#E6C76A]"
              >
                {locale === 'en' ? 'Arabic Title' : 'عنوان العرض (بالعربية)'}
              </label>
              <input
                id="offer-title-ar"
                type="text"
                value={draft.titleAr}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, titleAr: e.target.value }))
                }
                placeholder="مثال: باقة تبييض الليزر الشاملة"
                className="w-full rounded-xl border border-[#D4AF37]/25 bg-[#0A0908] px-3.5 py-2.5 text-sm text-[#F7F3E9] focus:border-[#E6C76A] focus:outline-none"
              />
              {formErrors.titleAr && (
                <p className="mt-1 text-xs text-rose-300">{formErrors.titleAr}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="offer-title-en"
                className="mb-1 block text-xs font-bold text-[#E6C76A]"
              >
                {locale === 'en' ? 'English Title' : 'عنوان العرض (بالإنجليزية)'}
              </label>
              <input
                id="offer-title-en"
                type="text"
                dir="ltr"
                value={draft.titleEn}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, titleEn: e.target.value }))
                }
                placeholder="e.g., Complete Laser Whitening Package"
                className="w-full rounded-xl border border-[#D4AF37]/25 bg-[#0A0908] px-3.5 py-2.5 text-sm text-[#F7F3E9] focus:border-[#E6C76A] focus:outline-none"
              />
              {formErrors.titleEn && (
                <p className="mt-1 text-xs text-rose-300">{formErrors.titleEn}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="offer-price-ar"
                className="mb-1 block text-xs font-bold text-[#E6C76A]"
              >
                {locale === 'en'
                  ? 'Arabic Price / Benefit Label'
                  : 'السعر أو الميزة (بالعربية)'}
              </label>
              <input
                id="offer-price-ar"
                type="text"
                value={draft.priceLabelAr}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, priceLabelAr: e.target.value }))
                }
                placeholder="مثال: خصم 20% عند الحجز أونلاين"
                className="w-full rounded-xl border border-[#D4AF37]/25 bg-[#0A0908] px-3.5 py-2.5 text-sm text-[#F7F3E9] focus:border-[#E6C76A] focus:outline-none"
              />
              {formErrors.priceLabelAr && (
                <p className="mt-1 text-xs text-rose-300">
                  {formErrors.priceLabelAr}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="offer-price-en"
                className="mb-1 block text-xs font-bold text-[#E6C76A]"
              >
                {locale === 'en'
                  ? 'English Price / Benefit Label'
                  : 'السعر أو الميزة (بالإنجليزية)'}
              </label>
              <input
                id="offer-price-en"
                type="text"
                dir="ltr"
                value={draft.priceLabelEn}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, priceLabelEn: e.target.value }))
                }
                placeholder="e.g., 20% Off Online Booking"
                className="w-full rounded-xl border border-[#D4AF37]/25 bg-[#0A0908] px-3.5 py-2.5 text-sm text-[#F7F3E9] focus:border-[#E6C76A] focus:outline-none"
              />
              {formErrors.priceLabelEn && (
                <p className="mt-1 text-xs text-rose-300">
                  {formErrors.priceLabelEn}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="offer-desc-ar"
                className="mb-1 block text-xs font-bold text-[#E6C76A]"
              >
                {locale === 'en' ? 'Arabic Description' : 'وصف العرض (بالعربية)'}
              </label>
              <textarea
                id="offer-desc-ar"
                rows={3}
                value={draft.descriptionAr}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, descriptionAr: e.target.value }))
                }
                placeholder="تفاصيل الجلسة وما تشمله الباقة..."
                className="w-full rounded-xl border border-[#D4AF37]/25 bg-[#0A0908] px-3.5 py-2.5 text-sm text-[#F7F3E9] focus:border-[#E6C76A] focus:outline-none"
              />
              {formErrors.descriptionAr && (
                <p className="mt-1 text-xs text-rose-300">
                  {formErrors.descriptionAr}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="offer-desc-en"
                className="mb-1 block text-xs font-bold text-[#E6C76A]"
              >
                {locale === 'en'
                  ? 'English Description'
                  : 'وصف العرض (بالإنجليزية)'}
              </label>
              <textarea
                id="offer-desc-en"
                rows={3}
                dir="ltr"
                value={draft.descriptionEn}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, descriptionEn: e.target.value }))
                }
                placeholder="Details of what is included in this package..."
                className="w-full rounded-xl border border-[#D4AF37]/25 bg-[#0A0908] px-3.5 py-2.5 text-sm text-[#F7F3E9] focus:border-[#E6C76A] focus:outline-none"
              />
              {formErrors.descriptionEn && (
                <p className="mt-1 text-xs text-rose-300">
                  {formErrors.descriptionEn}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label
                htmlFor="offer-service"
                className="mb-1 block text-xs font-bold text-[#E6C76A]"
              >
                {locale === 'en' ? 'Linked Service' : 'الخدمة المرتبطة'}
              </label>
              <select
                id="offer-service"
                value={draft.serviceId}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, serviceId: e.target.value }))
                }
                className="w-full rounded-xl border border-[#D4AF37]/25 bg-[#0A0908] px-3.5 py-2.5 text-sm text-[#F7F3E9] focus:border-[#E6C76A] focus:outline-none"
              >
                {DENTAL_SERVICES.map((srv) => (
                  <option key={srv.id} value={srv.id} className="bg-[#161512]">
                    {locale === 'en' ? srv.titleEn : srv.titleAr}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="offer-branch"
                className="mb-1 block text-xs font-bold text-[#E6C76A]"
              >
                {locale === 'en' ? 'Branch Scope' : 'الفرع المتاح به العرض'}
              </label>
              <select
                id="offer-branch"
                value={draft.branchId}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    branchId: e.target.value as OfferBranchId,
                  }))
                }
                className="w-full rounded-xl border border-[#D4AF37]/25 bg-[#0A0908] px-3.5 py-2.5 text-sm text-[#F7F3E9] focus:border-[#E6C76A] focus:outline-none"
              >
                <option value="all" className="bg-[#161512]">
                  {locale === 'en' ? 'Both Branches' : 'الفرعين معاً'}
                </option>
                <option value="fifth-settlement" className="bg-[#161512]">
                  {locale === 'en' ? 'Fifth Settlement' : 'التجمع الخامس'}
                </option>
                <option value="nasr-city" className="bg-[#161512]">
                  {locale === 'en' ? 'Nasr City' : 'مدينة نصر'}
                </option>
              </select>
            </div>

            <div>
              <label
                htmlFor="offer-valid-until"
                className="mb-1 block text-xs font-bold text-[#E6C76A]"
              >
                {locale === 'en' ? 'Valid Until' : 'ساري حتى تاريخ'}
              </label>
              <input
                id="offer-valid-until"
                type="date"
                value={draft.validUntil}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, validUntil: e.target.value }))
                }
                className="w-full rounded-xl border border-[#D4AF37]/25 bg-[#0A0908] px-3.5 py-2.5 text-sm text-[#F7F3E9] focus:border-[#E6C76A] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#D4AF37]/15 pt-4">
            <div className="flex flex-wrap items-center gap-5 text-xs font-semibold text-[#C8BFA8]">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={draft.active}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, active: e.target.checked }))
                  }
                  className="accent-[#D4AF37]"
                />
                <span>{locale === 'en' ? 'Active immediately' : 'تفعيل فوري بالموقع'}</span>
              </label>
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={draft.featured}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, featured: e.target.checked }))
                  }
                  className="accent-[#D4AF37]"
                />
                <span>{locale === 'en' ? 'Highlight as featured' : 'تمييز كعرض رئيسي'}</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex min-h-[42px] items-center gap-2 rounded-full bg-[#D4AF37] px-6 py-2 text-sm font-bold text-[#080808] transition-colors hover:bg-[#E6C76A] disabled:opacity-50 cursor-pointer"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              <span>
                {saving
                  ? locale === 'en'
                    ? 'Saving...'
                    : 'جاري الحفظ...'
                  : locale === 'en'
                    ? 'Save & Publish Offer'
                    : 'حفظ ونشر العرض'}
              </span>
            </button>
          </div>
        </form>
      )}

      {/* Offers List */}
      {loading ? (
        <div className="rounded-[24px] border border-[#D4AF37]/20 bg-[#12110E] p-12 text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-[#D4AF37]/25 border-t-[#D4AF37]" />
        </div>
      ) : offers.length === 0 ? (
        <div className="rounded-[24px] border border-dashed border-[#D4AF37]/25 bg-[#12110E] p-12 text-center">
          <Tag className="mx-auto h-10 w-10 text-[#D4AF37]/50" aria-hidden="true" />
          <h3 className="mt-3 text-base font-bold text-[#F7F3E9]">
            {locale === 'en'
              ? 'Default clinic showcase packages are currently live'
              : 'الباقات التعريفية الافتراضية معروضة حالياً'}
          </h3>
          <p className="mt-1.5 text-sm text-[#9E9580]">
            {locale === 'en'
              ? 'Add your first custom seasonal offer above to immediately replace the defaults on /offers.'
              : 'أضف أول عرض موسمي مخصص من الزر بالأعلى ليظهر فوراً في صفحة العروض /offers.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {offers.map((offer) => {
            const isBusy = busyId === offer.id;
            return (
              <article
                key={offer.id}
                className="rounded-[24px] border border-[#D4AF37]/25 bg-[#12110E] p-5"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${
                          offer.active
                            ? 'border-emerald-500/40 bg-emerald-950/60 text-emerald-300'
                            : 'border-zinc-500/35 bg-zinc-900/80 text-zinc-300'
                        }`}
                      >
                        {offer.active
                          ? locale === 'en'
                            ? 'Active'
                            : 'نشط'
                          : locale === 'en'
                            ? 'Hidden'
                            : 'مخفي'}
                      </span>

                      {offer.featured && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-[#D4AF37]/40 bg-[#1B1810] px-2.5 py-0.5 text-[11px] font-bold text-[#E6C76A]">
                          <Award className="h-3 w-3" aria-hidden="true" />
                          <span>{locale === 'en' ? 'Featured' : 'مميز'}</span>
                        </span>
                      )}

                      <span className="inline-flex items-center gap-1 rounded-full border border-[#D4AF37]/20 bg-[#0A0908] px-2.5 py-0.5 text-[11px] text-[#C8BFA8]">
                        <MapPin className="h-3 w-3 text-[#D4AF37]" aria-hidden="true" />
                        <span>{formatBranch(offer.branchId)}</span>
                      </span>

                      <span className="text-[11px] text-[#9E9580] tabular-nums">
                        {locale === 'en' ? 'Until' : 'حتى'}{' '}
                        <span dir="ltr" className="inline-block">
                          {offer.validUntil}
                        </span>
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-[#F7F3E9]">
                      {locale === 'en' ? offer.titleEn : offer.titleAr}
                    </h3>
                    <p className="text-xs font-semibold text-[#E6C76A]">
                      {locale === 'en' ? offer.priceLabelEn : offer.priceLabelAr}
                    </p>
                    <p className="text-sm text-[#C8BFA8]">
                      {locale === 'en' ? offer.descriptionEn : offer.descriptionAr}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => handleToggleActive(offer)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-[#D4AF37]/30 bg-[#1B1810] px-3 py-1.5 text-xs font-bold text-[#F7F3E9] hover:border-[#E6C76A] hover:text-[#E6C76A] disabled:opacity-50 cursor-pointer"
                    >
                      {offer.active ? (
                        <>
                          <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>{locale === 'en' ? 'Hide' : 'إخفاء'}</span>
                        </>
                      ) : (
                        <>
                          <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>{locale === 'en' ? 'Activate' : 'تفعيل'}</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => handleToggleFeatured(offer)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-[#D4AF37]/30 bg-[#0A0908] px-3 py-1.5 text-xs font-bold text-[#E6C76A] hover:bg-[#D4AF37] hover:text-[#080808] disabled:opacity-50 cursor-pointer"
                    >
                      <Award className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>
                        {offer.featured
                          ? locale === 'en'
                            ? 'Unfeature'
                            : 'إلغاء التمييز'
                          : locale === 'en'
                            ? 'Feature'
                            : 'تمييز'}
                      </span>
                    </button>

                    {confirmDeleteId === offer.id ? (
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => handleDelete(offer)}
                          className="rounded-full bg-rose-600 px-3 py-1.5 text-xs font-bold text-white cursor-pointer"
                        >
                          {locale === 'en' ? 'Confirm' : 'تأكيد'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(null)}
                          className="rounded-full border border-[#D4AF37]/25 px-2.5 py-1.5 text-xs text-[#C8BFA8] cursor-pointer"
                        >
                          {locale === 'en' ? 'Cancel' : 'إلغاء'}
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(offer.id)}
                        aria-label={
                          locale === 'en'
                            ? `Delete offer ${offer.titleEn}`
                            : `حذف العرض ${offer.titleAr}`
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-xl border border-rose-500/25 bg-rose-950/30 text-rose-300 hover:bg-rose-950/60 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
