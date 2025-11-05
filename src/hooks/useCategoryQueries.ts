"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Category } from "@/types";

// Query keys for categories
export const categoryKeys = {
  all: ["categories"] as const,
  lists: () => [...categoryKeys.all, "list"] as const,
};

/**
 * Hook to fetch all categories
 */
export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.lists(),
    queryFn: async () => {
      return await api.getCategories();
    },
    staleTime: 1000 * 60 * 30, // Categories don't change often, cache for 30 minutes
  });
}
