// ============================================================================
// FILE: dummyData/user.dummy.ts
// Dummy User Data for Testing Profile & Other Features
// ============================================================================

import { User, UserProfile, UserListItem, UserWithRelations } from '@/types/user.types';

/**
 * Complete Dummy User (Full Profile)
 */
export const dummyUser: User = {
  _id: '507f1f77bcf86cd799439011',
  
  // Basic Information
  username: 'rajesh_kumar',
  email: 'rajesh.kumar@jewelryerp.com',
  firstName: 'Rajesh',
  lastName: 'Kumar',
  phone: '9876543210',
  profileImage: 'https://i.pravatar.cc/150?img=12',
  
  // SaaS Multi-tenant Fields
  organizationId: '507f1f77bcf86cd799439012',
  role: 'shop_admin',
  primaryShop: '507f1f77bcf86cd799439013',
  
  // User Status
  isActive: true,
  isEmailVerified: true,
  isPhoneVerified: true,
  
  // Security & Session
  lastLogin: '2025-01-02T10:30:00.000Z',
  lastLoginIP: '192.168.1.100',
  
  // Two-Factor Authentication
  twoFactorEnabled: false,
  
  // Jewelry Business Fields
  designation: 'Store Manager',
  department: 'management',
  employeeId: 'EMP001',
  joiningDate: '2023-06-15T00:00:00.000Z',
  
  // Sales Performance
  salesTarget: 500000,
  commissionRate: 2.5,
  
  // User Preferences
  preferences: {
    language: 'en',
    timezone: 'Asia/Kolkata',
    currency: 'INR',
    dateFormat: 'DD/MM/YYYY',
    theme: 'light',
    notificationsEnabled: true,
  },
  
  // Tracking
  createdBy: null,
  updatedBy: null,
  
  // Timestamps
  createdAt: '2023-06-15T00:00:00.000Z',
  updatedAt: '2025-01-02T10:30:00.000Z',
  deletedAt: null,
  
  // Virtuals
  fullName: 'Rajesh Kumar',
  isSuperAdmin: false,
  isOrgAdmin: false,
};

/**
 * Dummy Super Admin User
 */
export const dummySuperAdmin: User = {
  _id: '507f1f77bcf86cd799439020',
  username: 'super_admin',
  email: 'admin@jewelryerp.com',
  firstName: 'Admin',
  lastName: 'User',
  phone: '9999999999',
  profileImage: 'https://i.pravatar.cc/150?img=1',
  organizationId: null,
  role: 'super_admin',
  primaryShop: null,
  isActive: true,
  isEmailVerified: true,
  isPhoneVerified: true,
  lastLogin: '2025-01-03T08:00:00.000Z',
  lastLoginIP: '192.168.1.1',
  twoFactorEnabled: true,
  designation: 'System Administrator',
  department: 'management',
  employeeId: 'ADMIN001',
  joiningDate: '2023-01-01T00:00:00.000Z',
  salesTarget: 0,
  commissionRate: 0,
  preferences: {
    language: 'en',
    timezone: 'Asia/Kolkata',
    currency: 'INR',
    dateFormat: 'DD/MM/YYYY',
    theme: 'dark',
    notificationsEnabled: true,
  },
  createdBy: null,
  updatedBy: null,
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2025-01-03T08:00:00.000Z',
  deletedAt: null,
  fullName: 'Admin User',
  isSuperAdmin: true,
  isOrgAdmin: true,
};

/**
 * Dummy Staff User
 */
export const dummyStaff: User = {
  _id: '507f1f77bcf86cd799439021',
  username: 'priya_sharma',
  email: 'priya.sharma@jewelryerp.com',
  firstName: 'Priya',
  lastName: 'Sharma',
  phone: '9876543211',
  profileImage: 'https://i.pravatar.cc/150?img=5',
  organizationId: '507f1f77bcf86cd799439012',
  role: 'staff',
  primaryShop: '507f1f77bcf86cd799439013',
  isActive: true,
  isEmailVerified: true,
  isPhoneVerified: false,
  lastLogin: '2025-01-03T09:15:00.000Z',
  lastLoginIP: '192.168.1.105',
  twoFactorEnabled: false,
  designation: 'Sales Executive',
  department: 'sales',
  employeeId: 'EMP102',
  joiningDate: '2024-03-20T00:00:00.000Z',
  salesTarget: 200000,
  commissionRate: 3.0,
  preferences: {
    language: 'hi',
    timezone: 'Asia/Kolkata',
    currency: 'INR',
    dateFormat: 'DD/MM/YYYY',
    theme: 'light',
    notificationsEnabled: true,
  },
  createdBy: '507f1f77bcf86cd799439011',
  updatedBy: null,
  createdAt: '2024-03-20T00:00:00.000Z',
  updatedAt: '2025-01-03T09:15:00.000Z',
  deletedAt: null,
  fullName: 'Priya Sharma',
  isSuperAdmin: false,
  isOrgAdmin: false,
};

/**
 * Dummy User Profile (Public Facing)
 */
