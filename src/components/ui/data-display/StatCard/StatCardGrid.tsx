// ============================================================================
// FILE: src/components/ui/data-display/StatCard/StatCardGrid.tsx
// Responsive Grid Wrapper for StatCards
// ============================================================================

import * as React from 'react'
import { cn } from '@/lib/utils'

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface StatCardGridProps {
  children: React.ReactNode
  columns?: 1 | 2 | 3 | 4
  gap?: 'sm' | 'md' | 'lg'
  className?: string
}

// ============================================================================
// GRID STYLES
// ============================================================================

const columnStyles: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
}

const gapStyles: Record<string, string> = {
  sm: 'gap-3',
  md: 'gap-4',
  lg: 'gap-6',
}

// ============================================================================
// STATCARDGRID COMPONENT
// ============================================================================

export const StatCardGrid: React.FC<StatCardGridProps> = ({
  children,
  columns = 4,
  gap = 'md',
  className,
}) => {
  return (
    <div
      className={cn(
        'grid w-full',
        columnStyles[columns],
        gapStyles[gap],
        className
      )}
    >
      {children}
    </div>
  )
}

StatCardGrid.displayName = 'StatCardGrid'
