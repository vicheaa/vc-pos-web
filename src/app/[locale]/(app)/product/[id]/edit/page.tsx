"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Permission } from "@/lib/permissions";

function EditProductPageContent() {
  return <div>Edit</div>;
}

export default function EditProductPage() {
  return (
    <ProtectedRoute permissions={[Permission.EDIT_PRODUCT]}>
      <EditProductPageContent />
    </ProtectedRoute>
  );
}
