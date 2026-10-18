"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import apiClient, { setAccessTokenInMemory } from "@/lib/axios";
import { setAuthCookie, removeAuthCookie } from "@/lib/auth-cookie";
import type {
  AuthUser,
  LoginCredentials,
  LoginResponse,
  ResetPasswordPayload,
} from "@/types/auth";

export const AUTH_KEYS = {
  all: ["auth"] as const,
  user: () => [...AUTH_KEYS.all, "user"] as const,
};

/**
 * Hook to fetch the currently authenticated user directly via TanStack Query.
 * Cached across all components without needing a separate state store.
 */
export function useCurrentUser(enabled = true) {
  return useQuery({
    queryKey: AUTH_KEYS.user(),
    queryFn: async (): Promise<AuthUser | null> => {
      try {
        const response = await apiClient.get<AuthUser>("/v1/admin/auth/me");
        return response.data;
      } catch {
        return null;
      }
    },
    enabled,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Convenient helper to check authentication status directly from TanStack Query
 */
export function useIsAuthenticated() {
  const { data: user, isLoading, isError } = useCurrentUser();
  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    isError,
  };
}

/**
 * Hook for user login mutation.
 * Stores token in HttpOnly cookie, primes TanStack Query user cache, and navigates.
 */
export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await apiClient.post<LoginResponse>(
        "/v1/admin/auth/login",
        credentials
      );
      const data = response.data;
      const token = data.accessToken;
      const refreshToken = data.refreshToken;
      const user = data.account;

      // Cache token in memory for client requests and persist in HttpOnly cookie
      if (token) {
        setAccessTokenInMemory(token);
        await setAuthCookie(token, refreshToken);
      }

      // Prime query cache immediately with user account
      if (user) {
        queryClient.setQueryData(AUTH_KEYS.user(), user);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AUTH_KEYS.user() });
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const from = params.get("from");
        router.push(from || "/");
      } else {
        router.push("/");
      }
    },
  });
}

/**
 * Hook for user logout mutation.
 * Removes HttpOnly cookie, clears memory token and query cache, and redirects to /login.
 */
export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      try {
        await apiClient.post("/v1/admin/auth/logout");
      } catch {
        // Continue logout even if server endpoint fails
      }
      setAccessTokenInMemory(null);
      await removeAuthCookie();
    },
    onSuccess: () => {
      queryClient.setQueryData(AUTH_KEYS.user(), null);
      queryClient.clear();
      router.push("/login");
    },
  });
}

/**
 * Hook for password reset / recovery request
 */
export function useResetPassword() {
  return useMutation({
    mutationFn: async (payload: ResetPasswordPayload) => {
      const response = await apiClient.post("/v1/admin/auth/reset-password", payload);
      return response.data;
    },
  });
}

export type {
  AuthUser,
  LoginCredentials,
  LoginResponse,
  ResetPasswordPayload,
};
