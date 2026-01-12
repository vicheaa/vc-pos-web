import { createFileRoute } from "@tanstack/react-router";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Permission } from "@/lib/permissions";

export const Route = createFileRoute("/_app/promotions")({
  component: PromotionsPage,
});

function PromotionsContent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Promotions</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Promotion management interface will be here.</p>
      </CardContent>
    </Card>
  );
}

function PromotionsPage() {
  return (
    <ProtectedRoute permissions={[Permission.VIEW_PROMOTIONS]}>
      <PromotionsContent />
    </ProtectedRoute>
  );
}
