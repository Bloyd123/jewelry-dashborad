// FILE: src/components/products/ProductTable/ProductTable.tsx
// Main Product Table Component

import React, { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { DataTable } from '@/components/ui/data-display/DataTable'
import { productTableColumns } from './ProductTableColumns'
import { getProductRowActions, BulkActionsBar } from './ProductTableActions'
import { ProductFilters } from '@/components/products/ProductFilters'
import type { ProductFilterValues } from '@/components/products/ProductFilters'
import { selectCurrentShopId } from '@/store/slices/authSlice'
import { useProductsList } from '@/hooks/product'
import { useProductActions } from '@/hooks/product'
import { useProductBulkActions } from '@/hooks/product'
import type {
  Product,
  MetalType,
  MetalPurity,
  ProductStatus,
  SaleStatus,
  Gender,
} from '@/types/product.types'

// MAIN COMPONENT

export const ProductTable: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  // SHOP ID FROM AUTH
  const shopId = useSelector(selectCurrentShopId)!

  // STATE

  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(
    new Set()
  )

  const [filters, setFilters] = useState<ProductFilterValues>({
    search: '',
    category: undefined,
    subCategory: undefined,
    metalType: undefined,
    purity: undefined,
    status: undefined,
    saleStatus: undefined,
    gender: undefined,
    productType: undefined,
    minPrice: undefined,
    maxPrice: undefined,
  })

  // FETCH PRODUCTS FROM API

  const { products, isLoading, pagination } = useProductsList(shopId, {
    search: filters.search || undefined,
    category: filters.category,
    metalType: filters.metalType as MetalType | undefined,
    purity: filters.purity as MetalPurity | undefined,
    status: filters.status as ProductStatus | undefined,
    saleStatus: filters.saleStatus as SaleStatus | undefined,
    gender: filters.gender as Gender | undefined,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
  })

  // PRODUCT ACTIONS (delete, stock update, etc.)

  const { deleteProduct, updateStock, calculatePrice, isDeleting } =
    useProductActions(shopId)

  // BULK ACTIONS

  const { bulkDeleteProducts, bulkUpdateStatus, isBulkDeleting } =
    useProductBulkActions(shopId)

  // HANDLERS

  const handleViewDetails = (product: Product) => {
    navigate(`/products/${product._id}`)
  }

  const handleEdit = (product: Product) => {
    navigate(`/products/edit/${product._id}`)
  }

  const handleDuplicate = (product: Product) => {
    console.log('Duplicate Product:', product)
    // TODO: Implement duplicate logic
  }

  const handleUpdateStock = (product: Product) => {
    console.log('Update Stock:', product)
    // TODO: Open stock update modal
  }

  const handleCalculatePrice = async (product: Product) => {
    await calculatePrice(product._id, { useCurrentRate: true })
  }

  const handlePrintLabel = (product: Product) => {
    console.log('Print Label:', product)
    // TODO: Open print label dialog
  }

  const handleDelete = async (product: Product) => {
    if (confirm(t('product.confirmDelete'))) {
      await deleteProduct(product._id)
    }
  }

  // BULK ACTION HANDLERS

  const handleBulkViewDetails = () => {
    const selected = products.filter(p => selectedRows.has(p._id))
    if (selected.length === 1) {
      handleViewDetails(selected[0])
    }
  }

  const handleBulkEdit = () => {
    const selected = products.filter(p => selectedRows.has(p._id))
    if (selected.length === 1) {
      handleEdit(selected[0])
    }
  }

  const handleBulkUpdateStatus = async () => {
    const productIds = products
      .filter(p => selectedRows.has(p._id))
      .map(p => p._id)
    console.log('Bulk Update Status:', productIds)
    // TODO: Open bulk status update modal, then call:
    // await bulkUpdateStatus({ productIds, status: selectedStatus })
  }

  const handleBulkPrint = () => {
    const selected = products.filter(p => selectedRows.has(p._id))
    console.log('Bulk Print Labels:', selected)
    // TODO: Print labels for selected products
  }

  const handleBulkExport = () => {
    const selected = products.filter(p => selectedRows.has(p._id))
    console.log('Bulk Export:', selected)
    // TODO: Export selected products
  }

  const handleBulkDelete = async () => {
    const productIds = products
      .filter(p => selectedRows.has(p._id))
      .map(p => p._id)

    if (confirm(t('product.confirmBulkDelete', { count: productIds.length }))) {
      const result = await bulkDeleteProducts({ productIds })
      if (result.success) {
        setSelectedRows(new Set())
      }
    }
  }

  const handleClearSelection = () => {
    setSelectedRows(new Set())
  }

  const handleFiltersChange = (newFilters: ProductFilterValues) => {
    setFilters(newFilters)
  }

  const handleClearAllFilters = () => {
    setFilters({
      search: '',
      category: undefined,
      subCategory: undefined,
      metalType: undefined,
      purity: undefined,
      status: undefined,
      saleStatus: undefined,
      gender: undefined,
      productType: undefined,
      minPrice: undefined,
      maxPrice: undefined,
    })
  }

  // ROW ACTIONS

  const rowActions = useMemo(
    () =>
      getProductRowActions(
        handleViewDetails,
        handleEdit,
        handleDuplicate,
        handleUpdateStock,
        handleCalculatePrice,
        handlePrintLabel,
        handleDelete
      ),
    [shopId]
  )

  // SELECTED PRODUCTS

  const selectedProducts = useMemo(() => {
    return products.filter(product => selectedRows.has(product._id))
  }, [products, selectedRows])

  // RENDER

  return (
    <div className="w-full space-y-4">
      {/* Filters */}
      <ProductFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearAll={handleClearAllFilters}
      />

      {/* Bulk Actions Bar - Shows when rows are selected */}
      {selectedRows.size > 0 && (
        <BulkActionsBar
          selectedCount={selectedRows.size}
          selectedProducts={selectedProducts}
          onViewDetails={handleBulkViewDetails}
          onEdit={handleBulkEdit}
          onBulkUpdateStatus={handleBulkUpdateStatus}
          onBulkPrint={handleBulkPrint}
          onBulkExport={handleBulkExport}
          onBulkDelete={handleBulkDelete}
          onClearSelection={handleClearSelection}
        />
      )}

      {/* DataTable */}
      <DataTable
        data={products}
        columns={productTableColumns}
        // loading={isLoading}
        // Sorting Configuration
        sorting={{
          enabled: true,
        }}
        // Pagination Configuration
        pagination={{
          enabled: true,
          pageSize: pagination?.pageSize ?? 20,
          pageSizeOptions: [10, 20, 50, 100],
          showPageSizeSelector: true,
          showPageInfo: true,
          showFirstLastButtons: true,
        }}
        // Selection Configuration
        selection={{
          enabled: true,
          selectedRows,
          onSelectionChange: setSelectedRows,
          getRowId: row => row._id,
          selectAllEnabled: true,
        }}
        // Row Actions Configuration
        rowActions={{
          enabled: true,
          actions: rowActions,
          position: 'end',
        }}
        // Empty State Configuration
        emptyState={{
          message: t('product.table.noProducts'),
        }}
        // Style Configuration
        style={{
          variant: 'default',
          size: 'md',
          stickyHeader: true,
          hoverEffect: true,
          zebraStripes: false,
          showBorder: true,
          rounded: true,
          shadow: true,
          fullWidth: true,
        }}
        // Row Click Handler
        onRowClick={product => {
          console.log('Row clicked:', product)
        }}
        // Get Row ID
        getRowId={row => row._id}
        // Test ID
        testId="product-table"
        ariaLabel={t('product.table.ariaLabel')}
      />
    </div>
  )
}

ProductTable.displayName = 'ProductTable'
