import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DollarSign } from 'lucide-react'
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/ui/overlay/Modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { usePaymentActions } from '@/hooks/payment'
import { useAuth } from '@/hooks/auth'
import type { Supplier } from '@/types/supplier.types'
import type { PaymentMode } from '@/types/payment.types'
// ─── TYPES ───────────────────────────────────────────────────────────────────

interface AddPaymentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  supplier: Supplier
  onSuccess?: () => void
}
interface PaymentFormData {
  amount: string
  paymentMode: PaymentMode | ''  // ✅
  paymentDate: string
  transactionId: string
  notes: string
}

interface FormErrors {
  amount?: string
  paymentMode?: string
  paymentDate?: string
}

// ─── INITIAL STATE ────────────────────────────────────────────────────────────

const initialFormData: PaymentFormData = {
  amount:        '',
paymentMode:   '' as PaymentMode | '', 
  paymentDate:   new Date().toISOString().split('T')[0],
  transactionId: '',
  notes:         '',
}

// ─── COMPONENT ───────────────────────────────────────────────────────────────

const AddPaymentModal: React.FC<AddPaymentModalProps> = ({
  open,
  onOpenChange,
  supplier,
  onSuccess,
}) => {
  const { t } = useTranslation()
  const { currentShopId } = useAuth()
  const shopId = currentShopId!

  const { createPayment, isCreating } = usePaymentActions(shopId)

  const [formData, setFormData] = useState<PaymentFormData>(initialFormData)
  const [errors, setErrors]     = useState<FormErrors>({})

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleChange = (field: keyof PaymentFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const validate = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.amount || isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = t('suppliers.financial.addPaymentModal.errors.amount')
    }
    if (!formData.paymentMode) {
      newErrors.paymentMode = t('suppliers.financial.addPaymentModal.errors.paymentMode')
    }
    if (!formData.paymentDate) {
      newErrors.paymentDate = t('suppliers.financial.addPaymentModal.errors.paymentDate')
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return

const result = await createPayment({
  amount:          Number(formData.amount),
  paymentMode:     formData.paymentMode as PaymentMode,
  transactionId:   formData.transactionId || undefined,
  notes:           formData.notes || undefined,
  paymentType:     'purchase_payment',
  transactionType: 'payment',
  party: {
    partyType: 'supplier',
    partyId:   supplier._id,
    partyName: supplier.businessName,
  },
})

    if (result.success) {
      handleClose()
      onSuccess?.()
    }
  }

  const handleClose = () => {
    setFormData(initialFormData)
    setErrors({})
    onOpenChange(false)
  }

  // ── RENDER ───────────────────────────────────────────────────────────────

  return (
    <Modal
      open={open}
      onOpenChange={handleClose}
      size="md"
      closeOnOutsideClick={!isCreating}
    >
      {/* Header */}
      <ModalHeader>
        <div className="flex items-center gap-3">
          <div className="bg-accent/10 rounded-lg p-2">
            <DollarSign className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-text-primary">
              {t('suppliers.financial.addPaymentModal.title')}
            </h2>
            <p className="text-sm text-text-secondary">
              {supplier.businessName}
            </p>
          </div>
        </div>
      </ModalHeader>

      {/* Body */}
      <ModalBody>
        <div className="space-y-4">

          {/* Amount */}
          <div className="space-y-1.5">
            <Label className="text-sm text-text-secondary">
              {t('suppliers.financial.addPaymentModal.amount')} *
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-text-tertiary">
                ₹
              </span>
              <Input
                type="number"
                value={formData.amount}
                onChange={e => handleChange('amount', e.target.value)}
                placeholder="0"
                className="pl-7"
                min={0}
              />
            </div>
            {errors.amount && (
              <p className="text-xs text-status-error">{errors.amount}</p>
            )}
          </div>

          {/* Payment Mode */}
          <div className="space-y-1.5">
            <Label className="text-sm text-text-secondary">
              {t('suppliers.financial.addPaymentModal.paymentMode')} *
            </Label>
            <Select
              value={formData.paymentMode}
              onValueChange={v => handleChange('paymentMode', v)}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={t('suppliers.financial.addPaymentModal.selectPaymentMode')}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="upi">UPI</SelectItem>
                <SelectItem value="cheque">Cheque</SelectItem>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
              </SelectContent>
            </Select>
            {errors.paymentMode && (
              <p className="text-xs text-status-error">{errors.paymentMode}</p>
            )}
          </div>

          {/* Payment Date */}
          <div className="space-y-1.5">
            <Label className="text-sm text-text-secondary">
              {t('suppliers.financial.addPaymentModal.paymentDate')} *
            </Label>
            <Input
              type="date"
              value={formData.paymentDate}
              onChange={e => handleChange('paymentDate', e.target.value)}
            />
            {errors.paymentDate && (
              <p className="text-xs text-status-error">{errors.paymentDate}</p>
            )}
          </div>

          {/* Transaction ID (optional) */}
          <div className="space-y-1.5">
            <Label className="text-sm text-text-secondary">
              {t('suppliers.financial.addPaymentModal.transactionId')}{' '}
              <span className="text-text-tertiary">
                ({t('common.optional')})
              </span>
            </Label>
            <Input
              value={formData.transactionId}
              onChange={e => handleChange('transactionId', e.target.value)}
              placeholder={t('suppliers.financial.addPaymentModal.transactionIdPlaceholder')}
            />
          </div>

          {/* Notes (optional) */}
          <div className="space-y-1.5">
            <Label className="text-sm text-text-secondary">
              {t('suppliers.financial.addPaymentModal.notes')}{' '}
              <span className="text-text-tertiary">
                ({t('common.optional')})
              </span>
            </Label>
            <Input
              value={formData.notes}
              onChange={e => handleChange('notes', e.target.value)}
              placeholder={t('suppliers.financial.addPaymentModal.notesPlaceholder')}
            />
          </div>

          {/* Supplier Balance Info */}
          <div className="rounded-lg border border-border-secondary bg-bg-tertiary p-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">
                {t('suppliers.financial.currentBalance')}
              </span>
              <span
                className={`font-semibold ${
                  supplier.currentBalance > 0
                    ? 'text-status-error'
                    : 'text-status-success'
                }`}
              >
                ₹{Math.abs(supplier.currentBalance).toLocaleString('en-IN')}
                {supplier.currentBalance > 0 ? ' (Due)' : ' (Advance)'}
              </span>
            </div>
          </div>
        </div>
      </ModalBody>

      {/* Footer */}
      <ModalFooter align="right">
        <Button
          variant="outline"
          onClick={handleClose}
          disabled={isCreating}
        >
          {t('common.cancel')}
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isCreating}
          isLoading={isCreating}
          className="gap-2"
        >
          <DollarSign className="h-4 w-4" />
          {t('suppliers.financial.addPaymentModal.submit')}
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default AddPaymentModal