"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { ProductsResponse, ApiProduct } from "@/types";

// Query keys for products
export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (params?: {
    page?: number;
    per_page?: number;
    search?: string;
    category_code?: string;
  }) => [...productKeys.lists(), params] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (code: string) => [...productKeys.details(), code] as const,
};

export interface UseProductsParams {
  page?: number;
  perPage?: number;
  search?: string;
  categoryCode?: string;
}

/**
 * Hook to fetch products with pagination
 */
export function useProducts(params?: UseProductsParams) {
  const { page = 1, perPage = 20, search, categoryCode } = params || {};

  return useQuery({
    queryKey: productKeys.list({
      page,
      per_page: perPage,
      search,
      category_code: categoryCode,
    }),
    queryFn: async () => {
      return await api.getProducts({
        page,
        per_page: perPage,
        search,
        category_code: categoryCode,
      });
    },
    staleTime: 1000 * 60 * 5,
  });
}
