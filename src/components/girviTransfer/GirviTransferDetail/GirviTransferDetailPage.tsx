// FILE: src/components/girviTransfer/GirviTransferDetail/GirviTransferDetailPage.tsx

import { useState }      from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Loader2 }        from 'lucide-react'
import { useAuth }        from '@/hooks/auth'
import { useGirviTransferById } from '@/hooks/girviTransfer'
import { GirviTransferDetailHeader } from './GirviTransferDetailHeader'
import { OverviewTab, PartyInterestTab, ReturnTab } from './tabs'
import { useGirviById } from '@/hooks/girvi/useGirviById'

const GirviInfoBar = ({ shopId, girviId }: { shopId: string; girviId: string }) => {
  const { girvi } = useGirviById(shopId, girviId)
  if (!girvi) return null

  const customer = typeof girvi.customerId === 'object'
    ? (girvi.customerId as any)
    : null

  return (
    <div className="mx-4 mt-3 flex items-center gap-3 rounded-lg border border-accent/30 bg-accent/5 px-4 py-2.5 md:mx-6">
      {/* Avatar */}
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
        {customer?.firstName?.[0]?.toUpperCase() ?? 'G'}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-wrap items-center gap-x-4 gap-y-0.5 text-sm">
        <span className="font-semibold text-text-primary">
          {girvi.girviNumber}
        </span>
        {customer && (
          <span className="text-text-secondary">
            {customer.firstName} {customer.lastName || ''}
          </span>
        )}
        {customer?.phone && (
          <span className="text-text-tertiary">📱 {customer.phone}</span>
        )}
        <span className="font-medium text-accent">
          ₹{Number(girvi.outstandingPrincipal || 0).toLocaleString('en-IN')} outstanding
        </span>
      </div>

      {/* Status badge */}
      <span className={`flex-shrink-0 rounded px-2 py-0.5 text-xs font-medium capitalize
        ${girvi.status === 'transferred'
          ? 'bg-status-info/10 text-status-info'
          : 'bg-status-success/10 text-status-success'
        }`}
      >
        {girvi.status}
      </span>
    </div>
  )
}

export default function GirviTransferDetailPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const navigate   = useNavigate()

  const { t } = useTranslation()
const { currentShopId } = useAuth()
const { shopId: shopIdParam, transferId } =
  useParams<{ shopId: string; transferId: string }>()
const shopId = shopIdParam || currentShopId || ''

const { transfer, isLoading, error } =
  useGirviTransferById(shopId, undefined, transferId!)
const girviId = transfer?.girviId
  ? typeof transfer.girviId === 'object'
    ? (transfer.girviId as any)._id
    : String(transfer.girviId)
  : ''
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
        {/* Selected Girvi Info Bar */}
    {girviId && <GirviInfoBar shopId={shopId} girviId={girviId} />}

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