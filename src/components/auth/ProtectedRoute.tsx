"use client";

import { useAuth } from "@/hooks/useAuth";
import { usePermissions } from "@/hooks/usePermissions";
import { Permission } from "@/lib/permissions";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  /**
   * Required permissions to access this route
   * User must have at least one of these permissions
   */
  permissions?: Permission[];
  /**
   * Required role name (alternative to permissions)
   */
  requiredRole?: string;
  /**
   * If true, user must have ALL specified permissions (default: false, requires ANY)
   */
  requireAll?: boolean;
  /**
   * Custom fallback component to show when access is denied
   */
  fallback?: React.ReactNode;
}

/**
 * Component to protect routes based on user permissions
 * Redirects to login if not authenticated
 * Shows access denied if authenticated but lacks permissions
 */
export function ProtectedRoute({
  children,
  permissions = [],
  requiredRole,
  requireAll = false,
  fallback,
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const { checkAnyPermission, checkAllPermissions, hasRole } = usePermissions();
  const router = useRouter();

  // Check access permissions
  let hasAccess = true;
  if (requiredRole) {
    hasAccess = hasRole(requiredRole);
  } else if (permissions.length > 0) {
    hasAccess = requireAll
      ? checkAllPermissions(permissions)
      : checkAnyPermission(permissions);
  }

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!loading && !user) {
      router.push("/login");
      return;
    }

    // Redirect to dashboard if authenticated but lacks permissions/role
    if (!loading && user && !hasAccess) {
      router.replace("/dashboard");
    }
  }, [user, loading, router, hasAccess]);

  // Show loading state
  if (loading || !user) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-muted/40">
        <div className="w-full max-w-md space-y-4 p-6">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  // Check if user has access
  if (!hasAccess) {
    return (
      fallback || (
        <div className="flex min-h-screen w-full items-center justify-center bg-muted/40 p-4">
          <Alert className="max-w-md" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription>
              You do not have the required{" "}
              {requiredRole ? "role" : "permissions"} to access this page.
              Redirecting...
            </AlertDescription>
          </Alert>
        </div>
      )
    );
  }

  // User has access, render children
  return <>{children}</>;
}
