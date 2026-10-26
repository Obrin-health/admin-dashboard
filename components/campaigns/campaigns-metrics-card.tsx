"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { useCampaignsSummary } from "@/hooks/use-campaigns";

export const CampaignsMetricsCard: React.FC = () => {
  const { data, isLoading } = useCampaignsSummary();

  const formatCount = (val?: number) => {
    if (val === undefined || val === null) return "0";
    if (val >= 1000000) {
      return `${(val / 1000000).toFixed(1).replace(/\.0$/, "")}M`;
    }
    if (val >= 1000) {
      return `${(val / 1000).toFixed(1).replace(/\.0$/, "")}k`;
    }
    return val.toLocaleString();
  };

  const formatPercent = (val?: number) => {
    if (val === undefined || val === null) return "0%";
    return `${Math.round(val)}%`;
  };

  const row1 = [
    {
      label: "Total Campaigns",
      value: formatCount(data?.totalCampaigns),
    },
    {
      label: "Completed Campaigns",
      value: formatCount(data?.completedCampaigns),
    },
    {
      label: "Active Campaigns",
      value: formatCount(data?.activeCampaigns),
    },
  ];

  const row2 = [
    {
      label: "Total Users Acquired",
      value: formatCount(data?.totalUsersAcquired),
    },
    {
      label: "Converted Users",
      value: formatCount(data?.convertedUsers),
    },
    {
      label: "Conversion Rate",
      value: formatPercent(data?.conversionRate),
    },
  ];

  return (
    <div className="w-full rounded-2xl border border-[#EAECF0] bg-white p-6 md:p-8 mb-6 shadow-xs relative">
      {isLoading && !data && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex items-center justify-center z-10 rounded-2xl">
          <Loader2 className="size-6 animate-spin text-[#BB1A8C]" />
        </div>
      )}

      {/* Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#EAECF0]">
        {row1.map((item, idx) => (
          <div
            key={item.label}
            className={`${
              idx === 0 ? "md:pr-8" : idx === 2 ? "md:pl-8" : "md:px-8"
            } py-3 md:py-0`}
          >
            <span className="text-[13px] font-normal text-[#667085]">
              {item.label}
            </span>
            <p className="font-general-sans text-[#101828] text-[32px] font-bold mt-2 tracking-tight">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Row 2 */}
      <div className="border-t border-[#EAECF0] mt-6 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#EAECF0]">
          {row2.map((item, idx) => (
            <div
              key={item.label}
              className={`${
                idx === 0 ? "md:pr-8" : idx === 2 ? "md:pl-8" : "md:px-8"
              } py-3 md:py-0`}
            >
              <span className="text-[13px] font-normal text-[#667085]">
                {item.label}
              </span>
              <p className="font-general-sans text-[#101828] text-[32px] font-bold mt-2 tracking-tight">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CampaignsMetricsCard;
