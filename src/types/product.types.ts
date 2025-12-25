// types/product.types.ts
// ============================================
// CATEGORY TYPES
// ============================================
export interface Category {
  _id: string;
  parentId: string | null;
  code: string;
  name: {
    default: string;
    localized?: Map<string, string>;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// PRODUCT ENUMS & BASIC TYPES
// ============================================
export type MetalType = 'gold' | 'silver' | 'platinum' | 'diamond' | 'gemstone' | 'mixed';
export type MetalPurity = '24K' | '22K' | '18K' | '14K' | '10K' | '916' | '999' | '925' | '850' | '950' | 'other';
export type MetalColor = 'yellow' | 'white' | 'rose' | 'mixed';
export type ProductType = 'ready_made' | 'custom_made' | 'on_order' | 'repair' | 'exchange';
export type WeightUnit = 'gram' | 'kg' | 'tola' | 'ounce' | 'carat';
export type StockUnit = 'piece' | 'pair' | 'set' | 'gram' | 'kg';
export type ProductStatus = 'in_stock' | 'out_of_stock' | 'low_stock' | 'on_order' | 'discontinued' | 'sold';
export type SaleStatus = 'available' | 'reserved' | 'sold' | 'on_hold' | 'returned';
export type Gender = 'male' | 'female' | 'unisex' | 'kids';
export type MakingChargeType = 'per_gram' | 'percentage' | 'flat' | 'none';
export type DiscountType = 'percentage' | 'flat' | 'none';
export type StoneType = 'diamond' | 'ruby' | 'emerald' | 'sapphire' | 'pearl' | 'topaz' | 'amethyst' | 'garnet' | 'other';
export type StoneQuality = 'VS' | 'VVS' | 'SI' | 'IF' | 'FL' | 'A' | 'AA' | 'AAA' | 'B' | 'C';
export type StoneShape = 'round' | 'oval' | 'square' | 'rectangular' | 'pear' | 'marquise' | 'heart' | 'emerald_cut' | 'other';
export type StoneCut = 'excellent' | 'very_good' | 'good' | 'fair' | 'poor';
export type DesignStyle = 'traditional' | 'modern' | 'antique' | 'contemporary' | 'ethnic' | 'western';
export type OccasionType = 'wedding' | 'engagement' | 'party' | 'daily_wear' | 'festival' | 'gift' | 'bridal' | 'traditional' | 'modern' | 'casual';
export type CertificateType = 'hallmark' | 'diamond' | 'gemstone' | 'purity' | 'authenticity' | 'other';
export type WarrantyType = 'lifetime' | 'limited' | 'none';

// ============================================
// NESTED OBJECT TYPES
// ============================================
export interface Metal {
  type: MetalType;
  purity: MetalPurity;
  purityPercentage?: number;
  color: MetalColor;
}

export interface Weight {
  grossWeight: number;
  stoneWeight: number;
  netWeight: number;
  wastage: {
    percentage: number;
    weight: number;
  };
  unit: WeightUnit;
}

export interface Stone {
  _id?: string;
  stoneType: StoneType;
  stoneName?: string;
  stoneQuality?: StoneQuality;
  stoneColor?: string;
  stoneShape?: StoneShape;
  stoneCut?: StoneCut;
  stoneClarity?: string;
  caratWeight?: number;
  stoneWeight?: number;
  pieceCount: number;
  stonePrice: number;
  totalStonePrice: number;
  stoneCertificate?: {
    certificateNumber?: string;
    certificateUrl?: string;
    issuedBy?: string;
  };
}

export interface MakingCharges {
  type: MakingChargeType;
  value: number;
  amount: number;
}

export interface Discount {
  type: DiscountType;
  value: number;
  amount: number;
}

export interface GST {
  percentage: number;
  amount: number;
}

export interface Pricing {
  metalRate: number;
  metalValue: number;
  stoneValue: number;
  makingCharges: number;
  otherCharges: number;
  subtotal: number;
  gst: GST;
  totalPrice: number;
  costPrice: number;
  sellingPrice: number;
  mrp: number;
  discount: Discount;
}

export interface StockLocation {
  warehouse?: string;
  rack?: string;
  shelf?: string;
  bin?: string;
}

export interface Stock {
  quantity: number;
  unit: StockUnit;
  minStockLevel: number;
  maxStockLevel: number;
  reorderLevel: number;
  location?: StockLocation;
}

export interface ProductImage {
  url: string;
  isPrimary: boolean;
  caption?: string;
  uploadedAt: string;
}

export interface Size {
  value: string;
  unit: 'mm' | 'cm' | 'inch';
}

export interface Dimensions {
  length: number;
  width: number;
  height: number;
  unit: 'mm' | 'cm' | 'inch';
}

export interface Hallmarking {
  isHallmarked: boolean;
  hallmarkNumber?: string;
  hallmarkingCenter?: string;
  bisLicenseNumber?: string;
  huid?: string;
  hallmarkDate?: string;
}

export interface SupplierDetails {
  supplierName?: string;
  supplierCode?: string;
  purchaseDate?: string;
  purchasePrice?: number;
  invoiceNumber?: string;
}

export interface Design {
  designNumber?: string;
  designer?: string;
  collection?: string;
  style?: DesignStyle;
  pattern?: string;
}

export interface Warranty {
  hasWarranty: boolean;
  warrantyPeriod: number;
  warrantyType: WarrantyType;
  warrantyTerms?: string;
}

export interface Certificate {
  certificateType: CertificateType;
  certificateNumber?: string;
  issuedBy?: string;
  issueDate?: string;
  expiryDate?: string;
  certificateUrl?: string;
}

export interface ReservedFor {
  customerId: string;
  reservedDate: string;
  expiryDate: string;
}

export interface CustomField {
  fieldName: string;
  fieldValue: any;
}

// ============================================
// MAIN PRODUCT INTERFACE
// ============================================
export interface Product {
  _id: string;
  organizationId: string;
  shopId: string;
  
  // Identification
  productCode: string;
  barcode?: string;
  sku?: string;
  huid?: string;
  
  // Basic Info
  name: string;
  description?: string;
  
  // Category
  categoryId: string | Category;
  subCategoryId?: string | Category;
  productType: ProductType;
  
  // Product Details
  metal: Metal;
  weight: Weight;
  stones?: Stone[];
  makingCharges: MakingCharges;
  pricing: Pricing;
  stock: Stock;
  
  // Physical Attributes
  size?: Size;
  dimensions?: Dimensions;
  hallmarking?: Hallmarking;
  
  // Supplier
  supplierId?: string;
  supplierDetails?: SupplierDetails;
  
  // Media
  images?: ProductImage[];
  primaryImage?: string;
  
  // Classification
  gender: Gender;
  occasion?: OccasionType[];
  design?: Design;
  
  // Warranty & Certificates
  warranty?: Warranty;
  certificates?: Certificate[];
  
  // Status
  status: ProductStatus;
  isActive: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestseller: boolean;
  
  // Sale Status
  saleStatus: SaleStatus;
  soldDate?: string;
  soldTo?: string;
  reservedFor?: ReservedFor;
  
  // Search & Tags
  tags?: string[];
  keywords?: string[];
  searchTerms?: string;
  
  // Custom & Notes
  customFields?: CustomField[];
  notes?: string;
  internalNotes?: string;
  
  // Audit
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
  deletedAt?: string;
}

// ============================================
// API RESPONSE TYPES
// ============================================
export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ProductListResponse extends ApiResponse<Product[]> {
  pagination: PaginationMeta;
}

export interface ProductResponse extends ApiResponse<Product> {}

export interface ProductAnalytics {
  overview: {
    totalProducts: number;
    activeProducts: number;
    inactiveProducts: number;
    lowStockCount: number;
    outOfStockCount: number;
    totalInventoryValue: number;
  };
  categoryBreakdown: {
    _id: string;
    categoryName: string;
    count: number;
    totalValue: number;
  }[];
}

export interface LowStockResponse {
  products: Product[];
  meta: {
    totalLowStockItems: number;
    criticalItems: number;
  };
}

// ============================================
// FILTER & QUERY TYPES
// ============================================
export interface ProductFilters {
  page?: number;
  limit?: number;
  sort?: string;
  category?: string;
  subCategory?: string;
  metalType?: MetalType;
  purity?: MetalPurity;
  status?: ProductStatus;
  saleStatus?: SaleStatus;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  gender?: Gender;
  isActive?: boolean;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestseller?: boolean;
}

// ============================================
// FORM TYPES (for Create/Update)
// ============================================
export interface ProductFormData {
  // Basic Info
  name: string;
  description?: string;
  categoryId: string;
  subCategoryId?: string;
  productType: ProductType;
  
  // Identification
  barcode?: string;
  sku?: string;
  huid?: string;
  
  // Product Details
  metal: Metal;
  weight: Omit<Weight, 'netWeight'>;
  stones?: Omit<Stone, '_id' | 'totalStonePrice'>[];
  makingCharges: Omit<MakingCharges, 'amount'>;
  pricing: Partial<Pricing>;
  stock: Stock;
  
  // Physical Attributes
  size?: Size;
  dimensions?: Dimensions;
  hallmarking?: Hallmarking;
  
  // Supplier
  supplierId?: string;
  supplierDetails?: SupplierDetails;
  
  // Media
  images?: Omit<ProductImage, 'uploadedAt'>[];
  
  // Classification
  gender: Gender;
  occasion?: OccasionType[];
  design?: Design;
  
  // Warranty & Certificates
  warranty?: Warranty;
  certificates?: Certificate[];
  
  // Status
  isActive?: boolean;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestseller?: boolean;
  
  // Search & Tags
  tags?: string[];
  keywords?: string[];
  
  // Custom & Notes
  customFields?: CustomField[];
  notes?: string;
  internalNotes?: string;
}

// ============================================
// STOCK OPERATION TYPES
// ============================================
export type StockOperation = 'add' | 'subtract' | 'set';
export type ReferenceType = 
  | 'product_creation'
  | 'sale'
  | 'purchase'
  | 'return'
  | 'manual_adjustment'
  | 'transfer'
  | 'damage'
  | 'reservation'
  | 'stock_update';

export interface StockUpdateData {
  operation: StockOperation;
  quantity: number;
  reason?: string;
  referenceType?: ReferenceType;
  referenceId?: string;
}

export interface StockUpdateResponse {
  productId: string;
  previousQuantity: number;
  newQuantity: number;
  status: ProductStatus;
  transaction: {
    transactionType: string;
    quantity: number;
    referenceType?: ReferenceType;
    referenceId?: string;
  };
}

// ============================================
// RESERVATION TYPES
// ============================================
export interface ReservationData {
  customerId: string;
  reservationDays?: number;
  notes?: string;
}

export interface ReservationResponse {
  saleStatus: SaleStatus;
  reservedFor: ReservedFor;
}

// ============================================
// SALE TYPES
// ============================================
export interface SaleData {
  customerId: string;
  saleId?: string;
}

export interface SaleResponse {
  saleStatus: SaleStatus;
  soldDate: string;
  stock: Stock;
}

// ============================================
// PRICE CALCULATION TYPES
// ============================================
export interface PriceCalculationData {
  useCurrentRate?: boolean;
  customRate?: number;
}

export interface PriceCalculationResponse {
  oldPrice: number;
  newPrice: number;
  difference: number;
  differencePercentage: number;
  pricing: Pricing;
}

// ============================================
// BULK OPERATION TYPES
// ============================================
export interface BulkDeleteData {
  productIds: string[];
}

export interface BulkDeleteResponse {
  deletedCount: number;
}

export interface BulkUpdateStatusData {
  productIds: string[];
  status: ProductStatus;
}

export interface BulkUpdateStatusResponse {
  modifiedCount: number;
}

// ============================================
// INVENTORY TRANSACTION TYPES
// ============================================
export interface InventoryTransaction {
  _id: string;
  organizationId: string;
  shopId: string;
  productId: string;
  productCode: string;
  transactionType: 'IN' | 'OUT' | 'ADJUSTMENT' | 'RESERVED' | 'UNRESERVED' | 'SALE';
  quantity: number;
  previousQuantity: number;
  newQuantity: number;
  transactionDate: string;
  referenceType: ReferenceType;
  referenceId?: string;
  performedBy: string;
  reason?: string;
  value?: number;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface ProductHistoryResponse {
  product: {
    _id: string;
    name: string;
    productCode: string;
  };
  history: InventoryTransaction[];
}