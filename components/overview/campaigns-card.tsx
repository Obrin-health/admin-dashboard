"use client";

import React, { useState } from "react";
import { useCampaignTypesSummary } from "@/hooks/use-overview";

export const CampaignsCard: React.FC = () => {
  const [hoveredSlice, setHoveredSlice] = useState<"physical" | "digital" | null>(
    null
  );

  const { data: campaignData, isLoading } = useCampaignTypesSummary();

  // Circumference for r=70
  const r = 70;
  const circumference = 2 * Math.PI * r; // ≈ 439.82

  const totalUsers = campaignData?.totalUsersAccumulated ?? 0;
  const physicalPercent = Math.round(campaignData?.physical?.share ?? 0);
  const digitalPercent = Math.round(campaignData?.digital?.share ?? 0);

  const hasData = totalUsers > 0;

  // Calculate stroke lengths based on live share
  const physicalStroke = hasData ? (physicalPercent / 100) * circumference : 0;
  const digitalStroke = hasData ? (digitalPercent / 100) * circumference : 0;

  return (
    <div className="w-full rounded-2xl border border-[#EAECF0] bg-white p-5 sm:p-6 shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div>
        <h3 className="text-[17px] font-semibold text-[#101828]">Campaigns</h3>
        <p className="text-[12px] text-[#667085] mt-1">
          This is based on the percentage ratio of user accumulated on each
          campaign type.
        </p>

        {/* Total Stat */}
        <div className="mt-4">
          <span className="text-[12px] text-[#667085]">
            Total User Accumulated
          </span>
          {isLoading ? (
            <div className="h-9 w-28 bg-gray-100 animate-pulse rounded-lg mt-1" />
          ) : (
            <p className="font-general-sans text-[28px] sm:text-[32px] font-bold text-[#101828] tracking-tight mt-0.5">
              {totalUsers.toLocaleString()}
            </p>
          )}
        </div>
      </div>

      {/* Donut Chart Visual */}
      <div className="relative flex items-center justify-center my-4">
        <div className="relative size-56 sm:size-64 flex items-center justify-center">
          {isLoading ? (
            <div className="size-44 rounded-full border-[24px] border-gray-100 animate-pulse" />
          ) : (
            <>
              <svg
                className="w-full h-full -rotate-45 transform"
                viewBox="0 0 200 200"
              >
                {/* Background Base Ring (Empty/Neutral) */}
                <circle
                  cx="100"
                  cy="100"
                  r={r}
                  fill="transparent"
                  stroke="#F2F4F7"
                  strokeWidth="26"
                />

                {hasData && (
                  <>
                    {/* Digital Ring (Magenta) */}
                    <circle
                      cx="100"
                      cy="100"
                      r={r}
                      fill="transparent"
                      stroke="#BB1A8C"
                      strokeWidth={hoveredSlice === "digital" ? "30" : "26"}
                      strokeDasharray={`${digitalStroke} ${
                        circumference - digitalStroke
                      }`}
                      strokeDashoffset="0"
                      className="cursor-pointer transition-all duration-300"
                      onMouseEnter={() => setHoveredSlice("digital")}
                      onMouseLeave={() => setHoveredSlice(null)}
                    />

                    {/* Physical Ring (Blue) */}
                    <circle
                      cx="100"
                      cy="100"
                      r={r}
                      fill="transparent"
                      stroke="#2E46E6"
                      strokeWidth={hoveredSlice === "physical" ? "30" : "26"}
                      strokeDasharray={`${physicalStroke} ${
                        circumference - physicalStroke
                      }`}
                      strokeDashoffset={-digitalStroke}
                      className="cursor-pointer transition-all duration-300"
                      onMouseEnter={() => setHoveredSlice("physical")}
                      onMouseLeave={() => setHoveredSlice(null)}
                    />
                  </>
                )}
              </svg>

              {/* Physical badge */}
              <div
                className={`absolute left-3 bottom-12 px-2 py-0.5 bg-white rounded-md shadow-xs border border-gray-100 text-[11px] font-bold text-[#2E46E6] transition-transform duration-200 ${
                  hoveredSlice === "physical" ? "scale-110 shadow-md" : ""
                }`}
              >
                {physicalPercent}%
              </div>

              {/* Digital badge */}
              <div
                className={`absolute right-3 top-16 px-2 py-0.5 bg-white rounded-md shadow-xs border border-gray-100 text-[11px] font-bold text-[#BB1A8C] transition-transform duration-200 ${
                  hoveredSlice === "digital" ? "scale-110 shadow-md" : ""
                }`}
              >
                {digitalPercent}%
              </div>
            </>
          )}
        </div>
      </div>

      {/* Legend with User counts */}
      <div className="flex items-center justify-center gap-8 pt-3 border-t border-[#F2F4F7]">
        <div
          className="flex items-center gap-2 cursor-pointer group"
          onMouseEnter={() => setHoveredSlice("physical")}
          onMouseLeave={() => setHoveredSlice(null)}
        >
          <span className="size-2.5 rounded-full bg-[#2E46E6] group-hover:scale-125 transition-transform" />
          <span className="text-[13px] font-medium text-[#475467] group-hover:text-[#101828]">
            Physical
          </span>
          {hasData && (
            <span className="text-[11px] text-[#98A2B3]">
              ({campaignData?.physical?.users ?? 0})
            </span>
          )}
        </div>

        <div
          className="flex items-center gap-2 cursor-pointer group"
          onMouseEnter={() => setHoveredSlice("digital")}
          onMouseLeave={() => setHoveredSlice(null)}
        >
          <span className="size-2.5 rounded-full bg-[#BB1A8C] group-hover:scale-125 transition-transform" />
          <span className="text-[13px] font-medium text-[#475467] group-hover:text-[#101828]">
            Digital
          </span>
          {hasData && (
            <span className="text-[11px] text-[#98A2B3]">
              ({campaignData?.digital?.users ?? 0})
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CampaignsCard;
