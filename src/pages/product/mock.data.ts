// mocks/product.mock.ts
// ⚠️ DELETE THIS FILE WHEN INTEGRATING WITH REAL API
import type {
  Category,
  Product,
  ProductListResponse,
  ProductResponse,
  ProductAnalytics,
  LowStockResponse,
  PaginationMeta,
} from '@/types/product.types';

// ============================================
// DUMMY CATEGORIES
// ============================================
export const dummyCategories: Category[] = [
  {
    _id: '674d8e9f1234567890abcdef',
    parentId: null,
    code: 'RINGS',
    name: { default: 'Rings' },
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    _id: '674d8e9f1234567890abcd01',
    parentId: null,
    code: 'NECKLACES',
    name: { default: 'Necklaces' },
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    _id: '674d8e9f1234567890abcd02',
    parentId: null,
    code: 'EARRINGS',
    name: { default: 'Earrings' },
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    _id: '674d8e9f1234567890abcd03',
    parentId: null,
    code: 'BANGLES',
    name: { default: 'Bangles & Bracelets' },
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    _id: '674d8e9f1234567890abcd05',
    parentId: null,
    code: 'PENDANTS',
    name: { default: 'Pendants' },
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    _id: '674d8e9f1234567890abcd04',
    parentId: '674d8e9f1234567890abcdef',
    code: 'ENGAGEMENT',
    name: { default: 'Engagement Rings' },
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    _id: '674d8e9f1234567890abcd06',
    parentId: '674d8e9f1234567890abcdef',
    code: 'WEDDING',
    name: { default: 'Wedding Bands' },
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
];

// ============================================
// DUMMY PRODUCTS
// ============================================
export const dummyProducts: Product[] = [
  {
    _id: '674d8e9f1234567890abc001',
    organizationId: 'org123',
    shopId: 'shop123',
    productCode: 'PRD000001',
    barcode: '1234567890123',
    sku: 'SKU-RING-001',
    name: 'Diamond Solitaire Engagement Ring',
    description: 'Elegant 18K yellow gold diamond solitaire ring with 1 carat VVS center stone. Perfect for engagements.',
    categoryId: '674d8e9f1234567890abcdef',
    subCategoryId: '674d8e9f1234567890abcd04',
    productType: 'ready_made',
    metal: {
      type: 'gold',
      purity: '18K',
      purityPercentage: 75,
      color: 'yellow',
    },
    weight: {
      grossWeight: 5.5,
      stoneWeight: 0.2,
      netWeight: 5.3,
      wastage: { percentage: 10, weight: 0.53 },
      unit: 'gram',
    },
    stones: [
      {
        stoneType: 'diamond',
        stoneName: 'Round Brilliant Cut',
        stoneQuality: 'VVS',
        stoneColor: 'F',
        stoneShape: 'round',
        stoneCut: 'excellent',
        caratWeight: 1.0,
        pieceCount: 1,
        stonePrice: 250000,
        totalStonePrice: 250000,
      },
    ],
    makingCharges: {
      type: 'per_gram',
      value: 500,
      amount: 2650,
    },
    pricing: {
      metalRate: 6500,
      metalValue: 34450,
      stoneValue: 250000,
      makingCharges: 2650,
      otherCharges: 0,
      subtotal: 287100,
      gst: { percentage: 3, amount: 8613 },
      totalPrice: 295713,
      costPrice: 280000,
      sellingPrice: 295713,
      mrp: 310000,
      discount: { type: 'none', value: 0, amount: 0 },
    },
    stock: {
      quantity: 1,
      unit: 'piece',
      minStockLevel: 0,
      maxStockLevel: 5,
      reorderLevel: 1,
    },
    size: { value: '16', unit: 'mm' },
    hallmarking: {
      isHallmarked: true,
      hallmarkNumber: 'HM123456',
      huid: 'HUID789012',
      bisLicenseNumber: 'BIS2024',
    },
    primaryImage: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600',
        isPrimary: true,
        caption: 'Front view',
        uploadedAt: '2024-01-15T10:00:00Z',
      },
    ],
    gender: 'female',
    occasion: ['engagement', 'wedding'],
    design: {
      designNumber: 'DES-2024-001',
      style: 'modern',
      collection: 'Eternal Love',
    },
    status: 'in_stock',
    isActive: true,
    isFeatured: true,
    isNewArrival: true,
    isBestseller: true,
    saleStatus: 'available',
    tags: ['diamond', 'engagement', 'luxury', 'solitaire'],
    keywords: ['diamond ring', 'engagement ring', 'solitaire'],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    _id: '674d8e9f1234567890abc002',
    organizationId: 'org123',
    shopId: 'shop123',
    productCode: 'PRD000002',
    barcode: '1234567890124',
    sku: 'SKU-NECK-001',
    name: 'Traditional Gold Necklace Set',
    description: '22K gold traditional necklace with intricate design. Includes matching earrings.',
    categoryId: '674d8e9f1234567890abcd01',
    productType: 'ready_made',
    metal: {
      type: 'gold',
      purity: '22K',
      purityPercentage: 91.6,
      color: 'yellow',
    },
    weight: {
      grossWeight: 45.5,
      stoneWeight: 2.5,
      netWeight: 43.0,
      wastage: { percentage: 12, weight: 5.16 },
      unit: 'gram',
    },
    stones: [
      {
        stoneType: 'ruby',
        stoneQuality: 'AA',
        stoneColor: 'Deep Red',
        stoneShape: 'oval',
        pieceCount: 15,
        stonePrice: 2000,
        totalStonePrice: 30000,
      },
    ],
    makingCharges: {
      type: 'per_gram',
      value: 800,
      amount: 34400,
    },
    pricing: {
      metalRate: 6800,
      metalValue: 292400,
      stoneValue: 30000,
      makingCharges: 34400,
      otherCharges: 1000,
      subtotal: 357800,
      gst: { percentage: 3, amount: 10734 },
      totalPrice: 368534,
      costPrice: 350000,
      sellingPrice: 368534,
      mrp: 385000,
      discount: { type: 'percentage', value: 5, amount: 18426.7 },
    },
    stock: {
      quantity: 2,
      unit: 'set',
      minStockLevel: 1,
      maxStockLevel: 5,
      reorderLevel: 1,
    },
    primaryImage: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600',
        isPrimary: true,
        uploadedAt: '2024-01-16T10:00:00Z',
      },
    ],
    gender: 'female',
    occasion: ['wedding', 'festival', 'traditional'],
    design: {
      designNumber: 'DES-2024-002',
      style: 'traditional',
      collection: 'Heritage Collection',
    },
    status: 'in_stock',
    isActive: true,
    isFeatured: true,
    isNewArrival: false,
    isBestseller: true,
    saleStatus: 'available',
    tags: ['gold', 'traditional', 'necklace', 'bridal'],
    createdAt: '2024-01-16T10:00:00Z',
    updatedAt: '2024-01-16T10:00:00Z',
  },
  {
    _id: '674d8e9f1234567890abc003',
    organizationId: 'org123',
    shopId: 'shop123',
    productCode: 'PRD000003',
    barcode: '1234567890125',
    name: 'Pearl Drop Earrings',
    description: 'Elegant white gold earrings with freshwater pearls.',
    categoryId: '674d8e9f1234567890abcd02',
    productType: 'ready_made',
    metal: {
      type: 'gold',
      purity: '18K',
      purityPercentage: 75,
      color: 'white',
    },
    weight: {
      grossWeight: 4.2,
      stoneWeight: 0.5,
      netWeight: 3.7,
      wastage: { percentage: 8, weight: 0.296 },
      unit: 'gram',
    },
    stones: [
      {
        stoneType: 'pearl',
        stoneName: 'Freshwater Pearl',
        stoneQuality: 'AAA',
        stoneShape: 'round',
        pieceCount: 2,
        stonePrice: 5000,
        totalStonePrice: 10000,
      },
    ],
    makingCharges: {
      type: 'flat',
      value: 3500,
      amount: 3500,
    },
    pricing: {
      metalRate: 6500,
      metalValue: 24050,
      stoneValue: 10000,
      makingCharges: 3500,
      otherCharges: 0,
      subtotal: 37550,
      gst: { percentage: 3, amount: 1126.5 },
      totalPrice: 38676.5,
      costPrice: 36000,
      sellingPrice: 38676.5,
      mrp: 42000,
      discount: { type: 'none', value: 0, amount: 0 },
    },
    stock: {
      quantity: 5,
      unit: 'pair',
      minStockLevel: 2,
      maxStockLevel: 10,
      reorderLevel: 3,
    },
    primaryImage: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600',
        isPrimary: true,
        uploadedAt: '2024-01-17T10:00:00Z',
      },
    ],
    gender: 'female',
    occasion: ['party', 'daily_wear'],
    design: {
      designNumber: 'DES-2024-003',
      style: 'modern',
    },
    status: 'in_stock',
    isActive: true,
    isFeatured: false,
    isNewArrival: true,
    isBestseller: false,
    saleStatus: 'available',
    tags: ['pearl', 'earrings', 'white gold'],
    createdAt: '2024-01-17T10:00:00Z',
    updatedAt: '2024-01-17T10:00:00Z',
  },
  {
    _id: '674d8e9f1234567890abc004',
    organizationId: 'org123',
    shopId: 'shop123',
    productCode: 'PRD000004',
    barcode: '1234567890126',
    name: 'Gold Kada Bangle',
    description: 'Solid 22K gold kada bangle with fine finish.',
    categoryId: '674d8e9f1234567890abcd03',
    productType: 'ready_made',
    metal: {
      type: 'gold',
      purity: '22K',
      purityPercentage: 91.6,
      color: 'yellow',
    },
    weight: {
      grossWeight: 65.0,
      stoneWeight: 0,
      netWeight: 65.0,
      wastage: { percentage: 10, weight: 6.5 },
      unit: 'gram',
    },
    makingCharges: {
      type: 'per_gram',
      value: 600,
      amount: 39000,
    },
    pricing: {
      metalRate: 6800,
      metalValue: 442000,
      stoneValue: 0,
      makingCharges: 39000,
      otherCharges: 500,
      subtotal: 481500,
      gst: { percentage: 3, amount: 14445 },
      totalPrice: 495945,
      costPrice: 475000,
      sellingPrice: 495945,
      mrp: 510000,
      discount: { type: 'none', value: 0, amount: 0 },
    },
    stock: {
      quantity: 1,
      unit: 'piece',
      minStockLevel: 0,
      maxStockLevel: 3,
      reorderLevel: 1,
    },
    primaryImage: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600',
        isPrimary: true,
        uploadedAt: '2024-01-18T10:00:00Z',
      },
    ],
    gender: 'unisex',
    occasion: ['daily_wear', 'festival'],
    design: {
      designNumber: 'DES-2024-004',
      style: 'traditional',
    },
    status: 'low_stock',
    isActive: true,
    isFeatured: true,
    isNewArrival: false,
    isBestseller: true,
    saleStatus: 'available',
    tags: ['gold', 'bangle', 'kada'],
    createdAt: '2024-01-18T10:00:00Z',
    updatedAt: '2024-01-18T10:00:00Z',
  },
  {
    _id: '674d8e9f1234567890abc005',
    organizationId: 'org123',
    shopId: 'shop123',
    productCode: 'PRD000005',
    name: 'Silver Chain',
    description: 'Pure 925 silver chain for daily wear.',
    categoryId: '674d8e9f1234567890abcd01',
    productType: 'ready_made',
    metal: {
      type: 'silver',
      purity: '925',
      purityPercentage: 92.5,
      color: 'white',
    },
    weight: {
      grossWeight: 15.0,
      stoneWeight: 0,
      netWeight: 15.0,
      wastage: { percentage: 5, weight: 0.75 },
      unit: 'gram',
    },
    makingCharges: {
      type: 'flat',
      value: 500,
      amount: 500,
    },
    pricing: {
      metalRate: 85,
      metalValue: 1275,
      stoneValue: 0,
      makingCharges: 500,
      otherCharges: 0,
      subtotal: 1775,
      gst: { percentage: 3, amount: 53.25 },
      totalPrice: 1828.25,
      costPrice: 1700,
      sellingPrice: 1828.25,
      mrp: 2000,
      discount: { type: 'none', value: 0, amount: 0 },
    },
    stock: {
      quantity: 0,
      unit: 'piece',
      minStockLevel: 5,
      maxStockLevel: 20,
      reorderLevel: 8,
    },
    primaryImage: 'https://images.unsplash.com/photo-1599459183200-59c7687a0275?w=600',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1599459183200-59c7687a0275?w=600',
        isPrimary: true,
        uploadedAt: '2024-01-19T10:00:00Z',
      },
    ],
    gender: 'unisex',
    occasion: ['daily_wear'],
    design: {
      style: 'modern',
    },
    status: 'out_of_stock',
    isActive: true,
    isFeatured: false,
    isNewArrival: false,
    isBestseller: false,
    saleStatus: 'available',
    tags: ['silver', 'chain'],
    createdAt: '2024-01-19T10:00:00Z',
    updatedAt: '2024-01-19T10:00:00Z',
  },
];

