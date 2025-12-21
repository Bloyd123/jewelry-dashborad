// ============================================================================
// FILE: src/components/supplier/SupplierForm/sections/BankDetailsSection.tsx
// Bank Details Section (Optional)
// ============================================================================

import { useTranslation } from 'react-i18next'
import { FormInput } from '@/components/forms/FormInput/FormInput'
import { FormSelect } from '@/components/forms/FormSelect/FormSelect'
import type { SectionProps } from '../SupplierForm.types'

const accountTypeOptions = [
  { value: 'savings', label: 'Savings Account' },
  { value: 'current', label: 'Current Account' },
  { value: 'overdraft', label: 'Overdraft Account' },
]

export const BankDetailsSection = ({
  data,
  errors,
  onChange,
  onBlur,
  disabled,
}: SectionProps) => {
  const { t } = useTranslation()

  const handleNestedChange = (field: string, value: any) => {
    onChange('bankDetails', {
      ...data.bankDetails,
      [field]: value,
    })
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border border-border-secondary bg-bg-tertiary p-3">
        <p className="text-sm text-text-secondary">
          {t('suppliers.bankDetailsOptional')}
        </p>
      </div>

      {/* Bank Name */}
      <FormInput
        name="bankDetails.bankName"
        label={t('suppliers.bankName')}
        value={data.bankDetails?.bankName || ''}
        onChange={(_, val) => handleNestedChange('bankName', val)}
        onBlur={onBlur}
        error={errors['bankDetails.bankName']}
        placeholder={t('suppliers.bankNamePlaceholder')}
        disabled={disabled}
        maxLength={100}
      />

      {/* Account Number */}
      <FormInput
        name="bankDetails.accountNumber"
        label={t('suppliers.accountNumber')}
        value={data.bankDetails?.accountNumber || ''}
        onChange={(_, val) => handleNestedChange('accountNumber', val)}
        onBlur={onBlur}
        error={errors['bankDetails.accountNumber']}
        placeholder="50200012345678"
        disabled={disabled}
        maxLength={18}
      />

      {/* IFSC Code */}
      <FormInput
        name="bankDetails.ifscCode"
        label={t('suppliers.ifscCode')}
        value={data.bankDetails?.ifscCode || ''}
        onChange={(_, val) => handleNestedChange('ifscCode', val)}
        onBlur={onBlur}
        error={errors['bankDetails.ifscCode']}
        placeholder="HDFC0001234"
        disabled={disabled}
        maxLength={11}
      />

      {/* Account Holder Name */}
      <FormInput
        name="bankDetails.accountHolderName"
        label={t('suppliers.accountHolderName')}
        value={data.bankDetails?.accountHolderName || ''}
        onChange={(_, val) => handleNestedChange('accountHolderName', val)}
        onBlur={onBlur}
        error={errors['bankDetails.accountHolderName']}
        placeholder={t('suppliers.accountHolderNamePlaceholder')}
        disabled={disabled}
        maxLength={100}
      />

      {/* Branch Name */}
      <FormInput
        name="bankDetails.branchName"
        label={t('suppliers.branchName')}
        value={data.bankDetails?.branchName || ''}
        onChange={(_, val) => handleNestedChange('branchName', val)}
        onBlur={onBlur}
        error={errors['bankDetails.branchName']}
        placeholder={t('suppliers.branchNamePlaceholder')}
        disabled={disabled}
        maxLength={100}
      />

      {/* Account Type */}
      <FormSelect
        name="bankDetails.accountType"
        label={t('suppliers.accountType')}
        value={data.bankDetails?.accountType || ''}
        onChange={(_, val) => handleNestedChange('accountType', val)}
        onBlur={onBlur}
        error={errors['bankDetails.accountType']}
        placeholder={t('suppliers.selectAccountType')}
        disabled={disabled}
        options={accountTypeOptions}
      />

      {/* UPI ID */}
      <div className="mt-6 border-t border-border-secondary pt-6">
        <FormInput
          name="upiId"
          label={t('suppliers.upiId')}
          value={data.upiId || ''}
          onChange={onChange}
          onBlur={onBlur}
          error={errors.upiId}
          placeholder="supplier@upi"
          disabled={disabled}
        />
      </div>
    </div>
  )
}