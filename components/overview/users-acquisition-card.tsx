"use client";

import React, { useMemo, useState } from "react";
import { ChevronDown, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useUserAcquisition } from "@/hooks/use-overview";

const DEFAULT_MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const AVAILABLE_YEARS = ["2026", "2025", "2024"];

function formatTick(val: number): string {
  if (val >= 1_000_000) {
    return `${(val / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  }
  if (val >= 1_000) {
    return `${(val / 1_000).toFixed(1).replace(/\.0$/, "")}k`;
  }
  return val.toString();
}

function calculateTicks(maxVal: number) {
  const safeMax = Math.max(maxVal, 6);
  // Pick a clean step
  const magnitude = Math.pow(10, Math.floor(Math.log10(safeMax)));
  const normalized = safeMax / magnitude;
  let step: number;
  if (normalized <= 1.5) step = 0.25 * magnitude;
  else if (normalized <= 3) step = 0.5 * magnitude;
  else if (normalized <= 6) step = 1 * magnitude;
  else step = 2 * magnitude;

  if (step < 1) step = 1;

  const maxTick = Math.max(Math.ceil(safeMax / step) * step, step * 5);
  const count = 5;
  const interval = maxTick / count;
  const ticks: string[] = [];
  for (let i = count; i >= 0; i--) {
    ticks.push(formatTick(Math.round(i * interval)));
  }

  return { ticks, maxTick };
}

export const UsersAcquisitionCard: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState("2026");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const { data, isLoading, isFetching } = useUserAcquisition(selectedYear);

  const monthsData = useMemo(() => {
    if (data?.months && data.months.length > 0) {
      return data.months;
    }
    return DEFAULT_MONTHS.map((m) => ({ month: m, users: 0 }));
  }, [data]);

  const maxUsers = useMemo(() => {
    return Math.max(...monthsData.map((m) => m.users), 0);
  }, [monthsData]);

  const { ticks: yAxisTicks, maxTick } = useMemo(() => {
    return calculateTicks(maxUsers);
  }, [maxUsers]);

  const totalUsers = data?.total ?? 0;

  return (
    <div className="w-full rounded-2xl border border-[#EAECF0] bg-white p-5 sm:p-7 shadow-xs mb-6">
      {/* Header */}
      <div className="flex items-start justify-between pb-6 relative z-20">
        <div>
          <span className="text-[12px] font-semibold tracking-wider text-[#667085] uppercase">
            USERS ACQUISITION
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-general-sans text-[28px] sm:text-[32px] font-bold text-[#101828] tracking-tight">
              {isLoading ? "..." : totalUsers.toLocaleString()}
            </span>
            <span className="text-[14px] font-medium text-[#667085]">Users</span>
            {isFetching && !isLoading && (
              <Loader2 className="w-3.5 h-3.5 text-[#BB1A8C] animate-spin ml-1" />
            )}
          </div>
        </div>

        {/* Year Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium text-[#344054] bg-white border border-[#D0D5DD] rounded-lg hover:bg-gray-50 transition-colors shadow-2xs cursor-pointer">
            <span>{selectedYear}</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#667085]" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="z-50">
            {AVAILABLE_YEARS.map((year) => (
              <DropdownMenuItem
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`text-[13px] cursor-pointer ${
                  selectedYear === year ? "font-semibold text-[#BB1A8C]" : ""
                }`}
              >
                {year}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Bar Chart Container */}
      <div className="w-full relative flex pt-2 pb-4 z-0">
        {/* Y Axis Labels */}
        <div className="flex flex-col justify-between h-56 text-[11px] text-[#98A2B3] pr-4 shrink-0 select-none text-right w-9">
          {yAxisTicks.map((tick, idx) => (
            <span key={`${tick}-${idx}`} className="leading-none">
              {tick}
            </span>
          ))}
        </div>

        {/* Chart Canvas & Grid Lines */}
        <div className="flex-1 relative flex flex-col justify-between">
          {/* Horizontal Grid lines */}
          <div className="absolute inset-x-0 top-0 h-56 flex flex-col justify-between pointer-events-none z-0">
            {yAxisTicks.map((tick, i) => (
              <div
                key={`grid-${tick}-${i}`}
                className={`w-full border-b ${
                  i === yAxisTicks.length - 1
                    ? "border-gray-200"
                    : "border-gray-100 border-dashed"
                }`}
              />
            ))}
          </div>

          {/* Bars Grid */}
          <div className="h-56 relative grid grid-cols-12 gap-1 sm:gap-3 items-end px-2 sm:px-4 z-[1]">
            {monthsData.map((item, idx) => {
              const heightPercent = maxTick > 0 ? (item.users / maxTick) * 100 : 0;
              const displayHeight =
                item.users > 0 ? Math.max(heightPercent, 3) : 0;
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
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-[#101828] text-white text-[11px] rounded-md font-medium whitespace-nowrap shadow-lg pointer-events-none z-30 animate-in fade-in zoom-in-95 duration-150">
                      {item.month}: {item.users.toLocaleString()} Users
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#101828]" />
                    </div>
                  )}

                  {/* Vertical Bar or Baseline Indicator */}
                  {item.users > 0 ? (
                    <div
                      style={{ height: `${displayHeight}%` }}
                      className={`w-2.5 sm:w-3.5 bg-[#BB1A8C] rounded-full transition-all duration-300 ${
                        isHovered
                          ? "brightness-110 shadow-[0_0_12px_rgba(187,26,140,0.5)] scale-y-[1.02]"
                          : "hover:brightness-105"
                      }`}
                    />
                  ) : (
                    <div className="w-2.5 sm:w-3.5 h-1.5 rounded-full bg-gray-200/80 group-hover:bg-gray-300 transition-colors" />
                  )}
                </div>
              );
            })}
          </div>

          {/* X Axis Month Labels */}
          <div className="grid grid-cols-12 gap-1 sm:gap-3 px-2 sm:px-4 items-center text-center mt-3">
            {monthsData.map((item, idx) => (
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

