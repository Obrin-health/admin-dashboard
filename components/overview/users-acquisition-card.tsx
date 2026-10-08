"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

interface MonthlyData {
  month: string;
  users: number; // in thousands
  displayValue: string;
}

const acquisitionData2026: MonthlyData[] = [
  { month: "Jan", users: 10.0, displayValue: "10,000" },
  { month: "Feb", users: 5.5, displayValue: "5,500" },
  { month: "Mar", users: 2.8, displayValue: "2,800" },
  { month: "Apr", users: 5.5, displayValue: "5,500" },
  { month: "May", users: 10.0, displayValue: "10,000" },
  { month: "Jun", users: 1.2, displayValue: "1,200" },
  { month: "Jul", users: 0.9, displayValue: "900" },
  { month: "Aug", users: 1.0, displayValue: "1,000" },
  { month: "Sep", users: 2.8, displayValue: "2,800" },
  { month: "Oct", users: 5.5, displayValue: "5,500" },
  { month: "Nov", users: 1.5, displayValue: "1,500" },
  { month: "Dec", users: 1.2, displayValue: "1,200" },
];

const acquisitionDataByYear: Record<string, MonthlyData[]> = {
  "2026": acquisitionData2026,
  "2025": [
    { month: "Jan", users: 7.0, displayValue: "7,000" },
    { month: "Feb", users: 4.2, displayValue: "4,200" },
    { month: "Mar", users: 3.5, displayValue: "3,500" },
    { month: "Apr", users: 4.8, displayValue: "4,800" },
    { month: "May", users: 8.2, displayValue: "8,200" },
    { month: "Jun", users: 2.1, displayValue: "2,100" },
    { month: "Jul", users: 1.5, displayValue: "1,500" },
    { month: "Aug", users: 1.8, displayValue: "1,800" },
    { month: "Sep", users: 3.2, displayValue: "3,200" },
    { month: "Oct", users: 4.6, displayValue: "4,600" },
    { month: "Nov", users: 2.0, displayValue: "2,000" },
    { month: "Dec", users: 1.8, displayValue: "1,800" },
  ],
  "2024": [
    { month: "Jan", users: 5.0, displayValue: "5,000" },
    { month: "Feb", users: 3.0, displayValue: "3,000" },
    { month: "Mar", users: 2.2, displayValue: "2,200" },
    { month: "Apr", users: 3.4, displayValue: "3,400" },
    { month: "May", users: 6.0, displayValue: "6,000" },
    { month: "Jun", users: 1.0, displayValue: "1,000" },
    { month: "Jul", users: 0.8, displayValue: "800" },
    { month: "Aug", users: 1.2, displayValue: "1,200" },
    { month: "Sep", users: 2.0, displayValue: "2,000" },
    { month: "Oct", users: 3.5, displayValue: "3,500" },
    { month: "Nov", users: 1.1, displayValue: "1,100" },
    { month: "Dec", users: 0.9, displayValue: "900" },
  ],
};

const yAxisTicks = ["12k", "10k", "8k", "6k", "4k", "2k", "0"];
const maxVal = 12.0;

export const UsersAcquisitionCard: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState("2026");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const currentData = acquisitionDataByYear[selectedYear] || acquisitionData2026;

  return (
    <div className="w-full rounded-2xl border border-[#EAECF0] bg-white p-5 sm:p-7 shadow-xs mb-6">
      {/* Header */}
      <div className="flex items-start justify-between pb-6">
        <div>
          <span className="text-[12px] font-semibold tracking-wider text-[#667085] uppercase">
            USERS ACQUISITION
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-general-sans text-[28px] sm:text-[32px] font-bold text-[#101828] tracking-tight">
              3,000
            </span>
            <span className="text-[14px] font-medium text-[#667085]">Users</span>
          </div>
        </div>

        {/* Year Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium text-[#344054] bg-white border border-[#D0D5DD] rounded-lg hover:bg-gray-50 transition-colors shadow-2xs cursor-pointer">
            <span>{selectedYear}</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#667085]" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {["2026", "2025", "2024"].map((year) => (
              <DropdownMenuItem
                key={year}
                onClick={() => setSelectedYear(year)}
                className="text-[13px] cursor-pointer"
              >
                {year}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Bar Chart Container */}
      <div className="w-full relative flex pt-2 pb-4">
        {/* Y Axis Labels */}
        <div className="flex flex-col justify-between h-56 text-[11px] text-[#98A2B3] pr-4 shrink-0 select-none text-right w-8">
          {yAxisTicks.map((tick) => (
            <span key={tick} className="leading-none">
              {tick}
            </span>
          ))}
        </div>

        {/* Chart Canvas & Grid Lines */}
        <div className="flex-1 relative flex flex-col justify-between">
          {/* Horizontal Grid lines */}
          <div className="absolute inset-x-0 top-0 h-56 flex flex-col justify-between pointer-events-none">
            {yAxisTicks.map((tick, i) => (
              <div
                key={tick}
                className={`w-full border-b ${
                  i === yAxisTicks.length - 1
                    ? "border-gray-200"
                    : "border-gray-100 border-dashed"
                }`}
              />
            ))}
          </div>

          {/* Bars Grid */}
          <div className="h-56 relative grid grid-cols-12 gap-1 sm:gap-3 items-end px-2 sm:px-4 z-10">
            {currentData.map((item, idx) => {
              const heightPercent = Math.min(100, (item.users / maxVal) * 100);
              const isHovered = hoveredIndex === idx;

              return (
                <div
                  key={item.month}
                  className="relative h-full flex items-end justify-center group cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Tooltip */}
                  {isHovered && (
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-[#101828] text-white text-[11px] rounded-md font-medium whitespace-nowrap shadow-lg pointer-events-none z-30">
                      {item.month}: {item.displayValue} Users
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#101828]" />
                    </div>
                  )}

                  {/* Vertical Bar */}
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-2.5 sm:w-3.5 bg-[#BB1A8C] rounded-full transition-all duration-300 ${
                      isHovered
                        ? "brightness-110 shadow-[0_0_12px_rgba(187,26,140,0.5)] scale-y-[1.02]"
                        : "hover:brightness-105"
                    }`}
                  />
                </div>
              );
            })}
          </div>

          {/* X Axis Month Labels */}
          <div className="grid grid-cols-12 gap-1 sm:gap-3 px-2 sm:px-4 items-center text-center mt-3">
            {currentData.map((item, idx) => (
              <span
                key={item.month}
                className={`text-[12px] transition-colors ${
                  hoveredIndex === idx
                    ? "text-[#BB1A8C] font-semibold"
                    : "text-[#667085] font-normal"
                }`}
              >
                {item.month}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersAcquisitionCard;
