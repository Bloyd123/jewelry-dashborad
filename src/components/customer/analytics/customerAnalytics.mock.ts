// FILE: src/components/customers/analytics/customerAnalytics.mock.ts
// Mock Data for Customer Analytics Charts

// Mock data for charts (will be replaced with real data from API)
export const mockGrowthData = [
  { month: 'Jan', customers: 850, newCustomers: 45 },
  { month: 'Feb', customers: 920, newCustomers: 70 },
  { month: 'Mar', customers: 980, newCustomers: 60 },
  { month: 'Apr', customers: 1050, newCustomers: 70 },
  { month: 'May', customers: 1150, newCustomers: 100 },
  { month: 'Jun', customers: 1250, newCustomers: 100 },
]

export const mockRetentionData = [
  { month: 'Jan', rate: 82 },
  { month: 'Feb', rate: 84 },
  { month: 'Mar', rate: 83 },
  { month: 'Apr', rate: 85 },
  { month: 'May', rate: 86 },
  { month: 'Jun', rate: 87 },
]

export const mockTopCustomers = [
  {
    _id: '1',
    customerCode: 'CUST00001',
    fullName: 'Rajesh Kumar',
    phone: '9876543210',
    email: 'rajesh@example.com',
    totalPurchases: 450000,
    loyaltyPoints: 4500,
    membershipTier: 'platinum',
    lastOrderDate: '2024-06-15',
  },
  {
    _id: '2',
    customerCode: 'CUST00023',
    fullName: 'Priya Sharma',
    phone: '9876543211',
    email: 'priya@example.com',
    totalPurchases: 380000,
    loyaltyPoints: 3800,
    membershipTier: 'gold',
    lastOrderDate: '2024-06-14',
  },
  {
    _id: '3',
    customerCode: 'CUST00045',
    fullName: 'Amit Patel',
    phone: '9876543212',
    totalPurchases: 320000,
    loyaltyPoints: 3200,
    membershipTier: 'gold',
    lastOrderDate: '2024-06-13',
  },
  {
    _id: '4',
    customerCode: 'CUST00067',
    fullName: 'Sneha Reddy',
    phone: '9876543213',
    email: 'sneha@example.com',
    totalPurchases: 285000,
    loyaltyPoints: 2850,
    membershipTier: 'silver',
    lastOrderDate: '2024-06-12',
  },
  {
    _id: '5',
    customerCode: 'CUST00089',
    fullName: 'Vikram Singh',
    phone: '9876543214',
    totalPurchases: 250000,
    loyaltyPoints: 2500,
    membershipTier: 'silver',
    lastOrderDate: '2024-06-10',
  },
]

export const mockSegmentationData = {
  byTier: [
    { name: 'Platinum', value: 45 },
    { name: 'Gold', value: 125 },
    { name: 'Silver', value: 280 },
    { name: 'Standard', value: 800 },
  ],
  byType: [
    { name: 'VIP', value: 45 },
    { name: 'Wholesale', value: 180 },
    { name: 'Retail', value: 850 },
    { name: 'Regular', value: 175 },
  ],
  byCategory: [
    { name: 'Gold', value: 520 },
    { name: 'Diamond', value: 380 },
    { name: 'Silver', value: 220 },
    { name: 'Platinum', value: 85 },
    { name: 'Mixed', value: 45 },
  ],
}

export const mockGeographyData = [
  { city: 'Mumbai', customers: 285, revenue: 12500000 },
  { city: 'Delhi', customers: 245, revenue: 10800000 },
  { city: 'Bangalore', customers: 198, revenue: 8900000 },
  { city: 'Hyderabad', customers: 165, revenue: 7200000 },
  { city: 'Chennai', customers: 142, revenue: 6100000 },
  { city: 'Pune', customers: 108, revenue: 4800000 },
  { city: 'Ahmedabad', customers: 87, revenue: 3900000 },
  { city: 'Kolkata', customers: 72, revenue: 3200000 },
]

export const mockPurchasePatternData = [
  { month: 'Jan', orders: 245, revenue: 8500000, averageOrderValue: 34694 },
  { month: 'Feb', orders: 280, revenue: 9800000, averageOrderValue: 35000 },
  { month: 'Mar', orders: 310, revenue: 11200000, averageOrderValue: 36129 },
  { month: 'Apr', orders: 285, revenue: 10100000, averageOrderValue: 35439 },
  { month: 'May', orders: 325, revenue: 12500000, averageOrderValue: 38462 },
  { month: 'Jun', orders: 340, revenue: 13200000, averageOrderValue: 38824 },
]

