// FILE: src/components/customer/CustomerForm/sections/PreferencesSection.tsx
import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { FormSelect } from '@/components/forms/FormSelect'
import { FormInput } from '@/components/forms/FormInput'
import { useCustomerSearch } from '@/hooks/customer/useCustomerSearch'
import { useAuth } from '@/hooks/auth'
import { Search, X, User } from 'lucide-react'
import type { FormSectionProps } from '@/components/customer/CustomerForm/CustomerForm.types'


export const PreferencesSection = ({
  data,
  errors,
  onChange,
  onBlur,
  disabled,
}: FormSectionProps) => {
  const { t } = useTranslation()
  const { currentShopId } = useAuth()
  const { searchCustomer, isSearching } = useCustomerSearch(currentShopId!)

  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Debounced search
  useEffect(() => {
    if (!searchQuery || searchQuery.length < 2) {
      setSearchResults([])
      return
    }
    const timer = setTimeout(async () => {
      const result = await searchCustomer({ search: searchQuery })
      if (result.success && result.customer) {
        setSearchResults([result.customer])
      } else {
        setSearchResults([])
      }
    }, 400)
    return () => clearTimeout(timer)
  }, [searchQuery])
    const handleSelectCustomer = (customer: any) => {
    setSelectedCustomer(customer)
    onChange('referredBy', customer._id)
    setSearchQuery('')
    setShowDropdown(false)
  }

  const handleClearSelected = () => {
    setSelectedCustomer(null)
    onChange('referredBy', '')
    setSearchQuery('')
  }
  const metalOptions = [
    { value: 'gold', label: t('customer.metal.gold') },
    { value: 'silver', label: t('customer.metal.silver') },
    { value: 'platinum', label: t('customer.metal.platinum') },
    { value: 'diamond', label: t('customer.metal.diamond') },
  ]

  const communicationOptions = [
    { value: 'email', label: t('customer.communication.email') },
    { value: 'sms', label: t('customer.communication.sms') },
    { value: 'whatsapp', label: t('customer.communication.whatsapp') },
    { value: 'call', label: t('customer.communication.call') },
    { value: 'none', label: t('customer.communication.none') },
  ]

  const sourceOptions = [
    { value: 'walk_in', label: t('customer.source.walkIn') },
    { value: 'referral', label: t('customer.source.referral') },
    { value: 'online', label: t('customer.source.online') },
    { value: 'phone', label: t('customer.source.phone') },
    { value: 'social_media', label: t('customer.source.socialMedia') },
    { value: 'advertisement', label: t('customer.source.advertisement') },
    { value: 'other', label: t('customer.source.other') },
  ]

  const handlePreferenceChange = (field: string, value: string) => {
    onChange('preferences', {
      ...data.preferences,
      [field]: value,
    })
  }

  return (
    <div className="space-y-4">
      <FormSelect
        name="preferences.preferredMetal"
        label={t('customer.preferredMetal')}
        value={data.preferences?.preferredMetal || ''}
        onChange={(_, value) => handlePreferenceChange('preferredMetal', value)}
        onBlur={() => onBlur?.('preferences.preferredMetal')}
        error={errors['preferences.preferredMetal']}
        placeholder={t('customer.selectMetal')}
        options={metalOptions}
        disabled={disabled}
      />

      <FormSelect
        name="preferences.communicationPreference"
        label={t('customer.communicationPreference')}
        value={data.preferences?.communicationPreference || ''}
        onChange={(_, value) =>
          handlePreferenceChange('communicationPreference', value)
        }
        onBlur={() => onBlur?.('preferences.communicationPreference')}
        error={errors['preferences.communicationPreference']}
        placeholder={t('customer.selectCommunication')}
        options={communicationOptions}
        disabled={disabled}
      />

      <FormSelect
        name="source"
        label={t('customer.customersource')}
        value={data.source || ''}
        onChange={onChange}
        onBlur={onBlur}
        error={errors.source}
        placeholder={t('customer.selectSource')}
        options={sourceOptions}
        disabled={disabled}
      />

{data.source === 'referral' && (
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-text-primary">
            {t('customer.referredBy')}
            <span className="ml-1 text-status-error">*</span>
          </label>

          {selectedCustomer ? (
            // Selected customer chip
            <div className="flex items-center justify-between rounded-lg border border-border-primary bg-bg-secondary px-3 py-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-text-tertiary" />
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    {selectedCustomer.firstName} {selectedCustomer.lastName || ''}
                  </p>
                  <p className="text-xs text-text-tertiary">
                    {selectedCustomer.customerCode} • {selectedCustomer.phone}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleClearSelected}
                disabled={disabled}
                className="rounded-full p-1 text-text-tertiary hover:bg-bg-tertiary hover:text-text-primary"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            // Search input with dropdown
            <div ref={dropdownRef} className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => {
                    setSearchQuery(e.target.value)
                    setShowDropdown(true)
                  }}
                  onFocus={() => setShowDropdown(true)}
                  placeholder={t('customer.searchReferredBy')}
                  disabled={disabled}
                  className="w-full rounded-md border border-border-primary bg-bg-secondary py-2 pl-9 pr-3 text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none"
                />
                {isSearching && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-accent border-t-transparent" />
                  </div>
                )}
              </div>

              {showDropdown && searchQuery.length >= 2 && (
                <div className="absolute z-50 mt-1 w-full rounded-lg border border-border-primary bg-bg-secondary shadow-lg">
                  {searchResults.length > 0 ? (
                    searchResults.map(customer => (
                      <button
                        key={customer._id}
                        type="button"
                        onClick={() => handleSelectCustomer(customer)}
                        className="flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-bg-tertiary"
                      >
                        <User className="h-4 w-4 flex-shrink-0 text-text-tertiary" />
                        <div>
                          <p className="text-sm font-medium text-text-primary">
                            {customer.firstName} {customer.lastName || ''}
                          </p>
                          <p className="text-xs text-text-tertiary">
                            {customer.customerCode} • {customer.phone}
                          </p>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-3 text-center text-sm text-text-tertiary">
                      {isSearching ? t('common.searching') : t('customer.noCustomerFound')}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {errors.referredBy && (
            <p className="text-sm text-status-error">{errors.referredBy}</p>
          )}
        </div>
      )} 
    </div>
  )
}
