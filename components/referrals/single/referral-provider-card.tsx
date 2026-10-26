"use client";

import React from "react";
import Link from "next/link";

interface ReferralProviderCardProps {
  providerId?: string;
  name?: string;
  location?: string;
  initials?: string;
  onboardingDate?: string;
}

export const ReferralProviderCard: React.FC<ReferralProviderCardProps> = ({
  providerId = "-",
  name = "Provider",
  location = "-",
  initials = "P",
  onboardingDate = "-",
}) => {
  return (
    <div className="w-full rounded-2xl border border-[#EAECF0] bg-white p-6 shadow-xs flex flex-col justify-between">
      <div>
        {/* Title */}
        <h3 className="text-[18px] font-bold text-[#101828] mb-4">
          Provider
        </h3>

        {/* Profile Header Box */}
        <div className="flex items-center justify-between p-3.5 rounded-xl border border-[#EAECF0] bg-[#FAFAFC]/60 mb-6">
          <div className="flex items-center gap-3">
            <div className="size-12 rounded-full bg-[#BB1A8C] flex items-center justify-center text-white text-[15px] font-bold shrink-0 shadow-xs">
              {initials}
            </div>
            <div>
              <h4 className="text-[14px] font-bold text-[#101828]">
                {name}
              </h4>
              <p className="text-[12px] text-[#C11574] font-medium">
                {location}
              </p>
            </div>
          </div>

          {providerId && providerId !== "-" && (
            <Link
              href={`/provider/${providerId}`}
              className="text-[13px] font-semibold text-[#BB1A8C] hover:text-[#9B1373] hover:underline transition-colors shrink-0"
            >
              View provider
            </Link>
          )}
        </div>

        {/* Key-Value Details */}
        <div className="space-y-4 text-[13px]">
          <div className="flex items-center justify-between">
            <span className="text-[#475467]">Provider ID</span>
            <span className="font-medium text-[#101828] font-mono">{providerId}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#475467]">Location</span>
            <span className="font-medium text-[#101828]">{location}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#475467]">Onboarding Date</span>
            <span className="font-medium text-[#101828]">{onboardingDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralProviderCard;
