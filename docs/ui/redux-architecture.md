# Redux Architecture Documentation
## Jewelry ERP System - State Management Guide

**Version:** 2.0  
**Last Updated:** January 2026  
**Author:** Development Team

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Architecture Principles](#architecture-principles)
3. [State Structure](#state-structure)
4. [Authentication Flow](#authentication-flow)
5. [Slice Responsibilities](#slice-responsibilities)
6. [API Integration](#api-integration)
7. [Common Patterns](#common-patterns)
8. [Troubleshooting](#troubleshooting)
9. [Best Practices](#best-practices)

---

## 1. Overview {#overview}

### What is Redux?

Redux is a **predictable state container** for JavaScript applications. It helps you write applications that:
- Behave consistently across client, server, and native environments
- Are easy to test
- Provide a great developer experience (time-travel debugging)

### Why We Use Redux Toolkit?

Redux Toolkit (RTK) is the official, recommended way to write Redux logic. It includes:
- **Simplified store setup**
- **Built-in best practices**
- **Less boilerplate code**
- **Built-in TypeScript support**

### Our Redux Architecture

We use a **separation of concerns** approach:

```
┌─────────────────────────────────────────────────────┐
│                    REDUX STORE                       │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────┐ │
│  │  authSlice   │  │  userSlice   │  │  perms   │ │
│  │              │  │              │  │  Slice   │ │
│  │ • Auth State │  │ • Profile    │  │          │ │
│  │ • Tokens     │  │ • Prefs      │  │ • Perms  │ │
│  │ • Shop ID    │  │ • Shops      │  │ • Access │ │
│  └──────────────┘  └──────────────┘  └──────────┘ │
│                                                      │
│  ┌──────────────┐  ┌──────────────┐                │
│  │   uiSlice    │  │notification  │                │
│  │              │  │    Slice     │                │
│  │ • Theme      │  │ • Toasts     │                │
│  │ • Sidebar    │  │ • Alerts     │                │
│  └──────────────┘  └──────────────┘                │
│                                                      │
└─────────────────────────────────────────────────────┘
```

---

## 2. Architecture Principles {#architecture-principles}

### Core Principles

#### 1. **Single Source of Truth**
The entire application state is stored in a single object tree within a single Redux store.

```typescript
//  BAD: Multiple stores
const authStore = createStore(authReducer)
const userStore = createStore(userReducer)

//  GOOD: Single store
const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    permissions: permissionsReducer,
  }
})
```

#### 2. **State is Read-Only**
The only way to change the state is to dispatch an action.

```typescript
//  BAD: Direct mutation
state.user.email = 'new@email.com'

//  GOOD: Dispatch action
dispatch(updateUserEmail('new@email.com'))
```

#### 3. **Changes are Made with Pure Functions**
Reducers are pure functions that take the previous state and an action, and return the next state.

```typescript
//  Pure reducer
const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_EMAIL':
      return { ...state, email: action.payload } // New object
    default:
      return state
  }
}
```

### Our Custom Principles

#### 1. **Separation of Concerns**

Each slice has a **single responsibility**:

| Slice | Responsibility | Persisted? |
|-------|---------------|------------|
| `authSlice` | Authentication state, tokens, shop context |  Yes (minimal) |
| `userSlice` | User profile, preferences, shop accesses |  No (fetched from API) |
| `permissionsSlice` | Permissions, shop access details |  No (calculated) |
| `uiSlice` | UI state (theme, sidebar, etc.) |  Yes (preferences) |
| `notificationSlice` | Toast messages, alerts |  No (runtime only) |

#### 2. **No Duplicate Data**

**Problem:** Login response contains user data. Should we store it in `authSlice` or `userSlice`?

**Solution:** Store **identifiers** in `authSlice`, **full data** in `userSlice`

```typescript
// authSlice: ONLY identifiers
{
  userId: '123',
  role: 'shop_admin',
  currentShopId: 'shop_456'
}

// userSlice: Full profile
{
  profile: {
    _id: '123',
    email: 'user@example.com',
    firstName: 'John',
    lastName: 'Doe',
    // ... all other fields
  }
}
```

#### 3. **No Duplicate API Calls**

When user logs in:

```typescript
//  BAD: Multiple API calls
dispatch(login(credentials))        // API call 1
  .then(() => dispatch(fetchUser())) // API call 2
  .then(() => dispatch(fetchPerms())) // API call 3

//  GOOD: Single API call, populate multiple slices
dispatch(login(credentials))
  .then((response) => {
    dispatch(setUserFromLogin(response.data))      // No API call
    dispatch(setPermissionsFromLogin(response.data)) // No API call
  })
```

---

## 3. State Structure {#state-structure}

### Complete State Tree

```typescript
{
  // Authentication (Persisted)
  auth: {
    isAuthenticated: boolean,
    userId: string | null,
    email: string | null,
    role: 'super_admin' | 'org_admin' | 'shop_admin' | ...,
    currentShopId: string | null,
    shopIds: string[],
    accessToken: string | null,  // Stored separately via tokenService
    refreshToken: string | null, // Stored separately via tokenService
    isLoading: boolean,
    error: string | null
  },

  // User Profile (NOT Persisted - Fetched from API)
  user: {
    profile: {
      _id: string,
      username: string,
      email: string,
      firstName: string,
      lastName: string,
      role: UserRole,
      phone?: string,
      profileImage?: string,
      organizationId?: string,
      primaryShop?: string,
      department: Department,
      designation?: string,
      isActive: boolean,
      isEmailVerified: boolean,
      preferences: {
        language: 'en' | 'hi' | ...,
        timezone: string,
        currency: 'INR' | 'USD' | ...,
        theme: 'light' | 'dark' | 'auto',
        // ...
      },
      // ... more fields
    },
    shopAccesses: UserShopAccess[],
    activeShops: number,
    isLoading: boolean,
    error: string | null
  },

  // Permissions (NOT Persisted - Calculated)
  permissions: {
    shopAccesses: [
      {
        shopId: string,
        role: 'shop_admin' | 'manager' | ...,
        permissions: {
          canCreateCustomer: boolean,
          canViewCustomers: boolean,
          // ... 247 total permissions
        }
      }
    ],
    currentShopPermissions: ShopPermissions | null,
    orgPermissions: ShopPermissions | null,
    isLoading: boolean,
    error: string | null
  },

  // UI State (Partially Persisted)
  ui: {
    themeName: string,
    accentColor: string,
    sidebarOpen: boolean,      // NOT persisted
    sidebarCollapsed: boolean, // NOT persisted
    isLoading: boolean         // NOT persisted
  },

  // Notifications (NOT Persisted)
  notification: {
    notifications: Toast[],
    isVisible: boolean
  }
}
```

---

## 4. Authentication Flow {#authentication-flow}

### Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         USER LOGS IN                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  1. dispatch(login(credentials))                            │
│     └─> authSlice: login thunk                              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  2. API Call: POST /api/v1/auth/login                       │
│     Response: {                                              │
│       user: { _id, email, role, ... },                      │
│       accessToken: "...",                                    │
│       refreshToken: "...",                                   │
│       shopAccesses: [...],                                   │
│       effectivePermissions: {...}                            │
│     }                                                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  3. authSlice: login.fulfilled                              │
│     ├─> Store identifiers in authSlice                      │
│     │   (userId, role, shopIds, tokens)                     │
│     ├─> dispatch(setUserFromLogin)                          │
│     │   └─> Populate userSlice                              │
│     └─> dispatch(setPermissionsFromLogin)                   │
│         └─> Populate permissionsSlice                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  4. User is now authenticated                               │
│      authSlice has tokens & identifiers                   │
│      userSlice has full profile                           │
│      permissionsSlice has permissions                     │
└─────────────────────────────────────────────────────────────┘
```

### Code Example

#### Step 1: User clicks "Login"

```typescript
// LoginForm.tsx
const handleSubmit = async (values) => {
  try {
    await dispatch(login({
      email: values.email,
      password: values.password
    })).unwrap()
    
    navigate('/dashboard')
  } catch (error) {
    console.error('Login failed:', error)
  }
}
```

#### Step 2: authSlice - login thunk

```typescript
// authSlice.ts
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { dispatch }) => {
    // API call
    const response = await authService.login(credentials)
    
    //  CRITICAL: Populate other slices immediately
    if (!response.data.requires2FA) {
      dispatch(setUserFromLogin({
        user: response.data.user,
        shopAccesses: response.data.shopAccesses,
        activeShops: response.data.shopAccesses.length
      }))
      
      dispatch(setPermissionsFromLogin({
        shopAccesses: response.data.shopAccesses,
        effectivePermissions: response.data.effectivePermissions
      }))
    }
    
    return response.data
  }
)
```

#### Step 3: login.fulfilled reducer

```typescript
// authSlice.ts
.addCase(login.fulfilled, (state, action) => {
  // Store ONLY identifiers
  state.isAuthenticated = true
  state.userId = action.payload.user._id
  state.role = action.payload.user.role
  state.shopIds = action.payload.shopAccesses.map(a => a.shopId)
  
  // Store tokens via tokenService (not in Redux)
  tokenService.saveAccessToken(action.payload.accessToken)
  tokenService.saveRefreshToken(action.payload.refreshToken)
})
```

### Page Reload Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     USER RELOADS PAGE                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  1. App.tsx: useEffect runs                                 │
│     └─> dispatch(initializeAuth())                          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  2. Check if tokens exist                                   │
│     const accessToken = tokenService.getAccessToken()       │
│     const refreshToken = tokenService.getRefreshToken()     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  3. If tokens exist:                                        │
│     API Call: GET /api/v1/auth/me                           │
│     Response: { _id, email, role, ... }                     │
│                                                              │
│  4. Populate slices (same as login):                        │
│     ├─> authSlice gets identifiers                          │
│     ├─> userSlice gets profile                              │
│     └─> permissionsSlice gets permissions                   │
└─────────────────────────────────────────────────────────────┘
```

#### Code Example

```typescript
// App.tsx
useEffect(() => {
  dispatch(initializeAuth())
}, [dispatch])

// authSlice.ts
export const initializeAuth = createAsyncThunk(
  'auth/initialize',
  async (_, { dispatch }) => {
    // Check tokens
    const accessToken = tokenService.getAccessToken()
    const refreshToken = tokenService.getRefreshToken()
    
    if (!accessToken || !refreshToken) {
      return null // Not authenticated
    }
    
    // Get user data
    const response = await authService.getCurrentUser()
    
    // Handle both response structures
    const userData = response.data.user || response.data
    const shopAccesses = response.data.shopAccesses || []
    
    // Populate slices
    dispatch(setUserFromLogin({
      user: userData,
      shopAccesses,
      activeShops: shopAccesses.length
    }))
    
    dispatch(setPermissionsFromLogin({
      shopAccesses,
      effectivePermissions: null,
      userRole: userData.role
    }))
    
    return {
      userId: userData._id,
      email: userData.email,
      role: userData.role,
      shopIds: shopAccesses.map(a => a.shopId),
      accessToken,
      refreshToken
    }
  }
)
```

---

## 5. Slice Responsibilities {#slice-responsibilities}

### authSlice - Authentication & Authorization

**Purpose:** Manage authentication state and tokens

**What it stores:**
```typescript
{
  isAuthenticated: boolean,     // Is user logged in?
  userId: string | null,         // User ID only
  email: string | null,          // Email only
  role: UserRole | null,         // User role only
  currentShopId: string | null,  // Selected shop
  shopIds: string[],             // List of accessible shop IDs
  tokens: { ... },               // Access & refresh tokens
  isLoading: boolean,
  error: string | null
}
```

**Actions:**
- `login()` - Login user
- `logout()` - Logout user
- `initializeAuth()` - Restore session on page load
- `refreshAccessToken()` - Refresh expired token
- `setCurrentShop()` - Switch shop context
- `clearCurrentShop()` - Clear shop selection

**When to use:**
- Check if user is authenticated
- Get current user role
- Get current shop ID
- Switch shops

**Example:**
```typescript
// Check authentication
const isAuthenticated = useSelector(selectIsAuthenticated)

// Get current shop
const currentShopId = useSelector(selectCurrentShopId)

// Switch shop
dispatch(setCurrentShop('shop_123'))
```

---

### userSlice - User Profile & Preferences

**Purpose:** Store full user profile and preferences

**What it stores:**
```typescript
{
  profile: {
    _id: string,
    username: string,
    email: string,
    firstName: string,
    lastName: string,
    fullName: string,
    role: UserRole,
    phone?: string,
    profileImage?: string,
    organizationId?: string,
    primaryShop?: string,
    department: Department,
    designation?: string,
    employeeId?: string,
    isActive: boolean,
    isEmailVerified: boolean,
    preferences: {
      language: Language,
      timezone: string,
      currency: Currency,
      dateFormat: DateFormat,
      theme: Theme,
      notificationsEnabled: boolean
    },
    // ... more fields
  },
  shopAccesses: UserShopAccess[],
  activeShops: number,
  isLoading: boolean,
  error: string | null
}
```

**Actions:**
- `setUserFromLogin()` - Set user data after login (NO API call)
- `fetchUserProfile()` - Explicitly refresh user data (API call)
- `updateUserProfile()` - Update user profile
- `updateUserFields()` - Update specific fields
- `clearUserProfile()` - Clear on logout

**When to use:**
- Display user info in UI
- Get user preferences
- Update profile
- Check email verification status

**Example:**
```typescript
// Get user profile
const user = useSelector(selectUserProfile)

// Get full name
const fullName = useSelector(selectUserFullName)

// Update profile
dispatch(updateUserProfile({
  firstName: 'John',
  lastName: 'Doe'
}))
```

---

### permissionsSlice - Permissions & Access Control

**Purpose:** Manage user permissions and shop access

**What it stores:**
```typescript
{
  shopAccesses: [
    {
      shopId: string,
      role: 'shop_admin' | 'manager' | 'staff' | ...,
      permissions: {
        canCreateCustomer: boolean,
        canViewCustomers: boolean,
        canUpdateCustomer: boolean,
        // ... 247 total permissions
      }
    }
  ],
  currentShopPermissions: ShopPermissions | null,
  orgPermissions: ShopPermissions | null,
  isLoading: boolean,
  error: string | null
}
```

**Actions:**
- `setPermissionsFromLogin()` - Set permissions after login (NO API call)
- `setCurrentShopPermissions()` - Update permissions for selected shop
- `clearPermissions()` - Clear on logout

**When to use:**
- Check if user has permission
- Guard routes/components
- Show/hide UI elements based on permissions

**Example:**
```typescript
// Check single permission
const canCreateCustomer = usePermission('canCreateCustomer')

// Check multiple permissions (any)
const canManageCustomers = useAnyPermission([
  'canCreateCustomer',
  'canUpdateCustomer',
  'canDeleteCustomers'
])

// Check multiple permissions (all)
const hasFullAccess = useAllPermissions([
  'canCreateCustomer',
  'canUpdateCustomer',
  'canDeleteCustomers'
])

// Use in component
{canCreateCustomer && (
  <Button onClick={handleCreate}>Add Customer</Button>
)}
```

---

### uiSlice - UI State

**Purpose:** Manage UI-related state (theme, sidebar, etc.)

**What it stores:**
```typescript
{
  themeName: string,
  accentColor: string,
  appearance: 'light' | 'dark' | 'system',
  language: Language,
  sidebarOpen: boolean,
  sidebarCollapsed: boolean,
  mobileMenuOpen: boolean,
  isLoading: boolean,
  loadingMessage: string | null
}
```

**When to use:**
- Toggle sidebar
- Change theme
- Show/hide loading overlay

---

### notificationSlice - Toast Notifications

**Purpose:** Manage toast notifications and alerts

**What it stores:**
```typescript
{
  notifications: [
    {
      id: string,
      type: 'success' | 'error' | 'warning' | 'info',
      message: string,
      duration: number
    }
  ]
}
```

**When to use:**
- Show success/error messages
- Display alerts to user

---

## 6. API Integration {#api-integration}

### Token Management

Tokens are **NOT stored in Redux**. They are stored separately via `tokenService`:

```typescript
// services/auth/tokenService.ts

export const saveAccessToken = (token: string) => {
  localStorage.setItem('accessToken', token)
}

export const saveRefreshToken = (token: string) => {
  localStorage.setItem('refreshToken', token)
}

export const getAccessToken = () => {
  return localStorage.getItem('accessToken')
}

export const getRefreshToken = () => {
  return localStorage.getItem('refreshToken')
}

export const clearTokens = () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
}
```

### Axios Interceptors

Automatically attach tokens to requests:

```typescript
// api/axios.ts

// Request interceptor - Add token
api.interceptors.request.use(
  (config) => {
    const token = tokenService.getAccessToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor - Handle 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    
    // If 401 and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      try {
        // Refresh token
        const refreshToken = tokenService.getRefreshToken()
        const response = await authService.refreshToken(refreshToken)
        
        // Save new token
        tokenService.saveAccessToken(response.data.accessToken)
        
        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`
        return api(originalRequest)
      } catch (refreshError) {
        // Refresh failed - logout
        store.dispatch(logout())
        return Promise.reject(refreshError)
      }
    }
    
    return Promise.reject(error)
  }
)
```

---

## 7. Common Patterns {#common-patterns}

### Pattern 1: Checking Authentication

```typescript
// In a component
import { useSelector } from 'react-redux'
import { selectIsAuthenticated } from '@/store/slices/authSlice'

const MyComponent = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }
  
  return <div>Protected Content</div>
}
```

### Pattern 2: Permission-Based Rendering

```typescript
// Using custom hook
import { usePermission } from '@/hooks/usePermissions'

