// ============================================================================
// FILE: src/pages/shop/AddShop/index.tsx
// Add/Edit Shop Page
// ============================================================================

import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppSelector } from '@/store/hooks'
// import { useGetShopQuery } from '@/api/services/shopService'
import { ShopForm } from '@/components/shop/ShopForm'
// import { Loader2 } from 'lucide-react'
import type { Shop } from '@/types'
import { dummyShops } from '../data'

// ============================================================================
// HELPER: Convert Shop to Form Data
// ============================================================================
const convertShopToFormData = (shop: Shop): Partial<Shop> => {
  return {
    name: shop.name,
    displayName: shop.displayName,

    email: shop.email,
    phone: shop.phone,
    alternatePhone: shop.alternatePhone,
    whatsappNumber: shop.whatsappNumber,
    website: shop.website,

    address: shop.address,

    gstNumber: shop.gstNumber,
    panNumber: shop.panNumber,
    tanNumber: shop.tanNumber,

    shopType: shop.shopType,
    category: shop.category,
    establishedYear: shop.establishedYear,

    bankDetails: shop.bankDetails,
    upiDetails: shop.upiDetails,

    settings: shop.settings,
    features: shop.features,
  }
}

// ============================================================================
// PAGE COMPONENT
// ============================================================================
export default function AddShopPage() {
  const navigate = useNavigate()
  const { shopId } = useParams()
  const isEditMode = Boolean(shopId)

  // Get current organization ID from Redux
  // const currentOrgId = useAppSelector(state => state.auth.organizationId)
  // const userRole = useAppSelector(state => state.auth.user?.role)

  // Use fallback org ID for demo
  const organizationId = '6401a1b2c3d4e5f6a7b8c9d0'

  // Fetch shop data if editing (MOCK DATA)
  // const { data: shopData, isLoading } = useGetShopQuery(
  //   { shopId: shopId! },
  //   { skip: !isEditMode || !shopId }
  // )

  const mockShop = useMemo(() => {
    if (!isEditMode || !shopId) return undefined
    return dummyShops.find(s => s._id === shopId)
  }, [shopId, isEditMode])

  // Convert shop to form data
  const initialData = useMemo(() => {
    if (!mockShop) return undefined
    return convertShopToFormData(mockShop)
  }, [mockShop])

  // Loading state (commented for mock)
  // if (isEditMode && isLoading) {
  //   return (
  //     <div className="flex h-screen items-center justify-center">
  //       <Loader2 className="h-8 w-8 animate-spin text-accent" />
  //     </div>
  //   )
  // }

  // Permission check (commented for mock)
  // if (!['super_admin', 'org_admin', 'shop_admin'].includes(userRole || '')) {
  //   return (
  //     <div className="flex h-screen items-center justify-center">
  //       <p className="text-text-secondary">
  //         You do not have permission to access this page
  //       </p>
  //     </div>
  //   )
  // }

  // No organization selected (commented for mock)
  // if (!currentOrgId && !isEditMode) {
  //   return (
  //     <div className="flex h-screen items-center justify-center">
  //       <p className="text-text-secondary">Please select an organization first</p>
  //     </div>
  //   )
  // }

  return (
    <ShopForm
      shopId={shopId}
      organizationId={organizationId}
      initialData={initialData}
      onSuccess={() => {
        console.log('Mock Success - Navigate to /shops')
        navigate('/shops')
      }}
      onCancel={() => {
        navigate('/shops')
      }}
      mode={isEditMode ? 'edit' : 'create'}
    />
  )
}
