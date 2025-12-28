// ============================================================================
// FILE: src/components/ui/data-display/DataTable/DataTable.tsx
// Main DataTable Component - Flexible, Reusable Table
// ============================================================================

import React, { useMemo, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { FileX } from 'lucide-react'
import { cn } from '@/lib/utils'
import { DataTableHeader } from './DataTableHeader'
import { DataTableRow } from './DataTableRow'
import { DataTablePagination } from './DataTablePagination'
import { DataTableSkeleton } from './DataTableSkeleton'
import type {
  DataTableProps,
  DataTableInternalState,
  SortDirection,
  PaginationState,
} from './DataTable.types'
import NotFoundPage from '@/pages/NotFound/index'

// ============================================================================
// EMPTY STATE COMPONENT
// ============================================================================

const EmptyState: React.FC<{
  message?: React.ReactNode
  icon?: React.ReactNode
  action?: { label: string; onClick: () => void }
}> = ({ message, icon, action }) => {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
      <div className="mb-4 text-text-tertiary">
        {/* {icon || <FileX className="h-12 w-12" />} */}
        <NotFoundPage />
      </div>
      <p className="mb-4 text-sm text-text-secondary">
        {message || t('ui.datatable.noData')}
      </p>
      {action && (
        <button
          onClick={action.onClick}
          className="text-sm text-accent hover:underline"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}

// ============================================================================
// MAIN DATATABLE COMPONENT
// ============================================================================

export const DataTable = <T extends Record<string, any>>({
  // Required props
  data,
  columns,

  // Optional configurations
  sorting,
  pagination,
  filtering,
  selection,
  rowActions,
  loading,
  emptyState,
  style,

  // Row events
  onRowClick,
  onRowDoubleClick,
  onRowContextMenu,

  // Custom components
  customHeader,
  customFooter,
  rowExpansion,

  // Misc
  getRowId,
  testId,
  ariaLabel,
}: DataTableProps<T>) => {
  const { t } = useTranslation()

  // ========================================================================
  // STATE MANAGEMENT
  // ========================================================================

  const [internalState, setInternalState] = useState<DataTableInternalState>({
    sorting: sorting?.sortingState || [],
    pagination: {
      pageIndex: pagination?.pageIndex || 0,
      pageSize: pagination?.pageSize || 20,
    },
    filters: filtering?.filters || [],
    globalFilter: filtering?.globalFilter || '',
    selectedRows: selection?.selectedRows || new Set(),
    expandedRows: rowExpansion?.expandedRows || new Set(),
    columnVisibility: {},
  })

  // ========================================================================
  // HELPER FUNCTIONS
  // ========================================================================

  const getRowIdFn = useCallback(
    (row: T, index: number): string | number => {
      if (getRowId) return getRowId(row, index)
      if (selection?.getRowId) return selection.getRowId(row, index)
      return index
    },
    [getRowId, selection]
  )

  // ========================================================================
  // SORTING
  // ========================================================================

  const handleSort = useCallback(
    (columnId: string, direction: SortDirection) => {
      const newSorting = [{ columnId, direction }]

      if (sorting?.onSortingChange) {
        sorting.onSortingChange(newSorting)
      } else {
        setInternalState(prev => ({ ...prev, sorting: newSorting }))
      }
    },
    [sorting]
  )

  const sortedData = useMemo(() => {
    if (!sorting?.enabled) return data

    const currentSorting = sorting.sortingState || internalState.sorting
    if (currentSorting.length === 0 || !currentSorting[0].direction) return data

    const { columnId, direction } = currentSorting[0]
    const column = columns.find(col => col.id === columnId)

    if (!column) return data

    return [...data].sort((a, b) => {
      // Use custom sorting function if provided
      if (column.sortingFn) {
        const result = column.sortingFn(a, b)
        return direction === 'desc' ? -result : result
      }

      // Default sorting
      let aValue: any
      let bValue: any

      if (column.accessorFn) {
        aValue = column.accessorFn(a)
        bValue = column.accessorFn(b)
      } else if (column.accessorKey) {
        aValue = a[column.accessorKey]
        bValue = b[column.accessorKey]
      }

      // Handle null/undefined
      if (aValue == null) return direction === 'desc' ? 1 : -1
      if (bValue == null) return direction === 'desc' ? -1 : 1

      // String comparison
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const result = aValue.localeCompare(bValue)
        return direction === 'desc' ? -result : result
      }

      // Number comparison
      if (aValue < bValue) return direction === 'desc' ? 1 : -1
      if (aValue > bValue) return direction === 'desc' ? -1 : 1
      return 0
    })
  }, [data, columns, sorting, internalState.sorting])

  // ========================================================================
  // FILTERING
  // ========================================================================

  const filteredData = useMemo(() => {
    if (!filtering?.enabled) return sortedData

    let result = sortedData

    // Global filter
    const globalFilter = filtering.globalFilter || internalState.globalFilter
    if (globalFilter) {
      result = result.filter(row => {
        return columns.some(column => {
          let value: any

          if (column.accessorFn) {
            value = column.accessorFn(row)
          } else if (column.accessorKey) {
            value = row[column.accessorKey]
          }

          if (value == null) return false

          return String(value)
            .toLowerCase()
            .includes(globalFilter.toLowerCase())
        })
      })
    }

    return result
  }, [sortedData, columns, filtering, internalState.globalFilter])

  // ========================================================================
  // PAGINATION
  // ========================================================================

  const handlePaginationChange = useCallback(
    (newPagination: PaginationState) => {
      if (pagination?.onPaginationChange) {
        pagination.onPaginationChange(newPagination)
      } else {
        setInternalState(prev => ({ ...prev, pagination: newPagination }))
      }
    },
    [pagination]
  )

  const paginatedData = useMemo(() => {
    if (!pagination?.enabled) return filteredData

    const currentPagination = {
      pageIndex: pagination.pageIndex ?? internalState.pagination.pageIndex,
      pageSize: pagination.pageSize ?? internalState.pagination.pageSize,
    }

    const start = currentPagination.pageIndex * currentPagination.pageSize
    const end = start + currentPagination.pageSize

    return filteredData.slice(start, end)
  }, [filteredData, pagination, internalState.pagination])

  const totalPages = useMemo(() => {
    if (!pagination?.enabled) return 1
    const pageSize = pagination.pageSize ?? internalState.pagination.pageSize
    return Math.ceil(filteredData.length / pageSize)
  }, [filteredData.length, pagination, internalState.pagination.pageSize])

  // ========================================================================
  // SELECTION
  // ========================================================================

  const handleSelectionChange = useCallback(
    (rowId: string | number, selected: boolean) => {
      const newSelection = new Set(
        selection?.selectedRows || internalState.selectedRows
      )

      if (selected) {
        newSelection.add(rowId)
      } else {
        newSelection.delete(rowId)
      }

      if (selection?.onSelectionChange) {
        selection.onSelectionChange(newSelection)
      } else {
        setInternalState(prev => ({ ...prev, selectedRows: newSelection }))
      }
    },
    [selection, internalState.selectedRows]
  )

  const handleSelectAll = useCallback(() => {
    const currentSelection =
      selection?.selectedRows || internalState.selectedRows
    const allRowIds = paginatedData.map((row, index) => getRowIdFn(row, index))

    let newSelection: Set<string | number>

    if (currentSelection.size === allRowIds.length) {
      // Deselect all
      newSelection = new Set()
    } else {
      // Select all
      newSelection = new Set(allRowIds)
    }

    if (selection?.onSelectionChange) {
      selection.onSelectionChange(newSelection)
    } else {
      setInternalState(prev => ({ ...prev, selectedRows: newSelection }))
    }
  }, [selection, internalState.selectedRows, paginatedData, getRowIdFn])

  const allRowsSelected = useMemo(() => {
    const currentSelection =
      selection?.selectedRows || internalState.selectedRows
    if (paginatedData.length === 0) return false
    return paginatedData.every((row, index) =>
      currentSelection.has(getRowIdFn(row, index))
    )
  }, [selection, internalState.selectedRows, paginatedData, getRowIdFn])

  const someRowsSelected = useMemo(() => {
    const currentSelection =
      selection?.selectedRows || internalState.selectedRows
    return (
      currentSelection.size > 0 &&
      paginatedData.some((row, index) =>
        currentSelection.has(getRowIdFn(row, index))
      )
    )
  }, [selection, internalState.selectedRows, paginatedData, getRowIdFn])

  // ========================================================================
  // ROW EXPANSION
  // ========================================================================

  const handleExpansionToggle = useCallback(
    (rowId: string | number) => {
      const currentExpanded =
        rowExpansion?.expandedRows || internalState.expandedRows
      const newExpanded = new Set(currentExpanded)

      if (newExpanded.has(rowId)) {
        newExpanded.delete(rowId)
      } else {
        newExpanded.add(rowId)
      }

      if (rowExpansion?.onExpandedChange) {
        rowExpansion.onExpandedChange(newExpanded)
      } else {
        setInternalState(prev => ({ ...prev, expandedRows: newExpanded }))
      }
    },
    [rowExpansion, internalState.expandedRows]
  )

  // ========================================================================
  // RENDER
  // ========================================================================

  // Loading state
  if (loading?.isLoading) {
    return (
      loading.loadingComponent || (
        <DataTableSkeleton
          rows={loading.loadingRows || 5}
          columns={columns.length}
          showSelection={selection?.enabled}
          showActions={rowActions?.enabled}
        />
      )
    )
  }

  // Empty state
  if (paginatedData.length === 0) {
    return (
      <div
        className={cn(
          'rounded-lg border border-border-primary bg-bg-secondary',
          style?.className
        )}
      >
        <EmptyState
          message={emptyState?.message}
          icon={emptyState?.icon}
          action={emptyState?.action}
        />
      </div>
    )
  }

  const currentPagination = {
    pageIndex: pagination?.pageIndex ?? internalState.pagination.pageIndex,
    pageSize: pagination?.pageSize ?? internalState.pagination.pageSize,
  }

  return (
    <div
      className={cn('w-full', style?.containerClassName)}
      data-testid={testId}
      aria-label={ariaLabel || t('ui.datatable.table')}
    >
      {customHeader}

      <div
        className={cn(
          'overflow-hidden rounded-lg border',
          'border-border-primary bg-bg-secondary',
          style?.shadow && 'shadow-lg',
          style?.className
        )}
      >
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <DataTableHeader
              columns={columns}
              sortingState={sorting?.sortingState || internalState.sorting}
              onSort={handleSort}
              selectionEnabled={selection?.enabled}
              actionsEnabled={rowActions?.enabled}
              actionsPosition={rowActions?.position}
              allRowsSelected={allRowsSelected}
              someRowsSelected={someRowsSelected}
              onSelectAll={handleSelectAll}
              stickyHeader={style?.stickyHeader}
              className={style?.headerClassName}
            />

            <tbody className={style?.bodyClassName}>
              {paginatedData.map((row, index) => {
                const rowId = getRowIdFn(row, index)
                const currentSelection =
                  selection?.selectedRows || internalState.selectedRows
                const currentExpanded =
                  rowExpansion?.expandedRows || internalState.expandedRows

                return (
                  <DataTableRow
                    key={rowId}
                    row={row}
                    columns={columns}
                    index={index}
                    rowId={rowId}
                    selected={currentSelection.has(rowId)}
                    expanded={currentExpanded.has(rowId)}
                    selectionEnabled={selection?.enabled}
                    actionsEnabled={rowActions?.enabled}
                    actionsPosition={rowActions?.position}
                    actions={rowActions?.actions}
                    expansionEnabled={rowExpansion?.enabled}
                    onSelectionChange={handleSelectionChange}
                    onExpansionToggle={handleExpansionToggle}
                    onRowClick={onRowClick}
                    onRowDoubleClick={onRowDoubleClick}
                    onRowContextMenu={onRowContextMenu}
                    className={style?.rowClassName}
                    hoverEffect={style?.hoverEffect}
                    zebraStripes={style?.zebraStripes}
                    renderExpanded={rowExpansion?.renderExpanded}
                  />
                )
              })}
            </tbody>
          </table>
        </div>

        {pagination?.enabled && (
          <DataTablePagination
            pageIndex={currentPagination.pageIndex}
            pageSize={currentPagination.pageSize}
            totalItems={pagination.totalItems || filteredData.length}
            totalPages={pagination.totalPages || totalPages}
            pageSizeOptions={pagination.pageSizeOptions}
            onPaginationChange={handlePaginationChange}
            showPageSizeSelector={pagination.showPageSizeSelector}
            showPageInfo={pagination.showPageInfo}
            showFirstLastButtons={pagination.showFirstLastButtons}
          />
        )}
      </div>

      {customFooter}
    </div>
  )
}

DataTable.displayName = 'DataTable'
