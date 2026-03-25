// FILE: src/components/purchase/PurchaseDetailPage/PurchaseDetailPage.tsx

import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/auth'
import { usePurchaseById } from '@/hooks/purchase/usePurchaseById'
import { PurchaseDetailHeader } from '@/components/purchase/PurchaseDetailsPage'
import {
  OverviewTab,
  PaymentsTab,
  DeliveryTab,
  DocumentsTab,
  ActivityTab,
} from '@/components/purchase/PurchaseDetailsPage/tabs'

export default function PurchaseDetailPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const navigate = useNavigate()
  const { purchaseId } = useParams<{ purchaseId: string }>()
  const { t } = useTranslation()
  const { currentShopId } = useAuth()
  const shopId = currentShopId || ''

  const { purchase, isLoading, error } = usePurchaseById(shopId, purchaseId!)

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    )
  }

  if (error || !purchase) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3">
        <p className="text-text-secondary">
          {t('purchase.detail.notFound', 'Purchase not found')}
        </p>
        <button
          onClick={() => navigate('/purchases')}
          className="text-sm text-accent hover:underline"
        >
          {t('purchase.common.backToList', 'Back to Purchases')}
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <PurchaseDetailHeader
        purchase={purchase}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onBackClick={() => navigate('/purchases')}
      />

      <div className="px-4 py-6 md:px-6">
        {activeTab === 'overview' && (
          <OverviewTab
            purchase={purchase}
            shopId={shopId}
            purchaseId={purchaseId!}
          />
        )}
        {activeTab === 'payments' && (
          <PaymentsTab
            purchase={purchase}
            shopId={shopId}
            purchaseId={purchaseId!}
          />
        )}
        {activeTab === 'delivery' && (
          <DeliveryTab
            purchase={purchase}
            shopId={shopId}
            purchaseId={purchaseId!}
          />
        )}
        {activeTab === 'documents' && (
          <DocumentsTab
            purchase={purchase}
            shopId={shopId}
            purchaseId={purchaseId!}
          />
        )}
        {activeTab === 'activity' && (
          <ActivityTab purchase={purchase} />
        )}
      </div>
    </div>
  )
}