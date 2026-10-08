"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

interface ReferralUserCardProps {
  userId?: string;
  name?: string;
  location?: string;
  rating?: string;
  joinedDate?: string;
  lastActiveDate?: string;
  avatarUrl?: string;
}

export const ReferralUserCard: React.FC<ReferralUserCardProps> = ({
  userId = "USR-1075",
  name = "Jane Doe",
  location = "Chelsea, London",
  rating = "5.0",
  joinedDate = "Oct 2, 2026",
  lastActiveDate = "Oct 2, 2026, 10:00AM",
  avatarUrl = "/jane-doe-avatar.jpg",
}) => {
  return (
    <div className="w-full rounded-2xl border border-[#EAECF0] bg-white p-6 shadow-xs flex flex-col justify-between">
      <div>
        {/* Title */}
        <h3 className="text-[18px] font-bold text-[#101828] mb-4">
          User
        </h3>

        {/* Profile Header Box */}
        <div className="flex items-center justify-between p-3.5 rounded-xl border border-[#EAECF0] bg-[#FAFAFC]/60 mb-6">
          <div className="flex items-center gap-3">
            <div className="relative size-12 rounded-full overflow-hidden border border-gray-200 bg-gray-100 shrink-0">
              <Image
                src={avatarUrl}
                alt={name}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div>
              <h4 className="text-[14px] font-bold text-[#101828]">
                {name}
              </h4>
              <p className="text-[12px] text-[#0086C9] font-medium">
                {location}
              </p>
              <div className="flex items-center gap-1 text-[12px] text-[#344054] mt-0.5">
                <Star className="size-3.5 fill-[#F79009] text-[#F79009]" />
                <span className="font-semibold text-[11px]">{rating}</span>
              </div>
            </div>
          </div>

          <Link
            href="/users/1"
            className="text-[13px] font-semibold text-[#BB1A8C] hover:text-[#9B1373] hover:underline transition-colors shrink-0"
          >
            View user
          </Link>
        </div>

        {/* Key-Value Details */}
        <div className="space-y-4 text-[13px]">
          <div className="flex items-center justify-between">
            <span className="text-[#475467]">User ID</span>
            <span className="font-medium text-[#101828] font-mono">{userId}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#475467]">Joined Date</span>
            <span className="font-medium text-[#101828]">{joinedDate}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#475467]">Last Active Date</span>
            <span className="font-medium text-[#101828]">{lastActiveDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralUserCard;
