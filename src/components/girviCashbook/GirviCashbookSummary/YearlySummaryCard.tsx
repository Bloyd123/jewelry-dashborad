// FILE: src/components/girviCashbook/GirviCashbookSummary/YearlySummaryCard.tsx

import React, { useState } from 'react'
import { useTranslation }  from 'react-i18next'
import { TrendingUp, TrendingDown, Loader2 } from 'lucide-react'
import { StatCard, StatCardGrid } from '@/components/ui/data-display/StatCard'
import { Label }           from '@/components/ui/label'
import { useYearlySummary } from '@/hooks/girviCashbook'

interface YearlySummaryCardProps {
  shopId: string
}

const MONTH_NAMES = [
  'Jan','Feb','Mar','Apr','May','Jun',
  'Jul','Aug','Sep','Oct','Nov','Dec',
]

export const YearlySummaryCard: React.FC<YearlySummaryCardProps> = ({ shopId }) => {
  const { t }  = useTranslation()
  const [year, setYear] = useState(new Date().getFullYear())

  const { summary, isLoading } = useYearlySummary(shopId, year)

  return (
    <div className="space-y-4 rounded-lg border border-border-primary bg-bg-secondary p-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-accent" />
          {t('girviCashbook.summary.yearly', 'Yearly Summary')}
        </h3>
        <input
          type="number"
          value={year}
          onChange={e => setYear(Number(e.target.value))}
          min={2000}
          max={2100}
          className="w-24 rounded-md border border-border-primary bg-bg-primary px-2 py-1 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
        />
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
                label: t('girviCashbook.summary.netFlow', 'Net Flow'),
                value: `₹${summary.netFlow.toLocaleString()}`,
                color: summary.netFlow >= 0
                  ? 'text-status-success'
                  : 'text-status-error',
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
                value: summary.totalNewGirvis,
              },
              {
                label: t('girviCashbook.summary.releaseCount', 'Releases'),
                value: summary.totalReleases,
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
                  row.color ? row.color : 'text-text-primary'
                }`}>
                  {row.value}
                </span>
              </div>
            ))}
          </div>

          {summary.monthlyBreakdown && summary.monthlyBreakdown.length > 0 && (
            <div className="space-y-2 border-t border-border-secondary pt-3">
              <Label className="text-xs text-text-secondary">
                {t('girviCashbook.summary.monthlyBreakdown', 'Monthly Breakdown')}
              </Label>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border-secondary text-left">
                      {['Month', 'Inflow', 'Outflow', 'Net', 'Interest'].map(h => (
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
                    {summary.monthlyBreakdown.map(item => (
                      <tr
                        key={item.month}
                        className="hover:bg-bg-tertiary transition-colors"
                      >
                        <td className="py-1.5 pr-3 font-medium text-text-primary">
                          {MONTH_NAMES[item.month - 1]}
                        </td>
                        <td className="py-1.5 pr-3 text-status-success">
                          ₹{item.totalInflow.toLocaleString()}
                        </td>
                        <td className="py-1.5 pr-3 text-status-error">
                          ₹{item.totalOutflow.toLocaleString()}
                        </td>
                        <td className={`py-1.5 pr-3 font-medium ${
                          item.netFlow >= 0
                            ? 'text-status-success'
                            : 'text-status-error'
                        }`}>
                          ₹{item.netFlow.toLocaleString()}
                        </td>
                        <td className="py-1.5 text-text-secondary">
                          ₹{item.totalInterest.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      ) : (
        <p className="text-center text-sm text-text-tertiary py-4">
          No data for this year
        </p>
      )}
    </div>
  )
}