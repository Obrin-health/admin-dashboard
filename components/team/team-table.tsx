"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, MoreVertical, Loader2, Send } from "lucide-react";
import { TeamMember } from "./edit-team-member-modal";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useTablePagination } from "@/hooks/use-table-pagination";
import { useTeamList } from "@/hooks/use-team";
import { useCurrentUser } from "@/hooks/use-auth";
import type { TeamMemberItem, TeamRole, TeamStatus } from "@/types/team";

interface TeamTableProps {
  onEdit: (member: TeamMember) => void;
  onDisableToggle: (member: TeamMember) => void;
  onDelete: (member: TeamMember) => void;
  onResendInvite?: (member: TeamMember) => void;
}

function formatDate(dateVal?: unknown): string {
  if (!dateVal) return "-";
  try {
    const str = typeof dateVal === "string" ? dateVal : String(dateVal);
    const d = new Date(str);
    if (isNaN(d.getTime())) return str;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return typeof dateVal === "string" ? dateVal : "-";
  }
}

function formatRole(role?: unknown): "Super Admin" | "Admin" | "Support" {
  let roleStr = "";
  if (typeof role === "string") {
    roleStr = role;
  } else if (typeof role === "object" && role !== null) {
    const rObj = role as Record<string, unknown>;
    roleStr = String(
      rObj.name || rObj.key || rObj.label || rObj.code || rObj.role || ""
    );
  } else if (role !== undefined && role !== null) {
    roleStr = String(role);
  }

  if (!roleStr) return "Admin";
  const upper = roleStr.toUpperCase();
  if (upper.includes("SUPER")) return "Super Admin";
  if (upper.includes("SUPPORT")) return "Support";
  return "Admin";
}

function formatStatus(status?: unknown): "Active" | "Inactive" | "Disabled" {
  let statusStr = "";
  if (typeof status === "string") {
    statusStr = status;
  } else if (typeof status === "object" && status !== null) {
    const sObj = status as Record<string, unknown>;
    statusStr = String(
      sObj.name || sObj.key || sObj.label || sObj.status || sObj.code || ""
    );
  } else if (status !== undefined && status !== null) {
    statusStr = String(status);
  }

  if (!statusStr) return "Active";
  const upper = statusStr.toUpperCase();
  if (upper.includes("DISABLE")) return "Disabled";
  if (upper.includes("INACTIVE") || upper.includes("PENDING")) return "Inactive";
  return "Active";
}

