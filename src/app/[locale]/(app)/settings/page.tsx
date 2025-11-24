"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Permission } from "@/lib/permissions";

function SettingsPageContent() {
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

export default function SettingsPage() {
  return (
    <ProtectedRoute permissions={[Permission.VIEW_SETTINGS]}>
      <SettingsPageContent />
    </ProtectedRoute>
  );
}
