// ============================================================================
// FILE: store/hooks/base.ts
// Base Redux Hooks - Typed hooks for TypeScript
// ============================================================================

import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

import type { RootState, AppDispatch } from '../index'

// ============================================================================
// TYPED HOOKS
// ============================================================================

/**
 * Typed useDispatch hook
 * Use throughout your app instead of plain `useDispatch`
 */
export const useAppDispatch = () => useDispatch<AppDispatch>()

/**
 * Typed useSelector hook
 * Use throughout your app instead of plain `useSelector`
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  useAppDispatch,
  useAppSelector,
}
