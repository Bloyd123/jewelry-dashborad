// ============================================================================
// FILE: src/constants/messages.ts
// All application messages - success, error, confirmation, info
// ============================================================================

// ============================================================================
// AUTHENTICATION MESSAGES
// ============================================================================

export const AUTH_MESSAGES = {
  // Success
  LOGIN_SUCCESS: 'Login successful! Welcome back.',
  LOGOUT_SUCCESS: 'Logged out successfully.',
  LOGOUT_ALL_SUCCESS: 'Logged out from all devices successfully.',
  REGISTER_SUCCESS: 'Registration successful! Please verify your email.',
  EMAIL_VERIFIED: 'Email verified successfully! You can now login.',
  PASSWORD_CHANGED: 'Password changed successfully. Please login again.',
  PASSWORD_RESET_SENT: 'Password reset link has been sent to your email.',
  PASSWORD_RESET_SUCCESS:
    'Password reset successful! Please login with your new password.',
  VERIFICATION_EMAIL_SENT: 'Verification email sent successfully.',
  PROFILE_UPDATED: 'Profile updated successfully.',
  SESSION_REVOKED: 'Session revoked successfully.',

  // Errors
  LOGIN_FAILED: 'Login failed. Please check your credentials.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  ACCOUNT_SUSPENDED: 'Your account has been suspended. Please contact support.',
  ACCOUNT_INACTIVE: 'Your account is inactive. Please contact administrator.',
  EMAIL_NOT_VERIFIED: 'Please verify your email address to continue.',
  TOKEN_EXPIRED: 'Your session has expired. Please login again.',
  INVALID_TOKEN: 'Invalid or expired token. Please try again.',
  UNAUTHORIZED: 'You are not authorized to access this resource.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  SESSION_EXPIRED: 'Your session has expired. Please login again.',
  ALREADY_LOGGED_IN: 'You are already logged in.',

  // Validation
  INVALID_EMAIL: 'Please enter a valid email address.',
  PASSWORD_TOO_SHORT: 'Password must be at least 6 characters long.',
  PASSWORD_MISMATCH: 'Passwords do not match.',
  CURRENT_PASSWORD_WRONG: 'Current password is incorrect.',
  WEAK_PASSWORD: 'Password must contain uppercase, lowercase, and numbers.',

  // Info
  LOGOUT_CONFIRM: 'Are you sure you want to logout?',
  LOGOUT_ALL_CONFIRM: 'This will logout from all devices. Continue?',
} as const

// ============================================================================
// USER MANAGEMENT MESSAGES
// ============================================================================

export const USER_MESSAGES = {
  // Success
  USER_CREATED: 'User created successfully.',
  USER_UPDATED: 'User updated successfully.',
  USER_DELETED: 'User deleted successfully.',
  USER_ACTIVATED: 'User activated successfully.',
  USER_DEACTIVATED: 'User deactivated successfully.',
  USER_SUSPENDED: 'User suspended successfully.',
  PERMISSION_GRANTED: 'Permission granted successfully.',
  PERMISSION_REVOKED: 'Permission revoked successfully.',

  // Errors
  USER_NOT_FOUND: 'User not found.',
  USER_ALREADY_EXISTS: 'User with this email already exists.',
  USERNAME_TAKEN: 'Username is already taken.',
  CANNOT_DELETE_SELF: 'You cannot delete your own account.',
  CANNOT_DELETE_LAST_ADMIN: 'Cannot delete the last admin user.',
  INVALID_ROLE: 'Invalid user role.',

  // Confirmation
  DELETE_USER_CONFIRM: 'Are you sure you want to delete this user?',
  DEACTIVATE_USER_CONFIRM: 'Are you sure you want to deactivate this user?',
  SUSPEND_USER_CONFIRM: 'Are you sure you want to suspend this user?',
} as const

// ============================================================================
// SALES MESSAGES
// ============================================================================

