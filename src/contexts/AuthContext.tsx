"use client";

import type { Profile } from "@/types";
import React, { createContext, useEffect } from "react";
import { useCurrentUser, useLogin, useLogout } from "@/hooks/useAuthQueries";
import Cookies from "js-cookie";

interface AuthContextType {
  user: Profile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading, error } = useCurrentUser();
  const loginMutation = useLogin();
  const logoutMutation = useLogout();

  // Handle authentication errors silently
  useEffect(() => {
    if (error) {
      // If there's an auth error, token is likely invalid - it's already handled in the query
      const token = Cookies.get("auth_token");
      if (token) {
        // Token exists but query failed - remove it
        Cookies.remove("auth_token");
      }
    }
  }, [error]);

  const login = async (email: string, password: string) => {
    await loginMutation.mutateAsync({ email, password });
    // After successful login, user data will be automatically refetched by React Query
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  // Loading state: query is loading OR mutation is in progress
  const loading =
    isLoading || loginMutation.isPending || logoutMutation.isPending;

  return (
    <AuthContext.Provider
      value={{ user: user || null, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
