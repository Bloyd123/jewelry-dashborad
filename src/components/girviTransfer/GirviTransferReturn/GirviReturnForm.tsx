// FILE: src/components/girviTransfer/GirviTransferReturn/GirviReturnForm.tsx

import React, { useState } from 'react'
import { useTranslation }  from 'react-i18next'
import { Save, X, Loader2 } from 'lucide-react'
import { Button }   from '@/components/ui/button'
import { Label }    from '@/components/ui/label'
import { FormInput }  from '@/components/forms/FormInput/FormInput'
import { FormSelect } from '@/components/forms/FormSelect/FormSelect'
import { FormTextarea } from '@/components/forms/FormTextarea/FormTextarea'
import { ConfirmDialog } from '@/components/ui/overlay/Dialog/ConfirmDialog'
import { PartyInterestCalculator } from './PartyInterestCalculator'
import { useGirviTransferActions } from '@/hooks/girviTransfer'
import { transferReturnSchema }    from '@/validators/girviTransferValidation'
import { useNotification }         from '@/hooks/useNotification'
import type { ITransferReturnForm } from '@/types/girviTransfer.types'

interface GirviReturnFormProps {
  shopId:      string
  girviId:     string
  transferId:  string
  onSuccess?:  () => void
  onCancel?:   () => void
}

