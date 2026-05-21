// FILE: src/components/scheme/SchemePage/tabs/SchemeOverviewTab.tsx

import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  Calendar, Coins, Users, Shield,
  RotateCcw, TrendingUp, Tag, FileText,
} from 'lucide-react'
import {
  Accordion, AccordionItem,
  AccordionTrigger, AccordionContent,
} from '@/components/ui/layout/Accordion/Accordion'
import { Badge }  from '@/components/ui/data-display/Badge'
import { Label }  from '@/components/ui/label'
import { StatCard, StatCardGrid } from '@/components/ui/data-display/StatCard'
import type { Scheme } from '@/types/scheme.types'

interface SchemeOverviewTabProps {
  scheme: Scheme
}

export const SchemeOverviewTab: React.FC<SchemeOverviewTabProps> = ({
  scheme,
}) => {
  const { t } = useTranslation()

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency', currency: 'INR', maximumFractionDigits: 0,
    }).format(amount)

  const formatDate = (dateStr?: string) =>
    dateStr
      ? new Date(dateStr).toLocaleDateString('en-IN', {
          day: '2-digit', month: 'short', year: 'numeric',
        })
      : '—'

  return (
    <div className="mx-auto w-full max-w-4xl space-y-4 p-4">

      {/* Stats */}
      <StatCardGrid columns={4} gap="md">
        <StatCard
          title={t('scheme.totalEnrollments')}
          value={scheme.statistics?.totalEnrollments || 0}
          icon={Users}
          variant="info"
          size="md"
        />
        <StatCard
          title={t('scheme.activeEnrollments')}
          value={scheme.statistics?.activeEnrollments || 0}
          icon={TrendingUp}
          variant="success"
          size="md"
        />
        <StatCard
          title={t('scheme.completedEnrollments')}
          value={scheme.statistics?.completedEnrollments || 0}
          icon={Shield}
          variant="default"
          size="md"
        />
        <StatCard
          title={t('scheme.totalRevenue')}
          value={formatCurrency(scheme.statistics?.totalRevenue || 0)}
          icon={Coins}
          variant="warning"
          size="md"
        />
      </StatCardGrid>

      {/* Accordion Sections */}
      <Accordion
        type="multiple"
        defaultValue={['basic', 'installment']}
        variant="separated"
        size="md"
      >
        {/* Basic Info */}
        <AccordionItem value="basic">
          <AccordionTrigger icon={<FileText className="h-5 w-5" />}>
            {t('scheme.basicInformation')}
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs text-text-secondary">
                  {t('scheme.schemeCode')}
                </Label>
                <p className="font-mono text-sm font-medium text-text-primary">
                  {scheme.schemeCode}
                </p>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs text-text-secondary">
                  {t('scheme.schemeType')}
                </Label>
                <Badge variant="default" size="sm">
                  {scheme.schemeType?.replace('_', ' ')}
                </Badge>
              </div>
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <Label className="text-xs text-text-secondary">
                  {t('scheme.description')}
                </Label>
                <p className="text-sm text-text-secondary">
                  {scheme.description || '—'}
                </p>
              </div>
              {scheme.tags && scheme.tags.length > 0 && (
                <div className="flex flex-col gap-2 md:col-span-2">
                  <Label className="text-xs text-text-secondary">
                    {t('scheme.tags')}
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {scheme.tags.map((tag, i) => (
                      <Badge key={i} variant="outline" size="sm">
                        <Tag className="mr-1 h-3 w-3" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Installment Details */}
        <AccordionItem value="installment">
          <AccordionTrigger icon={<Coins className="h-5 w-5" />}>
            {t('scheme.installmentDetails')}
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs text-text-secondary">
                  {t('scheme.installmentAmount')}
                </Label>
                <p className="text-sm font-semibold text-text-primary">
                  {formatCurrency(scheme.installments?.installmentAmount || 0)}
                </p>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs text-text-secondary">
                  {t('scheme.totalInstallments')}
                </Label>
                <p className="text-sm font-medium text-text-primary">
                  {scheme.installments?.totalInstallments || 0}
                </p>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs text-text-secondary">
                  {t('scheme.frequency')}
                </Label>
                <Badge variant="default" size="sm">
                  {scheme.installments?.frequency}
                </Badge>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs text-text-secondary">
                  {t('scheme.duration')}
                </Label>
                <p className="text-sm font-medium text-text-primary">
                  {scheme.duration?.months}M
                  {scheme.duration?.weeks
                    ? ` + ${scheme.duration.weeks}W`
                    : ''}
                </p>
              </div>
              {/* Maturity Summary */}
              <div className="rounded-lg border border-status-success/30 bg-status-success/10 p-4 md:col-span-2">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-xs text-text-tertiary">
                      {t('scheme.totalSchemeAmount')}
                    </p>
                    <p className="text-sm font-semibold text-text-primary">
                      {formatCurrency(scheme.maturity?.totalSchemeAmount || 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-text-tertiary">
                      {t('scheme.bonusAmount')}
                    </p>
                    <p className="text-sm font-semibold text-status-success">
                      +{formatCurrency(scheme.maturity?.bonusAmount || 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-text-tertiary">
                      {t('scheme.totalMaturityValue')}
                    </p>
                    <p className="text-base font-bold text-status-success">
                      {formatCurrency(scheme.maturity?.totalMaturityValue || 0)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Validity */}
        <AccordionItem value="validity">
          <AccordionTrigger icon={<Calendar className="h-5 w-5" />}>
            {t('scheme.validity')}
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs text-text-secondary">
                  {t('scheme.validity.startDate')}
                </Label>
                <p className="text-sm font-medium text-text-primary">
                  {formatDate(scheme.validity?.startDate)}
                </p>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs text-text-secondary">
                  {t('scheme.validity.endDate')}
                </Label>
                <p className="text-sm font-medium text-text-primary">
                  {formatDate(scheme.validity?.endDate)}
                </p>
              </div>
              {scheme.validity?.enrollmentDeadline && (
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs text-text-secondary">
                    {t('scheme.validity.enrollmentDeadline')}
                  </Label>
                  <p className="text-sm font-medium text-text-primary">
                    {formatDate(scheme.validity.enrollmentDeadline)}
                  </p>
                </div>
              )}
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs text-text-secondary">
                  {t('scheme.isActive')}
                </Label>
                <Badge
                  variant={scheme.validity?.isActive ? 'active' : 'inactive'}
                  size="sm"
                  dot
                >
                  {scheme.validity?.isActive
                    ? t('common.active')
                    : t('common.inactive')}
                </Badge>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Eligibility */}
        <AccordionItem value="eligibility">
          <AccordionTrigger icon={<Shield className="h-5 w-5" />}>
            {t('scheme.eligibility')}
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs text-text-secondary">
                  {t('scheme.eligibility.minAge')}
                </Label>
                <p className="text-sm font-medium text-text-primary">
                  {scheme.eligibility?.minAge ?? 18}
                </p>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs text-text-secondary">
                  {t('scheme.eligibility.maxAge')}
                </Label>
                <p className="text-sm font-medium text-text-primary">
                  {scheme.eligibility?.maxAge || t('scheme.eligibility.noLimit')}
                </p>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs text-text-secondary">
                  {t('scheme.eligibility.requiresKYC')}
                </Label>
                <Badge
                  variant={
                    scheme.eligibility?.requiresKYC ? 'warning' : 'default'
                  }
                  size="sm"
                >
                  {scheme.eligibility?.requiresKYC
                    ? t('common.yes')
                    : t('common.no')}
                </Badge>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Redemption */}
        <AccordionItem value="redemption">
          <AccordionTrigger icon={<RotateCcw className="h-5 w-5" />}>
            {t('scheme.redemptionRules')}
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs text-text-secondary">
                  {t('scheme.redemption.canRedeemEarly')}
                </Label>
                <Badge
                  variant={
                    scheme.redemption?.canRedeemEarly ? 'success' : 'default'
                  }
                  size="sm"
                >
                  {scheme.redemption?.canRedeemEarly
                    ? t('common.yes')
                    : t('common.no')}
                </Badge>
              </div>
              {scheme.redemption?.canRedeemEarly && (
                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs text-text-secondary">
                    {t('scheme.redemption.penaltyType')}
                  </Label>
                  <p className="text-sm font-medium capitalize text-text-primary">
                    {scheme.redemption?.earlyRedemptionPenalty?.type || 'none'}
                    {scheme.redemption?.earlyRedemptionPenalty?.type !== 'none' &&
                      ` (${scheme.redemption?.earlyRedemptionPenalty?.value}
                      ${scheme.redemption?.earlyRedemptionPenalty?.type === 'percentage' ? '%' : '₹'})`
                    }
                  </p>
                </div>
              )}
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs text-text-secondary">
                  {t('scheme.redemption.gracePeriodDays')}
                </Label>
                <p className="text-sm font-medium text-text-primary">
                  {scheme.redemption?.gracePeriodDays || 0} {t('common.days')}
                </p>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-xs text-text-secondary">
                  {t('scheme.redemption.missedInstallmentPenalty')}
                </Label>
                <p className="text-sm font-medium text-text-primary">
                  {formatCurrency(
                    scheme.redemption?.missedInstallmentPenalty || 0
                  )}
                </p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Terms */}
        {scheme.termsAndConditions && scheme.termsAndConditions.length > 0 && (
          <AccordionItem value="terms">
            <AccordionTrigger icon={<FileText className="h-5 w-5" />}>
              {t('scheme.termsAndConditions')}
            </AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-2 p-4">
                {scheme.termsAndConditions
                  .sort((a, b) => a.order - b.order)
                  .map((term, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-medium text-accent">
                        {index + 1}
                      </span>
                      <p className="text-sm text-text-secondary">
                        {term.condition}
                      </p>
                    </li>
                  ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </div>
  )
}