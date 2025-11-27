// ============================================================================
// FILE: userShopAccess.types.ts
// User Shop Access & Permissions Types
// ============================================================================

/**
 * Shop Role Types (for shop-level access)
 */
export type ShopRole = 
  | 'shop_admin' 
  | 'manager' 
  | 'staff' 
  | 'viewer' 
  | 'accountant';

/**
 * Shop Access Permissions - Complete Permission Structure
 */
export interface ShopPermissions {
  // ===== Inventory & Product Management (6) =====
  canViewInventory: boolean;
  canEditInventory: boolean;
  canManageProducts: boolean;
  canDeleteProducts: boolean;
  canImportProducts: boolean;
  canExportProducts: boolean;
  
  // ===== Purchase Management (5) =====
  canViewPurchases: boolean;
  canCreatePurchases: boolean;
  canEditPurchases: boolean;
  canDeletePurchases: boolean;
  canApprovePurchases: boolean;
  
  // ===== Sales Management (8) =====
  canViewSales: boolean;
  canCreateSales: boolean;
  canEditSales: boolean;
  canDeleteSales: boolean;
  canApproveSales: boolean;
  canGenerateInvoices: boolean;
  canCancelInvoices: boolean;
  canApplyDiscounts: boolean;
  
  // ===== Order Management (5) =====
  canManageOrders: boolean;
  canViewOrders: boolean;
  canCreateOrders: boolean;
  canEditOrders: boolean;
  canCancelOrders: boolean;
  
  // ===== Customer Management (11) =====
  canManageCustomers: boolean;
  canViewCustomers: boolean;
  canCreateCustomers: boolean;
  canEditCustomers: boolean;
  canDeleteCustomers: boolean;
  canViewCustomerHistory: boolean;
  canBlacklistCustomer: boolean;
  canRemoveCustomerBlacklist: boolean;
  canAddLoyaltyPoints: boolean;
  canRedeemLoyaltyPoints: boolean;
  canViewCustomerAnalytics: boolean;
  
  // ===== Supplier Management (14) =====
  canManageSuppliers: boolean;
  canViewSuppliers: boolean;
  canCreateSuppliers: boolean;
  canEditSuppliers: boolean;
  canDeleteSuppliers: boolean;
  canRestoreSupplier: boolean;
  canUpdateSupplierRating: boolean;
  canBlacklistSupplier: boolean;
  canRemoveSupplierBlacklist: boolean;
  canMarkPreferredSupplier: boolean;
  canRemovePreferredSupplier: boolean;
  canUpdateSupplierBalance: boolean;
  canViewSupplierStatistics: boolean;
  canViewTopSuppliers: boolean;
  
  // ===== Party Management (2) =====
  canManageParties: boolean;
  canViewPartyLedger: boolean;
  
  // ===== Financial & Billing (7) =====
  canViewBilling: boolean;
  canViewFinancials: boolean;
  canApproveTransactions: boolean;
  canViewPayments: boolean;
  canReceivePayments: boolean;
  canMakePayments: boolean;
  canViewProfitLoss: boolean;
  
  // ===== Schemes & Offers (5) =====
  canManageSchemes: boolean;
  canViewSchemes: boolean;
  canCreateSchemes: boolean;
  canEditSchemes: boolean;
  canDeleteSchemes: boolean;
  
  // ===== Reports & Analytics (5) =====
  canViewReports: boolean;
  canGenerateReports: boolean;
  canExportReports: boolean;
  canViewAnalytics: boolean;
  canViewDashboard: boolean;
  
  // ===== User Management (6) =====
  canManageUsers: boolean;
  canViewUsers: boolean;
  canCreateUsers: boolean;
  canEditUsers: boolean;
  canDeleteUsers: boolean;
  canAssignRoles: boolean;
  
  // ===== Shop Settings (3) =====
  canManageShopSettings: boolean;
  canUpdateMetalRates: boolean;
  canManageTaxSettings: boolean;
  
  // ===== Shop Management (7) =====
  canCreateShop: boolean;
  canViewShops: boolean;
  canViewSingleShop: boolean;
  canUpdateShop: boolean;
  canDeleteShop: boolean;
  canViewShopStatistics: boolean;
  canTransferInventory: boolean;
  
