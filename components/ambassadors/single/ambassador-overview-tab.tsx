"use client";

import React, { useState } from "react";
import { ChevronDown, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  useAmbassadorCampaignPerformance,
  useAmbassadorUserAcquisition,
} from "@/hooks/use-ambassadors";
import type { AmbassadorDetail } from "@/types/ambassadors";

interface AmbassadorOverviewTabProps {
  id?: string;
  ambassador?: AmbassadorDetail;
}

const colorsList = ["#BB1A8C", "#A855F7", "#84CC16", "#EF4444", "#475569", "#0284C7"];

export const AmbassadorOverviewTab: React.FC<AmbassadorOverviewTabProps> = ({
  id = "",
  ambassador,
}) => {
  const [selectedPerformanceDate, setSelectedPerformanceDate] =
    useState("Date is All time");
  const [selectedAcquisitionYear, setSelectedAcquisitionYear] =
    useState("2026");

  // Fetch Campaign Performance
  const { data: perfData, isLoading: isPerfLoading } =
    useAmbassadorCampaignPerformance(id);

  // Fetch User Acquisition
  const yearNum = parseInt(selectedAcquisitionYear, 10) || 2026;
  const { data: acqData, isLoading: isAcqLoading } =
    useAmbassadorUserAcquisition(id, yearNum);

  // Format date helper
  const formatDateStr = (dateStr?: unknown) => {
    if (!dateStr || typeof dateStr !== "string") return "-";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return "-";
      return d.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
    } catch {
      return "-";
    }
  };

  const safeString = (val: unknown, fallback: string = "-"): string => {
    if (!val) return fallback;
    if (typeof val === "string") return val.trim() || fallback;
    if (typeof val === "number") return String(val);
    if (typeof val === "object" && val !== null) {
      const obj = val as Record<string, unknown>;
      return (
        (typeof obj.name === "string" && obj.name) ||
        (typeof obj.title === "string" && obj.title) ||
        (typeof obj.city === "string" && obj.city) ||
        (typeof obj.address === "string" && obj.address) ||
        fallback
      );
    }
    return fallback;
  };

  const infoRows = [
    {
      label: "Ambassador ID :",
      value: safeString(ambassador?.code),
    },
    {
      label: "Email Address :",
      value: safeString(ambassador?.email),
    },
    {
      label: "Phone Number :",
      value: safeString(ambassador?.phoneNumber),
    },
    {
      label: "Location :",
      value: safeString(ambassador?.location),
    },
    {
      label: "Date Onboarded :",
      value: formatDateStr(ambassador?.createdAt),
    },
    {
      label: "Last Referral Date :",
      value: formatDateStr(ambassador?.lastReferralDate),
    },
    {
      label: "First Referral Date :",
      value: formatDateStr(ambassador?.firstReferralDate),
    },
  ];

  // Campaign performance items
  const performanceItems =
    Array.isArray(perfData)
      ? perfData.map((item, idx) => {
          const val = Number(item.value) || 0;
          return {
            name: safeString(item.name, "Campaign"),
            value: val,
            display: safeString(item.display, val.toLocaleString()),
            color: typeof item.color === "string" ? item.color : colorsList[idx % colorsList.length],
            pct: typeof item.pct === "number" ? item.pct : Math.min(100, Math.max(10, Math.round((val / 50000) * 100))),
          };
        })
      : [];

  // Monthly acquisition items
  const monthlyItems =
    acqData?.months && Array.isArray(acqData.months) && acqData.months.length > 0
      ? acqData.months.map((m) => {
          const u = typeof m.users === "number" ? m.users : 0;
          const maxVal = Math.max(
            ...acqData.months.map((x) => (typeof x.users === "number" ? x.users : 0)),
            1000
          );
          const heightPct = Math.min(100, Math.max(8, Math.round((u / maxVal) * 100)));
          const val =
            u >= 1000 ? `${(u / 1000).toFixed(1).replace(/\.0$/, "")}k` : String(u);
          return {
            month: safeString(m.month, "-"),
            heightPct,
            val,
          };
        })
      : [];

  return (
    <div className="space-y-6">
      {/* Row 1: Profile Info (Left) & Campaign Performance (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Ambassador Info Card */}
        <div className="lg:col-span-5 rounded-2xl border border-[#EAECF0] bg-white p-6 md:p-7 shadow-xs flex flex-col justify-between">
          <div className="divide-y divide-[#F2F4F7]">
            {infoRows.map((row) => (
              <div
                key={row.label}
                className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between text-[13px] gap-4"
              >
                <span className="text-[#667085] font-normal shrink-0">
                  {row.label}
                </span>
                <span className="text-[#101828] font-medium text-right truncate">
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Campaign Performance Horizontal Bar Chart */}
        <div className="lg:col-span-7 rounded-2xl border border-[#EAECF0] bg-white p-6 md:p-7 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-4 mb-1">
              <div>
                <h3 className="text-[16px] font-bold text-[#101828]">
                  Campaign Performance
                </h3>
                <p className="text-[12px] text-[#667085] mt-0.5">
                  Users registered via each campaign
                </p>
              </div>

              {/* Date Filter Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D0D5DD] bg-white text-[12px] font-medium text-[#344054] hover:bg-gray-50 transition-colors shadow-2xs outline-none cursor-pointer">
                  <span>{selectedPerformanceDate}</span>
                  <ChevronDown className="size-3.5 text-[#667085]" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  {[
                    "Date is All time",
                    "Last 30 Days",
                    "Last 90 Days",
                    "Year to Date",
                  ].map((d) => (
                    <DropdownMenuItem
                      key={d}
                      onClick={() => setSelectedPerformanceDate(d)}
                      className="text-[12px] cursor-pointer"
                    >
                      {d}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Performance Bars */}
            <div className="space-y-4 pt-4">
              {isPerfLoading && !perfData ? (
                <div className="py-8 flex items-center justify-center gap-2 text-[#667085]">
                  <Loader2 className="size-5 animate-spin text-[#BB1A8C]" />
                  <span className="text-xs">Loading performance...</span>
                </div>
              ) : performanceItems.length === 0 ? (
                <div className="py-8 text-center text-[13px] text-[#667085]">
                  No campaign performance data available for this ambassador.
                </div>
              ) : (
                performanceItems.map((item) => (
                  <div key={item.name} className="space-y-1.5">
                    <div className="flex items-center justify-between text-[13px]">
                      <span className="font-medium text-[#344054] truncate max-w-[200px]">
                        {item.name}
                      </span>
                      <span className="text-[#667085] font-semibold">
                        {item.display}
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#F2F4F7] overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${item.pct}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: User Acquisition Vertical Bar Chart */}
      <div className="rounded-2xl border border-[#EAECF0] bg-white p-6 md:p-7 shadow-xs">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-[16px] font-bold text-[#101828]">
              User Acquisition
            </h3>
            <p className="text-[12px] text-[#667085] mt-0.5">
              Monthly overview of users onboarded by this ambassador
            </p>
          </div>

          {/* Year Filter Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D0D5DD] bg-white text-[12px] font-medium text-[#344054] hover:bg-gray-50 transition-colors shadow-2xs outline-none cursor-pointer">
              <span>Year is {selectedAcquisitionYear}</span>
              <ChevronDown className="size-3.5 text-[#667085]" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              {["2026", "2025", "2024"].map((y) => (
                <DropdownMenuItem
                  key={y}
                  onClick={() => setSelectedAcquisitionYear(y)}
                  className="text-[12px] cursor-pointer"
                >
                  Year is {y}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Vertical Bar Chart with Months */}
        <div className="pt-2">
          {isAcqLoading && !acqData ? (
            <div className="h-44 flex items-center justify-center gap-2 text-[#667085]">
              <Loader2 className="size-5 animate-spin text-[#BB1A8C]" />
              <span className="text-xs">Loading acquisition data...</span>
            </div>
          ) : monthlyItems.length === 0 ? (
            <div className="h-44 flex items-center justify-center text-[13px] text-[#667085]">
              No user acquisition data available for {selectedAcquisitionYear}.
            </div>
          ) : (
            <div className="h-44 flex items-end justify-between gap-2 sm:gap-4 px-2">
              {monthlyItems.map((item) => (
                <div
                  key={item.month}
                  className="flex-1 flex flex-col items-center gap-2 h-full justify-end group"
                >
                  <span className="text-[11px] font-medium text-[#667085] opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.val}
                  </span>
                  <div
                    className="w-full max-w-[28px] bg-[#BB1A8C] rounded-t-md hover:bg-[#A01677] transition-all cursor-pointer shadow-2xs"
                    style={{ height: `${item.heightPct}%` }}
                    title={`${item.month}: ${item.val}`}
                  />
                  <span className="text-[12px] text-[#667085] font-medium mt-1">
                    {item.month}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AmbassadorOverviewTab;
