import { useTranslation } from 'react-i18next'
import { FormSelect } from '@/components/forms/FormSelect/FormSelect'
import { FormInput } from '@/components/forms/FormInput/FormInput'
import { Button } from '@/components/ui/button'
import { UserPlus, Search } from 'lucide-react'
import { useGetCustomersQuery } from '@/store/api/customerApi'
import type { FormSectionProps } from '../SaleForm.types'

export const CustomerSection = ({
  data,
  errors,
  onChange,
  onBlur,
  disabled = false,
  shopId = '',
}: FormSectionProps) => {
  const { t } = useTranslation()

  // ── Real API ──────────────────────────────
  const { data: customersData, isLoading: isLoadingCustomers } =
    useGetCustomersQuery(
      { shopId, limit: 100 },
      { skip: !shopId }
    )

  const customerOptions = (customersData?.data?.customers || []).map(c => ({
    value: c._id,
    label: `${c.fullName || `${c.firstName} ${c.lastName}`} (${c.customerCode})`,
  }))

  // Selected customer ka real data
  const selectedCustomer = (customersData?.data?.customers || []).find(
    c => c._id === data.customerId
  )

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="flex-1">
          <FormSelect
            name="customerId"
            label={t('sales.customertext')}
            value={data.customerId || ''}
            onChange={onChange}
            onBlur={onBlur}
            error={errors.customerId}
            placeholder={
              isLoadingCustomers
                ? t('common.loading')
                : t('sales.selectCustomer')
            }
            required
            disabled={disabled || isLoadingCustomers}
            options={customerOptions}
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

      {/* Customer Details — real data */}
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
              <p className="text-sm text-text-primary">
                {selectedCustomer.customerCode}   // ← real data
              </p>
            </div>
            <div>
              <span className="text-xs text-text-tertiary">
                {t('customer.phone')}
              </span>
              <p className="text-sm text-text-primary">
                {selectedCustomer.phone || 'N/A'}  // ← real data
              </p>
            </div>
            {selectedCustomer.email && (
              <div>
                <span className="text-xs text-text-tertiary">
                  {t('customer.email')}
                </span>
                <p className="text-sm text-text-primary">
                  {selectedCustomer.email}          // ← real data
                </p>
              </div>
            )}
            {selectedCustomer.gstNumber && (
              <div>
                <span className="text-xs text-text-tertiary">
                  {t('customer.gstNumber')}
                </span>
                <p className="text-sm text-text-primary">
                  {selectedCustomer.gstNumber}      // ← real data
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sale Type & Date — same as before */}
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
            { value: 'retail',            label: t('sales.retail') },
            { value: 'wholesale',         label: t('sales.wholesale') },
            { value: 'exchange',          label: t('sales.exchange') },
            { value: 'order_fulfillment', label: t('sales.orderFulfillment') },
            { value: 'repair_billing',    label: t('sales.repairBilling') },
            { value: 'estimate',          label: t('sales.estimate') },
          ]}
        />
        <FormInput
          name="saleDate"
          label={t('sales.saleDate')}
          type="text"
          value={
            data.saleDate ? new Date(data.saleDate).toLocaleDateString() : ''
          }
          onChange={() => {}}
          disabled
          className="bg-bg-tertiary"
        />
      </div>
    </div>
  )
}