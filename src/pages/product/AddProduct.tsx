// FILE: src/pages/product/AddProduct.tsx

import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCurrentShopId } from '@/store/slices/authSlice'
import { useProductById } from '@/hooks/product'
import { ProductForm } from '@/components/products/ProductForms'
import type { ProductFormData } from '@/components/products/ProductForms/ProductForm.types'

export const AddProduct = () => {
  const navigate = useNavigate()
  const { productId } = useParams()
  const [searchParams] = useSearchParams()
  const mode = searchParams.get('mode') || (productId ? 'edit' : 'create')

  const shopId = useSelector(selectCurrentShopId)!

  const { product: existingProduct, isLoading: isLoadingProduct } =
    useProductById(shopId, productId ?? '')

  // Loading guard for edit mode
  if (mode === 'edit' && isLoadingProduct) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
      </div>
    )
  }

  // Transform backend product data to form data
  const initialData: Partial<ProductFormData> | undefined = existingProduct
    ? {
        productCode: existingProduct.productCode,
        barcode: existingProduct.barcode,
        sku: existingProduct.sku,
        huid: existingProduct.hallmarking?.huid,
        name: existingProduct.name,
        description: existingProduct.description,
        categoryId:
          typeof existingProduct.categoryId === 'string'
            ? existingProduct.categoryId
            : existingProduct.categoryId._id,
        subCategoryId: existingProduct.subCategoryId
          ? typeof existingProduct.subCategoryId === 'string'
            ? existingProduct.subCategoryId
            : existingProduct.subCategoryId._id
          : undefined,
        productType: existingProduct.productType,
        metal: existingProduct.metal,
        weight: existingProduct.weight,
        stones: existingProduct.stones,
        makingCharges: existingProduct.makingCharges,
        pricing: existingProduct.pricing,
        stock: existingProduct.stock,
        size: existingProduct.size,
        dimensions: existingProduct.dimensions,
        hallmarking: existingProduct.hallmarking,
        images: existingProduct.images,
        gender: existingProduct.gender,
        occasion: existingProduct.occasion,
        isActive: existingProduct.isActive,
        isFeatured: existingProduct.isFeatured,
        isNewArrival: existingProduct.isNewArrival,
        isBestseller: existingProduct.isBestseller,
        tags: existingProduct.tags,
        keywords: existingProduct.keywords,
        notes: existingProduct.notes,
        internalNotes: existingProduct.internalNotes,
      }
    : undefined

  const handleSuccess = () => {
    navigate('/products')
  }

  const handleCancel = () => {
    navigate('/products')
  }

  return (
    <ProductForm
      mode={mode as 'create' | 'edit'}
      initialData={initialData}
      shopId={shopId}
      productId={productId}
      onSuccess={handleSuccess}
      onCancel={handleCancel}
    />
  )
}
