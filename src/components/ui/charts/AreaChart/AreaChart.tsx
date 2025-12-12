// ============================================================================
// FILE: src/components/ui/charts/AreaChart/AreaChart.tsx
// Flexible Area Chart Component
// ============================================================================

import * as React from 'react'
import {
  AreaChart as RechartsAreaChart,
  Area,
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

export interface AreaChartProps {
  data: any[]
  areas: {
    dataKey: string
    name?: string
    color?: string
    fillOpacity?: number
  }[]
  xAxisKey: string
  height?: number
  loading?: boolean
  showGrid?: boolean
  showLegend?: boolean
  showTooltip?: boolean
  stacked?: boolean
  className?: string
  formatYAxis?: (value: any) => string
  formatXAxis?: (value: any) => string
  formatTooltip?: (value: any) => string
}

export const AreaChart = React.forwardRef<HTMLDivElement, AreaChartProps>(
  (
    {
      data,
      areas,
      xAxisKey,
      height = 300,
      loading = false,
      showGrid = true,
      showLegend = true,
      showTooltip = true,
      stacked = false,
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
          <RechartsAreaChart data={data}>
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
            {areas.map((area, index) => (
              <Area
                key={area.dataKey}
                type="monotone"
                dataKey={area.dataKey}
                name={area.name || area.dataKey}
                stroke={area.color || defaultColors[index % defaultColors.length]}
                fill={area.color || defaultColors[index % defaultColors.length]}
                fillOpacity={area.fillOpacity || 0.6}
                stackId={stacked ? '1' : undefined}
              />
            ))}
          </RechartsAreaChart>
        </ResponsiveContainer>
      </div>
    )
  }
)

AreaChart.displayName = 'AreaChart'