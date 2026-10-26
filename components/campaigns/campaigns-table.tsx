"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  ChevronDown,
  MoreVertical,
  Loader2,
  PlayCircle,
  PauseCircle,
  StopCircle,
  XCircle,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { DeleteCampaignModal } from "@/components/campaigns/delete-campaign-modal";
import { useTablePagination } from "@/hooks/use-table-pagination";
import {
  useCampaignsList,
  useActivateCampaign,
  usePauseCampaign,
  useEndCampaign,
  useCancelCampaign,
  useDeleteCampaign,
} from "@/hooks/use-campaigns";
import type { CampaignItem, CampaignStatus, CampaignType } from "@/types/campaigns";

export interface CampaignListRow {
  id: string;
  name: string;
  type: "Physical" | "Digital";
  duration: string;
  totalReferrals: number;
  status: "Active" | "Completed" | "Paused" | "Cancelled" | "Scheduled" | "Archived";
  imageUrl?: string | null;
}

function mapApiToCampaignRow(item: CampaignItem, idx: number): CampaignListRow {
  const rawStatus = (item.status || "ACTIVE").toUpperCase();
  const status: CampaignListRow["status"] =
    rawStatus === "ACTIVE"
      ? "Active"
      : rawStatus === "COMPLETED"
      ? "Completed"
      : rawStatus === "PAUSED"
      ? "Paused"
      : rawStatus === "CANCELLED"
      ? "Cancelled"
      : rawStatus === "SCHEDULED"
      ? "Scheduled"
      : "Archived";

  const rawType = (item.type || "PHYSICAL").toUpperCase();
  const type: "Physical" | "Digital" =
    rawType === "DIGITAL" ? "Digital" : "Physical";

  const formatPeriod = (start?: string, end?: string) => {
    if (!start && !end) return "-";
    const fmt = (d: string) => {
      try {
        const parsed = new Date(d);
        if (isNaN(parsed.getTime())) return d;
        return parsed.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
      } catch {
        return d;
      }
    };
    if (start && end) return `${fmt(start)} - ${fmt(end)}`;
    if (start) return fmt(start);
    return fmt(end!);
  };

  const duration = formatPeriod(item.startDate, item.endDate);

  const totalReferrals =
    typeof item.totalReferrals === "number"
      ? item.totalReferrals
      : typeof item.usersAcquired === "number"
      ? item.usersAcquired
      : 0;

  return {
    id: item.id || String(idx + 1),
    name: item.name || "Untitled Campaign",
    type,
    duration,
    totalReferrals,
    status,
    imageUrl: item.imageUrl || null,
  };
}

