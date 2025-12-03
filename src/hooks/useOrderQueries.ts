"use client";

import { useQuery } from "@tanstack/react-query";
import { orderApi } from "@/lib/api-services";
import type { OrdersResponse } from "@/types";

// Query keys for orders
export const orderKeys = {
  all: ["orders"] as const,
  lists: () => [...orderKeys.all, "list"] as const,
  list: (params?: {
    page?: number;
    per_page?: number;
  }) => [...orderKeys.lists(), params] as const,
  details: () => [...orderKeys.all, "detail"] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
};

export interface UseOrdersParams {
  page?: number;
  perPage?: number;
}

/**
 * Hook to fetch orders with pagination
 */
export function useOrders(params?: UseOrdersParams) {
  const { page = 1, perPage = 20 } = params || {};

  return useQuery({
    queryKey: orderKeys.list({
      page,
      per_page: perPage,
    }),
    queryFn: async () => {
      return await orderApi.getOrders({
        page,
        per_page: perPage,
      });
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to fetch a single order by ID
 */
export function useOrder(id: string) {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: async () => {
      return await orderApi.getOrder(id);
    },
    enabled: !!id,
  });
}
