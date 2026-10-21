"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useUserReferrals } from "@/hooks/use-users";
import { useTablePagination } from "@/hooks/use-table-pagination";

interface UserRecentReferralsProps {
  userId: string;
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
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

export const UserRecentReferrals: React.FC<UserRecentReferralsProps> = ({
  userId,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>("All status");
  const { currentPage, setCurrentPage } = useTablePagination({ paramName: "refPage" });
  const pageSize = 10;

  const apiStatus = selectedStatus === "All status" ? undefined : selectedStatus;

  const { data, isLoading, isFetching } = useUserReferrals(userId, {
    page: currentPage,
    pageSize,
    status: apiStatus,
  });

  const referrals = data?.data || [];
  const meta = data?.meta || {
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 1,
  };
  const totalPages = Math.max(1, meta.totalPages);

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case "ACTIVE":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#ECFDF3] text-[#027A48]">
            Active
          </span>
        );
      case "CONVERTED":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#F4EBFF] text-[#6941C6]">
            Converted
          </span>
        );
      case "REDEEMED":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#EFF8FF] text-[#175CD3]">
            Redeemed
          </span>
        );
      case "EXPIRED":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#FEF3F2] text-[#B42318]">
            Expired
          </span>
        );
      case "CANCELLED":
      case "REJECTED":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#F2F4F7] text-[#344054]">
            {status}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#F2F4F7] text-[#344054]">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="w-full space-y-4 pt-4">
      {/* Header and Filter Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h3 className="text-[18px] font-bold text-[#101828]">
            Recent Referrals
          </h3>
          {isFetching && !isLoading && (
            <div className="flex items-center gap-1.5 text-[12px] text-[#BB1A8C]">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Updating...</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center gap-1.5 px-3.5 py-2 text-[12px] md:text-[13px] font-normal text-[#344054] bg-white border border-[#D0D5DD] rounded-xl hover:bg-gray-50 transition-colors shadow-2xs cursor-pointer">
              <span>Status:</span>
              <strong className="font-semibold text-[#101828]">
                {selectedStatus}
              </strong>
              <ChevronDown className="size-3.5 text-[#667085]" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="z-50">
              {[
                "All status",
                "ACTIVE",
                "REDEEMED",
                "CONVERTED",
                "EXPIRED",
                "CANCELLED",
                "REJECTED",
              ].map((s) => (
                <DropdownMenuItem
                  key={s}
                  onClick={() => {
                    setSelectedStatus(s);
                    setCurrentPage(1);
                  }}
                  className={`text-[13px] cursor-pointer ${
                    selectedStatus === s ? "font-semibold text-[#BB1A8C]" : ""
                  }`}
                >
                  {s}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Referrals Table Container */}
      <div className="rounded-2xl border border-[#EAECF0] bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#EAECF0] bg-white text-[12px] font-normal text-[#667085]">
                <th className="py-3.5 px-6 font-normal">Referral Code</th>
                <th className="py-3.5 px-6 font-normal">Provider</th>
                <th className="py-3.5 px-6 font-normal">Location</th>
                <th className="py-3.5 px-6 font-normal">Generation Date</th>
                <th className="py-3.5 px-6 font-normal">Redemption Date</th>
                <th className="py-3.5 px-6 font-normal">Status</th>
                <th className="py-3.5 px-6 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2F4F7] text-[13px]">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={7} className="py-4 px-6">
                      <div className="h-4 bg-gray-100 rounded-md w-full" />
                    </td>
                  </tr>
                ))
              ) : referrals.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-12 text-center text-[#667085]"
                  >
                    No referrals found for this user.
                  </td>
                </tr>
              ) : (
                referrals.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-[#FAFAFC] transition-colors"
                  >
                    {/* Referral Code */}
                    <td className="py-4 px-6 text-[#101828] font-semibold whitespace-nowrap">
                      {item.code}
                    </td>

                    {/* Provider */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center font-bold text-xs shrink-0">
                          {item.provider?.name
                            ? item.provider.name.charAt(0).toUpperCase()
                            : "P"}
                        </div>
                        <span className="font-medium text-[#101828]">
                          {item.provider?.name || "Unknown Provider"}
                        </span>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="py-4 px-6 text-[#475467] font-medium whitespace-nowrap">
                      {item.location || "—"}
                    </td>

                    {/* Generation Date */}
                    <td className="py-4 px-6 text-[#475467] whitespace-nowrap">
                      {formatDate(item.generatedAt)}
                    </td>

                    {/* Redemption Date */}
                    <td className="py-4 px-6 text-[#475467] whitespace-nowrap">
                      {item.redeemedAt ? formatDate(item.redeemedAt) : "—"}
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      {getStatusBadge(item.status)}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 whitespace-nowrap text-right">
                      <Link
                        href={`/referrals/${item.id}`}
                        className="text-[13px] font-semibold text-[#BB1A8C] hover:text-[#9B1373] hover:underline transition-colors"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer with Pagination */}
        <div className="py-3.5 px-6 border-t border-[#EAECF0] flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-[13px] text-[#667085]">
            Showing{" "}
            <strong>
              {referrals.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}
            </strong>{" "}
            to{" "}
            <strong>
              {Math.min(currentPage * pageSize, meta.total)}
            </strong>{" "}
            of <strong>{meta.total.toLocaleString()}</strong> referrals
          </span>

          <div className="flex items-center gap-2">
            <span className="text-[12px] text-[#8A9BA8] mr-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage <= 1 || isLoading}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-3.5 py-1.5 rounded-lg border border-[#D0D5DD] bg-white text-[13px] font-medium text-[#344054] hover:bg-gray-50 transition-colors shadow-2xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={currentPage >= totalPages || isLoading}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-3.5 py-1.5 rounded-lg border border-[#D0D5DD] bg-white text-[13px] font-medium text-[#344054] hover:bg-gray-50 transition-colors shadow-2xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRecentReferrals;
