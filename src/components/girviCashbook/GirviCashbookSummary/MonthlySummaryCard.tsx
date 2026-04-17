// FILE: src/components/girviCashbook/GirviCashbookSummary/MonthlySummaryCard.tsx

import React, { useState } from 'react'
import { useTranslation }  from 'react-i18next'
import { BarChart2, TrendingUp, TrendingDown, Loader2 } from 'lucide-react'
import { StatCard, StatCardGrid } from '@/components/ui/data-display/StatCard'
import { Label }            from '@/components/ui/label'
import { Badge }            from '@/components/ui/data-display/Badge/Badge'
import { useMonthlySummary } from '@/hooks/girviCashbook'
import { ENTRY_TYPE_LABELS } from '@/validators/girviCashbookValidation'

interface MonthlySummaryCardProps {
  shopId: string
}

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]

export const MonthlySummaryCard: React.FC<MonthlySummaryCardProps> = ({ shopId }) => {
  const { t }    = useTranslation()
  const now      = new Date()
  const [year,  setYear]  = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)

  const { summary, isLoading } = useMonthlySummary(shopId, year, month)

  return (
    <div className="space-y-4 rounded-lg border border-border-primary bg-bg-secondary p-5">

      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
          <BarChart2 className="h-4 w-4 text-accent" />
          {t('girviCashbook.summary.monthly', 'Monthly Summary')}
        </h3>
        <div className="flex items-center gap-2">
          <select
            value={month}
            onChange={e => setMonth(Number(e.target.value))}
            className="rounded-md border border-border-primary bg-bg-primary px-2 py-1 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
          >
            {MONTH_NAMES.map((name, idx) => (
              <option key={idx + 1} value={idx + 1}>{name}</option>
            ))}
          </select>
          <input
            type="number"
            value={year}
            onChange={e => setYear(Number(e.target.value))}
            min={2000}
            max={2100}
            className="w-20 rounded-md border border-border-primary bg-bg-primary px-2 py-1 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-accent" />
        </div>
      ) : summary ? (
        <>
          <StatCardGrid columns={2}>
            <StatCard
              title={t('girviCashbook.summary.totalInflow', 'Total Inflow')}
              value={`₹${summary.totalInflow.toLocaleString()}`}
              icon={TrendingUp}
              variant="success"
              size="sm"
            />
            <StatCard
              title={t('girviCashbook.summary.totalOutflow', 'Total Outflow')}
              value={`₹${summary.totalOutflow.toLocaleString()}`}
              icon={TrendingDown}
              variant="error"
              size="sm"
            />
          </StatCardGrid>

          <div className="space-y-2 border-t border-border-secondary pt-3">
            {[
              {
                label: t('girviCashbook.summary.openingBalance', 'Opening Balance'),
                value: `₹${summary.openingBalance.toLocaleString()}`,
              },
              {
                label: t('girviCashbook.summary.netFlow', 'Net Flow'),
                value: `₹${summary.netFlow.toLocaleString()}`,
                color: summary.netFlow >= 0
                  ? 'text-status-success'
                  : 'text-status-error',
              },
              {
                label: t('girviCashbook.summary.closingBalance', 'Closing Balance'),
                value: `₹${summary.closingBalance.toLocaleString()}`,
                bold:  true,
              },
              {
                label: t('girviCashbook.summary.totalInterest', 'Total Interest'),
                value: `₹${summary.totalInterest.toLocaleString()}`,
              },
              {
                label: t('girviCashbook.summary.totalPrincipal', 'Total Principal'),
                value: `₹${summary.totalPrincipal.toLocaleString()}`,
              },
              {
                label: t('girviCashbook.summary.totalDiscount', 'Total Discount'),
                value: `₹${summary.totalDiscount.toLocaleString()}`,
              },
              {
                label: t('girviCashbook.summary.newGirviCount', 'New Girvis'),
                value: summary.newGirviCount,
              },
              {
                label: t('girviCashbook.summary.releaseCount', 'Releases'),
                value: summary.releaseCount,
              },
              {
                label: t('girviCashbook.summary.totalEntries', 'Total Entries'),
                value: summary.totalEntries,
              },
            ].map(row => (
              <div
                key={row.label}
                className="flex items-center justify-between text-sm"
              >
                <Label className="text-xs text-text-secondary">{row.label}</Label>
                <span className={`font-medium ${
                  row.bold  ? 'text-base font-bold text-text-primary' :
                  row.color ? row.color :
                  'text-text-primary'
                }`}>
                  {row.value}
                </span>
              </div>
            ))}
          </div>

          {summary.byEntryType && summary.byEntryType.length > 0 && (
            <div className="space-y-2 border-t border-border-secondary pt-3">
              <Label className="text-xs text-text-secondary">
                {t('girviCashbook.summary.byEntryType', 'By Entry Type')}
              </Label>
              {summary.byEntryType.map(item => (
                <div
                  key={item._id}
                  className="flex items-center justify-between text-xs"
                >
                  <Badge variant="outline" size="sm">
                    {ENTRY_TYPE_LABELS[item._id] ?? item._id}
                  </Badge>
                  <div className="flex items-center gap-2">
                    <span className="text-text-secondary">
                      {item.count}x
                    </span>
                    <span className="font-medium text-text-primary">
                      ₹{item.totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <p className="text-center text-sm text-text-tertiary py-4">
          No data for this period
        </p>
      )}
    </div>
  )
}