export const mockRecentEvents = [
  {
    _id: '1',
    customerCode: 'CUST00045',
    customerName: 'Amit Patel',
    eventType: 'anniversary' as const,
    date: '2024-06-20',
    daysUntil: 6,
  },
  {
    _id: '2',
    customerCode: 'CUST00012',
    customerName: 'Neha Singh',
    eventType: 'birthday' as const,
    date: '2024-06-18',
    daysUntil: 4,
  },
  {
    _id: '3',
    customerCode: 'CUST00089',
    customerName: 'Vikram Reddy',
    eventType: 'anniversary' as const,
    date: '2024-06-22',
    daysUntil: 8,
  },
  {
    _id: '4',
    customerCode: 'CUST00156',
    customerName: 'Pooja Sharma',
    eventType: 'birthday' as const,
    date: '2024-06-17',
    daysUntil: 3,
  },
  {
    _id: '5',
    customerCode: 'CUST00203',
    customerName: 'Rahul Gupta',
    eventType: 'signup' as const,
    date: '2024-06-15',
    daysUntil: 1,
  },
]

export const mockAtRiskCustomers = [
  {
    _id: '1',
    customerCode: 'CUST00067',
    fullName: 'Sneha Reddy',
    phone: '9876543213',
    lastOrderDate: '2024-01-15',
    daysSinceLastOrder: 150,
    totalPurchases: 285000,
    riskLevel: 'high' as const,
  },
  {
    _id: '2',
    customerCode: 'CUST00123',
    fullName: 'Karthik Kumar',
    phone: '9876543215',
    lastOrderDate: '2024-02-20',
    daysSinceLastOrder: 114,
    totalPurchases: 195000,
    riskLevel: 'high' as const,
  },
  {
    _id: '3',
    customerCode: 'CUST00178',
    fullName: 'Anita Desai',
    phone: '9876543216',
    lastOrderDate: '2024-03-10',
    daysSinceLastOrder: 96,
    totalPurchases: 165000,
    riskLevel: 'medium' as const,
  },
  {
    _id: '4',
    customerCode: 'CUST00234',
    fullName: 'Suresh Rao',
    phone: '9876543217',
    lastOrderDate: '2024-04-05',
    daysSinceLastOrder: 70,
    totalPurchases: 142000,
    riskLevel: 'medium' as const,
  },
  {
    _id: '5',
    customerCode: 'CUST00289',
    fullName: 'Divya Menon',
    phone: '9876543218',
    lastOrderDate: '2024-04-25',
    daysSinceLastOrder: 50,
    totalPurchases: 98000,
    riskLevel: 'low' as const,
  },
]

export const mockOutstandingPayments = [
  {
    _id: '1',
    customerCode: 'CUST00156',
    fullName: 'Ravi Malhotra',
    phone: '9876543219',
    totalDue: 125000,
    overdueAmount: 85000,
    lastPaymentDate: '2024-04-15',
    daysOverdue: 45,
  },
  {
    _id: '2',
    customerCode: 'CUST00201',
    fullName: 'Meera Iyer',
    phone: '9876543220',
    totalDue: 95000,
    overdueAmount: 65000,
    lastPaymentDate: '2024-05-01',
    daysOverdue: 30,
  },
  {
    _id: '3',
    customerCode: 'CUST00145',
    fullName: 'Arun Nair',
    phone: '9876543221',
    totalDue: 78000,
    overdueAmount: 45000,
    lastPaymentDate: '2024-05-10',
    daysOverdue: 21,
  },
  {
    _id: '4',
    customerCode: 'CUST00267',
    fullName: 'Lakshmi Pillai',
    phone: '9876543222',
    totalDue: 62000,
    overdueAmount: 35000,
    lastPaymentDate: '2024-05-20',
    daysOverdue: 11,
  },
  {
    _id: '5',
    customerCode: 'CUST00312',
    fullName: 'Vijay Joshi',
    phone: '9876543223',
    totalDue: 48000,
    overdueAmount: 25000,
    lastPaymentDate: '2024-05-25',
    daysOverdue: 6,
  },
]
