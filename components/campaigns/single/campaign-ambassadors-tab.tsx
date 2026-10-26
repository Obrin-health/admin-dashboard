"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MoreVertical, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { RemoveAmbassadorModal } from "@/components/campaigns/remove-ambassador-modal";
import { useTablePagination } from "@/hooks/use-table-pagination";
import {
  useCampaignAmbassadors,
  useRemoveCampaignAmbassador,
} from "@/hooks/use-campaigns";
import type { CampaignAmbassadorItem } from "@/types/campaigns";

interface CampaignAmbassadorsTabProps {
  id: string;
}

interface CampaignAmbassadorRow {
  id: string;
  ambassadorId: string;
  ambassadorName: string;
  totalUsersIntroduced: number;
  referralLink: string;
  dateAdded: string;
  addedBy: string;
  avatarUrl?: string | null;
}

function mapApiToAmbassadorRow(
  item: CampaignAmbassadorItem,
  idx: number
): CampaignAmbassadorRow {
  // Safely resolve ambassador name
  let name = "Ambassador";
  if (typeof item.fullName === "string" && item.fullName.trim()) {
    name = item.fullName.trim();
  } else if (typeof item.name === "string" && item.name.trim()) {
    name = item.name.trim();
  } else if (typeof item.ambassadorName === "string" && item.ambassadorName.trim()) {
    name = item.ambassadorName.trim();
  } else if (typeof item.ambassador === "object" && item.ambassador !== null) {
    const ambObj = item.ambassador as Record<string, unknown>;
    if (typeof ambObj.fullName === "string" && ambObj.fullName.trim()) {
      name = ambObj.fullName.trim();
    } else if (typeof ambObj.name === "string" && ambObj.name.trim()) {
      name = ambObj.name.trim();
    }
  } else if (typeof item.user === "object" && item.user !== null) {
    const userObj = item.user as Record<string, unknown>;
    if (typeof userObj.fullName === "string" && userObj.fullName.trim()) {
      name = userObj.fullName.trim();
    } else if (typeof userObj.name === "string" && userObj.name.trim()) {
      name = userObj.name.trim();
    }
  }

  // Safely resolve ambassadorId
  let ambId = "";
  if (typeof item.ambassadorId === "string" && item.ambassadorId.trim()) {
    ambId = item.ambassadorId.trim();
  } else if (typeof item.ambassador === "object" && item.ambassador !== null) {
    const ambObj = item.ambassador as Record<string, unknown>;
    if (typeof ambObj.id === "string" && ambObj.id.trim()) {
      ambId = ambObj.id.trim();
    }
  } else if (typeof item.id === "string" && item.id.trim()) {
    ambId = item.id.trim();
  }
  if (!ambId) ambId = String(idx + 1);

  const users =
    typeof item.totalUsersIntroduced === "number"
      ? item.totalUsersIntroduced
      : typeof item.usersIntroduced === "number"
      ? item.usersIntroduced
      : 0;

  const formatDate = (d?: unknown) => {
    if (!d || typeof d !== "string") return "-";
    try {
      const parsed = new Date(d);
      if (isNaN(parsed.getTime())) return "-";
      return parsed.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "-";
    }
  };

  let referralLink = "-";
  if (typeof item.referralLink === "string" && item.referralLink.trim()) {
    referralLink = item.referralLink.trim();
  } else if (typeof item.code === "string" && item.code.trim()) {
    referralLink = `obrin.health/join/${item.code.trim()}`;
  } else if (typeof item.ambassador === "object" && item.ambassador !== null) {
    const ambObj = item.ambassador as Record<string, unknown>;
    if (typeof ambObj.code === "string" && ambObj.code.trim()) {
      referralLink = `obrin.health/join/${ambObj.code.trim()}`;
    }
  }

  // Safely extract addedBy (backend returns object { id, fullName } or string)
  let addedBy = "-";
  if (typeof item.addedBy === "string" && item.addedBy.trim()) {
    addedBy = item.addedBy.trim();
  } else if (typeof item.addedBy === "object" && item.addedBy !== null) {
    const obj = item.addedBy as Record<string, unknown>;
    if (typeof obj.fullName === "string" && obj.fullName.trim()) {
      addedBy = obj.fullName.trim();
    } else if (typeof obj.name === "string" && obj.name.trim()) {
      addedBy = obj.name.trim();
    } else if (typeof obj.email === "string" && obj.email.trim()) {
      addedBy = obj.email.trim();
    }
  }

  // Safely extract avatarUrl
  let avatarUrl: string | null = null;
  if (typeof item.avatarUrl === "string") avatarUrl = item.avatarUrl;
  else if (typeof item.photoUrl === "string") avatarUrl = item.photoUrl;
  else if (typeof item.ambassador === "object" && item.ambassador !== null) {
    const ambObj = item.ambassador as Record<string, unknown>;
    if (typeof ambObj.avatarUrl === "string") avatarUrl = ambObj.avatarUrl;
    else if (typeof ambObj.photoUrl === "string") avatarUrl = ambObj.photoUrl;
  }

  return {
    id: typeof item.id === "string" ? item.id : ambId,
    ambassadorId: ambId,
    ambassadorName: name,
    totalUsersIntroduced: users,
    referralLink,
    dateAdded: formatDate(item.dateAdded || item.createdAt),
    addedBy,
    avatarUrl,
  };
}

