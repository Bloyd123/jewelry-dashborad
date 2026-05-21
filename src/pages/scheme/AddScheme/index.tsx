// FILE: src/pages/scheme/AddScheme/index.tsx

import { useEffect }       from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation }  from 'react-i18next'
import { Loader2 }         from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/common/Alert'
import { Button }          from '@/components/ui/button'
import { useAuth }         from '@/hooks/auth'
import { usePermissionCheck } from '@/hooks/auth/usePermissions'
import { useSchemeById }   from '@/hooks/scheme/useSchemeById'
import { SchemeForm }      from '@/components/scheme/SchemeForm'
import type { CreateSchemeInput } from '@/validators/schemeValidation'
import type { Scheme }     from '@/types/scheme.types'

// ─────────────────────────────────────────────
// HELPER: Convert Scheme → Form Data
// ─────────────────────────────────────────────
const convertSchemeToFormData = (
  scheme: Scheme
): Partial<CreateSchemeInput> => {
  return {
    schemeName:  scheme.schemeName  || '',
    description: scheme.description || '',
    schemeType:  scheme.schemeType,

    duration: {
      months: scheme.duration?.months || 1,
      weeks:  scheme.duration?.weeks  || 0,
    },

    installments: {
      totalInstallments: scheme.installments?.totalInstallments || 1,
      installmentAmount: scheme.installments?.installmentAmount || 0,
      frequency:         scheme.installments?.frequency || 'monthly',
      dueDay:            scheme.installments?.dueDay,
    },

    bonus: {
      hasBonus:         scheme.bonus?.hasBonus         || false,
      bonusType:        scheme.bonus?.bonusType        || 'percentage',
      bonusValue:       scheme.bonus?.bonusValue       || 0,
      bonusDescription: scheme.bonus?.bonusDescription || '',
    },

    eligibility: {
      minAge:               scheme.eligibility?.minAge               ?? 18,
      maxAge:               scheme.eligibility?.maxAge               ?? null,
      minInstallmentAmount: scheme.eligibility?.minInstallmentAmount || 0,
      requiresKYC:          scheme.eligibility?.requiresKYC          ?? true,
    },

    redemption: {
      canRedeemEarly: scheme.redemption?.canRedeemEarly || false,
      earlyRedemptionPenalty: {
        type:  scheme.redemption?.earlyRedemptionPenalty?.type  || 'none',
        value: scheme.redemption?.earlyRedemptionPenalty?.value || 0,
      },
      gracePeriodDays:          scheme.redemption?.gracePeriodDays          || 30,
      missedInstallmentPenalty: scheme.redemption?.missedInstallmentPenalty || 0,
    },

    pricing: {
      useCurrentMetalRate:   scheme.pricing?.useCurrentMetalRate   ?? true,
      fixedMetalRate:        scheme.pricing?.fixedMetalRate        || null,
      makingChargesDiscount: scheme.pricing?.makingChargesDiscount || 0,
      waiveMakingCharges:    scheme.pricing?.waiveMakingCharges    || false,
    },

    limits: {
      maxEnrollments:            scheme.limits?.maxEnrollments            || null,
      maxEnrollmentsPerCustomer: scheme.limits?.maxEnrollmentsPerCustomer || 3,
    },

    validity: {
      startDate: scheme.validity?.startDate
        ? scheme.validity.startDate.split('T')[0]
        : '',
      endDate: scheme.validity?.endDate
        ? scheme.validity.endDate.split('T')[0]
        : '',
      enrollmentDeadline: scheme.validity?.enrollmentDeadline
        ? scheme.validity.enrollmentDeadline.split('T')[0]
        : '',
    },

    marketing: {
      isFeatured:   scheme.marketing?.isFeatured   || false,
      displayOrder: scheme.marketing?.displayOrder || 0,
      imageUrl:     scheme.marketing?.imageUrl     || '',
      bannerUrl:    scheme.marketing?.bannerUrl    || '',
      highlights:   scheme.marketing?.highlights   || [],
    },

    termsAndConditions: scheme.termsAndConditions || [],
    notes: scheme.notes || '',
    tags:  scheme.tags  || [],
  }
}

// ─────────────────────────────────────────────
// PAGE COMPONENT
// ─────────────────────────────────────────────
export default function AddSchemePage() {
  const { t }            = useTranslation()
  const navigate         = useNavigate()
  const { schemeId }     = useParams()
  const { currentShopId } = useAuth()
  const { can }          = usePermissionCheck()

  const isEditMode = Boolean(schemeId)
  const shopId     = currentShopId || ''

  // Fetch scheme in edit mode
  const { scheme, isLoading, error } = useSchemeById(
    shopId,
    schemeId || ''
  )

  // Permission guard
  useEffect(() => {
    if (isEditMode && !can('canManageSchemes')) {
      navigate('/schemes')
    }
    if (!isEditMode && !can('canManageSchemes')) {
      navigate('/schemes')
    }
  }, [isEditMode, can, navigate])

  // Convert to form data
  const initialData = scheme
    ? convertSchemeToFormData(scheme)
    : undefined

  // ── Guards ──────────────────────────────────

  if (!shopId) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-text-secondary">{t('common.selectShopFirst')}</p>
      </div>
    )
  }

  if (isEditMode && isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    )
  }

  if (isEditMode && error) {
    return (
      <div className="flex h-screen items-center justify-center p-4">
        <Alert className="max-w-md">
          <AlertTitle>{t('scheme.errors.fetchFailed')}</AlertTitle>
          <AlertDescription className="mt-2">
            <p className="mb-4">
              {t('scheme.errors.fetchFailedDescription')}
            </p>
            <Button
              variant="outline"
              onClick={() => navigate('/schemes')}
              className="w-full"
            >
              {t('common.goBack')}
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (isEditMode && !scheme) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-text-secondary">
            {t('scheme.errors.notFound')}
          </p>
          <button
            onClick={() => navigate('/schemes')}
            className="text-accent hover:underline"
          >
            {t('common.goBack')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <SchemeForm
      shopId={shopId}
      schemeId={schemeId}
      initialData={initialData}
      onSuccess={() => navigate('/schemes')}
      onCancel={() => navigate('/schemes')}
      mode={isEditMode ? 'edit' : 'create'}
    />
  )
}