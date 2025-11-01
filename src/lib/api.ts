import Cookies from "js-cookie";
import type {
  Root as ProfileRoot,
  Profile as ApiUser,
  LoginResponse,
} from "@/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

// The profile endpoint returns { success, message, data }
// where data matches the ApiUser (Data) type from src/types
export type UserResponse = ApiUser;

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = Cookies.get("auth_token");

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...options.headers,
  };

  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
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

  const data = await response.json();
  return data;
}

export const api = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await request<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
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
  },

  logout: async (): Promise<void> => {
    try {
      await request("/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      // Remove token from cookie regardless of API response
      Cookies.remove("auth_token");
    }
  },

  getCurrentUser: async (): Promise<UserResponse> => {
    const resp = await request<ProfileRoot>("/auth/profile");
    return resp.data as ApiUser;
  },
};
