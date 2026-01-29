// FILE: src/pages/supplier/AddSupplier.tsx
// Add/Edit Supplier Page (No API Integration - Test Only)

import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { SupplierForm } from '@/components/supplier/SupplierForm'
import { dummySuppliers } from '@/pages/suppliers/data'
import type { SupplierFormData } from '@/components/supplier/SupplierForm/SupplierForm.types'

export const AddSupplier = () => {
  const navigate = useNavigate()
  const { supplierId } = useParams() // Get supplierId from URL if editing
  const [searchParams] = useSearchParams()
  const mode = searchParams.get('mode') || (supplierId ? 'edit' : 'create')

  // Find supplier data if editing
  const existingSupplier = supplierId
    ? dummySuppliers.find(
        s => s._id === supplierId || s.supplierCode === supplierId
      )
    : null

  // Transform backend supplier data to form data
  const initialData: Partial<SupplierFormData> | undefined = existingSupplier
    ? {
        businessName: existingSupplier.businessName,
        displayName: existingSupplier.displayName,
        supplierCode: existingSupplier.supplierCode,
        supplierType: existingSupplier.supplierType,
        supplierCategory: existingSupplier.supplierCategory,
        contactPerson: {
          firstName: existingSupplier.contactPerson.firstName,
          lastName: existingSupplier.contactPerson.lastName,
          designation: existingSupplier.contactPerson.designation,
          email: existingSupplier.contactPerson.email,
          phone: existingSupplier.contactPerson.phone,
          alternatePhone: existingSupplier.contactPerson.alternatePhone,
          whatsappNumber: existingSupplier.contactPerson.whatsappNumber,
        },
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
    // Show success message (you can add toast here later)
    console.log(' Supplier saved successfully!')
    console.log('Mode:', mode)
    console.log('SupplierId:', supplierId)

    // Navigate back to supplier list
    navigate('/suppliers')
  }

  const handleCancel = () => {
    // Navigate back without saving
    navigate('/suppliers')
  }

  return (
    <SupplierForm
      mode={mode as 'create' | 'edit'}
      initialData={initialData}
      shopId="shop_987654321" // Mock shop ID
      supplierId={supplierId}
      onSuccess={handleSuccess}
      onCancel={handleCancel}
    />
  )
}
