// ============================================================================
// FILE: src/components/ui/navigation/Tabs/Tabs.tsx
// Theme-based Tabs Component - Flexible & Responsive
// ============================================================================

import * as React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cn } from '@/lib/utils'

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type TabsVariant = 'default' | 'pills' | 'underline'
export type TabsSize = 'sm' | 'md' | 'lg'

export interface TabItem {
  value: string
  label: string
  icon?: React.ReactNode
  disabled?: boolean
  badge?: React.ReactNode
}

export interface TabsProps {
  tabs: TabItem[]
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  variant?: TabsVariant
  size?: TabsSize
  orientation?: 'horizontal' | 'vertical'
  fullWidth?: boolean
  className?: string
  children?: React.ReactNode
}

// ============================================================================
// STYLES
// ============================================================================

const sizeStyles: Record<TabsSize, string> = {
  sm: 'text-sm px-3 py-1.5 gap-1.5',
  md: 'text-sm px-4 py-2 gap-2',
  lg: 'text-base px-5 py-2.5 gap-2.5',
}

const variantStyles: Record<
  TabsVariant,
  {
    list: string
    trigger: string
    triggerActive: string
  }
> = {
  default: {
    list: 'rounded-lg p-1 bg-bg-tertiary',
    trigger:
      'rounded-md data-[state=active]:bg-bg-secondary data-[state=active]:shadow-sm',
    triggerActive: 'text-text-primary',
  },
  pills: {
    list: 'gap-2',
    trigger:
      'rounded-full border border-border-primary data-[state=active]:bg-accent data-[state=active]:border-accent data-[state=active]:text-white',
    triggerActive: 'text-text-primary',
  },
  underline: {
    list: 'border-b border-border-secondary gap-0',
    trigger:
      'rounded-none border-b-2 border-transparent data-[state=active]:border-accent',
    triggerActive: 'text-accent',
  },
}

// ============================================================================
// TABS COMPONENT
// ============================================================================

const Tabs = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  TabsProps
>(
  (
    {
      tabs,
      defaultValue,
      value,
      onValueChange,
      variant = 'default',
      size = 'md',
      orientation = 'horizontal',
      fullWidth = false,
      className,
      children,
    },
    ref
  ) => {
    const styles = variantStyles[variant]

    return (
      <TabsPrimitive.Root
        ref={ref}
        defaultValue={defaultValue || tabs[0]?.value}
        value={value}
        onValueChange={onValueChange}
        orientation={orientation}
        className={cn(
          'flex',
          orientation === 'vertical' ? 'flex-row gap-4' : 'flex-col gap-4',
          className
        )}
      >
        <TabsPrimitive.List
          className={cn(
            'inline-flex items-center justify-start',
            orientation === 'horizontal' && 'flex-row',
            orientation === 'vertical' && 'flex-col items-stretch',
            fullWidth && 'w-full',
            styles.list
          )}
        >
          {tabs.map(tab => (
            <TabsPrimitive.Trigger
              key={tab.value}
              value={tab.value}
              disabled={tab.disabled}
              className={cn(
                'inline-flex items-center justify-center whitespace-nowrap font-medium transition-all',
                'text-text-secondary hover:text-text-primary',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
                'disabled:pointer-events-none disabled:opacity-50',
                sizeStyles[size],
                styles.trigger,
                fullWidth && orientation === 'horizontal' && 'flex-1',
                `data-[state=active]:${styles.triggerActive}`
              )}
            >
              {tab.icon && <span className="shrink-0">{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.badge && <span className="ml-auto">{tab.badge}</span>}
            </TabsPrimitive.Trigger>
          ))}
        </TabsPrimitive.List>

        {children}
      </TabsPrimitive.Root>
    )
  }
)

Tabs.displayName = 'Tabs'

// ============================================================================
// TAB CONTENT COMPONENT
// ============================================================================

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'ring-offset-background mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
      className
    )}
    {...props}
  />
))

TabsContent.displayName = 'TabsContent'

// ============================================================================
// EXPORTS
// ============================================================================

export { Tabs, TabsContent }
