
// FILE: src/components/sales/SalesFilters/CustomerFilter.tsx
// Customer Search/Select Filter


import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { Search, User } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Customer {
  _id: string
  customerName: string
  customerCode: string
  phone: string
}

interface CustomerFilterProps {
  value?: string
  onChange: (value: string | undefined) => void
  customers?: Customer[]
  className?: string
  disabled?: boolean
}

export const CustomerFilter = React.forwardRef<
  HTMLInputElement,
  CustomerFilterProps
>(({ value, onChange, customers = [], className, disabled = false }, ref) => {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = React.useState('')
  const [showDropdown, setShowDropdown] = React.useState(false)

  const filteredCustomers = React.useMemo(() => {
    if (!searchQuery) return customers.slice(0, 10)

    const query = searchQuery.toLowerCase()
    return customers
      .filter(
        customer =>
          customer.customerName.toLowerCase().includes(query) ||
          customer.customerCode.toLowerCase().includes(query) ||
          customer.phone.includes(query)
      )
      .slice(0, 10)
  }, [customers, searchQuery])

  const selectedCustomer = customers.find(c => c._id === value)

  const handleSelect = (customer: Customer) => {
    onChange(customer._id)
    setSearchQuery('')
    setShowDropdown(false)
  }

  const handleClear = () => {
    onChange(undefined)
    setSearchQuery('')
  }

  return (
    <div className={cn('relative', className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary" />
        {selectedCustomer ? (
          <div className="flex h-10 w-full items-center gap-2 rounded-md border border-border-primary bg-bg-secondary px-3 pl-10">
            <User className="h-4 w-4 text-text-tertiary" />
            <span className="flex-1 text-sm text-text-primary">
              {selectedCustomer.customerName}
            </span>
            <button
              onClick={handleClear}
              className="text-text-tertiary hover:text-text-primary"
              disabled={disabled}
            >
              ×
            </button>
          </div>
        ) : (
          <input
            ref={ref}
            type="text"
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value)
              setShowDropdown(true)
            }}
            onFocus={() => setShowDropdown(true)}
            placeholder={t('sales.filters.searchCustomer')}
            disabled={disabled}
            className="flex h-10 w-full rounded-md border border-border-primary bg-bg-secondary px-3 pl-10 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent disabled:cursor-not-allowed disabled:opacity-50"
          />
        )}
      </div>

      {showDropdown && !selectedCustomer && filteredCustomers.length > 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-border-primary bg-bg-secondary shadow-lg">
          <div className="max-h-60 overflow-auto p-1">
            {filteredCustomers.map(customer => (
              <button
                key={customer._id}
                onClick={() => handleSelect(customer)}
                className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left hover:bg-bg-tertiary"
              >
                <User className="h-4 w-4 text-text-tertiary" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-text-primary">
                    {customer.customerName}
                  </div>
                  <div className="text-xs text-text-tertiary">
                    {customer.customerCode} • {customer.phone}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
})

CustomerFilter.displayName = 'CustomerFilter'
