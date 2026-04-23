// FILE: src/components/girviCashbook/GirviCashbookSummary/DailySummaryCard.tsx

import React, { useState }  from 'react'
import { useTranslation }   from 'react-i18next'
import { Calendar, TrendingUp, TrendingDown, Loader2 } from 'lucide-react'
import { StatCard, StatCardGrid } from '@/components/ui/data-display/StatCard'
import { Label }            from '@/components/ui/label'
import { Input }            from '@/components/ui/input'
import { useDailySummary }  from '@/hooks/girviCashbook'

interface DailySummaryCardProps {
  shopId: string
}

export const DailySummaryCard: React.FC<DailySummaryCardProps> = ({ shopId }) => {
  const { t }   = useTranslation()
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

  const { summary, isLoading } = useDailySummary(shopId, date)

  return (
    <div className="space-y-4 rounded-lg border border-border-primary bg-bg-secondary p-5">

      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-text-primary">
          <Calendar className="h-4 w-4 text-accent" />
          {t('girviCashbook.summary.daily', 'Daily Summary')}
        </h3>
        <Input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="h-8 w-auto text-xs"
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
                label: t('girviCashbook.summary.totalInterest', 'Interest Received'),
                value: `₹${summary.totalInterest.toLocaleString()}`,
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
        </>
      ) : (
        <p className="py-4 text-center text-sm text-text-tertiary">
          No data for this date
        </p>
      )}
    </div>
  )
}