// ============================================================================
// FILE: locales/en/index.ts
// ============================================================================

// import auth from './auth.json'
import common from './common.json'
import error from './errors.json'
import customer from './customer.json'
import permission from './permission.json'
import shop from './shop.json'
import metalrate from './metalrate.json'
import supplier from './suppliers.json'
import product from './product.json'
import payment from './payment.json'
import user from './user.json'
import auth from './auth.json'
// import dashboard from './dashboard.json'
// import inventory from './inventory.json'
// import masters from './masters.json'
// import parties from './parties.json'
import purchase from './purchase.json'
// import reports from './reports.json'
import sales from './sales.json'
// import settings from './settings.json'
// import validation from './validation.json'

export default {
  ...auth,
  ...common,
  ...error,
  ...customer,
  ...permission,
  ...shop,
  ...metalrate,
  ...supplier,
  ...product,
  ...purchase,
  ...payment,
  ...user,
  // ...dashboard,
  //   ...inventory,
  //   ...masters,
  //   ...parties,
  //   ...purchase,
  //   ...reports,
  ...sales,
  //   ...settings,
  //   ...validation,
}
