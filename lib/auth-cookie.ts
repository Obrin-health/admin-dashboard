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
 * Clears the HttpOnly auth cookies on the server (e.g. on logout).
 */
export async function removeAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
  cookieStore.delete(AUTH_REFRESH_COOKIE_NAME);
}
