// FILE: src/components/supplier/SupplierForm/SupplierForm.types.ts
import type {
  SupplierType,
  SupplierCategory,
  PaymentTerms,
  AccountType,
} from '@/types/supplier.types'

export interface SupplierFormData {
  businessName: string
  displayName?: string
  supplierCode?: string

  contactPerson: {
    firstName: string
    lastName?: string
    designation?: string
    email?: string
    phone: string
    alternatePhone?: string
    whatsappNumber?: string
  }

  businessEmail?: string
  businessPhone?: string
  website?: string

  address?: {
    street?: string
    landmark?: string
    area?: string
    city?: string
    state?: string
    country?: string
    pincode?: string
  }

  gstNumber?: string
  panNumber?: string
  tanNumber?: string
  registrationNumber?: string

  supplierType: SupplierType
  supplierCategory: SupplierCategory

  productsSupplied?: string[]
  specialization?: string[]

  paymentTerms: PaymentTerms
  creditPeriod: number
  creditLimit: number

  bankDetails?: {
    bankName?: string
    accountNumber?: string
    ifscCode?: string
    accountHolderName?: string
    branchName?: string
    accountType?: AccountType
  }

  upiId?: string

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
