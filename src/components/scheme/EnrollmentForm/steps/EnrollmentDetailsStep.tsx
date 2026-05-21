// FILE: src/components/scheme/EnrollmentForm/steps/EnrollmentDetailsStep.tsx

import { useTranslation } from 'react-i18next'
import { FormInput }      from '@/components/forms/FormInput'
import { FormDatePicker } from '@/components/forms/FormDatePicker'
import { FormTextarea }   from '@/components/forms/FormTextarea'
import type { EnrollmentFormData, EnrollmentFormProps } from '../EnrollmentForm.types'

interface EnrollmentDetailsStepProps {
  scheme:   EnrollmentFormProps['scheme']
  formData: EnrollmentFormData
  errors:   Record<string, string>
  onChange: (field: string, value: any) => void
}

export const EnrollmentDetailsStep: React.FC<EnrollmentDetailsStepProps> = ({
  scheme,
  formData,
  errors,
  onChange,
}) => {
  const { t } = useTranslation()

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency', currency: 'INR', maximumFractionDigits: 0,
    }).format(amount)

  return (
    <div className="space-y-4">
      {/* Scheme Info Card */}
      <div className="rounded-lg border border-border-primary bg-bg-tertiary p-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xs text-text-tertiary">
              {t('scheme.installmentAmount')}
            </p>
            <p className="text-sm font-semibold text-text-primary">
              {formatCurrency(scheme.installments.installmentAmount)}
            </p>
          </div>
          <div>
            <p className="text-xs text-text-tertiary">
              {t('scheme.totalInstallments')}
            </p>
            <p className="text-sm font-semibold text-text-primary">
              {scheme.installments.totalInstallments}
            </p>
          </div>
          <div>
            <p className="text-xs text-text-tertiary">
              {t('scheme.frequency')}
            </p>
            <p className="text-sm font-semibold text-text-primary capitalize">
              {scheme.installments.frequency}
            </p>
          </div>
        </div>
      </div>

      {/* Installment Amount */}
      <FormInput
        name="installmentAmount"
        label={t('scheme.enrollment.installmentAmount')}
        type="number"
        value={formData.installmentAmount || ''}
        onChange={(_, value) => onChange('installmentAmount', Number(value))}
        error={errors.installmentAmount}
        placeholder={String(scheme.installments.installmentAmount)}
        min={1}
        required
      />

      {/* Start Date */}
      <FormDatePicker
        name="startDate"
        label={t('scheme.enrollment.startDate')}
        value={formData.startDate || ''}
        onChange={(_, value) => onChange('startDate', value)}
        error={errors.startDate}
        placeholder={t('common.selectDate')}
        required
      />

      {/* Notes */}
      <FormTextarea
        name="notes"
        label={t('scheme.enrollment.notes')}
        value={formData.notes || ''}
        onChange={(_, value) => onChange('notes', value)}
        error={errors.notes}
        placeholder={t('scheme.enrollment.notesPlaceholder')}
        rows={2}
        maxLength={500}
      />
    </div>
  )
}