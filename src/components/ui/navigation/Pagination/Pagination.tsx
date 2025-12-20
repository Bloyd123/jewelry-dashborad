// ============================================================================
// FILE: src/components/ui/navigation/Pagination/Pagination.tsx
// Theme-based Pagination Component - Flexible & Responsive
// ============================================================================

import * as React from 'react'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void

  // Optional features
  pageSize?: number
  totalItems?: number
  onPageSizeChange?: (size: number) => void
  pageSizeOptions?: number[]

  // Display options
  showFirstLast?: boolean
  showPageSize?: boolean
  showPageInfo?: boolean
  siblingCount?: number

  // Styling
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'outline'
  className?: string
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const range = (start: number, end: number): number[] => {
  const length = end - start + 1
  return Array.from({ length }, (_, i) => start + i)
}

const DOTS = '...'

const usePagination = (
  currentPage: number,
  totalPages: number,
  siblingCount: number = 1
): (number | string)[] => {
  return React.useMemo(() => {
    const totalPageNumbers = siblingCount + 5 // siblings + first + last + current + 2*DOTS

    // Case 1: Show all pages
    if (totalPageNumbers >= totalPages) {
      return range(1, totalPages)
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1)
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages)

    const shouldShowLeftDots = leftSiblingIndex > 2
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2

    const firstPageIndex = 1
    const lastPageIndex = totalPages

    // Case 2: No left dots
    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount
      const leftRange = range(1, leftItemCount)
      return [...leftRange, DOTS, totalPages]
    }

    // Case 3: No right dots
    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount
      const rightRange = range(totalPages - rightItemCount + 1, totalPages)
      return [firstPageIndex, DOTS, ...rightRange]
    }

    // Case 4: Both dots
    const middleRange = range(leftSiblingIndex, rightSiblingIndex)
    return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex]
  }, [currentPage, totalPages, siblingCount])
}

// ============================================================================
// STYLES
// ============================================================================

const sizeStyles = {
  sm: {
    button: 'h-8 w-8 text-xs',
    select: 'h-8 text-xs',
  },
  md: {
    button: 'h-9 w-9 text-sm',
    select: 'h-9 text-sm',
  },
  lg: {
    button: 'h-10 w-10 text-base',
    select: 'h-10 text-base',
  },
}

const variantStyles = {
  default: {
    button:
      'bg-bg-secondary hover:bg-bg-tertiary text-text-primary border-border-primary',
    active: 'bg-accent text-white hover:bg-accent/90 border-accent',
  },
  outline: {
    button:
      'border border-border-primary hover:bg-bg-tertiary text-text-primary',
    active: 'border-accent bg-accent/10 text-accent hover:bg-accent/20',
  },
}

// ============================================================================
// PAGINATION COMPONENT
// ============================================================================

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  pageSize = 10,
  totalItems,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  showFirstLast = true,
  showPageSize = true,
  showPageInfo = true,
  siblingCount = 1,
  size = 'md',
  variant = 'default',
  className,
}) => {
  const { t } = useTranslation()
  const paginationRange = usePagination(currentPage, totalPages, siblingCount)

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page)
    }
  }

  const isFirstPage = currentPage === 1
  const isLastPage = currentPage === totalPages

  const startItem = (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalItems || 0)

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {/* Page Info */}
      {showPageInfo && totalItems && (
        <div className="flex items-center justify-between px-1 text-sm text-text-secondary">
          <span>
            {t('pagination.showing')} {startItem}-{endItem} {t('pagination.of')}{' '}
            {totalItems}
          </span>

          {/* Page Size Selector */}
          {showPageSize && onPageSizeChange && (
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline">
                {t('pagination.itemsPerPage')}:
              </span>
              <Select
                value={pageSize.toString()}
                onValueChange={value => onPageSizeChange(Number(value))}
              >
                <SelectTrigger
                  className={cn('w-[70px]', sizeStyles[size].select)}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {pageSizeOptions.map(option => (
                    <SelectItem key={option} value={option.toString()}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      )}

      {/* Pagination Controls */}
      <nav
        className="flex items-center justify-center gap-1"
        aria-label="Pagination"
      >
        {/* First Page Button */}
        {showFirstLast && (
          <PaginationButton
            onClick={() => handlePageChange(1)}
            disabled={isFirstPage}
            size={size}
            variant={variant}
            aria-label={t('pagination.firstPage')}
          >
            <ChevronsLeft className="h-4 w-4" />
          </PaginationButton>
        )}

        {/* Previous Page Button */}
        <PaginationButton
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={isFirstPage}
          size={size}
          variant={variant}
          aria-label={t('pagination.previousPage')}
        >
          <ChevronLeft className="h-4 w-4" />
        </PaginationButton>

        {/* Page Numbers */}
        <div className="hidden items-center gap-1 sm:flex">
          {paginationRange.map((pageNumber, index) => {
            if (pageNumber === DOTS) {
              return (
                <span
                  key={`dots-${index}`}
                  className={cn(
                    'flex items-center justify-center',
                    sizeStyles[size].button,
                    'text-text-tertiary'
                  )}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </span>
              )
            }

            return (
              <PaginationButton
                key={pageNumber}
                onClick={() => handlePageChange(Number(pageNumber))}
                isActive={pageNumber === currentPage}
                size={size}
                variant={variant}
                aria-label={`${t('pagination.page')} ${pageNumber}`}
                aria-current={pageNumber === currentPage ? 'page' : undefined}
              >
                {pageNumber}
              </PaginationButton>
            )
          })}
        </div>

        {/* Mobile: Current Page Indicator */}
        <div className="flex items-center px-3 sm:hidden">
          <span className="text-sm font-medium text-text-primary">
            {currentPage} / {totalPages}
          </span>
        </div>

        {/* Next Page Button */}
        <PaginationButton
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={isLastPage}
          size={size}
          variant={variant}
          aria-label={t('pagination.nextPage')}
        >
          <ChevronRight className="h-4 w-4" />
        </PaginationButton>

        {/* Last Page Button */}
        {showFirstLast && (
          <PaginationButton
            onClick={() => handlePageChange(totalPages)}
            disabled={isLastPage}
            size={size}
            variant={variant}
            aria-label={t('pagination.lastPage')}
          >
            <ChevronsRight className="h-4 w-4" />
          </PaginationButton>
        )}
      </nav>
    </div>
  )
}

// ============================================================================
// PAGINATION BUTTON COMPONENT
// ============================================================================

interface PaginationButtonProps {
  onClick: () => void
  disabled?: boolean
  isActive?: boolean
  size: 'sm' | 'md' | 'lg'
  variant: 'default' | 'outline'
  children: React.ReactNode
  'aria-label'?: string
  'aria-current'?: 'page'
}

const PaginationButton: React.FC<PaginationButtonProps> = ({
  onClick,
  disabled,
  isActive,
  size,
  variant,
  children,
  ...props
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        sizeStyles[size].button,
        isActive ? variantStyles[variant].active : variantStyles[variant].button
      )}
      {...props}
    >
      {children}
    </button>
  )
}

Pagination.displayName = 'Pagination'
