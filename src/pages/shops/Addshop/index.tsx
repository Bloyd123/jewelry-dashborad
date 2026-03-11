// FILE: src/pages/shop/AddShop/index.tsx
// Add/Edit Shop Page

import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { ShopForm } from '@/components/shop/ShopForm'
import { useShopById } from '@/hooks/shop'
import { useAuthState } from '@/hooks/auth'
import type { Shop, ShopFormData } from '@/types'
import { useAppSelector } from '@/store/hooks'

// -------------------------------------------------------
// HELPER: Convert Shop to Form Data
// -------------------------------------------------------

const convertShopToFormData = (shop: Shop): Partial<ShopFormData> => {
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
  }
}

// -------------------------------------------------------
// PAGE COMPONENT
// -------------------------------------------------------

export default function AddShopPage() {
  const navigate = useNavigate()
  const { shopId } = useParams()
  const isEditMode = Boolean(shopId)

  // Real auth
const { userRole, auth } = useAuthState()
const organizationId = useAppSelector(
  state => state.user.profile?.organizationId ?? ''
)
  // Real API — fetch shop if edit mode
  const { shop, isLoading } = useShopById(shopId ?? '')

  // Loading state
  if (isEditMode && isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    )
  }

  // Permission check
  if (!['super_admin', 'org_admin', 'shop_admin'].includes(userRole || '')) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-text-secondary">
          You do not have permission to access this page
        </p>
      </div>
    )
  }

  // No organization selected
  if (!organizationId  && !isEditMode) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-text-secondary">
          Please select an organization first
        </p>
      </div>
    )
  }

  // Convert shop to form data for edit mode
  const initialData = useMemo(() => {
    if (!shop) return undefined
    return convertShopToFormData(shop)
  }, [shop])

  return (
    <ShopForm
      shopId={shopId}
      organizationId={organizationId  ?? ''}
      initialData={initialData}
      onSuccess={() => navigate('/shops')}
      onCancel={() => navigate('/shops')}
      mode={isEditMode ? 'edit' : 'create'}
    />
  )
}