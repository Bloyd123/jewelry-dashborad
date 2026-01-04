// FILE: src/components/sales/SaleForm/sections/CustomerSection.tsx
// Customer Selection Section

import { useTranslation } from 'react-i18next'
import { FormSelect } from '@/components/forms/FormSelect/FormSelect'
import { FormInput } from '@/components/forms/FormInput/FormInput'
import { Button } from '@/components/ui/button'
import { UserPlus, Search } from 'lucide-react'
import type { FormSectionProps } from '../SaleForm.types'

// Mock customers (replace with API call)
const mockCustomers = [
  { value: '674a3333333333333333333', label: 'Rajesh Kumar (CUST-001)' },
  { value: '674a3333333333333333334', label: 'Priya Sharma (CUST-002)' },
  { value: '674a3333333333333333335', label: 'Amit Patel (CUST-003)' },
  { value: '674a3333333333333333336', label: 'Sneha Reddy (CUST-004)' },
  { value: '674a3333333333333333337', label: 'Vikram Singh (CUST-005)' },
]

export const CustomerSection = ({
  data,
  errors,
  onChange,
  onBlur,
  disabled = false,
}: FormSectionProps) => {
  const { t } = useTranslation()

  const selectedCustomer = mockCustomers.find(c => c.value === data.customerId)

  return (
    <div className="space-y-4">
      {/* Customer Search/Select */}
      <div className="flex gap-2">
        <div className="flex-1">
          <FormSelect
            name="customerId"
            label={t('sales.customertext')}
            value={data.customerId || ''}
            onChange={onChange}
            onBlur={onBlur}
            error={errors.customerId}
            placeholder={t('sales.selectCustomer')}
            required
            disabled={disabled}
            options={mockCustomers}
          />
        </div>

        <div className="flex items-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            disabled={disabled}
            className="border-border-primary bg-bg-secondary text-text-primary hover:bg-bg-tertiary"
          >
            <Search className="h-4 w-4" />
          </Button>

          <Button
            type="button"
            variant="outline"
            size="icon"
            disabled={disabled}
            className="border-border-primary bg-bg-secondary text-text-primary hover:bg-bg-tertiary"
          >
            <UserPlus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Customer Details (Read-only preview) */}
      {selectedCustomer && (
        <div className="rounded-lg border border-border-primary bg-bg-tertiary p-4">
          <h4 className="mb-3 text-sm font-medium text-text-primary">
            {t('sales.customerDetails')}
          </h4>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <span className="text-xs text-text-tertiary">
                {t('customer.customerCode')}
              </span>
              <p className="text-sm text-text-primary">CUST-001</p>
            </div>

            <div>
              <span className="text-xs text-text-tertiary">
                {t('customer.phone')}
              </span>
              <p className="text-sm text-text-primary">+91-9876543210</p>
            </div>

            <div>
              <span className="text-xs text-text-tertiary">
                {t('customer.email')}
              </span>
              <p className="text-sm text-text-primary">customer@email.com</p>
            </div>

            <div>
              <span className="text-xs text-text-tertiary">
                {t('customer.gstNumber')}
              </span>
              <p className="text-sm text-text-primary">27AABCU9603R1ZM</p>
            </div>
          </div>
        </div>
      )}

      {/* Sale Type & Date */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormSelect
          name="saleType"
          label={t('sales.saleTypetext')}
          value={data.saleType || 'retail'}
          onChange={onChange}
          onBlur={onBlur}
          error={errors.saleType}
          placeholder={t('sales.selectSaleType')}
          disabled={disabled}
          options={[
            { value: 'retail', label: t('sales.retail') },
            { value: 'wholesale', label: t('sales.wholesale') },
            { value: 'exchange', label: t('sales.exchange') },
            { value: 'order_fulfillment', label: t('sales.orderFulfillment') },
            { value: 'repair_billing', label: t('sales.repairBilling') },
            { value: 'estimate', label: t('sales.estimate') },
          ]}
        />

        <FormInput
          name="saleDate"
          label={t('sales.saleDate')}
          type="text"
          value={
            data.saleDate ? new Date(data.saleDate).toLocaleDateString() : ''
          }
          onChange={() => {}} // Read-only or use DatePicker
          disabled
          className="bg-bg-tertiary"
        />
      </div>
    </div>
  )
}
