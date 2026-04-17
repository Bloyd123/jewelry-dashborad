// FILE: src/components/girviCashbook/GirviCashbookForm/ManualEntryForm.tsx

import React, { useState, useEffect } from 'react'
import { useTranslation }   from 'react-i18next'
import { Save, X, Loader2 } from 'lucide-react'
import { Button }           from '@/components/ui/button'
import { FormInput }        from '@/components/forms/FormInput/FormInput'
import { FormSelect }       from '@/components/forms/FormSelect/FormSelect'
import { FormTextarea }     from '@/components/forms/FormTextarea/FormTextarea'
import { FormDatePicker }   from '@/components/forms/FormDatePicker/FormDatePicker'
import { Label }            from '@/components/ui/label'
import { ConfirmDialog }    from '@/components/ui/overlay/Dialog/ConfirmDialog'
import { useGirviCashbookActions } from '@/hooks/girviCashbook/useGirviCashbookActions'
import { createManualEntrySchema } from '@/validators/girviCashbookValidation'
import {
  ENTRY_TYPE_LABELS,
  ENTRY_TYPE_FLOW,
} from '@/validators/girviCashbookValidation'
import { useNotification }  from '@/hooks/useNotification'
import type {
  CashbookEntryType,
  FlowType,
  PaymentMode,
} from '@/types/girviCashbook.types'

interface ManualEntryFormProps {
  shopId:    string
  girviId?:  string   
  onSuccess?: () => void
  onCancel?:  () => void
}

