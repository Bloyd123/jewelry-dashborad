// FILE: src/components/ui/data-display/DataTable/DataTablePagination.tsx
// DataTable Pagination Controls

import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { PaginationState } from './DataTable.types'

// PAGINATION PROPS

export interface DataTablePaginationProps {
  pageIndex: number
  pageSize: number
  totalItems: number
  totalPages: number
  pageSizeOptions?: number[]
  onPaginationChange: (pagination: PaginationState) => void
  showPageSizeSelector?: boolean
  showPageInfo?: boolean
  showFirstLastButtons?: boolean
  className?: string
  compact?: boolean
}

// PAGINATION COMPONENT

export const DataTablePagination: React.FC<DataTablePaginationProps> = ({
  pageIndex,
  pageSize,
  totalItems,
  totalPages,
  pageSizeOptions = [10, 20, 50, 100],
  onPaginationChange,
  showPageSizeSelector = true,
  showPageInfo = true,
  showFirstLastButtons = true,
  className,
  compact = false,
}) => {
  const { t } = useTranslation()

  // Calculate display values
  const startItem = totalItems === 0 ? 0 : pageIndex * pageSize + 1
  const endItem = Math.min((pageIndex + 1) * pageSize, totalItems)
  const hasPreviousPage = pageIndex > 0
  const hasNextPage = pageIndex < totalPages - 1

  // Handlers
  const handleFirstPage = () => {
    onPaginationChange({ pageIndex: 0, pageSize })
  }

  const handlePreviousPage = () => {
    if (hasPreviousPage) {
      onPaginationChange({ pageIndex: pageIndex - 1, pageSize })
    }
  }

  const handleNextPage = () => {
    if (hasNextPage) {
      onPaginationChange({ pageIndex: pageIndex + 1, pageSize })
    }
  }

  const handleLastPage = () => {
    onPaginationChange({ pageIndex: totalPages - 1, pageSize })
  }

  const handlePageSizeChange = (value: string) => {
    const newPageSize = parseInt(value, 10)
    onPaginationChange({ pageIndex: 0, pageSize: newPageSize })
  }

  const handlePageNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const page = parseInt(e.target.value, 10) - 1
    if (!isNaN(page) && page >= 0 && page < totalPages) {
      onPaginationChange({ pageIndex: page, pageSize })
    }
  }

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const delta = 2
    const range: number[] = []
    const rangeWithDots: (number | string)[] = []

    for (
      let i = Math.max(0, pageIndex - delta);
      i <= Math.min(totalPages - 1, pageIndex + delta);
      i++
    ) {
      range.push(i)
    }

    let prev = -1
    for (const i of range) {
      if (prev + 1 !== i) {
        rangeWithDots.push('...')
      }
      rangeWithDots.push(i)
      prev = i
    }

    return rangeWithDots
  }

  if (compact) {
    return (
      <div
        className={cn(
          'flex items-center justify-between gap-2 border-t border-border-primary bg-bg-secondary px-4 py-3',
          className
        )}
      >
        {/* Page Info */}
        {showPageInfo && (
          <div className="text-sm text-text-secondary">
            {t('ui.datatable.showingItems', {
              start: startItem,
              end: endItem,
              total: totalItems,
            })}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePreviousPage}
            disabled={!hasPreviousPage}
            aria-label={t('ui.datatable.previousPage')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-2 px-3">
            <span className="text-sm text-text-primary">
              {t('ui.datatable.pageOf', {
                current: pageIndex + 1,
                total: totalPages,
              })}
            </span>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={handleNextPage}
            disabled={!hasNextPage}
            aria-label={t('ui.datatable.nextPage')}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-between gap-4 border-t border-border-primary bg-bg-secondary px-4 py-3 sm:flex-row',
        className
      )}
    >
      {/* Left Section - Page Size Selector & Info */}
      <div className="flex items-center gap-4">
        {/* Page Size Selector */}
        {showPageSizeSelector && (
          <div className="flex items-center gap-2">
            <span className="whitespace-nowrap text-sm text-text-secondary">
              {t('ui.datatable.rowsPerPage')}
            </span>
            <Select
              value={String(pageSize)}
              onValueChange={handlePageSizeChange}
            >
              <SelectTrigger className="h-9 w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map(size => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Page Info */}
        {showPageInfo && (
          <div className="text-sm text-text-secondary">
            {t('ui.datatable.showingItems', {
              start: startItem,
              end: endItem,
              total: totalItems,
            })}
          </div>
        )}
      </div>

      {/* Right Section - Navigation */}
      <div className="flex items-center gap-2">
        {/* First Page Button */}
        {showFirstLastButtons && (
          <Button
            variant="outline"
            size="icon"
            onClick={handleFirstPage}
            disabled={!hasPreviousPage}
            aria-label={t('ui.datatable.firstPage')}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
        )}

        {/* Previous Page Button */}
        <Button
          variant="outline"
          size="icon"
          onClick={handlePreviousPage}
          disabled={!hasPreviousPage}
          aria-label={t('ui.datatable.previousPage')}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Page Numbers */}
        <div className="hidden items-center gap-1 md:flex">
          {getPageNumbers().map((page, index) => {
            if (page === '...') {
              return (
                <span key={`dots-${index}`} className="px-2 text-text-tertiary">
                  ...
                </span>
              )
            }

            const pageNumber = page as number
            return (
              <Button
                key={pageNumber}
                variant={pageIndex === pageNumber ? 'default' : 'outline'}
                size="icon"
                onClick={() =>
                  onPaginationChange({ pageIndex: pageNumber, pageSize })
                }
                className="h-9 w-9"
              >
                {pageNumber + 1}
              </Button>
            )
          })}
        </div>

        {/* Mobile Page Input */}
        <div className="flex items-center gap-2 md:hidden">
          <input
            type="number"
            min="1"
            max={totalPages}
            value={pageIndex + 1}
            onChange={handlePageNumberChange}
            className="h-9 w-16 rounded-md border border-border-primary bg-bg-secondary px-2 text-center text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
          />
          <span className="text-sm text-text-secondary">/ {totalPages}</span>
        </div>

        {/* Next Page Button */}
        <Button
          variant="outline"
          size="icon"
          onClick={handleNextPage}
          disabled={!hasNextPage}
          aria-label={t('ui.datatable.nextPage')}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        {/* Last Page Button */}
        {showFirstLastButtons && (
          <Button
            variant="outline"
            size="icon"
            onClick={handleLastPage}
            disabled={!hasNextPage}
            aria-label={t('ui.datatable.lastPage')}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}

DataTablePagination.displayName = 'DataTablePagination'
