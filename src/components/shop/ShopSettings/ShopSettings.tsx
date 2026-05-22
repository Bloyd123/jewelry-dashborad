// FILE: src/components/shops/ShopSettings/ShopSettings.tsx

import React, { useState } from 'react'
import { useTranslation }  from 'react-i18next'
import { X, Save, Settings, Clock, Zap, Receipt } from 'lucide-react'
import { Button }    from '@/components/ui/button'
import { Dialog }    from '@/components/ui/overlay/Dialog'
import { Tabs }      from '@/components/ui/navigation/Tabs/Tabs'
import { FormError } from '@/components/forms/FormError'

// Import Sections
import { GeneralSettingsSection } from './sections/GeneralSettingsSection'
import { GSTConfigSection }       from './sections/GSTConfigSection'
import { BusinessHoursSection }   from './sections/BusinessHoursSection'
import { FeaturesSection }        from './sections/FeaturesSection'

// Types
import type { Shop }                 from '@/types/shop.types'
import type { ShopSettingsFormData } from './shopSettings.types'

// Hook
import { useShopSettings } from '@/hooks/shop'

// ─── Props ────────────────────────────────────────────────────────────────────

interface ShopSettingsProps {
  shop:    Shop
  isOpen:  boolean
  onClose: () => void
}

// ─── Tab Type ─────────────────────────────────────────────────────────────────

type SettingsTab = 'general' | 'gst' | 'hours' | 'features'

// ─── Helpers ──────────────────────────────────────────────────────────────────
const padTime = (t: string) => t && t.length === 4 ? '0' + t : t  // "5:00" → "05:00"

const mapBackendBusinessHours = (backendHours: any) => {
  if (!backendHours) return null

  const days = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday']
  const mapped: any = { holidays: backendHours.holidays || [] }

  days.forEach(day => {
    const d = backendHours[day]
    if (d) {

mapped[day] = {
  isOpen: d.isOpen ?? true,
  open:   padTime(d.openTime  || d.open  || '10:00'),
  close:  padTime(d.closeTime || d.close || '20:00'),
}
    } else {
      mapped[day] = { isOpen: true, open: '10:00', close: '20:00' }
    }
  })

  return mapped
}

const mapFrontendToBackend = (frontendHours: any) => {
  if (!frontendHours) return {}

  const days = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday']
  const mapped: any = { holidays: frontendHours.holidays || [] }

  days.forEach(day => {
    const d = frontendHours[day]
    if (d) {
      mapped[day] = {
        isOpen:    d.isOpen ?? true,
        openTime:  d.open  || '10:00',
        closeTime: d.close || '20:00',
      }
    }
  })

  return mapped
}

// ─── Component ────────────────────────────────────────────────────────────────

export const ShopSettings: React.FC<ShopSettingsProps> = ({
  shop,
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation()
  const { updateSettings, isUpdating: isUpdatingSettings } = useShopSettings(shop._id)
console.log('[ShopSettings] shop.businessHours:', JSON.stringify(shop.businessHours, null, 2))
  const [activeTab, setActiveTab] = useState<SettingsTab>('general')
  const [errors,    setErrors]    = useState<Record<string, string>>({})

  const [formData, setFormData] = useState<ShopSettingsFormData>({
    generalSettings: {
      currency:                 shop.settings?.currency         || 'INR',
      language:                 shop.settings?.language         || 'en',
      timezone:                 shop.settings?.timezone         || 'Asia/Kolkata',
      dateFormat:               'DD/MM/YYYY',
      defaultWeightUnit:        shop.settings?.defaultWeightUnit || 'gram',
      priceDecimals:            2,
      weightDecimals:           3,
      enableAdvancePayment:     true,
      minimumAdvancePercentage: 20,
      acceptedPaymentMethods: {
        cash: true, card: true, upi: true,
        netBanking: true, cheque: false, emi: false,
      },
      dashboardView:    'grid',
      itemsPerPage:     25,
      showProductImages: true,
      darkMode:         false,
    },
    gstSettings: {
      enableGST: shop.settings?.enableGST || true,
      gstRates: {
        gold:          shop.settings?.gstRates?.gold     || 3.0,
        silver:        shop.settings?.gstRates?.silver   || 3.0,
        diamond:       shop.settings?.gstRates?.diamond  || 0.25,
        platinum:      3.0,
        makingCharges: shop.settings?.gstRates?.making   || 5.0,
        otherCharges:  18.0,
      },
      hsnCodes: {
        gold: '7113', silver: '7106', diamond: '7102',
        platinum: '7110', makingCharges: '9988', otherCharges: '9989',
      },
      priceDisplay:           'include',
      showGSTBreakup:         true,
      showCGSTSGST:           true,
      showIGST:               true,
      showHSNOnInvoice:       true,
      invoicePrefix:          'GST-INV-RJ-',
      displayPlaceOfSupply:   true,
      displayReverseCharge:   true,
      enableEInvoice:         false,
    },
    
    businessHours: mapBackendBusinessHours(shop.businessHours) || {
      monday:    { isOpen: true, open: '10:00', close: '21:00' },
      tuesday:   { isOpen: true, open: '10:00', close: '21:00' },
      wednesday: { isOpen: true, open: '10:00', close: '21:00' },
      thursday:  { isOpen: true, open: '10:00', close: '21:00' },
      friday:    { isOpen: true, open: '10:00', close: '21:00' },
      saturday:  { isOpen: true, open: '10:00', close: '21:00' },
      sunday:    { isOpen: true, open: '10:00', close: '20:00' },
      holidays:  [],
    },
    features: {
      core: {
        inventoryManagement: true,
        salesBilling:        true,
        customerManagement:  true,
        productCatalog:      true,
      },
      advanced: {
        reportsAnalytics:      true,
        goldSchemeManagement:  false,
        multiCurrencySupport:  false,
        onlineOrders:          true,
      },
      specialized: {
        repairJobWork:  true,
        customOrders:   true,
        giftVouchers:   false,
        loyaltyProgram: false,
      },
    },
  })

  // ─── Handlers ───────────────────────────────────────────────────────────────

  const handleChange = (
    section: keyof ShopSettingsFormData,
    field:   string,
    value:   any
  ) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }))

    if (errors[`${section}.${field}`]) {
      setErrors(prev => {
        const next = { ...prev }
        delete next[`${section}.${field}`]
        return next
      })
    }
  }

  const handleNestedChange = (
    section: keyof ShopSettingsFormData,
    parent:  string,
    field:   string,
    value:   any
  ) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [parent]: {
          ...(prev[section] as any)[parent],
          [field]: value,
        },
      },
    }))
  }

