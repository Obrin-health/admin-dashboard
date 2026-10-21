"use client";

import React from "react";
import { useUsersSummary } from "@/hooks/use-users";

function formatValue(val?: number): string {
  if (val === undefined || val === null) return "0";
  if (val >= 1_000_000) {
    return `${(val / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  }
  if (val >= 10_000) {
    return `${(val / 1_000).toFixed(1).replace(/\.0$/, "")}k`;
  }
  return val.toLocaleString();
}

export const UsersMetricsCard: React.FC = () => {
  const { data, isLoading } = useUsersSummary();

  const row1 = [
    { label: "Total Users", value: formatValue(data?.totalUsers) },
    { label: "Active Users", value: formatValue(data?.activeUsers) },
    { label: "New Users", value: formatValue(data?.newUsers) },
  ];

  const row2 = [
    { label: "With Referrals", value: formatValue(data?.usersWithReferrals) },
    { label: "Redeemed Referrals", value: formatValue(data?.redeemedReferrals) },
    { label: "Converted Users", value: formatValue(data?.convertedUsers) },
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
            {isLoading ? (
              <div className="h-9 w-24 bg-gray-100 animate-pulse rounded-md mt-2" />
            ) : (
              <p className="font-general-sans text-[#101828] text-[32px] font-bold mt-2 tracking-tight">
                {item.value}
              </p>
            )}
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
              {isLoading ? (
                <div className="h-9 w-24 bg-gray-100 animate-pulse rounded-md mt-2" />
              ) : (
                <p className="font-general-sans text-[#101828] text-[32px] font-bold mt-2 tracking-tight">
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

export default UsersMetricsCard;