export const dummyUserProfile: UserProfile = {
  _id: '507f1f77bcf86cd799439011',
  username: 'rajesh_kumar',
  firstName: 'Rajesh',
  lastName: 'Kumar',
  fullName: 'Rajesh Kumar',
  profileImage: 'https://i.pravatar.cc/150?img=12',
  designation: 'Store Manager',
  department: 'management',
  role: 'shop_admin',
};

/**
 * Dummy User List (for tables/lists)
 */
export const dummyUserList: UserListItem[] = [
  {
    _id: '507f1f77bcf86cd799439011',
    username: 'rajesh_kumar',
    email: 'rajesh.kumar@jewelryerp.com',
    fullName: 'Rajesh Kumar',
    role: 'shop_admin',
    department: 'management',
    isActive: true,
    isEmailVerified: true,
    lastLogin: '2025-01-02T10:30:00.000Z',
    createdAt: '2023-06-15T00:00:00.000Z',
  },
  {
    _id: '507f1f77bcf86cd799439021',
    username: 'priya_sharma',
    email: 'priya.sharma@jewelryerp.com',
    fullName: 'Priya Sharma',
    role: 'staff',
    department: 'sales',
    isActive: true,
    isEmailVerified: true,
    lastLogin: '2025-01-03T09:15:00.000Z',
    createdAt: '2024-03-20T00:00:00.000Z',
  },
  {
    _id: '507f1f77bcf86cd799439022',
    username: 'amit_patel',
    email: 'amit.patel@jewelryerp.com',
    fullName: 'Amit Patel',
    role: 'accountant',
    department: 'accounts',
    isActive: true,
    isEmailVerified: true,
    lastLogin: '2025-01-03T08:45:00.000Z',
    createdAt: '2023-08-10T00:00:00.000Z',
  },
  {
    _id: '507f1f77bcf86cd799439023',
    username: 'neha_verma',
    email: 'neha.verma@jewelryerp.com',
    fullName: 'Neha Verma',
    role: 'manager',
    department: 'inventory',
    isActive: true,
    isEmailVerified: false,
    lastLogin: '2025-01-02T16:20:00.000Z',
    createdAt: '2024-01-15T00:00:00.000Z',
  },
  {
    _id: '507f1f77bcf86cd799439024',
    username: 'vikram_singh',
    email: 'vikram.singh@jewelryerp.com',
    fullName: 'Vikram Singh',
    role: 'viewer',
    department: 'customer_service',
    isActive: false,
    isEmailVerified: true,
    lastLogin: '2024-12-28T14:30:00.000Z',
    createdAt: '2023-11-05T00:00:00.000Z',
  },
];

/**
 * Dummy User with Relations (Populated)
 */
export const dummyUserWithRelations: UserWithRelations = {
  ...dummyUser,
  organization: {
    _id: '507f1f77bcf86cd799439012',
    name: 'Rajesh Jewellers Pvt Ltd',
    email: 'info@rajeshjewellers.com',
    phone: '0120-4567890',
    website: 'https://rajeshjewellers.com',
    isActive: true,
  },
  primaryShopDetails: {
    _id: '507f1f77bcf86cd799439013',
    name: 'Main Branch - Connaught Place',
    code: 'RJ-CP-001',
    address: 'Shop No. 45, Connaught Place, New Delhi - 110001',
    isActive: true,
  },
  shopAccesses: [
    {
      _id: '507f1f77bcf86cd799439030',
      shopId: '507f1f77bcf86cd799439013',
      role: 'shop_admin',
      permissions: {
        inventory: { view: true, create: true, edit: true, delete: true },
        sales: { view: true, create: true, edit: true, delete: false },
        purchase: { view: true, create: true, edit: false, delete: false },
      },
    },
  ],
  activityLogs: [
    {
      _id: '507f1f77bcf86cd799439040',
      action: 'login',
      module: 'auth',
      description: 'User logged in successfully',
      timestamp: '2025-01-02T10:30:00.000Z',
    },
    {
      _id: '507f1f77bcf86cd799439041',
      action: 'profile_update',
      module: 'user',
      description: 'Updated profile information',
      timestamp: '2025-01-02T11:15:00.000Z',
    },
  ],
};

/**
 * Helper: Get dummy user by role
 */
export const getDummyUserByRole = (role: string): User => {
  const users = {
    super_admin: dummySuperAdmin,
    shop_admin: dummyUser,
    staff: dummyStaff,
  };
  
  return users[role as keyof typeof users] || dummyUser;
};

/**
 * Helper: Get current logged-in user (for localStorage/context)
 */
export const getCurrentDummyUser = (): User => {
  // You can switch this based on what you're testing
  return dummyUser; // Change to dummySuperAdmin or dummyStaff as needed
};

/**
 * Export all dummy data
 */
export default {
  dummyUser,
  dummySuperAdmin,
  dummyStaff,
  dummyUserProfile,
  dummyUserList,
  dummyUserWithRelations,
  getDummyUserByRole,
  getCurrentDummyUser,
};