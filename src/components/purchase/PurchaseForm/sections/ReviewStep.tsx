// FILE: src/components/purchase/PurchaseForm/sections/ReviewSection.tsx
// Review Section

import { useTranslation } from 'react-i18next'
import type { FormSectionProps } from '../PurchaseForm.types'

export const ReviewSection = ({ data }: FormSectionProps) => {
  const { t } = useTranslation()

  const calculateSubtotal = () => {
    return (data.items || []).reduce((sum, item) => sum + item.itemTotal, 0)
  }

  const calculateGST = (subtotal: number) => {
    const gstRate = 0.03
    const cgst = subtotal * gstRate
    const sgst = subtotal * gstRate
    return { cgst, sgst, total: cgst + sgst }
  }

  const subtotal = calculateSubtotal()
  const gst = calculateGST(subtotal)
  const grandTotal = subtotal + gst.total

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border-primary bg-bg-tertiary p-4">
        <h3 className="mb-3 font-medium text-text-primary">
          {t('purchase.orderSummary')}
        </h3>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-text-secondary">
            <span>{t('purchase.subtotal')}</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-text-secondary">
            <span>{t('purchase.cgst')} (3%)</span>
            <span>₹{gst.cgst.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-text-secondary">
            <span>{t('purchase.sgst')} (3%)</span>
            <span>₹{gst.sgst.toFixed(2)}</span>
          </div>

          <div className="border-t border-border-primary pt-2"></div>

          <div className="flex justify-between text-lg font-bold text-text-primary">
            <span>{t('purchase.grandTotal')}</span>
            <span className="text-accent">₹{grandTotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-text-secondary">
            <span>{t('purchase.paid')}</span>
            <span>₹{(data.paidAmount || 0).toFixed(2)}</span>
          </div>

          <div className="flex justify-between font-medium text-status-warning">
            <span>{t('purchase.due')}</span>
            <span>₹{(grandTotal - (data.paidAmount || 0)).toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border-primary bg-bg-tertiary p-4">
        <h3 className="mb-2 font-medium text-text-primary">
          {t('purchase.purchaseDetails')}
        </h3>
        <dl className="space-y-1 text-sm">
          <div className="flex justify-between">
            <dt className="text-text-secondary">{t('purchase.supplier')}:</dt>
            <dd className="text-text-primary">{data.supplierId || '-'}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-text-secondary">{t('purchase.items')}:</dt>
            <dd className="text-text-primary">
              {(data.items || []).length} item(s)
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-text-secondary">
              {t('purchase.paymentMode')}:
            </dt>
            <dd className="text-text-primary">{data.paymentMode || '-'}</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
