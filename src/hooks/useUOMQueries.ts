"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { UOM } from "@/types";

// Query keys for UOMs
export const uomKeys = {
  all: ["uoms"] as const,
  lists: () => [...uomKeys.all, "list"] as const,
};

/**
 * Hook to fetch all UOMs (Units of Measure)
 */
export function useUOMs() {
  return useQuery({
    queryKey: uomKeys.lists(),
    queryFn: async () => {
      return await api.getUOMs();
    },
    staleTime: 1000 * 60 * 30, // UOMs don't change often, cache for 30 minutes
  });
}
