// FILE: src/components/openingBalance/sections/CashBalanceSection.tsx

import { useTranslation } from 'react-i18next'
import { Plus, Trash2, Banknote, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FormInput } from '@/components/forms/FormInput/FormInput'
import type { CashBalance, BankAccount } from '@/types/openingBalance.types'

interface CashBalanceSectionProps {
  data: Partial<CashBalance>
  errors: Record<string, string>
  onChange: (data: Partial<CashBalance>) => void
  disabled?: boolean
}

export const CashBalanceSection = ({
  data,
  errors,
  onChange,
  disabled = false,
}: CashBalanceSectionProps) => {
  const { t } = useTranslation()

  const banks = data.bank || []
  const totalBank = banks.reduce((sum, b) => sum + (Number(b.balance) || 0), 0)
  const totalCash = Number(data.cash) || 0
  const grandTotal = totalCash + totalBank

  const handleCashChange = (_: string, value: string | number) => {
    onChange({ ...data, cash: Number(value) || 0 })
  }

  const handleAddBank = () => {
    onChange({
      ...data,
      bank: [...banks, { bankName: '', accountNumber: '', balance: 0 }],
    })
  }

  const handleRemoveBank = (index: number) => {
    const newBanks = banks.filter((_, i) => i !== index)
    onChange({ ...data, bank: newBanks })
  }

  const handleBankChange = (index: number, field: keyof BankAccount, value: string | number) => {
    const newBanks = banks.map((b, i) =>
      i === index ? { ...b, [field]: field === 'balance' ? Number(value) || 0 : value } : b
    )
    onChange({ ...data, bank: newBanks })
  }

  return (
    <div className="space-y-6">
      {/* Cash Balance */}
      <div className="rounded-lg border border-border-secondary bg-bg-tertiary p-4">
        <div className="mb-3 flex items-center gap-2">
          <Banknote className="h-4 w-4 text-accent" />
          <h4 className="font-medium text-text-primary">
            {t('openingBalance.cash.cashInHand')}
          </h4>
        </div>
        <FormInput
          name="cashBalance.cash"
          label={t('openingBalance.cash.amount')}
          type="number"
          value={data.cash || ''}
          onChange={handleCashChange}
          error={errors['cashBalance.cash']}
          placeholder="0"
          disabled={disabled}
          min={0}
        />
      </div>

      {/* Bank Accounts */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-accent" />
            <h4 className="font-medium text-text-primary">
              {t('openingBalance.cash.bankAccounts')}
            </h4>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddBank}
            disabled={disabled}
            className="gap-1"
          >
            <Plus className="h-3 w-3" />
            {t('openingBalance.cash.addBank')}
          </Button>
        </div>

        {banks.length === 0 && (
          <div className="rounded-lg border border-dashed border-border-primary p-6 text-center">
            <p className="text-sm text-text-tertiary">
              {t('openingBalance.cash.noBanks')}
            </p>
          </div>
        )}

        {banks.map((bank, index) => (
          <div
            key={index}
            className="rounded-lg border border-border-secondary bg-bg-secondary p-4"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium text-text-secondary">
                {t('openingBalance.cash.bank')} {index + 1}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveBank(index)}
                disabled={disabled}
                className="h-7 w-7 text-status-error hover:bg-status-error/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <FormInput
                name={`bank.${index}.bankName`}
                label={t('openingBalance.cash.bankName')}
                value={bank.bankName}
                onChange={(_, val) => handleBankChange(index, 'bankName', val)}
                error={errors[`cashBalance.bank.${index}.bankName`]}
                placeholder="SBI, HDFC..."
                disabled={disabled}
              />
              <FormInput
                name={`bank.${index}.accountNumber`}
                label={t('openingBalance.cash.accountNumber')}
                value={bank.accountNumber || ''}
                onChange={(_, val) => handleBankChange(index, 'accountNumber', val)}
                placeholder="XXXX XXXX"
                disabled={disabled}
              />
              <FormInput
                name={`bank.${index}.balance`}
                label={t('openingBalance.cash.balance')}
                type="number"
                value={bank.balance || ''}
                onChange={(_, val) => handleBankChange(index, 'balance', val)}
                error={errors[`cashBalance.bank.${index}.balance`]}
                placeholder="0"
                disabled={disabled}
                min={0}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Total Summary */}
      <div className="rounded-lg border border-accent/20 bg-accent/5 p-4">
        <div className="space-y-1 text-sm">
          <div className="flex justify-between text-text-secondary">
            <span>{t('openingBalance.cash.cashInHand')}</span>
            <span>₹{totalCash.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between text-text-secondary">
            <span>{t('openingBalance.cash.totalBank')}</span>
            <span>₹{totalBank.toLocaleString('en-IN')}</span>
          </div>
          <div className="mt-2 flex justify-between border-t border-border-secondary pt-2 font-semibold text-text-primary">
            <span>{t('openingBalance.cash.grandTotal')}</span>
            <span className="text-accent">₹{grandTotal.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>
    </div>
  )
}