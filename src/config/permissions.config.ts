// ============================================================================
// FILE: src/config/permissions.config.ts
// Centralized Role-Based Permissions Configuration
// ============================================================================

/**
 * 🎯 ROLE-BASED PERMISSIONS MATRIX
 * 
 * Roles Hierarchy:
 * 1. shop_admin    - Shop owner (full access within shop)
 * 2. manager       - Shop manager (most permissions except critical operations)
 * 3. staff         - Sales staff (POS, customer creation, view-only mostly)
 * 4. accountant    - Finance team (billing, reports, no inventory management)
 * 5. viewer        - Read-only access
 */

// ============================================================================
// TYPES
// ============================================================================

export type UserRole = 'shop_admin' | 'manager' | 'staff' | 'accountant' | 'viewer'
import type {PermissionSet} from "@/types"




// ============================================================================
// PERMISSIONS CONFIGURATION
// ============================================================================

export const PERMISSIONS: Record<UserRole, PermissionSet> = {
  // ==========================================================================
  // SHOP ADMIN - Full Shop Access
  // ==========================================================================
  shop_admin: {
    // Inventory & Products
    canManageInventory: true,
    canViewInventory: true,
    canEditInventory: true,
    canManageProducts: true,
    canDeleteProducts: true,
    canImportProducts: true,
    canExportProducts: true,

    // Purchases
    canManagePurchases: true,
    canViewPurchases: true,
    canCreatePurchases: true,
    canEditPurchases: true,
    canDeletePurchases: true,
    canApprovePurchases: true,

    // Sales
    canManageSales: true,
    canViewSales: true,
    canCreateSales: true,
    canEditSales: true,
    canDeleteSales: true,
    canApproveSales: true,
    canGenerateInvoices: true,
    canCancelInvoices: true,
    canApplyDiscounts: true,

    // Orders
    canManageOrders: true,
    canViewOrders: true,
    canCreateOrders: true,
    canEditOrders: true,
    canCancelOrders: true,

    // Customers
    canManageCustomers: true,
    canViewCustomers: true,
    canCreateCustomers: true,
    canEditCustomers: true,
    canDeleteCustomers: true,
    canViewCustomerHistory: true,
    canBlacklistCustomer: true,
    canRemoveCustomerBlacklist: true,
    canAddLoyaltyPoints: true,
    canRedeemLoyaltyPoints: true,
    canViewCustomerAnalytics: true,

    // Suppliers
    canManageSuppliers: true,
    canViewSuppliers: true,
    canCreateSuppliers: true,
    canEditSuppliers: true,
    canDeleteSuppliers: true,
    canRestoreSupplier: true,
    canUpdateSupplierRating: true,
    canBlacklistSupplier: true,
    canRemoveSupplierBlacklist: true,
    canMarkPreferredSupplier: true,
    canRemovePreferredSupplier: true,
    canUpdateSupplierBalance: true,
    canViewSupplierStatistics: true,
    canViewTopSuppliers: true,

    // Parties & Billing
    canManageParties: true,
    canViewPartyLedger: true,
    canManageBilling: true,
    canViewBilling: true,

    // Financial
    canViewFinancials: true,
    canViewPayments: true,
    canReceivePayments: true,
    canMakePayments: true,
    canViewProfitLoss: true,
    canApproveTransactions: true,

    // Expenses
    canManageExpenses: true,

    // Schemes
    canManageSchemes: true,
    canViewSchemes: true,
    canCreateSchemes: true,
    canEditSchemes: true,
    canDeleteSchemes: true,

    // Reports & Analytics
    canManageReports: true,
    canViewReports: true,
    canGenerateReports: true,
    canExportReports: true,
    canViewAnalytics: true,
    canViewDashboard: true,

    // POS
    canAccessPOS: true,

    // Users
    canManageUsers: true,
    canViewUsers: true,
    canCreateUsers: true,
    canEditUsers: true,
    canDeleteUsers: true,
    canAssignRoles: true,

    // Shop Settings
    canManageShopSettings: true,
    canManageMetalRates: true,
    canUpdateMetalRates: true,
    canManageTaxSettings: false,
    canCreateShop: true,
    canViewShops: true,
    canViewSingleShop: true,
    canUpdateShop: true,
    canDeleteShop: true,
    canViewShopStatistics: true,
    canTransferInventory: true,

    // Advanced Features
    canManageRepairs: true,
    canManageCustomOrders: true,
    canManageHallmarking: true,
    canManageOldGold: true,

    // System
    canManageSettings: true,
    canExportData: true,
    canDeleteRecords: true,
    canViewAuditLog: true,
    canBackupData: true,
    canRestoreData: true,
  },

  // ==========================================================================
  // MANAGER - High-level operations (no delete/critical permissions)
  // ==========================================================================
  manager: {
    // Inventory & Products
    canManageInventory: true,
    canViewInventory: true,
    canEditInventory: true,
    canManageProducts: true,
    canDeleteProducts: false,
    canImportProducts: true,
    canExportProducts: true,

    // Purchases
    canManagePurchases: true,
    canViewPurchases: true,
    canCreatePurchases: true,
    canEditPurchases: true,
    canDeletePurchases: false,
    canApprovePurchases: true,

    // Sales
    canManageSales: true,
    canViewSales: true,
    canCreateSales: true,
    canEditSales: true,
    canDeleteSales: false,
    canApproveSales: true,
    canGenerateInvoices: true,
    canCancelInvoices: false,
    canApplyDiscounts: true,

    // Orders
    canManageOrders: true,
    canViewOrders: true,
    canCreateOrders: true,
    canEditOrders: true,
    canCancelOrders: true,

    // Customers
    canManageCustomers: true,
    canViewCustomers: true,
    canCreateCustomers: true,
    canEditCustomers: true,
    canDeleteCustomers: false,
    canViewCustomerHistory: true,
    canBlacklistCustomer: true,
    canRemoveCustomerBlacklist: false,
    canAddLoyaltyPoints: true,
    canRedeemLoyaltyPoints: true,
    canViewCustomerAnalytics: true,

    // Suppliers
    canManageSuppliers: true,
    canViewSuppliers: true,
    canCreateSuppliers: true,
    canEditSuppliers: true,
    canDeleteSuppliers: false,
    canRestoreSupplier: true,
    canUpdateSupplierRating: true,
    canBlacklistSupplier: false,
    canRemoveSupplierBlacklist: false,
    canMarkPreferredSupplier: true,
    canRemovePreferredSupplier: true,
    canUpdateSupplierBalance: true,
    canViewSupplierStatistics: true,
    canViewTopSuppliers: true,

    // Parties & Billing
    canManageParties: true,
    canViewPartyLedger: true,
    canManageBilling: true,
    canViewBilling: true,

    // Financial
    canViewFinancials: true,
    canViewPayments: true,
    canReceivePayments: true,
    canMakePayments: true,
    canViewProfitLoss: false,
    canApproveTransactions: true,

    // Expenses
    canManageExpenses: true,

    // Schemes
    canManageSchemes: true,
    canViewSchemes: true,
    canCreateSchemes: true,
    canEditSchemes: true,
    canDeleteSchemes: false,

    // Reports & Analytics
    canManageReports: true,
    canViewReports: true,
    canGenerateReports: true,
    canExportReports: true,
    canViewAnalytics: true,
    canViewDashboard: true,

    // POS
    canAccessPOS: true,

    // Users
    canManageUsers: false,
    canViewUsers: true,
    canCreateUsers: false,
    canEditUsers: false,
    canDeleteUsers: false,
    canAssignRoles: false,

    // Shop Settings
    canManageShopSettings: false,
    canManageMetalRates: true,
    canUpdateMetalRates: true,
    canManageTaxSettings: false,
    canCreateShop: false,
    canViewShops: true,
    canViewSingleShop: true,
    canUpdateShop: false,
    canDeleteShop: false,
    canViewShopStatistics: true,
    canTransferInventory: true,

    // Advanced Features
    canManageRepairs: true,
    canManageCustomOrders: true,
    canManageHallmarking: true,
    canManageOldGold: true,

    // System
    canManageSettings: false,
    canExportData: true,
    canDeleteRecords: false,
    canViewAuditLog: false,
    canBackupData: false,
    canRestoreData: false,
  },

  // ==========================================================================
  // STAFF - POS & Customer Operations
  // ==========================================================================
  staff: {
    // Inventory & Products
    canManageInventory: false,
    canViewInventory: true,
    canEditInventory: false,
    canManageProducts: false,
    canDeleteProducts: false,
    canImportProducts: false,
    canExportProducts: false,

    // Purchases
    canManagePurchases: false,
    canViewPurchases: true,
    canCreatePurchases: false,
    canEditPurchases: false,
    canDeletePurchases: false,
    canApprovePurchases: false,

    // Sales
    canManageSales: true,
    canViewSales: true,
    canCreateSales: true,
    canEditSales: false,
    canDeleteSales: false,
    canApproveSales: false,
    canGenerateInvoices: true,
    canCancelInvoices: false,
    canApplyDiscounts: false,

    // Orders
    canManageOrders: false,
    canViewOrders: true,
    canCreateOrders: false,
    canEditOrders: false,
    canCancelOrders: false,

    // Customers
    canManageCustomers: false,
    canViewCustomers: true,
    canCreateCustomers: true,
    canEditCustomers: false,
    canDeleteCustomers: false,
    canViewCustomerHistory: true,
    canBlacklistCustomer: false,
    canRemoveCustomerBlacklist: false,
    canAddLoyaltyPoints: false,
    canRedeemLoyaltyPoints: true,
    canViewCustomerAnalytics: false,

    // Suppliers
    canManageSuppliers: false,
    canViewSuppliers: true,
    canCreateSuppliers: false,
    canEditSuppliers: false,
    canDeleteSuppliers: false,
    canRestoreSupplier: false,
    canUpdateSupplierRating: false,
    canBlacklistSupplier: false,
    canRemoveSupplierBlacklist: false,
    canMarkPreferredSupplier: false,
    canRemovePreferredSupplier: false,
    canUpdateSupplierBalance: false,
    canViewSupplierStatistics: false,
    canViewTopSuppliers: false,

    // Parties & Billing
    canManageParties: false,
    canViewPartyLedger: false,
    canManageBilling: false,
    canViewBilling: true,

    // Financial
    canViewFinancials: false,
    canViewPayments: true,
    canReceivePayments: true,
    canMakePayments: false,
    canViewProfitLoss: false,
    canApproveTransactions: false,

    // Expenses
    canManageExpenses: false,

    // Schemes
    canManageSchemes: false,
    canViewSchemes: true,
    canCreateSchemes: false,
    canEditSchemes: false,
    canDeleteSchemes: false,

    // Reports & Analytics
    canManageReports: false,
    canViewReports: false,
    canGenerateReports: false,
    canExportReports: false,
    canViewAnalytics: false,
    canViewDashboard: true,

    // POS
    canAccessPOS: true,

    // Users
    canManageUsers: false,
    canViewUsers: false,
    canCreateUsers: false,
    canEditUsers: false,
    canDeleteUsers: false,
    canAssignRoles: false,

    // Shop Settings
    canManageShopSettings: false,
    canManageMetalRates: false,
    canUpdateMetalRates: false,
    canManageTaxSettings: false,
    canCreateShop: false,
    canViewShops: true,
    canViewSingleShop: true,
    canUpdateShop: false,
    canDeleteShop: false,
    canViewShopStatistics: false,
    canTransferInventory: false,

    // Advanced Features
    canManageRepairs: false,
    canManageCustomOrders: false,
    canManageHallmarking: false,
    canManageOldGold: false,

    // System
    canManageSettings: false,
    canExportData: false,
    canDeleteRecords: false,
    canViewAuditLog: false,
    canBackupData: false,
    canRestoreData: false,
  },

  // ==========================================================================
  // ACCOUNTANT - Financial Focus
  // ==========================================================================
  accountant: {
    // Inventory & Products
    canManageInventory: false,
    canViewInventory: true,
    canEditInventory: false,
    canManageProducts: false,
    canDeleteProducts: false,
    canImportProducts: false,
    canExportProducts: true,

    // Purchases
    canManagePurchases: true,
    canViewPurchases: true,
    canCreatePurchases: false,
    canEditPurchases: false,
    canDeletePurchases: false,
    canApprovePurchases: false,

    // Sales
    canManageSales: true,
    canViewSales: true,
    canCreateSales: false,
    canEditSales: false,
    canDeleteSales: false,
    canApproveSales: false,
    canGenerateInvoices: true,
    canCancelInvoices: false,
    canApplyDiscounts: false,

    // Orders
    canManageOrders: false,
    canViewOrders: true,
    canCreateOrders: false,
    canEditOrders: false,
    canCancelOrders: false,

    // Customers
    canManageCustomers: false,
    canViewCustomers: true,
    canCreateCustomers: false,
    canEditCustomers: false,
    canDeleteCustomers: false,
    canViewCustomerHistory: true,
    canBlacklistCustomer: false,
    canRemoveCustomerBlacklist: false,
    canAddLoyaltyPoints: false,
    canRedeemLoyaltyPoints: false,
    canViewCustomerAnalytics: true,

    // Suppliers
    canManageSuppliers: false,
    canViewSuppliers: true,
    canCreateSuppliers: false,
    canEditSuppliers: false,
    canDeleteSuppliers: false,
    canRestoreSupplier: false,
    canUpdateSupplierRating: false,
    canBlacklistSupplier: false,
    canRemoveSupplierBlacklist: false,
    canMarkPreferredSupplier: false,
    canRemovePreferredSupplier: false,
    canUpdateSupplierBalance: true,
    canViewSupplierStatistics: true,
    canViewTopSuppliers: false,

    // Parties & Billing
    canManageParties: true,
    canViewPartyLedger: true,
    canManageBilling: true,
    canViewBilling: true,

    // Financial
    canViewFinancials: true,
    canViewPayments: true,
    canReceivePayments: true,
    canMakePayments: true,
    canViewProfitLoss: true,
    canApproveTransactions: false,

    // Expenses
    canManageExpenses: true,

    // Schemes
    canManageSchemes: false,
    canViewSchemes: true,
    canCreateSchemes: false,
    canEditSchemes: false,
    canDeleteSchemes: false,

    // Reports & Analytics
    canManageReports: true,
    canViewReports: true,
    canGenerateReports: true,
    canExportReports: true,
    canViewAnalytics: true,
    canViewDashboard: true,

    // POS
    canAccessPOS: false,

    // Users
    canManageUsers: false,
    canViewUsers: false,
    canCreateUsers: false,
    canEditUsers: false,
    canDeleteUsers: false,
    canAssignRoles: false,

    // Shop Settings
    canManageShopSettings: false,
    canManageMetalRates: false,
    canUpdateMetalRates: false,
    canManageTaxSettings: false,
    canCreateShop: false,
    canViewShops: true,
    canViewSingleShop: true,
    canUpdateShop: false,
    canDeleteShop: false,
    canViewShopStatistics: true,
    canTransferInventory: false,

    // Advanced Features
    canManageRepairs: false,
    canManageCustomOrders: false,
    canManageHallmarking: false,
    canManageOldGold: false,

    // System
    canManageSettings: false,
    canExportData: true,
    canDeleteRecords: false,
    canViewAuditLog: false,
    canBackupData: true,
    canRestoreData: false,
  },

  // ==========================================================================
  // VIEWER - Read-only Access
  // ==========================================================================
  viewer: {
    // Inventory & Products
    canManageInventory: false,
    canViewInventory: true,
    canEditInventory: false,
    canManageProducts: false,
    canDeleteProducts: false,
    canImportProducts: false,
    canExportProducts: false,

    // Purchases
    canManagePurchases: false,
    canViewPurchases: true,
    canCreatePurchases: false,
    canEditPurchases: false,
    canDeletePurchases: false,
    canApprovePurchases: false,

    // Sales
    canManageSales: false,
    canViewSales: true,
    canCreateSales: false,
    canEditSales: false,
    canDeleteSales: false,
    canApproveSales: false,
    canGenerateInvoices: false,
    canCancelInvoices: false,
    canApplyDiscounts: false,

    // Orders
    canManageOrders: false,
    canViewOrders: true,
    canCreateOrders: false,
    canEditOrders: false,
    canCancelOrders: false,

    // Customers
    canManageCustomers: false,
    canViewCustomers: true,
    canCreateCustomers: false,
    canEditCustomers: false,
    canDeleteCustomers: false,
    canViewCustomerHistory: true,
    canBlacklistCustomer: false,
    canRemoveCustomerBlacklist: false,
    canAddLoyaltyPoints: false,
    canRedeemLoyaltyPoints: false,
    canViewCustomerAnalytics: false,

    // Suppliers
    canManageSuppliers: false,
    canViewSuppliers: true,
    canCreateSuppliers: false,
    canEditSuppliers: false,
    canDeleteSuppliers: false,
    canRestoreSupplier: false,
    canUpdateSupplierRating: false,
    canBlacklistSupplier: false,
    canRemoveSupplierBlacklist: false,
    canMarkPreferredSupplier: false,
    canRemovePreferredSupplier: false,
    canUpdateSupplierBalance: false,
    canViewSupplierStatistics: false,
    canViewTopSuppliers: false,

    // Parties & Billing
    canManageParties: false,
    canViewPartyLedger: false,
    canManageBilling: false,
    canViewBilling: false,

    // Financial
    canViewFinancials: false,
    canViewPayments: false,
    canReceivePayments: false,
    canMakePayments: false,
    canViewProfitLoss: false,
    canApproveTransactions: false,

    // Expenses
    canManageExpenses: false,

    // Schemes
    canManageSchemes: false,
    canViewSchemes: true,
    canCreateSchemes: false,
    canEditSchemes: false,
    canDeleteSchemes: false,

    // Reports & Analytics
    canManageReports: false,
    canViewReports: false,
    canGenerateReports: false,
    canExportReports: false,
    canViewAnalytics: false,
    canViewDashboard: true,

    // POS
    canAccessPOS: false,

    // Users
    canManageUsers: false,
    canViewUsers: true,
    canCreateUsers: false,
    canEditUsers: false,
    canDeleteUsers: false,
    canAssignRoles: false,

    // Shop Settings
    canManageShopSettings: false,
    canManageMetalRates: false,
    canUpdateMetalRates: false,
    canManageTaxSettings: false,
    canCreateShop: false,
    canViewShops: true,
    canViewSingleShop: true,
    canUpdateShop: false,
    canDeleteShop: false,
    canViewShopStatistics: false,
    canTransferInventory: false,

    // Advanced Features
    canManageRepairs: false,
    canManageCustomOrders: false,
    canManageHallmarking: false,
    canManageOldGold: false,

    // System
    canManageSettings: false,
    canExportData: false,
    canDeleteRecords: false,
    canViewAuditLog: false,
    canBackupData: false,
    canRestoreData: false,
  },
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get permissions for a specific role
 * @param role - User role
 * @returns Permission set for the role
 */
export const getPermissionsByRole = (role: UserRole): PermissionSet => {
  return PERMISSIONS[role] || PERMISSIONS.viewer
}

/**
 * Check if a role has a specific permission
 * @param role - User role
 * @param permission - Permission key to check
 * @returns true if role has the permission
 */
export const hasPermission = (
  role: UserRole,
  permission: keyof PermissionSet
): boolean => {
  const permissions = getPermissionsByRole(role)
  return permissions[permission] === true
}

/**
 * Get all permissions as an array for a role
 * @param role - User role
 * @returns Array of permission keys that are true
 */
export const getActivePermissions = (role: UserRole): string[] => {
  const permissions = getPermissionsByRole(role)
  return Object.entries(permissions)
    .filter(([_, value]) => value === true)
    .map(([key]) => key)
}

/**
 * Compare permissions between two roles
 * @param role1 - First role
 * @param role2 - Second role
 * @returns Object with added and removed permissions
 */
export const compareRolePermissions = (
  role1: UserRole,
  role2: UserRole
): {
  added: string[]
  removed: string[]
  common: string[]
} => {
  const perms1 = getActivePermissions(role1)
  const perms2 = getActivePermissions(role2)

  const added = perms2.filter(p => !perms1.includes(p))
  const removed = perms1.filter(p => !perms2.includes(p))
  const common = perms1.filter(p => perms2.includes(p))

  return { added, removed, common }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  PERMISSIONS,
  getPermissionsByRole,
  hasPermission,
  getActivePermissions,
  compareRolePermissions,
}