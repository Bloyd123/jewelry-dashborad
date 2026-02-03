# 📚 Customer Module - Developer Documentation
## Complete Integration Guide for Development Teams

> **Version:** 1.0.0  
> **Last Updated:** January 2026  
> **Module Status:** ✅ Production Ready  
> **Backend Alignment:** 100%

---

## 📋 Table of Contents

1. [Quick Start](#-quick-start)
2. [Architecture Overview](#-architecture-overview)
3. [File Structure](#-file-structure)
4. [API Reference](#-api-reference)
5. [Type Definitions](#-type-definitions)
6. [Utility Functions](#-utility-functions)
7. [Component Integration](#-component-integration)
8. [Error Handling](#-error-handling)
9. [Best Practices](#-best-practices)
10. [Team Workflow](#-team-workflow)
11. [Common Patterns](#-common-patterns)
12. [Troubleshooting](#-troubleshooting)

---

## 🚀 Quick Start

### For Developers (30 Second Setup)

```typescript
// 1. Import the custom hook
import { useCustomer } from '@/features/customer/hooks/useCustomer'

// 2. Use in your component
const MyComponent = () => {
  const shopId = 'your-shop-id'
  
  const {
    customers,           // ✅ Customer list
    isLoading,          // ✅ Loading state
    createCustomer,     // ✅ Create function
    updateCustomer,     // ✅ Update function
    deleteCustomer,     // ✅ Delete function
  } = useCustomer(shopId)
  
  // 3. Create a customer
  const handleCreate = async (data) => {
    const result = await createCustomer(data)
    if (result.success) {
      console.log('Customer created!', result.data)
    }
  }
  
  return <div>{/* Your UI */}</div>
}
```

**That's it!** ✅ Auto caching, error handling, and notifications are all handled for you.

---

## 🏗️ Architecture Overview

### Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        COMPONENT LAYER                           │
│  (CustomerList.tsx, CustomerForm.tsx, CustomerDetail.tsx)       │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BUSINESS LOGIC LAYER                        │
│              useCustomer() - Custom Hook                         │
│  • Manages loading states                                        │
│  • Error handling & notifications                                │
│  • Form error mapping                                            │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      RTK QUERY API LAYER                         │
│              customerApi - API Slice                             │
│  • HTTP requests                                                 │
│  • Auto caching (30 min - 5 min based on data type)             │
│  • Cache invalidation                                            │
│  • Request deduplication                                         │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND API                              │
│  Express.js + MongoDB + Redis Cache                             │
└─────────────────────────────────────────────────────────────────┘
```

### Key Principles

1. **Single Source of Truth**: RTK Query manages ALL server state
2. **Auto Caching**: Data cached automatically, refetched on invalidation
3. **Optimistic Updates**: Optional - update UI before server confirms
4. **Error Boundaries**: Centralized error handling with useErrorHandler
5. **Type Safety**: 100% TypeScript coverage

---

## 📁 File Structure

```
src/
├── types/
│   └── customer.types.ts              # ✅ TypeScript interfaces
│
├── store/
│   └── api/
│       └── customerApi.ts              # ✅ RTK Query API slice
│
├── validations/
│   └── customerValidation.ts          # ✅ Zod schemas
│
└── features/
    └── customer/
        ├── hooks/
        │   └── useCustomer.ts          # ✅ Custom business logic hook
        │
        ├── utils/
        │   └── customerUtils.ts        # ✅ 50+ helper functions
        │
        └── components/
            ├── CustomerList.tsx        # 📝 TODO: Create
            ├── CustomerForm.tsx        # 📝 TODO: Create
            ├── CustomerDetail.tsx      # 📝 TODO: Create
            └── CustomerCard.tsx        # 📝 TODO: Create
```

---

## 🔌 API Reference

### Available Hooks

All hooks are auto-generated by RTK Query and exported from `customerApi.ts`.

#### 1. **useGetCustomersQuery** - Fetch Customer List

```typescript
import { useGetCustomersQuery } from '@/store/api/customerApi'

const { data, isLoading, error, refetch } = useGetCustomersQuery({
  shopId: 'shop123',
  page: 1,
  limit: 20,
  search: 'John',
  customerType: 'vip',
  isActive: true,
})

// Response structure
{
  success: true,
  message: "Customers fetched successfully",
  data: {
    customers: [...],
    summary: {
      totalCustomers: 150,
      activeCustomers: 120,
      vipCustomers: 25,
      totalOutstanding: 50000,
      totalLoyaltyPoints: 15000,
      avgLifetimeValue: 25000
    }
  },
  meta: {
    pagination: {
      page: 1,
      limit: 20,
      total: 150,
      pages: 8,
      hasNext: true,
      hasPrev: false
    }
  }
}
```

**Query Options:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `shopId` | string | ✅ | Shop identifier |
| `page` | number |  | Page number (default: 1) |
| `limit` | number |  | Items per page (default: 20, max: 100) |
| `search` | string |  | Search by name, phone, email, code |
| `customerType` | enum |  | Filter: retail, wholesale, vip, regular |
| `membershipTier` | enum |  | Filter: standard, silver, gold, platinum |
| `isActive` | boolean |  | Filter active/inactive customers |
| `hasBalance` | boolean |  | Filter customers with outstanding balance |
| `vipOnly` | boolean |  | Show only VIP customers |
| `startDate` | string |  | Filter by creation date (ISO8601) |
| `endDate` | string |  | Filter by creation date (ISO8601) |
| `sort` | string |  | Sort field (e.g., "-createdAt", "firstName") |

---

#### 2. **useGetCustomerByIdQuery** - Fetch Single Customer

```typescript
import { useGetCustomerByIdQuery } from '@/store/api/customerApi'

const { data: customer, isLoading, error } = useGetCustomerByIdQuery({
  shopId: 'shop123',
  customerId: 'cust456',
})

// Response: Customer object directly (transformed)
```

**Cache Duration:** 30 minutes

---

#### 3. **useSearchCustomerQuery** - Quick Search

```typescript
import { useSearchCustomerQuery } from '@/store/api/customerApi'

// Search by phone
const { data } = useSearchCustomerQuery({
  shopId: 'shop123',
  phone: '9876543210',
})

// Search by email
const { data } = useSearchCustomerQuery({
  shopId: 'shop123',
  email: 'john@example.com',
})

// Search by customer code
const { data } = useSearchCustomerQuery({
  shopId: 'shop123',
  customerCode: 'CUST00001',
})

// Returns: Customer | null
```

**Cache Duration:** 1 hour (for phone lookups)

---

#### 4. **useLazySearchCustomerQuery** - Manual Trigger Search

```typescript
import { useLazySearchCustomerQuery } from '@/store/api/customerApi'

const [searchCustomer, { data, isLoading }] = useLazySearchCustomerQuery()

const handleSearch = async () => {
  const result = await searchCustomer({
    shopId: 'shop123',
    phone: phoneInput,
  })
  
  if (result.data) {
    console.log('Customer found:', result.data)
  } else {
    console.log('Customer not found')
  }
}
```

**Use Case:** Search forms, autocomplete, manual lookups

---

#### 5. **useCreateCustomerMutation** - Create Customer

```typescript
import { useCreateCustomerMutation } from '@/store/api/customerApi'

const [createCustomer, { isLoading, error }] = useCreateCustomerMutation()

const handleCreate = async () => {
  try {
    const customer = await createCustomer({
      shopId: 'shop123',
      firstName: 'John',
      lastName: 'Doe',
      phone: '9876543210',
      email: 'john@example.com',
      customerType: 'retail',
      // ... other fields
    }).unwrap()
    
    console.log('Customer created:', customer)
  } catch (err) {
    console.error('Error:', err)
  }
}
```

**Validation:** Client-side (Zod) + Server-side (Express Validator)

**Auto Actions:**
- ✅ Invalidates customer list cache
- ✅ Triggers re-fetch of customer list
- ✅ Shows success notification

---

#### 6. **useUpdateCustomerMutation** - Update Customer

```typescript
import { useUpdateCustomerMutation } from '@/store/api/customerApi'

const [updateCustomer, { isLoading }] = useUpdateCustomerMutation()

const handleUpdate = async () => {
  const customer = await updateCustomer({
    shopId: 'shop123',
    customerId: 'cust456',
    firstName: 'Jane',
    email: 'jane@example.com',
    isActive: false,
  }).unwrap()
}
```

**Auto Actions:**
- ✅ Invalidates specific customer cache
- ✅ Invalidates customer list cache
- ✅ Shows success notification

---

#### 7. **useDeleteCustomerMutation** - Delete Customer (Soft)

```typescript
import { useDeleteCustomerMutation } from '@/store/api/customerApi'

const [deleteCustomer, { isLoading }] = useDeleteCustomerMutation()

const handleDelete = async (customerId: string) => {
  // Show confirmation
  if (!confirm('Are you sure?')) return
  
  await deleteCustomer({
    shopId: 'shop123',
    customerId,
  }).unwrap()
}
```

**Note:** Soft delete only. Customers with outstanding balance cannot be deleted.

---

#### 8. **useBlacklistCustomerMutation** - Blacklist Customer

```typescript
import { useBlacklistCustomerMutation } from '@/store/api/customerApi'

const [blacklistCustomer] = useBlacklistCustomerMutation()

await blacklistCustomer({
  shopId: 'shop123',
  customerId: 'cust456',
  reason: 'Multiple bounced checks and unpaid dues exceeding credit limit',
}).unwrap()
```

**Required:** Reason must be 10-500 characters

---

#### 9. **useRemoveBlacklistMutation** - Remove Blacklist

```typescript
import { useRemoveBlacklistMutation } from '@/store/api/customerApi'

const [removeBlacklist] = useRemoveBlacklistMutation()

await removeBlacklist({
  shopId: 'shop123',
  customerId: 'cust456',
}).unwrap()
```

---

#### 10. **useAddLoyaltyPointsMutation** - Add Loyalty Points

```typescript
import { useAddLoyaltyPointsMutation } from '@/store/api/customerApi'

const [addPoints] = useAddLoyaltyPointsMutation()

await addPoints({
  shopId: 'shop123',
  customerId: 'cust456',
  points: 500,
  reason: 'Birthday bonus',
}).unwrap()
```

---

#### 11. **useRedeemLoyaltyPointsMutation** - Redeem Points

```typescript
import { useRedeemLoyaltyPointsMutation } from '@/store/api/customerApi'

const [redeemPoints] = useRedeemLoyaltyPointsMutation()

await redeemPoints({
  shopId: 'shop123',
  customerId: 'cust456',
  points: 200,
}).unwrap()
```

---

#### 12. **useGetCustomerAnalyticsQuery** - Get Analytics

```typescript
import { useGetCustomerAnalyticsQuery } from '@/store/api/customerApi'

const { data: analytics } = useGetCustomerAnalyticsQuery({
  shopId: 'shop123',
})

// Returns:
{
  totalCustomers: 150,
  activeCustomers: 120,
  vipCustomers: 25,
  totalOutstanding: 50000,
  totalLoyaltyPoints: 15000,
  avgLifetimeValue: 25000
}
```

---

## 📦 Type Definitions

### Core Types

```typescript
// Customer entity (full object from backend)
interface Customer {
  _id: string
  organizationId: string
  shopId: string
  customerCode: string          // Auto-generated: CUST00001
  
  // Basic Info
  firstName: string
  lastName?: string
  fullName: string              // Virtual: firstName + lastName
  phone: string
  alternatePhone?: string
  whatsappNumber?: string
  email?: string
  
  // Personal
  dateOfBirth?: string
  gender?: 'male' | 'female' | 'other'
  anniversaryDate?: string
  
  // Address
  address?: {
    street?: string
    city?: string
    state?: string
    pincode?: string
  }
  
  // KYC
  aadharNumber?: string
  panNumber?: string
  gstNumber?: string
  
  // Classification
  customerType?: 'retail' | 'wholesale' | 'vip' | 'regular'
  customerCategory?: 'gold' | 'silver' | 'diamond' | 'platinum' | 'mixed'
  membershipTier: 'standard' | 'silver' | 'gold' | 'platinum'
  
  // Financial
  creditLimit?: number
  currentBalance: number
  totalPurchases: number
  totalPaid: number
  totalDue: number
  lastPurchaseDate?: string
  loyaltyPoints: number
  
  // Preferences
  preferences?: {
    preferredMetal?: 'gold' | 'silver' | 'platinum' | 'diamond'
    communicationPreference?: 'email' | 'sms' | 'whatsapp' | 'call' | 'none'
  }
  
  // Source
  source?: 'walk_in' | 'referral' | 'online' | 'phone' | 'social_media' | 'advertisement' | 'other'
  referredBy?: string
  
  // Additional
  notes?: string
  tags?: string[]
  
  // Blacklist
  isBlacklisted: boolean
  blacklistReason?: string
  blacklistedAt?: string
  blacklistedBy?: string
  
  // Status
  isActive: boolean
  
  // Statistics
  statistics: {
    totalOrders: number
    completedOrders: number
    cancelledOrders: number
    totalSpent: number
    averageOrderValue: number
    lastOrderDate: string | null
    lastVisitDate: string | null
    firstOrderDate: string | null
  }
  
  // Audit
  createdBy?: string
  updatedBy?: string
  createdAt: string
  updatedAt: string
  deletedAt?: string | null
}
```

### Request Types

```typescript
// Create customer request
interface CreateCustomerRequest {
  firstName: string              // Required
  lastName?: string
  phone: string                  // Required, 10 digits, starts with 6-9
  alternatePhone?: string
  whatsappNumber?: string
  email?: string
  dateOfBirth?: string
  gender?: Gender
  anniversaryDate?: string
  address?: Address
  aadharNumber?: string
  panNumber?: string
  gstNumber?: string
  customerType?: CustomerType
  customerCategory?: CustomerCategory
  creditLimit?: number
  preferences?: CustomerPreferences
  source?: CustomerSource
  referredBy?: string
  notes?: string
  tags?: string[]
}

// Update customer request (all optional)
interface UpdateCustomerRequest {
  firstName?: string
  lastName?: string
  phone?: string
  // ... same as create but all optional
  isActive?: boolean
}
```

---

## 🛠️ Utility Functions

We've created **50+ utility functions** in `customerUtils.ts`:

### Import

```typescript
import customerUtils from '@/features/customer/utils/customerUtils'
// OR import specific functions
import { 
  getCustomerFullName,
  formatPhoneNumber,
  formatCurrency,
  calculateAge,
  isVIPCustomer,
} from '@/features/customer/utils/customerUtils'
```

### Categories

#### 1. **Name & Display** (3 functions)

```typescript
// Get full name
customerUtils.getCustomerFullName(customer)
// → "John Doe"

// Get display name with code
customerUtils.getCustomerDisplayName(customer)
// → "John Doe (CUST00001)"

// Get initials for avatar
customerUtils.getCustomerInitials(customer)
// → "JD"
```

#### 2. **Contact Formatting** (5 functions)

```typescript
// Format phone number
customerUtils.formatPhoneNumber('9876543210')
// → "+91 98765 43210"

// Get WhatsApp URL
customerUtils.getWhatsAppURL(customer.phone, 'Hello!')
// → "https://wa.me/919876543210?text=Hello!"

// Get email link
customerUtils.getEmailLink(customer.email, 'Subject', 'Body')
// → "mailto:john@example.com?subject=Subject&body=Body"

// Get call link
customerUtils.getCallLink(customer.phone)
// → "tel:+919876543210"
```

#### 3. **Financial** (7 functions)

```typescript
// Format currency
customerUtils.formatCurrency(25000)
// → "₹25,000"

// Format loyalty points
customerUtils.formatLoyaltyPoints(500)
// → "500 pts"

// Calculate credit limit usage
customerUtils.getCreditLimitUsage(75000, 100000)
// → 75 (percentage)

// Get credit limit color based on usage
customerUtils.getCreditLimitColor(85)
// → "text-status-warning bg-status-warning/10"

// Check if has outstanding balance
customerUtils.hasOutstandingBalance(customer)
// → true/false
```

#### 4. **Date & Time** (7 functions)

```typescript
// Calculate age
customerUtils.calculateAge('1990-05-15')
// → 34

// Format date
customerUtils.formatDate('2024-01-15')
// → "15 Jan, 2024"

// Format relative date
customerUtils.formatRelativeDate('2024-01-20')
// → "10 days ago"

// Check if birthday today
customerUtils.isBirthdayToday(customer.dateOfBirth)
// → true/false

// Days until birthday
customerUtils.getDaysUntilBirthday(customer.dateOfBirth)
// → 45
```

#### 5. **Status & Types** (11 functions)

```typescript
// Get customer type label
customerUtils.getCustomerTypeLabel('vip')
// → "VIP"

// Get customer type color
customerUtils.getCustomerTypeColor('vip')
// → "text-gold-600 bg-gold-50"

// Get active status color
customerUtils.getActiveStatusColor(true)
// → "text-status-success bg-status-success/10"
```

#### 6. **Validation** (5 functions)

```typescript
// Validate Indian phone
customerUtils.isValidIndianPhone('9876543210')
// → true

// Validate Aadhar
customerUtils.isValidAadhar('234567890123')
// → true

// Validate PAN
customerUtils.isValidPAN('ABCDE1234F')
// → true

// Validate GST
customerUtils.isValidGST('27ABCDE1234F1Z5')
// → true

// Validate age
customerUtils.isValidAge('1990-05-15')
// → true (18-120)
```

#### 7. **Search & Filter** (3 functions)

```typescript
// Filter by search
customerUtils.filterCustomersBySearch(customers, 'john')

// Sort customers
customerUtils.sortCustomers(customers, 'name', 'asc')

// Group by first letter
customerUtils.groupCustomersByLetter(customers)
// → { A: [...], B: [...], ... }
```

#### 8. **Business Logic** (4 functions)

```typescript
// Check if VIP
customerUtils.isVIPCustomer(customer)
// → true/false

// Check if at risk
customerUtils.isAtRiskCustomer(customer.lastPurchaseDate)
// → true (no purchase in 180 days)

// Get engagement level
customerUtils.getCustomerEngagement(customer)
// → 'highly-engaged' | 'engaged' | 'at-risk' | 'inactive'

// Get recommended action
customerUtils.getRecommendedAction(customer)
// → "Send re-engagement offer"
```

#### 9. **KYC** (3 functions)

```typescript
// Mask Aadhar
customerUtils.maskAadhar('234567890123')
// → "XXXX XXXX 0123"

// Mask PAN
customerUtils.maskPAN('ABCDE1234F')
// → "ABXXXXX34F"

// Get KYC status
customerUtils.getKYCStatus(customer)
// → 'complete' | 'partial' | 'incomplete'
```

#### 10. **Communication** (4 functions)

```typescript
// Get preferred channel
customerUtils.getPreferredCommunicationChannel(customer)
// → 'whatsapp'

// Can send WhatsApp
customerUtils.canSendWhatsApp(customer)
// → true/false

// Can send email
customerUtils.canSendEmail(customer)
// → true/false

// Get available methods
customerUtils.getAvailableContactMethods(customer)
// → ['phone', 'whatsapp', 'email']
```

#### 11. **Export** (2 functions)

```typescript
// Convert to CSV row
customerUtils.customerToCSVRow(customer)
// → ['CUST00001', 'John Doe', '9876543210', ...]

// Get CSV headers
customerUtils.getCustomerCSVHeaders()
// → ['Customer Code', 'Name', 'Phone', ...]
```

---

## 🎯 Component Integration

### Pattern 1: Simple List Component

```typescript
// FILE: CustomerList.tsx
import { useCustomer } from '@/features/customer/hooks/useCustomer'
import { getCustomerFullName, formatPhoneNumber } from '@/features/customer/utils/customerUtils'

export const CustomerList = ({ shopId }: { shopId: string }) => {
  const { 
    customers, 
    isLoading, 
    pagination,
    deleteCustomer,
  } = useCustomer(shopId, { 
    page: 1, 
    limit: 20,
    isActive: true 
  })

  if (isLoading) return <div>Loading...</div>

  return (
    <div>
      {customers.map(customer => (
        <div key={customer._id}>
          <h3>{getCustomerFullName(customer)}</h3>
          <p>{formatPhoneNumber(customer.phone)}</p>
          <button onClick={() => deleteCustomer(customer._id)}>
            Delete
          </button>
        </div>
      ))}
      
      {/* Pagination info */}
      <p>
        Page {pagination?.page} of {pagination?.pages}
      </p>
    </div>
  )
}
```

---

### Pattern 2: Create/Edit Form Component

```typescript
// FILE: CustomerForm.tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createCustomerSchema } from '@/validations/customerValidation'
import { useCustomer } from '@/features/customer/hooks/useCustomer'

interface CustomerFormProps {
  shopId: string
  customerId?: string  // If editing
  onSuccess?: () => void
}

export const CustomerForm = ({ shopId, customerId, onSuccess }: CustomerFormProps) => {
  const { createCustomer, updateCustomer, isCreating, isUpdating } = useCustomer(shopId)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(createCustomerSchema),
  })

  const onSubmit = async (data) => {
    // Callback to set field-specific errors from backend
    const setFormErrors = (validationErrors) => {
      Object.entries(validationErrors).forEach(([field, message]) => {
        setError(field, { type: 'manual', message })
      })
    }

    // Call API
    const result = customerId
      ? await updateCustomer(customerId, data, setFormErrors)
      : await createCustomer(data, setFormErrors)

    if (result.success) {
      onSuccess?.()
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* First Name */}
      <div>
        <label>First Name *</label>
        <input {...register('firstName')} />
        {errors.firstName && <span>{errors.firstName.message}</span>}
      </div>

      {/* Phone */}
      <div>
        <label>Phone *</label>
        <input {...register('phone')} />
        {errors.phone && <span>{errors.phone.message}</span>}
      </div>

      {/* Email */}
      <div>
        <label>Email</label>
        <input {...register('email')} type="email" />
        {errors.email && <span>{errors.email.message}</span>}
      </div>

      {/* Submit */}
      <button type="submit" disabled={isCreating || isUpdating}>
        {isCreating || isUpdating ? 'Saving...' : 'Save'}
      </button>
    </form>
  )
}
```

---

### Pattern 3: Search Component

```typescript
// FILE: CustomerSearch.tsx
import { useState } from 'react'
import { useLazySearchCustomerQuery } from '@/store/api/customerApi'
import { getCustomerFullName } from '@/features/customer/utils/customerUtils'

export const CustomerSearch = ({ shopId }: { shopId: string }) => {
  const [phone, setPhone] = useState('')
  const [searchCustomer, { data: customer, isLoading }] = useLazySearchCustomerQuery()

  const handleSearch = async () => {
    await searchCustomer({ shopId, phone })
  }

  return (
    <div>
      <input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Enter phone number"
      />
      <button onClick={handleSearch} disabled={isLoading}>
        Search
      </button>

      {customer && (
        <div>
          <h3>{getCustomerFullName(customer)}</h3>
          <p>Customer Code: {customer.customerCode}</p>
          <p>Loyalty Points: {customer.loyaltyPoints}</p>
        </div>
      )}

      {!isLoading && !customer && phone && (
        <p>No customer found</p>
      )}
    </div>
  )
}
```

---

### Pattern 4: Customer Detail Page

```typescript
// FILE: CustomerDetail.tsx
import { useGetCustomerByIdQuery } from '@/store/api/customerApi'
import { 
  getCustomerFullName,
  formatCurrency,
  formatLoyaltyPoints,
  calculateAge,
  getKYCStatus,
} from '@/features/customer/utils/customerUtils'

export const CustomerDetail = ({ 
  shopId, 
  customerId 
}: { 
  shopId: string
  customerId: string 
}) => {
  const { data: customer, isLoading, error } = useGetCustomerByIdQuery({
    shopId,
    customerId,
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading customer</div>
  if (!customer) return <div>Customer not found</div>

  return (
    <div>
      <h1>{getCustomerFullName(customer)}</h1>
      <p>Code: {customer.customerCode}</p>
      <p>Phone: {customer.phone}</p>
      <p>Email: {customer.email}</p>
      
      {customer.dateOfBirth && (
        <p>Age: {calculateAge(customer.dateOfBirth)} years</p>
      )}
      
      <h2>Financial</h2>
      <p>Total Purchases: {formatCurrency(customer.totalPurchases)}</p>
      <p>Loyalty Points: {formatLoyaltyPoints(customer.loyaltyPoints)}</p>
      <p>Outstanding: {formatCurrency(customer.totalDue)}</p>
      
      <h2>KYC Status</h2>
      <p>{getKYCStatus(customer)}</p>
    </div>
  )
}
```

---

## ⚠️ Error Handling

### Automatic Error Handling (via useCustomer)

The `useCustomer` hook automatically handles errors for you:

```typescript
const { createCustomer } = useCustomer(shopId)

// ✅ Error handling is AUTOMATIC
const result = await createCustomer(data, setErrors)

if (result.success) {
  // Success! Notification already shown ✅
  console.log(result.data)
} else {
  // Error! Toast already shown ✅
  // Form errors already set ✅
  console.error(result.error)
}
```

### What Happens Automatically:

1. **Form Validation Errors** → Set on form fields
2. **Business Logic Errors** → Toast notification shown
3. **Network Errors** → Toast notification shown
4. **Success Messages** → Success toast shown

### Manual Error Handling (Direct RTK Query)

```typescript
import { useCreateCustomerMutation } from '@/store/api/customerApi'

const [createCustomer] = useCreateCustomerMutation()

try {
  const customer = await createCustomer({ shopId, ...data }).unwrap()
  // Success
} catch (error: any) {
  // Manual error handling
  if (error.status === 409) {
    alert('Customer already exists')
  } else if (error.status === 400) {
    console.log('Validation errors:', error.data.validationErrors)
  } else {
    alert('Something went wrong')
  }
}
```

---

## ✅ Best Practices

### DO ✅

1. **Use the custom hook**
   ```typescript
   const { customers, createCustomer } = useCustomer(shopId)
   ```

2. **Use utility functions**
   ```typescript
   import { getCustomerFullName } from '@/features/customer/utils/customerUtils'
   ```

3. **Handle form errors**
   ```typescript
   await createCustomer(data, setError)  // Pass setError from react-hook-form
   ```

4. **Use TypeScript types**
   ```typescript
   import type { Customer, CreateCustomerRequest } from '@/types/customer.types'
   ```

5. **Validate with Zod**
   ```typescript
   import { createCustomerSchema } from '@/validations/customerValidation'
   ```

### DON'T 

1. **Don't fetch data manually**
   ```typescript
   //  BAD
   const fetchCustomers = async () => {
     const res = await fetch('/api/customers')
     const data = await res.json()
     setCustomers(data)
   }
   
   // ✅ GOOD
   const { customers } = useCustomer(shopId)
   ```

2. **Don't use Axios in components**
   ```typescript
   //  BAD
   import axios from 'axios'
   await axios.post('/api/customers', data)
   
   // ✅ GOOD
   await createCustomer(data)
   ```

3. **Don't manage loading states manually**
   ```typescript
   //  BAD
   const [isLoading, setIsLoading] = useState(false)
   
   // ✅ GOOD - Already provided
   const { isLoading, isCreating } = useCustomer(shopId)
   ```

4. **Don't hardcode API endpoints**
   ```typescript
   //  BAD
   fetch('/api/v1/shops/123/customers')
   
   // ✅ GOOD - Handled automatically
   useGetCustomersQuery({ shopId: '123' })
   ```

---

## 👥 Team Workflow

### Team Distribution Strategy

#### **Team A - Form Components** (2 developers)
**Responsibility:** Create all forms and input components

**Tasks:**
1. Create `CustomerForm.tsx` (create/edit)
2. Create `CustomerSearchForm.tsx`
3. Create `BlacklistForm.tsx`
4. Create `LoyaltyPointsForm.tsx`

**Dependencies:**
- ✅ `useCustomer` hook (ready)
- ✅ Validation schemas (ready)
- ✅ Utility functions (ready)

**Example:**
```typescript
import { useCustomer } from '@/features/customer/hooks/useCustomer'
import { createCustomerSchema } from '@/validations/customerValidation'

// Start building your form!
```

---

#### **Team B - List & Display Components** (2 developers)
**Responsibility:** Create list views and detail pages

**Tasks:**
1. Create `CustomerList.tsx` (with pagination)
2. Create `CustomerCard.tsx` (list item)
3. Create `CustomerDetail.tsx` (detail page)
4. Create `CustomerAnalytics.tsx` (dashboard widget)

**Dependencies:**
- ✅ `useGetCustomersQuery` (ready)
- ✅ `useGetCustomerByIdQuery` (ready)
- ✅ Utility functions (ready)

**Example:**
```typescript
import { useGetCustomersQuery } from '@/store/api/customerApi'
import { getCustomerFullName } from '@/features/customer/utils/customerUtils'

// Start building your list!
```

---

#### **Team C - Advanced Features** (2 developers)
**Responsibility:** Special actions and integrations

**Tasks:**
1. Create `CustomerActions.tsx` (blacklist, loyalty points)
2. Create `CustomerExport.tsx` (CSV/Excel export)
3. Create `CustomerImport.tsx` (bulk import)
4. Create `CustomerFilters.tsx` (advanced filtering)

**Dependencies:**
- ✅ All mutation hooks (ready)
- ✅ Utility functions (ready)

**Example:**
```typescript
import { 
  useBlacklistCustomerMutation,
  useAddLoyaltyPointsMutation 
} from '@/store/api/customerApi'

// Start building advanced features!
```

---

### Git Workflow

```bash
# Team A - Forms
git checkout -b feature/customer-forms
# Work on forms
git commit -m "feat: add customer create/edit form"

# Team B - Lists
git checkout -b feature/customer-lists
# Work on lists
git commit -m "feat: add customer list and detail views"

# Team C - Advanced
git checkout -b feature/customer-advanced
# Work on advanced features
git commit -m "feat: add customer blacklist and export"
```

---

## 🔄 Common Patterns

### Pattern 1: Pagination

```typescript
const [page, setPage] = useState(1)
const { customers, pagination } = useCustomer(shopId, { page, limit: 20 })

return (
  <div>
    {customers.map(c => <div key={c._id}>{c.fullName}</div>)}
    
    <button 
      disabled={!pagination?.hasPrev}
      onClick={() => setPage(page - 1)}
    >
      Previous
    </button>
    
    <span>Page {pagination?.page} of {pagination?.pages}</span>
    
    <button 
      disabled={!pagination?.hasNext}
      onClick={() => setPage(page + 1)}
    >
      Next
    </button>
  </div>
)
```

---

### Pattern 2: Search & Filter

```typescript
const [filters, setFilters] = useState({
  search: '',
  customerType: undefined,
  isActive: true,
})

const { customers, isLoading } = useCustomer(shopId, filters)

return (
  <div>
    <input
      value={filters.search}
      onChange={(e) => setFilters({ ...filters, search: e.target.value })}
      placeholder="Search..."
    />
    
    <select
      value={filters.customerType}
      onChange={(e) => setFilters({ ...filters, customerType: e.target.value })}
    >
      <option value="">All Types</option>
      <option value="retail">Retail</option>
      <option value="wholesale">Wholesale</option>
      <option value="vip">VIP</option>
    </select>
    
    {isLoading ? <div>Loading...</div> : (
      <div>{customers.length} customers found</div>
    )}
  </div>
)
```

---

### Pattern 3: Conditional Actions

```typescript
const { 
  customer, 
  blacklistCustomer, 
  removeBlacklist,
  addLoyaltyPoints 
} = useCustomerDetail(shopId, customerId)

return (
  <div>
    {/* Show different actions based on status */}
    {customer.isBlacklisted ? (
      <button onClick={() => removeBlacklist(customer._id)}>
        Remove Blacklist
      </button>
    ) : (
      <button onClick={() => blacklistCustomer(customer._id, reason)}>
        Blacklist
      </button>
    )}
    
    {/* Birthday bonus */}
    {isBirthdayToday(customer.dateOfBirth) && (
      <button onClick={() => addLoyaltyPoints(customer._id, 500, 'Birthday bonus')}>
        Add Birthday Bonus
      </button>
    )}
  </div>
)
```

---

## 🐛 Troubleshooting

### Issue 1: "Cannot read property 'customers' of undefined"

**Cause:** Data not loaded yet

**Solution:**
```typescript
const { data, isLoading } = useGetCustomersQuery({ shopId })

//  BAD
const customers = data.data.customers  // Crashes!

// ✅ GOOD
if (isLoading) return <div>Loading...</div>
if (!data) return <div>No data</div>
const customers = data.data.customers
```

---

### Issue 2: "Customer not updating in list after edit"

**Cause:** Cache not invalidated

**Solution:** Use `useCustomer` hook - it handles cache invalidation automatically!

```typescript
// ✅ This automatically invalidates cache
const { updateCustomer } = useCustomer(shopId)
await updateCustomer(customerId, data)
// List will auto-refresh! 🎉
```

---

### Issue 3: "Form errors not showing"

**Cause:** Not passing `setError` to mutation

**Solution:**
```typescript
const { setError } = useForm()

//  BAD
await createCustomer(data)

// ✅ GOOD
await createCustomer(data, setError)
```

---

### Issue 4: "TypeScript errors on Customer type"

**Cause:** Using old type definitions

**Solution:** Use the updated `customer.types.ts` file with all backend fields

---

### Issue 5: "Data not refreshing after create"

**Cause:** Not using RTK Query properly

**Solution:**
```typescript
// ✅ RTK Query auto-refreshes after mutations
const [createCustomer] = useCreateCustomerMutation()

await createCustomer(data).unwrap()
// List automatically refetches! 🎉
```

---

##  Performance Tips

1. **Use pagination** - Don't load all customers at once
   ```typescript
   const { customers } = useCustomer(shopId, { limit: 20 })
   ```

2. **Use search filters** - Reduce data transferred
   ```typescript
   const { customers } = useCustomer(shopId, { search: 'john', isActive: true })
   ```

3. **Skip unnecessary queries**
   ```typescript
   const { data } = useGetCustomerByIdQuery(
     { shopId, customerId },
     { skip: !customerId }  // Don't fetch if no ID
   )
   ```

4. **Debounce search inputs**
   ```typescript
   import { useDebouncedValue } from '@/hooks/useDebouncedValue'
   
   const [search, setSearch] = useState('')
   const debouncedSearch = useDebouncedValue(search, 500)
   
   const { customers } = useCustomer(shopId, { search: debouncedSearch })
   ```

---

## 🎓 Learning Resources

### For New Developers

1. **RTK Query Basics** → https://redux-toolkit.js.org/rtk-query/overview
2. **React Hook Form** → https://react-hook-form.com/
3. **Zod Validation** → https://zod.dev/

### Code Examples

All patterns shown in this doc are production-ready. Copy-paste and adapt!

---

## 📝 Checklist for Component Development

Before you start:
- [ ] Read this documentation
- [ ] Understand the architecture diagram
- [ ] Know which hook/query to use
- [ ] Have TypeScript types imported

While developing:
- [ ] Use `useCustomer` hook for business logic
- [ ] Use utility functions for formatting
- [ ] Use Zod schemas for validation
- [ ] Handle loading states
- [ ] Handle error states
- [ ] Test on different screen sizes

Before pull request:
- [ ] TypeScript compiles with no errors
- [ ] All form validations work
- [ ] Error handling works
- [ ] Success messages show
- [ ] Cache invalidation works (list updates after create/edit/delete)
- [ ] Code follows team conventions
- [ ] Added comments for complex logic

---

## 🚀 Quick Reference Card

```typescript
// IMPORT EVERYTHING YOU NEED
import { useCustomer } from '@/features/customer/hooks/useCustomer'
import { 
  getCustomerFullName,
  formatPhoneNumber,
  formatCurrency,
} from '@/features/customer/utils/customerUtils'
import type { Customer } from '@/types/customer.types'

// USE IN COMPONENT
const MyComponent = () => {
  const shopId = 'shop-123'
  const {
    customers,        // Customer[]
    isLoading,        // boolean
    createCustomer,   // (data, setError?) => Promise
    updateCustomer,   // (id, data, setError?) => Promise
    deleteCustomer,   // (id) => Promise
  } = useCustomer(shopId, { page: 1, limit: 20 })
  
  return <div>{/* Your UI */}</div>
}
```

---

## 📞 Support

### Questions?

1. Check this documentation first
2. Check the code examples
3. Ask in team Slack channel: `#customer-module`
4. Tag the backend team for API issues

### Found a bug?

1. Check if it's a caching issue (try hard refresh)
2. Check browser console for errors
3. Create a GitHub issue with:
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Screenshots if applicable

---

## 📅 Changelog

### Version 1.0.0 (January 2026)
- ✅ Initial release
- ✅ Complete RTK Query integration
- ✅ 50+ utility functions
- ✅ Full TypeScript support
- ✅ Zod validation schemas
- ✅ Custom business logic hook
- ✅ Comprehensive documentation

---

**Happy Coding! 🎉**

Remember: The infrastructure is ready. Just import, use, and build amazing UIs! 💪