"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Permission } from "@/lib/permissions";

function OrdersContent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Order management interface will be here.</p>
      </CardContent>
    </Card>
  );
}

export default function OrdersPage() {
  return (
    <ProtectedRoute permissions={[Permission.VIEW_ORDERS]}>
      <OrdersContent />
    </ProtectedRoute>
  );
}
