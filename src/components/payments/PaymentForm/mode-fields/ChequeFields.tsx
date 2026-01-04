// FILE: src/components/payment/PaymentForm/mode-fields/ChequeFields.tsx
// Cheque Payment Mode Fields

import { useTranslation } from 'react-i18next'
import { FormInput } from '@/components/forms/FormInput/FormInput'
import { FormDatePicker } from '@/components/forms/FormDatePicker/FormDatePicker'
import { AlertTriangle } from 'lucide-react'
import type { FormSectionProps } from '../PaymentForm.types'
import { useEffect } from 'react'

export const ChequeFields = ({
  data,
  errors,
  onChange,
  onBlur,
  disabled = false,
}: FormSectionProps) => {
  const { t } = useTranslation()

  // Auto-calculate expected clearance date (+3 working days)
  useEffect(() => {
    if (data.chequeDate && !data.expectedClearanceDate) {
      const chequeDate = new Date(data.chequeDate)
      const clearanceDate = new Date(chequeDate)
      clearanceDate.setDate(clearanceDate.getDate() + 3)
      onChange('expectedClearanceDate', clearanceDate.toISOString())
    }
  }, [data.chequeDate])

  return (
    <div className="space-y-4">
      {/* Warning Alert */}
      <div className="bg-status-warning/10 flex items-start gap-2 rounded-lg p-3 text-status-warning">
        <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0" />
        <div className="text-sm">
          <p className="font-semibold">{t('payment.important')}</p>
          <p>{t('payment.chequePendingClearanceNote')}</p>
        </div>
      </div>

      {/* Cheque Number */}
      <FormInput
        name="chequeNumber"
        label={t('payment.chequeNumber')}
        type="text"
        value={data.chequeNumber || ''}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.chequeNumber}
        placeholder="456789"
        disabled={disabled}
        required
        minLength={6}
        maxLength={20}
      />

      {/* Cheque Date */}
      <FormDatePicker
        name="chequeDate"
        label={t('payment.chequeDate')}
        value={data.chequeDate || ''}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.chequeDate}
        required
        disabled={disabled}
        maxDate={new Date()}
      />

      {/* Bank Name */}
      <FormInput
        name="chequeBankName"
        label={t('payment.bankName')}
        type="text"
        value={data.chequeBankName || ''}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.chequeBankName}
        placeholder="State Bank of India"
        disabled={disabled}
      />

      {/* Branch Name */}
      <FormInput
        name="chequeBranchName"
        label={t('payment.branchName')}
        type="text"
        value={data.chequeBranchName || ''}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.chequeBranchName}
        placeholder="Mumbai Main Branch"
        disabled={disabled}
      />

      {/* IFSC Code */}
      <div className="space-y-2">
        <FormInput
          name="chequeIfscCode"
          label={t('payment.ifscCode')}
          type="text"
          value={data.chequeIfscCode || ''}
          onChange={onChange}
          onBlur={onBlur}
          error={errors.chequeIfscCode}
          placeholder="SBIN0001234"
          disabled={disabled}
          maxLength={11}
        />
        <p className="text-xs text-text-tertiary">
          {t('payment.ifscCodeFormat')}
        </p>
      </div>

      {/* Account Number */}
      <FormInput
        name="chequeAccountNumber"
        label={t('payment.accountNumber')}
        type="text"
        value={data.chequeAccountNumber || ''}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.chequeAccountNumber}
        placeholder="12345678901234"
        disabled={disabled}
      />

      {/* Expected Clearance Date */}
      <div className="space-y-2">
        <FormDatePicker
          name="expectedClearanceDate"
          label={t('payment.expectedClearanceDate')}
          value={data.expectedClearanceDate || ''}
          onChange={onChange}
          onBlur={onBlur}
          error={errors.expectedClearanceDate}
          disabled={disabled}
          minDate={new Date()}
        />
        <p className="text-xs text-text-tertiary">
          {t('payment.autoClearanceDateNote')}
        </p>
      </div>

      {/* Reminder Note */}
      <div className="bg-status-info/10 rounded-lg p-3 text-sm text-status-info">
        📌 {t('payment.clearanceReminderNote')}
      </div>
    </div>
  )
}
