// FILE: src/components/girviTransfer/GirviTransferForm/sections/ToPartySection.tsx

import { useTranslation } from 'react-i18next'
import { FormInput }   from '@/components/forms/FormInput/FormInput'
import { FormSelect }  from '@/components/forms/FormSelect/FormSelect'
import type { FormSectionProps } from '../GirviTransferForm.types'

export const ToPartySection = ({
  data,
  errors,
  onChange,
  onBlur,
  disabled,
}: FormSectionProps) => {
  const { t } = useTranslation()

  const partyTypeOptions = [
    { value: 'shop',     label: t('girviTransfer.partyType.shop',     'Our Shop') },
    { value: 'external', label: t('girviTransfer.partyType.external', 'External Party') },
  ]

  const interestTypeOptions = [
    { value: 'simple',   label: t('girviTransfer.interestType.simple',   'Simple') },
    { value: 'compound', label: t('girviTransfer.interestType.compound', 'Compound') },
  ]

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border-primary bg-bg-tertiary p-4">
        <h3 className="mb-3 text-sm font-semibold text-text-primary">
          {t('girviTransfer.toParty.title', 'To Party (Receiving Side)')}
        </h3>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <FormInput
            name="toPartyName"
            label={t('girviTransfer.toParty.name', 'Party Name')}
            value={data.toPartyName || ''}
            onChange={onChange}
            onBlur={onBlur}
            error={errors.toPartyName}
            required
            disabled={disabled}
            placeholder={t('girviTransfer.toParty.namePlaceholder', 'Receiving party name')}
          />

          <FormSelect
            name="toPartyType"
            label={t('girviTransfer.toParty.type', 'Party Type')}
            value={data.toPartyType || 'external'}
            onChange={onChange}
            onBlur={onBlur}
            options={partyTypeOptions}
            disabled={disabled}
          />

          <FormInput
            name="toPartyPhone"
            label={t('girviTransfer.toParty.phone', 'Phone')}
            value={data.toPartyPhone || ''}
            onChange={onChange}
            onBlur={onBlur}
            error={errors.toPartyPhone}
            disabled={disabled}
            placeholder="9876543210"
          />

          <FormInput
            name="toPartyAddress"
            label={t('girviTransfer.toParty.address', 'Address')}
            value={data.toPartyAddress || ''}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            placeholder={t('girviTransfer.toParty.addressPlaceholder', 'Party address')}
          />

          {/* Interest Details */}
          <FormInput
            name="toPartyInterestRate"
            label={t('girviTransfer.toParty.interestRate', 'Interest Rate (% per month)')}
            type="number"
            value={data.toPartyInterestRate || 0}
            onChange={(name, value) => onChange(name, Number(value) || 0)}
            onBlur={onBlur}
            error={errors.toPartyInterestRate}
            required
            disabled={disabled}
            placeholder="2.5"
          />

          <FormSelect
            name="toPartyInterestType"
            label={t('girviTransfer.toParty.interestType', 'Interest Type')}
            value={data.toPartyInterestType || 'simple'}
            onChange={onChange}
            onBlur={onBlur}
            error={errors.toPartyInterestType}
            options={interestTypeOptions}
            required
            disabled={disabled}
          />
        </div>

        {/* Info Box */}
        <div className="mt-3 flex items-start gap-2 rounded-lg bg-status-info/10 p-3 text-xs text-text-secondary">
          <span>ℹ️</span>
          <span>
            {t(
              'girviTransfer.toParty.infoText',
              'This party will charge interest on the principal amount given to them. Enter their interest rate carefully.'
            )}
          </span>
        </div>
      </div>
    </div>
  )
}