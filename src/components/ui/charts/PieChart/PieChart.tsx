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
      'hsl(var(--accent))',
      'hsl(var(--status-success))',
      'hsl(var(--status-warning))',
      'hsl(var(--status-error))',
      'hsl(var(--status-info))',
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
          </RechartsPieChart>
        </ResponsiveContainer>
      </div>
    )
  }
)

PieChart.displayName = 'PieChart'