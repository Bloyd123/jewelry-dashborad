// // ============================================================================
// // FILE: router/AppRouter.tsx
// // Main Application Router with Route Configuration
// // ============================================================================
import { Routes, Route, Navigate } from 'react-router-dom'
import { ROUTES } from '../config/routes.config'
import { MainLayout } from '../components/layout/MainLayout/MainLayout'
import PrivateRoute from './PrivateRoute'
// import RoleRoute from './RoleRoute'

// // Auth Pages
import LoginPage from '../components/auth/login/pages'
import ForgotPasswordPage from '../components/auth/forgotpassword/pages'
import ResetPasswordPage from '../components/auth/resetpassword/pages'
// import SignupPage from '../components/auth/signup/pages'

// // Dashboard
import { Dashboard } from '../components/dashboard/pages'

// // Stock Management
// import StockPage from '../components/stock/pages/StockPage'

// // Payment Pages
// import PaymentsPage from '../components/payments/pages/PaymentsPage'
// import PaymentHistoryPage from '../components/payments/pages/PaymentHistoryPage'
// import PaymentEntryPage from '../components/payments/pages/PaymentEntryPage'

// // Purchase Pages
// import PurchasesPage from '../components/purchases/pages/PurchasesPage'
// import AddPurchasePage from '../components/purchases/pages/AddPurchasePage'
// import SuppliersPage from '../components/suppliers/pages/SuppliersPage'
// import PurchaseReportsPage from '../components/purchases/pages/PurchaseReportsPage'

// // Sales Pages
// import SalesPage from '../components/sales/pages/SalesPage'
// import AddSalePage from '../components/sales/pages/AddSalePage'
// import CustomersPage from '../components/customers/pages/CustomersPage'
// import SalesReportsPage from '../components/sales/pages/SalesReportsPage'

// // Old Gold Pages
// import OldGoldPurchasesPage from '../components/purchases/pages/OldGoldPurchasesPage'
// import AddOldGoldPurchasePage from '../components/purchases/pages/AddOldGoldPurchasePage'

// // Product Pages
// import ProductsPage from '../components/products/pages/ProductsPage'
// import AddProductPage from '../components/products/pages/AddProductPage'

// // Custom Orders
// import CustomOrdersPage from '../components/custom-orders/pages/CustomOrdersPage'

// // ============================================================================
// // ROUTER COMPONENT
// // ============================================================================
export const AppRouter = () => {
  return (

    <Routes>
           {/* ====================================== */}
           {/* PUBLIC ROUTES */}
           {/* ====================================== */}
           <Route path="/" element={<Navigate to={ROUTES.login} replace />} />
           <Route path={ROUTES.login} element={<LoginPage />} />
{/*        <Route path={ROUTES.signup} element={<SignupPage />} /> */}
       <Route path={ROUTES.forgotPassword} element={<ForgotPasswordPage />} />
       <Route path={ROUTES.resetPassword} element={<ResetPasswordPage />} />

           {/* ====================================== */}
           {/* PROTECTED ROUTES WITH LAYOUT */}
           {/* ====================================== */}
           <Route element={<PrivateRoute />}>
            <Route element={<MainLayout />}>
               {/* Dashboard */}
            <Route path={ROUTES.dashboard} element={<Dashboard />} />

              {/* Stock Management */}
{/*            <Route path={ROUTES.stock} element={<StockPage />} /> */}

           {/* ====================================== */}
           {/* PAYMENT ROUTES */}
           {/* ====================================== */}
           {/* <Route path={ROUTES.payments} element={<PaymentsPage />} /> */}
           {/* <Route path={ROUTES.paymentHistory} element={<PaymentHistoryPage />} /> */}
           {/* <Route path={ROUTES.paymentEntry} element={<PaymentEntryPage />} /> */}

           {/* ====================================== */}
           {/* PURCHASE ROUTES */}
           {/* ====================================== */}
{/*            <Route path={ROUTES.purchases} element={<PurchasesPage />} /> */}
{/*            <Route path={ROUTES.addPurchase} element={<AddPurchasePage />} /> */}
{/*            <Route path={ROUTES.suppliers} element={<SuppliersPage />} /> */}
{/*            <Route path={ROUTES.purchaseReports} element={<PurchaseReportsPage />} /> */}

           {/* ====================================== */}
           {/* SALES ROUTES */}
           {/* ====================================== */}
{/*            <Route path={ROUTES.sales} element={<SalesPage />} /> */}
{/*            <Route path={ROUTES.addSale} element={<AddSalePage />} /> */}
{/*            <Route path={ROUTES.customers} element={<CustomersPage />} /> */}
{/*            <Route path={ROUTES.salesReports} element={<SalesReportsPage />} /> */}

           {/* ====================================== */}
           {/* OLD GOLD ROUTES */}
           {/* ====================================== */}
           {/* <Route 
             path={ROUTES.oldGoldPurchases} 
             element={<OldGoldPurchasesPage />} 
           />
           <Route 
             path={ROUTES.addOldGoldPurchase} 
             element={<AddOldGoldPurchasePage />} 
           /> */}

           {/* ====================================== */}
           {/* PRODUCT ROUTES */}
           {/* ====================================== */}
{/*            <Route path={ROUTES.products} element={<ProductsPage />} /> */}
{/*            <Route path={ROUTES.addProduct} element={<AddProductPage />} /> */}

           {/* ====================================== */}
           {/* CUSTOM ORDERS */}
           {/* ====================================== */}
{/*            <Route path={ROUTES.customOrders} element={<CustomOrdersPage />} /> */}

           {/* ====================================== */}
           {/* ROLE-BASED ROUTES EXAMPLE */}
           {/* ====================================== */}
           {/* Only Admin can access reports */}
{/*            <Route element={<RoleRoute allowedRoles={['admin', 'manager']} />}> */}
{/*              <Route path={ROUTES.purchaseReports} element={<PurchaseReportsPage />} /> */}
{/*              <Route path={ROUTES.salesReports} element={<SalesReportsPage />} /> */}
{/*            </Route> */}

           {/* Fallback to Dashboard for any unmatched routes */}
{/*            <Route path="*" element={<Navigate to={ROUTES.dashboard} replace />} /> */}
             </Route>
           </Route>
     </Routes>
   )
 }

 export default AppRouter