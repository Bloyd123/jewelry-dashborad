# 📊 Chart Components - Usage Guide

## 🎯 Quick Start

All chart components are located in `src/components/ui/charts/` and are **theme-aware**, **responsive**, and **reusable across all modules**.

---

## 📦 Installation

```bash
npm install recharts
```

---

## 🎨 Available Charts

| Chart | Use Case | Best For |
|-------|----------|----------|
| **LineChart** | Trends over time | Sales revenue, growth trends |
| **BarChart** | Comparisons | Monthly sales, category performance |
| **PieChart** | Distribution | Customer types, product categories |
| **DonutChart** | Category breakdown | Market share, inventory distribution |
| **AreaChart** | Volume over time | Stock levels, inventory tracking |

---

## 🔧 Common Props (All Charts)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `any[]` | **Required** | Array of data objects |
| `height` | `number` | `300` | Chart height in pixels |
| `loading` | `boolean` | `false` | Show loading spinner |
| `showGrid` | `boolean` | `true` | Show background grid |
| `showLegend` | `boolean` | `true` | Show legend |
| `showTooltip` | `boolean` | `true` | Show hover tooltip |
| `className` | `string` | - | Additional CSS classes |

---

## 📈 1. LineChart

### Basic Usage
```tsx
import { LineChart } from '@/components/ui/charts'

const data = [
  { month: 'Jan', revenue: 4000, profit: 2400 },
  { month: 'Feb', revenue: 3000, profit: 1398 },
  { month: 'Mar', revenue: 2000, profit: 9800 },
]

<LineChart
  data={data}
  lines={[
    { dataKey: 'revenue', name: 'Revenue' },
    { dataKey: 'profit', name: 'Profit' }
  ]}
  xAxisKey="month"
/>
```

### With Custom Colors & Formatting
```tsx
<LineChart
  data={salesData}
  lines={[
    { 
      dataKey: 'revenue', 
      name: 'Revenue', 
      color: 'hsl(var(--accent))',
      strokeWidth: 3 
    }
  ]}
  xAxisKey="month"
  height={400}
  formatYAxis={(value) => `₹${value.toLocaleString()}`}
  formatTooltip={(value) => `₹${value}`}
/>
```

### LineChart-Specific Props
| Prop | Type | Description |
|------|------|-------------|
| `lines` | `Array<{dataKey, name?, color?, strokeWidth?}>` | Line configurations |
| `xAxisKey` | `string` | Key for X-axis values |
| `formatYAxis` | `(value) => string` | Y-axis label formatter |
| `formatXAxis` | `(value) => string` | X-axis label formatter |

---

## 📊 2. BarChart

### Basic Usage
```tsx
import { BarChart } from '@/components/ui/charts'

const data = [
  { category: 'Gold', sales: 4000 },
  { category: 'Silver', sales: 3000 },
  { category: 'Diamond', sales: 5000 },
]

<BarChart
  data={data}
  bars={[{ dataKey: 'sales', name: 'Sales' }]}
  xAxisKey="category"
/>
```

### Multiple Bars
```tsx
<BarChart
  data={comparisonData}
  bars={[
    { dataKey: 'thisYear', name: '2024', color: 'hsl(var(--accent))' },
    { dataKey: 'lastYear', name: '2023', color: 'hsl(var(--status-info))' }
  ]}
  xAxisKey="month"
  formatYAxis={(value) => `₹${value / 1000}K`}
/>
```

### Horizontal Bar Chart
```tsx
<BarChart
  data={data}
  bars={[{ dataKey: 'value' }]}
  xAxisKey="name"
  layout="horizontal"  // or "vertical"
/>
```

---

## 🥧 3. PieChart

### Basic Usage
```tsx
import { PieChart } from '@/components/ui/charts'

const data = [
  { type: 'Retail', count: 150 },
  { type: 'Wholesale', count: 80 },
  { type: 'VIP', count: 45 },
]

<PieChart
  data={data}
  dataKey="count"
  nameKey="type"
/>
```

### With Custom Colors
```tsx
<PieChart
  data={customerData}
  dataKey="value"
  nameKey="name"
  colors={[
    'hsl(var(--accent))',
    'hsl(var(--status-success))',
    'hsl(var(--status-warning))',
  ]}
  showLabel={true}
  height={350}
/>
```

### PieChart-Specific Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `dataKey` | `string` | **Required** | Key for values |
| `nameKey` | `string` | **Required** | Key for labels |
| `colors` | `string[]` | Default palette | Custom color array |
| `showLabel` | `boolean` | `false` | Show percentage labels |
| `innerRadius` | `number` | `0` | Inner radius (for donut) |
| `outerRadius` | `number` | `80` | Outer radius |

---

## 🍩 4. DonutChart

### Basic Usage
```tsx
import { DonutChart } from '@/components/ui/charts'

<DonutChart
  data={categoryData}
  dataKey="value"
  nameKey="category"
  innerRadius={60}  // Makes it a donut
/>
```

> **Note:** DonutChart is a PieChart with `innerRadius` prop set by default.

---

## 📉 5. AreaChart

### Basic Usage
```tsx
import { AreaChart } from '@/components/ui/charts'

const data = [
  { date: '1 Jan', stock: 240 },
  { date: '2 Jan', stock: 210 },
  { date: '3 Jan', stock: 180 },
]

<AreaChart
  data={data}
  areas={[
    { dataKey: 'stock', name: 'Stock Level' }
  ]}
  xAxisKey="date"
/>
```

### Stacked Areas
```tsx
<AreaChart
  data={inventoryData}
  areas={[
    { dataKey: 'gold', name: 'Gold', color: 'hsl(var(--status-warning))' },
    { dataKey: 'silver', name: 'Silver', color: 'hsl(var(--status-info))' },
  ]}
  xAxisKey="month"
  stacked={true}  // Stack areas on top of each other
/>
```

