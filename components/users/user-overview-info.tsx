"use client";

import React from "react";
import type { UserDetail } from "@/types/users";

interface UserOverviewInfoProps {
  user?: UserDetail;
  isLoading?: boolean;
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "long",
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

export const UserOverviewInfo: React.FC<UserOverviewInfoProps> = ({
  user,
  isLoading,
}) => {
  const locationString = user?.location?.city
    ? `${user.location.city}${user.location.state ? `, ${user.location.state}` : ""}`
    : user?.location?.state || "Not provided";

  const sourceString =
    user?.source === "WHATSAPP"
      ? "Direct Whatsapp"
      : user?.source === "AMBASSADOR"
      ? `Ambassador${user.ambassador?.fullName ? ` (${user.ambassador.fullName})` : ""}`
      : user?.source === "CAMPAIGN"
      ? `Campaign${user.campaign?.name ? ` (${user.campaign.name})` : ""}`
      : user?.source || "—";

  const infoFields = [
    { label: "User ID :", value: user?.reference || user?.id || "—" },
    { label: "Phone Number:", value: user?.whatsappId || "—" },
    { label: "Location:", value: locationString },
    {
      label: "Verification Status:",
      value: user?.verification === "VERIFIED" ? "Verified" : "Not Verified",
      isBadge: true,
      isVerified: user?.verification === "VERIFIED",
    },
    {
      label: "First Interaction",
      value: formatDate(user?.firstInteractionAt || user?.joinedAt),
    },
    {
      label: "Last Active Date",
      value: formatDate(user?.lastActiveAt || user?.stats?.lastActiveAt),
    },
    {
      label: "Conversations:",
      value: `${(user?.conversations ?? 0).toLocaleString()} total`,
    },
    {
      label: "Messages",
      value: `${(user?.messagesSent ?? 0).toLocaleString()} total`,
    },
    { label: "Source:", value: sourceString },
  ];

  return (
    <div className="w-full rounded-2xl border border-[#EAECF0] bg-white p-6 sm:p-7 shadow-xs">
      <div className="space-y-4">
        {infoFields.map((field) => (
          <div
            key={field.label}
            className="flex flex-col sm:flex-row sm:items-center justify-between py-1 border-b border-[#F2F4F7] last:border-none"
          >
            <span className="text-[13px] sm:text-[14px] text-[#667085] sm:w-48 shrink-0">
              {field.label}
            </span>

            {isLoading ? (
              <div className="h-4 w-36 bg-gray-100 rounded animate-pulse mt-0.5 sm:mt-0" />
            ) : field.isBadge ? (
              <span
                className={`inline-flex items-center text-[13px] font-semibold ${
                  field.isVerified ? "text-[#027A48]" : "text-[#B54708]"
                }`}
              >
                {field.value}
              </span>
            ) : (
              <span className="text-[13px] sm:text-[14px] font-semibold text-[#101828] mt-0.5 sm:mt-0 text-left sm:text-right flex-1 truncate">
                {field.value}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserOverviewInfo;
