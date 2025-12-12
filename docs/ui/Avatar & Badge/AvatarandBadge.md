# Avatar & Badge Components Developer Guide

## Table of Contents
1. [Avatar Component](#avatar-component)
2. [Avatar Group Component](#avatar-group-component)
3. [Badge Component](#badge-component)
4. [Best Practices](#best-practices)
5. [Common Patterns](#common-patterns)
6. [Testing](#testing)

---

## Avatar Component

### Overview

The Avatar component displays user profile images with automatic fallback to initials or a default icon. It includes built-in status indicators and consistent color generation.

### Import

```typescript
import { Avatar } from '@/components/ui/data-display/Avatar'
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | `undefined` | Image URL for the avatar |
| `alt` | `string` | `undefined` | Alt text for the image |
| `name` | `string` | `undefined` | User name (used for initials and color) |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Size of the avatar |
| `status` | `'online' \| 'offline' \| 'away' \| 'busy'` | `undefined` | Status indicator |
| `className` | `string` | `undefined` | Additional CSS classes |
| `fallbackClassName` | `string` | `undefined` | Classes for fallback content |

### Size Reference

| Size | Dimensions | Use Case |
|------|------------|----------|
| `xs` | 24px (h-6 w-6) | Inline mentions, compact lists |
| `sm` | 32px (h-8 w-8) | Table rows, small cards |
| `md` | 40px (h-10 w-10) | Default, most use cases |
| `lg` | 48px (h-12 w-12) | User profiles, prominent display |
| `xl` | 64px (h-16 w-16) | Profile pages, large cards |

### Usage Examples

#### Basic Avatar with Image

```tsx
<Avatar 
  src="https://example.com/avatar.jpg" 
  alt="John Doe"
  name="John Doe" 
/>
```

#### Avatar with Initials (No Image)

```tsx
<Avatar name="Jane Smith" />
// Displays "JS" with consistent color
```

#### Avatar with Status Indicator

```tsx
<Avatar 
  name="John Doe"
  status="online"
  size="lg"
/>
```

#### Different Sizes

```tsx
<div className="flex items-center gap-4">
  <Avatar name="User" size="xs" />
  <Avatar name="User" size="sm" />
  <Avatar name="User" size="md" />
  <Avatar name="User" size="lg" />
  <Avatar name="User" size="xl" />
</div>
```

#### All Status Types

```tsx
<div className="flex gap-4">
  <Avatar name="Online User" status="online" />
  <Avatar name="Away User" status="away" />
  <Avatar name="Busy User" status="busy" />
  <Avatar name="Offline User" status="offline" />
</div>
```

#### Custom Styling

```tsx
<Avatar 
  name="Custom User"
  className="ring-2 ring-accent"
  fallbackClassName="bg-gradient-to-br from-purple-500 to-pink-500 text-white"
/>
```

### Features

#### Automatic Initials Generation

The component automatically generates initials from names:
- **"John Doe"** → **"JD"**
- **"Jane"** → **"JA"**
- **"Mary Jane Watson"** → **"MW"** (first + last)

#### Consistent Color Scheme

Each name generates a consistent color from a predefined palette:
```typescript
// Same name always produces the same color
<Avatar name="John Doe" /> // Always gets the same color
```

Available colors:
- Red, Blue, Green, Yellow
- Purple, Pink, Indigo, Orange

#### Status Indicators

Status dots appear at the bottom-right with appropriate colors:
- **Online**: Green
- **Offline**: Gray
- **Away**: Yellow/Orange
- **Busy**: Red

---

## Avatar Group Component

### Overview

Display multiple avatars in an overlapping stack with optional overflow count.

### Import

```typescript
import { AvatarGroup } from '@/components/ui/data-display/Avatar'
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | required | Avatar components to display |
| `max` | `number` | `3` | Maximum avatars to show before overflow |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Size applied to all avatars |
| `className` | `string` | `undefined` | Additional CSS classes |

### Usage Examples

#### Basic Avatar Group

```tsx
<AvatarGroup max={4}>
  <Avatar name="John Doe" src="/avatars/john.jpg" />
  <Avatar name="Jane Smith" src="/avatars/jane.jpg" />
  <Avatar name="Bob Johnson" src="/avatars/bob.jpg" />
  <Avatar name="Alice Brown" src="/avatars/alice.jpg" />
  <Avatar name="Charlie Wilson" />
  <Avatar name="Diana Prince" />
</AvatarGroup>
// Shows 4 avatars + "+2" indicator
```

#### Small Avatar Group

```tsx
<AvatarGroup size="sm" max={3}>
  <Avatar name="User 1" />
  <Avatar name="User 2" />
  <Avatar name="User 3" />
</AvatarGroup>
```

#### Team Members Display

```tsx
<div className="flex items-center gap-3">
  <span className="text-sm text-text-secondary">Team:</span>
  <AvatarGroup max={5}>
    {team.members.map(member => (
      <Avatar 
        key={member.id}
        name={member.name}
        src={member.avatar}
        status={member.status}
      />
    ))}
  </AvatarGroup>
</div>
```

---

## Badge Component

### Overview

Versatile badge component for displaying status, tags, categories, and labels with multiple style variants.

### Import

```typescript
import { Badge } from '@/components/ui/data-display/Badge'
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | See variants below | `'default'` | Visual style variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Badge size |
| `icon` | `React.ReactNode` | `undefined` | Icon to display before text |
| `dot` | `boolean` | `false` | Show status dot indicator |
| `onClick` | `() => void` | `undefined` | Click handler (makes badge interactive) |
| `className` | `string` | `undefined` | Additional CSS classes |

### Variants

#### General Purpose
- `default`: Neutral badge
- `outline`: Bordered, transparent background
- `accent`: Accent color theme
- `success`: Green, for success states
- `warning`: Yellow/Orange, for warnings
- `error`: Red, for errors
- `info`: Blue, for information

#### Status Specific
- `active`: Green, for active items
- `inactive`: Gray, for inactive items
- `pending`: Yellow, for pending states
- `completed`: Green, for completed tasks
- `cancelled`: Red, for cancelled items

#### Customer Types
- `vip`: Gold gradient for VIP customers
- `retail`: Blue for retail customers
- `wholesale`: Purple for wholesale customers

### Size Reference

| Size | Padding | Font Size | Use Case |
|------|---------|-----------|----------|
| `sm` | px-2 py-0.5 | 10px | Compact tables, inline tags |
| `md` | px-2.5 py-0.5 | 12px | Default, most use cases |
| `lg` | px-3 py-1 | 14px | Prominent badges, headers |

### Usage Examples

#### Basic Badges

```tsx
<Badge>Default</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="error">Error</Badge>
<Badge variant="info">Info</Badge>
```

#### Status Badges

```tsx
<Badge variant="active">Active</Badge>
<Badge variant="inactive">Inactive</Badge>
<Badge variant="pending">Pending</Badge>
<Badge variant="completed">Completed</Badge>
<Badge variant="cancelled">Cancelled</Badge>
```

#### Customer Type Badges

```tsx
<Badge variant="vip">VIP Customer</Badge>
<Badge variant="retail">Retail</Badge>
<Badge variant="wholesale">Wholesale</Badge>
```

#### With Icons

```tsx
import { Check, Clock, AlertCircle } from 'lucide-react'

<Badge variant="success" icon={<Check className="h-3 w-3" />}>
  Verified
</Badge>

<Badge variant="warning" icon={<Clock className="h-3 w-3" />}>
  Pending Review
</Badge>

<Badge variant="error" icon={<AlertCircle className="h-3 w-3" />}>
  Failed
</Badge>
```

#### With Status Dot

```tsx
<Badge variant="success" dot>Online</Badge>
<Badge variant="warning" dot>Away</Badge>
<Badge variant="error" dot>Busy</Badge>
```

#### Different Sizes

```tsx
<div className="flex items-center gap-2">
  <Badge size="sm">Small</Badge>
  <Badge size="md">Medium</Badge>
  <Badge size="lg">Large</Badge>
</div>
```

#### Interactive Badges

```tsx
<Badge 
  variant="outline" 
  onClick={() => console.log('Badge clicked')}
>
  Clickable Tag
</Badge>
```

#### Tag System

```tsx
<div className="flex flex-wrap gap-2">
  {tags.map(tag => (
    <Badge 
      key={tag.id}
      variant="outline"
      onClick={() => handleRemoveTag(tag.id)}
    >
      {tag.name}
    </Badge>
  ))}
</div>
```

---

## Best Practices

### Avatar Best Practices

#### 1. Always Provide Name When Possible

```tsx
// ✅ Good - provides fallback and color
<Avatar name="John Doe" src={imageUrl} />

// ❌ Avoid - no fallback information
<Avatar src={imageUrl} />
```

#### 2. Use Appropriate Sizes for Context

```tsx
// ✅ Good - size matches context
<div className="table-row">
  <Avatar name="User" size="sm" /> {/* Compact for tables */}
</div>

<div className="profile-header">
  <Avatar name="User" size="xl" /> {/* Large for profiles */}
</div>
```

#### 3. Status Indicators Should Be Meaningful

```tsx
// ✅ Good - real-time status
<Avatar 
  name={user.name}
  status={user.isOnline ? 'online' : 'offline'}
/>

// ❌ Avoid - don't show status if not tracking it
<Avatar name={user.name} status="online" /> {/* If not real-time */}
```

### Badge Best Practices

#### 1. Choose Semantically Appropriate Variants

```tsx
// ✅ Good - variant matches meaning
<Badge variant="success">Paid</Badge>
<Badge variant="warning">Payment Due</Badge>
<Badge variant="error">Overdue</Badge>

// ❌ Avoid - misleading colors
<Badge variant="success">Failed</Badge> {/* Confusing! */}
```

#### 2. Don't Overuse Interactive Badges

```tsx
// ✅ Good - interactive when it makes sense
<Badge variant="outline" onClick={removeFilter}>
  {filterName} ×
</Badge>

// ❌ Avoid - status shouldn't be clickable
<Badge variant="completed" onClick={something}>
  Completed
</Badge>
```

#### 3. Use Consistent Variants for Same Concepts

```tsx
// ✅ Good - consistent mapping
const statusVariants = {
  active: 'active',
  inactive: 'inactive',
  pending: 'pending',
} as const

<Badge variant={statusVariants[user.status]}>
  {user.status}
</Badge>
```

### Accessibility

#### Avatar Accessibility

```tsx
// ✅ Provide meaningful alt text
<Avatar 
  src={imageUrl}
  alt={`${user.name}'s profile picture`}
  name={user.name}
/>
```

#### Badge Accessibility

```tsx
// ✅ Use semantic HTML when interactive
{isClickable ? (
  <Badge onClick={handler}>Tag</Badge>
) : (
  <Badge>Status</Badge>
)}

// ✅ Add aria-label for icon-only badges
<Badge 
  variant="success"
  icon={<Check />}
  aria-label="Verified user"
/>
```

---

## Common Patterns

### User Profile Card

```tsx
<div className="flex items-center gap-3 p-4 rounded-lg bg-bg-secondary">
  <Avatar 
    name={user.name}
    src={user.avatar}
    size="lg"
    status={user.status}
  />
  <div className="flex-1">
    <h3 className="font-semibold">{user.name}</h3>
    <p className="text-sm text-text-secondary">{user.role}</p>
  </div>
  <Badge variant={user.isPremium ? 'vip' : 'default'}>
    {user.isPremium ? 'Premium' : 'Free'}
  </Badge>
</div>
```

### Comment Thread

```tsx
<div className="space-y-4">
  {comments.map(comment => (
    <div key={comment.id} className="flex gap-3">
      <Avatar 
        name={comment.author.name}
        src={comment.author.avatar}
        size="sm"
      />
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium">{comment.author.name}</span>
          {comment.author.isAdmin && (
            <Badge size="sm" variant="accent">Admin</Badge>
          )}
          <span className="text-xs text-text-secondary">
            {comment.timestamp}
          </span>
        </div>
        <p className="mt-1 text-sm">{comment.content}</p>
      </div>
    </div>
  ))}
</div>
```

### Team Collaboration Widget

```tsx
<div className="rounded-lg border border-border-primary p-4">
  <div className="flex items-center justify-between mb-3">
    <h4 className="font-semibold">Project Team</h4>
    <Badge variant="active" dot>{activeMembers} active</Badge>
  </div>
  
  <AvatarGroup max={5}>
    {team.members.map(member => (
      <Avatar
        key={member.id}
        name={member.name}
        src={member.avatar}
        status={member.isActive ? 'online' : 'offline'}
      />
    ))}
  </AvatarGroup>
  
  <div className="mt-3 text-sm text-text-secondary">
    {team.members.length} team members
  </div>
</div>
```

### Order Status Display

```tsx
<div className="flex items-center justify-between p-4 border-b">
  <div className="flex items-center gap-3">
    <Avatar name={order.customer.name} size="sm" />
    <div>
      <p className="font-medium">{order.customer.name}</p>
      <p className="text-sm text-text-secondary">Order #{order.id}</p>
    </div>
  </div>
  
  <div className="flex items-center gap-2">
    <Badge 
      variant={order.priority === 'high' ? 'error' : 'default'}
      size="sm"
    >
      {order.priority}
    </Badge>
    <Badge 
      variant={getOrderStatusVariant(order.status)}
      dot
    >
      {order.status}
    </Badge>
  </div>
</div>
```

### Filter Tags

```tsx
<div className="flex flex-wrap gap-2">
  <span className="text-sm text-text-secondary">Filters:</span>
  {activeFilters.map(filter => (
    <Badge
      key={filter.id}
      variant="outline"
      onClick={() => removeFilter(filter.id)}
      className="cursor-pointer"
    >
      {filter.label}
      <X className="ml-1 h-3 w-3" />
    </Badge>
  ))}
  {activeFilters.length > 0 && (
    <button
      onClick={clearAllFilters}
      className="text-xs text-accent hover:underline"
    >
      Clear all
    </button>
  )}
</div>
```

### Customer Type Indicator

```tsx
<div className="flex items-center gap-2">
  <Avatar name={customer.name} src={customer.avatar} />
  <div className="flex-1">
    <p className="font-medium">{customer.name}</p>
    <div className="flex items-center gap-2 mt-1">
      <Badge 
        variant={customer.type === 'vip' ? 'vip' : 
                customer.type === 'wholesale' ? 'wholesale' : 'retail'}
        size="sm"
      >
        {customer.type}
      </Badge>
      {customer.isVerified && (
        <Badge variant="success" size="sm" icon={<Check className="h-3 w-3" />}>
          Verified
        </Badge>
      )}
    </div>
  </div>
</div>
```

---

## Testing

### Avatar Component Tests

```tsx
import { render, screen } from '@testing-library/react'
import { Avatar, AvatarGroup } from '@/components/ui/data-display/Avatar'

describe('Avatar', () => {
  test('renders with image', () => {
    render(<Avatar src="/test.jpg" alt="Test User" name="Test User" />)
    const img = screen.getByAlt('Test User')
    expect(img).toBeInTheDocument()
  })

  test('shows initials when no image', () => {
    render(<Avatar name="John Doe" />)
    expect(screen.getByText('JD')).toBeInTheDocument()
  })

  test('displays status indicator', () => {
    const { container } = render(
      <Avatar name="User" status="online" />
    )
    const statusDot = container.querySelector('.bg-status-success')
    expect(statusDot).toBeInTheDocument()
  })

  test('applies correct size classes', () => {
    const { container } = render(<Avatar name="User" size="lg" />)
    expect(container.querySelector('.h-12.w-12')).toBeInTheDocument()
  })
})

describe('AvatarGroup', () => {
  test('shows correct number of avatars', () => {
    render(
      <AvatarGroup max={2}>
        <Avatar name="User 1" />
        <Avatar name="User 2" />
        <Avatar name="User 3" />
      </AvatarGroup>
    )
    expect(screen.getByText('U1')).toBeInTheDocument()
    expect(screen.getByText('U2')).toBeInTheDocument()
    expect(screen.getByText('+1')).toBeInTheDocument()
  })
})
```

### Badge Component Tests

```tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { Badge } from '@/components/ui/data-display/Badge'

describe('Badge', () => {
  test('renders children', () => {
    render(<Badge>Test Badge</Badge>)
    expect(screen.getByText('Test Badge')).toBeInTheDocument()
  })

  test('applies variant classes', () => {
    const { container } = render(<Badge variant="success">Success</Badge>)
    expect(container.firstChild).toHaveClass('bg-status-success/10')
  })

  test('renders with icon', () => {
    const Icon = () => <span data-testid="icon">★</span>
    render(<Badge icon={<Icon />}>With Icon</Badge>)
    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })

  test('handles click events', () => {
    const handleClick = jest.fn()
    render(<Badge onClick={handleClick}>Clickable</Badge>)
    fireEvent.click(screen.getByText('Clickable'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  test('shows status dot', () => {
    const { container } = render(<Badge dot>With Dot</Badge>)
    expect(container.querySelector('.rounded-full')).toBeInTheDocument()
  })
})
```

---

## TypeScript Support

All components are fully typed. Import types as needed:

```typescript
import type { 
  AvatarProps, 
  AvatarGroupProps,
  BadgeProps 
} from '@/components/ui/data-display'

// Type-safe props
const avatarProps: AvatarProps = {
  name: 'John Doe',
  size: 'md',
  status: 'online',
}

const badgeProps: BadgeProps = {
  variant: 'success',
  size: 'md',
  dot: true,
}
```

---

## Troubleshooting

### Avatar Issues

**Image not loading**
- Verify the `src` URL is accessible
- Check CORS policy for external images
- Ensure `alt` prop is provided for accessibility

**Initials not showing**
- Verify `name` prop is provided and not empty
- Check that name contains valid characters

**Status indicator not visible**
- Ensure parent container has relative positioning
- Check z-index stacking context

### Badge Issues

**Variant colors not applying**
- Verify CSS custom properties are defined in your theme
- Check if Tailwind is processing the component files

**Icon sizing issues**
- Use consistent icon size: `h-3 w-3` for most badges
- Adjust icon size based on badge size prop

**Click handler not working**
- Ensure `onClick` prop is passed correctly
- Check if badge is being prevented from clicking by parent element

---

## Migration Guide

### From Legacy Avatar to New Component

**Before:**
```tsx
<div className="avatar">
  <img src={src} alt={name} />
  <span className="initials">{initials}</span>
</div>
```

**After:**
```tsx
<Avatar name={name} src={src} />
```

### From Legacy Badge to New Component

**Before:**
```tsx
<span className="badge badge-success">Success</span>
```

**After:**
```tsx
<Badge variant="success">Success</Badge>
```

---

## Support

For questions or issues with these components:
1. Check this guide first
2. Review component source code and type definitions
3. Check Storybook for interactive examples (if available)
4. Contact the UI team for component-specific questions
5. File a ticket for bugs or feature requests

---

## Version History

- **v1.0.0**: Initial release with Avatar, AvatarGroup, and Badge components
- Built with Radix UI primitives for Avatar
- Uses CVA (class-variance-authority) for Badge variants