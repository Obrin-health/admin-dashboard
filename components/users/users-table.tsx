"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  ChevronDown,
  SlidersHorizontal,
  MoreVertical,
  Check,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useUsersList } from "@/hooks/use-users";
import { useTablePagination } from "@/hooks/use-table-pagination";
import type { AdminUserItem, UserSource, UserStatus } from "@/types/users";

export type { AdminUserItem as UserRow };

interface ColumnConfig {
  id: string;
  label: string;
  visible: boolean;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "-";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  } catch {
    return dateStr;
  }
}

export const UsersTable: React.FC = () => {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedSource, setSelectedSource] = useState<string>("All source");
  const [selectedStatus, setSelectedStatus] = useState<string>("All status");
  const { currentPage, setCurrentPage } = useTablePagination();
  const pageSize = 10;

  // Debounce search input by 350ms, only resetting page when searchInput changes
  const prevSearchRef = useRef(searchInput);
  useEffect(() => {
    if (prevSearchRef.current === searchInput) {
      return;
    }
    prevSearchRef.current = searchInput;
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
      setCurrentPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchInput, setCurrentPage]);

  // Map filters to API params
  const apiSource: UserSource | undefined =
    selectedSource === "WhatsApp"
      ? "WHATSAPP"
      : selectedSource === "Ambassador"
      ? "AMBASSADOR"
      : selectedSource === "Campaign"
      ? "CAMPAIGN"
      : undefined;

  const apiStatus: UserStatus | undefined =
    selectedStatus === "Active"
      ? "ACTIVE"
      : selectedStatus === "Suspended"
      ? "SUSPENDED"
      : undefined;

  // Fetch live paginated users from API
  const { data, isLoading, isFetching } = useUsersList({
    page: currentPage,
    pageSize,
    search: debouncedSearch || undefined,
    source: apiSource,
    status: apiStatus,
  });

  const users = data?.data || [];
  const meta = data?.meta || {
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 1,
  };

  const totalPages = Math.max(1, meta.totalPages);

  // Column visibility state
  const [columns, setColumns] = useState<ColumnConfig[]>([
    { id: "name", label: "User", visible: true },
    { id: "phone", label: "Phone/Whatsapp", visible: true },
    { id: "source", label: "Source", visible: true },
    { id: "campaign", label: "Campaign", visible: true },
    { id: "referralsGenerated", label: "Referrals Generated", visible: true },
    { id: "redeemed", label: "Redeemed", visible: true },
    { id: "lastActiveDate", label: "Last Active Date", visible: true },
    { id: "actions", label: "Actions", visible: true },
  ]);

  const toggleColumn = (id: string) => {
    setColumns((prev) =>
      prev.map((col) => (col.id === id ? { ...col, visible: !col.visible } : col))
    );
  };

  const isVisible = (id: string) =>
    columns.find((c) => c.id === id)?.visible ?? true;

  const visibleColumnCount = columns.filter((c) => c.visible).length;

  return (
    <div className="space-y-4">
      {/* Top Controls: Table View Column Button */}
      <div className="flex items-center justify-between">
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center gap-2 px-3.5 py-2 text-[13px] font-medium text-[#344054] bg-white border border-[#D0D5DD] rounded-xl hover:bg-gray-50 transition-colors shadow-2xs cursor-pointer">
            <SlidersHorizontal className="size-4 text-[#667085]" />
            <span>Table view column</span>
            <ChevronDown className="size-3.5 text-[#667085]" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56 p-1.5 z-50">
            <div className="px-2 py-1 text-[11px] font-semibold text-[#8A9BA8] uppercase tracking-wider">
              Toggle Columns
            </div>
            {columns.map((col) => (
              <DropdownMenuItem
                key={col.id}
                onClick={(e) => {
                  e.preventDefault();
                  toggleColumn(col.id);
                }}
                className="flex items-center justify-between text-[13px] cursor-pointer"
              >
                <span>{col.label}</span>
                {col.visible && <Check className="size-4 text-[#BB1A8C]" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {isFetching && !isLoading && (
          <div className="flex items-center gap-1.5 text-[12px] text-[#BB1A8C]">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Updating...</span>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        {/* Search Input */}
        <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl border border-[#D0D5DD] bg-white text-[#101828] w-full sm:max-w-xs shadow-2xs">
          <Search className="size-4 text-[#8A9BA8] shrink-0" />
          <input
            type="text"
            placeholder="Search by name, phone, ref"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full bg-transparent text-[13px] text-[#101828] placeholder-[#98A2B3] outline-none"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Source Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center gap-1.5 px-3.5 py-2 text-[12px] md:text-[13px] font-normal text-[#344054] bg-white border border-[#D0D5DD] rounded-xl hover:bg-gray-50 transition-colors shadow-2xs cursor-pointer">
              <span>Source:</span>
              <strong className="font-semibold text-[#101828]">
                {selectedSource}
              </strong>
              <ChevronDown className="size-3.5 text-[#667085]" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="z-50">
              {["All source", "WhatsApp", "Ambassador", "Campaign"].map((s) => (
                <DropdownMenuItem
                  key={s}
                  onClick={() => {
                    setSelectedSource(s);
                    setCurrentPage(1);
                  }}
                  className={`text-[13px] cursor-pointer ${
                    selectedSource === s ? "font-semibold text-[#BB1A8C]" : ""
                  }`}
                >
                  {s}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

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
              {["All status", "Active", "Suspended"].map((st) => (
                <DropdownMenuItem
                  key={st}
                  onClick={() => {
                    setSelectedStatus(st);
                    setCurrentPage(1);
                  }}
                  className={`text-[13px] cursor-pointer ${
                    selectedStatus === st ? "font-semibold text-[#BB1A8C]" : ""
                  }`}
                >
                  {st}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Data Table Container */}
      <div className="rounded-2xl border border-[#EAECF0] bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#EAECF0] bg-white text-[12px] font-normal text-[#667085]">
                {isVisible("name") && (
                  <th className="py-3.5 px-6 font-normal">User</th>
                )}
                {isVisible("phone") && (
                  <th className="py-3.5 px-6 font-normal">Phone/Whatsapp</th>
                )}
                {isVisible("source") && (
                  <th className="py-3.5 px-6 font-normal">Source</th>
                )}
                {isVisible("campaign") && (
                  <th className="py-3.5 px-6 font-normal">Campaign</th>
                )}
                {isVisible("referralsGenerated") && (
                  <th className="py-3.5 px-6 font-normal">Referrals Generated</th>
                )}
                {isVisible("redeemed") && (
                  <th className="py-3.5 px-6 font-normal">Redeemed</th>
                )}
                {isVisible("lastActiveDate") && (
                  <th className="py-3.5 px-6 font-normal">Last Active Date</th>
                )}
                {isVisible("actions") && (
                  <th className="py-3.5 px-6 font-normal text-right">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2F4F7] text-[13px]">
              {isLoading ? (
                Array.from({ length: 10 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={visibleColumnCount} className="py-4 px-6">
                      <div className="h-4 bg-gray-100 rounded-md w-full" />
                    </td>
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td
                    colSpan={visibleColumnCount}
                    className="py-12 text-center text-[#667085]"
                  >
                    No users found matching your filters.
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const upperSource = (user.source || "").toUpperCase();

                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-[#FAFAFC] transition-colors"
                    >
                      {/* User Name & Reference */}
                      {isVisible("name") && (
                        <td className="py-4 px-6 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="font-medium text-[#101828]">
                              {user.name || "Unnamed User"}
                            </span>
                            <span className="text-[11px] text-[#8A9BA8]">
                              {user.reference}
                            </span>
                          </div>
                        </td>
                      )}

                      {/* Phone/Whatsapp */}
                      {isVisible("phone") && (
                        <td className="py-4 px-6 text-[#344054] whitespace-nowrap font-mono text-[12px]">
                          {user.whatsappId}
                        </td>
                      )}

                      {/* Source Badge */}
                      {isVisible("source") && (
                        <td className="py-4 px-6 whitespace-nowrap">
                          {upperSource === "WHATSAPP" ? (
                            <span className="inline-flex items-center px-3 py-0.5 rounded-full text-[12px] font-medium bg-[#E7F8F0] text-[#0D894F]">
                              WhatsApp
                            </span>
                          ) : upperSource === "AMBASSADOR" ? (
                            <span className="inline-flex items-center px-3 py-0.5 rounded-full text-[12px] font-medium bg-[#FDF2FA] text-[#C11574]">
                              Ambassador
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-3 py-0.5 rounded-full text-[12px] font-medium bg-[#F0F9FF] text-[#026AA2]">
                              Campaign
                            </span>
                          )}
                        </td>
                      )}

                      {/* Campaign */}
                      {isVisible("campaign") && (
                        <td className="py-4 px-6 text-[#344054] whitespace-nowrap">
                          {user.campaign?.name || "-"}
                        </td>
                      )}

                      {/* Referrals Generated */}
                      {isVisible("referralsGenerated") && (
                        <td className="py-4 px-6 text-[#101828] font-medium whitespace-nowrap">
                          {user.referralsGenerated}
                        </td>
                      )}

                      {/* Redeemed */}
                      {isVisible("redeemed") && (
                        <td className="py-4 px-6 text-[#101828] font-medium whitespace-nowrap">
                          {user.referralsRedeemed}
                        </td>
                      )}

                      {/* Last Active Date */}
                      {isVisible("lastActiveDate") && (
                        <td className="py-4 px-6 text-[#475467] whitespace-nowrap text-[12px]">
                          {formatDate(user.lastActiveAt || user.joinedAt)}
                        </td>
                      )}

                      {/* Actions */}
                      {isVisible("actions") && (
                        <td className="py-4 px-6 whitespace-nowrap text-right">
                          <div className="inline-flex items-center justify-end gap-3">
                            <Link
                              href={`/users/${user.id}`}
                              className="text-[12px] font-semibold text-[#BB1A8C] hover:text-[#9B1373] hover:underline transition-colors"
                            >
                              View
                            </Link>

                            <DropdownMenu>
                              <DropdownMenuTrigger className="p-1 rounded-md hover:bg-gray-100 text-[#667085] transition-colors cursor-pointer outline-none">
                                <MoreVertical className="size-4" />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-40 z-50">
                                <DropdownMenuItem
                                  onClick={() => router.push(`/users/${user.id}`)}
                                  className="text-[13px] cursor-pointer"
                                >
                                  View Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => router.push(`/users/${user.id}?tab=referrals`)}
                                  className="text-[13px] cursor-pointer"
                                >
                                  View Referrals
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className={`text-[13px] cursor-pointer ${
                                    user.status === "ACTIVE"
                                      ? "text-red-600 hover:text-red-700"
                                      : "text-emerald-600 hover:text-emerald-700"
                                  }`}
                                >
                                  {user.status === "ACTIVE"
                                    ? "Suspend User"
                                    : "Activate User"}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer with Pagination */}
        <div className="py-3.5 px-6 border-t border-[#EAECF0] flex flex-col sm:flex-row items-center justify-between gap-3">
          <span suppressHydrationWarning className="text-[13px] text-[#667085]">
            Showing{" "}
            <strong>
              {users.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}
            </strong>{" "}
            to{" "}
            <strong>
              {Math.min(currentPage * pageSize, meta.total)}
            </strong>{" "}
            of <strong>{meta.total.toLocaleString()}</strong> users
          </span>

          <div className="flex items-center gap-2">
            <span suppressHydrationWarning className="text-[12px] text-[#8A9BA8] mr-2">
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

export default UsersTable;
