import React, { useState } from 'react'
import { ShopDetailHeader } from '@/components/shop/ShopDetailsPage/ShopDetailHeader'
import {
  OverviewTab,
  BankDetailsTab,
  ActivityLogTab,
  StatisticsTab,
} from '@/components/shop/ShopDetailsPage/tabs'
import { ShopSettings } from '@/components/shop/ShopSettings'
import { dummyShops } from '@/pages/shops/data'
import { dummyShopStatistics } from '@/pages/shops/dummyStatistics'
import type { ShopSettingsFormData } from '@/components/shop/ShopSettings'

// ============================================================================
// SHOP DETAILS PAGE COMPONENT
// ============================================================================

export const ShopDetailsPage: React.FC = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  // Get shop data - Currently using dummy data
  // TODO: Replace with API call - const { shopId } = useParams(); const { data: shop } = useGetShopByIdQuery(shopId)
  const shop = dummyShops[0]

  // Handle back navigation
  const handleBackClick = () => {
    // TODO: Add navigation logic
    console.log('Navigate back to shops list')
    // window.history.back() or navigate('/shops')
  }

  const handleSaveSettings = async (settings: ShopSettingsFormData) => {
    console.log('Saving settings:', settings)
    // ✅ API call example
    // await updateShopSettings(shop._id, settings)
    setIsSettingsOpen(false)
  }

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    console.log('Active tab changed to:', tab)
  }

  // Render tab content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="p-6">
            <OverviewTab />
          </div>
        )

      case 'statistics':
        return (
          <div className="p-6">
            <StatisticsTab
              shopId={shop._id}
              statistics={dummyShopStatistics}
              loading={false}
            />
          </div>
        )

      case 'bankDetails':
        return (
          <div className="p-6">
            <BankDetailsTab
              bankDetails={shop.bankDetails}
              upiDetails={shop.upiDetails}
              isAdminView={true}
            />
          </div>
        )

      case 'logs':
        return (
          <div className="p-6">
            <ActivityLogTab />
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
        shopId={shop._id}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onBackClick={handleBackClick}
        onSettingsClick={() => setIsSettingsOpen(true)}
      />

      {/* Tab Content - BAHAR render ho raha hai ✅ */}
      {renderTabContent()}

      {/* Settings Modal */}
      <ShopSettings
        shop={shop}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleSaveSettings}
      />
    </div>
  )
}

export default ShopDetailsPage