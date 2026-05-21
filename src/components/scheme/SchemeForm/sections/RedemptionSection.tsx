// FILE: src/components/scheme/SchemeForm/sections/RedemptionSection.tsx

import { useTranslation } from 'react-i18next'
import { FormInput }  from '@/components/forms/FormInput'
import { FormSelect } from '@/components/forms/FormSelect'
import type { FormSectionProps } from '../SchemeForm.types'
import {Button} from "@/components/ui/button"
export const RedemptionSection = ({
  data,
  errors,
  onChange,
  onBlur,
  disabled,
}: FormSectionProps) => {
  const { t } = useTranslation()

  const penaltyTypeOptions = [
    { value: 'none',       label: t('scheme.redemption.penaltyNone')       },
    { value: 'percentage', label: t('scheme.redemption.penaltyPercentage') },
    { value: 'flat',       label: t('scheme.redemption.penaltyFlat')       },
  ]

  const handleRedemptionChange = (field: string, value: any) => {
    onChange('redemption', {
      ...data.redemption,
      [field]: value,
    })
  }

  const handlePenaltyChange = (field: string, value: any) => {
    onChange('redemption', {
      ...data.redemption,
      earlyRedemptionPenalty: {
        ...data.redemption?.earlyRedemptionPenalty,
        [field]: value,
      },
    })
  }

  const canRedeemEarly = data.redemption?.canRedeemEarly || false
  const penaltyType    = data.redemption?.earlyRedemptionPenalty?.type || 'none'

  return (
    <div className="space-y-4">
      {/* Early Redemption Toggle */}
      <div className="flex items-center gap-3">
<Button
  type="button"
  variant="ghost"
  size="icon"
  onClick={() => handleRedemptionChange('canRedeemEarly', !canRedeemEarly)}
  disabled={disabled}
  className={`
    relative h-6 w-11 rounded-full transition-colors p-0
    ${canRedeemEarly ? 'bg-accent hover:bg-accent/90' : 'bg-bg-tertiary border border-border-primary hover:bg-bg-tertiary'}
  `}
>
  <span
    className={`
      absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform
      ${canRedeemEarly ? 'translate-x-5' : 'translate-x-0.5'}
    `}
  />
</Button>
        <div>
          <label className="text-sm font-medium text-text-primary">
            {t('scheme.redemption.canRedeemEarly')}
          </label>
          <p className="text-xs text-text-tertiary">
            {t('scheme.redemption.canRedeemEarlyDesc')}
          </p>
        </div>
      </div>

      {/* Penalty fields — only if early redemption allowed */}
      {canRedeemEarly && (
        <div className="space-y-4 rounded-lg border border-border-primary bg-bg-tertiary p-4">
          <FormSelect
            name="redemption.earlyRedemptionPenalty.type"
            label={t('scheme.redemption.penaltyType')}
            value={penaltyType}
            onChange={(_, value) => handlePenaltyChange('type', value)}
            onBlur={() => onBlur?.('redemption.earlyRedemptionPenalty.type')}
            error={errors['redemption.earlyRedemptionPenalty.type']}
            options={penaltyTypeOptions}
            disabled={disabled}
          />

          {penaltyType !== 'none' && (
            <FormInput
              name="redemption.earlyRedemptionPenalty.value"
              label={
                penaltyType === 'percentage'
                  ? t('scheme.redemption.penaltyPercentageValue')
                  : t('scheme.redemption.penaltyFlatValue')
              }
              type="number"
              value={data.redemption?.earlyRedemptionPenalty?.value || ''}
              onChange={(_, value) => handlePenaltyChange('value', Number(value))}
              onBlur={() => onBlur?.('redemption.earlyRedemptionPenalty.value')}
              error={errors['redemption.earlyRedemptionPenalty.value']}
              placeholder={penaltyType === 'percentage' ? '5' : '500'}
              disabled={disabled}
              min={0}
            />
          )}
        </div>
      )}

      {/* Grace Period */}
      <FormInput
        name="redemption.gracePeriodDays"
        label={t('scheme.redemption.gracePeriodDays')}
        type="number"
        value={data.redemption?.gracePeriodDays ?? 30}
        onChange={(_, value) =>
          handleRedemptionChange('gracePeriodDays', Number(value))
        }
        onBlur={() => onBlur?.('redemption.gracePeriodDays')}
        error={errors['redemption.gracePeriodDays']}
        placeholder="30"
        disabled={disabled}
        min={0}
      />

      {/* Missed Installment Penalty */}
      <FormInput
        name="redemption.missedInstallmentPenalty"
        label={t('scheme.redemption.missedInstallmentPenalty')}
        type="number"
        value={data.redemption?.missedInstallmentPenalty ?? 0}
        onChange={(_, value) =>
          handleRedemptionChange('missedInstallmentPenalty', Number(value))
        }
        onBlur={() => onBlur?.('redemption.missedInstallmentPenalty')}
        error={errors['redemption.missedInstallmentPenalty']}
        placeholder="0"
        disabled={disabled}
        min={0}
      />
    </div>
  )
}