"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/axios";
import { AUTH_KEYS } from "@/hooks/use-auth";
import type {
  AdminProfile,
  ChangePasswordDto,
  CreateServiceCategoryDto,
  ServiceCategoryItem,
  SystemSettingItem,
  UpdateProfileDto,
  UpdateServiceCategoryDto,
  UpdateSettingDto,
} from "@/types/settings";

export const SETTINGS_KEYS = {
  all: ["settings"] as const,
  profile: () => [...SETTINGS_KEYS.all, "profile"] as const,
  system: () => [...SETTINGS_KEYS.all, "system"] as const,
  serviceCategories: () =>
    [...SETTINGS_KEYS.all, "service-categories"] as const,
};

/**
 * Hook to fetch current admin profile
 * GET /v1/admin/profile
 */
export function useAdminProfile() {
  return useQuery({
    queryKey: SETTINGS_KEYS.profile(),
    queryFn: async (): Promise<AdminProfile> => {
      const response = await apiClient.get<AdminProfile>("/v1/admin/profile");
      return response.data;
    },
    staleTime: 60 * 1000,
    refetchOnWindowFocus: true,
  });
}

/**
 * Hook to update admin profile
 * PATCH /v1/admin/profile
 */
export function useUpdateAdminProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UpdateProfileDto): Promise<AdminProfile> => {
      const response = await apiClient.patch<AdminProfile>(
        "/v1/admin/profile",
        payload
      );
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(SETTINGS_KEYS.profile(), data);
      queryClient.invalidateQueries({ queryKey: AUTH_KEYS.all });
    },
  });
}

/**
 * Hook to upload profile avatar
 * POST /v1/admin/profile/avatar
 */
export function useUploadAvatar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (file: File): Promise<{ avatarUrl: string } | AdminProfile> => {
      const formData = new FormData();
      formData.append("file", file);
      const response = await apiClient.post<
        { avatarUrl: string } | AdminProfile
      >("/v1/admin/profile/avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_KEYS.profile() });
      queryClient.invalidateQueries({ queryKey: AUTH_KEYS.all });
    },
  });
}

/**
 * Hook to change account password
 * POST /v1/admin/auth/change-password
 */
export function useChangePassword() {
  return useMutation({
    mutationFn: async (payload: ChangePasswordDto): Promise<void> => {
      await apiClient.post("/v1/admin/auth/change-password", payload);
    },
  });
}

/**
 * Hook to fetch system settings
 * GET /v1/admin/settings
 */
export function useSystemSettings() {
  return useQuery({
    queryKey: SETTINGS_KEYS.system(),
    queryFn: async (): Promise<SystemSettingItem[]> => {
      const response = await apiClient.get<SystemSettingItem[]>(
        "/v1/admin/settings"
      );
      return response.data;
    },
    staleTime: 60 * 1000,
  });
}

/**
 * Hook to update a single system setting
 * PUT /v1/admin/settings/{key}
 */
export function useUpdateSystemSetting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      key,
      payload,
    }: {
      key: string;
      payload: UpdateSettingDto;
    }): Promise<SystemSettingItem> => {
      const response = await apiClient.put<SystemSettingItem>(
        `/v1/admin/settings/${encodeURIComponent(key)}`,
        payload
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_KEYS.system() });
    },
  });
}

/**
 * Hook to fetch service categories
 * GET /v1/admin/service-categories
 */
export function useServiceCategories() {
  return useQuery({
    queryKey: SETTINGS_KEYS.serviceCategories(),
    queryFn: async (): Promise<ServiceCategoryItem[]> => {
      const response = await apiClient.get<ServiceCategoryItem[]>(
        "/v1/admin/service-categories"
      );
      return response.data;
    },
    staleTime: 60 * 1000,
  });
}

/**
 * Hook to create a service category
 * POST /v1/admin/service-categories
 */
export function useCreateServiceCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (
      payload: CreateServiceCategoryDto
    ): Promise<ServiceCategoryItem> => {
      const response = await apiClient.post<ServiceCategoryItem>(
        "/v1/admin/service-categories",
        payload
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: SETTINGS_KEYS.serviceCategories(),
      });
    },
  });
}

/**
 * Hook to update a service category
 * PATCH /v1/admin/service-categories/{id}
 */
export function useUpdateServiceCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateServiceCategoryDto;
    }): Promise<ServiceCategoryItem> => {
      const response = await apiClient.patch<ServiceCategoryItem>(
        `/v1/admin/service-categories/${id}`,
        payload
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: SETTINGS_KEYS.serviceCategories(),
      });
    },
  });
}
