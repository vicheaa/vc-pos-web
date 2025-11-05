import Cookies from "js-cookie";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

export interface RequestConfig extends RequestInit {
  params?: Record<string, string | number | boolean | null | undefined>;
  requiresAuth?: boolean;
}

/**
 * Base API Client singleton class (similar to Dio)
 * Can be extended to create specific API service classes
 */
export class ApiClient {
  private static instance: ApiClient;
  private baseURL: string;

  private constructor() {
    this.baseURL = API_BASE_URL || "";
  }

  /**
   * Get the singleton instance
   */
  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  /**
   * Set base URL
   */
  public setBaseURL(url: string): void {
    this.baseURL = url;
  }

  /**
   * Get base URL
   */
  public getBaseURL(): string {
    return this.baseURL;
  }

  /**
   * Get auth token from cookies
   */
  protected getToken(): string | undefined {
    return Cookies.get("auth_token");
  }

  /**
   * Build query string from params
   */
  private buildQueryString(
    params?: Record<string, string | number | boolean | null | undefined>
  ): string {
    if (!params) return "";

    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        queryParams.append(key, String(value));
      }
    });

    const queryString = queryParams.toString();
    return queryString ? `?${queryString}` : "";
  }

  /**
   * Build full URL with endpoint and query params
   */
  private buildURL(
    endpoint: string,
    params?: Record<string, string | number | boolean | null | undefined>
  ): string {
    const queryString = this.buildQueryString(params);
    const fullEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    return `${this.baseURL}${fullEndpoint}${queryString}`;
  }

  /**
   * Get default headers
   */
  private getDefaultHeaders(config?: RequestConfig): HeadersInit {
    const headers: Record<string, string> = {
      Accept: "application/json",
      ...(config?.headers as Record<string, string>),
    };

    // Only add Content-Type for non-FormData requests
    if (!(config?.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    // Add auth token if required
    const requiresAuth = config?.requiresAuth !== false; // Default to true
    if (requiresAuth) {
      const token = this.getToken();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    return headers as HeadersInit;
  }

  /**
   * Core request method
   */
  public async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<T> {
    const { params, requiresAuth, ...fetchConfig } = config;

    const url = this.buildURL(endpoint, params);
    const headers = this.getDefaultHeaders({ ...config, requiresAuth });

    const response = await fetch(url, {
      ...fetchConfig,
      headers,
    });

    if (!response.ok) {
      let errorMessage = "An error occurred";
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }
      throw new ApiError(response.status, errorMessage);
    }

    // Handle empty responses
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      return data;
    }

    // Return response as-is for non-JSON responses
    return response as unknown as T;
  }

  /**
   * GET request
   */
  public async get<T>(
    endpoint: string,
    config?: Omit<RequestConfig, "method" | "body">
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: "GET",
    });
  }

  /**
   * POST request
   */
  public async post<T>(
    endpoint: string,
    data?: any,
    config?: Omit<RequestConfig, "method" | "body">
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: "POST",
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
  }

  /**
   * PUT request
   */
  public async put<T>(
    endpoint: string,
    data?: any,
    config?: Omit<RequestConfig, "method" | "body">
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: "PUT",
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
  }

  /**
   * PATCH request
   */
  public async patch<T>(
    endpoint: string,
    data?: any,
    config?: Omit<RequestConfig, "method" | "body">
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: "PATCH",
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
  }

  /**
   * DELETE request
   */
  public async delete<T>(
    endpoint: string,
    config?: Omit<RequestConfig, "method" | "body">
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: "DELETE",
    });
  }
}

// Export singleton instance
export const apiClient = ApiClient.getInstance();
