// ============================================================================
// FILE: src/constants/status.ts
// All status enums and constants for the application
// ============================================================================

// ============================================================================
// USER STATUS
// ============================================================================

/**
 * User Account Status
 */
export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING_VERIFICATION = 'pending_verification',
  LOCKED = 'locked',
}

/**
 * User Status Labels (for UI display)
 */
export const USER_STATUS_LABELS: Record<UserStatus, string> = {
  [UserStatus.ACTIVE]: 'Active',
  [UserStatus.INACTIVE]: 'Inactive',
  [UserStatus.SUSPENDED]: 'Suspended',
  [UserStatus.PENDING_VERIFICATION]: 'Pending Verification',
  [UserStatus.LOCKED]: 'Locked',
};

/**
 * User Status Colors (for badges)
 */
export const USER_STATUS_COLORS: Record<UserStatus, string> = {
  [UserStatus.ACTIVE]: 'green',
  [UserStatus.INACTIVE]: 'gray',
  [UserStatus.SUSPENDED]: 'red',
  [UserStatus.PENDING_VERIFICATION]: 'yellow',
  [UserStatus.LOCKED]: 'orange',
};

// ============================================================================
// ORDER/SALE STATUS
// ============================================================================

/**
 * Order Status
 */
export enum OrderStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  READY = 'ready',
  DELIVERED = 'delivered',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  RETURNED = 'returned',
  REFUNDED = 'refunded',
}

/**
 * Order Status Labels
 */
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  [OrderStatus.DRAFT]: 'Draft',
  [OrderStatus.PENDING]: 'Pending',
  [OrderStatus.CONFIRMED]: 'Confirmed',
  [OrderStatus.PROCESSING]: 'Processing',
  [OrderStatus.READY]: 'Ready for Delivery',
  [OrderStatus.DELIVERED]: 'Delivered',
  [OrderStatus.COMPLETED]: 'Completed',
  [OrderStatus.CANCELLED]: 'Cancelled',
  [OrderStatus.RETURNED]: 'Returned',
  [OrderStatus.REFUNDED]: 'Refunded',
};

/**
 * Order Status Colors
 */
export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  [OrderStatus.DRAFT]: 'gray',
  [OrderStatus.PENDING]: 'yellow',
  [OrderStatus.CONFIRMED]: 'blue',
  [OrderStatus.PROCESSING]: 'purple',
  [OrderStatus.READY]: 'cyan',
  [OrderStatus.DELIVERED]: 'green',
  [OrderStatus.COMPLETED]: 'green',
  [OrderStatus.CANCELLED]: 'red',
  [OrderStatus.RETURNED]: 'orange',
  [OrderStatus.REFUNDED]: 'pink',
};

/**
 * Order Status Flow (for progress tracking)
 */
export const ORDER_STATUS_FLOW = [
  OrderStatus.DRAFT,
  OrderStatus.PENDING,
  OrderStatus.CONFIRMED,
  OrderStatus.PROCESSING,
  OrderStatus.READY,
  OrderStatus.DELIVERED,
  OrderStatus.COMPLETED,
] as const;

// ============================================================================
// PAYMENT STATUS
// ============================================================================

/**
 * Payment Status
 */
export enum PaymentStatus {
  UNPAID = 'unpaid',
  PARTIAL = 'partial',
  PAID = 'paid',
  OVERPAID = 'overpaid',
  REFUNDED = 'refunded',
  FAILED = 'failed',
  PENDING = 'pending',
  PROCESSING = 'processing',
  CANCELLED = 'cancelled',
}

/**
 * Payment Status Labels
 */
export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  [PaymentStatus.UNPAID]: 'Unpaid',
  [PaymentStatus.PARTIAL]: 'Partially Paid',
  [PaymentStatus.PAID]: 'Paid',
  [PaymentStatus.OVERPAID]: 'Overpaid',
  [PaymentStatus.REFUNDED]: 'Refunded',
  [PaymentStatus.FAILED]: 'Failed',
  [PaymentStatus.PENDING]: 'Pending',
  [PaymentStatus.PROCESSING]: 'Processing',
  [PaymentStatus.CANCELLED]: 'Cancelled',
};

/**
 * Payment Status Colors
 */
