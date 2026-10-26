"use client";

import React from "react";

interface TeamMetricsCardProps {
  totalMembers?: number;
  activeMembers?: number;
  disabledMembers?: number;
  isLoading?: boolean;
}

export default function TeamMetricsCard({
  totalMembers,
  activeMembers,
  disabledMembers,
  isLoading = false,
}: TeamMetricsCardProps) {
  const formatNumber = (num?: number) => {
    if (num === undefined || num === null) return "-";
    return num < 10 && num >= 0 ? `0${num}` : `${num}`;
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-[#EAECF0] p-6 mb-8 shadow-2xs font-sans">
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#EAECF0]">
        {/* Total Members */}
        <div className="pb-4 md:pb-0 md:pr-6">
          <p className="text-[13px] font-medium text-[#667085] mb-2">
            Total Members
          </p>
          {isLoading ? (
            <div className="h-8 w-16 bg-gray-100 animate-pulse rounded-md mt-1" />
          ) : (
            <p className="text-[32px] font-bold text-[#101828] leading-none">
              {formatNumber(totalMembers)}
            </p>
          )}
        </div>

        {/* Active Members */}
        <div className="py-4 md:py-0 md:px-6">
          <p className="text-[13px] font-medium text-[#667085] mb-2">
            Active Members
          </p>
          {isLoading ? (
            <div className="h-8 w-16 bg-gray-100 animate-pulse rounded-md mt-1" />
          ) : (
            <p className="text-[32px] font-bold text-[#101828] leading-none">
              {formatNumber(activeMembers)}
            </p>
          )}
        </div>

        {/* Disabled Members */}
        <div className="pt-4 md:pt-0 md:pl-6">
          <p className="text-[13px] font-medium text-[#667085] mb-2">
            Disabled Members
          </p>
          {isLoading ? (
            <div className="h-8 w-16 bg-gray-100 animate-pulse rounded-md mt-1" />
          ) : (
            <p className="text-[32px] font-bold text-[#101828] leading-none">
              {formatNumber(disabledMembers)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
