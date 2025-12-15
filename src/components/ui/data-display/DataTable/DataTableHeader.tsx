// ============================================================================
// FILE: src/components/ui/data-display/DataTable/DataTableHeader.tsx
// DataTable Header with Sorting Support
// ============================================================================

import { useTranslation } from 'react-i18next'
import { ArrowUp, ArrowDown, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { DataTableColumn, SortingState, SortDirection } from './DataTable.types'

// ============================================================================
// HEADER CELL PROPS
// ============================================================================

interface DataTableHeaderCellProps<T = any> {
  column: DataTableColumn<T>
  sortingState?: SortingState
  onSort?: (columnId: string, direction: SortDirection) => void
  align?: 'left' | 'center' | 'right'
  width?: string | number
  className?: string
}

// ============================================================================
// HEADER CELL COMPONENT
// ============================================================================

export const DataTableHeaderCell = <T,>({
  column,
  sortingState,
  onSort,
  align = 'left',
  width,
  className,
}: DataTableHeaderCellProps<T>) => {
  const { t } = useTranslation()

  const isSorted = sortingState?.columnId === column.id
  const sortDirection = isSorted ? sortingState?.direction : null

  const handleSort = () => {
    if (!column.sortable || !onSort) return

    let newDirection: SortDirection = 'asc'

    if (sortDirection === 'asc') {
      newDirection = 'desc'
    } else if (sortDirection === 'desc') {
      newDirection = null
    }

    onSort(column.id, newDirection)
  }

  const getSortIcon = () => {
    if (!column.sortable) return null

    if (!isSorted) {
      return <ChevronsUpDown className="ml-2 h-4 w-4 text-text-tertiary" />
    }

    if (sortDirection === 'asc') {
      return <ArrowUp className="ml-2 h-4 w-4 text-accent" />
    }

    if (sortDirection === 'desc') {
      return <ArrowDown className="ml-2 h-4 w-4 text-accent" />
    }

    return <ChevronsUpDown className="ml-2 h-4 w-4 text-text-tertiary" />
  }

  const alignmentClass = {
    left: 'text-left justify-start',
    center: 'text-center justify-center',
    right: 'text-right justify-end',
  }[align]

  return (
    <th
      className={cn(
        'px-4 py-3 text-sm font-semibold text-text-primary bg-bg-secondary',
        'border-b border-border-primary',
        column.sortable && 'cursor-pointer select-none hover:bg-bg-tertiary transition-colors',
        alignmentClass,
        column.headerClassName,
        className
      )}
      style={{ width }}
      onClick={handleSort}
      role={column.sortable ? 'button' : undefined}
      aria-sort={
        isSorted
          ? sortDirection === 'asc'
            ? 'ascending'
            : 'descending'
          : undefined
      }
    >
      <div className={cn('flex items-center', alignmentClass)}>
        <span>{typeof column.header === 'string' ? t(column.header) : column.header}</span>
        {getSortIcon()}
      </div>
    </th>
  )
}

// ============================================================================
// HEADER ROW PROPS
// ============================================================================

interface DataTableHeaderProps<T = any> {
  columns: DataTableColumn<T>[]
  sortingState?: SortingState[]
  onSort?: (columnId: string, direction: SortDirection) => void
  selectionEnabled?: boolean
  actionsEnabled?: boolean
  actionsPosition?: 'start' | 'end'
  allRowsSelected?: boolean
  someRowsSelected?: boolean
  onSelectAll?: () => void
  className?: string
  stickyHeader?: boolean
}

// ============================================================================
// HEADER ROW COMPONENT
// ============================================================================

export const DataTableHeader = <T,>({
  columns,
  sortingState,
  onSort,
  selectionEnabled,
  actionsEnabled,
  actionsPosition = 'end',
  allRowsSelected,
  someRowsSelected,
  onSelectAll,
  className,
  stickyHeader,
}: DataTableHeaderProps<T>) => {
  const { t } = useTranslation()

  const getSortingStateForColumn = (columnId: string): SortingState | undefined => {
    return sortingState?.find((s) => s.columnId === columnId)
  }

  return (
    <thead
      className={cn(
        'bg-bg-secondary',
        stickyHeader && 'sticky top-0 z-10 shadow-sm',
        className
      )}
    >
      <tr className="border-b border-border-primary">
        {/* Selection Column */}
        {selectionEnabled && (
          <th className="w-12 px-4 py-3 text-center bg-bg-secondary border-b border-border-primary">
              <input
                type="checkbox"
                checked={!!allRowsSelected}
                ref={(input) => {
                  if (input) {
                    input.indeterminate = !!someRowsSelected && !allRowsSelected
                  }
                }}
                onChange={onSelectAll}
               className="h-4 w-4 rounded border-border-primary bg-bg-secondary text-accent  focus:ring-accent focus:ring-offset-0 accent-accent cursor-pointer"
              aria-label={t('ui.datatable.selectAll')}
            />
          </th>
        )}

        {/* Actions Column - Start */}
        {actionsEnabled && actionsPosition === 'start' && (
          <th className="w-20 px-4 py-3 text-center text-sm font-semibold text-text-primary bg-bg-secondary border-b border-border-primary">
            {t('ui.datatable.actions')}
          </th>
        )}

        {/* Data Columns */}
        {columns.map((column) => (
          <DataTableHeaderCell
            key={column.id}
            column={column}
            sortingState={getSortingStateForColumn(column.id)}
            onSort={onSort}
            align={column.align}
            width={column.width}
          />
        ))}

        {/* Actions Column - End */}
        {actionsEnabled && actionsPosition === 'end' && (
          <th className="w-20 px-4 py-3 text-center text-sm font-semibold text-text-primary bg-bg-secondary border-b border-border-primary">
            {t('ui.datatable.actions')}
          </th>
        )}
      </tr>
    </thead>
  )
}

DataTableHeaderCell.displayName = 'DataTableHeaderCell'
DataTableHeader.displayName = 'DataTableHeader'