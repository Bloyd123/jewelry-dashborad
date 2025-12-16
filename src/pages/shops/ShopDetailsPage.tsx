// ============================================================================
// FILE: src/pages/shops/ShopDetailsPage.tsx
// Shop Details Page - Overview Section Only
// ============================================================================

import ShopProfileAccordion from '@/components/shop/ShopDetailsPage/tabs/OverviewTab';

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const ShopDetailsPage = () => {


  // ========================================================================
  // RENDER
  // ========================================================================

  return (
    // <div className="min-h-screen bg-bg-primary">
                <>

          {/* Shop Profile Accordion */}
          <div className="p-4">
            <ShopProfileAccordion />
          </div>
        </>

  );
};

export default ShopDetailsPage;