# 📊 StatCard Component - Complete Developer Guide

## 📑 Table of Contents
1. [Overview](#overview)
2. [Installation](#installation)
3. [Basic Usage](#basic-usage)
4. [Props Reference](#props-reference)
5. [Examples by Module](#examples-by-module)
6. [Advanced Patterns](#advanced-patterns)
7. [Translation Keys](#translation-keys)
8. [TypeScript Types](#typescript-types)
9. [Best Practices](#best-practices)
10. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

The `StatCard` component is a flexible, reusable analytics card designed for displaying key metrics across all modules (Sales, Inventory, Customer, Orders, Analytics).

### ✨ Features
- ✅ **Fully Responsive** - Mobile, tablet, desktop optimized
- ✅ **Theme-aware** - Uses CSS variables for all colors
- ✅ **i18n Ready** - All text translatable
- ✅ **Loading States** - Built-in skeleton loader
- ✅ **Trend Indicators** - Up/down/neutral with percentages
- ✅ **Flexible Sizing** - Small, medium, large variants
- ✅ **Multiple Variants** - Default, success, warning, error, info
- ✅ **Clickable** - Optional onClick for navigation
- ✅ **Customizable** - Icons, badges, footers, custom content

---

## 📦 Installation

### File Structure
```
src/components/ui/data-display/StatCard/
├── StatCard.tsx          // Main component
├── StatCardGrid.tsx      // Grid wrapper
├── StatCardSkeleton.tsx  // Loading state
└── index.ts              // Exports
```

### Import
```typescript
import { 
  StatCard, 
  StatCardGrid, 
  StatCardSkeleton 
} from '@/components/ui/data-display/StatCard'
```

---

## 🚀 Basic Usage

### 1. Simple StatCard
```typescript
import { StatCard } from '@/components/ui/data-display/StatCard'
import { DollarSign } from 'lucide-react'

<StatCard
  title="Total Revenue"
  value="₹45,231"
  icon={DollarSign}
/>
```

### 2. With Trend
```typescript
<StatCard
  title="Total Sales"
  value="1,234"
  icon={ShoppingCart}
  trend={{
    value: 12.5,
    direction: 'up',
    label: 'from last month',
    showIcon: true
  }}
/>
```

### 3. With Grid Layout
```typescript
import { StatCardGrid } from '@/components/ui/data-display/StatCard'

<StatCardGrid columns={4} gap="md">
  <StatCard title="Revenue" value="₹45,231" icon={DollarSign} />
  <StatCard title="Orders" value="1,234" icon={ShoppingBag} />
  <StatCard title="Customers" value="567" icon={Users} />
  <StatCard title="Products" value="89" icon={Package} />
</StatCardGrid>
```

### 4. Loading State
```typescript
import { StatCardSkeleton } from '@/components/ui/data-display/StatCard'

{isLoading ? (
  <StatCardSkeleton showIcon showTrend />
) : (
  <StatCard title="Revenue" value="₹45,231" />
)}
```

---

## 📋 Props Reference

### StatCard Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | **Required** | Card title (use i18n key) |
| `value` | `string \| number` | **Required** | Main metric value |
| `subtitle` | `string` | - | Optional subtitle below title |
| `description` | `string` | - | Helper text below value |
| `icon` | `LucideIcon` | - | Icon component from lucide-react |
| `variant` | `'default' \| 'success' \| 'warning' \| 'error' \| 'info'` | `'default'` | Visual variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Card size |
| `trend` | `TrendObject` | - | Trend indicator configuration |
| `onClick` | `() => void` | - | Click handler (makes card clickable) |
| `loading` | `boolean` | `false` | Show loading state |
| `footer` | `ReactNode` | - | Custom footer content |
| `badge` | `ReactNode` | - | Badge in top-right corner |
| `className` | `string` | - | Additional CSS classes |

### Trend Object
```typescript
{
  value: number        // Percentage change (e.g., 12.5 for +12.5%)
  direction?: 'up' | 'down' | 'neutral'  // Arrow direction
  label?: string       // Additional label (e.g., "from last month")
  showIcon?: boolean   // Show arrow icon
}
```

### StatCardGrid Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | **Required** | StatCard components |
| `columns` | `1 \| 2 \| 3 \| 4` | `4` | Number of columns (responsive) |
| `gap` | `'sm' \| 'md' \| 'lg'` | `'md'` | Gap between cards |
| `className` | `string` | - | Additional CSS classes |

### StatCardSkeleton Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Skeleton size |
| `showIcon` | `boolean` | `true` | Show icon skeleton |
| `showTrend` | `boolean` | `true` | Show trend skeleton |
| `showFooter` | `boolean` | `false` | Show footer skeleton |
| `className` | `string` | - | Additional CSS classes |

---

## 💼 Examples by Module

### 🛒 Sales Module
```typescript
import { StatCard, StatCardGrid } from '@/components/ui/data-display/StatCard'
import { DollarSign, ShoppingCart, TrendingUp, CreditCard } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const SalesAnalytics = () => {
  const { t } = useTranslation()
  
  return (
    <StatCardGrid columns={4} gap="md">
      <StatCard
        title={t('sales.analytics.totalRevenue')}
        value="₹2,45,231"
        icon={DollarSign}
        variant="success"
        trend={{
          value: 12.5,
          direction: 'up',
          label: t('common.fromLastMonth'),
          showIcon: true
        }}
      />
      
      <StatCard
        title={t('sales.analytics.totalOrders')}
        value="1,234"
        icon={ShoppingCart}
        trend={{
          value: 8.2,
          direction: 'up',
          showIcon: true
        }}
      />
      
      <StatCard
        title={t('sales.analytics.avgOrderValue')}
        value="₹1,985"
        icon={TrendingUp}
        trend={{
          value: -3.1,
          direction: 'down',
          showIcon: true
        }}
      />
      
      <StatCard
        title={t('sales.analytics.successRate')}
        value="94.5%"
        icon={CreditCard}
        variant="info"
        description={t('sales.analytics.ofOrdersCompleted')}
      />
    </StatCardGrid>
  )
}
```

### 👥 Customer Module
```typescript
import { Users, UserPlus, UserCheck, Star } from 'lucide-react'

const CustomerAnalytics = () => {
  const { t } = useTranslation()
  
  return (
    <StatCardGrid columns={4}>
      <StatCard
        title={t('customer.analytics.totalCustomers')}
        value="2,345"
        icon={Users}
        onClick={() => navigate('/customers')}
        trend={{
          value: 15.3,
          direction: 'up',
          label: t('common.thisMonth')
        }}
      />
      
      <StatCard
        title={t('customer.analytics.newCustomers')}
        value="234"
        icon={UserPlus}
        variant="success"
        subtitle={t('common.thisMonth')}
      />
      
      <StatCard
        title={t('customer.analytics.activeCustomers')}
        value="1,892"
        icon={UserCheck}
        description={t('customer.analytics.last30Days')}
      />
      
      <StatCard
        title={t('customer.analytics.avgLoyalty')}
        value="4.8"
        icon={Star}
        variant="info"
        description={t('customer.analytics.outOf5Stars')}
      />
    </StatCardGrid>
  )
}
```

### 📦 Inventory Module
```typescript
import { Package, AlertTriangle, TrendingDown, DollarSign } from 'lucide-react'
import { Badge } from '@/components/ui/data-display/Badge'

const InventoryAnalytics = () => {
  const { t } = useTranslation()
  
  return (
    <StatCardGrid columns={4}>
      <StatCard
        title={t('inventory.analytics.totalProducts')}
        value="1,456"
        icon={Package}
        badge={
          <Badge variant="success">
            {t('common.active')}
          </Badge>
        }
      />
      
      <StatCard
        title={t('inventory.analytics.lowStock')}
        value="23"
        icon={AlertTriangle}
        variant="warning"
        onClick={() => navigate('/inventory?filter=low-stock')}
        description={t('inventory.analytics.needsReorder')}
      />
      
      <StatCard
        title={t('inventory.analytics.outOfStock')}
        value="5"
        icon={TrendingDown}
        variant="error"
        onClick={() => navigate('/inventory?filter=out-of-stock')}
      />
      
      <StatCard
        title={t('inventory.analytics.totalValue')}
        value="₹12,45,890"
        icon={DollarSign}
        description={t('inventory.analytics.currentInventory')}
      />
    </StatCardGrid>
  )
}
```

### 📊 Orders Module
```typescript
import { ShoppingBag, Clock, CheckCircle, XCircle } from 'lucide-react'

const OrdersAnalytics = () => {
  const { t } = useTranslation()
  
  return (
    <StatCardGrid columns={4}>
      <StatCard
        title={t('orders.analytics.totalOrders')}
        value="3,456"
        icon={ShoppingBag}
        trend={{
          value: 18.2,
          direction: 'up',
          showIcon: true
        }}
      />
      
      <StatCard
        title={t('orders.analytics.pending')}
        value="89"
        icon={Clock}
        variant="warning"
        onClick={() => navigate('/orders?status=pending')}
      />
      
      <StatCard
        title={t('orders.analytics.completed')}
        value="3,234"
        icon={CheckCircle}
        variant="success"
      />
      
      <StatCard
        title={t('orders.analytics.cancelled')}
        value="133"
        icon={XCircle}
        variant="error"
        trend={{
          value: -5.2,
          direction: 'down',
          label: t('common.improvement')
        }}
      />
    </StatCardGrid>
  )
}
```

---

## 🎨 Advanced Patterns

### 1. Clickable Cards with Navigation
```typescript
import { useNavigate } from 'react-router-dom'

const AnalyticsDashboard = () => {
  const navigate = useNavigate()
  
  return (
    <StatCard
      title="Pending Orders"
      value="89"
      icon={Clock}
      onClick={() => navigate('/orders?status=pending')}
      // Hover effect automatically applied
    />
  )
}
```

### 2. Custom Footer Content
```typescript
<StatCard
  title="Revenue"
  value="₹45,231"
  icon={DollarSign}
  footer={
    <div className="flex items-center justify-between text-sm">
      <span className="text-text-tertiary">Target: ₹50,000</span>
      <span className="text-status-success font-medium">90.5%</span>
    </div>
  }
/>
```

### 3. Custom Badge
```typescript
import { Badge } from '@/components/ui/data-display/Badge'

<StatCard
  title="Products"
  value="1,234"
  icon={Package}
  badge={
    <Badge variant="success" size="sm">
      +12 today
    </Badge>
  }
/>
```

### 4. Different Sizes
```typescript
<StatCardGrid columns={3}>
  {/* Small */}
  <StatCard
    size="sm"
    title="Quick Metric"
    value="123"
    icon={TrendingUp}
  />
  
  {/* Medium (default) */}
  <StatCard
    size="md"
    title="Standard Metric"
    value="456"
    icon={DollarSign}
  />
  
  {/* Large */}
  <StatCard
    size="lg"
    title="Important Metric"
    value="789"
    icon={Users}
  />
</StatCardGrid>
```

### 5. Loading Pattern
```typescript
import { useQuery } from '@tanstack/react-query'

const SalesStats = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['sales-stats'],
    queryFn: fetchSalesStats
  })
  
  if (isLoading) {
    return (
      <StatCardGrid columns={4}>
        {[...Array(4)].map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </StatCardGrid>
    )
  }
  
  return (
    <StatCardGrid columns={4}>
      <StatCard
        title="Revenue"
        value={data.revenue}
        icon={DollarSign}
      />
      {/* ... more cards */}
    </StatCardGrid>
  )
}
```

### 6. Conditional Variants
```typescript
const getVariant = (value: number): StatCardVariant => {
  if (value >= 90) return 'success'
  if (value >= 70) return 'info'
  if (value >= 50) return 'warning'
  return 'error'
}

<StatCard
  title="Performance"
  value={`${performance}%`}
  icon={TrendingUp}
  variant={getVariant(performance)}
/>
```

---

## 🌍 Translation Keys

### Create Translation Structure
```json
// locales/en.json
{
  "common": {
    "fromLastMonth": "from last month",
    "thisMonth": "this month",
    "last30Days": "last 30 days",
    "improvement": "improvement",
    "active": "Active"
  },
  
  "sales": {
    "analytics": {
      "totalRevenue": "Total Revenue",
      "totalOrders": "Total Orders",
      "avgOrderValue": "Avg Order Value",
      "successRate": "Success Rate",
      "ofOrdersCompleted": "of orders completed"
    }
  },
  
  "customer": {
    "analytics": {
      "totalCustomers": "Total Customers",
      "newCustomers": "New Customers",
      "activeCustomers": "Active Customers",
      "avgLoyalty": "Avg Loyalty Score",
      "outOf5Stars": "out of 5 stars"
    }
  },
  
  "inventory": {
    "analytics": {
      "totalProducts": "Total Products",
      "lowStock": "Low Stock Items",
      "outOfStock": "Out of Stock",
      "totalValue": "Total Inventory Value",
      "needsReorder": "needs reorder",
      "currentInventory": "current inventory"
    }
  },
  
  "orders": {
    "analytics": {
      "totalOrders": "Total Orders",
      "pending": "Pending Orders",
      "completed": "Completed Orders",
      "cancelled": "Cancelled Orders"
    }
  }
}
```

### Usage in Component
```typescript
import { useTranslation } from 'react-i18next'

const MyComponent = () => {
  const { t } = useTranslation()
  
  return (
    <StatCard
      title={t('sales.analytics.totalRevenue')}
      value="₹45,231"
      trend={{
        label: t('common.fromLastMonth')
      }}
    />
  )
}
```

---

## 📘 TypeScript Types

### Import Types
```typescript
import type { 
  StatCardProps,
  StatCardVariant,
  StatCardSize,
  TrendDirection 
} from '@/components/ui/data-display/StatCard'
```

### Example with Types
```typescript
interface AnalyticsData {
  revenue: number
  trend: number
  direction: TrendDirection
}

const formatCurrency = (value: number): string => {
  return `₹${value.toLocaleString('en-IN')}`
}

const RevenueCard: React.FC<{ data: AnalyticsData }> = ({ data }) => {
  return (
    <StatCard
      title="Revenue"
      value={formatCurrency(data.revenue)}
      icon={DollarSign}
      trend={{
        value: data.trend,
        direction: data.direction,
        showIcon: true
      }}
    />
  )
}
```

---

## ✅ Best Practices

### 1. Always Use i18n
```typescript
// ❌ WRONG
<StatCard title="Total Sales" />

// ✅ CORRECT
<StatCard title={t('sales.analytics.totalSales')} />
```

### 2. Format Numbers Properly
```typescript
// ❌ WRONG
<StatCard value={123456} />

// ✅ CORRECT
<StatCard value={formatCurrency(123456)} />  // "₹1,23,456"
<StatCard value={formatNumber(123456)} />     // "123,456"
```

### 3. Use Appropriate Icons
```typescript
// Import from lucide-react only
import { 
  DollarSign,   // Revenue, money
  ShoppingCart, // Orders, sales
  Users,        // Customers
  Package,      // Inventory, products
  TrendingUp,   // Growth, performance
  Clock,        // Pending, time-based
  CheckCircle,  // Success, completed
  AlertTriangle // Warning, issues
} from 'lucide-react'
```

### 4. Grid Responsiveness
```typescript
// ❌ WRONG - Fixed columns
<div className="grid grid-cols-4">
  {cards}
</div>

// ✅ CORRECT - Responsive grid
<StatCardGrid columns={4}>  // Auto: 1 col mobile, 2 tablet, 4 desktop
  {cards}
</StatCardGrid>
```

### 5. Loading States
```typescript
// ❌ WRONG - No loading state
<StatCard title="Revenue" value={data?.revenue} />

// ✅ CORRECT - Proper loading
{isLoading ? (
  <StatCardSkeleton />
) : (
  <StatCard title="Revenue" value={data.revenue} />
)}
```

### 6. Click Handlers
```typescript
// ❌ WRONG - Inline navigation
<StatCard 
  onClick={() => window.location.href = '/orders'}
/>

// ✅ CORRECT - React Router
const navigate = useNavigate()
<StatCard 
  onClick={() => navigate('/orders')}
/>
```

---

## 🎯 Complete Real-World Example

```typescript
// features/sales/pages/SalesDashboard/SalesDashboard.tsx

import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { 
  StatCard, 
  StatCardGrid, 
  StatCardSkeleton 
} from '@/components/ui/data-display/StatCard'
import { 
  DollarSign, 
  ShoppingCart, 
  TrendingUp, 
  CreditCard 
} from 'lucide-react'
import { Badge } from '@/components/ui/data-display/Badge'
import { fetchSalesAnalytics } from '@/services/sales'

export const SalesDashboard: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['sales-analytics'],
    queryFn: fetchSalesAnalytics,
    refetchInterval: 30000 // Refresh every 30s
  })
  
  if (error) {
    return <div>Error loading analytics</div>
  }
  
  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-text-primary">
          {t('sales.dashboard.title')}
        </h1>
        
        <StatCardGrid columns={4}>
          {[...Array(4)].map((_, i) => (
            <StatCardSkeleton key={i} showIcon showTrend />
          ))}
        </StatCardGrid>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-primary">
          {t('sales.dashboard.title')}
        </h1>
        
        <Badge variant="success">
          {t('common.liveData')}
        </Badge>
      </div>
      
      <StatCardGrid columns={4} gap="lg">
        <StatCard
          title={t('sales.analytics.totalRevenue')}
          value={`₹${data.revenue.toLocaleString('en-IN')}`}
          icon={DollarSign}
          variant="success"
          size="lg"
          trend={{
            value: data.revenueTrend,
            direction: data.revenueTrend > 0 ? 'up' : 'down',
            label: t('common.fromLastMonth'),
            showIcon: true
          }}
          footer={
            <div className="flex justify-between text-sm">
              <span className="text-text-tertiary">
                {t('sales.analytics.target')}: ₹{data.revenueTarget.toLocaleString('en-IN')}
              </span>
              <span className="text-status-success font-medium">
                {Math.round((data.revenue / data.revenueTarget) * 100)}%
              </span>
            </div>
          }
        />
        
        <StatCard
          title={t('sales.analytics.totalOrders')}
          value={data.totalOrders.toLocaleString()}
          icon={ShoppingCart}
          size="lg"
          onClick={() => navigate('/sales/orders')}
          trend={{
            value: data.ordersTrend,
            direction: data.ordersTrend > 0 ? 'up' : 'down',
            showIcon: true
          }}
          description={t('sales.analytics.clickToView')}
        />
        
        <StatCard
          title={t('sales.analytics.avgOrderValue')}
          value={`₹${data.avgOrderValue.toLocaleString('en-IN')}`}
          icon={TrendingUp}
          size="lg"
          trend={{
            value: data.avgOrderTrend,
            direction: data.avgOrderTrend > 0 ? 'up' : 'down',
            showIcon: true
          }}
        />
        
        <StatCard
          title={t('sales.analytics.successRate')}
          value={`${data.successRate}%`}
          icon={CreditCard}
          variant="info"
          size="lg"
          description={t('sales.analytics.ofOrdersCompleted')}
          badge={
            data.successRate >= 95 ? (
              <Badge variant="success">{t('common.excellent')}</Badge>
            ) : null
          }
        />
      </StatCardGrid>
    </div>
  )
}
```

---

## 🐛 Troubleshooting

### Issue: Colors not showing correctly
**Solution:** Make sure CSS variables are defined in your theme
```css
/* globals.css */
:root {
  --bg-secondary: ...;
  --text-primary: ...;
  --accent: ...;
  /* etc. */
}
```

### Issue: Icons not displaying
**Solution:** Import from lucide-react
```typescript
// ❌ WRONG
import * as Icons from 'lucide-react'

// ✅ CORRECT
import { DollarSign, ShoppingCart } from 'lucide-react'
```

### Issue: Grid not responsive
**Solution:** Use StatCardGrid component
```typescript
// ❌ WRONG
<div className="grid grid-cols-4">

// ✅ CORRECT
<StatCardGrid columns={4}>
```

### Issue: Click not working
**Solution:** Ensure onClick is passed correctly
```typescript
<StatCard
  onClick={() => navigate('/path')}  // ✅
  // onClick={navigate('/path')}     // ❌ Wrong
/>
```

### Issue: Loading state flickering
**Solution:** Add minimum loading time
```typescript
const { data, isLoading } = useQuery({
  queryKey: ['stats'],
  queryFn: fetchStats,
  placeholderData: keepPreviousData, // Prevents flicker
})
```

---

## 📚 Additional Resources

### Related Components
- `Badge` - For status indicators
- `DataTable` - For detailed data views
- `Charts` - For visualizations
- `FilterBar` - For filtering data

### Useful Hooks
- `useQuery` - Data fetching
- `useTranslation` - Translations
- `useNavigate` - Navigation
- `useAppSelector` - Redux state

---

## ✨ Quick Reference

```typescript
// BASIC
<StatCard title="Title" value="1,234" icon={Icon} />

// WITH TREND
<StatCard 
  title="Title" 
  value="1,234"
  trend={{ value: 12.5, direction: 'up', showIcon: true }}
/>

// CLICKABLE
<StatCard 
  title="Title" 
  value="1,234"
  onClick={() => navigate('/path')}
/>

// WITH VARIANT
<StatCard 
  title="Title" 
  value="1,234"
  variant="success"  // or 'warning', 'error', 'info'
/>

// GRID LAYOUT
<StatCardGrid columns={4} gap="md">
  {cards}
</StatCardGrid>

// LOADING
{isLoading ? <StatCardSkeleton /> : <StatCard {...props} />}
```

---

## 🎉 You're Ready!

The StatCard component is now ready to use across all modules. Remember:
1. ✅ Always use i18n for text
2. ✅ Use CSS variables for colors
3. ✅ Format numbers properly
4. ✅ Handle loading states
5. ✅ Make cards responsive

Happy coding! 🚀