export const ManualEntryForm: React.FC<ManualEntryFormProps> = ({
  shopId,
  girviId,
  onSuccess,
  onCancel,
}) => {
  const { t }         = useTranslation()
  const { showError } = useNotification()

  const [showConfirm, setShowConfirm] = useState(false)
  const [errors,  setErrors]  = useState<Record<string, string>>({})
  const [showBreakdown, setShowBreakdown] = useState(false)

  const [formData, setFormData] = useState({
    entryType:            'interest_received' as CashbookEntryType,
    flowType:             'inflow' as FlowType,
    amount:               0,
    paymentMode:          'cash' as PaymentMode,
    transactionReference: '',
    entryDate:            new Date().toISOString().split('T')[0],
    girviId:              girviId ?? '',
    customerId:           '',
    remarks:              '',
    breakdown: {
      principalAmount: 0,
      interestAmount:  0,
      discountAmount:  0,
    },
  })

  const { createManualEntry, isCreating } = useGirviCashbookActions(shopId)

  useEffect(() => {
    const autoFlow = ENTRY_TYPE_FLOW[formData.entryType]
    if (autoFlow) {
      setFormData(prev => ({ ...prev, flowType: autoFlow }))
    }
  }, [formData.entryType])

  const entryTypeOptions = Object.entries(ENTRY_TYPE_LABELS).map(
    ([value, label]) => ({ value, label })
  )

  const flowTypeOptions = [
    { value: 'inflow',  label: t('girviCashbook.flowType.inflow',  'Inflow')  },
    { value: 'outflow', label: t('girviCashbook.flowType.outflow', 'Outflow') },
  ]

  const paymentModeOptions = [
    { value: 'cash',          label: t('girviCashbook.paymentMode.cash',         'Cash') },
    { value: 'upi',           label: t('girviCashbook.paymentMode.upi',          'UPI') },
    { value: 'bank_transfer', label: t('girviCashbook.paymentMode.bank_transfer','Bank Transfer') },
    { value: 'cheque',        label: t('girviCashbook.paymentMode.cheque',       'Cheque') },
  ]

  const handleChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => { const e = { ...prev }; delete e[name]; return e })
    }
  }

  const handleBreakdownChange = (name: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      breakdown: { ...prev.breakdown, [name]: Number(value) || 0 },
    }))
  }

  const handleSubmit = () => {
    try {
      createManualEntrySchema.parse({
        ...formData,
        amount: Number(formData.amount),
        breakdown: showBreakdown ? formData.breakdown : undefined,
      })
    } catch (error: any) {
      const validationErrors: Record<string, string> = {}
      error.issues?.forEach((err: any) => {
        if (err.path?.[0]) validationErrors[err.path[0]] = err.message
      })
      setErrors(validationErrors)
      showError(
        t('girviCashbook.errors.pleaseFill', 'Please fill all required fields'),
        t('girviCashbook.errors.validationFailed', 'Validation Failed')
      )
      return
    }
    setShowConfirm(true)
  }

  const handleConfirmedSubmit = async () => {
    const result = await createManualEntry(
      {
        entryType:            formData.entryType,
        flowType:             formData.flowType,
        amount:               Number(formData.amount),
        paymentMode:          formData.paymentMode,
        transactionReference: formData.transactionReference || undefined,
        entryDate:            formData.entryDate,
        girviId:              formData.girviId   || undefined,
        customerId:           formData.customerId || undefined,
        remarks:              formData.remarks   || undefined,
        breakdown: showBreakdown ? {
          principalAmount: formData.breakdown.principalAmount,
          interestAmount:  formData.breakdown.interestAmount,
          discountAmount:  formData.breakdown.discountAmount,
        } : undefined,
      },
      setErrors
    )
    if (result.success) {
      setShowConfirm(false)
      onSuccess?.()
    }
  }

  return (
    <div className="space-y-5">

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

        <FormSelect
          name="entryType"
          label={`${t('girviCashbook.form.entryType', 'Entry Type')} *`}
          value={formData.entryType}
          onChange={handleChange}
          options={entryTypeOptions}
          error={errors.entryType}
          required
          disabled={isCreating}
        />

        <FormSelect
          name="flowType"
          label={`${t('girviCashbook.form.flowType', 'Flow Type')} *`}
          value={formData.flowType}
          onChange={handleChange}
          options={flowTypeOptions}
          error={errors.flowType}
          required
          disabled={isCreating}
        />

        <FormInput
          name="amount"
          label={`${t('girviCashbook.form.amount', 'Amount (₹)')} *`}
          type="number"
          value={formData.amount}
          onChange={(name, value) => handleChange(name, Number(value) || 0)}
          error={errors.amount}
          required
          disabled={isCreating}
          placeholder="0"
        />

        <FormSelect
          name="paymentMode"
          label={`${t('girviCashbook.form.paymentMode', 'Payment Mode')} *`}
          value={formData.paymentMode}
          onChange={handleChange}
          options={paymentModeOptions}
          error={errors.paymentMode}
          required
          disabled={isCreating}
        />

        {/* Entry Date */}
        <FormDatePicker
          name="entryDate"
          label={`${t('girviCashbook.form.entryDate', 'Entry Date')} *`}
          value={formData.entryDate}
          onChange={handleChange}
          error={errors.entryDate}
          required
          disabled={isCreating}
        />

        <FormInput
          name="transactionReference"
          label={t('girviCashbook.form.transactionRef', 'Transaction Reference')}
          value={formData.transactionReference}
          onChange={handleChange}
          disabled={isCreating}
          placeholder="UPI ID / Cheque No."
        />

        <FormInput
          name="girviId"
          label={t('girviCashbook.form.girviId', 'Girvi ID (Optional)')}
          value={formData.girviId}
          onChange={handleChange}
          disabled={isCreating || !!girviId}
          placeholder="MongoDB ObjectId"
        />

        <FormInput
          name="customerId"
          label={t('girviCashbook.form.customerId', 'Customer ID (Optional)')}
          value={formData.customerId}
          onChange={handleChange}
          disabled={isCreating}
          placeholder="MongoDB ObjectId"
        />
      </div>

      <FormTextarea
        name="remarks"
        label={t('girviCashbook.form.remarks', 'Remarks')}
        value={formData.remarks}
        onChange={handleChange}
        rows={2}
        disabled={isCreating}
        placeholder={t('girviCashbook.form.remarksPlaceholder', 'Additional remarks...')}
      />

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="showBreakdown"
          checked={showBreakdown}
          onChange={e => setShowBreakdown(e.target.checked)}
          disabled={isCreating}
          className="h-4 w-4 rounded border-border-primary bg-bg-secondary text-accent focus:ring-accent"
        />
        <Label htmlFor="showBreakdown" className="cursor-pointer text-sm text-text-secondary">
          {t('girviCashbook.form.breakdown', 'Add Breakdown (Optional)')}
        </Label>
      </div>

      {showBreakdown && (
        <div className="grid grid-cols-1 gap-4 rounded-lg border border-border-primary bg-bg-tertiary p-4 md:grid-cols-3">
          <FormInput
            name="principalAmount"
            label={t('girviCashbook.form.principalAmount', 'Principal Amount')}
            type="number"
            value={formData.breakdown.principalAmount}
            onChange={(name, value) => handleBreakdownChange(name, value)}
            disabled={isCreating}
            placeholder="0"
          />
          <FormInput
            name="interestAmount"
            label={t('girviCashbook.form.interestAmount', 'Interest Amount')}
            type="number"
            value={formData.breakdown.interestAmount}
            onChange={(name, value) => handleBreakdownChange(name, value)}
            disabled={isCreating}
            placeholder="0"
          />
          <FormInput
            name="discountAmount"
            label={t('girviCashbook.form.discountAmount', 'Discount Amount')}
            type="number"
            value={formData.breakdown.discountAmount}
            onChange={(name, value) => handleBreakdownChange(name, value)}
            disabled={isCreating}
            placeholder="0"
          />
        </div>
      )}

      <div className="flex items-center justify-between rounded-lg border border-accent/20 bg-accent/10 p-3">
        <span className="text-sm font-medium text-text-primary">
          {t('girviCashbook.form.entryPreview', 'Entry Preview')}:
        </span>
        <span className={`text-lg font-bold ${
          formData.flowType === 'inflow'
            ? 'text-status-success'
            : 'text-status-error'
        }`}>
          {formData.flowType === 'inflow' ? '+' : '-'}
          ₹{Number(formData.amount || 0).toLocaleString()}
        </span>
      </div>

      <div className="flex justify-end gap-3 border-t border-border-primary pt-4">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isCreating}
          >
            <X className="mr-2 h-4 w-4" />
            {t('common.cancel', 'Cancel')}
          </Button>
        )}
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={isCreating}
        >
          {isCreating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('common.saving', 'Saving...')}
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {t('girviCashbook.form.submit', 'Create Entry')}
            </>
          )}
        </Button>
      </div>

      <ConfirmDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        title={t('girviCashbook.confirmCreate', 'Create Entry?')}
        description={t(
          'girviCashbook.confirmCreateDesc',
          `Create ${ENTRY_TYPE_LABELS[formData.entryType]} entry of ₹${Number(formData.amount).toLocaleString()}?`
        )}
        variant="success"
        confirmLabel={t('girviCashbook.form.submit', 'Create Entry')}
        cancelLabel={t('common.cancel', 'Cancel')}
        onConfirm={handleConfirmedSubmit}
        onCancel={() => setShowConfirm(false)}
        loading={isCreating}
      />
    </div>
  )
}