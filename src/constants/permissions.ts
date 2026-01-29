// 
// FILE: constants/permissions.ts
// Permission Constants & Groups
// SINGLE SOURCE OF TRUTH - Aligned with Backend
// 

import type { PermissionKey, PermissionGroup } from '@/types/userShopAccess.types'

/**
 * Permission Groups for UI Organization
 * Use these to build permission management UIs
 */
export const PERMISSION_GROUPS: PermissionGroup[] = [
  {
    category: 'customers',
    label: 'Customer Management',
    description: 'Manage customer data, loyalty points, and analytics',
    permissions: [
      { key: 'canCreateCustomer', label: 'Create Customer', description: 'Add new customers' },
      { key: 'canSearchCustomer', label: 'Search Customer', description: 'Search customer database' },
      { key: 'canViewCustomers', label: 'View Customers', description: 'View customer list' },
      { key: 'canGetSingleCustomer', label: 'View Customer Details', description: 'View individual customer' },
      { key: 'canUpdateCustomer', label: 'Update Customer', description: 'Edit customer information' },
      { key: 'canDeleteCustomers', label: 'Delete Customers', description: 'Remove customers' },
      { key: 'canBlacklistCustomer', label: 'Blacklist Customer', description: 'Block customers' },
      { key: 'canRemoveCustomerBlacklist', label: 'Remove Blacklist', description: 'Unblock customers' },
      { key: 'canAddLoyaltyPoints', label: 'Add Loyalty Points', description: 'Award loyalty points' },
      { key: 'canRedeemLoyaltyPoints', label: 'Redeem Loyalty Points', description: 'Process point redemption' },
      { key: 'canViewCustomerAnalytics', label: 'View Analytics', description: 'View customer insights' },
      { key: 'canManageCustomers', label: 'Manage Customers', description: 'Full customer management' },
      { key: 'canViewCustomerHistory', label: 'View History', description: 'View customer transaction history' },
    ],
  },
  
  {
    category: 'inventory',
    label: 'Inventory Management',
    description: 'Manage products, stock, and inventory operations',
    permissions: [
      { key: 'canCreateProduct', label: 'Create Product', description: 'Add new products' },
      { key: 'canViewProducts', label: 'View Products', description: 'View product list' },
      { key: 'canSearchProducts', label: 'Search Products', description: 'Search product database' },
      { key: 'canGetSingleProduct', label: 'View Product Details', description: 'View individual product' },
      { key: 'canUpdateProduct', label: 'Update Product', description: 'Edit product information' },
      { key: 'canDeleteProducts', label: 'Delete Products', description: 'Remove products' },
      { key: 'canUpdateStock', label: 'Update Stock', description: 'Adjust stock levels' },
      { key: 'canReserveProduct', label: 'Reserve Product', description: 'Reserve items for customers' },
      { key: 'canCancelReservation', label: 'Cancel Reservation', description: 'Remove reservations' },
      { key: 'canMarkAsSold', label: 'Mark as Sold', description: 'Mark items as sold' },
      { key: 'canCalculatePrice', label: 'Calculate Price', description: 'Calculate product pricing' },
      { key: 'canGetLowStock', label: 'View Low Stock', description: 'See low stock alerts' },
      { key: 'canViewProductHistory', label: 'View History', description: 'View product history' },
      { key: 'canViewProductAnalytics', label: 'View Analytics', description: 'View product insights' },
      { key: 'canBulkDeleteProducts', label: 'Bulk Delete', description: 'Delete multiple products' },
      { key: 'canBulkUpdateStatus', label: 'Bulk Update Status', description: 'Update multiple statuses' },
      { key: 'canManageProducts', label: 'Manage Products', description: 'Full product management' },
      { key: 'canManageInventory', label: 'Manage Inventory', description: 'Full inventory control' },
      { key: 'canViewInventory', label: 'View Inventory', description: 'View inventory status' },
      { key: 'canEditInventory', label: 'Edit Inventory', description: 'Modify inventory' },
      { key: 'canImportProducts', label: 'Import Products', description: 'Bulk import products' },
      { key: 'canExportProducts', label: 'Export Products', description: 'Export product data' },
    ],
  },
  
  {
    category: 'sales',
    label: 'Sales Management',
    description: 'Manage sales, invoices, and POS operations',
    permissions: [
      { key: 'canCreateSale', label: 'Create Sale', description: 'Create new sales' },
      { key: 'canViewSales', label: 'View Sales', description: 'View sales list' },
      { key: 'canGetSingleSale', label: 'View Sale Details', description: 'View individual sale' },
      { key: 'canUpdateSale', label: 'Update Sale', description: 'Edit sale information' },
      { key: 'canDeleteSales', label: 'Delete Sales', description: 'Remove sales records' },
      { key: 'canUpdateSaleStatus', label: 'Update Status', description: 'Change sale status' },
      { key: 'canConfirmSale', label: 'Confirm Sale', description: 'Confirm sales' },
      { key: 'canMarkAsDelivered', label: 'Mark as Delivered', description: 'Mark delivery complete' },
      { key: 'canCompleteSale', label: 'Complete Sale', description: 'Finalize sales' },
      { key: 'canCancelSale', label: 'Cancel Sale', description: 'Cancel sales' },
      { key: 'canAddSalePayment', label: 'Add Payment', description: 'Record payments' },
      { key: 'canGetSalePayments', label: 'View Payments', description: 'View payment records' },
      { key: 'canGenerateInvoices', label: 'Generate Invoices', description: 'Create invoices' },
      { key: 'canSendInvoice', label: 'Send Invoice', description: 'Email invoices' },
      { key: 'canPrintInvoice', label: 'Print Invoice', description: 'Print invoices' },
      { key: 'canProcessReturn', label: 'Process Return', description: 'Handle returns' },
      { key: 'canAddOldGold', label: 'Add Old Gold', description: 'Accept old gold' },
      { key: 'canRemoveOldGold', label: 'Remove Old Gold', description: 'Remove old gold entries' },
      { key: 'canApplyDiscounts', label: 'Apply Discounts', description: 'Add discounts' },
      { key: 'canRemoveDiscount', label: 'Remove Discount', description: 'Remove discounts' },
      { key: 'canGetByCustomer', label: 'View by Customer', description: 'View customer sales' },
      { key: 'canViewSalesPersonSales', label: 'View by Salesperson', description: 'View salesperson sales' },
      { key: 'canViewSalesAnalytics', label: 'View Analytics', description: 'View sales insights' },
      { key: 'canViewSalesDashboard', label: 'View Dashboard', description: 'Access sales dashboard' },
      { key: 'canViewTodaysSales', label: 'View Today\'s Sales', description: 'See daily sales' },
      { key: 'canViewPendingSales', label: 'View Pending', description: 'View pending sales' },
      { key: 'canViewUnpaidSales', label: 'View Unpaid', description: 'View unpaid sales' },
      { key: 'canViewOverdueSales', label: 'View Overdue', description: 'View overdue sales' },
      { key: 'canApproveSales', label: 'Approve Sales', description: 'Approve sales' },
      { key: 'canRejectSale', label: 'Reject Sale', description: 'Reject sales' },
      { key: 'canBulkDeleteSales', label: 'Bulk Delete', description: 'Delete multiple sales' },
      { key: 'canBulkPrintInvoices', label: 'Bulk Print', description: 'Print multiple invoices' },
      { key: 'canSendReminders', label: 'Send Reminders', description: 'Send payment reminders' },
      { key: 'canManageSales', label: 'Manage Sales', description: 'Full sales management' },
      { key: 'canCancelInvoices', label: 'Cancel Invoices', description: 'Cancel invoices' },
      { key: 'canAccessPOS', label: 'Access POS', description: 'Use point of sale system' },
    ],
  },
  
  {
    category: 'purchase',
    label: 'Purchase Management',
    description: 'Manage purchases, suppliers, and procurement',
    permissions: [
      { key: 'canCreatePurchase', label: 'Create Purchase', description: 'Create purchase orders' },
      { key: 'canViewPurchases', label: 'View Purchases', description: 'View purchase list' },
      { key: 'canGetSinglePurchase', label: 'View Details', description: 'View individual purchase' },
      { key: 'canUpdatePurchase', label: 'Update Purchase', description: 'Edit purchases' },
      { key: 'canDeletePurchases', label: 'Delete Purchases', description: 'Remove purchases' },
      { key: 'canUpdatePurchaseStatus', label: 'Update Status', description: 'Change purchase status' },
      { key: 'canMarkAsReceived', label: 'Mark as Received', description: 'Confirm receipt' },
      { key: 'canCancelPurchase', label: 'Cancel Purchase', description: 'Cancel orders' },
      { key: 'canApprovePurchases', label: 'Approve Purchases', description: 'Approve purchase orders' },
      { key: 'canRejectPurchase', label: 'Reject Purchase', description: 'Reject purchase orders' },
      { key: 'canAddPurchasePayment', label: 'Add Payment', description: 'Record purchase payments' },
      { key: 'canGetPurchasePayments', label: 'View Payments', description: 'View payment records' },
      { key: 'canGetBySupplier', label: 'View by Supplier', description: 'View supplier purchases' },
      { key: 'canViewPurchaseAnalytics', label: 'View Analytics', description: 'View purchase insights' },
      { key: 'canViewPendingPurchases', label: 'View Pending', description: 'View pending purchases' },
      { key: 'canViewUnpaidPurchases', label: 'View Unpaid', description: 'View unpaid purchases' },
      { key: 'canBulkDeletePurchases', label: 'Bulk Delete', description: 'Delete multiple purchases' },
      { key: 'canBulkApprovePurchases', label: 'Bulk Approve', description: 'Approve multiple purchases' },
      { key: 'canUploadPurchaseDocuments', label: 'Upload Documents', description: 'Upload purchase docs' },
      { key: 'canGetPurchaseDocuments', label: 'View Documents', description: 'View purchase docs' },
      { key: 'canManagePurchases', label: 'Manage Purchases', description: 'Full purchase management' },
    ],
  },
  
  {
    category: 'suppliers',
    label: 'Supplier Management',
    description: 'Manage supplier relationships and data',
    permissions: [
      { key: 'canCreateSupplier', label: 'Create Supplier', description: 'Add new suppliers' },
      { key: 'canViewSuppliers', label: 'View Suppliers', description: 'View supplier list' },
      { key: 'canGetSingleSupplier', label: 'View Details', description: 'View individual supplier' },
      { key: 'canUpdateSupplier', label: 'Update Supplier', description: 'Edit supplier info' },
      { key: 'canDeleteSuppliers', label: 'Delete Suppliers', description: 'Remove suppliers' },
      { key: 'canRestoreSupplier', label: 'Restore Supplier', description: 'Restore deleted suppliers' },
      { key: 'canUpdateSupplierRating', label: 'Update Rating', description: 'Rate suppliers' },
      { key: 'canBlacklistSupplier', label: 'Blacklist Supplier', description: 'Block suppliers' },
      { key: 'canRemoveSupplierBlacklist', label: 'Remove Blacklist', description: 'Unblock suppliers' },
      { key: 'canMarkPreferredSupplier', label: 'Mark Preferred', description: 'Set preferred suppliers' },
      { key: 'canRemovePreferredSupplier', label: 'Remove Preferred', description: 'Remove preferred status' },
      { key: 'canUpdateSupplierBalance', label: 'Update Balance', description: 'Adjust supplier balance' },
      { key: 'canViewSupplierStatistics', label: 'View Statistics', description: 'View supplier stats' },
      { key: 'canViewTopSuppliers', label: 'View Top Suppliers', description: 'View top suppliers' },
      { key: 'canManageSuppliers', label: 'Manage Suppliers', description: 'Full supplier management' },
    ],
  },
  
  {
    category: 'orders',
    label: 'Order Management',
    description: 'Manage custom orders, repairs, and order workflow',
    permissions: [
      { key: 'canCreateOrder', label: 'Create Order', description: 'Create custom orders' },
      { key: 'canViewOrders', label: 'View Orders', description: 'View order list' },
      { key: 'canGetSingleOrder', label: 'View Details', description: 'View individual order' },
      { key: 'canUpdateOrder', label: 'Update Order', description: 'Edit orders' },
      { key: 'canCancelOrders', label: 'Cancel Orders', description: 'Cancel orders' },
      { key: 'canUpdateOrderStatus', label: 'Update Status', description: 'Change order status' },
      { key: 'canConfirmOrder', label: 'Confirm Order', description: 'Confirm orders' },
      { key: 'canStartOrder', label: 'Start Order', description: 'Begin order work' },
      { key: 'canHoldOrder', label: 'Hold Order', description: 'Put orders on hold' },
      { key: 'canResumeOrder', label: 'Resume Order', description: 'Resume held orders' },
      { key: 'canMarkAsReady', label: 'Mark as Ready', description: 'Mark orders ready' },
      { key: 'canMarkOrderAsDelivered', label: 'Mark as Delivered', description: 'Confirm delivery' },
      { key: 'canCompleteOrder', label: 'Complete Order', description: 'Finalize orders' },
      { key: 'canAssignOrder', label: 'Assign Order', description: 'Assign to workers' },
      { key: 'canReassignOrder', label: 'Reassign Order', description: 'Reassign orders' },
      { key: 'canGetAssignedOrders', label: 'View Assigned', description: 'View assigned orders' },
      { key: 'canAddProgressUpdate', label: 'Add Progress', description: 'Update order progress' },
      { key: 'canGetProgress', label: 'View Progress', description: 'View order progress' },
      { key: 'canQualityCheck', label: 'Quality Check', description: 'Perform quality checks' },
      { key: 'canGetQualityCheck', label: 'View Quality Check', description: 'View quality reports' },
      { key: 'canAddOrderPayment', label: 'Add Payment', description: 'Record order payments' },
      { key: 'canGetOrderPayments', label: 'View Payments', description: 'View payment records' },
      { key: 'canGenerateBill', label: 'Generate Bill', description: 'Create order bills' },
      { key: 'canAddFeedback', label: 'Add Feedback', description: 'Add customer feedback' },
      { key: 'canGetFeedback', label: 'View Feedback', description: 'View feedback' },
      { key: 'canViewOverdueOrders', label: 'View Overdue', description: 'View overdue orders' },
      { key: 'canViewDueSoonOrders', label: 'View Due Soon', description: 'View due soon orders' },
      { key: 'canViewPendingOrders', label: 'View Pending', description: 'View pending orders' },
      { key: 'canViewCompletedOrders', label: 'View Completed', description: 'View completed orders' },
      { key: 'canViewOrdersByType', label: 'View by Type', description: 'Filter by order type' },
      { key: 'canViewOrdersByPriority', label: 'View by Priority', description: 'Filter by priority' },
      { key: 'canViewOrderAnalytics', label: 'View Analytics', description: 'View order insights' },
      { key: 'canViewOrderDashboard', label: 'View Dashboard', description: 'Access order dashboard' },
      { key: 'canViewCustomerOrders', label: 'View by Customer', description: 'View customer orders' },
      { key: 'canApproveOrder', label: 'Approve Order', description: 'Approve orders' },
      { key: 'canRejectOrder', label: 'Reject Order', description: 'Reject orders' },
      { key: 'canUploadDocuments', label: 'Upload Documents', description: 'Upload order docs' },
      { key: 'canGetDocuments', label: 'View Documents', description: 'View order docs' },
      { key: 'canDeleteDocument', label: 'Delete Documents', description: 'Remove documents' },
      { key: 'canSendReminder', label: 'Send Reminder', description: 'Send order reminders' },
      { key: 'canBulkStatusUpdate', label: 'Bulk Update Status', description: 'Update multiple statuses' },
      { key: 'canBulkAssign', label: 'Bulk Assign', description: 'Assign multiple orders' },
      { key: 'canBulkExportOrders', label: 'Bulk Export', description: 'Export order data' },
      { key: 'canManageOrders', label: 'Manage Orders', description: 'Full order management' },
      { key: 'canManageRepairs', label: 'Manage Repairs', description: 'Manage repair orders' },
      { key: 'canManageCustomOrders', label: 'Manage Custom Orders', description: 'Manage custom orders' },
    ],
  },
  
  {
    category: 'financial',
    label: 'Financial Management',
    description: 'Payment processing, billing, and financial operations',
    permissions: [
      // Payment permissions (39)
      { key: 'canCreatePayment', label: 'Create Payment', description: 'Record payments' },
      { key: 'canGetPaymentsList', label: 'View Payments List', description: 'View payment list' },
      { key: 'canGetSinglePayment', label: 'View Payment Details', description: 'View individual payment' },
      { key: 'canUpdatePayment', label: 'Update Payment', description: 'Edit payments' },
      { key: 'canDeletePayment', label: 'Delete Payment', description: 'Remove payments' },
      { key: 'canUpdatePaymentStatus', label: 'Update Status', description: 'Change payment status' },
      { key: 'canCompletePayment', label: 'Complete Payment', description: 'Finalize payments' },
      { key: 'canCancelPayment', label: 'Cancel Payment', description: 'Cancel payments' },
      { key: 'canViewPendingCheques', label: 'View Pending Cheques', description: 'View pending cheques' },
      { key: 'canClearCheque', label: 'Clear Cheque', description: 'Clear cheques' },
      { key: 'canBounceCheque', label: 'Bounce Cheque', description: 'Mark cheques bounced' },
      { key: 'canViewBouncedCheques', label: 'View Bounced Cheques', description: 'View bounced cheques' },
      { key: 'canViewClearedCheques', label: 'View Cleared Cheques', description: 'View cleared cheques' },
      { key: 'canReconcilePayment', label: 'Reconcile Payment', description: 'Reconcile payments' },
      { key: 'canViewPendingReconciliation', label: 'View Pending Reconciliation', description: 'View pending reconciliations' },
      { key: 'canViewReconciliationSummary', label: 'View Summary', description: 'View reconciliation summary' },
      { key: 'canGenerateReceipt', label: 'Generate Receipt', description: 'Create receipts' },
      { key: 'canSendReceipt', label: 'Send Receipt', description: 'Email receipts' },
      { key: 'canGetByParty', label: 'View by Party', description: 'View party payments' },
      { key: 'canGetByReference', label: 'View by Reference', description: 'Search by reference' },
      { key: 'canViewPaymentByMode', label: 'View by Mode', description: 'Filter by payment mode' },
      { key: 'canViewCashCollection', label: 'View Cash Collection', description: 'View cash collections' },
      { key: 'canViewDigitalCollection', label: 'View Digital Collection', description: 'View digital payments' },
      { key: 'canViewPaymentAnalytics', label: 'View Analytics', description: 'View payment insights' },
      { key: 'canViewPaymentDashboard', label: 'View Dashboard', description: 'Access payment dashboard' },
      { key: 'canViewTodaysPayments', label: 'View Today\'s Payments', description: 'View daily payments' },
      { key: 'canViewPendingPayments', label: 'View Pending', description: 'View pending payments' },
      { key: 'canViewFailedPayments', label: 'View Failed', description: 'View failed payments' },
      { key: 'canApprovePayment', label: 'Approve Payment', description: 'Approve payments' },
      { key: 'canRejectPayment', label: 'Reject Payment', description: 'Reject payments' },
      { key: 'canProcessRefund', label: 'Process Refund', description: 'Issue refunds' },
      { key: 'canGetRefunds', label: 'View Refunds', description: 'View refund records' },
      { key: 'canBulkReconcile', label: 'Bulk Reconcile', description: 'Reconcile multiple payments' },
      { key: 'canBulkExportPayments', label: 'Bulk Export', description: 'Export payment data' },
      { key: 'canBulkPrintReceipts', label: 'Bulk Print', description: 'Print multiple receipts' },
      { key: 'canViewPayments', label: 'View Payments', description: 'General payment viewing' },
      { key: 'canReceivePayments', label: 'Receive Payments', description: 'Accept payments' },
      { key: 'canMakePayments', label: 'Make Payments', description: 'Make outgoing payments' },
      
      // Parties & Billing (4)
      { key: 'canManageParties', label: 'Manage Parties', description: 'Manage party accounts' },
      { key: 'canViewPartyLedger', label: 'View Party Ledger', description: 'View party ledgers' },
      { key: 'canManageBilling', label: 'Manage Billing', description: 'Manage billing operations' },
      { key: 'canViewBilling', label: 'View Billing', description: 'View billing info' },
      
      // Financial (3)
      { key: 'canViewFinancials', label: 'View Financials', description: 'View financial reports' },
      { key: 'canViewProfitLoss', label: 'View Profit & Loss', description: 'View P&L statements' },
      { key: 'canApproveTransactions', label: 'Approve Transactions', description: 'Approve transactions' },
      
      // Expenses (1)
      { key: 'canManageExpenses', label: 'Manage Expenses', description: 'Manage expense records' },
    ],
  },
  
  {
    category: 'schemes',
    label: 'Scheme Management',
    description: 'Manage customer schemes and programs',
    permissions: [
      { key: 'canManageSchemes', label: 'Manage Schemes', description: 'Full scheme management' },
      { key: 'canViewSchemes', label: 'View Schemes', description: 'View schemes' },
      { key: 'canCreateSchemes', label: 'Create Schemes', description: 'Add new schemes' },
      { key: 'canEditSchemes', label: 'Edit Schemes', description: 'Modify schemes' },
      { key: 'canDeleteSchemes', label: 'Delete Schemes', description: 'Remove schemes' },
    ],
  },
  
  {
    category: 'reports',
    label: 'Reports & Analytics',
    description: 'Generate reports and view analytics',
    permissions: [
      { key: 'canManageReports', label: 'Manage Reports', description: 'Full report management' },
      { key: 'canViewReports', label: 'View Reports', description: 'View reports' },
      { key: 'canGenerateReports', label: 'Generate Reports', description: 'Create reports' },
      { key: 'canExportReports', label: 'Export Reports', description: 'Export report data' },
      { key: 'canViewAnalytics', label: 'View Analytics', description: 'View analytics' },
      { key: 'canViewDashboard', label: 'View Dashboard', description: 'Access dashboards' },
    ],
  },
  
{
    category: 'users',
    label: 'User Management',
    description: 'Manage users, roles, and access',
    permissions: [
      { key: 'canManageUsers', label: 'Manage Users', description: 'Full user management' },
      { key: 'canViewUsers', label: 'View Users', description: 'View user list' },
      { key: 'canCreateUsers', label: 'Create Users', description: 'Add new users' },
      { key: 'canEditUsers', label: 'Edit Users', description: 'Modify user info' },
      { key: 'canDeleteUsers', label: 'Delete Users', description: 'Remove users' },
      { key: 'canAssignRoles', label: 'Assign Roles', description: 'Assign user roles' },
    ],
  },
  
  {
    category: 'shop_management',
    label: 'Shop Management',
    description: 'Manage shop settings, metal rates, and shop operations',
    permissions: [
      { key: 'canCreateShop', label: 'Create Shop', description: 'Add new shops' },
      { key: 'canViewShops', label: 'View Shops', description: 'View shop list' },
      { key: 'canViewSingleShop', label: 'View Shop Details', description: 'View individual shop' },
      { key: 'canUpdateShop', label: 'Update Shop', description: 'Edit shop info' },
      { key: 'canDeleteShop', label: 'Delete Shop', description: 'Remove shops' },
      { key: 'canUpdateSettings', label: 'Update Settings', description: 'Modify shop settings' },
      { key: 'canUpdateMetalRates', label: 'Update Metal Rates', description: 'Set metal rates' },
      { key: 'canViewShopStatistics', label: 'View Statistics', description: 'View shop stats' },
      { key: 'canManageShopSettings', label: 'Manage Settings', description: 'Full settings control' },
      { key: 'canManageMetalRates', label: 'Manage Metal Rates', description: 'Full rate management' },
      { key: 'canTransferInventory', label: 'Transfer Inventory', description: 'Transfer between shops' },
      
      // Metal Rate specific (11)
      { key: 'canCreateUpdateRate', label: 'Create/Update Rate', description: 'Add or update rates' },
      { key: 'canGetCurrentRate', label: 'Get Current Rate', description: 'View current rates' },
      { key: 'canGetRateHistory', label: 'View Rate History', description: 'View rate history' },
      { key: 'canGetRateByDate', label: 'Get Rate by Date', description: 'Search rates by date' },
      { key: 'canCompareRates', label: 'Compare Rates', description: 'Compare rate changes' },
      { key: 'canGetTrendData', label: 'View Trend Data', description: 'View rate trends' },
      { key: 'canGetRateForPurity', label: 'Get Rate for Purity', description: 'Get purity-specific rates' },
      { key: 'canGetAverageRate', label: 'Get Average Rate', description: 'Calculate average rates' },
      { key: 'canSyncToAllShops', label: 'Sync to All Shops', description: 'Sync rates across shops' },
      { key: 'canDeactivateRate', label: 'Deactivate Rate', description: 'Deactivate old rates' },
      { key: 'canDeleteRate', label: 'Delete Rate', description: 'Remove rate records' },
    ],
  },
  
  {
    category: 'shop_settings',
    label: 'Settings & Configuration',
    description: 'System settings and tax configuration',
    permissions: [
      { key: 'canManageTaxSettings', label: 'Manage Tax Settings', description: 'Configure tax settings' },
    ],
  },
  
  {
    category: 'advanced',
    label: 'Advanced Features',
    description: 'Hallmarking, old gold, and advanced features',
    permissions: [
      { key: 'canManageHallmarking', label: 'Manage Hallmarking', description: 'Manage hallmark operations' },
      { key: 'canManageOldGold', label: 'Manage Old Gold', description: 'Manage old gold exchange' },
    ],
  },
  
  {
    category: 'system',
    label: 'System Administration',
    description: 'System-level operations, backups, and audit logs',
    permissions: [
      { key: 'canManageSettings', label: 'Manage System Settings', description: 'System configuration' },
      { key: 'canExportData', label: 'Export Data', description: 'Export system data' },
      { key: 'canDeleteRecords', label: 'Delete Records', description: 'Permanently delete records' },
      { key: 'canViewAuditLog', label: 'View Audit Log', description: 'View system audit logs' },
      { key: 'canBackupData', label: 'Backup Data', description: 'Create system backups' },
      { key: 'canRestoreData', label: 'Restore Data', description: 'Restore from backups' },
    ],
  },
]