const CustomerList = () => {
  const canCreate = usePermission('canCreateCustomer')
  const canDelete = usePermission('canDeleteCustomers')
  
  return (
    <div>
      {canCreate && <Button>Add Customer</Button>}
      {canDelete && <Button>Delete</Button>}
    </div>
  )
}
```

### Pattern 3: Protected Routes

```typescript
// RoleRoute.tsx
import { RoleRoute } from '@/router/RoleRoute'

const routes = [
  {
    path: '/customers',
    element: (
      <RoleRoute permission="canViewCustomers">
        <CustomerList />
      </RoleRoute>
    )
  },
  {
    path: '/settings',
    element: (
      <RoleRoute requiredRole="super_admin">
        <Settings />
      </RoleRoute>
    )
  }
]
```

### Pattern 4: Dispatching Actions

```typescript
// Login
import { useDispatch } from 'react-redux'
import { login } from '@/store/slices/authSlice'

const LoginForm = () => {
  const dispatch = useDispatch()
  
  const handleSubmit = async (values) => {
    try {
      await dispatch(login(values)).unwrap()
      navigate('/dashboard')
    } catch (error) {
      console.error('Login failed:', error)
    }
  }
}
```

### Pattern 5: Optimistic Updates

```typescript
// Update profile optimistically
const handleUpdate = async (updates) => {
  // Update UI immediately
  dispatch(updateUserFields(updates))
  
  try {
    // Send API request
    await dispatch(updateUserProfile(updates)).unwrap()
  } catch (error) {
    // Revert on error
    dispatch(fetchUserProfile())
  }
}
```

---

## 8. Troubleshooting {#troubleshooting}

### Issue 1: "User undefined after page reload"

**Cause:** `/me` endpoint returns different structure than login endpoint

**Solution:** Handle both response structures in `initializeAuth`

```typescript
// authSlice.ts
const userData = response.data.user || response.data
const shopAccesses = response.data.shopAccesses || []
```

### Issue 2: "Permissions not working after login"

**Cause:** `permissionsSlice` not populated after login

**Solution:** Ensure `setPermissionsFromLogin` is dispatched in `login.fulfilled`

```typescript
// authSlice.ts - login thunk
dispatch(setPermissionsFromLogin({
  shopAccesses: response.data.shopAccesses,
  effectivePermissions: response.data.effectivePermissions
}))
```

### Issue 3: "Duplicate API calls on login"

**Cause:** Fetching user data separately after login

**Solution:** Use `setUserFromLogin` instead of `fetchUserProfile`

```typescript
//  BAD
dispatch(login(credentials))
  .then(() => dispatch(fetchUserProfile())) // Duplicate API call!

