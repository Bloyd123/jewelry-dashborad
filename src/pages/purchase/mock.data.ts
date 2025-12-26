// ============================================================================
// FILE: purchase/mock.data.ts
// Purchase Module Dummy Data - Ready for Testing
// ============================================================================

import type {
  IPurchase,
  IPurchaseItem,
  ISupplierDetails,
  IPurchaseAnalytics,
  PurchaseSummary,
} from '@/types/purchase.types';

// ============================================================================
// DUMMY SUPPLIERS
// ============================================================================

export const dummySuppliers: ISupplierDetails[] = [
  {
    supplierName: 'Rajesh Gold Suppliers',
    supplierCode: 'SUP001',
    contactPerson: 'Rajesh Kumar',
    phone: '+91 98765 43210',
    email: 'rajesh@goldsupp.com',
    address: 'Shop 45, Zaveri Bazaar, Mumbai',
    gstNumber: '27ABCDE1234F1Z5',
  },
  {
    supplierName: 'Diamond Palace Wholesale',
    supplierCode: 'SUP002',
    contactPerson: 'Amit Shah',
    phone: '+91 99887 76655',
    email: 'amit@diamondpalace.com',
    address: 'Block C, Diamond Market, Surat',
    gstNumber: '24XYZAB5678G2W9',
  },
  {
    supplierName: 'Silver World Traders',
    supplierCode: 'SUP003',
    contactPerson: 'Suresh Patel',
    phone: '+91 97654 32109',
    email: 'suresh@silverworld.com',
    address: '12/A, Metal Street, Ahmedabad',
    gstNumber: '24PQRST9012H3X4',
  },
];

// ============================================================================
// DUMMY PURCHASE ITEMS
// ============================================================================

export const dummyPurchaseItems: IPurchaseItem[] = [
  {
    _id: 'item1',
    productId: null,
    productName: '22K Gold Necklace',
    category: 'necklace',
    metalType: 'gold',
    purity: '22K',
    grossWeight: 25.5,
    stoneWeight: 0,
    netWeight: 25.5,
    weightUnit: 'gram',
    quantity: 1,
    ratePerGram: 6200,
    makingCharges: 12750,
    stoneCharges: 0,
    otherCharges: 500,
    itemTotal: 171350,
    huid: 'HUID123456',
    isHallmarked: true,
    description: 'Traditional 22K gold necklace with intricate design',
  },
  {
    _id: 'item2',
    productId: null,
    productName: 'Diamond Earrings',
    category: 'earrings',
    metalType: 'gold',
    purity: '18K',
    grossWeight: 8.2,
    stoneWeight: 1.2,
    netWeight: 7.0,
    weightUnit: 'gram',
    quantity: 1,
    ratePerGram: 5800,
    makingCharges: 8000,
    stoneCharges: 45000,
    otherCharges: 200,
    itemTotal: 93800,
    isHallmarked: true,
    description: 'Elegant diamond earrings with 18K gold setting',
  },
];

// ============================================================================
// DUMMY PURCHASES
// ============================================================================

