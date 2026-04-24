// FILE: src/components/girvi/GirviRelease/GirviPartialReleaseForm.tsx

import { useState, useMemo }  from 'react'
import { useTranslation }     from 'react-i18next'
import { Loader2, Package, CheckSquare, Square } from 'lucide-react'
import { Button }             from '@/components/ui/button'
import { Input }              from '@/components/ui/input'
import { Label }              from '@/components/ui/label'
import { Textarea }           from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ConfirmDialog }      from '@/components/ui/overlay/Dialog/ConfirmDialog'
import { useGirviActions }    from '@/hooks/girvi/useGirviActions'
import { useGirviInterestLazy } from '@/hooks/girvi/useGirviInterest'
import { partialReleaseSchema } from '@/validators/girviValidation'
import { InterestCalculator } from './InterestCalculator'
import type { GirviItem, GirviPaymentMode, PartialReleaseSummary } from '@/types/girvi.types'

// ─── Props ─────────────────────────────────────────────────────────────────────

interface GirviPartialReleaseFormProps {
  shopId:    string
  girviId:   string
  items:     GirviItem[]
  girviBalance?: {
    outstandingPrincipal: number
    accruedInterest:      number
    totalAmountDue:       number
    interestRate:         number
    lastInterestCalcDate?: string
    girviDate:            string
  }
  onSuccess?: (summary: PartialReleaseSummary) => void
  onCancel?:  () => void
}

// ─── Payment Modes ────────────────────────────────────────────────────────────

const PAYMENT_MODES: { value: GirviPaymentMode; label: string }[] = [
  { value: 'cash',          label: '💵 Cash'   },
  { value: 'upi',           label: '📲 UPI'    },
  { value: 'bank_transfer', label: '🏦 Bank'   },
  { value: 'cheque',        label: '📄 Cheque' },
]

// ─── Component ─────────────────────────────────────────────────────────────────

