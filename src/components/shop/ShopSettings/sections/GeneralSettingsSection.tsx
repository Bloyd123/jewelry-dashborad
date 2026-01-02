// 
// FILE: src/components/shops/ShopSettings/sections/GeneralSettingsSection.tsx
// Section 2: General Settings
// 

import React from 'react'
import { useTranslation } from 'react-i18next'
import { Globe, Weight, CreditCard, Monitor } from 'lucide-react'
import { FormSelect } from '@/components/forms/FormSelect'
import { FormInput } from '@/components/forms/FormInput'
import { FormSwitch } from '@/components/forms/FormSwitch'
import { SectionDivider } from '@/components/ui/layout/Separator'
import type { GeneralSettings } from '../shopSettings.types'

interface GeneralSettingsSectionProps {
  data: GeneralSettings
  onChange: (field: string, value: any) => void
  onNestedChange: (parent: string, field: string, value: any) => void
  errors: Record<string, string>
}

export const GeneralSettingsSection: React.FC<GeneralSettingsSectionProps> = ({
  data,
  onChange,
  onNestedChange,
  errors,
}) => {
  const { t } = useTranslation()

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-text-primary">
        {t('shops.settings.generalSettings.title')}
      </h2>

      {/* Regional Settings */}
      <div className="space-y-4">
        <SectionDivider
          title={t('shops.settings.generalSettings.regional')}
          icon={<Globe className="h-5 w-5" />}
          color="accent"
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormSelect
            name="currency"
            label={t('shops.settings.generalSettings.currency')}
            value={data.currency}
            onChange={(_, value) => onChange('currency', value)}
            options={[
              { value: 'INR', label: 'INR - Indian Rupee (₹)' },
              { value: 'USD', label: 'USD - US Dollar ($)' },
              { value: 'EUR', label: 'EUR - Euro (€)' },
              { value: 'GBP', label: 'GBP - British Pound (£)' },
              { value: 'AED', label: 'AED - UAE Dirham' },
              { value: 'SAR', label: 'SAR - Saudi Riyal' },
            ]}
            error={errors['generalSettings.currency']}
          />

          <FormSelect
            name="language"
            label={t('shops.settings.generalSettings.language')}
            value={data.language}
            onChange={(_, value) => onChange('language', value)}
            options={[
              { value: 'en', label: 'English' },
              { value: 'hi', label: 'हिन्दी (Hindi)' },
              { value: 'mr', label: 'मराठी (Marathi)' },
              { value: 'gu', label: 'ગુજરાતી (Gujarati)' },
              { value: 'ta', label: 'தமிழ் (Tamil)' },
              { value: 'te', label: 'తెలుగు (Telugu)' },
            ]}
            error={errors['generalSettings.language']}
          />

          <FormSelect
            name="timezone"
            label={t('shops.settings.generalSettings.timezone')}
            value={data.timezone}
            onChange={(_, value) => onChange('timezone', value)}
            options={[
              { value: 'Asia/Kolkata', label: 'Asia/Kolkata (IST)' },
              { value: 'Asia/Dubai', label: 'Asia/Dubai (GST)' },
              { value: 'America/New_York', label: 'America/New_York (EST)' },
              { value: 'Europe/London', label: 'Europe/London (GMT)' },
            ]}
            error={errors['generalSettings.timezone']}
          />

          <FormSelect
            name="dateFormat"
            label={t('shops.settings.generalSettings.dateFormat')}
            value={data.dateFormat}
            onChange={(_, value) => onChange('dateFormat', value)}
            options={[
              { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
              { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
              { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
            ]}
            error={errors['generalSettings.dateFormat']}
          />
        </div>
      </div>

      {/* Weight & Measurement */}
      <div className="space-y-4">
        <SectionDivider
          title={t('shops.settings.generalSettings.weightMeasurement')}
          icon={<Weight className="h-5 w-5" />}
          color="accent"
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <FormSelect
            name="defaultWeightUnit"
            label={t('shops.settings.generalSettings.defaultWeightUnit')}
            value={data.defaultWeightUnit}
            onChange={(_, value) => onChange('defaultWeightUnit', value)}
            options={[
              { value: 'gram', label: 'Gram' },
              { value: 'kg', label: 'Kilogram' },
              { value: 'tola', label: 'Tola' },
              { value: 'ounce', label: 'Ounce' },
              { value: 'carat', label: 'Carat' },
            ]}
            error={errors['generalSettings.defaultWeightUnit']}
          />

          <FormSelect
            name="priceDecimals"
            label={t('shops.settings.generalSettings.priceDecimals')}
            value={String(data.priceDecimals)}
            onChange={(_, value) => onChange('priceDecimals', parseInt(value))}
            options={[
              { value: '0', label: '0' },
              { value: '1', label: '1' },
              { value: '2', label: '2' },
              { value: '3', label: '3' },
            ]}
            error={errors['generalSettings.priceDecimals']}
          />

          <FormSelect
            name="weightDecimals"
            label={t('shops.settings.generalSettings.weightDecimals')}
            value={String(data.weightDecimals)}
            onChange={(_, value) => onChange('weightDecimals', parseInt(value))}
            options={[
              { value: '2', label: '2' },
              { value: '3', label: '3' },
              { value: '4', label: '4' },
            ]}
            error={errors['generalSettings.weightDecimals']}
          />
        </div>
      </div>

      {/* Payment Settings */}
      <div className="space-y-4">
        <SectionDivider
          title={t('shops.settings.generalSettings.paymentSettings')}
          icon={<CreditCard className="h-5 w-5" />}
          color="accent"
        />

        <div className="space-y-4">
          <div className="text-sm font-medium text-text-primary">
            {t('shops.settings.generalSettings.acceptedPaymentMethods')}
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            <FormSwitch
              name="cash"
              label="Cash"
              checked={data.acceptedPaymentMethods.cash}
              onChange={(_, value) =>
                onNestedChange('acceptedPaymentMethods', 'cash', value)
              }
              size="sm"
            />

            <FormSwitch
              name="card"
              label="Credit/Debit Card"
              checked={data.acceptedPaymentMethods.card}
              onChange={(_, value) =>
                onNestedChange('acceptedPaymentMethods', 'card', value)
              }
              size="sm"
            />

            <FormSwitch
              name="upi"
              label="UPI"
              checked={data.acceptedPaymentMethods.upi}
              onChange={(_, value) =>
                onNestedChange('acceptedPaymentMethods', 'upi', value)
              }
              size="sm"
            />

            <FormSwitch
              name="netBanking"
              label="Net Banking"
              checked={data.acceptedPaymentMethods.netBanking}
              onChange={(_, value) =>
                onNestedChange('acceptedPaymentMethods', 'netBanking', value)
              }
              size="sm"
            />

            <FormSwitch
              name="cheque"
              label="Cheque"
              checked={data.acceptedPaymentMethods.cheque}
              onChange={(_, value) =>
                onNestedChange('acceptedPaymentMethods', 'cheque', value)
              }
              size="sm"
            />

            <FormSwitch
              name="emi"
              label="EMI"
              checked={data.acceptedPaymentMethods.emi}
              onChange={(_, value) =>
                onNestedChange('acceptedPaymentMethods', 'emi', value)
              }
              size="sm"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormSwitch
              name="enableAdvancePayment"
              label={t('shops.settings.generalSettings.enableAdvancePayment')}
              checked={data.enableAdvancePayment}
              onChange={(_, value) => onChange('enableAdvancePayment', value)}
            />

            {data.enableAdvancePayment && (
              <FormInput
                name="minimumAdvancePercentage"
                label={t(
                  'shops.settings.generalSettings.minimumAdvancePercentage'
                )}
                type="number"
                value={data.minimumAdvancePercentage}
                onChange={(_, value) =>
                  onChange('minimumAdvancePercentage', parseInt(String(value)))
                }
                error={errors['generalSettings.minimumAdvancePercentage']}
              />
            )}
          </div>
        </div>
      </div>

      {/* Display Preferences */}
      <div className="space-y-4">
        <SectionDivider
          title={t('shops.settings.generalSettings.displayPreferences')}
          icon={<Monitor className="h-5 w-5" />}
          color="accent"
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormSelect
            name="dashboardView"
            label={t('shops.settings.generalSettings.dashboardView')}
            value={data.dashboardView}
            onChange={(_, value) => onChange('dashboardView', value)}
            options={[
              { value: 'grid', label: 'Grid View' },
              { value: 'list', label: 'List View' },
              { value: 'compact', label: 'Compact View' },
            ]}
            error={errors['generalSettings.dashboardView']}
          />

          <FormSelect
            name="itemsPerPage"
            label={t('shops.settings.generalSettings.itemsPerPage')}
            value={String(data.itemsPerPage)}
            onChange={(_, value) => onChange('itemsPerPage', parseInt(value))}
            options={[
              { value: '10', label: '10' },
              { value: '25', label: '25' },
              { value: '50', label: '50' },
              { value: '100', label: '100' },
            ]}
            error={errors['generalSettings.itemsPerPage']}
          />

          <FormSwitch
            name="showProductImages"
            label={t('shops.settings.generalSettings.showProductImages')}
            checked={data.showProductImages}
            onChange={(_, value) => onChange('showProductImages', value)}
          />

          <FormSwitch
            name="darkMode"
            label={t('shops.settings.generalSettings.darkMode')}
            checked={data.darkMode}
            onChange={(_, value) => onChange('darkMode', value)}
          />
        </div>
      </div>
    </div>
  )
}
