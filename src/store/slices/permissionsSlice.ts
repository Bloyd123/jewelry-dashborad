// 
// FILE: store/slices/permissionsSlice.ts
// Permissions & Shop Access Management - SINGLE SOURCE OF TRUTH
//  NOW PERSISTED - Cached with timestamp for staleness validation
// 

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { UserShopAccess, ShopPermissions, PermissionKey, UserRole } from '@/types'
import type { RootState } from '../index'

// 
// SIMPLIFIED SHOP ACCESS INTERFACE
// 

interface SimplifiedShopAccess {
  shopId: string  // Just ID string
  shopName: string  // For display
  role: UserRole
  permissions: ShopPermissions
  isActive: boolean
}

// 
// STATE INTERFACE
// 

interface PermissionsState {
  //  SINGLE SOURCE: Shop accesses (simplified structure)
  shopAccesses: SimplifiedShopAccess[]
  
  // Current shop context
  currentShopId: string | null
  currentShopPermissions: ShopPermissions | null
  
  // Organization-level permissions (for super_admin, org_admin)
  orgPermissions: ShopPermissions | null
  
  //  NEW: Timestamp for staleness check
  lastSyncedAt: number | null
  
  // Loading State
  isLoading: boolean
  
  // Error State
  error: string | null
}

// 
// INITIAL STATE
// 

const initialState: PermissionsState = {
  shopAccesses: [],
  currentShopId: null,
  currentShopPermissions: null,
  orgPermissions: null,
  lastSyncedAt: null,  //  NEW
  isLoading: false,
  error: null,
}

// 
// HELPER FUNCTIONS
// 

