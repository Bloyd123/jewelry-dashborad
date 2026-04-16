// FILE: src/components/girvi/GirviForm/GirviForm.desktop.tsx

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button }           from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Save, X, Loader2, Printer } from 'lucide-react'
import { ConfirmDialog }    from '@/components/ui/overlay/Dialog/ConfirmDialog'
import { useGirviActions }  from '@/hooks/girvi/useGirviActions'
import { useNotification }  from '@/hooks/useNotification'
import { createGirviSchema } from '@/validators/girviValidation'
import { buildGirviPayload, calcFormTotals, calcLoanToValue } from './GirviForm.utils'
import type { GirviFormProps, GirviFormData } from './GirviForm.types'

// Sections
import { BasicInfoSection }       from './sections/BasicInfoSection'
import { CustomerSection }        from './sections/CustomerSection'
import { ItemsSection }           from './sections/ItemsSection'
import { InterestSection }        from './sections/InterestSection'
import { AdditionalDetailsSection } from '@/components/girvi/GirviForm/sections/AdditionalDetailsSection'
import { ActivityTimelineSection }  from '@//components/girvi/GirviForm/sections/ActivityTimelineSection'

export default function GirviFormDesktop({
  initialData = {},
  shopId,
  girviId,
  onSuccess,
  onCancel,
  mode = 'create',
}: GirviFormProps) {
  const { t } = useTranslation()

  const [formData, setFormData] = useState<Partial<GirviFormData>>({
    interestType:     'simple',
    calculationBasis: 'monthly',
    paymentMode:      'cash',
    girviDate:        new Date().toISOString(),
    items:            [{ itemName: '', itemType: 'gold', quantity: 1, grossWeight: '' as any, lessWeight: 0, condition: 'good' }],
    ...initialData,
  })
  const [errors,             setErrors]     = useState<Record<string, string>>({})
  const [showConfirmDialog, setShowConfirm] = useState(false)

  const { createGirvi, updateGirvi, isCreating, isUpdating } = useGirviActions(shopId)
  const { showSuccess, showError } = useNotification()
  const isLoading = isCreating || isUpdating

  const handleChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => { const n = { ...prev }; delete n[name]; return n })
  }

  const handleBlur = (name: string) => {
    // light per-field validation can be wired here if needed
  }

  const handleSubmit = async () => {
    try {
      createGirviSchema.parse({
        ...formData,
        principalAmount: parseFloat(String(formData.principalAmount)),
        interestRate:    parseFloat(String(formData.interestRate)),
        items: (formData.items || []).map(item => ({
          ...item,
          grossWeight: parseFloat(String(item.grossWeight || 0)),
          lessWeight:  parseFloat(String(item.lessWeight  || 0)),
          quantity:    Number(item.quantity) || 1,
        })),
      })
    } catch (error: any) {
      const validationErrors: Record<string, string> = {}
      error.issues?.forEach((err: any) => {
        const path = err.path?.join('.')
        if (path) validationErrors[path] = err.message
      })
      setErrors(validationErrors)
      showError(
        Object.values(validationErrors).slice(0, 3).map(m => `• ${m}`).join('\n'),
        t('validation.failed')
      )
      return
    }
    setShowConfirm(true)
  }

  const handleConfirmedSubmit = async () => {
    const payload = buildGirviPayload(formData)
    const setFormErrors = (apiErrors: Record<string, string>) => setErrors(apiErrors)

    const result = mode === 'edit' && girviId
      ? await updateGirvi(girviId, payload, setFormErrors)
      : await createGirvi(payload as any, setFormErrors)

    if (result.success) {
      setShowConfirm(false)
      onSuccess?.()
    } else if (result.error) {
      showError(result.error, t('girvi.errors.errorTitle'))
    }
  }

  // Live summary calculations
  const totals   = calcFormTotals(formData.items || [])
  const principal = parseFloat(String(formData.principalAmount || 0))
  const ltv       = totals.totalApproxValue > 0
    ? calcLoanToValue(principal, totals.totalApproxValue)
    : null

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <div className="border-b border-border-primary bg-bg-secondary px-6 py-4">
        <h1 className="text-2xl font-bold text-text-primary">
          {mode === 'create' ? t('girvi.createGirvi') : mode === 'edit' ? t('girvi.editGirvi') : t('girvi.viewGirvi')}
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          {mode === 'create' ? t('girvi.createGirviDescription') : ''}
        </p>
      </div>

      {/* 2-Column Layout */}
      <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-3">

        {/* LEFT COLUMN (2/3) */}
        <div className="space-y-6 lg:col-span-2">

          {/* 1. Customer */}
          <Card className="border-border-primary bg-bg-secondary">
            <CardHeader>
              <CardTitle className="text-text-primary">1️⃣ {t('girvi.customerDetails')}</CardTitle>
            </CardHeader>
            <CardContent>
              <CustomerSection
                data={formData}
                errors={errors}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isLoading || mode === 'view'}
              />
            </CardContent>
          </Card>

          {/* 2. Pledge Items */}
          <Card className="border-border-primary bg-bg-secondary">
            <CardHeader>
              <CardTitle className="text-text-primary">2️⃣ {t('girvi.pledgeItems')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ItemsSection
                data={formData}
                errors={errors}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isLoading || mode === 'view'}
              />
            </CardContent>
          </Card>

          {/* 3. Financial / Interest */}
          <Card className="border-border-primary bg-bg-secondary">
            <CardHeader>
              <CardTitle className="text-text-primary">3️⃣ {t('girvi.financialDetails')}</CardTitle>
            </CardHeader>
            <CardContent>
              <InterestSection
                data={formData}
                errors={errors}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isLoading || mode === 'view'}
              />
            </CardContent>
          </Card>

          {/* 4. Basic Info (dates, slip number) */}
          <Card className="border-border-primary bg-bg-secondary">
            <CardHeader>
              <CardTitle className="text-text-primary">4️⃣ {t('girvi.basicInfo')}</CardTitle>
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

          {/* 5. Additional Details — reused from payment module */}
          <Card className="border-border-primary bg-bg-secondary">
            <CardHeader>
              <CardTitle className="text-text-primary">5️⃣ {t('girvi.additionalDetails')}</CardTitle>
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

          {/* 6. Activity Timeline (view/edit only) — reused from payment module */}
          {mode !== 'create' && (
            <Card className="border-border-primary bg-bg-secondary">
              <CardHeader>
                <CardTitle className="text-text-primary">6️⃣ {t('girvi.activityTimeline')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ActivityTimelineSection activities={[]} />
              </CardContent>
            </Card>
          )}
        </div>

        {/* RIGHT COLUMN (1/3) — sticky summary */}
        <div className="space-y-6 lg:sticky lg:top-6">

          {/* Summary Card */}
          <Card className="border-border-primary bg-bg-secondary">
            <CardHeader>
              <CardTitle className="text-text-primary">{t('girvi.girviSummary')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Customer */}
              {formData.customerName && (
                <div>
                  <p className="text-xs text-text-tertiary">{t('girvi.customer')}</p>
                  <p className="font-semibold text-text-primary">👤 {formData.customerName}</p>
                  {formData.customerPhone && (
                    <p className="text-sm text-text-secondary">📱 {formData.customerPhone}</p>
                  )}
                </div>
              )}

              {/* Items summary */}
              {(formData.items?.length ?? 0) > 0 && (
                <div>
                  <p className="text-xs text-text-tertiary">{t('girvi.pledgeItems')}</p>
                  <p className="font-semibold text-text-primary">
                    {formData.items?.length} {t('girvi.itemsCount')}
                  </p>
                  <div className="mt-1 space-y-0.5 text-sm text-text-secondary">
                    <p>{t('girvi.grossWeight')}: {totals.totalGrossWeight.toFixed(3)}g</p>
                    <p>{t('girvi.netWeight')}: {totals.totalNetWeight.toFixed(3)}g</p>
                    <p className="font-medium text-text-primary">
                      {t('girvi.approxValue')}: ₹{totals.totalApproxValue.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              )}

              {/* Principal */}
              {principal > 0 && (
                <div>
                  <p className="text-xs text-text-tertiary">{t('girvi.principalAmount')}</p>
                  <p className="text-2xl font-bold text-text-primary">
                    ₹{principal.toLocaleString('en-IN')}
                  </p>
                  {ltv !== null && (
                    <span className={`text-xs font-medium ${ltv > 80 ? 'text-status-error' : ltv > 60 ? 'text-status-warning' : 'text-status-success'}`}>
                      LTV: {ltv}%
                    </span>
                  )}
                </div>
              )}

              {/* Interest */}
              {formData.interestRate && (
                <div>
                  <p className="text-xs text-text-tertiary">{t('girvi.interest')}</p>
                  <p className="font-semibold text-text-primary">
                    {formData.interestRate}% / month ({formData.interestType})
                  </p>
                </div>
              )}

              {/* Dates */}
              {formData.girviDate && (
                <div>
                  <p className="text-xs text-text-tertiary">{t('girvi.dates')}</p>
                  <p className="text-sm text-text-primary">
                    📅 {new Date(formData.girviDate).toLocaleDateString('en-IN')}
                  </p>
                  {formData.dueDate && (
                    <p className="text-sm text-text-secondary">
                      ⏰ {t('girvi.due')}: {new Date(formData.dueDate).toLocaleDateString('en-IN')}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Card className="border-border-primary bg-bg-secondary">
            <CardContent className="space-y-3 p-4">
              {mode !== 'view' ? (
                <>
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="w-full"
                  >
                    {isLoading ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t('common.saving')}</>
                    ) : (
                      <><Save className="mr-2 h-4 w-4" />
                        {mode === 'create' ? t('girvi.createGirvi') : t('girvi.updateGirvi')}
                      </>
                    )}
                  </Button>
                  <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading} className="w-full">
                    <X className="mr-2 h-4 w-4" />{t('common.cancel')}
                  </Button>
                </>
              ) : (
                <>
                  <Button type="button" className="w-full">
                    <Printer className="mr-2 h-4 w-4" />{t('girvi.printSlip')}
                  </Button>
                  <Button type="button" variant="outline" onClick={onCancel} className="w-full">
                    <X className="mr-2 h-4 w-4" />{t('common.close')}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirm}
        title={mode === 'create' ? t('girvi.confirmCreate') : t('girvi.confirmUpdate')}
        description={mode === 'create' ? t('girvi.confirmCreateDescription') : t('girvi.confirmUpdateDescription')}
        variant={mode === 'create' ? 'success' : 'info'}
        confirmLabel={mode === 'create' ? t('common.create') : t('common.update')}
        cancelLabel={t('common.cancel')}
        onConfirm={handleConfirmedSubmit}
        onCancel={() => setShowConfirm(false)}
        loading={isLoading}
      />
    </div>
  )
}