export const CampaignsTable: React.FC = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All status");
  const [selectedType, setSelectedType] = useState("All types");
  const { currentPage, setCurrentPage } = useTablePagination();

  const [campaignToDelete, setCampaignToDelete] =
    useState<CampaignListRow | null>(null);

  // Status & mutation hooks
  const activateMutation = useActivateCampaign();
  const pauseMutation = usePauseCampaign();
  const endMutation = useEndCampaign();
  const cancelMutation = useCancelCampaign();
  const deleteMutation = useDeleteCampaign();

  // Search debounce
  const prevSearchRef = useRef(searchQuery);
  useEffect(() => {
    if (prevSearchRef.current === searchQuery) {
      return;
    }
    prevSearchRef.current = searchQuery;
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
      setCurrentPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery, setCurrentPage]);

  // Map filters to API values
  const apiStatus: CampaignStatus | undefined =
    selectedStatus === "Active"
      ? "ACTIVE"
      : selectedStatus === "Paused"
      ? "PAUSED"
      : selectedStatus === "Completed"
      ? "COMPLETED"
      : selectedStatus === "Cancelled"
      ? "CANCELLED"
      : selectedStatus === "Scheduled"
      ? "SCHEDULED"
      : selectedStatus === "Archived"
      ? "ARCHIVED"
      : undefined;

  const apiType: CampaignType | undefined =
    selectedType === "Physical"
      ? "PHYSICAL"
      : selectedType === "Digital"
      ? "DIGITAL"
      : undefined;

  const pageSize = 10;
  const { data: apiResponse, isLoading, isFetching } = useCampaignsList({
    page: currentPage,
    pageSize,
    search: debouncedSearch || undefined,
    status: apiStatus,
    type: apiType,
  });

  const rawItems = apiResponse?.items || apiResponse?.data;
  const hasApiData = Array.isArray(rawItems);
  const displayList = hasApiData ? rawItems.map(mapApiToCampaignRow) : [];

  const totalCount =
    apiResponse?.meta?.total ??
    apiResponse?.total ??
    displayList.length;

  const totalPages =
    apiResponse?.meta?.totalPages ??
    Math.max(1, Math.ceil(totalCount / pageSize));

  const handleDeleteConfirm = async () => {
    if (!campaignToDelete) return;
    try {
      await deleteMutation.mutateAsync(campaignToDelete.id);
      setCampaignToDelete(null);
    } catch {
      // Error is caught; query remains unaffected
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#667085]" />
          <input
            type="text"
            placeholder="Search campaigns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-lg border border-[#D0D5DD] bg-white text-[13px] text-[#101828] placeholder:text-[#667085] focus:outline-none focus:border-[#BB1A8C] focus:ring-1 focus:ring-[#BB1A8C] shadow-2xs transition-colors"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5">
          {isFetching && !isLoading && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FDF2FA] text-[12px] font-medium text-[#BB1A8C]">
              <Loader2 className="size-3.5 animate-spin" />
              <span>Updating...</span>
            </div>
          )}

          {/* Show: All status */}
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-[#D0D5DD] bg-white text-[13px] text-[#344054] hover:bg-gray-50 transition-colors shadow-2xs outline-none cursor-pointer">
              <span className="text-[#667085]">Show:</span>
              <span className="font-medium">{selectedStatus}</span>
              <ChevronDown className="size-3.5 text-[#667085]" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              {[
                "All status",
                "Active",
                "Paused",
                "Completed",
                "Cancelled",
                "Scheduled",
                "Archived",
              ].map((st) => (
                <DropdownMenuItem
                  key={st}
                  onClick={() => {
                    setSelectedStatus(st);
                    setCurrentPage(1);
                  }}
                  className="text-[13px] cursor-pointer"
                >
                  {st}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Show: All types */}
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-[#D0D5DD] bg-white text-[13px] text-[#344054] hover:bg-gray-50 transition-colors shadow-2xs outline-none cursor-pointer">
              <span className="text-[#667085]">Show:</span>
              <span className="font-medium">{selectedType}</span>
              <ChevronDown className="size-3.5 text-[#667085]" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              {["All types", "Physical", "Digital"].map((tp) => (
                <DropdownMenuItem
                  key={tp}
                  onClick={() => {
                    setSelectedType(tp);
                    setCurrentPage(1);
                  }}
                  className="text-[13px] cursor-pointer"
                >
                  {tp}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Campaigns Table Card */}
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
                <th className="py-3 px-6 font-normal">Duration</th>
                <th className="py-3 px-6 font-normal">Total Referrals</th>
                <th className="py-3 px-6 font-normal">Status</th>
                <th className="py-3 px-6 font-normal text-right">Actions</th>
              </tr>
            </thead>

            <tbody
              className={`divide-y divide-[#EAECF0] transition-opacity duration-200 ${
                isFetching && !isLoading ? "opacity-60" : ""
              }`}
            >
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-[#667085]">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="size-6 animate-spin text-[#BB1A8C]" />
                      <span className="text-[13px]">Loading campaigns...</span>
                    </div>
                  </td>
                </tr>
              ) : displayList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-[#667085]">
                    No campaigns found.
                  </td>
                </tr>
              ) : (
                displayList.map((camp) => (
                  <tr
                    key={camp.id}
                    className="hover:bg-[#F9FAFB] transition-colors group"
                  >
                    {/* Campaign Name & Image */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="relative size-10 rounded-xl overflow-hidden border border-gray-100 bg-pink-50 shadow-2xs shrink-0 flex items-center justify-center">
                          {camp.imageUrl ? (
                            <Image
                              src={camp.imageUrl}
                              alt={camp.name}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          ) : (
                            <div className="size-full bg-gradient-to-br from-[#BB1A8C] to-[#E5383B] flex items-center justify-center text-white text-[12px] font-bold">
                              {camp.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <Link
                          href={`/campaigns/${camp.id}`}
                          className="font-medium text-[#101828] hover:text-[#BB1A8C] hover:underline transition-colors"
                        >
                          {camp.name}
                        </Link>
                      </div>
                    </td>

                    {/* Type */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      {camp.type === "Physical" ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#E7F8F0] text-[#0D894F]">
                          Physical
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#FDF2FA] text-[#C11574]">
                          Digital
                        </span>
                      )}
                    </td>

                    {/* Duration */}
                    <td className="py-4 px-6 text-[#475467] whitespace-nowrap">
                      {camp.duration}
                    </td>

                    {/* Total Referrals */}
                    <td className="py-4 px-6 font-medium text-[#101828] whitespace-nowrap">
                      {camp.totalReferrals.toLocaleString()}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      {camp.status === "Active" && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#ECFDF3] text-[#027A48]">
                          Active
                        </span>
                      )}
                      {camp.status === "Completed" && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#F2F4F7] text-[#344054]">
                          Completed
                        </span>
                      )}
                      {camp.status === "Paused" && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#FEF6EE] text-[#B54708]">
                          Paused
                        </span>
                      )}
                      {camp.status === "Cancelled" && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#FEF3F2] text-[#B42318]">
                          Cancelled
                        </span>
                      )}
                      {camp.status === "Scheduled" && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#EFF8FF] text-[#175CD3]">
                          Scheduled
                        </span>
                      )}
                      {camp.status === "Archived" && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-gray-100 text-gray-600">
                          Archived
                        </span>
                      )}
                    </td>

                    {/* Actions */}
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
                          <DropdownMenuContent align="end" className="w-44 p-1.5 shadow-lg rounded-xl border border-gray-100 bg-white">
                            <DropdownMenuItem
                              onClick={() => router.push(`/campaigns/${camp.id}`)}
                              className="text-[13px] py-1.5 px-2.5 cursor-pointer flex items-center gap-2"
                            >
                              View Details
                            </DropdownMenuItem>

                            {camp.status !== "Active" && (
                              <DropdownMenuItem
                                onClick={() => activateMutation.mutate(camp.id)}
                                className="text-[13px] py-1.5 px-2.5 cursor-pointer flex items-center gap-2 text-[#027A48]"
                              >
                                <PlayCircle className="size-3.5" />
                                <span>Activate</span>
                              </DropdownMenuItem>
                            )}

                            {camp.status === "Active" && (
                              <DropdownMenuItem
                                onClick={() => pauseMutation.mutate(camp.id)}
                                className="text-[13px] py-1.5 px-2.5 cursor-pointer flex items-center gap-2 text-[#B54708]"
                              >
                                <PauseCircle className="size-3.5" />
                                <span>Pause</span>
                              </DropdownMenuItem>
                            )}

                            {camp.status !== "Completed" && (
                              <DropdownMenuItem
                                onClick={() => endMutation.mutate(camp.id)}
                                className="text-[13px] py-1.5 px-2.5 cursor-pointer flex items-center gap-2 text-[#344054]"
                              >
                                <StopCircle className="size-3.5" />
                                <span>End Campaign</span>
                              </DropdownMenuItem>
                            )}

                            {camp.status !== "Cancelled" && (
                              <DropdownMenuItem
                                onClick={() => cancelMutation.mutate(camp.id)}
                                className="text-[13px] py-1.5 px-2.5 cursor-pointer flex items-center gap-2 text-[#B42318]"
                              >
                                <XCircle className="size-3.5" />
                                <span>Cancel Campaign</span>
                              </DropdownMenuItem>
                            )}

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                              onClick={() => setCampaignToDelete(camp)}
                              className="text-[13px] py-1.5 px-2.5 cursor-pointer text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                              <Trash2 className="size-3.5 text-red-600" />
                              <span>Delete</span>
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
              disabled={currentPage <= 1 || isLoading}
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
              disabled={currentPage >= totalPages || isLoading}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1.5 rounded-lg border border-[#D0D5DD] bg-white text-[13px] font-medium text-[#344054] hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Delete Campaign Modal */}
      <DeleteCampaignModal
        isOpen={Boolean(campaignToDelete)}
        onClose={() => setCampaignToDelete(null)}
        onConfirm={handleDeleteConfirm}
        campaignName={campaignToDelete?.name}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default CampaignsTable;
