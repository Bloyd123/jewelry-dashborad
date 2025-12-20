// ============================================================================
// FILE: src/components/ui/filters/FilterGroup/FilterGroup.tsx
// Filter Group Wrapper with Label
// ============================================================================

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'

export interface FilterGroupProps {
  label?: string
  children: React.ReactNode
  className?: string
  required?: boolean
}

export const FilterGroup = React.forwardRef<HTMLDivElement, FilterGroupProps>(
  ({ label, children, className, required = false }, ref) => {
    return (
      <div ref={ref} className={cn('space-y-2', className)}>
        {label && (
          <Label className="text-sm font-medium text-text-secondary">
            {label}
            {required && <span className="ml-1 text-status-error">*</span>}
          </Label>
        )}
        {children}
      </div>
    )
  }
)

FilterGroup.displayName = 'FilterGroup'
