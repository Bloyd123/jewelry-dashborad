// ============================================================================
// FILE: src/components/ui/data-display/DataTable/DataTable.types.ts
// DataTable TypeScript Types & Interfaces
// ============================================================================

import { ReactNode } from 'react'

// ============================================================================
// COLUMN DEFINITION
// ============================================================================

export interface DataTableColumn<T = any> {
  id: string
  header: string | ReactNode
  accessorKey?: keyof T | string
  accessorFn?: (row: T) => any
  cell?: (props: { row: T; value: any }) => ReactNode
  sortable?: boolean
  sortingFn?: (rowA: T, rowB: T) => number
  filterable?: boolean
  filterFn?: (row: T, filterValue: any) => boolean
  width?: string | number
  minWidth?: string | number
  maxWidth?: string | number
  align?: 'left' | 'center' | 'right'
  className?: string
  headerClassName?: string
  cellClassName?: string
  enableHiding?: boolean
  meta?: Record<string, any>
}

// ============================================================================
// SORTING
// ============================================================================

export type SortDirection = 'asc' | 'desc' | null

export interface SortingState {
  columnId: string
  direction: SortDirection
}

export interface SortingConfig {
  enabled?: boolean
  multiSort?: boolean
  sortingState?: SortingState[]
  onSortingChange?: (sorting: SortingState[]) => void
}

// ============================================================================
// PAGINATION
// ============================================================================

export interface PaginationState {
  pageIndex: number
  pageSize: number
}

export interface PaginationConfig {
  enabled?: boolean
  pageIndex?: number
  pageSize?: number
  pageSizeOptions?: number[]
  totalItems?: number
  totalPages?: number
  onPaginationChange?: (pagination: PaginationState) => void
  showPageSizeSelector?: boolean
  showPageInfo?: boolean
  showFirstLastButtons?: boolean
}

// ============================================================================
// FILTERING
// ============================================================================

export interface FilterState {
  columnId: string
  value: any
}

export interface FilteringConfig {
  enabled?: boolean
  filters?: FilterState[]
  onFiltersChange?: (filters: FilterState[]) => void
  globalFilter?: string
  onGlobalFilterChange?: (value: string) => void
}

// ============================================================================
// SELECTION
// ============================================================================

export interface SelectionConfig<T = any> {
  enabled?: boolean
  selectedRows?: Set<string | number>
  onSelectionChange?: (selectedIds: Set<string | number>) => void
  getRowId?: (row: T, index: number) => string | number
  selectAllEnabled?: boolean
}

// ============================================================================
// ROW ACTIONS
// ============================================================================

export interface RowAction<T = any> {
  label: string | ReactNode
  icon?: ReactNode
  onClick: (row: T) => void
  variant?: 'default' | 'destructive' | 'ghost'
  disabled?: boolean | ((row: T) => boolean)
  hidden?: boolean | ((row: T) => boolean)
  className?: string
}

export interface RowActionsConfig<T = any> {
  enabled?: boolean
  actions?: RowAction<T>[]
  position?: 'start' | 'end'
  dropdownLabel?: string
  width?: string | number
}
// ============================================================================
// LOADING & EMPTY STATES
// ============================================================================

export interface LoadingConfig {
  isLoading?: boolean
  loadingRows?: number
  loadingComponent?: ReactNode
}

export interface EmptyStateConfig {
  message?: string | ReactNode
  icon?: ReactNode
  action?: {
    label: string
    onClick: () => void
  }
}

// ============================================================================
// STYLING & LAYOUT
// ============================================================================

export interface StyleConfig {
  variant?: 'default' | 'bordered' | 'striped' | 'compact'
  size?: 'sm' | 'md' | 'lg'
  stickyHeader?: boolean
  stickyFirstColumn?: boolean
  stickyLastColumn?: boolean
  hoverEffect?: boolean
  zebraStripes?: boolean
  showBorder?: boolean
  rounded?: boolean
  shadow?: boolean
  fullWidth?: boolean
  className?: string
  containerClassName?: string
  headerClassName?: string
  bodyClassName?: string
  rowClassName?: string | ((row: any, index: number) => string)
  cellClassName?: string
}

// ============================================================================
// RESPONSIVE CONFIG
// ============================================================================

export interface ResponsiveConfig {
  enabled?: boolean
  breakpoint?: 'sm' | 'md' | 'lg' | 'xl'
  mobileCardView?: boolean
  hiddenColumns?: {
    sm?: string[]
    md?: string[]
    lg?: string[]
  }
}

// ============================================================================
// MAIN DATATABLE PROPS
// ============================================================================

export interface DataTableProps<T = any> {
  // Required
  data: T[]
  columns: DataTableColumn<T>[]

  // Optional Configurations
  sorting?: SortingConfig
  pagination?: PaginationConfig
  filtering?: FilteringConfig
  selection?: SelectionConfig<T>
  rowActions?: RowActionsConfig<T>
  loading?: LoadingConfig
  emptyState?: EmptyStateConfig
  style?: StyleConfig
  responsive?: ResponsiveConfig

  // Row Events
  onRowClick?: (row: T, index: number) => void
  onRowDoubleClick?: (row: T, index: number) => void
  onRowContextMenu?: (row: T, index: number, event: React.MouseEvent) => void

  // Custom Components
  customHeader?: ReactNode
  customFooter?: ReactNode
  rowExpansion?: {
    enabled: boolean
    renderExpanded: (row: T) => ReactNode
    expandedRows?: Set<string | number>
    onExpandedChange?: (expandedIds: Set<string | number>) => void
  }

  // Virtualization (for large datasets)
  virtualization?: {
    enabled: boolean
    rowHeight?: number
    overscan?: number
  }

  // Misc
  getRowId?: (row: T, index: number) => string | number
  testId?: string
  ariaLabel?: string
}

// ============================================================================
// INTERNAL STATE (for component use)
// ============================================================================

export interface DataTableInternalState {
  sorting: SortingState[]
  pagination: PaginationState
  filters: FilterState[]
  globalFilter: string
  selectedRows: Set<string | number>
  expandedRows: Set<string | number>
  columnVisibility: Record<string, boolean>
}

// ============================================================================
// HELPER TYPES
// ============================================================================

export type DataTableInstance<T = any> = {
  data: T[]
  filteredData: T[]
  sortedData: T[]
  paginatedData: T[]
  state: DataTableInternalState
  resetFilters: () => void
  resetSorting: () => void
  resetSelection: () => void
  selectAll: () => void
  deselectAll: () => void
  toggleRowSelection: (rowId: string | number) => void
  expandRow: (rowId: string | number) => void
  collapseRow: (rowId: string | number) => void
  toggleRowExpansion: (rowId: string | number) => void
}

export type CellContext<T = any> = {
  row: T
  column: DataTableColumn<T>
  value: any
  index: number
  isSelected: boolean
  isExpanded: boolean
}

export type HeaderContext<T = any> = {
  column: DataTableColumn<T>
  sortingState: SortingState | undefined
  onSort: (direction: SortDirection) => void
  allRowsSelected: boolean
  someRowsSelected: boolean
  onSelectAll: () => void
}
