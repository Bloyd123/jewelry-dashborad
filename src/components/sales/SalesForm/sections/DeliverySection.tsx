//
// FILE: src/components/sales/SaleForm/sections/DeliverySection.tsx
// Delivery Details Section
//

import { useTranslation } from 'react-i18next'
import { FormSelect } from '@/components/forms/FormSelect/FormSelect'
import { FormTextarea } from '@/components/forms/FormTextarea/FormTextarea'
import { FormDatePicker } from '@/components/forms/FormDatePicker/FormDatePicker'
import { Truck } from 'lucide-react'
import type { FormSectionProps } from '../SaleForm.types'

export const DeliverySection = ({
  data,
  errors,
  onChange,
  onBlur,
  disabled = false,
}: FormSectionProps) => {
  const { t } = useTranslation()

  const delivery = data.delivery || {
    deliveryType: 'immediate',
    deliveryDate: undefined,
    deliveryAddress: undefined,
  }

  const handleDeliveryChange = (field: string, value: any) => {
    onChange('delivery', {
      ...delivery,
      [field]: value,
    })
  }

  const needsDeliveryDate = ['scheduled', 'courier'].includes(
    delivery.deliveryType || ''
  )
  const needsAddress = ['courier', 'scheduled'].includes(
    delivery.deliveryType || ''
  )

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Truck className="h-5 w-5 text-accent" />
        <h3 className="text-lg font-semibold text-text-primary">
          {t('sales.deliveryDetails')}
        </h3>
      </div>

      {/* Delivery Type */}
      <FormSelect
        name="delivery.deliveryType"
        label={t('sales.deliveryType')}
        value={delivery.deliveryType || 'immediate'}
        onChange={(_, val) => handleDeliveryChange('deliveryType', val)}
        onBlur={onBlur}
        error={errors['delivery.deliveryType']}
        required
        disabled={disabled}
        options={[
          { value: 'immediate', label: t('sales.immediate') },
          { value: 'scheduled', label: t('sales.scheduled') },
          { value: 'courier', label: t('sales.courier') },
          { value: 'pickup', label: t('sales.pickup') },
        ]}
      />

      {/* Delivery Date (for scheduled/courier) */}
      {needsDeliveryDate && (
        <FormDatePicker
          name="delivery.deliveryDate"
          label={t('sales.deliveryDate')}
          value={delivery.deliveryDate || ''}
          onChange={(_, val) => handleDeliveryChange('deliveryDate', val)}
          onBlur={onBlur}
          error={errors['delivery.deliveryDate']}
          placeholder={t('sales.selectDeliveryDate')}
          disabled={disabled}
          minDate={new Date()}
        />
      )}

      {/* Delivery Address (for scheduled/courier) */}
      {needsAddress && (
        <FormTextarea
          name="delivery.deliveryAddress"
          label={t('sales.deliveryAddress')}
          value={delivery.deliveryAddress || ''}
          onChange={(_, val) => handleDeliveryChange('deliveryAddress', val)}
          onBlur={onBlur}
          error={errors['delivery.deliveryAddress']}
          placeholder={t('sales.enterDeliveryAddress')}
          disabled={disabled}
          rows={3}
          maxLength={500}
          showCharCount
        />
      )}

      {/* Delivery Type Info */}
      <div className="rounded-lg border border-border-primary bg-bg-tertiary p-4">
        <p className="text-sm text-text-secondary">
          {delivery.deliveryType === 'immediate' &&
            t('sales.deliveryTypeImmediate')}
          {delivery.deliveryType === 'scheduled' &&
            t('sales.deliveryTypeScheduled')}
          {delivery.deliveryType === 'courier' &&
            t('sales.deliveryTypeCourier')}
          {delivery.deliveryType === 'pickup' && t('sales.deliveryTypePickup')}
        </p>
      </div>
    </div>
  )
}
