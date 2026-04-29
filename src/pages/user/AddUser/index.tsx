// FILE: src/pages/user/AddUser/index.tsx
// Add/Edit User Page - Real API Integration

import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { UserForm } from '@/components/user/UserForm'
import type { User } from '@/types/user.types'
import type { CreateUserInput } from '@/validators/userValidator'
import { useCurrentUser, useShopAccesses } from '@/hooks/auth'

/**
 * HELPER: Convert User to Form Data
 */
const convertUserToFormData = (user: User): Partial<CreateUserInput> => {
  // super_admin ko form mein edit nahi kar sakte
  const allowedRoles = ['org_admin', 'shop_admin', 'manager', 'staff', 'accountant', 'viewer'] as const
  type AllowedRole = typeof allowedRoles[number]

  return {
    username: user.username,
    email: user.email,
    password: '',
    confirmPassword: '',
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,

    // Role & Access — super_admin ko undefined karo
    role: allowedRoles.includes(user.role as AllowedRole)
      ? (user.role as AllowedRole)
      : undefined,
    organizationId: user.organizationId || undefined,
    primaryShop: user.primaryShop || undefined,
    // Employee Info
    designation: user.designation,
    department: user.department,
    employeeId: user.employeeId,
    joiningDate: user.joiningDate?.toString().split('T')[0],

    // Sales Info
    salesTarget: user.salesTarget,
    commissionRate: user.commissionRate,

    // Preferences
    preferences: user.preferences,
  }
}

/**
 * PAGE COMPONENT
 */
export default function AddUserPage() {
  const navigate = useNavigate()
  const { userId } = useParams()
  const isEditMode = Boolean(userId)

  // Get current user from Redux
  const currentUser = useCurrentUser()
  const shopAccesses = useShopAccesses()
  const organizationId = currentUser?.organizationId || undefined // Convert null to undefined
  const defaultPrimaryShop =
    currentUser?.primaryShop ||
    (shopAccesses.length > 0 ? shopAccesses[0].shopId : undefined)
  // TODO: Replace with real API call to fetch user by ID
  // Example: const { data: user, isLoading } = useGetUserQuery(userId)
const mockUser = useMemo((): any => {
    if (!isEditMode || !userId) return undefined
    // 🔜 Replace this with actual API call
    // return user
    return undefined // No mock data
  }, [userId, isEditMode])

  // Convert user to form data
  const initialData = useMemo(() => {
    if (!mockUser) return undefined
    return convertUserToFormData(mockUser)
  }, [mockUser])

  return (
    <UserForm
      organizationId={organizationId} // Now type-safe (string | undefined)
      userId={userId}
      initialData={initialData}
      onSuccess={() => {
        navigate('/users')
      }}
      onCancel={() => {
        navigate('/users')
      }}
      mode={isEditMode ? 'edit' : 'create'}
    />
  )
}
