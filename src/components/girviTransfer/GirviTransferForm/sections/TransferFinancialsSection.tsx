// FILE: src/components/girviTransfer/GirviTransferForm/sections/TransferFinancialsSection.tsx

import { useTranslation } from 'react-i18next'
import { FormInput }      from '@/components/forms/FormInput/FormInput'
import { FormSelect }     from '@/components/forms/FormSelect/FormSelect'
import { FormDatePicker } from '@/components/forms/FormDatePicker/FormDatePicker'
import { FormTextarea }   from '@/components/forms/FormTextarea/FormTextarea'
import { Label }          from '@/components/ui/label'
import type { FormSectionProps } from '../GirviTransferForm.types'

export const TransferFinancialsSection = ({
  data,
  errors,
  onChange,
  onBlur,
  disabled,
}: FormSectionProps) => {
  const { t } = useTranslation()

  const interestTypeOptions = [
    { value: 'simple',   label: t('girviTransfer.interestType.simple',   'Simple') },
    { value: 'compound', label: t('girviTransfer.interestType.compound', 'Compound') },
  ]

  const paymentModeOptions = [
    { value: 'cash',          label: t('girviTransfer.paymentMode.cash',         'Cash') },
    { value: 'upi',           label: t('girviTransfer.paymentMode.upi',          'UPI') },
    { value: 'bank_transfer', label: t('girviTransfer.paymentMode.bankTransfer', 'Bank Transfer') },
    { value: 'cheque',        label: t('girviTransfer.paymentMode.cheque',       'Cheque') },
  ]

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border-primary bg-bg-tertiary p-4">
        <h3 className="mb-3 text-sm font-semibold text-text-primary">
          {t('girviTransfer.financials.title', 'Transfer Financials')}
        </h3>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">

          {/* Transfer Date */}
          <FormDatePicker
            name="transferDate"
            label={t('girviTransfer.financials.transferDate', 'Transfer Date')}
            value={data.transferDate || ''}
            onChange={onChange}
            onBlur={onBlur}
            error={errors.transferDate}
            required
            disabled={disabled}
          />

          {/* Party Principal Amount */}
          <FormInput
            name="partyPrincipalAmount"
            label={t('girviTransfer.financials.partyPrincipal', 'Amount Received from Party (₹)')}
            type="number"
            value={data.partyPrincipalAmount || 0}
            onChange={(name, value) => onChange(name, Number(value) || 0)}
            onBlur={onBlur}
            error={errors.partyPrincipalAmount}
            required
            disabled={disabled}
            placeholder="50000"
          />

          {/* Our Interest Till Transfer */}
          <FormInput
            name="ourInterestTillTransfer"
            label={t('girviTransfer.financials.ourInterest', 'Our Interest Till Transfer (₹)')}
            type="number"
            value={data.ourInterestTillTransfer || 0}
            onChange={(name, value) => onChange(name, Number(value) || 0)}
            onBlur={onBlur}
            disabled={disabled}
            placeholder="0"
          />

          {/* Our Interest Type */}
          <FormSelect
            name="ourInterestType"
            label={t('girviTransfer.financials.ourInterestType', 'Our Interest Type')}
            value={data.ourInterestType || 'simple'}
            onChange={onChange}
            onBlur={onBlur}
            options={interestTypeOptions}
            disabled={disabled}
          />

          {/* Transfer Amount */}
          <FormInput
            name="transferAmount"
            label={t('girviTransfer.financials.transferAmount', 'Transfer Settlement Amount (₹)')}
            type="number"
            value={data.transferAmount || 0}
            onChange={(name, value) => onChange(name, Number(value) || 0)}
            onBlur={onBlur}
            disabled={disabled}
            placeholder="0"
          />

          {/* Commission */}
          <FormInput
            name="commission"
            label={t('girviTransfer.financials.commission', 'Commission (₹)')}
            type="number"
            value={data.commission || 0}
            onChange={(name, value) => onChange(name, Number(value) || 0)}
            onBlur={onBlur}
            disabled={disabled}
            placeholder="0"
          />

          {/* Payment Mode */}
          <FormSelect
            name="paymentMode"
            label={t('girviTransfer.financials.paymentMode', 'Payment Mode')}
            value={data.paymentMode || 'cash'}
            onChange={onChange}
            onBlur={onBlur}
            options={paymentModeOptions}
            disabled={disabled}
          />

          {/* Transaction Reference */}
          <FormInput
            name="transactionReference"
            label={t('girviTransfer.financials.transactionRef', 'Transaction Reference')}
            value={data.transactionReference || ''}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            placeholder="UPI ID / Cheque No."
          />
        </div>

        {/* Notes */}
        <div className="mt-3">
          <FormTextarea
            name="notes"
            label={t('girviTransfer.financials.notes', 'Notes')}
            value={data.notes || ''}
            onChange={onChange}
            onBlur={onBlur}
            rows={2}
            disabled={disabled}
            placeholder={t('girviTransfer.financials.notesPlaceholder', 'Any additional notes...')}
          />
        </div>
      </div>
    </div>
  )
}