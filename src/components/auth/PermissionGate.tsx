"use client";

import { usePermissions } from "@/hooks/usePermissions";
import { Permission } from "@/lib/permissions";
import { ReactNode } from "react";

interface PermissionGateProps {
  children: ReactNode;
  /**
   * Required permissions to show this content
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
   * Content to show when user doesn't have permission
   */
  fallback?: ReactNode;
  /**
   * If true, render nothing when access is denied (default: true)
   */
  hideOnDeny?: boolean;
}

/**
 * Component to conditionally render content based on user permissions
 * Use this to hide/show UI elements like buttons, menu items, etc.
 */
export function PermissionGate({
  children,
  permissions = [],
  requiredRole,
  requireAll = false,
  fallback = null,
  hideOnDeny = true,
}: PermissionGateProps) {
  const { checkPermission, checkAnyPermission, checkAllPermissions, hasRole } =
    usePermissions();

  // Check role-based access
  if (requiredRole) {
    if (!hasRole(requiredRole)) {
      return hideOnDeny ? null : <>{fallback}</>;
    }
  }

  // Check permission-based access
  if (permissions.length > 0) {
    const hasAccess = requireAll
      ? checkAllPermissions(permissions)
      : checkAnyPermission(permissions);

    if (!hasAccess) {
      return hideOnDeny ? null : <>{fallback}</>;
    }
  }

  // User has access, render children
  return <>{children}</>;
}
