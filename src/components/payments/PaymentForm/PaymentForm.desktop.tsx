// FILE: src/components/payments/PaymentForm/PaymentForm.desktop.tsx
// Desktop Layout for PaymentForm (2-Column)

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Save, X, Loader2, Printer, Mail } from 'lucide-react'
import type { PaymentFormProps, PaymentFormData } from './PaymentForm.types'
import { usePaymentActions } from '@/hooks/payment/usePaymentActions'
import { useNotification } from '@/hooks/useNotification'
import { ConfirmDialog } from '@/components/ui/overlay/Dialog/ConfirmDialog'
import { createPaymentSchema } from '@/validators/paymentValidation'
import { buildPaymentDetails } from './PaymentForm.utils'

// Import all sections
import { TransactionTypeSection } from './sections/TransactionTypeSection'
import { BasicInfoSection } from './sections/BasicInfoSection'
import { PartyDetailsSection } from './sections/PartyDetailsSection'
import { ReferenceLinkSection } from './sections/ReferenceLinkSection'
import { PaymentModeSection } from './sections/PaymentModeSection'
import { ModeSpecificDetailsSection } from './sections/ModeSpecificDetailsSection'
import { AdditionalDetailsSection } from './sections/AdditionalDetailsSection'
import { ActivityTimelineSection } from './sections/ActivityTimelineSection'

export default function PaymentFormDesktop({
  initialData = {},
  shopId,
  paymentId,
  onSuccess,
  onCancel,
  mode = 'create',
}: PaymentFormProps) {
  const { t } = useTranslation()
  const [formData, setFormData] = useState<Partial<PaymentFormData>>({
    transactionType: 'receipt',
    paymentDate: new Date().toISOString(),
    paymentTime: new Date().toTimeString().slice(0, 5),
    referenceType: 'none',
      shopId,
    ...initialData,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const { createPayment, updatePayment, isCreating, isUpdating } = usePaymentActions(shopId)
const { showSuccess, showError } = useNotification()
const [showConfirmDialog, setShowConfirmDialog] = useState(false)
const isLoading = isCreating || isUpdating

  const handleChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }))

    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleBlur = (name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }))
  }

const handleSubmit = async (action: 'pending' | 'complete') => {
  try {
    createPaymentSchema.parse({
      ...formData,
      amount: parseFloat(String(formData.amount)),
    })
  } catch (error: any) {
    const validationErrors: Record<string, string> = {}
    error.issues?.forEach((err: any) => {
      if (err.path?.[0]) {
        validationErrors[String(err.path[0])] = err.message
      }
    })
    setErrors(validationErrors)
    const errorMessages = Object.values(validationErrors)
      .map(msg => `• ${msg}`)
      .join('\n')
    showError(
      errorMessages || t('validation.pleaseFillRequired'),
      t('validation.failed')
    )
    return
  }
  setShowConfirmDialog(true)
}

