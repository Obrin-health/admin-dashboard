"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import apiClient from "@/lib/axios";
import type {
  AdminCreateReferralDto,
  CancelReferralDto,
  RedeemReferralDto,
  ReferralItem,
  ReferralsListParams,
  ReferralsListResponse,
  ReferralsSummary,
} from "@/types/referrals";

export const REFERRALS_KEYS = {
  all: ["referrals"] as const,
  summary: (params?: { from?: string; to?: string }) =>
    [...REFERRALS_KEYS.all, "summary", params] as const,
  list: (params?: ReferralsListParams) =>
    [...REFERRALS_KEYS.all, "list", params] as const,
  detail: (id: string) => [...REFERRALS_KEYS.all, "detail", id] as const,
};

/**
 * Hook to fetch referrals summary metrics
 * GET /v1/admin/referrals/summary
 */
export function useReferralsSummary(params?: { from?: string; to?: string }) {
  return useQuery({
    queryKey: REFERRALS_KEYS.summary(params),
    queryFn: async (): Promise<ReferralsSummary> => {
      const response = await apiClient.get<ReferralsSummary>(
        "/v1/admin/referrals/summary",
        { params }
      );
      return response.data;
    },
    staleTime: 60 * 1000,
    refetchOnWindowFocus: true,
  });
}

/**
 * Hook to fetch paginated referrals list with filters
 * GET /v1/admin/referrals
 */
export function useReferralsList(params?: ReferralsListParams) {
  return useQuery({
    queryKey: REFERRALS_KEYS.list(params),
    queryFn: async (): Promise<ReferralsListResponse> => {
      const response = await apiClient.get<ReferralsListResponse>(
        "/v1/admin/referrals",
        { params }
      );
      return response.data;
    },
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
  });
}

/**
 * Hook to fetch single referral detail
 * GET /v1/admin/referrals/{id}
 */
export function useReferralDetail(id: string) {
  return useQuery({
    queryKey: REFERRALS_KEYS.detail(id),
    queryFn: async (): Promise<ReferralItem> => {
      const response = await apiClient.get<ReferralItem>(
        `/v1/admin/referrals/${id}`
      );
      return response.data;
    },
    enabled: Boolean(id),
    staleTime: 30 * 1000,
  });
}

/**
 * Hook to create a referral as admin
 * POST /v1/admin/referrals
 */
export function useCreateReferral() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: AdminCreateReferralDto): Promise<ReferralItem> => {
      const response = await apiClient.post<ReferralItem>(
        "/v1/admin/referrals",
        payload
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: REFERRALS_KEYS.all });
    },
  });
}

/**
 * Hook to redeem a referral code
 * POST /v1/admin/referrals/redeem
 */
export function useRedeemReferral() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: RedeemReferralDto): Promise<ReferralItem> => {
      const response = await apiClient.post<ReferralItem>(
        "/v1/admin/referrals/redeem",
        payload
      );
      return response.data;
    },
    onSuccess: (updated) => {
      if (updated?.id) {
        queryClient.setQueryData(REFERRALS_KEYS.detail(updated.id), updated);
      }
      queryClient.invalidateQueries({ queryKey: REFERRALS_KEYS.all });
    },
  });
}

/**
 * Hook to cancel a referral
 * POST /v1/admin/referrals/{id}/cancel
 */
export function useCancelReferral() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload?: CancelReferralDto;
    }): Promise<ReferralItem> => {
      const response = await apiClient.post<ReferralItem>(
        `/v1/admin/referrals/${id}/cancel`,
        payload || {}
      );
      return response.data;
    },
    onSuccess: (updated, { id }) => {
      if (updated?.id) {
        queryClient.setQueryData(REFERRALS_KEYS.detail(id), updated);
      }
      queryClient.invalidateQueries({ queryKey: REFERRALS_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: REFERRALS_KEYS.all });
    },
  });
}
