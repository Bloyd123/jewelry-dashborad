// ============================================================================
// FILE: src/components/supplier/SupplierManagementModal/sections/UpdateBalanceSection.tsx
// Update Supplier Balance Section
// ============================================================================

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FormInput } from '@/components/forms/FormInput/FormInput'
import { FormSelect } from '@/components/forms/FormSelect/FormSelect'
import { FormTextarea } from '@/components/forms/FormTextarea/FormTextarea'
import { Button } from '@/components/ui/button'
import {
  Loader2,
  Save,
  X,
  IndianRupee,
  TrendingUp,
  TrendingDown,
} from 'lucide-react'
import type {
  UpdateBalanceSectionProps,
  BalanceUpdateType,
} from '../SupplierManagementModal.types'

const balanceTypeOptions = [
  { value: 'payment', label: 'Payment (Reduces Due)' },
  { value: 'purchase', label: 'Purchase (Increases Due)' },
  { value: 'adjustment', label: 'Manual Adjustment' },
]

export const UpdateBalanceSection = ({
  supplier,
  onSubmit,
  onCancel,
}: UpdateBalanceSectionProps) => {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    type: 'payment' as BalanceUpdateType,
    amount: 0,
    note: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Calculate new balance preview
  const calculateNewBalance = () => {
    const currentBalance = supplier.currentBalance
    const amount = formData.amount

    if (formData.type === 'payment') {
      return currentBalance - amount // Payment reduces due (negative becomes less negative)
    } else if (formData.type === 'purchase') {
      return currentBalance + amount // Purchase increases due (more negative)
    } else {
      return currentBalance + amount // Adjustment can be + or -
    }
  }

  const newBalance = calculateNewBalance()
  const availableCredit = supplier.creditLimit - Math.abs(newBalance)

  const handleChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = t('suppliers.balance.amountRequired')
    }

    if (
      formData.type === 'payment' &&
      formData.amount > Math.abs(supplier.currentBalance)
    ) {
      newErrors.amount = t('suppliers.balance.paymentExceedsDue')
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return

    setIsLoading(true)
    try {
      await onSubmit(formData)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Current Balance Info */}
      <div className="rounded-lg border border-border-primary bg-bg-tertiary p-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-text-tertiary">
              {t('suppliers.balance.currentBalance')}
            </p>
            <p className="mt-1 text-lg font-semibold text-status-error">
              {supplier.currentBalance < 0 ? '-' : ''}₹
              {Math.abs(supplier.currentBalance).toLocaleString('en-IN')}
            </p>
            <p className="text-xs text-text-tertiary">
              {supplier.currentBalance < 0
                ? t('suppliers.balance.due')
                : t('suppliers.balance.advance')}
            </p>
          </div>

          <div>
            <p className="text-text-tertiary">
              {t('suppliers.balance.creditLimit')}
            </p>
            <p className="mt-1 text-lg font-semibold text-text-primary">
              ₹{supplier.creditLimit.toLocaleString('en-IN')}
            </p>
            <p className="text-xs text-text-tertiary">
              {t('suppliers.balance.available')}: ₹
              {availableCredit.toLocaleString('en-IN')}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="space-y-4">
        {/* Transaction Type */}
        <FormSelect
          name="type"
          label={t('suppliers.balance.transactionType')}
          value={formData.type}
          onChange={handleChange}
          error={errors.type}
          options={balanceTypeOptions}
          required
          disabled={isLoading}
        />

        {/* Amount */}
        <FormInput
          name="amount"
          label={t('suppliers.balance.amount')}
          type="number"
          value={formData.amount}
          onChange={handleChange}
          error={errors.amount}
          placeholder="200000"
          required
          disabled={isLoading}
        />

        {/* Note */}
        <FormTextarea
          name="note"
          label={t('suppliers.balance.note')}
          value={formData.note}
          onChange={handleChange}
          error={errors.note}
          placeholder={t('suppliers.balance.notePlaceholder')}
          disabled={isLoading}
          rows={3}
          maxLength={200}
        />

        {/* New Balance Preview */}
        <div className="border-accent/20 bg-accent/5 rounded-lg border-2 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-tertiary">
                {t('suppliers.balance.newBalancePreview')}
              </p>
              <p className="mt-1 text-2xl font-bold text-text-primary">
                {newBalance < 0 ? '-' : '+'}₹
                {Math.abs(newBalance).toLocaleString('en-IN')}
              </p>
              <p className="mt-1 text-xs text-text-tertiary">
                {newBalance < 0
                  ? t('suppliers.balance.due')
                  : t('suppliers.balance.advance')}
              </p>
            </div>

            <div>
              {formData.type === 'payment' ? (
                <TrendingDown className="h-10 w-10 text-status-success" />
              ) : (
                <TrendingUp className="h-10 w-10 text-status-warning" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onCancel} disabled={isLoading}>
          <X className="mr-2 h-4 w-4" />
          {t('common.cancel')}
        </Button>

        <Button onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('common.updating')}
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {t('suppliers.balance.updateBalance')}
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
