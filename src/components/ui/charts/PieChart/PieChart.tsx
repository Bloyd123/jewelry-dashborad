// ============================================================================
// FILE: src/components/ui/charts/PieChart/PieChart.tsx
// Flexible Pie Chart Component
// ============================================================================

import * as React from 'react'
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'
import { Loader } from '@/components/ui/loader'

export interface PieChartProps {
  data: any[]
  dataKey: string
  nameKey: string
  height?: number
  loading?: boolean
  showLegend?: boolean
  showTooltip?: boolean
  showLabel?: boolean
  colors?: string[]
  innerRadius?: number
  outerRadius?: number
  className?: string
  formatTooltip?: (value: any) => string
}

export const PieChart = React.forwardRef<HTMLDivElement, PieChartProps>(
  (
    {
      data,
      dataKey,
      nameKey,
      height = 300,
      loading = false,
      showLegend = true,
      showTooltip = true,
      showLabel = false,
      colors,
      innerRadius = 0,
      outerRadius = 80,
      className,
      formatTooltip,
    },
    ref
  ) => {
    const { t } = useTranslation()

    const defaultColors = [
      'var(--accent-color)',
      'var(--status-success)',
      'var(--status-warning)',
      'var(--status-error)',
      'var(--status-info)',
      '#8884d8',
      '#82ca9d',
      '#ffc658',
    ]

    const chartColors = colors || defaultColors

    if (loading) {
      return (
        <div
          ref={ref}
          className={cn('flex items-center justify-center', className)}
          style={{ height }}
        >
          <Loader size="lg" />
        </div>
      )
    }

    if (!data || data.length === 0) {
      return (
        <div
          ref={ref}
          className={cn(
            'flex items-center justify-center text-text-tertiary',
            className
          )}
          style={{ height }}
        >
          {t('common.noData')}
        </div>
      )
    }

    return (
      <div ref={ref} className={cn('w-full', className)}>
        <ResponsiveContainer width="100%" height={height}>
          <RechartsPieChart>
            <Pie
              data={data}
              dataKey={dataKey}
              nameKey={nameKey}
              cx="50%"
              cy="50%"
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              label={showLabel}
              labelLine={showLabel}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={chartColors[index % chartColors.length]}
                />
              ))}
            </Pie>
        {showTooltip && (
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-primary)',
              borderRadius: '0.5rem',
            }}
            itemStyle={{
              color: 'var(--text-primary)',
              fontSize: '0.875rem',
            }}
            labelStyle={{
              color: 'var(--text-secondary)',
              fontWeight: 500,
            }}
          />
        )}

            {showLegend && (
              <Legend wrapperStyle={{ color: 'var(--text-secondary)' }} />
            )}
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
    )
  }
)

PieChart.displayName = 'PieChart'