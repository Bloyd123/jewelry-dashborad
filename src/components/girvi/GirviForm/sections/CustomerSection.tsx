// FILE: src/components/girvi/GirviForm/sections/CustomerSection.tsx

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  UserPlus, Phone, Mail, MapPin, X,
  ChevronDown, ChevronUp, Loader2, Edit2, Check,
} from 'lucide-react'
import { Input }     from '@/components/ui/input'
import { Label }     from '@/components/ui/label'
import { Button }    from '@/components/ui/button'
import { SearchBar } from '@/components/ui/SearchBar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAuth }            from '@/hooks/auth'
import { useCustomersList }   from '@/hooks/customer/useCustomersList'
import { useCustomerActions } from '@/hooks/customer/useCustomerActions'
import { useNotification }    from '@/hooks/useNotification'
import type { GirviFormSectionProps } from '../GirviForm.types'

// ── Constants ──────────────────────────────────────────────────────────────────

const RELATION_LABELS: Record<string, string> = {
  son_of:      'S/O',
  daughter_of: 'D/O',
  husband_of:  'H/O',
  wife_of:     'W/O',
  other:       'Rel.',
}

const RELATION_OPTIONS = [
  { value: 'son_of',      label: 'S/O (Son of)'      },
  { value: 'daughter_of', label: 'D/O (Daughter of)' },
  { value: 'husband_of',  label: 'H/O (Husband of)'  },
  { value: 'wife_of',     label: 'W/O (Wife of)'     },
  { value: 'other',       label: 'Other'              },
]

// ── Types ──────────────────────────────────────────────────────────────────────

interface QuickAddForm {
  firstName:    string
  lastName:     string
  phone:        string
  email:        string
  city:         string
  relationType: string
  relationName: string
  jaati:        string
}

const BLANK_QUICK_ADD: QuickAddForm = {
  firstName:    '',
  lastName:     '',
  phone:        '',
  email:        '',
  city:         '',
  relationType: 'son_of',
  relationName: '',
  jaati:        '',
}

interface EditableCustomerFields {
  firstName:    string
  lastName:     string
  phone:        string
  email:        string
  relationType: string
  relationName: string
  jaati:        string
  address:      string
}

// ── Component ──────────────────────────────────────────────────────────────────

