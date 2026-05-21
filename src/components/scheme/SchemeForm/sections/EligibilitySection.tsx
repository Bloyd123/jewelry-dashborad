// FILE: src/components/scheme/SchemeForm/sections/EligibilitySection.tsx

import { useTranslation } from 'react-i18next'
import { FormInput }  from '@/components/forms/FormInput'
import type { FormSectionProps } from '../SchemeForm.types'
import {Button} from '@/components/ui/button'
export const EligibilitySection = ({
  data,
  errors,
  onChange,
  onBlur,
  disabled,
}: FormSectionProps) => {
  const { t } = useTranslation()

  const handleEligibilityChange = (field: string, value: any) => {
    onChange('eligibility', {
      ...data.eligibility,
      [field]: value,
    })
  }

  const requiresKYC = data.eligibility?.requiresKYC ?? true

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormInput
          name="eligibility.minAge"
          label={t('scheme.eligibility.minAge')}
          type="number"
          value={data.eligibility?.minAge ?? 18}
          onChange={(_, value) =>
            handleEligibilityChange('minAge', Number(value))
          }
          onBlur={() => onBlur?.('eligibility.minAge')}
          error={errors['eligibility.minAge']}
          placeholder="18"
          disabled={disabled}
          min={0}
          max={120}
        />

        <FormInput
          name="eligibility.maxAge"
          label={t('scheme.eligibility.maxAge')}
          type="number"
          value={data.eligibility?.maxAge || ''}
          onChange={(_, value) =>
            handleEligibilityChange('maxAge', value ? Number(value) : null)
          }
          onBlur={() => onBlur?.('eligibility.maxAge')}
          error={errors['eligibility.maxAge']}
          placeholder={t('scheme.eligibility.noLimit')}
          disabled={disabled}
          min={0}
          max={120}
        />
      </div>

      <FormInput
        name="eligibility.minInstallmentAmount"
        label={t('scheme.eligibility.minInstallmentAmount')}
        type="number"
        value={data.eligibility?.minInstallmentAmount ?? 0}
        onChange={(_, value) =>
          handleEligibilityChange('minInstallmentAmount', Number(value))
        }
        onBlur={() => onBlur?.('eligibility.minInstallmentAmount')}
        error={errors['eligibility.minInstallmentAmount']}
        placeholder="0"
        disabled={disabled}
        min={0}
      />

      {/* KYC Toggle */}
      <div className="flex items-center gap-3">
  <Button
  type="button"
  variant="ghost"
  size="icon"
  onClick={() => handleEligibilityChange('requiresKYC', !requiresKYC)}
  disabled={disabled}
  className={`
    relative h-6 w-11 rounded-full transition-colors p-0
    ${requiresKYC ? 'bg-accent hover:bg-accent/90' : 'bg-bg-tertiary border border-border-primary hover:bg-bg-tertiary'}
  `}
>
  <span
    className={`
      absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform
      ${requiresKYC ? 'translate-x-5' : 'translate-x-0.5'}
    `}
  />
</Button>
        <div>
          <label className="text-sm font-medium text-text-primary">
            {t('scheme.eligibility.requiresKYC')}
          </label>
          <p className="text-xs text-text-tertiary">
            {t('scheme.eligibility.requiresKYCDesc')}
          </p>
        </div>
      </div>
    </div>
  )
}