// FILE: userShopAccess.types.ts
// User Shop Access & Permissions Types

/**
 * Shop Role Types (for shop-level access)
 */
export type ShopRole =
  | 'shop_admin'
  | 'manager'
  | 'staff'
  | 'viewer'
  | 'accountant'

/**
 * Shop Access Permissions - Complete Permission Structure
 */
export interface ShopPermissions {
  // Index signature - allows dynamic string access
  [key: string]: boolean | undefined

  // Customer Management
  canCreateCustomer: boolean
  canSearchCustomer: boolean
  canViewCustomers: boolean
  canGetSingleCustomer: boolean
  canUpdateCustomer: boolean
  canDeleteCustomers: boolean
  canBlacklistCustomer: boolean
  canRemoveCustomerBlacklist: boolean
  canAddLoyaltyPoints: boolean
  canRedeemLoyaltyPoints: boolean
  canViewCustomerAnalytics: boolean
  canManageCustomers: boolean
  canViewCustomerHistory: boolean

  // Product Management
  canCreateProduct: boolean
  canViewProducts: boolean
  canSearchProducts: boolean
  canGetSingleProduct: boolean
  canUpdateProduct: boolean
  canDeleteProducts: boolean
  canUpdateStock: boolean
  canReserveProduct: boolean
  canCancelReservation: boolean
  canMarkAsSold: boolean
  canCalculatePrice: boolean
  canGetLowStock: boolean
  canViewProductHistory: boolean
  canViewProductAnalytics: boolean
  canBulkDeleteProducts: boolean
  canBulkUpdateStatus: boolean
  canManageProducts: boolean
  canManageInventory: boolean
  canViewInventory: boolean
  canEditInventory: boolean
  canImportProducts: boolean
  canExportProducts: boolean

  // Shop Management
  canCreateShop: boolean
  canViewShops: boolean
  canViewSingleShop: boolean
  canUpdateShop: boolean
  canDeleteShop: boolean
  canUpdateSettings: boolean
  canUpdateMetalRates: boolean
  canViewShopStatistics: boolean
  canManageShopSettings: boolean
  canManageMetalRates: boolean
  canTransferInventory: boolean

  // Supplier Management
  canCreateSupplier: boolean
  canViewSuppliers: boolean
  canGetSingleSupplier: boolean
  canUpdateSupplier: boolean
  canDeleteSuppliers: boolean
  canRestoreSupplier: boolean
  canUpdateSupplierRating: boolean
  canBlacklistSupplier: boolean
  canRemoveSupplierBlacklist: boolean
  canMarkPreferredSupplier: boolean
  canRemovePreferredSupplier: boolean
  canUpdateSupplierBalance: boolean
  canViewSupplierStatistics: boolean
  canViewTopSuppliers: boolean
  canManageSuppliers: boolean

  // Metal Rate Management
  canCreateUpdateRate: boolean
  canGetCurrentRate: boolean
  canGetRateHistory: boolean
  canGetRateByDate: boolean
  canCompareRates: boolean
  canGetTrendData: boolean
  canGetRateForPurity: boolean
  canGetAverageRate: boolean
  canSyncToAllShops: boolean
  canDeactivateRate: boolean
  canDeleteRate: boolean

  // Purchase Management
  canCreatePurchase: boolean
  canViewPurchases: boolean
  canGetSinglePurchase: boolean
  canUpdatePurchase: boolean
  canDeletePurchases: boolean
  canUpdatePurchaseStatus: boolean
  canMarkAsReceived: boolean
  canCancelPurchase: boolean
  canApprovePurchases: boolean
  canRejectPurchase: boolean
  canAddPurchasePayment: boolean
  canGetPurchasePayments: boolean
  canGetBySupplier: boolean
  canViewPurchaseAnalytics: boolean
  canViewPendingPurchases: boolean
  canViewUnpaidPurchases: boolean
  canBulkDeletePurchases: boolean
  canBulkApprovePurchases: boolean
  canUploadPurchaseDocuments: boolean
  canGetPurchaseDocuments: boolean
  canManagePurchases: boolean