// ============================================
// DUMMY PAGINATION
// ============================================
export const dummyPagination: PaginationMeta = {
  currentPage: 1,
  totalPages: 1,
  pageSize: 20,
  totalItems: dummyProducts.length,
  hasNextPage: false,
  hasPrevPage: false,
};

// ============================================
// DUMMY ANALYTICS
// ============================================
export const dummyAnalytics: ProductAnalytics = {
  overview: {
    totalProducts: 5,
    activeProducts: 5,
    inactiveProducts: 0,
    lowStockCount: 1,
    outOfStockCount: 1,
    totalInventoryValue: 1200722.5,
  },
  categoryBreakdown: [
    {
      _id: '674d8e9f1234567890abcdef',
      categoryName: 'Rings',
      count: 1,
      totalValue: 295713,
    },
    {
      _id: '674d8e9f1234567890abcd01',
      categoryName: 'Necklaces',
      count: 2,
      totalValue: 738362.5,
    },
    {
      _id: '674d8e9f1234567890abcd02',
      categoryName: 'Earrings',
      count: 1,
      totalValue: 193382.5,
    },
    {
      _id: '674d8e9f1234567890abcd03',
      categoryName: 'Bangles & Bracelets',
      count: 1,
      totalValue: 495945,
    },
  ],
};

