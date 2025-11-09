"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Flame,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  ClipboardList,
  Percent,
  Settings,
  PackageSearch,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePermissions } from "@/hooks/usePermissions";
import { navItemsConfig } from "@/lib/permissions";
import { PermissionGate } from "@/components/auth/PermissionGate";

// Icon mapping for nav items
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  "/dashboard": LayoutDashboard,
  "/pos": ShoppingCart,
  "/product": Package,
  "/orders": ClipboardList,
  "/customers": Users,
  "/promotions": Percent,
  "/stock": PackageSearch,
  "/settings": Settings,
};

export function SidebarNav() {
  const pathname = usePathname();
  const { canAccessRoutePath } = usePermissions();

  // Filter nav items based on permissions
  const visibleNavItems = navItemsConfig.filter((item) => {
    if (item.requiredPermissions) {
      return canAccessRoutePath(item.href);
    }
    return true; // If no permissions required, show by default
  });

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <TooltipProvider delayDuration={0}>
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          {/* <Link
            href="/dashboard"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          >
            <Flame className="h-4 w-4 transition-all group-hover:scale-110" />
            <span className="sr-only">VC-POS</span>
          </Link> */}

          {visibleNavItems
            .filter((item) => item.href !== "/settings")
            .map((item) => {
              const Icon = iconMap[item.href];
              if (!Icon) return null;

              return (
                <PermissionGate
                  key={item.href}
                  permissions={item.requiredPermissions}
                  requiredRole={item.requiredRole}
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8",
                          pathname.startsWith(item.href) &&
                            "bg-accent text-accent-foreground"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="sr-only">{item.label}</span>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">{item.label}</TooltipContent>
                  </Tooltip>
                </PermissionGate>
              );
            })}
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
          {visibleNavItems
            .filter((item) => item.href === "/settings")
            .map((item) => {
              const Icon = iconMap[item.href];
              if (!Icon) return null;

              return (
                <PermissionGate
                  key={item.href}
                  permissions={item.requiredPermissions}
                  requiredRole={item.requiredRole}
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8",
                          pathname.startsWith(item.href) &&
                            "bg-accent text-accent-foreground"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="sr-only">{item.label}</span>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">{item.label}</TooltipContent>
                  </Tooltip>
                </PermissionGate>
              );
            })}
        </nav>
      </TooltipProvider>
    </aside>
  );
}
