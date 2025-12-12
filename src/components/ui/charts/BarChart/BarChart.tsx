// ============================================================================
// FILE: src/components/ui/charts/BarChart/BarChart.tsx
// Flexible Bar Chart Component
// ============================================================================

import * as React from 'react'
import {
  BarChart as RechartsBarChart,
  Bar,
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

export interface BarChartProps {
  data: any[]
  bars: {
    dataKey: string
    name?: string
    color?: string
  }[]
  xAxisKey: string
  height?: number
  loading?: boolean
  showGrid?: boolean
  showLegend?: boolean
  showTooltip?: boolean
  layout?: 'horizontal' | 'vertical'
  className?: string
  formatYAxis?: (value: any) => string
  formatXAxis?: (value: any) => string
  formatTooltip?: (value: any) => string
}

export const BarChart = React.forwardRef<HTMLDivElement, BarChartProps>(
  (
    {
      data,
      bars,
      xAxisKey,
      height = 300,
      loading = false,
      showGrid = true,
      showLegend = true,
      showTooltip = true,
      layout = 'horizontal',
      className,
      formatYAxis,
      formatXAxis,
      formatTooltip,
    },
    ref
  ) => {
    const { t } = useTranslation()

    const defaultColors = [
      'hsl(var(--accent))',
      'hsl(var(--status-success))',
      'hsl(var(--status-warning))',
      'hsl(var(--status-error))',
      'hsl(var(--status-info))',
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
          <RechartsBarChart data={data} layout={layout}>
            {showGrid && (
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border-secondary))"
              />
            )}
            <XAxis
              dataKey={xAxisKey}
              tick={{ fill: 'hsl(var(--text-tertiary))' }}
              tickLine={{ stroke: 'hsl(var(--border-primary))' }}
              axisLine={{ stroke: 'hsl(var(--border-primary))' }}
              tickFormatter={formatXAxis}
            />
            <YAxis
              tick={{ fill: 'hsl(var(--text-tertiary))' }}
              tickLine={{ stroke: 'hsl(var(--border-primary))' }}
              axisLine={{ stroke: 'hsl(var(--border-primary))' }}
              tickFormatter={formatYAxis}
            />
            {showTooltip && (
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--bg-secondary))',
                  border: '1px solid hsl(var(--border-primary))',
                  borderRadius: '0.5rem',
                  color: 'hsl(var(--text-primary))',
                }}
                formatter={formatTooltip}
              />
            )}
            {showLegend && (
              <Legend wrapperStyle={{ color: 'hsl(var(--text-secondary))' }} />
            )}
            {bars.map((bar, index) => (
              <Bar
                key={bar.dataKey}
                dataKey={bar.dataKey}
                name={bar.name || bar.dataKey}
                fill={bar.color || defaultColors[index % defaultColors.length]}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    )
  }
)

BarChart.displayName = 'BarChart'