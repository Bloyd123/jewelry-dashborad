// ============================================================================
// FILE: src/components/supplier/SupplierForm/SupplierForm.types.ts
// TypeScript Types for SupplierForm
// ============================================================================

import type {
  SupplierType,
  SupplierCategory,
  PaymentTerms,
  AccountType,
} from '@/types/supplier.types'

export interface SupplierFormData {
  // Basic Information
  businessName: string
  displayName?: string
  supplierCode?: string

  // Contact Person
  contactPerson: {
    firstName: string
    lastName?: string
    designation?: string
    email?: string
    phone: string
    alternatePhone?: string
    whatsappNumber?: string
  }

  // Business Contact
  businessEmail?: string
  businessPhone?: string
  website?: string

  // Address
  address?: {
    street?: string
    landmark?: string
    area?: string
    city?: string
    state?: string
    country?: string
    pincode?: string
  }

  // Registration
  gstNumber?: string
  panNumber?: string
  tanNumber?: string
  registrationNumber?: string

  // Type & Category
  supplierType: SupplierType
  supplierCategory: SupplierCategory

  // Products
  productsSupplied?: string[]
  specialization?: string[]

  // Payment Terms
  paymentTerms: PaymentTerms
  creditPeriod: number
  creditLimit: number

  // Bank Details (Optional)
  bankDetails?: {
    bankName?: string
    accountNumber?: string
    ifscCode?: string
    accountHolderName?: string
    branchName?: string
    accountType?: AccountType
  }

  upiId?: string

  // Notes & Tags
  notes?: string
  internalNotes?: string
  tags?: string[]
}

export interface SupplierFormProps {
  initialData?: Partial<SupplierFormData>
  shopId?: string
  supplierId?: string
  onSuccess?: () => void
  onCancel: () => void
  mode?: 'create' | 'edit'
}

export interface SectionProps {
  data: Partial<SupplierFormData>
  errors: Record<string, string>
  onChange: (name: string, value: any) => void
  onBlur: (name: string) => void
  disabled: boolean
}