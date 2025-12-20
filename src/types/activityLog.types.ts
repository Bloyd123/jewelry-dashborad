// ============================================================================
// FILE: src/types/activityLog.types.ts
// Activity Log TypeScript Type Definitions
// ============================================================================

// ============================================================================
// USER INFO
// ============================================================================

export interface ActivityLogUser {
  name: string
  role:
    | 'super_admin'
    | 'org_admin'
    | 'shop_admin'
    | 'manager'
    | 'accountant'
    | 'staff'
    | 'system'
  avatar: string // Used as seed for Avatar component
}

// ============================================================================
// ACTIVITY ACTIONS
// ============================================================================

export type ActivityAction =
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'LOGIN'
  | 'LOGOUT'
  | 'EXPORT'
  | 'IMPORT'
  | 'APPROVE'
  | 'REJECT'

// ============================================================================
// ACTIVITY MODULES
// ============================================================================

export type ActivityModule =
  | 'Shop Settings'
  | 'Metal Rates'
  | 'Invoice'
  | 'Inventory'
  | 'Customer'
  | 'Product'
  | 'Payment'
  | 'Purchase Order'
  | 'User'
  | 'Expense'
  | 'Order'
  | 'Report'
  | 'Authentication'
  | 'System'

// ============================================================================
// ACTIVITY STATUS
// ============================================================================

export type ActivityStatus = 'success' | 'pending' | 'failed'

// ============================================================================
// METADATA TYPES (Based on Activity Module)
// ============================================================================

export interface MetalRatesMetadata {
  oldRate?: number
  newRate?: number
  metal: string
  source?: string
  ratesUpdated?: string[]
}

export interface InvoiceMetadata {
  invoiceNumber: string
  amount: number
  customerName: string
  paymentStatus?: string
  paidAmount?: number
  discountPercent?: number
  discountAmount?: number
}

export interface InventoryMetadata {
  sku: string
  productCode?: string
  oldStock?: number
  newStock?: number
  quantityAdded?: number
  oldWeight?: string
  newWeight?: string
  reason?: string
  batchNumber?: string
}

export interface PaymentMetadata {
  amount: number
  method: string
  transactionId?: string
  invoiceNumber?: string
}

export interface CustomerMetadata {
  customerId?: string
  customerName: string
  phone?: string
  city?: string
  updatedField?: string
  newPhone?: string
  reason?: string
}

export interface ProductMetadata {
  productCode: string
  productName: string
  imagesAdded?: number
  reason?: string
}

export interface UserMetadata {
  userName: string
  role: string
  email: string
}

export interface ExpenseMetadata {
  expenseType: string
  amount: number
  month: string
}

export interface OrderMetadata {
  orderNumber: string
  customerName: string
  expectedDelivery: string
}

export interface ReportMetadata {
  reportType: string
  month: string
  totalSales?: number
}

export interface ShopSettingsMetadata {
  setting: string
  oldValue?: any
  newValue?: any
  bankName?: string
  accountNumber?: string
}

export interface PurchaseOrderMetadata {
  poNumber: string
  quantity: string
  supplier: string
}

// Union type for all metadata
export type ActivityMetadata =
  | MetalRatesMetadata
  | InvoiceMetadata
  | InventoryMetadata
  | PaymentMetadata
  | CustomerMetadata
  | ProductMetadata
  | UserMetadata
  | ExpenseMetadata
  | OrderMetadata
  | ReportMetadata
  | ShopSettingsMetadata
  | PurchaseOrderMetadata
  | Record<string, any> // Fallback for custom metadata

// ============================================================================
// MAIN ACTIVITY LOG INTERFACE
// ============================================================================

export interface ActivityLog {
  id: string
  timestamp: string // ISO 8601 date string
  user: ActivityLogUser
  action: ActivityAction
  module: ActivityModule
  description: string
  status: ActivityStatus
  metadata: ActivityMetadata
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ActivityLogResponse {
  success: boolean
  data: ActivityLog[]
  pagination?: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
  }
}

export interface ActivityLogFilters {
  search?: string
  userId?: string
  userRole?: string
  action?: ActivityAction
  module?: ActivityModule
  status?: ActivityStatus
  dateFrom?: string
  dateTo?: string
  page?: number
  limit?: number
}

// ============================================================================
// ACTIVITY LOG STATISTICS
// ============================================================================

export interface ActivityLogStats {
  totalActivities: number
  activitiesByAction: Record<ActivityAction, number>
  activitiesByModule: Record<ActivityModule, number>
  activitiesByStatus: Record<ActivityStatus, number>
  activitiesByUser: Array<{
    userId: string
    userName: string
    count: number
  }>
  recentActivities: ActivityLog[]
}

// ============================================================================
// EXPORT ALL TYPES
// ============================================================================
