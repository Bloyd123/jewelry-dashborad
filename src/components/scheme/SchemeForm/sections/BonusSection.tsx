// FILE: src/components/scheme/SchemeForm/sections/BonusSection.tsx

import { useTranslation } from 'react-i18next'
import { FormSelect }   from '@/components/forms/FormSelect'
import { FormInput }    from '@/components/forms/FormInput'
import { FormTextarea } from '@/components/forms/FormTextarea'
import type { FormSectionProps } from '../SchemeForm.types'

export const BonusSection = ({
  data,
  errors,
  onChange,
  onBlur,
  disabled,
}: FormSectionProps) => {
  const { t } = useTranslation()

  const bonusTypeOptions = [
    { value: 'percentage',  label: t('scheme.bonus.percentage')  },
    { value: 'flat_amount', label: t('scheme.bonus.flatAmount')  },
    { value: 'free_making', label: t('scheme.bonus.freeMaking')  },
    { value: 'discount',    label: t('scheme.bonus.discount')    },
  ]

  const handleBonusChange = (field: string, value: any) => {
    onChange('bonus', {
      ...data.bonus,
      [field]: value,
    })
  }

  const hasBonus = data.bonus?.hasBonus || false

  return (
    <div className="space-y-4">
      {/* Toggle */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => handleBonusChange('hasBonus', !hasBonus)}
          disabled={disabled}
          className={`
            relative h-6 w-11 rounded-full transition-colors
            ${hasBonus ? 'bg-accent' : 'bg-bg-tertiary border border-border-primary'}
          `}
        >
          <span
            className={`
              absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform
              ${hasBonus ? 'translate-x-5' : 'translate-x-0.5'}
            `}
          />
        </button>
        <label className="text-sm font-medium text-text-primary">
          {t('scheme.bonus.hasBonus')}
        </label>
      </div>

      {hasBonus && (
        <>
          <FormSelect
            name="bonus.bonusType"
            label={t('scheme.bonus.bonusType')}
            value={data.bonus?.bonusType || 'percentage'}
            onChange={(_, value) => handleBonusChange('bonusType', value)}
            onBlur={() => onBlur?.('bonus.bonusType')}
            error={errors['bonus.bonusType']}
            options={bonusTypeOptions}
            disabled={disabled}
          />

          <FormInput
            name="bonus.bonusValue"
            label={
              data.bonus?.bonusType === 'percentage'
                ? t('scheme.bonus.bonusPercentage')
                : t('scheme.bonus.bonusAmount')
            }
            type="number"
            value={data.bonus?.bonusValue || ''}
            onChange={(_, value) => handleBonusChange('bonusValue', Number(value))}
            onBlur={() => onBlur?.('bonus.bonusValue')}
            error={errors['bonus.bonusValue']}
            placeholder={
              data.bonus?.bonusType === 'percentage' ? '5' : '500'
            }
            disabled={disabled}
            min={0}
          />

          <FormTextarea
            name="bonus.bonusDescription"
            label={t('scheme.bonus.bonusDescription')}
            value={data.bonus?.bonusDescription || ''}
            onChange={(_, value) => handleBonusChange('bonusDescription', value)}
            onBlur={() => onBlur?.('bonus.bonusDescription')}
            error={errors['bonus.bonusDescription']}
            placeholder={t('scheme.bonus.bonusDescriptionPlaceholder')}
            disabled={disabled}
            rows={2}
          />

          {/* Bonus Preview */}
          {data.installments?.installmentAmount &&
           data.installments?.totalInstallments &&
           data.bonus?.bonusValue && (
            <div className="rounded-lg border border-status-success/30 bg-status-success/10 p-4">
              <p className="text-xs text-text-tertiary mb-2">
                {t('scheme.bonus.bonusPreview')}
              </p>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">
                    {t('scheme.totalSchemeAmount')}
                  </span>
                  <span className="font-medium text-text-primary">
                    ₹{(
                      data.installments.installmentAmount *
                      data.installments.totalInstallments
                    ).toLocaleString('en-IN')}
                  </span>
                </div>
                {data.bonus?.bonusType === 'percentage' && (
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">
                      {t('scheme.bonus.bonusAmount')}
                    </span>
                    <span className="font-medium text-status-success">
                      +₹{(
                        (data.installments.installmentAmount *
                          data.installments.totalInstallments *
                          data.bonus.bonusValue) /
                        100
                      ).toLocaleString('en-IN')}
                    </span>
                  </div>
                )}
                {data.bonus?.bonusType === 'flat_amount' && (
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">
                      {t('scheme.bonus.bonusAmount')}
                    </span>
                    <span className="font-medium text-status-success">
                      +₹{data.bonus.bonusValue.toLocaleString('en-IN')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}