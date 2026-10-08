"use client";

import React, { useState } from "react";

interface AgeGroup {
  range: string;
  percentage: number;
}

const ageGroups: AgeGroup[] = [
  { range: "18-24yrs", percentage: 24 },
  { range: "25-34yrs", percentage: 11 },
  { range: "35-44yrs", percentage: 65 },
  { range: "45-64yrs", percentage: 55 },
  { range: "65+yrs", percentage: 63 },
];

export const AgeDistributionCard: React.FC = () => {
  const [hoveredRange, setHoveredRange] = useState<string | null>(null);

  return (
    <div className="w-full rounded-2xl border border-[#EAECF0] bg-white p-5 sm:p-7 shadow-xs">
      <div className="pb-5">
        <h3 className="text-[17px] font-semibold text-[#101828]">Age distribution</h3>
      </div>

      <div className="space-y-4 sm:space-y-5">
        {ageGroups.map((group) => {
          const isHovered = hoveredRange === group.range;

          return (
            <div
              key={group.range}
              className="space-y-1.5 group cursor-pointer"
              onMouseEnter={() => setHoveredRange(group.range)}
              onMouseLeave={() => setHoveredRange(null)}
            >
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-normal text-[#667085] group-hover:text-[#101828] transition-colors">
                  {group.range}
                </span>
                {isHovered && (
                  <span className="text-[12px] font-semibold text-[#BB1A8C] animate-fade-in">
                    {group.percentage}%
                  </span>
                )}
              </div>

              {/* Progress bar track */}
              <div className="w-full h-3.5 bg-[#F8F9FC] rounded-full overflow-hidden p-0.5 border border-[#F2F4F7]">
                <div
                  style={{ width: `${group.percentage}%` }}
                  className={`h-full bg-[#BB1A8C] rounded-full transition-all duration-500 ${
                    isHovered ? "brightness-110 shadow-xs" : ""
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AgeDistributionCard;
