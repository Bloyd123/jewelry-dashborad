// FILE: src/pages/supplier/AddSupplier.tsx
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { SupplierForm } from '@/components/supplier/SupplierForm'
import { useSupplierById } from '@/hooks/supplier'
import { useAuth } from '@/hooks/auth'
import type { SupplierFormData } from '@/components/supplier/SupplierForm/SupplierForm.types'
import { Loader2 } from 'lucide-react'
export const AddSupplier = () => {
  const navigate = useNavigate()
  const { supplierId } = useParams() 
  const [searchParams] = useSearchParams()
  const mode = searchParams.get('mode') || (supplierId ? 'edit' : 'create')
  const { currentShopId } = useAuth()
  const SHOP_ID = currentShopId || ''
  const { supplier: existingSupplier, isLoading: isLoadingSupplier } =
    useSupplierById(SHOP_ID, supplierId!)
  const initialData: Partial<SupplierFormData> | undefined = existingSupplier
    ? {
        businessName: existingSupplier.businessName,
        displayName: existingSupplier.displayName,
        supplierCode: existingSupplier.supplierCode,
        supplierType: existingSupplier.supplierType,
        supplierCategory: existingSupplier.supplierCategory,
        contactPerson: existingSupplier.contactPerson,
        businessEmail: existingSupplier.businessEmail,
        businessPhone: existingSupplier.businessPhone,
        website: existingSupplier.website,
        address: existingSupplier.address,
        gstNumber: existingSupplier.gstNumber,
        panNumber: existingSupplier.panNumber,
        tanNumber: existingSupplier.tanNumber,
        registrationNumber: existingSupplier.registrationNumber,
        paymentTerms: existingSupplier.paymentTerms,
        creditPeriod: existingSupplier.creditPeriod,
        creditLimit: existingSupplier.creditLimit,
        productsSupplied: existingSupplier.productsSupplied,
        specialization: existingSupplier.specialization,
        bankDetails: existingSupplier.bankDetails,
        upiId: existingSupplier.upiId,
        notes: existingSupplier.notes,
        internalNotes: existingSupplier.internalNotes,
        tags: existingSupplier.tags,
      }
    : undefined

  const handleSuccess = () => {
    console.log(' Supplier saved successfully!')
    console.log('Mode:', mode)
    console.log('SupplierId:', supplierId)
    navigate('/suppliers')
  }

  const handleCancel = () => {
    navigate('/suppliers')
  }

  if (mode === 'edit' && isLoadingSupplier) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    )
  }

  return (
    <SupplierForm
      mode={mode as 'create' | 'edit'}
      initialData={initialData}
      shopId={SHOP_ID}
      supplierId={supplierId}
      onSuccess={handleSuccess}
      onCancel={handleCancel}
    />
  )
}
