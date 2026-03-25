import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { ShopDetailHeader } from '@/components/shop/ShopDetailsPage/ShopDetailHeader'
import {
  OverviewTab,
  BankDetailsTab,
  ActivityLogTab,
  StatisticsTab,
} from '@/components/shop/ShopDetailsPage/tabs'
import { ShopSettings } from '@/components/shop/ShopSettings'
import { useShopById, useShopStats } from '@/hooks/shop'

// SHOP DETAILS PAGE COMPONENT

export const ShopDetailsPage: React.FC = () => {
  const navigate = useNavigate()
  const { shopId } = useParams()

  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  // Real API
  const { shop, isLoading } = useShopById(shopId ?? '')
  const { statistics, isLoading: isLoadingStats } = useShopStats(shopId ?? '')

  // Loading state
  if (isLoading || !shop) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    )
  }

  // Handlers
  const handleBackClick = () => navigate('/shops')

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
  }

  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="p-6">
                 <OverviewTab shop={shop} />
          </div>
        )

      case 'statistics':
        return (
          <div className="p-6">
            <StatisticsTab
              shopId={shop._id}
              statistics={statistics as any}
              loading={isLoadingStats}
            />
          </div>
        )

case 'bankDetails':
  return (
    <div className="p-6">
      <BankDetailsTab
        shopId={shop._id}
        bankDetails={shop.bankDetails}
        upiDetails={shop.upiDetails}
        isAdminView={true}
      />
    </div>
  )

      case 'logs':
        return (
          <div className="p-6">
            <ActivityLogTab shopId={shop._id} />
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header with Tabs */}
      <ShopDetailHeader
         shop={shop}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onBackClick={handleBackClick}
        onSettingsClick={() => setIsSettingsOpen(true)}
      />

      {/* Tab Content */}
      {renderTabContent()}

      {/* Settings Modal */}
      <ShopSettings
        shop={shop}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  )
}

export default ShopDetailsPage
