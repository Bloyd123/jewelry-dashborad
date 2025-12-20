// ============================================================================
// FILE: src/data/shop/dummyDataAnalytics.ts
// Dummy Data for Activity Logs
// ============================================================================

// ============================================================================
// TYPES
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
  avatar: string
}

export interface ActivityLog {
  id: string
  timestamp: string
  user: ActivityLogUser
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'EXPORT'
  module: string
  description: string
  status: 'success' | 'pending' | 'failed'
  metadata: Record<string, any>
}

// ============================================================================
// MOCK DATA - 25 Activity Logs
// ============================================================================

export const MOCK_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: 'act_001',
    timestamp: '2024-12-17T14:30:00Z',
    user: {
      name: 'Rajesh Kumar',
      role: 'shop_admin',
      avatar: 'RK',
    },
    action: 'UPDATE',
    module: 'Metal Rates',
    description: 'Updated gold 24K rate to ₹6,850/gram',
    status: 'success',
    metadata: {
      oldRate: 6820,
      newRate: 6850,
      metal: 'gold24K',
    },
  },
  {
    id: 'act_002',
    timestamp: '2024-12-17T13:15:00Z',
    user: {
      name: 'Amit Sharma',
      role: 'manager',
      avatar: 'AS',
    },
    action: 'CREATE',
    module: 'Invoice',
    description: 'Created invoice #INV-2024-0156 for ₹45,680',
    status: 'success',
    metadata: {
      invoiceNumber: 'INV-2024-0156',
      amount: 45680,
      customerName: 'Priya Patel',
    },
  },
  {
    id: 'act_003',
    timestamp: '2024-12-17T12:45:00Z',
    user: {
      name: 'Priya Singh',
      role: 'staff',
      avatar: 'PS',
    },
    action: 'UPDATE',
    module: 'Inventory',
    description: 'Updated stock for Gold Chain 22K (SKU: GC-001)',
    status: 'success',
    metadata: {
      sku: 'GC-001',
      oldStock: 15,
      newStock: 12,
      reason: 'Sold 3 pieces',
    },
  },
  {
    id: 'act_004',
    timestamp: '2024-12-17T11:20:00Z',
    user: {
      name: 'Vikram Mehta',
      role: 'accountant',
      avatar: 'VM',
    },
    action: 'CREATE',
    module: 'Payment',
    description: 'Recorded payment of ₹25,000 via UPI',
    status: 'success',
    metadata: {
      amount: 25000,
      method: 'UPI',
      transactionId: 'UPI2024171120',
    },
  },
  {
    id: 'act_005',
    timestamp: '2024-12-17T10:30:00Z',
    user: {
      name: 'Sneha Reddy',
      role: 'manager',
      avatar: 'SR',
    },
    action: 'DELETE',
    module: 'Customer',
    description: 'Deleted duplicate customer record (Ramesh Gupta)',
    status: 'success',
    metadata: {
      customerId: 'CUST-0089',
      customerName: 'Ramesh Gupta',
      reason: 'Duplicate entry',
    },
  },
  {
    id: 'act_006',
    timestamp: '2024-12-17T09:45:00Z',
    user: {
      name: 'Rahul Joshi',
      role: 'staff',
      avatar: 'RJ',
    },
    action: 'UPDATE',
    module: 'Product',
    description: 'Updated product images for Diamond Ring DR-045',
    status: 'success',
    metadata: {
      productCode: 'DR-045',
      imagesAdded: 3,
    },
  },
  {
    id: 'act_007',
    timestamp: '2024-12-17T08:30:00Z',
    user: {
      name: 'Anjali Kapoor',
      role: 'shop_admin',
      avatar: 'AK',
    },
    action: 'UPDATE',
    module: 'Shop Settings',
    description: 'Changed shop opening time to 10:00 AM',
    status: 'success',
    metadata: {
      setting: 'businessHours',
      oldValue: '09:00',
      newValue: '10:00',
    },
  },
  {
    id: 'act_008',
    timestamp: '2024-12-16T18:20:00Z',
    user: {
      name: 'Karan Patel',
      role: 'manager',
      avatar: 'KP',
    },
    action: 'CREATE',
    module: 'Purchase Order',
    description: 'Created purchase order PO-2024-089 for 500gm gold',
    status: 'success',
    metadata: {
      poNumber: 'PO-2024-089',
      quantity: '500gm',
      supplier: 'ABC Gold Suppliers',
    },
  },
  {
    id: 'act_009',
    timestamp: '2024-12-16T17:15:00Z',
    user: {
      name: 'Deepak Shah',
      role: 'accountant',
      avatar: 'DS',
    },
    action: 'UPDATE',
    module: 'Invoice',
    description: 'Marked invoice #INV-2024-0145 as paid',
    status: 'success',
    metadata: {
      invoiceNumber: 'INV-2024-0145',
      paymentStatus: 'paid',
      paidAmount: 78950,
    },
  },
  {
    id: 'act_010',
    timestamp: '2024-12-16T16:30:00Z',
    user: {
      name: 'Neha Gupta',
      role: 'staff',
      avatar: 'NG',
    },
    action: 'CREATE',
    module: 'Customer',
    description: 'Added new customer Sanjay Malhotra',
    status: 'success',
    metadata: {
      customerName: 'Sanjay Malhotra',
      phone: '9876543210',
      city: 'Mumbai',
    },
  },
  {
    id: 'act_011',
    timestamp: '2024-12-16T15:45:00Z',
    user: {
      name: 'Rohit Verma',
      role: 'manager',
      avatar: 'RV',
    },
    action: 'UPDATE',
    module: 'Metal Rates',
    description: 'Updated silver 999 rate to ₹82/gram',
    status: 'success',
    metadata: {
      oldRate: 80,
      newRate: 82,
      metal: 'silver999',
    },
  },
  {
    id: 'act_012',
    timestamp: '2024-12-16T14:20:00Z',
    user: {
      name: 'Pooja Nair',
      role: 'staff',
      avatar: 'PN',
    },
    action: 'UPDATE',
    module: 'Inventory',
    description: 'Added new batch of 50 silver coins (SC-925)',
    status: 'success',
    metadata: {
      sku: 'SC-925',
      quantityAdded: 50,
      batchNumber: 'BATCH-2024-12',
    },
  },
  {
    id: 'act_013',
    timestamp: '2024-12-16T13:00:00Z',
    user: {
      name: 'Arjun Desai',
      role: 'shop_admin',
      avatar: 'AD',
    },
    action: 'CREATE',
    module: 'User',
    description: 'Added new staff member Kavita Rao',
    status: 'success',
    metadata: {
      userName: 'Kavita Rao',
      role: 'staff',
      email: 'kavita.rao@example.com',
    },
  },
  {
    id: 'act_014',
    timestamp: '2024-12-16T11:45:00Z',
    user: {
      name: 'Meera Jain',
      role: 'accountant',
      avatar: 'MJ',
    },
    action: 'CREATE',
    module: 'Expense',
    description: 'Recorded shop rent expense of ₹35,000',
    status: 'success',
    metadata: {
      expenseType: 'Rent',
      amount: 35000,
      month: 'December 2024',
    },
  },
  {
    id: 'act_015',
    timestamp: '2024-12-16T10:15:00Z',
    user: {
      name: 'Suresh Kumar',
      role: 'manager',
      avatar: 'SK',
    },
    action: 'UPDATE',
    module: 'Invoice',
    description: 'Applied 10% discount to invoice #INV-2024-0140',
    status: 'success',
    metadata: {
      invoiceNumber: 'INV-2024-0140',
      discountPercent: 10,
      discountAmount: 5680,
    },
  },
  {
    id: 'act_016',
    timestamp: '2024-12-15T17:30:00Z',
    user: {
      name: 'Kavita Singh',
      role: 'staff',
      avatar: 'KS',
    },
    action: 'CREATE',
    module: 'Order',
    description: 'Created custom order for gold necklace (ORD-2024-067)',
    status: 'pending',
    metadata: {
      orderNumber: 'ORD-2024-067',
      customerName: 'Anita Sharma',
      expectedDelivery: '2024-12-25',
    },
  },
  {
    id: 'act_017',
    timestamp: '2024-12-15T16:00:00Z',
    user: {
      name: 'Rajesh Kumar',
      role: 'shop_admin',
      avatar: 'RK',
    },
    action: 'UPDATE',
    module: 'Shop Settings',
    description: 'Enabled GST billing for all invoices',
    status: 'success',
    metadata: {
      setting: 'enableGST',
      oldValue: false,
      newValue: true,
    },
  },
  {
    id: 'act_018',
    timestamp: '2024-12-15T14:45:00Z',
    user: {
      name: 'Priya Singh',
      role: 'staff',
      avatar: 'PS',
    },
    action: 'DELETE',
    module: 'Product',
    description: 'Removed discontinued product (Old Design Earrings)',
    status: 'success',
    metadata: {
      productCode: 'ODE-023',
      productName: 'Old Design Earrings',
      reason: 'Discontinued',
    },
  },
  {
    id: 'act_019',
    timestamp: '2024-12-15T13:20:00Z',
    user: {
      name: 'Vikram Mehta',
      role: 'accountant',
      avatar: 'VM',
    },
    action: 'CREATE',
    module: 'Report',
    description: 'Generated monthly sales report for November 2024',
    status: 'success',
    metadata: {
      reportType: 'Sales Report',
      month: 'November 2024',
      totalSales: 1250000,
    },
  },
  {
    id: 'act_020',
    timestamp: '2024-12-15T11:00:00Z',
    user: {
      name: 'Amit Sharma',
      role: 'manager',
      avatar: 'AS',
    },
    action: 'UPDATE',
    module: 'Customer',
    description: 'Updated contact details for Meera Patel',
    status: 'success',
    metadata: {
      customerName: 'Meera Patel',
      updatedField: 'phone',
      newPhone: '9988776655',
    },
  },
  {
    id: 'act_021',
    timestamp: '2024-12-14T18:30:00Z',
    user: {
      name: 'System',
      role: 'system',
      avatar: 'SY',
    },
    action: 'UPDATE',
    module: 'Metal Rates',
    description: 'Auto-updated metal rates from external API',
    status: 'success',
    metadata: {
      source: 'External API',
      ratesUpdated: ['gold24K', 'gold22K', 'silver999'],
    },
  },
  {
    id: 'act_022',
    timestamp: '2024-12-14T16:15:00Z',
    user: {
      name: 'Sneha Reddy',
      role: 'manager',
      avatar: 'SR',
    },
    action: 'CREATE',
    module: 'Invoice',
    description: 'Created invoice #INV-2024-0132 for ₹128,500',
    status: 'success',
    metadata: {
      invoiceNumber: 'INV-2024-0132',
      amount: 128500,
      customerName: 'Rajiv Khanna',
    },
  },
  {
    id: 'act_023',
    timestamp: '2024-12-14T14:00:00Z',
    user: {
      name: 'Rahul Joshi',
      role: 'staff',
      avatar: 'RJ',
    },
    action: 'UPDATE',
    module: 'Inventory',
    description: 'Updated weight for Diamond Pendant DP-078',
    status: 'success',
    metadata: {
      sku: 'DP-078',
      oldWeight: '2.5g',
      newWeight: '2.8g',
    },
  },
  {
    id: 'act_024',
    timestamp: '2024-12-14T12:30:00Z',
    user: {
      name: 'Deepak Shah',
      role: 'accountant',
      avatar: 'DS',
    },
    action: 'CREATE',
    module: 'Payment',
    description: 'Recorded cash payment of ₹50,000',
    status: 'success',
    metadata: {
      amount: 50000,
      method: 'Cash',
      invoiceNumber: 'INV-2024-0128',
    },
  },
  {
    id: 'act_025',
    timestamp: '2024-12-14T10:00:00Z',
    user: {
      name: 'Anjali Kapoor',
      role: 'shop_admin',
      avatar: 'AK',
    },
    action: 'UPDATE',
    module: 'Shop Settings',
    description: 'Updated bank account details',
    status: 'success',
    metadata: {
      setting: 'bankDetails',
      bankName: 'HDFC Bank',
      accountNumber: '****5678',
    },
  },
]