  // Sale Management
  canCreateSale: boolean
  canViewSales: boolean
  canGetSingleSale: boolean
  canUpdateSale: boolean
  canDeleteSales: boolean
  canUpdateSaleStatus: boolean
  canConfirmSale: boolean
  canMarkAsDelivered: boolean
  canCompleteSale: boolean
  canCancelSale: boolean
  canAddSalePayment: boolean
  canGetSalePayments: boolean
  canGenerateInvoices: boolean
  canSendInvoice: boolean
  canPrintInvoice: boolean
  canProcessReturn: boolean
  canAddOldGold: boolean
  canRemoveOldGold: boolean
  canApplyDiscounts: boolean
  canRemoveDiscount: boolean
  canGetByCustomer: boolean
  canViewSalesPersonSales: boolean
  canViewSalesAnalytics: boolean
  canViewSalesDashboard: boolean
  canViewTodaysSales: boolean
  canViewPendingSales: boolean
  canViewUnpaidSales: boolean
  canViewOverdueSales: boolean
  canApproveSales: boolean
  canRejectSale: boolean
  canBulkDeleteSales: boolean
  canBulkPrintInvoices: boolean
  canSendReminders: boolean
  canManageSales: boolean
  canCancelInvoices: boolean
  canAccessPOS: boolean

  // Payment Management
  canCreatePayment: boolean
  canGetPaymentsList: boolean
  canGetSinglePayment: boolean
  canUpdatePayment: boolean
  canDeletePayment: boolean
  canUpdatePaymentStatus: boolean
  canCompletePayment: boolean
  canCancelPayment: boolean
  canViewPendingCheques: boolean
  canClearCheque: boolean
  canBounceCheque: boolean
  canViewBouncedCheques: boolean
  canViewClearedCheques: boolean
  canReconcilePayment: boolean
  canViewPendingReconciliation: boolean
  canViewReconciliationSummary: boolean
  canGenerateReceipt: boolean
  canSendReceipt: boolean
  canGetByParty: boolean
  canGetByReference: boolean
  canViewPaymentByMode: boolean
  canViewCashCollection: boolean
  canViewDigitalCollection: boolean
  canViewPaymentAnalytics: boolean
  canViewPaymentDashboard: boolean
  canViewTodaysPayments: boolean
  canViewPendingPayments: boolean
  canViewFailedPayments: boolean
  canApprovePayment: boolean
  canRejectPayment: boolean
  canProcessRefund: boolean
  canGetRefunds: boolean
  canBulkReconcile: boolean
  canBulkExportPayments: boolean
  canBulkPrintReceipts: boolean
  canViewPayments: boolean
  canReceivePayments: boolean
  canMakePayments: boolean

  // Order Management
  canCreateOrder: boolean
  canViewOrders: boolean
  canGetSingleOrder: boolean
  canUpdateOrder: boolean
  canCancelOrders: boolean
  canUpdateOrderStatus: boolean
  canConfirmOrder: boolean
  canStartOrder: boolean
  canHoldOrder: boolean
  canResumeOrder: boolean
  canMarkAsReady: boolean
  canMarkOrderAsDelivered: boolean
  canCompleteOrder: boolean
  canAssignOrder: boolean
  canReassignOrder: boolean
  canGetAssignedOrders: boolean
  canAddProgressUpdate: boolean
  canGetProgress: boolean
  canQualityCheck: boolean
  canGetQualityCheck: boolean
  canAddOrderPayment: boolean
  canGetOrderPayments: boolean
  canGenerateBill: boolean
  canAddFeedback: boolean
  canGetFeedback: boolean
  canViewOverdueOrders: boolean
  canViewDueSoonOrders: boolean
  canViewPendingOrders: boolean
  canViewCompletedOrders: boolean
  canViewOrdersByType: boolean
  canViewOrdersByPriority: boolean
  canViewOrderAnalytics: boolean
  canViewOrderDashboard: boolean
  canViewCustomerOrders: boolean
  canApproveOrder: boolean
  canRejectOrder: boolean
  canUploadDocuments: boolean
  canGetDocuments: boolean
  canDeleteDocument: boolean
  canSendReminder: boolean
  canBulkStatusUpdate: boolean
  canBulkAssign: boolean
  canBulkExportOrders: boolean
  canManageOrders: boolean
  canManageRepairs: boolean
  canManageCustomOrders: boolean

  // Parties & Billing
  canManageParties: boolean
  canViewPartyLedger: boolean
  canManageBilling: boolean
  canViewBilling: boolean

  // Financial
  canViewFinancials: boolean
  canViewProfitLoss: boolean
  canApproveTransactions: boolean

  // Expenses
  canManageExpenses: boolean

