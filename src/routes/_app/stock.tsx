import { createFileRoute } from "@tanstack/react-router";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Permission } from "@/lib/permissions";

export const Route = createFileRoute("/_app/stock")({
  component: StockPage,
});

function StockContent() {
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

function StockPage() {
  return (
    <ProtectedRoute permissions={[Permission.VIEW_STOCK]}>
      <StockContent />
    </ProtectedRoute>
  );
}