export const SALES_MESSAGES = {
  // Success
  SALE_CREATED: 'Sale created successfully.',
  SALE_UPDATED: 'Sale updated successfully.',
  SALE_DELETED: 'Sale deleted successfully.',
  SALE_CANCELLED: 'Sale cancelled successfully.',
  INVOICE_GENERATED: 'Invoice generated successfully.',
  INVOICE_SENT: 'Invoice sent to customer successfully.',
  INVOICE_DOWNLOADED: 'Invoice downloaded successfully.',
  PAYMENT_RECORDED: 'Payment recorded successfully.',

  // Errors
  SALE_NOT_FOUND: 'Sale not found.',
  SALE_ALREADY_CANCELLED: 'Sale is already cancelled.',
  CANNOT_EDIT_COMPLETED_SALE: 'Cannot edit a completed sale.',
  INVALID_SALE_DATA: 'Invalid sale data provided.',
  CUSTOMER_REQUIRED: 'Please select a customer.',
  NO_ITEMS_SELECTED: 'Please add at least one item.',
  INSUFFICIENT_STOCK: 'Insufficient stock available.',

  // Confirmation
  DELETE_SALE_CONFIRM: 'Are you sure you want to delete this sale?',
  CANCEL_SALE_CONFIRM:
    'Are you sure you want to cancel this sale? This action cannot be undone.',
  SEND_INVOICE_CONFIRM: 'Send invoice to customer via email?',
} as const

// ============================================================================
// PURCHASE MESSAGES
// ============================================================================

export const PURCHASE_MESSAGES = {
  // Success
  PURCHASE_CREATED: 'Purchase created successfully.',
  PURCHASE_UPDATED: 'Purchase updated successfully.',
  PURCHASE_DELETED: 'Purchase deleted successfully.',
  PURCHASE_CANCELLED: 'Purchase cancelled successfully.',
  PAYMENT_RECORDED: 'Payment recorded successfully.',

  // Errors
  PURCHASE_NOT_FOUND: 'Purchase not found.',
  PURCHASE_ALREADY_CANCELLED: 'Purchase is already cancelled.',
  CANNOT_EDIT_COMPLETED_PURCHASE: 'Cannot edit a completed purchase.',
  SUPPLIER_REQUIRED: 'Please select a supplier.',
  INVALID_PURCHASE_DATA: 'Invalid purchase data provided.',

  // Confirmation
  DELETE_PURCHASE_CONFIRM: 'Are you sure you want to delete this purchase?',
  CANCEL_PURCHASE_CONFIRM: 'Are you sure you want to cancel this purchase?',
} as const

// ============================================================================
// INVENTORY MESSAGES
// ============================================================================

export const INVENTORY_MESSAGES = {
  // Success
  PRODUCT_CREATED: 'Product created successfully.',
  PRODUCT_UPDATED: 'Product updated successfully.',
  PRODUCT_DELETED: 'Product deleted successfully.',
  STOCK_ADJUSTED: 'Stock adjusted successfully.',
  STOCK_TRANSFERRED: 'Stock transferred successfully.',
  LOW_STOCK_ALERT_SET: 'Low stock alert set successfully.',
  BULK_IMPORT_SUCCESS: 'Products imported successfully.',

  // Errors
  PRODUCT_NOT_FOUND: 'Product not found.',
  PRODUCT_CODE_EXISTS: 'Product code already exists.',
  INSUFFICIENT_STOCK: 'Insufficient stock available.',
  INVALID_QUANTITY: 'Invalid quantity provided.',
  INVALID_WEIGHT: 'Invalid weight provided.',
  CATEGORY_REQUIRED: 'Category is required.',
  METAL_TYPE_REQUIRED: 'Metal type is required.',
  PURITY_REQUIRED: 'Purity is required.',

  // Confirmation
  DELETE_PRODUCT_CONFIRM: 'Are you sure you want to delete this product?',
  ADJUST_STOCK_CONFIRM: 'Are you sure you want to adjust the stock?',
  TRANSFER_STOCK_CONFIRM: 'Confirm stock transfer between shops?',

  // Info
  LOW_STOCK_WARNING: 'Stock is running low for some products.',
  OUT_OF_STOCK_WARNING: 'Some products are out of stock.',
} as const

// ============================================================================
// PARTY (CUSTOMER/SUPPLIER) MESSAGES
// ============================================================================