  // Schemes
  canManageSchemes: boolean
  canViewSchemes: boolean
  canCreateSchemes: boolean
  canEditSchemes: boolean
  canDeleteSchemes: boolean

  // Reports & Analytics
  canManageReports: boolean
  canViewReports: boolean
  canGenerateReports: boolean
  canExportReports: boolean
  canViewAnalytics: boolean
  canViewDashboard: boolean

  // Users
  canManageUsers: boolean
  canViewUsers: boolean
  canCreateUsers: boolean
  canEditUsers: boolean
  canDeleteUsers: boolean
  canAssignRoles: boolean

  // Settings
  canManageTaxSettings: boolean

  // Advanced Features
  canManageHallmarking: boolean
  canManageOldGold: boolean

  // System
  canManageSettings: boolean
  canExportData: boolean
  canDeleteRecords: boolean
  canViewAuditLog: boolean
  canBackupData: boolean
  canRestoreData: boolean
}

/**
 * Permission Key Type (for type-safe permission checking)
 */
export type PermissionKey = keyof ShopPermissions

/**
 * Permission Category for UI grouping
 */
export type PermissionCategory =
  | 'inventory'
  | 'purchase'
  | 'sales'
  | 'orders'
  | 'customers'
  | 'suppliers'
  | 'parties'
  | 'financial'
  | 'schemes'
  | 'reports'
  | 'users'
  | 'shop_settings'
  | 'shop_management'
  | 'advanced'
  | 'system'
  | 'composite'

/**
 * Permission Group (for organized display)
 */
export interface PermissionGroup {
  category: PermissionCategory
  label: string
  description: string
  permissions: Array<{
    key: PermissionKey
    label: string
    description: string
  }>
}

/**
 * User Shop Access - Complete Model
 */
export interface UserShopAccess {
  _id: string

  // References
  userId: string
  shopId: string
  organizationId: string

  // Role within the shop
  role: ShopRole

  // Permissions
  permissions: ShopPermissions

  // Access Status
  isActive: boolean

  // Access Period (Optional - for temporary access)
  accessStartDate: Date | string
  accessEndDate?: Date | string | null

  // Assignment Details
  assignedBy?: string | null
  assignedAt: Date | string

  // Last Access Tracking
  lastAccessedAt?: Date | string | null
  lastAccessIP?: string | null

  // Revocation Details
  revokedAt?: Date | string | null
  revokedBy?: string | null
  revocationReason?: string

  // Additional Settings
  canAccessOutsideBusinessHours: boolean
  allowedIPAddresses: string[]

  // Notes
  notes?: string

  // Audit Trail
  updatedBy?: string | null

  // Timestamps
  createdAt: Date | string
  updatedAt: Date | string
  deletedAt?: Date | string | null

  // Virtuals (computed fields)
  isExpired?: boolean
  isValid?: boolean
}

/**
 * User Shop Access with Populated Relations
 */
export interface UserShopAccessWithRelations extends UserShopAccess {
  user?: any // User type
  shop?: any // Shop type
  organization?: any // Organization type
  assignedByUser?: any // User type
  revokedByUser?: any // User type
}

/**
 * Create Shop Access Request
 */
export interface CreateShopAccessRequest {
  userId: string
  shopId: string
  role: ShopRole
  permissions?: Partial<ShopPermissions>
  accessEndDate?: Date | string
  canAccessOutsideBusinessHours?: boolean
  allowedIPAddresses?: string[]
  notes?: string
}

/**
 * Update Shop Access Request
 */
export interface UpdateShopAccessRequest {
  role?: ShopRole
  permissions?: Partial<ShopPermissions>
  isActive?: boolean
  accessEndDate?: Date | string
  canAccessOutsideBusinessHours?: boolean
  allowedIPAddresses?: string[]
  notes?: string
}

/**
 * Grant Access Request
 */
export interface GrantAccessRequest {
  userId: string
  shopId: string
  role: ShopRole
  permissions?: Partial<ShopPermissions>
  accessEndDate?: Date | string
  notes?: string
}

/**
 * Update Permissions Request
 */
export interface UpdatePermissionsRequest {
  permissions: Partial<ShopPermissions>
}

/**
 * Update Role Request
 */
export interface UpdateRoleRequest {
  role: ShopRole
}

/**
 * Revoke Access Request
 */
export interface RevokeAccessRequest {
  reason?: string
}

/**
 * Restore Access Request
 */
export interface RestoreAccessRequest {
  reason?: string
}

