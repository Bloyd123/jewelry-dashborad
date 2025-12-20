// ============================================================================
// TYPES
// ============================================================================

export type Permission =
  | 'canManageInventory'
  | 'canViewInventory'
  | 'canEditInventory'
  | 'canManageProducts'
  | 'canDeleteProducts'
  | 'canImportProducts'
  | 'canExportProducts'
  | 'canManagePurchases'
  | 'canViewPurchases'
  | 'canCreatePurchases'
  | 'canEditPurchases'
  | 'canDeletePurchases'
  | 'canApprovePurchases'
  | 'canManageSales'
  | 'canViewSales'
  | 'canCreateSales'
  | 'canEditSales'
  | 'canDeleteSales'
  | 'canApproveSales'
  | 'canGenerateInvoices'
  | 'canCancelInvoices'
  | 'canApplyDiscounts'
  | 'canManageOrders'
  | 'canViewOrders'
  | 'canCreateOrders'
  | 'canEditOrders'
  | 'canCancelOrders'
  | 'canManageCustomers'
  | 'canViewCustomers'
  | 'canCreateCustomers'
  | 'canEditCustomers'
  | 'canDeleteCustomers'
  | 'canViewCustomerHistory'
  | 'canBlacklistCustomer'
  | 'canRemoveCustomerBlacklist'
  | 'canAddLoyaltyPoints'
  | 'canRedeemLoyaltyPoints'
  | 'canViewCustomerAnalytics'
  | 'canManageSuppliers'
  | 'canViewSuppliers'
  | 'canCreateSuppliers'
  | 'canEditSuppliers'
  | 'canDeleteSuppliers'
  | 'canRestoreSupplier'
  | 'canUpdateSupplierRating'
  | 'canBlacklistSupplier'
  | 'canRemoveSupplierBlacklist'
  | 'canMarkPreferredSupplier'
  | 'canRemovePreferredSupplier'
  | 'canUpdateSupplierBalance'
  | 'canViewSupplierStatistics'
  | 'canViewTopSuppliers'
  | 'canManageParties'
  | 'canViewPartyLedger'
  | 'canManageBilling'
  | 'canViewBilling'
  | 'canViewFinancials'
  | 'canViewPayments'
  | 'canReceivePayments'
  | 'canMakePayments'
  | 'canViewProfitLoss'
  | 'canApproveTransactions'
  | 'canManageExpenses'
  | 'canManageSchemes'
  | 'canViewSchemes'
  | 'canCreateSchemes'
  | 'canEditSchemes'
  | 'canDeleteSchemes'
  | 'canManageReports'
  | 'canViewReports'
  | 'canGenerateReports'
  | 'canExportReports'
  | 'canViewAnalytics'
  | 'canViewDashboard'
  | 'canAccessPOS'
  | 'canManageUsers'
  | 'canViewUsers'
  | 'canCreateUsers'
  | 'canEditUsers'
  | 'canDeleteUsers'
  | 'canAssignRoles'
  | 'canManageShopSettings'
  | 'canManageMetalRates'
  | 'canUpdateMetalRates'
  | 'canManageTaxSettings'
  | 'canCreateShop'
  | 'canViewShops'
  | 'canViewSingleShop'
  | 'canUpdateShop'
  | 'canDeleteShop'
  | 'canViewShopStatistics'
  | 'canTransferInventory'
  | 'canManageRepairs'
  | 'canManageCustomOrders'
  | 'canManageHallmarking'
  | 'canManageOldGold'
  | 'canManageSettings'
  | 'canExportData'
  | 'canDeleteRecords'
  | 'canViewAuditLog'
  | 'canBackupData'
  | 'canRestoreData'
export interface PermissionSet {
  // Inventory & Products
  canManageInventory: boolean
  canViewInventory: boolean
  canEditInventory: boolean
  canManageProducts: boolean
  canDeleteProducts: boolean
  canImportProducts: boolean
  canExportProducts: boolean

  // Purchases
  canManagePurchases: boolean
  canViewPurchases: boolean
  canCreatePurchases: boolean
  canEditPurchases: boolean
  canDeletePurchases: boolean
  canApprovePurchases: boolean

  // Sales
  canManageSales: boolean
  canViewSales: boolean
  canCreateSales: boolean
  canEditSales: boolean
  canDeleteSales: boolean
  canApproveSales: boolean
  canGenerateInvoices: boolean
  canCancelInvoices: boolean
  canApplyDiscounts: boolean

  // Orders
  canManageOrders: boolean
  canViewOrders: boolean
  canCreateOrders: boolean
  canEditOrders: boolean
  canCancelOrders: boolean

  // Customers
  canManageCustomers: boolean
  canViewCustomers: boolean
  canCreateCustomers: boolean
  canEditCustomers: boolean
  canDeleteCustomers: boolean
  canViewCustomerHistory: boolean
  canBlacklistCustomer: boolean
  canRemoveCustomerBlacklist: boolean
  canAddLoyaltyPoints: boolean
  canRedeemLoyaltyPoints: boolean
  canViewCustomerAnalytics: boolean

  // Suppliers
  canManageSuppliers: boolean
  canViewSuppliers: boolean
  canCreateSuppliers: boolean
  canEditSuppliers: boolean
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

  // Parties & Billing
  canManageParties: boolean
  canViewPartyLedger: boolean
  canManageBilling: boolean
  canViewBilling: boolean

  // Financial
  canViewFinancials: boolean
  canViewPayments: boolean
  canReceivePayments: boolean
  canMakePayments: boolean
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

  // POS
  canAccessPOS: boolean

  // Users
  canManageUsers: boolean
  canViewUsers: boolean
  canCreateUsers: boolean
  canEditUsers: boolean
  canDeleteUsers: boolean
  canAssignRoles: boolean

  // Shop Settings
  canManageShopSettings: boolean
  canManageMetalRates: boolean
  canUpdateMetalRates: boolean
  canManageTaxSettings: boolean
  canCreateShop: boolean
  canViewShops: boolean
  canViewSingleShop: boolean
  canUpdateShop: boolean
  canDeleteShop: boolean
  canViewShopStatistics: boolean
  canTransferInventory: boolean

  // Advanced Features
  canManageRepairs: boolean
  canManageCustomOrders: boolean
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
