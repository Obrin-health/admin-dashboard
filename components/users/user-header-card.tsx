"use client";

import React, { useState } from "react";
import {
  User as UserIcon,
  Check,
  ChevronDown,
  Copy,
  UserX,
  UserCheck,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import type { UserDetail } from "@/types/users";

interface UserHeaderCardProps {
  user?: UserDetail;
  isLoading?: boolean;
  activeTab: "Overview" | "Referrals" | "Services";
  onTabChange: (tab: "Overview" | "Referrals" | "Services") => void;
  onSuspendClick?: () => void;
  onActivateClick?: () => void;
  isActionLoading?: boolean;
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "Never";
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

function formatRelativeTime(dateStr: string | null | undefined): string {
  if (!dateStr) return "Never";
  try {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays} Day${diffDays > 1 ? "s" : ""} Ago`;
    if (diffHours > 0) return `${diffHours} Hour${diffHours > 1 ? "s" : ""} Ago`;
    return "Just Now";
  } catch {
    return "Recently";
  }
}

export const UserHeaderCard: React.FC<UserHeaderCardProps> = ({
  user,
  isLoading,
  activeTab,
  onTabChange,
  onSuspendClick,
  onActivateClick,
  isActionLoading,
}) => {
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedRef, setCopiedRef] = useState(false);

  const handleCopyPhone = async () => {
    if (!user?.whatsappId) return;
    try {
      await navigator.clipboard.writeText(user.whatsappId);
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleCopyRef = async () => {
    if (!user?.reference) return;
    try {
      await navigator.clipboard.writeText(user.reference);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    } catch {
      // ignore
    }
  };

  const isActive = user?.status === "ACTIVE";
  const isSuspended = user?.status === "SUSPENDED";

  const miniStats = [
    {
      label: "Clinic Search",
      value: (user?.stats?.clinicSearches ?? 0).toLocaleString(),
    },
    {
      label: "Generated Code",
      value: (user?.stats?.generatedCodes ?? 0).toLocaleString(),
    },
    {
      label: "Redeemed Code",
      value: (user?.stats?.redeemedCodes ?? 0).toLocaleString(),
    },
    {
      label: "Conversion",
      value: `${Math.round((user?.stats?.conversionRate ?? 0) * 100)}%`,
    },
    {
      label: "Last Active",
      value: formatRelativeTime(user?.lastActiveAt || user?.stats?.lastActiveAt),
    },
  ];

  return (
    <div className="w-full rounded-2xl border border-[#EAECF0] bg-[#F9F9FB] p-6 shadow-xs mb-6">
      {/* User Identity Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="size-14 rounded-full bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center shrink-0 font-bold text-lg">
            {isLoading ? (
              <div className="size-8 rounded-full bg-gray-200 animate-pulse" />
            ) : user?.name ? (
              user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .substring(0, 2)
                .toUpperCase()
            ) : (
              <UserIcon className="size-7" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2.5">
              {isLoading ? (
                <div className="h-6 w-44 bg-gray-200 rounded animate-pulse" />
              ) : (
                <h2 className="text-[19px] sm:text-[20px] font-bold text-[#101828]">
                  {user?.name || `User (${user?.reference || "Unnamed"})`}
                </h2>
              )}

              {/* Status Badge */}
              {!isLoading && user && (
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${isActive
                    ? "bg-[#027A48] text-white"
                    : "bg-[#F04438] text-white"
                    }`}
                >
                  {isActive ? "Active" : "Suspended"}
                  {isActive && <Check className="size-3 stroke-[3]" />}
                </span>
              )}
            </div>

            {isLoading ? (
              <div className="h-4 w-32 bg-gray-100 rounded animate-pulse mt-1" />
            ) : (
              <div className="flex items-center gap-3 text-[13px] text-[#667085] mt-0.5">
                <span>Ref ID: <strong className="font-semibold text-[#344054]">{user?.reference || "—"}</strong></span>
                <span>•</span>
                <span>Phone: <strong className="font-semibold text-[#344054]">{user?.whatsappId || "—"}</strong></span>
              </div>
            )}
          </div>
        </div>

        {/* Actions Dropdown */}
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger
              disabled={isLoading || isActionLoading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#BB1A8C] hover:bg-[#A01677] text-white text-[13px] font-medium shadow-xs transition-colors cursor-pointer outline-none disabled:opacity-50"
            >
              {isActionLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <>
                  <span>Actions</span>
                  <ChevronDown className="size-4" />
                </>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 p-1.5 shadow-lg rounded-xl border border-gray-100 bg-white z-50"
            >
              <DropdownMenuItem
                onClick={handleCopyPhone}
                className="text-[13px] font-medium text-[#101828] py-2 px-3 cursor-pointer hover:bg-gray-50 rounded-lg flex items-center gap-2"
              >
                {copiedPhone ? (
                  <Check className="size-4 text-[#027A48]" />
                ) : (
                  <Copy className="size-4 text-[#667085]" />
                )}
                <span>Copy Phone Number</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={handleCopyRef}
                className="text-[13px] font-medium text-[#101828] py-2 px-3 cursor-pointer hover:bg-gray-50 rounded-lg flex items-center gap-2"
              >
                {copiedRef ? (
                  <Check className="size-4 text-[#027A48]" />
                ) : (
                  <Copy className="size-4 text-[#667085]" />
                )}
                <span>Copy Reference ID</span>
              </DropdownMenuItem>

              {isActive ? (
                <DropdownMenuItem
                  onClick={onSuspendClick}
                  className="text-[13px] font-medium py-2 px-3 cursor-pointer hover:bg-red-50 text-red-600 rounded-lg flex items-center gap-2"
                >
                  <UserX className="size-4 text-red-600" />
                  <span>Suspend User</span>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onClick={onActivateClick}
                  className="text-[13px] font-medium py-2 px-3 cursor-pointer hover:bg-green-50 text-green-700 rounded-lg flex items-center gap-2"
                >
                  <UserCheck className="size-4 text-green-700" />
                  <span>Activate User</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Last Active Day */}
      <div className="mb-5 text-[13px]">
        <span className="text-[#667085]">Last Active day: </span>
        <span className="font-semibold text-[#101828]">
          {isLoading ? "Loading..." : formatDate(user?.lastActiveAt || user?.stats?.lastActiveAt)}
        </span>
      </div>

      {/* 5 Mini-Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 mb-6">
        {miniStats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-[#EAECF0] bg-white p-4 shadow-2xs hover:border-[#BB1A8C]/30 transition-colors"
          >
            <span className="text-[12px] text-[#667085] block leading-tight">
              {stat.label}
            </span>
            {isLoading ? (
              <div className="h-7 w-16 bg-gray-100 rounded animate-pulse mt-2" />
            ) : (
              <span className="font-general-sans text-[22px] sm:text-[24px] font-bold text-[#101828] block mt-2 tracking-tight">
                {stat.value}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-8 border-b border-[#EAECF0] -mb-6">
        {(["Overview", "Referrals", "Services"] as const).map((tab) => {
          const isTabActive = activeTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => onTabChange(tab)}
              className={`pb-3 text-[14px] font-medium transition-colors cursor-pointer relative ${isTabActive
                ? "text-[#BB1A8C] font-semibold"
                : "text-[#667085] hover:text-[#101828]"
                }`}
            >
              {tab}
              {isTabActive && (
                <span className="absolute bottom-0 inset-x-0 h-0.5 bg-[#BB1A8C]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default UserHeaderCard;
