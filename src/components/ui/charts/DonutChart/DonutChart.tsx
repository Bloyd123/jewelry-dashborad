// ============================================================================
// FILE: src/components/ui/charts/DonutChart/DonutChart.tsx
// Donut Chart (Pie Chart with innerRadius)
// ============================================================================

import * as React from 'react'
import { PieChart, type PieChartProps } from '../PieChart'

export interface DonutChartProps extends Omit<PieChartProps, 'innerRadius'> {
  innerRadius?: number
}

export const DonutChart = React.forwardRef<HTMLDivElement, DonutChartProps>(
  ({ innerRadius = 60, ...props }, ref) => {
    return <PieChart ref={ref} innerRadius={innerRadius} {...props} />
  }
)

DonutChart.displayName = 'DonutChart'
