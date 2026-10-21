"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import apiClient from "@/lib/axios";
import type {
  AmbassadorCampaignItem,
  AmbassadorCampaignPerformanceItem,
  AmbassadorCampaignsParams,
  AmbassadorCampaignsResponse,
  AmbassadorDetail,
  AmbassadorListItem,
  AmbassadorsListParams,
  AmbassadorsListResponse,
  AmbassadorsSummary,
  AmbassadorUserAcquisitionData,
  AmbassadorUserItem,
  AmbassadorUsersParams,
  AmbassadorUsersResponse,
  CreateAmbassadorDto,
  UpdateAmbassadorDto,
} from "@/types/ambassadors";

export const AMBASSADORS_KEYS = {
  all: ["ambassadors"] as const,
  summary: () => [...AMBASSADORS_KEYS.all, "summary"] as const,
  list: (params?: AmbassadorsListParams) =>
    [...AMBASSADORS_KEYS.all, "list", params] as const,
  detail: (id: string) => [...AMBASSADORS_KEYS.all, "detail", id] as const,
  users: (id: string, params?: AmbassadorUsersParams) =>
    [...AMBASSADORS_KEYS.all, "users", id, params] as const,
  campaigns: (id: string, params?: AmbassadorCampaignsParams) =>
    [...AMBASSADORS_KEYS.all, "campaigns", id, params] as const,
  campaignPerformance: (id: string, params?: { from?: string; to?: string }) =>
    [...AMBASSADORS_KEYS.all, "campaign-performance", id, params] as const,
  userAcquisition: (id: string, year?: number) =>
    [...AMBASSADORS_KEYS.all, "user-acquisition", id, year] as const,
};

/**
 * Hook to fetch Ambassadors summary metrics
 * GET /v1/admin/ambassadors/summary
 */
export function useAmbassadorsSummary() {
  return useQuery({
    queryKey: AMBASSADORS_KEYS.summary(),
    queryFn: async (): Promise<AmbassadorsSummary> => {
      const response = await apiClient.get<AmbassadorsSummary>(
        "/v1/admin/ambassadors/summary"
      );
      return response.data;
    },
    staleTime: 60 * 1000,
    refetchOnWindowFocus: true,
  });
}

/**
 * Hook to fetch paginated ambassadors list with filters
 * GET /v1/admin/ambassadors
 */
export function useAmbassadorsList(params?: AmbassadorsListParams) {
  return useQuery({
    queryKey: AMBASSADORS_KEYS.list(params),
    queryFn: async (): Promise<AmbassadorsListResponse> => {
      const response = await apiClient.get<AmbassadorsListResponse>(
        "/v1/admin/ambassadors",
        { params }
      );
      return response.data;
    },
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
  });
}

/**
 * Hook to fetch single ambassador profile details
 * GET /v1/admin/ambassadors/{id}
 */
export function useAmbassadorDetail(id: string) {
  return useQuery({
    queryKey: AMBASSADORS_KEYS.detail(id),
    queryFn: async (): Promise<AmbassadorDetail> => {
      const response = await apiClient.get<AmbassadorDetail>(
        `/v1/admin/ambassadors/${id}`
      );
      return response.data;
    },
    enabled: Boolean(id),
    staleTime: 30 * 1000,
  });
}

/**
 * Hook to create/onboard a new ambassador
 * POST /v1/admin/ambassadors
 */
export function useCreateAmbassador() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      payload: CreateAmbassadorDto
    ): Promise<AmbassadorDetail> => {
      const response = await apiClient.post<AmbassadorDetail>(
        "/v1/admin/ambassadors",
        payload
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: AMBASSADORS_KEYS.all });
    },
  });
}

/**
 * Hook to update an ambassador profile
 * PATCH /v1/admin/ambassadors/{id}
 */
export function useUpdateAmbassador() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateAmbassadorDto;
    }): Promise<AmbassadorDetail> => {
      const response = await apiClient.patch<AmbassadorDetail>(
        `/v1/admin/ambassadors/${id}`,
        payload
      );
      return response.data;
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(AMBASSADORS_KEYS.detail(updated.id), updated);
      queryClient.invalidateQueries({ queryKey: AMBASSADORS_KEYS.all });
    },
  });
}

/**
 * Hook to suspend an ambassador
 * POST /v1/admin/ambassadors/{id}/suspend
 */
export function useSuspendAmbassador() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<AmbassadorDetail> => {
      const response = await apiClient.post<AmbassadorDetail>(
        `/v1/admin/ambassadors/${id}/suspend`,
        {}
      );
      return response.data;
    },
    onSuccess: (updated, id) => {
      if (updated && updated.id) {
        queryClient.setQueryData(AMBASSADORS_KEYS.detail(updated.id), updated);
      } else {
        queryClient.invalidateQueries({ queryKey: AMBASSADORS_KEYS.detail(id) });
      }
      queryClient.invalidateQueries({ queryKey: AMBASSADORS_KEYS.all });
    },
  });
}

