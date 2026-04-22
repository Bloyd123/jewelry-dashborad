// FILE: src/components/girviTransfer/GirviTransferForm/GirviTransferForm.desktop.tsx
import { useState, useEffect } from 'react'
import { useGirviInterest }    from '@/hooks/girvi/useGirviInterest'
import { useTranslation } from 'react-i18next'
import { Button }         from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Save, X, Loader2 }  from 'lucide-react'
import { ConfirmDialog }     from '@/components/ui/overlay/Dialog/ConfirmDialog'
import { useNotification }   from '@/hooks/useNotification'
import { useGirviTransferActions } from '@/hooks/girviTransfer'
import { transferOutSchema }       from '@/validators/girviTransferValidation'
import { FromPartySection }        from './sections/FromPartySection'
import { ToPartySection }          from './sections/ToPartySection'
import { TransferFinancialsSection } from './sections/TransferFinancialsSection'
import { ReviewSection }           from './sections/ReviewSection'
import type { GirviTransferFormProps, GirviTransferFormData } from './GirviTransferForm.types'

export default function GirviTransferFormDesktop({
  shopId,
  girviId,
  onSuccess,
  onCancel,
  girviInfo,
}: GirviTransferFormProps) {
  const { t }          = useTranslation()
  const { showError }  = useNotification()

  const [showConfirm, setShowConfirm] = useState(false)
const { interestCalculated } = useGirviInterest(shopId, girviId, {
  toDate: new Date().toISOString().split('T')[0],
})

const [formData, setFormData] = useState<Partial<GirviTransferFormData>>({
  fromPartyType:           'shop',
  toPartyType:             'external',
  toPartyInterestType:     'simple',
  ourInterestType:         'simple',
  paymentMode:             'cash',
  transferDate:            new Date().toISOString().split('T')[0],
  partyPrincipalAmount:    girviInfo?.outstandingPrincipal ?? 0,
  ourInterestTillTransfer: 0,
})

// ← Yeh add karo useState ke baad
useEffect(() => {
  if (interestCalculated) {
    setFormData(prev => ({
      ...prev,
      ourInterestTillTransfer: interestCalculated,
    }))
  }
}, [interestCalculated])
  const [errors,  setErrors]  = useState<Record<string, string>>({})

  const { transferOut, isTransferringOut } =
    useGirviTransferActions(shopId, girviId)

  const handleChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => { const e = { ...prev }; delete e[name]; return e })
    }
  }

  const handleSubmit = () => {
    // Build payload for validation
    const payload = {
      fromParty: {
        name:    formData.fromPartyName,
        phone:   formData.fromPartyPhone,
        address: formData.fromPartyAddress,
        type:    formData.fromPartyType,
      },
      toParty: {
         supplierId:   formData.toPartySupplierId, 
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
        // Flatten nested path e.g. toParty.interestRate → toPartyInterestRate
        const path = err.path.join('.')
        validationErrors[path] = err.message
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

  return (
    <div className="container mx-auto max-w-7xl p-6">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-text-primary">
          {t('girviTransfer.form.title', 'Transfer Girvi')}
        </h1>
        {girviInfo && (
          <p className="mt-1 text-text-secondary">
            {t('girviTransfer.form.subtitle', 'Girvi')}: {girviInfo.girviNumber} |{' '}
            {t('girviTransfer.form.outstanding', 'Outstanding')}:{' '}
            ₹{girviInfo.outstandingPrincipal.toLocaleString()}
          </p>
        )}
      </div>

      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* Left Column */}
        <div className="space-y-6">
          <Card className="border-border-primary bg-bg-secondary">
            <CardHeader>
              <CardTitle className="text-text-primary">
                {t('girviTransfer.fromParty.title', 'From Party')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FromPartySection {...sectionProps} />
            </CardContent>
          </Card>

          <Card className="border-border-primary bg-bg-secondary">
            <CardHeader>
              <CardTitle className="text-text-primary">
                {t('girviTransfer.toParty.title', 'To Party')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ToPartySection {...sectionProps} />
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <Card className="border-border-primary bg-bg-secondary">
            <CardHeader>
              <CardTitle className="text-text-primary">
                {t('girviTransfer.financials.title', 'Transfer Financials')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TransferFinancialsSection {...sectionProps} />
            </CardContent>
          </Card>

          <Card className="border-border-primary bg-bg-secondary">
            <CardHeader>
              <CardTitle className="text-text-primary">
                {t('girviTransfer.review.title', 'Review')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ReviewSection {...sectionProps} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Sticky Bottom Actions */}
      <div className="sticky bottom-0 mt-6 border-t border-border-primary bg-bg-primary py-4">
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isTransferringOut}
            className="min-w-[120px]"
          >
            <X className="mr-2 h-4 w-4" />
            {t('common.cancel', 'Cancel')}
          </Button>

          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isTransferringOut}
            className="min-w-[120px]"
          >
            {isTransferringOut ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('common.saving', 'Saving...')}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {t('girviTransfer.form.submit', 'Transfer Girvi')}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        title={t('girviTransfer.confirmTransfer', 'Confirm Transfer?')}
        description={t(
          'girviTransfer.confirmTransferDesc',
          'Are you sure you want to transfer this girvi? This action will change girvi status to Transferred.'
        )}
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