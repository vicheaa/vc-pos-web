"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Permission } from "@/lib/permissions";

function CustomersContent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Customers</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Customer management interface will be here.</p>
      </CardContent>
    </Card>
  );
}

export default function CustomersPage() {
  return (
    <ProtectedRoute permissions={[Permission.VIEW_CUSTOMERS]}>
      <CustomersContent />
    </ProtectedRoute>
  );
}