/**
 * Extend Access Request
 */
export interface ExtendAccessRequest {
  days: number
}

/**
 * Update Last Access Request
 */
export interface UpdateLastAccessRequest {
  ipAddress?: string
}

/**
 * Shop Access Query Parameters
 */
export interface ShopAccessQueryParams {
  page?: number
  limit?: number
  sort?: string
  order?: 'asc' | 'desc'
  userId?: string
  shopId?: string
  organizationId?: string
  role?: ShopRole
  isActive?: boolean
  isExpired?: boolean
  includeDeleted?: boolean
  includeRevoked?: boolean
}

/**
 * Permission Summary
 */
export interface PermissionSummary {
  granted: PermissionKey[]
  denied: PermissionKey[]
  total: number
  grantedCount: number
  deniedCount: number
}

/**
 * Shop Access Statistics
 */
export interface ShopAccessStatistics {
  totalAccesses: number
  activeAccesses: number
  expiredAccesses: number
  revokedAccesses: number
  byRole: Record<ShopRole, number>
  byShop: Record<string, number>
}

/**
 * User Access Summary (for a specific user)
 */
export interface UserAccessSummary {
  userId: string
  totalShops: number
  activeShops: number
  roles: ShopRole[]
  primaryShop?: string
  lastAccessed?: Date | string
}

/**
 * Shop Users Summary (for a specific shop)
 */
export interface ShopUsersSummary {
  shopId: string
  totalUsers: number
  activeUsers: number
  byRole: Record<ShopRole, number>
  recentAccesses: number
}

/**
 * Shop Access List Item (for tables/lists)
 */
export interface ShopAccessListItem {
  _id: string
  userName: string
  userEmail: string
  shopName: string
  role: ShopRole
  isActive: boolean
  isExpired: boolean
  lastAccessedAt?: Date | string
  assignedAt: Date | string
}

/**
 * Permission Check Result
 */
export interface PermissionCheckResult {
  hasPermission: boolean
  permission: PermissionKey
  reason?: string
}

/**
 * Bulk Permission Update Request
 */
export interface BulkPermissionUpdateRequest {
  accessIds: string[]
  permissions: Partial<ShopPermissions>
}

/**
 * Bulk Role Update Request
 */
export interface BulkRoleUpdateRequest {
  accessIds: string[]
  role: ShopRole
}

/**
 * Bulk Access Operation Request
 */
export interface BulkAccessOperationRequest {
  accessIds: string[]
  action: 'activate' | 'deactivate' | 'revoke' | 'delete'
  reason?: string
}

/**
 * Bulk Access Operation Result
 */
export interface BulkAccessOperationResult {
  total: number
  successful: number
  failed: number
  results: Array<{
    accessId: string
    success: boolean
    error?: string
  }>
}

/**
 * Access History Entry
 */
export interface AccessHistoryEntry {
  timestamp: Date | string
  action: 'granted' | 'revoked' | 'updated' | 'accessed' | 'expired'
  performedBy?: string
  ipAddress?: string
  details?: string
}

/**
 * Shop Access Form State
 */
export interface ShopAccessFormState {
  userId: string
  shopId: string
  role: ShopRole
  accessEndDate: string
  canAccessOutsideBusinessHours: boolean
  allowedIPAddresses: string[]
  notes: string
  selectedPermissions: PermissionKey[]
}

/**
 * Permission Matrix (for UI display)
 */
export interface PermissionMatrix {
  roles: ShopRole[]
  permissions: Array<{
    key: PermissionKey
    label: string
    category: PermissionCategory
    enabledForRoles: ShopRole[]
  }>
}

/**
 * Access Audit Log Entry
 */
export interface AccessAuditLog {
  _id: string
  accessId: string
  action: string
  changes?: {
    field: string
    oldValue: any
    newValue: any
  }[]
  performedBy: string
  timestamp: Date | string
  ipAddress?: string
}

/**
 * IP Address Validation Result
 */
export interface IPAddressValidationResult {
  isValid: boolean
  ipAddress: string
  message?: string
}

/**
 * Access Expiry Warning
 */
export interface AccessExpiryWarning {
  accessId: string
  userId: string
  shopId: string
  expiresAt: Date | string
  daysRemaining: number
}

/**
 * Default Permissions by Role (for reference)
 */
export type DefaultPermissionsMap = Record<ShopRole, Partial<ShopPermissions>>
