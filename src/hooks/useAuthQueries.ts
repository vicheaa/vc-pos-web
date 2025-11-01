"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, ApiError } from "@/lib/api";
import Cookies from "js-cookie";
import type { Profile, LoginResponse } from "@/types";

// Query keys for React Query cache
export const authKeys = {
  all: ["auth"] as const,
  currentUser: () => [...authKeys.all, "currentUser"] as const,
};

/**
 * Hook to get the current authenticated user
 * Automatically refetches when token changes
 */
export function useCurrentUser() {
  const token = Cookies.get("auth_token");

  return useQuery({
    queryKey: authKeys.currentUser(),
    queryFn: async () => {
      const userData = await api.getCurrentUser();
      return {
        id: userData.id,
        name: userData.name,
        email: userData.email,
      } as Profile;
    },
    enabled: !!token, // Only run query if token exists
    retry: (failureCount, error) => {
      // Don't retry on authentication errors
      if (error instanceof ApiError && error.status === 401) {
        return false;
      }
      return failureCount < 1;
    },
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
  });
}

/**
 * Hook to login a user
 */
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      return await api.login(email, password);
    },
    onSuccess: async (data: LoginResponse) => {
      // After successful login, invalidate and refetch user data
      await queryClient.invalidateQueries({ queryKey: authKeys.currentUser() });
      // Optionally refetch immediately
      await queryClient.refetchQueries({ queryKey: authKeys.currentUser() });
    },
    onError: (error) => {
      // Error is already thrown from the mutation, but you can handle it here too
      if (error instanceof ApiError && error.status === 401) {
        // Handle invalid credentials
        Cookies.remove("auth_token");
      }
    },
  });
}

/**
 * Hook to logout a user
 */
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return await api.logout();
    },
    onSuccess: () => {
      // Clear all auth-related queries from cache
      queryClient.removeQueries({ queryKey: authKeys.all });
      // Clear user data
      queryClient.setQueryData(authKeys.currentUser(), null);
    },
    onError: () => {
      // Even if logout API fails, clear local state
      queryClient.removeQueries({ queryKey: authKeys.all });
      queryClient.setQueryData(authKeys.currentUser(), null);
    },
  });
}
