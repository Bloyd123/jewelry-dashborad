// FILE: src/components/scheme/SchemeForm/sections/InstallmentSection.tsx

import { useTranslation } from 'react-i18next'
import { FormInput }  from '@/components/forms/FormInput'
import { FormSelect } from '@/components/forms/FormSelect'
import type { FormSectionProps } from '../SchemeForm.types'

export const InstallmentSection = ({
  data,
  errors,
  onChange,
  onBlur,
  disabled,
}: FormSectionProps) => {
  const { t } = useTranslation()

  const frequencyOptions = [
    { value: 'monthly', label: t('scheme.frequency1.monthly') },
    { value: 'weekly',  label: t('scheme.frequency1.weekly')  },
    { value: 'custom',  label: t('scheme.frequency1.custom')  },
  ]

  const handleInstallmentChange = (field: string, value: any) => {
    onChange('installments', {
      ...data.installments,
      [field]: Number(value),
    })
  }

  const handleDurationChange = (field: string, value: any) => {
    onChange('duration', {
      ...data.duration,
      [field]: Number(value),
    })
  }

  // Auto calculate total installments from duration
  const handleDurationMonthsChange = (_: string, value: any) => {
    const months = Number(value)
    handleDurationChange('months', months)

    // Auto fill totalInstallments if monthly
    if (data.installments?.frequency === 'monthly' || !data.installments?.frequency) {
      onChange('installments', {
        ...data.installments,
        totalInstallments: months,
      })
    }
  }

  return (
    <div className="space-y-4">
      {/* Duration */}
      <div className="grid grid-cols-2 gap-4">
        <FormInput
          name="duration.months"
          label={t('scheme.durationMonths')}
          type="number"
          value={data.duration?.months || ''}
          onChange={(_, value) => handleDurationMonthsChange('months', value)}
          onBlur={() => onBlur?.('duration.months')}
          error={errors['duration.months']}
          placeholder="12"
          required
          disabled={disabled}
          min={1}
        />
        <FormInput
          name="duration.weeks"
          label={t('scheme.durationWeeks')}
          type="number"
          value={data.duration?.weeks || ''}
          onChange={(_, value) => handleDurationChange('weeks', value)}
          onBlur={() => onBlur?.('duration.weeks')}
          error={errors['duration.weeks']}
          placeholder="0"
          disabled={disabled}
          min={0}
        />
      </div>

      {/* Frequency */}
      <FormSelect
        name="installments.frequency"
        label={t('scheme.frequency')}
        value={data.installments?.frequency || 'monthly'}
        onChange={(_, value) =>
          onChange('installments', {
            ...data.installments,
            frequency: value,
          })
        }
        onBlur={() => onBlur?.('installments.frequency')}
        error={errors['installments.frequency']}
        options={frequencyOptions}
        disabled={disabled}
      />

      {/* Amount + Total */}
      <div className="grid grid-cols-2 gap-4">
        <FormInput
          name="installments.installmentAmount"
          label={t('scheme.installmentAmount')}
          type="number"
          value={data.installments?.installmentAmount || ''}
          onChange={(_, value) => handleInstallmentChange('installmentAmount', value)}
          onBlur={() => onBlur?.('installments.installmentAmount')}
          error={errors['installments.installmentAmount']}
          placeholder="1000"
          required
          disabled={disabled}
          min={1}
        />
        <FormInput
          name="installments.totalInstallments"
          label={t('scheme.totalInstallments')}
          type="number"
          value={data.installments?.totalInstallments || ''}
          onChange={(_, value) => handleInstallmentChange('totalInstallments', value)}
          onBlur={() => onBlur?.('installments.totalInstallments')}
          error={errors['installments.totalInstallments']}
          placeholder="12"
          required
          disabled={disabled}
          min={1}
        />
      </div>

      {/* Due Day */}
      <FormInput
        name="installments.dueDay"
        label={t('scheme.dueDay')}
        type="number"
        value={data.installments?.dueDay || ''}
        onChange={(_, value) => handleInstallmentChange('dueDay', value)}
        onBlur={() => onBlur?.('installments.dueDay')}
        error={errors['installments.dueDay']}
        placeholder="1"
        disabled={disabled}
        min={1}
        max={31}
      />

      {/* Maturity Preview */}
      {data.installments?.installmentAmount &&
       data.installments?.totalInstallments && (
        <div className="rounded-lg border border-border-primary bg-bg-tertiary p-4">
          <p className="text-xs text-text-tertiary mb-2">
            {t('scheme.maturityPreview')}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">
              {t('scheme.totalSchemeAmount')}
            </span>
            <span className="text-sm font-semibold text-text-primary">
              ₹{(
                data.installments.installmentAmount *
                data.installments.totalInstallments
              ).toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}