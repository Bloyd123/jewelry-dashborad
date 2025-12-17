import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Settings, 
  Store,
  ChevronLeft,
  TrendingUp,
  Coins,
  Building2,
  ScrollText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/data-display/Badge/Badge';
import { Breadcrumb } from '@/components/ui/navigation/Breadcrumb/Breadcrumb';
import { Tabs, TabsContent } from '@/components/ui/navigation/Tabs/Tabs';
import { Separator } from '@/components/ui/layout/Separator/Separator';
import type { Shop } from '@/types/shop.types';
import { dummyShops } from '@/pages/shops/data';

// ============================================================================
// COMPONENT PROPS
// ============================================================================

interface ShopDetailHeaderProps {
  shopId?: string; // Optional: If not provided, uses first shop from dummy data
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onBackClick?: () => void;
  onSettingsClick?: () => void;
  children?: React.ReactNode;
}

// ============================================================================
// SHOP DETAIL HEADER COMPONENT
// ============================================================================

export const ShopDetailHeader: React.FC<ShopDetailHeaderProps> = ({
  shopId,
  activeTab = 'overview',
  onTabChange,
  onBackClick,
  onSettingsClick,
  children,
}) => {
  const { t } = useTranslation();
  const [currentTab, setCurrentTab] = useState(activeTab);

  // Get shop data from dummy data
  // TODO: Replace with API call when integrating
  const shop: Shop = shopId 
    ? dummyShops.find(s => s._id === shopId) || dummyShops[0]
    : dummyShops[0];

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
      label: shop.name,
    },
  ];

  // Tab items
  const tabItems = [
    {
      value: 'overview',
      label: t('shopDetail.tabs.overview'),
      icon: <Store className="h-4 w-4" />,
    },
    {
      value: 'metalRates',
      label: t('shopDetail.tabs.metalRates'),
      icon: <Coins className="h-4 w-4" />,
    },
    {
      value: 'statistics',
      label: t('shopDetail.tabs.statistics'),
      icon: <TrendingUp className="h-4 w-4" />,
    },
    {
      value: 'bankDetails',
      label: t('shopDetail.tabs.bankDetails'),
      icon: <Building2 className="h-4 w-4" />,
    },
    {
      value: 'logs',
      label: t('shopDetail.tabs.logs'),
      icon: <ScrollText className="h-4 w-4" />,
    },
  ];

  // Get organization name
  const organizationName = typeof shop.organizationId === 'object' 
    ? shop.organizationId.name 
    : '';

  return (
    <div className="space-y-4">
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
              variant="outline"
              size="sm"
              onClick={onSettingsClick}
              className="gap-2"
            >
              <Settings className="h-4 w-4" />
              {t('common.settings')}
            </Button>
          </div>

          <Separator />

          {/* Shop Details */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              {/* Shop Icon */}
              <div className="flex items-center justify-center h-16 w-16 rounded-lg bg-accent/10">
                <Store className="h-8 w-8 text-accent" />
              </div>

              {/* Shop Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-text-primary">
                    {shop.name}
                  </h1>
                  <span className="text-text-tertiary">({shop.code})</span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Active Status */}
                  <Badge 
                    variant={shop.isActive ? 'active' : 'inactive'} 
                    size="sm"
                  >
                    {shop.isActive ? t('common.active') : t('common.inactive')}
                  </Badge>

                  {/* Verified Status */}
                  {shop.isVerified && (
                    <Badge variant="success" size="sm">
                      {t('common.verified')}
                    </Badge>
                  )}

                  {/* Shop Type */}
                  {shop.shopType && (
                    <Badge variant="retail" size="sm">
                      {t(`shopType.${shop.shopType}`)}
                    </Badge>
                  )}

                  {/* Category */}
                  {shop.category && (
                    <Badge variant="outline" size="sm">
                      {t(`shopCategory.${shop.category}`)}
                    </Badge>
                  )}
                </div>

                {/* Additional Info */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
                  {organizationName && (
                    <div className="flex items-center gap-1">
                      <span className="text-text-tertiary">{t('shop.organization')}:</span>
                      <span>{organizationName}</span>
                    </div>
                  )}
                  
                  {shop.address?.city && shop.address?.state && (
                    <div className="flex items-center gap-1">
                      <span className="text-text-tertiary">{t('shop.location')}:</span>
                      <span>{shop.address.city}, {shop.address.state}</span>
                    </div>
                  )}

                  {shop.establishedYear && (
                    <div className="flex items-center gap-1">
                      <span className="text-text-tertiary">{t('shop.established')}:</span>
                      <span>{shop.establishedYear}</span>
                    </div>
                  )}
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
  "shopDetail": {
    "tabs": {
      "overview": "Overview",
      "metalRates": "Metal Rates",
      "statistics": "Statistics",
      "bankDetails": "Bank Details",
      "logs": "Logs"
    }
  },
  "shop": {
    "organization": "Organization",
    "location": "Location",
    "established": "Established"
  },
  "shopType": {
    "retail": "Retail",
    "wholesale": "Wholesale",
    "manufacturing": "Manufacturing",
    "showroom": "Showroom",
    "workshop": "Workshop",
    "warehouse": "Warehouse",
    "online": "Online"
  },
  "shopCategory": {
    "jewelry": "Jewelry",
    "gold": "Gold",
    "silver": "Silver",
    "diamond": "Diamond",
    "gemstone": "Gemstone",
    "pearls": "Pearls",
    "platinum": "Platinum",
    "mixed": "Mixed"
  },
  "common": {
    "backToList": "Back to List",
    "settings": "Settings",
    "active": "Active",
    "inactive": "Inactive",
    "verified": "Verified"
  }
}
*/

export default ShopDetailHeader;