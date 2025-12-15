// ============================================================================
// FILE: src/components/ui/charts/LineChart/LineChart.tsx
// Flexible Line Chart Component with Theme Support
// ============================================================================

import * as React from 'react'
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'
import { Loader } from '@/components/ui/loader'

export interface LineChartProps {
  data: any[]
  lines: {
    dataKey: string
    name?: string
    color?: string
    strokeWidth?: number
  }[]
  xAxisKey: string
  height?: number
  loading?: boolean
  showGrid?: boolean
  showLegend?: boolean
  showTooltip?: boolean
  className?: string
  formatYAxis?: (value: any) => string
  formatXAxis?: (value: any) => string
  formatTooltip?: (value: any) => string
}

export const LineChart = React.forwardRef<HTMLDivElement, LineChartProps>(
  (
    {
      data,
      lines,
      xAxisKey,
      height = 300,
      loading = false,
      showGrid = true,
      showLegend = true,
      showTooltip = true,
      className,
      formatYAxis,
      formatXAxis,
      formatTooltip,
    },
    ref
  ) => {
    const { t } = useTranslation()

    // Default colors using CSS variables
    const defaultColors = [
      'var(--accent)',
      'var(--status-success)',
      'var(--status-warning)',
      'var(--status-error)',
      'var(--status-info)',
    ]

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
          <RechartsLineChart data={data}>
            {showGrid && (
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border-secondary))"
              />
            )}
            <XAxis
              dataKey={xAxisKey}
              tick={{ fill: 'var(--text-tertiary)' }}
              tickLine={{ stroke: 'var(--border-primary)' }}
              axisLine={{ stroke: 'var(--border-primary)' }}
              tickFormatter={formatXAxis}
            />
            <YAxis
              tick={{ fill: 'var(--text-tertiary)' }}
              tickLine={{ stroke: 'var(--border-primary)' }}
              axisLine={{ stroke: 'var(--border-primary)' }}
              tickFormatter={formatYAxis}
            />
            {showTooltip && (
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: '0.5rem',
                  color: 'var(--text-primary)',
                }}
                formatter={formatTooltip}
              />
            )}
            {showLegend && (
              <Legend
                wrapperStyle={{ color: 'var(--text-secondary)' }}
              />
            )}
            {lines.map((line, index) => (
              <Line
                key={line.dataKey}
                type="monotone"
                dataKey={line.dataKey}
                name={line.name || line.dataKey}
                stroke={line.color || defaultColors[index % defaultColors.length]}
                strokeWidth={line.strokeWidth || 2}
                dot={{ fill: line.color || defaultColors[index % defaultColors.length] }}
                activeDot={{ r: 6 }}
              />
            ))}
          </RechartsLineChart>
        </ResponsiveContainer>
      </div>
    )
  }
)

LineChart.displayName = 'LineChart'