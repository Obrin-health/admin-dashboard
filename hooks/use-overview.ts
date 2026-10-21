"use client";

import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/axios";
import type {
  ActiveUsersData,
  AgeDistributionData,
  CampaignTypesSummary,
  OverviewSummary,
  TopAmbassador,
  TopAmbassadorPeriod,
  UserAcquisitionData,
} from "@/types/overview";

export const OVERVIEW_KEYS = {
  all: ["overview"] as const,
  summary: () => [...OVERVIEW_KEYS.all, "summary"] as const,
  topAmbassadors: (period: TopAmbassadorPeriod) =>
    [...OVERVIEW_KEYS.all, "top-ambassadors", period] as const,
  campaignTypes: () => [...OVERVIEW_KEYS.all, "campaign-types"] as const,
  userAcquisition: (year: number | string) =>
    [...OVERVIEW_KEYS.all, "user-acquisition", String(year)] as const,
  activeUsers: () => [...OVERVIEW_KEYS.all, "active-users"] as const,
  ageDistribution: () => [...OVERVIEW_KEYS.all, "age-distribution"] as const,
};

/**
 * Hook to fetch the 9 core performance metrics for the overview dashboard
 */
export function useOverviewSummary() {
  return useQuery({
    queryKey: OVERVIEW_KEYS.summary(),
    queryFn: async (): Promise<OverviewSummary> => {
      const response = await apiClient.get<OverviewSummary>(
        "/v1/admin/overview/summary"
      );
      return response.data;
    },
    staleTime: 60 * 1000, // 1 minute cache
    refetchOnWindowFocus: true,
  });
}

/**
 * Hook to fetch top performing ambassadors by time period
 * Supported periods: "7d" | "30d" | "90d" | "all"
 */
export function useTopAmbassadors(period: TopAmbassadorPeriod = "7d") {
  return useQuery({
    queryKey: OVERVIEW_KEYS.topAmbassadors(period),
    queryFn: async (): Promise<TopAmbassador[]> => {
      const response = await apiClient.get<TopAmbassador[]>(
        "/v1/admin/overview/top-ambassadors",
        {
          params: { period },
        }
      );
      return response.data || [];
    },
    staleTime: 60 * 1000,
  });
}

/**
 * Hook to fetch campaign types ratio and accumulated user metrics
 */
export function useCampaignTypesSummary() {
  return useQuery({
    queryKey: OVERVIEW_KEYS.campaignTypes(),
    queryFn: async (): Promise<CampaignTypesSummary> => {
      const response = await apiClient.get<CampaignTypesSummary>(
        "/v1/admin/overview/campaign-types"
      );
      return response.data;
    },
    staleTime: 60 * 1000,
  });
}

/**
 * Hook to fetch monthly user acquisition statistics by year
 */
export function useUserAcquisition(
  year: number | string = new Date().getFullYear()
) {
  return useQuery({
    queryKey: OVERVIEW_KEYS.userAcquisition(year),
    queryFn: async (): Promise<UserAcquisitionData> => {
      const response = await apiClient.get<UserAcquisitionData>(
        "/v1/admin/overview/user-acquisition",
        {
          params: { year },
        }
      );
      return response.data;
    },
    staleTime: 60 * 1000,
  });
}

/**
 * Hook to fetch active users map points and top locations
 */
export function useActiveUsers() {
  return useQuery({
    queryKey: OVERVIEW_KEYS.activeUsers(),
    queryFn: async (): Promise<ActiveUsersData> => {
      const response = await apiClient.get<ActiveUsersData>(
        "/v1/admin/overview/active-users"
      );
      return response.data;
    },
    staleTime: 60 * 1000,
  });
}

/**
 * Hook to fetch user age distribution bands
 */
export function useAgeDistribution() {
  return useQuery({
    queryKey: OVERVIEW_KEYS.ageDistribution(),
    queryFn: async (): Promise<AgeDistributionData> => {
      const response = await apiClient.get<AgeDistributionData>(
        "/v1/admin/overview/age-distribution"
      );
      return response.data;
    },
    staleTime: 60 * 1000,
  });
}

/**
 * Format metric number into compact readable string (e.g. 1200 -> 1.2k, 0 -> 0)
 */
export function formatMetricNumber(value?: number): string {
  if (value === undefined || value === null) return "0";
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1).replace(/\.0$/, "")}k`;
  }
  return value.toLocaleString();
}
