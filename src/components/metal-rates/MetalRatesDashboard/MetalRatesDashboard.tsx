// ============================================================================
// FILE: src/pages/metal-rates/MetalRatesDashboardPage.tsx
// Main Metal Rates Dashboard Page with Header and Tab Content
// ============================================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MetalRatesDashboardHeader } from '@/components/metal-rates/MetalRatesDashboard/MetalRatesDashboardHeader';
import { CurrentRatesCards } from '@/components/metal-rates/MetalRatesDashboard/CurrentRatesCards';
import { TrendChart } from '@/components/metal-rates/MetalRatesDashboard/TrendChart';
import { RateHistoryTable } from '@/components/metal-rates/MetalRatesDashboard/RateHistoryTable/RateHistoryTable';
import { QuickInsights } from '@/components/metal-rates/MetalRatesDashboard/QuickInsights';

const MetalRatesDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('currentRates');

  // Handlers
  const handleBackClick = () => {
    navigate('/shops'); // Ya jahan bhi wapas jaana hai
  };

  const handleUpdateRates = () => {
    console.log('Update rates clicked');
    // Open update rates modal/form
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  // Render tab content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'currentRates':
        return (
          <CurrentRatesCards 
            loading={false}
            onCardClick={(metal, purity) => console.log(metal, purity)}
          />
        );
      
      case 'trendChart':
        return (
          <TrendChart 
            shopId="674def456abc789012345678"
            metalType="gold"
            defaultPeriod={90}
          />
        );
      
      case 'rateHistory':
        return <RateHistoryTable />;
      
      case 'quickInsights':
        return <QuickInsights shopId="674def456abc789012345678" />;
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header with Tabs */}
      <MetalRatesDashboardHeader
        shopId="674def456abc789012345678"
        shopName="Main Showroom"
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onBackClick={handleBackClick}
        lastUpdated="15 Dec 2024, 10:30 AM"
        updatedBy="Rajesh Kumar"
        isActive={true}
      />

      {/* Tab Content */}
      <div className="p-6">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default MetalRatesDashboardPage;