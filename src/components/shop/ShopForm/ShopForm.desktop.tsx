// ============================================================================
// FILE: src/components/shop/ShopForm/ShopForm.desktop.tsx
// Desktop Layout for ShopForm
// ============================================================================

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { ShopFormProps } from './shopForm.types'
import type { Shop } from '@/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Save, X, Loader2 } from 'lucide-react'
import { BasicInfoSection } from './sections/BasicInfoSection'
import { ContactSection } from './sections/ContactSection'
import { AddressSection } from './sections/AddressSection'
import { BusinessRegistrationSection } from './sections/BusinessRegistrationSection'
import { BankingSection } from './sections/BankingSection'
import { UPISection } from './sections/UPISection'

export default function ShopFormDesktop({
  initialData = {},
  shopId,
  organizationId,
  onSuccess,
  onCancel,
  mode = 'create',
}: ShopFormProps) {
  const { t } = useTranslation()
  const [formData, setFormData] = useState<Partial<Shop>>(initialData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleBlur = (name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }))
  }

  const handleSubmit = async () => {
    // Basic validation
    const newErrors: Record<string, string> = {}

    if (!formData.name?.trim()) {
      newErrors.name = t('shops.validation.nameRequired')
    }
    if (!formData.phone?.trim()) {
      newErrors.phone = t('shops.validation.phoneRequired')
    }
    if (!formData.address?.street?.trim()) {
      newErrors['address.street'] = t('shops.validation.streetRequired')
    }
    if (!formData.address?.city?.trim()) {
      newErrors['address.city'] = t('shops.validation.cityRequired')
    }
    if (!formData.address?.state?.trim()) {
      newErrors['address.state'] = t('shops.validation.stateRequired')
    }
    if (!formData.address?.pincode?.trim()) {
      newErrors['address.pincode'] = t('shops.validation.pincodeRequired')
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)

    // Mock delay for submission
    setTimeout(() => {
      console.log('Mock Submit:', { mode, shopId, organizationId, formData })
      setIsLoading(false)
      onSuccess?.()
    }, 1000)
  }

  return (
    <div className="container mx-auto max-w-7xl p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-text-primary">
          {mode === 'create'
            ? t('shops.form.addShop')
            : t('shops.form.editShop')}
        </h1>
        <p className="mt-1 text-text-secondary">
          {mode === 'create'
            ? t('shops.form.addShopDescription')
            : t('shops.form.editShopDescription')}
        </p>
      </div>

      {/* Form Grid - 2 Columns */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Basic Info */}
          <Card className="border-border-primary bg-bg-secondary">
            <CardHeader>
              <CardTitle className="text-text-primary">
                {t('shops.form.basicInformation')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BasicInfoSection
                data={formData}
                errors={errors}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isLoading}
              />
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card className="border-border-primary bg-bg-secondary">
            <CardHeader>
              <CardTitle className="text-text-primary">
                {t('shops.form.contactInformation')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ContactSection
                data={formData}
                errors={errors}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isLoading}
              />
            </CardContent>
          </Card>

          {/* Address */}
          <Card className="border-border-primary bg-bg-secondary">
            <CardHeader>
              <CardTitle className="text-text-primary">
                {t('shops.form.address')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AddressSection
                data={formData}
                errors={errors}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isLoading}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Business Registration */}
          <Card className="border-border-primary bg-bg-secondary">
            <CardHeader>
              <CardTitle className="text-text-primary">
                {t('shops.form.businessRegistration')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BusinessRegistrationSection
                data={formData}
                errors={errors}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isLoading}
              />
            </CardContent>
          </Card>

          {/* Banking Details */}
          <Card className="border-border-primary bg-bg-secondary">
            <CardHeader>
              <CardTitle className="text-text-primary">
                {t('shops.form.bankingDetails')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BankingSection
                data={formData}
                errors={errors}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isLoading}
              />
            </CardContent>
          </Card>

          {/* UPI Details */}
          <Card className="border-border-primary bg-bg-secondary">
            <CardHeader>
              <CardTitle className="text-text-primary">
                {t('shops.form.upiDetails')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <UPISection
                data={formData}
                errors={errors}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isLoading}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Form Actions - Sticky Bottom */}
      <div className="sticky bottom-0 mt-6 border-t border-border-primary bg-bg-primary py-4">
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            className="min-w-[120px] border-border-primary text-text-primary hover:bg-bg-tertiary"
          >
            <X className="mr-2 h-4 w-4" />
            {t('shops.common.cancel')}
          </Button>

          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="min-w-[120px] bg-accent text-white hover:bg-accent/90"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('shops.common.saving')}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {mode === 'create' ? t('shops.common.save') : t('shops.common.update')}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}