  // ===== Advanced Features (4) =====
  canManageRepairs: boolean;
  canManageCustomOrders: boolean;
  canManageHallmarking: boolean;
  canManageOldGold: boolean;
  
  // ===== System (3) =====
  canViewAuditLog: boolean;
  canBackupData: boolean;
  canRestoreData: boolean;
  
  // ===== Composite/High-Level Permissions (10) =====
  canManageInventory: boolean;
  canManageSales: boolean;
  canManagePurchases: boolean;
  canManageExpenses: boolean;
  canManageReports: boolean;
  canManageSettings: boolean;
  canExportData: boolean;
  canDeleteRecords: boolean;
  canManageMetalRates: boolean;
  canAccessPOS: boolean;
  canManageBilling: boolean;
}

/**
 * Permission Key Type (for type-safe permission checking)
 */
export type PermissionKey = keyof ShopPermissions;

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
  | 'composite';

/**
 * Permission Group (for organized display)
 */
export interface PermissionGroup {
  category: PermissionCategory;
  label: string;
  description: string;
  permissions: Array<{
    key: PermissionKey;
    label: string;
    description: string;
  }>;
}

/**
 * User Shop Access - Complete Model
 */
export interface UserShopAccess {
  _id: string;
  
  // References
  userId: string;
  shopId: string;
  organizationId: string;
  
  // Role within the shop
  role: ShopRole;
  
  // Permissions
  permissions: ShopPermissions;
  
  // Access Status
  isActive: boolean;
  
  // Access Period (Optional - for temporary access)
  accessStartDate: Date | string;
  accessEndDate?: Date | string | null;
  
  // Assignment Details
  assignedBy?: string | null;
  assignedAt: Date | string;
  
  // Last Access Tracking
  lastAccessedAt?: Date | string | null;
  lastAccessIP?: string | null;
  
  // Revocation Details
  revokedAt?: Date | string | null;
  revokedBy?: string | null;
  revocationReason?: string;
  
  // Additional Settings
  canAccessOutsideBusinessHours: boolean;
  allowedIPAddresses: string[];
  
  // Notes
  notes?: string;
  
  // Audit Trail
  updatedBy?: string | null;
  
  // Timestamps
  createdAt: Date | string;
  updatedAt: Date | string;
  deletedAt?: Date | string | null;
  
  // Virtuals (computed fields)
  isExpired?: boolean;
  isValid?: boolean;
}

/**
 * User Shop Access with Populated Relations
 */
export interface UserShopAccessWithRelations extends UserShopAccess {
  user?: any; // User type
  shop?: any; // Shop type
  organization?: any; // Organization type
  assignedByUser?: any; // User type
  revokedByUser?: any; // User type
}

/**
 * Create Shop Access Request
 */
export interface CreateShopAccessRequest {
  userId: string;
  shopId: string;
  role: ShopRole;
  permissions?: Partial<ShopPermissions>;
  accessEndDate?: Date | string;
  canAccessOutsideBusinessHours?: boolean;
  allowedIPAddresses?: string[];
  notes?: string;
}

/**
 * Update Shop Access Request
 */
export interface UpdateShopAccessRequest {
  role?: ShopRole;
  permissions?: Partial<ShopPermissions>;
  isActive?: boolean;
  accessEndDate?: Date | string;
  canAccessOutsideBusinessHours?: boolean;
  allowedIPAddresses?: string[];
  notes?: string;
}

/**
 * Grant Access Request
 */
export interface GrantAccessRequest {
  userId: string;
  shopId: string;
  role: ShopRole;
  permissions?: Partial<ShopPermissions>;
  accessEndDate?: Date | string;
  notes?: string;
}

/**
 * Update Permissions Request
 */
export interface UpdatePermissionsRequest {
  permissions: Partial<ShopPermissions>;
}

/**
 * Update Role Request
 */
export interface UpdateRoleRequest {
  role: ShopRole;
}

/**
 * Revoke Access Request
 */
export interface RevokeAccessRequest {
  reason?: string;
}

/**
 * Restore Access Request
 */
export interface RestoreAccessRequest {
  reason?: string;
}

/**
 * Extend Access Request
 */
export interface ExtendAccessRequest {
  days: number;
}

/**
 * Update Last Access Request
 */
