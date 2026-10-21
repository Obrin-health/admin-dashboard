"use client";

import React from "react";
import { useProvidersSummary } from "@/hooks/use-providers";

export const ProvidersMetricsCard: React.FC = () => {
  const { data: summary, isLoading } = useProvidersSummary();

  const conversionPercentage = summary?.overallConversionRate != null
    ? `${(summary.overallConversionRate * 100).toFixed(1)}%`
    : "0%";

  const statsRow1 = [
    {
      label: "Total Providers",
      value: summary?.totalProviders != null ? summary.totalProviders.toLocaleString() : "0",
    },
    {
      label: "Active Providers",
      value: summary?.activeProviders != null ? summary.activeProviders.toLocaleString() : "0",
    },
    {
      label: "Suspended Providers",
      value: summary?.suspendedProviders != null ? summary.suspendedProviders.toLocaleString() : "0",
    },
  ];

  const statsRow2 = [
    {
      label: "Total Referrals Received",
      value: summary?.totalReferralsReceived != null ? summary.totalReferralsReceived.toLocaleString() : "0",
    },
    {
      label: "Total Redeemed Referrals",
      value: summary?.totalRedeemedReferrals != null ? summary.totalRedeemedReferrals.toLocaleString() : "0",
    },
    {
      label: "Overall Conversion Rate",
      value: conversionPercentage,
    },
  ];

  return (
    <div className="w-full flex flex-col rounded-[8px] border border-white bg-linear-to-b from-white via-white/95 to-white/75 backdrop-blur-2xl shadow-[0px_4px_24px_-1px_rgba(209,205,199,0.25)] px-8 py-6 mb-6">
      {/* Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
        {statsRow1.map((item, idx) => (
          <div
            key={item.label}
            className={`${
              idx === 0 ? "md:pr-8" : idx === 2 ? "md:pl-8" : "md:px-8"
            } py-2 md:py-0`}
          >
            <span className="text-[13px] font-normal text-[#667085]">
              {item.label}
            </span>
            {isLoading ? (
              <div className="h-9 w-20 bg-gray-200/80 rounded animate-pulse mt-2" />
            ) : (
              <p className="font-general-sans text-[#253B4B] text-[32px] font-semibold mt-2 tracking-tight">
                {item.value}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Divider & Row 2 with 30px gap */}
      <div className="border-t border-gray-100 mt-7.5 pt-7.5">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          {statsRow2.map((item, idx) => (
            <div
              key={item.label}
              className={`${
                idx === 0 ? "md:pr-8" : idx === 2 ? "md:pl-8" : "md:px-8"
              } py-2 md:py-0`}
            >
              <span className="text-[13px] font-normal text-[#667085]">
                {item.label}
              </span>
              {isLoading ? (
                <div className="h-9 w-20 bg-gray-200/80 rounded animate-pulse mt-2" />
              ) : (
                <p className="font-general-sans text-[#253B4B] text-[32px] font-semibold mt-2 tracking-tight">
                  {item.value}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProvidersMetricsCard;
