"use client";

import React, { useState, useMemo } from "react";
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
import { useAmbassadorUsers, useAmbassadorCampaigns } from "@/hooks/use-ambassadors";
import type { AmbassadorUserItem } from "@/types/ambassadors";

interface IntroducedUserRow {
  id: string;
  user: string;
  campaign: string;
  campaignId?: string;
  type: "Physical" | "Digital";
  referralDate: string;
  referralCode: string;
  action: "Registered" | "Redeemed" | "Pending";
  role: "User" | "Provider" | "Ambassador";
}

function mapApiUser(item: AmbassadorUserItem, idx: number): IntroducedUserRow {
  // Extract user display name safely (handles item.user being an object { id, name, reference })
  let userName = "-";
  if (typeof item.fullName === "string" && item.fullName.trim()) {
    userName = item.fullName.trim();
  } else if (typeof item.name === "string" && item.name.trim()) {
    userName = item.name.trim();
  } else if (typeof item.user === "string" && item.user.trim()) {
    userName = item.user.trim();
  } else if (typeof item.user === "object" && item.user !== null) {
    const userObj = item.user as Record<string, unknown>;
    if (typeof userObj.name === "string" && userObj.name.trim()) {
      userName = userObj.name.trim();
    } else if (typeof userObj.fullName === "string" && userObj.fullName.trim()) {
      userName = userObj.fullName.trim();
    } else if (typeof userObj.reference === "string" && userObj.reference.trim()) {
      userName = userObj.reference.trim();
    }
  }

  // Extract campaign name and ID safely
  let campaignName = "-";
  let campaignId: string | undefined = undefined;
  if (typeof item.campaign === "string" && item.campaign.trim()) {
    campaignName = item.campaign.trim();
  } else if (typeof item.campaign === "object" && item.campaign !== null) {
    const campObj = item.campaign as Record<string, unknown>;
    if (typeof campObj.name === "string" && campObj.name.trim()) {
      campaignName = campObj.name.trim();
    } else if (typeof campObj.title === "string" && campObj.title.trim()) {
      campaignName = campObj.title.trim();
    }
    if (typeof campObj.id === "string" && campObj.id.trim()) {
      campaignId = campObj.id.trim();
    }
  }

  const type =
    (item.type || "PHYSICAL").toUpperCase() === "DIGITAL"
      ? "Digital"
      : "Physical";

  const rawAction =
    typeof item.action === "string" ? item.action.toUpperCase() : "REGISTERED";
  const action: "Registered" | "Redeemed" | "Pending" = rawAction.includes("REDEEM")
    ? "Redeemed"
    : rawAction.includes("PEND")
      ? "Pending"
      : "Registered";

  const role: "User" | "Provider" | "Ambassador" =
    item.role === "Provider"
      ? "Provider"
      : item.role === "Ambassador"
        ? "Ambassador"
        : "User";

  let dateFormatted = "-";
  if (item.referralDate || item.joinedAt) {
    try {
      dateFormatted = new Date(
        (item.referralDate || item.joinedAt)!
      ).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      dateFormatted = "-";
    }
  }

  // Extract referral code or reference safely
  let refCode = "-";
  if (typeof item.referralCode === "string" && item.referralCode.trim()) {
    refCode = item.referralCode.trim();
  } else if (typeof item.reference === "string" && item.reference.trim()) {
    refCode = item.reference.trim();
  } else if (typeof item.user === "object" && item.user !== null) {
    const userObj = item.user as Record<string, unknown>;
    if (typeof userObj.reference === "string" && userObj.reference.trim()) {
      refCode = userObj.reference.trim();
    }
  }

  // Extract row id safely
  let rowId = String(idx + 1);
  if (typeof item.id === "string" && item.id.trim()) {
    rowId = item.id.trim();
  } else if (typeof item.user === "object" && item.user !== null) {
    const userObj = item.user as Record<string, unknown>;
    if (typeof userObj.id === "string" && userObj.id.trim()) {
      rowId = userObj.id.trim();
    }
  }

  return {
    id: rowId,
    user: userName,
    campaign: campaignName,
    campaignId,
    type,
    referralDate: dateFormatted,
    referralCode: refCode,
    action,
    role,
  };
}

