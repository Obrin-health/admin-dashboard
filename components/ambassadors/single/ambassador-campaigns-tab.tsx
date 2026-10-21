"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, MoreVertical, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useTablePagination } from "@/hooks/use-table-pagination";
import { useAmbassadorCampaigns } from "@/hooks/use-ambassadors";
import type { AmbassadorCampaignItem } from "@/types/ambassadors";

interface CampaignRow {
  id: string;
  campaign: string;
  type: "Physical" | "Digital";
  period: string;
  status: "Active" | "Inactive" | "Suspended";
}

function mapApiCampaign(item: AmbassadorCampaignItem, idx: number): CampaignRow {
  const rawStatus = (item.status || "ACTIVE").toUpperCase();
  const status: "Active" | "Inactive" | "Suspended" =
    rawStatus === "ACTIVE"
      ? "Active"
      : rawStatus === "SUSPENDED"
      ? "Suspended"
      : "Inactive";

  const rawType = (item.type || "PHYSICAL").toUpperCase();
  const type: "Physical" | "Digital" =
    rawType === "DIGITAL" ? "Digital" : "Physical";

  const period =
    item.period ||
    (item.startDate && item.endDate
      ? `${new Date(item.startDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })} - ${new Date(item.endDate).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}`
      : "-");

  let campaignName = "-";
  if (typeof item.name === "string" && item.name.trim()) {
    campaignName = item.name.trim();
  } else if (typeof item.campaign === "string" && item.campaign.trim()) {
    campaignName = item.campaign.trim();
  } else if (typeof item.campaign === "object" && item.campaign !== null) {
    const campObj = item.campaign as Record<string, unknown>;
    if (typeof campObj.name === "string" && campObj.name.trim()) {
      campaignName = campObj.name.trim();
    } else if (typeof campObj.title === "string" && campObj.title.trim()) {
      campaignName = campObj.title.trim();
    }
  }

  let rowId = String(idx + 1);
  if (typeof item.id === "string" && item.id.trim()) {
    rowId = item.id.trim();
  }

  return {
    id: rowId,
    campaign: campaignName,
    type,
    period,
    status,
  };
}