export const PARTY_MESSAGES = {
  // Success
  CUSTOMER_CREATED: 'Customer created successfully.',
  CUSTOMER_UPDATED: 'Customer updated successfully.',
  CUSTOMER_DELETED: 'Customer deleted successfully.',
  SUPPLIER_CREATED: 'Supplier created successfully.',
  SUPPLIER_UPDATED: 'Supplier updated successfully.',
  SUPPLIER_DELETED: 'Supplier deleted successfully.',

  // Errors
  CUSTOMER_NOT_FOUND: 'Customer not found.',
  SUPPLIER_NOT_FOUND: 'Supplier not found.',
  PHONE_ALREADY_EXISTS: 'Phone number already exists.',
  EMAIL_ALREADY_EXISTS: 'Email already exists.',
  GST_ALREADY_EXISTS: 'GST number already registered.',
  INVALID_GST: 'Invalid GST number format.',
  INVALID_PHONE: 'Invalid phone number format.',

  // Confirmation
  DELETE_CUSTOMER_CONFIRM: 'Are you sure you want to delete this customer?',
  DELETE_SUPPLIER_CONFIRM: 'Are you sure you want to delete this supplier?',
} as const

// ============================================================================
// SCHEME MESSAGES
// ============================================================================

export const SCHEME_MESSAGES = {
  // Success
  SCHEME_CREATED: 'Scheme created successfully.',
  SCHEME_UPDATED: 'Scheme updated successfully.',
  SCHEME_CLOSED: 'Scheme closed successfully.',
  INSTALLMENT_ADDED: 'Installment added successfully.',
  INSTALLMENT_UPDATED: 'Installment updated successfully.',

  // Errors
  SCHEME_NOT_FOUND: 'Scheme not found.',
  SCHEME_ALREADY_CLOSED: 'Scheme is already closed.',
  INVALID_INSTALLMENT_AMOUNT: 'Invalid installment amount.',
  SCHEME_NOT_MATURED: 'Scheme has not matured yet.',
  CANNOT_CLOSE_ACTIVE_SCHEME:
    'Cannot close an active scheme with pending installments.',

  // Confirmation
  CLOSE_SCHEME_CONFIRM: 'Are you sure you want to close this scheme?',
} as const

// ============================================================================
// PAYMENT MESSAGES
// ============================================================================

export const PAYMENT_MESSAGES = {
  // Success
  PAYMENT_SUCCESS: 'Payment processed successfully.',
  PAYMENT_RECORDED: 'Payment recorded successfully.',
  PAYMENT_VERIFIED: 'Payment verified successfully.',
  REFUND_PROCESSED: 'Refund processed successfully.',
  RECEIPT_SENT: 'Receipt sent successfully.',

  // Errors
  PAYMENT_FAILED: 'Payment processing failed. Please try again.',
  PAYMENT_NOT_FOUND: 'Payment not found.',
  INVALID_AMOUNT: 'Invalid payment amount.',
  AMOUNT_EXCEEDS_DUE: 'Payment amount exceeds due amount.',
  PAYMENT_ALREADY_VERIFIED: 'Payment is already verified.',

  // Confirmation
  RECORD_PAYMENT_CONFIRM: 'Confirm payment recording?',
  PROCESS_REFUND_CONFIRM: 'Are you sure you want to process this refund?',
} as const

// ============================================================================
// MASTER DATA MESSAGES
// ============================================================================

export const MASTER_MESSAGES = {
  // Success
  METAL_RATE_UPDATED: 'Metal rates updated successfully.',
  CATEGORY_CREATED: 'Category created successfully.',
  CATEGORY_UPDATED: 'Category updated successfully.',
  CATEGORY_DELETED: 'Category deleted successfully.',
  PURITY_CREATED: 'Purity created successfully.',
  PURITY_UPDATED: 'Purity updated successfully.',
  TAX_RATE_UPDATED: 'Tax rate updated successfully.',
  MAKING_CHARGE_UPDATED: 'Making charges updated successfully.',

  // Errors
  CATEGORY_NOT_FOUND: 'Category not found.',
  CATEGORY_IN_USE: 'Cannot delete category as it is in use.',
  PURITY_NOT_FOUND: 'Purity not found.',
  INVALID_METAL_RATE: 'Invalid metal rate provided.',
  INVALID_TAX_RATE: 'Invalid tax rate. Must be between 0 and 100.',

  // Confirmation
  DELETE_CATEGORY_CONFIRM: 'Are you sure you want to delete this category?',
  UPDATE_METAL_RATE_CONFIRM: 'Update metal rates for today?',
} as const

