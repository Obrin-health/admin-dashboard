"use client";

import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import apiClient from "@/lib/axios";
import type {
  InviteTeamMemberDto,
  TeamListParams,
  TeamListResponse,
  TeamMemberItem,
  TeamRoleItem,
  TeamSummary,
  UpdateTeamMemberDto,
} from "@/types/team";

export const TEAM_KEYS = {
  all: ["team"] as const,
  summary: () => [...TEAM_KEYS.all, "summary"] as const,
  roles: () => [...TEAM_KEYS.all, "roles"] as const,
  list: (params?: TeamListParams) =>
    [...TEAM_KEYS.all, "list", params] as const,
  detail: (id: string) => [...TEAM_KEYS.all, "detail", id] as const,
};

/**
 * Hook to fetch team summary metrics
 * GET /v1/admin/team/summary
 */
export function useTeamSummary() {
  return useQuery({
    queryKey: TEAM_KEYS.summary(),
    queryFn: async (): Promise<TeamSummary> => {
      const response = await apiClient.get<TeamSummary>(
        "/v1/admin/team/summary"
      );
      return response.data;
    },
    staleTime: 60 * 1000,
    refetchOnWindowFocus: true,
  });
}

/**
 * Hook to fetch team roles
 * GET /v1/admin/team/roles
 */
export function useTeamRoles() {
  return useQuery({
    queryKey: TEAM_KEYS.roles(),
    queryFn: async (): Promise<TeamRoleItem[] | string[]> => {
      const response = await apiClient.get<TeamRoleItem[] | string[]>(
        "/v1/admin/team/roles"
      );
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch paginated team members list with filters
 * GET /v1/admin/team
 */
export function useTeamList(params?: TeamListParams) {
  return useQuery({
    queryKey: TEAM_KEYS.list(params),
    queryFn: async (): Promise<TeamListResponse> => {
      const response = await apiClient.get<TeamListResponse>(
        "/v1/admin/team",
        { params }
      );
      return response.data;
    },
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
  });
}

/**
 * Hook to fetch a single team member details
 * GET /v1/admin/team/{id}
 */
export function useTeamMember(id: string) {
  return useQuery({
    queryKey: TEAM_KEYS.detail(id),
    queryFn: async (): Promise<TeamMemberItem> => {
      const response = await apiClient.get<TeamMemberItem>(
        `/v1/admin/team/${id}`
      );
      return response.data;
    },
    enabled: Boolean(id),
    staleTime: 30 * 1000,
  });
}

/**
 * Hook to invite a new team member
 * POST /v1/admin/team
 */
export function useInviteTeamMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: InviteTeamMemberDto): Promise<TeamMemberItem> => {
      const response = await apiClient.post<TeamMemberItem>(
        "/v1/admin/team",
        payload
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEAM_KEYS.all });
    },
  });
}

/**
 * Hook to update a team member
 * PATCH /v1/admin/team/{id}
 */
export function useUpdateTeamMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateTeamMemberDto;
    }): Promise<TeamMemberItem> => {
      const response = await apiClient.patch<TeamMemberItem>(
        `/v1/admin/team/${id}`,
        payload
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: TEAM_KEYS.all });
      queryClient.invalidateQueries({
        queryKey: TEAM_KEYS.detail(variables.id),
      });
    },
  });
}

/**
 * Hook to delete a team member
 * DELETE /v1/admin/team/{id}
 */
export function useDeleteTeamMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      await apiClient.delete(`/v1/admin/team/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEAM_KEYS.all });
    },
  });
}

/**
 * Hook to disable a team member
 * POST /v1/admin/team/{id}/disable
 */
export function useDisableTeamMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string): Promise<TeamMemberItem> => {
      const response = await apiClient.post<TeamMemberItem>(
        `/v1/admin/team/${id}/disable`
      );
      return response.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: TEAM_KEYS.all });
      queryClient.invalidateQueries({ queryKey: TEAM_KEYS.detail(id) });
    },
  });
}

/**
 * Hook to enable a team member
 * POST /v1/admin/team/{id}/enable
 */
export function useEnableTeamMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string): Promise<TeamMemberItem> => {
      const response = await apiClient.post<TeamMemberItem>(
        `/v1/admin/team/${id}/enable`
      );
      return response.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: TEAM_KEYS.all });
      queryClient.invalidateQueries({ queryKey: TEAM_KEYS.detail(id) });
    },
  });
}

/**
 * Hook to resend invite to a team member
 * POST /v1/admin/team/{id}/resend-invite
 */
export function useResendInviteTeamMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string): Promise<{ success?: boolean; message?: string }> => {
      const response = await apiClient.post<{ success?: boolean; message?: string }>(
        `/v1/admin/team/${id}/resend-invite`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TEAM_KEYS.all });
    },
  });
}
