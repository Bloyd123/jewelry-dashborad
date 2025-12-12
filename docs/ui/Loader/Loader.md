# Loader Components Developer Guide

## Overview

Our loader component system provides flexible, accessible loading indicators for various use cases. The system consists of three main components: `Loader`, `Skeleton`, and `Spinner`.

## Components

### 1. Loader Component

The primary loading component with multiple variants and configurations.

#### Import

```typescript
import { Loader } from '@/components/ui/loader'
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Size of the loader |
| `variant` | `'spinner' \| 'dots' \| 'pulse' \| 'bars'` | `'spinner'` | Visual style of the loader |
| `text` | `string` | `undefined` | Optional loading text below loader |
| `fullScreen` | `boolean` | `false` | Display as full-screen overlay |
| `overlay` | `boolean` | `false` | Display as absolute positioned overlay |
| `color` | `'primary' \| 'accent' \| 'success' \| 'warning' \| 'error'` | `'accent'` | Color scheme |

#### Usage Examples

**Basic Spinner**
```tsx
<Loader />
```

**With Loading Text**
```tsx
<Loader text="Loading your data..." />
```

**Different Variants**
```tsx
<Loader variant="dots" size="lg" />
<Loader variant="pulse" color="success" />
<Loader variant="bars" size="sm" />
```

**Full Screen Loading**
```tsx
<Loader fullScreen text="Please wait..." />
```

**Overlay Loading**
```tsx
<div className="relative">
  {/* Your content */}
  {isLoading && <Loader overlay text="Saving..." />}
</div>
```

#### When to Use

- **Spinner**: Default choice for most loading states
- **Dots**: Subtle loading for inline elements or cards
- **Pulse**: Emphasize active loading or syncing states
- **Bars**: Audio/video loading or data processing indicators

---

### 2. Skeleton Component

Placeholder component for content that's loading, maintaining layout structure.

#### Import

```typescript
import { Skeleton } from '@/components/ui/loader'
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'text' \| 'circular' \| 'rectangular' \| 'rounded'` | `'text'` | Shape of skeleton |
| `width` | `string \| number` | `'100%'` | Width (CSS value or pixels) |
| `height` | `string \| number` | `'1rem'` (text) or `'100%'` | Height (CSS value or pixels) |
| `className` | `string` | `''` | Additional CSS classes |
| `count` | `number` | `1` | Number of skeleton items to render |
| `animate` | `boolean` | `true` | Enable pulse animation |

#### Usage Examples

**Text Loading**
```tsx
<Skeleton variant="text" count={3} />
```

**Avatar Placeholder**
```tsx
<Skeleton variant="circular" width={48} height={48} />
```

**Image Placeholder**
```tsx
<Skeleton variant="rounded" width="100%" height={200} />
```

**Card Layout**
```tsx
<div className="space-y-4">
  <div className="flex gap-4">
    <Skeleton variant="circular" width={40} height={40} />
    <div className="flex-1 space-y-2">
      <Skeleton variant="text" width="60%" />
      <Skeleton variant="text" width="40%" />
    </div>
  </div>
  <Skeleton variant="rounded" height={200} />
</div>
```

**Multiple Items**
```tsx
<Skeleton variant="text" count={5} />
```

#### When to Use

Use skeletons when you know the structure of the content being loaded. They provide better perceived performance than spinners by maintaining layout stability.

---

### 3. Spinner Component

Lightweight inline spinner for buttons and compact spaces.

#### Import

```typescript
import { Spinner } from '@/components/ui/loader'
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Size of spinner |
| `className` | `string` | `''` | Additional CSS classes |

#### Usage Examples

**Button Loading State**
```tsx
<button disabled={isLoading}>
  {isLoading ? <Spinner size="sm" /> : 'Submit'}
</button>
```

**Inline with Text**
```tsx
<div className="flex items-center gap-2">
  <Spinner size="xs" />
  <span>Processing...</span>
</div>
```

**Custom Styled**
```tsx
<Spinner size="md" className="text-blue-500" />
```

#### When to Use

Use spinners for:
- Button loading states
- Inline loading indicators
- Compact spaces where full loaders are too large
- When you need minimal visual footprint

---

## Best Practices

### 1. Choose the Right Component

- **Page/Section Loading**: Use `<Loader fullScreen />` or `<Loader overlay />`
- **Content Loading (known structure)**: Use `<Skeleton />`
- **Button/Inline Loading**: Use `<Spinner />`
- **Indeterminate Progress**: Use `<Loader variant="dots" />` or `<Loader variant="pulse" />`