// ============================================================================
// REPORT MESSAGES
// ============================================================================

export const REPORT_MESSAGES = {
  // Success
  REPORT_GENERATED: 'Report generated successfully.',
  REPORT_EXPORTED: 'Report exported successfully.',
  REPORT_SENT: 'Report sent via email successfully.',

  // Errors
  REPORT_GENERATION_FAILED: 'Failed to generate report. Please try again.',
  NO_DATA_AVAILABLE: 'No data available for the selected criteria.',
  INVALID_DATE_RANGE: 'Invalid date range selected.',
  START_DATE_REQUIRED: 'Start date is required.',
  END_DATE_REQUIRED: 'End date is required.',
  DATE_RANGE_TOO_LARGE: 'Date range cannot exceed 1 year.',

  // Info
  GENERATING_REPORT: 'Generating report... Please wait.',
  REPORT_READY: 'Your report is ready for download.',
} as const

// ============================================================================
// ORGANIZATION/SHOP MESSAGES
// ============================================================================

export const ORGANIZATION_MESSAGES = {
  // Success
  ORGANIZATION_CREATED: 'Organization created successfully.',
  ORGANIZATION_UPDATED: 'Organization updated successfully.',
  ORGANIZATION_DELETED: 'Organization deleted successfully.',
  SHOP_CREATED: 'Shop created successfully.',
  SHOP_UPDATED: 'Shop updated successfully.',
  SHOP_DELETED: 'Shop deleted successfully.',
  SETTINGS_UPDATED: 'Settings updated successfully.',
  SUBSCRIPTION_UPDATED: 'Subscription updated successfully.',

  // Errors
  ORGANIZATION_NOT_FOUND: 'Organization not found.',
  SHOP_NOT_FOUND: 'Shop not found.',
  SHOP_CODE_EXISTS: 'Shop code already exists.',
  SUBSCRIPTION_EXPIRED:
    'Your subscription has expired. Please renew to continue.',
  SUBSCRIPTION_LIMIT_REACHED: 'You have reached your subscription limit.',
  CANNOT_DELETE_LAST_SHOP: 'Cannot delete the only shop.',

  // Confirmation
  DELETE_ORGANIZATION_CONFIRM:
    'Are you sure you want to delete this organization? All data will be lost.',
  DELETE_SHOP_CONFIRM: 'Are you sure you want to delete this shop?',
} as const

// ============================================================================
// GENERAL MESSAGES
// ============================================================================

export const GENERAL_MESSAGES = {
  // Success
  SAVED: 'Saved successfully.',
  UPDATED: 'Updated successfully.',
  DELETED: 'Deleted successfully.',
  CREATED: 'Created successfully.',
  UPLOADED: 'File uploaded successfully.',
  COPIED: 'Copied to clipboard.',
  SENT: 'Sent successfully.',

  // Errors
  SOMETHING_WENT_WRONG: 'Something went wrong. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your internet connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  PERMISSION_DENIED: 'You do not have permission to perform this action.',
  INVALID_INPUT: 'Invalid input provided.',
  REQUIRED_FIELD: 'This field is required.',
  INVALID_FORMAT: 'Invalid format.',
  FILE_TOO_LARGE: 'File size is too large. Maximum size is 5MB.',
  INVALID_FILE_TYPE: 'Invalid file type. Please upload a valid file.',

  // Confirmation
  CONFIRM_DELETE: 'Are you sure you want to delete this?',
  CONFIRM_CANCEL: 'Are you sure you want to cancel?',
  UNSAVED_CHANGES: 'You have unsaved changes. Do you want to leave?',
  CONFIRM_ACTION: 'Are you sure you want to proceed?',

  // Info
  LOADING: 'Loading...',
  PROCESSING: 'Processing...',
  PLEASE_WAIT: 'Please wait...',
  NO_DATA: 'No data available.',
  NO_RESULTS: 'No results found.',
  SEARCH_EMPTY: 'No results found for your search.',
  COMING_SOON: 'This feature is coming soon.',
  UNDER_MAINTENANCE: 'System is under maintenance. Please try again later.',
} as const

// ============================================================================
// VALIDATION MESSAGES
// ============================================================================

