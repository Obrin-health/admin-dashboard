"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import apiClient from "@/lib/axios";
import type {
  AddAmbassadorsDto,
  CampaignAmbassadorsResponse,
  CampaignItem,
  CampaignsListParams,
  CampaignsListResponse,
  CampaignSummary,
  CampaignTopAmbassadorItem,
  CampaignUserAcquisitionData,
  CampaignUsersParams,
  CampaignUsersResponse,
  CreateCampaignDto,
  UpdateCampaignDto,
} from "@/types/campaigns";

export const CAMPAIGNS_KEYS = {
  all: ["campaigns"] as const,
  summary: () => [...CAMPAIGNS_KEYS.all, "summary"] as const,
  list: (params?: CampaignsListParams) =>
    [...CAMPAIGNS_KEYS.all, "list", params] as const,
  detail: (id: string) => [...CAMPAIGNS_KEYS.all, "detail", id] as const,
  ambassadors: (id: string, params?: { page?: number; pageSize?: number }) =>
    [...CAMPAIGNS_KEYS.detail(id), "ambassadors", params] as const,
  users: (id: string, params?: CampaignUsersParams) =>
    [...CAMPAIGNS_KEYS.detail(id), "users", params] as const,
  userAcquisition: (id: string, year?: number) =>
    [...CAMPAIGNS_KEYS.detail(id), "user-acquisition", year] as const,
  topAmbassadors: (id: string, params?: { from?: string; to?: string }) =>
    [...CAMPAIGNS_KEYS.detail(id), "top-ambassadors", params] as const,
};

/**
 * Hook to fetch campaigns summary metrics
 * GET /v1/admin/campaigns/summary
 */
export function useCampaignsSummary() {
  return useQuery({
    queryKey: CAMPAIGNS_KEYS.summary(),
    queryFn: async (): Promise<CampaignSummary> => {
      const response = await apiClient.get<CampaignSummary>(
        "/v1/admin/campaigns/summary"
      );
      return response.data;
    },
    staleTime: 60 * 1000,
    refetchOnWindowFocus: true,
  });
}

/**
 * Hook to fetch paginated campaigns list with filters
 * GET /v1/admin/campaigns
 */
export function useCampaignsList(params?: CampaignsListParams) {
  return useQuery({
    queryKey: CAMPAIGNS_KEYS.list(params),
    queryFn: async (): Promise<CampaignsListResponse> => {
      const response = await apiClient.get<CampaignsListResponse>(
        "/v1/admin/campaigns",
        { params }
      );
      return response.data;
    },
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
  });
}

/**
 * Hook to fetch single campaign detail
 * GET /v1/admin/campaigns/{id}
 */
export function useCampaignDetail(id: string) {
  return useQuery({
    queryKey: CAMPAIGNS_KEYS.detail(id),
    queryFn: async (): Promise<CampaignItem> => {
      const response = await apiClient.get<CampaignItem>(
        `/v1/admin/campaigns/${id}`
      );
      return response.data;
    },
    enabled: Boolean(id),
    staleTime: 30 * 1000,
  });
}

/**
 * Hook to create a new campaign
 * POST /v1/admin/campaigns
 */
export function useCreateCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateCampaignDto): Promise<CampaignItem> => {
      const response = await apiClient.post<CampaignItem>(
        "/v1/admin/campaigns",
        payload
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CAMPAIGNS_KEYS.all });
    },
  });
}

/**
 * Hook to update a campaign
 * PATCH /v1/admin/campaigns/{id}
 */
export function useUpdateCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateCampaignDto;
    }): Promise<CampaignItem> => {
      const response = await apiClient.patch<CampaignItem>(
        `/v1/admin/campaigns/${id}`,
        payload
      );
      return response.data;
    },
    onSuccess: (updated) => {
      if (updated?.id) {
        queryClient.setQueryData(CAMPAIGNS_KEYS.detail(updated.id), updated);
      }
      queryClient.invalidateQueries({ queryKey: CAMPAIGNS_KEYS.all });
    },
  });
}

/**
 * Hook to delete a campaign
 * DELETE /v1/admin/campaigns/{id}
 */
