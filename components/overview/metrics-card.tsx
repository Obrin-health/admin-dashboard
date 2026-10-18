"use client";

import React from "react";
import { useOverviewSummary, formatMetricNumber } from "@/hooks/use-overview";

interface MetricItem {
  label: string;
  value: string;
}

export const MetricsCard: React.FC = () => {
  const { data: summary, isLoading } = useOverviewSummary();

  const row1: MetricItem[] = [
    {
      label: "Active users today",
      value: formatMetricNumber(summary?.activeUsersToday),
    },
    {
      label: "Active Users this week",
      value: formatMetricNumber(summary?.activeUsersThisWeek),
    },
    {
      label: "Churn Users",
      value: formatMetricNumber(summary?.churnedUsers),
    },
  ];

  const row2: MetricItem[] = [
    {
      label: "Total Users",
      value: formatMetricNumber(summary?.totalUsers),
    },
    {
      label: "Total Providers",
      value: formatMetricNumber(summary?.totalProviders),
    },
    {
      label: "Total Referrals",
      value: formatMetricNumber(summary?.totalReferrals),
    },
  ];

  const row3: MetricItem[] = [
    {
      label: "Total Campaigns",
      value: formatMetricNumber(summary?.totalCampaigns),
    },
    {
      label: "Total Ambassadors",
      value: formatMetricNumber(summary?.totalAmbassadors),
    },
    {
      label: "Total Admin Users",
      value: formatMetricNumber(summary?.totalAdminUsers),
    },
  ];

  const renderMetric = (item: MetricItem, idx: number) => (
    <div
      key={item.label}
      className={`${
        idx === 0 ? "md:pr-8" : idx === 2 ? "md:pl-8" : "md:px-8"
      } py-3 md:py-0`}
    >
      <span className="text-[13px] font-normal text-[#667085]">
        {item.label}
      </span>
      {isLoading ? (
        <div className="h-10 w-20 bg-gray-100 animate-pulse rounded-lg mt-2" />
      ) : (
        <p className="font-general-sans text-[#101828] text-[32px] font-bold mt-2 tracking-tight transition-all">
          {item.value}
        </p>
      )}
    </div>
  );

  return (
    <div className="w-full rounded-2xl border border-[#EAECF0] bg-white p-6 md:p-8 mb-6 shadow-xs">
      {/* Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#EAECF0]">
        {row1.map(renderMetric)}
      </div>

      {/* Row 2 */}
      <div className="border-t border-[#EAECF0] mt-6 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#EAECF0]">
          {row2.map(renderMetric)}
        </div>
      </div>

      {/* Row 3 */}
      <div className="border-t border-[#EAECF0] mt-6 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#EAECF0]">
          {row3.map(renderMetric)}
        </div>
      </div>
    </div>
  );
};

export default MetricsCard;