//  GOOD
dispatch(login(credentials))
// userSlice already populated in login thunk
```

### Issue 4: "Shop context lost after reload"

**Cause:** `currentShopId` not restored from localStorage

**Solution:** Use `ShopContextManager` to persist shop selection

```typescript
// authSlice.ts - initializeAuth.fulfilled
const storedShopId = ShopContextManager.load()
if (storedShopId && state.shopIds.includes(storedShopId)) {
  state.currentShopId = storedShopId
}
```

### Issue 5: "TypeScript errors in thunks"

**Cause:** Missing return type annotations

**Solution:** Add proper types to async thunks

```typescript
//  Proper typing
export const fetchUserProfile = createAsyncThunk<
  { user: User; shopAccesses: UserShopAccess[]; activeShops: number }, // Return type
  void,                                                                  // Args type
  { rejectValue: string }                                                // Rejection type
>
```

---

## 9. Best Practices {#best-practices}

###  DO

1. **Keep slices focused** - Each slice should have one clear responsibility
2. **Use selectors** - Always use selectors to access state
3. **Validate data** - Check for null/undefined before accessing nested properties
4. **Use TypeScript** - Leverage type safety
5. **Log in development** - Add console.logs wrapped in `if (import.meta.env.DEV)`
6. **Handle errors** - Always use try-catch in async thunks
7. **Normalize data** - Store IDs and references, not full nested objects
8. **Use createAsyncThunk** - For any async operations
9. **Clear state on logout** - Always clear all slices on logout

###  DON'T

1. **Mutate state directly** - Redux Toolkit uses Immer, but avoid manual mutations
2. **Store entire API responses** - Extract only what you need
3. **Store tokens in Redux** - Use separate storage (tokenService)
4. **Make API calls in reducers** - Use async thunks instead
5. **Store duplicate data** - Keep data in one place, reference by ID
6. **Over-persist** - Don't persist runtime state (isLoading, error)
7. **Ignore TypeScript errors** - Fix them properly
8. **Fetch data unnecessarily** - Use cached data when possible
9. **Forget to clear errors** - Clear errors when appropriate

### Code Organization

```
src/
├── store/
│   ├── index.ts              # Store configuration
│   ├── slices/
│   │   ├── authSlice.ts      # Authentication
│   │   ├── userSlice.ts      # User profile
│   │   ├── permissionsSlice.ts # Permissions
│   │   ├── uiSlice.ts        # UI state
│   │   └── notificationSlice.ts # Notifications
│   └── hooks.ts              # Typed hooks
├── hooks/
│   ├── useAuth.ts            # Auth hook
│   └── usePermissions.ts     # Permissions hooks
├── services/
│   └── auth/
│       └── tokenService.ts   # Token management
└── types/
    └── index.ts              # TypeScript types
