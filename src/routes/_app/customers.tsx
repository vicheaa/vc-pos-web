import { createFileRoute } from "@tanstack/react-router";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Permission } from "@/lib/permissions";

export const Route = createFileRoute("/_app/customers")({
  component: CustomersPage,
});

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

function CustomersPage() {
  return (
    <ProtectedRoute permissions={[Permission.VIEW_CUSTOMERS]}>
      <CustomersContent />
    </ProtectedRoute>
  );
}
