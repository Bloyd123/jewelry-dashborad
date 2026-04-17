// FILE: src/pages/girvi/GirviShopPaymentsPage.tsx
import { useAuth as useAuthShop }           from '@/hooks/auth'
import { useTranslation as useTranslationShop } from 'react-i18next'
import { GirviShopPaymentsTable } from '@/components/girvi/GirviShopPayments'
 
export const GirviShopPaymentsPage = () => {
  const { t }              = useTranslationShop()
  const { currentShopId }  = useAuthShop()
  const shopId             = currentShopId || ''
 
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">
          {t('girviPayment.shopPaymentsTitle')}
        </h1>
        <p className="text-sm text-text-secondary">
          {t('girviPayment.shopPaymentsSubtitle')}
        </p>
      </div>
 
      <GirviShopPaymentsTable shopId={shopId} />
    </div>
  )
}
 