export const VALIDATION_MESSAGES = {
  // Required Fields
  FIELD_REQUIRED: (field: string) => `${field} is required.`,
  NAME_REQUIRED: 'Name is required.',
  PHONE_REQUIRED: 'Phone number is required.',

  // Format Validation
  INVALID_EMAIL: 'Please enter a valid email address.',
  INVALID_PHONE: 'Please enter a valid phone number (10 digits).',
  INVALID_GST: 'Please enter a valid GST number.',
  INVALID_DATE: 'Please enter a valid date.',
  INVALID_NUMBER: 'Please enter a valid number.',
  INVALID_URL: 'Please enter a valid URL.',

  // Length Validation
  MIN_LENGTH: (field: string, length: number) =>
    `${field} must be at least ${length} characters.`,
  MAX_LENGTH: (field: string, length: number) =>
    `${field} cannot exceed ${length} characters.`,

  // Range Validation
  MIN_VALUE: (field: string, min: number) =>
    `${field} must be at least ${min}.`,
  MAX_VALUE: (field: string, max: number) => `${field} cannot exceed ${max}.`,
  OUT_OF_RANGE: (field: string, min: number, max: number) =>
    `${field} must be between ${min} and ${max}.`,

  // Password Validation
  PASSWORD_WEAK:
    'Password must contain at least one uppercase letter, one lowercase letter, and one number.',
  PASSWORD_MISMATCH: 'Passwords do not match.',

  // Custom Validation
  POSITIVE_NUMBER: 'Value must be a positive number.',
  GREATER_THAN_ZERO: 'Value must be greater than zero.',
  INVALID_QUANTITY: 'Please enter a valid quantity.',
  INVALID_WEIGHT: 'Please enter a valid weight.',
  INVALID_PRICE: 'Please enter a valid price.',
  FUTURE_DATE_NOT_ALLOWED: 'Future date is not allowed.',
  PAST_DATE_NOT_ALLOWED: 'Past date is not allowed.',
} as const

// ============================================================================
// NOTIFICATION MESSAGES
// ============================================================================

export const NOTIFICATION_MESSAGES = {
  NEW_SALE: 'New sale created',
  NEW_ORDER: 'New order received',
  PAYMENT_RECEIVED: 'Payment received',
  LOW_STOCK_ALERT: 'Low stock alert',
  SUBSCRIPTION_EXPIRING: 'Your subscription is expiring soon',
  SUBSCRIPTION_EXPIRED: 'Your subscription has expired',
  NEW_USER_REGISTERED: 'New user registered',
  METAL_RATE_UPDATED: 'Metal rates updated',
} as const

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get confirmation message
 */
export function getConfirmMessage(action: string, entity: string): string {
  return `Are you sure you want to ${action} this ${entity}?`
}

/**
 * Get success message
 */
export function getSuccessMessage(action: string, entity: string): string {
  return `${entity} ${action} successfully.`
}

/**
 * Get error message
 */
export function getErrorMessage(entity: string): string {
  return `Failed to process ${entity}. Please try again.`
}

/**
 * Get not found message
 */
export function getNotFoundMessage(entity: string): string {
  return `${entity} not found.`
}

/**
 * Get validation message for required field
 */
export function getRequiredMessage(field: string): string {
  return `${field} is required.`
}

/**
 * Get duplicate error message
 */
export function getDuplicateMessage(field: string): string {
  return `${field} already exists.`
}

// ============================================================================
// MESSAGE CATEGORIES (for easy access)
// ============================================================================

export const MESSAGES = {
  AUTH: AUTH_MESSAGES,
  USER: USER_MESSAGES,
  SALES: SALES_MESSAGES,
  PURCHASE: PURCHASE_MESSAGES,
  INVENTORY: INVENTORY_MESSAGES,
  PARTY: PARTY_MESSAGES,
  SCHEME: SCHEME_MESSAGES,
  PAYMENT: PAYMENT_MESSAGES,
  MASTER: MASTER_MESSAGES,
  REPORT: REPORT_MESSAGES,
  ORGANIZATION: ORGANIZATION_MESSAGES,
  GENERAL: GENERAL_MESSAGES,
  VALIDATION: VALIDATION_MESSAGES,
  NOTIFICATION: NOTIFICATION_MESSAGES,
} as const

// ============================================================================
// EXPORT ALL
// ============================================================================

export default MESSAGES
