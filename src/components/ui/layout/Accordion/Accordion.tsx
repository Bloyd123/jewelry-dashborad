// ============================================================================
// FILE: src/components/ui/layout/Accordion/Accordion.tsx
// Theme-based Accordion Component - Flexible & Responsive
// ============================================================================

import * as React from 'react'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type AccordionVariant = 'default' | 'bordered' | 'separated' | 'ghost'
export type AccordionSize = 'sm' | 'md' | 'lg'

export interface AccordionItemData {
  value: string
  title: string | React.ReactNode
  content: React.ReactNode
  icon?: React.ReactNode
  badge?: React.ReactNode
  disabled?: boolean
}

export interface AccordionProps {
  items?: AccordionItemData[]
  type?: 'single' | 'multiple'
  defaultValue?: string | string[]
  value?: string | string[]
  onValueChange?: (value: string | string[]) => void
  variant?: AccordionVariant
  size?: AccordionSize
  collapsible?: boolean
  className?: string
  children?: React.ReactNode
}

// ============================================================================
// STYLES
// ============================================================================

const variantStyles: Record<AccordionVariant, {
  container: string
  item: string
  trigger: string
  content: string
}> = {
  default: {
    container: 'space-y-0',
    item: 'border-b border-border-secondary last:border-b-0',
    trigger: 'hover:bg-bg-tertiary',
    content: 'bg-bg-secondary',
  },
  bordered: {
    container: 'space-y-0 border border-border-primary rounded-lg overflow-hidden',
    item: 'border-b border-border-secondary last:border-b-0',
    trigger: 'hover:bg-bg-tertiary',
    content: 'bg-bg-secondary',
  },
  separated: {
    container: 'space-y-3',
    item: 'border border-border-primary rounded-lg overflow-hidden',
    trigger: 'hover:bg-bg-tertiary',
    content: 'bg-bg-secondary',
  },
  ghost: {
    container: 'space-y-2',
    item: 'rounded-lg',
    trigger: 'hover:bg-bg-tertiary rounded-lg',
    content: 'bg-transparent',
  },
}

const sizeStyles: Record<AccordionSize, {
  trigger: string
  content: string
  icon: string
}> = {
  sm: {
    trigger: 'py-2 px-3 text-sm',
    content: 'px-3 py-2 text-sm',
    icon: 'h-4 w-4',
  },
  md: {
    trigger: 'py-3 px-4 text-base',
    content: 'px-4 py-3 text-base',
    icon: 'h-5 w-5',
  },
  lg: {
    trigger: 'py-4 px-6 text-lg',
    content: 'px-6 py-4 text-lg',
    icon: 'h-6 w-6',
  },
}

// ============================================================================
// ACCORDION ROOT COMPONENT
// ============================================================================

export const Accordion = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Root>,
  AccordionProps
>(({
  items,
  type = 'single',
  defaultValue,
  value,
  onValueChange,
  variant = 'default',
  size = 'md',
  collapsible = true,
  className,
  children,
}, ref) => {
  const styles = variantStyles[variant]

  // If items array is provided, render them automatically
  if (items && items.length > 0) {
    return (
      <AccordionPrimitive.Root
        ref={ref}
        type={type as any}
        defaultValue={defaultValue as any}
        value={value as any}
        onValueChange={onValueChange as any}
        collapsible={type === 'single' ? collapsible : undefined}
        className={cn(styles.container, className)}
      >
        {items.map((item) => (
          <AccordionItem
            key={item.value}
            value={item.value}
            variant={variant}
            size={size}
            disabled={item.disabled}
          >
            <AccordionTrigger
              variant={variant}
              size={size}
              icon={item.icon}
              badge={item.badge}
            >
              {item.title}
            </AccordionTrigger>
            <AccordionContent variant={variant} size={size}>
              {item.content}
            </AccordionContent>
          </AccordionItem>
        ))}
      </AccordionPrimitive.Root>
    )
  }

  // Otherwise, render children (manual composition)
  return (
    <AccordionPrimitive.Root
      ref={ref}
      type={type as any}
      defaultValue={defaultValue as any}
      value={value as any}
      onValueChange={onValueChange as any}
      collapsible={type === 'single' ? collapsible : undefined}
      className={cn(styles.container, className)}
    >
      {children}
    </AccordionPrimitive.Root>
  )
})

Accordion.displayName = 'Accordion'

// ============================================================================
// ACCORDION ITEM COMPONENT
// ============================================================================

interface AccordionItemProps extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item> {
  variant?: AccordionVariant
  size?: AccordionSize
}

export const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  AccordionItemProps
>(({ className, variant = 'default', size = 'md', ...props }, ref) => {
  const styles = variantStyles[variant]
  
  return (
    <AccordionPrimitive.Item
      ref={ref}
      className={cn(styles.item, className)}
      {...props}
    />
  )
})

AccordionItem.displayName = 'AccordionItem'

// ============================================================================
// ACCORDION TRIGGER COMPONENT
// ============================================================================

interface AccordionTriggerProps extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> {
  variant?: AccordionVariant
  size?: AccordionSize
  icon?: React.ReactNode
  badge?: React.ReactNode
}

export const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  AccordionTriggerProps
>(({ className, children, variant = 'default', size = 'md', icon, badge, ...props }, ref) => {
  const styles = variantStyles[variant]
  const sizeStyle = sizeStyles[size]
  
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        ref={ref}
        className={cn(
          'flex flex-1 items-center justify-between font-medium transition-all',
          'text-text-primary',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          '[&[data-state=open]>svg.chevron]:rotate-180',
          styles.trigger,
          sizeStyle.trigger,
          className
        )}
        {...props}
      >
        <div className="flex items-center gap-3 flex-1">
          {icon && (
            <span className="shrink-0 text-text-secondary">
              {icon}
            </span>
          )}
          <span className="text-left">{children}</span>
        </div>
        
        <div className="flex items-center gap-2 ml-4">
          {badge && <span className="shrink-0">{badge}</span>}
          <ChevronDown
            className={cn(
              'chevron shrink-0 text-text-secondary transition-transform duration-200',
              sizeStyle.icon
            )}
          />
        </div>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
})

AccordionTrigger.displayName = 'AccordionTrigger'

// ============================================================================
// ACCORDION CONTENT COMPONENT
// ============================================================================

interface AccordionContentProps extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content> {
  variant?: AccordionVariant
  size?: AccordionSize
}

export const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  AccordionContentProps
>(({ className, children, variant = 'default', size = 'md', ...props }, ref) => {
  const styles = variantStyles[variant]
  const sizeStyle = sizeStyles[size]
  
  return (
    <AccordionPrimitive.Content
      ref={ref}
      className={cn(
        'overflow-hidden text-text-secondary transition-all',
        'data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down',
        styles.content
      )}
      {...props}
    >
      <div className={cn(sizeStyle.content, className)}>
        {children}
      </div>
    </AccordionPrimitive.Content>
  )
})

AccordionContent.displayName = 'AccordionContent'