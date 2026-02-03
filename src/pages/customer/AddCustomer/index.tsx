// FILE: src/pages/customer/AddCustomer/index.tsx
// Add/Edit Customer Page - Production Ready

import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Loader2 } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/common/Alert'
import { useAuth } from '@/hooks/auth'
import { Button } from '@/components/ui/button'
import { useCustomerById } from '@/hooks/customer/useCustomerById'
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
    // Basic Information
    firstName: customer.firstName || '',
    lastName: customer.lastName || '',

    // Contact Information
    phone: customer.phone || '',
    alternatePhone: customer.alternatePhone || '',
    whatsappNumber: customer.whatsappNumber || '',
    email: customer.email || '',

    // Personal Details - ✅ FIX: Convert ISO date to YYYY-MM-DD
    dateOfBirth: customer.dateOfBirth
      ? customer.dateOfBirth.split('T')[0] // "2026-02-01T05:11:48.283Z" → "2026-02-01"
      : '',
    gender: customer.gender,
    anniversaryDate: customer.anniversaryDate
      ? customer.anniversaryDate.split('T')[0]
      : '',

    // Address - ✅ FIX: Handle nested object properly
    address: customer.address
      ? {
          street: customer.address.street || '',
          city: customer.address.city || '',
          state: customer.address.state || '',
          pincode: customer.address.pincode || '',
        }
      : undefined,

    // KYC Details
    aadharNumber: customer.aadharNumber || '',
    panNumber: customer.panNumber || '',
    gstNumber: customer.gstNumber || '',

    // Customer Classification
    customerType: customer.customerType,
    customerCategory: customer.customerCategory,

    // Financial
    creditLimit: customer.creditLimit,

    // Preferences - ✅ FIX: Handle nested object properly
    preferences: customer.preferences
      ? {
          preferredMetal: customer.preferences.preferredMetal,
          communicationPreference: customer.preferences.communicationPreference,
        }
      : undefined,

    // Source & Referral
    source: customer.source,
    referredBy: customer.referredBy || '',

    // Additional Info
    notes: customer.notes || '',
    tags: customer.tags || [],
  }
}

//
// PAGE COMPONENT
//
export default function AddCustomerPage() {
  const { currentShopId } = useAuth()
  const navigate = useNavigate()
  const { customerId } = useParams()
  const { t } = useTranslation()
  const isEditMode = Boolean(customerId)

  // Get current shop from Redux
  const shopId = currentShopId || ''

  // Fetch customer data (only in edit mode)
  const { customer, isLoading, error } = useCustomerById(
    shopId,
    customerId || ''
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
      <div className="flex h-screen items-center justify-center p-4">
        <Alert className="max-w-md">
          <AlertTitle>{t('customer.errors.fetchFailed')}</AlertTitle>
          <AlertDescription className="mt-2">
            <p className="mb-4">
              {t('customer.errors.fetchFailedDescription')}
            </p>
            <Button
              variant="outline"
              onClick={() => navigate('/customers')}
              className="w-full"
            >
              {t('common.goBack')}
            </Button>
          </AlertDescription>
        </Alert>
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
