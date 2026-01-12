"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "@tanstack/react-router";
import { useEffect } from "react";
import { LoginForm } from "@/components/features/auth/LoginForm";
import { Flame } from "lucide-react";
import { useTranslation } from "react-i18next";

export function LoginPageWrapper() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { t } = useTranslation("common");

  useEffect(() => {
    if (!loading && user) {
      router.navigate({ to: "/dashboard" });
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary">
            <Flame className="h-8 w-8 animate-pulse text-primary-foreground" />
          </div>
          <div className="text-center">
            <p className="text-muted-foreground">{t("loading")}</p>
          </div>
        </div>
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md bg-white p-6">
        <div className="mb-8 flex flex-col items-center ">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary">
            <Flame className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">VC-POS</h1>
          <p className="text-muted-foreground">
            Welcome back! Please login to your account.
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
