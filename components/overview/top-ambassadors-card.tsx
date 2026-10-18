"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Users } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useTopAmbassadors } from "@/hooks/use-overview";
import type { TopAmbassadorPeriod } from "@/types/overview";

interface PeriodOption {
  label: string;
  value: TopAmbassadorPeriod;
}

const periodOptions: PeriodOption[] = [
  { label: "Past 7 days", value: "7d" },
  { label: "Past 30 days", value: "30d" },
  { label: "Past 90 days", value: "90d" },
  { label: "All time", value: "all" },
];

export const TopAmbassadorsCard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] =
    useState<TopAmbassadorPeriod>("7d");

  const { data: ambassadors = [], isLoading } =
    useTopAmbassadors(selectedPeriod);

  const activeLabel =
    periodOptions.find((opt) => opt.value === selectedPeriod)?.label ||
    "Past 7 days";

  return (
    <div className="w-full rounded-2xl border border-[#EAECF0] bg-white p-5 sm:p-6 shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-5 border-b border-[#F2F4F7]">
        <div>
          <h3 className="text-[17px] font-semibold text-[#101828]">
            Top Ambassadors
          </h3>
          <p className="text-[12px] text-[#667085] mt-1">
            This is based on the number of users accumulated via campaigns.
          </p>
        </div>

        {/* Time Filter Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-[#344054] bg-white border border-[#D0D5DD] rounded-lg hover:bg-gray-50 transition-colors shadow-2xs self-start shrink-0 cursor-pointer">
            <span>{activeLabel}</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#667085]" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {periodOptions.map((opt) => (
              <DropdownMenuItem
                key={opt.value}
                onClick={() => setSelectedPeriod(opt.value)}
                className="text-[13px] cursor-pointer"
              >
                {opt.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Ambassador List / States */}
      <div className="divide-y divide-[#F2F4F7] flex-1">
        {isLoading ? (
          // Skeleton loading state
          <div className="py-2 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="py-3 flex items-center justify-between gap-3 animate-pulse"
              >
                <div className="flex items-center gap-3">
                  <div className="size-6 rounded-full bg-gray-100" />
                  <div className="size-10 rounded-full bg-gray-100" />
                  <div className="space-y-1.5">
                    <div className="h-3.5 w-28 bg-gray-100 rounded" />
                    <div className="h-2.5 w-36 bg-gray-100 rounded" />
                  </div>
                </div>
                <div className="h-6 w-16 bg-gray-100 rounded" />
              </div>
            ))}
          </div>
        ) : ambassadors.length === 0 ? (
          // Empty state
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="size-12 rounded-full bg-[#F9FAFB] border border-[#EAECF0] flex items-center justify-center text-[#98A2B3] mb-3">
              <Users className="size-5 text-[#98A2B3]" />
            </div>
            <p className="text-[14px] font-medium text-[#101828]">
              No ambassadors recorded
            </p>
            <p className="text-[12px] text-[#667085] mt-1 max-w-[260px]">
              Top performing ambassadors for {activeLabel.toLowerCase()} will
              appear here once referrals are tracked.
            </p>
          </div>
        ) : (
          ambassadors.map((ambassador, idx) => {
            const rank = ambassador.rank ?? idx + 1;
            const name =
              ambassador.fullName || ambassador.name || "Ambassador";
            const emailOrPhone = String(
              ambassador.email ||
              ambassador.phoneNumber ||
              ambassador.code ||
              ""
            );
            const avatarUrl =
              ambassador.photoUrl ||
              ambassador.avatarUrl ||
              ambassador.avatar;
            const count =
              ambassador.usersIntroduced ??
              ambassador.totalUsersIntroduced ??
              ambassador.referralsCount ??
              0;
            const initial = name.charAt(0).toUpperCase() || "A";

            return (
              <div
                key={ambassador.id || idx}
                className="py-3.5 first:pt-4 last:pb-0 flex items-center justify-between gap-3 hover:bg-[#FAFAFC] -mx-2 px-2 rounded-lg transition-colors"
              >
                {/* Rank badge + Avatar + Name/Email */}
                <div className="flex items-center gap-3 min-w-0">
                  <span className="size-6 rounded-full bg-[#BB1A8C] text-white text-[11px] font-semibold flex items-center justify-center shrink-0 shadow-2xs">
                    {rank}
                  </span>

                  <div className="size-10 rounded-full overflow-hidden shrink-0 ring-2 ring-[#F2F4F7] bg-gray-100 flex items-center justify-center">
                    {avatarUrl ? (
                      <Image
                        src={avatarUrl}
                        alt={name}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-[13px] font-semibold text-[#667085]">
                        {initial}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-[#101828] truncate leading-tight">
                      {name}
                    </p>
                    <p className="text-[11px] text-[#667085] truncate leading-tight mt-0.5">
                      {emailOrPhone}
                    </p>
                  </div>
                </div>

                {/* Total Users Introduced & View Profile */}
                <div className="flex items-center gap-4 sm:gap-6 shrink-0 text-right">
                  <div>
                    <span className="block text-[11px] text-[#667085] leading-none mb-1">
                      Total User Introduced
                    </span>
                    <span className="font-general-sans text-[15px] sm:text-[16px] font-bold text-[#101828] leading-none">
                      {count}
                    </span>
                  </div>

                  <Link
                    href={`/ambassadors/${ambassador.id}`}
                    className="text-[12px] font-semibold text-[#BB1A8C] hover:text-[#9B1373] hover:underline transition-colors shrink-0"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TopAmbassadorsCard;
