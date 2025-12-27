// ============================================================================
// FILE: pages/payment/payment.dummy.ts
// Payment Module - Dummy Data for Frontend Testing
// ============================================================================

import {
  Payment,
  PaymentDashboard,
  PaymentAnalytics,
  PartyPaymentSummary,
  ReconciliationSummary,
  CashCollection,
  DigitalCollection,
  PaymentModeBreakdown,
} from '@/types/payment.types'

// ============================================================================
// DUMMY PAYMENTS DATA
// ============================================================================

export const dummyPayments: Payment[] = [
  {
    _id: 'pay_001',
    organizationId: 'org_123',
    shopId: 'shop_456',
    paymentNumber: 'PAY00001',
    paymentDate: '2024-12-27T10:30:00.000Z',
    paymentType: 'sale_payment',
    transactionType: 'receipt',
    amount: 25000,
    paymentMode: 'upi',
    status: 'completed',
    transactionId: 'UPI2024122712345678',
    party: {
      partyType: 'customer',
      partyId: 'cust_001',
      partyName: 'Rajesh Kumar',
      partyPhone: '9876543210',
      partyEmail: 'rajesh@example.com',
    },
    reference: {
      referenceType: 'sale',
      referenceId: 'sale_001',
      referenceNumber: 'INV00123',
    },
    paymentDetails: {
      upiDetails: {
        upiId: 'rajesh@paytm',
        transactionId: 'UPI2024122712345678',
        upiApp: 'Paytm',
      },
    },
    reconciliation: {
      isReconciled: true,
      reconciledAt: '2024-12-27T15:00:00.000Z',
      reconciledBy: 'user_001',
      reconciledWith: 'Bank Statement - Dec 27',
    },
    receipt: {
      receiptGenerated: true,
      receiptNumber: 'REC00001',
      receiptUrl: '/receipts/REC00001.pdf',
      receiptSentAt: '2024-12-27T10:35:00.000Z',
      receiptSentTo: '9876543210',
    },
    approval: {
      approvalRequired: false,
      approvalStatus: 'approved',
    },
    refund: {
      isRefund: false,
    },
    notes: 'Payment received for gold necklace purchase',
    processedBy: {
      _id: 'user_001',
      firstName: 'Amit',
      lastName: 'Verma',
      email: 'amit@example.com',
    },
    createdBy: 'user_001',
    createdAt: '2024-12-27T10:30:00.000Z',
    updatedAt: '2024-12-27T15:00:00.000Z',
  },
  {
    _id: 'pay_002',
    organizationId: 'org_123',
    shopId: 'shop_456',
    paymentNumber: 'PAY00002',
    paymentDate: '2024-12-27T11:15:00.000Z',
    paymentType: 'sale_payment',
    transactionType: 'receipt',
    amount: 50000,
    paymentMode: 'cheque',
    status: 'pending',
    party: {
      partyType: 'customer',
      partyId: 'cust_002',
      partyName: 'Priya Sharma',
      partyPhone: '9988776655',
      partyEmail: 'priya@example.com',
    },
    reference: {
      referenceType: 'sale',
      referenceId: 'sale_002',
      referenceNumber: 'INV00124',
    },
    paymentDetails: {
      chequeDetails: {
        chequeNumber: 'CHQ456789',
        chequeDate: '2024-12-27',
        bankName: 'HDFC Bank',
        branchName: 'Connaught Place',
        accountNumber: 'XXXX5678',
        chequeStatus: 'pending',
      },
    },
    reconciliation: {
      isReconciled: false,
    },
    receipt: {
      receiptGenerated: true,
      receiptNumber: 'REC00002',
      receiptUrl: '/receipts/REC00002.pdf',
    },
    approval: {
      approvalRequired: false,
      approvalStatus: 'approved',
    },
    refund: {
      isRefund: false,
    },
    notes: 'Cheque payment for diamond ring',
    processedBy: {
      _id: 'user_001',
      firstName: 'Amit',
      lastName: 'Verma',
    },
    createdBy: 'user_001',
    createdAt: '2024-12-27T11:15:00.000Z',
    updatedAt: '2024-12-27T11:15:00.000Z',
  },
  {
    _id: 'pay_003',
    organizationId: 'org_123',
    shopId: 'shop_456',
    paymentNumber: 'PAY00003',
    paymentDate: '2024-12-27T12:00:00.000Z',
    paymentType: 'sale_payment',
    transactionType: 'receipt',
    amount: 15000,
    paymentMode: 'cash',
    status: 'completed',
    party: {
      partyType: 'customer',
      partyId: 'cust_003',
      partyName: 'Suresh Patel',
      partyPhone: '9123456789',
    },
    reference: {
      referenceType: 'sale',
      referenceId: 'sale_003',
      referenceNumber: 'INV00125',
    },
    paymentDetails: {},
    reconciliation: {
      isReconciled: true,
      reconciledAt: '2024-12-27T17:00:00.000Z',
      reconciledBy: 'user_002',
    },
    receipt: {
      receiptGenerated: true,
      receiptNumber: 'REC00003',
      receiptUrl: '/receipts/REC00003.pdf',
      receiptSentAt: '2024-12-27T12:05:00.000Z',
      receiptSentTo: '9123456789',
    },
    approval: {
      approvalRequired: false,
      approvalStatus: 'approved',
    },
    refund: {
      isRefund: false,
    },
    notes: 'Cash payment for gold earrings',
    processedBy: {
      _id: 'user_002',
      firstName: 'Sneha',
      lastName: 'Singh',
    },
    createdBy: 'user_002',
    createdAt: '2024-12-27T12:00:00.000Z',
    updatedAt: '2024-12-27T17:00:00.000Z',
  },
  {
    _id: 'pay_004',
    organizationId: 'org_123',
    shopId: 'shop_456',
    paymentNumber: 'PAY00004',
    paymentDate: '2024-12-26T14:30:00.000Z',
    paymentType: 'purchase_payment',
    transactionType: 'payment',
    amount: 100000,
    paymentMode: 'bank_transfer',
    status: 'completed',
    transactionId: 'NEFT202412260123456',
    party: {
      partyType: 'supplier',
      partyId: 'supp_001',
      partyName: 'Gold Suppliers Ltd',
      partyPhone: '9000011111',
    },
    reference: {
      referenceType: 'purchase',
      referenceId: 'pur_001',
      referenceNumber: 'PO00045',
    },
    paymentDetails: {
      bankTransferDetails: {
        accountNumber: 'XXXX9876',
        ifscCode: 'HDFC0001234',
        bankName: 'HDFC Bank',
        branchName: 'Karol Bagh',
        transactionId: 'NEFT202412260123456',
        transferDate: '2024-12-26',
      },
    },
    reconciliation: {
      isReconciled: true,
      reconciledAt: '2024-12-26T18:00:00.000Z',
      reconciledBy: 'user_001',
    },
    receipt: {
      receiptGenerated: false,
    },
    approval: {
      approvalRequired: true,
      approvalStatus: 'approved',
      approvedBy: 'user_admin',
      approvedAt: '2024-12-26T14:00:00.000Z',
    },
    refund: {
      isRefund: false,
    },
    notes: 'Payment for raw gold purchase',
    processedBy: {
      _id: 'user_001',
      firstName: 'Amit',
      lastName: 'Verma',
    },
    createdBy: 'user_001',
    createdAt: '2024-12-26T14:30:00.000Z',
    updatedAt: '2024-12-26T18:00:00.000Z',
  },
  {
    _id: 'pay_005',
    organizationId: 'org_123',
    shopId: 'shop_456',
    paymentNumber: 'PAY00005',
    paymentDate: '2024-12-26T16:00:00.000Z',
    paymentType: 'sale_payment',
    transactionType: 'receipt',
    amount: 8500,
    paymentMode: 'card',
    status: 'completed',
    transactionId: 'CARD20241226789012',
    party: {
      partyType: 'customer',
      partyId: 'cust_004',
      partyName: 'Neha Gupta',
      partyPhone: '9876000111',
    },
    reference: {
      referenceType: 'sale',
      referenceId: 'sale_004',
      referenceNumber: 'INV00126',
    },
    paymentDetails: {
      cardDetails: {
        cardType: 'credit',
        last4Digits: '4532',
        cardHolderName: 'NEHA GUPTA',
        bankName: 'ICICI Bank',
        transactionId: 'CARD20241226789012',
      },
    },
    reconciliation: {
      isReconciled: false,
    },
    receipt: {
      receiptGenerated: true,
      receiptNumber: 'REC00005',
      receiptUrl: '/receipts/REC00005.pdf',
    },
    approval: {
      approvalRequired: false,
      approvalStatus: 'approved',
    },
    refund: {
      isRefund: false,
    },
    notes: 'Card payment for silver anklets',
    processedBy: {
      _id: 'user_003',
      firstName: 'Rahul',
      lastName: 'Mehta',
    },
    createdBy: 'user_003',
    createdAt: '2024-12-26T16:00:00.000Z',
    updatedAt: '2024-12-26T16:00:00.000Z',
  },
  {
    _id: 'pay_006',
    organizationId: 'org_123',
    shopId: 'shop_456',
    paymentNumber: 'REF00001',
    paymentDate: '2024-12-25T11:30:00.000Z',
    paymentType: 'refund',
    transactionType: 'payment',
    amount: 5000,
    paymentMode: 'cash',
    status: 'completed',
    party: {
      partyType: 'customer',
      partyId: 'cust_005',
      partyName: 'Vikram Singh',
      partyPhone: '9998887776',
    },
    reference: {
      referenceType: 'sale',
      referenceId: 'sale_005',
      referenceNumber: 'INV00100',
    },
    paymentDetails: {},
    reconciliation: {
      isReconciled: true,
      reconciledAt: '2024-12-25T15:00:00.000Z',
      reconciledBy: 'user_001',
    },
    receipt: {
      receiptGenerated: true,
      receiptNumber: 'REFUND00001',
      receiptUrl: '/receipts/REFUND00001.pdf',
    },
    approval: {
      approvalRequired: true,
      approvalStatus: 'approved',
      approvedBy: 'user_admin',
      approvedAt: '2024-12-25T11:00:00.000Z',
    },
    refund: {
      isRefund: true,
      originalPaymentId: 'pay_original_001',
      refundReason: 'Product defect - bracelet clasp broken',
      refundedBy: 'user_001',
      refundDate: '2024-12-25',
    },
    notes: 'Refund issued for defective bracelet',
    processedBy: {
      _id: 'user_001',
      firstName: 'Amit',
      lastName: 'Verma',
    },
    createdBy: 'user_001',
    createdAt: '2024-12-25T11:30:00.000Z',
    updatedAt: '2024-12-25T15:00:00.000Z',
  },
  {
    _id: 'pay_007',
    organizationId: 'org_123',
    shopId: 'shop_456',
    paymentNumber: 'PAY00007',
    paymentDate: '2024-12-24T10:00:00.000Z',
    paymentType: 'advance_payment',
    transactionType: 'receipt',
    amount: 20000,
    paymentMode: 'upi',
    status: 'completed',
    transactionId: 'UPI2024122498765432',
    party: {
      partyType: 'customer',
      partyId: 'cust_006',
      partyName: 'Anita Desai',
      partyPhone: '9111222333',
    },
    reference: {
      referenceType: 'order',
      referenceId: 'ord_001',
      referenceNumber: 'ORD00050',
    },
    paymentDetails: {
      upiDetails: {
        upiId: 'anita@oksbi',
        transactionId: 'UPI2024122498765432',
        upiApp: 'Google Pay',
      },
    },
    reconciliation: {
      isReconciled: true,
      reconciledAt: '2024-12-24T16:00:00.000Z',
      reconciledBy: 'user_002',
    },
    receipt: {
      receiptGenerated: true,
      receiptNumber: 'ADV00001',
      receiptUrl: '/receipts/ADV00001.pdf',
      receiptSentAt: '2024-12-24T10:05:00.000Z',
      receiptSentTo: '9111222333',
    },
    approval: {
      approvalRequired: false,
      approvalStatus: 'approved',
    },
    refund: {
      isRefund: false,
    },
    notes: 'Advance payment for custom bridal jewelry order',
    processedBy: {
      _id: 'user_002',
      firstName: 'Sneha',
      lastName: 'Singh',
    },
    createdBy: 'user_002',
    createdAt: '2024-12-24T10:00:00.000Z',
    updatedAt: '2024-12-24T16:00:00.000Z',
  },
  {
    _id: 'pay_008',
    organizationId: 'org_123',
    shopId: 'shop_456',
    paymentNumber: 'PAY00008',
    paymentDate: '2024-12-23T13:45:00.000Z',
    paymentType: 'sale_payment',
    transactionType: 'receipt',
    amount: 35000,
    paymentMode: 'cheque',
    status: 'failed',
    party: {
      partyType: 'customer',
      partyId: 'cust_007',
      partyName: 'Ramesh Khanna',
      partyPhone: '9444555666',
    },
    reference: {
      referenceType: 'sale',
      referenceId: 'sale_007',
      referenceNumber: 'INV00127',
    },
    paymentDetails: {
      chequeDetails: {
        chequeNumber: 'CHQ789012',
        chequeDate: '2024-12-23',
        bankName: 'SBI',
        branchName: 'Nehru Place',
        accountNumber: 'XXXX3456',
        chequeStatus: 'bounced',
        bounceReason: 'Insufficient funds',
      },
    },
    reconciliation: {
      isReconciled: false,
    },
    receipt: {
      receiptGenerated: true,
      receiptNumber: 'REC00008',
    },
    approval: {
      approvalRequired: false,
      approvalStatus: 'approved',
    },
    refund: {
      isRefund: false,
    },
    notes: 'Cheque bounced - insufficient funds. Follow up required',
    processedBy: {
      _id: 'user_003',
      firstName: 'Rahul',
      lastName: 'Mehta',
    },
    createdBy: 'user_003',
    createdAt: '2024-12-23T13:45:00.000Z',
    updatedAt: '2024-12-26T10:00:00.000Z',
  },
]