function getInitials(name: string): string {
  if (!name || name === "-") return "TM";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function mapApiToTeamMember(item: TeamMemberItem): TeamMember {
  const firstName = typeof item.firstName === "string" ? item.firstName : "";
  const lastName = typeof item.lastName === "string" ? item.lastName : "";
  const rawFullName =
    typeof item.fullName === "string"
      ? item.fullName
      : typeof item.name === "string"
      ? item.name
      : "";
  const fullName =
    rawFullName ||
    (firstName || lastName ? `${firstName} ${lastName}`.trim() : "") ||
    (typeof item.email === "string" ? item.email : "Team Member");

  const email = typeof item.email === "string" ? item.email : "-";

  return {
    id: String(item.id || ""),
    name: fullName,
    firstName: firstName || undefined,
    lastName: lastName || undefined,
    email,
    role: formatRole(item.role),
    dateJoined: formatDate(item.joinedAt || item.createdAt || item.dateJoined),
    lastActive: formatDate(
      item.lastActiveAt || item.lastActive || item.lastLoginAt
    ),
    status: formatStatus(item.status),
    avatarInitials: getInitials(fullName),
  };
}

export default function TeamTable({
  onEdit,
  onDisableToggle,
  onDelete,
  onResendInvite,
}: TeamTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All Role");
  const [statusFilter, setStatusFilter] = useState("Status");

  const { currentPage, setCurrentPage } = useTablePagination();
  const { data: currentUser } = useCurrentUser();

  const roles = ["All Role", "Super Admin", "Admin", "Support"];
  const statuses = ["Status", "Active", "Inactive", "Disabled"];

  // Debounced search with ref guard to avoid resetting page on mount
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
  const apiRole: TeamRole | undefined =
    roleFilter === "Super Admin"
      ? "SUPER_ADMIN"
      : roleFilter === "Admin"
      ? "ADMIN"
      : roleFilter === "Support"
      ? "SUPPORT"
      : undefined;

  const apiStatus: TeamStatus | undefined =
    statusFilter === "Active"
      ? "ACTIVE"
      : statusFilter === "Inactive"
      ? "INACTIVE"
      : statusFilter === "Disabled"
      ? "DISABLED"
      : undefined;

  const pageSize = 10;
  const {
    data: apiResponse,
    isLoading,
    isFetching,
  } = useTeamList({
    page: currentPage,
    pageSize,
    search: debouncedSearch || undefined,
    role: apiRole,
    status: apiStatus,
  });

  const rawItems = apiResponse?.items || apiResponse?.data;
  const teamMembers: TeamMember[] = Array.isArray(rawItems)
    ? rawItems.map(mapApiToTeamMember)
    : [];

  const totalCount =
    apiResponse?.meta?.total ??
    apiResponse?.total ??
    teamMembers.length;

  const totalPages =
    apiResponse?.meta?.totalPages ??
    Math.max(1, Math.ceil(totalCount / pageSize));

  const getStatusBadge = (status: TeamMember["status"]) => {
    switch (status) {
      case "Active":
        return (
          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-[13px] font-medium bg-emerald-50 text-emerald-700">
            Active
          </span>
        );
      case "Inactive":
        return (
          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-[13px] font-medium bg-gray-100 text-gray-700">
            Inactive
          </span>
        );
      case "Disabled":
        return (
          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-[13px] font-medium bg-purple-50 text-purple-700">
            Disabled
          </span>
        );
    }
  };

  return (
    <div className="w-full font-sans select-none space-y-4">
      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#98A2B3] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-[#EAECF0] bg-white text-[14px] text-[#101828] placeholder:text-[#98A2B3] outline-none transition-colors focus:border-[#BB1A8C]"
          />
        </div>

        {/* Filters Dropdowns */}
        <div className="flex items-center gap-3">
          {/* Role Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger className="h-10 px-4 rounded-xl border border-[#EAECF0] bg-white text-[13px] text-[#344054] font-medium flex items-center gap-2 hover:bg-gray-50 transition-colors cursor-pointer outline-none">
              <span>Show: {roleFilter}</span>
              <ChevronDown className="w-4 h-4 text-[#667085]" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              sideOffset={6}
              className="w-44 rounded-2xl bg-white p-1.5 shadow-[0px_12px_32px_rgba(16,24,40,0.12),0px_2px_8px_rgba(16,24,40,0.04)] border border-[#EAECF0]"
            >
              {roles.map((r) => (
                <DropdownMenuItem
                  key={r}
                  onClick={() => {
                    if (roleFilter !== r) {
                      setRoleFilter(r);
                      setCurrentPage(1);
                    }
                  }}
                  className={`w-full px-3.5 py-2 text-left text-[13px] rounded-xl transition-colors cursor-pointer outline-none ${
                    roleFilter === r
                      ? "bg-[#BB1A8C]/5 text-[#BB1A8C] font-semibold"
                      : "text-[#344054] hover:bg-gray-50"
                  }`}
                >
                  {r}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Status Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger className="h-10 px-4 rounded-xl border border-[#EAECF0] bg-white text-[13px] text-[#344054] font-medium flex items-center gap-2 hover:bg-gray-50 transition-colors cursor-pointer outline-none">
              <span>Show: {statusFilter}</span>
              <ChevronDown className="w-4 h-4 text-[#667085]" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              sideOffset={6}
              className="w-40 rounded-2xl bg-white p-1.5 shadow-[0px_12px_32px_rgba(16,24,40,0.12),0px_2px_8px_rgba(16,24,40,0.04)] border border-[#EAECF0]"
            >
              {statuses.map((s) => (
                <DropdownMenuItem
                  key={s}
                  onClick={() => {
                    if (statusFilter !== s) {
                      setStatusFilter(s);
                      setCurrentPage(1);
                    }
                  }}
                  className={`w-full px-3.5 py-2 text-left text-[13px] rounded-xl transition-colors cursor-pointer outline-none ${
                    statusFilter === s
                      ? "bg-[#BB1A8C]/5 text-[#BB1A8C] font-semibold"
                      : "text-[#344054] hover:bg-gray-50"
                  }`}
                >
                  {s}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table Container */}
      <div className="relative bg-white rounded-2xl border border-[#EAECF0] overflow-hidden shadow-2xs">
        {isFetching && !isLoading && (
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#FCE7F6] overflow-hidden z-10">
            <div className="h-full bg-[#BB1A8C] animate-pulse w-full" />
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#EAECF0] text-[12px] font-medium text-[#667085] bg-[#FCFCFD]">
                <th className="py-3.5 px-6 font-medium">Team Member</th>
                <th className="py-3.5 px-6 font-medium">Email Address</th>
                <th className="py-3.5 px-6 font-medium">Role</th>
                <th className="py-3.5 px-6 font-medium">Date Joined</th>
                <th className="py-3.5 px-6 font-medium">Last Active</th>
                <th className="py-3.5 px-6 font-medium">Status</th>
                <th className="py-3.5 px-6 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAECF0] text-[14px]">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <div className="inline-flex flex-col items-center gap-2">
                      <Loader2 className="w-6 h-6 animate-spin text-[#BB1A8C]" />
                      <span className="text-sm text-[#667085]">
                        Loading team members...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : teamMembers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#667085]">
                    No team members found.
                  </td>
                </tr>
              ) : (
                teamMembers.map((member) => {
                  const isCurrentUser =
                    Boolean(currentUser) &&
                    ((currentUser?.id &&
                      String(currentUser.id) === String(member.id)) ||
                      (currentUser?.email &&
                        member.email &&
                        currentUser.email.toLowerCase() ===
                          member.email.toLowerCase()));

                  return (
                    <tr
                      key={member.id}
                      className="hover:bg-gray-50/70 transition-colors"
                    >
                      {/* Member Name with Avatar badge */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="size-9 rounded-full bg-[#BB1A8C] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                            {member.avatarInitials}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-[#101828]">
                              {member.name}
                            </span>
                            {isCurrentUser && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#FCE7F6] text-[#BB1A8C]">
                                You
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-4 px-6 text-[#475467] whitespace-nowrap">
                        {member.email}
                      </td>

                      {/* Role */}
                      <td className="py-4 px-6 font-medium text-[#101828] whitespace-nowrap">
                        {member.role}
                      </td>

                      {/* Date Joined */}
                      <td className="py-4 px-6 text-[#475467] whitespace-nowrap">
                        {member.dateJoined}
                      </td>

                      {/* Last Active */}
                      <td className="py-4 px-6 text-[#475467] whitespace-nowrap">
                        {member.lastActive}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        {getStatusBadge(member.status)}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 whitespace-nowrap text-right">
                        <div className="inline-flex items-center gap-2.5">
                          <button
                            type="button"
                            onClick={() => onEdit(member)}
                            className="text-[#BB1A8C] hover:text-[#A01677] font-semibold text-[14px] cursor-pointer"
                          >
                            Edit
                          </button>

                          {!isCurrentUser && (
                            <DropdownMenu>
                              <DropdownMenuTrigger className="p-1.5 rounded-xl border border-gray-200 bg-gray-50/70 hover:bg-gray-100 text-[#344054] transition-colors cursor-pointer outline-none flex items-center justify-center">
                                <MoreVertical className="w-4 h-4 text-[#344054]" />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                sideOffset={8}
                                className="w-52 rounded-[20px] bg-white p-2.5 shadow-[0px_14px_36px_rgba(16,24,40,0.14),0px_2px_8px_rgba(16,24,40,0.04)] border border-[#EAECF0] flex flex-col gap-1 z-50 outline-none"
                              >
                                <DropdownMenuItem
                                  onClick={() => onDisableToggle(member)}
                                  className="w-full text-left px-4 py-2.5 text-[14px] text-[#344054] hover:bg-gray-50 rounded-xl transition-colors cursor-pointer outline-none font-normal"
                                >
                                  {member.status === "Disabled"
                                    ? "Enable member"
                                    : "Disable member"}
                                </DropdownMenuItem>

                                {onResendInvite && (
                                  <DropdownMenuItem
                                    onClick={() => onResendInvite(member)}
                                    className="w-full text-left px-4 py-2.5 text-[14px] text-[#344054] hover:bg-gray-50 rounded-xl transition-colors cursor-pointer outline-none font-normal flex items-center gap-2"
                                  >
                                    <Send className="w-3.5 h-3.5 text-[#667085]" />
                                    <span>Resend invite</span>
                                  </DropdownMenuItem>
                                )}

                                <DropdownMenuItem
                                  onClick={() => onDelete(member)}
                                  className="w-full text-left px-4 py-2.5 text-[14px] text-[#344054] hover:bg-red-50 hover:text-[#D92D20] rounded-xl transition-colors cursor-pointer outline-none font-normal"
                                >
                                  Delete member
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
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
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#EAECF0] bg-white">
          <span className="text-[14px] text-[#667085]">
            Page {currentPage} of {totalPages}
          </span>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              disabled={currentPage <= 1 || isLoading}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-4 py-2 rounded-xl border border-[#D0D5DD] bg-white text-[14px] font-medium text-[#344054] hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={currentPage >= totalPages || isLoading}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-4 py-2 rounded-xl border border-[#D0D5DD] bg-white text-[14px] font-medium text-[#344054] hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