export interface UpdateLastAccessRequest {
  ipAddress?: string;
}

/**
 * Shop Access Query Parameters
 */
export interface ShopAccessQueryParams {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  userId?: string;
  shopId?: string;
  organizationId?: string;
  role?: ShopRole;
  isActive?: boolean;
  isExpired?: boolean;
  includeDeleted?: boolean;
  includeRevoked?: boolean;
}

/**
 * Permission Summary
 */
export interface PermissionSummary {
  granted: PermissionKey[];
  denied: PermissionKey[];
  total: number;
  grantedCount: number;
  deniedCount: number;
}

/**
 * Shop Access Statistics
 */
export interface ShopAccessStatistics {
  totalAccesses: number;
  activeAccesses: number;
  expiredAccesses: number;
  revokedAccesses: number;
  byRole: Record<ShopRole, number>;
  byShop: Record<string, number>;
}

/**
 * User Access Summary (for a specific user)
 */
export interface UserAccessSummary {
  userId: string;
  totalShops: number;
  activeShops: number;
  roles: ShopRole[];
  primaryShop?: string;
  lastAccessed?: Date | string;
}

/**
 * Shop Users Summary (for a specific shop)
 */
export interface ShopUsersSummary {
  shopId: string;
  totalUsers: number;
  activeUsers: number;
  byRole: Record<ShopRole, number>;
  recentAccesses: number;
}

/**
 * Shop Access List Item (for tables/lists)
 */
export interface ShopAccessListItem {
  _id: string;
  userName: string;
  userEmail: string;
  shopName: string;
  role: ShopRole;
  isActive: boolean;
  isExpired: boolean;
  lastAccessedAt?: Date | string;
  assignedAt: Date | string;
}

/**
 * Permission Check Result
 */
export interface PermissionCheckResult {
  hasPermission: boolean;
  permission: PermissionKey;
  reason?: string;
}

/**
 * Bulk Permission Update Request
 */
export interface BulkPermissionUpdateRequest {
  accessIds: string[];
  permissions: Partial<ShopPermissions>;
}

/**
 * Bulk Role Update Request
 */
export interface BulkRoleUpdateRequest {
  accessIds: string[];
  role: ShopRole;
}

/**
 * Bulk Access Operation Request
 */
export interface BulkAccessOperationRequest {
  accessIds: string[];
  action: 'activate' | 'deactivate' | 'revoke' | 'delete';
  reason?: string;
}

/**
 * Bulk Access Operation Result
 */
export interface BulkAccessOperationResult {
  total: number;
  successful: number;
  failed: number;
  results: Array<{
    accessId: string;
    success: boolean;
    error?: string;
  }>;
}

/**
 * Access History Entry
 */
export interface AccessHistoryEntry {
  timestamp: Date | string;
  action: 'granted' | 'revoked' | 'updated' | 'accessed' | 'expired';
  performedBy?: string;
  ipAddress?: string;
  details?: string;
}

/**
 * Shop Access Form State
 */
export interface ShopAccessFormState {
  userId: string;
  shopId: string;
  role: ShopRole;
  accessEndDate: string;
  canAccessOutsideBusinessHours: boolean;
  allowedIPAddresses: string[];
  notes: string;
  selectedPermissions: PermissionKey[];
}

/**
 * Permission Matrix (for UI display)
 */
export interface PermissionMatrix {
  roles: ShopRole[];
  permissions: Array<{
    key: PermissionKey;
    label: string;
    category: PermissionCategory;
    enabledForRoles: ShopRole[];
  }>;
}

/**
 * Access Audit Log Entry
 */
export interface AccessAuditLog {
  _id: string;
  accessId: string;
  action: string;
  changes?: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
  performedBy: string;
  timestamp: Date | string;
  ipAddress?: string;
}

/**
 * IP Address Validation Result
 */
export interface IPAddressValidationResult {
  isValid: boolean;
  ipAddress: string;
  message?: string;
}

/**
 * Access Expiry Warning
 */
export interface AccessExpiryWarning {
  accessId: string;
  userId: string;
  shopId: string;
  expiresAt: Date | string;
  daysRemaining: number;
}

/**
 * Default Permissions by Role (for reference)
 */
export type DefaultPermissionsMap = Record<ShopRole, Partial<ShopPermissions>>;