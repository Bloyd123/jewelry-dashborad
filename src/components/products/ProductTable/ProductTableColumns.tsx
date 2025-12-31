// ============================================================================
// FILE: src/components/products/ProductTable/ProductTableColumns.tsx
// Product Table Column Definitions
// ============================================================================

import { Copy, Award, Package } from 'lucide-react'
// import { Avatar } from '@/components/ui/data-display/Avatar'
import { Badge } from '@/components/ui/data-display/Badge'
import type { DataTableColumn } from '@/components/ui/data-display/DataTable'
import type { Product } from './ProductTable.types'

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Format currency in INR
 */
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Copy to clipboard
 */
const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
}

/**
 * Get category name from category object or ID
 */
const getCategoryName = (category: any): string => {
  if (!category) return '-'
  if (typeof category === 'string') return category
  return category.name?.default || category.name || '-'
}

// ============================================================================
// COLUMN DEFINITIONS
// ============================================================================

export const productTableColumns: DataTableColumn<Product>[] = [
  // 1. Product Code with Image Thumbnail
  {
    id: 'productCode',
    header: 'product.table.productCode',
    accessorKey: 'productCode',
    sortable: true,
    width: '180px',
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-md border border-border-primary bg-bg-tertiary">
          {row.primaryImage ? (
            <img
              src={row.primaryImage}
              alt={row.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Package className="h-5 w-5 text-text-tertiary" />
            </div>
          )}
        </div>
        <div className="flex flex-col">
          <span className="font-medium text-text-primary">
            {row.productCode}
          </span>
          {row.barcode && (
            <span className="text-xs text-text-tertiary">{row.barcode}</span>
          )}
        </div>
      </div>
    ),
  },

  // 2. Product Name with Category
  {
    id: 'name',
    header: 'product.table.productName',
    accessorKey: 'name',
    sortable: true,
    width: '250px',
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="line-clamp-1 font-medium text-text-primary">
          {row.name}
        </span>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-xs text-text-tertiary">
            {getCategoryName(row.categoryId)}
          </span>
          {row.subCategoryId && (
            <>
              <span className="text-text-tertiary">•</span>
              <span className="text-xs text-text-tertiary">
                {getCategoryName(row.subCategoryId)}
              </span>
            </>
          )}
        </div>
      </div>
    ),
  },

  // 3. Metal Type & Purity
  {
    id: 'metal',
    header: 'product.table.metalDetails',
    accessorKey: 'metal.type',
    sortable: true,
    width: '140px',
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Badge variant="outline" size="sm">
            {row.metal.type.toUpperCase()}
          </Badge>
        </div>
        <span className="text-xs text-text-secondary">
          {row.metal.purity}
          {row.metal.color && ` • ${row.metal.color}`}
        </span>
      </div>
    ),
  },

  // 4. Weight
  {
    id: 'weight',
    header: 'product.table.weight',
    accessorKey: 'weight.grossWeight',
    sortable: true,
    align: 'right',
    width: '120px',
    cell: ({ row }) => (
      <div className="flex flex-col items-end">
        <span className="font-semibold text-text-primary">
          {row.weight.grossWeight.toFixed(2)}g
        </span>
        <span className="text-xs text-text-tertiary">
          Net: {row.weight.netWeight.toFixed(2)}g
        </span>
      </div>
    ),
  },

  // 5. Pricing
  {
    id: 'pricing',
    header: 'product.table.price',
    accessorKey: 'pricing.sellingPrice',
    sortable: true,
    align: 'right',
    width: '140px',
    cell: ({ row }) => (
      <div className="flex flex-col items-end">
        <span className="font-bold text-text-primary">
          {formatCurrency(row.pricing.sellingPrice)}
        </span>
        {row.pricing.mrp && row.pricing.mrp > row.pricing.sellingPrice && (
          <span className="text-xs text-text-tertiary line-through">
            {formatCurrency(row.pricing.mrp)}
          </span>
        )}
        {row.pricing.discount?.type !== 'none' &&
          row.pricing.discount.value > 0 && (
            <Badge variant="success" size="sm" className="mt-1">
              {row.pricing.discount.type === 'percentage'
                ? `${row.pricing.discount.value}% OFF`
                : `₹${row.pricing.discount.value} OFF`}
            </Badge>
          )}
      </div>
    ),
  },

  // 6. Stock Status
  {
    id: 'stock',
    header: 'product.table.stock',
    accessorKey: 'stock.quantity',
    sortable: true,
    align: 'center',
    width: '120px',
    cell: ({ row }) => (
      <div className="flex flex-col items-center gap-1">
        <span className="font-semibold text-text-primary">
          {row.stock.quantity} {row.stock.unit}
        </span>
        <Badge
          variant={
            row.status === 'in_stock'
              ? 'success'
              : row.status === 'low_stock'
                ? 'warning'
                : 'error'
          }
          dot
          size="sm"
        >
          {row.status.replace('_', ' ').toUpperCase()}
        </Badge>
      </div>
    ),
  },

  // 7. Product Type
  {
    id: 'productType',
    header: 'product.table.type',
    accessorKey: 'productType',
    sortable: true,
    width: '120px',
    cell: ({ row }) => {
      const typeVariants: Record<string, any> = {
        ready_made: 'info',
        custom_made: 'warning',
        on_order: 'pending',
        repair: 'error',
        exchange: 'accent',
      }

      return (
        <Badge variant={typeVariants[row.productType] || 'default'} size="sm">
          {row.productType.replace('_', ' ').toUpperCase()}
        </Badge>
      )
    },
  },

  // 8. Sale Status
  {
    id: 'saleStatus',
    header: 'product.table.saleStatus',
    accessorKey: 'saleStatus',
    sortable: true,
    width: '130px',
    cell: ({ row }) => {
      const statusVariants: Record<string, any> = {
        available: 'success',
        reserved: 'warning',
        sold: 'inactive',
        on_hold: 'pending',
        returned: 'error',
      }

      return (
        <Badge
          variant={statusVariants[row.saleStatus] || 'default'}
          dot
          size="sm"
        >
          {row.saleStatus.toUpperCase()}
        </Badge>
      )
    },
  },

  // 9. Features (Hallmark, Featured, etc.)
  {
    id: 'features',
    header: 'product.table.features',
    width: '140px',
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {row.hallmarking?.isHallmarked && (
          <Badge variant="accent" size="sm">
            HM
          </Badge>
        )}
        {row.isFeatured && (
          <Badge variant="warning" size="sm">
            ⭐
          </Badge>
        )}
        {row.isNewArrival && (
          <Badge variant="info" size="sm">
            NEW
          </Badge>
        )}
        {row.isBestseller && (
          <Badge variant="success" size="sm">
            🔥
          </Badge>
        )}
      </div>
    ),
  },

  // 10. Gender
  {
    id: 'gender',
    header: 'product.table.gender',
    accessorKey: 'gender',
    sortable: true,
    width: '100px',
    cell: ({ row }) => {
      const genderIcons: Record<string, string> = {
        male: '👔',
        female: '👗',
        unisex: '👫',
        kids: '👶',
      }

      return (
        <div className="flex items-center justify-center gap-1">
          <span>{genderIcons[row.gender]}</span>
          <span className="text-sm capitalize text-text-secondary">
            {row.gender}
          </span>
        </div>
      )
    },
  },

  // 11. Active Status
  {
    id: 'isActive',
    header: 'product.table.status',
    accessorKey: 'isActive',
    sortable: true,
    width: '100px',
    cell: ({ row }) => (
      <Badge variant={row.isActive ? 'active' : 'inactive'} dot size="sm">
        {row.isActive ? 'Active' : 'Inactive'}
      </Badge>
    ),
  },
]
