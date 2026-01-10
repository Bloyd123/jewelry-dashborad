// FILE: components/ui/loader/types.ts
// TypeScript Interfaces for Loader Components

export type LoaderSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type LoaderVariant = 'spinner' | 'dots' | 'pulse' | 'bars'
export type LoaderColor = 'primary' | 'accent' | 'success' | 'warning' | 'error'

export interface LoaderProps {
  size?: LoaderSize
  variant?: LoaderVariant
  text?: string
  fullScreen?: boolean
  overlay?: boolean
  color?: LoaderColor
}

export type SkeletonVariant = 'text' | 'circular' | 'rectangular' | 'rounded'

export interface SkeletonProps {
  variant?: SkeletonVariant
  width?: string
  height?: string
  className?: string
  count?: number
  animate?: boolean
}

export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg'

export interface SpinnerProps {
  size?: SpinnerSize
  className?: string
}
