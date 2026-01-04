//
// FILE: src/components/supplier/SupplierForm/sections/AddressSection.tsx
// Address Section
//

import { useTranslation } from 'react-i18next'
import { FormInput } from '@/components/forms/FormInput/FormInput'
import type { SectionProps } from '../SupplierForm.types'

export const AddressSection = ({
  data,
  errors,
  onChange,
  onBlur,
  disabled,
}: SectionProps) => {
  const { t } = useTranslation()

  const handleNestedChange = (field: string, value: any) => {
    onChange('address', {
      ...data.address,
      [field]: value,
    })
  }

  return (
    <div className="space-y-4">
      {/* Street */}
      <FormInput
        name="address.street"
        label={t('suppliers.street')}
        value={data.address?.street || ''}
        onChange={(_, val) => handleNestedChange('street', val)}
        onBlur={onBlur}
        error={errors['address.street']}
        placeholder={t('suppliers.streetPlaceholder')}
        disabled={disabled}
        maxLength={200}
      />

      {/* Landmark */}
      <FormInput
        name="address.landmark"
        label={t('suppliers.landmark')}
        value={data.address?.landmark || ''}
        onChange={(_, val) => handleNestedChange('landmark', val)}
        onBlur={onBlur}
        error={errors['address.landmark']}
        placeholder={t('suppliers.landmarkPlaceholder')}
        disabled={disabled}
        maxLength={100}
      />

      {/* Area */}
      <FormInput
        name="address.area"
        label={t('suppliers.area')}
        value={data.address?.area || ''}
        onChange={(_, val) => handleNestedChange('area', val)}
        onBlur={onBlur}
        error={errors['address.area']}
        placeholder={t('suppliers.areaPlaceholder')}
        disabled={disabled}
        maxLength={100}
      />

      {/* City */}
      <FormInput
        name="address.city"
        label={t('suppliers.city')}
        value={data.address?.city || ''}
        onChange={(_, val) => handleNestedChange('city', val)}
        onBlur={onBlur}
        error={errors['address.city']}
        placeholder={t('suppliers.cityPlaceholder')}
        disabled={disabled}
        maxLength={100}
      />

      {/* State */}
      <FormInput
        name="address.state"
        label={t('suppliers.state')}
        value={data.address?.state || ''}
        onChange={(_, val) => handleNestedChange('state', val)}
        onBlur={onBlur}
        error={errors['address.state']}
        placeholder={t('suppliers.statePlaceholder')}
        disabled={disabled}
        maxLength={100}
      />

      {/* Country */}
      <FormInput
        name="address.country"
        label={t('suppliers.country')}
        value={data.address?.country || 'India'}
        onChange={(_, val) => handleNestedChange('country', val)}
        onBlur={onBlur}
        error={errors['address.country']}
        placeholder={t('suppliers.countryPlaceholder')}
        disabled={disabled}
        maxLength={100}
      />

      {/* Pincode */}
      <FormInput
        name="address.pincode"
        label={t('suppliers.pincode')}
        value={data.address?.pincode || ''}
        onChange={(_, val) => handleNestedChange('pincode', val)}
        onBlur={onBlur}
        error={errors['address.pincode']}
        placeholder="400001"
        disabled={disabled}
        maxLength={6}
      />

      {/* Registration Details Heading */}
      <div className="mt-6 border-b border-border-secondary pb-2">
        <h4 className="text-sm font-semibold text-text-primary">
          {t('suppliers.registrationDetails')}
        </h4>
      </div>

      {/* GST Number */}
      <FormInput
        name="gstNumber"
        label={t('suppliers.gstNumber')}
        value={data.gstNumber || ''}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.gstNumber}
        placeholder="27AAAAA0000A1Z5"
        disabled={disabled}
        maxLength={15}
      />

      {/* PAN Number */}
      <FormInput
        name="panNumber"
        label={t('suppliers.panNumber')}
        value={data.panNumber || ''}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.panNumber}
        placeholder="AAAAA0000A"
        disabled={disabled}
        maxLength={10}
      />

      {/* TAN Number */}
      <FormInput
        name="tanNumber"
        label={t('suppliers.tanNumber')}
        value={data.tanNumber || ''}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.tanNumber}
        placeholder="MUMR12345A"
        disabled={disabled}
        maxLength={10}
      />

      {/* Registration Number */}
      <FormInput
        name="registrationNumber"
        label={t('suppliers.registrationNumber')}
        value={data.registrationNumber || ''}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.registrationNumber}
        placeholder="REG-2018-MH-001"
        disabled={disabled}
        maxLength={50}
      />
    </div>
  )
}
