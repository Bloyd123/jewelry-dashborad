// FILE: src/components/payment/PaymentForm/sections/PartyDetailsSection.tsx
// Party Details Section (Customer/Supplier Selection with Smart Search)

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Search,
  UserPlus,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/auth'
import type { FormSectionProps } from '../PaymentForm.types'
import { useCustomersList } from '@/hooks/customer/useCustomersList'
import { useSuppliersList } from '@/hooks/supplier/useSuppliersList'

export const PartyDetailsSection = ({
  data,
  errors,
  onChange,
  onBlur,
  disabled = false,
}: FormSectionProps) => {
    const { t } = useTranslation()
  const { currentShopId } = useAuth()
  const shopId = currentShopId || ''
  const [searchQuery, setSearchQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedParty, setSelectedParty] = useState<any>(null)

  const { customers, isLoading: isLoadingCustomers } = useCustomersList(
    shopId,
    { search: searchQuery, limit: 20 },
  )

const { suppliers, isLoading: isLoadingSuppliers } = useSuppliersList(
  shopId,
  { search: searchQuery || undefined, limit: 20 },
)


const isSearching = isLoadingCustomers || isLoadingSuppliers

const filteredParties = (
  data.partyType === 'customer'
    ? customers.map(c => ({
        id:              c._id,
        type:            'customer',
        name:            `${c.firstName} ${c.lastName}`,
        phone:           c.phone,
        email:           c.email ?? '',
        address:         c.address?.city ?? '',
        balance:         c.creditLimit ?? 0,
        balanceType:     'due',
        lastPaymentDate: c.updatedAt,
      }))
      
    : data.partyType === 'supplier'
? suppliers.map(s => ({
  id:              s._id,
  type:            'supplier',
  name:            s.displayName || s.businessName,
  phone:           s.contactPerson.phone || s.businessPhone || '',
  email:           s.contactPerson.email || s.businessEmail || '',
  address:         s.address?.city ?? '',
  balance:         s.totalDue ?? 0,
  balanceType:     s.totalDue > 0 ? 'payable' : 'clear',
  lastPaymentDate: s.updatedAt,
}))
      : []
)


  const handlePartyTypeChange = (type: 'customer' | 'supplier' | 'other') => {
    onChange('partyType', type)
    setSelectedParty(null)
    setSearchQuery('')
    onChange('partyId', '')
    onChange('partyName', '')
    onChange('partyPhone', '')
    onChange('partyEmail', '')
  }

  const handleSelectParty = (party: any) => {
    setSelectedParty(party)
    setSearchQuery(party.name)
    setShowSuggestions(false)
    onChange('partyId', party.id)
    onChange('partyName', party.name)
    onChange('partyPhone', party.phone)
    onChange('partyEmail', party.email)
  }

  return (
    <div className="space-y-4">
      {/* Party Type Selection */}
      <div className="space-y-2">
        <Label className="text-text-primary">
          {t('payment.partyType')}
          <span className="ml-1 text-status-error">*</span>
        </Label>

        <div className="flex gap-4">
          {/* Customer */}
          <label
            className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border-2 p-3 transition-all ${
              data.partyType === 'customer'
                ? 'bg-accent/10 border-accent text-accent'
                : 'border-border-primary bg-bg-secondary text-text-secondary hover:bg-bg-tertiary'
            } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            <input
              type="radio"
              name="partyType"
              value="customer"
              checked={data.partyType === 'customer'}
              onChange={() => handlePartyTypeChange('customer')}
              disabled={disabled}
              className="sr-only"
            />
            <span className="font-medium">{t('payment.customer')}</span>
          </label>

          {/* Supplier */}
          <label
            className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border-2 p-3 transition-all ${
              data.partyType === 'supplier'
                ? 'bg-accent/10 border-accent text-accent'
                : 'border-border-primary bg-bg-secondary text-text-secondary hover:bg-bg-tertiary'
            } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            <input
              type="radio"
              name="partyType"
              value="supplier"
              checked={data.partyType === 'supplier'}
              onChange={() => handlePartyTypeChange('supplier')}
              disabled={disabled}
              className="sr-only"
            />
            <span className="font-medium">{t('payment.supplier')}</span>
          </label>

          {/* Other */}
          <label
            className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border-2 p-3 transition-all ${
              data.partyType === 'other'
                ? 'bg-accent/10 border-accent text-accent'
                : 'border-border-primary bg-bg-secondary text-text-secondary hover:bg-bg-tertiary'
            } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            <input
              type="radio"
              name="partyType"
              value="other"
              checked={data.partyType === 'other'}
              onChange={() => handlePartyTypeChange('other')}
              disabled={disabled}
              className="sr-only"
            />
            <span className="font-medium">{t('payment.other')}</span>
          </label>
        </div>

        {errors.partyType && (
          <p className="text-sm text-status-error">{errors.partyType}</p>
        )}
      </div>

      {/* Party Search */}
      <div className="space-y-2">
        <Label className="text-text-primary">
          {t('payment.selectParty')}
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
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => {
              // Delay to allow click on suggestion
              setTimeout(() => setShowSuggestions(false), 200)
            }}
            disabled={disabled}
            placeholder={t('payment.searchByNamePhone')}
            className={`h-12 w-full rounded-lg border bg-bg-secondary pl-10 pr-4 text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent disabled:bg-bg-tertiary ${
              errors.partyId
                ? 'border-status-error focus:border-status-error focus:ring-status-error'
                : 'border-border-primary'
            }`}
          />

          {/* Suggestions Dropdown */}
{showSuggestions && searchQuery.length >= 2 && (
  <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-border-primary bg-bg-secondary shadow-lg">
    {isSearching ? (
      <div className="p-3 text-center text-sm text-text-secondary">
        {t('common.searching')}...
      </div>
    ) : filteredParties.length === 0 ? (
      <div className="p-3 text-center text-sm text-text-secondary">
        {t('payment.noPartiesFound')}
      </div>
    ) : (
      filteredParties.map(party => (
                  <button
                    key={party.id}
                    type="button"
                    onClick={() => handleSelectParty(party)}
                    className="w-full border-b border-border-secondary p-3 text-left transition-colors hover:bg-bg-tertiary"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-text-primary">
                          {party.name}
                        </p>
<p className="text-sm text-text-secondary">
  📱 {party.phone} |{' '}
  {party.type === 'customer' ? t('payment.customer') : t('payment.supplier')}
</p>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-sm font-medium ${
                            party.balanceType === 'due'
                              ? 'text-status-error'
                              : party.balanceType === 'clear'
                                ? 'text-status-success'
                                : 'text-status-warning'
                          }`}
                        >
                          {party.balance > 0
                            ? `₹${party.balance.toLocaleString('en-IN')} ${party.balanceType}`
                            : 'Clear'}
                        </p>
                      </div>
                    </div>
                  </button>
      ))
    )}
  </div>
)}
        </div>

        {errors.partyId && (
          <p className="text-sm text-status-error">{errors.partyId}</p>
        )}

        {/* Add New Party Button */}
        <button
          type="button"
          disabled={disabled}
          className="flex items-center gap-2 text-sm text-accent hover:underline disabled:opacity-50"
        >
          <UserPlus className="h-4 w-4" />
          {t('payment.addNewParty')}
        </button>
      </div>

      {/* Selected Party Card */}
      {selectedParty && (
        <div className="border-accent/30 bg-accent/5 rounded-lg border-2 p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">👤</span>
                <div>
                  <h4 className="font-bold text-text-primary">
                    {selectedParty.name}
                  </h4>
                  <p className="text-sm text-text-secondary">
                    {selectedParty.type === 'customer'
                      ? t('payment.customer')
                      : t('payment.supplier')}
                  </p>
                </div>
              </div>

              <div className="space-y-1 text-sm text-text-secondary">
                {selectedParty.phone && (
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {selectedParty.phone}
                  </p>
                )}
                {selectedParty.email && (
                  <p className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {selectedParty.email}
                  </p>
                )}
                {selectedParty.address && (
                  <p className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {selectedParty.address}
                  </p>
                )}
              </div>
            </div>

            <div className="text-right">
              <p className="text-xs text-text-tertiary">
                {t('payment.currentBalance')}
              </p>
              <p
                className={`text-xl font-bold ${
                  selectedParty.balanceType === 'due'
                    ? 'text-status-error'
                    : selectedParty.balanceType === 'clear'
                      ? 'text-status-success'
                      : 'text-status-warning'
                }`}
              >
                ₹{selectedParty.balance.toLocaleString('en-IN')}
              </p>
              <p className="text-xs capitalize text-text-tertiary">
                {selectedParty.balanceType}
              </p>
              {selectedParty.lastPaymentDate && (
                <p className="mt-2 text-xs text-text-tertiary">
                  {t('payment.lastPayment')}:{' '}
                  {new Date(selectedParty.lastPaymentDate).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
