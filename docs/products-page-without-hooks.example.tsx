/**
 * Example: Products Page WITHOUT React Query Hooks
 *
 * This shows what the same page would look like using direct API calls.
 * Compare this to the current implementation in src/app/(app)/products/page.tsx
 */

"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import type { ProductsResponse, Category } from "@/types";

export default function ProductsPageWithoutHooks() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Manual state management
  const [products, setProducts] = useState<ProductsResponse | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch categories - runs once on mount
  useEffect(() => {
    async function fetchCategories() {
      try {
        setIsLoadingCategories(true);
        const data = await api.getCategories();
        setCategories(data);
      } catch (err) {
        console.error("Failed to load categories", err);
      } finally {
        setIsLoadingCategories(false);
      }
    }
    fetchCategories();
  }, []);

  // Fetch products - runs when filters change
  useEffect(() => {
    async function fetchProducts() {
      try {
        setIsLoadingProducts(true);
        setError(null);
        const data = await api.getProducts({
          page: currentPage,
          per_page: 20,
          search: search || undefined,
          category_code:
            selectedCategory === "all" ? undefined : selectedCategory,
        });
        setProducts(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoadingProducts(false);
      }
    }
    fetchProducts();
  }, [currentPage, search, selectedCategory]);

  // ... rest of component

  // Problems with this approach:
  // 1. Every time currentPage/search/selectedCategory changes, it refetches
  // 2. No caching - if you navigate away and come back, it refetches
  // 3. If multiple components need the same data, they all fetch separately
  // 4. More code to maintain (loading states, error handling)
  // 5. No automatic refetching when window regains focus
}