export const dummyPurchases: IPurchase[] = [
  {
    _id: 'PUR001',
    organizationId: 'ORG001',
    shopId: 'SHOP001',
    purchaseNumber: 'PUR-2024-001',
    supplierId: 'SUP001',
    supplierDetails: dummySuppliers[0],
    purchaseDate: new Date('2024-12-15'),
    purchaseType: 'new_stock',
    items: [dummyPurchaseItems[0]],
    financials: {
      subtotal: 171350,
      cgst: 2570.25,
      sgst: 2570.25,
      igst: 0,
      totalGst: 5140.5,
      roundOff: -0.5,
      grandTotal: 176490,
      totalPaid: 176490,
      totalDue: 0,
    },
    payment: {
      paymentMode: 'bank_transfer',
      paidAmount: 176490,
      dueAmount: 0,
      paymentStatus: 'paid',
      payments: [
        {
          _id: 'PAY001',
          amount: 176490,
          paymentMode: 'bank_transfer',
          paymentDate: new Date('2024-12-15'),
          transactionId: 'TXN123456789',
          referenceNumber: 'REF001',
          receivedBy: 'USER001',
        },
      ],
    },
    status: 'completed',
    approvalStatus: 'approved',
    approvedBy: 'USER001',
    approvedAt: new Date('2024-12-15'),
    delivery: {
      receivedDate: new Date('2024-12-15'),
      receivedBy: 'USER001',
      notes: 'Received in good condition',
    },
    documents: [],
    notes: 'First purchase from this supplier',
    tags: ['gold', 'necklace', 'hallmarked'],
    createdBy: 'USER001',
    createdAt: new Date('2024-12-15'),
    updatedAt: new Date('2024-12-15'),
  },
  {
    _id: 'PUR002',
    organizationId: 'ORG001',
    shopId: 'SHOP001',
    purchaseNumber: 'PUR-2024-002',
    supplierId: 'SUP002',
    supplierDetails: dummySuppliers[1],
    purchaseDate: new Date('2024-12-20'),
    purchaseType: 'new_stock',
    items: [dummyPurchaseItems[1]],
    financials: {
      subtotal: 93800,
      cgst: 1407,
      sgst: 1407,
      igst: 0,
      totalGst: 2814,
      roundOff: 0,
      grandTotal: 96614,
      totalPaid: 50000,
      totalDue: 46614,
    },
    payment: {
      paymentMode: 'mixed',
      paidAmount: 50000,
      dueAmount: 46614,
      paymentStatus: 'partial',
      dueDate: new Date('2025-01-20'),
      payments: [
        {
          _id: 'PAY002',
          amount: 30000,
          paymentMode: 'cash',
          paymentDate: new Date('2024-12-20'),
          receivedBy: 'USER001',
        },
        {
          _id: 'PAY003',
          amount: 20000,
          paymentMode: 'upi',
          paymentDate: new Date('2024-12-20'),
          transactionId: 'UPI987654321',
          receivedBy: 'USER001',
        },
      ],
    },
    status: 'received',
    approvalStatus: 'approved',
    approvedBy: 'USER001',
    approvedAt: new Date('2024-12-20'),
    delivery: {
      receivedDate: new Date('2024-12-20'),
      receivedBy: 'USER001',
    },
    documents: [],
    tags: ['diamond', 'earrings'],
    createdBy: 'USER001',
    createdAt: new Date('2024-12-20'),
    updatedAt: new Date('2024-12-20'),
  },
  {
    _id: 'PUR003',
    organizationId: 'ORG001',
    shopId: 'SHOP001',
    purchaseNumber: 'PUR-2024-003',
    supplierId: 'SUP003',
    supplierDetails: dummySuppliers[2],
    purchaseDate: new Date('2024-12-22'),
    purchaseType: 'new_stock',
    items: [
      {
        _id: 'item3',
        productName: 'Silver Anklet',
        category: 'anklet',
        metalType: 'silver',
        purity: '925',
        grossWeight: 45.0,
        stoneWeight: 0,
        netWeight: 45.0,
        weightUnit: 'gram',
        quantity: 2,
        ratePerGram: 85,
        makingCharges: 900,
        stoneCharges: 0,
        otherCharges: 100,
        itemTotal: 8825,
        isHallmarked: true,
      },
    ],
    financials: {
      subtotal: 8825,
      cgst: 132.38,
      sgst: 132.38,
      igst: 0,
      totalGst: 264.76,
      roundOff: 0.24,
      grandTotal: 9090,
      totalPaid: 0,
      totalDue: 9090,
    },
    payment: {
      paymentMode: 'credit',
      paidAmount: 0,
      dueAmount: 9090,
      paymentStatus: 'unpaid',
      dueDate: new Date('2025-01-22'),
      paymentTerms: 'Net 30',
      payments: [],
    },
    status: 'pending',
    approvalStatus: 'pending',
    delivery: {
      expectedDate: new Date('2024-12-25'),
    },
    documents: [],
    tags: ['silver', 'anklet'],
    createdBy: 'USER001',
    createdAt: new Date('2024-12-22'),
    updatedAt: new Date('2024-12-22'),
  },
  {
    _id: 'PUR004',
    organizationId: 'ORG001',
    shopId: 'SHOP001',
    purchaseNumber: 'PUR-2024-004',
    supplierId: 'SUP001',
    supplierDetails: dummySuppliers[0],
    purchaseDate: new Date('2024-12-24'),
    purchaseType: 'old_gold',
    items: [
      {
        _id: 'item4',
        productName: 'Old Gold Exchange',
        category: 'misc',
        metalType: 'gold',
        purity: '22K',
        grossWeight: 15.0,
        stoneWeight: 0,
        netWeight: 15.0,
        weightUnit: 'gram',
        quantity: 1,
        ratePerGram: 6100,
        makingCharges: 0,
        stoneCharges: 0,
        otherCharges: 0,
        itemTotal: 91500,
        isHallmarked: false,
        description: 'Old gold purchase for exchange',
      },
    ],
    financials: {
      subtotal: 91500,
      cgst: 1372.5,
      sgst: 1372.5,
      igst: 0,
      totalGst: 2745,
      roundOff: 0,
      grandTotal: 94245,
      totalPaid: 94245,
      totalDue: 0,
    },
    payment: {
      paymentMode: 'cash',
      paidAmount: 94245,
      dueAmount: 0,
      paymentStatus: 'paid',
      payments: [
        {
          _id: 'PAY004',
          amount: 94245,
          paymentMode: 'cash',
          paymentDate: new Date('2024-12-24'),
          receivedBy: 'USER001',
        },
      ],
    },
    status: 'completed',
    approvalStatus: 'approved',
    approvedBy: 'USER001',
    approvedAt: new Date('2024-12-24'),
    delivery: {
      receivedDate: new Date('2024-12-24'),
      receivedBy: 'USER001',
    },
    documents: [],
    notes: 'Old gold exchange purchase',
    tags: ['old_gold', 'exchange'],
    createdBy: 'USER001',
    createdAt: new Date('2024-12-24'),
    updatedAt: new Date('2024-12-24'),
  },
  {
    _id: 'PUR005',
    organizationId: 'ORG001',
    shopId: 'SHOP001',
    purchaseNumber: 'PUR-2024-005',
    supplierId: 'SUP002',
    supplierDetails: dummySuppliers[1],
    purchaseDate: new Date('2024-12-26'),
    purchaseType: 'new_stock',
    items: [
      {
        _id: 'item5',
        productName: 'Diamond Ring',
        category: 'ring',
        metalType: 'gold',
        purity: '18K',
        grossWeight: 5.5,
        stoneWeight: 0.8,
        netWeight: 4.7,
        weightUnit: 'gram',
        quantity: 1,
        ratePerGram: 5900,
        makingCharges: 6000,
        stoneCharges: 65000,
        otherCharges: 300,
        itemTotal: 98630,
        isHallmarked: true,
        description: 'Solitaire diamond ring',
      },
    ],
    financials: {
      subtotal: 98630,
      cgst: 1479.45,
      sgst: 1479.45,
      igst: 0,
      totalGst: 2958.9,
      roundOff: -0.9,
      grandTotal: 101588,
      totalPaid: 60000,
      totalDue: 41588,
    },
    payment: {
      paymentMode: 'cheque',
      paidAmount: 60000,
      dueAmount: 41588,
      paymentStatus: 'partial',
      dueDate: new Date('2025-01-15'),
      payments: [
        {
          _id: 'PAY005',
          amount: 60000,
          paymentMode: 'cheque',
          paymentDate: new Date('2024-12-26'),
          chequeNumber: 'CHQ123456',
          chequeDate: new Date('2024-12-26'),
          bankName: 'HDFC Bank',
          receivedBy: 'USER001',
        },
      ],
    },
    status: 'ordered',
    approvalStatus: 'pending',
    delivery: {
      expectedDate: new Date('2024-12-30'),
    },
    documents: [],
    tags: ['diamond', 'ring', 'solitaire'],
    createdBy: 'USER001',
    createdAt: new Date('2024-12-26'),
    updatedAt: new Date('2024-12-26'),
  },
];

