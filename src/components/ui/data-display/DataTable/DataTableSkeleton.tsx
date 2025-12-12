// ============================================================================
// FILE: src/components/ui/data-display/DataTable/DataTableSkeleton.tsx
// DataTable Loading Skeleton
// ============================================================================

import React from 'react'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/loader'

// ============================================================================
// SKELETON PROPS
// ============================================================================

export interface DataTableSkeletonProps {
  rows?: number
  columns?: number
  showSelection?: boolean
  showActions?: boolean
  className?: string
}

// ============================================================================
// SKELETON COMPONENT
// ============================================================================

export const DataTableSkeleton: React.FC<DataTableSkeletonProps> = ({
  rows = 5,
  columns = 4,
  showSelection = false,
  showActions = false,
  className,
}) => {
  return (
    <div className={cn('w-full', className)}>
      {/* Table Container */}
      <div className="rounded-lg border border-border-primary bg-bg-secondary overflow-hidden">
        {/* Header Skeleton */}
        <div className="border-b border-border-primary bg-bg-secondary">
          <div className="flex items-center">
            {/* Selection Header */}
            {showSelection && (
              <div className="w-12 px-4 py-3 flex items-center justify-center">
                <Skeleton className="h-4 w-4 rounded" />
              </div>
            )}

            {/* Column Headers */}
            {Array.from({ length: columns }).map((_, index) => (
              <div
                key={index}
                className="flex-1 px-4 py-3 flex items-center gap-2"
              >
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </div>
            ))}

            {/* Actions Header */}
            {showActions && (
              <div className="w-20 px-4 py-3 flex items-center justify-center">
                <Skeleton className="h-4 w-16" />
              </div>
            )}
          </div>
        </div>

        {/* Body Skeleton */}
        <div>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div
              key={rowIndex}
              className="border-b border-border-primary last:border-0"
            >
              <div className="flex items-center">
                {/* Selection Cell */}
                {showSelection && (
                  <div className="w-12 px-4 py-3 flex items-center justify-center">
                    <Skeleton className="h-4 w-4 rounded" />
                  </div>
                )}

                {/* Data Cells */}
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <div key={colIndex} className="flex-1 px-4 py-3">
                    <Skeleton
                      className={cn(
                        'h-4',
                        // Vary widths for more realistic look
                        colIndex % 3 === 0 ? 'w-32' : colIndex % 3 === 1 ? 'w-24' : 'w-20'
                      )}
                    />
                  </div>
                ))}

                {/* Actions Cell */}
                {showActions && (
                  <div className="w-20 px-4 py-3 flex items-center justify-center">
                    <Skeleton className="h-8 w-8 rounded" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Skeleton */}
        <div className="border-t border-border-primary px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-9 w-16" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-9 rounded" />
              <Skeleton className="h-9 w-9 rounded" />
              <Skeleton className="h-9 w-9 rounded" />
              <Skeleton className="h-9 w-9 rounded" />
              <Skeleton className="h-9 w-9 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// COMPACT SKELETON VARIANT
// ============================================================================

export const DataTableCompactSkeleton: React.FC<{
  rows?: number
  className?: string
}> = ({ rows = 3, className }) => {
  return (
    <div className={cn('w-full space-y-2', className)}>
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="rounded-lg border border-border-primary bg-bg-secondary p-4"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="flex items-center justify-between pt-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-20 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ============================================================================
// TABLE ROW SKELETON
// ============================================================================

export const DataTableRowSkeleton: React.FC<{
  columns?: number
  showSelection?: boolean
  showActions?: boolean
  className?: string
}> = ({ columns = 4, showSelection = false, showActions = false, className }) => {
  return (
    <tr className={cn('border-b border-border-primary', className)}>
      {/* Selection Cell */}
      {showSelection && (
        <td className="w-12 px-4 py-3 text-center">
          <Skeleton className="h-4 w-4 rounded mx-auto" />
        </td>
      )}

      {/* Data Cells */}
      {Array.from({ length: columns }).map((_, index) => (
        <td key={index} className="px-4 py-3">
          <Skeleton
            className={cn(
              'h-4',
              index % 3 === 0 ? 'w-32' : index % 3 === 1 ? 'w-24' : 'w-20'
            )}
          />
        </td>
      ))}

      {/* Actions Cell */}
      {showActions && (
        <td className="w-20 px-4 py-3 text-center">
          <Skeleton className="h-8 w-8 rounded mx-auto" />
        </td>
      )}
    </tr>
  )
}

DataTableSkeleton.displayName = 'DataTableSkeleton'
DataTableCompactSkeleton.displayName = 'DataTableCompactSkeleton'
DataTableRowSkeleton.displayName = 'DataTableRowSkeleton'