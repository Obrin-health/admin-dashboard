"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import apiClient from "@/lib/axios";
import type {
  ProviderDetail,
  ProviderReferralsParams,
  ProviderReferralsResponse,
  ProviderUser,
  ProvidersListParams,
  ProvidersListResponse,
  ProvidersSummary,
} from "@/types/providers";

export const PROVIDERS_KEYS = {
  all: ["providers"] as const,
  summary: () => [...PROVIDERS_KEYS.all, "summary"] as const,
  list: (params?: ProvidersListParams) =>
    [...PROVIDERS_KEYS.all, "list", params] as const,
  detail: (id: string) => [...PROVIDERS_KEYS.all, "detail", id] as const,
  referrals: (id: string, params?: ProviderReferralsParams) =>
    [...PROVIDERS_KEYS.all, "referrals", id, params] as const,
  users: (id: string) => [...PROVIDERS_KEYS.all, "users", id] as const,
};

/**
 * Hook to fetch Providers summary metrics
 */
export function useProvidersSummary() {
  return useQuery({
    queryKey: PROVIDERS_KEYS.summary(),
    queryFn: async (): Promise<ProvidersSummary> => {
      const response = await apiClient.get<ProvidersSummary>(
        "/v1/admin/providers/summary"
      );
      return response.data;
    },
    staleTime: 60 * 1000,
    refetchOnWindowFocus: true,
  });
}

/**
 * Hook to fetch paginated providers list with search and filter parameters
 */
export function useProvidersList(params?: ProvidersListParams) {
  return useQuery({
    queryKey: PROVIDERS_KEYS.list(params),
    queryFn: async (): Promise<ProvidersListResponse> => {
      const response = await apiClient.get<ProvidersListResponse>(
        "/v1/admin/providers",
        { params }
      );
      return response.data;
    },
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
  });
}

/**
 * Hook to fetch single provider detail
 */
export function useProviderDetail(id: string) {
  return useQuery({
    queryKey: PROVIDERS_KEYS.detail(id),
    queryFn: async (): Promise<ProviderDetail> => {
      const response = await apiClient.get<ProviderDetail>(
        `/v1/admin/providers/${id}`
      );
      return response.data;
    },
    enabled: Boolean(id),
    staleTime: 30 * 1000,
  });
}

/**
 * Hook to fetch single provider's referrals
 */
export function useProviderReferrals(
  id: string,
  params?: ProviderReferralsParams
) {
  return useQuery({
    queryKey: PROVIDERS_KEYS.referrals(id, params),
    queryFn: async (): Promise<ProviderReferralsResponse> => {
      const response = await apiClient.get<ProviderReferralsResponse>(
        `/v1/admin/providers/${id}/referrals`,
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
 * Hook to fetch provider users (team/staff)
 */
export function useProviderUsers(id: string) {
  return useQuery({
    queryKey: PROVIDERS_KEYS.users(id),
    queryFn: async (): Promise<ProviderUser[]> => {
      const response = await apiClient.get<ProviderUser[]>(
        `/v1/admin/providers/${id}/users`
      );
      return response.data;
    },
    enabled: Boolean(id),
    staleTime: 30 * 1000,
  });
}

/**
 * Hook to suspend a provider
 */
export function useSuspendProvider() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<ProviderDetail> => {
      const response = await apiClient.post<ProviderDetail>(
        `/v1/admin/providers/${id}/suspend`
      );
      return response.data;
    },
    onSuccess: (updatedProvider) => {
      queryClient.setQueryData(
        PROVIDERS_KEYS.detail(updatedProvider.id),
        updatedProvider
      );
      queryClient.invalidateQueries({ queryKey: PROVIDERS_KEYS.all });
    },
  });
}

/**
 * Hook to activate a provider
 */
export function useActivateProvider() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<ProviderDetail> => {
      const response = await apiClient.post<ProviderDetail>(
        `/v1/admin/providers/${id}/activate`
      );
      return response.data;
    },
    onSuccess: (updatedProvider) => {
      queryClient.setQueryData(
        PROVIDERS_KEYS.detail(updatedProvider.id),
        updatedProvider
      );
      queryClient.invalidateQueries({ queryKey: PROVIDERS_KEYS.all });
    },
  });
}
