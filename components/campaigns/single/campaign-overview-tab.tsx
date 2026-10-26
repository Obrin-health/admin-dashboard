"use client";

import React, { useState, useMemo } from "react";
import { ChevronDown, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  useCampaignUserAcquisition,
  useCampaignTopAmbassadors,
} from "@/hooks/use-campaigns";

interface CampaignOverviewTabProps {
  id: string;
}

const colorsList = [
  "#BB1A8C",
  "#A855F7",
  "#84CC16",
  "#EF4444",
  "#475569",
  "#0284C7",
];

export const CampaignOverviewTab: React.FC<CampaignOverviewTabProps> = ({ id }) => {
  const [selectedAcquisitionYear, setSelectedAcquisitionYear] = useState("2026");
  const [selectedAmbassadorDate, setSelectedAmbassadorDate] = useState("All time");

  const yearNum = parseInt(selectedAcquisitionYear, 10) || 2026;
  const { data: acqData, isLoading: isAcqLoading } =
    useCampaignUserAcquisition(id, yearNum);

  // Parse date range for top ambassadors query
  const dateParams = useMemo<{ from?: string; to?: string }>(() => {
    const now = new Date();
    if (selectedAmbassadorDate === "Last 30 Days") {
      return {
        from: new Date(now.getTime() - 30 * 86400000).toISOString(),
        to: now.toISOString(),
      };
    }
    if (selectedAmbassadorDate === "Last 90 Days") {
      return {
        from: new Date(now.getTime() - 90 * 86400000).toISOString(),
        to: now.toISOString(),
      };
    }
    if (selectedAmbassadorDate === "Year to Date") {
      return {
        from: new Date(now.getFullYear(), 0, 1).toISOString(),
        to: now.toISOString(),
      };
    }
    return {};
  }, [selectedAmbassadorDate]);

  const { data: topAmbassadorsData, isLoading: isTopLoading } =
    useCampaignTopAmbassadors(id, dateParams);

  // Compute monthly acquisition items
  const monthlyAcquisition = useMemo(() => {
    if (!acqData?.months || !Array.isArray(acqData.months) || acqData.months.length === 0) {
      return [];
    }

    const maxVal = Math.max(
      ...acqData.months.map((m) => (typeof m.users === "number" ? m.users : 0)),
      1
    );

    return acqData.months.map((m) => {
      const u = typeof m.users === "number" ? m.users : 0;
      const heightPct = u === 0 ? 0 : Math.min(100, Math.max(4, Math.round((u / maxVal) * 100)));
      const val =
        u >= 1000
          ? `${(u / 1000).toFixed(1).replace(/\.0$/, "")}k`
          : String(u);

      return {
        month: m.month || "-",
        users: u,
        heightPct,
        val,
      };
    });
  }, [acqData]);

  // Compute top ambassadors items
  const topAmbassadors = useMemo(() => {
    if (!Array.isArray(topAmbassadorsData) || topAmbassadorsData.length === 0) {
      return [];
    }

    const maxUsers = Math.max(
      ...topAmbassadorsData.map((item) => {
        const u = item.users ?? item.totalUsersIntroduced ?? 0;
        return typeof u === "number" ? u : 0;
      }),
      1
    );

    return topAmbassadorsData.map((item, idx) => {
      const u = item.users ?? item.totalUsersIntroduced ?? 0;
      const count = typeof u === "number" ? u : 0;
      const pct = Math.min(100, Math.max(5, Math.round((count / maxUsers) * 100)));
      const name = item.fullName || item.name || item.ambassadorName || "Ambassador";
      const display = item.display || `${count.toLocaleString()} Users`;
      const color = item.color || colorsList[idx % colorsList.length];

      return {
        name,
        users: count,
        display,
        color,
        pct,
      };
    });
  }, [topAmbassadorsData]);

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
              <span>Year is {selectedAcquisitionYear}</span>
              <ChevronDown className="size-3.5 text-[#667085]" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              {["2026", "2025", "2024"].map((year) => (
                <DropdownMenuItem
                  key={year}
                  onClick={() => setSelectedAcquisitionYear(year)}
                  className="text-[12px] cursor-pointer"
                >
                  Year is {year}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Vertical Bar Chart */}
        <div className="pt-4">
          {isAcqLoading ? (
            <div className="h-48 flex items-center justify-center gap-2 text-[#667085]">
              <Loader2 className="size-5 animate-spin text-[#BB1A8C]" />
              <span className="text-xs">Loading acquisition data...</span>
            </div>
          ) : monthlyAcquisition.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-[13px] text-[#667085]">
              No user acquisition data available for {selectedAcquisitionYear}.
            </div>
          ) : (
            <div className="h-48 flex items-end justify-between gap-2 sm:gap-4 px-2">
              {monthlyAcquisition.map((col) => (
                <div
                  key={col.month}
                  className="flex-1 flex flex-col items-center justify-end h-full group"
                >
                  <span className="text-[11px] font-medium text-[#667085] opacity-0 group-hover:opacity-100 transition-opacity">
                    {col.val}
                  </span>
                  <div
                    className="w-full max-w-7 bg-[#BB1A8C] rounded-t-md hover:bg-[#9B1373] transition-all cursor-pointer shadow-2xs"
                    style={{ height: `${col.heightPct}%` }}
                    title={`${col.month}: ${col.users} users`}
                  />
                  <span className="text-[12px] text-[#667085] font-medium mt-1">
                    {col.month}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 2. Top Performing Ambassadors */}
      <div className="w-full rounded-2xl border border-[#EAECF0] bg-white p-6 md:p-8 shadow-xs">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-[16px] font-bold text-[#101828]">
              Top Performing Ambassadors
            </h3>
            <p className="text-[12px] text-[#667085] mt-0.5">
              Ambassadors with highest user acquisition in this campaign
            </p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-[#D0D5DD] bg-white text-[12px] text-[#344054] hover:bg-gray-50 transition-colors shadow-2xs outline-none cursor-pointer">
              <span>Date: {selectedAmbassadorDate}</span>
              <ChevronDown className="size-3.5 text-[#667085]" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              {[
                "All time",
                "Last 30 Days",
                "Last 90 Days",
                "Year to Date",
              ].map((d) => (
                <DropdownMenuItem
                  key={d}
                  onClick={() => setSelectedAmbassadorDate(d)}
                  className="text-[12px] cursor-pointer"
                >
                  {d}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Horizontal Bars */}
        <div className="space-y-4">
          {isTopLoading ? (
            <div className="py-12 flex items-center justify-center gap-2 text-[#667085]">
              <Loader2 className="size-5 animate-spin text-[#BB1A8C]" />
              <span className="text-xs">Loading top ambassadors...</span>
            </div>
          ) : topAmbassadors.length === 0 ? (
            <div className="py-12 text-center text-[13px] text-[#667085]">
              No top ambassadors recorded for this campaign.
            </div>
          ) : (
            topAmbassadors.map((amb) => (
              <div key={amb.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-[13px]">
                  <span className="font-medium text-[#101828]">{amb.name}</span>
                  <span className="text-[#667085] font-medium">{amb.display}</span>
                </div>
                <div className="w-full h-2.5 bg-[#F2F4F7] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${amb.pct}%`,
                      backgroundColor: amb.color,
                    }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CampaignOverviewTab;
