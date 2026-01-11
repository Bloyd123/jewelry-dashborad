// FILE: src/pages/user/AddUser/index.tsx
// Add/Edit User Page

import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { UserForm } from '@/components/user/UserForm'
import type { User } from '@/types/user.types'
import { MOCK_USERS } from './mockdata'
import type { CreateUserInput } from '@/validators/userValidator'

/**
 * HELPER: Convert User to Form Data
 */
const convertUserToFormData = (user: User): Partial<CreateUserInput> => {
  return {
    username: user.username,
    email: user.email,
    // Password fields are empty for edit mode (user should set new password if needed)
    password: '',
    confirmPassword: '',
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,

    // Role & Access
    role: user.role,
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

  // Mock organization ID (Replace with actual from Redux/Context)
  const organizationId = 'org_123'

  // Fetch mock user data if editing
  const mockUser = useMemo(() => {
    if (!isEditMode || !userId) return undefined
    return MOCK_USERS.find(u => u._id === userId)
  }, [userId, isEditMode])

  // Convert user to form data
  const initialData = useMemo(() => {
    if (!mockUser) return undefined
    return convertUserToFormData(mockUser)
  }, [mockUser])

  return (
    <UserForm
      organizationId={organizationId}
      userId={userId}
      initialData={initialData}
      onSuccess={() => {
        console.log('Mock Success - Navigate to /users')
        navigate('/users')
      }}
      onCancel={() => {
        navigate('/users')
      }}
      mode={isEditMode ? 'edit' : 'create'}
    />
  )
}
