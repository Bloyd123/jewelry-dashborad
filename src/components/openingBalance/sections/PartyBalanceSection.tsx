// FILE: src/components/openingBalance/sections/PartyBalanceSection.tsx

import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Trash2, Users, Loader2, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/data-display/Badge/Badge'
import { FormInput } from '@/components/forms/FormInput/FormInput'
import { FormSelect } from '@/components/forms/FormSelect/FormSelect'
import { SearchBar } from '@/components/ui/SearchBar'
import { useSelector } from 'react-redux'
import { selectCurrentShopId } from '@/store/slices/authSlice'
import { useCustomerSearch } from '@/hooks/customer/useCustomerSearch'
import { useLazySearchSuppliersQuery } from '@/store/api/supplierApi'
import type { PartyBalance } from '@/types/openingBalance.types'

interface PartyBalanceSectionProps {
  data: PartyBalance[]
  errors: Record<string, string>
  onChange: (data: PartyBalance[]) => void
  disabled?: boolean
}

const emptyParty = (): PartyBalance => ({
  partyType: 'customer',
  partyId: '',
  partyModel: 'Customer',
  partyName: '',
  direction: 'they_owe',
  amount: 0,
  notes: '',
})

// ── Search Input Props ───────────────────────────────────────────
interface PartySearchInputProps {
  partyType: 'customer' | 'supplier'
  partyId: string
  partyName: string
  shopId: string
  disabled: boolean
  onSelect: (id: string, name: string) => void
}

