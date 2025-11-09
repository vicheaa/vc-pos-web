import type { Role } from "@/types";

/**
 * Permission names for different actions in the POS system
 */
export enum Permission {
  // Dashboard
  VIEW_DASHBOARD = "view_dashboard",

  // POS
  VIEW_POS = "view_pos",
  CREATE_ORDER = "create_order",
  CANCEL_ORDER = "cancel_order",

  // Products
  VIEW_PRODUCTS = "view_products",
  CREATE_PRODUCT = "create_product",
  EDIT_PRODUCT = "edit_product",
  DELETE_PRODUCT = "delete_product",

  // Orders
  VIEW_ORDERS = "view_orders",
  VIEW_ORDER_DETAILS = "view_order_details",
  UPDATE_ORDER_STATUS = "update_order_status",

  // Customers
  VIEW_CUSTOMERS = "view_customers",
  CREATE_CUSTOMER = "create_customer",
  EDIT_CUSTOMER = "edit_customer",
  DELETE_CUSTOMER = "delete_customer",

  // Promotions
  VIEW_PROMOTIONS = "view_promotions",
  CREATE_PROMOTION = "create_promotion",
  EDIT_PROMOTION = "edit_promotion",
  DELETE_PROMOTION = "delete_promotion",

  // Stock
  VIEW_STOCK = "view_stock",
  UPDATE_STOCK = "update_stock",

  // Settings
  VIEW_SETTINGS = "view_settings",
  MANAGE_SETTINGS = "manage_settings",

  // Profile
  VIEW_PROFILE = "view_profile",
  EDIT_PROFILE = "edit_profile",
}

/**
 * Role names - should match backend role names
 */
export enum RoleName {
  SUPER_ADMIN = "super_admin",
  ADMIN = "admin",
  MANAGER = "manager",
  CASHIER = "cashier",
}

/**
 * Role-based permissions mapping
 * Each role has a set of permissions they can perform
 */
export const rolePermissions: Record<RoleName, Permission[]> = {
  [RoleName.SUPER_ADMIN]: [
    // Admin has all permissions
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_POS,
    Permission.CREATE_ORDER,
    Permission.CANCEL_ORDER,
    Permission.VIEW_PRODUCTS,
    Permission.CREATE_PRODUCT,
    Permission.EDIT_PRODUCT,
    Permission.DELETE_PRODUCT,
    Permission.VIEW_ORDERS,
    Permission.VIEW_ORDER_DETAILS,
    Permission.UPDATE_ORDER_STATUS,
    Permission.VIEW_CUSTOMERS,
    Permission.CREATE_CUSTOMER,
    Permission.EDIT_CUSTOMER,
    Permission.DELETE_CUSTOMER,
    Permission.VIEW_PROMOTIONS,
    Permission.CREATE_PROMOTION,
    Permission.EDIT_PROMOTION,
    Permission.DELETE_PROMOTION,
    Permission.VIEW_STOCK,
    Permission.UPDATE_STOCK,
    Permission.VIEW_SETTINGS,
    Permission.MANAGE_SETTINGS,
    Permission.VIEW_PROFILE,
    Permission.EDIT_PROFILE,
  ],

  [RoleName.ADMIN]: [
    // Admin has all permissions
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_POS,
    Permission.CREATE_ORDER,
    Permission.CANCEL_ORDER,
    Permission.VIEW_PRODUCTS,
    Permission.CREATE_PRODUCT,
    Permission.EDIT_PRODUCT,
    Permission.DELETE_PRODUCT,
    Permission.VIEW_ORDERS,
    Permission.VIEW_ORDER_DETAILS,
    Permission.UPDATE_ORDER_STATUS,
    Permission.VIEW_CUSTOMERS,
    Permission.CREATE_CUSTOMER,
    Permission.EDIT_CUSTOMER,
    Permission.DELETE_CUSTOMER,
    Permission.VIEW_PROMOTIONS,
    Permission.CREATE_PROMOTION,
    Permission.EDIT_PROMOTION,
    Permission.DELETE_PROMOTION,
    Permission.VIEW_STOCK,
    Permission.UPDATE_STOCK,
    Permission.VIEW_SETTINGS,
    Permission.MANAGE_SETTINGS,
    Permission.VIEW_PROFILE,
    Permission.EDIT_PROFILE,
  ],

  [RoleName.MANAGER]: [
    // Manager has most permissions except some admin-only settings
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_POS,
    Permission.CREATE_ORDER,
    Permission.CANCEL_ORDER,
    Permission.VIEW_PRODUCTS,
    Permission.CREATE_PRODUCT,
    Permission.EDIT_PRODUCT,
    Permission.DELETE_PRODUCT,
    Permission.VIEW_ORDERS,
    Permission.VIEW_ORDER_DETAILS,
    Permission.UPDATE_ORDER_STATUS,
    Permission.VIEW_CUSTOMERS,
    Permission.CREATE_CUSTOMER,
    Permission.EDIT_CUSTOMER,
    Permission.DELETE_CUSTOMER,
    Permission.VIEW_PROMOTIONS,
    Permission.CREATE_PROMOTION,
    Permission.EDIT_PROMOTION,
    Permission.DELETE_PROMOTION,
    Permission.VIEW_STOCK,
    Permission.UPDATE_STOCK,
    Permission.VIEW_SETTINGS,
    Permission.VIEW_PROFILE,
    Permission.EDIT_PROFILE,
  ],

  [RoleName.CASHIER]: [
    // Cashier has limited permissions - mainly POS operations
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_POS,
    Permission.CREATE_ORDER,
    Permission.VIEW_PRODUCTS,
    Permission.VIEW_ORDERS,
    // Permission.VIEW_ORDER_DETAILS,
    // Permission.VIEW_CUSTOMERS,
    // Permission.CREATE_CUSTOMER,
    // Permission.VIEW_PROMOTIONS,
    // Permission.VIEW_PROFILE,
    // Permission.EDIT_PROFILE,
  ],
};

