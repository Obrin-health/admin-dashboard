"use client";

import React from "react";
import { useAmbassadorsSummary } from "@/hooks/use-ambassadors";
import { formatMetricNumber } from "@/hooks/use-overview";

interface AmbassadorsMetricsCardProps {
  isEmpty?: boolean;
}

export const AmbassadorsMetricsCard: React.FC<AmbassadorsMetricsCardProps> = ({
  isEmpty = false,
}) => {
  const { data: summary, isLoading } = useAmbassadorsSummary();

  const totalAmbassadors = isEmpty
    ? "00"
    : summary
    ? formatMetricNumber(summary.totalAmbassadors ?? 0)
    : "0";

  const activeAmbassadors = isEmpty
    ? "00"
    : summary
    ? formatMetricNumber(summary.activeAmbassadors ?? 0)
    : "0";

  const usersIntroduced = isEmpty
    ? "00"
    : summary
    ? formatMetricNumber(summary.usersIntroduced ?? 0)
    : "0";

  const referralsGenerated = isEmpty
    ? "00"
    : summary
    ? formatMetricNumber(summary.referralsGenerated ?? 0)
    : "0";

  const redeemedReferrals = isEmpty
    ? "00"
    : summary
    ? formatMetricNumber(summary.redeemedReferrals ?? 0)
    : "0";

  const convertedUsers = isEmpty
    ? "00"
    : summary
    ? formatMetricNumber(summary.convertedUsers ?? 0)
    : "0";

  const row1 = [
    { label: "Total Ambassadors", value: totalAmbassadors },
    { label: "Active Ambassadors", value: activeAmbassadors },
    { label: "Users Introduced", value: usersIntroduced },
  ];

  const row2 = [
    { label: "Referrals Generated", value: referralsGenerated },
    { label: "Redeemed Referrals", value: redeemedReferrals },
    { label: "Converted Users", value: convertedUsers },
  ];

  return (
    <div className="w-full rounded-2xl border border-[#EAECF0] bg-white p-6 md:p-8 mb-6 shadow-xs">
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
            <p
              className={`font-general-sans text-[#101828] text-[32px] font-bold mt-2 tracking-tight ${
                isLoading ? "opacity-60 animate-pulse" : ""
              }`}
            >
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
              <p
                className={`font-general-sans text-[#101828] text-[32px] font-bold mt-2 tracking-tight ${
                  isLoading ? "opacity-60 animate-pulse" : ""
                }`}
              >
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AmbassadorsMetricsCard;
