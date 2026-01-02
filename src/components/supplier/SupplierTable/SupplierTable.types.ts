// 
// FILE: src/components/features/SupplierTable/SupplierTable.types.ts
// Supplier Table TypeScript Types (Re-export from dummy data)
// 

// Re-export types from the types file you already have
export type {
  Supplier,
  ContactPerson,
  Address,
  BankDetails,
  Certification,
  Document,
  Statistics,
  SupplierType,
  SupplierCategory,
  PaymentTerms,
  CertificationType,
  DocumentType,
  AccountType,
  BalanceUpdateType,
  CreateSupplierDto,
  UpdateSupplierDto,
  SupplierFilters,
  PaginationMeta,
  SupplierListResponse,
  SingleSupplierResponse,
  SupplierStatsResponse,
  TopSuppliersResponse,
  UpdateRatingDto,
  BlacklistSupplierDto,
  UpdateBalanceDto,
  SupplierFormState,
  SupplierTableColumn,
} from '@/types/supplier.types'

// Import dummy data
export {
  dummySupplier,
  dummySuppliers,
  dummySupplierStats,
  dummyTopSuppliers,
  supplierTypeOptions,
  supplierCategoryOptions,
  paymentTermsOptions,
  emptySupplier,
} from '@/pages/suppliers/data'
