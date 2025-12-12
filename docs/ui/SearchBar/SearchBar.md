# SearchBar Component Developer Guide

## Overview

The `SearchBar` component is a reusable search input with built-in debouncing, clear functionality, and internationalization support. It's designed to provide a consistent search experience across the application.

## Features

- **Debounced Input**: Reduces API calls by delaying the onChange callback
- **Clear Button**: Quick way to reset the search
- **Icon Support**: Search icon on the left, clear icon on the right
- **i18n Ready**: Supports translations via react-i18next
- **Accessible**: Proper ARIA attributes and keyboard support
- **Controlled Component**: Syncs with external state management

## Installation & Dependencies

```typescript
// Required dependencies
import { Search, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
```

## Basic Usage

```tsx
import { SearchBar } from '@/components/ui/form/SearchBar'
import { useState } from 'react'

function MyComponent() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <SearchBar
      value={searchQuery}
      onChange={setSearchQuery}
      placeholder="Search users..."
    />
  )
}
```

## Props API

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | *required* | Current search value (controlled) |
| `onChange` | `(value: string) => void` | *required* | Callback fired after debounce delay |
| `placeholder` | `string` | `t('common.search')` | Placeholder text |
| `debounceMs` | `number` | `300` | Debounce delay in milliseconds |
| `onClear` | `() => void` | `undefined` | Optional callback when clear button is clicked |
| `className` | `string` | `undefined` | Additional CSS classes for the container |
| `disabled` | `boolean` | `false` | Disables the input |
| `autoFocus` | `boolean` | `false` | Auto-focuses the input on mount |

## Advanced Examples

### Custom Debounce Timing

```tsx
// Faster debounce for real-time search
<SearchBar
  value={query}
  onChange={setQuery}
  debounceMs={150}
/>

// Slower debounce for expensive operations
<SearchBar
  value={query}
  onChange={setQuery}
  debounceMs={500}
/>
```

### With Clear Callback

```tsx
<SearchBar
  value={query}
  onChange={setQuery}
  onClear={() => {
    console.log('Search cleared')
    // Reset filters, refetch data, etc.
  }}
/>
```

### Integration with Data Fetching

```tsx
function UserSearch() {
  const [query, setQuery] = useState('')
  const { data, isLoading } = useQuery({
    queryKey: ['users', query],
    queryFn: () => fetchUsers(query),
    enabled: query.length > 0,
  })

  return (
    <div>
      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder="Search users by name..."
        disabled={isLoading}
      />
      {/* Render results */}
    </div>
  )
}
```

### Styling with Custom Classes

```tsx
<SearchBar
  value={query}
  onChange={setQuery}
  className="max-w-md mx-auto"
/>
```

## Internationalization

The component uses `react-i18next` for the default placeholder. Ensure you have the translation key set up:

```json
// locales/en.json
{
  "common": {
    "search": "Search..."
  }
}
```

Override with a custom placeholder:

```tsx
<SearchBar
  value={query}
  onChange={setQuery}
  placeholder={t('users.searchPlaceholder')}
/>
```

## How Debouncing Works

1. User types in the input
2. `localValue` updates immediately (no lag in UI)
3. A timeout is set for the debounce delay
4. If user types again, previous timeout is cleared
5. After user stops typing for `debounceMs`, `onChange` is called
6. Timeout is cleaned up on unmount

This pattern prevents excessive API calls while keeping the UI responsive.

## Common Patterns

### Server-Side Search

```tsx
function ServerSearch() {
  const [query, setQuery] = useState('')
  
  useEffect(() => {
    if (query) {
      fetchSearchResults(query)
    }
  }, [query]) // Only re-fetches after debounce

  return <SearchBar value={query} onChange={setQuery} />
}
```

### Client-Side Filtering

```tsx
function ClientFilter({ items }) {
  const [query, setQuery] = useState('')
  
  const filtered = useMemo(() => {
    return items.filter(item => 
      item.name.toLowerCase().includes(query.toLowerCase())
    )
  }, [items, query])

  return (
    <>
      <SearchBar value={query} onChange={setQuery} />
      <List items={filtered} />
    </>
  )
}
```

### URL Sync

```tsx
function SearchWithURL() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') || ''

  const handleSearch = (value: string) => {
    setSearchParams(value ? { q: value } : {})
  }

  return <SearchBar value={query} onChange={handleSearch} />
}
```

## Accessibility

- Input has proper focus states
- Clear button is keyboard accessible
- Search icon is decorative (doesn't interfere with screen readers)
- Proper ref forwarding for custom focus management

## Styling Notes

The component uses your theme's design tokens:
- `text-text-tertiary` for icon color
- Inherits styles from base `Input` component
- Uses `Button` component for consistent clear button styling

## Testing Tips

```tsx
import { render, screen, userEvent, waitFor } from '@testing-library/react'

test('debounces search input', async () => {
  const onChange = jest.fn()
  render(<SearchBar value="" onChange={onChange} debounceMs={300} />)
  
  const input = screen.getByRole('textbox')
  await userEvent.type(input, 'test')
  
  // onChange not called immediately
  expect(onChange).not.toHaveBeenCalled()
  
  // Wait for debounce
  await waitFor(() => expect(onChange).toHaveBeenCalledWith('test'), {
    timeout: 400
  })
})
```

## Troubleshooting

**Issue**: onChange not firing  
**Solution**: Check that debounceMs is set and wait for the delay

**Issue**: Value not updating  
**Solution**: Ensure you're passing a controlled value prop

**Issue**: Clear button not showing  
**Solution**: Verify the Button component is properly imported and styled

---

For questions or issues, contact the UI team or check the component source code at `src/components/ui/form/SearchBar/`.