// ── Per-row Search Input ─────────────────────────────────────────
const PartySearchInput = ({
  partyType,
  partyId,
  partyName,
  shopId,
  disabled,
  onSelect,
}: PartySearchInputProps) => {
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

  // Get display name from customer/supplier object
const getDisplayName = (item: any): string => {
  // Customer: firstName + lastName direct fields
  if (item.firstName || item.lastName) {
    return `${item.firstName || ''} ${item.lastName || ''}`.trim()
  }
  // Supplier: displayName ya businessName use karo
  if (item.displayName) return item.displayName
  if (item.businessName) return item.businessName
  // Supplier contactPerson fallback
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
export const PartyBalanceSection = ({
  data,
  errors,
  onChange,
  disabled = false,
}: PartyBalanceSectionProps) => {
  const { t } = useTranslation()
  const shopId = useSelector(selectCurrentShopId)!

  const partyTypeOptions = [
    { value: 'customer', label: t('openingBalance.party.customer') },
    { value: 'supplier', label: t('openingBalance.party.supplier') },
  ]

  const directionOptions = [
    { value: 'they_owe', label: t('openingBalance.party.theyOwe') },
    { value: 'we_owe',   label: t('openingBalance.party.weOwe') },
  ]

  const handleAdd    = () => onChange([...data, emptyParty()])
  const handleRemove = (i: number) => onChange(data.filter((_, idx) => idx !== i))

  const handleChange = (index: number, field: keyof PartyBalance, value: string | number) => {
    onChange(data.map((p, i) => {
      if (i !== index) return p
      const updated = { ...p, [field]: value }
      // partyType change hone par selection reset karo
      if (field === 'partyType') {
        updated.partyModel = value === 'customer' ? 'Customer' : 'Supplier'
        updated.partyId    = ''
        updated.partyName  = ''
      }
      return updated
    }))
  }

  const handlePartySelect = (index: number, id: string, name: string) => {
    onChange(data.map((p, i) =>
      i === index ? { ...p, partyId: id, partyName: name } : p
    ))
  }

  const totalTheyOwe = data
    .filter(p => p.direction === 'they_owe')
    .reduce((s, p) => s + (Number(p.amount) || 0), 0)

  const totalWeOwe = data
    .filter(p => p.direction === 'we_owe')
    .reduce((s, p) => s + (Number(p.amount) || 0), 0)

  return (
    <div className="space-y-4">

      {/* Summary */}
      {data.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-status-success/20 bg-status-success/5 p-3">
            <p className="text-xs text-text-tertiary">{t('openingBalance.party.theyOweTotal')}</p>
            <p className="mt-1 text-lg font-bold text-status-success">
              ₹{totalTheyOwe.toLocaleString('en-IN')}
            </p>
          </div>
          <div className="rounded-lg border border-status-error/20 bg-status-error/5 p-3">
            <p className="text-xs text-text-tertiary">{t('openingBalance.party.weOweTotal')}</p>
            <p className="mt-1 text-lg font-bold text-status-error">
              ₹{totalWeOwe.toLocaleString('en-IN')}
            </p>
          </div>
        </div>
      )}

      {/* Add Button */}
      <Button
        type="button"
        variant="outline"
        onClick={handleAdd}
        disabled={disabled}
        className="w-full gap-2"
      >
        <Plus className="h-4 w-4" />
        {t('openingBalance.party.addParty')}
      </Button>

      {/* Empty State */}
      {data.length === 0 && (
        <div className="rounded-lg border border-dashed border-border-primary p-8 text-center">
          <Users className="mx-auto mb-2 h-10 w-10 text-text-tertiary" />
          <p className="text-sm text-text-tertiary">
            {t('openingBalance.party.noParties')}
          </p>
        </div>
      )}

      {/* Party Cards */}
      <div className="space-y-3">
        {data.map((party, index) => (
          <div
            key={index}
            className="rounded-lg border border-border-secondary bg-bg-secondary p-4"
          >
            {/* Card Header */}
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge
                  variant={party.direction === 'they_owe' ? 'success' : 'error'}
                  size="sm"
                >
                  {party.direction === 'they_owe'
                    ? t('openingBalance.party.theyOwe')
                    : t('openingBalance.party.weOwe')}
                </Badge>
                <span className="text-sm text-text-tertiary">
                  {party.partyName || `${t('openingBalance.party.party')} ${index + 1}`}
                </span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemove(index)}
                disabled={disabled}
                className="h-7 w-7 text-status-error hover:bg-status-error/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Type + Direction */}
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <FormSelect
                name={`party.${index}.partyType`}
                label={t('openingBalance.party.type')}
                value={party.partyType}
                onChange={(_, val) => handleChange(index, 'partyType', val)}
                options={partyTypeOptions}
                disabled={disabled}
              />
              <FormSelect
                name={`party.${index}.direction`}
                label={t('openingBalance.party.direction')}
                value={party.direction}
                onChange={(_, val) => handleChange(index, 'direction', val)}
                options={directionOptions}
                disabled={disabled}
              />
            </div>

            {/* Search Party */}
            <div className="mt-3">
              <label className="mb-1.5 block text-sm font-medium text-text-primary">
                {party.partyType === 'customer'
                  ? t('openingBalance.party.searchCustomer')
                  : t('openingBalance.party.searchSupplier')}
              </label>
              <PartySearchInput
                partyType={party.partyType}
                partyId={party.partyId}
                partyName={party.partyName}
                shopId={shopId}
                disabled={disabled}
                onSelect={(id, name) => handlePartySelect(index, id, name)}
              />
              {errors[`partyBalances.${index}.partyId`] && (
                <p className="mt-1 text-xs text-status-error">
                  {errors[`partyBalances.${index}.partyId`]}
                </p>
              )}
            </div>

            {/* Amount + Notes */}
            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
              <FormInput
                name={`party.${index}.amount`}
                label={t('openingBalance.party.amount')}
                type="number"
                value={party.amount || ''}
                onChange={(_, val) => handleChange(index, 'amount', val)}
                error={errors[`partyBalances.${index}.amount`]}
                placeholder="0"
                disabled={disabled}
                min={0}
              />
              <FormInput
                name={`party.${index}.notes`}
                label={t('openingBalance.party.notes')}
                value={party.notes || ''}
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