"use server";

import { cookies } from "next/headers";

const AUTH_COOKIE_NAME = "token";
const AUTH_REFRESH_COOKIE_NAME = "refresh_token";

/**
 * Stores the authentication tokens in secure HttpOnly cookies.
 * This runs on the server, preventing client-side JavaScript access.
 */
export async function setAuthCookie(
  token: string,
  refreshToken?: string,
  maxAgeDays = 7
) {
  const cookieStore = await cookies();
  const isProduction = process.env.NODE_ENV === "production";

  cookieStore.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * maxAgeDays,
  });

  if (refreshToken) {
    cookieStore.set(AUTH_REFRESH_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
  }
}

/**
 * Reads the HttpOnly auth token cookie on the server.
 */
export async function getAuthCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIE_NAME)?.value;
}

/**
 * Reads the HttpOnly refresh token cookie on the server.
 */
export async function getRefreshTokenCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_REFRESH_COOKIE_NAME)?.value;
}

/**
 * Refreshes the access token using the stored HttpOnly refresh token.
 * Keeps tokens secure on the server, updates the cookies, and returns the new accessToken.
 */
export async function refreshAuthToken(
  endpoint: string = "/v1/admin/auth/refresh"
): Promise<{ success: boolean; accessToken?: string }> {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(AUTH_REFRESH_COOKIE_NAME)?.value;

  if (!refreshToken) {
    return { success: false };
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL;

  // Try the requested endpoint, then try the alternate endpoint if needed
  const endpoints = Array.from(
    new Set([
      endpoint,
      endpoint.includes("provider")
        ? "/v1/admin/auth/refresh"
        : "/v1/provider/auth/refresh",
    ])
  );

  for (const ep of endpoints) {
    try {
      const response = await fetch(`${baseUrl}${ep}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        const newAccessToken: string | undefined = data.accessToken;
        const newRefreshToken: string | undefined = data.refreshToken;

        if (newAccessToken) {
          const isProduction = process.env.NODE_ENV === "production";
          cookieStore.set(AUTH_COOKIE_NAME, newAccessToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
          });

          if (newRefreshToken) {
            cookieStore.set(AUTH_REFRESH_COOKIE_NAME, newRefreshToken, {
              httpOnly: true,
              secure: isProduction,
              sameSite: "lax",
              path: "/",
              maxAge: 60 * 60 * 24 * 30,
            });
          }

          return { success: true, accessToken: newAccessToken };
        }
      }
    } catch {
      // try next endpoint if any
    }
  }

  // All endpoints failed, session is invalid
  cookieStore.delete(AUTH_COOKIE_NAME);
  cookieStore.delete(AUTH_REFRESH_COOKIE_NAME);
  return { success: false };
}

/**
 * Clears the HttpOnly auth cookies on the server (e.g. on logout).
 */
export async function removeAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
  cookieStore.delete(AUTH_REFRESH_COOKIE_NAME);
}
