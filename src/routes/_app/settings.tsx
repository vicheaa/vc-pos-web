import { createFileRoute } from "@tanstack/react-router";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Permission } from "@/lib/permissions";

export const Route = createFileRoute("/_app/settings")({
  component: SettingsPage,
});

function SettingsContent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <p>System settings will be here.</p>
      </CardContent>
    </Card>
  );
}

function SettingsPage() {
  return (
    <ProtectedRoute permissions={[Permission.VIEW_SETTINGS]}>
      <SettingsContent />
    </ProtectedRoute>
  );
}