/**
 * Common Permission Combinations
 * Use these for checking related permissions together
 */
export const PERMISSION_COMBINATIONS = {
  // Full Management Permissions
  FULL_CUSTOMER_MANAGEMENT: [
    'canCreateCustomer',
    'canUpdateCustomer',
    'canDeleteCustomers',
    'canManageCustomers',
  ] as PermissionKey[],
  
  FULL_PRODUCT_MANAGEMENT: [
    'canCreateProduct',
    'canUpdateProduct',
    'canDeleteProducts',
    'canManageProducts',
    'canManageInventory',
  ] as PermissionKey[],
  
  FULL_SALES_MANAGEMENT: [
    'canCreateSale',
    'canUpdateSale',
    'canDeleteSales',
    'canManageSales',
    'canAccessPOS',
  ] as PermissionKey[],
  
  // View-Only Permissions
  VIEW_ONLY_CUSTOMERS: [
    'canViewCustomers',
    'canGetSingleCustomer',
    'canSearchCustomer',
  ] as PermissionKey[],
  
  VIEW_ONLY_PRODUCTS: [
    'canViewProducts',
    'canGetSingleProduct',
    'canSearchProducts',
    'canViewInventory',
  ] as PermissionKey[],
  
  VIEW_ONLY_SALES: [
    'canViewSales',
    'canGetSingleSale',
    'canViewSalesDashboard',
  ] as PermissionKey[],
  
  // Financial Permissions
  PAYMENT_MANAGEMENT: [
    'canCreatePayment',
    'canReceivePayments',
    'canViewPayments',
    'canGenerateReceipt',
  ] as PermissionKey[],
  
  ADVANCED_PAYMENT_MANAGEMENT: [
    'canCreatePayment',
    'canReceivePayments',
    'canMakePayments',
    'canApprovePayment',
    'canReconcilePayment',
    'canProcessRefund',
  ] as PermissionKey[],
  
  BILLING_MANAGEMENT: [
    'canManageBilling',
    'canViewBilling',
    'canGenerateInvoices',
    'canViewFinancials',
  ] as PermissionKey[],
  
  // Operational Permissions
  INVENTORY_OPERATIONS: [
    'canUpdateStock',
    'canReserveProduct',
    'canCancelReservation',
    'canMarkAsSold',
  ] as PermissionKey[],
  
  ORDER_PROCESSING: [
    'canCreateOrder',
    'canUpdateOrderStatus',
    'canAssignOrder',
    'canAddProgressUpdate',
  ] as PermissionKey[],
  
  PURCHASE_OPERATIONS: [
    'canCreatePurchase',
    'canUpdatePurchaseStatus',
    'canMarkAsReceived',
    'canAddPurchasePayment',
  ] as PermissionKey[],
  
  // Analytics & Reporting
  ANALYTICS_ACCESS: [
    'canViewAnalytics',
    'canViewDashboard',
    'canViewReports',
  ] as PermissionKey[],
  
  ADVANCED_ANALYTICS: [
    'canViewAnalytics',
    'canViewCustomerAnalytics',
    'canViewProductAnalytics',
    'canViewSalesAnalytics',
    'canViewPurchaseAnalytics',
    'canViewOrderAnalytics',
    'canViewPaymentAnalytics',
  ] as PermissionKey[],
  
  // Administrative
  USER_ADMINISTRATION: [
    'canManageUsers',
    'canCreateUsers',
    'canEditUsers',
    'canAssignRoles',
  ] as PermissionKey[],
  
  SHOP_ADMINISTRATION: [
    'canCreateShop',
    'canUpdateShop',
    'canManageShopSettings',
    'canManageMetalRates',
  ] as PermissionKey[],
  
  SYSTEM_ADMINISTRATION: [
    'canManageSettings',
    'canViewAuditLog',
    'canBackupData',
    'canRestoreData',
  ] as PermissionKey[],
}

