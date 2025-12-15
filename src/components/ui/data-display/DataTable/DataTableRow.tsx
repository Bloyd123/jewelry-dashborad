// ============================================================================
// FILE: src/components/ui/data-display/DataTable/DataTableRow.tsx
// DataTable Row Component
// ============================================================================

import React from 'react'
import { useTranslation } from 'react-i18next'
import { MoreVertical, ChevronDown, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import type { DataTableColumn, RowAction } from './DataTable.types'

// ============================================================================
// ROW CELL PROPS
// ============================================================================

interface DataTableCellProps<T = any> {
  row: T
  column: DataTableColumn<T>
  index: number
  align?: 'left' | 'center' | 'right'
  className?: string
}

// ============================================================================
// ROW CELL COMPONENT
// ============================================================================

export const DataTableCell = <T,>({
  row,
  column,
  index,
  align = 'left',
  className,
}: DataTableCellProps<T>) => {
  // Get cell value
  const getValue = () => {
    if (column.accessorFn) {
      return column.accessorFn(row)
    }
    if (column.accessorKey) {
      return (row as any)[column.accessorKey]
    }
    return null
  }

  const value = getValue()

  // Render cell content
  const renderContent = () => {
    if (column.cell) {
      return column.cell({ row, value })
    }
    return value != null ? String(value) : '-'
  }

  const alignmentClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }[align]

  return (
    <td
      className={cn(
        'px-4 py-3 text-sm text-text-primary border-b border-border-primary',
        alignmentClass,
        column.cellClassName,
        className
      )}
    >
      {renderContent()}
    </td>
  )
}

// ============================================================================
// ROW ACTIONS PROPS
// ============================================================================

interface DataTableActionsProps<T = any> {
  row: T
  actions: RowAction<T>[]
  dropdownLabel?: string
}

// ============================================================================
// ROW ACTIONS COMPONENT
// ============================================================================

