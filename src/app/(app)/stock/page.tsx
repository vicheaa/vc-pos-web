"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Permission } from "@/lib/permissions";

function StocksContent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Stock</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Stock movement tracking here</p>
      </CardContent>
    </Card>
  );
}

export default function StocksPage() {
  return (
    <ProtectedRoute permissions={[Permission.VIEW_STOCK]}>
      <StocksContent />
    </ProtectedRoute>
  );
}
