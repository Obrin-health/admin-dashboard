"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Copy, Check, Edit, UserX, UserCheck } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import type { AmbassadorDetail } from "@/types/ambassadors";

interface AmbassadorHeaderCardProps {
  ambassador?: AmbassadorDetail;
  activeTab: "Overview" | "Users Introduced" | "Campaigns";
  onTabChange: (tab: "Overview" | "Users Introduced" | "Campaigns") => void;
  onEditClick?: () => void;
  onSuspendClick?: () => void;
  onActivateClick?: () => void;
}

function getInitials(name: string): string {
  if (!name) return "AM";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export const AmbassadorHeaderCard: React.FC<AmbassadorHeaderCardProps> = ({
  ambassador,
  activeTab,
  onTabChange,
  onEditClick,
  onSuspendClick,
  onActivateClick,
}) => {
  const [copied, setCopied] = useState(false);

  let displayName = "Ambassador";
  if (typeof ambassador?.fullName === "string" && ambassador.fullName.trim()) {
    displayName = ambassador.fullName.trim();
  } else if (typeof ambassador?.name === "string" && ambassador.name.trim()) {
    displayName = ambassador.name.trim();
  }
  const avatarText = getInitials(displayName);
  const code = typeof ambassador?.code === "string" ? ambassador.code : "-";
  const referralLink =
    typeof ambassador?.referralLink === "string"
      ? ambassador.referralLink
      : typeof ambassador?.code === "string"
      ? `obrin.health/join/${ambassador.code}`
      : "";

  const rawStatus = (ambassador?.status || "ACTIVE").toUpperCase();
  const isSuspended = rawStatus === "SUSPENDED";
  const isInactive = rawStatus === "INACTIVE";

  const handleCopy = async () => {
    if (!referralLink) return;
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Rejection handled
    }
  };

  const miniStats = [
    {
      label: "Total Users Introduced",
      value: String(ambassador?.totalUsersIntroduced ?? 0),
    },
    {
      label: "Referrals",
      value: String(ambassador?.referralsCount ?? 0),
    },
    {
      label: "Redeemed",
      value: String(ambassador?.redeemedCount ?? 0),
    },
    {
      label: "Conversion Rate",
      value:
        ambassador?.conversionRate !== undefined
          ? `${ambassador.conversionRate}%`
          : "0%",
    },
  ];

  const tabs: Array<"Overview" | "Users Introduced" | "Campaigns"> = [
    "Overview",
    "Users Introduced",
    "Campaigns",
  ];

  // Current campaign info
  const activeCampaignObj =
    typeof ambassador?.activeCampaign === "object"
      ? ambassador?.activeCampaign
      : null;
  const campaignName =
    activeCampaignObj?.name ||
    (typeof ambassador?.activeCampaign === "string"
      ? ambassador.activeCampaign
      : "None");
  const campaignType =
    typeof activeCampaignObj?.type === "string"
      ? activeCampaignObj.type
      : typeof ambassador?.type === "string"
      ? ambassador.type
      : "Digital";

  return (
    <div className="w-full rounded-2xl border border-[#EAECF0] bg-white p-6 md:p-8 mb-6 shadow-xs">
      {/* 1. Header Profile & Actions Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="relative size-14 rounded-full overflow-hidden border-2 border-white shadow-xs shrink-0 bg-gray-100 flex items-center justify-center">
            {ambassador?.photoUrl ? (
              <Image
                src={ambassador.photoUrl}
                alt={displayName}
                fill
                className="object-cover"
                priority
                unoptimized
              />
            ) : (
              <span className="text-base font-bold text-[#475467]">
                {avatarText}
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-[18px] md:text-[20px] font-bold text-[#101828]">
                {displayName}
              </h2>
              {isSuspended ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#FEF3F2] text-[#B42318]">
                  Suspended
                </span>
              ) : isInactive ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#FEF6EE] text-[#F79009]">
                  Inactive
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#ECFDF3] text-[#027A48]">
                  Active
                </span>
              )}
            </div>
            <p className="text-[13px] text-[#667085] mt-0.5">
              Ambassador ID: {code}
            </p>
          </div>
        </div>

        {/* Actions Dropdown Button */}
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#BB1A8C] hover:bg-[#A01677] text-white text-[13px] font-medium shadow-xs transition-colors cursor-pointer outline-none">
              <span>Actions</span>
              <ChevronDown className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 p-1.5 shadow-lg rounded-xl border border-gray-100 bg-white"
            >
              <DropdownMenuItem
                onClick={onEditClick}
                className="text-[13px] font-medium text-[#101828] py-2 px-3 cursor-pointer hover:bg-gray-50 rounded-lg flex items-center gap-2"
              >
                <Edit className="size-4 text-[#667085]" />
                <span>Edit Ambassador</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={handleCopy}
                className="text-[13px] font-medium text-[#101828] py-2 px-3 cursor-pointer hover:bg-gray-50 rounded-lg flex items-center gap-2"
              >
                {copied ? (
                  <Check className="size-4 text-[#027A48]" />
                ) : (
                  <Copy className="size-4 text-[#667085]" />
                )}
                <span>Copy Referral Link</span>
              </DropdownMenuItem>

              {isSuspended ? (
                <DropdownMenuItem
                  onClick={onActivateClick}
                  className="text-[13px] font-medium text-green-600 py-2 px-3 cursor-pointer hover:bg-green-50 rounded-lg flex items-center gap-2"
                >
                  <UserCheck className="size-4 text-green-600" />
                  <span>Activate Ambassador</span>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onClick={onSuspendClick}
                  className="text-[13px] font-medium text-red-600 py-2 px-3 cursor-pointer hover:bg-red-50 rounded-lg flex items-center gap-2"
                >
                  <UserX className="size-4 text-red-600" />
                  <span>Suspend Ambassador</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* 2. Four Mini Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-6">
        {miniStats.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-[#EAECF0] bg-white p-4.5 shadow-2xs"
          >
            <span className="text-[12px] md:text-[13px] text-[#667085] block truncate">
              {item.label}
            </span>
            <p className="font-general-sans text-[#101828] text-[22px] md:text-[24px] font-bold mt-2">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* 3. Current Campaign (Left) & Referral Link (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end mb-8">
        {/* Left: Current Campaign */}
        <div className="lg:col-span-5 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-medium text-[#344054]">
              Current Campaign
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#ECFDF3] text-[#027A48]">
              Active
            </span>
          </div>

          <div className="rounded-2xl border border-pink-100/70 bg-[#FDF2FA]/40 p-3 space-y-3">
            <div className="rounded-xl bg-white p-3.5 border border-[#F2F4F7] shadow-2xs flex items-center gap-3">
              <div className="relative size-11 rounded-lg overflow-hidden shrink-0 bg-amber-50">
                <Image
                  src="/campaign-megaphone.jpg"
                  alt="Campaign"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-[13px] font-semibold text-[#101828] truncate">
                    {campaignName}
                  </h4>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#FDF2FA] text-[#C11574] shrink-0">
                    {campaignType}
                  </span>
                </div>
                <p className="text-[11px] text-[#667085] mt-1">
                  Active Campaign
                </p>
              </div>
            </div>

            <Link
              href="/campaigns"
              className="w-full inline-flex items-center justify-center py-2.5 px-4 rounded-full bg-[#BB1A8C] hover:bg-[#A01677] text-white text-[13px] font-medium shadow-2xs transition-colors cursor-pointer"
            >
              View Campaigns
            </Link>
          </div>
        </div>

        {/* Right: Referral Link */}
        <div className="lg:col-span-7 space-y-2">
          <span className="block text-[13px] font-medium text-[#344054]">
            Referral Link
          </span>

          <div className="flex items-center justify-between rounded-xl border border-[#D0D5DD] bg-white p-1.5 focus-within:border-[#BB1A8C] focus-within:ring-1 focus-within:ring-[#BB1A8C] transition-all">
            <span className="text-[13px] text-[#475467] font-mono pl-3 truncate select-all">
              {referralLink}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="p-2 rounded-lg bg-[#FDF2FA] text-[#BB1A8C] hover:bg-[#FCE7F6] transition-colors cursor-pointer shrink-0"
              title="Copy Referral Link"
            >
              {copied ? (
                <Check className="size-4 text-[#027A48]" />
              ) : (
                <Copy className="size-4 text-[#BB1A8C]" />
              )}
            </button>
          </div>

          <p className="text-[12px] text-[#667085] leading-relaxed">
            Ambassador shares this link with people introduced to Obrin Health
          </p>
        </div>
      </div>

      {/* 4. Tab Navigation */}
      <div className="flex items-center gap-8 border-b border-[#EAECF0] -mb-6 md:-mb-8">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => onTabChange(tab)}
              className={`pb-3 text-[14px] font-medium transition-colors relative cursor-pointer ${
                isActive
                  ? "text-[#101828] font-semibold"
                  : "text-[#667085] hover:text-[#101828]"
              }`}
            >
              {tab}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#BB1A8C] rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AmbassadorHeaderCard;
