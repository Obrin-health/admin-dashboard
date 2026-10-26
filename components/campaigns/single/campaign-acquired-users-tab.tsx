"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { ChevronDown, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useTablePagination } from "@/hooks/use-table-pagination";
import {
  useCampaignUsers,
  useCampaignAmbassadors,
} from "@/hooks/use-campaigns";
import type { CampaignUserItem } from "@/types/campaigns";

interface CampaignAcquiredUsersTabProps {
  id: string;
}

interface AcquiredUserRow {
  id: string;
  userIntroduced: string;
  ambassador: string;
  ambassadorId?: string;
  referralCode: string;
  dateJoined: string;
  role: string;
}

function mapApiToAcquiredUserRow(
  item: CampaignUserItem,
  idx: number
): AcquiredUserRow {
  let userName = "-";
  if (typeof item.userIntroduced === "string" && item.userIntroduced.trim()) {
    userName = item.userIntroduced.trim();
  } else if (typeof item.fullName === "string" && item.fullName.trim()) {
    userName = item.fullName.trim();
  } else if (typeof item.name === "string" && item.name.trim()) {
    userName = item.name.trim();
  } else if (typeof item.user === "object" && item.user !== null) {
    userName = item.user.fullName || item.user.name || "-";
  }

  let ambName = "-";
  let ambId: string | undefined = undefined;
  if (typeof item.ambassador === "string" && item.ambassador.trim()) {
    ambName = item.ambassador.trim();
  } else if (
    typeof item.ambassadorName === "string" &&
    item.ambassadorName.trim()
  ) {
    ambName = item.ambassadorName.trim();
  } else if (typeof item.ambassador === "object" && item.ambassador !== null) {
    ambName = item.ambassador.fullName || item.ambassador.name || "-";
    ambId = item.ambassador.id;
  }

  const refCode =
    item.referralCode ||
    (typeof item.user === "object" && item.user?.reference) ||
    "-";

  const formatDate = (d?: string) => {
    if (!d) return "-";
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

  const dateJoined = formatDate(
    item.dateJoined || item.referralDate || item.createdAt
  );

  return {
    id: item.id || String(idx + 1),
    userIntroduced: userName,
    ambassador: ambName,
    ambassadorId: ambId,
    referralCode: refCode,
    dateJoined,
    role: item.role || "Member",
  };
}

export const CampaignAcquiredUsersTab: React.FC<CampaignAcquiredUsersTabProps> = ({
  id,
}) => {
  const [selectedAmbassador, setSelectedAmbassador] = useState<{
    id?: string;
    name: string;
  }>({ name: "All ambassadors" });
  const [selectedDate, setSelectedDate] = useState("All time");

  const { currentPage, setCurrentPage } = useTablePagination({
    paramName: "acqPage",
  });

  // Load ambassadors for the dropdown filter
  const { data: ambResponse } = useCampaignAmbassadors(id, { pageSize: 100 });
  const rawAmbassadors = ambResponse?.items || ambResponse?.data || [];

  const ambassadorOptions = useMemo(() => {
    const list: Array<{ id?: string; name: string }> = [
      { name: "All ambassadors" },
    ];
    rawAmbassadors.forEach((a) => {
      const name = a.fullName || a.name || a.ambassadorName;
      if (name && !list.some((x) => x.name.toLowerCase() === name.toLowerCase())) {
        list.push({ id: a.ambassadorId || a.id, name });
      }
    });
    return list;
  }, [rawAmbassadors]);

  // Parse date range for server query params
  const dateParams = useMemo<{ from?: string; to?: string }>(() => {
    const now = new Date();
    if (selectedDate === "Last 30 Days") {
      return {
        from: new Date(now.getTime() - 30 * 86400000).toISOString(),
        to: now.toISOString(),
      };
    }
    if (selectedDate === "Last 90 Days") {
      return {
        from: new Date(now.getTime() - 90 * 86400000).toISOString(),
        to: now.toISOString(),
      };
    }
    if (selectedDate === "Year to Date") {
      return {
        from: new Date(now.getFullYear(), 0, 1).toISOString(),
        to: now.toISOString(),
      };
    }
    return {};
  }, [selectedDate]);

  const pageSize = 10;
  const { data: apiResponse, isLoading, isFetching } = useCampaignUsers(id, {
    page: currentPage,
    pageSize,
    ambassadorId: selectedAmbassador.id,
    from: dateParams.from,
    to: dateParams.to,
  });

  const rawItems = apiResponse?.items || apiResponse?.data;
  const hasApiData = Array.isArray(rawItems);
  const displayList = hasApiData ? rawItems.map(mapApiToAcquiredUserRow) : [];

  const totalCount =
    apiResponse?.meta?.total ??
    apiResponse?.total ??
    displayList.length;

  const totalPages =
    apiResponse?.meta?.totalPages ??
    Math.max(1, Math.ceil(totalCount / pageSize));

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <div className="flex items-center gap-3">
          <h3 className="text-[18px] font-bold text-[#101828]">
            Recent Campaign Acquired Users
          </h3>
          {isFetching && !isLoading && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FDF2FA] text-[12px] font-medium text-[#BB1A8C]">
              <Loader2 className="size-3.5 animate-spin" />
              <span>Updating...</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Show: All ambassadors */}
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-[#D0D5DD] bg-white text-[13px] text-[#344054] hover:bg-gray-50 transition-colors shadow-2xs outline-none cursor-pointer">
              <span className="text-[#667085]">Ambassador:</span>
              <span className="font-medium truncate max-w-35">
                {selectedAmbassador.name}
              </span>
              <ChevronDown className="size-3.5 text-[#667085]" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52 max-h-60 overflow-y-auto">
              {ambassadorOptions.map((amb) => (
                <DropdownMenuItem
                  key={amb.name}
                  onClick={() => {
                    setSelectedAmbassador(amb);
                    setCurrentPage(1);
                  }}
                  className="text-[13px] cursor-pointer"
                >
                  {amb.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Date Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-[#D0D5DD] bg-white text-[13px] text-[#344054] hover:bg-gray-50 transition-colors shadow-2xs outline-none cursor-pointer">
              <span className="text-[#667085]">Date:</span>
              <span className="font-medium">{selectedDate}</span>
              <ChevronDown className="size-3.5 text-[#667085]" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {[
                "All time",
                "Last 30 Days",
                "Last 90 Days",
                "Year to Date",
              ].map((d) => (
                <DropdownMenuItem
                  key={d}
                  onClick={() => {
                    setSelectedDate(d);
                    setCurrentPage(1);
                  }}
                  className="text-[13px] cursor-pointer"
                >
                  {d}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
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
                <th className="py-3 px-6 font-normal">User Introduced</th>
                <th className="py-3 px-6 font-normal">Ambassador</th>
                <th className="py-3 px-6 font-normal">Referral Code</th>
                <th className="py-3 px-6 font-normal">Date Joined</th>
                <th className="py-3 px-6 font-normal">Role</th>
              </tr>
            </thead>

            <tbody
              className={`divide-y divide-[#EAECF0] transition-opacity duration-200 ${isFetching && !isLoading ? "opacity-60" : ""
                }`}
            >
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-[#667085]">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="size-6 animate-spin text-[#BB1A8C]" />
                      <span className="text-[13px]">
                        Loading acquired users...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : displayList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-[#667085]">
                    No acquired users found for this campaign.
                  </td>
                </tr>
              ) : (
                displayList.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-[#F9FAFB] transition-colors group"
                  >
                    <td className="py-4 px-6 font-medium text-[#101828] whitespace-nowrap">
                      {row.userIntroduced}
                    </td>

                    <td className="py-4 px-6 text-[#101828] whitespace-nowrap">
                      {row.ambassadorId ? (
                        <Link
                          href={`/ambassadors/${row.ambassadorId}`}
                          className="hover:text-[#BB1A8C] hover:underline transition-colors"
                        >
                          {row.ambassador}
                        </Link>
                      ) : (
                        row.ambassador
                      )}
                    </td>

                    <td className="py-4 px-6 text-[#667085] whitespace-nowrap">
                      {row.referralCode}
                    </td>

                    <td className="py-4 px-6 text-[#667085] whitespace-nowrap">
                      {row.dateJoined}
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#F2F4F7] text-[#344054]">
                        {row.role}
                      </span>
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
            of {totalCount} users
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
    </div>
  );
};

export default CampaignAcquiredUsersTab;
