// FILE: src/components/girviTransfer/GirviTransferForm/GirviTransferForm.mobile.tsx

import { useState }       from 'react'
import { useTranslation } from 'react-i18next'
import { Button }         from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Save, X, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
import { ConfirmDialog }         from '@/components/ui/overlay/Dialog/ConfirmDialog'
import { useNotification }       from '@/hooks/useNotification'
import { useGirviTransferActions } from '@/hooks/girviTransfer'
import { transferOutSchema }       from '@/validators/girviTransferValidation'
import { FromPartySection }        from './sections/FromPartySection'
import { ToPartySection }          from './sections/ToPartySection'
import { TransferFinancialsSection } from './sections/TransferFinancialsSection'
import { ReviewSection }           from './sections/ReviewSection'
import type { GirviTransferFormProps, GirviTransferFormData } from './GirviTransferForm.types'

const STEPS = [
  { id: 'from',      label: 'From Party'  },
  { id: 'to',        label: 'To Party'    },
  { id: 'financials', label: 'Financials' },
  { id: 'review',    label: 'Review'      },
]

export default function GirviTransferFormMobile({
  shopId,
  girviId,
  onSuccess,
  onCancel,
  girviInfo,
}: GirviTransferFormProps) {
  const { t }         = useTranslation()
  const { showError } = useNotification()

  const [currentStep, setCurrentStep] = useState(0)
  const [showConfirm, setShowConfirm] = useState(false)

  const [formData, setFormData] = useState<Partial<GirviTransferFormData>>({
    fromPartyType:        'shop',
    toPartyType:          'external',
    toPartyInterestType:  'simple',
    ourInterestType:      'simple',
    paymentMode:          'cash',
    transferDate:         new Date().toISOString().split('T')[0],
    partyPrincipalAmount: girviInfo?.outstandingPrincipal ?? 0,
    ourInterestTillTransfer: 0,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { transferOut, isTransferringOut } =
    useGirviTransferActions(shopId, girviId)

  const handleChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => { const e = { ...prev }; delete e[name]; return e })
    }
  }

  const handleSubmit = () => {
    const payload = {
      fromParty: {
        name:    formData.fromPartyName,
        phone:   formData.fromPartyPhone,
        address: formData.fromPartyAddress,
        type:    formData.fromPartyType,
      },
      toParty: {
        name:         formData.toPartyName,
        phone:        formData.toPartyPhone,
        address:      formData.toPartyAddress,
        type:         formData.toPartyType,
        interestRate: formData.toPartyInterestRate,
        interestType: formData.toPartyInterestType,
      },
      transferDate:            formData.transferDate,
      partyPrincipalAmount:    formData.partyPrincipalAmount,
      ourInterestTillTransfer: formData.ourInterestTillTransfer,
      ourInterestType:         formData.ourInterestType,
      transferAmount:          formData.transferAmount,
      commission:              formData.commission,
      paymentMode:             formData.paymentMode,
      transactionReference:    formData.transactionReference,
      notes:                   formData.notes,
    }

    try {
      transferOutSchema.parse(payload)
    } catch (error: any) {
      const validationErrors: Record<string, string> = {}
      error.issues?.forEach((err: any) => {
        const path = err.path.join('.')
        validationErrors[path] = err.message
      })
      setErrors(validationErrors)
      showError(
        t('girviTransfer.errors.pleaseFillRequired', 'Please fill all required fields'),
        t('girviTransfer.errors.validationFailed',   'Validation Failed')
      )
      return
    }

    setShowConfirm(true)
  }

  const handleConfirmedSubmit = async () => {
    const payload = {
      fromParty: {
        name:    formData.fromPartyName!,
        phone:   formData.fromPartyPhone,
        address: formData.fromPartyAddress,
        type:    formData.fromPartyType,
      },
      toParty: {
        name:         formData.toPartyName!,
        phone:        formData.toPartyPhone,
        address:      formData.toPartyAddress,
        type:         formData.toPartyType,
        interestRate: formData.toPartyInterestRate!,
        interestType: formData.toPartyInterestType!,
      },
      transferDate:            formData.transferDate!,
      partyPrincipalAmount:    formData.partyPrincipalAmount!,
      ourInterestTillTransfer: formData.ourInterestTillTransfer,
      ourInterestType:         formData.ourInterestType,
      transferAmount:          formData.transferAmount,
      commission:              formData.commission,
      paymentMode:             formData.paymentMode,
      transactionReference:    formData.transactionReference,
      notes:                   formData.notes,
    }

    const result = await transferOut(payload, setErrors)
    if (result.success) {
      setShowConfirm(false)
      onSuccess?.()
    }
  }

  const sectionProps = {
    data:     formData,
    errors,
    onChange: handleChange,
    disabled: isTransferringOut,
      shopId, 
  }

  const renderStep = () => {
    switch (STEPS[currentStep].id) {
      case 'from':       return <FromPartySection          {...sectionProps} />
      case 'to':         return <ToPartySection            {...sectionProps} />
      case 'financials': return <TransferFinancialsSection {...sectionProps} />
      case 'review':     return <ReviewSection             {...sectionProps} />
      default:           return null
    }
  }

  return (
    <div className="min-h-screen bg-bg-primary pb-24">

      {/* Sticky Header */}
      <div className="sticky top-0 z-10 border-b border-border-primary bg-bg-secondary p-4">
        <h1 className="text-xl font-bold text-text-primary">
          {t('girviTransfer.form.title', 'Transfer Girvi')}
        </h1>
        {girviInfo && (
          <p className="text-xs text-text-secondary">{girviInfo.girviNumber}</p>
        )}

        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm text-text-secondary">
            {t('common.step', 'Step')} {currentStep + 1} {t('common.of', 'of')} {STEPS.length}
          </span>
          <span className="text-sm font-medium text-accent">
            {STEPS[currentStep].label}
          </span>
        </div>

        <div className="mt-2 h-1 overflow-hidden rounded-full bg-bg-tertiary">
          <div
            className="h-full bg-accent transition-all duration-300"
            style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="p-4">
        <Card className="border-border-primary bg-bg-secondary">
          <CardContent className="p-4">{renderStep()}</CardContent>
        </Card>
      </div>

      {/* Fixed Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-border-primary bg-bg-secondary p-4">
        <div className="flex gap-2">
          {currentStep > 0 ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentStep(s => s - 1)}
              disabled={isTransferringOut}
              className="flex-1"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              {t('common.previous', 'Previous')}
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isTransferringOut}
              className="flex-1"
            >
              <X className="mr-2 h-4 w-4" />
              {t('common.cancel', 'Cancel')}
            </Button>
          )}

          {currentStep < STEPS.length - 1 ? (
            <Button
              type="button"
              onClick={() => setCurrentStep(s => s + 1)}
              disabled={isTransferringOut}
              className="flex-1"
            >
              {t('common.next', 'Next')}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isTransferringOut}
              className="flex-1"
            >
              {isTransferringOut ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t('common.saving', 'Saving...')}</>
              ) : (
                <><Save className="mr-2 h-4 w-4" />{t('girviTransfer.form.submit', 'Transfer')}</>
              )}
            </Button>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        title={t('girviTransfer.confirmTransfer', 'Confirm Transfer?')}
        description={t('girviTransfer.confirmTransferDesc', 'Are you sure you want to transfer this girvi?')}
        variant="warning"
        confirmLabel={t('girviTransfer.form.submit', 'Transfer Girvi')}
        cancelLabel={t('common.cancel', 'Cancel')}
        onConfirm={handleConfirmedSubmit}
        onCancel={() => setShowConfirm(false)}
        loading={isTransferringOut}
      />
    </div>
  )
}