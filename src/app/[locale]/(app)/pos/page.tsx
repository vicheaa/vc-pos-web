"use client";

import { ProductGrid } from "@/components/features/pos/ProductGrid";
import { Cart } from "@/components/features/pos/Cart";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Permission } from "@/lib/permissions";

function POSContent() {
  return (
    <div className="grid h-[calc(100vh-8rem)] grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <ProductGrid />
      </div>
      <div className="sticky top-20 lg:col-span-1 h-[80vh] overflow-y-auto">
        <Cart />
      </div>
    </div>
  );
}

export default function POSPage() {
  return (
    <ProtectedRoute permissions={[Permission.VIEW_POS]}>
      <POSContent />
    </ProtectedRoute>
  );
}