/**
 * Permission Labels - For UI Display
 */
export const PERMISSION_LABELS: Record<PermissionKey, string> = {
  // Auto-generated from PERMISSION_GROUPS
  // This can be dynamically created from PERMISSION_GROUPS array
}

// Populate PERMISSION_LABELS from PERMISSION_GROUPS
PERMISSION_GROUPS.forEach(group => {
  group.permissions.forEach(perm => {
    PERMISSION_LABELS[perm.key] = perm.label
  })
})

/**
 * Permission Descriptions - For Tooltips/Help Text
 */
export const PERMISSION_DESCRIPTIONS: Record<PermissionKey, string> = {}

// Populate PERMISSION_DESCRIPTIONS from PERMISSION_GROUPS
PERMISSION_GROUPS.forEach(group => {
  group.permissions.forEach(perm => {
    PERMISSION_DESCRIPTIONS[perm.key] = perm.description
  })
})

/**
 * Get permissions by category
 */
export const getPermissionsByCategory = (category: string): PermissionKey[] => {
  const group = PERMISSION_GROUPS.find(g => g.category === category)
  return group ? group.permissions.map(p => p.key) : []
}

/**
 * Get all permission keys as array
 */
export const getAllPermissionKeys = (): PermissionKey[] => {
  return PERMISSION_GROUPS.flatMap(group => 
    group.permissions.map(p => p.key)
  )
}

/**
 * Validate permission exists
 */
export const isValidPermission = (permission: string): permission is PermissionKey => {
  return getAllPermissionKeys().includes(permission as PermissionKey)
}

/**
 * Get permission category
 */
export const getPermissionCategory = (permission: PermissionKey): string | null => {
  for (const group of PERMISSION_GROUPS) {
    if (group.permissions.some(p => p.key === permission)) {
      return group.category
    }
  }
  return null
}

// Export everything
export default {
  PERMISSION_GROUPS,
  PERMISSION_COMBINATIONS,
  PERMISSION_LABELS,
  PERMISSION_DESCRIPTIONS,
  getPermissionsByCategory,
  getAllPermissionKeys,
  isValidPermission,
  getPermissionCategory,
}