export const PAYMENT_STATUS_COLORS: Record<PaymentStatus, string> = {
  [PaymentStatus.UNPAID]: 'red',
  [PaymentStatus.PARTIAL]: 'yellow',
  [PaymentStatus.PAID]: 'green',
  [PaymentStatus.OVERPAID]: 'blue',
  [PaymentStatus.REFUNDED]: 'purple',
  [PaymentStatus.FAILED]: 'red',
  [PaymentStatus.PENDING]: 'orange',
  [PaymentStatus.PROCESSING]: 'blue',
  [PaymentStatus.CANCELLED]: 'gray',
};

// ============================================================================
// PRODUCT/INVENTORY STATUS
// ============================================================================

/**
 * Product Status
 */
export enum ProductStatus {
  IN_STOCK = 'in_stock',
  OUT_OF_STOCK = 'out_of_stock',
  LOW_STOCK = 'low_stock',
  DISCONTINUED = 'discontinued',
  COMING_SOON = 'coming_soon',
  DRAFT = 'draft',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

/**
 * Product Status Labels
 */
export const PRODUCT_STATUS_LABELS: Record<ProductStatus, string> = {
  [ProductStatus.IN_STOCK]: 'In Stock',
  [ProductStatus.OUT_OF_STOCK]: 'Out of Stock',
  [ProductStatus.LOW_STOCK]: 'Low Stock',
  [ProductStatus.DISCONTINUED]: 'Discontinued',
  [ProductStatus.COMING_SOON]: 'Coming Soon',
  [ProductStatus.DRAFT]: 'Draft',
  [ProductStatus.ACTIVE]: 'Active',
  [ProductStatus.INACTIVE]: 'Inactive',
};

/**
 * Product Status Colors
 */
export const PRODUCT_STATUS_COLORS: Record<ProductStatus, string> = {
  [ProductStatus.IN_STOCK]: 'green',
  [ProductStatus.OUT_OF_STOCK]: 'red',
  [ProductStatus.LOW_STOCK]: 'yellow',
  [ProductStatus.DISCONTINUED]: 'gray',
  [ProductStatus.COMING_SOON]: 'blue',
  [ProductStatus.DRAFT]: 'gray',
  [ProductStatus.ACTIVE]: 'green',
  [ProductStatus.INACTIVE]: 'red',
};

// ============================================================================
// INVOICE STATUS
// ============================================================================

/**
 * Invoice Status
 */
export enum InvoiceStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  SENT = 'sent',
  VIEWED = 'viewed',
  PARTIAL = 'partial',
  PAID = 'paid',
  OVERDUE = 'overdue',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

/**
 * Invoice Status Labels
 */
export const INVOICE_STATUS_LABELS: Record<InvoiceStatus, string> = {
  [InvoiceStatus.DRAFT]: 'Draft',
  [InvoiceStatus.PENDING]: 'Pending',
  [InvoiceStatus.SENT]: 'Sent',
  [InvoiceStatus.VIEWED]: 'Viewed',
  [InvoiceStatus.PARTIAL]: 'Partially Paid',
  [InvoiceStatus.PAID]: 'Paid',
  [InvoiceStatus.OVERDUE]: 'Overdue',
  [InvoiceStatus.CANCELLED]: 'Cancelled',
  [InvoiceStatus.REFUNDED]: 'Refunded',
};

/**
 * Invoice Status Colors
 */
export const INVOICE_STATUS_COLORS: Record<InvoiceStatus, string> = {
  [InvoiceStatus.DRAFT]: 'gray',
  [InvoiceStatus.PENDING]: 'yellow',
  [InvoiceStatus.SENT]: 'blue',
  [InvoiceStatus.VIEWED]: 'cyan',
  [InvoiceStatus.PARTIAL]: 'orange',
  [InvoiceStatus.PAID]: 'green',
  [InvoiceStatus.OVERDUE]: 'red',
  [InvoiceStatus.CANCELLED]: 'gray',
  [InvoiceStatus.REFUNDED]: 'purple',
};

// ============================================================================
// SCHEME STATUS (Jewelry Schemes)
// ============================================================================

/**
 * Scheme Status
 */
export enum SchemeStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  MATURED = 'matured',
  CLOSED = 'closed',
}

/**
 * Scheme Status Labels
 */
export const SCHEME_STATUS_LABELS: Record<SchemeStatus, string> = {
  [SchemeStatus.ACTIVE]: 'Active',
  [SchemeStatus.PAUSED]: 'Paused',
  [SchemeStatus.COMPLETED]: 'Completed',
  [SchemeStatus.CANCELLED]: 'Cancelled',
  [SchemeStatus.MATURED]: 'Matured',
  [SchemeStatus.CLOSED]: 'Closed',
};

/**
 * Scheme Status Colors
 */
