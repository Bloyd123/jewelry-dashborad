// FILE: src/components/girviTransfer/GirviTransferForm/sections/FromPartySection.tsx
import { useEffect }      from 'react'
import { useTranslation } from 'react-i18next'
import { FormInput }   from '@/components/forms/FormInput/FormInput'
import { FormSelect }  from '@/components/forms/FormSelect/FormSelect'
import type { FormSectionProps } from '../GirviTransferForm.types'
import { useShopById }    from '@/hooks/shop/useShopById'
export const FromPartySection = ({
  data,
  errors,
  onChange,
  onBlur,
  disabled,
    shopId,  
}: FormSectionProps) => {
  const { t } = useTranslation()
    const { shop } = useShopById(shopId)

  useEffect(() => {
    if (!shop) return
   onChange('fromPartyName', shop.name || '')
    onChange('fromPartyPhone',   shop.phone      || '')
    onChange('fromPartyAddress', shop.address?.street || '')
    onChange('fromPartyType',    'shop')
  }, [shop?._id])

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
            disabled={true}
            placeholder={t('girviTransfer.fromParty.namePlaceholder', 'Our Shop Name')}
          />

          {/* <FormSelect
            name="fromPartyType"
            label={t('girviTransfer.fromParty.type', 'Party Type')}
            value={data.fromPartyType || 'shop'}
            onChange={onChange}
            onBlur={onBlur}
            options={partyTypeOptions}
            disabled={disabled}
          /> */}

          <FormInput
            name="fromPartyPhone"
            label={t('girviTransfer.fromParty.phone', 'Phone')}
            value={data.fromPartyPhone || ''}
            onChange={onChange}
            onBlur={onBlur}
            error={errors.fromPartyPhone}
            disabled={true}
            placeholder="9876543210"
          />

          <FormInput
            name="fromPartyAddress"
            label={t('girviTransfer.fromParty.address', 'Address')}
            value={data.fromPartyAddress || ''}
            onChange={onChange}
            onBlur={onBlur}
            disabled={true}
            placeholder={t('girviTransfer.fromParty.addressPlaceholder', 'Shop address')}
          />
        </div>
      </div>
    </div>
  )
}