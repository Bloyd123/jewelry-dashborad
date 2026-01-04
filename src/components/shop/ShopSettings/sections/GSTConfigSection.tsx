//
// FILE: src/components/shops/ShopSettings/sections/GSTConfigSection.tsx
// Section 3: GST Configuration
//

import React from 'react'
import { useTranslation } from 'react-i18next'
import { FileText, Calculator, Settings, Receipt, Copy } from 'lucide-react'
import { FormInput } from '@/components/forms/FormInput'
import { FormSwitch } from '@/components/forms/FormSwitch'
import { SectionDivider } from '@/components/ui/layout/Separator'
import { Button } from '@/components/ui/button'
import type { Shop } from '@/types/shop.types'
import type { GSTSettings } from '../shopSettings.types'

interface GSTConfigSectionProps {
  shop: Shop
  data: GSTSettings
  onChange: (field: string, value: any) => void
  onNestedChange: (parent: string, field: string, value: any) => void
  errors: Record<string, string>
}

export const GSTConfigSection: React.FC<GSTConfigSectionProps> = ({
  shop,
  data,
  onChange,
  onNestedChange,
  errors,
}) => {
  const { t } = useTranslation()

  const handleCopyGSTNumber = () => {
    if (shop.gstNumber) {
      navigator.clipboard.writeText(shop.gstNumber)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-text-primary">
        {t('shops.settings.gstConfig.title')}
      </h2>

      {/* GST Registration (Read-Only) */}
      <div className="space-y-4">
        <SectionDivider
          title={t('shops.settings.gstConfig.registration')}
          subtitle={t('shops.settings.gstConfig.registrationSubtitle')}
          icon={<FileText className="h-5 w-5" />}
          color="accent"
        />

        <div className="rounded-lg border border-border-primary bg-bg-tertiary p-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <div className="mb-1 text-sm font-medium text-text-secondary">
                {t('shops.settings.gstConfig.gstNumber')}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base font-semibold text-text-primary">
                  {shop.gstNumber || 'Not Available'}
                </span>
                {shop.gstNumber && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={handleCopyGSTNumber}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>

            <div>
              <div className="mb-1 text-sm font-medium text-text-secondary">
                {t('shops.settings.gstConfig.businessName')}
              </div>
              <div className="text-base font-semibold text-text-primary">
                {shop.name}
              </div>
            </div>

            <div>
              <div className="mb-1 text-sm font-medium text-text-secondary">
                {t('shops.settings.gstConfig.registrationDate')}
              </div>
              <div className="text-base text-text-primary">01/01/2020</div>
            </div>

            <div>
              <div className="mb-1 text-sm font-medium text-text-secondary">
                {t('shops.settings.gstConfig.status')}
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-status-success/10 inline-flex items-center gap-1 rounded-full px-2 py-1 text-sm font-medium text-status-success">
                  ✓ {t('shops.settings.gstConfig.verified')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* GST Calculation */}
      <div className="space-y-4">
        <SectionDivider
          title={t('shops.settings.gstConfig.calculation')}
          icon={<Calculator className="h-5 w-5" />}
          color="accent"
        />

        <FormSwitch
          name="enableGST"
          label={t('shops.settings.gstConfig.enableGST')}
          description={t('shops.settings.gstConfig.enableGSTDescription')}
          checked={data.enableGST}
          onChange={(_, value) => onChange('enableGST', value)}
        />
      </div>

      {/* GST Rates Table */}
      {data.enableGST && (
        <div className="space-y-4">
          <SectionDivider
            title={t('shops.settings.gstConfig.ratesByCategory')}
            subtitle={t('shops.settings.gstConfig.editableTable')}
            icon={<Settings className="h-5 w-5" />}
            color="accent"
          />

          <div className="overflow-hidden rounded-lg border border-border-primary">
            <table className="w-full">
              <thead className="bg-bg-tertiary">
                <tr>
                  <th className="border-b border-border-primary px-4 py-3 text-left text-sm font-semibold text-text-primary">
                    {t('shops.settings.gstConfig.category')}
                  </th>
                  <th className="border-b border-border-primary px-4 py-3 text-left text-sm font-semibold text-text-primary">
                    {t('shops.settings.gstConfig.gstRate')}
                  </th>
                  <th className="border-b border-border-primary px-4 py-3 text-left text-sm font-semibold text-text-primary">
                    {t('shops.settings.gstConfig.hsnCode')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* Gold */}
                <tr className="border-b border-border-primary">
                  <td className="px-4 py-3 text-sm text-text-primary">Gold</td>
                  <td className="px-4 py-3">
                    <FormInput
                      name="gstRates.gold"
                      type="number"
                      value={data.gstRates.gold}
                      onChange={(_, value) =>
                        onNestedChange(
                          'gstRates',
                          'gold',
                          parseFloat(String(value))
                        )
                      }
                      className="max-w-[120px]"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <FormInput
                      name="hsnCodes.gold"
                      value={data.hsnCodes.gold}
                      onChange={(_, value) =>
                        onNestedChange('hsnCodes', 'gold', value)
                      }
                      className="max-w-[150px]"
                    />
                  </td>
                </tr>

                {/* Silver */}
                <tr className="border-b border-border-primary">
                  <td className="px-4 py-3 text-sm text-text-primary">
                    Silver
                  </td>
                  <td className="px-4 py-3">
                    <FormInput
                      name="gstRates.silver"
                      type="number"
                      value={data.gstRates.silver}
                      onChange={(_, value) =>
                        onNestedChange(
                          'gstRates',
                          'silver',
                          parseFloat(String(value))
                        )
                      }
                      className="max-w-[120px]"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <FormInput
                      name="hsnCodes.silver"
                      value={data.hsnCodes.silver}
                      onChange={(_, value) =>
                        onNestedChange('hsnCodes', 'silver', value)
                      }
                      className="max-w-[150px]"
                    />
                  </td>
                </tr>

                {/* Diamond */}
                <tr className="border-b border-border-primary">
                  <td className="px-4 py-3 text-sm text-text-primary">
                    Diamond
                  </td>
                  <td className="px-4 py-3">
                    <FormInput
                      name="gstRates.diamond"
                      type="number"
                      value={data.gstRates.diamond}
                      onChange={(_, value) =>
                        onNestedChange(
                          'gstRates',
                          'diamond',
                          parseFloat(String(value))
                        )
                      }
                      className="max-w-[120px]"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <FormInput
                      name="hsnCodes.diamond"
                      value={data.hsnCodes.diamond}
                      onChange={(_, value) =>
                        onNestedChange('hsnCodes', 'diamond', value)
                      }
                      className="max-w-[150px]"
                    />
                  </td>
                </tr>

                {/* Platinum */}
                <tr className="border-b border-border-primary">
                  <td className="px-4 py-3 text-sm text-text-primary">
                    Platinum
                  </td>
                  <td className="px-4 py-3">
                    <FormInput
                      name="gstRates.platinum"
                      type="number"
                      value={data.gstRates.platinum}
                      onChange={(_, value) =>
                        onNestedChange(
                          'gstRates',
                          'platinum',
                          parseFloat(String(value))
                        )
                      }
                      className="max-w-[120px]"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <FormInput
                      name="hsnCodes.platinum"
                      value={data.hsnCodes.platinum}
                      onChange={(_, value) =>
                        onNestedChange('hsnCodes', 'platinum', value)
                      }
                      className="max-w-[150px]"
                    />
                  </td>
                </tr>

                {/* Making Charges */}
                <tr className="border-b border-border-primary">
                  <td className="px-4 py-3 text-sm text-text-primary">
                    Making Charges
                  </td>
                  <td className="px-4 py-3">
                    <FormInput
                      name="gstRates.makingCharges"
                      type="number"
                      value={data.gstRates.makingCharges}
                      onChange={(_, value) =>
                        onNestedChange(
                          'gstRates',
                          'makingCharges',
                          parseFloat(String(value))
                        )
                      }
                      className="max-w-[120px]"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <FormInput
                      name="hsnCodes.makingCharges"
                      value={data.hsnCodes.makingCharges}
                      onChange={(_, value) =>
                        onNestedChange('hsnCodes', 'makingCharges', value)
                      }
                      className="max-w-[150px]"
                    />
                  </td>
                </tr>

                {/* Other Charges */}
                <tr>
                  <td className="px-4 py-3 text-sm text-text-primary">
                    Other Charges
                  </td>
                  <td className="px-4 py-3">
                    <FormInput
                      name="gstRates.otherCharges"
                      type="number"
                      value={data.gstRates.otherCharges}
                      onChange={(_, value) =>
                        onNestedChange(
                          'gstRates',
                          'otherCharges',
                          parseFloat(String(value))
                        )
                      }
                      className="max-w-[120px]"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <FormInput
                      name="hsnCodes.otherCharges"
                      value={data.hsnCodes.otherCharges}
                      onChange={(_, value) =>
                        onNestedChange('hsnCodes', 'otherCharges', value)
                      }
                      className="max-w-[150px]"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* GST Display Options */}
      {data.enableGST && (
        <div className="space-y-4">
          <SectionDivider
            title={t('shops.settings.gstConfig.displayOptions')}
            icon={<Receipt className="h-5 w-5" />}
            color="accent"
          />

          <div className="space-y-4">
            <div>
              <div className="mb-2 text-sm font-medium text-text-primary">
                {t('shops.settings.gstConfig.priceDisplay')}
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="priceDisplay"
                    value="exclude"
                    checked={data.priceDisplay === 'exclude'}
                    onChange={e => onChange('priceDisplay', e.target.value)}
                    className="h-4 w-4 cursor-pointer text-accent accent-accent"
                  />
                  <span className="text-sm text-text-primary">
                    {t('shops.settings.gstConfig.excludeGST')}
                  </span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="priceDisplay"
                    value="include"
                    checked={data.priceDisplay === 'include'}
                    onChange={e => onChange('priceDisplay', e.target.value)}
                    className="h-4 w-4 cursor-pointer text-accent accent-accent"
                  />
                  <span className="text-sm text-text-primary">
                    {t('shops.settings.gstConfig.includeGST')}
                  </span>
                </label>
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-sm font-medium text-text-primary">
                {t('shops.settings.gstConfig.showGSTBreakup')}
              </div>

              <FormSwitch
                name="showCGSTSGST"
                label={t('shops.settings.gstConfig.showCGSTSGST')}
                checked={data.showCGSTSGST}
                onChange={(_, value) => onChange('showCGSTSGST', value)}
                size="sm"
              />

              <FormSwitch
                name="showIGST"
                label={t('shops.settings.gstConfig.showIGST')}
                checked={data.showIGST}
                onChange={(_, value) => onChange('showIGST', value)}
                size="sm"
              />

              <FormSwitch
                name="showHSNOnInvoice"
                label={t('shops.settings.gstConfig.showHSNOnInvoice')}
                checked={data.showHSNOnInvoice}
                onChange={(_, value) => onChange('showHSNOnInvoice', value)}
                size="sm"
              />
            </div>
          </div>
        </div>
      )}

      {/* Invoice Settings */}
      {data.enableGST && (
        <div className="space-y-4">
          <SectionDivider
            title={t('shops.settings.gstConfig.invoiceSettings')}
            color="accent"
          />

          <div className="space-y-4">
            <FormInput
              name="invoicePrefix"
              label={t('shops.settings.gstConfig.invoicePrefix')}
              value={data.invoicePrefix}
              onChange={(_, value) => onChange('invoicePrefix', value)}
              placeholder="GST-INV-"
              error={errors['gstSettings.invoicePrefix']}
            />

            <div className="space-y-3">
              <div className="text-sm font-medium text-text-primary">
                {t('shops.settings.gstConfig.displayOnInvoice')}
              </div>

              <FormSwitch
                name="displayPlaceOfSupply"
                label={t('shops.settings.gstConfig.placeOfSupply')}
                checked={data.displayPlaceOfSupply}
                onChange={(_, value) => onChange('displayPlaceOfSupply', value)}
                size="sm"
              />

              <FormSwitch
                name="displayReverseCharge"
                label={t('shops.settings.gstConfig.reverseCharge')}
                checked={data.displayReverseCharge}
                onChange={(_, value) => onChange('displayReverseCharge', value)}
                size="sm"
              />
            </div>

            <FormSwitch
              name="enableEInvoice"
              label={t('shops.settings.gstConfig.enableEInvoice')}
              description={t(
                'shops.settings.gstConfig.enableEInvoiceDescription'
              )}
              checked={data.enableEInvoice}
              onChange={(_, value) => onChange('enableEInvoice', value)}
            />
          </div>
        </div>
      )}
    </div>
  )
}
