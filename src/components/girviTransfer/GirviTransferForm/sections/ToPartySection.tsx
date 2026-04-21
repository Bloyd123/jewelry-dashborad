// FILE: src/components/girviTransfer/GirviTransferForm/sections/ToPartySection.tsx

import { useState }       from 'react'
import { useTranslation } from 'react-i18next'
import {
  Search, UserPlus, X, ChevronUp, Loader2, Check,
} from 'lucide-react'
import { Input }         from '@/components/ui/input'
import { Label }         from '@/components/ui/label'
import { Button }        from '@/components/ui/button'
import { FormInput }     from '@/components/forms/FormInput/FormInput'
import { FormSelect }    from '@/components/forms/FormSelect/FormSelect'
import { useAuth }       from '@/hooks/auth/'
import { useSuppliersList }   from '@/hooks/supplier/useSuppliersList'
import { useSupplierActions } from '@/hooks/supplier'
import type { FormSectionProps } from '../GirviTransferForm.types'

// ── Quick-add form shape ───────────────────────────────────────────────────────
interface QuickAddForm {
  businessName:     string
  contactFirstName: string
  phone:            string
  address:          string
  supplierType:     string
  supplierCategory: string
}

const BLANK_QUICK_ADD: QuickAddForm = {
  businessName:     '',
  contactFirstName: '',
  phone:            '',
  address:          '',
  supplierType:     'wholesaler',
  supplierCategory: 'mixed',
}

