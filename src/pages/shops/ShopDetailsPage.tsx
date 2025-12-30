import React, { useState } from 'react'
import { ShopDetailHeader } from '@/components/shop/ShopDetailsPage/ShopDetailHeader'
import { TabsContent } from '@/components/ui/navigation/Tabs/Tabs'
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
  // Handle settings modal
  const handleSettingsClick = () => {
    // TODO: Open settings modal
    console.log('Open settings modal')
  }

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    console.log('Active tab changed to:', tab)
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <ShopDetailHeader
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onBackClick={handleBackClick}
         onSettingsClick={() => setIsSettingsOpen(true)}
      >
        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="p-4">
            <OverviewTab />
          </div>
        </TabsContent>

        {/* Metal Rates Tab */}
        {/* <TabsContent value="metalRates">
          <div className="p-6">
            <div className="rounded-lg border border-border-secondary bg-bg-secondary p-6">
              <h2 className="mb-4 text-lg font-semibold text-text-primary">
                Current Metal Rates
              </h2>
              <p className="text-text-secondary">
                Metal rates content coming soon...
              </p>
            </div>
          </div>
        </TabsContent> */}

        {/* Statistics Tab */}
        <TabsContent value="statistics">
          <div className="p-6">
            <StatisticsTab
              shopId="your-shop-id"
              statistics={dummyShopStatistics} // ⬅️ Yeh add karo
              loading={false}
            />
          </div>
        </TabsContent>

        {/* Bank Details Tab */}
        <TabsContent value="bankDetails">
          <BankDetailsTab
            bankDetails={shop.bankDetails}
            upiDetails={shop.upiDetails}
            isAdminView={true}
          />
        </TabsContent>

        {/* Logs Tab */}
        <TabsContent value="logs">
          <div className="p-6">
            <ActivityLogTab />
          </div>
        </TabsContent>
      </ShopDetailHeader>
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
