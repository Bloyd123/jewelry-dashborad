// FILE: src/components/girvi/GirviForm/sections/BasicInfoSection.tsx

import { useTranslation } from 'react-i18next'
import { FormDatePicker } from '@/components/forms/FormDatePicker/FormDatePicker'
import { Input }          from '@/components/ui/input'
import { Label }          from '@/components/ui/label'
import { Calendar, Hash, User } from 'lucide-react'
import type { GirviFormSectionProps } from '../GirviForm.types'

export const BasicInfoSection = ({
  data,
  errors,
  onChange,
  onBlur,
  disabled = false,
  mode,
}: GirviFormSectionProps) => {
  const { t } = useTranslation()

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormDatePicker
          name="girviDate"
          label={t('girvi.girviDate')}
          value={data.girviDate || new Date().toISOString()}
          onChange={onChange}
          onBlur={onBlur}
          error={errors.girviDate}
          required
          disabled={disabled || mode === 'edit'}
          maxDate={new Date()}
        />

        <FormDatePicker
          name="dueDate"
          label={t('girvi.dueDate')}
          value={data.dueDate || ''}
          onChange={onChange}
          onBlur={onBlur}
          error={errors.dueDate}
          disabled={disabled}
          minDate={data.girviDate ? new Date(data.girviDate) : new Date()}
        />
      </div>

      {/* Grace Period Days */}
      <div className="space-y-1.5">
        <Label htmlFor="gracePeriodDays">
          {t('girvi.gracePeriodDays')}
        </Label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Calendar className="h-4 w-4 text-text-tertiary" />
          </div>
          <Input
            id="gracePeriodDays"
            type="number"
            name="gracePeriodDays"
            value={data.gracePeriodDays ?? 0}
            min={0}
            onChange={e => onChange('gracePeriodDays', parseInt(e.target.value) || 0)}
            onBlur={() => onBlur?.('gracePeriodDays')}
            disabled={disabled}
            className={`pl-10 ${errors.gracePeriodDays ? 'border-status-error' : ''}`}
          />
        </div>
        {errors.gracePeriodDays && (
          <p className="text-sm text-status-error">{errors.gracePeriodDays}</p>
        )}
        <p className="text-xs text-text-tertiary">
          {t('girvi.gracePeriodHint')}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Girvi Slip Number */}
        <div className="space-y-1.5">
          <Label htmlFor="girviSlipNumber">
            {t('girvi.girviSlipNumber')}
          </Label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Hash className="h-4 w-4 text-text-tertiary" />
            </div>
            <Input
              id="girviSlipNumber"
              type="text"
              name="girviSlipNumber"
              value={data.girviSlipNumber || ''}
              onChange={e => onChange('girviSlipNumber', e.target.value)}
              onBlur={() => onBlur?.('girviSlipNumber')}
              disabled={disabled}
              placeholder={t('girvi.girviSlipNumberPlaceholder')}
              maxLength={100}
              className="pl-10"
            />
          </div>
        </div>

        {/* Witness Name */}
        <div className="space-y-1.5">
          <Label htmlFor="witnessName">
            {t('girvi.witnessName')}
          </Label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <User className="h-4 w-4 text-text-tertiary" />
            </div>
            <Input
              id="witnessName"
              type="text"
              name="witnessName"
              value={data.witnessName || ''}
              onChange={e => onChange('witnessName', e.target.value)}
              onBlur={() => onBlur?.('witnessName')}
              disabled={disabled}
              placeholder={t('girvi.witnessNamePlaceholder')}
              maxLength={100}
              className="pl-10"
            />
          </div>
        </div>
      </div>
    </div>
  )
}