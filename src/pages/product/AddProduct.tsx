// FILE: src/pages/product/AddProduct.tsx
// Add/Edit Product Page (No API Integration - Test Only)

import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ProductForm } from '@/components/products/ProductForms'
import { dummyProducts } from './mock.data'
import type { ProductFormData } from '@/components/products/ProductForms/ProductForm.types'

export const AddProduct = () => {
  const navigate = useNavigate()
  const { productId } = useParams() // Get productId from URL if editing
  const [searchParams] = useSearchParams()
  const mode = searchParams.get('mode') || (productId ? 'edit' : 'create')

  // Find product data if editing
  const existingProduct = productId
    ? dummyProducts.find(
        p => p._id === productId || p.productCode === productId
      )
    : null

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
    // Show success message (you can add toast here later)
    console.log(' Product saved successfully!')
    console.log('Mode:', mode)
    console.log('ProductId:', productId)
    console.log('Form Data:', initialData)

    // Navigate back to product list
    navigate('/products')
  }

  const handleCancel = () => {
    // Navigate back without saving
    navigate('/products')
  }

  return (
    <ProductForm
      mode={mode as 'create' | 'edit'}
      initialData={initialData}
      shopId="shop_123456789" // Mock shop ID
      productId={productId}
      onSuccess={handleSuccess}
      onCancel={handleCancel}
    />
  )
}
