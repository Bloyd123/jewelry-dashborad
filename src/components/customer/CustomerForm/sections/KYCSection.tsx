// FILE: src/components/customer/CustomerForm/sections/KYCSection.tsx
// KYC Details Section

import { useTranslation } from 'react-i18next'
import { FormInput } from '@/components/forms/FormInput'
import { Shield } from 'lucide-react'
import type { FormSectionProps } from '@/components/customer/CustomerForm/CustomerForm.types'

export const KYCSection = ({
  data,
  errors,
  onChange,
  onBlur,
  disabled,
}: FormSectionProps) => {
  const { t } = useTranslation()

  return (
    <div className="space-y-4">
      <div className="mb-4 flex items-center gap-2 text-sm text-text-secondary">
        <Shield className="h-4 w-4" />
        <span>{t('customer.kycDescription')}</span>
      </div>

      <FormInput
        name="aadharNumber"
        label={t('customer.aadharNumber')}
        value={data.aadharNumber || ''}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.aadharNumber}
        placeholder="123456789012"
        disabled={disabled}
        maxLength={12}
      />

      <FormInput
        name="panNumber"
        label={t('customer.panNumber')}
        value={data.panNumber || ''}
        onChange={(name, value) =>
          onChange(name, value.toString().toUpperCase())
        }
        onBlur={onBlur}
        error={errors.panNumber}
        placeholder="ABCDE1234F"
        disabled={disabled}
        maxLength={10}
      />

      <FormInput
        name="gstNumber"
        label={t('customer.gstNumber')}
        value={data.gstNumber || ''}
        onChange={(name, value) =>
          onChange(name, value.toString().toUpperCase())
        }
        onBlur={onBlur}
        error={errors.gstNumber}
        placeholder="22AAAAA0000A1Z5"
        disabled={disabled}
        maxLength={15}
      />
    </div>
  )
}
