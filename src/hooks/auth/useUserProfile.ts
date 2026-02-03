//
// FILE: hooks/auth/useUserProfile.ts
// User Profile Actions - getUser / updateProfile
//

import { useCallback } from 'react'
import { useAppDispatch } from '@/store/hooks'
import {
  fetchUserProfile,
  updateUserProfile as updateProfileAction,
} from '@/store/slices/userSlice'

import type { UpdateProfileRequest } from '@/types'

//
// USER PROFILE HOOK
//

export const useUserProfile = () => {
  const dispatch = useAppDispatch()

  const getUser = useCallback(async () => {
    try {
      const result = await dispatch(fetchUserProfile()).unwrap()
      return { success: true, data: result }
    } catch (error: any) {
      throw error
    }
  }, [dispatch])

  const updateProfile = useCallback(
    async (updates: UpdateProfileRequest) => {
      try {
        const result = await dispatch(updateProfileAction(updates)).unwrap()
        return { success: true, data: result }
      } catch (error: any) {
        throw error
      }
    },
    [dispatch]
  )

  return {
    getUser,
    updateProfile,
  }
}
