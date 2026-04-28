// FILE: src/components/bugReport/BugReportForm/BugReportForm.desktop.tsx

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { useScreenshotUpload } from '@/hooks/bugReport/useScreenshotUpload'
import {
  Bug,
  AlertTriangle,
  CheckCircle2,
  X,
  Upload,
  Loader2,
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/data-display/Badge/Badge'
import { bugReportSchema, type BugReportFormData } from '@/validators/bugReportValidator'
import { useBugReport } from '@/hooks/bugReport/useBugReport'
import type { BugReportFormProps } from './BugReportForm'

export const BugReportFormDesktop = ({
  onSuccess,
  onCancel,
  prefillPageUrl,
  prefillModuleName,
}: BugReportFormProps) => {
  const { t } = useTranslation()
  const { submitBugReport, isSubmitting } = useBugReport()
  const { screenshots, screenshotPayload, isUploading, handleFileChange, removeScreenshot } = useScreenshotUpload()
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

  const severityColor = {
    critical: 'text-status-error',
    high: 'text-status-warning',
    medium: 'text-accent',
    low: 'text-status-success',
  }

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
      <div className="flex flex-col items-center justify-center gap-6 py-16 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-status-success/10">
          <CheckCircle2 className="h-10 w-10 text-status-success" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-text-primary">
            {t('bugReport.successTitle')}
          </h2>
          <p className="text-text-secondary">{t('bugReport.successDesc')}</p>
          {ticketNumber && (
            <Badge variant="info" size="md">
              {t('bugReport.ticket')}: {ticketNumber}
            </Badge>
          )}
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => {
              setSubmitted(false)
              onSuccess?.(ticketNumber)
            }}
          >
            {t('bugReport.submitAnother')}
          </Button>
          <Button onClick={() => onSuccess?.(ticketNumber)}>
            {t('common.close')}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-7xl p-6">
      {/* Page Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-status-error/10">
          <Bug className="h-5 w-5 text-status-error" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-text-primary">
            {t('bugReport.title')}
          </h1>
          <p className="mt-1 text-text-secondary">{t('bugReport.subtitle')}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

          {/* ── LEFT COLUMN ─────────────────────────────── */}
          <div className="space-y-6">

            {/* Bug Details Card */}
            <Card className="border-border-primary bg-bg-secondary">
              <CardHeader>
                <CardTitle className="text-text-primary">
                  {t('bugReport.sections.bugDetails')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Title */}
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

                {/* Description */}
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

                {/* Steps to Reproduce */}
                <div className="space-y-1.5">
                  <Label htmlFor="stepsToReproduce">
                    {t('bugReport.form.stepsToReproduce')}
                  </Label>
                  <Textarea
                    id="stepsToReproduce"
                    {...register('stepsToReproduce')}
                    rows={3}
                    placeholder={t('bugReport.form.stepsPlaceholder')}
                  />
                </div>

                {/* Expected / Actual Behavior */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="expectedBehavior">
                      {t('bugReport.form.expectedBehavior')}
                    </Label>
                    <Textarea
                      id="expectedBehavior"
                      {...register('expectedBehavior')}
                      rows={2}
                      placeholder={t('bugReport.form.expectedPlaceholder')}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="actualBehavior">
                      {t('bugReport.form.actualBehavior')}
                    </Label>
                    <Textarea
                      id="actualBehavior"
                      {...register('actualBehavior')}
                      rows={2}
                      placeholder={t('bugReport.form.actualPlaceholder')}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Screenshots Card */}
            <Card className="border-border-primary bg-bg-secondary">
              <CardHeader>
                <CardTitle className="text-text-primary">
                  {t('bugReport.form.screenshots')}
                  <span className="ml-2 text-sm font-normal text-text-secondary">
                    ({screenshots.length}/5)
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <label className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-border-secondary px-4 py-3 hover:border-accent transition-colors">
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
                  <div className="mt-3 flex flex-wrap gap-2">
                    {screenshots.map(s => (
                      <div key={s.fileId} className="relative">
                        <img
                          src={s.previewUrl}
                          alt={s.filename}
                          className="h-16 w-16 rounded-md object-cover border border-border-secondary"
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
              </CardContent>
            </Card>
          </div>

          {/* ── RIGHT COLUMN ────────────────────────────── */}
          <div className="space-y-6">

            {/* Classification Card */}
            <Card className="border-border-primary bg-bg-secondary">
              <CardHeader>
                <CardTitle className="text-text-primary">
                  {t('bugReport.sections.classification')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Category */}
                <div className="space-y-1.5">
                  <Label>{t('bugReport.form.category')}</Label>
                  <Select
                    defaultValue="other"
                    onValueChange={val => setValue('category', val as any)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {['ui', 'functional', 'performance', 'data', 'crash', 'security', 'other'].map(c => (
                        <SelectItem key={c} value={c}>
                          {t(`bugReport.categories.${c}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Severity */}
                <div className="space-y-1.5">
                  <Label>{t('bugReport.form.severity')}</Label>
                  <Select
                    defaultValue="medium"
                    onValueChange={val => setValue('severity', val as any)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {['critical', 'high', 'medium', 'low'].map(s => (
                        <SelectItem key={s} value={s}>
                          <span className={severityColor[s as keyof typeof severityColor]}>
                            {t(`bugReport.severity.${s}`)}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {severity === 'critical' && (
                    <div className="flex items-center gap-1.5 rounded-md bg-status-error/10 px-3 py-2">
                      <AlertTriangle className="h-4 w-4 text-status-error" />
                      <p className="text-xs text-status-error">
                        {t('bugReport.criticalWarning')}
                      </p>
                    </div>
                  )}
                </div>

                {/* Priority */}
                <div className="space-y-1.5">
                  <Label>{t('bugReport.form.priority')}</Label>
                  <Select
                    defaultValue="normal"
                    onValueChange={val => setValue('priority', val as any)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {['urgent', 'high', 'normal', 'low'].map(p => (
                        <SelectItem key={p} value={p}>
                          {t(`bugReport.priority.${p}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Environment Card */}
            <Card className="border-border-primary bg-bg-secondary">
              <CardHeader>
                <CardTitle className="text-text-primary">
                  {t('bugReport.sections.environment')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Page URL */}
                <div className="space-y-1.5">
                  <Label htmlFor="pageUrl">{t('bugReport.form.pageUrl')}</Label>
                  <Input
                    id="pageUrl"
                    {...register('pageUrl')}
                    placeholder="https://..."
                  />
                </div>

                {/* Module Name */}
                <div className="space-y-1.5">
                  <Label htmlFor="moduleName">{t('bugReport.form.moduleName')}</Label>
                  <Input
                    id="moduleName"
                    {...register('moduleName')}
                    placeholder={t('bugReport.form.moduleNamePlaceholder')}
                  />
                </div>

                {/* App Version */}
                <div className="space-y-1.5">
                  <Label htmlFor="appVersion">{t('bugReport.form.appVersion')}</Label>
                  <Input
                    id="appVersion"
                    {...register('appVersion')}
                    placeholder="v1.0.0"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Reporter Info Card */}
            <Card className="border-border-primary bg-bg-secondary">
              <CardHeader>
                <CardTitle className="text-text-primary">
                  {t('bugReport.form.reporterInfo')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="reporterName">
                    {t('bugReport.form.reporterName')}
                  </Label>
                  <Input
                    id="reporterName"
                    {...register('reporterName')}
                    placeholder={t('bugReport.form.reporterNamePlaceholder')}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="reporterEmail">
                    {t('bugReport.form.reporterEmail')}
                  </Label>
                  <Input
                    id="reporterEmail"
                    type="email"
                    {...register('reporterEmail')}
                    placeholder="email@example.com"
                    className={errors.reporterEmail ? 'border-status-error' : ''}
                  />
                  {errors.reporterEmail && (
                    <p className="text-xs text-status-error">
                      {errors.reporterEmail.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sticky Bottom Actions */}
        <div className="sticky bottom-0 mt-6 border-t border-border-primary bg-bg-primary py-4">
          <div className="flex justify-end gap-3">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting || isUploading}
                className="min-w-[120px]"
              >
                <X className="mr-2 h-4 w-4" />
                {t('common.cancel')}
              </Button>
            )}
            <Button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="min-w-[120px]"
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
          </div>
        </div>
      </form>
    </div>
  )
}