"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import apiClient from "@/lib/axios";
import type {
  UserDetail,
  UserReferralsParams,
  UserReferralsResponse,
  UsersListParams,
  UsersListResponse,
  UsersSummary,
} from "@/types/users";

export const USERS_KEYS = {
  all: ["users"] as const,
  summary: () => [...USERS_KEYS.all, "summary"] as const,
  list: (params?: UsersListParams) =>
    [...USERS_KEYS.all, "list", params] as const,
  detail: (id: string) => [...USERS_KEYS.all, "detail", id] as const,
  referrals: (id: string, params?: UserReferralsParams) =>
    [...USERS_KEYS.all, "referrals", id, params] as const,
};

/**
 * Hook to fetch the 6 core user metrics for the Users tab
 */
export function useUsersSummary() {
  return useQuery({
    queryKey: USERS_KEYS.summary(),
    queryFn: async (): Promise<UsersSummary> => {
      const response = await apiClient.get<UsersSummary>(
        "/v1/admin/users/summary"
      );
      return response.data;
    },
    staleTime: 60 * 1000,
    refetchOnWindowFocus: true,
  });
}

/**
 * Hook to fetch paginated users list with search and filter parameters
 */
export function useUsersList(params?: UsersListParams) {
  return useQuery({
    queryKey: USERS_KEYS.list(params),
    queryFn: async (): Promise<UsersListResponse> => {
      const response = await apiClient.get<UsersListResponse>(
        "/v1/admin/users",
        { params }
      );
      return response.data;
    },
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
  });
}

/**
 * Hook to fetch a single user's detailed information
 */
export function useUserDetail(id: string) {
  return useQuery({
    queryKey: USERS_KEYS.detail(id),
    queryFn: async (): Promise<UserDetail> => {
      const response = await apiClient.get<UserDetail>(
        `/v1/admin/users/${id}`
      );
      return response.data;
    },
    enabled: Boolean(id),
    staleTime: 30 * 1000,
  });
}

/**
 * Hook to fetch a user's paginated referrals
 */
export function useUserReferrals(id: string, params?: UserReferralsParams) {
  return useQuery({
    queryKey: USERS_KEYS.referrals(id, params),
    queryFn: async (): Promise<UserReferralsResponse> => {
      const response = await apiClient.get<UserReferralsResponse>(
        `/v1/admin/users/${id}/referrals`,
        { params }
      );
      return response.data;
    },
    enabled: Boolean(id),
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
  });
}

/**
 * Hook to suspend a user
 */
export function useSuspendUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<UserDetail> => {
      const response = await apiClient.post<UserDetail>(
        `/v1/admin/users/${id}/suspend`
      );
      return response.data;
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(USERS_KEYS.detail(updatedUser.id), updatedUser);
      queryClient.invalidateQueries({ queryKey: USERS_KEYS.all });
    },
  });
}

/**
 * Hook to activate a suspended user
 */
export function useActivateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<UserDetail> => {
      const response = await apiClient.post<UserDetail>(
        `/v1/admin/users/${id}/activate`
      );
      return response.data;
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(USERS_KEYS.detail(updatedUser.id), updatedUser);
      queryClient.invalidateQueries({ queryKey: USERS_KEYS.all });
    },
  });
}
