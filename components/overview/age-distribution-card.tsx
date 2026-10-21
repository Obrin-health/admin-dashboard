"use client";

import React, { useState } from "react";
import { useAgeDistribution } from "@/hooks/use-overview";

const DEFAULT_BANDS = [
  { label: "18-24yrs", users: 0, share: 0 },
  { label: "25-34yrs", users: 0, share: 0 },
  { label: "35-44yrs", users: 0, share: 0 },
  { label: "45-64yrs", users: 0, share: 0 },
  { label: "65+yrs", users: 0, share: 0 },
];

export const AgeDistributionCard: React.FC = () => {
  const [hoveredRange, setHoveredRange] = useState<string | null>(null);
  const { data, isLoading } = useAgeDistribution();

  const bands = data?.bands && data.bands.length > 0 ? data.bands : DEFAULT_BANDS;

  return (
    <div className="w-full rounded-2xl border border-[#EAECF0] bg-white p-5 sm:p-7 shadow-xs">
      <div className="flex items-center justify-between pb-5 border-b border-[#F2F4F7] mb-5">
        <div>
          <h3 className="text-[17px] font-semibold text-[#101828]">Age distribution</h3>
          {data?.knownAges ? (
            <p className="text-[12px] text-[#667085] mt-0.5">
              Based on {data.knownAges.toLocaleString()} users with known age
            </p>
          ) : null}
        </div>
      </div>

      <div className="space-y-4 sm:space-y-5">
        {bands.map((group) => {
          const isHovered = hoveredRange === group.label;
          const percent = group.share > 0 ? (group.share * 100) : 0;
          const displayPercent =
            percent >= 1 ? `${Math.round(percent)}%` : `${percent.toFixed(1)}%`;
          const barWidth = percent > 0 ? Math.max(percent, 2) : 0;

          return (
            <div
              key={group.label}
              className="space-y-1.5 group cursor-pointer"
              onMouseEnter={() => setHoveredRange(group.label)}
              onMouseLeave={() => setHoveredRange(null)}
            >
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-normal text-[#667085] group-hover:text-[#101828] transition-colors">
                  {group.label}
                </span>
                <span className="text-[12px] font-medium text-[#667085] group-hover:text-[#BB1A8C] transition-colors">
                  {isLoading ? (
                    "..."
                  ) : isHovered ? (
                    <span className="font-semibold text-[#BB1A8C]">
                      {displayPercent} ({group.users} users)
                    </span>
                  ) : (
                    displayPercent
                  )}
                </span>
              </div>

              {/* Progress bar track */}
              <div className="w-full h-3.5 bg-[#F8F9FC] rounded-full overflow-hidden p-0.5 border border-[#F2F4F7]">
                <div
                  style={{ width: `${isLoading ? 0 : barWidth}%` }}
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
