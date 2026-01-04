//
// FILE: src/components/shops/ShopSettings/sections/FeaturesSection.tsx
// Section 5: Features
//

import React from 'react'
import { useTranslation } from 'react-i18next'
import { Package, TrendingUp, Wrench } from 'lucide-react'
import { FormSwitch } from '@/components/forms/FormSwitch'
import { SectionDivider } from '@/components/ui/layout/Separator'
import type { Features } from '../shopSettings.types'

interface FeaturesSectionProps {
  data: Features
  onChange: (field: string, value: any) => void
  onNestedChange: (parent: string, field: string, value: any) => void
  errors: Record<string, string>
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({
  data,
  onChange,
  onNestedChange,
  errors,
}) => {
  const { t } = useTranslation()

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-text-primary">
        {t('shops.settings.features.title')}
      </h2>

      {/* Core Features */}
      <div className="space-y-4">
        <SectionDivider
          title={t('shops.settings.features.coreFeatures')}
          icon={<Package className="h-5 w-5" />}
          color="accent"
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormSwitch
            name="inventoryManagement"
            label={t('shops.settings.features.inventoryManagement')}
            description={t('shops.settings.features.inventoryManagementDesc')}
            checked={data.core.inventoryManagement}
            onChange={(_, value) =>
              onNestedChange('core', 'inventoryManagement', value)
            }
            layout="vertical"
          />

          <FormSwitch
            name="salesBilling"
            label={t('shops.settings.features.salesBilling')}
            description={t('shops.settings.features.salesBillingDesc')}
            checked={data.core.salesBilling}
            onChange={(_, value) =>
              onNestedChange('core', 'salesBilling', value)
            }
            layout="vertical"
          />

          <FormSwitch
            name="customerManagement"
            label={t('shops.settings.features.customerManagement')}
            description={t('shops.settings.features.customerManagementDesc')}
            checked={data.core.customerManagement}
            onChange={(_, value) =>
              onNestedChange('core', 'customerManagement', value)
            }
            layout="vertical"
          />

          <FormSwitch
            name="productCatalog"
            label={t('shops.settings.features.productCatalog')}
            description={t('shops.settings.features.productCatalogDesc')}
            checked={data.core.productCatalog}
            onChange={(_, value) =>
              onNestedChange('core', 'productCatalog', value)
            }
            layout="vertical"
          />
        </div>
      </div>

      {/* Advanced Features */}
      <div className="space-y-4">
        <SectionDivider
          title={t('shops.settings.features.advancedFeatures')}
          icon={<TrendingUp className="h-5 w-5" />}
          color="accent"
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormSwitch
            name="reportsAnalytics"
            label={t('shops.settings.features.reportsAnalytics')}
            description={t('shops.settings.features.reportsAnalyticsDesc')}
            checked={data.advanced.reportsAnalytics}
            onChange={(_, value) =>
              onNestedChange('advanced', 'reportsAnalytics', value)
            }
            layout="vertical"
          />

          <FormSwitch
            name="goldSchemeManagement"
            label={t('shops.settings.features.goldSchemeManagement')}
            description={t('shops.settings.features.goldSchemeManagementDesc')}
            checked={data.advanced.goldSchemeManagement}
            onChange={(_, value) =>
              onNestedChange('advanced', 'goldSchemeManagement', value)
            }
            layout="vertical"
          />

          <FormSwitch
            name="multiCurrencySupport"
            label={t('shops.settings.features.multiCurrencySupport')}
            description={t('shops.settings.features.multiCurrencySupportDesc')}
            checked={data.advanced.multiCurrencySupport}
            onChange={(_, value) =>
              onNestedChange('advanced', 'multiCurrencySupport', value)
            }
            layout="vertical"
          />

          <FormSwitch
            name="onlineOrders"
            label={t('shops.settings.features.onlineOrders')}
            description={t('shops.settings.features.onlineOrdersDesc')}
            checked={data.advanced.onlineOrders}
            onChange={(_, value) =>
              onNestedChange('advanced', 'onlineOrders', value)
            }
            layout="vertical"
          />
        </div>
      </div>

      {/* Specialized Features */}
      <div className="space-y-4">
        <SectionDivider
          title={t('shops.settings.features.specializedFeatures')}
          icon={<Wrench className="h-5 w-5" />}
          color="accent"
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormSwitch
            name="repairJobWork"
            label={t('shops.settings.features.repairJobWork')}
            description={t('shops.settings.features.repairJobWorkDesc')}
            checked={data.specialized.repairJobWork}
            onChange={(_, value) =>
              onNestedChange('specialized', 'repairJobWork', value)
            }
            layout="vertical"
          />

          <FormSwitch
            name="customOrders"
            label={t('shops.settings.features.customOrders')}
            description={t('shops.settings.features.customOrdersDesc')}
            checked={data.specialized.customOrders}
            onChange={(_, value) =>
              onNestedChange('specialized', 'customOrders', value)
            }
            layout="vertical"
          />

          <FormSwitch
            name="giftVouchers"
            label={t('shops.settings.features.giftVouchers')}
            description={t('shops.settings.features.giftVouchersDesc')}
            checked={data.specialized.giftVouchers}
            onChange={(_, value) =>
              onNestedChange('specialized', 'giftVouchers', value)
            }
            layout="vertical"
          />

          <FormSwitch
            name="loyaltyProgram"
            label={t('shops.settings.features.loyaltyProgram')}
            description={t('shops.settings.features.loyaltyProgramDesc')}
            checked={data.specialized.loyaltyProgram}
            onChange={(_, value) =>
              onNestedChange('specialized', 'loyaltyProgram', value)
            }
            layout="vertical"
          />
        </div>
      </div>
    </div>
  )
}
