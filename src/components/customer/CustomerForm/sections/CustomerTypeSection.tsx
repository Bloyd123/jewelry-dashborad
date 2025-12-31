// ============================================================================
// FILE: src/components/customer/CustomerForm/sections/CustomerTypeSection.tsx
// Customer Type Section
// ============================================================================

import { useTranslation } from 'react-i18next'
import { FormSelect } from '@/components/forms/FormSelect'
import { FormInput } from '@/components/forms/FormInput'
import type { FormSectionProps } from '@/components/customer/CustomerForm/CustomerForm.types'

export const CustomerTypeSection = ({
  data,
  errors,
  onChange,
  onBlur,
  disabled,
}: FormSectionProps) => {
  const { t } = useTranslation()

  const typeOptions = [
    { value: 'retail', label: t('customer.type.retail') },
    { value: 'wholesale', label: t('customer.type.wholesale') },
    { value: 'vip', label: t('customer.type.vip') },
    { value: 'regular', label: t('customer.type.regular') },
  ]

  const categoryOptions = [
    { value: 'gold', label: t('customer.category.gold') },
    { value: 'silver', label: t('customer.category.silver') },
    { value: 'diamond', label: t('customer.category.diamond') },
    { value: 'platinum', label: t('customer.category.platinum') },
    { value: 'mixed', label: t('customer.category.mixed') },
  ]

  return (
    <div className="space-y-4">
      <FormSelect
        name="customerType"
        label={t('customer.customerTypetext')}
        value={data.customerType || ''}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.customerType}
        placeholder={t('customer.selectCustomerType')}
        options={typeOptions}
        disabled={disabled}
      />

      <FormSelect
        name="customerCategory"
        label={t('customer.customerCategorytext')}
        value={data.customerCategory || ''}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.customerCategory}
        placeholder={t('customer.selectCategory')}
        options={categoryOptions}
        disabled={disabled}
      />

      <FormInput
        name="creditLimit"
        label={t('customer.creditLimit')}
        type="number"
        value={data.creditLimit || ''}
        onChange={(name, value) => onChange(name, Number(value))}
        onBlur={onBlur}
        error={errors.creditLimit}
        placeholder="0"
        disabled={disabled}
      />
    </div>
  )
}