export function useDeleteCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await apiClient.delete(`/v1/admin/campaigns/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CAMPAIGNS_KEYS.all });
    },
  });
}

/**
 * Hook to activate a campaign
 * POST /v1/admin/campaigns/{id}/activate
 */
export function useActivateCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<CampaignItem> => {
      const response = await apiClient.post<CampaignItem>(
        `/v1/admin/campaigns/${id}/activate`
      );
      return response.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: CAMPAIGNS_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: CAMPAIGNS_KEYS.all });
    },
  });
}

/**
 * Hook to pause a campaign
 * POST /v1/admin/campaigns/{id}/pause
 */
export function usePauseCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<CampaignItem> => {
      const response = await apiClient.post<CampaignItem>(
        `/v1/admin/campaigns/${id}/pause`
      );
      return response.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: CAMPAIGNS_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: CAMPAIGNS_KEYS.all });
    },
  });
}

/**
 * Hook to end a campaign
 * POST /v1/admin/campaigns/{id}/end
 */
export function useEndCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<CampaignItem> => {
      const response = await apiClient.post<CampaignItem>(
        `/v1/admin/campaigns/${id}/end`
      );
      return response.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: CAMPAIGNS_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: CAMPAIGNS_KEYS.all });
    },
  });
}

/**
 * Hook to cancel a campaign
 * POST /v1/admin/campaigns/{id}/cancel
 */
export function useCancelCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<CampaignItem> => {
      const response = await apiClient.post<CampaignItem>(
        `/v1/admin/campaigns/${id}/cancel`
      );
      return response.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: CAMPAIGNS_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: CAMPAIGNS_KEYS.all });
    },
  });
}

/**
 * Hook to fetch ambassadors assigned to a campaign
 * GET /v1/admin/campaigns/{id}/ambassadors
 */
export function useCampaignAmbassadors(
  id: string,
  params?: { page?: number; pageSize?: number }
) {
  return useQuery({
    queryKey: CAMPAIGNS_KEYS.ambassadors(id, params),
    queryFn: async (): Promise<CampaignAmbassadorsResponse> => {
      const response = await apiClient.get<CampaignAmbassadorsResponse>(
        `/v1/admin/campaigns/${id}/ambassadors`,
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
 * Hook to add ambassadors to a campaign
 * POST /v1/admin/campaigns/{id}/ambassadors
 */
export function useAddCampaignAmbassadors() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: AddAmbassadorsDto;
    }): Promise<unknown> => {
      const response = await apiClient.post(
        `/v1/admin/campaigns/${id}/ambassadors`,
        payload
      );
      return response.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: CAMPAIGNS_KEYS.ambassadors(id),
      });
      queryClient.invalidateQueries({ queryKey: CAMPAIGNS_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: CAMPAIGNS_KEYS.all });
    },
  });
}

/**
 * Hook to remove an ambassador from a campaign
 * DELETE /v1/admin/campaigns/{id}/ambassadors/{ambassadorId}
 */
export function useRemoveCampaignAmbassador() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ambassadorId,
    }: {
      id: string;
      ambassadorId: string;
    }): Promise<void> => {
      await apiClient.delete(
        `/v1/admin/campaigns/${id}/ambassadors/${ambassadorId}`
      );
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: CAMPAIGNS_KEYS.ambassadors(id),
      });
      queryClient.invalidateQueries({ queryKey: CAMPAIGNS_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: CAMPAIGNS_KEYS.all });
    },
  });
}

/**
 * Hook to fetch users acquired by a campaign
 * GET /v1/admin/campaigns/{id}/users
 */
export function useCampaignUsers(id: string, params?: CampaignUsersParams) {
  return useQuery({
    queryKey: CAMPAIGNS_KEYS.users(id, params),
    queryFn: async (): Promise<CampaignUsersResponse> => {
      const response = await apiClient.get<CampaignUsersResponse>(
        `/v1/admin/campaigns/${id}/users`,
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
 * Hook to fetch monthly user acquisition for a campaign
 * GET /v1/admin/campaigns/{id}/user-acquisition
 */
export function useCampaignUserAcquisition(
  id: string,
  year: number = new Date().getFullYear()
) {
  return useQuery({
    queryKey: CAMPAIGNS_KEYS.userAcquisition(id, year),
    queryFn: async (): Promise<CampaignUserAcquisitionData> => {
      const response = await apiClient.get<CampaignUserAcquisitionData>(
        `/v1/admin/campaigns/${id}/user-acquisition`,
        { params: { year } }
      );
      return response.data;
    },
    enabled: Boolean(id),
    staleTime: 30 * 1000,
  });
}

/**
 * Hook to fetch top ambassadors for a campaign
 * GET /v1/admin/campaigns/{id}/top-ambassadors
 */
export function useCampaignTopAmbassadors(
  id: string,
  params?: { from?: string; to?: string }
) {
  return useQuery({
    queryKey: CAMPAIGNS_KEYS.topAmbassadors(id, params),
    queryFn: async (): Promise<CampaignTopAmbassadorItem[]> => {
      const response = await apiClient.get<CampaignTopAmbassadorItem[]>(
        `/v1/admin/campaigns/${id}/top-ambassadors`,
        { params }
      );
      return response.data || [];
    },
    enabled: Boolean(id),
    staleTime: 30 * 1000,
  });
}

/**
 * Hook to upload campaign image to /v1/admin/uploads/campaign-image
 */
export function useUploadCampaignImage() {
  return useMutation({
    mutationFn: async (file: File): Promise<string> => {
      const formData = new FormData();
      formData.append("file", file);
      const response = await apiClient.post<{ url: string } | string>(
        "/v1/admin/uploads/campaign-image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (typeof response.data === "string") {
        return response.data;
      }
      return response.data.url;
    },
  });
}