export const CustomerSection = ({
  data,
  errors,
  onChange,
  disabled = false,
    mode,
}: GirviFormSectionProps) => {
  const { t } = useTranslation()
  const { currentShopId } = useAuth()
  const shopId = currentShopId || ''
  const { showSuccess, showError } = useNotification()

  const [searchQuery,      setSearchQuery]      = useState('')
  const [showSuggestions,  setShowSuggestions]  = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null)
  const [editableFields,   setEditableFields]   = useState<EditableCustomerFields | null>(null)
  const [isEditingFields,  setIsEditingFields]  = useState(false)
  const [showQuickAdd,     setShowQuickAdd]     = useState(false)
  const [quickAddForm,     setQuickAddForm]     = useState<QuickAddForm>(BLANK_QUICK_ADD)
  const [quickAddError,    setQuickAddError]    = useState('')

  const { customers, isLoading }                       = useCustomersList(shopId, { search: searchQuery, limit: 20 })
  const { createCustomer, updateCustomer, isCreating } = useCustomerActions(shopId)

  // ── Sync initialData (edit mode) ────────────────────────────────────────────
  useEffect(() => {
    if (data.customerId && data.customerName && !selectedCustomer) {
      const meta     = data._customerMeta ?? {}
      const customer = {
        _id:          data.customerId,
        firstName:    data.customerName.split(' ')[0] ?? '',
        lastName:     data.customerName.split(' ').slice(1).join(' ') ?? '',
        phone:        data.customerPhone ?? '',
        email:        data.customerEmail ?? '',
        customerCode: meta.customerCode,
        relationType: meta.relationType,
        relationName: meta.relationName,
        jaati:        meta.jaati,
        address:      meta.address,
      }
      setSelectedCustomer(customer)
      setEditableFields(buildEditable(customer))
      setSearchQuery(data.customerName)
    }
  }, [data.customerId])

  // ── Helpers ──────────────────────────────────────────────────────────────────
  const buildEditable = (customer: any): EditableCustomerFields => ({
    firstName:    customer.firstName     || '',
    lastName:     customer.lastName      || '',
    phone:        customer.phone         || '',
    email:        customer.email         || '',
    relationType: customer.relationType  || 'son_of',
    relationName: customer.relationName  || '',
    jaati:        customer.jaati         || '',
    address:      customer.address?.city || '',
  })

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleSelectCustomer = (customer: any) => {
    const name = `${customer.firstName} ${customer.lastName || ''}`.trim()
    setSelectedCustomer(customer)
    setEditableFields(buildEditable(customer))
    setIsEditingFields(false)
    setSearchQuery(name)
    setShowSuggestions(false)
    setShowQuickAdd(false)
    onChange('customerId',    customer._id)
    onChange('customerName',  name)
    onChange('customerPhone', customer.phone)
    onChange('customerEmail', customer.email ?? '')
  }

  const handleClear = () => {
    setSelectedCustomer(null)
    setEditableFields(null)
    setIsEditingFields(false)
    setSearchQuery('')
    onChange('customerId',    '')
    onChange('customerName',  '')
    onChange('customerPhone', '')
    onChange('customerEmail', '')
  }

  const handleApplyEdits = async () => {
    if (!editableFields || !selectedCustomer?._id) return

    const payload = {
      firstName:    editableFields.firstName,
      lastName:     editableFields.lastName,
      phone:        editableFields.phone,
      relationType: editableFields.relationType,
      relationName: editableFields.relationName,
      jaati:        editableFields.jaati,
      address:      { city: editableFields.address || undefined },
    }

    const result = await updateCustomer(selectedCustomer._id, payload)

    if (result.success) {
      const name = `${editableFields.firstName} ${editableFields.lastName}`.trim()
      onChange('customerName',  name)
      onChange('customerPhone', editableFields.phone)
      setSelectedCustomer((prev: any) => ({
        ...prev,
        ...payload,
        address: { ...(prev.address || {}), city: editableFields.address || undefined },
      }))
      setEditableFields(prev => prev ? { ...prev, address: editableFields.address } : prev)
      setIsEditingFields(false)
      showSuccess('Customer updated successfully', 'Success')
    } else {
      showError(result.error || 'Failed to update customer', 'Error')
    }
  }

  const handleQuickAddSubmit = async () => {
    setQuickAddError('')
    if (!quickAddForm.firstName.trim()) {
      setQuickAddError('First name is required')
      return
    }
    if (quickAddForm.phone && !/^[6-9][0-9]{9}$/.test(quickAddForm.phone.trim())) {
      setQuickAddError('Invalid phone number')
      return
    }

    const payload: any = {
      firstName:    quickAddForm.firstName.trim(),
      lastName:     quickAddForm.lastName.trim()     || undefined,
      phone:        quickAddForm.phone.trim()        || undefined,
      email:        quickAddForm.email.trim()        || undefined,
      address:      { city: quickAddForm.city.trim() || undefined },
      relationType: quickAddForm.relationType        || undefined,
      relationName: quickAddForm.relationName.trim() || undefined,
      jaati:        quickAddForm.jaati.trim()        || undefined,
    }

    const result = await createCustomer(payload)
    if (result.success && result.data) {
      handleSelectCustomer(result.data)
      setQuickAddForm(BLANK_QUICK_ADD)
      setShowQuickAdd(false)
      showSuccess('Customer created and selected', 'Customer Created')
    } else {
      const msg = result.error || 'Failed to create customer'
      setQuickAddError(msg)
      showError(msg, 'Error')
    }
  }

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">

      {/* ── Search ── */}
      <div className="space-y-1.5">
        <Label>
          {t('girvi.selectCustomer')}
          <span className="ml-1 text-status-error">*</span>
        </Label>

        <div className="relative">
<SearchBar
  value={searchQuery}
  onChange={val => {
    setSearchQuery(val)
    setShowSuggestions(val.length >= 2)
    if (selectedCustomer) handleClear()
  }}
  placeholder={t('girvi.searchCustomerPlaceholder')}
  disabled={disabled}
  debounceMs={300}
  showClearButton={mode !== 'edit'}
  className={errors.customerId ? '[&_input]:border-status-error' : ''}