export const GirviReturnForm: React.FC<GirviReturnFormProps> = ({
  shopId,
  girviId,
  transferId,
  onSuccess,
  onCancel,
}) => {
  const { t }         = useTranslation()
  const { showError } = useNotification()

  const [showConfirm, setShowConfirm] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState<Partial<ITransferReturnForm>>({
    returnDate:        new Date().toISOString().split('T')[0],
    returnPaymentMode: 'cash',
    partyInterestCharged: 0,
    returnAmount:      0,
  })

  const { transferReturn, isReturning } =
    useGirviTransferActions(shopId, girviId, transferId)

  const paymentModeOptions = [
    { value: 'cash',          label: t('girviTransfer.paymentMode.cash',         'Cash') },
    { value: 'upi',           label: t('girviTransfer.paymentMode.upi',          'UPI') },
    { value: 'bank_transfer', label: t('girviTransfer.paymentMode.bankTransfer', 'Bank Transfer') },
    { value: 'cheque',        label: t('girviTransfer.paymentMode.cheque',       'Cheque') },
  ]

  const handleChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => { const e = { ...prev }; delete e[name]; return e })
    }
  }

  const handleSubmit = () => {
    try {
      transferReturnSchema.parse({
        ...formData,
        partyInterestCharged: Number(formData.partyInterestCharged),
        returnAmount:         Number(formData.returnAmount),
      })
    } catch (error: any) {
      const validationErrors: Record<string, string> = {}
      error.issues?.forEach((err: any) => {
        if (err.path?.[0]) validationErrors[err.path[0]] = err.message
      })
      setErrors(validationErrors)
      showError(
        t('girviTransfer.errors.pleaseFillRequired', 'Please fill all required fields'),
        t('girviTransfer.errors.validationFailed', 'Validation Failed')
      )
      return
    }
    setShowConfirm(true)
  }

  const handleConfirmedSubmit = async () => {
    const result = await transferReturn(
      {
        returnDate:                  formData.returnDate!,
        partyInterestCharged:        Number(formData.partyInterestCharged),
        returnAmount:                Number(formData.returnAmount),
        returnPaymentMode:           formData.returnPaymentMode!,
        returnTransactionReference:  formData.returnTransactionReference,
        returnReason:                formData.returnReason,
        returnRemarks:               formData.returnRemarks,
      },
      setErrors
    )
    if (result.success) {
      setShowConfirm(false)
      onSuccess?.()
    }
  }

  return (
    <div className="space-y-6">

      {/* Party Interest Calculator */}
      <PartyInterestCalculator
        shopId={shopId}
        girviId={girviId}
        transferId={transferId}
        onUseAmount={(amount, _days) => {
          handleChange('partyInterestCharged', amount)
          handleChange('returnAmount', amount)
        }}
      />

      {/* Return Form */}
      <div className="rounded-lg border border-border-primary bg-bg-secondary p-5 space-y-4">
        <h3 className="text-sm font-semibold text-text-primary">
          {t('girviTransfer.return.form', 'Return Details')}
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <Label className="text-xs text-text-secondary">
              {t('girviTransfer.return.returnDate', 'Return Date')} *
            </Label>
            <input
              type="date"
              value={formData.returnDate || ''}
              onChange={e => handleChange('returnDate', e.target.value)}
              className="mt-1 w-full rounded-md border border-border-primary bg-bg-primary px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
            />
            {errors.returnDate && (
              <p className="mt-1 text-xs text-status-error">{errors.returnDate}</p>
            )}
          </div>

          <FormInput
            name="partyInterestCharged"
            label={`${t('girviTransfer.return.partyInterest', 'Party Interest Charged')} (₹) *`}
            type="number"
            value={formData.partyInterestCharged || 0}
            onChange={(name, value) => handleChange(name, Number(value) || 0)}
            error={errors.partyInterestCharged}
            placeholder="0"
          />

          <FormInput
            name="returnAmount"
            label={`${t('girviTransfer.return.returnAmount', 'Total Return Amount')} (₹) *`}
            type="number"
            value={formData.returnAmount || 0}
            onChange={(name, value) => handleChange(name, Number(value) || 0)}
            error={errors.returnAmount}
            placeholder="0"
          />

          <FormSelect
            name="returnPaymentMode"
            label={`${t('girviTransfer.return.paymentMode', 'Payment Mode')} *`}
            value={formData.returnPaymentMode || 'cash'}
            onChange={handleChange}
            options={paymentModeOptions}
            error={errors.returnPaymentMode}
          />

          <FormInput
            name="returnTransactionReference"
            label={t('girviTransfer.return.transactionRef', 'Transaction Reference')}
            value={formData.returnTransactionReference || ''}
            onChange={handleChange}
            placeholder="UPI ID / Cheque No."
          />

          <FormInput
            name="returnReason"
            label={t('girviTransfer.return.reason', 'Return Reason')}
            value={formData.returnReason || ''}
            onChange={handleChange}
            placeholder={t('girviTransfer.return.reasonPlaceholder', 'Reason for return')}
          />

          <div className="md:col-span-2">
            <FormTextarea
              name="returnRemarks"
              label={t('girviTransfer.return.remarks', 'Remarks')}
              value={formData.returnRemarks || ''}
              onChange={handleChange}
              rows={2}
              placeholder={t('girviTransfer.return.remarksPlaceholder', 'Additional remarks...')}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          {onCancel && (
            <Button variant="outline" size="sm" onClick={onCancel} disabled={isReturning}>
              <X className="mr-2 h-4 w-4" />
              {t('common.cancel', 'Cancel')}
            </Button>
          )}
          <Button size="sm" onClick={handleSubmit} disabled={isReturning}>
            {isReturning ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t('common.saving', 'Saving...')}</>
            ) : (
              <><Save className="mr-2 h-4 w-4" />{t('girviTransfer.return.submit', 'Process Return')}</>
            )}
          </Button>
        </div>
      </div>

      <ConfirmDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        title={t('girviTransfer.return.confirmTitle', 'Process Return?')}
        description={t('girviTransfer.return.confirmDesc',
          'This will restore the girvi to active status with party interest added to outstanding amount.')}
        variant="warning"
        confirmLabel={t('girviTransfer.return.submit', 'Process Return')}
        cancelLabel={t('common.cancel', 'Cancel')}
        onConfirm={handleConfirmedSubmit}
        onCancel={() => setShowConfirm(false)}
        loading={isReturning}
      />
    </div>
  )
}