/**
 * Hook to activate an ambassador
 * POST /v1/admin/ambassadors/{id}/activate
 */
export function useActivateAmbassador() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<AmbassadorDetail> => {
      const response = await apiClient.post<AmbassadorDetail>(
        `/v1/admin/ambassadors/${id}/activate`,
        {}
      );
      return response.data;
    },
    onSuccess: (updated, id) => {
      if (updated && updated.id) {
        queryClient.setQueryData(AMBASSADORS_KEYS.detail(updated.id), updated);
      } else {
        queryClient.invalidateQueries({ queryKey: AMBASSADORS_KEYS.detail(id) });
      }
      queryClient.invalidateQueries({ queryKey: AMBASSADORS_KEYS.all });
    },
  });
}

/**
 * Hook to deactivate an ambassador
 * POST /v1/admin/ambassadors/{id}/deactivate
 */
export function useDeactivateAmbassador() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<AmbassadorDetail> => {
      const response = await apiClient.post<AmbassadorDetail>(
        `/v1/admin/ambassadors/${id}/deactivate`,
        {}
      );
      return response.data;
    },
    onSuccess: (updated, id) => {
      if (updated && updated.id) {
        queryClient.setQueryData(AMBASSADORS_KEYS.detail(updated.id), updated);
      } else {
        queryClient.invalidateQueries({ queryKey: AMBASSADORS_KEYS.detail(id) });
      }
      queryClient.invalidateQueries({ queryKey: AMBASSADORS_KEYS.all });
    },
  });
}

/**
 * Hook to fetch users introduced by an ambassador
 * GET /v1/admin/ambassadors/{id}/users
 */
export function useAmbassadorUsers(
  id: string,
  params?: AmbassadorUsersParams
) {
  return useQuery({
    queryKey: AMBASSADORS_KEYS.users(id, params),
    queryFn: async (): Promise<AmbassadorUsersResponse> => {
      const response = await apiClient.get<AmbassadorUsersResponse>(
        `/v1/admin/ambassadors/${id}/users`,
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
 * Hook to fetch campaigns assigned to an ambassador
 * GET /v1/admin/ambassadors/{id}/campaigns
 */
export function useAmbassadorCampaigns(
  id: string,
  params?: AmbassadorCampaignsParams
) {
  return useQuery({
    queryKey: AMBASSADORS_KEYS.campaigns(id, params),
    queryFn: async (): Promise<AmbassadorCampaignsResponse> => {
      const response = await apiClient.get<AmbassadorCampaignsResponse>(
        `/v1/admin/ambassadors/${id}/campaigns`,
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
 * Hook to fetch campaign performance statistics for an ambassador
 * GET /v1/admin/ambassadors/{id}/campaign-performance
 */
export function useAmbassadorCampaignPerformance(
  id: string,
  params?: { from?: string; to?: string }
) {
  return useQuery({
    queryKey: AMBASSADORS_KEYS.campaignPerformance(id, params),
    queryFn: async (): Promise<AmbassadorCampaignPerformanceItem[]> => {
      const response = await apiClient.get<
        AmbassadorCampaignPerformanceItem[]
      >(`/v1/admin/ambassadors/${id}/campaign-performance`, { params });
      return response.data || [];
    },
    enabled: Boolean(id),
    staleTime: 30 * 1000,
  });
}

/**
 * Hook to fetch monthly user acquisition for an ambassador
 * GET /v1/admin/ambassadors/{id}/user-acquisition
 */
export function useAmbassadorUserAcquisition(
  id: string,
  year: number = new Date().getFullYear()
) {
  return useQuery({
    queryKey: AMBASSADORS_KEYS.userAcquisition(id, year),
    queryFn: async (): Promise<AmbassadorUserAcquisitionData> => {
      const response = await apiClient.get<AmbassadorUserAcquisitionData>(
        `/v1/admin/ambassadors/${id}/user-acquisition`,
        { params: { year } }
      );
      return response.data;
    },
    enabled: Boolean(id),
    staleTime: 30 * 1000,
  });
}

/**
 * Hook to upload ambassador photo to /v1/admin/uploads/ambassador-photo
 */
export function useUploadAmbassadorPhoto() {
  return useMutation({
    mutationFn: async (file: File): Promise<string> => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await apiClient.post<{ url?: string; photoUrl?: string }>(
        "/v1/admin/uploads/ambassador-photo",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const url = response.data?.photoUrl || response.data?.url || "";
      return url;
    },
  });
}
