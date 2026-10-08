"use client";

import React, { useState } from "react";

export const CampaignsCard: React.FC = () => {
  const [hoveredSlice, setHoveredSlice] = useState<"physical" | "digital" | null>(null);

  // Circumference for r=72
  const r = 70;
  const circumference = 2 * Math.PI * r; // ≈ 439.82
  const physicalPercent = 40;
  const digitalPercent = 60;

  const physicalStroke = (physicalPercent / 100) * circumference;
  const digitalStroke = (digitalPercent / 100) * circumference;

  return (
    <div className="w-full rounded-2xl border border-[#EAECF0] bg-white p-5 sm:p-6 shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div>
        <h3 className="text-[17px] font-semibold text-[#101828]">Campaigns</h3>
        <p className="text-[12px] text-[#667085] mt-1">
          This is based on the percentage ratio of user accumulated on each campaign type.
        </p>

        {/* Total Stat */}
        <div className="mt-4">
          <span className="text-[12px] text-[#667085]">Total User Accumulated</span>
          <p className="font-general-sans text-[28px] sm:text-[32px] font-bold text-[#101828] tracking-tight mt-0.5">
            10,000
          </p>
        </div>
      </div>

      {/* Donut Chart Visual */}
      <div className="relative flex items-center justify-center my-4">
        <div className="relative size-56 sm:size-64 flex items-center justify-center">
          <svg className="w-full h-full -rotate-45 transform" viewBox="0 0 200 200">
            {/* Digital Ring (Magenta, 60%) */}
            <circle
              cx="100"
              cy="100"
              r={r}
              fill="transparent"
              stroke="#BB1A8C"
              strokeWidth={hoveredSlice === "digital" ? "30" : "26"}
              strokeDasharray={`${digitalStroke} ${circumference - digitalStroke}`}
              strokeDashoffset="0"
              className="cursor-pointer transition-all duration-300"
              onMouseEnter={() => setHoveredSlice("digital")}
              onMouseLeave={() => setHoveredSlice(null)}
            />

            {/* Physical Ring (Blue, 40%) */}
            <circle
              cx="100"
              cy="100"
              r={r}
              fill="transparent"
              stroke="#2E46E6"
              strokeWidth={hoveredSlice === "physical" ? "30" : "26"}
              strokeDasharray={`${physicalStroke} ${circumference - physicalStroke}`}
              strokeDashoffset={-digitalStroke}
              className="cursor-pointer transition-all duration-300"
              onMouseEnter={() => setHoveredSlice("physical")}
              onMouseLeave={() => setHoveredSlice(null)}
            />
          </svg>

          {/* 40% badge positioned near the physical blue segment */}
          <div
            className={`absolute left-3 bottom-12 px-2 py-0.5 bg-white rounded-md shadow-xs border border-gray-100 text-[11px] font-bold text-[#2E46E6] transition-transform duration-200 ${
              hoveredSlice === "physical" ? "scale-110 shadow-md" : ""
            }`}
          >
            40%
          </div>

          {/* 60% badge positioned near the digital magenta segment */}
          <div
            className={`absolute right-3 top-16 px-2 py-0.5 bg-white rounded-md shadow-xs border border-gray-100 text-[11px] font-bold text-[#BB1A8C] transition-transform duration-200 ${
              hoveredSlice === "digital" ? "scale-110 shadow-md" : ""
            }`}
          >
            60%
          </div>
        </div>
      </div>

      {/* Legend */}
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
        </div>
      </div>
    </div>
  );
};

export default CampaignsCard;
