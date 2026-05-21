// FILE: src/components/scheme/EnrollmentForm/steps/InitialPaymentStep.tsx

import { useTranslation } from 'react-i18next'
import { FormInput }      from '@/components/forms/FormInput'
import { FormSelect }     from '@/components/forms/FormSelect'
import { ToggleSwitch }   from '@/components/ui/ToggleSwitch'
import type { EnrollmentFormData, EnrollmentFormProps } from '../EnrollmentForm.types'

interface InitialPaymentStepProps {
  scheme:   EnrollmentFormProps['scheme']
  formData: EnrollmentFormData
  errors:   Record<string, string>
  onChange: (field: string, value: any) => void
}

export const InitialPaymentStep: React.FC<InitialPaymentStepProps> = ({
  scheme,
  formData,
  errors,
  onChange,
}) => {
  const { t } = useTranslation()

  const paymentModeOptions = [
    { value: 'cash',          label: t('common.paymentMode.cash')         },
    { value: 'card',          label: t('common.paymentMode.card')         },
    { value: 'upi',           label: t('common.paymentMode.upi')          },
    { value: 'cheque',        label: t('common.paymentMode.cheque')       },
    { value: 'bank_transfer', label: t('common.paymentMode.bankTransfer') },
  ]

  const handlePaymentChange = (field: string, value: any) => {
    onChange('initialPayment', {
      ...formData.initialPayment,
      [field]: value,
    })
  }

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency', currency: 'INR', maximumFractionDigits: 0,
    }).format(amount)

  return (
    <div className="space-y-4">
      <p className="text-sm text-text-secondary">
        {t('scheme.enrollment.initialPaymentDesc')}
      </p>

      {/* Toggle */}
      <div className="flex items-center gap-3">
        <ToggleSwitch
          checked={formData.hasInitialPayment}
          onChange={() => {
            onChange('hasInitialPayment', !formData.hasInitialPayment)
            if (!formData.hasInitialPayment) {
              onChange('initialPayment', {
                amount:      scheme.installments.installmentAmount,
                paymentMode: 'cash',
              })
            } else {
              onChange('initialPayment', undefined)
            }
          }}
        />
        <div>
          <label className="text-sm font-medium text-text-primary">
            {t('scheme.enrollment.addInitialPayment')}
          </label>
          <p className="text-xs text-text-tertiary">
            {t('scheme.enrollment.addInitialPaymentDesc')}
          </p>
        </div>
      </div>

      {/* Payment Fields */}
      {formData.hasInitialPayment && (
        <div className="space-y-4 rounded-lg border border-border-primary bg-bg-tertiary p-4">
          <FormInput
            name="initialPayment.amount"
            label={t('scheme.payment.amount')}
            type="number"
            value={formData.initialPayment?.amount || ''}
            onChange={(_, value) => handlePaymentChange('amount', Number(value))}
            error={errors['initialPayment.amount']}
            placeholder={String(scheme.installments.installmentAmount)}
            min={1}
            required
          />

          <FormSelect
            name="initialPayment.paymentMode"
            label={t('scheme.payment.paymentMode')}
            value={formData.initialPayment?.paymentMode || 'cash'}
            onChange={(_, value) => handlePaymentChange('paymentMode', value)}
            error={errors['initialPayment.paymentMode']}
            options={paymentModeOptions}
            required
          />

          {/* Summary */}
          {formData.initialPayment?.amount && (
            <div className="rounded-lg border border-status-success/30 bg-status-success/10 p-3">
              <p className="text-xs text-text-tertiary">
                {t('scheme.enrollment.paymentSummary')}
              </p>
              <p className="mt-1 text-sm font-semibold text-status-success">
                {formatCurrency(formData.initialPayment.amount)}{' '}
                via {formData.initialPayment.paymentMode}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Skip Info */}
      {!formData.hasInitialPayment && (
        <div className="rounded-lg border border-border-primary bg-bg-tertiary p-4">
          <p className="text-xs text-text-tertiary">
            💡 {t('scheme.enrollment.skipPaymentTip')}
          </p>
        </div>
      )}
    </div>
  )
}