// ============================================================================
// FILE: src/components/shops/ShopSettings/ShopSettings.tsx
// Main Shop Settings Modal Component
// ============================================================================

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { X, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/overlay/Dialog'
import { Separator } from '@/components/ui/layout/Separator'
import { FormError } from '@/components/forms/FormError'

// Import Sections
import { GeneralSettingsSection } from './sections/GeneralSettingsSection'
import { GSTConfigSection } from './sections/GSTConfigSection'
import { BusinessHoursSection } from './sections/BusinessHoursSection'
import { FeaturesSection } from './sections/FeaturesSection'

// Types
import type { Shop } from '@/types/shop.types'
import type { ShopSettingsFormData } from './shopSettings.types'

// ============================================================================
// PROPS
// ============================================================================

interface ShopSettingsProps {
  shop: Shop
  isOpen: boolean
  onClose: () => void
  onSave: (settings: ShopSettingsFormData) => Promise<void>
}

// ============================================================================
// COMPONENT
// ============================================================================

export const ShopSettings: React.FC<ShopSettingsProps> = ({
  shop,
  isOpen,
  onClose,
  onSave,
}) => {
  const { t } = useTranslation()

  // ========================================================================
  // STATE
  // ========================================================================

  const [formData, setFormData] = useState<ShopSettingsFormData>({
    generalSettings: {
      currency: shop.settings?.currency || 'INR',
      language: shop.settings?.language || 'en',
      timezone: shop.settings?.timezone || 'Asia/Kolkata',
      dateFormat: 'DD/MM/YYYY',
      defaultWeightUnit: shop.settings?.defaultWeightUnit || 'gram',
      priceDecimals: 2,
      weightDecimals: 3,
      enableAdvancePayment: true,
      minimumAdvancePercentage: 20,
      acceptedPaymentMethods: {
        cash: true,
        card: true,
        upi: true,
        netBanking: true,
        cheque: false,
        emi: false,
      },
      dashboardView: 'grid',
      itemsPerPage: 25,
      showProductImages: true,
      darkMode: false,
    },
    gstSettings: {
      enableGST: shop.settings?.enableGST || true,
      gstRates: {
        gold: shop.settings?.gstRates?.gold || 3.0,
        silver: shop.settings?.gstRates?.silver || 3.0,
        diamond: shop.settings?.gstRates?.diamond || 0.25,
        platinum: 3.0,
        makingCharges: shop.settings?.gstRates?.making || 5.0,
        otherCharges: 18.0,
      },
      hsnCodes: {
        gold: '7113',
        silver: '7106',
        diamond: '7102',
        platinum: '7110',
        makingCharges: '9988',
        otherCharges: '9989',
      },
      priceDisplay: 'include',
      showGSTBreakup: true,
      showCGSTSGST: true,
      showIGST: true,
      showHSNOnInvoice: true,
      invoicePrefix: 'GST-INV-RJ-',
      displayPlaceOfSupply: true,
      displayReverseCharge: true,
      enableEInvoice: false,
    },
    businessHours: shop.businessHours || {
      monday: { open: '10:00', close: '21:00' },
      tuesday: { open: '10:00', close: '21:00' },
      wednesday: { open: '10:00', close: '21:00' },
      thursday: { open: '10:00', close: '21:00' },
      friday: { open: '10:00', close: '21:00' },
      saturday: { open: '10:00', close: '21:00' },
      sunday: { open: '10:00', close: '18:00' },
      holidays: [],
    },
    features: {
      core: {
        inventoryManagement: true,
        salesBilling: true,
        customerManagement: true,
        productCatalog: true,
      },
      advanced: {
        reportsAnalytics: true,
        goldSchemeManagement: false,
        multiCurrencySupport: false,
        onlineOrders: true,
      },
      specialized: {
        repairJobWork: true,
        customOrders: true,
        giftVouchers: false,
        loyaltyProgram: false,
      },
    },
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string>('')

  // ========================================================================
  // HANDLERS
  // ========================================================================

  const handleChange = (
    section: keyof ShopSettingsFormData,
    field: string,
    value: any
  ) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }))

    // Clear error for this field
    if (errors[`${section}.${field}`]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[`${section}.${field}`]
        return newErrors
      })
    }
  }

  const handleNestedChange = (
    section: keyof ShopSettingsFormData,
    parent: string,
    field: string,
    value: any
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
    setIsSubmitting(true)
    setSubmitError('')

    try {
      await onSave(formData)
      onClose()
    } catch (error: any) {
      setSubmitError(error.message || t('shops.settings.errors.saveFailed'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDiscard = () => {
    if (
      window.confirm(
        t('shops.settings.confirmDiscard') ||
          'Are you sure you want to discard all changes?'
      )
    ) {
      onClose()
    }
  }

  // ========================================================================
  // RENDER
  // ========================================================================

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
      closeOnEscape={true}
      closeOnOutsideClick={false}
      contentClassName="max-w-4xl max-h-[90vh] overflow-y-auto"
    >
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-border-primary bg-bg-secondary px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-text-primary">
              {t('shops.settings.title')} - {shop.name}
            </h2>
            <p className="mt-1 text-sm text-text-secondary">
              {shop.code} • {shop.address.city}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            disabled={isSubmitting}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6 px-6 py-6">
        {/* Submit Error */}
        {submitError && <FormError error={submitError} type="error" />}

        {/* SECTION 2: General Settings */}
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

        <Separator />

        {/* SECTION 3: GST Configuration */}
        <GSTConfigSection
          shop={shop}
          data={formData.gstSettings}
          onChange={(field, value) => handleChange('gstSettings', field, value)}
          onNestedChange={(parent, field, value) =>
            handleNestedChange('gstSettings', parent, field, value)
          }
          errors={errors}
        />

        <Separator />

        {/* SECTION 4: Business Hours */}
        <BusinessHoursSection
          data={formData.businessHours}
          onChange={(field, value) =>
            handleChange('businessHours', field, value)
          }
          errors={errors}
        />

        <Separator />

        {/* SECTION 5: Features */}
        <FeaturesSection
          data={formData.features}
          onChange={(field, value) => handleChange('features', field, value)}
          onNestedChange={(parent, field, value) =>
            handleNestedChange('features', parent, field, value)
          }
          errors={errors}
        />
      </div>

      {/* Footer Actions */}
      <div className="sticky bottom-0 flex items-center justify-between border-t border-border-primary bg-bg-secondary px-6 py-4">
        <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
          {t('common.cancel')}
        </Button>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleDiscard}
            disabled={isSubmitting}
          >
            {t('shops.settings.discardAll')}
          </Button>

          <Button onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? (
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
