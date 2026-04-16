// FILE: src/components/girviTransfer/GirviTransferDetail/GirviTransferDetailPage.tsx

import { useState }      from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Loader2 }        from 'lucide-react'
import { useAuth }        from '@/hooks/auth'
import { useGirviTransferById } from '@/hooks/girviTransfer'
import { GirviTransferDetailHeader } from './GirviTransferDetailHeader'
import { OverviewTab, PartyInterestTab, ReturnTab } from './tabs'

export default function GirviTransferDetailPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const navigate   = useNavigate()
  const { girviId, transferId } = useParams<{ girviId: string; transferId: string }>()
  const { t }      = useTranslation()
  const { currentShopId } = useAuth()
  const shopId = currentShopId || ''

  const { transfer, isLoading, error } =
    useGirviTransferById(shopId, girviId!, transferId!)

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    )
  }

  if (error || !transfer) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3">
        <p className="text-text-secondary">
          {t('girviTransfer.detail.notFound', 'Transfer not found')}
        </p>
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-accent hover:underline"
        >
          {t('common.goBack', 'Go Back')}
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <GirviTransferDetailHeader
        transfer={transfer}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onBackClick={() => navigate(-1)}
      />

      <div className="px-4 py-6 md:px-6">
        {activeTab === 'overview' && (
          <OverviewTab transfer={transfer} />
        )}
        {activeTab === 'partyInterest' && (
          <PartyInterestTab
            transfer={transfer}
            shopId={shopId}
            girviId={girviId!}
            transferId={transferId!}
          />
        )}
        {activeTab === 'return' && (
          <ReturnTab
            transfer={transfer}
            shopId={shopId}
            girviId={girviId!}
            transferId={transferId!}
          />
        )}
      </div>
    </div>
  )
}