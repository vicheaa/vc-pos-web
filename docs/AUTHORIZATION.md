# Authorization System Documentation

This document explains how to use the role-based access control (RBAC) system implemented in the POS application.

## Overview

The authorization system provides:

- **Role-based permissions**: Admin, Manager, and Cashier roles with different permission sets
- **Route protection**: Protect entire pages based on permissions
- **Component-level protection**: Hide/show UI elements based on permissions
- **Navigation filtering**: Automatically hide menu items users can't access

## Roles and Permissions

### Roles

- **Admin**: Full access to all features
- **Manager**: Most permissions except some admin-only settings
- **Cashier**: Limited permissions - mainly POS operations

### Permissions

See `src/lib/permissions.ts` for the complete list of permissions. Common permissions include:

- `VIEW_DASHBOARD`, `VIEW_POS`, `VIEW_PRODUCTS`
- `CREATE_PRODUCT`, `EDIT_PRODUCT`, `DELETE_PRODUCT`
- `VIEW_ORDERS`, `UPDATE_ORDER_STATUS`
- `VIEW_CUSTOMERS`, `CREATE_CUSTOMER`, `EDIT_CUSTOMER`
- `VIEW_PROMOTIONS`, `CREATE_PROMOTION`
- `VIEW_STOCK`, `UPDATE_STOCK`
- `VIEW_SETTINGS`, `MANAGE_SETTINGS`

## Usage Examples

### 1. Protecting Routes

Wrap page components with `ProtectedRoute`:

```tsx
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Permission } from "@/lib/permissions";

function MyPageContent() {
  return <div>Protected content</div>;
}

export default function MyPage() {
  return (
    <ProtectedRoute permissions={[Permission.CREATE_PRODUCT]}>
      <MyPageContent />
    </ProtectedRoute>
  );
}
```

**Important**: When a user doesn't have the required permissions or role, they will be automatically redirected to the dashboard page. The page content will not be accessible to unauthorized users.

### 2. Hiding/Showing UI Elements

Use `PermissionGate` to conditionally render components:

```tsx
import { PermissionGate } from "@/components/auth/PermissionGate";
import { Permission } from "@/lib/permissions";

function ProductPage() {
  return (
    <div>
      <h1>Products</h1>

      <PermissionGate permissions={[Permission.CREATE_PRODUCT]}>
        <Button onClick={handleCreate}>Create Product</Button>
      </PermissionGate>

      <PermissionGate permissions={[Permission.DELETE_PRODUCT]}>
        <Button variant="destructive" onClick={handleDelete}>
          Delete Product
        </Button>
      </PermissionGate>
    </div>
  );
}
```

### 3. Using the usePermissions Hook

Check permissions programmatically:

```tsx
import { usePermissions } from "@/hooks/usePermissions";
import { Permission } from "@/lib/permissions";

function MyComponent() {
  const {
    checkPermission,
    checkAnyPermission,
    isAdmin,
    isManager,
    isCashier,
    canAccessRoutePath
  } = usePermissions();

  // Check single permission
  const canCreate = checkPermission(Permission.CREATE_PRODUCT);

  // Check multiple permissions (user needs ANY)
  const canManage = checkAnyPermission([
    Permission.EDIT_PRODUCT,
    Permission.DELETE_PRODUCT
  ]);

  // Check role
  if (isAdmin()) {
    // Admin-only code
  }

  // Check route access
  const canAccess = canAccessRoutePath("/product/create");

  return (
    <div>
      {canCreate && <Button>Create</Button>}
      {isAdmin() && <Button>Admin Only</Button>}
    </div>
  );
}
```

### 4. Navigation Filtering

Navigation items are automatically filtered based on permissions. The `SidebarNav` component uses the `navItemsConfig` from `src/lib/permissions.ts` to determine which items to show.

## Protected Pages

The following pages are already protected:

- `/product/create` - Requires `CREATE_PRODUCT` permission
- `/product/[id]/edit` - Requires `EDIT_PRODUCT` permission
- `/settings` - Requires `VIEW_SETTINGS` permission

## Adding New Permissions

1. Add the permission to the `Permission` enum in `src/lib/permissions.ts`:

```tsx
export enum Permission {
  // ... existing permissions
  NEW_PERMISSION = "new_permission",
}
```

2. Add it to the appropriate role(s) in `rolePermissions`:

```tsx
export const rolePermissions: Record<RoleName, Permission[]> = {
  [RoleName.ADMIN]: [
    // ... existing permissions
    Permission.NEW_PERMISSION,
  ],
  // ...
};
```

3. Use it in your components or routes as shown above.

## Best Practices

1. **Always protect sensitive routes**: Use `ProtectedRoute` for pages that modify data or access sensitive information
2. **Hide, don't disable**: Use `PermissionGate` to hide buttons/actions users can't perform rather than disabling them
3. **Check permissions on the server**: Client-side checks are for UX only. Always validate permissions on the backend API
4. **Use specific permissions**: Prefer specific permissions like `CREATE_PRODUCT` over generic ones like `MANAGE_PRODUCTS`
5. **Test with different roles**: Always test your UI with different user roles to ensure proper access control

## Troubleshooting

### User can't see menu items

- Check that the user's role has the required permissions in `rolePermissions`
- Verify the route is in `navItemsConfig` with the correct permissions

### Permission checks not working

- Ensure the user object includes the `role` property with the correct role name
- Check that role names match exactly (case-insensitive comparison is used)

### Hydration warnings

- These are often caused by browser extensions. The `suppressHydrationWarning` prop on the body tag handles this.
