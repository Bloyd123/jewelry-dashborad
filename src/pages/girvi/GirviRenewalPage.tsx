// ─── NEW FILE: src/pages/girvi/GirviRenewalPage.tsx ──────────────────────────
 
import { useNavigate as useNavigateRenewal, useParams as useParamsRenewal } from 'react-router-dom'
import { useTranslation as useTranslationRenewal } from 'react-i18next'
import { ArrowLeft as ArrowLeftRenewal } from 'lucide-react'
import { Button as ButtonRenewal } from '@/components/ui/button'
import { Card as CardRenewal, CardContent as CardContentRenewal, CardHeader as CardHeaderRenewal, CardTitle as CardTitleRenewal } from '@/components/ui/card'
import { GirviRenewalForm } from '@/components/girvi/GirviRelease'
import { useGirviById as useGirviByIdRenewal } from '@/hooks/girvi/useGirviById'
 
export const GirviRenewalPage = () => {
  const { t }               = useTranslationRenewal()
  const navigate            = useNavigateRenewal()
  const { shopId, girviId } = useParamsRenewal()
 
  const { girvi, isLoading, outstandingPrincipal, totalAmountDue } =
    useGirviByIdRenewal(shopId!, girviId!)
 
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
        <ButtonRenewal variant="ghost" onClick={() => navigate(-1)} className="gap-2">
          <ArrowLeftRenewal className="h-4 w-4" />
          {t('common.back')}
        </ButtonRenewal>
        <div>
          <h1 className="text-xl font-bold text-text-primary">{t('girvi.renewGirvi')}</h1>
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
 
      <CardRenewal className="border-border-primary bg-bg-secondary">
        <CardHeaderRenewal>
          <CardTitleRenewal className="text-text-primary">{t('girvi.renewalDetails')}</CardTitleRenewal>
        </CardHeaderRenewal>
        <CardContentRenewal>
          <GirviRenewalForm
            shopId={shopId!}
            girviId={girviId!}
            girviBalance={girvi ? {
              outstandingPrincipal,
              totalAmountDue,
              interestRate:        girvi.interestRate,
              interestType:        girvi.interestType,
              dueDate:             girvi.dueDate,
              lastInterestCalcDate: girvi.lastInterestCalcDate,
              girviDate:           girvi.girviDate,
            } : undefined}
            onSuccess={() => navigate(`/shops/${shopId}/girvi/${girviId}`)}
            onCancel={() => navigate(-1)}
          />
        </CardContentRenewal>
      </CardRenewal>
    </div>
  )
}