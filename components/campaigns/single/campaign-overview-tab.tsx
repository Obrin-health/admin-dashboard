"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export const CampaignOverviewTab: React.FC = () => {
  const [selectedAcquisitionYear, setSelectedAcquisitionYear] =
    useState("Year is 2026");
  const [selectedAmbassadorDate, setSelectedAmbassadorDate] =
    useState("Date is All time");

  const monthlyAcquisition = [
    { month: "Jan", heightPct: 83, val: "10k" },
    { month: "Feb", heightPct: 46, val: "5.5k" },
    { month: "Mar", heightPct: 20, val: "2.4k" },
    { month: "Apr", heightPct: 46, val: "5.5k" },
    { month: "May", heightPct: 84, val: "10.2k" },
    { month: "Jun", heightPct: 8, val: "1.0k" },
    { month: "Jul", heightPct: 6, val: "0.7k" },
    { month: "Aug", heightPct: 6, val: "0.7k" },
    { month: "Sep", heightPct: 20, val: "2.4k" },
    { month: "Oct", heightPct: 46, val: "5.5k" },
    { month: "Nov", heightPct: 10, val: "1.2k" },
    { month: "Dec", heightPct: 8, val: "1.0k" },
  ];

  const topAmbassadors = [
    { name: "Emmanuel Adebayo", users: 5000, display: "5000 Users", color: "#BB1A8C", pct: 50 },
    { name: "Jane Doe", users: 4500, display: "4500 Users", color: "#A855F7", pct: 45 },
    { name: "Caleb West", users: 4000, display: "4000 Users", color: "#84CC16", pct: 40 },
    { name: "Christian Anna", users: 3000, display: "3000 Users", color: "#EF4444", pct: 30 },
    { name: "Rachael Tony", users: 500, display: "500 Users", color: "#475569", pct: 6 },
  ];

  return (
    <div className="space-y-6">
      {/* 1. User Acquisition (Full Width Card) */}
      <div className="w-full rounded-2xl border border-[#EAECF0] bg-white p-6 md:p-8 shadow-xs">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-[16px] font-bold text-[#101828]">
              User Acquisition
            </h3>
            <p className="text-[12px] text-[#667085]">
              An overview of users introduced each month
            </p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-[#D0D5DD] bg-white text-[12px] text-[#344054] hover:bg-gray-50 transition-colors shadow-2xs outline-none cursor-pointer">
              <span>{selectedAcquisitionYear}</span>
              <ChevronDown className="size-3.5 text-[#667085]" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              {["Year is 2026", "Year is 2025", "Year is 2024"].map((year) => (
                <DropdownMenuItem
                  key={year}
                  onClick={() => setSelectedAcquisitionYear(year)}
                  className="text-[12px] cursor-pointer"
                >
                  {year}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Vertical Bar Chart */}
        <div className="pt-4">
          <div className="relative h-48">
            {/* Y Axis Guide Lines */}
            <div className="flex flex-col justify-between h-full border-b border-[#EAECF0]">
              {["12k", "10k", "8k", "6k", "4k", "2k", "1k", "0"].map((yLabel) => (
                <div key={yLabel} className="flex items-center gap-3">
                  <span className="text-[10px] text-[#98A2B3] w-6 text-right shrink-0">
                    {yLabel}
                  </span>
                  <div className="w-full border-t border-dashed border-[#F2F4F7]" />
                </div>
              ))}
            </div>

            {/* Bars */}
            <div className="absolute inset-x-0 bottom-0 top-0 pl-9 pr-2 flex items-end justify-between pointer-events-none">
              {monthlyAcquisition.map((col) => (
                <div
                  key={col.month}
                  className="flex-1 flex flex-col items-center justify-end h-full group pointer-events-auto"
                >
                  <div
                    className="w-2.5 sm:w-3.5 rounded-t-sm bg-[#BB1A8C] hover:bg-[#9B1373] transition-all cursor-pointer relative"
                    style={{ height: `${col.heightPct}%` }}
                  >
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-7 left-1/2 -translate-x-1/2 bg-[#101828] text-white text-[10px] px-1.5 py-0.5 rounded shadow pointer-events-none whitespace-nowrap z-10">
                      {col.val}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Month Labels */}
          <div className="flex justify-between pl-9 pr-2 pt-3 text-[11px] text-[#667085]">
            {monthlyAcquisition.map((col) => (
              <div key={col.month} className="flex-1 text-center font-medium">
                {col.month}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Top Performing Ambassadors (Full Width Card) */}
      <div className="w-full rounded-2xl border border-[#EAECF0] bg-white p-6 md:p-8 shadow-xs">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-[16px] font-bold text-[#101828]">
              Top Performing Ambassadors
            </h3>
            <p className="text-[12px] text-[#667085]">
              Overview across this campaign
            </p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#D0D5DD] bg-white text-[12px] text-[#344054] hover:bg-gray-50 transition-colors shadow-2xs outline-none cursor-pointer">
              <span>{selectedAmbassadorDate}</span>
              <ChevronDown className="size-3.5 text-[#667085]" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              {["Date is All time", "Last 30 days", "Last 6 months", "Year to date"].map(
                (opt) => (
                  <DropdownMenuItem
                    key={opt}
                    onClick={() => setSelectedAmbassadorDate(opt)}
                    className="text-[12px] cursor-pointer"
                  >
                    {opt}
                  </DropdownMenuItem>
                )
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Horizontal Bars */}
        <div className="space-y-4 pt-2">
          {topAmbassadors.map((amb) => (
            <div key={amb.name} className="space-y-1">
              <div className="text-[12px] text-[#344054] font-medium">
                {amb.name}
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-3.5 bg-gray-50 rounded-full overflow-hidden relative">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${amb.pct}%`,
                      backgroundColor: amb.color,
                    }}
                  />
                </div>
                <span className="text-[12px] font-medium text-[#475467] min-w-[70px]">
                  {amb.display}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Scale Axis (0 to 10k) */}
        <div className="pt-6 mt-4 border-t border-[#F2F4F7]">
          <div className="flex justify-between text-[11px] text-[#98A2B3]">
            <span>0</span>
            <span>50</span>
            <span>100</span>
            <span>200</span>
            <span>300</span>
            <span>500</span>
            <span>1K</span>
            <span>2K</span>
            <span>3K</span>
            <span>5K</span>
            <span>10k</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignOverviewTab;