```

---

## Appendix A: Permission List

Total: **247 permissions** across all modules

### Customer Management (13)
- canCreateCustomer
- canViewCustomers
- canUpdateCustomer
- canDeleteCustomers
- canBlacklistCustomer
- canManageCustomers
- ... (see full list in permissionsSlice.ts)

### Product Management (22)
- canCreateProduct
- canViewProducts
- canUpdateProduct
- canManageInventory
- ... (see full list)

### Sales (36)
- canCreateSale
- canViewSales
- canGenerateInvoices
- canAccessPOS
- ... (see full list)

*(Full permission list available in `permissionsSlice.ts`)*

---

## Appendix B: Type Definitions

### User Type
```typescript
interface User {
  _id: string
  username: string
  email: string
  firstName: string
  lastName?: string
  role: UserRole
  phone?: string
  profileImage?: string
  organizationId?: string
  primaryShop?: string
  department: Department
  isActive: boolean
  isEmailVerified: boolean
  preferences: UserPreferences
  createdAt: string
  updatedAt: string
}
```

### ShopPermissions Type
```typescript
interface ShopPermissions {
  // Customer Management (13)
  canCreateCustomer: boolean
  canViewCustomers: boolean
  canUpdateCustomer: boolean
  // ... 244 more permissions
}
```

---

## Appendix C: Quick Reference

### Common Selectors

```typescript
// Auth
selectIsAuthenticated(state)    // boolean
selectUserId(state)              // string | null
selectUserRole(state)            // UserRole | null
selectCurrentShopId(state)       // string | null
selectShopIds(state)             // string[]

