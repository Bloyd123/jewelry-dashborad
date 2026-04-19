// ─── NEW FILE: src/pages/girvi/GirviPartialReleasePage.tsx ────────────────────
 
import { useNavigate as useNavigatePartial, useParams as useParamsPartial } from 'react-router-dom'
import { useTranslation as useTranslationPartial } from 'react-i18next'
import { ArrowLeft as ArrowLeftPartial } from 'lucide-react'
import { Button as ButtonPartial } from '@/components/ui/button'
import { Card as CardPartial, CardContent as CardContentPartial, CardHeader as CardHeaderPartial, CardTitle as CardTitlePartial } from '@/components/ui/card'
import { GirviPartialReleaseForm } from '@/components/girvi/GirviRelease'
import { useGirviById as useGirviByIdPartial } from '@/hooks/girvi/useGirviById'
 
export const GirviPartialReleasePage = () => {
  const { t }               = useTranslationPartial()
  const navigate            = useNavigatePartial()
  const { shopId, girviId } = useParamsPartial()
 
  const { girvi, isLoading, activeItems, outstandingPrincipal, totalAmountDue } =
    useGirviByIdPartial(shopId!, girviId!)
 
  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
      </div>
    )
  }
 
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <ButtonPartial variant="ghost" onClick={() => navigate(-1)} className="gap-2">
          <ArrowLeftPartial className="h-4 w-4" />
          {t('common.back')}
        </ButtonPartial>
        <div>
          <h1 className="text-xl font-bold text-text-primary">{t('girvi.partialRelease')}</h1>
          {girvi && (
            <p className="text-sm text-text-secondary">
              <span className="font-mono font-medium">{girvi.girviNumber}</span>
              {typeof girvi.customerId === 'object'
                ? ` — ${(girvi.customerId as any).firstName} ${(girvi.customerId as any).lastName}`
                : ''
              }
            </p>
          )}
        </div>
      </div>
 
      <CardPartial className="border-border-primary bg-bg-secondary">
        <CardHeaderPartial>
          <CardTitlePartial className="text-text-primary">{t('girvi.partialReleaseDetails')}</CardTitlePartial>
        </CardHeaderPartial>
        <CardContentPartial>
          <GirviPartialReleaseForm
            shopId={shopId!}
            girviId={girviId!}
            items={activeItems}
            girviBalance={girvi ? {
              outstandingPrincipal,
              accruedInterest:     girvi.accruedInterest,
              totalAmountDue,
              interestRate:        girvi.interestRate,
              lastInterestCalcDate: girvi.lastInterestCalcDate,
              girviDate:           girvi.girviDate,
            } : undefined}
            onSuccess={() => navigate(`/shops/${shopId}/girvi/${girviId}`)}
            onCancel={() => navigate(-1)}
          />
        </CardContentPartial>
      </CardPartial>
    </div>
  )
}
 