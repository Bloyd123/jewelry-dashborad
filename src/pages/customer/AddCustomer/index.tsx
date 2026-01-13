// FILE: src/pages/customer/AddCustomer/index.tsx
// Add/Edit Customer Page - Production Ready

import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Loader2 } from 'lucide-react'

import { useCurrentShop } from '@/hooks/useAuth'
import { useGetCustomerByIdQuery } from '@/store/api/customerApi'
import { CustomerForm } from '@/components/customer/CustomerForm'
import type { Customer } from '@/types'
import type { CreateCustomerInput } from '@/validators/customerValidation'

//
// HELPER: Convert Customer to Form Data
//
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

//
// PAGE COMPONENT
//
export default function AddCustomerPage() {
  const navigate = useNavigate()
  const { customerId } = useParams()
  const { t } = useTranslation()
  const isEditMode = Boolean(customerId)

  // Get current shop from Redux
  const currentShop = useCurrentShop()
  const shopId = currentShop || ''

  // Fetch customer data (only in edit mode)
  const {
    data: customer,
    isLoading,
    error,
  } = useGetCustomerByIdQuery(
    { shopId, customerId: customerId! },
    { skip: !isEditMode || !shopId || !customerId }
  )

  // Convert customer to form data
  const initialData = useMemo(() => {
    if (!customer) return undefined
    return convertCustomerToFormData(customer)
  }, [customer])

  // No shop selected
  if (!shopId) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-text-secondary">{t('common.selectShopFirst')}</p>
      </div>
    )
  }

  // Loading state
  if (isEditMode && isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    )
  }

  // Error state
  if (isEditMode && error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-status-error">
            {t('customer.errors.fetchFailed')}
          </p>
          <button
            onClick={() => navigate('/customers')}
            className="text-accent hover:underline"
          >
            {t('common.goBack')}
          </button>
        </div>
      </div>
    )
  }

  // Not found
  if (isEditMode && !customer) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-text-secondary">
            {t('customer.errors.notFound')}
          </p>
          <button
            onClick={() => navigate('/customers')}
            className="text-accent hover:underline"
          >
            {t('common.goBack')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <CustomerForm
      shopId={shopId}
      customerId={customerId}
      initialData={initialData}
      onSuccess={() => navigate('/customers')}
      onCancel={() => navigate('/customers')}
      mode={isEditMode ? 'edit' : 'create'}
    />
  )
}
