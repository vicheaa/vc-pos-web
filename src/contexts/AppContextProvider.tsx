"use client";

import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthProvider } from "./AuthContext";
import { CartProvider } from "./CartContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import { queryClient } from "@/lib/query-client";

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <AuthProvider>
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
      </ThemeProvider>
      {process.env.NODE_ENV === "development" && <ReactQueryDevtools />}
    </QueryClientProvider>
  );
}
