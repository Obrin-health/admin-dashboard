"use client";

import React from "react";

interface ReferralMetricItem {
  label: string;
  value: string;
}

export const ReferralsMetricsCard: React.FC = () => {
  const topMetrics: ReferralMetricItem[] = [
    { label: "Total Referrals", value: "3.2k" },
    { label: "Active Referrals", value: "1.2k" },
    { label: "Redeemed Referrals", value: "200" },
  ];

  const bottomMetrics: ReferralMetricItem[] = [
    { label: "Converted Referrals", value: "3.2k" },
    { label: "Expired Referrals", value: "1.2k" },
    { label: "Redemption Rate", value: "200" },
  ];

  return (
    <div className="w-full rounded-2xl border border-[#EAECF0] bg-white p-6 md:p-8 mb-6 shadow-xs">
      {/* Top Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#EAECF0] pb-6 sm:pb-8">
        {topMetrics.map((item, idx) => (
          <div
            key={item.label}
            className={`flex flex-col ${
              idx === 0
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
            className={`flex flex-col ${
              idx === 0
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
