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

import { buildGirviPayload, calcFormTotals, calcLoanToValue, safeFloat, safeInt } from './GirviForm.utils'
import type { GirviFormProps, GirviFormData } from './GirviForm.types'

import { BasicInfoSection }       from './sections/BasicInfoSection'
import { CustomerSection }        from './sections/CustomerSection'
import { ItemsSection }           from './sections/ItemsSection'
import { InterestSection }        from './sections/InterestSection'
import { AdditionalDetailsSection } from '@/components/girvi/GirviForm/sections/AdditionalDetailsSection'
import { ActivityTimelineSection }  from '@//components/girvi/GirviForm/sections/ActivityTimelineSection'
import { Phone, Mail, MapPin } from 'lucide-react'

const RELATION_LABELS: Record<string, string> = {
  son_of:      'S/O',
  daughter_of: 'D/O',
  husband_of:  'H/O',
  wife_of:     'W/O',
  other:       'Rel.',
}

const CustomerViewCard = ({ customer }: { customer: any }) => {
  if (!customer) return null

  const fullName = `${customer.firstName || ''} ${customer.lastName || ''}`.trim()
  const relationLabel = customer.relationType
    ? RELATION_LABELS[customer.relationType] ?? 'Rel.'
    : null

  return (
    <div className="rounded-lg border border-accent/30 bg-accent/5 p-4">
      {/* Avatar + Name */}
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-accent text-lg font-bold text-white">
          {customer.firstName?.[0]?.toUpperCase()}
          {customer.lastName?.[0]?.toUpperCase()}
        </div>
        <div>
          <p className="font-bold text-text-primary">{fullName}</p>
          {customer.customerCode && (
            <p className="text-xs text-text-tertiary">#{customer.customerCode}</p>
          )}
        </div>
      </div>

      {/* Details Grid */}
      <div className="mt-3 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
        {customer.phone && (
          <p className="flex items-center gap-2 text-text-secondary">
            <Phone className="h-3.5 w-3.5 flex-shrink-0 text-text-tertiary" />
            {customer.phone}
          </p>
        )}
        {customer.email && (
          <p className="flex items-center gap-2 text-text-secondary">
            <Mail className="h-3.5 w-3.5 flex-shrink-0 text-text-tertiary" />
            {customer.email}
          </p>
        )}
        {customer.relationName && relationLabel && (
          <p className="text-text-secondary">
            <span className="font-medium text-text-primary">{relationLabel}</span>{' '}
            {customer.relationName}
          </p>
        )}
        {customer.jaati && (
          <p className="text-text-secondary">
            Jaati:{' '}
            <span className="font-medium text-text-primary">{customer.jaati}</span>
          </p>
        )}
        {customer.address?.city && (
          <p className="flex items-center gap-2 text-text-secondary">
            <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-text-tertiary" />
            {customer.address.city}
          </p>
        )}
      </div>
    </div>
  )
}
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
  principalAmount: safeFloat(formData.principalAmount, 0),
  interestRate:    safeFloat(formData.interestRate, 0),
  items: (formData.items || []).map(item => ({
    ...item,
    grossWeight:    safeFloat(item.grossWeight, 0),
    lessWeight:     safeFloat(item.lessWeight,  0),
    quantity:       safeInt(item.quantity, 1),
    tunch:          safeFloat(item.tunch),
    ratePerGram:    safeFloat(item.ratePerGram),
    approxValue:    safeFloat(item.approxValue),
    userGivenValue: safeFloat(item.userGivenValue),
  }))
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

  const totals   = calcFormTotals(formData.items || [])
  const principal = parseFloat(String(formData.principalAmount || 0))
  const ltv       = totals.totalApproxValue > 0
    ? calcLoanToValue(principal, totals.totalApproxValue)
    : null

  return (
    <div className=" bg-bg-primary">
      <div className="border-b border-border-primary bg-bg-secondary px-6 py-4">
        <h1 className="text-2xl font-bold text-text-primary">
          {mode === 'create' ? t('girvi.createGirvi') : mode === 'edit' ? t('girvi.editGirvi') : t('girvi.viewGirvi')}
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          {mode === 'create' ? t('girvi.createGirviDescription') : ''}
        </p>
      </div>

    <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-3 lg:items-start">

        <div className="space-y-6 lg:col-span-2">


<Card className="border-border-primary bg-bg-secondary">
  <CardHeader>
    <CardTitle className="text-text-primary">{t('girvi.customerDetails')}</CardTitle>
  </CardHeader>
  <CardContent>
    {mode === 'view' ? (
      <CustomerViewCard
        customer={
          formData.customerId && typeof formData.customerId === 'object'
            ? formData.customerId
            : {
                firstName:    formData.customerName?.split(' ')[0],
                lastName:     formData.customerName?.split(' ').slice(1).join(' '),
                phone:        formData.customerPhone,
                email:        formData.customerEmail,
              }
        }
      />
    ) : (
      <CustomerSection
        data={formData}
        errors={errors}
        onChange={handleChange}
        onBlur={handleBlur}
        disabled={isLoading}
      />
    )}
  </CardContent>
</Card>
          <Card className="border-border-primary bg-bg-secondary">
            <CardHeader>
              <CardTitle className="text-text-primary">{t('girvi.pledgeItems')}</CardTitle>
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

          <Card className="border-border-primary bg-bg-secondary">
            <CardHeader>
              <CardTitle className="text-text-primary">{t('girvi.financialDetails')}</CardTitle>
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

          <Card className="border-border-primary bg-bg-secondary">
            <CardHeader>
              <CardTitle className="text-text-primary"> {t('girvi.basicInfo')}</CardTitle>
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

          <Card className="border-border-primary bg-bg-secondary">
            <CardHeader>
              <CardTitle className="text-text-primary"> {t('girvi.additionalDetails')}</CardTitle>
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
          {mode !== 'create' && (
            <Card className="border-border-primary bg-bg-secondary">
              <CardHeader>
                <CardTitle className="text-text-primary"> {t('girvi.activityTimeline')}</CardTitle>
              </CardHeader>
              <CardContent>
                <ActivityTimelineSection activities={[]} />
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6 lg:sticky lg:top-6">

          <Card className="border-border-primary bg-bg-secondary">
            <CardHeader>
              <CardTitle className="text-text-primary">{t('girvi.girviSummary')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.customerName && (
                <div>
                  <p className="text-xs text-text-tertiary">{t('girvi.customer')}</p>
                  <p className="font-semibold text-text-primary">{formData.customerName}</p>
                  {formData.customerPhone && (
                    <p className="text-sm text-text-secondary"> {formData.customerPhone}</p>
                  )}
                </div>
              )}
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

              {formData.interestRate && (
                <div>
                  <p className="text-xs text-text-tertiary">{t('girvi.interest')}</p>
                  <p className="font-semibold text-text-primary">
                    {formData.interestRate}% / month ({formData.interestType})
                  </p>
                </div>
              )}

              {formData.girviDate && (
                <div>
                  <p className="text-xs text-text-tertiary">{t('girvi.dates')}</p>
                  <p className="text-sm text-text-primary">
                    {new Date(formData.girviDate).toLocaleDateString('en-IN')}
                  </p>
                  {formData.dueDate && (
                    <p className="text-sm text-text-secondary">
                       {t('girvi.due')}: {new Date(formData.dueDate).toLocaleDateString('en-IN')}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

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