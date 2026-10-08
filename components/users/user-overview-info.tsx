"use client";

import React from "react";

const infoFields = [
  { label: "User ID :", value: "USER10133" },
  { label: "Phone Number:", value: "+234 8175927055" },
  { label: "Location:", value: "Ikeja, Lagos" },
  { label: "Verification Status:", value: "Verified" },
  { label: "First Interaction", value: "August 20, 2026, 10:00AM" },
  { label: "Last Active Date", value: "August 20, 2026, 10:00AM" },
  { label: "Conversations:", value: "14 total" },
  { label: "Messages", value: "20 total" },
  { label: "Source:", value: "Direct Whatsapp" },
];

export const UserOverviewInfo: React.FC = () => {
  return (
    <div className="w-full rounded-2xl border border-[#EAECF0] bg-white p-6 sm:p-7 shadow-xs">
      <div className="space-y-4">
        {infoFields.map((field) => (
          <div
            key={field.label}
            className="flex flex-col sm:flex-row sm:items-center justify-between py-1 border-b border-[#F2F4F7] last:border-none"
          >
            <span className="text-[13px] sm:text-[14px] text-[#667085] sm:w-48 shrink-0">
              {field.label}
            </span>
            <span className="text-[13px] sm:text-[14px] font-semibold text-[#101828] mt-0.5 sm:mt-0 text-left sm:text-right flex-1">
              {field.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserOverviewInfo;
