import { useState, useMemo } from 'react'
import { useGetSalesQuery } from '@/store/api/salesApi'
import { useGetPurchasesQuery } from '@/store/api/purchaseApi'
import { useTranslation } from 'react-i18next'
import { FormSelect } from '@/components/forms/FormSelect/FormSelect'
import { Search, ExternalLink, Info } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import type { FormSectionProps } from '../PaymentForm.types'
import { useAuth } from '@/hooks/auth'

export const ReferenceLinkSection = ({
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
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null)

const { data: salesData, isLoading: isLoadingSales } = useGetSalesQuery(
  {
    shopId,
    customerId: data.partyId,
    paymentStatus: 'partial' as any,  // backend filter handle karega
  },
  { skip: !data.partyId || data.referenceType !== 'sale' }
)

const { data: purchasesData, isLoading: isLoadingPurchases } = useGetPurchasesQuery(
  {
    shopId,
    supplierId: data.partyId,
    paymentStatus: 'partial' as any,
  },
  { skip: !data.partyId || data.referenceType !== 'purchase' }
)

  const isSearching = isLoadingSales || isLoadingPurchases

  const referenceTypeOptions = [
    { value: 'none',              label: t('payment.noReference') },
    { value: 'sale',              label: t('payment.saleInvoice') },
    { value: 'purchase',          label: t('payment.purchaseInvoice') },
    { value: 'scheme_enrollment', label: t('payment.schemeEnrollment') },
    { value: 'order',             label: t('payment.order') },
  ]

  const availableInvoices = useMemo(() => {
    if (data.referenceType === 'sale') {
      const sales = salesData?.data?.sales || []
      return sales.map(s => ({
        id:     s._id,
        type:   'sale',
        number: s.invoiceNumber,
        date:   s.saleDate,
        total:  s.financials.grandTotal,
        paid:   s.payment.paidAmount,
        due:    s.payment.dueAmount,
        items:  s.customerDetails?.customerName || '',
      }))
    }

    if (data.referenceType === 'purchase') {
      const purchases = purchasesData?.data?.purchases || []
      return purchases.map(p => ({
        id:     p._id,
        type:   'purchase',
        number: p.purchaseNumber,
        date:   p.purchaseDate,
        total:  p.financials.grandTotal,
        paid:   p.payment.paidAmount,
        due:    p.payment.dueAmount,
        items:  p.supplierDetails?.supplierName || '',
      }))
    }

    return []
  }, [salesData, purchasesData, data.referenceType])

  const filteredInvoices = useMemo(() => {
    if (!searchQuery) return availableInvoices
    return availableInvoices.filter(
      invoice =>
        invoice.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.items.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [availableInvoices, searchQuery])

  const handleReferenceTypeChange = (name: string, value: string) => {
    onChange(name, value)
    setSelectedInvoice(null)
    setSearchQuery('')
    onChange('referenceId', '')
    onChange('referenceNumber', '')
  }

  const handleSelectInvoice = (invoice: any) => {
    setSelectedInvoice(invoice)
    setSearchQuery(invoice.number)
    setShowSuggestions(false)
    onChange('referenceId', invoice.id)
    onChange('referenceNumber', invoice.number)
  }

  const handleAutoFillAmount = () => {
    if (selectedInvoice) {
      onChange('amount', selectedInvoice.due)
    }
  }

  return (
    <div className="space-y-4">
      <FormSelect
        name="referenceType"
        label={t('payment.linkThisPaymentTo')}
        value={data.referenceType || 'none'}
        onChange={handleReferenceTypeChange}
        onBlur={onBlur}
        error={errors.referenceType}
        placeholder={t('payment.selectReferenceType')}
        disabled={disabled}
        options={referenceTypeOptions}
      />

      {(data.referenceType === 'sale' || data.referenceType === 'purchase') && (
        <div className="space-y-2">
          <Label className="text-text-primary">
            {t('payment.selectInvoice')}
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
                setShowSuggestions(true)
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              disabled={disabled}
              placeholder={t('payment.searchInvoiceNumber')}
              className="h-12 w-full rounded-lg border border-border-primary bg-bg-secondary pl-10 pr-4 text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent disabled:bg-bg-tertiary"
            />

            {showSuggestions && (
              <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-border-primary bg-bg-secondary shadow-lg">
                {isSearching ? (
                  <div className="p-3 text-center text-sm text-text-secondary">
                    {t('common.loading')}...
                  </div>
                ) : filteredInvoices.length === 0 ? (
                  <div className="p-3 text-center text-sm text-text-secondary">
                    {t('payment.noInvoicesFound')}
                  </div>
                ) : (
                  filteredInvoices.map(invoice => (
                    <button
                      key={invoice.id}
                      type="button"
                      onClick={() => handleSelectInvoice(invoice)}
                      className="w-full border-b border-border-secondary p-3 text-left transition-colors hover:bg-bg-tertiary"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-semibold text-text-primary">
                            {invoice.number}
                          </p>
                          <p className="text-sm text-text-secondary">
                            {new Date(invoice.date).toLocaleDateString()} | ₹
                            {invoice.total.toLocaleString('en-IN')}
                          </p>
                          <p className="text-xs text-text-tertiary">
                            {invoice.items}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-text-tertiary">Due</p>
                          <p className="font-semibold text-status-error">
                            ₹{invoice.due.toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {searchQuery.length >= 2 && filteredInvoices.length === 0 && (
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <Info className="h-4 w-4" />
              <span>{t('payment.noInvoicesFound')}</span>
            </div>
          )}

          {!searchQuery && availableInvoices.length > 0 && (
            <p className="text-sm text-text-secondary">
              {t('payment.recentUnpaidInvoices')}: {availableInvoices.length}
            </p>
          )}
        </div>
      )}

      {selectedInvoice && (
        <div className="border-accent/30 bg-accent/5 space-y-3 rounded-lg border-2 p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🧾</span>
                <div>
                  <h4 className="font-bold text-text-primary">
                    {t('payment.linkedTo')}: {selectedInvoice.number}
                  </h4>
                  <p className="text-sm text-text-secondary">
                    {new Date(selectedInvoice.date).toLocaleDateString()} |
                    Total: ₹{selectedInvoice.total.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              <div className="mt-2 space-y-1 text-sm">
                <p className="text-text-secondary">
                  <span className="font-medium">{t('payment.paid')}:</span> ₹
                  {selectedInvoice.paid.toLocaleString('en-IN')}
                </p>
                <p className="text-status-error">
                  <span className="font-medium">{t('payment.dueAmount')}:</span>{' '}
                  ₹{selectedInvoice.due.toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            <Button
              type="button"
              variant="link"
              size="sm"
              disabled={disabled}
              className="text-accent hover:underline"
            >
              <ExternalLink className="mr-1 h-4 w-4" />
              {t('payment.viewInvoice')}
            </Button>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAutoFillAmount}
            disabled={disabled}
            className="w-full"
          >
            {t('payment.autoFillWithDueAmount')} (₹
            {selectedInvoice.due.toLocaleString('en-IN')})
          </Button>
        </div>
      )}

      {errors.referenceId && (
        <p className="text-sm text-status-error">{errors.referenceId}</p>
      )}
    </div>
  )
}