const getAllPermissionKeys = (): (keyof ShopPermissions)[] => {
  return [
    // CUSTOMER MANAGEMENT (13)
    'canCreateCustomer', 'canSearchCustomer', 'canViewCustomers', 'canGetSingleCustomer',
    'canUpdateCustomer', 'canDeleteCustomers', 'canBlacklistCustomer', 'canRemoveCustomerBlacklist',
    'canAddLoyaltyPoints', 'canRedeemLoyaltyPoints', 'canViewCustomerAnalytics', 'canManageCustomers',
    'canViewCustomerHistory',

    // PRODUCT MANAGEMENT (22)
    'canCreateProduct', 'canViewProducts', 'canSearchProducts', 'canGetSingleProduct',
    'canUpdateProduct', 'canDeleteProducts', 'canUpdateStock', 'canReserveProduct',
    'canCancelReservation', 'canMarkAsSold', 'canCalculatePrice', 'canGetLowStock',
    'canViewProductHistory', 'canViewProductAnalytics', 'canBulkDeleteProducts', 'canBulkUpdateStatus',
    'canManageProducts', 'canManageInventory', 'canViewInventory', 'canEditInventory',
    'canImportProducts', 'canExportProducts',

    // SHOP MANAGEMENT (11)
    'canCreateShop', 'canViewShops', 'canViewSingleShop', 'canUpdateShop', 'canDeleteShop',
    'canUpdateSettings', 'canUpdateMetalRates', 'canViewShopStatistics', 'canManageShopSettings',
    'canManageMetalRates', 'canTransferInventory',

    // SUPPLIER MANAGEMENT (15)
    'canCreateSupplier', 'canViewSuppliers', 'canGetSingleSupplier', 'canUpdateSupplier',
    'canDeleteSuppliers', 'canRestoreSupplier', 'canUpdateSupplierRating', 'canBlacklistSupplier',
    'canRemoveSupplierBlacklist', 'canMarkPreferredSupplier', 'canRemovePreferredSupplier',
    'canUpdateSupplierBalance', 'canViewSupplierStatistics', 'canViewTopSuppliers', 'canManageSuppliers',

    // METAL RATE MANAGEMENT (11)
    'canCreateUpdateRate', 'canGetCurrentRate', 'canGetRateHistory', 'canGetRateByDate',
    'canCompareRates', 'canGetTrendData', 'canGetRateForPurity', 'canGetAverageRate',
    'canSyncToAllShops', 'canDeactivateRate', 'canDeleteRate',

    // PURCHASE MANAGEMENT (21)
    'canCreatePurchase', 'canViewPurchases', 'canGetSinglePurchase', 'canUpdatePurchase',
    'canDeletePurchases', 'canUpdatePurchaseStatus', 'canMarkAsReceived', 'canCancelPurchase',
    'canApprovePurchases', 'canRejectPurchase', 'canAddPurchasePayment', 'canGetPurchasePayments',
    'canGetBySupplier', 'canViewPurchaseAnalytics', 'canViewPendingPurchases', 'canViewUnpaidPurchases',
    'canBulkDeletePurchases', 'canBulkApprovePurchases', 'canUploadPurchaseDocuments',
    'canGetPurchaseDocuments', 'canManagePurchases',

    // SALE MANAGEMENT (36)
    'canCreateSale', 'canViewSales', 'canGetSingleSale', 'canUpdateSale', 'canDeleteSales',
    'canUpdateSaleStatus', 'canConfirmSale', 'canMarkAsDelivered', 'canCompleteSale',
    'canCancelSale', 'canAddSalePayment', 'canGetSalePayments', 'canGenerateInvoices',
    'canSendInvoice', 'canPrintInvoice', 'canProcessReturn', 'canAddOldGold', 'canRemoveOldGold',
    'canApplyDiscounts', 'canRemoveDiscount', 'canGetByCustomer', 'canViewSalesPersonSales',
    'canViewSalesAnalytics', 'canViewSalesDashboard', 'canViewTodaysSales', 'canViewPendingSales',
    'canViewUnpaidSales', 'canViewOverdueSales', 'canApproveSales', 'canRejectSale',
    'canBulkDeleteSales', 'canBulkPrintInvoices', 'canSendReminders', 'canManageSales',
    'canCancelInvoices', 'canAccessPOS',

    // PAYMENT MANAGEMENT (39)
    'canCreatePayment', 'canGetPaymentsList', 'canGetSinglePayment', 'canUpdatePayment',
    'canDeletePayment', 'canUpdatePaymentStatus', 'canCompletePayment', 'canCancelPayment',
    'canViewPendingCheques', 'canClearCheque', 'canBounceCheque', 'canViewBouncedCheques',
    'canViewClearedCheques', 'canReconcilePayment', 'canViewPendingReconciliation',
    'canViewReconciliationSummary', 'canGenerateReceipt', 'canSendReceipt', 'canGetByParty',
    'canGetByReference', 'canViewPaymentByMode', 'canViewCashCollection', 'canViewDigitalCollection',
    'canViewPaymentAnalytics', 'canViewPaymentDashboard', 'canViewTodaysPayments',
    'canViewPendingPayments', 'canViewFailedPayments', 'canApprovePayment', 'canRejectPayment',
    'canProcessRefund', 'canGetRefunds', 'canBulkReconcile', 'canBulkExportPayments',
    'canBulkPrintReceipts', 'canViewPayments', 'canReceivePayments', 'canMakePayments',

    // ORDER MANAGEMENT (46)
    'canCreateOrder', 'canViewOrders', 'canGetSingleOrder', 'canUpdateOrder', 'canCancelOrders',
    'canUpdateOrderStatus', 'canConfirmOrder', 'canStartOrder', 'canHoldOrder', 'canResumeOrder',
    'canMarkAsReady', 'canMarkOrderAsDelivered', 'canCompleteOrder', 'canAssignOrder',
    'canReassignOrder', 'canGetAssignedOrders', 'canAddProgressUpdate', 'canGetProgress',
    'canQualityCheck', 'canGetQualityCheck', 'canAddOrderPayment', 'canGetOrderPayments',
    'canGenerateBill', 'canAddFeedback', 'canGetFeedback', 'canViewOverdueOrders',
    'canViewDueSoonOrders', 'canViewPendingOrders', 'canViewCompletedOrders', 'canViewOrdersByType',
    'canViewOrdersByPriority', 'canViewOrderAnalytics', 'canViewOrderDashboard',
    'canViewCustomerOrders', 'canApproveOrder', 'canRejectOrder', 'canUploadDocuments',
    'canGetDocuments', 'canDeleteDocument', 'canSendReminder', 'canBulkStatusUpdate',
    'canBulkAssign', 'canBulkExportOrders', 'canManageOrders', 'canManageRepairs',
    'canManageCustomOrders',

    // PARTIES & BILLING (4)
    'canManageParties', 'canViewPartyLedger', 'canManageBilling', 'canViewBilling',

    // FINANCIAL (3)
    'canViewFinancials', 'canViewProfitLoss', 'canApproveTransactions',

    // EXPENSES (1)
    'canManageExpenses',

    // SCHEMES (5)
    'canManageSchemes', 'canViewSchemes', 'canCreateSchemes', 'canEditSchemes', 'canDeleteSchemes',

    // REPORTS & ANALYTICS (6)
    'canManageReports', 'canViewReports', 'canGenerateReports', 'canExportReports',
    'canViewAnalytics', 'canViewDashboard',

    // USERS (6)
    'canManageUsers', 'canViewUsers', 'canCreateUsers', 'canEditUsers', 'canDeleteUsers',
    'canAssignRoles',

    // SETTINGS (1)
    'canManageTaxSettings',

    // ADVANCED FEATURES (2)
    'canManageHallmarking', 'canManageOldGold',

    // SYSTEM (6)
    'canManageSettings', 'canExportData', 'canDeleteRecords', 'canViewAuditLog',
    'canBackupData', 'canRestoreData',
  ]
}