// User
selectUserProfile(state)         // User | null
selectUserFullName(state)        // string
selectUserEmail(state)           // string
selectIsEmailVerified(state)     // boolean
selectUserPreferences(state)     // UserPreferences

// Permissions
selectEffectivePermissions(state) // ShopPermissions | null
selectHasPermission(state, perm)  // boolean
selectShopAccesses(state)         // UserShopAccess[]
```

### Common Hooks

```typescript
// Authentication
const { login, logout, isAuthenticated } = useAuth()

// Permissions
const canCreate = usePermission('canCreateCustomer')
const canManage = useAnyPermission(['canCreateCustomer', 'canUpdateCustomer'])
const hasFullAccess = useAllPermissions(['canCreate', 'canUpdate', 'canDelete'])

// User
const user = useCurrentUser()
const role = useUserRole()
```

---

## Appendix D: Migration Guide

### From Old Redux to New Architecture

**Before:**
```typescript
// Old: Everything in authSlice
authSlice: {
  user: { _id, email, firstName, ... }, //  Too much data
  permissions: { ... },                  //  Mixed concerns
  token: "...",                          //  Security risk
}
```

**After:**
```typescript
// New: Separated slices
authSlice: {
  userId: "123",           //  Only identifier
  role: "shop_admin",      //  Only identifier
  currentShopId: "shop_1"  //  Context
}

