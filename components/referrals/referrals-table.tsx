"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  ChevronDown,
  MoreVertical,
  Copy,
  Check,
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useTablePagination } from "@/hooks/use-table-pagination";
import {
  useReferralsList,
  useRedeemReferral,
  useCancelReferral,
} from "@/hooks/use-referrals";
import type { ReferralItem, ReferralStatus } from "@/types/referrals";

export interface ReferralRow {
  id: string;
  code: string;
  provider: string;
  providerInitials: string;
  providerId?: string;
  user: string;
  userId?: string;
  generationDate: string;
  redemptionDate: string;
  status: "Active" | "Redeemed" | "Converted" | "Expired" | "Cancelled" | "Rejected" | "New";
}

function mapApiToReferralRow(item: ReferralItem, idx: number): ReferralRow {
  const code = item.code || "-";

  // Safely extract user name
  let userName = "-";
  let userId: string | undefined = undefined;
  if (typeof item.user === "object" && item.user !== null) {
    userName = item.user.fullName || item.user.name || "-";
    userId = item.user.id;
  } else if (typeof item.user === "string") {
    userName = item.user;
  }

  // Safely extract provider name
  let providerName = "-";
  let providerId: string | undefined = undefined;
  if (typeof item.provider === "object" && item.provider !== null) {
    providerName = item.provider.name || "-";
    providerId = item.provider.id;
  } else if (typeof item.provider === "string") {
    providerName = item.provider;
  }

  const getInitials = (str: string) => {
    if (!str || str === "-") return "U";
    const parts = str.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const providerInitials =
    (typeof item.provider === "object" && item.provider?.initials) ||
    getInitials(providerName);

  const formatDate = (d?: string | null) => {
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

  const generationDate = formatDate(
    item.generationDate || item.dateGenerated || item.createdAt
  );
  const redemptionDate = formatDate(
    item.redemptionDate || item.redeemedAt
  );

  const rawStatus = (item.status || "ACTIVE").toUpperCase();
  const status: ReferralRow["status"] =
    rawStatus === "ACTIVE"
      ? "Active"
      : rawStatus === "REDEEMED"
      ? "Redeemed"
      : rawStatus === "CONVERTED"
      ? "Converted"
      : rawStatus === "EXPIRED"
      ? "Expired"
      : rawStatus === "CANCELLED"
      ? "Cancelled"
      : rawStatus === "REJECTED"
      ? "Rejected"
      : "New";

  return {
    id: item.id || String(idx + 1),
    code,
    provider: providerName,
    providerInitials,
    providerId,
    user: userName,
    userId,
    generationDate,
    redemptionDate,
    status,
  };
}

export const ReferralsTable: React.FC = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All status");
  const [selectedDate, setSelectedDate] = useState("All time");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const { currentPage, setCurrentPage } = useTablePagination();

  const redeemMutation = useRedeemReferral();
  const cancelMutation = useCancelReferral();

  // Debounce search
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

  // Map status filter
  const apiStatus: ReferralStatus | undefined =
    selectedStatus === "Active"
      ? "ACTIVE"
      : selectedStatus === "Redeemed"
      ? "REDEEMED"
      : selectedStatus === "Converted"
      ? "CONVERTED"
      : selectedStatus === "Expired"
      ? "EXPIRED"
      : selectedStatus === "Cancelled"
      ? "CANCELLED"
      : selectedStatus === "Rejected"
      ? "REJECTED"
      : selectedStatus === "New"
      ? "NEW"
      : undefined;

  // Parse date range
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
  const { data: apiResponse, isLoading, isFetching } = useReferralsList({
    page: currentPage,
    pageSize,
    search: debouncedSearch || undefined,
    status: apiStatus,
    from: dateParams.from,
    to: dateParams.to,
  });

  const rawItems = apiResponse?.items || apiResponse?.data;
  const hasApiData = Array.isArray(rawItems);
  const displayList = hasApiData ? rawItems.map(mapApiToReferralRow) : [];

  const totalCount =
    apiResponse?.meta?.total ??
    apiResponse?.total ??
    displayList.length;

  const totalPages =
    apiResponse?.meta?.totalPages ??
    Math.max(1, Math.ceil(totalCount / pageSize));

  const handleCopy = (code: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    }
  };

  const getStatusBadge = (status: ReferralRow["status"]) => {
    switch (status) {
      case "Redeemed":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium bg-[#FDF2FA] text-[#C11574]">
            Redeemed
          </span>
        );
      case "Active":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium bg-[#ECFDF3] text-[#027A48]">
            Active
          </span>
        );
      case "Converted":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium bg-[#EFF8FF] text-[#175CD3]">
            Converted
          </span>
        );
      case "Expired":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium bg-[#FEF6EE] text-[#B54708]">
            Expired
          </span>
        );
      case "Cancelled":
      case "Rejected":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium bg-[#FEF3F2] text-[#B42318]">
            {status}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium bg-[#F2F4F7] text-[#344054]">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#667085]" />
          <input
            type="text"
            placeholder="Search code, user, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-lg border border-[#D0D5DD] bg-white text-[13px] text-[#101828] placeholder:text-[#667085] focus:outline-none focus:border-[#BB1A8C] focus:ring-1 focus:ring-[#BB1A8C] shadow-2xs transition-colors"
          />
        </div>

        {/* Filters */}
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
                "Redeemed",
                "Converted",
                "Expired",
                "Cancelled",
                "Rejected",
                "New",
              ].map((s) => (
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

          {/* Date: All time */}
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-[#D0D5DD] bg-white text-[13px] text-[#344054] hover:bg-gray-50 transition-colors shadow-2xs outline-none cursor-pointer">
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

      {/* Referrals Table Container */}
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
                <th className="py-3 px-6 font-normal">Referral Code</th>
                <th className="py-3 px-6 font-normal">Provider</th>
                <th className="py-3 px-6 font-normal">User</th>
                <th className="py-3 px-6 font-normal">Generation Date</th>
                <th className="py-3 px-6 font-normal">Redemption Date</th>
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
                  <td colSpan={7} className="py-16 text-center text-[#667085]">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="size-6 animate-spin text-[#BB1A8C]" />
                      <span className="text-[13px]">Loading referrals...</span>
                    </div>
                  </td>
                </tr>
              ) : displayList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-[#667085]">
                    No referrals found.
                  </td>
                </tr>
              ) : (
                displayList.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-[#F9FAFB] transition-colors group"
                  >
                    {/* Code with Copy Icon */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="inline-flex items-center gap-2">
                        <Link
                          href={`/referrals/${item.id}`}
                          className="font-medium text-[#101828] hover:text-[#BB1A8C] hover:underline transition-colors"
                        >
                          {item.code}
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleCopy(item.code)}
                          className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                          title="Copy Code"
                        >
                          {copiedCode === item.code ? (
                            <Check className="size-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="size-3.5" />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Provider */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <div className="size-8 rounded-full bg-[#BB1A8C] flex items-center justify-center text-white text-[12px] font-medium shrink-0">
                          {item.providerInitials}
                        </div>
                        {item.providerId ? (
                          <Link
                            href={`/provider/${item.providerId}`}
                            className="font-medium text-[#101828] hover:text-[#BB1A8C] hover:underline transition-colors"
                          >
                            {item.provider}
                          </Link>
                        ) : (
                          <span className="text-[#101828]">{item.provider}</span>
                        )}
                      </div>
                    </td>

                    {/* User */}
                    <td className="py-4 px-6 font-medium text-[#101828] whitespace-nowrap">
                      {item.userId ? (
                        <Link
                          href={`/users/${item.userId}`}
                          className="hover:text-[#BB1A8C] hover:underline transition-colors"
                        >
                          {item.user}
                        </Link>
                      ) : (
                        item.user
                      )}
                    </td>

                    {/* Generation Date */}
                    <td className="py-4 px-6 text-[#475467] whitespace-nowrap">
                      {item.generationDate}
                    </td>

                    {/* Redemption Date */}
                    <td className="py-4 px-6 text-[#475467] whitespace-nowrap">
                      {item.redemptionDate}
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      {getStatusBadge(item.status)}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 whitespace-nowrap text-right">
                      <div className="inline-flex items-center justify-end gap-3">
                        <Link
                          href={`/referrals/${item.id}`}
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
                              onClick={() => router.push(`/referrals/${item.id}`)}
                              className="text-[13px] py-1.5 px-2.5 cursor-pointer"
                            >
                              View Referral
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => handleCopy(item.code)}
                              className="text-[13px] py-1.5 px-2.5 cursor-pointer"
                            >
                              Copy Code
                            </DropdownMenuItem>

                            {item.status === "Active" && (
                              <DropdownMenuItem
                                onClick={() =>
                                  redeemMutation.mutate({ code: item.code })
                                }
                                className="text-[13px] py-1.5 px-2.5 cursor-pointer text-[#027A48] flex items-center gap-2"
                              >
                                <CheckCircle2 className="size-3.5" />
                                <span>Redeem Code</span>
                              </DropdownMenuItem>
                            )}

                            {item.status === "Active" && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() =>
                                    cancelMutation.mutate({ id: item.id })
                                  }
                                  className="text-[13px] py-1.5 px-2.5 cursor-pointer text-[#B42318] flex items-center gap-2"
                                >
                                  <XCircle className="size-3.5" />
                                  <span>Cancel Referral</span>
                                </DropdownMenuItem>
                              </>
                            )}
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
            of {totalCount} referrals
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

export default ReferralsTable;
