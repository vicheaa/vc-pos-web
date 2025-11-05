import { apiClient } from "./api-client";
import type {
  LoginResponse,
  ProductsResponse,
  Category,
  UOM,
  Root as ProfileRoot,
  Profile as ApiUser,
} from "@/types";
import Cookies from "js-cookie";

/**
 * Auth API Service
 * Extends the base API client for authentication-related endpoints
 */
export class AuthApiService {
  /**
   * Login user
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>("/auth/login", {
      email,
      password,
    });

    // Store token in cookie
    if (response.token) {
      Cookies.set("auth_token", response.token, {
        expires: 7,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
    }

    return response;
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post("/auth/logout");
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      // Remove token from cookie regardless of API response
      Cookies.remove("auth_token");
    }
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<ApiUser> {
    const resp = await apiClient.get<ProfileRoot>("/auth/profile");
    return resp.data as ApiUser;
  }
}

/**
 * Product API Service
 * Extends the base API client for product-related endpoints
 */
export class ProductApiService {
  /**
   * Get products with pagination and filters
   */
  async getProducts(params?: {
    page?: number;
    per_page?: number;
    search?: string;
    category_code?: string;
  }): Promise<ProductsResponse> {
    return apiClient.get<ProductsResponse>("/product", {
      params: {
        page: params?.page?.toString(),
        per_page: params?.per_page?.toString(),
        search: params?.search,
        category_code: params?.category_code,
      },
    });
  }

  /**
   * Create a new product
   */
  async createProduct(product: {
    code: string;
    name: string;
    name_kh: string;
    description: string;
    cost_price: number;
    selling_price: number;
    uom_id: number;
    category_code: string;
    thumbnail: string;
  }): Promise<{
    success: boolean;
    message: string;
    data: any;
  }> {
    return apiClient.post<{
      success: boolean;
      message: string;
      data: any;
    }>("/product", product);
  }

  /**
   * Update a product (example for future use)
   */
  async updateProduct(
    productCode: string,
    product: Partial<{
      name: string;
      name_kh: string;
      description: string;
      cost_price: number;
      selling_price: number;
      uom_id: number;
      category_code: string;
      thumbnail: string;
    }>
  ): Promise<{
    success: boolean;
    message: string;
    data: any;
  }> {
    return apiClient.put<{
      success: boolean;
      message: string;
      data: any;
    }>(`/product/${productCode}`, product);
  }

  /**
   * Delete a product (example for future use)
   */
  async deleteProduct(productCode: string): Promise<{
    success: boolean;
    message: string;
  }> {
    return apiClient.delete<{
      success: boolean;
      message: string;
    }>(`/product/${productCode}`);
  }
}

/**
 * Category API Service
 */
export class CategoryApiService {
  /**
   * Get all categories
   */
  async getCategories(): Promise<Category[]> {
    return apiClient.get<Category[]>("/categories");
  }
}

/**
 * UOM API Service
 */
export class UOMApiService {
  /**
   * Get all units of measure
   */
  async getUOMs(): Promise<UOM[]> {
    return apiClient.get<UOM[]>("/uom");
  }
}

/**
 * Attachment API Service
 */
export class AttachmentApiService {
  /**
   * Upload an attachment file
   */
  async uploadAttachment(
    file: File,
    attachTo: string = "product"
  ): Promise<{
    success: boolean;
    message: string;
    data: {
      id: number;
      original_name: string;
      file_name: string;
      file_path: string;
      file_type: string;
      file_size: number;
      url: string;
      folder: string;
      created_at: string;
      updated_at: string;
    };
  }> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("attach_to", attachTo);

    return apiClient.post<{
      success: boolean;
      message: string;
      data: {
        id: number;
        original_name: string;
        file_name: string;
        file_path: string;
        file_type: string;
        file_size: number;
        url: string;
        folder: string;
        created_at: string;
        updated_at: string;
      };
    }>("/attachments/upload", formData, {
      requiresAuth: true,
    });
  }
}

// Export singleton instances
export const authApi = new AuthApiService();
export const productApi = new ProductApiService();
export const categoryApi = new CategoryApiService();
export const uomApi = new UOMApiService();
export const attachmentApi = new AttachmentApiService();
