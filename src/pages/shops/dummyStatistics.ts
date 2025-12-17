// ============================================================================
// FILE: src/data/dummyStatistics.ts
// Dummy Statistics Data for Shop Dashboard
// ============================================================================

export interface ShopStatistics {
  totalSales: {
    amount: number;
    growth: string;
  };
  totalOrders: {
    count: number;
    growth: string;
  };
  revenue: {
    amount: number;
    growth: string;
  };
  customers: {
    count: number;
    growth: string;
  };
  salesTrend: {
    labels: string[];
    data: number[];
  };
  inventoryOverview: {
    totalProducts: number;
    stockValue: number;
    lowStock: number;
  };
  topCustomers: {
    name: string;
    amount: number;
  }[];
}

// ============================================================================
// DUMMY STATISTICS DATA
// ============================================================================

export const dummyShopStatistics: ShopStatistics = {
  // Total Sales Card
  totalSales: {
    amount: 4523450,
    growth: '+12.5%',
  },

  // Total Orders Card
  totalOrders: {
    count: 1234,
    growth: '+8.3%',
  },

  // Revenue Card
  revenue: {
    amount: 4215320,
    growth: '+15.2%',
  },

  // Customers Card
  customers: {
    count: 567,
    growth: '+6.7%',
  },

  // Sales Trend Chart (Last 6 Months)
  salesTrend: {
    labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    data: [3200000, 3500000, 3800000, 4000000, 4300000, 4523450],
  },

  // Inventory Overview
  inventoryOverview: {
    totalProducts: 2456,
    stockValue: 1200000, // ₹1.2 Cr
    lowStock: 23,
  },

  // Top Customers
  topCustomers: [
    {
      name: 'Ramesh',
      amount: 245800,
    },
    {
      name: 'Priya',
      amount: 198500,
    },
    {
      name: 'Amit',
      amount: 156700,
    },
  ],
};

// ============================================================================
// HELPER FUNCTION - Format Currency
// ============================================================================

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

// ============================================================================
// HELPER FUNCTION - Format Number with Commas
// ============================================================================

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-IN').format(num);
};
// ============================================================================
// FILE: src/components/shops/statistics/statistics.mock.ts
// Mock Data for Shop Statistics Dashboard
// ============================================================================

// ============================================================================
// SALES TREND DATA (Last 6 Months)
// ============================================================================

export const mockSalesTrendData = [
  { month: 'Jul', sales: 3200000 },
  { month: 'Aug', sales: 3500000 },
  { month: 'Sep', sales: 3800000 },
  { month: 'Oct', sales: 4000000 },
  { month: 'Nov', sales: 4300000 },
  { month: 'Dec', sales: 4523450 },
]

// ============================================================================
// REVENUE TREND DATA (Revenue vs Expenses vs Profit)
// ============================================================================

export const mockRevenueTrendData = [
  { month: 'Jul', revenue: 3200000, expenses: 2400000, profit: 800000 },
  { month: 'Aug', revenue: 3500000, expenses: 2600000, profit: 900000 },
  { month: 'Sep', revenue: 3800000, expenses: 2700000, profit: 1100000 },
  { month: 'Oct', revenue: 4000000, expenses: 2800000, profit: 1200000 },
  { month: 'Nov', revenue: 4300000, expenses: 3000000, profit: 1300000 },
  { month: 'Dec', revenue: 4523450, expenses: 3100000, profit: 1423450 },
]

// ============================================================================
// INVENTORY DATA
// ============================================================================

export const mockInventoryData = {
  totalProducts: 2456,
  stockValue: 1200000, // ₹12 Lakh
  lowStock: 23,
}

// ============================================================================
// TOP PRODUCTS DATA
// ============================================================================

export const mockTopProducts = [
  {
    _id: '1',
    productCode: 'GR-001',
    productName: '22K Gold Ring with Diamond',
    category: 'rings',
    totalSold: 145,
    revenue: 2850000,
    stockRemaining: 23,
  },
  {
    _id: '2',
    productCode: 'GN-002',
    productName: '18K Gold Necklace Set',
    category: 'necklaces',
    totalSold: 98,
    revenue: 2450000,
    stockRemaining: 15,
  },
  {
    _id: '3',
    productCode: 'GB-003',
    productName: 'Gold Bangle Set (6 pieces)',
    category: 'bangles',
    totalSold: 87,
    revenue: 1980000,
    stockRemaining: 34,
  },
  {
    _id: '4',
    productCode: 'GE-004',
    productName: 'Diamond Earrings',
    category: 'earrings',
    totalSold: 76,
    revenue: 1560000,
    stockRemaining: 8,
  },
  {
    _id: '5',
    productCode: 'GC-005',
    productName: 'Gold Chain 22K',
    category: 'chains',
    totalSold: 65,
    revenue: 1320000,
    stockRemaining: 42,
  },
]