export const CampaignAmbassadorsTab: React.FC<CampaignAmbassadorsTabProps> = ({
  id,
}) => {
  const router = useRouter();
  const { currentPage, setCurrentPage } = useTablePagination({
    paramName: "ambPage",
  });
  const [selectedAmbassadorToRemove, setSelectedAmbassadorToRemove] =
    useState<CampaignAmbassadorRow | null>(null);

  const pageSize = 10;
  const { data: apiResponse, isLoading, isFetching } = useCampaignAmbassadors(
    id,
    {
      page: currentPage,
      pageSize,
    }
  );

  const removeMutation = useRemoveCampaignAmbassador();

  const rawItems = apiResponse?.items || apiResponse?.data;
  const hasApiData = Array.isArray(rawItems);
  const displayList = hasApiData ? rawItems.map(mapApiToAmbassadorRow) : [];

  const totalCount =
    apiResponse?.meta?.total ??
    apiResponse?.total ??
    displayList.length;

  const totalPages =
    apiResponse?.meta?.totalPages ??
    Math.max(1, Math.ceil(totalCount / pageSize));

  const handleConfirmRemove = async () => {
    if (!selectedAmbassadorToRemove) return;
    try {
      await removeMutation.mutateAsync({
        id,
        ambassadorId: selectedAmbassadorToRemove.ambassadorId,
      });
      setSelectedAmbassadorToRemove(null);
    } catch {
      // Handled
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <div className="flex items-center gap-3">
          <h3 className="text-[18px] font-bold text-[#101828]">
            Campaign Ambassadors
          </h3>
          {isFetching && !isLoading && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FDF2FA] text-[12px] font-medium text-[#BB1A8C]">
              <Loader2 className="size-3.5 animate-spin" />
              <span>Updating...</span>
            </div>
          )}
        </div>
      </div>

      {/* Table Container */}
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
                <th className="py-3 px-6 font-normal">Ambassador</th>
                <th className="py-3 px-6 font-normal">Total Users Introduced</th>
                <th className="py-3 px-6 font-normal">Referral Link</th>
                <th className="py-3 px-6 font-normal">Date Added</th>
                <th className="py-3 px-6 font-normal">Added By</th>
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
                      <span className="text-[13px]">
                        Loading ambassadors...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : displayList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-[#667085]">
                    No ambassadors assigned to this campaign.
                  </td>
                </tr>
              ) : (
                displayList.map((amb) => (
                  <tr
                    key={amb.id}
                    className="hover:bg-[#F9FAFB] transition-colors group"
                  >
                    <td className="py-4 px-6 font-medium text-[#101828] whitespace-nowrap">
                      <Link
                        href={`/ambassadors/${amb.ambassadorId}`}
                        className="hover:text-[#BB1A8C] hover:underline transition-colors"
                      >
                        {amb.ambassadorName}
                      </Link>
                    </td>

                    <td className="py-4 px-6 font-medium text-[#101828] whitespace-nowrap">
                      {amb.totalUsersIntroduced.toLocaleString()}
                    </td>

                    <td className="py-4 px-6 text-[#667085] whitespace-nowrap">
                      {amb.referralLink}
                    </td>

                    <td className="py-4 px-6 text-[#667085] whitespace-nowrap">
                      {amb.dateAdded}
                    </td>

                    <td className="py-4 px-6 text-[#667085] whitespace-nowrap">
                      {amb.addedBy}
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap text-right">
                      <div className="inline-flex items-center justify-end gap-3">
                        <Link
                          href={`/ambassadors/${amb.ambassadorId}`}
                          className="text-[12px] font-semibold text-[#BB1A8C] hover:text-[#9B1373] hover:underline transition-colors"
                        >
                          View
                        </Link>
                        <DropdownMenu>
                          <DropdownMenuTrigger className="p-1 rounded-md hover:bg-gray-100 text-[#667085] transition-colors cursor-pointer outline-none">
                            <MoreVertical className="size-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 p-1.5 shadow-lg rounded-xl border border-gray-100 bg-white">
                            <DropdownMenuItem
                              onClick={() => router.push(`/ambassadors/${amb.ambassadorId}`)}
                              className="text-[13px] py-1.5 px-2.5 cursor-pointer"
                            >
                              View Ambassador
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setSelectedAmbassadorToRemove(amb)}
                              className="text-[13px] py-1.5 px-2.5 cursor-pointer text-red-600 hover:bg-red-50"
                            >
                              Remove from Campaign
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
            of {totalCount} ambassadors
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

      {/* Remove Ambassador Modal */}
      <RemoveAmbassadorModal
        isOpen={Boolean(selectedAmbassadorToRemove)}
        onClose={() => setSelectedAmbassadorToRemove(null)}
        onConfirm={handleConfirmRemove}
        ambassadorName={selectedAmbassadorToRemove?.ambassadorName}
        avatarUrl={selectedAmbassadorToRemove?.avatarUrl}
        isLoading={removeMutation.isPending}
      />
    </div>
  );
};

export default CampaignAmbassadorsTab;