export const SCHEME_STATUS_COLORS: Record<SchemeStatus, string> = {
  [SchemeStatus.ACTIVE]: 'green',
  [SchemeStatus.PAUSED]: 'yellow',
  [SchemeStatus.COMPLETED]: 'blue',
  [SchemeStatus.CANCELLED]: 'red',
  [SchemeStatus.MATURED]: 'purple',
  [SchemeStatus.CLOSED]: 'gray',
};

// ============================================================================
// ORGANIZATION/SHOP STATUS
// ============================================================================

/**
 * Organization Status
 */
export enum OrganizationStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  TRIAL = 'trial',
  EXPIRED = 'expired',
  PENDING = 'pending',
}

/**
 * Organization Status Labels
 */
export const ORGANIZATION_STATUS_LABELS: Record<OrganizationStatus, string> = {
  [OrganizationStatus.ACTIVE]: 'Active',
  [OrganizationStatus.INACTIVE]: 'Inactive',
  [OrganizationStatus.SUSPENDED]: 'Suspended',
  [OrganizationStatus.TRIAL]: 'Trial',
  [OrganizationStatus.EXPIRED]: 'Expired',
  [OrganizationStatus.PENDING]: 'Pending',
};

/**
 * Organization Status Colors
 */
export const ORGANIZATION_STATUS_COLORS: Record<OrganizationStatus, string> = {
  [OrganizationStatus.ACTIVE]: 'green',
  [OrganizationStatus.INACTIVE]: 'gray',
  [OrganizationStatus.SUSPENDED]: 'red',
  [OrganizationStatus.TRIAL]: 'blue',
  [OrganizationStatus.EXPIRED]: 'orange',
  [OrganizationStatus.PENDING]: 'yellow',
};

/**
 * Shop Status
 */
export enum ShopStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  CLOSED = 'closed',
  MAINTENANCE = 'maintenance',
}

/**
 * Shop Status Labels
 */
export const SHOP_STATUS_LABELS: Record<ShopStatus, string> = {
  [ShopStatus.ACTIVE]: 'Active',
  [ShopStatus.INACTIVE]: 'Inactive',
  [ShopStatus.CLOSED]: 'Closed',
  [ShopStatus.MAINTENANCE]: 'Under Maintenance',
};

/**
 * Shop Status Colors
 */
export const SHOP_STATUS_COLORS: Record<ShopStatus, string> = {
  [ShopStatus.ACTIVE]: 'green',
  [ShopStatus.INACTIVE]: 'gray',
  [ShopStatus.CLOSED]: 'red',
  [ShopStatus.MAINTENANCE]: 'yellow',
};

// ============================================================================
// SUBSCRIPTION STATUS
// ============================================================================

/**
 * Subscription Status
 */
export enum SubscriptionStatus {
  ACTIVE = 'active',
  TRIAL = 'trial',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
  SUSPENDED = 'suspended',
  PAST_DUE = 'past_due',
  PENDING = 'pending',
}

/**
 * Subscription Status Labels
 */
export const SUBSCRIPTION_STATUS_LABELS: Record<SubscriptionStatus, string> = {
  [SubscriptionStatus.ACTIVE]: 'Active',
  [SubscriptionStatus.TRIAL]: 'Trial',
  [SubscriptionStatus.EXPIRED]: 'Expired',
  [SubscriptionStatus.CANCELLED]: 'Cancelled',
  [SubscriptionStatus.SUSPENDED]: 'Suspended',
  [SubscriptionStatus.PAST_DUE]: 'Past Due',
  [SubscriptionStatus.PENDING]: 'Pending',
};

/**
 * Subscription Status Colors
 */
export const SUBSCRIPTION_STATUS_COLORS: Record<SubscriptionStatus, string> = {
  [SubscriptionStatus.ACTIVE]: 'green',
  [SubscriptionStatus.TRIAL]: 'blue',
  [SubscriptionStatus.EXPIRED]: 'red',
  [SubscriptionStatus.CANCELLED]: 'gray',
  [SubscriptionStatus.SUSPENDED]: 'orange',
  [SubscriptionStatus.PAST_DUE]: 'yellow',
  [SubscriptionStatus.PENDING]: 'blue',
};

// ============================================================================
// TRANSACTION STATUS
// ============================================================================

/**
 * Transaction Status
 */
export enum TransactionStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

/**
 * Transaction Status Labels
 */
