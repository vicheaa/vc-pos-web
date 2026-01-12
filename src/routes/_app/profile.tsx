import { createFileRoute } from "@tanstack/react-router";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Permission } from "@/lib/permissions";

export const Route = createFileRoute("/_app/profile")({
  component: ProfilePage,
});

function ProfileContent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <p>User profile and settings will be here.</p>
      </CardContent>
    </Card>
  );
}

function ProfilePage() {
  return (
    <ProtectedRoute permissions={[Permission.VIEW_PROFILE]}>
      <ProfileContent />
    </ProtectedRoute>
  );
}
