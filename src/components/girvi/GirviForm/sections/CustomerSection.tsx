// FILE: src/components/girvi/GirviForm/sections/CustomerSection.tsx
// Customer search — mirrors PartyDetailsSection from payment module
// but customers ONLY (no supplier/other toggle needed for girvi)

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Search, UserPlus, Phone, Mail, MapPin } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/auth'
import { useCustomersList } from '@/hooks/customer/useCustomersList'
import type { GirviFormSectionProps } from '../GirviForm.types'

export const CustomerSection = ({
  data,
  errors,
  onChange,
  disabled = false,
}: GirviFormSectionProps) => {
  const { t } = useTranslation()
  const { currentShopId } = useAuth()
  const shopId = currentShopId || ''

  const [searchQuery,    setSearchQuery]    = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null)

  const { customers, isLoading } = useCustomersList(shopId, {
    search: searchQuery,
    limit: 20,
  })

  const handleSelectCustomer = (customer: any) => {
    const name = `${customer.firstName} ${customer.lastName}`
    setSelectedCustomer(customer)
    setSearchQuery(name)
    setShowSuggestions(false)
    onChange('customerId',    customer._id)
    onChange('customerName',  name)
    onChange('customerPhone', customer.phone)
    onChange('customerEmail', customer.email ?? '')
  }

  const handleClear = () => {
    setSelectedCustomer(null)
    setSearchQuery('')
    onChange('customerId',    '')
    onChange('customerName',  '')
    onChange('customerPhone', '')
    onChange('customerEmail', '')
  }

  return (
    <div className="space-y-4">
      {/* Search Input */}
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

          {/* Clear button */}
          {selectedCustomer && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-text-tertiary hover:text-text-primary"
            >
              ✕
            </button>
          )}

          {/* Dropdown */}
          {showSuggestions && searchQuery.length >= 2 && (
            <div className="absolute z-10 mt-1 max-h-64 w-full overflow-auto rounded-lg border border-border-primary bg-bg-secondary shadow-lg">
              {isLoading ? (
                <div className="p-3 text-center text-sm text-text-secondary">
                  {t('common.searching')}...
                </div>
              ) : customers.length === 0 ? (
                <div className="p-3 text-center text-sm text-text-secondary">
                  {t('girvi.noCustomersFound')}
                </div>
              ) : (
                customers.map((customer: any) => (
                  <button
                    key={customer._id}
                    type="button"
                    onClick={() => handleSelectCustomer(customer)}
                    className="w-full border-b border-border-secondary p-3 text-left transition-colors hover:bg-bg-tertiary"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-text-primary">
                          {customer.firstName} {customer.lastName}
                        </p>
                        <p className="text-sm text-text-secondary">
                          📱 {customer.phone}
                          {customer.customerCode && (
                            <span className="ml-2 text-text-tertiary">
                              #{customer.customerCode}
                            </span>
                          )}
                        </p>
                      </div>
                      {customer.creditLimit !== undefined && (
                        <p className="text-sm font-medium text-text-tertiary">
                          Limit: ₹{customer.creditLimit?.toLocaleString('en-IN')}
                        </p>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {errors.customerId && (
          <p className="text-sm text-status-error">⚠️ {errors.customerId}</p>
        )}

        <button
          type="button"
          disabled={disabled}
          className="flex items-center gap-2 text-sm text-accent hover:underline disabled:opacity-50"
        >
          <UserPlus className="h-4 w-4" />
          {t('girvi.addNewCustomer')}
        </button>
      </div>

      {/* Selected Customer Card */}
      {selectedCustomer && (
        <div className="border-accent/30 bg-accent/5 rounded-lg border-2 p-4">
          <div className="flex items-start gap-3">
            {/* Avatar */}
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-accent text-lg font-bold text-white">
              {selectedCustomer.firstName?.[0]?.toUpperCase()}
              {selectedCustomer.lastName?.[0]?.toUpperCase()}
            </div>

            {/* Info */}
            <div className="flex-1 space-y-1">
              <p className="font-bold text-text-primary">
                {selectedCustomer.firstName} {selectedCustomer.lastName}
              </p>
              {selectedCustomer.customerCode && (
                <p className="text-xs text-text-tertiary">
                  #{selectedCustomer.customerCode}
                </p>
              )}
              <div className="space-y-1 text-sm text-text-secondary">
                {selectedCustomer.phone && (
                  <p className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5" />
                    {selectedCustomer.phone}
                  </p>
                )}
                {selectedCustomer.email && (
                  <p className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5" />
                    {selectedCustomer.email}
                  </p>
                )}
                {selectedCustomer.address?.city && (
                  <p className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5" />
                    {selectedCustomer.address.city}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}