userSlice: {
  profile: { ... }         //  Full user data
}

permissionsSlice: {
  currentShopPermissions: { ... } //  Separate permissions
}
```

**Migration Steps:**

1. **Extract user data from authSlice**
   ```typescript
   // Before
   const user = useSelector(state => state.auth.user)
   
   // After
   const user = useSelector(selectUserProfile)
   ```

2. **Extract permissions from authSlice**
   ```typescript
   // Before
   const permissions = useSelector(state => state.auth.permissions)
   
   // After
   const permissions = useSelector(selectEffectivePermissions)
   ```

3. **Update login flow**
   ```typescript
   // Before
   dispatch(login(credentials))
     .then(() => dispatch(fetchUser()))
   
   // After
   dispatch(login(credentials))
   // User data already populated!
   ```

4. **Update localStorage usage**
   ```typescript
   // Before
   localStorage.setItem('token', token)
   
   // After
   tokenService.saveAccessToken(token)
   ```

---

## Support & Resources

### Internal Resources
- **Redux DevTools:** Browser extension for debugging
- **TypeScript Docs:** `/docs/typescript.md`
- **API Docs:** `/docs/api.md`

### External Resources
- [Redux Toolkit Official Docs](https://redux-toolkit.js.org/)
- [Redux Style Guide](https://redux.js.org/style-guide/)
- [React-Redux Hooks](https://react-redux.js.org/api/hooks)

### Getting Help

**Slack Channels:**
- `#dev-frontend` - General frontend questions
- `#dev-redux` - Redux-specific questions
- `#dev-typescript` - TypeScript issues

**Code Reviews:**
- All Redux changes require PR review
- Tag `@tech-lead` for architecture questions

---

**Last Updated:** January 2026  
**Maintained by:** Frontend Team  
**Version:** 2.0