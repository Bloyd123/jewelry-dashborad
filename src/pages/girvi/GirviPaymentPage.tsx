// FILE: src/pages/girvi/GirviPaymentPage.tsx
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation }         from 'react-i18next'
import { ArrowLeft }              from 'lucide-react'
import { Button }                 from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { GirviPaymentForm }       from '@/components/girvi/GirviPayment'
import { GirviPaymentList }       from '@/components/girvi/GirviPayment'
import { useGirviById }           from '@/hooks/girvi/useGirviById'
import { useAuth }                from '@/hooks/auth'
 
export const GirviPaymentPage = () => {
  const { t }              = useTranslation()
  const navigate           = useNavigate()
  const { shopId, girviId } = useParams()
  const { userRole }       = useAuth()
 
  const { girvi, isLoading, outstandingPrincipal, totalAmountDue } =
    useGirviById(shopId!, girviId!)
 
  const handleSuccess = () => {
    // Stay on the page so user sees updated list
    // Optionally navigate back:
    // navigate(`/shops/${shopId}/girvi/${girviId}`)
  }
 
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
        <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          {t('common.back')}
        </Button>
        <div>
          <h1 className="text-xl font-bold text-text-primary">
            {t('girviPayment.addPayment')}
          </h1>
          {girvi && (
            <p className="text-sm text-text-secondary">
              {typeof girvi.customerId === 'object'
                ? `${(girvi.customerId as any).firstName} ${(girvi.customerId as any).lastName}`
                : ''
              }
              {' — '}
              <span className="font-mono font-medium">{girvi.girviNumber}</span>
            </p>
          )}
        </div>
      </div>
 
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border-border-primary bg-bg-secondary">
          <CardHeader>
            <CardTitle className="text-text-primary">{t('girviPayment.newPayment')}</CardTitle>
          </CardHeader>
          <CardContent>
            <GirviPaymentForm
              shopId={shopId!}
              girviId={girviId!}
              girviBalance={girvi ? {
                outstandingPrincipal: outstandingPrincipal,
                accruedInterest:      girvi.accruedInterest,
                totalAmountDue:       totalAmountDue,
                interestRate:         girvi.interestRate,
                interestType:         girvi.interestType,
                lastInterestCalcDate: girvi.lastInterestCalcDate,
                girviDate:            girvi.girviDate,
              } : undefined}
              onSuccess={handleSuccess}
              onCancel={() => navigate(-1)}
            />
          </CardContent>
        </Card>
 
        <Card className="border-border-primary bg-bg-secondary">
          <CardHeader>
            <CardTitle className="text-text-primary">{t('girviPayment.paymentHistory')}</CardTitle>
          </CardHeader>
          <CardContent>
            <GirviPaymentList
              shopId={shopId!}
              girviId={girviId!}
              userRole={userRole ?? 'staff'}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
 
 