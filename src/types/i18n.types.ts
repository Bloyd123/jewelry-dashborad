// ============================================================================
// FILE: types/i18n.types.ts
// Type definitions for i18n translations
// ============================================================================

// ============================================================================
// LANGUAGE CODES
// ============================================================================

export type LanguageCode = 'en' | 'hi' | 'mr'

// ============================================================================
// LANGUAGE INFO
// ============================================================================

export interface LanguageInfo {
  code: LanguageCode
  name: string
  nativeName: string
  flag: string
}

// ============================================================================
// TRANSLATION STRUCTURE
// ============================================================================

export interface Translations {
  // Sidebar translations
  sidebar: {
    dashboard: string
    stock: string
    payments: string
    paymentHistory: string
    paymentEntry: string
    purchases: string
    allPurchases: string
    addPurchase: string
    suppliers: string
    sales: string
    allSales: string
    addSale: string
    customers: string
    reports: string
    oldGold: string
    allOldGoldPurchases: string
    addOldGoldPurchase: string
    products: string
    allProducts: string
    addProduct: string
    customOrders: string
    allCustomOrders: string
  }

  // Common translations
  common: {
    save: string
    cancel: string
    edit: string
    delete: string
    search: string
    filter: string
    export: string
    import: string
    loading: string
    noData: string
    error: string
    success: string
    confirm: string
    yes: string
    no: string
    actions: string
    view: string
    download: string
    upload: string
    refresh: string
    close: string
    back: string
    next: string
    previous: string
    submit: string
    reset: string
    clear: string
    select: string
    selectAll: string
    deselectAll: string
    apply: string
    print: string
  }

  // Form translations
  form: {
    required: string
    invalid: string
    email: string
    phone: string
    password: string
    confirmPassword: string
    passwordMismatch: string
    minLength: string
    maxLength: string
    min: string
    max: string
    pattern: string
  }

  // Dashboard translations
  dashboard: {
    title: string
    welcome: string
    totalSales: string
    totalPurchases: string
    totalStock: string
    lowStock: string
    recentTransactions: string
    topProducts: string
    salesTrend: string
    purchaseTrend: string
  }

  // Stock translations
  stock: {
    title: string
    totalItems: string
    totalValue: string
    lowStockItems: string
    outOfStock: string
    itemName: string
    quantity: string
    unit: string
    price: string
    value: string
    category: string
    supplier: string
    lastUpdated: string
  }

  // Payments translations
  payments: {
    title: string
    history: string
    newEntry: string
    amount: string
    date: string
    method: string
    reference: string
    status: string
    customer: string
    pending: string
    completed: string
    failed: string
    refunded: string
  }

  // Purchases translations
  purchases: {
    title: string
    addNew: string
    purchaseDate: string
    invoiceNumber: string
    supplier: string
    items: string
    totalAmount: string
    paidAmount: string
    dueAmount: string
    paymentStatus: string
    notes: string
  }

  // Sales translations
  sales: {
    title: string
    addNew: string
    saleDate: string
    invoiceNumber: string
    customer: string
    items: string
    subtotal: string
    discount: string
    tax: string
    totalAmount: string
    paidAmount: string
    dueAmount: string
    paymentStatus: string
    notes: string
  }

  // Products translations
  products: {
    title: string
    addNew: string
    name: string
    sku: string
    description: string
    category: string
    weight: string
    purity: string
    makingCharges: string
    price: string
    stock: string
    image: string
    status: string
    active: string
    inactive: string
  }

  // Customers translations
  customers: {
    title: string
    addNew: string
    name: string
    email: string
    phone: string
    address: string
    city: string
    state: string
    pincode: string
    gst: string
    totalPurchases: string
    dueAmount: string
    lastPurchase: string
  }

  // Suppliers translations
  suppliers: {
    title: string
    addNew: string
    name: string
    email: string
    phone: string
    address: string
    city: string
    state: string
    pincode: string
    gst: string
    totalPurchases: string
    dueAmount: string
    lastPurchase: string
  }

  // Old Gold translations
  oldGold: {
    title: string
    addNew: string
    customerName: string
    itemType: string
    grossWeight: string
    netWeight: string
    purity: string
    rate: string
    totalValue: string
    notes: string
  }

  // Custom Orders translations
  customOrders: {
    title: string
    addNew: string
    orderNumber: string
    customer: string
    description: string
    design: string
    weight: string
    purity: string
    status: string
    estimatedDelivery: string
    advanceAmount: string
    totalAmount: string
    pending: string
    inProgress: string
    completed: string
    delivered: string
  }

  // Reports translations
  reports: {
    title: string
    salesReport: string
    purchaseReport: string
    stockReport: string
    paymentReport: string
    profitLoss: string
    dateRange: string
    from: string
    to: string
    generate: string
    download: string
  },
  errors: {
    api: {
      generic: string
      network: string
      server: string
      timeout: string
    }

    auth: {
      title: string
      failed: string
      invalidCredentials: string
      sessionExpired: string
      unauthorized: string
    }

    validation: {
      title: string
      failed: string
      fixFormErrors: string
      required: string
      invalidEmail: string
      invalidPassword: string
    }

    permission: {
      title: string
      denied: string
      insufficientRights: string
    }

    notFound: {
      title: string
      resource: string
      page: string
    }

    rateLimit: {
      title: string
      exceeded: string
      retryAfter: string
    }

    server: {
      title: string
      message: string
    }

    network: {
      title: string
      message: string
    }

    unknown: {
      title: string
      message: string
    }
  }

  auth: {
    login: {
      success: string
      welcomeBack: string
    }

    logout: {
      success: string
    }

    register: {
      success: string
    }
  }
}

// ============================================================================
// AVAILABLE LANGUAGES
// ============================================================================

export const AVAILABLE_LANGUAGES: LanguageInfo[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇬🇧',
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिंदी',
    flag: '🇮🇳',
  },
  {
    code: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
    flag: '🇮🇳',
  },
]