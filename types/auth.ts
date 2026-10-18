export const AUTH_COOKIE_NAME = "token";
export const AUTH_REFRESH_COOKIE_NAME = "refresh_token";

export interface AuthRole {
  id: string;
  name: string;
  label: string;
}

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  avatarUrl: string | null;
  status: string;
  role: AuthRole;
  permissions: string[];
  [key: string]: unknown;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  accessTokenExpiresIn: number;
  refreshToken: string;
  account: AuthUser;
  [key: string]: unknown;
}

export interface ResetPasswordPayload {
  email: string;
  token?: string;
  password?: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ApiErrorResponse {
  statusCode: number;
  code?: string;
  message: string;
  error?: string;
  errors?: Record<string, string[]>;
  [key: string]: unknown;
}
