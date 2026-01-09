// FILE: src/components/ui/data-display/Avatar/Avatar.tsx
// Reusable Avatar Component

import * as React from 'react'
import * as AvatarPrimitive from '@radix-ui/react-avatar'
import { cn } from '@/lib/utils'
import { User } from 'lucide-react'

const AvatarRoot = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-bg-tertiary',
      className
    )}
    {...props}
  />
))
AvatarRoot.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn('aspect-square h-full w-full object-cover', className)}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      'flex h-full w-full items-center justify-center rounded-full bg-bg-tertiary font-medium text-text-primary',
      className
    )}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

// Composite Avatar Component with Extra Features

export interface AvatarProps {
  src?: string
  alt?: string
  name?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  status?: 'online' | 'offline' | 'away' | 'busy'
  className?: string
  fallbackClassName?: string
}

const sizeClasses = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-lg',
}

const statusClasses = {
  online: 'bg-status-success',
  offline: 'bg-gray-400',
  away: 'bg-status-warning',
  busy: 'bg-status-error',
}

/**
 * Get initials from name
 * Example: "John Doe" -> "JD"
 */
const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

/**
 * Generate consistent color based on name
 */
const getColorFromName = (name: string): string => {
  const colors = [
    'bg-red-500/20 text-red-600 dark:text-red-400',
    'bg-blue-500/20 text-blue-600 dark:text-blue-400',
    'bg-green-500/20 text-green-600 dark:text-green-400',
    'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400',
    'bg-purple-500/20 text-purple-600 dark:text-purple-400',
    'bg-pink-500/20 text-pink-600 dark:text-pink-400',
    'bg-indigo-500/20 text-indigo-600 dark:text-indigo-400',
    'bg-orange-500/20 text-orange-600 dark:text-orange-400',
  ]

  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return colors[hash % colors.length]
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  (
    { src, alt, name, size = 'md', status, className, fallbackClassName },
    ref
  ) => {
    const initials = name ? getInitials(name) : '?'
    const colorClass = name ? getColorFromName(name) : ''

    return (
      <div className="relative inline-block" ref={ref}>
        <AvatarRoot className={cn(sizeClasses[size], className)}>
          {src && <AvatarImage src={src} alt={alt || name || 'Avatar'} />}
          <AvatarFallback className={cn(colorClass, fallbackClassName)}>
            {name ? initials : <User className="h-1/2 w-1/2" />}
          </AvatarFallback>
        </AvatarRoot>

        {/* Status Indicator */}
        {status && (
          <span
            className={cn(
              'absolute bottom-0 right-0 block rounded-full ring-2 ring-bg-secondary',
              statusClasses[status],
              size === 'xs' && 'h-1.5 w-1.5',
              size === 'sm' && 'h-2 w-2',
              size === 'md' && 'h-2.5 w-2.5',
              size === 'lg' && 'h-3 w-3',
              size === 'xl' && 'h-4 w-4'
            )}
          />
        )}
      </div>
    )
  }
)

Avatar.displayName = 'Avatar'

// Avatar Group Component (for multiple avatars)

export interface AvatarGroupProps {
  children: React.ReactNode
  max?: number
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  children,
  max = 3,
  size = 'md',
  className,
}) => {
  const avatars = React.Children.toArray(children)
  const displayedAvatars = avatars.slice(0, max)
  const remainingCount = avatars.length - max

  return (
    <div className={cn('flex -space-x-2', className)}>
      {displayedAvatars}
      {remainingCount > 0 && (
        <AvatarRoot
          className={cn(sizeClasses[size], 'border-2 border-bg-secondary')}
        >
          <AvatarFallback className="bg-bg-tertiary text-xs font-medium text-text-secondary">
            +{remainingCount}
          </AvatarFallback>
        </AvatarRoot>
      )}
    </div>
  )
}

AvatarGroup.displayName = 'AvatarGroup'
