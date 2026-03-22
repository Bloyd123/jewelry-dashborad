// FILE: src/components/supplier/SupplierForm/sections/BasicInfoSection.tsx

import { useTranslation } from 'react-i18next'
import { FormInput } from '@/components/forms/FormInput/FormInput'
import { FormSelect } from '@/components/forms/FormSelect/FormSelect'
import type { SectionProps } from '../SupplierForm.types'
import {
  supplierTypeOptions,
  supplierCategoryOptions,
} from '@/pages/suppliers/data'

export const BasicInfoSection = ({
  data,
  errors,
  onChange,
  onBlur,
  disabled,
}: SectionProps) => {
  const { t } = useTranslation()

  return (
    <div className="space-y-4">
      <FormInput
        name="businessName"
        label={t('suppliers.businessName')}
        value={data.businessName || ''}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.businessName}
        placeholder={t('suppliers.businessNamePlaceholder')}
        required
        disabled={disabled}
        maxLength={200}
      />

      <FormInput
        name="displayName"
        label={t('suppliers.displayName')}
        value={data.displayName || ''}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.displayName}
        placeholder={t('suppliers.displayNamePlaceholder')}
        disabled={disabled}
        maxLength={200}
      />
      {/* <FormInput
        name="supplierCode"
        label={t('suppliers.supplierCode')}
        value={data.supplierCode || ''}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.supplierCode}
        placeholder={t('suppliers.supplierCodePlaceholder')}
        disabled={disabled}
        maxLength={50}
      /> */}
      <FormSelect
        name="supplierType"
        label={t('suppliers.supplierType')}
        value={data.supplierType || ''}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.supplierType}
        placeholder={t('suppliers.selectSupplierType')}
        required
        disabled={disabled}
        options={supplierTypeOptions}
      />
      <FormSelect
        name="supplierCategory"
        label={t('suppliers.supplierCategory')}
        value={data.supplierCategory || ''}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.supplierCategory}
        placeholder={t('suppliers.selectSupplierCategory')}
        required
        disabled={disabled}
        options={supplierCategoryOptions}
      />
    </div>
  )
}
