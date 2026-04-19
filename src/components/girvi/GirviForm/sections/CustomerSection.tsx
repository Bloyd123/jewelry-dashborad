// FILE: src/components/girvi/GirviForm/sections/CustomerSection.tsx
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Search, UserPlus, Phone, Mail, MapPin, X,
  ChevronDown, ChevronUp, Loader2, Edit2, Check,
} from 'lucide-react'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/auth'
import { useCustomersList } from '@/hooks/customer/useCustomersList'
import { useCustomerActions } from '@/hooks/customer/useCustomerActions'
import { useNotification } from '@/hooks/useNotification'
import type { GirviFormSectionProps } from '../GirviForm.types'

const RELATION_LABELS: Record<string, string> = {
  son_of:      'S/O',
  daughter_of: 'D/O',
  husband_of:  'H/O',
  wife_of:     'W/O',
  other:       'Rel.',
}
interface QuickAddForm {
  firstName: string
  lastName: string
  phone: string
  email: string        // ✅ added
  city: string         // ✅ added
  relationType: string
  relationName: string
  jaati: string
}


const BLANK_QUICK_ADD: QuickAddForm = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',        
  city: '',         
  relationType: 'son_of',
  relationName: '',
  jaati: '',
}

// Editable fields shown after customer is selected
interface EditableCustomerFields {
  firstName:    string
  lastName:     string
  phone:        string
  email:        string
  relationType: string
  relationName: string
  jaati:        string
  address:      string   // city only for display simplicity
}

export const CustomerSection = ({
  data,
  errors,
  onChange,
  disabled = false,
}: GirviFormSectionProps) => {
  const { t } = useTranslation()
  const { currentShopId } = useAuth()
  const shopId = currentShopId || ''
  const { showSuccess, showError } = useNotification()

  const [searchQuery,      setSearchQuery]      = useState('')
  const [showSuggestions,  setShowSuggestions]  = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null)

  // Editable selected-customer state
  const [editableFields,  setEditableFields]   = useState<EditableCustomerFields | null>(null)
  const [isEditingFields, setIsEditingFields]  = useState(false)

  // Quick Add state
  const [showQuickAdd,  setShowQuickAdd]  = useState(false)
  const [quickAddForm,  setQuickAddForm]  = useState<QuickAddForm>(BLANK_QUICK_ADD)
  const [quickAddError, setQuickAddError] = useState('')

  const { customers, isLoading } = useCustomersList(shopId, {
    search: searchQuery,
    limit:  20,
  })