const createFullPermissions = (): ShopPermissions => {
  const permissions = {} as Record<string, boolean>
  getAllPermissionKeys().forEach(key => {
    permissions[key as string] = true
  })
  return permissions as ShopPermissions
}

const createOrgAdminPermissions = (): ShopPermissions => {
  return createFullPermissions()
}

//  Extract shop ID from shopAccess (handles both string and object)
const extractShopId = (shopId: any): string => {
  return typeof shopId === 'string' ? shopId : shopId._id
}

//  Extract shop name from shopAccess
const extractShopName = (shopId: any): string => {
  return typeof shopId === 'string' ? '' : (shopId.name || shopId.displayName || '')
}

// 
// SLICE
// 

const permissionsSlice = createSlice({
  name: 'permissions',
  initialState,
  reducers: {
    /**
     *  CRITICAL: Set permissions from login response
     * This is the SINGLE SOURCE OF TRUTH for shop accesses
     */
    setPermissionsFromLogin: (state, action: PayloadAction<{
      shopAccesses: UserShopAccess[]
      effectivePermissions: ShopPermissions | null
      userRole?: UserRole
    }>) => {
      //  Transform to simplified structure (SINGLE SOURCE)
      state.shopAccesses = action.payload.shopAccesses.map(access => ({
        shopId: extractShopId(access.shopId),
        shopName: extractShopName(access.shopId),
        role: access.role,
        permissions: access.permissions,
        isActive: access.isActive
      }))
      
      // Set current shop context
      if (state.shopAccesses.length > 0) {
        state.currentShopId = state.shopAccesses[0].shopId
        state.currentShopPermissions = state.shopAccesses[0].permissions
      } else {
        state.currentShopId = null
        state.currentShopPermissions = null
      }
      
      // Handle org-level permissions
      if (action.payload.effectivePermissions !== null) {
        state.orgPermissions = action.payload.effectivePermissions
      } else if (state.shopAccesses.length === 0) {
        const role = action.payload.userRole
        if (role === 'super_admin') {
          state.orgPermissions = createFullPermissions()
        } else if (role === 'org_admin') {
          state.orgPermissions = createOrgAdminPermissions()
        }
      }
      
      //  NEW: Update timestamp
      state.lastSyncedAt = Date.now()
      
      state.error = null
      state.isLoading = false
      
      if (import.meta.env.DEV) {
        console.log(' [permissionsSlice] Permissions set from login:', {
          shopAccessCount: state.shopAccesses.length,
          hasOrgPermissions: state.orgPermissions !== null,
          hasCurrentShopPermissions: state.currentShopPermissions !== null,
          currentShopId: state.currentShopId,
          timestamp: new Date(state.lastSyncedAt).toISOString()  //  NEW
        })
      }
    },
    
    /**
     * Set current shop permissions based on selected shop
     */
    setCurrentShopPermissions: (state, action: PayloadAction<string>) => {
      const shopId = action.payload
      const shopAccess = state.shopAccesses.find(access => access.shopId === shopId)
      
      if (shopAccess) {
        state.currentShopId = shopId
        state.currentShopPermissions = shopAccess.permissions
        
        if (import.meta.env.DEV) {
          console.log(` [permissionsSlice] Switched shop permissions: ${shopId}`)
        }
      } else {
        console.warn(`⚠️ [permissionsSlice] No shop access found for: ${shopId}`)
      }
    },
    
    /**
     * Clear all permissions (on logout)
     */
    clearPermissions: (state) => {
      state.shopAccesses = []
      state.currentShopId = null
      state.currentShopPermissions = null
      state.orgPermissions = null
      state.lastSyncedAt = null  //  NEW
      state.error = null
      state.isLoading = false
      
      if (import.meta.env.DEV) {
        console.log(' [permissionsSlice] Permissions cleared')
      }
    },
    
    /**
     * Clear error
     */
    clearError: (state) => {
      state.error = null
    },
  },
})