// ============================================================================
// PAYMENT DASHBOARD DATA
// ============================================================================

export const dummyPaymentDashboard: PaymentDashboard = {
  todayCollection: {
    date: '2024-12-27',
    cashReceived: {
      amount: 15000,
      count: 1,
    },
    cashPaid: {
      amount: 0,
      count: 0,
    },
    netCashBalance: 15000,
  },
  weekCollection: 145000,
  monthCollection: 580000,
  pendingChequesCount: 1,
  unreconciledCount: 2,
  recentPayments: dummyPayments.slice(0, 5),
}

// ============================================================================
// PAYMENT ANALYTICS DATA
// ============================================================================

export const dummyPaymentAnalytics: PaymentAnalytics = {
  analytics: [
    {
      _id: { date: '2024-12-27', transactionType: 'receipt' },
      count: 3,
      totalAmount: 90000,
    },
    {
      _id: { date: '2024-12-26', transactionType: 'receipt' },
      count: 2,
      totalAmount: 28500,
    },
    {
      _id: { date: '2024-12-26', transactionType: 'payment' },
      count: 1,
      totalAmount: 100000,
    },
    {
      _id: { date: '2024-12-25', transactionType: 'payment' },
      count: 1,
      totalAmount: 5000,
    },
    {
      _id: { date: '2024-12-24', transactionType: 'receipt' },
      count: 1,
      totalAmount: 20000,
    },
  ],
  summary: {
    totalReceipts: {
      amount: 173500,
      count: 7,
    },
    totalPayments: {
      amount: 105000,
      count: 2,
    },
    netCashFlow: 68500,
    paymentModeBreakdown: [
      { _id: 'upi', count: 3, totalAmount: 70000 },
      { _id: 'cheque', count: 2, totalAmount: 85000 },
      { _id: 'cash', count: 2, totalAmount: 20000 },
      { _id: 'bank_transfer', count: 1, totalAmount: 100000 },
      { _id: 'card', count: 1, totalAmount: 8500 },
    ],
  },
}

