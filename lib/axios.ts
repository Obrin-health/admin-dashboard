import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { getAuthCookie, refreshAuthToken, removeAuthCookie } from "./auth-cookie";
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
 * Queue for concurrent requests while a token refresh is in flight.
 */
interface RetryQueueItem {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}

let isRefreshing = false;
let failedQueue: RetryQueueItem[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((item) => {
    if (error) {
      item.reject(error);
    } else if (token) {
      item.resolve(token);
    }
  });
  failedQueue = [];
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

// Response interceptor: seamlessly refresh token on 401 and retry requests
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const url = originalRequest.url || "";
    const isAuthEndpoint =
      url.includes("/login") ||
      url.includes("/auth/login") ||
      url.includes("/auth/refresh") ||
      url.includes("/reset-password");

    // For protected routes, 401 indicates expired access token
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthEndpoint
    ) {
      if (isRefreshing) {
        // If a refresh is already in-flight, enqueue this request until resolved
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((newToken) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshResult = await refreshAuthToken();

        if (refreshResult.success && refreshResult.accessToken) {
          const newToken = refreshResult.accessToken;
          setAccessTokenInMemory(newToken);

          // Drain and retry all queued requests
          processQueue(null, newToken);

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }

          return apiClient(originalRequest);
        } else {
          throw new Error("Session expired, token refresh failed");
        }
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        setAccessTokenInMemory(null);

        if (typeof window !== "undefined") {
          try {
            await removeAuthCookie();
          } catch {
            // ignore cleanup failure
          }

          if (
            !window.location.pathname.startsWith("/login") &&
            !window.location.pathname.startsWith("/reset-password")
          ) {
            window.location.replace("/login");
          }
        }

        return Promise.reject(error);
      } finally {
        isRefreshing = false;
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
