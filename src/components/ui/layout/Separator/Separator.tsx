// ============================================================================
// FILE: src/components/ui/layout/Separator/Separator.tsx
// Theme-based Separator Component - Flexible & Responsive
// ============================================================================

import * as React from 'react'
import * as SeparatorPrimitive from '@radix-ui/react-separator'
import { cn } from '@/lib/utils'

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type SeparatorVariant = 'solid' | 'dashed' | 'dotted' | 'gradient'
export type SeparatorSize = 'xs' | 'sm' | 'md' | 'lg'
export type SeparatorColor = 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error'

export interface SeparatorProps extends React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> {
  orientation?: 'horizontal' | 'vertical'
  decorative?: boolean
  variant?: SeparatorVariant
  size?: SeparatorSize
  color?: SeparatorColor
  label?: string | React.ReactNode
  icon?: React.ReactNode
  spacing?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

// ============================================================================
// STYLES
// ============================================================================

const variantStyles: Record<SeparatorVariant, string> = {
  solid: 'border-solid',
  dashed: 'border-dashed',
  dotted: 'border-dotted',
  gradient: 'border-none bg-gradient-to-r',
}

const sizeStyles: Record<SeparatorSize, {
  horizontal: string
  vertical: string
}> = {
  xs: {
    horizontal: 'h-px',
    vertical: 'w-px',
  },
  sm: {
    horizontal: 'h-[2px]',
    vertical: 'w-[2px]',
  },
  md: {
    horizontal: 'h-[3px]',
    vertical: 'w-[3px]',
  },
  lg: {
    horizontal: 'h-1',
    vertical: 'w-1',
  },
}

const colorStyles: Record<SeparatorColor, string> = {
  primary: 'border-border-primary bg-border-primary',
  secondary: 'border-border-secondary bg-border-secondary',
  accent: 'border-accent bg-accent',
  success: 'border-status-success bg-status-success',
  warning: 'border-status-warning bg-status-warning',
  error: 'border-status-error bg-status-error',
}

const spacingStyles: Record<string, {
  horizontal: string
  vertical: string
}> = {
  none: { horizontal: 'my-0', vertical: 'mx-0' },
  xs: { horizontal: 'my-1', vertical: 'mx-1' },
  sm: { horizontal: 'my-2', vertical: 'mx-2' },
  md: { horizontal: 'my-4', vertical: 'mx-4' },
  lg: { horizontal: 'my-6', vertical: 'mx-6' },
  xl: { horizontal: 'my-8', vertical: 'mx-8' },
}

// ============================================================================
// SEPARATOR COMPONENT
// ============================================================================

export const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  SeparatorProps
>(({
  className,
  orientation = 'horizontal',
  decorative = true,
  variant = 'solid',
  size = 'xs',
  color = 'secondary',
  label,
  icon,
  spacing = 'md',
  ...props
}, ref) => {
  const isHorizontal = orientation === 'horizontal'
  
  // Gradient style for gradient variant
  const gradientStyle = variant === 'gradient'
    ? 'from-transparent via-border-secondary to-transparent'
    : ''

  // If there's a label or icon, render with content
  if (label || icon) {
    return (
      <div
        className={cn(
          'flex items-center',
          isHorizontal ? 'w-full' : 'flex-col h-full',
          spacingStyles[spacing][isHorizontal ? 'horizontal' : 'vertical'],
          className
        )}
      >
        {/* First separator line */}
        <SeparatorPrimitive.Root
          ref={ref}
          decorative={decorative}
          orientation={orientation}
          className={cn(
            'shrink-0 bg-border-secondary',
            isHorizontal ? 'flex-1 h-px' : 'flex-1 w-px',
            variantStyles[variant],
            sizeStyles[size][isHorizontal ? 'horizontal' : 'vertical'],
            colorStyles[color],
            variant === 'gradient' && gradientStyle
          )}
          {...props}
        />
        
        {/* Label/Icon */}
        <div
          className={cn(
            'shrink-0 flex items-center justify-center text-text-tertiary text-sm',
            isHorizontal ? 'px-3' : 'py-3'
          )}
        >
          {icon && <span className="mr-2">{icon}</span>}
          {label && <span>{label}</span>}
        </div>
        
        {/* Second separator line */}
        <SeparatorPrimitive.Root
          decorative={decorative}
          orientation={orientation}
          className={cn(
            'shrink-0 bg-border-secondary',
            isHorizontal ? 'flex-1 h-px' : 'flex-1 w-px',
            variantStyles[variant],
            sizeStyles[size][isHorizontal ? 'horizontal' : 'vertical'],
            colorStyles[color],
            variant === 'gradient' && gradientStyle
          )}
        />
      </div>
    )
  }

  // Simple separator without label
  return (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        'shrink-0',
        isHorizontal
          ? cn('w-full', sizeStyles[size].horizontal)
          : cn('h-full', sizeStyles[size].vertical),
        variantStyles[variant],
        colorStyles[color],
        variant === 'gradient' && gradientStyle,
        spacingStyles[spacing][isHorizontal ? 'horizontal' : 'vertical'],
        className
      )}
      {...props}
    />
  )
})

Separator.displayName = 'Separator'

// ============================================================================
// SECTION DIVIDER (CONVENIENCE COMPONENT)
// ============================================================================

interface SectionDividerProps {
  title?: string
  subtitle?: string
  icon?: React.ReactNode
  color?: SeparatorColor
  className?: string
}

export const SectionDivider: React.FC<SectionDividerProps> = ({
  title,
  subtitle,
  icon,
  color = 'secondary',
  className,
}) => {
  return (
    <div className={cn('flex flex-col gap-3 my-6', className)}>
      {(title || subtitle || icon) && (
        <div className="flex items-center gap-3">
          {icon && (
            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-bg-tertiary text-text-primary">
              {icon}
            </div>
          )}
          <div className="flex-1">
            {title && (
              <h3 className="text-base font-semibold text-text-primary">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-sm text-text-secondary mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      )}
      <Separator color={color} />
    </div>
  )
}

SectionDivider.displayName = 'SectionDivider'