/**
 * Route permissions mapping
 * Maps routes to required permissions
 */
export const routePermissions: Record<string, Permission[]> = {
  "/dashboard": [Permission.VIEW_DASHBOARD],
  "/pos": [Permission.VIEW_POS],
  "/product": [Permission.VIEW_PRODUCTS],
  "/product/create": [Permission.CREATE_PRODUCT],
  "/product/[id]/edit": [Permission.EDIT_PRODUCT],
  "/orders": [Permission.VIEW_ORDERS],
  "/customers": [Permission.VIEW_CUSTOMERS],
  "/promotions": [Permission.VIEW_PROMOTIONS],
  "/stock": [Permission.VIEW_STOCK],
  "/settings": [Permission.VIEW_SETTINGS],
  "/profile": [Permission.VIEW_PROFILE],
};

/**
 * Navigation items with their required permissions
 */
export interface NavItem {
  href: string;
  label: string;
  requiredPermissions?: Permission[];
  requiredRole?: string;
}

export const navItemsConfig: NavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    requiredPermissions: [Permission.VIEW_DASHBOARD],
  },
  {
    href: "/pos",
    label: "POS",
    requiredPermissions: [Permission.VIEW_POS],
  },
  {
    href: "/product",
    label: "Product",
    requiredPermissions: [Permission.VIEW_PRODUCTS],
  },
  {
    href: "/orders",
    label: "Orders",
    requiredPermissions: [Permission.VIEW_ORDERS],
  },
  {
    href: "/customers",
    label: "Customers",
    requiredPermissions: [Permission.VIEW_CUSTOMERS],
  },
  {
    href: "/promotions",
    label: "Promotions",
    requiredPermissions: [Permission.VIEW_PROMOTIONS],
  },
  {
    href: "/stock",
    label: "Stock",
    requiredPermissions: [Permission.VIEW_STOCK],
  },
  {
    href: "/settings",
    label: "Settings",
    requiredPermissions: [Permission.VIEW_SETTINGS],
  },
];

/**
 * Check if a role has a specific permission
 */
export function hasPermission(
  role: Role | null | undefined,
  permission: Permission
): boolean {
  if (!role) return false;

  // Normalize role name to lowercase for comparison
  const roleName = role.name.toLowerCase() as RoleName;

  // Check if role exists in our permissions map
  if (!(roleName in rolePermissions)) {
    return false;
  }

  return rolePermissions[roleName].includes(permission);
}

/**
 * Check if a role has any of the specified permissions
 */
export function hasAnyPermission(
  role: Role | null | undefined,
  permissions: Permission[]
): boolean {
  if (!role) return false;
  return permissions.some((permission) => hasPermission(role, permission));
}

/**
 * Check if a role has all of the specified permissions
 */
export function hasAllPermissions(
  role: Role | null | undefined,
  permissions: Permission[]
): boolean {
  if (!role) return false;
  return permissions.every((permission) => hasPermission(role, permission));
}

/**
 * Get all permissions for a role
 */
export function getRolePermissions(
  role: Role | null | undefined
): Permission[] {
  if (!role) return [];

  const roleName = role.name.toLowerCase() as RoleName;
  return rolePermissions[roleName] || [];
}

/**
 * Check if user can access a route
 */
export function canAccessRoute(
  role: Role | null | undefined,
  route: string
): boolean {
  // Find matching route permissions (supports dynamic routes)
  const routePermission = Object.entries(routePermissions).find(
    ([routePattern]) => {
      // Handle dynamic routes like [id]
      const pattern = routePattern.replace(/\[.*?\]/g, ".*");
      const regex = new RegExp(`^${pattern}$`);
      return regex.test(route);
    }
  );

  if (!routePermission) {
    // If route doesn't have permissions defined, allow access (default open)
    return true;
  }

  const requiredPermissions = routePermission[1];
  return hasAnyPermission(role, requiredPermissions);
}
