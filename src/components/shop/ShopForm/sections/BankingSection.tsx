// ============================================================================
// FILE: src/components/shop/ShopForm/sections/BankingSection.tsx
// Banking Details Section
// ============================================================================

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FormInput } from '@/components/forms/FormInput/FormInput'
import { FormSelect } from '@/components/forms/FormSelect/FormSelect'
import { FormSwitch } from '@/components/forms/FormSwitch/FormSwitch'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, Star } from 'lucide-react'
import type { FormSectionProps, BankDetailFormData } from '../shopForm.types'
import type { BankDetail } from '@/types'

export const BankingSection = ({
  data,
  errors,
  onChange,
  disabled,
}: FormSectionProps) => {
  const { t } = useTranslation()
  const [bankDetails, setBankDetails] = useState<BankDetail[]>(
    data.bankDetails || []
  )

  const accountTypeOptions = [
    { value: 'savings', label: t('shops.form.accountType.savings') },
    { value: 'current', label: t('shops.form.accountType.current') },
  ]

  const handleAddBank = () => {
    const newBank: BankDetail = {
      bankName: '',
      accountNumber: '',
      ifscCode: '',
      accountHolderName: '',
      accountType: 'current',
      isPrimary: bankDetails.length === 0,
      isActive: true,
    }
    const updated = [...bankDetails, newBank]
    setBankDetails(updated)
    onChange('bankDetails', updated)
  }

  const handleRemoveBank = (index: number) => {
    const updated = bankDetails.filter((_, i) => i !== index)
    setBankDetails(updated)
    onChange('bankDetails', updated)
  }

  const handleBankChange = (index: number, field: string, value: any) => {
    const updated = bankDetails.map((bank, i) => {
      if (i === index) {
        // If setting isPrimary to true, set all others to false
        if (field === 'isPrimary' && value === true) {
          setBankDetails(
            bankDetails.map((b, idx) => ({
              ...b,
              isPrimary: idx === index,
            }))
          )
          return { ...bank, isPrimary: true }
        }
        return { ...bank, [field]: value }
      }
      return bank
    })
    setBankDetails(updated)
    onChange('bankDetails', updated)
  }

  return (
    <div className="space-y-4">
      {/* Bank Details List */}
      {bankDetails.map((bank, index) => (
        <div
          key={index}
          className="space-y-4 rounded-lg border border-border-primary bg-bg-tertiary p-4"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <h4 className="flex items-center gap-2 font-medium text-text-primary">
              {t('shops.form.bankAccount')} {index + 1}
              {bank.isPrimary && (
                <Star className="h-4 w-4 fill-accent text-accent" />
              )}
            </h4>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleRemoveBank(index)}
              disabled={disabled}
              className="hover:bg-status-error/10 text-status-error"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Bank Name */}
          <FormInput
            name={`bankDetails.${index}.bankName`}
            label={t('shops.form.bankName')}
            value={bank.bankName}
            onChange={(_, value) => handleBankChange(index, 'bankName', value)}
            error={errors[`bankDetails.${index}.bankName`]}
            placeholder="HDFC Bank"
            required
            disabled={disabled}
          />

          {/* Account Holder Name */}
          <FormInput
            name={`bankDetails.${index}.accountHolderName`}
            label={t('shops.form.accountHolderName')}
            value={bank.accountHolderName}
            onChange={(_, value) =>
              handleBankChange(index, 'accountHolderName', value)
            }
            error={errors[`bankDetails.${index}.accountHolderName`]}
            placeholder={t('shops.form.accountHolderNamePlaceholder')}
            required
            disabled={disabled}
          />

          {/* Account Number & IFSC */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormInput
              name={`bankDetails.${index}.accountNumber`}
              label={t('shops.form.accountNumber')}
              value={bank.accountNumber}
              onChange={(_, value) =>
                handleBankChange(index, 'accountNumber', value)
              }
              error={errors[`bankDetails.${index}.accountNumber`]}
              placeholder="50100123456789"
              required
              disabled={disabled}
            />

            <FormInput
              name={`bankDetails.${index}.ifscCode`}
              label={t('shops.form.ifscCode')}
              value={bank.ifscCode}
              onChange={(_, value) =>
                handleBankChange(index, 'ifscCode', String(value).toUpperCase())
              }
              error={errors[`bankDetails.${index}.ifscCode`]}
              placeholder="HDFC0001234"
              required
              disabled={disabled}
              maxLength={11}
            />
          </div>

          {/* Branch & Account Type */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormInput
              name={`bankDetails.${index}.branchName`}
              label={t('shops.form.branchName')}
              value={bank.branchName || ''}
              onChange={(_, value) =>
                handleBankChange(index, 'branchName', value)
              }
              error={errors[`bankDetails.${index}.branchName`]}
              placeholder="MG Road Branch"
              disabled={disabled}
            />

            <FormSelect
              name={`bankDetails.${index}.accountType`}
              label={t('shops.form.accountType.label')}
              value={bank.accountType || 'current'}
              onChange={(_, value) =>
                handleBankChange(index, 'accountType', value)
              }
              error={errors[`bankDetails.${index}.accountType`]}
              options={accountTypeOptions}
              disabled={disabled}
            />
          </div>

          {/* Primary Toggle */}
          <FormSwitch
            name={`bankDetails.${index}.isPrimary`}
            label={t('shops.form.primaryAccount')}
            description={t('shops.form.primaryAccountDescription')}
            checked={bank.isPrimary || false}
            onChange={(_, checked) =>
              handleBankChange(index, 'isPrimary', checked)
            }
            disabled={disabled}
          />
        </div>
      ))}

      {/* Add Bank Button */}
      <Button
        type="button"
        variant="outline"
        onClick={handleAddBank}
        disabled={disabled}
        className="w-full border-border-primary text-text-primary hover:bg-bg-tertiary"
      >
        <Plus className="mr-2 h-4 w-4" />
        {t('shops.form.addBankAccount')}
      </Button>
    </div>
  )
}