export const TRANSACTION_STATUS_LABELS: Record<TransactionStatus, string> = {
  [TransactionStatus.PENDING]: 'Pending',
  [TransactionStatus.PROCESSING]: 'Processing',
  [TransactionStatus.COMPLETED]: 'Completed',
  [TransactionStatus.FAILED]: 'Failed',
  [TransactionStatus.CANCELLED]: 'Cancelled',
  [TransactionStatus.REFUNDED]: 'Refunded',
};

/**
 * Transaction Status Colors
 */
export const TRANSACTION_STATUS_COLORS: Record<TransactionStatus, string> = {
  [TransactionStatus.PENDING]: 'yellow',
  [TransactionStatus.PROCESSING]: 'blue',
  [TransactionStatus.COMPLETED]: 'green',
  [TransactionStatus.FAILED]: 'red',
  [TransactionStatus.CANCELLED]: 'gray',
  [TransactionStatus.REFUNDED]: 'purple',
};

// ============================================================================
// NOTIFICATION STATUS
// ============================================================================

/**
 * Notification Status
 */
export enum NotificationStatus {
  UNREAD = 'unread',
  READ = 'read',
  ARCHIVED = 'archived',
}

/**
 * Notification Status Labels
 */
export const NOTIFICATION_STATUS_LABELS: Record<NotificationStatus, string> = {
  [NotificationStatus.UNREAD]: 'Unread',
  [NotificationStatus.READ]: 'Read',
  [NotificationStatus.ARCHIVED]: 'Archived',
};

// ============================================================================
// ACTIVITY LOG STATUS
// ============================================================================

/**
 * Activity Status
 */
export enum ActivityStatus {
  SUCCESS = 'success',
  FAILED = 'failed',
  PENDING = 'pending',
  WARNING = 'warning',
}

/**
 * Activity Status Labels
 */
export const ACTIVITY_STATUS_LABELS: Record<ActivityStatus, string> = {
  [ActivityStatus.SUCCESS]: 'Success',
  [ActivityStatus.FAILED]: 'Failed',
  [ActivityStatus.PENDING]: 'Pending',
  [ActivityStatus.WARNING]: 'Warning',
};

/**
 * Activity Status Colors
 */
export const ACTIVITY_STATUS_COLORS: Record<ActivityStatus, string> = {
  [ActivityStatus.SUCCESS]: 'green',
  [ActivityStatus.FAILED]: 'red',
  [ActivityStatus.PENDING]: 'yellow',
  [ActivityStatus.WARNING]: 'orange',
};

// ============================================================================
// APPROVAL STATUS
// ============================================================================

/**
 * Approval Status
 */
export enum ApprovalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  REVISION_REQUIRED = 'revision_required',
}

/**
 * Approval Status Labels
 */
export const APPROVAL_STATUS_LABELS: Record<ApprovalStatus, string> = {
  [ApprovalStatus.PENDING]: 'Pending Approval',
  [ApprovalStatus.APPROVED]: 'Approved',
  [ApprovalStatus.REJECTED]: 'Rejected',
  [ApprovalStatus.REVISION_REQUIRED]: 'Revision Required',
};

/**
 * Approval Status Colors
 */
