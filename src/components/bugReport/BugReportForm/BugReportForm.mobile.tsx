// FILE: src/components/bugReport/BugReportForm/BugReportForm.mobile.tsx

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { useScreenshotUpload } from '@/hooks/bugReport/useScreenshotUpload'
import {
  Bug,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertTriangle,
  Upload,
  X,
  Save,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/data-display/Badge/Badge'
import { bugReportSchema, type BugReportFormData } from '@/validators/bugReportValidator'
import { useBugReport } from '@/hooks/bugReport/useBugReport'
import type { BugReportFormProps } from './BugReportForm'

const STEPS = [
  { id: 'details',        label: 'Bug Details' },
  { id: 'classification', label: 'Classification' },
  { id: 'environment',    label: 'Environment' },
  { id: 'reporter',       label: 'Reporter Info' },
  { id: 'screenshots',    label: 'Screenshots' },
]

export const BugReportFormMobile = ({
  onSuccess,
  onCancel,
  prefillPageUrl,
  prefillModuleName,
}: BugReportFormProps) => {
  const { t } = useTranslation()
  const { submitBugReport, isSubmitting } = useBugReport()
  const { screenshots, screenshotPayload, isUploading, handleFileChange, removeScreenshot } = useScreenshotUpload()
  const [currentStep, setCurrentStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [ticketNumber, setTicketNumber] = useState('')

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    formState: { errors },
    reset,
  } = useForm<BugReportFormData>({
    resolver: zodResolver(bugReportSchema),
    defaultValues: {
      category: 'other',
      severity: 'medium',
      priority: 'normal',
      pageUrl: prefillPageUrl || window.location.href,
      moduleName: prefillModuleName || '',
    },
  })

  const severity = watch('severity')

  const onSubmit = async (data: BugReportFormData) => {
    const setFormErrors = (validationErrors: Record<string, string>) => {
      Object.entries(validationErrors).forEach(([field, message]) => {
        setError(field as any, { type: 'manual', message })
      })
    }
    const result = await submitBugReport(
      { ...data, screenshots: screenshotPayload },
      setFormErrors
    )
    if (result.success) {
      setTicketNumber((result.data as any)?.ticketNumber || '')
      setSubmitted(true)
      reset()
    }
  }

  // ── Success Screen ───────────────────────────────────────
  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 px-4 py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-status-success/10">
          <CheckCircle2 className="h-8 w-8 text-status-success" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-text-primary">
            {t('bugReport.successTitle')}
          </h2>
          <p className="text-sm text-text-secondary">{t('bugReport.successDesc')}</p>
          {ticketNumber && (
            <Badge variant="info">{t('bugReport.ticket')}: {ticketNumber}</Badge>
          )}
        </div>
        <Button className="w-full" onClick={() => onSuccess?.(ticketNumber)}>
          {t('common.close')}
        </Button>
      </div>
    )
  }

  const renderStep = () => {
    switch (STEPS[currentStep].id) {

      // ── Step 1: Bug Details ──────────────────────────────
      case 'details':
        return (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="title">{t('bugReport.form.title')} *</Label>
              <Input
                id="title"
                {...register('title')}
                placeholder={t('bugReport.form.titlePlaceholder')}
                className={errors.title ? 'border-status-error' : ''}
              />
              {errors.title && (
                <p className="text-xs text-status-error">{errors.title.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="description">{t('bugReport.form.description')} *</Label>
              <Textarea
                id="description"
                {...register('description')}
                rows={4}
                placeholder={t('bugReport.form.descriptionPlaceholder')}
                className={errors.description ? 'border-status-error' : ''}
              />
              {errors.description && (
                <p className="text-xs text-status-error">{errors.description.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="stepsToReproduce">{t('bugReport.form.stepsToReproduce')}</Label>
              <Textarea
                id="stepsToReproduce"
                {...register('stepsToReproduce')}
                rows={3}
                placeholder={t('bugReport.form.stepsPlaceholder')}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="expectedBehavior">{t('bugReport.form.expectedBehavior')}</Label>
              <Textarea
                id="expectedBehavior"
                {...register('expectedBehavior')}
                rows={2}
                placeholder={t('bugReport.form.expectedPlaceholder')}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="actualBehavior">{t('bugReport.form.actualBehavior')}</Label>
              <Textarea
                id="actualBehavior"
                {...register('actualBehavior')}
                rows={2}
                placeholder={t('bugReport.form.actualPlaceholder')}
              />
            </div>
          </div>
        )

      // ── Step 2: Classification ───────────────────────────
      case 'classification':
        return (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>{t('bugReport.form.category')}</Label>
              <Select defaultValue="other" onValueChange={val => setValue('category', val as any)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['ui', 'functional', 'performance', 'data', 'crash', 'security', 'other'].map(c => (
                    <SelectItem key={c} value={c}>{t(`bugReport.categories.${c}`)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>{t('bugReport.form.severity')}</Label>
              <Select defaultValue="medium" onValueChange={val => setValue('severity', val as any)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['critical', 'high', 'medium', 'low'].map(s => (
                    <SelectItem key={s} value={s}>{t(`bugReport.severity.${s}`)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {severity === 'critical' && (
                <div className="flex items-center gap-1.5 rounded-md bg-status-error/10 px-3 py-2">
                  <AlertTriangle className="h-4 w-4 text-status-error" />
                  <p className="text-xs text-status-error">{t('bugReport.criticalWarning')}</p>
                </div>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>{t('bugReport.form.priority')}</Label>
              <Select defaultValue="normal" onValueChange={val => setValue('priority', val as any)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['urgent', 'high', 'normal', 'low'].map(p => (
                    <SelectItem key={p} value={p}>{t(`bugReport.priority.${p}`)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      // ── Step 3: Environment ──────────────────────────────
      case 'environment':
        return (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="pageUrl">{t('bugReport.form.pageUrl')}</Label>
              <Input id="pageUrl" {...register('pageUrl')} placeholder="https://..." />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="moduleName">{t('bugReport.form.moduleName')}</Label>
              <Input
                id="moduleName"
                {...register('moduleName')}
                placeholder={t('bugReport.form.moduleNamePlaceholder')}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="appVersion">{t('bugReport.form.appVersion')}</Label>
              <Input id="appVersion" {...register('appVersion')} placeholder="v1.0.0" />
            </div>
          </div>
        )

      // ── Step 4: Reporter Info ────────────────────────────
      case 'reporter':
        return (
          <div className="space-y-4">
            <p className="text-sm text-text-secondary">{t('bugReport.form.reporterDesc')}</p>
            <div className="space-y-1.5">
              <Label htmlFor="reporterName">{t('bugReport.form.reporterName')}</Label>
              <Input
                id="reporterName"
                {...register('reporterName')}
                placeholder={t('bugReport.form.reporterNamePlaceholder')}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="reporterEmail">{t('bugReport.form.reporterEmail')}</Label>
              <Input
                id="reporterEmail"
                type="email"
                {...register('reporterEmail')}
                placeholder="email@example.com"
                className={errors.reporterEmail ? 'border-status-error' : ''}
              />
              {errors.reporterEmail && (
                <p className="text-xs text-status-error">{errors.reporterEmail.message}</p>
              )}
            </div>
          </div>
        )

      // ── Step 5: Screenshots ──────────────────────────────
      case 'screenshots':
        return (
          <div className="space-y-4">
            <p className="text-sm text-text-secondary">
              {t('bugReport.form.screenshotsDesc')} ({screenshots.length}/5)
            </p>
            <label className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-border-secondary px-4 py-4 hover:border-accent transition-colors">
              <Upload className="h-4 w-4 text-text-secondary" />
              <span className="text-sm text-text-secondary">
                {isUploading
                  ? t('bugReport.uploading')
                  : t('bugReport.form.screenshotsPlaceholder')}
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                disabled={screenshots.length >= 5 || isUploading}
                onChange={e => handleFileChange(e.target.files)}
              />
            </label>
            {screenshots.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {screenshots.map(s => (
                  <div key={s.fileId} className="relative">
                    <img
                      src={s.previewUrl}
                      alt={s.filename}
                      className="h-20 w-20 rounded-md object-cover border border-border-secondary"
                    />
                    <button
                      type="button"
                      onClick={() => removeScreenshot(s.fileId)}
                      className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-status-error text-white"
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-bg-primary pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-border-primary bg-bg-secondary p-4">
        <div className="flex items-center gap-2">
          <Bug className="h-5 w-5 text-status-error" />
          <h1 className="text-xl font-bold text-text-primary">{t('bugReport.title')}</h1>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm text-text-secondary">
            {t('common.step')} {currentStep + 1} {t('common.of')} {STEPS.length}
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
          {/* Back / Cancel */}
          {currentStep > 0 ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentStep(s => s - 1)}
              disabled={isSubmitting || isUploading}
              className="flex-1"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              {t('common.previous')}
            </Button>
          ) : (
            onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting || isUploading}
                className="flex-1"
              >
                <X className="mr-2 h-4 w-4" />
                {t('common.cancel')}
              </Button>
            )
          )}

          {/* Next / Submit */}
          {currentStep < STEPS.length - 1 ? (
            <Button
              type="button"
              onClick={() => setCurrentStep(s => s + 1)}
              disabled={isUploading}
              className="flex-1"
            >
              {t('common.next')}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting || isUploading}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('bugReport.submitting')}
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {t('bugReport.submit')}
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}