// Re-export ApiError and apiClient from api-client for backward compatibility
export { ApiError, apiClient } from "./api-client";

// Re-export API services
export {
  authApi,
  productApi,
  categoryApi,
  uomApi,
  attachmentApi,
  AuthApiService,
  ProductApiService,
  CategoryApiService,
  UOMApiService,
  AttachmentApiService,
} from "./api-services";

import type {
  Profile as ApiUser,
  LoginResponse,
  ProductsResponse,
  Category,
  UOM,
} from "@/types";

// The profile endpoint returns { success, message, data }
// where data matches the ApiUser (Data) type from src/types
export type UserResponse = ApiUser;

// Backward compatibility: Export api object with old interface
// This allows existing code to continue working without changes
import {
  authApi,
  productApi,
  categoryApi,
  uomApi,
  attachmentApi,
} from "./api-services";

export const api = {
  login: (email: string, password: string) => authApi.login(email, password),
  logout: () => authApi.logout(),
  getCurrentUser: () => authApi.getCurrentUser(),
  getProducts: (params?: {
    page?: number;
    per_page?: number;
    search?: string;
    category_code?: string;
  }) => productApi.getProducts(params),
  getCategories: () => categoryApi.getCategories(),
  getUOMs: () => uomApi.getUOMs(),
  uploadAttachment: (file: File, attachTo?: string) =>
    attachmentApi.uploadAttachment(file, attachTo),
  createProduct: (product: {
    code: string;
    name: string;
    name_kh: string;
    description: string;
    cost_price: number;
    selling_price: number;
    uom_id: number;
    category_code: string;
    thumbnail: string;
  }) => productApi.createProduct(product),
};
