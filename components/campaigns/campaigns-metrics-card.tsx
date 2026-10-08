"use client";

import React from "react";

export const CampaignsMetricsCard: React.FC = () => {
  const row1 = [
    { label: "Total Campaigns", value: "48" },
    { label: "Completed Campaigns", value: "30" },
    { label: "Active Campaigns", value: "1" },
  ];

  const row2 = [
    { label: "Total Users Acquired", value: "3k" },
    { label: "Converted Users", value: "1.2k" },
    { label: "Conversion Rate", value: "50%" },
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
