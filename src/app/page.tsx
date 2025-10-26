"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Flame } from "lucide-react";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push("/dashboard");
      } else {
        router.push("/dashboard");
      }
    }
  }, [user, loading, router]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary">
          <Flame className="h-8 w-8 animate-pulse text-primary-foreground" />
        </div>
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Loading VC-POS...</h1>
          <p className="text-muted-foreground">Please wait a moment.</p>
        </div>
      </div>
    </div>
  );
}