// ============================================================================
// DUMMY ANALYTICS
// ============================================================================

export const dummyPurchaseAnalytics: IPurchaseAnalytics = {
  totalPurchases: 5,
  totalPurchaseValue: 570017,
  pendingPurchases: 2,
  paymentStatusBreakdown: [
    { _id: 'paid', count: 2 },
    { _id: 'partial', count: 2 },
    { _id: 'unpaid', count: 1 },
  ],
  topSuppliers: [
    {
      _id: 'SUP001',
      totalPurchases: 2,
      totalValue: 270735,
      supplier: {
        businessName: 'Rajesh Gold Suppliers',
        supplierCode: 'SUP001',
      },
    },
    {
      _id: 'SUP002',
      totalPurchases: 2,
      totalValue: 198202,
      supplier: {
        businessName: 'Diamond Palace Wholesale',
        supplierCode: 'SUP002',
      },
    },
    {
      _id: 'SUP003',
      totalPurchases: 1,
      totalValue: 9090,
      supplier: {
        businessName: 'Silver World Traders',
        supplierCode: 'SUP003',
      },
    },
  ],
  monthlyTrend: [
    {
      _id: { year: 2024, month: 12 },
      count: 5,
      totalValue: 570017,
    },
  ],
};

// ============================================================================
// DUMMY PURCHASE SUMMARIES (for quick lists)
// ============================================================================