const handleConfirmedSubmit = async () => {
  const payload = {
    paymentType:     formData.paymentType!,
    transactionType: formData.transactionType!,
    amount:          parseFloat(String(formData.amount)),
    paymentMode:     formData.paymentMode!,
    party: {
      partyType: formData.partyType!,
      partyId:   formData.partyId!,
      partyName: formData.partyName!,
      phone:     formData.partyPhone,
      email:     formData.partyEmail,
    },
    reference: {
      referenceType:   formData.referenceType ?? 'none',
      referenceId:     formData.referenceId,
      referenceNumber: formData.referenceNumber,
    },
    paymentDetails: buildPaymentDetails(formData),
    notes: formData.notes,
    tags:  formData.tags,
  }

  const setFormErrors = (apiErrors: Record<string, string>) => setErrors(apiErrors)

  try {
    const result = mode === 'edit' && paymentId
      ? await updatePayment(paymentId, payload, setFormErrors)
      : await createPayment(payload as any, setFormErrors)

    if (result.success) {
      showSuccess(
        mode === 'create' ? t('payment.success.created') : t('payment.success.updated'),
        mode === 'create' ? t('payment.success.createdTitle') : t('payment.success.updatedTitle')
      )
      setShowConfirmDialog(false)
      onSuccess?.()
    } else {
      if (result.error) showError(result.error, t('payment.errors.errorTitle'))
    }
  } catch (error: any) {
    showError(
      error?.message || t('payment.errors.unexpectedError'),
      t('payment.errors.errorTitle')
    )
  }
}

  return (
    <div className="min-h-screen bg-bg-primary overflow-hidden">
      {/* Header */}
      <div className="border-b border-border-primary bg-bg-secondary px-6 py-4">
        <h1 className="text-2xl font-bold text-text-primary">
          {mode === 'create'
            ? t('payment.createPayment')
            : mode === 'edit'
              ? t('payment.editPayment')
              : t('payment.viewPayment')}
        </h1>
        <p className="mt-1 text-text-secondary">
          {mode === 'create'
            ? t('payment.createPaymentDescription')
            : mode === 'edit'
              ? t('payment.editPaymentDescription')
              : t('payment.viewPaymentDescription')}
        </p>
      </div>

      {/* Main Content - 2 Column Layout */}
      <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-3">
        {/* LEFT COLUMN (65%) - Main Form */}
        <div className="space-y-6 lg:col-span-2">
          
          {/* Transaction Type Toggle */}
          <TransactionTypeSection
            data={formData}
            errors={errors}
            onChange={handleChange}
            disabled={isLoading || mode === 'view'}
          />

          {/* 1. Basic Information */}
          <Card className="border-border-primary bg-bg-secondary">
            <CardHeader>
              <CardTitle className="text-text-primary">
                1️⃣ {t('payment.basicInformation')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BasicInfoSection
                data={formData}
                errors={errors}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isLoading || mode === 'view'}
              />
            </CardContent>
          </Card>

          {/* 2. Party Details */}
          <Card className="border-border-primary bg-bg-secondary">
            <CardHeader>
              <CardTitle className="text-text-primary">
                2️⃣ {t('payment.partyDetails')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PartyDetailsSection
                data={formData}
                errors={errors}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isLoading || mode === 'view'}
              />
            </CardContent>
          </Card>

          {/* 3. Reference Link */}
          <Card className="border-border-primary bg-bg-secondary">
            <CardHeader>
              <CardTitle className="text-text-primary">
                3️⃣ {t('payment.linkToReference')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ReferenceLinkSection
                data={formData}
                errors={errors}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isLoading || mode === 'view'}
              />
            </CardContent>
          </Card>

          {/* 4. Payment Mode */}
          <Card className="border-border-primary bg-bg-secondary">
            <CardHeader>
              <CardTitle className="text-text-primary">
                4️⃣ {t('payment.paymentMode')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PaymentModeSection
                data={formData}
                errors={errors}
                onChange={handleChange}
                disabled={isLoading || mode === 'view'}
              />
            </CardContent>
          </Card>

          {/* 5. Mode-Specific Details */}
          {formData.paymentMode && (
            <ModeSpecificDetailsSection
              data={formData}
              errors={errors}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={isLoading || mode === 'view'}
            />
          )}

          {/* 6. Additional Details */}
          <Card className="border-border-primary bg-bg-secondary">
            <CardHeader>
              <CardTitle className="text-text-primary">
                6️⃣ {t('payment.additionalDetails')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AdditionalDetailsSection
                data={formData}
                errors={errors}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isLoading || mode === 'view'}
              />
            </CardContent>
          </Card>

          {/* 7. Activity Timeline (View/Edit Mode Only) */}
          {mode !== 'create' && (
            <Card className="border-border-primary bg-bg-secondary">
              <CardHeader>
                <CardTitle className="text-text-primary">
                  7️⃣ {t('payment.activityTimeline')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ActivityTimelineSection activities={[]} />
              </CardContent>
            </Card>
          )}
        </div>

        {/* RIGHT COLUMN (35%) - Summary & Actions */}
        {/* RIGHT COLUMN */}
<div className="space-y-6 lg:sticky lg:top-6 lg:max-h-screen lg:overflow-y-auto">
          {/* Payment Summary */}
          <Card className="sticky top-6 border-border-primary bg-bg-secondary">
            <CardHeader>
              <CardTitle className="text-text-primary">
                {t('payment.paymentSummary')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Amount */}
              <div>
                <p className="text-sm text-text-tertiary">
                  {t('payment.amount')}
                </p>
                <p className="text-2xl font-bold text-text-primary">
                  ₹
                  {formData.amount
                    ? parseFloat(String(formData.amount)).toLocaleString(
                        'en-IN'
                      )
                    : '0.00'}
                </p>
              </div>

              {/* Transaction Type */}
              {formData.transactionType && (
                <div>
                  <p className="text-sm text-text-tertiary">
                    {t('payment.transactionType')}
                  </p>
                  <p
                    className={`font-semibold ${
                      formData.transactionType === 'receipt'
                        ? 'text-status-success'
                        : 'text-status-error'
                    }`}
                  >
                    {formData.transactionType === 'receipt' ? '🟢' : '🔴'}{' '}
                    {formData.transactionType === 'receipt'
                      ? t('payment.receipt')
                      : t('payment.payment')}
                  </p>
                </div>
              )}

              {/* Payment Mode */}
              {formData.paymentMode && (
                <div>
                  <p className="text-sm text-text-tertiary">
                    {t('payment.paymentMode')}
                  </p>
                  <p className="font-semibold capitalize text-text-primary">
                    {formData.paymentMode.replace('_', ' ')}
                  </p>
                </div>
              )}

              {/* Party */}
              {formData.partyName && (
                <div>
                  <p className="text-sm text-text-tertiary">
                    {t('payment.party')}
                  </p>
                  <p className="font-semibold text-text-primary">
                    👤 {formData.partyName}
                  </p>
                  {formData.partyPhone && (
                    <p className="text-sm text-text-secondary">
                      📱 {formData.partyPhone}
                    </p>
                  )}
                </div>
              )}

              {/* Reference */}
              {formData.referenceNumber && (
                <div>
                  <p className="text-sm text-text-tertiary">
                    {t('payment.linkedTo')}
                  </p>
                  <p className="font-semibold text-text-primary">
                    🧾 {formData.referenceNumber}
                  </p>
                </div>
              )}

              {/* Date & Time */}
              {formData.paymentDate && (
                <div>
                  <p className="text-sm text-text-tertiary">
                    {t('payment.dateTime')}
                  </p>
                  <p className="text-text-primary">
                    📅 {new Date(formData.paymentDate).toLocaleDateString()}
                    {formData.paymentTime && `, ${formData.paymentTime}`}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Card className="border-border-primary bg-bg-secondary">
            <CardContent className="space-y-3 p-4">
              {mode === 'create' || mode === 'edit' ? (
                <>
                  <Button
                    type="button"
                    onClick={() => handleSubmit('complete')}
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t('common.saving')}
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        {t('payment.completePayment')}
                      </>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleSubmit('pending')}
                    disabled={isLoading}
                    className="w-full"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {t('payment.saveAsPending')}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={isLoading}
                    className="w-full"
                  >
                    <X className="mr-2 h-4 w-4" />
                    {t('common.cancel')}
                  </Button>
                </>
              ) : (
                <>
                  <Button type="button" className="w-full">
                    <Printer className="mr-2 h-4 w-4" />
                    {t('payment.printReceipt')}
                  </Button>

                  <Button type="button" variant="outline" className="w-full">
                    <Mail className="mr-2 h-4 w-4" />
                    {t('payment.sendReceipt')}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    className="w-full"
                  >
                    <X className="mr-2 h-4 w-4" />
                    {t('common.close')}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

<ConfirmDialog
  open={showConfirmDialog}
  onOpenChange={setShowConfirmDialog}
  title={mode === 'create' ? t('payment.confirmCreate') : t('payment.confirmUpdate')}
  description={mode === 'create' ? t('payment.confirmCreateDescription') : t('payment.confirmUpdateDescription')}
  variant={mode === 'create' ? 'success' : 'info'}
  confirmLabel={mode === 'create' ? t('common.create') : t('common.update')}
  cancelLabel={t('common.cancel')}
  onConfirm={handleConfirmedSubmit}
  onCancel={() => setShowConfirmDialog(false)}
  loading={isLoading}
/>
        </div>
      </div>
    </div>
  )
}
