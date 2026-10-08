"use client";

import React from "react";

interface MetricItem {
  label: string;
  value: string;
}

const row1: MetricItem[] = [
  { label: "Total Users", value: "3.2k" },
  { label: "Active Users", value: "1.2k" },
  { label: "New Users", value: "200" },
];

const row2: MetricItem[] = [
  { label: "With Referrals", value: "3.2k" },
  { label: "Redeemed Referrals", value: "1.2k" },
  { label: "Converted Users", value: "200" },
];

export const UsersMetricsCard: React.FC = () => {
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

export default UsersMetricsCard;
