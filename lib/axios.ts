import axios, { AxiosError } from "axios";
import { getAuthCookie, removeAuthCookie } from "./auth-cookie";
import type { ApiErrorResponse } from "@/types/auth";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "";

/**
 * In-memory token cache for client requests.
 * The persistent token is stored strictly in the HttpOnly cookie.
 */
let inMemoryToken: string | null = null;

export const setAccessTokenInMemory = (token: string | null) => {
  inMemoryToken = token;
};

export const getAccessTokenInMemory = (): string | null => {
  return inMemoryToken;
};

/**
 * Configured Axios instance.
 * `withCredentials: true` ensures HttpOnly cookies are passed.
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor: attach Authorization header from memory or HttpOnly cookie
apiClient.interceptors.request.use(async (config) => {
  // If not yet cached in memory, retrieve token from HttpOnly cookie via server action
  if (!inMemoryToken && typeof window !== "undefined") {
    try {
      const cookieToken = await getAuthCookie();
      if (cookieToken) {
        inMemoryToken = cookieToken;
      }
    } catch {
      // ignore server action errors
    }
  }

  if (inMemoryToken && config.headers) {
    config.headers.Authorization = `Bearer ${inMemoryToken}`;
  }

  return config;
});

// Response interceptor: handle 401 unauthorized & error formatting
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    if (typeof window !== "undefined") {
      const isAuthEndpoint =
        error.config?.url?.includes("/login") ||
        error.config?.url?.includes("/auth/login");

      // For protected routes, 401 indicates expired or missing session
      if (error.response?.status === 401 && !isAuthEndpoint) {
        inMemoryToken = null;
        try {
          await removeAuthCookie();
        } catch {
          // ignore error if network or server action fails
        }

        if (
          !window.location.pathname.startsWith("/login") &&
          !window.location.pathname.startsWith("/reset-password")
        ) {
          // eslint-disable-next-line @next/next/no-location-assign-relative-destination
          window.location.replace("/login");
        }
      }
    }

    return Promise.reject(error);
  }
);

/**
 * Helper to extract user-friendly error message from API error response
 */
export const getApiErrorMessage = (
  error: unknown,
  fallback: string = "Something went wrong"
): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiErrorResponse | undefined;
    return (
      data?.message ||
      data?.error ||
      error.message ||
      fallback
    );
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallback;
};

export default apiClient;
