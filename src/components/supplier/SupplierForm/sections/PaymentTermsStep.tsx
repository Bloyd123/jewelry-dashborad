// ============================================================================
// FILE: src/components/supplier/SupplierForm/sections/PaymentTermsSection.tsx
// Payment Terms Section
// ============================================================================

import { useTranslation } from 'react-i18next'
import { FormInput } from '@/components/forms/FormInput/FormInput'
import { FormSelect } from '@/components/forms/FormSelect/FormSelect'
import { FormTextarea } from '@/components/forms/FormTextarea/FormTextarea'
import type { SectionProps } from '../SupplierForm.types'
import { paymentTermsOptions } from '@/pages/suppliers/data'

export const PaymentTermsSection = ({
  data,
  errors,
  onChange,
  onBlur,
  disabled,
}: SectionProps) => {
  const { t } = useTranslation()

  return (
    <div className="space-y-4">
      {/* Payment Terms */}
      <FormSelect
        name="paymentTerms"
        label={t('suppliers.paymentTermsForm')}
        value={data.paymentTerms || ''}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.paymentTerms}
        placeholder={t('suppliers.selectPaymentTerms')}
        required
        disabled={disabled}
        options={paymentTermsOptions}
      />

      {/* Credit Period */}
      <FormInput
        name="creditPeriod"
        label={t('suppliers.creditPeriod')}
        type="number"
        value={data.creditPeriod || 0}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.creditPeriod}
        placeholder="30"
        disabled={disabled}
      />

      {/* Credit Limit */}
      <FormInput
        name="creditLimit"
        label={t('suppliers.creditLimit')}
        type="number"
        value={data.creditLimit || 0}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.creditLimit}
        placeholder="500000"
        disabled={disabled}
      />

      {/* Products Supplied */}
      <div className="space-y-2">
        <FormTextarea
          name="productsSupplied"
          label={t('suppliers.productsSupplied')}
          value={
            Array.isArray(data.productsSupplied)
              ? data.productsSupplied.join(', ')
              : ''
          }
          onChange={(name, val) => {
            const products = val
              .split(',')
              .map(p => p.trim())
              .filter(Boolean)
            onChange(name, products)
          }}
          onBlur={onBlur}
          error={errors.productsSupplied}
          placeholder={t('suppliers.productsSuppliedPlaceholder')}
          disabled={disabled}
          rows={3}
        />
        <p className="text-xs text-text-tertiary">
          {t('suppliers.productsSuppliedHint')}
        </p>
      </div>

      {/* Specialization */}
      <div className="space-y-2">
        <FormTextarea
          name="specialization"
          label={t('suppliers.specialization')}
          value={
            Array.isArray(data.specialization)
              ? data.specialization.join(', ')
              : ''
          }
          onChange={(name, val) => {
            const specs = val
              .split(',')
              .map(s => s.trim())
              .filter(Boolean)
            onChange(name, specs)
          }}
          onBlur={onBlur}
          error={errors.specialization}
          placeholder={t('suppliers.specializationPlaceholder')}
          disabled={disabled}
          rows={3}
        />
        <p className="text-xs text-text-tertiary">
          {t('suppliers.specializationHint')}
        </p>
      </div>
    </div>
  )
}
