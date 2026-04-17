// FILE: src/components/girvi/GirviForm/sections/CustomerSection.tsx

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Search, UserPlus, Phone, Mail, MapPin, X, ChevronDown, ChevronUp, Loader2 } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/auth'
import { useCustomersList } from '@/hooks/customer/useCustomersList'
import { useCustomerActions } from '@/hooks/customer/useCustomerActions'
import type { GirviFormSectionProps } from '../GirviForm.types'

// ─── Relation label helper ────────────────────────────────────────────────────
const RELATION_LABELS: Record<string, string> = {
  son_of:      'S/O',
  daughter_of: 'D/O',
  husband_of:  'H/O',
  wife_of:     'W/O',
  other:       'Rel.',
}

// ─── Quick Add Form state ─────────────────────────────────────────────────────
interface QuickAddForm {
  firstName:    string
  lastName:     string
  phone:        string
  relationType: string
  relationName: string
  jaati:        string
}

const BLANK_QUICK_ADD: QuickAddForm = {
  firstName:    '',
  lastName:     '',
  phone:        '',
  relationType: 'son_of',
  relationName: '',
  jaati:        '',
}

// ─── Component ────────────────────────────────────────────────────────────────
export const CustomerSection = ({
  data,
  errors,
  onChange,
  disabled = false,
}: GirviFormSectionProps) => {
  const { t } = useTranslation()
  const { currentShopId } = useAuth()
  const shopId = currentShopId || ''

  const [searchQuery,      setSearchQuery]      = useState('')
  const [showSuggestions,  setShowSuggestions]  = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null)

  // Quick Add state
  const [showQuickAdd,  setShowQuickAdd]  = useState(false)
  const [quickAddForm,  setQuickAddForm]  = useState<QuickAddForm>(BLANK_QUICK_ADD)
  const [quickAddError, setQuickAddError] = useState('')

  const { customers, isLoading } = useCustomersList(shopId, {
    search: searchQuery,
    limit:  20,
  })

  const { createCustomer, isCreating } = useCustomerActions(shopId)

  // ── Select customer from dropdown ──────────────────────────────────────────
  const handleSelectCustomer = (customer: any) => {
    const name = `${customer.firstName} ${customer.lastName || ''}`.trim()
    setSelectedCustomer(customer)
    setSearchQuery(name)
    setShowSuggestions(false)
    setShowQuickAdd(false)
    onChange('customerId',    customer._id)
    onChange('customerName',  name)
    onChange('customerPhone', customer.phone)
    onChange('customerEmail', customer.email ?? '')
  }

  // ── Clear selection ─────────────────────────────────────────────────────────
  const handleClear = () => {
    setSelectedCustomer(null)
    setSearchQuery('')
    onChange('customerId',    '')
    onChange('customerName',  '')
    onChange('customerPhone', '')
    onChange('customerEmail', '')
  }

  // ── Quick Add submit ────────────────────────────────────────────────────────
  const handleQuickAddSubmit = async () => {
    setQuickAddError('')

    if (!quickAddForm.firstName.trim()) {
      setQuickAddError('First name is required')
      return
    }
    if (!/^[6-9][0-9]{9}$/.test(quickAddForm.phone.trim())) {
      setQuickAddError('Valid 10-digit phone number required')
      return
    }

    const payload: any = {
      firstName:    quickAddForm.firstName.trim(),
      lastName:     quickAddForm.lastName.trim() || undefined,
      phone:        quickAddForm.phone.trim(),
      relationType: quickAddForm.relationType || undefined,
      relationName: quickAddForm.relationName.trim() || undefined,
      jaati:        quickAddForm.jaati.trim() || undefined,
    }

    const result = await createCustomer(payload)

    if (result.success && result.data?.customer) {
      handleSelectCustomer(result.data.customer)
      setQuickAddForm(BLANK_QUICK_ADD)
      setShowQuickAdd(false)
    } else {
      setQuickAddError(result.error || 'Failed to create customer')
    }
  }

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">

      {/* ── Search Input ───────────────────────────────────────────────────── */}
      <div className="space-y-2">
        <Label className="text-text-primary">
          {t('girvi.selectCustomer')}
          <span className="ml-1 text-status-error">*</span>
        </Label>

        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-text-tertiary" />
          </div>

          <input
            type="text"
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value)
              setShowSuggestions(e.target.value.length >= 2)
              if (selectedCustomer) handleClear()
            }}
            onFocus={() => {
              if (searchQuery.length >= 2) setShowSuggestions(true)
            }}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            disabled={disabled}
            placeholder={t('girvi.searchCustomerPlaceholder')}
            className={`h-12 w-full rounded-lg border bg-bg-secondary pl-10 pr-10 text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent disabled:bg-bg-tertiary ${
              errors.customerId ? 'border-status-error' : 'border-border-primary'
            }`}
          />

          {selectedCustomer && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-text-tertiary hover:text-text-primary"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          {/* ── Dropdown ─────────────────────────────────────────────────── */}
          {showSuggestions && searchQuery.length >= 2 && (
            <div className="absolute z-10 mt-1 max-h-64 w-full overflow-auto rounded-lg border border-border-primary bg-bg-secondary shadow-lg">
              {isLoading ? (
                <div className="flex items-center justify-center gap-2 p-3 text-sm text-text-secondary">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t('common.searching')}...
                </div>
              ) : customers.length === 0 ? (
                <div className="p-3 text-center text-sm text-text-secondary">
                  {t('girvi.noCustomersFound')}
                </div>
              ) : (
                customers.map((customer: any) => {
                  const relationLabel = customer.relationType
                    ? RELATION_LABELS[customer.relationType] ?? 'Rel.'
                    : null

                  return (
                    <button
                      key={customer._id}
                      type="button"
                      onMouseDown={() => handleSelectCustomer(customer)}
                      className="w-full border-b border-border-secondary p-3 text-left transition-colors hover:bg-bg-tertiary last:border-0"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          {/* Name */}
                          <p className="font-semibold text-text-primary">
                            {customer.firstName} {customer.lastName || ''}
                          </p>

                          {/* Son of / Husband of */}
                          {customer.relationName && relationLabel && (
                            <p className="text-xs text-text-secondary">
                              {relationLabel} {customer.relationName}
                            </p>
                          )}

                          {/* Jaati */}
                          {customer.jaati && (
                            <p className="text-xs text-text-tertiary">
                              {customer.jaati}
                            </p>
                          )}

                          {/* Phone + Code */}
                          <p className="mt-0.5 text-sm text-text-secondary">
                            📱 {customer.phone}
                            {customer.customerCode && (
                              <span className="ml-2 text-text-tertiary">
                                #{customer.customerCode}
                              </span>
                            )}
                          </p>
                        </div>

                        {customer.creditLimit !== undefined && customer.creditLimit > 0 && (
                          <p className="flex-shrink-0 text-xs font-medium text-text-tertiary">
                            Limit: ₹{customer.creditLimit.toLocaleString('en-IN')}
                          </p>
                        )}
                      </div>
                    </button>
                  )
                })
              )}
            </div>
          )}
        </div>

        {errors.customerId && (
          <p className="text-sm text-status-error">⚠️ {errors.customerId}</p>
        )}

        {/* ── Add New Customer toggle ─────────────────────────────────────── */}
        {!disabled && (
          <button
            type="button"
            onClick={() => {
              setShowQuickAdd(v => !v)
              setQuickAddError('')
            }}
            className="flex items-center gap-1.5 text-sm text-accent hover:underline"
          >
            {showQuickAdd
              ? <><ChevronUp   className="h-4 w-4" /> {t('common.cancel')}</>
              : <><UserPlus    className="h-4 w-4" /> {t('girvi.addNewCustomer')}</>
            }
          </button>
        )}
      </div>

      {/* ── Quick Add Form ──────────────────────────────────────────────────── */}
      {showQuickAdd && !disabled && (
        <div className="rounded-lg border border-accent/30 bg-accent/5 p-4 space-y-3">
          <p className="text-sm font-semibold text-text-primary">
            {t('girvi.addNewCustomer')}
          </p>

          {/* Row 1: First + Last name */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-text-secondary">
                {t('customer.firstName')} <span className="text-status-error">*</span>
              </label>
              <input
                type="text"
                value={quickAddForm.firstName}
                onChange={e => setQuickAddForm(f => ({ ...f, firstName: e.target.value }))}
                placeholder="Ramesh"
                maxLength={50}
                className="h-9 w-full rounded-lg border border-border-primary bg-bg-secondary px-3 text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-text-secondary">
                {t('customer.lastName')}
              </label>
              <input
                type="text"
                value={quickAddForm.lastName}
                onChange={e => setQuickAddForm(f => ({ ...f, lastName: e.target.value }))}
                placeholder="Kumar"
                maxLength={50}
                className="h-9 w-full rounded-lg border border-border-primary bg-bg-secondary px-3 text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>

          {/* Row 2: Phone */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-text-secondary">
              {t('customer.phone')} <span className="text-status-error">*</span>
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-text-tertiary">
                📱
              </span>
              <input
                type="tel"
                value={quickAddForm.phone}
                onChange={e => setQuickAddForm(f => ({ ...f, phone: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
                placeholder="9876543210"
                className="h-9 w-full rounded-lg border border-border-primary bg-bg-secondary pl-8 pr-3 text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>

          {/* Row 3: Relation type + name */}
          <div className="grid grid-cols-5 gap-3">
            <div className="col-span-2 space-y-1">
              <label className="text-xs font-medium text-text-secondary">
                {t('customer.relationType')}
              </label>
              <select
                value={quickAddForm.relationType}
                onChange={e => setQuickAddForm(f => ({ ...f, relationType: e.target.value }))}
                className="h-9 w-full rounded-lg border border-border-primary bg-bg-secondary px-2 text-sm text-text-primary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="son_of">S/O (Son of)</option>
                <option value="daughter_of">D/O (Daughter of)</option>
                <option value="husband_of">H/O (Husband of)</option>
                <option value="wife_of">W/O (Wife of)</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="col-span-3 space-y-1">
              <label className="text-xs font-medium text-text-secondary">
                {t('customer.relationName')}
              </label>
              <input
                type="text"
                value={quickAddForm.relationName}
                onChange={e => setQuickAddForm(f => ({ ...f, relationName: e.target.value }))}
                placeholder="Father / Husband name"
                maxLength={100}
                className="h-9 w-full rounded-lg border border-border-primary bg-bg-secondary px-3 text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>

          {/* Row 4: Jaati */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-text-secondary">
              {t('customer.jaati')}
            </label>
            <input
              type="text"
              value={quickAddForm.jaati}
              onChange={e => setQuickAddForm(f => ({ ...f, jaati: e.target.value }))}
              placeholder="e.g. Agrawal, Soni, Jain..."
              maxLength={100}
              className="h-9 w-full rounded-lg border border-border-primary bg-bg-secondary px-3 text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          {/* Error */}
          {quickAddError && (
            <p className="text-sm text-status-error">⚠️ {quickAddError}</p>
          )}

          {/* Submit */}
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={handleQuickAddSubmit}
              disabled={isCreating}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isCreating
                ? <><Loader2 className="h-4 w-4 animate-spin" /> Creating...</>
                : <><UserPlus className="h-4 w-4" /> Create & Select</>
              }
            </button>
            <button
              type="button"
              onClick={() => { setShowQuickAdd(false); setQuickAddError('') }}
              className="rounded-lg border border-border-primary px-4 py-2 text-sm font-medium text-text-secondary hover:bg-bg-tertiary"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ── Selected Customer Card ──────────────────────────────────────────── */}
      {selectedCustomer && (
        <div className="rounded-lg border-2 border-accent/30 bg-accent/5 p-4">
          <div className="flex items-start gap-3">

            {/* Avatar */}
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-accent text-lg font-bold text-white">
              {selectedCustomer.firstName?.[0]?.toUpperCase()}
              {selectedCustomer.lastName?.[0]?.toUpperCase()}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 space-y-0.5">
              {/* Name */}
              <p className="font-bold text-text-primary">
                {selectedCustomer.firstName} {selectedCustomer.lastName || ''}
              </p>

              {/* Code */}
              {selectedCustomer.customerCode && (
                <p className="text-xs text-text-tertiary">
                  #{selectedCustomer.customerCode}
                </p>
              )}

              {/* Son of / Husband of */}
              {selectedCustomer.relationName && selectedCustomer.relationType && (
                <p className="text-sm text-text-secondary">
                  <span className="font-medium">
                    {RELATION_LABELS[selectedCustomer.relationType] ?? 'Rel.'}
                  </span>{' '}
                  {selectedCustomer.relationName}
                </p>
              )}

              {/* Jaati */}
              {selectedCustomer.jaati && (
                <p className="text-xs text-text-secondary">
                  Jaati: <span className="font-medium">{selectedCustomer.jaati}</span>
                </p>
              )}

              {/* Phone */}
              {selectedCustomer.phone && (
                <p className="flex items-center gap-2 text-sm text-text-secondary">
                  <Phone className="h-3.5 w-3.5" />
                  {selectedCustomer.phone}
                </p>
              )}

              {/* Email */}
              {selectedCustomer.email && (
                <p className="flex items-center gap-2 text-sm text-text-secondary">
                  <Mail className="h-3.5 w-3.5" />
                  {selectedCustomer.email}
                </p>
              )}

              {/* City */}
              {selectedCustomer.address?.city && (
                <p className="flex items-center gap-2 text-sm text-text-secondary">
                  <MapPin className="h-3.5 w-3.5" />
                  {selectedCustomer.address.city}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}