export const APPROVAL_STATUS_COLORS: Record<ApprovalStatus, string> = {
  [ApprovalStatus.PENDING]: 'yellow',
  [ApprovalStatus.APPROVED]: 'green',
  [ApprovalStatus.REJECTED]: 'red',
  [ApprovalStatus.REVISION_REQUIRED]: 'orange',
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get status label
 */
export function getStatusLabel(status: string, type: string): string {
  const labelMaps: Record<string, Record<string, string>> = {
    user: USER_STATUS_LABELS,
    order: ORDER_STATUS_LABELS,
    payment: PAYMENT_STATUS_LABELS,
    product: PRODUCT_STATUS_LABELS,
    invoice: INVOICE_STATUS_LABELS,
    scheme: SCHEME_STATUS_LABELS,
    organization: ORGANIZATION_STATUS_LABELS,
    shop: SHOP_STATUS_LABELS,
    subscription: SUBSCRIPTION_STATUS_LABELS,
    transaction: TRANSACTION_STATUS_LABELS,
    notification: NOTIFICATION_STATUS_LABELS,
    activity: ACTIVITY_STATUS_LABELS,
    approval: APPROVAL_STATUS_LABELS,
  };

  return labelMaps[type]?.[status] || status;
}

/**
 * Get status color
 */
export function getStatusColor(status: string, type: string): string {
  const colorMaps: Record<string, Record<string, string>> = {
    user: USER_STATUS_COLORS,
    order: ORDER_STATUS_COLORS,
    payment: PAYMENT_STATUS_COLORS,
    product: PRODUCT_STATUS_COLORS,
    invoice: INVOICE_STATUS_COLORS,
    scheme: SCHEME_STATUS_COLORS,
    organization: ORGANIZATION_STATUS_COLORS,
    shop: SHOP_STATUS_COLORS,
    subscription: SUBSCRIPTION_STATUS_COLORS,
    transaction: TRANSACTION_STATUS_COLORS,
    activity: ACTIVITY_STATUS_COLORS,
    approval: APPROVAL_STATUS_COLORS,
  };

  return colorMaps[type]?.[status] || 'gray';
}

/**
 * Check if status is active/positive
 */
export function isActiveStatus(status: string): boolean {
  const activeStatuses = [
    UserStatus.ACTIVE,
    OrderStatus.COMPLETED,
    PaymentStatus.PAID,
    ProductStatus.IN_STOCK,
    InvoiceStatus.PAID,
    SchemeStatus.ACTIVE,
    OrganizationStatus.ACTIVE,
    ShopStatus.ACTIVE,
    SubscriptionStatus.ACTIVE,
    TransactionStatus.COMPLETED,
    ActivityStatus.SUCCESS,
    ApprovalStatus.APPROVED,
  ];

  return activeStatuses.includes(status as any);
}

/**
 * Check if status is negative/error
 */
export function isErrorStatus(status: string): boolean {
  const errorStatuses = [
    UserStatus.SUSPENDED,
    UserStatus.LOCKED,
    OrderStatus.CANCELLED,
    PaymentStatus.FAILED,
    ProductStatus.OUT_OF_STOCK,
    InvoiceStatus.CANCELLED,
    SchemeStatus.CANCELLED,
    OrganizationStatus.SUSPENDED,
    ShopStatus.CLOSED,
    SubscriptionStatus.EXPIRED,
    TransactionStatus.FAILED,
    ActivityStatus.FAILED,
    ApprovalStatus.REJECTED,
  ];

  return errorStatuses.includes(status as any);
}

/**
 * Check if status is pending/warning
 */
export function isPendingStatus(status: string): boolean {
  const pendingStatuses = [
    UserStatus.PENDING_VERIFICATION,
    OrderStatus.PENDING,
    PaymentStatus.PENDING,
    ProductStatus.LOW_STOCK,
    InvoiceStatus.PENDING,
    SchemeStatus.PAUSED,
    OrganizationStatus.TRIAL,
    SubscriptionStatus.TRIAL,
    TransactionStatus.PENDING,
    ActivityStatus.PENDING,
    ApprovalStatus.PENDING,
  ];

  return pendingStatuses.includes(status as any);
}

// ============================================================================
// EXPORT ALL
// ============================================================================

export default {
  // Enums
  UserStatus,
  OrderStatus,
  PaymentStatus,
  ProductStatus,
  InvoiceStatus,
  SchemeStatus,
  OrganizationStatus,
  ShopStatus,
  SubscriptionStatus,
  TransactionStatus,
  NotificationStatus,
  ActivityStatus,
  ApprovalStatus,

  // Labels
  USER_STATUS_LABELS,
  ORDER_STATUS_LABELS,
  PAYMENT_STATUS_LABELS,
  PRODUCT_STATUS_LABELS,
  INVOICE_STATUS_LABELS,
  SCHEME_STATUS_LABELS,
  ORGANIZATION_STATUS_LABELS,
  SHOP_STATUS_LABELS,
  SUBSCRIPTION_STATUS_LABELS,
  TRANSACTION_STATUS_LABELS,
  NOTIFICATION_STATUS_LABELS,
  ACTIVITY_STATUS_LABELS,
  APPROVAL_STATUS_LABELS,

  // Colors
  USER_STATUS_COLORS,
  ORDER_STATUS_COLORS,
  PAYMENT_STATUS_COLORS,
  PRODUCT_STATUS_COLORS,
  INVOICE_STATUS_COLORS,
  SCHEME_STATUS_COLORS,
  ORGANIZATION_STATUS_COLORS,
  SHOP_STATUS_COLORS,
  SUBSCRIPTION_STATUS_COLORS,
  TRANSACTION_STATUS_COLORS,
  ACTIVITY_STATUS_COLORS,
  APPROVAL_STATUS_COLORS,

  // Helpers
  getStatusLabel,
  getStatusColor,
  isActiveStatus,
  isErrorStatus,
  isPendingStatus,
};