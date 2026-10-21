"use client";

import React, { useState } from "react";
import {
  ChevronDown,
  MoreVertical,
  Copy,
  Check,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useProviderReferrals } from "@/hooks/use-providers";
import { useTablePagination } from "@/hooks/use-table-pagination";

interface ProviderReferralsTableProps {
  providerId: string;
}

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return "-";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function getInitials(name?: string | null): string {
  if (!name) return "U";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export const ProviderReferralsTable: React.FC<ProviderReferralsTableProps> = ({
  providerId,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>("All status");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const { currentPage, setCurrentPage } = useTablePagination({
    paramName: "refPage",
  });
  const pageSize = 10;

  const apiStatus =
    selectedStatus === "Redeemed"
      ? "REDEEMED"
      : selectedStatus === "Active"
      ? "ACTIVE"
      : selectedStatus === "Converted"
      ? "CONVERTED"
      : selectedStatus === "Expired"
      ? "EXPIRED"
      : undefined;

  const { data, isLoading, isFetching } = useProviderReferrals(providerId, {
    page: currentPage,
    pageSize,
    status: apiStatus,
  });

  const referrals = data?.data || [];
  const meta = data?.meta || {
    page: currentPage,
    pageSize,
    total: 0,
    totalPages: 1,
  };

  const handleCopyCode = (code: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    }
  };

  return (
    <div className="space-y-4 pt-2">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-bold text-[#101828]">Recent Referrals</h3>
          {isFetching && !isLoading && (
            <Loader2 className="w-4 h-4 text-primary animate-spin" />
          )}
        </div>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-2.5 self-end sm:self-auto flex-wrap">
          {/* Status Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gray-200 bg-white text-xs text-[#667085] hover:bg-gray-50 transition-colors cursor-pointer outline-none">
              <span>
                Status:{" "}
                <strong className="text-[#101828] font-medium">
                  {selectedStatus}
                </strong>
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-[#667085]" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              {["All status", "Redeemed", "Active", "Converted", "Expired"].map(
                (status) => (
                  <DropdownMenuItem
                    key={status}
                    onClick={() => {
                      setSelectedStatus(status);
                      setCurrentPage(1);
                    }}
                    className="cursor-pointer"
                  >
                    {status}
                  </DropdownMenuItem>
                )
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Referrals Table Card */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-[#FAFAFC]">
                <th className="py-3.5 px-6 text-[12px] font-semibold text-[#667085] uppercase tracking-wider">
                  Referral Code
                </th>
                <th className="py-3.5 px-6 text-[12px] font-semibold text-[#667085] uppercase tracking-wider">
                  User
                </th>
                <th className="py-3.5 px-6 text-[12px] font-semibold text-[#667085] uppercase tracking-wider">
                  Location
                </th>
                <th className="py-3.5 px-6 text-[12px] font-semibold text-[#667085] uppercase tracking-wider">
                  Ambassador
                </th>
                <th className="py-3.5 px-6 text-[12px] font-semibold text-[#667085] uppercase tracking-wider">
                  Campaign
                </th>
                <th className="py-3.5 px-6 text-[12px] font-semibold text-[#667085] uppercase tracking-wider">
                  Date Generated
                </th>
                <th className="py-3.5 px-6 text-[12px] font-semibold text-[#667085] uppercase tracking-wider">
                  Status
                </th>
                <th className="py-3.5 px-6 text-[12px] font-semibold text-[#667085] uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-[14px]">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-4 px-6">
                      <div className="h-4 w-20 bg-gray-200 rounded" />
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-gray-200" />
                        <div className="h-4 w-24 bg-gray-200 rounded" />
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="h-4 w-16 bg-gray-200 rounded" />
                    </td>
                    <td className="py-4 px-6">
                      <div className="h-4 w-24 bg-gray-200 rounded" />
                    </td>
                    <td className="py-4 px-6">
                      <div className="h-4 w-24 bg-gray-200 rounded" />
                    </td>
                    <td className="py-4 px-6">
                      <div className="h-4 w-20 bg-gray-200 rounded" />
                    </td>
                    <td className="py-4 px-6">
                      <div className="h-5 w-16 bg-gray-200 rounded-full" />
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="h-4 w-12 bg-gray-200 rounded ml-auto" />
                    </td>
                  </tr>
                ))
              ) : referrals.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#8A9BA8]">
                    <div className="flex flex-col items-center justify-center gap-1.5">
                      <p className="text-sm font-medium text-[#101828]">
                        No referrals found
                      </p>
                      <p className="text-xs text-[#667085]">
                        This provider has not recorded any referrals matching the current criteria.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                referrals.map((item) => {
                  const userName =
                    item.user?.name || item.user?.reference || "Guest";
                  const statusUpper = (item.status || "").toUpperCase();

                  let statusBadge = (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#FFFAEB] text-[#B54708]">
                      {item.status || "Pending"}
                    </span>
                  );

                  if (statusUpper === "REDEEMED") {
                    statusBadge = (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#ECFDF3] text-[#027A48]">
                        Redeemed
                      </span>
                    );
                  } else if (statusUpper === "CONVERTED") {
                    statusBadge = (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#F0F9FF] text-[#026AA2]">
                        Converted
                      </span>
                    );
                  } else if (
                    statusUpper === "EXPIRED" ||
                    statusUpper === "CANCELLED" ||
                    statusUpper === "REJECTED"
                  ) {
                    statusBadge = (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#FEF3F2] text-[#B42318]">
                        {item.status}
                      </span>
                    );
                  }

                  const isCopied = copiedCode === item.code;

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50/60 transition-colors"
                    >
                      {/* Code */}
                      <td className="py-4 px-6 font-semibold text-[#101828]">
                        <span className="font-mono text-xs sm:text-sm">
                          {item.code}
                        </span>
                      </td>

                      {/* User */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-xs shrink-0 border border-primary/20">
                            {getInitials(userName)}
                          </div>
                          <span className="font-medium text-[#101828]">
                            {userName}
                          </span>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="py-4 px-6 text-[#253B4B]">
                        {item.location || "-"}
                      </td>

                      {/* Ambassador */}
                      <td className="py-4 px-6 text-[#253B4B]">
                        {item.ambassador?.fullName || "-"}
                      </td>

                      {/* Campaign */}
                      <td className="py-4 px-6 text-[#253B4B]">
                        {item.campaign?.name || "-"}
                      </td>

                      {/* Date */}
                      <td className="py-4 px-6 text-[#253B4B]">
                        {formatDate(item.dateGenerated)}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">{statusBadge}</td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleCopyCode(item.code)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium text-primary hover:bg-primary/5 transition-colors cursor-pointer"
                            title="Copy referral code"
                          >
                            {isCopied ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-green-600" />
                                <span className="text-green-600">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-gray-100 bg-white">
          <span suppressHydrationWarning className="text-[13px] text-[#667085]">
            Page {meta.page} of {meta.totalPages || 1}
            {meta.total > 0 && ` (${meta.total} total)`}
          </span>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              disabled={currentPage <= 1 || isLoading}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-4 py-1.5 rounded-xl border border-gray-200 text-[13px] font-medium text-[#253B4B] hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={currentPage >= meta.totalPages || isLoading}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-4 py-1.5 rounded-xl border border-gray-200 text-[13px] font-medium text-[#253B4B] hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderReferralsTable;
