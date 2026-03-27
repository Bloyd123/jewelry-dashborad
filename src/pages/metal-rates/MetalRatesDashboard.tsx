// FILE: src/pages/metal-rates/MetalRatesDashboardPage.tsx

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MetalRatesDashboardHeader } from '@/components/metal-rates/MetalRatesDashboard'
import { CurrentRatesCards } from '@/components/metal-rates/MetalRatesDashboard'
import { TrendChart } from '@/components/metal-rates/MetalRatesDashboard'
import { RateHistoryTable } from '@/components/metal-rates/MetalRatesDashboard'
import { QuickInsights } from '@/components/metal-rates/MetalRatesDashboard/QuickInsights'
import { useAuth } from '@/hooks/auth'

export const MetalRatesDashboardPage: React.FC = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('currentRates')

  const handleBackClick = () => {
    navigate('/shops') 
  }

  const handleUpdateRates = () => {
    console.log('Update rates clicked')
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
  }
  const { currentShopId } = useAuth()
  const shopId=currentShopId || ''
  const renderTabContent = () => {
    switch (activeTab) {
      case 'currentRates':
        return (
          <CurrentRatesCards
          shopId={shopId}
            loading={false}
            onCardClick={(metal, purity) => console.log(metal, purity)}
          />
        )

      case 'trendChart':
        return (
          <TrendChart
             shopId={shopId}
            metalType="gold"
            defaultPeriod={90}
          />
        )

      case 'rateHistory':
        return <RateHistoryTable shopId={shopId}/>

      case 'quickInsights':
        return <QuickInsights  shopId={shopId}  />

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header with Tabs */}
      <MetalRatesDashboardHeader
        shopId={shopId}  
          lastUpdated={undefined} 
            updatedBy={undefined}
        shopName="Main Showroom"
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onBackClick={handleBackClick}
        isActive={true}
      />

      <div className="p-6">{renderTabContent()}</div>
    </div>
  )
}

MetalRatesDashboardPage.displayName = 'MetalRatesDashboardPage'