const { createCustomer, updateCustomer, isCreating } = useCustomerActions(shopId)
  // ── helpers ────────────────────────────────────────────────────────────────

  const buildEditable = (customer: any): EditableCustomerFields => ({
    firstName:    customer.firstName        || '',
    lastName:     customer.lastName         || '',
    phone:        customer.phone            || '',
    email:        customer.email            || '',
    relationType: customer.relationType     || 'son_of',
    relationName: customer.relationName     || '',
    jaati:        customer.jaati            || '',
    address:      customer.address?.city    || '',
  })

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
    firstName: editableFields.firstName,
    lastName: editableFields.lastName,
    phone: editableFields.phone,
    relationType: editableFields.relationType,
    relationName: editableFields.relationName,
    jaati: editableFields.jaati,
  }

  const result = await updateCustomer(selectedCustomer._id, payload)

  if (result.success) {
    const name = `${editableFields.firstName} ${editableFields.lastName}`.trim()

    onChange('customerName', name)
    onChange('customerPhone', editableFields.phone)

    setSelectedCustomer((prev: any) => ({
      ...prev,
      ...payload,
    }))

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
    // if (!/^[6-9][0-9]{9}$/.test(quickAddForm.phone.trim())) {
    //   setQuickAddError('Valid 10-digit phone number required')
    //   return
    // }
    if (
  quickAddForm.phone &&
  !/^[6-9][0-9]{9}$/.test(quickAddForm.phone.trim())
) {
  setQuickAddError('Invalid phone number')
  return
}

const payload: any = {
  firstName: quickAddForm.firstName.trim(),
  lastName: quickAddForm.lastName.trim() || undefined,
  // phone: quickAddForm.phone.trim(),
  phone: quickAddForm.phone.trim() || undefined,

  email: quickAddForm.email.trim() || undefined,   

  address: { city: quickAddForm.city.trim() || undefined,   },

  relationType: quickAddForm.relationType || undefined,
  relationName: quickAddForm.relationName.trim() || undefined,
  jaati: quickAddForm.jaati.trim() || undefined,
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

  // ── render ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-4">

      {/* ── Search Box ── */}
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

          {/* ── Dropdown suggestions ── */}
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

      {/* ── Quick Add Form ── */}
      {showQuickAdd && !disabled && (
        <div className="rounded-lg border border-accent/30 bg-accent/5 p-4 space-y-3">
          <p className="text-sm font-semibold text-text-primary">
            {t('girvi.addNewCustomer')}
          </p>

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

          <div className="space-y-1">
            <label className="text-xs font-medium text-text-secondary">
              {t('customer.phone')} 
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-text-tertiary">
                       <Phone className="h-4 w-4 text-text-tertiary" />
             
              </span>
              <input
                type="tel"
                value={quickAddForm.phone}
                onChange={e => setQuickAddForm(f => ({
                  ...f, phone: e.target.value.replace(/\D/g, '').slice(0, 10),
                }))}
                placeholder="9876543210"
                className="h-9 w-full rounded-lg border border-border-primary bg-bg-secondary pl-8 pr-3 text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>

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

          {quickAddError && (
            <p className="text-sm text-status-error">⚠ {quickAddError}</p>
          )}

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

      {/* ── Selected Customer Card with Editable Fields ── */}
      {selectedCustomer && editableFields && (
        <div className="rounded-lg border-2 border-accent/30 bg-accent/5 p-4 space-y-4">

          {/* Header */}
          <div className="flex items-center justify-between">
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
              <button
                type="button"
                onClick={() => setIsEditingFields(v => !v)}
                className="flex items-center gap-1.5 rounded-lg border border-border-primary px-3 py-1.5 text-xs font-medium text-text-secondary hover:bg-bg-tertiary"
              >
                <Edit2 className="h-3.5 w-3.5" />
                {isEditingFields ? 'Cancel Edit' : 'Edit Details'}
              </button>
            )}
          </div>

          {/* ── Non-edit mode: display all fields ── */}
          {!isEditingFields && (
            <div className="grid grid-cols-1 gap-1.5 text-sm sm:grid-cols-2">
              {editableFields.phone && (
                <p className="flex items-center gap-2 text-text-secondary">
                  <Phone className="h-3.5 w-3.5 flex-shrink-0" />
                  {editableFields.phone}
                </p>
              )}
              {editableFields.email && (
                <p className="flex items-center gap-2 text-text-secondary">
                  <Mail className="h-3.5 w-3.5 flex-shrink-0" />
                  {editableFields.email}
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

          {/* ── Edit mode: all fields editable ── */}
          {isEditingFields && !disabled && (
            <div className="space-y-3 border-t border-border-primary pt-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">
                Edit details for this girvi
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-text-secondary">First Name</label>
                  <input
                    type="text"
                    value={editableFields.firstName}
                    onChange={e => setEditableFields(f => f ? { ...f, firstName: e.target.value } : f)}
                    className="h-9 w-full rounded-lg border border-border-primary bg-bg-secondary px-3 text-sm text-text-primary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-text-secondary">Last Name</label>
                  <input
                    type="text"
                    value={editableFields.lastName}
                    onChange={e => setEditableFields(f => f ? { ...f, lastName: e.target.value } : f)}
                    className="h-9 w-full rounded-lg border border-border-primary bg-bg-secondary px-3 text-sm text-text-primary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-text-secondary">Phone</label>
                  <input
                    type="tel"
                    value={editableFields.phone}
                    onChange={e => setEditableFields(f => f ? {
                      ...f, phone: e.target.value.replace(/\D/g, '').slice(0, 10),
                    } : f)}
                    className="h-9 w-full rounded-lg border border-border-primary bg-bg-secondary px-3 text-sm text-text-primary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

              </div>

              <div className="grid grid-cols-5 gap-3">
                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-medium text-text-secondary">Relation Type</label>
                  <select
                    value={editableFields.relationType}
                    onChange={e => setEditableFields(f => f ? { ...f, relationType: e.target.value } : f)}
                    className="h-9 w-full rounded-lg border border-border-primary bg-bg-secondary px-2 text-sm text-text-primary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    <option value="son_of">S/O</option>
                    <option value="daughter_of">D/O</option>
                    <option value="husband_of">H/O</option>
                    <option value="wife_of">W/O</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="col-span-3 space-y-1">
                  <label className="text-xs font-medium text-text-secondary">Relation Name</label>
                  <input
                    type="text"
                    value={editableFields.relationName}
                    onChange={e => setEditableFields(f => f ? { ...f, relationName: e.target.value } : f)}
                    placeholder="Father / Husband name"
                    maxLength={100}
                    className="h-9 w-full rounded-lg border border-border-primary bg-bg-secondary px-3 text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-text-secondary">Jaati</label>
                  <input
                    type="text"
                    value={editableFields.jaati}
                    onChange={e => setEditableFields(f => f ? { ...f, jaati: e.target.value } : f)}
                    placeholder="e.g. Agrawal, Soni..."
                    maxLength={100}
                    className="h-9 w-full rounded-lg border border-border-primary bg-bg-secondary px-3 text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleApplyEdits}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90"
                >
                  <Check className="h-4 w-4" /> Apply Changes
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditableFields(buildEditable(selectedCustomer))
                    setIsEditingFields(false)
                  }}
                  className="rounded-lg border border-border-primary px-4 py-2 text-sm font-medium text-text-secondary hover:bg-bg-tertiary"
                >
                  Reset
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}