export const AmbassadorUsersIntroducedTab: React.FC<{ id?: string }> = ({
  id = "",
}) => {
  const router = useRouter();
  const [selectedAction, setSelectedAction] = useState("All actions");
  const [selectedCampaign, setSelectedCampaign] = useState<{
    id?: string;
    name: string;
  }>({ name: "All campaigns" });
  const [selectedSource, setSelectedSource] = useState("All source");
  const [selectedDate, setSelectedDate] = useState("May 2023 – May 2024");
  const { currentPage, setCurrentPage } = useTablePagination();

  // Load ambassador campaigns to resolve campaign IDs for server filtering
  const { data: campaignsData } = useAmbassadorCampaigns(id, { pageSize: 100 });
  const rawCampaigns = campaignsData?.items || campaignsData?.data || [];

  // Parse date range for server-side query params (from, to)
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
  // Send campaignId and date range directly to GET /v1/admin/ambassadors/{id}/users
  const { data: apiResponse, isLoading } = useAmbassadorUsers(id, {
    page: currentPage,
    pageSize,
    campaignId: selectedCampaign.id,
    from: dateParams.from,
    to: dateParams.to,
  });

  const rawItems = apiResponse?.items || apiResponse?.data;
  const hasApiData = Array.isArray(rawItems);

  const displayList = hasApiData
    ? rawItems.map(mapApiUser)
    : [];

  const campaignOptions = useMemo(() => {
    const list: Array<{ id?: string; name: string }> = [
      { name: "All campaigns" },
    ];
    rawCampaigns.forEach((c) => {
      const name = c.name || c.campaign;
      if (name && !list.some((x) => x.name.toLowerCase() === name.toLowerCase())) {
        list.push({ id: c.id, name });
      }
    });
    displayList.forEach((u) => {
      if (
        u.campaign &&
        u.campaign !== "-" &&
        !list.some((x) => x.name.toLowerCase() === u.campaign.toLowerCase())
      ) {
        list.push({ id: u.campaignId, name: u.campaign });
      }
    });
    return list;
  }, [rawCampaigns, displayList]);

  // Filtering (sync with server and apply action/source filters)
  const filteredUsers = displayList.filter((u) => {
    const matchesAction =
      selectedAction === "All actions" ||
      u.action.toLowerCase() === selectedAction.toLowerCase();
    const matchesCampaign =
      selectedCampaign.name === "All campaigns" ||
      u.campaign.toLowerCase() === selectedCampaign.name.toLowerCase();
    const matchesSource =
      selectedSource === "All source" ||
      u.type.toLowerCase() === selectedSource.toLowerCase();
    return matchesAction && matchesCampaign && matchesSource;
  });

  const totalCount = filteredUsers.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="space-y-4">
      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Show: All actions */}
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-[#D0D5DD] bg-white text-[13px] text-[#344054] hover:bg-gray-50 transition-colors shadow-2xs outline-none cursor-pointer">
              <span className="text-[#667085]">Show:</span>
              <span className="font-medium">{selectedAction}</span>
              <ChevronDown className="size-3.5 text-[#667085]" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-44">
              {["All actions", "Registered", "Redeemed", "Pending"].map((act) => (
                <DropdownMenuItem
                  key={act}
                  onClick={() => {
                    setSelectedAction(act);
                    setCurrentPage(1);
                  }}
                  className="text-[13px] cursor-pointer"
                >
                  {act}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Show: All campaigns */}
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-[#D0D5DD] bg-white text-[13px] text-[#344054] hover:bg-gray-50 transition-colors shadow-2xs outline-none cursor-pointer">
              <span className="text-[#667085]">Show:</span>
              <span className="font-medium truncate max-w-30">
                {selectedCampaign.name}
              </span>
              <ChevronDown className="size-3.5 text-[#667085]" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-52">
              {campaignOptions.map((c) => (
                <DropdownMenuItem
                  key={c.name}
                  onClick={() => {
                    setSelectedCampaign(c);
                    setCurrentPage(1);
                  }}
                  className="text-[13px] cursor-pointer"
                >
                  {c.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Show: All source */}
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-[#D0D5DD] bg-white text-[13px] text-[#344054] hover:bg-gray-50 transition-colors shadow-2xs outline-none cursor-pointer">
              <span className="text-[#667085]">Show:</span>
              <span className="font-medium">{selectedSource}</span>
              <ChevronDown className="size-3.5 text-[#667085]" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-44">
              {["All source", "Physical", "Digital"].map((s) => (
                <DropdownMenuItem
                  key={s}
                  onClick={() => {
                    setSelectedSource(s);
                    setCurrentPage(1);
                  }}
                  className="text-[13px] cursor-pointer"
                >
                  {s}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Date */}
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-[#D0D5DD] bg-white text-[13px] text-[#344054] hover:bg-gray-50 transition-colors shadow-2xs outline-none cursor-pointer">
              <span className="text-[#667085]">Date:</span>
              <span className="font-medium">{selectedDate}</span>
              <ChevronDown className="size-3.5 text-[#667085]" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              {[
                "May 2023 – May 2024",
                "Last 30 Days",
                "Last 90 Days",
                "Year to Date",
                "All Time",
              ].map((d) => (
                <DropdownMenuItem
                  key={d}
                  onClick={() => setSelectedDate(d)}
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
      <div className="w-full rounded-2xl border border-[#EAECF0] bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px] border-collapse">
            <thead>
              <tr className="border-b border-[#EAECF0] bg-[#FAFAFC] text-[12px] font-normal text-[#667085]">
                <th className="py-3 px-6 font-normal">User</th>
                <th className="py-3 px-6 font-normal">Campaign</th>
                <th className="py-3 px-6 font-normal">Type</th>
                <th className="py-3 px-6 font-normal">Referral Date</th>
                <th className="py-3 px-6 font-normal">Referral Code</th>
                <th className="py-3 px-6 font-normal">Action</th>
                <th className="py-3 px-6 font-normal">Role</th>
                <th className="py-3 px-6 font-normal text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#EAECF0]">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#667085]">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="size-6 animate-spin text-[#BB1A8C]" />
                      <span className="text-[13px]">Loading introduced users...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#667085]">
                    No introduced users found.
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((u) => (
                  <tr
                    key={u.id}
                    className="hover:bg-[#F9FAFB] transition-colors group"
                  >
                    <td className="py-4 px-6 font-medium text-[#101828] whitespace-nowrap">
                      {u.user}
                    </td>
                    <td className="py-4 px-6 text-[#344054] whitespace-nowrap">
                      {u.campaign}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      {u.type === "Physical" ? (
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
                      {u.referralDate}
                    </td>
                    <td className="py-4 px-6 text-[#101828] font-mono text-[12px] whitespace-nowrap">
                      {u.referralCode}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      {u.action === "Registered" && (
                        <span className="inline-flex items-center px-3 py-0.5 rounded-full text-[12px] font-medium bg-[#ECFDF3] text-[#027A48]">
                          Registered
                        </span>
                      )}
                      {u.action === "Redeemed" && (
                        <span className="inline-flex items-center px-3 py-0.5 rounded-full text-[12px] font-medium bg-[#EFF8FF] text-[#175CD3]">
                          Redeemed
                        </span>
                      )}
                      {u.action === "Pending" && (
                        <span className="inline-flex items-center px-3 py-0.5 rounded-full text-[12px] font-medium bg-[#FEF6EE] text-[#F79009]">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-[#344054] whitespace-nowrap">
                      {u.role}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap text-right">
                      <div className="inline-flex items-center justify-end gap-3">
                        <Link
                          href={`/users/${u.id}`}
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
                              onClick={() => router.push(`/users/${u.id}`)}
                              className="text-[13px] cursor-pointer"
                            >
                              View User
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
            {totalCount === 0
              ? "0"
              : `${(currentPage - 1) * pageSize + 1}–${Math.min(
                currentPage * pageSize,
                totalCount
              )}`}{" "}
            of {totalCount} users
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

export default AmbassadorUsersIntroducedTab;