### 2. Accessibility

All loader components include proper ARIA attributes. Enhance accessibility by:

```tsx
// Add descriptive text for screen readers
<Loader text="Loading user profile" />

// For spinners, the role="status" is included automatically
<Spinner size="sm" />
```

### 3. Performance Considerations

- Use `<Skeleton />` for perceived performance improvement
- Avoid multiple simultaneous full-screen loaders
- Consider disabling animations on low-end devices:

```tsx
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

<Skeleton animate={!prefersReducedMotion} />
```

### 4. Color Usage

Match loader colors to context:
- `accent`: Default, neutral loading
- `primary`: Primary actions
- `success`: Successful operations in progress
- `warning`: Caution or slow operations
- `error`: Retry operations or error recovery

### 5. Sizing Guidelines

- **xs**: Icons, small buttons (16px)
- **sm**: Regular buttons, compact cards (24px)
- **md**: Default, most use cases (32px)
- **lg**: Prominent sections, hero areas (48px)
- **xl**: Full-screen, splash screens (64px)

---

## Common Patterns

### Suspense Boundary Loading

```tsx
<Suspense fallback={<Loader fullScreen text="Loading application..." />}>
  <YourComponent />
</Suspense>
```

### Conditional Rendering

```tsx
{isLoading ? (
  <Loader variant="dots" text="Fetching data..." />
) : (
  <DataDisplay data={data} />
)}
```

### Form Submission

```tsx
<form onSubmit={handleSubmit}>
  {/* form fields */}
  <button type="submit" disabled={isSubmitting}>
    {isSubmitting ? (
      <>
        <Spinner size="sm" />
        <span className="ml-2">Submitting...</span>
      </>
    ) : (
      'Submit'
    )}
  </button>
</form>
```

### List Loading State

```tsx
{isLoading ? (
  <div className="space-y-4">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex gap-4">
        <Skeleton variant="circular" width={40} height={40} />
        <div className="flex-1">
          <Skeleton variant="text" width="70%" />
          <Skeleton variant="text" width="50%" />
        </div>
      </div>
    ))}
  </div>
) : (
  <ItemList items={items} />
)}
```

### Image Loading

```tsx
const [imageLoaded, setImageLoaded] = useState(false)

<div className="relative">
  {!imageLoaded && (
    <Skeleton variant="rounded" width={400} height={300} />
  )}
  <img
    src={src}
    alt={alt}
    onLoad={() => setImageLoaded(true)}
    className={imageLoaded ? 'block' : 'hidden'}
  />
</div>
```

---

## Migration Guide

### From Old Spinner to New System

**Before:**
```tsx
<div className="spinner-container">
  <div className="spinner" />
</div>
```

**After:**
```tsx
<Loader />
```

### From Custom Skeleton to New Component

**Before:**
```tsx
<div className="skeleton-line" style={{ width: '100%', height: '20px' }} />
```

**After:**
```tsx
<Skeleton variant="text" height={20} />
```

---

## TypeScript Support

All components are fully typed. Import types as needed:

```typescript
import type { 
  LoaderProps, 
  LoaderSize, 
  LoaderVariant,
  SkeletonProps,
  SpinnerProps 
} from '@/components/ui/loader'
```

---

## Testing

### Unit Testing Examples

```tsx
import { render, screen } from '@testing-library/react'
import { Loader, Skeleton, Spinner } from '@/components/ui/loader'

test('renders loader with text', () => {
  render(<Loader text="Loading..." />)
  expect(screen.getByText('Loading...')).toBeInTheDocument()
})

test('renders skeleton with correct count', () => {
  const { container } = render(<Skeleton count={3} />)
  expect(container.querySelectorAll('.animate-pulse')).toHaveLength(3)
})

test('spinner has loading status', () => {
  render(<Spinner />)
  expect(screen.getByRole('status')).toBeInTheDocument()
})
```

---

## Troubleshooting

### Loader not animating
- Ensure Tailwind's animation utilities are configured
- Check if `prefers-reduced-motion` is affecting animations

### Skeleton not matching layout
- Use exact widths/heights from your actual content
- Use the same container structure as your loaded content

### Spinner too large/small in buttons
- Use `size="sm"` or `size="xs"` for button contexts
- Adjust with `className` if needed

---

## Support

For questions or issues with these components:
1. Check this guide first
2. Review the type definitions in `@/types/loader.types`
3. Contact the UI team for component-specific questions
4. File a ticket for bugs or feature requests