"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Flame,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  ClipboardList,
  Percent,
  Settings,
  PanelLeft,
  Search,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserNav } from "./UserNav";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/pos", icon: ShoppingCart, label: "POS" },
  { href: "/products", icon: Package, label: "Products" },
  { href: "/orders", icon: ClipboardList, label: "Orders" },
  { href: "/customers", icon: Users, label: "Customers" },
  { href: "/promotions", icon: Percent, label: "Promotions" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export function Header() {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const formatDateTime = (date: Date) => {
    return date.toLocaleString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <header className="sticky top-0 my-2 flex h-14 items-center justify-between gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 bg-white">
      <div className="hidden text-sm font-semibold sm:block">
        <p> VC-POS {formatDateTime(currentDateTime)}</p>
      </div>
      <div className="flex justify-center items-center gap-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline" className="sm:hidden">
              <PanelLeft className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="sm:max-w-xs">
            <VisuallyHidden>
              <SheetTitle>Navigation Menu</SheetTitle>
              <SheetDescription>
                Navigate to different sections of the application
              </SheetDescription>
            </VisuallyHidden>
            <nav className="grid gap-6 text-lg font-medium">
              <Link
                href="/dashboard"
                className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
              >
                <Flame className="h-5 w-5 transition-all group-hover:scale-110" />
                <span className="sr-only">VC-POS</span>
              </Link>
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        <div className="relative ml-auto flex-1 md:grow-0">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
          />
        </div>
        <UserNav />
      </div>
    </header>
  );
}
