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

  // ── Safe numbers — undefined aaye toh 0 use karo ─────────────────────────
  const safe = (val: number | undefined) => val ?? 0

  return (
    <div className="space-y-4 rounded-lg border border-border-primary bg-bg-secondary p-5">

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-text-primary">
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

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center py-6">
          <Loader2 className="h-6 w-6 animate-spin text-accent" />
        </div>
      )}

      {/* No data */}
      {!isLoading && !summary && (
        <p className="py-4 text-center text-sm text-text-tertiary">
          No data for this period
        </p>
      )}

      {/* Data */}
      {!isLoading && summary && (
        <>
          {/* Stat Cards */}
          <StatCardGrid columns={2}>
            <StatCard
              title={t('girviCashbook.summary.totalInflow', 'Total Inflow')}
              value={`₹${safe(summary.totalInflow).toLocaleString()}`}
              icon={TrendingUp}
              variant="success"
              size="sm"
            />
            <StatCard
              title={t('girviCashbook.summary.totalOutflow', 'Total Outflow')}
              value={`₹${safe(summary.totalOutflow).toLocaleString()}`}
              icon={TrendingDown}
              variant="error"
              size="sm"
            />
          </StatCardGrid>

          {/* Main Stats */}
          <div className="space-y-2 border-t border-border-secondary pt-3">
            {[
              {
                label: t('girviCashbook.summary.openingBalance', 'Opening Balance'),
                value: `₹${safe(summary.openingBalance).toLocaleString()}`,
              },
              {
                label: t('girviCashbook.summary.netFlow', 'Net Flow'),
                value: `₹${safe(summary.netFlow).toLocaleString()}`,
                color: safe(summary.netFlow) >= 0
                  ? 'text-status-success'
                  : 'text-status-error',
              },
              {
                label: t('girviCashbook.summary.closingBalance', 'Closing Balance'),
                value: `₹${safe(summary.closingBalance).toLocaleString()}`,
                bold:  true,
              },
              {
                label: t('girviCashbook.summary.totalInterest', 'Total Interest'),
                value: `₹${safe(summary.totalInterest).toLocaleString()}`,
              },
              {
                label: t('girviCashbook.summary.totalPrincipal', 'Total Principal'),
                value: `₹${safe(summary.totalPrincipal).toLocaleString()}`,
              },
              {
                label: t('girviCashbook.summary.totalDiscount', 'Total Discount'),
                value: `₹${safe(summary.totalDiscount).toLocaleString()}`,
              },
              {
                label: t('girviCashbook.summary.newGirviCount', 'New Girvis'),
                value: safe(summary.newGirviCount),
              },
              {
                label: t('girviCashbook.summary.releaseCount', 'Releases'),
                value: safe(summary.releaseCount),
              },
              {
                label: t('girviCashbook.summary.totalEntries', 'Total Entries'),
                value: safe(summary.totalEntries),
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

          {/* By Entry Type */}
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
                      {safe(item.count)}x
                    </span>
                    <span className="font-medium text-text-primary">
                      ₹{safe(item.totalAmount).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Daily Breakdown */}
          {summary.dailyBreakdown && summary.dailyBreakdown.length > 0 && (
            <div className="space-y-2 border-t border-border-secondary pt-3">
              <Label className="text-xs text-text-secondary">
                {t('girviCashbook.summary.dailyBreakdown', 'Daily Breakdown')}
              </Label>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border-secondary text-left">
                      {['Day', 'Inflow', 'Outflow', 'Interest', 'Entries'].map(h => (
                        <th
                          key={h}
                          className="pb-1 pr-3 font-medium text-text-secondary"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-secondary">
                    {summary.dailyBreakdown.map(item => (
                      <tr
                        key={item._id}
                        className="hover:bg-bg-tertiary transition-colors"
                      >
                        <td className="py-1.5 pr-3 font-medium text-text-primary">
                          {item._id}
                        </td>
                        <td className="py-1.5 pr-3 text-status-success">
                          ₹{safe(item.totalInflow).toLocaleString()}
                        </td>
                        <td className="py-1.5 pr-3 text-status-error">
                          ₹{safe(item.totalOutflow).toLocaleString()}
                        </td>
                        <td className="py-1.5 pr-3 text-text-secondary">
                          ₹{safe(item.totalInterest).toLocaleString()}
                        </td>
                        <td className="py-1.5 text-text-tertiary">
                          {safe(item.entryCount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}