const handleSave = async () => {
  const payload = {
    settings: {
      currency:          formData.generalSettings.currency,
      language:          formData.generalSettings.language,
      timezone:          formData.generalSettings.timezone,
      defaultWeightUnit: formData.generalSettings.defaultWeightUnit,
      enableGST:         formData.gstSettings.enableGST,
      gstRates:          formData.gstSettings.gstRates,
      acceptedPaymentModes: formData.generalSettings.acceptedPaymentMethods,
    },
    businessHours: mapFrontendToBackend(formData.businessHours),
  }
  const result = await updateSettings(payload as any, setErrors)
    if (result.success) onClose()
  }

  const handleDiscard = () => {
    if (window.confirm(
      t('shops.settings.confirmDiscard') ||
      'Are you sure you want to discard all changes?'
    )) {
      onClose()
    }
  }

  // ─── Tab Items ───────────────────────────────────────────────────────────────

  const tabItems = [
    {
      value: 'general',
      label: t('shops.settings.tabs.general', 'General'),
      icon:  <Settings className="h-4 w-4" />,
    },
    {
      value: 'gst',
      label: t('shops.settings.tabs.gst', 'GST & Tax'),
      icon:  <Receipt  className="h-4 w-4" />,
    },
    {
      value: 'hours',
      label: t('shops.settings.tabs.hours', 'Business Hours'),
      icon:  <Clock    className="h-4 w-4" />,
    },
    {
      value: 'features',
      label: t('shops.settings.tabs.features', 'Features'),
      icon:  <Zap      className="h-4 w-4" />,
    },
  ]

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
      closeOnEscape={true}
      closeOnOutsideClick={false}
      contentClassName="max-w-4xl h-[90vh] flex flex-col overflow-hidden"
    >

      {/* ── Header (sticky) ───────────────────────────────────────────────────── */}
      <div className="flex-shrink-0 border-b border-border-primary bg-bg-secondary px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-text-primary">
              {t('shops.settings.title')} — {shop.name}
            </h2>
            <p className="mt-1 text-sm text-text-secondary">
              {shop.code} • {shop.address.city}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            disabled={isUpdatingSettings}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Tabs — inside header so they stay sticky */}
        <div className="mt-4 overflow-x-auto">
          <Tabs
            tabs={tabItems}
            value={activeTab}
            onValueChange={val => setActiveTab(val as SettingsTab)}
            variant="underline"
            size="md"
          />
        </div>
      </div>

      {/* ── Scrollable Content ────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-6 py-6">

        {Object.keys(errors).length > 0 && (
          <div className="mb-4">
            <FormError
              error={t('shops.settings.errors.saveFailed')}
              type="error"
            />
          </div>
        )}

        {activeTab === 'general' && (
          <GeneralSettingsSection
            data={formData.generalSettings}
            onChange={(field, value) =>
              handleChange('generalSettings', field, value)
            }
            onNestedChange={(parent, field, value) =>
              handleNestedChange('generalSettings', parent, field, value)
            }
            errors={errors}
          />
        )}

        {activeTab === 'gst' && (
          <GSTConfigSection
            shop={shop}
            data={formData.gstSettings}
            onChange={(field, value) =>
              handleChange('gstSettings', field, value)
            }
            onNestedChange={(parent, field, value) =>
              handleNestedChange('gstSettings', parent, field, value)
            }
            errors={errors}
          />
        )}

        {activeTab === 'hours' && (
          <BusinessHoursSection
            data={formData.businessHours}
            onChange={(field, value) =>
              handleChange('businessHours', field, value)
            }
            errors={errors}
          />
        )}

        {activeTab === 'features' && (
          <FeaturesSection
            data={formData.features}
            onChange={(field, value) =>
              handleChange('features', field, value)
            }
            onNestedChange={(parent, field, value) =>
              handleNestedChange('features', parent, field, value)
            }
            errors={errors}
          />
        )}

      </div>

      {/* ── Footer (sticky) ───────────────────────────────────────────────────── */}
      <div className="flex-shrink-0 flex items-center justify-between border-t border-border-primary bg-bg-secondary px-6 py-4">
        <Button
          variant="outline"
          onClick={onClose}
          disabled={isUpdatingSettings}
        >
          {t('common.cancel')}
        </Button>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleDiscard}
            disabled={isUpdatingSettings}
          >
            {t('shops.settings.discardAll')}
          </Button>

          <Button onClick={handleSave} disabled={isUpdatingSettings}>
            {isUpdatingSettings ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-bg-primary border-t-transparent" />
                {t('common.saving')}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {t('shops.settings.saveAll')}
              </>
            )}
          </Button>
        </div>
      </div>

    </Dialog>
  )
}