// "use client";
import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
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
import { LanguageSwitcher } from "./LanguageSwitcher";
import { cn } from "@/lib/utils";

export function Header() {
  const { t } = useTranslation();
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

  const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: t("nav.dashboard") },
    { href: "/pos", icon: ShoppingCart, label: t("nav.pos") },
    { href: "/products", icon: Package, label: t("nav.products") },
    { href: "/orders", icon: ClipboardList, label: t("nav.orders") },
    { href: "/customers", icon: Users, label: t("nav.customers") },
    { href: "/promotions", icon: Percent, label: t("nav.promotions") },
    { href: "/settings", icon: Settings, label: t("nav.settings") },
  ];

  return (
    <header className="bg-white sticky top-0 py-1.5 px-4 flex items-center justify-between gap-4 border-b border-slate-200 ">
      <div className="hidden text-sm font-semibold sm:block flex-shrink-0">
        <p>
          {" "}
          {t("header.vcPos")} {formatDateTime(currentDateTime)}
        </p>
      </div>
      <div className="flex flex-1 justify-end items-center gap-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline" className="sm:hidden">
              <PanelLeft className="h-5 w-5" />
              <span className="sr-only">{t("nav.toggleMenu")}</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="sm:max-w-xs">
            <VisuallyHidden>
              <SheetTitle>{t("nav.navigationMenu")}</SheetTitle>
              <SheetDescription>
                {t("nav.navigateToDifferentSections")}
              </SheetDescription>
            </VisuallyHidden>
            <nav className="grid gap-6 text-lg font-medium">
              <Link
                to="/dashboard"
                className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
              >
                <Flame className="h-5 w-5 transition-all group-hover:scale-110" />
                <span className="sr-only">{t("header.vcPos")}</span>
              </Link>
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
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
            placeholder={t("common.search")}
            className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
          />
        </div>
        <LanguageSwitcher />
        <UserNav />
      </div>
    </header>
  );
}
