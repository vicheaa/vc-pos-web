import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { SidebarNav } from "@/components/layout/SidebarNav";
import { Header } from "@/components/layout/Header";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/login" });
    }
  }, [user, loading, navigate]);

  // Show loading skeleton while checking auth or redirecting
  if (loading || !user) {
    return (
      <div className="flex min-h-screen w-full bg-muted/40" suppressHydrationWarning>
        <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
          <Skeleton className="h-full w-full" />
        </aside>
        <div className="flex flex-1 flex-col sm:pl-14">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <Skeleton className="h-8 w-8 sm:hidden" />
            <div className="ml-auto flex items-center gap-4">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </header>
          <main className="flex-1 p-4 sm:p-6">
            <Skeleton className="h-full w-full" />
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      <SidebarNav />
      <div className="flex flex-1 flex-col">
        <div className="sticky top-0 z-10 bg-slate-100 dark:bg-slate-900">
          <Header />
        </div>
        <main className="flex-1 p-2 sm:p-2">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
