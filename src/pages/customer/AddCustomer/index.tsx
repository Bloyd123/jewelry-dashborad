// ============================================================================
// FILE: src/pages/customer/AddCustomer/index.tsx
// Add/Edit Customer Page
// ============================================================================

import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppSelector } from '@/store/hooks'
// import { useGetCustomerQuery } from '@/api/services/customerService'
import { CustomerForm } from '@/components/customer/CustomerForm'
// import { Loader2 } from 'lucide-react'
import type { Customer } from '@/types'
import { MOCK_CUSTOMERS } from '@/pages/customer/AddCustomer/mockdata'
import type { CreateCustomerInput } from '@/validators/customerValidation'

// ============================================================================
// HELPER: Convert Customer to Form Data
// ============================================================================
const convertCustomerToFormData = (
  customer: Customer
): Partial<CreateCustomerInput> => {
  return {
    firstName: customer.firstName,
    lastName: customer.lastName,
    phone: customer.phone,
    alternatePhone: customer.alternatePhone,
    whatsappNumber: customer.whatsappNumber,
    email: customer.email,

    // Dates - Convert to YYYY-MM-DD format
    dateOfBirth: customer.dateOfBirth?.split('T')[0],

    gender: customer.gender,

    anniversaryDate: customer.anniversaryDate?.split('T')[0],

    address: customer.address,

    aadharNumber: customer.aadharNumber,
    panNumber: customer.panNumber,
    gstNumber: customer.gstNumber,

    customerType: customer.customerType,
    customerCategory: customer.customerCategory,

    creditLimit: customer.creditLimit,

    preferences: customer.preferences,

    source: customer.source,
    referredBy: customer.referredBy,

    notes: customer.notes,
    tags: customer.tags,
  }
}

// ============================================================================
// PAGE COMPONENT
// ============================================================================
export default function AddCustomerPage() {
  const navigate = useNavigate()
  const { customerId } = useParams()
  const isEditMode = Boolean(customerId)

  // Get current shop ID from Redux
  // const currentShopId = useAppSelector(state => state.auth.currentShop)
  const shopId = 'shop_123'

  // Fetch customer data if editing
  // const { data: customerData, isLoading } = useGetCustomerQuery(
  //   { shopId: currentShopId!, customerId: customerId! },
  //   { skip: !isEditMode || !customerId || !currentShopId }
  // )
  const mockCustomer = useMemo(() => {
    if (!isEditMode || !customerId) return undefined
    return MOCK_CUSTOMERS.find(c => c._id === customerId)
  }, [customerId, isEditMode])

  // ✅ CHANGE: Use mock data
  const initialData = useMemo(() => {
    if (!mockCustomer) return undefined
    return convertCustomerToFormData(mockCustomer)
  }, [mockCustomer])

  // ← CONVERT: Customer to form data
  // const initialData = useMemo(() => {
  //   if (!customerData?.data?.customer) return undefined
  //   return convertCustomerToFormData(customerData.data.customer)
  // }, [customerData])

  // Loading state
  // if (isEditMode && isLoading) {
  //   return (
  //     <div className="flex items-center justify-center h-screen">
  //       <Loader2 className="h-8 w-8 animate-spin text-accent" />
  //     </div>
  //   )
  // }

  // No shop selected
  // if (!currentShopId) {
  //   return (
  //     <div className="flex items-center justify-center h-screen">
  //       <p className="text-text-secondary">Please select a shop first</p>
  //     </div>
  //   )
  // }

  // return (
  //   <CustomerForm
  //     shopId={currentShopId}
  //     customerId={customerId}
  //     initialData={initialData}
  //     onSuccess={() => {
  //       navigate('/customers')
  //     }}
  //     onCancel={() => {
  //       navigate('/customers')
  //     }}
  //     mode={isEditMode ? 'edit' : 'create'}
  //   />
  // )
  return (
    <CustomerForm
      shopId={shopId}
      customerId={customerId}
      initialData={initialData}
      onSuccess={() => {
        console.log('Mock Success - Navigate to /customers')
        navigate('/customers')
      }}
      onCancel={() => {
        navigate('/customers')
      }}
      mode={isEditMode ? 'edit' : 'create'}
    />
  )
}