// ============================================================================
// SALES BY CATEGORY DATA
// ============================================================================

export const mockSalesByCategoryData = [
  { name: 'Gold Jewelry', value: 1850000 },
  { name: 'Diamond Jewelry', value: 1250000 },
  { name: 'Silver Jewelry', value: 850000 },
  { name: 'Platinum', value: 400000 },
  { name: 'Others', value: 173450 },
]

// ============================================================================
// SALES BY PAYMENT METHOD DATA
// ============================================================================

export const mockSalesByPaymentMethodData = [
  { name: 'Cash', value: 2100000 },
  { name: 'Card', value: 1500000 },
  { name: 'UPI', value: 750000 },
  { name: 'Bank Transfer', value: 173450 },
]

// ============================================================================
// MONTHLY COMPARISON DATA (Current Year vs Last Year)
// ============================================================================

export const mockMonthlyComparisonData = [
  { month: 'Jan', currentYear: 3000000, lastYear: 2800000 },
  { month: 'Feb', currentYear: 3100000, lastYear: 2900000 },
  { month: 'Mar', currentYear: 3300000, lastYear: 3000000 },
  { month: 'Apr', currentYear: 3200000, lastYear: 2950000 },
  { month: 'May', currentYear: 3400000, lastYear: 3100000 },
  { month: 'Jun', currentYear: 3600000, lastYear: 3200000 },
  { month: 'Jul', currentYear: 3800000, lastYear: 3400000 },
  { month: 'Aug', currentYear: 4000000, lastYear: 3600000 },
  { month: 'Sep', currentYear: 4200000, lastYear: 3800000 },
  { month: 'Oct', currentYear: 4300000, lastYear: 3900000 },
  { month: 'Nov', currentYear: 4400000, lastYear: 4000000 },
  { month: 'Dec', currentYear: 4523450, lastYear: 4100000 },
]

// ============================================================================
// RECENT TRANSACTIONS DATA
// ============================================================================

export const mockRecentTransactions = [
  {
    _id: '1',
    orderNumber: 'ORD-2024-001234',
    customerName: 'Rajesh Kumar',
    date: '2024-12-15T10:30:00Z',
    amount: 85000,
    status: 'completed' as const,
    paymentMethod: 'cash',
  },
  {
    _id: '2',
    orderNumber: 'ORD-2024-001235',
    customerName: 'Priya Sharma',
    date: '2024-12-15T11:45:00Z',
    amount: 125000,
    status: 'completed' as const,
    paymentMethod: 'card',
  },
  {
    _id: '3',
    orderNumber: 'ORD-2024-001236',
    customerName: 'Amit Patel',
    date: '2024-12-15T14:20:00Z',
    amount: 45000,
    status: 'pending' as const,
    paymentMethod: 'upi',
  },
  {
    _id: '4',
    orderNumber: 'ORD-2024-001237',
    customerName: 'Sneha Desai',
    date: '2024-12-15T15:10:00Z',
    amount: 95000,
    status: 'completed' as const,
    paymentMethod: 'bank transfer',
  },
  {
    _id: '5',
    orderNumber: 'ORD-2024-001238',
    customerName: 'Vikram Singh',
    date: '2024-12-15T16:30:00Z',
    amount: 150000,
    status: 'completed' as const,
    paymentMethod: 'cash',
  },
  {
    _id: '6',
    orderNumber: 'ORD-2024-001239',
    customerName: 'Neha Agarwal',
    date: '2024-12-14T09:15:00Z',
    amount: 65000,
    status: 'cancelled' as const,
    paymentMethod: 'card',
  },
  {
    _id: '7',
    orderNumber: 'ORD-2024-001240',
    customerName: 'Rahul Mehta',
    date: '2024-12-14T12:45:00Z',
    amount: 110000,
    status: 'completed' as const,
    paymentMethod: 'upi',
  },
  {
    _id: '8',
    orderNumber: 'ORD-2024-001241',
    customerName: 'Kavita Joshi',
    date: '2024-12-14T14:00:00Z',
    amount: 78000,
    status: 'completed' as const,
    paymentMethod: 'cash',
  },
]

// ============================================================================
// EXPORT ALL MOCK DATA
// ============================================================================

export default {
  mockSalesTrendData,
  mockRevenueTrendData,
  mockInventoryData,
  mockTopProducts,
  mockSalesByCategoryData,
  mockSalesByPaymentMethodData,
  mockMonthlyComparisonData,
  mockRecentTransactions,
}