// ============================================
// HELPER FUNCTIONS TO SIMULATE API
// ============================================

/**
 * Simulate API delay
 */
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Get all products with filters
 */
export const getMockProducts = async (filters?: any): Promise<ProductListResponse> => {
  await delay();
  
  let filteredProducts = [...dummyProducts];
  
  // Apply filters if provided
  if (filters?.search) {
    const search = filters.search.toLowerCase();
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(search) ||
      p.productCode.toLowerCase().includes(search) ||
      p.tags?.some(t => t.toLowerCase().includes(search))
    );
  }
  
  if (filters?.category) {
    filteredProducts = filteredProducts.filter(p => p.categoryId === filters.category);
  }
  
  if (filters?.status) {
    filteredProducts = filteredProducts.filter(p => p.status === filters.status);
  }
  
  if (filters?.metalType) {
    filteredProducts = filteredProducts.filter(p => p.metal.type === filters.metalType);
  }
  
  return {
    success: true,
    message: 'Products retrieved successfully',
    data: filteredProducts,
    pagination: {
      ...dummyPagination,
      totalItems: filteredProducts.length,
    },
  };
};

/**
 * Get single product by ID
 */
export const getMockProductById = async (id: string): Promise<ProductResponse> => {
  await delay();
  
  const product = dummyProducts.find(p => p._id === id);
  
  if (!product) {
    throw new Error('Product not found');
  }
  
  return {
    success: true,
    message: 'Product retrieved successfully',
    data: product,
  };
};

/**
 * Get low stock products
 */
export const getMockLowStockProducts = async (): Promise<LowStockResponse> => {
  await delay();
  
  const lowStockProducts = dummyProducts.filter(p => 
    p.status === 'low_stock' || p.status === 'out_of_stock'
  );
  
  return {
    products: lowStockProducts,
    meta: {
      totalLowStockItems: lowStockProducts.length,
      criticalItems: lowStockProducts.filter(p => p.status === 'out_of_stock').length,
    },
  };
};

/**
 * Get product analytics
 */
export const getMockAnalytics = async (): Promise<ProductAnalytics> => {
  await delay();
  return dummyAnalytics;
};

/**
 * Search products
 */
export const mockSearchProducts = async (query: string): Promise<Product[]> => {
  await delay();
  
  const searchLower = query.toLowerCase();
  return dummyProducts.filter(p =>
    p.name.toLowerCase().includes(searchLower) ||
    p.productCode.toLowerCase().includes(searchLower) ||
    p.barcode?.toLowerCase().includes(searchLower) ||
    p.tags?.some(t => t.toLowerCase().includes(searchLower))
  );
};