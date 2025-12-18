// ============================================================================
// FILE: src/components/features/MetalRates/MetalRatesDashboardHeader.tsx
// Metal Rates Dashboard Header with Tabs and Shop Info
// ============================================================================

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  ChevronLeft,
  Coins,
  TrendingUp,
  History,
  Zap,
  RefreshCw,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/data-display/Badge/Badge';
import { Breadcrumb } from '@/components/ui/navigation/Breadcrumb/Breadcrumb';
import { Tabs } from '@/components/ui/navigation/Tabs/Tabs';
import { Separator } from '@/components/ui/layout/Separator/Separator';

// ============================================================================
// COMPONENT PROPS
// ============================================================================

interface MetalRatesDashboardHeaderProps {
  shopId?: string;
  shopName?: string;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onBackClick?: () => void;
  onUpdateRates?: () => void;
  lastUpdated?: string;
  updatedBy?: string;
  isActive?: boolean;
  children?: React.ReactNode;
}

// ============================================================================
// METAL RATES DASHBOARD HEADER COMPONENT
// ============================================================================

export const MetalRatesDashboardHeader: React.FC<MetalRatesDashboardHeaderProps> = ({
  shopId,
  shopName = 'Main Showroom',
  activeTab = 'currentRates',
  onTabChange,
  onBackClick,
  onUpdateRates,
  lastUpdated = '15 Dec 2024, 10:30 AM',
  updatedBy = 'Rajesh Kumar',
  isActive = true,
  children,
}) => {
  const { t } = useTranslation();
  const [currentTab, setCurrentTab] = useState(activeTab);

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  // Breadcrumb items
  const breadcrumbItems = [
    {
      label: t('shops.title'),
      onClick: onBackClick,
    },
    {
      label: shopName,
      onClick: onBackClick,
    },
    {
      label: t('metalRates.title'),
    },
  ];

  // Tab items
  const tabItems = [
    {
      value: 'currentRates',
      label: t('metalRates.tabs.currentRates'),
      icon: <Coins className="h-4 w-4" />,
    },
    {
      value: 'trendChart',
      label: t('metalRates.tabs.trendCharts'),
      icon: <TrendingUp className="h-4 w-4" />,
    },
    {
      value: 'rateHistory',
      label: t('metalRates.tabs.rateHistory'),
      icon: <History className="h-4 w-4" />,
    },
    {
      value: 'quickInsights',
      label: t('metalRates.tabs.quickInsights'),
      icon: <Zap className="h-4 w-4" />,
    },
  ];

  return (
    <div className="space-y-0">
      {/* Header Section */}
      <div className="bg-bg-secondary border-b border-border-secondary">
        <div className="px-6 py-4 space-y-4">
          {/* Back Button and Breadcrumb */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBackClick}
                className="gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                {t('common.backToList')}
              </Button>
              
              <Separator orientation="vertical" className="h-6" />
              
              <Breadcrumb items={breadcrumbItems} showHome={true} />
            </div>

            <Button
              variant="default"
              size="sm"
              onClick={onUpdateRates}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              {t('metalRates.updateRates')}
            </Button>
          </div>

          <Separator />

          {/* Metal Rates Dashboard Info */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="flex items-center justify-center h-16 w-16 rounded-lg bg-accent/10">
                <Coins className="h-8 w-8 text-accent" />
              </div>

              {/* Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-text-primary">
                    {t('metalRates.dashboard')}
                  </h1>
                </div>

                {/* Last Updated Info */}
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-2 text-text-secondary">
                    <span className="text-text-tertiary">
                      {t('metalRates.lastUpdated')}:
                    </span>
                    <span className="font-medium">{lastUpdated}</span>
                    <span className="text-text-tertiary">{t('common.by')}</span>
                    <span className="font-medium">{updatedBy}</span>
                  </div>
                </div>

                {/* Status Badges */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* Active Status */}
                  {isActive && (
                    <Badge variant="active" size="sm" className="gap-1">
                      <Check className="h-3 w-3" />
                      {t('common.active')}
                    </Badge>
                  )}

                  {/* View Trends Badge */}
                  <Badge variant="info" size="sm" className="gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {t('metalRates.viewTrends')}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6">
          <Tabs
            tabs={tabItems}
            value={currentTab}
            onValueChange={handleTabChange}
            variant="underline"
            size="md"
          >
            {children}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// TRANSLATION KEYS STRUCTURE
// ============================================================================

/*
{
  "shops": {
    "title": "Shops"
  },
  "metalRates": {
    "title": "Metal Rates",
    "dashboard": "Metal Rates Dashboard",
    "updateRates": "Update Rates",
    "lastUpdated": "Last Updated",
    "viewTrends": "View Trends",
    "tabs": {
      "currentRates": "Current Rates",
      "trendCharts": "Trend Charts",
      "rateHistory": "Rate History",
      "quickInsights": "Quick Insights"
    }
  },
  "common": {
    "backToList": "Back to List",
    "by": "by",
    "active": "Active"
  }
}
*/

export default MetalRatesDashboardHeader;