export const dummyPurchaseSummaries: PurchaseSummary[] = dummyPurchases.map((p) => ({
  purchaseNumber: p.purchaseNumber,
  supplierName: p.supplierDetails.supplierName,
  date: new Date(p.purchaseDate).toLocaleDateString(),
  amount: p.financials.grandTotal,
  status: p.status,
  paymentStatus: p.payment.paymentStatus,
}));

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export const getPurchaseById = (id: string): IPurchase | undefined => {
  return dummyPurchases.find((p) => p._id === id);
};

export const getPurchasesByStatus = (status: string): IPurchase[] => {
  return dummyPurchases.filter((p) => p.status === status);
};

export const getPurchasesBySupplier = (supplierId: string): IPurchase[] => {
  return dummyPurchases.filter((p) => p.supplierId === supplierId);
};

export const getPurchasesByPaymentStatus = (paymentStatus: string): IPurchase[] => {
  return dummyPurchases.filter((p) => p.payment.paymentStatus === paymentStatus);
};

export const getPendingPurchases = (): IPurchase[] => {
  return dummyPurchases.filter((p) =>
    ['draft', 'pending', 'ordered'].includes(p.status)
  );
};

export const getUnpaidPurchases = (): IPurchase[] => {
  return dummyPurchases.filter((p) =>
    ['unpaid', 'partial'].includes(p.payment.paymentStatus)
  );
};

export const searchPurchases = (query: string): IPurchase[] => {
  const lowerQuery = query.toLowerCase();
  return dummyPurchases.filter(
    (p) =>
      p.purchaseNumber.toLowerCase().includes(lowerQuery) ||
      p.supplierDetails.supplierName.toLowerCase().includes(lowerQuery)
  );
};

// ============================================================================
// EXPORT ALL
// ============================================================================

export default {
  purchases: dummyPurchases,
  suppliers: dummySuppliers,
  analytics: dummyPurchaseAnalytics,
  summaries: dummyPurchaseSummaries,
  helpers: {
    getPurchaseById,
    getPurchasesByStatus,
    getPurchasesBySupplier,
    getPurchasesByPaymentStatus,
    getPendingPurchases,
    getUnpaidPurchases,
    searchPurchases,
  },
};