/**
 * Example React Query hooks for other API endpoints
 * Use this as a reference to create hooks for products, orders, customers, etc.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Product, Order, Customer } from "@/types";

// ============================================
// EXAMPLE: Products Queries
// ============================================

export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (filters?: { category?: string; search?: string }) =>
    [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
};

// Get all products
export function useProducts(filters?: { category?: string; search?: string }) {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: async () => {
      // Example: const response = await api.getProducts(filters);
      // return response.data;
      return [] as Product[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Get single product
export function useProduct(productId: string) {
  return useQuery({
    queryKey: productKeys.detail(productId),
    queryFn: async () => {
      // Example: const response = await api.getProduct(productId);
      // return response.data;
      return null as Product | null;
    },
    enabled: !!productId, // Only fetch if productId exists
  });
}

// Create product mutation
export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productData: Partial<Product>) => {
      // Example: return await api.createProduct(productData);
      return {} as Product;
    },
    onSuccess: () => {
      // Invalidate products list to refetch
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}

// Update product mutation
export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Product>;
    }) => {
      // Example: return await api.updateProduct(id, data);
      return {} as Product;
    },
    onSuccess: (data, variables) => {
      // Update the specific product in cache
      queryClient.setQueryData(productKeys.detail(variables.id), data);
      // Invalidate list to ensure consistency
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}

// Delete product mutation
export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      // Example: return await api.deleteProduct(productId);
    },
    onSuccess: (_, productId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: productKeys.detail(productId) });
      // Invalidate list
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}

// ============================================
// EXAMPLE: Orders Queries
// ============================================

export const orderKeys = {
  all: ["orders"] as const,
  lists: () => [...orderKeys.all, "list"] as const,
  list: (filters?: { status?: string; dateFrom?: string; dateTo?: string }) =>
    [...orderKeys.lists(), filters] as const,
  details: () => [...orderKeys.all, "detail"] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
};

export function useOrders(filters?: {
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}) {
  return useQuery({
    queryKey: orderKeys.list(filters),
    queryFn: async () => {
      // Example: const response = await api.getOrders(filters);
      // return response.data;
      return [] as Order[];
    },
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderData: Partial<Order>) => {
      // Example: return await api.createOrder(orderData);
      return {} as Order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
    },
  });
}

// ============================================
// USAGE EXAMPLES IN COMPONENTS
// ============================================

/*
// Example 1: Fetching data with a query
function ProductsPage() {
  const { data: products, isLoading, error } = useProducts({ category: "electronics" });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading products</div>;

  return (
    <div>
      {products?.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}

// Example 2: Creating data with a mutation
function CreateProductForm() {
  const createProduct = useCreateProduct();

  const handleSubmit = async (formData) => {
    try {
      await createProduct.mutateAsync(formData);
      // Success - cache is automatically updated
    } catch (error) {
      // Handle error
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <button disabled={createProduct.isPending}>
        {createProduct.isPending ? "Creating..." : "Create Product"}
      </button>
    </form>
  );
}

// Example 3: Optimistic updates
function useOptimisticUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Product> }) => {
      return await api.updateProduct(id, data);
    },
    // Optimistic update - update UI before server responds
    onMutate: async (variables) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: productKeys.detail(variables.id) });

      // Snapshot previous value
      const previousProduct = queryClient.getQueryData<Product>(
        productKeys.detail(variables.id)
      );

      // Optimistically update
      queryClient.setQueryData<Product>(productKeys.detail(variables.id), (old) => ({
        ...old!,
        ...variables.data,
      }));

      return { previousProduct };
    },
    // Rollback on error
    onError: (err, variables, context) => {
      if (context?.previousProduct) {
        queryClient.setQueryData(productKeys.detail(variables.id), context.previousProduct);
      }
    },
    // Refetch after error or success
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.id) });
    },
  });
}
*/
