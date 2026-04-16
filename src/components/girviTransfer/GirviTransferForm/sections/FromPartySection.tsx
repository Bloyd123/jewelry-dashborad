// FILE: src/components/girviTransfer/GirviTransferForm/sections/FromPartySection.tsx

import { useTranslation } from 'react-i18next'
import { FormInput }   from '@/components/forms/FormInput/FormInput'
import { FormSelect }  from '@/components/forms/FormSelect/FormSelect'
import type { FormSectionProps } from '../GirviTransferForm.types'

export const FromPartySection = ({
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

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border-primary bg-bg-tertiary p-4">
        <h3 className="mb-3 text-sm font-semibold text-text-primary">
          {t('girviTransfer.fromParty.title', 'From Party (Our Side)')}
        </h3>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <FormInput
            name="fromPartyName"
            label={t('girviTransfer.fromParty.name', 'Party Name')}
            value={data.fromPartyName || ''}
            onChange={onChange}
            onBlur={onBlur}
            error={errors.fromPartyName}
            required
            disabled={disabled}
            placeholder={t('girviTransfer.fromParty.namePlaceholder', 'Our Shop Name')}
          />

          <FormSelect
            name="fromPartyType"
            label={t('girviTransfer.fromParty.type', 'Party Type')}
            value={data.fromPartyType || 'shop'}
            onChange={onChange}
            onBlur={onBlur}
            options={partyTypeOptions}
            disabled={disabled}
          />

          <FormInput
            name="fromPartyPhone"
            label={t('girviTransfer.fromParty.phone', 'Phone')}
            value={data.fromPartyPhone || ''}
            onChange={onChange}
            onBlur={onBlur}
            error={errors.fromPartyPhone}
            disabled={disabled}
            placeholder="9876543210"
          />

          <FormInput
            name="fromPartyAddress"
            label={t('girviTransfer.fromParty.address', 'Address')}
            value={data.fromPartyAddress || ''}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            placeholder={t('girviTransfer.fromParty.addressPlaceholder', 'Shop address')}
          />
        </div>
      </div>
    </div>
  )
}