/>


          {/* ── Suggestions Dropdown ── */}
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
                          <p className="font-semibold text-text-primary">
                            {customer.firstName} {customer.lastName || ''}
                          </p>
                          {customer.relationName && relationLabel && (
                            <p className="text-xs text-text-secondary">
                              {relationLabel} {customer.relationName}
                            </p>
                          )}
                          {customer.jaati && (
                            <p className="text-xs text-text-tertiary">{customer.jaati}</p>
                          )}
                          <p className="mt-0.5 text-sm text-text-secondary">
                            📱 {customer.phone}
                            {customer.customerCode && (
                              <span className="ml-2 text-text-tertiary">
                                #{customer.customerCode}
                              </span>
                            )}
                          </p>
                          {customer.email && (
                            <p className="text-xs text-text-tertiary">✉ {customer.email}</p>
                          )}
                          {customer.address?.city && (
                            <p className="text-xs text-text-tertiary">📍 {customer.address.city}</p>
                          )}
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
          <p className="text-sm text-status-error">{errors.customerId}</p>
        )}

        {/* Toggle Quick Add */}
        {!disabled && (
          <button
            type="button"
            onClick={() => { setShowQuickAdd(v => !v); setQuickAddError('') }}
            className="flex items-center gap-1.5 text-sm text-accent hover:underline"
          >
            {showQuickAdd
              ? <><ChevronUp  className="h-4 w-4" /> {t('common.cancel')}</>
              : <><UserPlus   className="h-4 w-4" /> {t('girvi.addNewCustomer')}</>
            }
          </button>
        )}
      </div>

      {/* ── Quick Add Form ── */}
      {showQuickAdd && !disabled && (
        <div className="rounded-lg border border-accent/30 bg-accent/5 p-4 space-y-3">
          <p className="text-sm font-semibold text-text-primary">
            {t('girvi.addNewCustomer')}
          </p>

          {/* First + Last name */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs">
                {t('customer.firstName')}
                <span className="ml-1 text-status-error">*</span>
              </Label>
              <Input
                type="text"
                value={quickAddForm.firstName}
                onChange={e => setQuickAddForm(f => ({ ...f, firstName: e.target.value }))}
                placeholder="Ramesh"
                maxLength={50}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">{t('customer.lastName')}</Label>
              <Input
                type="text"
                value={quickAddForm.lastName}
                onChange={e => setQuickAddForm(f => ({ ...f, lastName: e.target.value }))}
                placeholder="Kumar"
                maxLength={50}
              />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <Label className="text-xs">{t('customer.phone')}</Label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Phone className="h-4 w-4 text-text-tertiary" />
              </div>
              <Input
                type="tel"
                value={quickAddForm.phone}
                onChange={e => setQuickAddForm(f => ({
                  ...f, phone: e.target.value.replace(/\D/g, '').slice(0, 10),
                }))}
                placeholder="9876543210"
                className="pl-10"
              />
            </div>
          </div>

          {/* Relation type + name — stack on mobile, side-by-side on sm+ */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-5">
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs">{t('customer.relationType')}</Label>
              <Select
                value={quickAddForm.relationType}
                onValueChange={val => setQuickAddForm(f => ({ ...f, relationType: val }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RELATION_OPTIONS.map(o => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5 sm:col-span-3">
              <Label className="text-xs">{t('customer.relationName')}</Label>
              <Input
                type="text"
                value={quickAddForm.relationName}
                onChange={e => setQuickAddForm(f => ({ ...f, relationName: e.target.value }))}
                placeholder="Father / Husband name"
                maxLength={100}
              />
            </div>
          </div>

          {/* Jaati + City */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs">{t('customer.jaati')}</Label>
              <Input
                type="text"
                value={quickAddForm.jaati}
                onChange={e => setQuickAddForm(f => ({ ...f, jaati: e.target.value }))}
                placeholder="e.g. Agrawal, Soni, Jain..."
                maxLength={100}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">City</Label>
              <Input
                type="text"
                value={quickAddForm.city}
                onChange={e => setQuickAddForm(f => ({ ...f, city: e.target.value }))}
                placeholder="e.g. Bareilly, Agra..."
                maxLength={50}
              />
            </div>
          </div>

          {quickAddError && (
            <p className="text-sm text-status-error">⚠ {quickAddError}</p>
          )}

          {/* Actions — stack on mobile */}
          <div className="flex flex-col gap-2 pt-1 sm:flex-row">
            <Button
              type="button"
              onClick={handleQuickAddSubmit}
              disabled={isCreating}
              className="w-full sm:flex-1"
            >
              {isCreating
                ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...</>
                : <><UserPlus className="mr-2 h-4 w-4" /> Create & Select</>
              }
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => { setShowQuickAdd(false); setQuickAddError('') }}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* ── Selected Customer Card ── */}
      {selectedCustomer && editableFields && (
        <div className="rounded-lg border-2 border-accent/30 bg-accent/5 p-4 space-y-4">

          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-accent text-lg font-bold text-white">
                {selectedCustomer.firstName?.[0]?.toUpperCase()}
                {selectedCustomer.lastName?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-text-primary">
                  {editableFields.firstName} {editableFields.lastName}
                </p>
                {selectedCustomer.customerCode && (
                  <p className="text-xs text-text-tertiary">#{selectedCustomer.customerCode}</p>
                )}
              </div>
            </div>
            {!disabled && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsEditingFields(v => !v)}
              >
                <Edit2 className="mr-1.5 h-3.5 w-3.5" />
                {isEditingFields ? 'Cancel Edit' : 'Edit Details'}
              </Button>
            )}
          </div>

          {/* ── View Mode ── */}
          {!isEditingFields && (
            <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
              {editableFields.phone && (
                <p className="flex items-center gap-2 text-text-secondary">
                  <Phone className="h-3.5 w-3.5 flex-shrink-0" />
                  {editableFields.phone}
                </p>
              )}
              {editableFields.email && (
                <p className="flex items-center gap-2 text-text-secondary">
                  <Mail className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="truncate">{editableFields.email}</span>
                </p>
              )}
              {editableFields.relationName && (
                <p className="text-text-secondary">
                  <span className="font-medium">
                    {RELATION_LABELS[editableFields.relationType] ?? 'Rel.'}
                  </span>{' '}
                  {editableFields.relationName}
                </p>
              )}
              {editableFields.jaati && (
                <p className="text-text-secondary">
                  Jaati: <span className="font-medium">{editableFields.jaati}</span>
                </p>
              )}
              {editableFields.address && (
                <p className="flex items-center gap-2 text-text-secondary">
                  <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                  {editableFields.address}
                </p>
              )}
            </div>
          )}

          {/* ── Edit Mode ── */}
          {isEditingFields && !disabled && (
            <div className="space-y-3 border-t border-border-primary pt-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">
                Edit details for this girvi
              </p>

              {/* First + Last */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-xs">First Name</Label>
                  <Input
                    type="text"
                    value={editableFields.firstName}
                    onChange={e => setEditableFields(f => f ? { ...f, firstName: e.target.value } : f)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Last Name</Label>
                  <Input
                    type="text"
                    value={editableFields.lastName}
                    onChange={e => setEditableFields(f => f ? { ...f, lastName: e.target.value } : f)}
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-xs">Phone</Label>
                  <Input
                    type="tel"
                    value={editableFields.phone}
                    onChange={e => setEditableFields(f => f ? {
                      ...f, phone: e.target.value.replace(/\D/g, '').slice(0, 10),
                    } : f)}
                  />
                </div>
              </div>

              {/* Relation type + name */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-5">
                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="text-xs">Relation Type</Label>
                  <Select
                    value={editableFields.relationType}
                    onValueChange={val => setEditableFields(f => f ? { ...f, relationType: val } : f)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {RELATION_OPTIONS.map(o => (
                        <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5 sm:col-span-3">
                  <Label className="text-xs">Relation Name</Label>
                  <Input
                    type="text"
                    value={editableFields.relationName}
                    onChange={e => setEditableFields(f => f ? { ...f, relationName: e.target.value } : f)}
                    placeholder="Father / Husband name"
                    maxLength={100}
                  />
                </div>
              </div>

              {/* Jaati + City */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-xs">Jaati</Label>
                  <Input
                    type="text"
                    value={editableFields.jaati}
                    onChange={e => setEditableFields(f => f ? { ...f, jaati: e.target.value } : f)}
                    placeholder="e.g. Agrawal, Soni..."
                    maxLength={100}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">City</Label>
                  <Input
                    type="text"
                    value={editableFields.address}
                    onChange={e => setEditableFields(f => f ? { ...f, address: e.target.value } : f)}
                    placeholder="e.g. Bareilly, Agra..."
                    maxLength={50}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-1 sm:flex-row">
                <Button
                  type="button"
                  onClick={handleApplyEdits}
                  className="w-full sm:flex-1"
                >
                  <Check className="mr-2 h-4 w-4" /> Apply Changes
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditableFields(buildEditable(selectedCustomer))
                    setIsEditingFields(false)
                  }}
                  className="w-full sm:w-auto"
                >
                  Reset
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}