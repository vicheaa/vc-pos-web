/**
 * API Usage Examples
 *
 * This file demonstrates how to use the singleton API client pattern (similar to Dio)
 */

import { apiClient } from "./api-client";
import { AuthApiService, ProductApiService } from "./api-services";

// ==========================================
// Method 1: Using the existing API services
// ==========================================

import {
  authApi,
  productApi,
  categoryApi,
  uomApi,
  attachmentApi,
} from "./api-services";

// Example: Login
const loginExample = async () => {
  const response = await authApi.login("user@example.com", "password");
  console.log(response.token);
};

// Example: Get products
const getProductsExample = async () => {
  const products = await productApi.getProducts({
    page: 1,
    per_page: 20,
    search: "tiger",
  });
  console.log(products);
};

// Example: Upload attachment
const uploadExample = async () => {
  const file = new File(["content"], "image.jpg");
  const response = await attachmentApi.uploadAttachment(file, "product");
  console.log(response.data.file_path);
};

// ==========================================
// Method 2: Using the base apiClient directly
// ==========================================

// Example: Direct GET request
const directGetExample = async () => {
  const data = await apiClient.get("/custom-endpoint", {
    params: { id: 123 },
  });
  return data;
};

// Example: Direct POST request
const directPostExample = async () => {
  const data = await apiClient.post("/custom-endpoint", {
    name: "New Item",
    value: 100,
  });
  return data;
};

// Example: Request without authentication
const publicRequestExample = async () => {
  const data = await apiClient.get("/public-endpoint", {
    requiresAuth: false,
  });
  return data;
};

// ==========================================
// Method 3: Extending to create custom API services
// ==========================================

/**
 * Custom Order API Service
 * Extend this pattern to create new API services
 */
export class OrderApiService {
  /**
   * Get all orders
   */
  async getOrders(params?: { page?: number; status?: string }) {
    return apiClient.get("/orders", {
      params: {
        page: params?.page?.toString(),
        status: params?.status,
      },
    });
  }

  /**
   * Get order by ID
   */
  async getOrderById(orderId: string) {
    return apiClient.get(`/orders/${orderId}`);
  }

  /**
   * Create new order
   */
  async createOrder(orderData: {
    customer_id: number;
    items: Array<{ product_code: string; quantity: number }>;
  }) {
    return apiClient.post("/orders", orderData);
  }

  /**
   * Update order status
   */
  async updateOrderStatus(orderId: string, status: string) {
    return apiClient.patch(`/orders/${orderId}`, { status });
  }

  /**
   * Delete order
   */
  async deleteOrder(orderId: string) {
    return apiClient.delete(`/orders/${orderId}`);
  }
}

// Export singleton instance
export const orderApi = new OrderApiService();

// Usage:
// import { orderApi } from "@/lib/api-usage-example";
// const orders = await orderApi.getOrders({ page: 1 });

/**
 * Custom Customer API Service
 * Another example of extending the pattern
 */
export class CustomerApiService {
  async getCustomers() {
    return apiClient.get("/customers");
  }

  async getCustomerById(id: string) {
    return apiClient.get(`/customers/${id}`);
  }

  async createCustomer(customerData: {
    name: string;
    email: string;
    phone: string;
  }) {
    return apiClient.post("/customers", customerData);
  }
}

export const customerApi = new CustomerApiService();

// ==========================================
// Method 4: Backward compatibility
// ==========================================

// Old code continues to work:
import { api } from "./api";

const backwardCompatibleExample = async () => {
  // These still work exactly as before
  await api.login("email", "password");
  await api.getProducts({ page: 1 });
  await api.getCategories();
};
