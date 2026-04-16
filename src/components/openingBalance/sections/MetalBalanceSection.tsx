// FILE: src/components/openingBalance/sections/MetalBalanceSection.tsx

import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Trash2, Gem, Loader2, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/data-display/Badge/Badge'
import { FormInput } from '@/components/forms/FormInput/FormInput'
import { FormSelect } from '@/components/forms/FormSelect/FormSelect'
import { SearchBar } from '@/components/ui/SearchBar'
import { useSelector } from 'react-redux'
import { selectCurrentShopId } from '@/store/slices/authSlice'
import { useCustomerSearch } from '@/hooks/customer/useCustomerSearch'
import { useLazySearchSuppliersQuery } from '@/store/api/supplierApi'
import type { MetalBalance } from '@/types/openingBalance.types'

interface MetalBalanceSectionProps {
  data: MetalBalance[]
  errors: Record<string, string>
  onChange: (data: MetalBalance[]) => void
  disabled?: boolean
}

const emptyMetal = (): MetalBalance => ({
  partyType: 'customer',
  partyId: '',
  partyModel: 'Customer',
  partyName: '',
  metalType: 'gold',
  direction: 'they_owe',
  weight: 0,
  weightUnit: 'gram',
  referenceRate: undefined,
  notes: '',
})

// ── Per-row Search Input ─────────────────────────────────────────
interface MetalPartySearchProps {
  partyType: 'customer' | 'supplier'
  partyId: string
  partyName: string
  shopId: string
  disabled: boolean
  onSelect: (id: string, name: string) => void
}