// ── Main component ─────────────────────────────────────────────────────────────
export const ToPartySection = ({
  data,
  errors,
  onChange,
  onBlur,
  disabled,
}: FormSectionProps) => {
  const { t } = useTranslation()
  const { currentShopId } = useAuth()
  const shopId = currentShopId || ''

  // Search state
  const [searchQuery,      setSearchQuery]      = useState('')
  const [showSuggestions,  setShowSuggestions]  = useState(false)
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null)

  // Quick-add state
  const [showQuickAdd,  setShowQuickAdd]  = useState(false)
  const [quickAddForm,  setQuickAddForm]  = useState<QuickAddForm>(BLANK_QUICK_ADD)
  const [quickAddError, setQuickAddError] = useState('')

  const { suppliers, isLoading } = useSuppliersList(shopId, {
    search: searchQuery,
    limit:  20,
  })
  const { createSupplier, isCreating } = useSupplierActions(shopId)

  // ── Options ────────────────────────────────────────────────────────────────
  const interestTypeOptions = [
    { value: 'simple',   label: t('girviTransfer.interestType.simple',   'Simple') },
    { value: 'compound', label: t('girviTransfer.interestType.compound', 'Compound') },
  ]
  const partyTypeOptions = [
    { value: 'shop',     label: t('girviTransfer.partyType.shop',     'Our Shop') },
    { value: 'external', label: t('girviTransfer.partyType.external', 'External Party') },
  ]
  const supplierTypeOptions = [
    { value: 'manufacturer', label: t('supplier.type.manufacturer', 'Manufacturer') },
    { value: 'wholesaler',   label: t('supplier.type.wholesaler',   'Wholesaler') },
    { value: 'distributor',  label: t('supplier.type.distributor',  'Distributor') },
    { value: 'artisan',      label: t('supplier.type.artisan',      'Artisan') },
    { value: 'importer',     label: t('supplier.type.importer',     'Importer') },
    { value: 'other',        label: t('supplier.type.other',        'Other') },
  ]
  const supplierCategoryOptions = [
    { value: 'gold',      label: t('supplier.category.gold',      'Gold') },
    { value: 'silver',    label: t('supplier.category.silver',    'Silver') },
    { value: 'diamond',   label: t('supplier.category.diamond',   'Diamond') },
    { value: 'platinum',  label: t('supplier.category.platinum',  'Platinum') },
    { value: 'gemstone',  label: t('supplier.category.gemstone',  'Gemstone') },
    { value: 'pearls',    label: t('supplier.category.pearls',    'Pearls') },
    { value: 'making',    label: t('supplier.category.making',    'Making') },
    { value: 'packaging', label: t('supplier.category.packaging', 'Packaging') },
    { value: 'mixed',     label: t('supplier.category.mixed',     'Mixed') },
  ]

  // ── Select a supplier from dropdown ───────────────────────────────────────
  const handleSelectSupplier = (supplier: any) => {
    setSelectedSupplier(supplier)
    setSearchQuery(supplier.businessName)
    setShowSuggestions(false)
    setShowQuickAdd(false)

    onChange('toPartySupplierId', supplier._id)
    onChange('toPartyName',    supplier.businessName)
    onChange('toPartyPhone',   supplier.contactPerson?.phone || '')
    onChange('toPartyAddress', supplier.address?.street || '')
  }

  // ── Clear selection ────────────────────────────────────────────────────────
  const handleClear = () => {
    setSelectedSupplier(null)
    setSearchQuery('')
    onChange('toPartySupplierId', '')
    onChange('toPartyName',    '')
    onChange('toPartyPhone',   '')
    onChange('toPartyAddress', '')
  }

  // ── Validate quick-add ─────────────────────────────────────────────────────
  const validateQuickAdd = (): boolean => {
    if (!quickAddForm.businessName.trim()) {
      setQuickAddError(t('supplier.errors.businessNameRequired', 'Business name is required'))
      return false
    }
    if (!quickAddForm.contactFirstName.trim()) {
      setQuickAddError(t('supplier.errors.contactNameRequired', 'Contact person name is required'))
      return false
    }
    if (!quickAddForm.phone.trim() || !/^[0-9]{10}$/.test(quickAddForm.phone.trim())) {
      setQuickAddError(t('supplier.errors.phoneInvalid', 'Valid 10-digit phone number required'))
      return false
    }
    return true
  }

  // ── Create supplier & auto-select ─────────────────────────────────────────
  const handleQuickAddSubmit = async () => {
    setQuickAddError('')
    if (!validateQuickAdd()) return

    const result = await createSupplier({
      businessName:  quickAddForm.businessName.trim(),
      contactPerson: {
        firstName: quickAddForm.contactFirstName.trim(),
        phone:     quickAddForm.phone.trim(),
      },
      address:          { street: quickAddForm.address.trim() || undefined },
      supplierType:     quickAddForm.supplierType     as any,
      supplierCategory: quickAddForm.supplierCategory as any,
    })

    if (result.success && result.data) {
      handleSelectSupplier(result.data)
      setQuickAddForm(BLANK_QUICK_ADD)
      setShowQuickAdd(false)
    } else {
      setQuickAddError(result.error || t('supplier.errors.createFailed', 'Failed to create supplier'))
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border-primary bg-bg-tertiary p-4">
        <h3 className="mb-3 text-sm font-semibold text-text-primary">
          {t('girviTransfer.toParty.title', 'To Party (Receiving Side)')}
        </h3>

        {/* ── Supplier Search ─────────────────────────────────────────────── */}
        <div className="mb-4 space-y-1.5">
          <Label className="text-xs text-text-secondary">
            {t('girviTransfer.toParty.searchSupplier', 'Search Existing Supplier (Optional)')}
          </Label>

          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-text-tertiary" />
            </div>
            <Input
              type="text"
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value)
                setShowSuggestions(e.target.value.length >= 1)
                if (selectedSupplier) handleClear()
              }}
              onFocus={() => { if (searchQuery.length >= 1) setShowSuggestions(true) }}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              disabled={disabled}
              placeholder={t('girviTransfer.toParty.searchPlaceholder', 'Type supplier name or phone...')}
              className="h-10 pl-10 pr-10"
            />
            {selectedSupplier && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-text-tertiary hover:text-text-primary"
              >
                <X className="h-4 w-4" />
              </button>
            )}

            {/* Suggestions Dropdown */}
            {showSuggestions && searchQuery.length >= 1 && (
              <div className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-lg border border-border-primary bg-bg-secondary shadow-lg">
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2 p-3 text-sm text-text-secondary">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t('common.searching', 'Searching')}...
                  </div>
                ) : suppliers.length === 0 ? (
                  <div className="p-3 text-center text-sm text-text-secondary">
                    {t('girviTransfer.toParty.noSuppliersFound', 'No suppliers found')}
                  </div>
                ) : (
                  suppliers.map((supplier: any) => (
                    <button
                      key={supplier._id}
                      type="button"
                      onMouseDown={() => handleSelectSupplier(supplier)}
                      className="w-full border-b border-border-secondary p-3 text-left transition-colors hover:bg-bg-tertiary last:border-0"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-text-primary">
                            {supplier.businessName}
                          </p>
                          {supplier.contactPerson?.firstName && (
                            <p className="text-xs text-text-secondary">
                              {supplier.contactPerson.firstName}{' '}
                              {supplier.contactPerson.lastName || ''}
                            </p>
                          )}
                          {supplier.contactPerson?.phone && (
                            <p className="mt-0.5 text-sm text-text-secondary">
                              📱 {supplier.contactPerson.phone}
                              {supplier.supplierCode && (
                                <span className="ml-2 text-text-tertiary">
                                  #{supplier.supplierCode}
                                </span>
                              )}
                            </p>
                          )}
                          {supplier.address?.street && (
                            <p className="text-xs text-text-tertiary">
                              📍 {supplier.address.street}
                            </p>
                          )}
                        </div>
                        {supplier.supplierCategory && (
                          <span className="flex-shrink-0 rounded bg-bg-primary px-1.5 py-0.5 text-xs capitalize text-text-tertiary">
                            {supplier.supplierCategory}
                          </span>
                        )}
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Auto-fill badge */}
          {selectedSupplier && (
            <p className="text-xs text-status-success">
              ✓ {t('girviTransfer.toParty.autoFilled', 'Details auto-filled from supplier')}
            </p>
          )}

          {/* Add new supplier link */}
          {!disabled && (
            <button
              type="button"
              onClick={() => { setShowQuickAdd(v => !v); setQuickAddError('') }}
              className="flex items-center gap-1.5 text-sm text-accent hover:underline"
            >
              {showQuickAdd
                ? <><ChevronUp className="h-4 w-4" /> {t('common.cancel', 'Cancel')}</>
                : <><UserPlus  className="h-4 w-4" /> {t('girviTransfer.toParty.addNewSupplier', 'Add New Supplier')}</>
              }
            </button>
          )}
        </div>

        {/* ── Quick Add Supplier Form ─────────────────────────────────────── */}
        {showQuickAdd && !disabled && (
          <div className="mb-4 rounded-lg border border-accent/30 bg-accent/5 p-4 space-y-3">
            <p className="text-sm font-semibold text-text-primary flex items-center gap-2">
              <UserPlus className="h-4 w-4 text-accent" />
              {t('girviTransfer.toParty.newSupplierTitle', 'New Supplier')}
            </p>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {/* Business Name */}
              <div className="space-y-1.5">
                <Label className="text-xs">
                  {t('supplier.businessName', 'Business Name')}
                  <span className="ml-1 text-status-error">*</span>
                </Label>
                <Input
                  type="text"
                  value={quickAddForm.businessName}
                  onChange={e => setQuickAddForm(f => ({ ...f, businessName: e.target.value }))}
                  placeholder="e.g. Sharma Jewellers"
                  maxLength={200}
                />
              </div>

              {/* Contact Name */}
              <div className="space-y-1.5">
                <Label className="text-xs">
                  {t('supplier.contactName', 'Contact Person')}
                  <span className="ml-1 text-status-error">*</span>
                </Label>
                <Input
                  type="text"
                  value={quickAddForm.contactFirstName}
                  onChange={e => setQuickAddForm(f => ({ ...f, contactFirstName: e.target.value }))}
                  placeholder="e.g. Ramesh"
                  maxLength={100}
                />
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <Label className="text-xs">
                  {t('supplier.phone', 'Phone')}
                  <span className="ml-1 text-status-error">*</span>
                </Label>
                <Input
                  type="tel"
                  value={quickAddForm.phone}
                  onChange={e => setQuickAddForm(f => ({
                    ...f, phone: e.target.value.replace(/\D/g, '').slice(0, 10),
                  }))}
                  placeholder="9876543210"
                />
              </div>

              {/* Address */}
              <div className="space-y-1.5">
                <Label className="text-xs">
                  {t('supplier.address', 'Address (Optional)')}
                </Label>
                <Input
                  type="text"
                  value={quickAddForm.address}
                  onChange={e => setQuickAddForm(f => ({ ...f, address: e.target.value }))}
                  placeholder="Street / Area"
                  maxLength={200}
                />
              </div>

              {/* Supplier Type — native select avoids Radix empty-value issue */}
              <div className="space-y-1.5">
                <Label className="text-xs">{t('supplier.type.label', 'Supplier Type')}</Label>
                <select
                  value={quickAddForm.supplierType}
                  onChange={e => setQuickAddForm(f => ({ ...f, supplierType: e.target.value }))}
                  className="h-10 w-full rounded-md border border-border-primary bg-bg-secondary px-2 text-sm text-text-primary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  {supplierTypeOptions.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <Label className="text-xs">{t('supplier.category.label', 'Category')}</Label>
                <select
                  value={quickAddForm.supplierCategory}
                  onChange={e => setQuickAddForm(f => ({ ...f, supplierCategory: e.target.value }))}
                  className="h-10 w-full rounded-md border border-border-primary bg-bg-secondary px-2 text-sm text-text-primary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  {supplierCategoryOptions.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {quickAddError && (
              <p className="text-sm text-status-error">⚠ {quickAddError}</p>
            )}

            <div className="flex gap-2 pt-1">
              <Button
                type="button"
                onClick={handleQuickAddSubmit}
                disabled={isCreating}
                className="flex-1"
              >
                {isCreating
                  ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t('common.saving', 'Saving...')}</>
                  : <><Check   className="mr-2 h-4 w-4" /> {t('girviTransfer.toParty.saveAndSelect', 'Create & Select')}</>
                }
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => { setShowQuickAdd(false); setQuickAddError('') }}
              >
                {t('common.cancel', 'Cancel')}
              </Button>
            </div>
          </div>
        )}

        {/* ── Party Fields ────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <FormInput
            name="toPartyName"
            label={t('girviTransfer.toParty.name', 'Party Name')}
            value={data.toPartyName || ''}
            onChange={onChange}
            onBlur={onBlur}
            error={errors.toPartyName}
            required
            disabled={disabled || !!selectedSupplier}
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
            disabled={disabled || !!selectedSupplier}
            placeholder="9876543210"
          />

          <FormInput
            name="toPartyAddress"
            label={t('girviTransfer.toParty.address', 'Address')}
            value={data.toPartyAddress || ''}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled || !!selectedSupplier}
            placeholder={t('girviTransfer.toParty.addressPlaceholder', 'Party address')}
          />

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

        {/* ── Info Box ──────────────────────────────────────────────────────── */}
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