// ACTIONS
export const {
  setPermissionsFromLogin,
  setCurrentShopPermissions,
  clearPermissions,
  clearError,
} = permissionsSlice.actions

// SELECTORS
export const selectShopAccesses = (state: RootState) => 
  state.permissions.shopAccesses

export const selectCurrentShopId = (state: RootState) => 
  state.permissions.currentShopId

export const selectCurrentShopPermissions = (state: RootState) => 
  state.permissions.currentShopPermissions

export const selectOrgPermissions = (state: RootState) => 
  state.permissions.orgPermissions

export const selectEffectivePermissions = (state: RootState) => 
  state.permissions.currentShopPermissions || state.permissions.orgPermissions

export const selectPermissionsLoading = (state: RootState) => 
  state.permissions.isLoading

export const selectPermissionsError = (state: RootState) => 
  state.permissions.error

//  NEW: Get last synced timestamp
export const selectPermissionsLastSyncedAt = (state: RootState) => 
  state.permissions.lastSyncedAt

//  NEW: Check if permissions are stale (older than 24 hours)
export const selectArePermissionsStale = (state: RootState): boolean => {
  const lastSynced = state.permissions.lastSyncedAt
  if (!lastSynced) return true
  
  const STALE_THRESHOLD = 24 * 60 * 60 * 1000 // 24 hours
  const age = Date.now() - lastSynced
  
  return age > STALE_THRESHOLD
}

export const selectHasPermission = (
  state: RootState, 
  permission: PermissionKey
): boolean => {
  const permissions = selectEffectivePermissions(state)
  if (!permissions) return false
  return permissions[permission] === true
}

export const selectHasAnyPermission = (
  state: RootState, 
  permissionList: PermissionKey[]
): boolean => {
  const permissions = selectEffectivePermissions(state)
  if (!permissions) return false
  return permissionList.some(perm => permissions[perm] === true)
}

export const selectHasAllPermissions = (
  state: RootState, 
  permissionList: PermissionKey[]
): boolean => {
  const permissions = selectEffectivePermissions(state)
  if (!permissions) return false
  return permissionList.every(perm => permissions[perm] === true)
}

export const selectPermissionCount = (state: RootState): number => {
  const permissions = selectEffectivePermissions(state)
  if (!permissions) return 0
  return Object.values(permissions).filter(value => value === true).length
}

export const selectHasShopAccess = (state: RootState): boolean => {
  return state.permissions.shopAccesses.length > 0
}

export const selectIsOrgLevel = (state: RootState): boolean => {
  return state.permissions.orgPermissions !== null
}

// Derived selector for active shops count
export const selectActiveShopsCount = (state: RootState): number => {
  return state.permissions.shopAccesses.filter(s => s.isActive).length
}

export default permissionsSlice.reducer