export const AmbassadorCampaignsTab: React.FC<{ id?: string }> = ({
  id = "",
}) => {
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState("All status");
  const [selectedType, setSelectedType] = useState("All types");
  const { currentPage, setCurrentPage } = useTablePagination({
    paramName: "campPage",
  });

  const apiStatus =
    selectedStatus === "Active"
      ? "ACTIVE"
      : selectedStatus === "Suspended"
      ? "SUSPENDED"
      : selectedStatus === "Inactive"
      ? "INACTIVE"
      : undefined;

  const apiType =
    selectedType === "Physical"
      ? "PHYSICAL"
      : selectedType === "Digital"
      ? "DIGITAL"
      : undefined;

  const pageSize = 10;
  const { data: apiResponse, isLoading, isFetching } = useAmbassadorCampaigns(id, {
    page: currentPage,
    pageSize,
    status: apiStatus,
    type: apiType,
  });

  const rawItems = apiResponse?.items || apiResponse?.data;
  const hasApiData = Array.isArray(rawItems);

  const displayList = hasApiData ? rawItems.map(mapApiCampaign) : [];

  const totalCount =
    apiResponse?.meta?.total ??
    apiResponse?.total ??
    displayList.length;

  const totalPages =
    apiResponse?.meta?.totalPages ??
    Math.max(1, Math.ceil(totalCount / pageSize));

  const paginatedCampaigns = displayList;

  return (
    <div className="space-y-4">
      {/* Header with Title and 2 Dropdowns */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <div className="flex items-center gap-3">
          <h3 className="text-[18px] font-bold text-[#101828]">Campaigns</h3>
          {isFetching && !isLoading && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FDF2FA] text-[12px] font-medium text-[#BB1A8C]">
              <Loader2 className="size-3.5 animate-spin" />
              <span>Updating...</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Show: All status */}
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#D0D5DD] bg-white text-[13px] text-[#344054] hover:bg-gray-50 transition-colors shadow-2xs outline-none cursor-pointer">
              <span className="text-[#667085]">Show:</span>
              <span className="font-medium">{selectedStatus}</span>
              <ChevronDown className="size-3.5 text-[#667085]" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              {["All status", "Active", "Inactive", "Suspended"].map((s) => (
                <DropdownMenuItem
                  key={s}
                  onClick={() => {
                    setSelectedStatus(s);
                    setCurrentPage(1);
                  }}
                  className="text-[13px] cursor-pointer"
                >
                  {s}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Show: All types */}
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#D0D5DD] bg-white text-[13px] text-[#344054] hover:bg-gray-50 transition-colors shadow-2xs outline-none cursor-pointer">
              <span className="text-[#667085]">Show:</span>
              <span className="font-medium">{selectedType}</span>
              <ChevronDown className="size-3.5 text-[#667085]" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              {["All types", "Physical", "Digital"].map((t) => (
                <DropdownMenuItem
                  key={t}
                  onClick={() => {
                    setSelectedType(t);
                    setCurrentPage(1);
                  }}
                  className="text-[13px] cursor-pointer"
                >
                  {t}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="relative w-full rounded-2xl border border-[#EAECF0] bg-white overflow-hidden shadow-xs">
        {isFetching && !isLoading && (
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#FCE7F6] overflow-hidden z-10">
            <div className="h-full bg-[#BB1A8C] animate-pulse w-full" />
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px] border-collapse">
            <thead>
              <tr className="border-b border-[#EAECF0] bg-[#FAFAFC] text-[12px] font-normal text-[#667085]">
                <th className="py-3 px-6 font-normal">Campaign</th>
                <th className="py-3 px-6 font-normal">Type</th>
                <th className="py-3 px-6 font-normal">Period</th>
                <th className="py-3 px-6 font-normal">Status</th>
                <th className="py-3 px-6 font-normal text-right">Actions</th>
              </tr>
            </thead>

            <tbody
              className={`divide-y divide-[#EAECF0] transition-opacity duration-200 ${
                isFetching && !isLoading ? "opacity-50" : ""
              }`}
            >
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[#667085]">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="size-6 animate-spin text-[#BB1A8C]" />
                      <span className="text-[13px]">Loading campaigns...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedCampaigns.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[#667085]">
                    No campaigns found for this ambassador.
                  </td>
                </tr>
              ) : (
                paginatedCampaigns.map((camp) => (
                  <tr
                    key={camp.id}
                    className="hover:bg-[#F9FAFB] transition-colors group"
                  >
                    <td className="py-4 px-6 font-medium text-[#101828] whitespace-nowrap">
                      {camp.campaign}
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap">
                      {camp.type === "Physical" ? (
                        <span className="inline-flex items-center px-3 py-0.5 rounded-full text-[12px] font-medium bg-[#E7F8F0] text-[#0D894F]">
                          Physical
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-0.5 rounded-full text-[12px] font-medium bg-[#FDF2FA] text-[#C11574]">
                          Digital
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-[#475467] whitespace-nowrap">
                      {camp.period}
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap">
                      {camp.status === "Active" && (
                        <span className="inline-flex items-center px-3 py-0.5 rounded-full text-[12px] font-medium bg-[#ECFDF3] text-[#027A48]">
                          Active
                        </span>
                      )}
                      {camp.status === "Inactive" && (
                        <span className="inline-flex items-center px-3 py-0.5 rounded-full text-[12px] font-medium bg-[#FEF6EE] text-[#F79009]">
                          Inactive
                        </span>
                      )}
                      {camp.status === "Suspended" && (
                        <span className="inline-flex items-center px-3 py-0.5 rounded-full text-[12px] font-medium bg-[#FEF3F2] text-[#B42318]">
                          Suspended
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap text-right">
                      <div className="inline-flex items-center justify-end gap-3">
                        <Link
                          href={`/campaigns/${camp.id}`}
                          className="text-[12px] font-semibold text-[#BB1A8C] hover:text-[#9B1373] hover:underline transition-colors"
                        >
                          View
                        </Link>
                        <DropdownMenu>
                          <DropdownMenuTrigger className="p-1 rounded-md hover:bg-gray-100 text-[#667085] transition-colors cursor-pointer outline-none">
                            <MoreVertical className="size-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-36">
                            <DropdownMenuItem
                              onClick={() => router.push(`/campaigns/${camp.id}`)}
                              className="text-[13px] cursor-pointer"
                            >
                              View Campaign
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="py-3.5 px-6 border-t border-[#EAECF0] flex items-center justify-between">
          <span className="text-[13px] text-[#667085]">
            Showing{" "}
            {totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1}
            –
            {Math.min(currentPage * pageSize, totalCount)}{" "}
            of {totalCount} campaigns
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 rounded-lg border border-[#D0D5DD] bg-white text-[13px] font-medium text-[#344054] hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs"
            >
              Previous
            </button>
            <span className="text-[13px] font-medium text-[#344054] px-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1.5 rounded-lg border border-[#D0D5DD] bg-white text-[13px] font-medium text-[#344054] hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AmbassadorCampaignsTab;
