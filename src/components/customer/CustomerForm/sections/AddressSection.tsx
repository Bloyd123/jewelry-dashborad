// ============================================================================
// FILE: src/components/customer/CustomerForm/sections/AddressSection.tsx
// Address Section
// ============================================================================

import { useTranslation } from 'react-i18next'
import { FormInput } from '@/components/forms/FormInput'
import { FormTextarea } from '@/components/forms/FormTextarea'
import type { FormSectionProps } from '@/components/customer/CustomerForm/CustomerForm.types'

export const AddressSection = ({
  data,
  errors,
  onChange,
  onBlur,
  disabled,
}: FormSectionProps) => {
  const { t } = useTranslation()

  const handleAddressChange = (field: string, value: string | number) => {
    onChange('address', {
      ...data.address,
         [field]: String(value),
    })
  }

  return (
    <div className="space-y-4">
      <FormTextarea
        name="address.street"
        label={t('customer.street')}
        value={data.address?.street || ''}
        onChange={(_, value) => handleAddressChange('street', value)}
        onBlur={() => onBlur?.('address.street')}
        error={errors['address.street']}
        placeholder={t('customer.streetPlaceholder')}
        disabled={disabled}
        maxLength={200}
        rows={3}
        showCharCount
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          name="address.city"
          label={t('customer.city')}
          value={data.address?.city || ''}
          onChange={(_, value) => handleAddressChange('city', value)}
          onBlur={() => onBlur?.('address.city')}
          error={errors['address.city']}
          placeholder={t('customer.cityPlaceholder')}
          disabled={disabled}
          maxLength={50}
        />

        <FormInput
          name="address.state"
          label={t('customer.state')}
          value={data.address?.state || ''}
          onChange={(_, value) => handleAddressChange('state', value)}
          onBlur={() => onBlur?.('address.state')}
          error={errors['address.state']}
          placeholder={t('customer.statePlaceholder')}
          disabled={disabled}
          maxLength={50}
        />
      </div>

      <FormInput
        name="address.pincode"
        label={t('customer.pincode')}
        value={data.address?.pincode || ''}
        onChange={(_, value) => handleAddressChange('pincode', value)}
        onBlur={() => onBlur?.('address.pincode')}
        error={errors['address.pincode']}
        placeholder="123456"
        disabled={disabled}
        maxLength={6}
      />
    </div>
  )
}