### AreaChart-Specific Props
| Prop | Type | Description |
|------|------|-------------|
| `areas` | `Array<{dataKey, name?, color?, fillOpacity?}>` | Area configurations |
| `stacked` | `boolean` | Stack areas or overlay |
| `fillOpacity` | `number` | Area transparency (0-1) |

---

## 🎨 Theme Colors

All charts automatically use your theme colors. Available CSS variables:

```tsx
// Use these in color props
'hsl(var(--accent))'           // Primary accent
'hsl(var(--status-success))'   // Green
'hsl(var(--status-warning))'   // Yellow/Orange
'hsl(var(--status-error))'     // Red
'hsl(var(--status-info))'      // Blue
```

---

## 📱 Responsive Design

All charts are **automatically responsive**:

```tsx
// Desktop: 400px height
// Mobile: Adjusts width automatically

<LineChart
  data={data}
  lines={[{ dataKey: 'value' }]}
  xAxisKey="date"
  height={400}  // Fixed height, width auto-adjusts
  className="w-full"  // Full width container
/>
```

---

##  Loading State

```tsx
const { data, isLoading } = useGetSalesDataQuery()

<LineChart
  data={data || []}
  lines={[{ dataKey: 'sales' }]}
  xAxisKey="month"
  loading={isLoading}  // Shows spinner automatically
/>
```

---

## 📊 Real-World Examples

### 1. Sales Dashboard
```tsx
// Monthly Revenue Chart
<LineChart
  data={monthlyRevenue}
  lines={[
    { dataKey: 'revenue', name: 'Revenue', color: 'hsl(var(--accent))' },
    { dataKey: 'target', name: 'Target', color: 'hsl(var(--status-success))' }
  ]}
  xAxisKey="month"
  height={350}
  formatYAxis={(v) => `₹${(v / 1000).toFixed(0)}K`}
  formatTooltip={(v) => `₹${v.toLocaleString()}`}
/>
```

### 2. Customer Analytics
```tsx
// Customer Type Distribution
<PieChart
  data={[
    { type: 'Retail', count: 450 },
    { type: 'Wholesale', count: 180 },
    { type: 'VIP', count: 95 },
  ]}
  dataKey="count"
  nameKey="type"
  showLegend
  height={300}
/>
```

### 3. Inventory Tracking
```tsx
// Stock Levels Over Time
<AreaChart
  data={stockData}
  areas={[
    { dataKey: 'gold', name: 'Gold Stock', color: '#FFD700', fillOpacity: 0.5 },
    { dataKey: 'silver', name: 'Silver Stock', color: '#C0C0C0', fillOpacity: 0.5 }
  ]}
  xAxisKey="date"
  stacked={false}
  formatYAxis={(v) => `${v}g`}
/>
```

### 4. Product Performance
```tsx
// Top Products Bar Chart
<BarChart
  data={topProducts}
  bars={[
    { dataKey: 'sales', name: 'Sales (₹)', color: 'hsl(var(--accent))' }
  ]}
  xAxisKey="productName"
  layout="horizontal"
  height={400}
  formatYAxis={(v) => `₹${v / 1000}K`}
/>
```

---

## ⚠️ Common Mistakes

### ❌ Wrong
```tsx
// Hardcoded colors (won't work with themes)
<LineChart
  lines={[{ dataKey: 'sales', color: '#3b82f6' }]}  // ❌ Don't do this
/>

// Missing data validation
<LineChart data={data} />  // ❌ data might be undefined
```

### Correct
```tsx
// Use CSS variables
<LineChart
  lines={[{ dataKey: 'sales', color: 'hsl(var(--accent))' }]}  // Theme-aware
/>

// Handle loading/empty states
<LineChart 
  data={data || []} 
  loading={isLoading}  // Built-in loading
/>
```

---

## 🎯 Pro Tips

1. **Always format currency values:**
   ```tsx
   formatYAxis={(v) => `₹${v.toLocaleString()}`}
   ```

2. **Use loading prop for better UX:**
   ```tsx
   loading={isLoading || isFetching}
   ```

3. **Keep data keys consistent:**
   ```tsx
   // Good: Same keys across modules
   { month: 'Jan', revenue: 5000 }
   ```

4. **Use theme colors for consistency:**
   ```tsx
   color: 'hsl(var(--accent))'  // Consistent across app
   ```

5. **Wrap in Card for better presentation:**
   ```tsx
   <Card>
     <CardHeader>
       <CardTitle>Sales Trend</CardTitle>
     </CardHeader>
     <CardContent>
       <LineChart {...props} />
     </CardContent>
   </Card>
   ```

---

## 📦 Import Paths

```tsx
// Import from main charts barrel
import { LineChart, BarChart, PieChart } from '@/components/ui/charts'

// Or individual imports
import { LineChart } from '@/components/ui/charts/LineChart'
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Chart not showing | Check if `data` array has items |
| Theme colors not working | Use `hsl(var(--color))` format |
| Chart too small | Set `height` prop explicitly |
| Tooltip not showing | Ensure `showTooltip={true}` |
| Labels cut off | Increase container padding |

---

## 🚀 Next Steps

1. Install recharts: `npm install recharts`
2. Import chart component
3. Pass your data
4. Customize colors and formatting
5. Test with loading state

**Questions?** Check existing usage in:
- `features/customer/components/CustomerAnalytics`
- `features/sales/components/SalesCharts`
- `features/analytics/pages/AnalyticsDashboard`

---

**Last Updated:** December 2024  
**Version:** 1.0  
**Maintained By:** Development Team