const MetalPartySearchInput = ({
  partyType,
  partyId,
  partyName,
  shopId,
  disabled,
  onSelect,
}: MetalPartySearchProps) => {
  const { t } = useTranslation()
  const [query, setQuery]              = useState('')
  const [showDropdown, setShow]        = useState(false)
  const [customerResults, setCResults] = useState<any[]>([])
  const [isSelected, setIsSelected]    = useState(!!partyId)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const { searchCustomer, isSearching: isCLoading } = useCustomerSearch(shopId)
  const [triggerSupplier, { data: supplierData, isLoading: isSLoading }] =
    useLazySearchSuppliersQuery()

  const isLoading = partyType === 'customer' ? isCLoading : isSLoading
  const results   = partyType === 'customer' ? customerResults : (supplierData || [])

  // Sync external partyId change
  useEffect(() => {
    setIsSelected(!!partyId)
  }, [partyId])

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShow(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const getDisplayName = (item: any): string => {
    if (item.firstName || item.lastName) {
      return `${item.firstName || ''} ${item.lastName || ''}`.trim()
    }
    if (item.displayName) return item.displayName
    if (item.businessName) return item.businessName
    if (item.contactPerson && typeof item.contactPerson === 'object') {
      return `${item.contactPerson.firstName || ''} ${item.contactPerson.lastName || ''}`.trim()
    }
    return item.contactPerson || ''
  }

  const handleSearch = async (val: string) => {
    setQuery(val)
    if (val.length < 2) { setCResults([]); setShow(false); return }
    setShow(true)

    if (partyType === 'customer') {
      const res = await searchCustomer({ search: val })
      if (res.success && res.customer) {
        const arr = Array.isArray(res.customer)
          ? res.customer
          : [res.customer]
        setCResults(arr)
      }
    } else {
      triggerSupplier({ shopId, search: val, limit: 8 })
    }
  }

  const handleSelect = (id: string, name: string) => {
    setShow(false)
    setQuery('')
    setCResults([])
    setIsSelected(true)
    onSelect(id, name)
  }

  const handleClear = () => {
    setIsSelected(false)
    setQuery('')
    setCResults([])
    onSelect('', '')
  }

  // ── Selected State ───────────────────────────────────────────
  if (isSelected && partyName) {
    return (
      <div className="flex items-center justify-between rounded-md border border-status-success/30 bg-status-success/5 px-3 py-2">
        <div className="flex items-center gap-2">
          <Check className="h-4 w-4 text-status-success" />
          <span className="text-sm font-medium text-text-primary">{partyName}</span>
        </div>
        {!disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="text-text-tertiary hover:text-status-error"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    )
  }

  // ── Search State ─────────────────────────────────────────────
  return (
    <div ref={wrapperRef} className="relative">
      <SearchBar
        value={query}
        onChange={handleSearch}
        placeholder={
          partyType === 'customer'
            ? t('openingBalance.party.searchCustomer')
            : t('openingBalance.party.searchSupplier')
        }
        disabled={disabled}
        debounceMs={300}
      />

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute z-50 mt-1 max-h-48 w-full overflow-y-auto rounded-md border border-border-primary bg-bg-secondary shadow-lg">
          {isLoading && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-4 w-4 animate-spin text-text-tertiary" />
            </div>
          )}

          {!isLoading && results.length > 0 && results.map((item: any) => (
            <button
              key={item._id}
              type="button"
              onClick={() => handleSelect(item._id, getDisplayName(item))}
              className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left text-sm hover:bg-bg-tertiary"
            >
              <span className="font-medium text-text-primary">
                {getDisplayName(item)}
              </span>
              {(item.phone || item.businessPhone || item.contactPerson?.phone) && (
                <span className="text-xs text-text-tertiary">
                  {item.phone || item.businessPhone || item.contactPerson?.phone}
                </span>
              )}
            </button>
          ))}

          {!isLoading && results.length === 0 && query.length >= 2 && (
            <div className="px-3 py-2.5 text-sm text-text-tertiary">
              {t('openingBalance.party.noResults')}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Main Component ───────────────────────────────────────────────
export const MetalBalanceSection = ({
  data,
  errors,
  onChange,
  disabled = false,
}: MetalBalanceSectionProps) => {
  const { t } = useTranslation()
  const shopId = useSelector(selectCurrentShopId)!

  const partyTypeOptions = [
    { value: 'customer', label: t('openingBalance.party.customer') },
    { value: 'supplier', label: t('openingBalance.party.supplier') },
  ]

  const metalTypeOptions = [
    { value: 'gold',     label: t('openingBalance.metal.gold') },
    { value: 'silver',   label: t('openingBalance.metal.silver') },
    { value: 'platinum', label: t('openingBalance.metal.platinum') },
  ]

  const directionOptions = [
    { value: 'they_owe', label: t('openingBalance.party.theyOwe') },
    { value: 'we_owe',   label: t('openingBalance.party.weOwe') },
  ]

  const weightUnitOptions = [
    { value: 'gram', label: t('openingBalance.metal.gram') },
    { value: 'tola', label: t('openingBalance.metal.tola') },
    { value: 'kg',   label: t('openingBalance.metal.kg') },
  ]

  const handleAdd    = () => onChange([...data, emptyMetal()])
  const handleRemove = (i: number) => onChange(data.filter((_, idx) => idx !== i))

  const handleChange = (index: number, field: keyof MetalBalance, value: string | number) => {
    onChange(data.map((m, i) => {
      if (i !== index) return m
      const updated = { ...m, [field]: value }
      if (field === 'partyType') {
        updated.partyModel = value === 'customer' ? 'Customer' : 'Supplier'
        updated.partyId    = ''
        updated.partyName  = ''
      }
      return updated
    }))
  }

  const handlePartySelect = (index: number, id: string, name: string) => {
    onChange(data.map((m, i) =>
      i === index ? { ...m, partyId: id, partyName: name } : m
    ))
  }

  // Group by metal for summary
  const metalSummary = data.reduce<Record<string, { theyOwe: number; weOwe: number }>>(
    (acc, m) => {
      if (!acc[m.metalType]) acc[m.metalType] = { theyOwe: 0, weOwe: 0 }
      const w = Number(m.weight) || 0
      if (m.direction === 'they_owe') acc[m.metalType].theyOwe += w
      else acc[m.metalType].weOwe += w
      return acc
    },
    {}
  )

  return (
    <div className="space-y-4">
      {/* Metal Summary */}
      {Object.keys(metalSummary).length > 0 && (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {Object.entries(metalSummary).map(([metal, summary]) => (
            <div key={metal} className="rounded-lg border border-border-secondary bg-bg-tertiary p-3">
              <p className="text-xs font-medium capitalize text-text-secondary">{metal}</p>
              <div className="mt-1 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-text-tertiary">{t('openingBalance.party.theyOwe')}</span>
                  <span className="font-medium text-status-success">{summary.theyOwe}g</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-text-tertiary">{t('openingBalance.party.weOwe')}</span>
                  <span className="font-medium text-status-error">{summary.weOwe}g</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Button */}
      <Button type="button" variant="outline" onClick={handleAdd} disabled={disabled} className="w-full gap-2">
        <Plus className="h-4 w-4" />
        {t('openingBalance.metal.addMetal')}
      </Button>

      {/* Empty State */}
      {data.length === 0 && (
        <div className="rounded-lg border border-dashed border-border-primary p-8 text-center">
          <Gem className="mx-auto mb-2 h-10 w-10 text-text-tertiary" />
          <p className="text-sm text-text-tertiary">{t('openingBalance.metal.noMetals')}</p>
        </div>
      )}

      {/* Metal Cards */}
      <div className="space-y-3">
        {data.map((metal, index) => (
          <div key={index} className="rounded-lg border border-border-secondary bg-bg-secondary p-4">

            {/* Card Header */}
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="info" size="sm">{metal.metalType.toUpperCase()}</Badge>
                <Badge variant={metal.direction === 'they_owe' ? 'success' : 'error'} size="sm">
                  {metal.direction === 'they_owe' ? t('openingBalance.party.theyOwe') : t('openingBalance.party.weOwe')}
                </Badge>
                <span className="text-sm text-text-tertiary">
                  {metal.partyName || `${t('openingBalance.party.party')} ${index + 1}`}
                </span>
              </div>
              <Button
                type="button" variant="ghost" size="icon"
                onClick={() => handleRemove(index)} disabled={disabled}
                className="h-7 w-7 text-status-error hover:bg-status-error/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Row 1: Type + Direction */}
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <FormSelect
                name={`metal.${index}.partyType`}
                label={t('openingBalance.party.type')}
                value={metal.partyType}
                onChange={(_, val) => handleChange(index, 'partyType', val)}
                options={partyTypeOptions}
                disabled={disabled}
              />
              <FormSelect
                name={`metal.${index}.direction`}
                label={t('openingBalance.party.direction')}
                value={metal.direction}
                onChange={(_, val) => handleChange(index, 'direction', val)}
                options={directionOptions}
                disabled={disabled}
              />
            </div>

            {/* Row 2: Search Party */}
            <div className="mt-3">
              <label className="mb-1.5 block text-sm font-medium text-text-primary">
                {metal.partyType === 'customer'
                  ? t('openingBalance.party.searchCustomer')
                  : t('openingBalance.party.searchSupplier')}
              </label>
              <MetalPartySearchInput
                partyType={metal.partyType}
                partyId={metal.partyId}
                partyName={metal.partyName}
                shopId={shopId}
                disabled={disabled}
                onSelect={(id, name) => handlePartySelect(index, id, name)}
              />
              {errors[`metalBalances.${index}.partyId`] && (
                <p className="mt-1 text-xs text-status-error">
                  {errors[`metalBalances.${index}.partyId`]}
                </p>
              )}
            </div>

            {/* Row 3: Metal Type + Weight + Unit */}
            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
              <FormSelect
                name={`metal.${index}.metalType`}
                label={t('openingBalance.metal.type')}
                value={metal.metalType}
                onChange={(_, val) => handleChange(index, 'metalType', val)}
                options={metalTypeOptions}
                disabled={disabled}
              />
              <FormInput
                name={`metal.${index}.weight`}
                label={t('openingBalance.metal.weight')}
                type="number"
                value={metal.weight || ''}
                onChange={(_, val) => handleChange(index, 'weight', val)}
                error={errors[`metalBalances.${index}.weight`]}
                placeholder="0.000"
                disabled={disabled}
                min={0}
              />
              <FormSelect
                name={`metal.${index}.weightUnit`}
                label={t('openingBalance.metal.unit')}
                value={metal.weightUnit}
                onChange={(_, val) => handleChange(index, 'weightUnit', val)}
                options={weightUnitOptions}
                disabled={disabled}
              />
            </div>

            {/* Row 4: Reference Rate + Notes */}
            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
              <FormInput
                name={`metal.${index}.referenceRate`}
                label={t('openingBalance.metal.referenceRate')}
                type="number"
                value={metal.referenceRate || ''}
                onChange={(_, val) => handleChange(index, 'referenceRate', val)}
                placeholder="6500"
                disabled={disabled}
                min={0}
              />
              <FormInput
                name={`metal.${index}.notes`}
                label={t('openingBalance.party.notes')}
                value={metal.notes || ''}
                onChange={(_, val) => handleChange(index, 'notes', val)}
                placeholder={t('openingBalance.party.notesPlaceholder')}
                disabled={disabled}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}