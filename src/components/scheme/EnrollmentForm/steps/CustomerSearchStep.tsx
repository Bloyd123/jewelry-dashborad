// FILE: src/components/scheme/EnrollmentForm/steps/CustomerSearchStep.tsx

import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Search, User, X }  from 'lucide-react'
import { useCustomerSearch } from '@/hooks/customer/useCustomerSearch'
import type { EnrollmentFormData } from '../EnrollmentForm.types'

interface CustomerSearchStepProps {
  shopId:   string
  formData: EnrollmentFormData
  errors:   Record<string, string>
  onChange: (field: string, value: any) => void
}

export const CustomerSearchStep: React.FC<CustomerSearchStepProps> = ({
  shopId,
  formData,
  errors,
  onChange,
}) => {
  const { t }                          = useTranslation()
  const { searchCustomer, isSearching } = useCustomerSearch(shopId)

  const [searchQuery,   setSearchQuery]   = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [showDropdown,  setShowDropdown]  = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Click outside close
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
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
        setSearchResults(
          Array.isArray(result.customer)
            ? result.customer
            : [result.customer]
        )
      } else {
        setSearchResults([])
      }
    }, 400)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const handleSelect = (customer: any) => {
    onChange('customerId', customer._id)
    onChange('selectedCustomer', {
      _id:          customer._id,
      firstName:    customer.firstName,
      lastName:     customer.lastName,
      customerCode: customer.customerCode,
      phone:        customer.phone,
    })
    setSearchQuery('')
    setShowDropdown(false)
    setSearchResults([])
  }

  const handleClear = () => {
    onChange('customerId', '')
    onChange('selectedCustomer', undefined)
    setSearchQuery('')
    setSearchResults([])
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="mb-4 text-sm text-text-secondary">
          {t('scheme.enrollment.searchCustomerDesc')}
        </p>

        {/* Selected Customer */}
        {formData.selectedCustomer ? (
          <div className="flex items-center justify-between rounded-lg border border-accent/30 bg-accent/5 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                <User className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary">
                  {formData.selectedCustomer.firstName}{' '}
                  {formData.selectedCustomer.lastName || ''}
                </p>
                <p className="text-xs text-text-tertiary">
                  {formData.selectedCustomer.customerCode} •{' '}
                  {formData.selectedCustomer.phone}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleClear}
              className="rounded-full p-1.5 text-text-tertiary hover:bg-bg-tertiary hover:text-text-primary"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          /* Search Input */
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
                placeholder={t('scheme.enrollment.searchCustomerPlaceholder')}
                className={`
                  w-full rounded-md border py-2.5 pl-9 pr-3 text-sm
                  bg-bg-secondary text-text-primary
                  placeholder:text-text-tertiary
                  focus:outline-none focus:ring-2 focus:ring-accent
                  ${errors.customerId
                    ? 'border-status-error'
                    : 'border-border-primary focus:border-accent'
                  }
                `}
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-accent border-t-transparent" />
                </div>
              )}
            </div>

            {/* Dropdown */}
            {showDropdown && searchQuery.length >= 2 && (
              <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-lg border border-border-primary bg-bg-secondary shadow-lg">
                {searchResults.length > 0 ? (
                  searchResults.map(customer => (
                    <button
                      key={customer._id}
                      type="button"
                      onClick={() => handleSelect(customer)}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-bg-tertiary"
                    >
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-accent/10">
                        <User className="h-4 w-4 text-accent" />
                      </div>
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
                  <div className="px-4 py-3 text-center text-sm text-text-tertiary">
                    {isSearching
                      ? t('common.searching')
                      : t('customer.noCustomerFound')}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Error */}
        {errors.customerId && (
          <p className="mt-1.5 text-sm text-status-error">
            {errors.customerId}
          </p>
        )}
      </div>

      {/* Helper Text */}
      {!formData.selectedCustomer && (
        <div className="rounded-lg border border-border-primary bg-bg-tertiary p-4">
          <p className="text-xs text-text-tertiary">
            💡 {t('scheme.enrollment.searchTip')}
          </p>
        </div>
      )}
    </div>
  )
}