"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { useReferralsSummary } from "@/hooks/use-referrals";

export const ReferralsMetricsCard: React.FC = () => {
  const { data, isLoading } = useReferralsSummary();

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

  const topMetrics = [
    { label: "Total Referrals", value: formatCount(data?.totalReferrals) },
    { label: "Active Referrals", value: formatCount(data?.activeReferrals) },
    { label: "Redeemed Referrals", value: formatCount(data?.redeemedReferrals) },
  ];

  const bottomMetrics = [
    { label: "Converted Referrals", value: formatCount(data?.convertedReferrals) },
    { label: "Expired Referrals", value: formatCount(data?.expiredReferrals) },
    {
      label: "Redemption Rate",
      value: `${data?.redemptionRate ?? 0}%`,
    },
  ];

  return (
    <div className="w-full rounded-2xl border border-[#EAECF0] bg-white p-6 md:p-8 mb-6 shadow-xs relative">
      {isLoading && !data && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex items-center justify-center z-10 rounded-2xl">
          <Loader2 className="size-6 animate-spin text-[#BB1A8C]" />
        </div>
      )}

      {/* Top Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#EAECF0] pb-6 sm:pb-8">
        {topMetrics.map((item, idx) => (
          <div
            key={item.label}
            className={`flex flex-col ${idx === 0
              ? "sm:pr-8 pb-4 sm:pb-0"
              : idx === 1
                ? "sm:px-8 py-4 sm:py-0"
                : "sm:pl-8 pt-4 sm:pt-0"
              }`}
          >
            <span className="text-[13px] md:text-[14px] text-[#475467] font-normal leading-tight">
              {item.label}
            </span>
            <p className="font-general-sans text-[#101828] text-[28px] md:text-[36px] font-bold tracking-tight mt-2.5 leading-none">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Horizontal Divider */}
      <div className="h-px w-full bg-[#EAECF0]" />

      {/* Bottom Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#EAECF0] pt-6 sm:pt-8">
        {bottomMetrics.map((item, idx) => (
          <div
            key={item.label}
            className={`flex flex-col ${idx === 0
              ? "sm:pr-8 pb-4 sm:pb-0"
              : idx === 1
                ? "sm:px-8 py-4 sm:py-0"
                : "sm:pl-8 pt-4 sm:pt-0"
              }`}
          >
            <span className="text-[13px] md:text-[14px] text-[#475467] font-normal leading-tight">
              {item.label}
            </span>
            <p className="font-general-sans text-[#101828] text-[28px] md:text-[36px] font-bold tracking-tight mt-2.5 leading-none">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReferralsMetricsCard;