export const GirviPartialReleaseForm = ({
  shopId,
  girviId,
  items,
  girviBalance,
  onSuccess,
  onCancel,
}: GirviPartialReleaseFormProps) => {
  const { t } = useTranslation()
  const today = new Date().toISOString().split('T')[0]

  const [selectedItems,  setSelectedItems]  = useState<Record<string, number>>({})
  const [interestPaid,   setInterestPaid]   = useState('')
  const [principalPaid,  setPrincipalPaid]  = useState('')
  const [discountGiven,  setDiscountGiven]  = useState('0')
  const [releaseDate,    setReleaseDate]    = useState(today)
  const [paymentMode,    setPaymentMode]    = useState<GirviPaymentMode>('cash')
  const [transactionRef, setTransactionRef] = useState('')
  const [remarks,        setRemarks]        = useState('')
  const [errors,         setErrors]         = useState<Record<string, string>>({})
  const [showConfirm,    setShowConfirm]    = useState(false)

  const { partialRelease, isPartialReleasing } = useGirviActions(shopId)
  const { calculate, isCalculating }           = useGirviInterestLazy(shopId, girviId)

  // ── Item selection helpers ────────────────────────────────────────────────

  const toggleItem = (item: GirviItem) => {
    setSelectedItems(prev => {
      const next = { ...prev }
      if (next[item._id]) {
        delete next[item._id]
      } else {
        const available = item.quantity - (item.releasedQuantity || 0)
        next[item._id] = available
      }
      return next
    })
  }

  const setItemQty = (itemId: string, qty: number) => {
    setSelectedItems(prev => ({ ...prev, [itemId]: qty }))
  }

  const selectedCount = Object.values(selectedItems).filter(q => q > 0).length

  const selectedValue = useMemo(() => {
    return items.reduce((sum, item) => {
      const qty = selectedItems[item._id] || 0
      if (!qty) return sum
      const perUnit = (item.finalValue || item.approxValue || 0) / item.quantity
      return sum + perUnit * qty
    }, 0)
  }, [items, selectedItems])

  // ── Calculator apply ──────────────────────────────────────────────────────

  const handleCalculatorApply = async (data: {
    interestCalculated: number
    interestType:       any
    toDate:             string
  }) => {
    setInterestPaid(String(data.interestCalculated))
    setReleaseDate(data.toDate)
  }

  // ── Net amount ────────────────────────────────────────────────────────────

  const netAmount = Math.max(
    0,
    parseFloat(interestPaid  || '0') +
    parseFloat(principalPaid || '0') -
    parseFloat(discountGiven || '0')
  )

  // ── Submit ────────────────────────────────────────────────────────────────

  const handleSubmit = () => {
    const releasedItemsPayload = Object.entries(selectedItems)
      .filter(([, qty]) => qty > 0)
      .map(([itemId, releasedQuantity]) => ({ itemId, releasedQuantity }))

    try {
      partialReleaseSchema.parse({
        releasedItems: releasedItemsPayload,
        interestPaid:  parseFloat(interestPaid  || '0'),
        principalPaid: parseFloat(principalPaid || '0'),
        discountGiven: parseFloat(discountGiven || '0'),
        releaseDate,
        paymentMode,
      })
    } catch (error: any) {
      const ve: Record<string, string> = {}
      error.issues?.forEach((e: any) => {
        const path = e.path?.join('.')
        if (path) ve[path] = e.message
      })
      setErrors(ve)
      return
    }
    setErrors({})
    setShowConfirm(true)
  }

  const handleConfirmed = async () => {
    const releasedItemsPayload = Object.entries(selectedItems)
      .filter(([, qty]) => qty > 0)
      .map(([itemId, releasedQuantity]) => ({ itemId, releasedQuantity }))

    const setFormErrors = (e: Record<string, string>) => setErrors(e)

    const result = await partialRelease(
      girviId,
      {
        releasedItems: releasedItemsPayload,
        interestPaid:  parseFloat(interestPaid  || '0'),
        principalPaid: parseFloat(principalPaid || '0'),
        discountGiven: parseFloat(discountGiven || '0'),
        releaseDate,
        paymentMode,
        remarks:       remarks || undefined,
      },
      setFormErrors
    )

    if (result.success) {
      setShowConfirm(false)
      onSuccess?.(result.data!.partialReleaseSummary)
    }
  }

  const err = (field: string) => errors[field]

  return (
    <div className="space-y-6">

      {/* Balance Summary */}
      {girviBalance && (
        <div className="grid grid-cols-3 gap-3 rounded-lg bg-bg-tertiary p-4">
          <div className="text-center">
            <p className="text-xs text-text-tertiary">{t('girvi.outstandingPrincipal')}</p>
            <p className="text-lg font-bold text-status-error">
              ₹{girviBalance.outstandingPrincipal.toLocaleString('en-IN')}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-text-tertiary">{t('girvi.totalItemsValue')}</p>
            <p className="text-lg font-bold text-text-primary">
              {items.length} {t('girvi.activeItems')}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-text-tertiary">{t('girvi.totalDue')}</p>
            <p className="text-lg font-bold text-accent">
              ₹{girviBalance.totalAmountDue.toLocaleString('en-IN')}
            </p>
          </div>
        </div>
      )}

      {/* Step 1: Select Items */}
      <Card className="border-border-primary bg-bg-secondary">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-text-primary">
            <Package className="h-4 w-4 text-accent" />
            {t('girvi.step1SelectItems')}
            {selectedCount > 0 && (
              <span className="rounded-full bg-accent px-2 py-0.5 text-xs text-white">
                {selectedCount} {t('girvi.selected')}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 pb-4">
          {items.length === 0 ? (
            <p className="text-sm text-text-tertiary">{t('girvi.noActiveItems')}</p>
          ) : (
            items.map(item => {
              const isSelected  = !!selectedItems[item._id]
              const available   = item.quantity - (item.releasedQuantity || 0)
              const selectedQty = selectedItems[item._id] || 0

              return (
                <div
                  key={item._id}
                  className={`rounded-lg border-2 p-3 transition-all ${
                    isSelected
                      ? 'border-accent bg-accent/5'
                      : 'border-border-primary bg-bg-secondary hover:border-accent/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => toggleItem(item)}
                      className="flex-shrink-0 text-accent"
                    >
                      {isSelected
                        ? <CheckSquare className="h-5 w-5" />
                        : <Square className="h-5 w-5 text-text-tertiary" />
                      }
                    </button>

                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-text-primary">{item.itemName}</p>
                      <p className="text-xs text-text-tertiary capitalize">
                        {item.itemType}
                        {item.purity      ? ` · ${item.purity}`      : ''}
                        {item.grossWeight ? ` · ${item.grossWeight}g` : ''}
                      </p>
                    </div>

                    <div className="flex-shrink-0 text-right">
                      <p className="text-sm font-semibold text-text-primary">
                        ₹{(item.finalValue || item.approxValue || 0).toLocaleString('en-IN')}
                      </p>
                      <p className="text-xs text-text-tertiary">
                        {available} {t('girvi.available')}
                      </p>
                    </div>

                    {isSelected && available > 1 && (
                      <div className="ml-2 flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setItemQty(item._id, Math.max(1, selectedQty - 1))}
                          className="h-7 w-7 rounded border border-border-primary bg-bg-tertiary text-sm font-bold text-text-primary hover:bg-bg-secondary"
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-sm font-semibold text-text-primary">
                          {selectedQty}
                        </span>
                        <button
                          type="button"
                          onClick={() => setItemQty(item._id, Math.min(available, selectedQty + 1))}
                          className="h-7 w-7 rounded border border-border-primary bg-bg-tertiary text-sm font-bold text-text-primary hover:bg-bg-secondary"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })
          )}

          {selectedCount > 0 && (
            <div className="flex justify-between rounded-lg bg-accent/10 px-4 py-2 text-sm">
              <span className="text-text-secondary">{t('girvi.selectedItemsValue')}</span>
              <span className="font-bold text-accent">
                ₹{selectedValue.toLocaleString('en-IN')}
              </span>
            </div>
          )}

          {err('releasedItems') && (
            <p className="text-sm text-status-error">⚠️ {err('releasedItems')}</p>
          )}
        </CardContent>
      </Card>

      {/* Step 2: Interest Calculator */}
      <InterestCalculator
        shopId={shopId}
        girviId={girviId}
        onApply={handleCalculatorApply}
      />

      {/* Step 3: Payment Details */}
      <Card className="border-border-primary bg-bg-secondary">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-text-primary">
            {t('girvi.step3PaymentDetails')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pb-4">

          {/* Amount Fields */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { label: t('girvi.interestPaid'),  value: interestPaid,  set: setInterestPaid,  required: true  },
              { label: t('girvi.principalPaid'), value: principalPaid, set: setPrincipalPaid, required: true  },
              { label: t('girvi.discountGiven'), value: discountGiven, set: setDiscountGiven, required: false },
            ].map(field => (
              <div key={field.label} className="space-y-1">
                <Label>
                  {field.label}
                  {field.required && <span className="ml-1 text-status-error">*</span>}
                </Label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-text-tertiary">
                    ₹
                  </span>
                  <Input
                    type="number"
                    value={field.value}
                    min={0}
                    step={0.01}
                    onChange={e => field.set(e.target.value)}
                    className="pl-7"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Net Amount */}
          <div className="flex items-center justify-between rounded-lg bg-accent/10 px-4 py-3">
            <span className="font-medium text-text-primary">{t('girvi.netReceived')}</span>
            <span className="text-xl font-bold text-accent">
              ₹{netAmount.toLocaleString('en-IN')}
            </span>
          </div>

          {/* Release Date */}
          <div className="space-y-1">
            <Label>
              {t('girvi.releaseDate')} <span className="text-status-error">*</span>
            </Label>
            <Input
              type="date"
              value={releaseDate}
              max={today}
              onChange={e => setReleaseDate(e.target.value)}
              className={err('releaseDate') ? 'border-status-error' : ''}
            />
            {err('releaseDate') && (
              <p className="text-sm text-status-error">⚠️ {err('releaseDate')}</p>
            )}
          </div>

          {/* Payment Mode */}
          <div className="space-y-2">
            <Label>
              {t('girvi.paymentMode')} <span className="text-status-error">*</span>
            </Label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {PAYMENT_MODES.map(mode => (
                <label
                  key={mode.value}
                  className={`flex cursor-pointer items-center justify-center rounded-lg border-2 py-2.5 text-sm font-medium transition-all ${
                    paymentMode === mode.value
                      ? 'border-accent bg-accent/10 text-accent'
                      : 'border-border-primary bg-bg-secondary text-text-secondary hover:bg-bg-tertiary'
                  }`}
                >
                  <input
                    type="radio"
                    name="partialReleasePaymentMode"
                    value={mode.value}
                    checked={paymentMode === mode.value}
                    onChange={() => setPaymentMode(mode.value)}
                    className="sr-only"
                  />
                  {mode.label}
                </label>
              ))}
            </div>

            {paymentMode !== 'cash' && (
              <Input
                type="text"
                value={transactionRef}
                onChange={e => setTransactionRef(e.target.value)}
                placeholder={t('girvi.transactionRefPlaceholder')}
                maxLength={200}
                className="mt-2"
              />
            )}
          </div>

          {/* Remarks */}
          <Textarea
            value={remarks}
            onChange={e => setRemarks(e.target.value)}
            placeholder={t('girvi.partialReleaseRemarksPlaceholder')}
            rows={2}
            maxLength={500}
            className="resize-none"
          />
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isPartialReleasing}
            className="flex-1"
          >
            {t('common.cancel')}
          </Button>
        )}
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={isPartialReleasing || selectedCount === 0}
          className="flex-1"
        >
          {isPartialReleasing
            ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t('common.saving')}</>
            : t('girvi.partialRelease')
          }
        </Button>
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        title={t('girvi.confirmPartialRelease')}
        description={t('girvi.confirmPartialReleaseDescription', {
          count:  selectedCount,
          amount: netAmount.toLocaleString('en-IN'),
        })}
        variant="warning"
        confirmLabel={t('girvi.partialRelease')}
        cancelLabel={t('common.cancel')}
        onConfirm={handleConfirmed}
        onCancel={() => setShowConfirm(false)}
        loading={isPartialReleasing}
      />
    </div>
  )
}