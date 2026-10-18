"use client";

import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/axios";
import type {
  CampaignTypesSummary,
  OverviewSummary,
  TopAmbassador,
  TopAmbassadorPeriod,
} from "@/types/overview";

export const OVERVIEW_KEYS = {
  all: ["overview"] as const,
  summary: () => [...OVERVIEW_KEYS.all, "summary"] as const,
  topAmbassadors: (period: TopAmbassadorPeriod) =>
    [...OVERVIEW_KEYS.all, "top-ambassadors", period] as const,
  campaignTypes: () => [...OVERVIEW_KEYS.all, "campaign-types"] as const,
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