export const DataTableActions = <T,>({
  row,
  actions,
  dropdownLabel,
}: DataTableActionsProps<T>) => {
  const { t } = useTranslation()

  const visibleActions = actions.filter((action) => {
    if (typeof action.hidden === 'function') {
      return !action.hidden(row)
    }
    return !action.hidden
  })

  if (visibleActions.length === 0) {
    return <td className="px-4 py-3 text-center border-b border-border-primary">-</td>
  }

  return (
    <td className="px-4 py-3 text-center border-b border-border-primary">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            aria-label={dropdownLabel || t('ui.datatable.rowActions')}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {visibleActions.map((action, index) => {
            const isDisabled =
              typeof action.disabled === 'function'
                ? action.disabled(row)
                : action.disabled

            return (
              <DropdownMenuItem
                key={index}
                onClick={() => !isDisabled && action.onClick(row)}
                disabled={isDisabled}
                className={cn(
                  'cursor-pointer',
                  action.variant === 'destructive' &&
                    'text-status-error focus:text-status-error',
                  action.className
                )}
              >
                {action.icon && <span className="mr-2">{action.icon}</span>}
                {typeof action.label === 'string' ? t(action.label) : action.label}
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </td>
  )
}

// ============================================================================
// ROW PROPS
// ============================================================================

interface DataTableRowProps<T = any> {
  row: T
  columns: DataTableColumn<T>[]
  index: number
  rowId: string | number
  selected?: boolean
  expanded?: boolean
  selectionEnabled?: boolean
  actionsEnabled?: boolean
  actionsPosition?: 'start' | 'end'
  actions?: RowAction<T>[]
  expansionEnabled?: boolean
  onSelectionChange?: (rowId: string | number, selected: boolean) => void
  onExpansionToggle?: (rowId: string | number) => void
  onRowClick?: (row: T, index: number) => void
  onRowDoubleClick?: (row: T, index: number) => void
  onRowContextMenu?: (row: T, index: number, event: React.MouseEvent) => void
  className?: string | ((row: T, index: number) => string)
  hoverEffect?: boolean
  zebraStripes?: boolean
  renderExpanded?: (row: T) => React.ReactNode
}

// ============================================================================
// ROW COMPONENT
// ============================================================================

export const DataTableRow = <T,>({
  row,
  columns,
  index,
  rowId,
  selected,
  expanded,
  selectionEnabled,
  actionsEnabled,
  actionsPosition = 'end',
  actions = [],
  expansionEnabled,
  onSelectionChange,
  onExpansionToggle,
  onRowClick,
  onRowDoubleClick,
  onRowContextMenu,
  className,
  hoverEffect = true,
  zebraStripes,
  renderExpanded,
}: DataTableRowProps<T>) => {
  const { t } = useTranslation()

  const handleSelectionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation()
    onSelectionChange?.(rowId, e.target.checked)
  }

  const handleExpansionToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    onExpansionToggle?.(rowId)
  }

  const handleRowClick = () => {
    onRowClick?.(row, index)
  }

  const handleRowDoubleClick = () => {
    onRowDoubleClick?.(row, index)
  }

  const handleRowContextMenu = (e: React.MouseEvent) => {
    onRowContextMenu?.(row, index, e)
  }

  const rowClassName =
    typeof className === 'function' ? className(row, index) : className

  return (
    <>
      <tr
        className={cn(
          'border-b border-border-primary transition-colors',
          hoverEffect && 'hover:bg-bg-tertiary',
          zebraStripes && index % 2 === 1 && 'bg-bg-tertiary/30',
          selected && 'bg-accent/10',
          onRowClick && 'cursor-pointer',
          rowClassName
        )}
        onClick={handleRowClick}
        onDoubleClick={handleRowDoubleClick}
        onContextMenu={handleRowContextMenu}
        role={onRowClick ? 'button' : undefined}
        tabIndex={onRowClick ? 0 : undefined}
      >
        {/* Selection Column */}
        {selectionEnabled && (
          <td className="w-12 px-4 py-3 text-center border-b border-border-primary">
            <input
              type="checkbox"
              checked={selected}
              onChange={handleSelectionChange}
              onClick={(e) => e.stopPropagation()}
            className="h-4 w-4 rounded border-border-primary bg-bg-secondary text-accent  focus:ring-accent focus:ring-offset-0 accent-accent cursor-pointer"
              aria-label={t('ui.datatable.selectRow')}
            />
          </td>
        )}

        {/* Expansion Toggle Column */}
        {expansionEnabled && (
          <td className="w-12 px-4 py-3 text-center border-b border-border-primary">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={handleExpansionToggle}
              aria-label={
                expanded
                  ? t('ui.datatable.collapseRow')
                  : t('ui.datatable.expandRow')
              }
            >
              {expanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </td>
        )}

        {/* Actions Column - Start */}
        {actionsEnabled && actionsPosition === 'start' && (
          <DataTableActions row={row} actions={actions} />
        )}

        {/* Data Columns */}
        {columns.map((column) => (
          <DataTableCell
            key={column.id}
            row={row}
            column={column}
            index={index}
            align={column.align}
          />
        ))}

        {/* Actions Column - End */}
        {actionsEnabled && actionsPosition === 'end' && (
          <DataTableActions row={row} actions={actions} />
        )}
      </tr>

      {/* Expanded Row Content */}
      {expansionEnabled && expanded && renderExpanded && (
        <tr className="bg-bg-tertiary/50">
          <td
            colSpan={
              columns.length +
              (selectionEnabled ? 1 : 0) +
              (actionsEnabled ? 1 : 0) +
              (expansionEnabled ? 1 : 0)
            }
            className="px-4 py-4 border-b border-border-primary"
          >
            {renderExpanded(row)}
          </td>
        </tr>
      )}
    </>
  )
}

DataTableCell.displayName = 'DataTableCell'
DataTableActions.displayName = 'DataTableActions'
DataTableRow.displayName = 'DataTableRow'