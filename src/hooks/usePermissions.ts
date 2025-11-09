"use client";

import { useAuth } from "./useAuth";
import {
  Permission,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  canAccessRoute,
  getRolePermissions,
} from "@/lib/permissions";

/**
 * Hook to check user permissions
 */
export function usePermissions() {
  const { user } = useAuth();
  const role = user?.role;

  /**
   * Check if current user has a specific permission
   */
  const checkPermission = (permission: Permission): boolean => {
    return hasPermission(role, permission);
  };

  /**
   * Check if current user has any of the specified permissions
   */
  const checkAnyPermission = (permissions: Permission[]): boolean => {
    return hasAnyPermission(role, permissions);
  };

  /**
   * Check if current user has all of the specified permissions
   */
  const checkAllPermissions = (permissions: Permission[]): boolean => {
    return hasAllPermissions(role, permissions);
  };

  /**
   * Check if current user can access a specific route
   */
  const canAccessRoutePath = (route: string): boolean => {
    return canAccessRoute(role, route);
  };

  /**
   * Get all permissions for current user's role
   */
  const getUserPermissions = (): Permission[] => {
    return getRolePermissions(role);
  };

  /**
   * Check if user has a specific role
   */
  const hasRole = (roleName: string): boolean => {
    return role?.name.toLowerCase() === roleName.toLowerCase();
  };

  /**
   * Check if user is admin
   */
  const isAdmin = (): boolean => {
    return hasRole("admin");
  };

  /**
   * Check if user is manager
   */
  const isManager = (): boolean => {
    return hasRole("manager");
  };

  /**
   * Check if user is cashier
   */
  const isCashier = (): boolean => {
    return hasRole("cashier");
  };

  return {
    checkPermission,
    checkAnyPermission,
    checkAllPermissions,
    canAccessRoutePath,
    getUserPermissions,
    hasRole,
    isAdmin,
    isManager,
    isCashier,
    role: role || null,
  };
}