// ============================================================================
// PARTY PAYMENT SUMMARY DATA
// ============================================================================

export const dummyPartyPaymentSummary: PartyPaymentSummary = {
  totalReceived: 75000,
  totalPaid: 0,
  totalPending: 50000,
  lastPaymentDate: '2024-12-27T10:30:00.000Z',
  paymentModeBreakdown: {
    upi: { count: 2, amount: 45000 },
    cheque: { count: 1, amount: 50000 },
    cash: { count: 1, amount: 30000 },
  },
}

// ============================================================================
// RECONCILIATION SUMMARY DATA
// ============================================================================

export const dummyReconciliationSummary: ReconciliationSummary = {
  totalPayments: 8,
  reconciled: {
    count: 5,
    amount: 165000,
  },
  unreconciled: {
    count: 3,
    amount: 113500,
  },
  totalDiscrepancy: 0,
}

// ============================================================================
// CASH COLLECTION DATA
// ============================================================================

export const dummyCashCollection: CashCollection = {
  date: '2024-12-27',
  cashReceived: {
    amount: 15000,
    count: 1,
  },
  cashPaid: {
    amount: 0,
    count: 0,
  },
  netCashBalance: 15000,
}

// ============================================================================
// DIGITAL COLLECTION DATA
// ============================================================================

export const dummyDigitalCollection: DigitalCollection = {
  breakdown: [
    { _id: 'upi', count: 3, totalAmount: 70000 },
    { _id: 'card', count: 1, totalAmount: 8500 },
    { _id: 'bank_transfer', count: 1, totalAmount: 100000 },
  ],
  totalDigitalCollection: 178500,
}

// ============================================================================
// PENDING CHEQUES DATA
// ============================================================================

export const dummyPendingCheques: Payment[] = dummyPayments.filter(
  p => p.paymentMode === 'cheque' && p.status === 'pending'
)

// ============================================================================
// BOUNCED CHEQUES DATA
// ============================================================================

export const dummyBouncedCheques: Payment[] = dummyPayments.filter(
  p => p.paymentMode === 'cheque' && p.status === 'failed'
)

// ============================================================================
// EXPORT ALL
// ============================================================================

export default {
  dummyPayments,
  dummyPaymentDashboard,
  dummyPaymentAnalytics,
  dummyPartyPaymentSummary,
  dummyReconciliationSummary,
  dummyCashCollection,
  dummyDigitalCollection,
  dummyPendingCheques,
  dummyBouncedCheques,
}
